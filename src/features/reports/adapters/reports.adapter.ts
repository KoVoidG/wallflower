// src/features/reports/adapters/reports.adapter.ts

export type ReportPosture = 'healthy' | 'cautious' | 'critical';

export type RiskSeverity = 'critical' | 'warning';

export interface ReportMetric {
  label: string;
  value: number;
  formatted: string;
  change?: number; // percentage change
  changeDirection?: 'up' | 'down' | 'flat';
}

export interface ReportRisk {
  title: string;
  severity: RiskSeverity;
  evidence: string;
}

export interface SimulationCase {
  revenue: number;
  expenses: number;
  profit: number;
  cashRunway: number;
}

export interface ActionItem {
  text: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ActionPhase {
  label: string;
  items: ActionItem[];
}

export interface ReportCover {
  businessName: string;
  reportTitle: string;
  generatedDate: string;
  dataThroughDate: string;
  calculationVersion: string;
  reportVersion: string;
}

export interface ReportExecutiveSummary {
  overview: string;
  keyTakeaway: string;
  posture: ReportPosture;
}

export interface ReportMetrics {
  items: ReportMetric[];
}

export interface ReportRiskAnalysis {
  criticalCount: number;
  warningCount: number;
  risks: ReportRisk[];
  isIncomplete: boolean;
}

export interface ReportSimulation {
  scenarioName: string;
  scenarioType: string;
  bestCase: SimulationCase;
  expectedCase: SimulationCase;
  worstCase: SimulationCase;
  baselineCase: SimulationCase;
}

export interface ReportRecommendation {
  summary: string;
  actions: string[];
  confidenceNote: string;
}

export interface ReportActionPlan {
  phases: ActionPhase[];
}

export interface ReportMetadataInfo {
  dataThroughDate: string;
  calculationVersion: string;
  reportVersion: string;
  assumptions: string[];
  disclaimer: string;
}

export interface ReportData {
  id: string;
  cover: ReportCover;
  executiveSummary: ReportExecutiveSummary;
  metrics: ReportMetrics;
  riskAnalysis: ReportRiskAnalysis;
  simulation: ReportSimulation;
  recommendation: ReportRecommendation;
  actionPlan: ReportActionPlan;
  metadata: ReportMetadataInfo;
}

export interface SavedReport {
  id: string;
  name: string;
  businessName: string;
  generatedDate: string;
  scenarioType: string;
}

// --- Mock Data ---

const MOCK_REPORT: ReportData = {
  id: 'rpt-001',
  cover: {
    businessName: 'GreenCafe',
    reportTitle: 'Monthly Decision Intelligence Report',
    generatedDate: '2025-01-15',
    dataThroughDate: '2024-12-31',
    calculationVersion: '1.2.0',
    reportVersion: '1',
  },
  executiveSummary: {
    overview:
      'GreenCafe maintains a cautious financial position with steady revenue of ฿320,000/month but declining margins due to rising supply costs. Cash runway remains at 4.2 months, which is adequate but below the recommended 6-month buffer. The business shows resilience in customer retention but needs to address expense growth.',
    keyTakeaway:
      'Expense growth is outpacing revenue gains. Action on cost control within 30 days is recommended to prevent runway erosion.',
    posture: 'cautious',
  },
  metrics: {
    items: [
      { label: 'Revenue', value: 320000, formatted: '฿320,000', change: 5.2, changeDirection: 'up' },
      { label: 'Expenses', value: 285000, formatted: '฿285,000', change: 8.1, changeDirection: 'up' },
      { label: 'Profit', value: 35000, formatted: '฿35,000', change: -12.5, changeDirection: 'down' },
      { label: 'Cash Runway', value: 4.2, formatted: '4.2 months', change: -0.8, changeDirection: 'down' },
      { label: 'Working Capital', value: 180000, formatted: '฿180,000', change: -3.2, changeDirection: 'down' },
      { label: 'Profit Margin', value: 10.9, formatted: '10.9%', change: -2.1, changeDirection: 'down' },
    ],
  },
  riskAnalysis: {
    criticalCount: 1,
    warningCount: 2,
    risks: [
      {
        title: 'Rapid Expense Growth',
        severity: 'critical',
        evidence: 'Expenses grew 8.1% month-over-month, exceeding revenue growth of 5.2%.',
      },
      {
        title: 'Declining Profit Margin',
        severity: 'warning',
        evidence: 'Profit margin dropped from 13.0% to 10.9% over the past 3 months.',
      },
      {
        title: 'Below-Target Cash Runway',
        severity: 'warning',
        evidence: 'Cash runway of 4.2 months is below the recommended 6-month buffer.',
      },
    ],
    isIncomplete: false,
  },
  simulation: {
    scenarioName: 'Reduce Supply Costs',
    scenarioType: 'Cost Optimization',
    bestCase: { revenue: 330000, expenses: 255000, profit: 75000, cashRunway: 6.1 },
    expectedCase: { revenue: 320000, expenses: 265000, profit: 55000, cashRunway: 5.2 },
    worstCase: { revenue: 310000, expenses: 280000, profit: 30000, cashRunway: 3.8 },
    baselineCase: { revenue: 320000, expenses: 285000, profit: 35000, cashRunway: 4.2 },
  },
  recommendation: {
    summary:
      'Negotiate with existing suppliers for volume discounts and explore alternative sourcing for your top 3 cost categories. Combined with a modest price adjustment of 3-5%, this can restore margins to 14%+ within 60 days.',
    actions: [
      'Request quotes from 2 alternative suppliers for coffee beans and dairy',
      'Negotiate 10% volume discount with current packaging supplier',
      'Implement a 3% price increase on premium menu items',
      'Reduce food waste by implementing daily prep forecasting',
      'Review staffing schedule for off-peak hour optimization',
    ],
    confidenceNote:
      'Medium confidence — projections assume stable customer demand and supplier willingness to negotiate. Actual results may vary by ±15%.',
  },
  actionPlan: {
    phases: [
      {
        label: '0–30 days',
        items: [
          { text: 'Audit top 5 expense categories and identify reduction targets', priority: 'high' },
          { text: 'Request supplier quotes and initiate negotiations', priority: 'high' },
          { text: 'Implement daily food prep forecasting to reduce waste', priority: 'medium' },
        ],
      },
      {
        label: '31–60 days',
        items: [
          { text: 'Finalize new supplier contracts or pricing agreements', priority: 'high' },
          { text: 'Test 3% price increase on selected premium items', priority: 'medium' },
          { text: 'Optimize staffing schedule based on traffic patterns', priority: 'medium' },
        ],
      },
      {
        label: '61–90 days',
        items: [
          { text: 'Evaluate impact of changes on margins and runway', priority: 'high' },
          { text: 'Roll out price adjustments to remaining menu if test succeeds', priority: 'low' },
          { text: 'Set up monthly expense review process', priority: 'low' },
        ],
      },
    ],
  },
  metadata: {
    dataThroughDate: '2024-12-31',
    calculationVersion: '1.2.0',
    reportVersion: '1',
    assumptions: [
      'Revenue projections assume stable customer traffic patterns',
      'Expense reductions assume supplier willingness to negotiate',
      'Cash runway calculated using trailing 3-month average burn rate',
      'Seasonal variations not modeled in this analysis',
    ],
    disclaimer:
      'This report is for informational purposes only and does not constitute financial, legal, or professional advice. All projections are based on historical data and stated assumptions. Actual results may differ materially. Always consult qualified professionals before making significant business decisions.',
  },
};

const MOCK_REPORT_2: ReportData = {
  ...MOCK_REPORT,
  id: 'rpt-002',
  cover: {
    ...MOCK_REPORT.cover,
    reportTitle: 'Expansion Scenario Report',
    generatedDate: '2025-01-08',
    dataThroughDate: '2024-12-31',
    reportVersion: '1',
  },
  simulation: {
    ...MOCK_REPORT.simulation,
    scenarioName: 'Hire 2 Employees',
    scenarioType: 'Growth Investment',
  },
};

const MOCK_SAVED_REPORTS: SavedReport[] = [
  {
    id: 'rpt-001',
    name: 'Monthly Decision Intelligence Report',
    businessName: 'GreenCafe',
    generatedDate: '2025-01-15',
    scenarioType: 'Cost Optimization',
  },
  {
    id: 'rpt-002',
    name: 'Expansion Scenario Report',
    businessName: 'GreenCafe',
    generatedDate: '2025-01-08',
    scenarioType: 'Growth Investment',
  },
  {
    id: 'rpt-003',
    name: 'Q4 Performance Review',
    businessName: 'GreenCafe',
    generatedDate: '2024-12-20',
    scenarioType: 'Quarterly Review',
  },
];

// --- Mock API Functions ---

export async function getReport(id: string): Promise<ReportData | null> {
  // Simulate async
  await new Promise((resolve) => setTimeout(resolve, 100));

  if (id === 'rpt-001') return MOCK_REPORT;
  if (id === 'rpt-002') return MOCK_REPORT_2;
  // Return the first report for any other valid-looking ID
  if (id.startsWith('rpt-')) return { ...MOCK_REPORT, id };
  return null;
}

export async function getReportHistory(): Promise<SavedReport[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return MOCK_SAVED_REPORTS;
}
