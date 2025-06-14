
import LoanDetailClientPage from '@/components/loan/LoanDetailClientPage';

// Define props for the page component
interface LoanDetailPageProps {
  params: { id: string };
  // searchParams could also be added here if needed: searchParams: { [key: string]: string | string[] | undefined };
}

// This page will be server-rendered or client-navigated.
// generateStaticParams is not needed when not using output: 'export'.
export default function Page({ params }: LoanDetailPageProps) {
  return <LoanDetailClientPage loanIdFromParams={params.id} />;
}
