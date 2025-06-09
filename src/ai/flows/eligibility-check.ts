
'use server';
/**
 * @fileOverview Analyzes loan applicant details to determine loan eligibility and an estimated eligible amount.
 *
 * - checkLoanEligibility - A function that performs the eligibility check.
 * - EligibilityCheckInput - The input type for the checkLoanEligibility function.
 * - EligibilityCheckOutput - The return type for the checkLoanEligibility function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const EligibilityCheckInputSchema = z.object({
  logbookDetails: z
    .string()
    .describe('Detailed description of the vehicle logbook (e.g., "Toyota Axio KDA 123X, 2015, Chassis XXX, Engine YYY").'),
  requestedLoanAmount: z.number().describe('The loan amount requested by the applicant.'),
  monthlyIncome: z.number().describe('The declared monthly income of the applicant.'),
  mpesaStatementProvided: z.boolean().describe('Whether the applicant has provided a 12-month Mpesa statement. Its presence is a positive indicator of income verification capability.'),
});
export type EligibilityCheckInput = z.infer<typeof EligibilityCheckInputSchema>;

export const EligibilityCheckOutputSchema = z.object({
  isEligible: z.boolean().describe('Whether the applicant is deemed eligible for a loan based on the inputs.'),
  eligibleAmount: z.number().describe('The estimated loan amount the applicant is eligible for. Could be 0 if not eligible or if criteria are not met.'),
  feedback: z.string().describe('Feedback explaining the eligibility decision, factors considered (like vehicle age from logbook details, income to loan ratio), and any advice.'),
  missingInfo: z.array(z.string()).optional().describe('List of any critical information that seems to be missing or unclear from the logbook details that would affect valuation (e.g., "Vehicle year of manufacture not clear").')
});
export type EligibilityCheckOutput = z.infer<typeof EligibilityCheckOutputSchema>;

export async function checkLoanEligibility(input: EligibilityCheckInput): Promise<EligibilityCheckOutput> {
  return checkLoanEligibilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'eligibilityCheckPrompt',
  input: {
    schema: EligibilityCheckInputSchema,
  },
  output: {
    schema: EligibilityCheckOutputSchema,
  },
  prompt: `You are a loan eligibility assessment AI for logbook loans in Kenya.
Your task is to analyze the provided applicant details and determine if they are eligible for a loan, the estimated amount they might be eligible for, and provide feedback.

Consider these factors:
1.  **Logbook Details**: Infer the vehicle's make, model, and critically, the Year of Manufacture from the 'logbookDetails' string. A newer car generally qualifies for a higher amount. If the Year of Manufacture is unclear, note it in 'missingInfo'. Assume standard depreciation. Vehicles older than 10-12 years might have significantly reduced eligibility or value.
2.  **Requested Loan Amount**: Compare this with the estimated vehicle value (derived from logbook) and income.
3.  **Monthly Income**: A common rule of thumb is that total loan repayment installments should not exceed 30-50% of net monthly income. The loan term is implicitly tied to the loan amount and affordability.
4.  **Mpesa Statement Provided**: If true, this is a positive factor suggesting income can be verified, but do not assume the income is verified yet. It just means the document is available for later KYC.

Output:
- **isEligible**: True if you estimate they can get some loan amount, false otherwise.
- **eligibleAmount**: The maximum loan amount you estimate they could be eligible for. If not eligible, this should be 0. Round to the nearest KES 1000.
- **feedback**: Explain your reasoning. Mention the inferred vehicle age (if possible), how income relates to the requested amount, and the impact of the Mpesa statement provision.
- **missingInfo**: If critical details like vehicle year are missing from `logbookDetails` string, specify that here.

Applicant Details:
- Logbook Details: {{{logbookDetails}}}
- Requested Loan Amount: KES {{{requestedLoanAmount}}}
- Monthly Income: KES {{{monthlyIncome}}}
- Mpesa Statement Provided: {{{mpesaStatementProvided}}}

Provide your assessment in the specified JSON format. For example, if logbookDetails is "Mazda Demio 2010 KDB 456Y", the car is over 10 years old, which significantly impacts its value for a loan.
If the logbook details do not clearly state a year of manufacture or imply one, set eligibleAmount to 0, isEligible to false, add "Vehicle year of manufacture not clear" to missingInfo, and explain in feedback that this is critical.
`,
});

const checkLoanEligibilityFlow = ai.defineFlow(
  {
    name: 'checkLoanEligibilityFlow',
    inputSchema: EligibilityCheckInputSchema,
    outputSchema: EligibilityCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Ensure output is not null, which can happen if the model fails to respond correctly.
    if (!output) {
        throw new Error("AI model did not return an output for eligibility check.");
    }
    return output;
  }
);
