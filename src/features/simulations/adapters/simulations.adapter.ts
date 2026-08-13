// src/features/simulations/adapters/simulations.adapter.ts
import type { DataConfidence, DataQuality } from '@/types/domain';

export type ScenarioType =
  | 'custom'
  | 'hire_employees'
  | 'change_price'
  | 'marketing_investment'
  | 'purchase_equipment'
  | 'expand_location'
  | 'payment_delay'
  | 'financing';

export type FieldType = 'number' | 'select' | 'range';

export interface SimulationField {
  name: string;
  label: string;
  type: FieldType;
  unit?: string;
  min?: number;
  max?: number;
  defaultValue?: number | string;
  fromBaseline?: boolean;
  isAdvanced?: boolean;
  options?: { value: string; label: string }[];
}

export interface ScenarioConfig {
  id: string;
  type: ScenarioType;
  title: string;
  description: string;
  icon: string;
  fields: SimulationField[];
}

export interface SimulationInput {
  scenarioType: ScenarioType;
  assumptions: Record<string, number | string>;
}

export type CaseType = 'baseline' | 'expected' | 'optimistic' | 'conservative' | 'best' | 'worst';
export type RecommendationPosture = 'Appears affordable' | 'Proceed cautiously' | 'High cash-flow pressure' | 'More information needed';

export interface ScenarioMetrics {
  caseType: CaseType;
  label: string;
  monthlyRevenue: number;
  monthlyExpenses: number;
  monthlyProfit: number;
  cashRunwayMonths: number;
  lowestCashBalance: number;
  breakEvenPeriodMonths: number;
  workingCapitalRequirement: number;
  roiPercent?: number;

  // Backward compatibility properties (required)
  revenue: number;
  expenses: number;
  profit: number;
  cashRunway: number;
  workingCapital: number;
  roi?: number;
  paybackPeriod?: number;
}

export interface CashImpactPoint {
  month: string;
  baselineCash: number;
  expectedCash: number;
  optimisticCash: number;
  conservativeCash: number;
}

export interface SensitivityImpact {
  assumptionName: string;
  baseValue: string;
  variedValue: string;
  runwayImpactMonths: number;
  profitImpactTHB: number;
  importanceRank: number;
}

export interface DecisionGuardrail {
  parameter: string;
  safeLimit: string;
  currentProjected: string;
  isBreached: boolean;
  warningNote: string;
}

export interface AssumptionQualityItem {
  fieldLabel: string;
  value: string;
  quality: DataQuality;
  sourceNote: string;
}

export interface SimulationBaseline {
  revenue: number;
  expenses: number;
  profit: number;
  cashRunway: number;
  workingCapital: number;
}

export interface DetailedSimulationResult {
  id: string;
  name: string;
  scenarioType: ScenarioType;
  input: SimulationInput;
  baseline: SimulationBaseline;
  recommendation: RecommendationPosture;
  recommendationRationale: string;
  answers: {
    canAfford: string;
    whatImproves: string;
    whatWorsens: string;
    breakEvenPoint: string;
    keyAssumption: string;
    unsafeConditions: string;
    nextSteps: string;
  };
  scenarios: ScenarioMetrics[];
  results: ScenarioMetrics[]; // Alias for backward compatibility
  cashImpactTimeline: CashImpactPoint[];
  sensitivityAnalysis: SensitivityImpact[];
  guardrails: DecisionGuardrail[];
  assumptionQualities: AssumptionQualityItem[];
  confidence: DataConfidence;
  posture: PostureType; // Alias for backward compatibility
  createdAt: string;
}

export type PostureType = 'bullish' | 'cautious' | 'neutral';
export type ConfidenceLevel = DataConfidence;
export type SimulationResult = ScenarioMetrics;
export type SimulationData = DetailedSimulationResult;

export interface SavedSimulation {
  id: string;
  name: string;
  scenarioType: ScenarioType;
  createdAt: string;
  recommendation: RecommendationPosture;
  posture: PostureType;
}

// ── Scenario Configs ────────────────────────────────────────────────────────

