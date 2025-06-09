
'use client'; // This page uses client-side hooks (useState, useAuth)

import React, { useState, useEffect } from 'react';
import LoanApplicationForm from '@/components/loan/LoanApplicationForm';
import MfiComparisonTable from '@/components/loan/MfiComparisonTable';
import { type MfiMatchingInput, type MfiMatchingOutput } from '@/ai/flows/mfi-matching';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Loader2 } from "lucide-react";
import { submitLoanApplicationAction } from './actions'; // Import the server action

export default function ApplyPage() {
  const [mfiResults, setMfiResults] = useState<MfiMatchingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/apply');
    }
  }, [user, authLoading, router]);

  const handleFormSubmit = async (data: MfiMatchingInput) => {
    setIsLoading(true);
    setError(null);
    setMfiResults(null);

    const result = await submitLoanApplicationAction(data);

    if ('error' in result) {
      setError(result.error);
      toast({
        variant: "destructive",
        title: "Application Error",
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
          title: "No Exact Matches",
          description: "We couldn't find MFIs that perfectly match all your criteria. Please review the general options or adjust your application.",
        });
      }
    }
    setIsLoading(false);
  };

  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading application page...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <LoanApplicationForm onSubmit={handleFormSubmit} isSubmitting={isLoading} />
      {error && (
        <Alert variant="destructive" className="mt-6">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {isLoading && !mfiResults && (
         <div className="text-center py-10">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg text-foreground/80">Searching for the best MFIs for you...</p>
         </div>
      )}
      {mfiResults && <MfiComparisonTable mfiData={mfiResults} />}
    </div>
  );
}
