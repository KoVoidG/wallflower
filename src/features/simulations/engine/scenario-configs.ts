// src/features/simulations/engine/scenario-configs.ts
// Typed configuration for all 8 scenario templates.
// The UI renders inputs dynamically from these configs.

export type InputType = 'percent' | 'currency' | 'count' | 'select' | 'switch' | 'duration';

export interface InputConfig {
  key: string;
  label: string;
  description: string;
  type: InputType;
  defaultValue: number | string | boolean;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: { value: string; label: string }[];
}

export interface ScenarioTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  objective: string;
  decisionInputs: InputConfig[];
  assumptions: InputConfig[];
  advancedInputs?: InputConfig[];
  /** Which baseline metrics to display prominently */
  relevantBaselineKeys: string[];
  /** Which result metrics to emphasize */
  resultMetrics: string[];
}

// ─── Price Increase ────────────────────────────────────────────────────────

const priceIncrease: ScenarioTemplate = {
  id: 'price_increase',
  name: 'Price Increase +5%',
  category: 'Pricing Strategy',
  description: 'Evaluate the profit impact of increasing your average selling price while accounting for demand elasticity.',
  objective: 'Increase profit margin',
  decisionInputs: [
    {
      key: 'priceChangePercent',
      label: 'Price Change',
      description: 'Adjust your average selling price by this percentage.',
      type: 'percent',
      defaultValue: 5,
      min: -20,
      max: 20,
      step: 0.5,
      unit: '%',
    },
  ],
  assumptions: [
    {
      key: 'demandResponsePercent',
      label: 'Demand Response',
      description: 'Expected change in customer demand resulting from the price adjustment.',
      type: 'percent',
      defaultValue: -3,
      min: -20,
      max: 20,
      step: 0.5,
      unit: '%',
    },
    {
      key: 'supplierCostChangePercent',
      label: 'Supplier Cost Change',
      description: 'Expected change in supplier costs based on current contracts and market trend.',
      type: 'percent',
      defaultValue: 2,
      min: -10,
      max: 15,
      step: 0.5,
      unit: '%',
    },
    {
      key: 'marketingSpendChangePercent',
      label: 'Marketing Spend Change',
      description: 'Change in monthly marketing budget to support price change with more awareness.',
      type: 'percent',
      defaultValue: 3,
      min: -20,
      max: 50,
      step: 1,
      unit: '%',
    },
    {
      key: 'timeHorizonMonths',
      label: 'Time Horizon',
      description: 'Period to simulate this scenario.',
      type: 'duration',
      defaultValue: '6',
      options: [
        { value: '3', label: '3 Months' },
        { value: '6', label: '6 Months' },
        { value: '12', label: '12 Months' },
      ],
    },
  ],
  relevantBaselineKeys: ['monthlyRevenue', 'grossMarginPercent', 'monthlyProfit', 'cashBalance', 'cashRunwayMonths'],
  resultMetrics: ['revenue', 'grossProfit', 'cashBalance', 'cashRunway'],
};

// ─── Hire Sales Associate ──────────────────────────────────────────────────

