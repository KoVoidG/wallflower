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

export type DataSourceStatus = 'connected' | 'stale' | 'coming_later' | 'disconnected';

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
      name: 'Manual Monthly Financial Snapshot',
      provider: 'manual',
      status: 'connected',
      lastSync: '2025-01-15',
      reportingPeriod: 'Jan 2025',
      valuesContributed: 42,
      quality: 'actual',
    },
    {
      id: 'ds-002',
      name: 'Spreadsheet Financial Import',
      provider: 'spreadsheet',
      status: 'stale',
      lastSync: '2024-12-10',
      reportingPeriod: 'Dec 2024',
      valuesContributed: 28,
      quality: 'estimated',
    },
    {
      id: 'ds-003',
      name: 'Sample SME Retail Benchmark Data',
      provider: 'sample',
      status: 'connected',
      lastSync: '2025-01-01',
      reportingPeriod: 'Jan 2025',
      valuesContributed: 64,
      quality: 'sample',
    },
    {
      id: 'ds-004',
      name: 'Google Sheets Live Integration',
      provider: 'google_sheets',
      status: 'coming_later',
      lastSync: 'N/A',
      reportingPeriod: 'N/A',
      valuesContributed: 0,
      quality: 'estimated',
      isExternalIntegration: true,
    },
    {
      id: 'ds-005',
      name: 'FlowAccount Integration',
      provider: 'flowaccount',
      status: 'coming_later',
      lastSync: 'N/A',
      reportingPeriod: 'N/A',
      valuesContributed: 0,
      quality: 'actual',
      isExternalIntegration: true,
    },
    {
      id: 'ds-006',
      name: 'PEAK Accounting Integration',
      provider: 'peak',
      status: 'coming_later',
      lastSync: 'N/A',
      reportingPeriod: 'N/A',
      valuesContributed: 0,
      quality: 'actual',
      isExternalIntegration: true,
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
  await new Promise((resolve) => setTimeout(resolve, 250));
  return MOCK_DATA_WORKSPACE;
}
