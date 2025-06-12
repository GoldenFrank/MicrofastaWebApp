
'use client';

import React, { useEffect, useState } from 'react';
import DashboardLoanCard, { type LoanApplication } from '@/components/loan/DashboardLoanCard';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Loader2, AlertTriangle, MailWarning, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


// Mock data for demonstration
const mockLoans: LoanApplication[] = [
  {
    id: 'L001AXYZ',
    amount: 50000,
    mfi: 'Faulu Kenya',
    status: 'KYC Submitted', // Updated status
    appliedDate: '2024-07-01',
    lastUpdate: '2024-07-15',
    repaymentStatus: 'N/A',
    buyOffEligible: false,
  },
  {
    id: 'L007DEFG',
    amount: 80000,
    mfi: 'Asa Kenya',
    status: 'KYC Pending', // New status
    appliedDate: '2024-07-18',
    lastUpdate: '2024-07-19',
    repaymentStatus: 'N/A',
    buyOffEligible: false,
  },
  {
    id: 'L002BCDE',
    amount: 120000,
    mfi: 'Platinum Credit',
    status: 'MFI Reviewing Docs', // Updated status
    appliedDate: '2024-06-15',
    lastUpdate: '2024-07-10',
    repaymentStatus: 'N/A',
    buyOffEligible: true,
    buyOffDetails: 'Eligible for buy-off with select partners after 6 months.'
  },
  {
    id: 'L003FGHI',
    amount: 75000,
    status: 'Funds Disbursed',
    mfi: 'Letshego',
    appliedDate: '2024-05-20',
    lastUpdate: '2024-06-05',
    repaymentStatus: 'On Track',
    buyOffEligible: true,
    buyOffDetails: 'Competitive buy-off offers available through MicroFasta network.'
  },
  {
    id: 'L004JKLM',
    amount: 30000,
    status: 'Rejected',
    mfi: 'Jijenge Credit',
    appliedDate: '2024-07-05',
    lastUpdate: '2024-07-08',
    repaymentStatus: 'N/A',
    buyOffEligible: false,
  },
   {
    id: 'L005MNOP',
    amount: 95000,
    status: 'Funds Disbursed',
    mfi: 'Izwe Kenya',
    appliedDate: '2024-04-10',
    lastUpdate: '2024-07-01',
    repaymentStatus: 'Overdue',
    buyOffEligible: false,
  },
  {
    id: 'L006QRST',
    amount: 60000,
    status: 'Funds Disbursed',
    mfi: 'Premier Credit',
    appliedDate: '2023-12-01',
    lastUpdate: '2024-06-20',
    repaymentStatus: 'Paid Off',
    buyOffEligible: false,
  },
  {
    id: 'L008HIJK',
    amount: 45000,
    status: 'MFI Matched',
    appliedDate: '2024-07-20',
    lastUpdate: '2024-07-21',
    repaymentStatus: 'N/A',
    buyOffEligible: false,
  }
];

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [isLoadingLoans, setIsLoadingLoans] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/dashboard');
    } else if (user) {
      // Simulate fetching loans
      // In a real app, you might fetch and update this based on interactions in mfi-details page
      const storedLoans = localStorage.getItem('mockUserLoans');
      if (storedLoans) {
        // This is a very basic way to persist, real app needs backend
        // setLoans(JSON.parse(storedLoans));
        setLoans(mockLoans); // For now, stick to updated mockLoans
      } else {
        setLoans(mockLoans);
      }
      setIsLoadingLoans(false);
    }
  }, [user, authLoading, router]);

  if (authLoading || isLoadingLoans) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
        <p className="ml-4 text-lg font-semibold text-teal-700">Loading Dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
            <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-teal-700">Access Denied</h2>
            <p className="text-muted-foreground mb-4">Please log in to view your dashboard.</p>
            <Button asChild>
                <Link href="/login">Go to Login</Link>
            </Button>
        </div>
    );
  }
  

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-teal-700">
          Welcome, {user.displayName || user.email}!
        </h1>
        <Button asChild size="lg" className="bg-yellow-300 text-teal-900 hover:bg-yellow-400 hover:text-teal-950">
          <Link href="/apply">
            <PlusCircle className="mr-2 h-5 w-5" />
            New Loan Application
          </Link>
        </Button>
      </div>
      
      {user && !user.emailVerified && (
        <Alert variant="default" className="border-yellow-500 bg-yellow-50/50">
          <MailWarning className="h-5 w-5 text-yellow-600" />
          <AlertTitle className="text-yellow-700">Verify Your Email Address</AlertTitle>
          <AlertDescription className="text-yellow-600">
            A verification email has been sent to <strong>{user.email}</strong>. Please check your inbox (and spam folder) and click the link to fully activate your account.
          </AlertDescription>
        </Alert>
      )}

      <p className="text-lg text-foreground/80">
        Here&apos;s an overview of your loan applications. Track their progress and manage your finances effectively.
      </p>

      {loans.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
          <Image 
            src="https://placehold.co/300x200.png" 
            alt="No loans" 
            width={300} 
            height={200} 
            className="mx-auto mb-6 rounded-md opacity-70"
            data-ai-hint="empty state"
          />
          <h2 className="text-2xl font-semibold mb-3 text-teal-700">No Loan Applications Yet</h2>
          <p className="text-muted-foreground mb-6">
            It looks like you haven&apos;t applied for any loans. <br/>Start your financial journey by applying today!
          </p>
          <Button asChild size="lg" className="bg-yellow-300 text-teal-900 hover:bg-yellow-400 hover:text-teal-950">
            <Link href="/apply">Apply for a New Loan</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loans.map((loan) => (
            <DashboardLoanCard key={loan.id} loan={loan} />
          ))}
        </div>
      )}
    </div>
  );
}
