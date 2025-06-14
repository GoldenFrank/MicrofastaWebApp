
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { useAuth } from '@/context/AuthContext';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import {
  ArrowLeft, Loader2, AlertTriangle, DollarSign, Landmark, CalendarDays,
  Info, FileText, UserCog, ListChecks, Shuffle, FileUp, FileSearch,
  Banknote, CheckCircle, XCircle, Hourglass, Phone
} from 'lucide-react';

import type { LoanApplication } from '@/components/loan/DashboardLoanCard';
import { mockLoanDetails } from '@/data/mockLoanDetails';

type LoanDetail = LoanApplication & {
  detailedNotes?: string;
  mfiContact?: string;
  // buyOffDetails is already optional in LoanApplication via DashboardLoanCard
};

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const InfoItem = ({ icon, label, value }: InfoItemProps) => (
  <div className="flex items-center p-3 bg-muted/30 rounded-md">
    <span className="mr-3">{React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}</span>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground">{String(value)}</p>
    </div>
  </div>
);

const statusInfoMap: Record<LoanApplication['status'], { icon: React.ReactNode; color: string; cardMessage?: string }> = {
  'Pending Review': {
    icon: <Hourglass className="h-5 w-5 text-yellow-500 mr-2 animate-spin" />,
    color: "text-yellow-500 border-yellow-500/50",
    cardMessage: "Your initial application is under review by MicroFasta.",
  },
  'MFI Matched': {
    icon: <UserCog className="h-5 w-5 text-sky-500 mr-2" />,
    color: "text-sky-500 border-sky-500/50",
    cardMessage: "We've matched you with potential MFIs. Please proceed from the Apply page to select one and submit documents.",
  },
  'KYC Pending': {
    icon: <FileUp className="h-5 w-5 text-orange-500 mr-2" />,
    color: "text-orange-500 border-orange-500/50",
    cardMessage: "Awaiting your document submission. Go to the Apply page and select your MFI to proceed.",
  },
  'KYC Submitted': {
    icon: <FileSearch className="h-5 w-5 text-blue-500 mr-2" />,
    color: "text-blue-500 border-blue-500/50",
    cardMessage: "Your documents have been submitted and are pending MFI review.",
  },
  'MFI Reviewing Docs': {
    icon: <UserCog className="h-5 w-5 text-indigo-500 mr-2" />,
    color: "text-indigo-500 border-indigo-500/50",
    cardMessage: "Your documents are being reviewed by the MFI.",
  },
  'Approved': {
    icon: <CheckCircle className="h-5 w-5 text-green-500 mr-2" />,
    color: "text-green-500 border-green-500/50",
    cardMessage: "Congratulations! Your loan is approved. Please contact the MFI to finalize.",
  },
  'Awaiting Disbursement': {
    icon: <Banknote className="h-5 w-5 text-teal-500 mr-2" />,
    color: "text-teal-500 border-teal-500/50",
    cardMessage: "Funds are being prepared for disbursement.",
  },
  'Funds Disbursed': {
    icon: <DollarSign className="h-5 w-5 text-purple-500 mr-2" />,
    color: "text-purple-500 border-purple-500/50",
    cardMessage: "Funds have been disbursed. Check your bank account.",
  },
  'Rejected': {
    icon: <XCircle className="h-5 w-5 text-red-500 mr-2" />,
    color: "text-red-500 border-red-500/50",
    cardMessage: "Unfortunately, your application was rejected.",
  },
};

// Ensure repaymentStatus is always one of the keys defined here
const repaymentStatusColors: Record<NonNullable<LoanApplication['repaymentStatus']>, string> = {
  'On Track': 'text-green-600 bg-green-100 border-green-200',
  'Overdue': 'text-red-600 bg-red-100 border-red-200',
  'Paid Off': 'text-blue-600 bg-blue-100 border-blue-200',
  'Defaulted': 'text-destructive bg-destructive/10 border-destructive/20',
  'N/A': 'text-muted-foreground bg-muted/30 border-muted/50',
};

