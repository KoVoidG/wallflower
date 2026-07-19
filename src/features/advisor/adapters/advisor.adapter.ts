// src/features/advisor/adapters/advisor.adapter.ts

// ── Types ───────────────────────────────────────────────────────────────────

export type EvidenceType = 'calculated' | 'user_input' | 'ai_interpretation';

export interface Evidence {
  type: EvidenceType;
  label: string;
  value: string;
  unit?: string;
  source?: string;
}

export interface Risk {
  title: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
}

export interface Action {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Uncertainty {
  items: string[];
  completeness: number;
}

export interface AIRecommendation {
  id: string;
  summary: string;
  evidence: Evidence[];
  risks: Risk[];
  actions: Action[];
  assumptions: string[];
  uncertainty: Uncertainty;
  disclaimer: string;
  createdAt: string;
}

export interface SuggestedPrompt {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export type AdvisorErrorType =
  | 'insufficient_data'
  | 'malformed_output'
  | 'timeout'
  | 'provider_unavailable';

export interface AdvisorError {
  type: AdvisorErrorType;
  message: string;
  partialData?: Partial<AIRecommendation>;
}

// ── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_RECOMMENDATION: AIRecommendation = {
  id: 'rec-001',
  summary:
    'GreenCafe should prioritize reducing monthly expenses by ฿12,400 and accelerating receivables collection to extend cash runway from 2.1 to 4.5 months within 60 days.',
  evidence: [
    {
      type: 'calculated',
      label: 'Monthly Net Loss',
      value: '฿12,400',
      unit: 'THB/month',
      source: 'Based on January 2025 data',
    },
    {
      type: 'calculated',
      label: 'Cash Runway',
      value: '2.1',
      unit: 'months',
      source: 'Cash reserve ÷ monthly burn rate',
    },
    {
      type: 'calculated',
      label: 'Outstanding Receivables',
      value: '฿53,340',
      unit: 'THB',
      source: 'January 2025 snapshot',
    },
    {
      type: 'user_input',
      label: 'Business Stage',
      value: 'Early Growth',
    },
    {
      type: 'user_input',
      label: 'Target Goal',
      value: 'Reduce costs',
    },
    {
      type: 'ai_interpretation',
      label: 'Expense Pattern',
      value: 'Payroll at 38% of revenue is manageable, but rent + utilities at 29% is above the 20-25% benchmark for cafes in Bangkok.',
      source: 'Industry benchmark comparison',
    },
  ],
  risks: [
    {
      title: 'Cash depletion within 3 months',
      severity: 'high',
      description:
        'At current burn rate of ฿12,400/month net loss, cash reserves of ฿280,000 will be critically low by March 2025.',
    },
    {
      title: 'Revenue stagnation during cost reduction',
      severity: 'medium',
      description:
        'Aggressive cost cutting may impact service quality and reduce customer retention, limiting revenue recovery.',
    },
    {
      title: 'Supplier relationship strain',
      severity: 'low',
      description:
        'Renegotiating supplier terms or switching vendors may affect product quality during transition.',
    },
  ],
  actions: [
    {
      title: 'Collect outstanding receivables (฿53,340)',
      description:
        'Contact customers with overdue invoices within 7 days. Offer 2% early payment discount for immediate settlement.',
      priority: 'high',
    },
    {
      title: 'Renegotiate rent or find subletting opportunity',
      description:
        'Current rent is 18% of revenue. Explore lease renegotiation, partial subletting during low-traffic hours, or shared space arrangement.',
      priority: 'high',
    },
    {
      title: 'Optimize menu for margin (not volume)',
      description:
        'Analyze menu item profitability. Remove low-margin items and promote high-margin alternatives to improve per-transaction value.',
      priority: 'medium',
    },
    {
      title: 'Introduce pre-paid packages or subscriptions',
      description:
        'Offer monthly coffee subscriptions at a 10% discount to lock in recurring revenue and improve cash flow predictability.',
      priority: 'medium',
    },
  ],
  assumptions: [
    'Revenue stays stable at ฿152,400/month',
    'No new fixed costs added in next 60 days',
    'Receivables are collectible within 30 days',
    'Rent renegotiation is possible at current lease terms',
  ],
  uncertainty: {
    items: [
      'Only 1 month of financial data available — trend analysis not possible',
      'Customer payment behavior is estimated from single snapshot',
      'Industry benchmarks are averages and may not apply to your specific location',
      'Seasonality effects not captured with limited data history',
    ],
    completeness: 35,
  },
  disclaimer:
    'This analysis is for informational purposes only and does not constitute financial, legal, or professional advice. Results are based on limited data and should be validated with qualified professionals before making business decisions.',
  createdAt: '2025-01-15T10:30:00Z',
};

const MOCK_PROMPTS: SuggestedPrompt[] = [
  {
    id: 'prompt-1',
    title: 'How can I improve my cash runway?',
    description: 'Get specific recommendations to extend your operating runway.',
    icon: 'TrendingUp',
  },
  {
    id: 'prompt-2',
    title: 'Should I hire a new employee?',
    description: 'Analyze the financial impact of adding headcount.',
    icon: 'Users',
  },
  {
    id: 'prompt-3',
    title: 'Where should I cut costs first?',
    description: 'Identify the highest-impact expense reductions.',
    icon: 'Scissors',
  },
  {
    id: 'prompt-4',
    title: 'Is my pricing competitive?',
    description: 'Evaluate your pricing against revenue and margin targets.',
    icon: 'DollarSign',
  },
];

// ── Mock Functions ──────────────────────────────────────────────────────────

export async function getAdvisorRecommendation(): Promise<AIRecommendation> {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return MOCK_RECOMMENDATION;
}

export async function getSuggestedPrompts(): Promise<SuggestedPrompt[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return MOCK_PROMPTS;
}

/**
 * Simulate various error scenarios for testing error states.
 */
export async function getAdvisorRecommendationWithError(
  errorType: AdvisorErrorType
): Promise<never> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const errors: Record<AdvisorErrorType, AdvisorError> = {
    insufficient_data: {
      type: 'insufficient_data',
      message: 'Not enough business data to generate meaningful advice. Please add at least 2 months of financial snapshots.',
    },
    malformed_output: {
      type: 'malformed_output',
      message: 'We couldn\'t generate advice at this time. The AI response was incomplete.',
    },
    timeout: {
      type: 'timeout',
      message: 'The AI service took too long to respond. Partial results may be available.',
      partialData: {
        summary: MOCK_RECOMMENDATION.summary,
        evidence: MOCK_RECOMMENDATION.evidence.slice(0, 2),
      },
    },
    provider_unavailable: {
      type: 'provider_unavailable',
      message: 'AI service temporarily unavailable. Your deterministic calculations and risk data are still accessible.',
    },
  };

  throw errors[errorType];
}
