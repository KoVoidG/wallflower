// src/features/simulations/adapters/simulations.adapter.ts

// ── Types ───────────────────────────────────────────────────────────────────

export type ScenarioType =
  | 'hire_employees'
  | 'change_price'
  | 'marketing_investment'
  | 'purchase_equipment'
  | 'payment_delay';

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

export type CaseType = 'best' | 'expected' | 'worst';

export interface SimulationResult {
  caseType: CaseType;
  revenue: number;
  expenses: number;
  profit: number;
  cashRunway: number;
  workingCapital: number;
  roi?: number;
  paybackPeriod?: number;
}

export type PostureType = 'bullish' | 'cautious' | 'neutral';
export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface SimulationBaseline {
  revenue: number;
  expenses: number;
  profit: number;
  cashRunway: number;
  workingCapital: number;
}

export interface SimulationData {
  id: string;
  name: string;
  scenarioType: ScenarioType;
  input: SimulationInput;
  results: SimulationResult[];
  baseline: SimulationBaseline;
  createdAt: string;
  posture: PostureType;
  confidence: ConfidenceLevel;
}

export interface SavedSimulation {
  id: string;
  name: string;
  scenarioType: ScenarioType;
  createdAt: string;
  posture: PostureType;
}

// ── Scenario Configs ────────────────────────────────────────────────────────

