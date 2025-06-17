import React from 'react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ✅ Adjusted path: one level up from [id]
import LoanDetailClientPage from '../LoanDetailClientPage';

// ✅ Assuming alias @/lib/loans works via tsconfig.json
import { getLoanDetailsById } from '@/lib/loans';

type PageProps = {
  params: {
    id?: string;
  };
};

export default async function LoanDetailPage({ params }: PageProps) {
  const loanId = params.id;

  if (!loanId) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error: Missing Loan ID</AlertTitle>
          <AlertDescription>
            The loan ID was not provided in the URL.
            <Button asChild variant="link" className="p-0 h-auto ml-1">
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const loanDetails = await getLoanDetailsById(loanId);

  if (!loanDetails) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button asChild variant="outline" size="sm" className="mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Loan Application Not Found</AlertTitle>
          <AlertDescription>
            No loan application found with the ID: <strong>{loanId}</strong>.
            <Button asChild variant="link" className="p-0 h-auto ml-1">
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <LoanDetailClientPage loanDetails={loanDetails} />;
}
