
// No generateStaticParams needed when not using output: 'export'
// Firebase App Hosting will handle dynamic rendering.

import LoanDetailClientPage from '@/components/loan/LoanDetailClientPage';

// Define an interface for the page's props, specifically the params
interface LoanDetailPageProps {
  params: { id: string };
  // searchParams could also be included if needed:
  // searchParams: { [key: string]: string | string[] | undefined };
}

// The Page component receives resolved params.
// It can be async if you need to fetch data directly on the server here.
// For this setup, we're passing the ID to a client component.
export default function Page({ params }: LoanDetailPageProps) {
  // The params.id comes from the dynamic segment [id] in the route.
  // This ID is then passed to the client component.
  return <LoanDetailClientPage loanIdFromParams={params.id} />;
}
