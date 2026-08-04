import { z } from 'zod';

// --- Enum Values & Labels ---

export const INDUSTRY_VALUES = [
  'food_beverage',
  'retail',
  'service',
  'technology',
  'manufacturing',
  'agriculture',
  'tourism',
  'healthcare',
  'education',
  'other',
] as const;

export const BUSINESS_TYPE_VALUES = [
  'sole_proprietor',
  'partnership',
  'limited_company',
  'corporation',
  'other',
] as const;

export const STAGE_VALUES = [
  'idea',
  'startup',
  'growing',
  'established',
  'declining',
] as const;

export const SIZE_VALUES = ['solo', 'micro', 'small', 'medium'] as const;

export const INDUSTRY_LABELS: Record<string, string> = {
  food_beverage: 'Food & Beverage',
  retail: 'Retail',
  service: 'Service',
  technology: 'Technology',
  manufacturing: 'Manufacturing',
  agriculture: 'Agriculture',
  tourism: 'Tourism & Hospitality',
  healthcare: 'Healthcare',
  education: 'Education',
  other: 'Other',
};

export const REVENUE_MODEL_VALUES = [
  'direct_sales',
  'subscription_recurring',
  'wholesale_distributor',
  'service_retainer',
  'project_contract',
  'marketplace_commission',
  'hybrid',
  'other',
] as const;

export const REVENUE_MODEL_LABELS: Record<string, string> = {
  direct_sales: 'Direct Retail / Sales',
  subscription_recurring: 'Subscription / Recurring',
  wholesale_distributor: 'Wholesale / B2B Distribution',
  service_retainer: 'Service Retainer / Hourly',
  project_contract: 'Project-Based Contracts',
  marketplace_commission: 'Commission / Marketplace',
  hybrid: 'Hybrid Model',
  other: 'Other Revenue Model',
};

export const STAGE_LABELS: Record<string, string> = {
  idea: 'Idea Stage (< 1 year)',
  startup: 'Startup (1–2 years)',
  growing: 'Growing Business (2–5 years)',
  established: 'Established (5+ years)',
  declining: 'Restructuring / Pivot',
};

export const GOAL_OPTIONS = [
  'Understand business health',
  'Improve cash flow',
  'Reduce risk',
  'Evaluate hiring',
  'Test pricing',
  'Plan a purchase',
  'Prepare for expansion',
  'Prepare for financing',
  'Improve profitability',
  'Not sure yet',
] as const;

export const TARGET_TIMELINE_OPTIONS = [
  'Immediate (Next 30 days)',
  'Short term (1–3 months)',
  'Medium term (3–6 months)',
  'Long term (6–12 months)',
  'Ongoing planning',
] as const;

export const RISK_APPROACH_OPTIONS = [
  { value: 'conservative', label: 'Conservative', desc: 'Prioritizes safety reserves, higher cash buffers, and early risk warnings.' },
  { value: 'balanced', label: 'Balanced', desc: 'Balances risk protection with steady growth opportunities.' },
  { value: 'growth', label: 'Growth-focused', desc: 'Prioritizes capital deployment and expansion velocity.' },
] as const;

// --- Normalized Business Value Interface ---

export type ValueQuality = 'actual' | 'estimate' | 'unknown' | 'skipped';
export type ValueSource = 'manual' | 'spreadsheet' | 'sample';

export interface BusinessValue {
  value: number | null;
  quality: ValueQuality;
  source: ValueSource;
  confirmedByUser: boolean;
}

export function createBusinessValue(
  value: number | null = null,
  quality: ValueQuality = 'actual',
  source: ValueSource = 'manual',
  confirmedByUser: boolean = true
): BusinessValue {
  return {
    value: value !== null && !isNaN(value) ? Math.max(0, value) : null,
    quality,
    source,
    confirmedByUser,
  };
}

// --- Normalized Onboarding Data Interface ---