const hireSalesAssociate: ScenarioTemplate = {
  id: 'hire_employee',
  name: 'Hire 1 Sales Associate',
  category: 'People & Staffing',
  description: 'Assess total payroll expansion versus projected sales growth from additional staff.',
  objective: 'When does this employee pay for themselves?',
  decisionInputs: [
    {
      key: 'numberOfEmployees',
      label: 'Number of New Hires',
      description: 'How many sales associates to bring on.',
      type: 'count',
      defaultValue: 1,
      min: 1,
      max: 5,
      step: 1,
    },
  ],
  assumptions: [
    {
      key: 'monthlySalary',
      label: 'Monthly Salary',
      description: 'Base monthly salary per employee (before benefits).',
      type: 'currency',
      defaultValue: 18000,
      min: 10000,
      max: 50000,
      step: 1000,
      unit: '฿',
    },
    {
      key: 'hiringOnboardingCost',
      label: 'Hiring & Onboarding Cost',
      description: 'One-time cost for recruitment, training, and setup per employee.',
      type: 'currency',
      defaultValue: 15000,
      min: 0,
      max: 100000,
      step: 5000,
      unit: '฿',
    },
    {
      key: 'startMonth',
      label: 'Start Month',
      description: 'Which month the new hire begins (1 = next month).',
      type: 'count',
      defaultValue: 1,
      min: 1,
      max: 6,
      step: 1,
    },
    {
      key: 'additionalMonthlySales',
      label: 'Expected Additional Monthly Sales',
      description: 'Projected additional revenue per employee at full productivity.',
      type: 'currency',
      defaultValue: 60000,
      min: 10000,
      max: 200000,
      step: 5000,
      unit: '฿',
    },
    {
      key: 'rampUpMonths',
      label: 'Ramp-up Period',
      description: 'Months until a new hire reaches full productivity.',
      type: 'count',
      defaultValue: 3,
      min: 1,
      max: 6,
      step: 1,
    },
    {
      key: 'timeHorizonMonths',
      label: 'Time Horizon',
      description: 'Period to simulate this scenario.',
      type: 'duration',
      defaultValue: '12',
      options: [
        { value: '6', label: '6 Months' },
        { value: '12', label: '12 Months' },
        { value: '24', label: '24 Months' },
      ],
    },
  ],
  relevantBaselineKeys: ['monthlyRevenue', 'monthlyPayroll', 'monthlyProfit', 'cashBalance', 'cashRunwayMonths'],
  resultMetrics: ['additionalPayroll', 'additionalRevenue', 'profitImpact', 'breakEvenMonth', 'roi', 'cashRunway'],
};

// ─── Reduce Supplier Cost ──────────────────────────────────────────────────

const reduceSupplierCost: ScenarioTemplate = {
  id: 'cost_reduction',
  name: 'Reduce Supplier Cost',
  category: 'Cost Efficiency',
  description: 'Model vendor discounts and cost-of-goods reductions on net profit and cash runway.',
  objective: 'Lower operating expense',
  decisionInputs: [
    {
      key: 'costReductionPercent',
      label: 'Supplier Cost Reduction',
      description: 'Expected percentage reduction in cost of goods from supplier negotiations.',
      type: 'percent',
      defaultValue: 8,
      min: 1,
      max: 25,
      step: 0.5,
      unit: '%',
    },
  ],
  assumptions: [
    {
      key: 'purchaseVolumeChangePercent',
      label: 'Purchase Volume Change',
      description: 'Change in purchase volume required to secure the discount.',
      type: 'percent',
      defaultValue: 10,
      min: 0,
      max: 50,
      step: 5,
      unit: '%',
    },
    {
      key: 'paymentTermsDays',
      label: 'New Payment Terms',
      description: 'New supplier payment terms in days (shorter may be required for discount).',
      type: 'count',
      defaultValue: 30,
      min: 7,
      max: 90,
      step: 1,
    },
    {
      key: 'minimumOrderQuantityIncrease',
      label: 'MOQ Increase',
      description: 'Percentage increase in minimum order quantity requirement.',
      type: 'percent',
      defaultValue: 15,
      min: 0,
      max: 100,
      step: 5,
      unit: '%',
    },
    {
      key: 'timeHorizonMonths',
      label: 'Time Horizon',
      description: 'Period to simulate this scenario.',
      type: 'duration',
      defaultValue: '6',
      options: [
        { value: '3', label: '3 Months' },
        { value: '6', label: '6 Months' },
        { value: '12', label: '12 Months' },
      ],
    },
  ],
  relevantBaselineKeys: ['monthlyCOGS', 'grossMarginPercent', 'monthlyProfit', 'cashBalance', 'cashRunwayMonths'],
  resultMetrics: ['cogs', 'grossMargin', 'grossProfit', 'cashFlow', 'workingCapital'],
};

// ─── Holiday Promotion ─────────────────────────────────────────────────────

