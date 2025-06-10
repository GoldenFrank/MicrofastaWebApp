
import type { MfiMatchingOutput, MfiInstitution } from "@/ai/flows/mfi-matching";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, Percent, Clock, CheckSquare, TrendingUp, FileText, ArrowRight, Eye, FilePenLine } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation'; // Import useRouter

interface MfiComparisonTableProps {
  mfiData: MfiMatchingOutput;
}

const LOCAL_STORAGE_MFI_LIST_KEY = 'mfiListFromApplyPage';

export default function MfiComparisonTable({ mfiData }: MfiComparisonTableProps) {
  const router = useRouter();

  if (!mfiData || mfiData.length === 0) {
    return (
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-teal-700"><Info className="mr-2 text-accent" /> No MFI Matches Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>We couldn&apos;t find any MFI institutions matching your criteria at the moment. Please try adjusting your application details or check back later.</p>
        </CardContent>
      </Card>
    );
  }

  const handleNavigation = (path: string, mfi: MfiInstitution) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_MFI_LIST_KEY, JSON.stringify(mfiData));
      router.push(`${path}?mfiName=${encodeURIComponent(mfi.name)}`);
    } catch (error) {
      console.error("Error saving MFI list to localStorage or navigating:", error);
      // Optionally, show a toast message to the user
    }
  };

  return (
    <Card className="mt-10 shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-teal-700">Recommended MFI Institutions</CardTitle>
        <CardDescription>
          Here are some Microfinance Institutions that match your loan application. Review their details and select one to proceed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-foreground/90">MFI Name</TableHead>
                <TableHead className="text-center font-semibold text-foreground/90"><Percent className="inline mr-1 h-4 w-4"/>Interest Rate</TableHead>
                <TableHead className="text-center font-semibold text-foreground/90"><Clock className="inline mr-1 h-4 w-4"/>Processing Time</TableHead>
                <TableHead className="text-center font-semibold text-foreground/90"><TrendingUp className="inline mr-1 h-4 w-4"/>Approval Rate</TableHead>
                <TableHead className="font-semibold text-foreground/90"><CheckSquare className="inline mr-1 h-4 w-4"/>Requirements</TableHead>
                <TableHead className="font-semibold text-foreground/90"><FileText className="inline mr-1 h-4 w-4"/>Loan Terms</TableHead>
                <TableHead className="text-right font-semibold text-foreground/90">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mfiData.map((mfi: MfiInstitution, index: number) => (
                <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{mfi.name}</TableCell>
                  <TableCell className="text-center">{mfi.interestRate}%</TableCell>
                  <TableCell className="text-center">{mfi.processingTime}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={mfi.approvalRate > 0.8 ? "default" : "secondary"} className={mfi.approvalRate > 0.8 ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"}>
                      {(mfi.approvalRate * 100).toFixed(0)}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside text-xs space-y-0.5">
                      {mfi.requirements.slice(0,3).map((req, i) => <li key={i}>{req}</li>)}
                      {mfi.requirements.length > 3 && <li>...and more</li>}
                    </ul>
                  </TableCell>
                  <TableCell className="text-xs whitespace-pre-line">{mfi.loanTerms}</TableCell>
                  <TableCell className="text-right space-y-1 md:space-y-0 md:space-x-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full md:w-auto"
                      onClick={() => handleNavigation('/apply/mfi-details', mfi)}
                    >
                      <Eye className="mr-1 h-3 w-3" /> Details
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="bg-accent text-accent-foreground hover:bg-accent/90 w-full md:w-auto"
                      onClick={() => handleNavigation('/kyc-upload', mfi)}
                    >
                      <FilePenLine className="mr-1 h-3 w-3" /> Apply
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