export interface OnboardingData {
  setupMethod?: 'know_numbers' | 'need_guidance' | 'just_starting';
  goals: {
    selectedGoals: string[];
    mainConcern?: string;
    targetOutcome?: string;
    targetTimeline?: string;
  };
  business: {
    name: string;
    category?: string;
    industry?: string;
    size?: 'Micro' | 'Small' | 'Medium' | string;
    age?: string;
    storeType?: 'Physical' | 'Online' | 'Both' | string;
    branches?: string;
    currency?: string;
    language?: string;
    location?: string;
    userRole?: string;
    revenueModel?: string;
    stage?: string;
    employeeCount?: number;
    operatingSince?: string;
  };
  operations?: {
    employees: number;
    openingHours: string;
    operatingDays: string;
    transactionsPerDay: number;
    customersPerDay: number;
    suppliersCount: number;
    businessNotes?: string;
  };
  financials: {
    reportingPeriod?: string;
    revenueQuality?: 'actual' | 'estimate';
    isTypicalMonth?: boolean;
    revenueTrend?: 'growing' | 'stable' | 'declining';
    monthlyRevenue?: BusinessValue;
    typicalRevenue?: BusinessValue;
    monthlyExpenses?: BusinessValue;
    operatingExpenses?: BusinessValue;
    payrollExpenses?: BusinessValue;
    rent?: BusinessValue;
    utilities?: BusinessValue;
    marketing?: BusinessValue;
    cashOnHand?: BusinessValue;
    bankBalance?: BusinessValue;
    outstandingLoans?: BusinessValue;
    expenseBreakdown?: Record<string, BusinessValue>;
    availableCash?: BusinessValue;
    reservedCash?: BusinessValue;
    receivables?: BusinessValue;
    overdueReceivables?: BusinessValue;
    upcomingPayables?: BusinessValue;
    monthlyDebtRepayment?: BusinessValue;
    totalDebt?: BusinessValue;
  };
  inventory?: {
    estimatedValue: BusinessValue;
    categories: string[];
    restockFrequency: string;
    shortages: 'Never' | 'Sometimes' | 'Often';
    turnover?: string;
    deadStockPct?: string;
  };
  assumptions?: {
    demand: 'Declining' | 'Stable' | 'Growing';
    supplierCostTrend: 'Falling' | 'Stable' | 'Rising';
    seasonality: 'None' | 'Low' | 'Medium' | 'High';
    competition: 'Low' | 'Medium' | 'High';
    recordConfidence: 'Low' | 'Moderate' | 'High' | 'Very High';
    expansionPlans?: string;
  };
  gaps?: {
    overdueReceivablesShare?: number;
    customerConcentration?: boolean;
    unusualExpenses?: boolean;
    largePaymentDue?: boolean;
    recentChanges?: string;
  };
  preferences: {
    riskApproach: 'conservative' | 'balanced' | 'growth';
    minimumRunwayMonths: number;
    forecastMonths: 3 | 6 | 12 | 24;
  };
}

// --- Zod Validation Schemas ---

export const goalsStepSchema = z.object({
  selectedGoals: z.array(z.string()).min(1, 'Please select at least one goal'),
  mainConcern: z.string().optional(),
  targetOutcome: z.string().optional(),
  targetTimeline: z.string().optional(),
});

export const businessProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Business name is required')
    .max(100, 'Business name must be at most 100 characters'),
  industry: z.enum(INDUSTRY_VALUES, {
    invalid_type_error: 'Invalid industry value',
  }).optional(),
  type: z.enum(BUSINESS_TYPE_VALUES).optional(),
  stage: z.enum(STAGE_VALUES).optional(),
  size: z.enum(SIZE_VALUES).optional(),
  location: z.string().optional(),
  goals: z.array(z.string()).optional(),
  userRole: z.string().optional(),
  revenueModel: z.string().optional(),
  employeeCount: z.number().optional(),
});

export const preferencesSchema = z.object({
  riskApproach: z.enum(['conservative', 'balanced', 'growth']),
  minimumRunwayMonths: z.number().min(1).max(24),
  forecastMonths: z.union([z.literal(3), z.literal(6), z.literal(12), z.literal(24)]),
});