const holidayPromotion: ScenarioTemplate = {
  id: 'holiday_promo',
  name: 'Holiday Promotion',
  category: 'Marketing Strategy',
  description: 'Simulate short-term marketing spend boost and seasonal revenue surges.',
  objective: 'Boost revenue during holidays',
  decisionInputs: [
    {
      key: 'marketingBudget',
      label: 'Marketing Budget',
      description: 'Total additional marketing spend for the promotion campaign.',
      type: 'currency',
      defaultValue: 50000,
      min: 10000,
      max: 500000,
      step: 5000,
      unit: '฿',
    },
    {
      key: 'discountPercent',
      label: 'Discount Offered',
      description: 'Percentage discount on products during the promotion.',
      type: 'percent',
      defaultValue: 15,
      min: 5,
      max: 50,
      step: 1,
      unit: '%',
    },
    {
      key: 'campaignDurationWeeks',
      label: 'Campaign Duration',
      description: 'Length of the promotion campaign.',
      type: 'duration',
      defaultValue: '4',
      options: [
        { value: '1', label: '1 Week' },
        { value: '2', label: '2 Weeks' },
        { value: '4', label: '4 Weeks' },
        { value: '8', label: '8 Weeks' },
      ],
    },
  ],
  assumptions: [
    {
      key: 'trafficIncreasePercent',
      label: 'Expected Traffic Increase',
      description: 'Projected increase in customer foot traffic or website visits.',
      type: 'percent',
      defaultValue: 25,
      min: 5,
      max: 100,
      step: 5,
      unit: '%',
    },
    {
      key: 'conversionIncreasePercent',
      label: 'Conversion Rate Increase',
      description: 'Expected improvement in purchase conversion rate during promotion.',
      type: 'percent',
      defaultValue: 10,
      min: 0,
      max: 50,
      step: 5,
      unit: '%',
    },
    {
      key: 'averageOrderValueChange',
      label: 'Average Order Value Change',
      description: 'Expected change in average order value (may decrease with discounts).',
      type: 'percent',
      defaultValue: -5,
      min: -30,
      max: 30,
      step: 1,
      unit: '%',
    },
    {
      key: 'repeatCustomerPercent',
      label: 'Expected Repeat Customers',
      description: 'Percentage of promotion customers who return within 3 months.',
      type: 'percent',
      defaultValue: 20,
      min: 0,
      max: 50,
      step: 5,
      unit: '%',
    },
  ],
  relevantBaselineKeys: ['monthlyRevenue', 'monthlyMarketing', 'monthlyProfit', 'cashBalance', 'cashRunwayMonths'],
  resultMetrics: ['additionalRevenue', 'marketingROI', 'profitAfterPromotion', 'breakEvenSalesVolume', 'cashImpact'],
};

// ─── Purchase Equipment ────────────────────────────────────────────────────

const purchaseEquipment: ScenarioTemplate = {
  id: 'equipment_purchase',
  name: 'Purchase Equipment',
  category: 'Capital Investment',
  description: 'Analyze upfront capital expenditure versus operational efficiency gains and payback period.',
  objective: 'Expand production capacity',
  decisionInputs: [
    {
      key: 'purchasePrice',
      label: 'Equipment Purchase Price',
      description: 'Total cost of the equipment including installation.',
      type: 'currency',
      defaultValue: 350000,
      min: 50000,
      max: 2000000,
      step: 10000,
      unit: '฿',
    },
    {
      key: 'financingMethod',
      label: 'Financing Method',
      description: 'How the equipment purchase will be funded.',
      type: 'select',
      defaultValue: 'cash',
      options: [
        { value: 'cash', label: 'Outright Cash Purchase' },
        { value: 'loan', label: 'SME Bank Loan (7% p.a.)' },
        { value: 'lease', label: 'Equipment Lease' },
      ],
    },
  ],
  assumptions: [
    {
      key: 'usefulLifeYears',
      label: 'Useful Life',
      description: 'Expected number of years the equipment will remain productive.',
      type: 'count',
      defaultValue: 5,
      min: 1,
      max: 15,
      step: 1,
    },
    {
      key: 'monthlyMaintenanceCost',
      label: 'Monthly Maintenance Cost',
      description: 'Ongoing monthly maintenance and servicing cost.',
      type: 'currency',
      defaultValue: 2000,
      min: 0,
      max: 20000,
      step: 500,
      unit: '฿',
    },
    {
      key: 'capacityIncreasePercent',
      label: 'Capacity Increase',
      description: 'Expected increase in production or service capacity.',
      type: 'percent',
      defaultValue: 20,
      min: 5,
      max: 100,
      step: 5,
      unit: '%',
    },
    {
      key: 'laborCostReductionPercent',
      label: 'Labor Cost Reduction',
      description: 'Expected reduction in labor costs through automation or efficiency.',
      type: 'percent',
      defaultValue: 10,
      min: 0,
      max: 50,
      step: 5,
      unit: '%',
    },
    {
      key: 'operatingCostReductionPercent',
      label: 'Operating Cost Reduction',
      description: 'Expected reduction in general operating costs.',
      type: 'percent',
      defaultValue: 5,
      min: 0,
      max: 30,
      step: 1,
      unit: '%',
    },
    {
      key: 'timeHorizonMonths',
      label: 'Time Horizon',
      description: 'Period to simulate this scenario.',
      type: 'duration',
      defaultValue: '12',
      options: [
        { value: '6', label: '6 Months' },
        { value: '12', label: '12 Months' },
        { value: '24', label: '24 Months' },
      ],
    },
  ],
  relevantBaselineKeys: ['monthlyRevenue', 'monthlyOpex', 'monthlyProfit', 'cashBalance', 'cashRunwayMonths'],
  resultMetrics: ['initialCashImpact', 'monthlySavings', 'capacityIncrease', 'paybackPeriod', 'roi', 'cashRunway'],
};

