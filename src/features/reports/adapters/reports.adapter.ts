// src/features/reports/adapters/reports.adapter.ts
import type { DataConfidence } from '@/types/domain';

export type CoreReportType =
  | 'Business Overview'
  | 'Cash Flow & Risk'
  | 'Simulation Decision Memo'
  | 'Action Progress';

export type ReportType = CoreReportType | 'Executive summary' | 'Cash-flow forecast' | 'Risk report' | 'Decision memo';
export type ReportStatus = 'Draft' | 'Generated' | 'Archived' | 'Needs data' | 'draft' | 'final';

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
  type: CoreReportType;
  reportingPeriod: string;
  createdDate: string;
  sourceData: string;
  confidence: DataConfidence;
  status: ReportStatus;
  audience?: string;
  detailLevel?: 'concise' | 'detailed';
  decisionMemo?: DecisionMemoDetails;
}

export interface OpinionatedReportOption {
  id: CoreReportType;
  name: string;
  purpose: string;
  audience: string;
}

export const OPINIONATED_REPORT_OPTIONS: OpinionatedReportOption[] = [
  {
    id: 'Business Overview',
    name: 'Business Overview',
    purpose: 'General financial health, cash runway, key risks, and active management actions',
    audience: 'Business owner & leadership',
  },
  {
    id: 'Cash Flow & Risk',
    name: 'Cash Flow & Risk',
    purpose: 'Liquidity forecast, safe minimum buffer, receivables aging, and financial exposure',
    audience: 'Advisors, lenders, & finance leads',
  },
  {
    id: 'Simulation Decision Memo',
    name: 'Simulation Decision Memo',
    purpose: 'A formal decision record generated from one completed scenario simulation',
    audience: 'Internal decision makers & investors',
  },
  {
    id: 'Action Progress',
    name: 'Action Progress',
    purpose: 'Execution progress, assigned owners, deadlines, blockers, and measured business outcomes',
    audience: 'Business owner & operations team',
  },
];

// --- Legacy Types for Backward Compatibility with components/reports ---
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

const MOCK_REPORTS: DetailedReportCard[] = [
  {
    id: 'rpt-memo-001',
    title: 'Equipment Loan vs Lease Decision Memo',
    type: 'Simulation Decision Memo',
    reportingPeriod: 'Jan 2025',
    createdDate: '2025-01-18',
    sourceData: 'Jan 2025 Baseline + Oven Replacement Simulation',
    confidence: 'high',
    status: 'Generated',
    audience: 'Internal management',
    detailLevel: 'detailed',
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
    title: 'Executive Monthly Business Overview',
    type: 'Business Overview',
    reportingPeriod: 'Jan 2025',
    createdDate: '2025-01-15',
    sourceData: 'Jan 2025 Baseline + Business Health Diagnostic',
    confidence: 'high',
    status: 'Generated',
    audience: 'Business owner',
    detailLevel: 'concise',
  },
  {
    id: 'rpt-cash-003',
    title: 'Q1 Cash-Flow & Liquidity Risk Report',
    type: 'Cash Flow & Risk',
    reportingPeriod: 'Jan 2025',
    createdDate: '2025-01-12',
    sourceData: 'Cash Flow Workspace + Receivables Aging',
    confidence: 'medium',
    status: 'Generated',
    audience: 'Bank or lender',
    detailLevel: 'detailed',
  },
  {
    id: 'rpt-action-004',
    title: 'Monthly Action Plan Progress Report',
    type: 'Action Progress',
    reportingPeriod: 'Jan 2025',
    createdDate: '2025-01-10',
    sourceData: 'Action Plan Workspace (3 Active Tasks)',
    confidence: 'high',
    status: 'Draft',
    audience: 'Business owner',
    detailLevel: 'concise',
  },
];

export async function getReportsData(): Promise<DetailedReportCard[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return MOCK_REPORTS;
}

export async function getReportById(id: string): Promise<DetailedReportCard | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return MOCK_REPORTS.find((r) => r.id === id) || MOCK_REPORTS[0];
}