// Backward compatibility financial snapshot schema for dashboard snapshot modal and unit tests
export const financialSnapshotSchema = z.object({
  month: z.coerce.date({ invalid_type_error: 'Invalid date' }),
  revenue: z.number().min(0, 'Revenue must be non-negative'),
  expenseCategories: z
    .record(z.string(), z.number().min(0, 'Expense values must be non-negative'))
    .refine((obj) => Object.keys(obj).length > 0, {
      message: 'At least one expense category is required',
    }),
  cashReserve: z.number().min(0, 'Cash reserve must be non-negative'),
  receivables: z.number().min(0, 'Receivables must be non-negative'),
  payables: z.number().min(0, 'Payables must be non-negative'),
  debt: z.number().min(0, 'Debt must be non-negative'),
});
export type FinancialSnapshot = z.infer<typeof financialSnapshotSchema>;

export const onboardingSchema = z.object({
  business: businessProfileSchema,
  financial: financialSnapshotSchema,
});

export const defaultOnboardingData: OnboardingData = {
  setupMethod: 'know_numbers',
  goals: {
    selectedGoals: ['Understand business health'],
    mainConcern: '',
    targetOutcome: '',
    targetTimeline: 'Short term (1–3 months)',
  },
  business: {
    name: 'Somchai Retail Store',
    category: 'Grocery Store',
    industry: 'retail',
    size: 'Micro',
    age: '1–3 years',
    storeType: 'Physical',
    branches: '1',
    currency: 'THB (Baht)',
    language: 'English',
    location: 'Bangkok, Thailand',
    userRole: 'Owner / Founder',
    revenueModel: 'direct_sales',
    stage: 'growing',
    employeeCount: 6,
    operatingSince: '2022',
  },
  operations: {
    employees: 6,
    openingHours: '8:00 AM - 8:00 PM',
    operatingDays: '6 days',
    transactionsPerDay: 120,
    customersPerDay: 80,
    suppliersCount: 5,
    businessNotes: 'Retail grocery store focusing on fresh local food and daily essentials.',
  },
  financials: {
    reportingPeriod: new Date().toISOString().substring(0, 7),
    revenueQuality: 'actual',
    isTypicalMonth: true,
    revenueTrend: 'stable',
    monthlyRevenue: createBusinessValue(1200000, 'actual', 'manual'),
    operatingExpenses: createBusinessValue(820000, 'actual', 'manual'),
    payrollExpenses: createBusinessValue(180000, 'actual', 'manual'),
    rent: createBusinessValue(60000, 'actual', 'manual'),
    utilities: createBusinessValue(15000, 'actual', 'manual'),
    marketing: createBusinessValue(20000, 'actual', 'manual'),
    cashOnHand: createBusinessValue(150000, 'actual', 'manual'),
    bankBalance: createBusinessValue(200000, 'actual', 'manual'),
    outstandingLoans: createBusinessValue(300000, 'actual', 'manual'),
    typicalRevenue: createBusinessValue(1200000, 'actual', 'manual'),
    monthlyExpenses: createBusinessValue(820000, 'actual', 'manual'),
    expenseBreakdown: {
      Payroll: createBusinessValue(180000, 'actual', 'manual'),
      Rent: createBusinessValue(60000, 'actual', 'manual'),
      Utilities: createBusinessValue(15000, 'actual', 'manual'),
      Marketing: createBusinessValue(20000, 'actual', 'manual'),
    },
    availableCash: createBusinessValue(150000, 'actual', 'manual'),
    reservedCash: createBusinessValue(200000, 'actual', 'manual'),
    totalDebt: createBusinessValue(300000, 'actual', 'manual'),
  },
  inventory: {
    estimatedValue: createBusinessValue(350000, 'actual', 'manual'),
    categories: ['Beverages', 'Snacks', 'Daily Essentials'],
    restockFrequency: 'Every 1-2 weeks',
    shortages: 'Sometimes',
    turnover: '4–6 times per year',
    deadStockPct: '5% or less',
  },
  assumptions: {
    demand: 'Stable',
    supplierCostTrend: 'Stable',
    seasonality: 'Low',
    competition: 'Medium',
    recordConfidence: 'High',
    expansionPlans: 'Considering online order delivery expansion.',
  },
  gaps: {
    overdueReceivablesShare: 15,
    customerConcentration: false,
    unusualExpenses: false,
    largePaymentDue: false,
    recentChanges: '',
  },
  preferences: {
    riskApproach: 'balanced',
    minimumRunwayMonths: 3,
    forecastMonths: 6,
  },
};
