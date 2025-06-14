
'use server';

import { matchMfiInstitutions, type MfiMatchingInput, type MfiMatchingOutput } from '@/ai/flows/mfi-matching';
import { checkLoanEligibility, type EligibilityCheckInput, type EligibilityCheckOutput } from '@/ai/flows/eligibility-check';

// Renamed from submitLoanApplicationAction for clarity
export async function findMatchingMfisAction(data: MfiMatchingInput): Promise<MfiMatchingOutput | { error: string }> {
  try {
    // Ensure creditScore is provided, defaulting to 0 if not present
    const inputWithDefaultCreditScore = {
      ...data,
      creditScore: data.creditScore ?? 0,
    };
    const result = await matchMfiInstitutions(inputWithDefaultCreditScore);
    return result;
  } catch (error) {
    console.error("Error in AI MFI matching flow:", error);
    return { error: (error instanceof Error ? error.message : "An unknown error occurred during MFI matching.") };
  }
}

export async function checkLoanEligibilityAction(data: EligibilityCheckInput): Promise<EligibilityCheckOutput | { error: string }> {
  try {
    const result = await checkLoanEligibility(data);
    return result;
  } catch (error) {
    console.error("Error in AI eligibility check flow:", error);
    return { error: (error instanceof Error ? error.message : "An unknown error occurred during eligibility check.") };
  }
}