const SCENARIO_CONFIGS: ScenarioConfig[] = [
  {
    id: 'hire_employees',
    type: 'hire_employees',
    title: 'Hire Employees',
    description: 'Simulate the impact of adding new team members to your business.',
    icon: 'Users',
    fields: [
      { name: 'headcount', label: 'Number of Hires', type: 'number', min: 1, max: 20, defaultValue: 1 },
      { name: 'salary', label: 'Monthly Salary per Person', type: 'number', unit: 'THB', min: 15000, defaultValue: 25000 },
      { name: 'benefits', label: 'Benefits (% of Salary)', type: 'range', unit: '%', min: 0, max: 50, defaultValue: 15 },
      { name: 'startMonth', label: 'Start Month', type: 'number', min: 1, max: 12, defaultValue: 1 },
      { name: 'rampUpMonths', label: 'Ramp-up Time (Months)', type: 'number', min: 1, max: 12, defaultValue: 3 },
    ],
  },
  {
    id: 'change_price',
    type: 'change_price',
    title: 'Change Price',
    description: 'Evaluate the effect of adjusting your product or service pricing.',
    icon: 'DollarSign',
    fields: [
      { name: 'product', label: 'Product/Service', type: 'select', defaultValue: 'main', options: [{ value: 'main', label: 'Main Product' }, { value: 'secondary', label: 'Secondary Service' }] },
      { name: 'currentPrice', label: 'Current Price', type: 'number', unit: 'THB', fromBaseline: true, defaultValue: 1500 },
      { name: 'newPrice', label: 'New Price', type: 'number', unit: 'THB', min: 0, defaultValue: 1800 },
      { name: 'elasticity', label: 'Demand Elasticity', type: 'range', min: 0, max: 3, defaultValue: 1.2 },
    ],
  },
  {
    id: 'marketing_investment',
    type: 'marketing_investment',
    title: 'Marketing Investment',
    description: 'Assess the return on a marketing campaign or budget increase.',
    icon: 'Megaphone',
    fields: [
      { name: 'budget', label: 'Campaign Budget', type: 'number', unit: 'THB', min: 5000, defaultValue: 50000 },
      { name: 'channel', label: 'Channel', type: 'select', defaultValue: 'social', options: [{ value: 'social', label: 'Social Media' }, { value: 'search', label: 'Search Ads' }, { value: 'offline', label: 'Offline' }] },
      { name: 'duration', label: 'Duration (Months)', type: 'number', min: 1, max: 12, defaultValue: 3 },
      { name: 'expectedReach', label: 'Expected Reach (People)', type: 'number', min: 100, defaultValue: 10000 },
    ],
  },
  {
    id: 'purchase_equipment',
    type: 'purchase_equipment',
    title: 'Purchase Equipment',
    description: 'Analyze the financial impact of a major equipment purchase.',
    icon: 'Wrench',
    fields: [
      { name: 'cost', label: 'Equipment Cost', type: 'number', unit: 'THB', min: 10000, defaultValue: 200000 },
      { name: 'usefulLife', label: 'Useful Life (Years)', type: 'number', min: 1, max: 20, defaultValue: 5 },
      { name: 'maintenance', label: 'Annual Maintenance', type: 'number', unit: 'THB', min: 0, defaultValue: 12000 },
      { name: 'financing', label: 'Financing', type: 'select', defaultValue: 'cash', options: [{ value: 'cash', label: 'Cash Purchase' }, { value: 'loan', label: 'Business Loan' }, { value: 'lease', label: 'Lease' }] },
    ],
  },
  {
    id: 'payment_delay',
    type: 'payment_delay',
    title: 'Customer Payment Delay',
    description: 'Understand how late customer payments affect your cash flow.',
    icon: 'Clock',
    fields: [
      { name: 'delayDays', label: 'Average Delay (Days)', type: 'number', min: 1, max: 180, defaultValue: 30 },
      { name: 'affectedPercent', label: 'Affected Customers (%)', type: 'range', unit: '%', min: 1, max: 100, defaultValue: 40 },
      { name: 'currentReceivables', label: 'Current Receivables', type: 'number', unit: 'THB', fromBaseline: true, defaultValue: 53340 },
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

// ── Mock Saved Simulations ──────────────────────────────────────────────────

const MOCK_SIMULATIONS: SimulationData[] = [
  {
    id: 'sim-001',
    name: 'Hire 2 Developers',
    scenarioType: 'hire_employees',
    input: { scenarioType: 'hire_employees', assumptions: { headcount: 2, salary: 35000, benefits: 15, startMonth: 2, rampUpMonths: 3 } },
    results: [
      { caseType: 'best', revenue: 220000, expenses: 234800, profit: -14800, cashRunway: 1.8, workingCapital: -42000, roi: 18, paybackPeriod: 8 },
      { caseType: 'expected', revenue: 185000, expenses: 234800, profit: -49800, cashRunway: 1.2, workingCapital: -68000, roi: 5, paybackPeriod: 14 },
      { caseType: 'worst', revenue: 155000, expenses: 234800, profit: -79800, cashRunway: 0.8, workingCapital: -95000, roi: -12, paybackPeriod: 24 },
    ],
    baseline: MOCK_BASELINE,
    createdAt: '2025-01-10T09:30:00Z',
    posture: 'cautious',
    confidence: 'medium',
  },
  {
    id: 'sim-002',
    name: 'Increase Main Product Price 20%',
    scenarioType: 'change_price',
    input: { scenarioType: 'change_price', assumptions: { product: 'main', currentPrice: 1500, newPrice: 1800, elasticity: 1.2 } },
    results: [
      { caseType: 'best', revenue: 195000, expenses: 164800, profit: 30200, cashRunway: 4.5, workingCapital: 12000, roi: 42 },
      { caseType: 'expected', revenue: 172000, expenses: 164800, profit: 7200, cashRunway: 3.2, workingCapital: -8000, roi: 22 },
      { caseType: 'worst', revenue: 128000, expenses: 164800, profit: -36800, cashRunway: 1.5, workingCapital: -72000, roi: -8 },
    ],
    baseline: MOCK_BASELINE,
    createdAt: '2025-01-12T14:15:00Z',
    posture: 'bullish',
    confidence: 'medium',
  },
  {
    id: 'sim-003',
    name: 'Social Media Campaign Q1',
    scenarioType: 'marketing_investment',
    input: { scenarioType: 'marketing_investment', assumptions: { budget: 80000, channel: 'social', duration: 3, expectedReach: 25000 } },
    results: [
      { caseType: 'best', revenue: 210000, expenses: 191467, profit: 18533, cashRunway: 3.8, workingCapital: 5000, roi: 35, paybackPeriod: 4 },
      { caseType: 'expected', revenue: 178000, expenses: 191467, profit: -13467, cashRunway: 2.5, workingCapital: -32000, roi: 12, paybackPeriod: 8 },
      { caseType: 'worst', revenue: 155000, expenses: 191467, profit: -36467, cashRunway: 1.4, workingCapital: -65000, roi: -5, paybackPeriod: 18 },
    ],
    baseline: MOCK_BASELINE,
    createdAt: '2025-01-14T11:00:00Z',
    posture: 'neutral',
    confidence: 'low',
  },
];

// ── Mock Functions ──────────────────────────────────────────────────────────

export async function getScenarioConfigs(): Promise<ScenarioConfig[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return SCENARIO_CONFIGS;
}

export async function runSimulation(input: SimulationInput): Promise<SimulationData> {
  // Simulate calculation delay (2-3 seconds)
  await new Promise((resolve) => setTimeout(resolve, 2500));

  const config = SCENARIO_CONFIGS.find((c) => c.type === input.scenarioType);
  const name = config ? `${config.title} Simulation` : 'Simulation';

  // Generate mock results based on scenario type
  const results = generateMockResults(input);
  const posture = determinePosture(results);
  const confidence = determineConfidence(input);

  return {
    id: `sim-${Date.now()}`,
    name,
    scenarioType: input.scenarioType,
    input,
    results,
    baseline: MOCK_BASELINE,
    createdAt: new Date().toISOString(),
    posture,
    confidence,
  };
}

export async function getSimulation(id: string): Promise<SimulationData | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_SIMULATIONS.find((s) => s.id === id) ?? null;
}

export async function getSimulationHistory(): Promise<SavedSimulation[]> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return MOCK_SIMULATIONS.map((s) => ({
    id: s.id,
    name: s.name,
    scenarioType: s.scenarioType,
    createdAt: s.createdAt,
    posture: s.posture,
  }));
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function generateMockResults(input: SimulationInput): SimulationResult[] {
  const base = MOCK_BASELINE;

  let revenueMultiplier = 1;
  let expenseIncrease = 0;

  switch (input.scenarioType) {
    case 'hire_employees': {
      const headcount = Number(input.assumptions.headcount) || 1;
      const salary = Number(input.assumptions.salary) || 25000;
      const benefits = Number(input.assumptions.benefits) || 15;
      expenseIncrease = headcount * salary * (1 + benefits / 100);
      revenueMultiplier = 1 + headcount * 0.08;
      break;
    }
    case 'change_price': {
      const currentPrice = Number(input.assumptions.currentPrice) || 1500;
      const newPrice = Number(input.assumptions.newPrice) || 1800;
      const elasticity = Number(input.assumptions.elasticity) || 1.2;
      const priceChange = (newPrice - currentPrice) / currentPrice;
      const demandChange = -priceChange * elasticity;
      revenueMultiplier = (1 + priceChange) * (1 + demandChange);
      break;
    }
    case 'marketing_investment': {
      const budget = Number(input.assumptions.budget) || 50000;
      const duration = Number(input.assumptions.duration) || 3;
      expenseIncrease = budget / duration;
      revenueMultiplier = 1 + (budget / base.revenue) * 0.4;
      break;
    }
    case 'purchase_equipment': {
      const cost = Number(input.assumptions.cost) || 200000;
      const usefulLife = Number(input.assumptions.usefulLife) || 5;
      const maintenance = Number(input.assumptions.maintenance) || 12000;
      expenseIncrease = cost / (usefulLife * 12) + maintenance / 12;
      revenueMultiplier = 1.05;
      break;
    }
    case 'payment_delay': {
      const delayDays = Number(input.assumptions.delayDays) || 30;
      const affectedPercent = Number(input.assumptions.affectedPercent) || 40;
      revenueMultiplier = 1 - (delayDays / 365) * (affectedPercent / 100) * 0.1;
      expenseIncrease = base.revenue * (affectedPercent / 100) * (delayDays / 365) * 0.02;
      break;
    }
  }

  const expectedRevenue = Math.round(base.revenue * revenueMultiplier);
  const expectedExpenses = Math.round(base.expenses + expenseIncrease);
  const expectedProfit = expectedRevenue - expectedExpenses;
  const expectedRunway = expectedProfit >= 0 ? 12 : Math.max(0, 280000 / Math.abs(expectedProfit));
  const expectedWC = expectedRevenue * 0.35 - expectedExpenses * 0.4;

  return [
    {
      caseType: 'best',
      revenue: Math.round(expectedRevenue * 1.25),
      expenses: Math.round(expectedExpenses * 0.95),
      profit: Math.round(expectedRevenue * 1.25 - expectedExpenses * 0.95),
      cashRunway: Math.min(12, expectedRunway * 1.6),
      workingCapital: Math.round(expectedWC * 1.4),
      roi: Math.round(((expectedRevenue * 1.25 - base.revenue) / Math.max(expenseIncrease * 12, 1)) * 100),
      paybackPeriod: Math.max(1, Math.round(6 / revenueMultiplier)),
    },
    {
      caseType: 'expected',
      revenue: expectedRevenue,
      expenses: expectedExpenses,
      profit: expectedProfit,
      cashRunway: Math.round(expectedRunway * 10) / 10,
      workingCapital: Math.round(expectedWC),
      roi: Math.round(((expectedRevenue - base.revenue) / Math.max(expenseIncrease * 12, 1)) * 100),
      paybackPeriod: Math.max(1, Math.round(12 / revenueMultiplier)),
    },
    {
      caseType: 'worst',
      revenue: Math.round(expectedRevenue * 0.75),
      expenses: Math.round(expectedExpenses * 1.1),
      profit: Math.round(expectedRevenue * 0.75 - expectedExpenses * 1.1),
      cashRunway: Math.max(0, Math.round(expectedRunway * 0.5 * 10) / 10),
      workingCapital: Math.round(expectedWC * 0.5),
      roi: Math.round(((expectedRevenue * 0.75 - base.revenue) / Math.max(expenseIncrease * 12, 1)) * 100),
      paybackPeriod: Math.max(1, Math.round(24 / revenueMultiplier)),
    },
  ];
}

function determinePosture(results: SimulationResult[]): PostureType {
  const expected = results.find((r) => r.caseType === 'expected');
  if (!expected) return 'neutral';
  if (expected.profit > 0 && expected.roi && expected.roi > 15) return 'bullish';
  if (expected.profit < -30000 || expected.cashRunway < 1.5) return 'cautious';
  return 'neutral';
}

function determineConfidence(input: SimulationInput): ConfidenceLevel {
  const assumptions = Object.keys(input.assumptions).length;
  if (assumptions >= 4) return 'medium';
  if (assumptions >= 2) return 'high';
  return 'low';
}
