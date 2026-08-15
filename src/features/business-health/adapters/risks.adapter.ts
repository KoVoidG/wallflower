// src/features/business-health/adapters/risks.adapter.ts
import type { DataConfidence } from '@/types/domain';

export type RiskCategory =
  | 'cash_flow'
  | 'revenue'
  | 'expense'
  | 'debt'
  | 'operational'
  | 'compliance'
  | 'growth'
  | 'financial';
export type RiskSeverity = 'critical' | 'high' | 'medium' | 'low' | 'warning';
export type RiskLikelihood = 'critical' | 'high' | 'medium' | 'low';
export type RiskStatus = 'active' | 'mitigated' | 'ignored';

export type DetailedRiskItem = {
  id: string;
  ruleId: string;
  title: string;
  category: RiskCategory;
  severity: RiskSeverity;
  likelihood: RiskLikelihood;
  probability?: RiskLikelihood;
  impact?: 'critical' | 'high' | 'medium' | 'low';
  estimatedExposure: number; // In THB
  expectedTiming: string;
  confidence: DataConfidence;
  evidence: string[];
  evidenceValues?: Record<string, number | string>;
  affectedMetrics: string[];
  recommendedMitigation: string;
  status: RiskStatus;
  owner?: string;
  mitigationScenario?: string;
};

export type DetectedRiskData = DetailedRiskItem;

export interface RiskSummaryData {
  overallScore: number;
  overallStatus: 'healthy' | 'warning' | 'critical';
  totalCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  warningCount: number;
  totalEstimatedExposure: number;
  lastAssessmentDate: string;
  isStale: boolean;
  isIncomplete: boolean;
}

export interface RisksData {
  summary: RiskSummaryData;
  risks: DetailedRiskItem[];
}

