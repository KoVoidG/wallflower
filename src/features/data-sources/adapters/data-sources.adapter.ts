// src/features/data-sources/adapters/data-sources.adapter.ts
import type { DataConfidence, DataQuality } from '@/types/domain';

export interface DataStatusSummary {
  latestReportingPeriod: string;
  lastUpdated: string;
  completenessScore: number;
  confidenceRating: DataConfidence;
  estimatedValueCount: number;
  missingHighImpactFields: string[];
}

export type DataSourceStatus = 'connected' | 'stale' | 'coming_later' | 'disconnected' | 'needs_review' | 'sample';

export interface DataSourceItem {
  id: string;
  name: string;
  provider: 'manual' | 'spreadsheet' | 'sample' | 'google_sheets' | 'flowaccount' | 'peak';
  status: DataSourceStatus;
  lastSync: string;
  reportingPeriod: string;
  valuesContributed: number;
  quality: DataQuality;
  isExternalIntegration?: boolean;
  category?: 'financial_summary' | 'cash_flow' | 'operations' | 'assumptions';
  description?: string;
  provenanceNote?: string;
  affectedFeatures?: string[];
  issueCount?: number;
  issuesList?: string[];
}

export interface MonthlySnapshotHistory {
  period: string; // e.g. "2025-01"
  revenue: number;
  expenses: number;
  usableCash: number;
  receivables: number;
  quality: DataQuality;
  status: 'verified' | 'estimated' | 'draft';
}

export interface MissingDataImpactItem {
  missingField: string;
  improvesFeatures: string[];
  impactDescription: string;
}

export interface DataWorkspaceData {
  summary: DataStatusSummary;
  sources: DataSourceItem[];
  history: MonthlySnapshotHistory[];
  missingImpacts: MissingDataImpactItem[];
}

