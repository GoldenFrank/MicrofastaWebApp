
'use client';

import type { DetailedLoanApplication } from '@/data/mockLoanDetails';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, DollarSign, Percent, Hash, Info, Landmark, Phone, FileText as FileTextIcon, UserCircle, Tag } from 'lucide-react'; // Changed FileText to FileTextIcon for clarity
import React from 'react';

export interface LoanDetailClientPageProps {
  loanDetails: DetailedLoanApplication;
}

export default function LoanDetailClientPage({ loanDetails }: LoanDetailClientPageProps) {
  const {
    id, amount, mfi, status, appliedDate, lastUpdate, interestRate, termMonths,
    monthlyPayment, repaymentStatus, collateralDetails, applicantNotes, mfiContact
  } = loanDetails;

  const getStatusColor = (currentStatus: string) => {
    if (currentStatus === 'Funds Disbursed' || currentStatus === 'Approved' || currentStatus === 'Paid Off') return 'bg-green-500';
    if (currentStatus === 'Rejected') return 'bg-red-500';
    if (currentStatus === 'Overdue') return 'bg-orange-500';
    if (currentStatus === 'MFI Reviewing Docs' || currentStatus === 'KYC Submitted') return 'bg-blue-500';
    return 'bg-sky-500'; // Default for Pending, Matched, KYC Pending etc.
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 my-8">
      <Button asChild variant="outline" size="sm" className="mb-4 print:hidden">
        <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" />Back to Dashboard</Link>
      </Button>

      <Card className="shadow-xl">
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <CardTitle className="text-2xl md:text-3xl font-headline text-teal-700">Loan ID: {id}</CardTitle>
              <CardDescription>Comprehensive overview for your application with {mfi}.</CardDescription>
            </div>
            <span className={`px-3 py-1.5 text-sm font-semibold rounded-md text-white ${getStatusColor(status)}`}>
              {status}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          
          <InfoSection title="Financial Overview">
            <InfoItem icon={<DollarSign />} label="Loan Amount Req." value={`KES ${amount.toLocaleString()}`} />
            {interestRate && <InfoItem icon={<Percent />} label="Interest Rate" value={`${interestRate}% p.a.`} />}
            {termMonths && <InfoItem icon={<CalendarDays />} label="Loan Term" value={`${termMonths} months`} />}
            {monthlyPayment && <InfoItem icon={<DollarSign />} label="Est. Monthly Payment" value={`KES ${monthlyPayment.toLocaleString()}`} />}
          </InfoSection>

          <InfoSection title="Application Timeline & MFI">
            <InfoItem icon={<Landmark />} label="Partner MFI" value={mfi} />
            {mfiContact && <InfoItem icon={<Phone />} label="MFI Contact" value={mfiContact} isContact />}
            <InfoItem icon={<CalendarDays />} label="Application Date" value={new Date(appliedDate).toLocaleDateString()} />
            <InfoItem icon={<CalendarDays />} label="Last Status Update" value={new Date(lastUpdate).toLocaleDateString()} />
            {repaymentStatus && repaymentStatus !== 'N/A' && (
              <InfoItem icon={<Tag />} label="Repayment Status" value={repaymentStatus} />
            )}
          </InfoSection>

          {collateralDetails && (
            <InfoSection title="Collateral Information">
              <InfoItem icon={<FileTextIcon />} label="Vehicle Details" value={collateralDetails} />
            </InfoSection>
          )}

          {applicantNotes && (
            <InfoSection title="Your Application Notes">
              <p className="text-sm text-foreground/90 p-4 bg-muted/50 rounded-md border italic">"{applicantNotes}"</p>
            </InfoSection>
          )}

        </CardContent>
        <CardFooter className="border-t pt-4 print:hidden">
          <p className="text-xs text-muted-foreground">
            This information is for your reference. For official communication or queries, please contact {mfi} directly using the provided details.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

interface InfoSectionProps {
  title: string;
  children: React.ReactNode;
}
const InfoSection = ({ title, children }: InfoSectionProps) => (
  <div className="space-y-3">
    <h3 className="text-xl font-semibold text-teal-600 border-b border-teal-200 pb-2 mb-3 flex items-center">
       {title}
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">{children}</div>
  </div>
);

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  isContact?: boolean;
}
const InfoItem = ({ icon, label, value, isContact = false }: InfoItemProps) => (
  <div className="flex items-start text-sm py-1">
    <span className="text-accent mr-3 pt-1">{React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}</span>
    <div className="flex-1">
      <p className="text-muted-foreground text-xs">{label}</p>
      {isContact && typeof value === 'string' ? (
        <a href={`tel:${value.replace(/\s|-|\(|\)/g, '')}`} className="font-medium text-foreground hover:underline break-all">
          {value}
        </a>
      ) : (
        <p className="font-medium text-foreground break-all">{value}</p>
      )}
    </div>
  </div>
);
