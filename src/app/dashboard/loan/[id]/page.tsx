
import LoanDetailClientPage from '@/components/loan/LoanDetailClientPage';
import { mockLoanDetails } from '@/data/mockLoanDetails';

// Define an interface for the page's props, specifically the params
interface LoanDetailPageProps {
  params: { id: string };
}

// generateStaticParams tells Next.js which 'id' values to pre-render.
// It can be async if fetching data, but for static mock data, sync is also fine.
// Let's ensure it's typed to return a Promise as is common.
export async function generateStaticParams(): Promise<{ id: string }[]> {
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
// It should be synchronous if not doing async work itself.
export default function Page({ params }: LoanDetailPageProps) {
  // The params.id comes from the dynamic segment [id] in the route.
  // This ID is then passed to the client component.
  return <LoanDetailClientPage loanIdFromParams={params.id} />;
}
