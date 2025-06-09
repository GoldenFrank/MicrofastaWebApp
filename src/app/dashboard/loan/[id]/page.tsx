
// This is a placeholder for a detailed loan view page.
// In a real application, you would fetch loan details based on the ID.
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertTriangle, DollarSign, Landmark, CalendarDays, Info, FileText, UserCheck, ListChecks, Shuffle, HelpCircle } from 'lucide-react';
import type { LoanApplication } from '@/components/loan/DashboardLoanCard'; // Re-use type
import { Badge } from '@/components/ui/badge';

// Extended type for detailed view, merging with base LoanApplication
type LoanDetail = LoanApplication & {
  detailedNotes?: string;
  mfiContact?: string;
  // repaymentStatus and buyOffEligible are already in LoanApplication
};

// Mock data - in a real app, fetch this based on params.id
const mockLoanDetails: { [key: string]: LoanDetail } = {
  'L001AXYZ': {
    id: 'L001AXYZ', amount: 50000, mfi: 'Faulu Kenya', status: 'Pending Review', appliedDate: '2024-07-01', lastUpdate: '2024-07-15',
    detailedNotes: "Initial review in progress. Logbook verification scheduled for next week. Ensure all documents are up to date.",
    mfiContact: "Faulu Kenya - 0711074074",
    repaymentStatus: 'N/A',
    buyOffEligible: false,
  },
  'L002BCDE': {
    id: 'L002BCDE', amount: 120000, mfi: 'Platinum Credit', status: 'Approved', appliedDate: '2024-06-15', lastUpdate: '2024-07-10',
    detailedNotes: "Loan approved. Awaiting your final confirmation to proceed with disbursement.",
    mfiContact: "Platinum Credit - 0709777000",
    repaymentStatus: 'N/A',
    buyOffEligible: true,
    buyOffDetails: 'Eligible for buy-off with select partners after 6 months of consistent repayment.'
  },
   'L003FGHI': {
    id: 'L003FGHI', amount: 75000, status: 'Funds Disbursed', mfi: 'Letshego', appliedDate: '2024-05-20', lastUpdate: '2024-06-05',
    detailedNotes: "Funds were successfully disbursed on June 5th, 2024. Repayment schedule has been shared via email. First installment due July 5th, 2024.",
    mfiContact: "Letshego - contact@letshego.com",
    repaymentStatus: 'On Track',
    buyOffEligible: true,
    buyOffDetails: 'Competitive buy-off offers available through MicroFasta network. Check back after 3 successful repayments.'
  },
   'L004JKLM': {
    id: 'L004JKLM', amount: 30000, status: 'Rejected', appliedDate: '2024-07-05', lastUpdate: '2024-07-08',
    detailedNotes: "Application rejected due to insufficient income proof and logbook valuation discrepancies. Please contact us if you have updated documents.",
    mfiContact: "N/A",
    repaymentStatus: 'N/A',
    buyOffEligible: false,
  },
  'L005MNOP': {
    id: 'L005MNOP', amount: 95000, mfi: 'Izwe Kenya', status: 'Funds Disbursed', appliedDate: '2024-04-10', lastUpdate: '2024-07-01',
    detailedNotes: "Repayments are currently overdue by 15 days. Please make a payment immediately to avoid further penalties. Contact MFI for payment arrangements.",
    mfiContact: "Izwe Kenya - 0700123456",
    repaymentStatus: 'Overdue',
    buyOffEligible: false,
  },
  'L006QRST': {
    id: 'L006QRST', amount: 60000, mfi: 'Premier Credit', status: 'Funds Disbursed', appliedDate: '2023-12-01', lastUpdate: '2024-06-20',
    detailedNotes: "This loan has been fully paid off. Congratulations!",
    mfiContact: "Premier Credit - 0701987654",
    repaymentStatus: 'Paid Off',
    buyOffEligible: false, // Or potentially true if a new loan can be taken
  },
};


