
import LoanDetailClientPage from '@/components/loan/LoanDetailClientPage';
import { mockLoanDetails } from '@/data/mockLoanDetails';

// Define an interface for the page's props, specifically the params
interface LoanDetailPageProps {
  params: { id: string };
}

// generateStaticParams tells Next.js which 'id' values to pre-render.
// It is synchronous for static mock data.
export function generateStaticParams(): { id: string }[] {
  if (!mockLoanDetails || Object.keys(mockLoanDetails).length === 0) {
    console.warn("generateStaticParams: mockLoanDetails is empty or undefined. No loan detail pages will be pre-rendered.");
    return [];
  }
  const loanIds = Object.keys(mockLoanDetails);
  return loanIds.map((id) => ({
    id: id,
  }));
}

// The Page component receives resolved params.
// Making it async to try and satisfy the PageProps constraint from the error.
export default async function Page({ params }: LoanDetailPageProps) {
  // The params.id comes from the dynamic segment [id] in the route.
  // This ID is then passed to the client component.
  return <LoanDetailClientPage loanIdFromParams={params.id} />;
}
