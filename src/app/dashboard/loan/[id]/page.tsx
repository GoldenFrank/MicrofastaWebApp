
import LoanDetailClientPage from '@/components/loan/LoanDetailClientPage';
import { mockLoanDetails } from '@/data/mockLoanDetails'; // Used by generateStaticParams

// Make generateStaticParams async again and ensure its return type is a Promise.
// Next.js often expects this pattern for pages that use generateStaticParams.
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

// Explicitly define the props type for the page component.
interface LoanDetailPageServerWrapperProps {
  params: { id: string };
  // searchParams?: { [key: string]: string | string[] | undefined }; // Not used here, but often part of PageProps
}

// The page component itself should NOT be async unless it directly uses await.
export default function LoanDetailPageServerWrapper({ params }: LoanDetailPageServerWrapperProps) {
  // The params.id comes from the dynamic segment [id] in the route
  // This ID is then passed to the client component
  return <LoanDetailClientPage loanIdFromParams={params.id} />;
}