// ─── Expand Inventory ──────────────────────────────────────────────────────

const expandInventory: ScenarioTemplate = {
  id: 'inventory_expansion',
  name: 'Expand Inventory +20%',
  category: 'Inventory Strategy',
  description: 'Assess carrying costs and holding risk against higher stock availability.',
  objective: 'Prevent stockouts',
  decisionInputs: [
    {
      key: 'inventoryIncreasePercent',
      label: 'Inventory Increase',
      description: 'Percentage increase in inventory investment.',
      type: 'percent',
      defaultValue: 20,
      min: 5,
      max: 100,
      step: 5,
      unit: '%',
    },
  ],
  assumptions: [
    {
      key: 'demandIncreasePercent',
      label: 'Expected Demand Increase',
      description: 'Projected increase in customer demand that justifies the inventory expansion.',
      type: 'percent',
      defaultValue: 15,
      min: 0,
      max: 50,
      step: 5,
      unit: '%',
    },
    {
      key: 'sellThroughRatePercent',
      label: 'Sell-through Rate',
      description: 'Percentage of inventory expected to sell within the time horizon.',
      type: 'percent',
      defaultValue: 85,
      min: 50,
      max: 100,
      step: 5,
      unit: '%',
    },
    {
      key: 'supplierPaymentTermsDays',
      label: 'Supplier Payment Terms',
      description: 'Days before supplier payment is due after receiving inventory.',
      type: 'count',
      defaultValue: 30,
      min: 0,
      max: 90,
      step: 5,
    },
    {
      key: 'holdingCostPercent',
      label: 'Inventory Holding Cost',
      description: 'Monthly cost of holding inventory as a percentage of inventory value (storage, insurance, spoilage).',
      type: 'percent',
      defaultValue: 2,
      min: 0.5,
      max: 10,
      step: 0.5,
      unit: '%',
    },
    {
      key: 'timeHorizonMonths',
      label: 'Time Horizon',
      description: 'Period to simulate this scenario.',
      type: 'duration',
      defaultValue: '6',
      options: [
        { value: '3', label: '3 Months' },
        { value: '6', label: '6 Months' },
        { value: '12', label: '12 Months' },
      ],
    },
  ],
  relevantBaselineKeys: ['monthlyRevenue', 'inventoryValue', 'grossMarginPercent', 'cashBalance', 'cashRunwayMonths'],
  resultMetrics: ['inventoryValue', 'cashTiedUp', 'grossProfit', 'cashRunway', 'overstockRisk'],
};

// ─── Open New Branch ───────────────────────────────────────────────────────

