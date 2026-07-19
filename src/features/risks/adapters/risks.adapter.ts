// src/features/risks/adapters/risks.adapter.ts

// ── Types ───────────────────────────────────────────────────────────────────

export type RiskCategory = 'financial' | 'operational' | 'growth' | 'compliance';
export type RiskSeverity = 'critical' | 'warning';
export type RiskStatus = 'active' | 'mitigated';

export interface DetectedRiskData {
  id: string;
  ruleId: string;
  category: RiskCategory;
  severity: RiskSeverity;
  probability: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  status: RiskStatus;
  /** Structured metric values that triggered this risk */
  evidenceValues: Record<string, number | string>;
  /** Scenario type for deep-linking into simulations */
  mitigationScenario?: string;
}

export interface RiskSummaryData {
  overallScore: number;
  overallStatus: 'healthy' | 'warning' | 'critical';
  totalCount: number;
  criticalCount: number;
  warningCount: number;
  lastAssessmentDate: string;
  isStale: boolean;
  isIncomplete: boolean;
}

export interface RisksData {
  summary: RiskSummaryData;
  risks: DetectedRiskData[];
}

// ── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_RISKS: DetectedRiskData[] = [
  {
    id: 'risk-001',
    ruleId: 'NEGATIVE_CASH_FLOW',
    category: 'financial',
    severity: 'critical',
    probability: 'high',
    impact: 'high',
    status: 'active',
    evidenceValues: {
      netProfit: 12400,
      revenue: 152400,
      totalExpenses: 164800,
      month: '2025-01',
    },
    mitigationScenario: 'cost_reduction',
  },
  {
    id: 'risk-002',
    ruleId: 'LOW_RUNWAY',
    category: 'financial',
    severity: 'critical',
    probability: 'high',
    impact: 'high',
    status: 'active',
    evidenceValues: {
      runwayMonths: 2.1,
      cashReserve: 280000,
      monthlyBurn: 132000,
    },
    mitigationScenario: 'price_adjustment',
  },
  {
    id: 'risk-003',
    ruleId: 'EXPENSE_GROWTH',
    category: 'operational',
    severity: 'warning',
    probability: 'medium',
    impact: 'medium',
    status: 'active',
    evidenceValues: {
      growthRate: 22,
      currentExpenses: 164800,
      previousExpenses: 135000,
    },
    mitigationScenario: 'cost_reduction',
  },
  {
    id: 'risk-004',
    ruleId: 'HIGH_PAYROLL',
    category: 'operational',
    severity: 'warning',
    probability: 'medium',
    impact: 'medium',
    status: 'active',
    evidenceValues: {
      payrollRatio: 54,
      payrollAmount: 82300,
      revenue: 152400,
    },
    mitigationScenario: 'hire',
  },
  {
    id: 'risk-005',
    ruleId: 'HIGH_RECEIVABLES',
    category: 'financial',
    severity: 'warning',
    probability: 'medium',
    impact: 'medium',
    status: 'active',
    evidenceValues: {
      receivablesRatio: 35,
      receivables: 53340,
      revenue: 152400,
    },
  },
  {
    id: 'risk-006',
    ruleId: 'LOW_LIQUIDITY',
    category: 'financial',
    severity: 'critical',
    probability: 'high',
    impact: 'high',
    status: 'active',
    evidenceValues: {
      currentRatio: 0.85,
      currentAssets: 333340,
      currentLiabilities: 392200,
    },
    mitigationScenario: 'price_adjustment',
  },
  {
    id: 'risk-007',
    ruleId: 'INCOMPLETE_DATA',
    category: 'compliance',
    severity: 'warning',
    probability: 'low',
    impact: 'low',
    status: 'active',
    evidenceValues: {
      snapshotCount: 2,
      requiredCount: 3,
    },
  },
  {
    id: 'risk-008',
    ruleId: 'DECLINING_GROWTH',
    category: 'growth',
    severity: 'warning',
    probability: 'medium',
    impact: 'medium',
    status: 'active',
    evidenceValues: {
      revenueGrowthRate: -3.2,
      previousGrowthRate: 8.1,
    },
    mitigationScenario: 'expansion',
  },
  {
    id: 'risk-009',
    ruleId: 'LOW_RUNWAY',
    category: 'financial',
    severity: 'warning',
    probability: 'medium',
    impact: 'medium',
    status: 'mitigated',
    evidenceValues: {
      runwayMonths: 5.8,
      cashReserve: 420000,
      monthlyBurn: 72000,
    },
    mitigationScenario: 'price_adjustment',
  },
  {
    id: 'risk-010',
    ruleId: 'HIGH_DEBT_RATIO',
    category: 'financial',
    severity: 'warning',
    probability: 'medium',
    impact: 'high',
    status: 'active',
    evidenceValues: {
      debtToRevenueRatio: 2.8,
      totalDebt: 426720,
      annualRevenue: 152400,
    },
  },
];

/**
 * Fetch risk assessment data for the current user's business.
 * Mock implementation — returns realistic Thai SME risk data.
 * Will be replaced with real server action calls later.
 */
export async function getRisksData(): Promise<RisksData> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 350));

  const activeRisks = MOCK_RISKS.filter((r) => r.status === 'active');
  const criticalCount = activeRisks.filter((r) => r.severity === 'critical').length;
  const warningCount = activeRisks.filter((r) => r.severity === 'warning').length;

  // Score: lower is better. 100 = no risks, 0 = maximum risk.
  const rawScore = Math.max(0, 100 - criticalCount * 20 - warningCount * 8);
  const overallStatus: RiskSummaryData['overallStatus'] =
    rawScore >= 70 ? 'healthy' : rawScore >= 40 ? 'warning' : 'critical';

  return {
    summary: {
      overallScore: rawScore,
      overallStatus,
      totalCount: MOCK_RISKS.length,
      criticalCount,
      warningCount,
      lastAssessmentDate: '2025-01-15',
      isStale: false,
      isIncomplete: MOCK_RISKS.some((r) => r.ruleId === 'INCOMPLETE_DATA' && r.status === 'active'),
    },
    risks: MOCK_RISKS,
  };
}
