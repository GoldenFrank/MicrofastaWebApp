
import LoanDetailClientPage from '@/components/loan/LoanDetailClientPage';
import { mockLoanDetails } from '@/data/mockLoanDetails'; // Used by generateStaticParams

// Function to generate static paths for Next.js export
export async function generateStaticParams() {
  // Ensure mockLoanDetails is correctly typed or handled if it could be undefined/empty
  if (!mockLoanDetails || Object.keys(mockLoanDetails).length === 0) {
    // Return an empty array or a default path if no loans exist
    // This prevents build errors if mockLoanDetails is empty
    // For example, return [{ id: 'no-loans-available' }]; and handle this case in the page
    // Or, if it's guaranteed to have loans, this check might be less critical
    // but good for robustness.
    console.warn("generateStaticParams: mockLoanDetails is empty or undefined. No loan detail pages will be pre-rendered.");
    return [];
  }
  const loanIds = Object.keys(mockLoanDetails);
  return loanIds.map((id) => ({
    id: id,
  }));
}

export default function LoanDetailPageServerWrapper({ params }: { params: { id: string } }) {
  // The params.id comes from the dynamic segment [id] in the route
  // This ID is then passed to the client component
  return <LoanDetailClientPage loanIdFromParams={params.id} />;
}
