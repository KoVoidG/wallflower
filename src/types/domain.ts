// src/types/domain.ts
/**
 * Wallflower SME Decision Intelligence Platform — Domain Types
 * Shared frontend domain models for financial snapshots, metrics, health,
 * cash flow, risks, simulations, advisor recommendations, and data quality.
 */

export type DataQuality = 'actual' | 'estimated' | 'imported' | 'sample' | 'missing';

export type DataConfidence = 'high' | 'medium' | 'low';

export interface BusinessValue<T> {
  value: T | null;
  quality: DataQuality;
  source: string;
  period?: string;
  updatedAt?: string;
  confidence?: DataConfidence;
}

export interface FinancialSnapshot {
  id: string;
  month: string; // YYYY-MM
  revenue: BusinessValue<number>;
  cashReserve: BusinessValue<number>;
  receivables: BusinessValue<number>;
  payables: BusinessValue<number>;
  debt: BusinessValue<number>;
  expenseCategories: Record<string, BusinessValue<number>>;
  updatedAt: string;
}

export interface MetricTrendPoint {
  period: string; // E.g., "Jan", "Feb" or "2025-01"
  revenue: number;
  expenses: number;
  profit: number;
  cashFlow: number;
  runwayMonths?: number;
}

export interface MetricItem {
  id: string;
  label: string;
  value: string;
  numericValue: number;
  unit?: string;
  change?: number;
  changePeriod?: string;
  status?: 'healthy' | 'warning' | 'danger' | 'stable' | 'neutral';
  quality?: DataQuality;
  trend?: number[];
  tooltip?: string;
}

export interface HealthDimension {
  id: 'financial' | 'operational' | 'growth';
  title: string;
  score: number; // 0 - 100
  status: 'healthy' | 'warning' | 'danger';
  metrics: {
    label: string;
    value: number | string;
    unit?: string;
    status: 'healthy' | 'warning' | 'danger';
  }[];
}

export interface CashFlowEvent {
  id: string;
  title: string;
  amount: number;
  type: 'inflow' | 'outflow';
  category: string;
  expectedDate: string; // YYYY-MM-DD
  status: 'confirmed' | 'expected' | 'at_risk';
  quality: DataQuality;
}

export interface CashFlowForecast {
  period: string;
  baselineCash: number;
  expectedInflow: number;
  expectedOutflow: number;
  projectedEndingCash: number;
  runwayMonths: number;
  isDeficit: boolean;
}

export interface ReceivableAgingBucket {
  bucket: 'current' | '1_30_days' | '31_60_days' | '61_90_days' | 'over_90_days';
  label: string;
  amount: number;
  invoiceCount: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface ExpenseCategoryBreakdown {
  category: string;
  label: string;
  amount: number;
  percentageOfTotal: number;
  quality: DataQuality;
  isEssential: boolean;
}

export interface RiskEvidenceItem {
  key: string;
  label: string;
  value: string | number;
  type: 'calculated' | 'user_input' | 'ai_interpretation';
  source?: string;
}

export interface RiskMitigationPlan {
  id: string;
  title: string;
  description: string;
  estimatedCost?: number;
  estimatedRunwayImpactMonths?: number;
  status: 'suggested' | 'in_progress' | 'completed';
}

export interface BusinessRiskRule {
  id: string;
  ruleId: string;
  category: 'financial' | 'operational' | 'growth' | 'compliance';
  severity: 'critical' | 'warning';
  probability: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  status: 'active' | 'mitigated';
  title: string;
  whatHappened: string;
  whyMatters: string;
  whatNext: string;
  evidenceValues: Record<string, number | string>;
  evidenceItems?: RiskEvidenceItem[];
  mitigations?: RiskMitigationPlan[];
}

export interface SimulationAssumptionItem {
  label: string;
  value: string | number;
  quality: DataQuality;
  isCustomized: boolean;
}

export interface SensitivityFactorItem {
  factor: string;
  impactOnRunway: number; // in months
  impactOnMargin: number; // in percentage points
}

export interface SimulationScenarioConfig {
  id: string;
  name: string;
  type: 'hire_employees' | 'change_price' | 'marketing_investment' | 'purchase_equipment' | 'payment_delay';
  posture: 'bullish' | 'cautious' | 'neutral';
  assumptions: SimulationAssumptionItem[];
  sensitivityFactors: SensitivityFactorItem[];
  baselineRunwayMonths: number;
  projectedRunwayMonths: number;
  createdAt: string;
}

export interface DecisionRecommendation {
  id: string;
  title: string;
  summary: string;
  evidence: RiskEvidenceItem[];
  actions: { title: string; description: string }[];
  assumptions: string[];
  uncertainty: { completeness: number; items: string[] };
  disclaimer: string;
  createdAt: string;
}

export interface ActionItem {
  id: string;
  title: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'done';
  dueDate?: string;
  impactSummary: string;
}

export interface ReportMetadata {
  id: string;
  name: string;
  businessName: string;
  generatedDate: string;
  dataThroughDate: string;
  scenarioType: string;
  keyTakeaway: string;
  status: 'ready' | 'generating' | 'failed';
}

export interface DataSourceConnection {
  id: string;
  name: string;
  type: 'spreadsheet' | 'manual' | 'sample';
  status: 'connected' | 'stale' | 'disconnected';
  lastSyncedAt: string;
  periodCount: number;
  completenessScore: number;
}

export interface DataQualityMetadata {
  completenessScore: number; // 0-100
  periodCount: number;
  lastUpdated: string;
  staleDays: number;
  hasStaleWarning: boolean;
}
