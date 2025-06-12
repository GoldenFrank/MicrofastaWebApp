
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

const SESSION_STORAGE_ELIGIBILITY_RESULT_KEY = 'eligibilityResult';
const SESSION_STORAGE_ORIGINAL_FORM_INPUT_KEY = 'originalFormInputForMfi';
const SESSION_STORAGE_MFI_RESULTS_KEY = 'mfiResults';

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

  useEffect(() => {
    // Load state from sessionStorage on mount
    if (typeof window !== 'undefined') {
      try {
        const storedEligibilityResult = sessionStorage.getItem(SESSION_STORAGE_ELIGIBILITY_RESULT_KEY);
        if (storedEligibilityResult) {
          setEligibilityResult(JSON.parse(storedEligibilityResult));
        }
        const storedOriginalFormInput = sessionStorage.getItem(SESSION_STORAGE_ORIGINAL_FORM_INPUT_KEY);
        if (storedOriginalFormInput) {
          setOriginalFormInputForMfi(JSON.parse(storedOriginalFormInput));
        }
        const storedMfiResults = sessionStorage.getItem(SESSION_STORAGE_MFI_RESULTS_KEY);
        if (storedMfiResults) {
          setMfiResults(JSON.parse(storedMfiResults));
        }
      } catch (e) {
        console.error("Error loading state from sessionStorage:", e);
        // Clear potentially corrupted keys
        sessionStorage.removeItem(SESSION_STORAGE_ELIGIBILITY_RESULT_KEY);
        sessionStorage.removeItem(SESSION_STORAGE_ORIGINAL_FORM_INPUT_KEY);
        sessionStorage.removeItem(SESSION_STORAGE_MFI_RESULTS_KEY);
      }
    }
  }, []);

  const persistStateToSessionStorage = (data: {
    eligibility?: EligibilityCheckOutput | null,
    formInput?: MfiMatchingInput | null,
    mfis?: MfiMatchingOutput | null
  }) => {
    if (typeof window !== 'undefined') {
      try {
        if (data.eligibility !== undefined) {
          sessionStorage.setItem(SESSION_STORAGE_ELIGIBILITY_RESULT_KEY, JSON.stringify(data.eligibility));
        }
        if (data.formInput !== undefined) {
          sessionStorage.setItem(SESSION_STORAGE_ORIGINAL_FORM_INPUT_KEY, JSON.stringify(data.formInput));
        }
        if (data.mfis !== undefined) {
          sessionStorage.setItem(SESSION_STORAGE_MFI_RESULTS_KEY, JSON.stringify(data.mfis));
        }
      } catch (e) {
        console.error("Error saving state to sessionStorage:", e);
      }
    }
  };

  const clearSessionStorageState = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SESSION_STORAGE_ELIGIBILITY_RESULT_KEY);
      sessionStorage.removeItem(SESSION_STORAGE_ORIGINAL_FORM_INPUT_KEY);
      sessionStorage.removeItem(SESSION_STORAGE_MFI_RESULTS_KEY);
    }
  };

  const handleEligibilitySubmit = async (data: LoanApplicationFormValues) => {
    setIsCheckingEligibility(true);
    setError(null);
    setEligibilityResult(null);
    setMfiResults(null);
    setOriginalFormInputForMfi(null);
    clearSessionStorageState(); // Clear previous state for a new submission

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
      persistStateToSessionStorage({ eligibility: result });
      if (result.isEligible && result.eligibleAmount > 0) {
        toast({
          title: "Eligibility Checked!",
          description: `You are eligible for approximately KES ${result.eligibleAmount.toLocaleString()}.`,
        });
        const mfiMatchingData: MfiMatchingInput = {
          logbookDetails: data.logbookDetails,
          nationalId: data.nationalId,
          loanAmount: data.loanAmount,
          employmentStatus: data.employmentStatus,
          location: data.location,
          creditScore: 0,
        };
        setOriginalFormInputForMfi(mfiMatchingData);
        persistStateToSessionStorage({ formInput: mfiMatchingData });
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
    setMfiResults(null); // Clear previous MFI results before new search

    const result = await submitLoanApplicationAction(originalFormInputForMfi);

    if ('error' in result) {
      setError(result.error);
      toast({
        variant: "destructive",
        title: "MFI Search Error",
        description: result.error,
      });
      persistStateToSessionStorage({ mfis: null }); // Persist the null/error state
    } else {
      setMfiResults(result);
      persistStateToSessionStorage({ mfis: result });
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

  const handleStartOver = () => {
    setEligibilityResult(null);
    setError(null);
    setMfiResults(null);
    setOriginalFormInputForMfi(null);
    clearSessionStorageState();
  };


  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading application page...</p>
      </div>
    );
  }

  // Main rendering logic
  if (!eligibilityResult && !mfiResults) { // Initial state or after "Start Over"
     return (
        <LoanApplicationForm 
          onSubmit={handleEligibilitySubmit} 
          isSubmitting={isCheckingEligibility}
          submitButtonText="Check Eligibility"
        />
     );
  }

  return (
    <div className="space-y-8">
      {/* Show form if no eligibility result AND no MFI results (handles initial load and start over) */}
      {!eligibilityResult && !mfiResults && (
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

      {/* Show eligibility card if result exists and not currently searching for MFIs */}
      {eligibilityResult && !isCheckingEligibility && !isSearchingMfis && !mfiResults && (
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
             <Button variant="outline" onClick={handleStartOver} className="w-full mt-2">
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
      
      {/* Show MFI table if results exist and not currently checking eligibility (which implies a reset) */}
      {mfiResults && !isCheckingEligibility && (
        <>
        {/* Optionally, reshow eligibility summary if needed, or a condensed version */}
        {eligibilityResult && (
             <Card className="shadow-md mb-6 bg-muted/50">
                <CardHeader className="pb-2">
                     <CardTitle className="text-xl font-headline text-teal-700 flex items-center">
                        {eligibilityResult.isEligible && eligibilityResult.eligibleAmount > 0 ? 
                            <CheckCircle className="mr-2 h-6 w-6 text-green-500" /> : 
                            <XCircle className="mr-2 h-6 w-6 text-red-500" />
                        }
                        Eligibility Summary
                     </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                    <p>
                        {eligibilityResult.isEligible && eligibilityResult.eligibleAmount > 0 
                        ? `Based on your input, you were found eligible for approx. KES ${eligibilityResult.eligibleAmount.toLocaleString()}.`
                        : eligibilityResult.feedback || "Eligibility was not fully confirmed."}
                    </p>
                    <Button variant="link" onClick={handleStartOver} className="p-0 h-auto text-accent mt-2">
                        Start Over / Modify Application
                    </Button>
                </CardContent>
             </Card>
        )}
        <MfiComparisonTable mfiData={mfiResults} />
        </>
      )}
    </div>
  );
}

