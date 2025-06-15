
export interface DetailedLoanApplication {
  id: string;
  amount: number;
  mfi: string;
  status: string;
  appliedDate: string;
  lastUpdate: string;
  interestRate?: number;
  termMonths?: number;
  monthlyPayment?: number;
  repaymentStatus?: string;
  collateralDetails?: string;
  applicantNotes?: string;
  mfiContact?: string;
}

const mockLoanDetailsData: DetailedLoanApplication[] = [
  {
    id: 'L001AXYZ',
    amount: 50000,
    mfi: 'Faulu Kenya',
    status: 'KYC Submitted',
    appliedDate: '2024-07-01',
    lastUpdate: '2024-07-15',
    interestRate: 13.5,
    termMonths: 12,
    monthlyPayment: 4500,
    repaymentStatus: 'N/A',
    collateralDetails: 'Toyota Axio KDA 123X, 2015',
    applicantNotes: 'Urgent need for business expansion.',
    mfiContact: '0711074000 / 0709700000'
  },
  {
    id: 'L002BCDE',
    amount: 120000,
    mfi: 'Platinum Credit',
    status: 'MFI Reviewing Docs',
    appliedDate: '2024-06-15',
    lastUpdate: '2024-07-10',
    interestRate: 15.0,
    termMonths: 24,
    monthlyPayment: 5800,
    repaymentStatus: 'N/A',
    collateralDetails: 'Nissan Navara KDB 456Y, 2019',
    applicantNotes: 'Consolidating existing debts.',
    mfiContact: '0709900000'
  },
  {
    id: 'L003FGHI',
    amount: 75000,
    status: 'Funds Disbursed',
    mfi: 'Letshego',
    appliedDate: '2024-05-20',
    lastUpdate: '2024-06-05',
    repaymentStatus: 'On Track',
    interestRate: 14.2,
    termMonths: 18,
    monthlyPayment: 4650,
    collateralDetails: 'Mazda Demio KDC 789Z, 2017',
    mfiContact: '0800724700'
  },
  {
    id: 'L004JKLM',
    amount: 30000,
    status: 'Rejected',
    mfi: 'Jijenge Credit',
    appliedDate: '2024-07-05',
    lastUpdate: '2024-07-08',
    collateralDetails: 'Honda Fit KDD 012E, 2010',
    applicantNotes: 'Income verification was insufficient.',
    mfiContact: '0711280000'
  },
  {
    id: 'L005MNOP',
    amount: 95000,
    status: 'Funds Disbursed',
    mfi: 'Izwe Kenya',
    appliedDate: '2024-04-10',
    lastUpdate: '2024-07-01',
    repaymentStatus: 'Overdue',
    interestRate: 14.5,
    termMonths: 20,
    monthlyPayment: 5500,
    collateralDetails: 'Subaru Forester KDF 345G, 2016',
    mfiContact: '0207602000'
  },
  {
    id: 'L006QRST',
    amount: 60000,
    status: 'Funds Disbursed',
    mfi: 'Premier Credit',
    appliedDate: '2023-12-01',
    lastUpdate: '2024-06-20',
    repaymentStatus: 'Paid Off',
    interestRate: 16.0,
    termMonths: 12,
    collateralDetails: 'Toyota Vitz KDG 678H, 2014',
    mfiContact: '0709176000'
  },
  {
    id: 'L007DEFG',
    amount: 80000,
    mfi: 'Asa Kenya',
    status: 'KYC Pending',
    appliedDate: '2024-07-18',
    lastUpdate: '2024-07-19',
    collateralDetails: 'Mitsubishi Lancer KDH 901J, 2013',
    mfiContact: '0205151039'
  },
  {
    id: 'L008HIJK',
    amount: 45000,
    status: 'MFI Matched',
    appliedDate: '2024-07-20',
    lastUpdate: '2024-07-21',
    collateralDetails: 'Suzuki Alto KDJ 112K, 2012',
    mfi: 'Momentum Credit', // Example, could be another MFI
    mfiContact: '0709434000'
  }
];

export async function getLoanDetailsById(id: string): Promise<DetailedLoanApplication | undefined> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockLoanDetailsData.find(loan => loan.id === id);
}