const MOCK_DATA_WORKSPACE: DataWorkspaceData = {
  summary: {
    latestReportingPeriod: 'Jan 2025',
    lastUpdated: '2025-01-15',
    completenessScore: 88,
    confidenceRating: 'high',
    estimatedValueCount: 3,
    missingHighImpactFields: ['Supplier Payment Terms (DPO)', 'Granular Utility Breakdown'],
  },
  sources: [
    {
      id: 'ds-001',
      name: 'January 2025 Financial Summary',
      provider: 'manual',
      status: 'connected',
      lastSync: '2025-01-15',
      reportingPeriod: 'Jan 2025',
      valuesContributed: 42,
      quality: 'actual',
      category: 'financial_summary',
      description: 'Monthly baseline revenue, expenses, net profit, usable cash reserves, and debt obligations.',
      provenanceNote: 'Manual Entry by Somchai Wattana (General Manager)',
      affectedFeatures: ['Dashboard', 'Business Health', 'Cash Flow', 'Reports'],
      issueCount: 0,
      issuesList: [],
    },
    {
      id: 'ds-002',
      name: 'Accounts Receivable & Invoices Import',
      provider: 'spreadsheet',
      status: 'stale',
      lastSync: '2024-12-10',
      reportingPeriod: 'Dec 2024',
      valuesContributed: 28,
      quality: 'estimated',
      category: 'cash_flow',
      description: 'Customer receivables aging schedule, invoice balances, due dates, and payment status.',
      provenanceNote: 'Imported File (receivables_q1_2025.csv)',
      affectedFeatures: ['Cash Flow', 'Risk Center', 'Action Plan', 'Reports'],
      issueCount: 1,
      issuesList: ['Client Invoice #1042 overdue by 14 days without collection action'],
    },
    {
      id: 'ds-003',
      name: 'Monthly Operating Overhead & Payroll',
      provider: 'manual',
      status: 'connected',
      lastSync: '2025-01-05',
      reportingPeriod: 'Jan 2025',
      valuesContributed: 36,
      quality: 'actual',
      category: 'operations',
      description: 'Staff payroll, store rental contract, electricity utilities, and recurring supplier orders.',
      provenanceNote: 'Manual Entry (GreenCafe Operating Expense Log)',
      affectedFeatures: ['Dashboard', 'Business Health', 'Cash Flow', 'Simulation'],
      issueCount: 0,
      issuesList: [],
    },
    {
      id: 'ds-004',
      name: 'Sample SME Retail Benchmark Data',
      provider: 'sample',
      status: 'connected',
      lastSync: '2025-01-01',
      reportingPeriod: 'Jan 2025',
      valuesContributed: 64,
      quality: 'sample',
      category: 'assumptions',
      description: 'Preconfigured SME retail cafe baseline data used for simulation and risk modeling defaults.',
      provenanceNote: 'Sample Prototype Dataset (Default Active Baseline)',
      affectedFeatures: ['Risk Center', 'Simulation', 'AI Advisor', 'Reports'],
      issueCount: 0,
      issuesList: [],
    },
    {
      id: 'ds-005',
      name: 'Google Sheets Live Integration',
      provider: 'google_sheets',
      status: 'coming_later',
      lastSync: 'N/A',
      reportingPeriod: 'N/A',
      valuesContributed: 0,
      quality: 'estimated',
      isExternalIntegration: true,
      category: 'financial_summary',
      description: 'Direct Google Sheets spreadsheet sync for real-time revenue and cash updates.',
      provenanceNote: 'Connection Not Available in Prototype (Planned Feature)',
      affectedFeatures: ['Dashboard', 'Cash Flow'],
      issueCount: 0,
      issuesList: [],
    },
    {
      id: 'ds-006',
      name: 'FlowAccount Accounting Integration',
      provider: 'flowaccount',
      status: 'coming_later',
      lastSync: 'N/A',
      reportingPeriod: 'N/A',
      valuesContributed: 0,
      quality: 'actual',
      isExternalIntegration: true,
      category: 'financial_summary',
      description: 'Automated Thai SME accounting sync for invoices, expenses, and VAT tax filings.',
      provenanceNote: 'Connection Not Available in Prototype (Planned Feature)',
      affectedFeatures: ['Business Health', 'Cash Flow', 'Reports'],
      issueCount: 0,
      issuesList: [],
    },
    {
      id: 'ds-007',
      name: 'PEAK Accounting Integration',
      provider: 'peak',
      status: 'coming_later',
      lastSync: 'N/A',
      reportingPeriod: 'N/A',
      valuesContributed: 0,
      quality: 'actual',
      isExternalIntegration: true,
      category: 'financial_summary',
      description: 'PEAK engine sync for automated general ledger and balance sheet imports.',
      provenanceNote: 'Connection Not Available in Prototype (Planned Feature)',
      affectedFeatures: ['Business Health', 'Reports'],
      issueCount: 0,
      issuesList: [],
    },
  ],
  history: [
    { period: '2025-01', revenue: 152400, expenses: 164800, usableCash: 245000, receivables: 53340, quality: 'actual', status: 'verified' },
    { period: '2024-12', revenue: 145000, expenses: 138500, usableCash: 360000, receivables: 48000, quality: 'actual', status: 'verified' },
    { period: '2024-11', revenue: 138000, expenses: 142000, usableCash: 380000, receivables: 42000, quality: 'estimated', status: 'estimated' },
    { period: '2024-10', revenue: 141000, expenses: 135000, usableCash: 395000, receivables: 38000, quality: 'estimated', status: 'estimated' },
    { period: '2024-09', revenue: 135000, expenses: 130000, usableCash: 410000, receivables: 35000, quality: 'sample', status: 'estimated' },
    { period: '2024-08', revenue: 128000, expenses: 132000, usableCash: 425000, receivables: 30000, quality: 'sample', status: 'estimated' },
  ],
  missingImpacts: [
    {
      missingField: 'Detailed Receivables Aging (0-30, 31-60, 61-90 days)',
      improvesFeatures: ['Cash-flow warning precision', 'Working capital ratio accuracy', 'Customer payment delay simulation fidelity'],
      impactDescription: 'Allows exact timing modeling of cash inflows against payroll due dates.',
    },
    {
      missingField: 'Supplier Payment Terms (DPO)',
      improvesFeatures: ['Payables scheduling', 'Supplier negotiation simulations', 'Cash runway extension calculations'],
      impactDescription: 'Enables modeling early payment discounts vs working capital preservation.',
    },
    {
      missingField: 'Granular Utility & Operating Overheads',
      improvesFeatures: ['Fixed burn rate tracking', 'Operating efficiency score', 'Margin sensitivity analysis'],
      impactDescription: 'Distinguishes fixed rent/utility burn from variable material expenses.',
    },
  ],
};

export async function getDataWorkspaceData(): Promise<DataWorkspaceData> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return MOCK_DATA_WORKSPACE;
}
