// src/features/reports/adapters/reports.adapter.ts
import type { DataConfidence } from '@/types/domain';

export type ReportType =
  | 'Executive summary'
  | 'Cash-flow forecast'
  | 'Business-health report'
  | 'Risk report'
  | 'Simulation comparison'
  | 'Decision memo'
  | 'Monthly management report';

export type ReportStatus = 'draft' | 'final' | 'archived';

export interface DecisionMemoDetails {
  decisionTitle: string;
  optionsConsidered: string[];
  selectedScenario: string;
  expectedResult: string;
  downsideCase: string;
  assumptions: string[];
  guardrails: string[];
  recommendedActions: string[];
  reviewDate: string;
}

export interface DetailedReportCard {
  id: string;
  title: string;
  type: ReportType;
  reportingPeriod: string;
  createdDate: string;
  sourceData: string;
  confidence: DataConfidence;
  status: ReportStatus;
  decisionMemo?: DecisionMemoDetails;
}

// --- Legacy Types for Backward Compatibility ---
export type ReportPosture = 'healthy' | 'cautious' | 'critical';
export type RiskSeverity = 'critical' | 'warning';

export interface ReportMetric {
  label: string;
  value: number;
  formatted: string;
  change?: number;
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

const MOCK_REPORT_DATA: ReportData = {
  id: 'rpt-memo-001',
  cover: {
    businessName: 'GreenCafe',
    reportTitle: 'Monthly Decision Intelligence Report',
    generatedDate: '2025-01-15',
    dataThroughDate: '2024-12-31',
    calculationVersion: '1.2.0',
    reportVersion: '1',
  },
  executiveSummary: {
    overview: 'GreenCafe maintains a cautious financial position with steady revenue of ฿152,400/month.',
    keyTakeaway: 'Expense growth is outpacing revenue gains.',
    posture: 'cautious',
  },
  metrics: {
    items: [
      { label: 'Revenue', value: 152400, formatted: '฿152,400', change: 8.2, changeDirection: 'up' },
      { label: 'Expenses', value: 164800, formatted: '฿164,800', change: 12.0, changeDirection: 'up' },
    ],
  },
  riskAnalysis: {
    criticalCount: 2,
    warningCount: 1,
    risks: [
      { title: 'Overdue Receivables Drag', severity: 'critical', evidence: '฿21,340 overdue' },
    ],
    isIncomplete: false,
  },
  simulation: {
    scenarioName: 'Equipment Loan Option',
    scenarioType: 'Equipment Purchase',
    bestCase: { revenue: 195000, expenses: 178000, profit: 17000, cashRunway: 4.8 },
    expectedCase: { revenue: 172000, expenses: 179800, profit: -7800, cashRunway: 2.6 },
    worstCase: { revenue: 158000, expenses: 182000, profit: -24000, cashRunway: 1.4 },
    baselineCase: { revenue: 152400, expenses: 164800, profit: -12400, cashRunway: 2.1 },
  },
  recommendation: {
    summary: 'Procure oven via loan; follow up on invoice collection.',
    actions: ['Collect Client A invoice', 'Finalize loan terms'],
    confidenceNote: 'High confidence',
  },
  actionPlan: {
    phases: [
      { label: '0-30 days', items: [{ text: 'Collect overdue invoice', priority: 'high' }] },
    ],
  },
  metadata: {
    dataThroughDate: '2025-01-15',
    calculationVersion: '1.2.0',
    reportVersion: '1',
    assumptions: ['Stable demand'],
    disclaimer: 'Prototype report',
  },
};

const MOCK_REPORTS: DetailedReportCard[] = [
  {
    id: 'rpt-memo-001',
    title: 'Equipment Loan vs Lease Decision Memo',
    type: 'Decision memo',
    reportingPeriod: 'Jan 2025',
    createdDate: '2025-01-18',
    sourceData: 'Jan 2025 Financial Snapshot + Oven Replacement Simulation',
    confidence: 'high',
    status: 'final',
    decisionMemo: {
      decisionTitle: 'Procure Commercial Oven via 24-Month SME Bank Loan',
      optionsConsidered: [
        'Outright Cash Purchase (฿200,000 cash outlay)',
        'SME Bank Loan (24 months @ 7.5% interest)',
        'Equipment Lease (฿9,500/mo operating lease)',
      ],
      selectedScenario: 'SME Bank Loan Financing (Expected Case)',
      expectedResult: 'Increases monthly operating revenue capacity by +฿19,600/month after 3-month onboarding velocity.',
      downsideCase: 'Monthly debt service increases by ฿9,200; runway drops to 1.8 months under conservative sales conditions.',
      assumptions: [
        'Equipment useful life: 5 years',
        'Annual maintenance: ฿12,000',
        'Sales conversion velocity: 3-month ramp-up',
      ],
      guardrails: [
        'Minimum cash buffer floor: ฿164,800 (Preserved)',
        'Maximum affordable capex: ฿120,000 (Avoided via loan)',
      ],
      recommendedActions: [
        'Finalize loan contract with SME Bank',
        'Schedule equipment installation for Feb 12',
        'Follow up on overdue invoice collection',
      ],
      reviewDate: '2025-04-18',
    },
  },
  {
    id: 'rpt-exec-002',
    title: 'Executive Cockpit Monthly Decision Report',
    type: 'Executive summary',
    reportingPeriod: 'Jan 2025',
    createdDate: '2025-01-15',
    sourceData: 'Jan 2025 Baseline + Business Health Diagnostic',
    confidence: 'high',
    status: 'final',
  },
  {
    id: 'rpt-cash-003',
    title: 'Q1 Cash-Flow Forecast & Runway Resilience Report',
    type: 'Cash-flow forecast',
    reportingPeriod: 'Jan–Apr 2025',
    createdDate: '2025-01-12',
    sourceData: 'Cash Flow Workspace + Receivables Aging',
    confidence: 'medium',
    status: 'final',
  },
  {
    id: 'rpt-risk-004',
    title: 'Overdue Receivables & Rent Increase Risk Diagnostic',
    type: 'Risk report',
    reportingPeriod: 'Jan 2025',
    createdDate: '2025-01-10',
    sourceData: 'Risk Investigation Workspace (2 Active Critical Risks)',
    confidence: 'high',
    status: 'draft',
  },
  {
    id: 'rpt-compare-005',
    title: 'Hiring vs Equipment Capex Scenario Comparison',
    type: 'Simulation comparison',
    reportingPeriod: 'Jan 2025',
    createdDate: '2025-01-20',
    sourceData: 'Scenario Comparison Workspace (2 Saved Options)',
    confidence: 'medium',
    status: 'final',
  },
];

export async function getReportsData(): Promise<DetailedReportCard[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return MOCK_REPORTS;
}

export async function getReportById(id: string): Promise<DetailedReportCard | null> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return MOCK_REPORTS.find((r) => r.id === id) || MOCK_REPORTS[0];
}

export async function getReport(_id: string): Promise<ReportData | null> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return { ...MOCK_REPORT_DATA, id: _id };
}

export async function getReportHistory(): Promise<SavedReport[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return [
    { id: 'rpt-memo-001', name: 'Equipment Loan Decision Memo', businessName: 'GreenCafe', generatedDate: '2025-01-18', scenarioType: 'Equipment Purchase' },
  ];
}
