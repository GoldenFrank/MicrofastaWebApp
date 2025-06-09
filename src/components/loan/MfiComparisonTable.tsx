
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
import { Info, Percent, Clock, CheckSquare, Phone, TrendingUp, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

interface MfiComparisonTableProps {
  mfiData: MfiMatchingOutput;
}

export default function MfiComparisonTable({ mfiData }: MfiComparisonTableProps) {
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

  return (
    <Card className="mt-10 shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-teal-700">Recommended MFI Institutions</CardTitle>
        <CardDescription>
          Here are some Microfinance Institutions that match your loan application. Review their details and select one to see next steps.
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
                <TableHead className="font-semibold text-foreground/90"><Phone className="inline mr-1 h-4 w-4"/>Contact</TableHead>
                <TableHead className="text-right font-semibold text-foreground/90">Action</TableHead>
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
                  <TableCell className="text-xs">{mfi.loanTerms}</TableCell>
                  <TableCell>{mfi.contactInformation}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                      <Link href={`/apply/mfi-details?mfi=${encodeURIComponent(JSON.stringify(mfi))}`}>
                        Proceed <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
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
