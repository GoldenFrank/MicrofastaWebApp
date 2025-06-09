
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Building, CheckSquare, Clock, FileText, Info, Percent, Phone, ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { MfiInstitution } from '@/ai/flows/mfi-matching';

export default function MfiDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mfi, setMfi] = useState<MfiInstitution | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const mfiParam = searchParams.get('mfi');
    if (mfiParam) {
      try {
        const parsedMfi = JSON.parse(decodeURIComponent(mfiParam));
        // Basic validation for the parsed MFI object
        if (parsedMfi && parsedMfi.name && parsedMfi.contactInformation) {
          setMfi(parsedMfi);
        } else {
          setError("Invalid MFI data received. Please try selecting an MFI again.");
        }
      } catch (e) {
        console.error("Failed to parse MFI data:", e);
        setError("Could not load MFI details. Please go back and try again.");
      }
    } else {
      setError("No MFI selected. Please go back and select an MFI.");
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <CardTitle className="text-2xl mb-2">Error Loading MFI Details</CardTitle>
        <CardDescription className="mb-4">{error}</CardDescription>
        <Button asChild variant="outline">
          <Link href="/apply"><ArrowLeft className="mr-2 h-4 w-4" />Back to Application</Link>
        </Button>
      </div>
    );
  }

  if (!mfi) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading MFI details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button asChild variant="outline" size="sm" className="mb-4">
        <Link href="/apply"><ArrowLeft className="mr-2 h-4 w-4" />Back to MFI List</Link>
      </Button>

      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Building className="w-10 h-10 text-primary" />
            <div>
              <CardTitle className="text-3xl font-headline">{mfi.name}</CardTitle>
              <CardDescription>Next steps to apply with {mfi.name}.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Proceed with your Application</AlertTitle>
            <AlertDescription>
              You have selected to proceed with <strong>{mfi.name}</strong>. Please use their contact information below to complete your loan application. Mention you found them through MicroFasta!
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-4">
            <InfoItem icon={<Percent />} label="Interest Rate" value={`${mfi.interestRate}%`} />
            <InfoItem icon={<Clock />} label="Processing Time" value={mfi.processingTime} />
            <InfoItem icon={<Phone />} label="Contact Information" value={mfi.contactInformation} isContact />
            <InfoItem icon={<Info />} label="Approval Rate" value={`${(mfi.approvalRate * 100).toFixed(0)}%`} />
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center"><CheckSquare className="mr-2 text-primary"/>Requirements:</h3>
            <ul className="list-disc list-inside pl-5 space-y-1 text-foreground/80">
              {mfi.requirements.map((req, i) => <li key={i}>{req}</li>)}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center"><FileText className="mr-2 text-primary"/>Loan Terms & Conditions:</h3>
            <p className="text-foreground/80 whitespace-pre-line">{mfi.loanTerms}</p>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start space-y-2">
            <p className="text-xs text-muted-foreground">
                MicroFasta helps you find MFIs. The actual loan agreement will be between you and {mfi.name}. Ensure you understand all terms before committing.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  isContact?: boolean;
}
const InfoItem = ({ icon, label, value, isContact = false }: InfoItemProps) => (
  <div className="flex items-start p-3 bg-muted/30 rounded-md">
    <span className="text-primary mr-3 pt-1">{React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}</span>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      {isContact && (typeof value === 'string' && (value.startsWith('http') || value.startsWith('mailto:') || value.startsWith('tel:'))) ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:underline">{value.replace(/^(mailto:|tel:)/, '')}</a>
      ) : (
        <p className="font-semibold text-foreground">{value}</p>
      )}
    </div>
  </div>
);
