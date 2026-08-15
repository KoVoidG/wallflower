// src/features/business-health/lib/thresholds.ts
/**
 * Deterministic Diagnostic Threshold Logic & Assessment Rules
 * Evaluates metric posture, status badges, and business health diagnostic depth.
 * Strictly decoupled from React presentation components.
 */

export type HealthPostureStatus = 'Strong' | 'Stable' | 'Watch' | 'Needs attention' | 'Insufficient data';
export type QualityRating = 'actual' | 'estimated' | 'sample' | 'missing';

export interface MetricEvaluation {
  id: string;
  name: string;
  currentValue: number | string;
  previousValue: number | string;
  unit?: string;
  formattedValue: string;
  formattedPrevious: string;
  status: HealthPostureStatus;
  changeDirection: 'up' | 'down' | 'flat';
  contributionScore: number; // 0 - 100 relative impact
  quality: QualityRating;
}

export interface RecommendedActionLink {
  label: string;
  href: string;
  isPrimary?: boolean;
}

export interface AssessmentAssessmentDisclosure {
  contributingMetricsCount: number;
  estimatedInputsCount: number;
  missingInputsCount: number;
  relativeImportanceSummary: string;
  confidenceNote: string;
}

export interface HealthDimensionDiagnostic {
  id: string;
  title: string;
  score: number;
  status: HealthPostureStatus;
  recentTrend: 'improving' | 'stable' | 'declining';
  changeSummary: string;
  likelyCause: string;
  explanation: string;
  whyItMatters: string;
  confidence: 'high' | 'medium' | 'low';
  dataQualityBadge: QualityRating;
  metrics: MetricEvaluation[];
  primaryAction: RecommendedActionLink;
  secondaryActions: RecommendedActionLink[];
  assessmentDisclosure: AssessmentAssessmentDisclosure;
  history?: { period: string; score: number }[];
}

/**
 * Metric Threshold Rules (Explicitly documented prototype thresholds)
 */
export const THRESHOLD_RULES = {
  cashRunwayMonths: {
    strong: 6.0,      // >= 6 months = Strong
    stable: 3.0,      // 3.0 - 5.9 months = Stable
    watch: 2.0,       // 2.0 - 2.9 months = Watch
    needsAttention: 0, // < 2.0 months = Needs attention
  },
  operatingMarginPercent: {
    strong: 20.0,
    stable: 10.0,
    watch: 5.0,
    needsAttention: 0,
  },
  overdueReceivablesRatioPercent: {
    strong: 5.0,      // < 5% overdue = Strong
    stable: 15.0,     // 5 - 15% = Stable
    watch: 25.0,      // 15 - 25% = Watch
    needsAttention: 25.0, // > 25% = Needs attention
  },
  debtToRevenuePercent: {
    strong: 15.0,
    stable: 30.0,
    watch: 50.0,
    needsAttention: 50.0,
  },
  payrollToRevenuePercent: {
    strong: 40.0,
    stable: 55.0,
    watch: 65.0,
    needsAttention: 65.0,
  },
  customerAcquisitionRatio: {
    strong: 3.0,
    stable: 2.0,
    watch: 1.2,
    needsAttention: 1.0,
  },
};

/**
 * Evaluates numeric metric status against explicitly documented threshold rules.
 */
export function evaluateMetricStatus(
  metricKey: keyof typeof THRESHOLD_RULES,
  value: number,
  isLowerBetter = false
): HealthPostureStatus {
  const rule = THRESHOLD_RULES[metricKey];
  if (!rule) return 'Stable';

  if (isLowerBetter) {
    if (value <= rule.strong) return 'Strong';
    if (value <= rule.stable) return 'Stable';
    if (value <= rule.watch) return 'Watch';
    return 'Needs attention';
  } else {
    if (value >= rule.strong) return 'Strong';
    if (value >= rule.stable) return 'Stable';
    if (value >= rule.watch) return 'Watch';
    return 'Needs attention';
  }
}

/**
 * Comprehensive Diagnostic Dimensions Adapter
 */