export default function LoanDetailPage() {
  const params = useParams();
  // loanId will be a string if the 'id' param exists, otherwise undefined.
  const loanId = typeof params.id === 'string' ? params.id : undefined; 
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loan, setLoan] = useState<LoanDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      setIsLoading(true); // Explicitly keep loading if auth is pending
      return;
    }

    if (!user) {
      const redirectPath = loanId ? `/dashboard/loan/${loanId}` : '/dashboard';
      router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
      // No need to set isLoading to false here, as the component will unmount or redirect.
      return;
    }

    // User is authenticated and auth is not loading
    if (loanId) {
      const foundLoan = mockLoanDetails[loanId];
      setLoan(foundLoan || null); // Set to null if not found, to trigger "Loan Not Found"
    } else {
      setLoan(null); // No loanId means no loan to display
    }
    setIsLoading(false); // Done with data fetching attempt

  }, [authLoading, user, loanId, router]);

  if (isLoading) { // authLoading is implicitly handled by isLoading state
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
        <p className="ml-4 text-lg text-teal-700">Loading loan details...</p>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <CardTitle className="text-2xl mb-2 text-teal-700">Loan Not Found</CardTitle>
        <CardDescription className="mb-4">We couldn't find the loan you're looking for. It might be an invalid ID or the loan does not exist.</CardDescription>
        <Button asChild variant="outline">
          <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" />Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const statusInfo = statusInfoMap[loan.status] || {
    icon: <Info className="h-5 w-5 text-gray-500 mr-2" />,
    color: "text-gray-500 border-gray-500/50",
    cardMessage: "Status is being updated."
  };
  // Default to 'N/A' if repaymentStatus is undefined, which is a valid key in repaymentStatusColors
  const currentRepaymentStatus = loan.repaymentStatus || 'N/A';
  const repaymentBadge = repaymentStatusColors[currentRepaymentStatus];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button asChild variant="outline" size="sm" className="mb-6">
        <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" />Back to Dashboard</Link>
      </Button>

      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-3xl font-headline text-teal-700">Loan ID: {loan.id}</CardTitle>
            <Badge variant="outline" className={`flex items-center font-semibold px-3 py-1 ${statusInfo.color}`}>
              {statusInfo.icon}{loan.status}
            </Badge>
          </div>
          <CardDescription>Details about your application with {loan.mfi || 'MicroFasta'}.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <InfoItem icon={<DollarSign className="text-accent" />} label="Amount" value={`KSH ${loan.amount.toLocaleString()}`} />
            <InfoItem icon={<Landmark className="text-accent" />} label="MFI" value={loan.mfi || 'Pending'} />
            <InfoItem icon={<CalendarDays className="text-accent" />} label="Applied" value={new Date(loan.appliedDate).toLocaleDateString()} />
            <InfoItem icon={<CalendarDays className="text-accent" />} label="Updated" value={new Date(loan.lastUpdate).toLocaleDateString()} />
            {loan.repaymentStatus && ( // Conditionally render this block
              <div className="flex items-center p-3 bg-muted/30 rounded-md">
                <ListChecks className="w-5 h-5 mr-3 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Repayment</p>
                  <Badge variant="outline" className={`px-2 py-0.5 ${repaymentBadge}`}>{loan.repaymentStatus}</Badge>
                </div>
              </div>
            )}
            <InfoItem icon={<Shuffle className="text-accent" />} label="Buy-off" value={loan.buyOffEligible ? 'Eligible' : 'Not Eligible'} />
            {loan.mfiContact && loan.mfiContact !== 'N/A' && (
              <InfoItem icon={<Phone className="text-accent" />} label="MFI Contact" value={loan.mfiContact} />
            )}
          </div>

          {loan.buyOffEligible && loan.buyOffDetails && (
            <div className="pt-4 mt-4 border-t">
              <h3 className="font-semibold text-lg mb-2 text-accent flex items-center"><Shuffle className="mr-2 h-5 w-5" />Buy-off Details</h3>
              <p className="text-foreground/80 whitespace-pre-line">{loan.buyOffDetails}</p>
            </div>
          )}

          {loan.detailedNotes && (
            <div className="pt-4 mt-4 border-t">
              <h3 className="font-semibold text-lg mb-2 text-accent flex items-center"><FileText className="mr-2 h-5 w-5" />Application Notes</h3>
              <p className="text-foreground/80 whitespace-pre-line">{loan.detailedNotes}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col items-start space-y-2 text-xs text-muted-foreground">
          <p>MicroFasta is a facilitator. The loan contract is between you and {loan.mfi || 'the MFI'}.</p>
          {loan.status === 'Approved' && loan.mfi && (
            <p className="font-semibold text-accent">Action Required: Contact {loan.mfi} to proceed with disbursement.</p>
          )}
        </CardFooter>
      </Card>

      {statusInfo.cardMessage && (
        <Card className="mt-6 bg-secondary/30 border-l-4 border-accent">
          <CardHeader>
            <CardTitle className="text-xl flex items-center text-teal-700"><Info className="mr-2 text-accent" />Status Update</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-secondary-foreground">{statusInfo.cardMessage}</p>
          </CardContent>
        </Card>
      )}

      {loan.repaymentStatus === 'Overdue' && (
        <Card className="mt-6 border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-xl flex items-center text-destructive">
              <AlertTriangle className="mr-2" />Overdue Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive/90">
              Your loan is overdue. Contact {loan.mfi || 'the MFI'} {loan.mfiContact && loan.mfiContact !== 'N/A' ? `at ${loan.mfiContact}` : 'at their office'} to make payment and avoid penalties.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