const SCENARIO_CONFIGS: ScenarioConfig[] = [
  {
    id: 'custom',
    type: 'custom',
    title: 'Custom Business Decision',
    description: 'Model custom revenue/expense changes, one-time cash impacts, or payment timing shifts.',
    icon: 'FlaskConical',
    fields: [
      { name: 'scenarioName', label: 'Scenario Name', type: 'select', defaultValue: 'Custom Decision' },
      { name: 'monthlyRevenueDelta', label: 'Monthly Revenue Impact', type: 'number', unit: 'THB', defaultValue: 20000 },
      { name: 'monthlyExpenseDelta', label: 'Monthly Expense Impact', type: 'number', unit: 'THB', defaultValue: 10000 },
      { name: 'oneTimeCashImpact', label: 'One-Time Cash Outlay', type: 'number', unit: 'THB', defaultValue: 0 },
    ],
  },
  {
    id: 'hire_employees',
    type: 'hire_employees',
    title: 'Hire Employees',
    description: 'Simulate adding headcount, onboarding salaries, benefits, and sales ramp-up duration.',
    icon: 'Users',
    fields: [
      { name: 'headcount', label: 'Number of New Hires', type: 'number', min: 1, max: 20, defaultValue: 1 },
      { name: 'salary', label: 'Monthly Base Salary per Person', type: 'number', unit: 'THB', min: 15000, defaultValue: 25000 },
      { name: 'benefits', label: 'Benefits & Social Security (%)', type: 'range', unit: '%', min: 0, max: 50, defaultValue: 15 },
      { name: 'startMonth', label: 'Start Month Offset', type: 'number', min: 1, max: 12, defaultValue: 1 },
      { name: 'rampUpMonths', label: 'Ramp-up Velocity (Months)', type: 'number', min: 1, max: 12, defaultValue: 3, isAdvanced: true },
    ],
  },
  {
    id: 'change_price',
    type: 'change_price',
    title: 'Change Product Pricing',
    description: 'Evaluate price elasticity, demand volume sensitivity, and operating margin shift.',
    icon: 'DollarSign',
    fields: [
      { name: 'product', label: 'Product/Service Line', type: 'select', defaultValue: 'main', options: [{ value: 'main', label: 'Main Beverage & Bakery' }, { value: 'secondary', label: 'Catering & Wholesale' }] },
      { name: 'currentPrice', label: 'Current Price', type: 'number', unit: 'THB', fromBaseline: true, defaultValue: 150 },
      { name: 'newPrice', label: 'Proposed New Price', type: 'number', unit: 'THB', min: 0, defaultValue: 175 },
      { name: 'elasticity', label: 'Price Elasticity Coefficient', type: 'range', min: 0, max: 3, defaultValue: 1.2, isAdvanced: true },
    ],
  },
  {
    id: 'purchase_equipment',
    type: 'purchase_equipment',
    title: 'Purchase Equipment',
    description: 'Analyze capital expenditures, maintenance schedules, and payback periods.',
    icon: 'Wrench',
    fields: [
      { name: 'cost', label: 'Equipment Cost', type: 'number', unit: 'THB', min: 10000, defaultValue: 200000 },
      { name: 'usefulLife', label: 'Useful Life (Years)', type: 'number', min: 1, max: 20, defaultValue: 5 },
      { name: 'maintenance', label: 'Annual Maintenance Cost', type: 'number', unit: 'THB', min: 0, defaultValue: 12000 },
      { name: 'financing', label: 'Purchase Method', type: 'select', defaultValue: 'cash', options: [{ value: 'cash', label: 'Outright Cash Purchase' }, { value: 'loan', label: 'SME Bank Loan' }, { value: 'lease', label: 'Equipment Lease' }] },
    ],
  },
  {
    id: 'expand_location',
    type: 'expand_location',
    title: 'Expand Branch Location',
    description: 'Model new store opening costs, rent overhead, staffing, and local revenue velocity.',
    icon: 'Store',
    fields: [
      { name: 'fitoutCost', label: 'Initial Fitout & Security Deposit', type: 'number', unit: 'THB', min: 50000, defaultValue: 250000 },
      { name: 'newMonthlyRent', label: 'Branch Monthly Rent', type: 'number', unit: 'THB', min: 10000, defaultValue: 35000 },
      { name: 'newStaffCount', label: 'Branch Staff Headcount', type: 'number', min: 1, max: 10, defaultValue: 2 },
      { name: 'expectedMonthlyRevenue', label: 'Expected Branch Sales (Month 6)', type: 'number', unit: 'THB', min: 20000, defaultValue: 120000 },
    ],
  },
  {
    id: 'payment_delay',
    type: 'payment_delay',
    title: 'Customer Payment Delay',
    description: 'Simulate liquidity strain from extended customer collection periods and delayed invoices.',
    icon: 'Clock',
    fields: [
      { name: 'delayDays', label: 'Average Payment Delay (Days)', type: 'number', min: 1, max: 180, defaultValue: 30 },
      { name: 'affectedPercent', label: 'Affected Customer Invoices (%)', type: 'range', unit: '%', min: 1, max: 100, defaultValue: 40 },
      { name: 'currentReceivables', label: 'Total Receivables Baseline', type: 'number', unit: 'THB', fromBaseline: true, defaultValue: 53340 },
    ],
  },
  {
    id: 'financing',
    type: 'financing',
    title: 'SME Debt Financing',
    description: 'Evaluate bank loan infusion, interest rate overhead, and monthly installment coverage.',
    icon: 'Banknote',
    fields: [
      { name: 'loanAmount', label: 'Loan Principal Amount', type: 'number', unit: 'THB', min: 50000, defaultValue: 300000 },
      { name: 'interestRate', label: 'Annual Interest Rate (%)', type: 'range', unit: '%', min: 1, max: 20, defaultValue: 7.5 },
      { name: 'tenureMonths', label: 'Loan Tenure (Months)', type: 'number', min: 6, max: 60, defaultValue: 24 },
    ],
  },
];