export function getDiagnosticDimensions(): HealthDimensionDiagnostic[] {
  return [
    {
      id: 'liquidity',
      title: 'Liquidity & Runway Buffer',
      score: 62,
      status: 'Watch',
      recentTrend: 'declining',
      changeSummary: 'Cash runway contracted from 2.5 to 2.1 months over the past quarter.',
      likelyCause: 'Net operating burn remained steady at ฿164,800/mo while uncollected receivables delayed cash inflows.',
      explanation: 'Liquidity pressure is elevated because available cash reserves (฿245,000) hover near the 1-month safety threshold (฿164,800).',
      whyItMatters: 'A runway below 3 months limits your flexibility to handle unexpected supplier cost spikes or revenue shocks without external financing.',
      confidence: 'high',
      dataQualityBadge: 'actual',
      metrics: [
        {
          id: 'm-runway',
          name: 'Cash Runway',
          currentValue: 2.1,
          previousValue: 2.5,
          unit: 'mo',
          formattedValue: '2.1 months',
          formattedPrevious: '2.5 months',
          status: 'Watch',
          changeDirection: 'down',
          contributionScore: 40,
          quality: 'actual',
        },
        {
          id: 'm-usable-cash',
          name: 'Usable Cash Balance',
          currentValue: 245000,
          previousValue: 260000,
          unit: 'THB',
          formattedValue: '฿245,000',
          formattedPrevious: '฿260,000',
          status: 'Watch',
          changeDirection: 'down',
          contributionScore: 35,
          quality: 'actual',
        },
        {
          id: 'm-min-buffer',
          name: 'Minimum Safe Buffer',
          currentValue: 164800,
          previousValue: 160000,
          unit: 'THB',
          formattedValue: '฿164,800',
          formattedPrevious: '฿160,000',
          status: 'Stable',
          changeDirection: 'up',
          contributionScore: 25,
          quality: 'actual',
        },
      ],
      primaryAction: { label: 'Simulate Payment Delay', href: '/simulations', isPrimary: true },
      secondaryActions: [
        { label: 'Open Financial Health', href: '/business-health' },
        { label: 'Review Liquidity Risk', href: '/business-health?tab=risks' },
      ],
      assessmentDisclosure: {
        contributingMetricsCount: 3,
        estimatedInputsCount: 0,
        missingInputsCount: 0,
        relativeImportanceSummary: 'Cash runway accounts for 40% of this dimension weight.',
        confidenceNote: 'High confidence based on verified actual bank account snapshots.',
      },
      history: [
        { period: 'Nov 2024', score: 72 },
        { period: 'Dec 2024', score: 68 },
        { period: 'Jan 2025', score: 62 },
      ],
    },
    {
      id: 'profitability',
      title: 'Profitability & Margins',
      score: 78,
      status: 'Strong',
      recentTrend: 'improving',
      changeSummary: 'Operating margin expanded by 2.1 percentage points over last month.',
      likelyCause: 'Revenue grew 8.2% to ฿152,400 while fixed costs remained flat.',
      explanation: 'Profitability expanded cleanly due to premium service pricing and steady sales velocity in core products.',
      whyItMatters: 'Healthy operating margins provide a protective cushion against inflation and generate internal capital for reinvestment.',
      confidence: 'high',
      dataQualityBadge: 'actual',
      metrics: [
        {
          id: 'm-op-profit',
          name: 'Monthly Operating Profit',
          currentValue: 28200,
          previousValue: 24600,
          unit: 'THB',
          formattedValue: '฿28,200',
          formattedPrevious: '฿24,600',
          status: 'Strong',
          changeDirection: 'up',
          contributionScore: 50,
          quality: 'actual',
        },
        {
          id: 'm-op-margin',
          name: 'Operating Margin',
          currentValue: 18.5,
          previousValue: 16.4,
          unit: '%',
          formattedValue: '18.5%',
          formattedPrevious: '16.4%',
          status: 'Strong',
          changeDirection: 'up',
          contributionScore: 50,
          quality: 'actual',
        },
      ],
      primaryAction: { label: 'Simulate Price Adjustment', href: '/simulations/new?type=change_price', isPrimary: true },
      secondaryActions: [
        { label: 'View Revenue & Profit Trend', href: '/dashboard' },
        { label: 'Ask Capybot for Margin Advice', href: '/business-health?tab=assumptions' },
      ],
      assessmentDisclosure: {
        contributingMetricsCount: 2,
        estimatedInputsCount: 0,
        missingInputsCount: 0,
        relativeImportanceSummary: 'Operating margin weighted equally with net profit velocity.',
        confidenceNote: 'High confidence based on verified sales and expense inputs.',
      },
      history: [
        { period: 'Nov 2024', score: 70 },
        { period: 'Dec 2024', score: 74 },
        { period: 'Jan 2025', score: 78 },
      ],
    },
    {
      id: 'working-capital',
      title: 'Working Capital & Collections',
      score: 45,
      status: 'Needs attention',
      recentTrend: 'declining',
      changeSummary: 'Overdue receivables rose to ฿21,340, representing 40% of total uncollected customer invoices.',
      likelyCause: 'Two key wholesale clients exceeded standard 30-day payment terms by over 2 weeks.',
      explanation: 'Working-capital pressure increased because overdue receivables rose while supplier obligations due within 30 days remained high.',
      whyItMatters: 'Delayed collections force the business to finance working capital out of cash reserves, directly shortening your runway.',
      confidence: 'medium',
      dataQualityBadge: 'estimated',
      metrics: [
        {
          id: 'm-overdue-rec',
          name: 'Overdue Receivables Ratio',
          currentValue: 40.0,
          previousValue: 28.0,
          unit: '%',
          formattedValue: '40.0%',
          formattedPrevious: '28.0%',
          status: 'Needs attention',
          changeDirection: 'up', // higher overdue is bad
          contributionScore: 60,
          quality: 'estimated',
        },
        {
          id: 'm-dso',
          name: 'Days Sales Outstanding (DSO)',
          currentValue: 42,
          previousValue: 35,
          unit: 'days',
          formattedValue: '42 days',
          formattedPrevious: '35 days',
          status: 'Watch',
          changeDirection: 'up',
          contributionScore: 40,
          quality: 'estimated',
        },
      ],
      primaryAction: { label: 'Review Overdue Invoices in Operations', href: '/business-health?tab=operations', isPrimary: true },
      secondaryActions: [
        { label: 'Simulate Customer Payment Delay', href: '/simulations' },
        { label: 'Open Collection Risk Details', href: '/business-health?tab=risks' },
      ],
      assessmentDisclosure: {
        contributingMetricsCount: 2,
        estimatedInputsCount: 1,
        missingInputsCount: 0,
        relativeImportanceSummary: 'Overdue receivables ratio accounts for 60% of this dimension.',
        confidenceNote: 'Medium confidence because payment dates for 1 client are estimated.',
      },
      history: [
        { period: 'Nov 2024', score: 58 },
        { period: 'Dec 2024', score: 52 },
        { period: 'Jan 2025', score: 45 },
      ],
    },
    {
      id: 'debt-pressure',
      title: 'Debt Pressure & Obligations',
      score: 70,
      status: 'Stable',
      recentTrend: 'stable',
      changeSummary: 'Monthly debt service (฿15,000) remained stable at 9.8% of monthly revenue.',
      likelyCause: 'Fixed-rate SME bank loan installment on regular monthly schedule.',
      explanation: 'Debt pressure is well within safe thresholds (under 15% of revenue), leaving room for emergency credit access if required.',
      whyItMatters: 'Predictable debt service ensures regular bank compliance without draining cash reserves required for daily ops.',
      confidence: 'high',
      dataQualityBadge: 'actual',
      metrics: [
        {
          id: 'm-debt-service',
          name: 'Monthly Debt Service',
          currentValue: 15000,
          previousValue: 15000,
          unit: 'THB',
          formattedValue: '฿15,000',
          formattedPrevious: '฿15,000',
          status: 'Stable',
          changeDirection: 'flat',
          contributionScore: 50,
          quality: 'actual',
        },
        {
          id: 'm-debt-ratio',
          name: 'Debt-to-Revenue Ratio',
          currentValue: 9.8,
          previousValue: 10.6,
          unit: '%',
          formattedValue: '9.8%',
          formattedPrevious: '10.6%',
          status: 'Strong',
          changeDirection: 'down',
          contributionScore: 50,
          quality: 'actual',
        },
      ],
      primaryAction: { label: 'Simulate Equipment Loan Financing', href: '/simulations', isPrimary: true },
      secondaryActions: [
        { label: 'Review Upcoming Debt Payables', href: '/business-health?tab=financial' },
      ],
      assessmentDisclosure: {
        contributingMetricsCount: 2,
        estimatedInputsCount: 0,
        missingInputsCount: 0,
        relativeImportanceSummary: 'Debt service coverage weighted equally with total debt leverage.',
        confidenceNote: 'High confidence based on contractual bank loan schedules.',
      },
      history: [
        { period: 'Nov 2024', score: 68 },
        { period: 'Dec 2024', score: 70 },
        { period: 'Jan 2025', score: 70 },
      ],
    },
    {
      id: 'operating-efficiency',
      title: 'Operating Efficiency & Cost Structure',
      score: 65,
      status: 'Stable',
      recentTrend: 'stable',
      changeSummary: 'Payroll costs (฿85,000) represent 55.7% of total monthly revenue.',
      likelyCause: 'Full-time staff headcount remains consistent with baseline operating capacity.',
      explanation: 'Operating cost structure is manageable but payroll consumes more than half of monthly income.',
      whyItMatters: 'High fixed labor cost ratio means sales slowdowns directly compress profitability unless revenue per employee increases.',
      confidence: 'high',
      dataQualityBadge: 'actual',
      metrics: [
        {
          id: 'm-payroll-ratio',
          name: 'Payroll-to-Revenue Ratio',
          currentValue: 55.7,
          previousValue: 60.2,
          unit: '%',
          formattedValue: '55.7%',
          formattedPrevious: '60.2%',
          status: 'Stable',
          changeDirection: 'down',
          contributionScore: 60,
          quality: 'actual',
        },
        {
          id: 'm-fixed-expense',
          name: 'Fixed Rent & Utilities',
          currentValue: 39400,
          previousValue: 39400,
          unit: 'THB',
          formattedValue: '฿39,400',
          formattedPrevious: '฿39,400',
          status: 'Stable',
          changeDirection: 'flat',
          contributionScore: 40,
          quality: 'actual',
        },
      ],
      primaryAction: { label: 'Simulate Employee Hiring Impact', href: '/simulations/new?type=hire_employees', isPrimary: true },
      secondaryActions: [
        { label: 'View Expense Breakdown', href: '/dashboard' },
        { label: 'Ask Capybot for Cost Control', href: '/business-health?tab=operations' },
      ],
      assessmentDisclosure: {
        contributingMetricsCount: 2,
        estimatedInputsCount: 0,
        missingInputsCount: 0,
        relativeImportanceSummary: 'Payroll ratio accounts for 60% of operating efficiency score.',
        confidenceNote: 'High confidence based on payroll and rent receipts.',
      },
      history: [
        { period: 'Nov 2024', score: 62 },
        { period: 'Dec 2024', score: 64 },
        { period: 'Jan 2025', score: 65 },
      ],
    },
    {
      id: 'growth-readiness',
      title: 'Growth Readiness & Expansion Margin',
      score: 55,
      status: 'Watch',
      recentTrend: 'improving',
      changeSummary: 'Reinvestment capacity increased with marketing campaign returns.',
      likelyCause: 'Digital ad campaign generated 15% increase in lead conversion.',
      explanation: 'Growth capacity is moderate: marketing ROI is positive, but cash reserves are insufficient to fund major capital expansion without financing.',
      whyItMatters: 'Attempting rapid growth before stabilizing working capital risks triggering a cash crunch.',
      confidence: 'medium',
      dataQualityBadge: 'sample',
      metrics: [
        {
          id: 'm-marketing-roi',
          name: 'Marketing Campaign ROI',
          currentValue: '2.4x',
          previousValue: '2.0x',
          formattedValue: '2.4x return',
          formattedPrevious: '2.0x return',
          status: 'Stable',
          changeDirection: 'up',
          contributionScore: 50,
          quality: 'sample',
        },
        {
          id: 'm-reinvest-cap',
          name: 'Reinvestment Capacity',
          currentValue: 12000,
          previousValue: 8000,
          unit: 'THB',
          formattedValue: '฿12,000/mo',
          formattedPrevious: '฿8,000/mo',
          status: 'Watch',
          changeDirection: 'up',
          contributionScore: 50,
          quality: 'estimated',
        },
      ],
      primaryAction: { label: 'Simulate Marketing Investment', href: '/simulations/new?type=invest_marketing', isPrimary: true },
      secondaryActions: [
        { label: 'Simulate Equipment Purchase', href: '/simulations/new?type=purchase_equipment' },
      ],
      assessmentDisclosure: {
        contributingMetricsCount: 2,
        estimatedInputsCount: 1,
        missingInputsCount: 0,
        relativeImportanceSummary: 'Reinvestment capacity and marketing efficiency weighted equally.',
        confidenceNote: 'Medium confidence because marketing attribution is sample-based.',
      },
      history: [
        { period: 'Nov 2024', score: 48 },
        { period: 'Dec 2024', score: 52 },
        { period: 'Jan 2025', score: 55 },
      ],
    },
  ];
}
