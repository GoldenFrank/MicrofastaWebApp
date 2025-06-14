
import type { LoanApplication } from '@/components/loan/DashboardLoanCard';

// The LoanApplication interface in DashboardLoanCard.tsx already includes:
// buyOffEligible?: boolean;
// buyOffDetails?: string;
// So, this LoanDetail type is consistent.
type LoanDetail = LoanApplication & {
  detailedNotes?: string;
  mfiContact?: string;
  // buyOffDetails is already optional in LoanApplication via DashboardLoanCard
};

export const mockLoanDetails: Record<string, LoanDetail> = {
  'L001AXYZ': {
    id: 'L001AXYZ',
    amount: 50000,
    mfi: 'Faulu Kenya',
    status: 'KYC Submitted',
    appliedDate: '2024-07-01',
    lastUpdate: '2024-07-15',
    repaymentStatus: 'N/A',
    buyOffEligible: false,
    detailedNotes: "Initial documents uploaded. Awaiting review from Faulu Kenya's team. User was responsive during initial contact.",
    mfiContact: "0711074000",
  },
  'L007DEFG': {
    id: 'L007DEFG',
    amount: 80000,
    mfi: 'Asa Kenya',
    status: 'KYC Pending',
    appliedDate: '2024-07-18',
    lastUpdate: '2024-07-19',
    repaymentStatus: 'N/A',
    buyOffEligible: false,
    detailedNotes: "MFI match confirmed. User needs to select Asa Kenya from the apply page and upload KYC documents to proceed.",
    mfiContact: "Check MFI details page",
  },
  'L002BCDE': {
    id: 'L002BCDE',
    amount: 120000,
    mfi: 'Platinum Credit',
    status: 'MFI Reviewing Docs',
    appliedDate: '2024-06-15',
    lastUpdate: '2024-07-10',
    repaymentStatus: 'N/A',
    buyOffEligible: true,
    buyOffDetails: 'Eligible for buy-off with select partners after 6 months of consistent repayment. Current valuation allows up to KES 90,000 buy-off.',
    detailedNotes: "All documents received by Platinum Credit. Currently under final assessment. Expected turnaround: 2 business days.",
    mfiContact: "0709900000",
  },
  'L003FGHI': {
    id: 'L003FGHI',
    amount: 75000,
    status: 'Funds Disbursed',
    mfi: 'Letshego',
    appliedDate: '2024-05-20',
    lastUpdate: '2024-06-05',
    repaymentStatus: 'On Track',
    buyOffEligible: true,
    buyOffDetails: 'Competitive buy-off offers available through MicroFasta network. User has made 2 payments on time.',
    detailedNotes: "Loan disbursed successfully. First repayment due on 2024-07-05.",
    mfiContact: "0709760000",
  },
  'L004JKLM': {
    id: 'L004JKLM',
    amount: 30000,
    status: 'Rejected',
    mfi: 'Jijenge Credit',
    appliedDate: '2024-07-05',
    lastUpdate: '2024-07-08',
    repaymentStatus: 'N/A',
    buyOffEligible: false,
    detailedNotes: "Application rejected by Jijenge Credit due to vehicle age exceeding their policy limits.",
    mfiContact: "0711280000",
  },
   'L005MNOP': {
    id: 'L005MNOP',
    amount: 95000,
    status: 'Funds Disbursed',
    mfi: 'Izwe Kenya',
    appliedDate: '2024-04-10',
    lastUpdate: '2024-07-01',
    repaymentStatus: 'Overdue',
    buyOffEligible: false,
    detailedNotes: "Loan disbursed. One payment is currently overdue by 7 days. Automated reminders sent.",
    mfiContact: "0207602000",
  },
  'L006QRST': {
    id: 'L006QRST',
    amount: 60000,
    status: 'Funds Disbursed',
    mfi: 'Premier Credit',
    appliedDate: '2023-12-01',
    lastUpdate: '2024-06-20',
    repaymentStatus: 'Paid Off',
    buyOffEligible: false,
    detailedNotes: "Loan fully repaid by the user. Account closed in good standing.",
    mfiContact: "070PREMIER",
  },
  'L008HIJK': {
    id: 'L008HIJK',
    amount: 45000,
    mfi: 'Momentum Credit',
    status: 'MFI Matched',
    appliedDate: '2024-07-20',
    lastUpdate: '2024-07-21',
    repaymentStatus: 'N/A',
    buyOffEligible: false,
    detailedNotes: "Applicant matched with Momentum Credit. Awaiting applicant to proceed by selecting Momentum Credit on the apply page and submitting KYC docs.",
    mfiContact: "0709434000",
  }
};
