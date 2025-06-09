
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input"; // Keep for other uses if any, or remove if truly unused.
import { Label } from "@/components/ui/label"; // Keep for other uses if any, or remove if truly unused.
import { ArrowLeft, Building, CheckSquare, Clock, FileText, Info, Percent, Phone, ShieldCheck, AlertTriangle, Loader2, Globe, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { MfiInstitution } from '@/ai/flows/mfi-matching';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function MfiDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast(); // Keep toast if other parts of the page might use it.
  const [mfi, setMfi] = useState<MfiInstitution | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const mfiParam = searchParams.get('mfi');
    if (mfiParam) {
      let decodedMfiParam: string;
      try {
        decodedMfiParam = decodeURIComponent(mfiParam);
      } catch (uriError) {
        console.error("Failed to decode MFI parameter:", uriError);
        setError("Invalid MFI data in URL. It might be corrupted or improperly encoded. Please go back and try again.");
        return; 
      }

      try {
        const parsedMfi = JSON.parse(decodedMfiParam);
        if (parsedMfi && parsedMfi.name && parsedMfi.contactInformation) {
          setMfi(parsedMfi);
        } else {
          setError("Invalid MFI data structure received. Please ensure all required fields are present and try selecting an MFI again.");
        }
      } catch (jsonError) {
        console.error("Failed to parse MFI JSON data:", jsonError);
        setError("Could not load MFI details due to a parsing error. Please go back and try again.");
      }
    } else {
      setError("No MFI selected. Please go back and select an MFI.");
    }
  }, [searchParams]);


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <CardTitle className="text-2xl mb-2 text-teal-700">Error Loading MFI Details</CardTitle>
        <CardDescription className="mb-4">{error}</CardDescription>
        <Button asChild variant="outline">
          <Link href="/apply"><ArrowLeft className="mr-2 h-4 w-4" />Back to Application</Link>
        </Button>
      </div>
    );
  }

  if (!mfi && !error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
        <p className="ml-4 text-lg text-teal-700">Loading MFI details...</p>
      </div>
    );
  }
  
  if (!mfi) {
    return (
         <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
            <AlertTriangle className="h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle className="text-2xl mb-2 text-teal-700">MFI Not Loaded</CardTitle>
            <CardDescription className="mb-4">MFI details could not be loaded. Please try again.</CardDescription>
            <Button asChild variant="outline">
              <Link href="/apply"><ArrowLeft className="mr-2 h-4 w-4" />Back to Application</Link>
            </Button>
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
            <Building className="w-10 h-10 text-accent" />
            <div>
              <CardTitle className="text-3xl font-headline text-teal-700">{mfi.name}</CardTitle>
              <CardDescription>Review details for {mfi.name}.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <ShieldCheck className="h-4 w-4 text-accent" />
            <AlertTitle>MFI Details: {mfi.name}</AlertTitle>
            <AlertDescription>
              Review the requirements and contact information for <strong>{mfi.name}</strong> below. To submit KYC documents, use the 'Proceed' option from the MFI comparison list.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-4">
            <InfoItem icon={<Percent />} label="Interest Rate" value={`${mfi.interestRate}%`} />
            <InfoItem icon={<Clock />} label="Processing Time" value={mfi.processingTime} />
            <InfoItem icon={<Phone />} label="Contact Information" value={mfi.contactInformation} isContact />
            <InfoItem icon={<Info />} label="Approval Rate" value={`${(mfi.approvalRate * 100).toFixed(0)}%`} />
            {mfi.websiteUrl && <InfoItem icon={<Globe />} label="Website" value={mfi.websiteUrl} isLink />}
            {mfi.applicationUrl && <InfoItem icon={<ExternalLink />} label="Apply Online" value={mfi.applicationUrl} isLink />}
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center"><CheckSquare className="mr-2 text-accent"/>Requirements:</h3>
            <ul className="list-disc list-inside pl-5 space-y-1 text-foreground/80">
              {mfi.requirements.map((req, i) => <li key={i}>{req}</li>)}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center"><FileText className="mr-2 text-accent"/>Loan Terms & Conditions:</h3>
            <p className="text-foreground/80 whitespace-pre-line">{mfi.loanTerms}</p>
          </div>

        </CardContent>
        <CardFooter className="flex-col items-start space-y-2">
            <p className="text-xs text-muted-foreground">
                MicroFasta helps you find and connect with MFIs. The actual loan agreement will be between you and {mfi.name}. Ensure you understand all terms before committing.
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
  isLink?: boolean;
}
const InfoItem = ({ icon, label, value, isContact = false, isLink = false }: InfoItemProps) => (
  <div className="flex items-start p-3 bg-muted/30 rounded-md">
    <span className="mr-3 pt-1">{React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5 text-accent" })}</span>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      {(isContact || (isLink && typeof value === 'string')) ? (
        <a 
          href={(isContact && typeof value === 'string' && /^\d[\d\s-()]*\d$/.test(value)) ? `tel:${value.replace(/\s|-|\(|\)/g, '')}` : (typeof value === 'string' ? value : '#')} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="font-semibold text-foreground hover:underline break-all"
        >
          {typeof value === 'string' && (isContact && !value.startsWith('http') && !value.startsWith('mailto:')) ? value : String(value).replace(/^(mailto:|tel:)/, '')}
        </a>
      ) : (
        <p className="font-semibold text-foreground">{String(value)}</p>
      )}
    </div>
  </div>
);