export default function LoanDetailPage() {
  const params = useParams();
  const loanId = params.id as string;
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loan, setLoan] = useState<LoanDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/dashboard/loan/${loanId}`);
    } else if (user && loanId) {
      // Simulate fetching loan details
      setTimeout(() => {
        const foundLoan = mockLoanDetails[loanId];
        setLoan(foundLoan || null);
        setIsLoading(false);
      }, 500);
    }
  }, [user, authLoading, router, loanId]);

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
        <p className="ml-4 text-lg">Loading loan details...</p>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <CardTitle className="text-2xl mb-2 text-teal-700">Loan Not Found</CardTitle>
        <CardDescription className="mb-4">The loan details you are looking for could not be found or you do not have permission to view it.</CardDescription>
        <Button asChild variant="outline">
          <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" />Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const statusInfo = {
    'Pending Review': { icon: <Loader2 className="h-5 w-5 text-yellow-500 mr-2 animate-spin" />, color: "text-yellow-500" },
    'MFI Matched': { icon: <UserCheck className="h-5 w-5 text-blue-500 mr-2" />, color: "text-blue-500" },
    'Approved': { icon: <FileText className="h-5 w-5 text-green-500 mr-2" />, color: "text-green-500" },
    'Awaiting Disbursement': { icon: <Landmark className="h-5 w-5 text-teal-500 mr-2" />, color: "text-teal-500" },
    'Funds Disbursed': { icon: <DollarSign className="h-5 w-5 text-purple-500 mr-2" />, color: "text-purple-500" },
    'Rejected': { icon: <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />, color: "text-red-500" },
  }[loan.status] || { icon: <Info className="h-5 w-5 text-gray-500 mr-2" />, color: "text-gray-500" };

  const repaymentStatusColors = {
    'On Track': 'text-green-600 bg-green-100',
    'Overdue': 'text-red-600 bg-red-100',
    'Paid Off': 'text-blue-600 bg-blue-100',
    'Defaulted': 'text-destructive bg-destructive/10',
    'N/A': 'text-muted-foreground bg-muted/30'
  };
  const repaymentBadgeClasses = repaymentStatusColors[loan.repaymentStatus || 'N/A'] || repaymentStatusColors['N/A'];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button asChild variant="outline" size="sm" className="mb-6">
        <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" />Back to Dashboard</Link>
      </Button>

      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-3xl font-headline text-teal-700">Loan Details: {loan.id}</CardTitle>
            <Badge variant="outline" className={`flex items-center font-semibold px-3 py-1 ${statusInfo.color} border-transparent`}>
              {statusInfo.icon}
              {loan.status}
            </Badge>
          </div>
          <CardDescription>Detailed information about your loan application with {loan.mfi || "MicroFasta"}.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <InfoItem icon={<DollarSign />} label="Loan Amount" value={`KSH ${loan.amount.toLocaleString()}`} />
            <InfoItem icon={<Landmark />} label="MFI" value={loan.mfi || 'Pending Match'} />
            <InfoItem icon={<CalendarDays />} label="Applied Date" value={new Date(loan.appliedDate).toLocaleDateString()} />
            <InfoItem icon={<CalendarDays />} label="Last Updated" value={new Date(loan.lastUpdate).toLocaleDateString()} />
            {loan.repaymentStatus && (
              <div className="flex items-center p-3 bg-muted/30 rounded-md md:col-span-1">
                 <ListChecks className="w-5 h-5 mr-3 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Repayment Status</p>
                  <Badge variant="outline" className={`px-2 py-0.5 ${repaymentBadgeClasses}`}>{loan.repaymentStatus}</Badge>
                </div>
              </div>
            )}
             {loan.buyOffEligible !== undefined && (
              <InfoItem
                icon={<Shuffle />}
                label="Buy-off Option"
                value={loan.buyOffEligible ? 'Eligible' : 'Not Eligible'}
              />
            )}
            {loan.mfiContact && loan.mfiContact !== "N/A" && <InfoItem icon={<Info />} label="MFI Contact" value={loan.mfiContact} />}
          </div>

          {loan.buyOffEligible && loan.buyOffDetails && (
            <div className="pt-4 mt-4 border-t">
              <h3 className="font-semibold text-lg mb-2 text-accent flex items-center"><Shuffle className="mr-2 h-5 w-5"/>Buy-off Details</h3>
              <p className="text-foreground/80 whitespace-pre-line">{loan.buyOffDetails}</p>
            </div>
          )}

          {loan.detailedNotes && (
            <div className="pt-4 mt-4 border-t">
              <h3 className="font-semibold text-lg mb-2 text-accent flex items-center"><FileText className="mr-2 h-5 w-5"/>Application Notes</h3>
              <p className="text-foreground/80 whitespace-pre-line">{loan.detailedNotes}</p>
            </div>
          )}

        </CardContent>
        <CardFooter className="flex-col items-start space-y-2 text-xs text-muted-foreground">
            <p>
                MicroFasta helps you find and track loans. The actual loan agreement is between you and {loan.mfi || "the MFI"}.
            </p>
            {loan.status === 'Approved' && (
                <p className="font-semibold text-accent">Action Required: Please confirm with {loan.mfi} to proceed with disbursement.</p>
            )}
        </CardFooter>
      </Card>

      {loan.status === 'Pending Review' && (
         <Card className="mt-6 bg-secondary/30">
            <CardHeader>
                <CardTitle className="text-xl flex items-center text-teal-700"><Info className="mr-2 text-accent"/>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-secondary-foreground">Your application is under review. We will notify you of any updates. You may be contacted by MicroFasta or the MFI if additional information is required.</p>
            </CardContent>
         </Card>
      )}
      {loan.repaymentStatus === 'Overdue' && (
         <Card className="mt-6 border-destructive bg-destructive/10">
            <CardHeader>
                <CardTitle className="text-xl flex items-center text-destructive"><AlertTriangle className="mr-2"/>Action Required: Overdue Payment</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-destructive/90">Your loan payment is overdue. Please contact {loan.mfi} immediately at {loan.mfiContact || 'their contact number'} to make arrangements and avoid further penalties.</p>
            </CardContent>
         </Card>
      )}
    </div>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}
const InfoItem = ({ icon, label, value }: InfoItemProps) => (
  <div className="flex items-center p-3 bg-muted/30 rounded-md">
    <span className="text-accent mr-3">{React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}</span>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground">{value}</p>
    </div>
  </div>
);
