
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Building, CheckSquare, Clock, FileText, Info, Percent, Phone, ShieldCheck, AlertTriangle, Loader2, UploadCloud, FileCheck, BookCopy, FileBadge, UserSquare } from 'lucide-react';
import Link from 'next/link';
import type { MfiInstitution } from '@/ai/flows/mfi-matching';
import { useToast } from '@/hooks/use-toast';

export default function MfiDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [mfi, setMfi] = useState<MfiInstitution | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [documentsSubmitted, setDocumentsSubmitted] = useState(false);
  const [isSubmittingDocs, setIsSubmittingDocs] = useState(false);
  
  const logbookFileRef = useRef<HTMLInputElement>(null);
  const statementFileRef = useRef<HTMLInputElement>(null);
  const idFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const mfiParam = searchParams.get('mfi');
    if (mfiParam) {
      let decodedMfiParam: string;
      try {
        // First, try to decode the URI component
        decodedMfiParam = decodeURIComponent(mfiParam);
      } catch (uriError) {
        console.error("Failed to decode MFI parameter:", uriError);
        setError("Invalid MFI data in URL. It might be corrupted or improperly encoded. Please go back and try again.");
        return; // Exit early if decoding fails
      }

      try {
        // Then, try to parse the JSON
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

  const handleDocumentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmittingDocs(true);

    // Simulate document submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real app, you would handle file uploads here.
    // For this prototype, we just simulate success.
    console.log("Simulated document submission for:", mfi?.name);
    if (logbookFileRef.current?.files && logbookFileRef.current.files.length > 0) {
        console.log("Logbook files selected:", logbookFileRef.current.files);
    }
    if (statementFileRef.current?.files && statementFileRef.current.files.length > 0) {
        console.log("Statement files selected:", statementFileRef.current.files);
    }
    if (idFileRef.current?.files && idFileRef.current.files.length > 0) {
        console.log("ID files selected:", idFileRef.current.files);
    }

    setDocumentsSubmitted(true);
    setIsSubmittingDocs(false);
    toast({
      title: "Documents Submitted!",
      description: `Your documents for ${mfi?.name} have been notionally submitted. You can track the status on your dashboard (simulation).`,
      duration: 5000,
    });
    // Potentially update a global state or localStorage to reflect this in dashboard
    // For now, user can navigate back or to dashboard.
  };


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

  if (!mfi) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
        <p className="ml-4 text-lg text-teal-700">Loading MFI details...</p>
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
              <CardDescription>Review details and proceed with {mfi.name}.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <ShieldCheck className="h-4 w-4 text-accent" />
            <AlertTitle>Proceed with your Application</AlertTitle>
            <AlertDescription>
              You have selected to proceed with <strong>{mfi.name}</strong>. Review their requirements below. You can use their contact information or, if available, upload your documents directly.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-4">
            <InfoItem icon={<Percent className="text-accent"/>} label="Interest Rate" value={`${mfi.interestRate}%`} />
            <InfoItem icon={<Clock className="text-accent"/>} label="Processing Time" value={mfi.processingTime} />
            <InfoItem icon={<Phone className="text-accent"/>} label="Contact Information" value={mfi.contactInformation} isContact />
            <InfoItem icon={<Info className="text-accent"/>} label="Approval Rate" value={`${(mfi.approvalRate * 100).toFixed(0)}%`} />
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

          {!documentsSubmitted ? (
            <Card className="mt-6 bg-muted/30">
              <CardHeader>
                <CardTitle className="text-xl flex items-center text-teal-700"><UploadCloud className="mr-2 text-accent"/>Upload Your Documents</CardTitle>
                <CardDescription>Submit the required documents to {mfi.name} for review. Please upload clear copies for each category.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDocumentSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="logbookFile" className="text-sm font-medium flex items-center"><BookCopy className="mr-2 h-4 w-4 text-accent" />Logbook Copy</Label>
                    <Input id="logbookFile" type="file" ref={logbookFileRef} className="border-input" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="statementFile" className="text-sm font-medium flex items-center"><FileBadge className="mr-2 h-4 w-4 text-accent" />Mpesa/Bank Statement (Last 6 months)</Label>
                    <Input id="statementFile" type="file" ref={statementFileRef} className="border-input" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="idFile" className="text-sm font-medium flex items-center"><UserSquare className="mr-2 h-4 w-4 text-accent" />National ID / Passport Copy</Label>
                    <Input id="idFile" type="file" ref={idFileRef} className="border-input" />
                  </div>
                  
                  <Button type="submit" className="w-full bg-yellow-300 text-teal-900 hover:bg-yellow-400 hover:text-teal-950" disabled={isSubmittingDocs}>
                    {isSubmittingDocs ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>
                    ) : (
                      <><UploadCloud className="mr-2 h-4 w-4" />Submit Documents to {mfi.name}</>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Alert variant="default" className="mt-6 border-green-500 bg-green-50">
              <FileCheck className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-700">Documents Submitted Successfully!</AlertTitle>
              <AlertDescription className="text-green-600">
                Your documents for {mfi.name} have been (notionally) submitted. The MFI will review them. You can track the status on your <Link href="/dashboard" className="underline hover:text-green-800 font-semibold">dashboard</Link>.
                You may also contact {mfi.name} directly using their provided contact information for follow-ups.
              </AlertDescription>
            </Alert>
          )}

        </CardContent>
        <CardFooter className="flex-col items-start space-y-2">
            <p className="text-xs text-muted-foreground">
                MicroFasta helps you find and connect with MFIs. The actual loan agreement and document verification will be between you and {mfi.name}. Ensure you understand all terms before committing.
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
    <span className="mr-3 pt-1">{React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}</span>
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
    
    