const MOCK_DETAILED_RISKS: DetailedRiskItem[] = [
  {
    id: 'risk-001',
    ruleId: 'CASH_DEFICIT_FEB',
    title: 'Projected Cash Deficit in Late February',
    category: 'cash_flow',
    severity: 'critical',
    likelihood: 'critical',
    probability: 'critical',
    impact: 'critical',
    estimatedExposure: 12400,
    expectedTiming: 'Feb 28, 2025',
    confidence: 'high',
    evidence: [
      'Monthly operating expenses (฿164,800) exceed expected customer inflows (฿152,400).',
      'Staff payroll of ฿85,000 due on Feb 28.',
      'Usable cash reserve stands at ฿245,000 against minimum safe buffer of ฿164,800.',
    ],
    evidenceValues: { netProfit: -12400, revenue: 152400, totalExpenses: 164800 },
    affectedMetrics: ['Cash Runway', 'Net Cash Flow', 'Usable Liquidity'],
    recommendedMitigation:
      'Negotiate early customer invoice collection or delay supplier payment terms by 15 days.',
    status: 'active',
    owner: 'Financial Officer',
    mitigationScenario: 'payment_delay',
  },
  {
    id: 'risk-002',
    ruleId: 'OVERDUE_RECEIVABLES_DRAG',
    title: '฿21,340 Overdue Receivables Dragging Runway',
    category: 'cash_flow',
    severity: 'critical',
    likelihood: 'high',
    probability: 'high',
    impact: 'high',
    estimatedExposure: 21340,
    expectedTiming: 'Immediate (Past Due)',
    confidence: 'high',
    evidence: [
      'Client Invoice #1042 (฿14,340) is 45 days overdue.',
      'Client Invoice #1038 (฿7,000) is 65 days overdue.',
      'Uncollected invoices represent 40% of total receivables outstanding.',
    ],
    evidenceValues: { receivablesRatio: 40, receivables: 21340 },
    affectedMetrics: ['Days Sales Outstanding (DSO)', 'Working Capital Ratio'],
    recommendedMitigation:
      'Offer 2% early settlement discount to expedite collection.',
    status: 'active',
    owner: 'Sales Operations',
    mitigationScenario: 'payment_delay',
  },
  {
    id: 'risk-003',
    ruleId: 'LANDLORD_RENT_INCREASE',
    title: 'Upcoming 5% Commercial Rent Increase',
    category: 'expense',
    severity: 'medium',
    likelihood: 'medium',
    probability: 'medium',
    impact: 'medium',
    estimatedExposure: 3500,
    expectedTiming: 'Mar 1, 2025',
    confidence: 'high',
    evidence: [
      'Landlord notification received for annual lease adjustment.',
      'Monthly rent will increase from ฿32,000 to ฿33,600.',
      'Increases monthly fixed operating burn by ฿1,600 recurring.',
    ],
    evidenceValues: { currentRent: 32000, newRent: 33600 },
    affectedMetrics: ['Operating Margin', 'Monthly Operating Expense'],
    recommendedMitigation:
      'Test price adjustments on primary products to absorb rent increase.',
    status: 'active',
    owner: 'General Manager',
    mitigationScenario: 'change_price',
  },
  {
    id: 'risk-004',
    ruleId: 'HIGH_PAYROLL_RATIO',
    title: 'Payroll Consuming 55.7% of Monthly Revenue',
    category: 'operational',
    severity: 'medium',
    likelihood: 'medium',
    probability: 'medium',
    impact: 'medium',
    estimatedExposure: 85000,
    expectedTiming: 'Recurring Monthly',
    confidence: 'high',
    evidence: [
      'Staff salaries (฿85,000) exceed target threshold of 50% revenue.',
      'Revenue per employee stands at ฿38,100/mo.',
    ],
    evidenceValues: { payrollRatio: 55.7, payrollAmount: 85000 },
    affectedMetrics: ['Operating Efficiency', 'Payroll-to-Revenue Ratio'],
    recommendedMitigation:
      'Simulate headcount productivity expansion before adding new hires.',
    status: 'active',
    owner: 'HR Lead',
    mitigationScenario: 'hire_employees',
  },
  {
    id: 'risk-005',
    ruleId: 'EQUIPMENT_CAPEX_PRESSURE',
    title: 'Kitchen Equipment Replacement Capital Expense',
    category: 'operational',
    severity: 'medium',
    likelihood: 'medium',
    probability: 'medium',
    impact: 'medium',
    estimatedExposure: 200000,
    expectedTiming: 'Apr 15, 2025',
    confidence: 'medium',
    evidence: [
      'Primary commercial oven requires replacement after 5 years service.',
      'Outright cash purchase (฿200,000) would reduce cash runway to 0.8 months.',
    ],
    evidenceValues: { capexCost: 200000, usefulLife: 5 },
    affectedMetrics: ['Cash Buffer', 'Capital Expenditure'],
    recommendedMitigation:
      'Explore equipment leasing or SME bank financing to preserve liquidity.',
    status: 'active',
    owner: 'Operations Manager',
    mitigationScenario: 'purchase_equipment',
  },
  {
    id: 'risk-006',
    ruleId: 'MARKETING_ACQUISITION_EFFICIENCY',
    title: 'Digital Ad Acquisition Cost Inflation',
    category: 'growth',
    severity: 'low',
    likelihood: 'low',
    probability: 'low',
    impact: 'low',
    estimatedExposure: 12000,
    expectedTiming: 'May 1, 2025',
    confidence: 'medium',
    evidence: [
      'Ad cost per click increased 12% across social media channels.',
      'Customer acquisition ratio holds at 2.4x return.',
    ],
    evidenceValues: { marketingSpend: 12000, roi: 2.4 },
    affectedMetrics: ['Reinvestment Capacity', 'Marketing ROI'],
    recommendedMitigation:
      'Simulate targeted social ad spend vs offline promo mix.',
    status: 'active',
    owner: 'Marketing Lead',
    mitigationScenario: 'invest_marketing',
  },
];

export async function getRisksData(): Promise<RisksData> {
  await new Promise((resolve) => setTimeout(resolve, 350));

  const activeRisks = MOCK_DETAILED_RISKS.filter((r) => r.status === 'active');
  const criticalCount = activeRisks.filter((r) => r.severity === 'critical').length;
  const highCount = activeRisks.filter((r) => r.severity === 'high').length;
  const mediumCount = activeRisks.filter((r) => r.severity === 'medium').length;
  const warningCount = highCount + mediumCount;

  const totalEstimatedExposure = activeRisks.reduce(
    (sum, r) => sum + r.estimatedExposure,
    0,
  );

  const rawScore = Math.max(
    0,
    100 - criticalCount * 25 - highCount * 15 - mediumCount * 5,
  );
  const overallStatus: RiskSummaryData['overallStatus'] =
    rawScore >= 70 ? 'healthy' : rawScore >= 40 ? 'warning' : 'critical';

  return {
    summary: {
      overallScore: rawScore,
      overallStatus,
      totalCount: MOCK_DETAILED_RISKS.length,
      criticalCount,
      highCount,
      mediumCount,
      warningCount,
      totalEstimatedExposure,
      lastAssessmentDate: '2025-01-15',
      isStale: false,
      isIncomplete: false,
    },
    risks: MOCK_DETAILED_RISKS,
  };
}
