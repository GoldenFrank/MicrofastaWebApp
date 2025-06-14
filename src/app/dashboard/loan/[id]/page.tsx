'use client';

import LoanDetailClientPage from '@/components/loan/LoanDetailClientPage';

// Use direct inline typing — no external PageProps interface
export default function Page({ params }: { params: { id: string } }) {
  return <LoanDetailClientPage loanIdFromParams={params.id} />;
}
