
import LoanDetailClientPage from '@/components/loan/LoanDetailClientPage';
import { mockLoanDetails } from '@/data/mockLoanDetails'; // Used by generateStaticParams

// Function to generate static paths for Next.js export
export async function generateStaticParams(): Promise<{ id: string }[]> {
  // Ensure mockLoanDetails is correctly typed or handled if it could be undefined/empty
  if (!mockLoanDetails || Object.keys(mockLoanDetails).length === 0) {
    console.warn("generateStaticParams: mockLoanDetails is empty or undefined. No loan detail pages will be pre-rendered.");
    return [];
  }
  const loanIds = Object.keys(mockLoanDetails);
  return loanIds.map((id) => ({
    id: id,
  }));
}

// Removed async from the component signature
export default function LoanDetailPageServerWrapper({ params }: { params: { id: string } }) {
  // The params.id comes from the dynamic segment [id] in the route
  // This ID is then passed to the client component
  return <LoanDetailClientPage loanIdFromParams={params.id} />;
}