// ── Mock Baseline ───────────────────────────────────────────────────────────

const MOCK_BASELINE: SimulationBaseline = {
  revenue: 152400,
  expenses: 164800,
  profit: -12400,
  cashRunway: 2.1,
  workingCapital: -58860,
};

// ── Mock Functions ──────────────────────────────────────────────────────────

export async function getScenarioConfigs(): Promise<ScenarioConfig[]> {
  return SCENARIO_CONFIGS;
}

export async function runSimulation(input: SimulationInput): Promise<DetailedSimulationResult> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return buildDetailedSimulationResult(`sim-${Date.now()}`, input);
}

export async function getSimulation(id: string): Promise<DetailedSimulationResult | null> {
  await new Promise((resolve) => setTimeout(resolve, 250));

  if (id.includes('hire')) {
    return buildDetailedSimulationResult(id, { scenarioType: 'hire_employees', assumptions: { headcount: 2, salary: 25000, benefits: 15, startMonth: 1, rampUpMonths: 3 } });
  }
  if (id.includes('equipment')) {
    return buildDetailedSimulationResult(id, { scenarioType: 'purchase_equipment', assumptions: { cost: 200000, usefulLife: 5, maintenance: 12000, financing: 'loan' } });
  }

  return buildDetailedSimulationResult(id, { scenarioType: 'payment_delay', assumptions: { delayDays: 30, affectedPercent: 40, currentReceivables: 53340 } });
}

export async function getSimulationHistory(): Promise<SavedSimulation[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return [
    { id: 'sim-hire-01', name: 'Hire 2 Service Staff', scenarioType: 'hire_employees', createdAt: '2025-01-14T10:00:00Z', recommendation: 'Proceed cautiously', posture: 'cautious' },
    { id: 'sim-equip-02', name: 'Equipment Loan Financing', scenarioType: 'purchase_equipment', createdAt: '2025-01-18T14:30:00Z', recommendation: 'Appears affordable', posture: 'bullish' },
    { id: 'sim-delay-03', name: '30-Day Customer Delay Impact', scenarioType: 'payment_delay', createdAt: '2025-01-20T11:15:00Z', recommendation: 'High cash-flow pressure', posture: 'cautious' },
  ];
}

