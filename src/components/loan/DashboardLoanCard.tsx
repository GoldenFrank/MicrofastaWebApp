
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, DollarSign, Info, CheckCircle, AlertCircle, XCircle, Hourglass, Banknote, ListChecks, Shuffle } from "lucide-react";
import Link from "next/link";

export interface LoanApplication {
  id: string;
  amount: number;
  mfi?: string;
  status: 'Pending Review' | 'MFI Matched' | 'Approved' | 'Awaiting Disbursement' | 'Funds Disbursed' | 'Rejected';
  appliedDate: string;
  lastUpdate: string;
  repaymentStatus?: 'On Track' | 'Overdue' | 'Paid Off' | 'Defaulted' | 'N/A';
  buyOffEligible?: boolean;
  buyOffDetails?: string;
}

interface DashboardLoanCardProps {
  loan: LoanApplication;
}

const statusConfig = {
  'Pending Review': {
    color: "bg-yellow-500",
    textColor: "text-yellow-50",
    progress: 20,
    icon: <Hourglass className="w-4 h-4 mr-2" />,
    description: "Your application is currently under review."
  },
  'MFI Matched': {
    color: "bg-blue-500",
    textColor: "text-blue-50",
    progress: 40,
    icon: <Info className="w-4 h-4 mr-2" />,
    description: "We've matched you with potential MFIs. Review options."
  },
  'Approved': {
    color: "bg-green-500",
    textColor: "text-green-50",
    progress: 60,
    icon: <CheckCircle className="w-4 h-4 mr-2" />,
    description: "Congratulations! Your loan has been approved."
  },
  'Awaiting Disbursement': {
    color: "bg-teal-500",
    textColor: "text-teal-50",
    progress: 80,
    icon: <Banknote className="w-4 h-4 mr-2" />,
    description: "Funds are being prepared for disbursement to your account."
  },
  'Funds Disbursed': {
    color: "bg-purple-500",
    textColor: "text-purple-50",
    progress: 100,
    icon: <DollarSign className="w-4 h-4 mr-2" />,
    description: "Funds have been successfully disbursed to your account."
  },
  'Rejected': {
    color: "bg-red-500",
    textColor: "text-red-50",
    progress: 0,
    icon: <XCircle className="w-4 h-4 mr-2" />,
    description: "Unfortunately, your loan application was not approved."
  },
};


export default function DashboardLoanCard({ loan }: DashboardLoanCardProps) {
  const config = statusConfig[loan.status] || { color: "bg-gray-500", textColor: "text-gray-50", progress: 0, icon: <AlertCircle className="w-4 h-4 mr-2" />, description: "Status unknown." };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-headline">Loan Application #{loan.id.substring(0, 8)}</CardTitle>
          <Badge className={`${config.color} ${config.textColor} flex items-center`}>
            {config.icon}
            {loan.status}
          </Badge>
        </div>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
        <div className="flex items-center text-sm text-muted-foreground">
          <DollarSign className="w-4 h-4 mr-2 text-primary" />
          <span>Amount: <span className="font-semibold text-foreground">KSH {loan.amount.toLocaleString()}</span></span>
        </div>
        {loan.mfi && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Info className="w-4 h-4 mr-2 text-primary" />
            <span>MFI: <span className="font-semibold text-foreground">{loan.mfi}</span></span>
          </div>
        )}
        {loan.repaymentStatus && loan.repaymentStatus !== 'N/A' && (
          <div className="flex items-center text-sm text-muted-foreground">
            <ListChecks className="w-4 h-4 mr-2 text-primary" />
            <span>Repayment: <span className="font-semibold text-foreground">{loan.repaymentStatus}</span></span>
          </div>
        )}
        {loan.buyOffEligible !== undefined && (
           <div className="flex items-center text-sm text-muted-foreground">
            <Shuffle className="w-4 h-4 mr-2 text-primary" />
            <span>Buy-off: <span className="font-semibold text-foreground">{loan.buyOffEligible ? 'Eligible' : 'Not Eligible'}</span></span>
          </div>
        )}
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="w-4 h-4 mr-2 text-primary" />
          <span>Applied: <span className="font-semibold text-foreground">{new Date(loan.appliedDate).toLocaleDateString()}</span></span>
        </div>
         <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="w-4 h-4 mr-2 text-primary" />
          <span>Last Update: <span className="font-semibold text-foreground">{new Date(loan.lastUpdate).toLocaleDateString()}</span></span>
        </div>
        <div>
          <Progress value={config.progress} className="h-2 [&>*]:bg-primary" />
          <p className="text-xs text-muted-foreground mt-1 text-right">{config.progress}% Complete</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" asChild className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
          <Link href={`/dashboard/loan/${loan.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