const openNewBranch: ScenarioTemplate = {
  id: 'new_branch',
  name: 'Open New Branch',
  category: 'Expansion Strategy',
  description: 'Simulate multi-location expansion, initial setup costs, and runway requirements.',
  objective: 'Increase market presence',
  decisionInputs: [
    {
      key: 'rentDeposit',
      label: 'Rent Deposit',
      description: 'Upfront security deposit for the new location.',
      type: 'currency',
      defaultValue: 90000,
      min: 20000,
      max: 500000,
      step: 10000,
      unit: '฿',
    },
    {
      key: 'renovationCost',
      label: 'Renovation Cost',
      description: 'Fit-out, furniture, and design costs.',
      type: 'currency',
      defaultValue: 250000,
      min: 50000,
      max: 2000000,
      step: 10000,
      unit: '฿',
    },
    {
      key: 'equipmentCost',
      label: 'Equipment Cost',
      description: 'Equipment and fixtures for the new branch.',
      type: 'currency',
      defaultValue: 150000,
      min: 20000,
      max: 1000000,
      step: 10000,
      unit: '฿',
    },
    {
      key: 'initialInventory',
      label: 'Initial Inventory',
      description: 'Stock required to open the new location.',
      type: 'currency',
      defaultValue: 80000,
      min: 10000,
      max: 500000,
      step: 5000,
      unit: '฿',
    },
    {
      key: 'initialMarketing',
      label: 'Opening Marketing',
      description: 'Marketing spend for the branch launch.',
      type: 'currency',
      defaultValue: 30000,
      min: 5000,
      max: 200000,
      step: 5000,
      unit: '฿',
    },
  ],
  assumptions: [
    {
      key: 'monthlyRent',
      label: 'Monthly Rent',
      description: 'Recurring monthly rent for the new location.',
      type: 'currency',
      defaultValue: 35000,
      min: 10000,
      max: 150000,
      step: 5000,
      unit: '฿',
    },
    {
      key: 'monthlyStaffCost',
      label: 'Monthly Staff Cost',
      description: 'Total monthly payroll for new branch staff.',
      type: 'currency',
      defaultValue: 45000,
      min: 18000,
      max: 300000,
      step: 5000,
      unit: '฿',
    },
    {
      key: 'monthlyUtilities',
      label: 'Monthly Utilities',
      description: 'Electricity, water, internet, and other utilities.',
      type: 'currency',
      defaultValue: 8000,
      min: 2000,
      max: 30000,
      step: 1000,
      unit: '฿',
    },
    {
      key: 'monthlyMarketing',
      label: 'Monthly Marketing',
      description: 'Ongoing monthly marketing budget for the branch.',
      type: 'currency',
      defaultValue: 10000,
      min: 0,
      max: 50000,
      step: 2000,
      unit: '฿',
    },
    {
      key: 'expectedMonthlyRevenue',
      label: 'Expected Monthly Revenue',
      description: 'Projected monthly revenue at full maturity.',
      type: 'currency',
      defaultValue: 350000,
      min: 50000,
      max: 1000000,
      step: 10000,
      unit: '฿',
    },
    {
      key: 'revenueRampUpMonths',
      label: 'Revenue Ramp-up Period',
      description: 'Months until the branch reaches full revenue potential.',
      type: 'count',
      defaultValue: 4,
      min: 1,
      max: 12,
      step: 1,
    },
    {
      key: 'timeHorizonMonths',
      label: 'Time Horizon',
      description: 'Period to simulate this scenario.',
      type: 'duration',
      defaultValue: '12',
      options: [
        { value: '6', label: '6 Months' },
        { value: '12', label: '12 Months' },
        { value: '24', label: '24 Months' },
      ],
    },
  ],
  relevantBaselineKeys: ['monthlyRevenue', 'monthlyProfit', 'cashBalance', 'cashRunwayMonths'],
  resultMetrics: ['initialCashRequirement', 'monthlyBurn', 'breakEvenMonth', 'roi', 'cashRunway', 'requiredCashBuffer'],
};

// ─── Blank Custom Scenario ─────────────────────────────────────────────────