function buildDetailedSimulationResult(id: string, input: SimulationInput): DetailedSimulationResult {
  const config = SCENARIO_CONFIGS.find((c) => c.type === input.scenarioType) || SCENARIO_CONFIGS[0];

  const scenarios: ScenarioMetrics[] = [
    { caseType: 'baseline', label: 'Current Baseline', monthlyRevenue: 152400, monthlyExpenses: 164800, monthlyProfit: -12400, cashRunwayMonths: 2.1, lowestCashBalance: 245000, breakEvenPeriodMonths: 0, workingCapitalRequirement: -58860, revenue: 152400, expenses: 164800, profit: -12400, cashRunway: 2.1, workingCapital: -58860 },
    { caseType: 'expected', label: 'Expected Case', monthlyRevenue: 172000, monthlyExpenses: 179800, monthlyProfit: -7800, cashRunwayMonths: 2.6, lowestCashBalance: 215000, breakEvenPeriodMonths: 5, workingCapitalRequirement: -32000, roiPercent: 18.5, revenue: 172000, expenses: 179800, profit: -7800, cashRunway: 2.6, workingCapital: -32000, roi: 18.5 },
    { caseType: 'optimistic', label: 'Optimistic Case', monthlyRevenue: 195000, monthlyExpenses: 178000, monthlyProfit: 17000, cashRunwayMonths: 4.8, lowestCashBalance: 280000, breakEvenPeriodMonths: 3, workingCapitalRequirement: 12000, roiPercent: 34.0, revenue: 195000, expenses: 178000, profit: 17000, cashRunway: 4.8, workingCapital: 12000, roi: 34.0 },
    { caseType: 'conservative', label: 'Conservative Case', monthlyRevenue: 158000, monthlyExpenses: 182000, monthlyProfit: -24000, cashRunwayMonths: 1.4, lowestCashBalance: 140000, breakEvenPeriodMonths: 9, workingCapitalRequirement: -75000, roiPercent: -4.2, revenue: 158000, expenses: 182000, profit: -24000, cashRunway: 1.4, workingCapital: -75000, roi: -4.2 },
  ];

  const cashImpactTimeline: CashImpactPoint[] = [
    { month: 'Jan 2025', baselineCash: 345000, expectedCash: 345000, optimisticCash: 345000, conservativeCash: 345000 },
    { month: 'Feb 2025', baselineCash: 332600, expectedCash: 337200, optimisticCash: 362000, conservativeCash: 321000 },
    { month: 'Mar 2025', baselineCash: 319600, expectedCash: 329400, optimisticCash: 379000, conservativeCash: 297000 },
    { month: 'Apr 2025', baselineCash: 314600, expectedCash: 321600, optimisticCash: 396000, conservativeCash: 273000 },
    { month: 'May 2025', baselineCash: 302600, expectedCash: 313800, optimisticCash: 413000, conservativeCash: 249000 },
  ];

  const sensitivityAnalysis: SensitivityImpact[] = [
    { assumptionName: 'Sales Conversion Velocity', baseValue: 'Standard', variedValue: '-15%', runwayImpactMonths: -0.8, profitImpactTHB: -14200, importanceRank: 1 },
    { assumptionName: 'Onboarding Salary Overhead', baseValue: '฿25,000/mo', variedValue: '+10%', runwayImpactMonths: -0.4, profitImpactTHB: -5000, importanceRank: 2 },
    { assumptionName: 'Ramp-up Duration', baseValue: '3 months', variedValue: '5 months', runwayImpactMonths: -0.3, profitImpactTHB: -3800, importanceRank: 3 },
  ];

  const guardrails: DecisionGuardrail[] = [
    { parameter: 'Minimum Required Monthly Revenue', safeLimit: '฿168,000/mo', currentProjected: '฿172,000/mo', isBreached: false, warningNote: 'Revenue is ฿4,000 above absolute cash-neutral threshold.' },
    { parameter: 'Maximum Affordable Outright Capex', safeLimit: '฿120,000', currentProjected: '฿200,000', isBreached: true, warningNote: 'Outright cash purchase breaches cash runway threshold (< 1.5 mo).' },
    { parameter: 'Minimum Cash Reserve Floor', safeLimit: '฿164,800', currentProjected: '฿215,000', isBreached: false, warningNote: 'Preserves 1-month operating burn buffer.' },
  ];

  const assumptionQualities: AssumptionQualityItem[] = [
    { fieldLabel: 'Baseline Revenue & Expenses', value: '฿152,400 / ฿164,800', quality: 'actual', sourceNote: 'Verified from Jan 2025 financial snapshot.' },
    { fieldLabel: 'Proposed Salary & Cost Unit', value: '฿25,000/mo', quality: 'estimated', sourceNote: 'Based on SME industry benchmark in Bangkok.' },
    { fieldLabel: 'Sales Ramp-up Estimate', value: '3 Months', quality: 'sample', sourceNote: 'Derived from past operational velocity.' },
  ];

  return {
    id,
    name: `${config.title} Simulation`,
    scenarioType: input.scenarioType,
    input,
    baseline: MOCK_BASELINE,
    recommendation: 'Proceed cautiously',
    recommendationRationale: 'The decision is manageable under expected sales velocity, but outright cash funding reduces runway close to the 1.5-month threshold under conservative conditions.',
    answers: {
      canAfford: 'Yes, if funded through bank financing or staggered payments, preserving usable cash above ฿200,000.',
      whatImproves: 'Monthly revenue capacity increases by ฿19,600/month after the 3-month ramp-up period.',
      whatWorsens: 'Fixed monthly payroll and operating overhead increases by ฿28,750/month immediately.',
      breakEvenPoint: 'Break-even occurs in Month 5 under Expected Case, and Month 3 under Optimistic Case.',
      keyAssumption: 'Sales conversion velocity accounts for 65% of the total cash runway variance.',
      unsafeConditions: 'If monthly revenue fails to reach ฿168,000 by Month 4, cash runway will contract below 1.5 months.',
      nextSteps: 'Test financing alternatives or review the overdue receivables collection plan before finalizing contract.',
    },
    scenarios,
    results: scenarios,
    cashImpactTimeline,
    sensitivityAnalysis,
    guardrails,
    assumptionQualities,
    confidence: 'medium',
    posture: 'cautious',
    createdAt: new Date().toISOString(),
  };
}
