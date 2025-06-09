
'use client';

import React, { useState, useEffect } from 'react';
import LoanApplicationForm, { type LoanApplicationFormValues } from '@/components/loan/LoanApplicationForm';
import MfiComparisonTable from '@/components/loan/MfiComparisonTable';
import { type MfiMatchingInput, type MfiMatchingOutput } from '@/ai/flows/mfi-matching';
import { type EligibilityCheckInput, type EligibilityCheckOutput } from '@/ai/flows/eligibility-check';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal, Loader2, CheckCircle, XCircle, Info, ThumbsUp, Search } from "lucide-react";
import { submitLoanApplicationAction, checkLoanEligibilityAction } from './actions';

export default function ApplyPage() {
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityCheckOutput | null>(null);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [originalFormInputForMfi, setOriginalFormInputForMfi] = useState<MfiMatchingInput | null>(null);
  
  const [mfiResults, setMfiResults] = useState<MfiMatchingOutput | null>(null);
  const [isSearchingMfis, setIsSearchingMfis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/apply');
    }
  }, [user, authLoading, router]);

  const handleEligibilitySubmit = async (data: LoanApplicationFormValues) => {
    setIsCheckingEligibility(true);
    setError(null);
    setEligibilityResult(null);
    setMfiResults(null);
    setOriginalFormInputForMfi(null);

    const eligibilityAIInput: EligibilityCheckInput = {
      logbookDetails: data.logbookDetails,
      requestedLoanAmount: data.loanAmount,
      monthlyIncome: data.monthlyIncome,
      mpesaStatementProvided: data.mpesaStatement && data.mpesaStatement.length > 0,
    };

    const result = await checkLoanEligibilityAction(eligibilityAIInput);

    if ('error' in result) {
      setError(result.error);
      toast({
        variant: "destructive",
        title: "Eligibility Check Error",
        description: result.error,
      });
    } else {
      setEligibilityResult(result);
      if (result.isEligible && result.eligibleAmount > 0) {
        toast({
          title: "Eligibility Checked!",
          description: `You are eligible for approximately KES ${result.eligibleAmount.toLocaleString()}.`,
        });
        // Store all necessary data for MFI matching
        const mfiMatchingData: MfiMatchingInput = {
          logbookDetails: data.logbookDetails,
          nationalId: data.nationalId,
          loanAmount: data.loanAmount, // Use originally requested amount for matching
          creditScore: data.creditScore ?? 0,
          employmentStatus: data.employmentStatus,
          location: data.location,
        };
        setOriginalFormInputForMfi(mfiMatchingData);
      } else {
        toast({
          variant: "default",
          title: "Eligibility Status",
          description: result.feedback || "Could not determine full eligibility with provided details.",
        });
      }
    }
    setIsCheckingEligibility(false);
  };

  const handleMfiSearch = async () => {
    if (!originalFormInputForMfi) {
      setError("Cannot search MFIs without prior eligibility check details.");
      toast({ variant: "destructive", title: "Error", description: "Please complete the eligibility check first."});
      return;
    }
    setIsSearchingMfis(true);
    setError(null);
    setMfiResults(null);

    const result = await submitLoanApplicationAction(originalFormInputForMfi);

    if ('error' in result) {
      setError(result.error);
      toast({
        variant: "destructive",
        title: "MFI Search Error",
        description: result.error,
      });
    } else {
      setMfiResults(result);
      if (result.length > 0) {
        toast({
          title: "MFIs Found!",
          description: "We've found suitable Microfinance Institutions for you.",
        });
      } else {
         toast({
          variant: "default",
          title: "No MFI Matches",
          description: "We couldn't find MFIs that perfectly match all your criteria based on the initial details. You can review the general options or adjust your application.",
        });
      }
    }
    setIsSearchingMfis(false);
  };


  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading application page...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {!eligibilityResult && (
        <LoanApplicationForm 
          onSubmit={handleEligibilitySubmit} 
          isSubmitting={isCheckingEligibility}
          submitButtonText="Check Eligibility"
        />
      )}

      {isCheckingEligibility && (
         <div className="text-center py-10">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg text-foreground/80">Checking your eligibility...</p>
         </div>
      )}

      {error && !isCheckingEligibility && !isSearchingMfis && (
        <Alert variant="destructive" className="mt-6">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {eligibilityResult && !isCheckingEligibility && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-teal-700 flex items-center">
              {eligibilityResult.isEligible && eligibilityResult.eligibleAmount > 0 ? 
                <CheckCircle className="mr-2 h-7 w-7 text-green-500" /> : 
                <XCircle className="mr-2 h-7 w-7 text-red-500" />
              }
              Eligibility Assessment Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {eligibilityResult.isEligible && eligibilityResult.eligibleAmount > 0 ? (
              <>
                <p className="text-lg">
                  Congratulations! You are preliminarily eligible for a loan of approximately: <strong className="text-green-600 text-xl">KES {eligibilityResult.eligibleAmount.toLocaleString()}</strong>
                </p>
                 <Alert variant="default" className="border-green-500 bg-green-50/50">
                    <ThumbsUp className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-700">Positive Indication!</AlertTitle>
                    <AlertDescription className="text-green-600">
                      {eligibilityResult.feedback}
                    </AlertDescription>
                  </Alert>
              </>
            ) : (
               <Alert variant="destructive">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Regarding Your Eligibility</AlertTitle>
                  <AlertDescription>
                    {eligibilityResult.feedback || "Based on the details provided, we couldn't confirm eligibility for the requested amount at this time."}
                    {eligibilityResult.missingInfo && eligibilityResult.missingInfo.length > 0 && (
                      <div className="mt-2">
                        <strong>Missing information that affected assessment:</strong>
                        <ul className="list-disc list-inside text-sm">
                          {eligibilityResult.missingInfo.map((info, idx) => <li key={idx}>{info}</li>)}
                        </ul>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
            )}
            {eligibilityResult.isEligible && eligibilityResult.eligibleAmount > 0 && originalFormInputForMfi && !mfiResults && (
              <Button onClick={handleMfiSearch} disabled={isSearchingMfis} className="w-full mt-4 bg-accent hover:bg-accent/90">
                {isSearchingMfis ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Searching for MFIs...</>
                ) : (
                  <><Search className="mr-2 h-4 w-4" />Proceed to Find Matching MFIs</>
                )}
              </Button>
            )}
             <Button variant="outline" onClick={() => { setEligibilityResult(null); setError(null); setMfiResults(null); setOriginalFormInputForMfi(null); }} className="w-full mt-2">
                Start Over / Modify Application
            </Button>
          </CardContent>
        </Card>
      )}
      
      {isSearchingMfis && (
         <div className="text-center py-10">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg text-foreground/80">Searching for the best MFIs for you...</p>
         </div>
      )}

      {mfiResults && <MfiComparisonTable mfiData={mfiResults} />}
    </div>
  );
}
