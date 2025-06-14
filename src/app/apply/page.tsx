
'use client';

import React, { useState, useEffect } from 'react';
import LoanApplicationForm, { type LoanApplicationFormValues } from '@/components/loan/LoanApplicationForm';
import MfiComparisonTable from '@/components/loan/MfiComparisonTable';
import { type MfiMatchingInput, type MfiMatchingOutput } from '@/ai/flows/mfi-matching';
import { type EligibilityCheckOutput } from '@/ai/flows/eligibility-check'; // Keep type for state if needed
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal, Loader2, CheckCircle, XCircle, Info, ThumbsUp, Search, ServerCrash } from "lucide-react";
// Removed: import { submitLoanApplicationAction, checkLoanEligibilityAction } from './actions';

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
    clearSessionStorageState();

    const featureUnavailableError = "AI-powered eligibility check is not available in this static version of the app as Server Actions are not supported with static export.";
    setError(featureUnavailableError);
    toast({
      variant: "destructive",
      title: "Feature Unavailable",
      description: featureUnavailableError,
      duration: 7000,
      icon: <ServerCrash className="h-5 w-5" />,
    });
    
    // Simulate a non-eligible or default state to allow UI to progress if needed for other parts
    const simulatedResult: EligibilityCheckOutput = {
      isEligible: false,
      eligibleAmount: 0,
      feedback: "Eligibility check feature is currently disabled for static export.",
      missingInfo: []
    };
    setEligibilityResult(simulatedResult);
    persistStateToSessionStorage({ eligibility: simulatedResult });

    // Still save original form input for MFI matching if it were to proceed (though it also won't)
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

    setIsCheckingEligibility(false);
  };

  const handleMfiSearch = async () => {
    setIsSearchingMfis(true);
    setError(null);
    setMfiResults(null);

    const featureUnavailableError = "AI-powered MFI matching is not available in this static version of the app as Server Actions are not supported with static export.";
    setError(featureUnavailableError);
    toast({
      variant: "destructive",
      title: "Feature Unavailable",
      description: featureUnavailableError,
      duration: 7000,
      icon: <ServerCrash className="h-5 w-5" />,
    });

    setMfiResults([]); // Set to empty array to show "No MFI Matches" or similar in the table
    persistStateToSessionStorage({ mfis: [] });
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

  if (!eligibilityResult && !mfiResults) {
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
          <ServerCrash className="h-4 w-4" />
          <AlertTitle>Feature Unavailable</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
            {/* Display feedback based on eligibilityResult, which will now be the simulated one if server actions are off */}
            <Alert variant={eligibilityResult.isEligible && eligibilityResult.eligibleAmount > 0 ? "default" : "destructive"}
                   className={eligibilityResult.isEligible && eligibilityResult.eligibleAmount > 0 ? "border-green-500 bg-green-50/50" : ""}>
                {eligibilityResult.isEligible && eligibilityResult.eligibleAmount > 0 ? <ThumbsUp className="h-4 w-4 text-green-600" /> : <Info className="h-4 w-4" />}
                <AlertTitle className={eligibilityResult.isEligible && eligibilityResult.eligibleAmount > 0 ? "text-green-700" : ""}>
                    {eligibilityResult.isEligible && eligibilityResult.eligibleAmount > 0 ? "Positive Indication (Simulated)" : "Regarding Your Eligibility"}
                </AlertTitle>
                <AlertDescription className={eligibilityResult.isEligible && eligibilityResult.eligibleAmount > 0 ? "text-green-600" : ""}>
                {eligibilityResult.feedback || "Could not determine full eligibility with provided details."}
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

            {originalFormInputForMfi && !mfiResults && ( // Button to search MFIs, will also show error
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
            <p className="mt-4 text-lg text-foreground/80">Searching for MFIs...</p>
         </div>
      )}
      
      {mfiResults && !isCheckingEligibility && (
        <>
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
                        {eligibilityResult.feedback || "Eligibility was not fully confirmed."}
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
