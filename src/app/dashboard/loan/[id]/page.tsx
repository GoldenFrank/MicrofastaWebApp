// This is a placeholder for a detailed loan view page.
// In a real application, you would fetch loan details based on the ID.
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertTriangle, DollarSign, Bank, CalendarDays, Info, FileText, UserCheck } from 'lucide-react';
import type { LoanApplication } from '@/components/loan/DashboardLoanCard'; // Re-use type

// Mock data - in a real app, fetch this based on params.id
const mockLoanDetails: { [key: string]: LoanApplication & { detailedNotes?: string; mfiContact?: string } } = {
  'L001AXYZ': {
    id: 'L001AXYZ', amount: 50000, mfi: 'Faulu Kenya', status: 'Pending Review', appliedDate: '2024-07-01', lastUpdate: '2024-07-15',
    detailedNotes: "Initial review in progress. Logbook verification scheduled for next week. Ensure all documents are up to date.",
    mfiContact: "Faulu Kenya - 0711074074"
  },
  'L002BCDE': {
    id: 'L002BCDE', amount: 120000, mfi: 'Platinum Credit', status: 'Approved', appliedDate: '2024-06-15', lastUpdate: '2024-07-10',
    detailedNotes: "Loan approved. Disbursement process initiated. Funds expected in 2-3 business days.",
    mfiContact: "Platinum Credit - 0709777000"
  },
   'L003FGHI': {
    id: 'L003FGHI', amount: 75000, status: 'Funds Disbursed', mfi: 'Letshego', appliedDate: '2024-05-20', lastUpdate: '2024-06-05',
    detailedNotes: "Funds were successfully disbursed on June 5th, 2024. Repayment schedule has been shared via email.",
    mfiContact: "Letshego - contact@letshego.com"
  },
   'L004JKLM': {
    id: 'L004JKLM', amount: 30000, status: 'Rejected', appliedDate: '2024-07-05', lastUpdate: '2024-07-08',
    detailedNotes: "Application rejected due to incomplete documentation. Please re-apply with all required documents.",
    mfiContact: "N/A"
  },
};


export default function LoanDetailPage() {
  const params = useParams();
  const loanId = params.id as string;
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loan, setLoan] = useState<(LoanApplication & { detailedNotes?: string; mfiContact?: string }) | null>(null);
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
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading loan details...</p>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <CardTitle className="text-2xl mb-2">Loan Not Found</CardTitle>
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
    'Awaiting Disbursement': { icon: <Bank className="h-5 w-5 text-teal-500 mr-2" />, color: "text-teal-500" },
    'Funds Disbursed': { icon: <DollarSign className="h-5 w-5 text-purple-500 mr-2" />, color: "text-purple-500" },
    'Rejected': { icon: <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />, color: "text-red-500" },
  }[loan.status] || { icon: <Info className="h-5 w-5 text-gray-500 mr-2" />, color: "text-gray-500" };


  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button asChild variant="outline" size="sm" className="mb-6">
        <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" />Back to Dashboard</Link>
      </Button>
      
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-headline">Loan Details: {loan.id}</CardTitle>
            <span className={`flex items-center font-semibold ${statusInfo.color}`}>
              {statusInfo.icon}
              {loan.status}
            </span>
          </div>
          <CardDescription>Detailed information about your loan application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <InfoItem icon={<DollarSign />} label="Loan Amount" value={`$${loan.amount.toLocaleString()}`} />
            <InfoItem icon={<Bank />} label="MFI" value={loan.mfi || 'Not Assigned'} />
            <InfoItem icon={<CalendarDays />} label="Applied Date" value={new Date(loan.appliedDate).toLocaleDateString()} />
            <InfoItem icon={<CalendarDays />} label="Last Updated" value={new Date(loan.lastUpdate).toLocaleDateString()} />
            {loan.mfiContact && loan.mfiContact !== "N/A" && <InfoItem icon={<Info />} label="MFI Contact" value={loan.mfiContact} />}
          </div>
          
          {loan.detailedNotes && (
            <div className="pt-4 mt-4 border-t">
              <h3 className="font-semibold text-lg mb-2 text-primary">Application Notes</h3>
              <p className="text-foreground/80 whitespace-pre-line">{loan.detailedNotes}</p>
            </div>
          )}

        </CardContent>
      </Card>
      
      {loan.status === 'Pending Review' && (
         <Card className="mt-6 bg-secondary/50">
            <CardHeader>
                <CardTitle className="text-xl flex items-center"><Info className="mr-2 text-accent"/>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-secondary-foreground">Your application is under review. We will notify you of any updates. You may be contacted if additional information is required.</p>
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
    <span className="text-primary mr-3">{React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}</span>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground">{value}</p>
    </div>
  </div>
);

