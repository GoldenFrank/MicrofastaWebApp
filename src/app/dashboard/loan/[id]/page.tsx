
import LoanDetailClientPage from '@/components/loan/LoanDetailClientPage';
import { mockLoanDetails } from '@/data/mockLoanDetails';

// generateStaticParams should be synchronous if its data source is static.
// It tells Next.js which 'id' values to pre-render.
export function generateStaticParams(): { id: string }[] {
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

// The Page component receives params from generateStaticParams.
// For a route like /dashboard/loan/[id], params will be { id: "someValue" }
export default function Page({ params }: { params: { id: string } }) {
  // The params.id comes from the dynamic segment [id] in the route.
  // This ID is then passed to the client component.
  return <LoanDetailClientPage loanIdFromParams={params.id} />;
}