const blankCustom: ScenarioTemplate = {
  id: 'blank_scenario',
  name: 'Blank Custom Scenario',
  category: 'Custom Strategy',
  description: 'Build a decision from scratch with categorized business variables.',
  objective: 'Custom business objective',
  decisionInputs: [], // Custom builder handles its own inputs
  assumptions: [],
  relevantBaselineKeys: ['monthlyRevenue', 'grossMarginPercent', 'monthlyProfit', 'cashBalance', 'cashRunwayMonths'],
  resultMetrics: ['revenue', 'profit', 'cashFlow', 'cashRunway'],
};

// ─── Registry ──────────────────────────────────────────────────────────────

export const SCENARIO_TEMPLATES: ScenarioTemplate[] = [
  priceIncrease,
  hireSalesAssociate,
  reduceSupplierCost,
  holidayPromotion,
  purchaseEquipment,
  expandInventory,
  openNewBranch,
  blankCustom,
];

export function getScenarioTemplate(id: string): ScenarioTemplate | undefined {
  return SCENARIO_TEMPLATES.find((t) => t.id === id);
}

// ─── Custom Scenario Variable Categories ───────────────────────────────────

export interface VariableOption {
  key: string;
  label: string;
  category: string;
  defaultCurrent: number;
  unit: 'currency' | 'percent' | 'count';
  description: string;
}

export const CUSTOM_VARIABLE_CATEGORIES = [
  {
    name: 'Financial',
    variables: [
      { key: 'revenue', label: 'Revenue', category: 'Financial', defaultCurrent: 1200000, unit: 'currency' as const, description: 'Monthly revenue' },
      { key: 'price', label: 'Price', category: 'Financial', defaultCurrent: 250, unit: 'currency' as const, description: 'Average selling price' },
      { key: 'cogs', label: 'COGS', category: 'Financial', defaultCurrent: 816000, unit: 'currency' as const, description: 'Cost of goods sold' },
      { key: 'opex', label: 'Operating Expenses', category: 'Financial', defaultCurrent: 264000, unit: 'currency' as const, description: 'Monthly operating expenses' },
      { key: 'marketing', label: 'Marketing Spend', category: 'Financial', defaultCurrent: 40000, unit: 'currency' as const, description: 'Monthly marketing budget' },
      { key: 'inventory', label: 'Inventory Investment', category: 'Financial', defaultCurrent: 200000, unit: 'currency' as const, description: 'Total inventory value' },
    ],
  },
  {
    name: 'People',
    variables: [
      { key: 'employees', label: 'Employees', category: 'People', defaultCurrent: 8, unit: 'count' as const, description: 'Total headcount' },
      { key: 'payroll', label: 'Payroll', category: 'People', defaultCurrent: 180000, unit: 'currency' as const, description: 'Monthly payroll cost' },
    ],
  },
  {
    name: 'Operations',
    variables: [
      { key: 'capacity', label: 'Capacity', category: 'Operations', defaultCurrent: 100, unit: 'percent' as const, description: 'Current capacity utilization' },
      { key: 'supplierCost', label: 'Supplier Cost', category: 'Operations', defaultCurrent: 816000, unit: 'currency' as const, description: 'Monthly supplier costs' },
    ],
  },
  {
    name: 'Business',
    variables: [
      { key: 'volume', label: 'Product Volume', category: 'Business', defaultCurrent: 4800, unit: 'count' as const, description: 'Monthly units sold' },
      { key: 'demand', label: 'Customer Demand', category: 'Business', defaultCurrent: 100, unit: 'percent' as const, description: 'Demand index (100 = current)' },
    ],
  },
];

export type CustomObjective =
  | 'increase_profit'
  | 'increase_revenue'
  | 'improve_cash_flow'
  | 'reduce_risk'
  | 'increase_capacity'
  | 'custom';

export const CUSTOM_OBJECTIVES: { value: CustomObjective; label: string }[] = [
  { value: 'increase_profit', label: 'Increase Profit' },
  { value: 'increase_revenue', label: 'Increase Revenue' },
  { value: 'improve_cash_flow', label: 'Improve Cash Flow' },
  { value: 'reduce_risk', label: 'Reduce Risk' },
  { value: 'increase_capacity', label: 'Increase Capacity' },
  { value: 'custom', label: 'Custom Objective' },
];
