
'use server';

import { matchMfiInstitutions, type MfiMatchingInput, type MfiMatchingOutput } from '@/ai/flows/mfi-matching';

export async function submitLoanApplicationAction(data: MfiMatchingInput): Promise<MfiMatchingOutput | { error: string }> {
  try {
    // console.log("Submitting to AI with data:", data); // Log input for debugging
    const result = await matchMfiInstitutions(data);
    // console.log("AI Result:", result); // Log output for debugging
    return result;
  } catch (error) {
    console.error("Error in AI matching flow:", error);
    return { error: (error instanceof Error ? error.message : "An unknown error occurred during MFI matching.") };
  }
}
