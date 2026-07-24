// src/features/actions/adapters/actions.adapter.ts

export type ActionPriority = 'high' | 'medium' | 'low';
export type ActionStatus = 'Not started' | 'In progress' | 'Completed' | 'Deferred';
export type ActionSource = 'risk' | 'simulation' | 'advisor' | 'manual';

export interface DetailedActionItem {
  id: string;
  title: string;
  description: string;
  relatedRiskOrDecision: string;
  expectedImpact: string;
  owner: string;
  dueDate: string;
  priority: ActionPriority;
  status: ActionStatus;
  notes: string;
  source: ActionSource;
  createdDate: string;
}

export type DecisionStatus = 'Selected' | 'Under Review' | 'Executed' | 'Deferred';

export interface DecisionLogItem {
  id: string;
  decisionTitle: string;
  selectedScenario: string;
  expectedImpact: string;
  expectedDownside: string;
  importantAssumptions: string[];
  decisionDate: string;
  reviewDate: string;
  status: DecisionStatus;
  relatedActions: string[];
  actualOutcome?: {
    recordedDate: string;
    revenueVariance: string;
    profitVariance: string;
    notes: string;
  } | null;
}

export interface ActionsPageData {
  actions: DetailedActionItem[];
  decisions: DecisionLogItem[];
}

const MOCK_ACTIONS: DetailedActionItem[] = [
  {
    id: 'act-001',
    title: 'Negotiate Early Invoice Collection for Client Invoice #1042',
    description: 'Offer 2% prompt settlement discount to collect ฿14,340 overdue invoice.',
    relatedRiskOrDecision: 'OVERDUE_RECEIVABLES_DRAG',
    expectedImpact: 'Recovers ฿14,340 usable cash immediately; extends runway by +0.2 mo.',
    owner: 'Sales Lead',
    dueDate: '2025-02-05',
    priority: 'high',
    status: 'In progress',
    notes: 'Contacted Client A accounting lead on Jan 20; awaiting approval.',
    source: 'risk',
    createdDate: '2025-01-18',
  },
  {
    id: 'act-002',
    title: 'Request Landlord Commercial Rent Adjustment Deferral',
    description: 'Propose postponing annual 5% rent increase until Q3 2025.',
    relatedRiskOrDecision: 'LANDLORD_RENT_INCREASE',
    expectedImpact: 'Preserves ฿3,500/mo operating burn buffer through June.',
    owner: 'General Manager',
    dueDate: '2025-02-15',
    priority: 'high',
    status: 'Not started',
    notes: 'Draft letter prepared for landlord review.',
    source: 'advisor',
    createdDate: '2025-01-20',
  },
  {
    id: 'act-003',
    title: 'Simulate SME Bank Loan vs Equipment Lease',
    description: 'Test financing alternatives for commercial oven replacement.',
    relatedRiskOrDecision: 'EQUIPMENT_CAPEX_PRESSURE',
    expectedImpact: 'Avoids ฿200,000 outright cash reduction on runway.',
    owner: 'Financial Officer',
    dueDate: '2025-02-10',
    priority: 'medium',
    status: 'Completed',
    notes: 'Simulation completed; equipment loan scenario selected.',
    source: 'simulation',
    createdDate: '2025-01-15',
  },
  {
    id: 'act-004',
    title: 'Audit Discretionary Social Media Marketing Spend',
    description: 'Reallocate ฿12,000 ad budget toward high-conversion local channels.',
    relatedRiskOrDecision: 'MARKETING_ACQUISITION_EFFICIENCY',
    expectedImpact: 'Improves marketing ROI from 2.4x to 3.1x.',
    owner: 'Marketing Lead',
    dueDate: '2025-02-28',
    priority: 'low',
    status: 'Deferred',
    notes: 'Deferred pending Q1 sales review.',
    source: 'manual',
    createdDate: '2025-01-22',
  },
];

const MOCK_DECISIONS: DecisionLogItem[] = [
  {
    id: 'dec-001',
    decisionTitle: 'Procure Kitchen Equipment via 24-Month SME Loan',
    selectedScenario: 'Equipment Purchase (SME Bank Loan Option)',
    expectedImpact: 'Increases monthly operating capacity by 15%; monthly loan installment ฿9,200.',
    expectedDownside: 'Monthly fixed debt repayment increases to ฿24,200.',
    importantAssumptions: ['24-month loan tenure at 7.5% interest', '฿12,000 annual maintenance'],
    decisionDate: '2025-01-18',
    reviewDate: '2025-04-18',
    status: 'Executed',
    relatedActions: ['act-003'],
    actualOutcome: {
      recordedDate: '2025-03-01',
      revenueVariance: '+฿14,200/mo (On Track)',
      profitVariance: '+฿5,000/mo',
      notes: 'Oven installed on Feb 12; production efficiency met expectations.',
    },
  },
  {
    id: 'dec-002',
    decisionTitle: 'Hire 2 Additional Service Staff for Weekend Rush',
    selectedScenario: 'Hire Employees (Expected Case)',
    expectedImpact: '+฿19,600/month revenue expansion after 3-month onboarding.',
    expectedDownside: '+฿57,500/month initial payroll burn prior to ramp-up.',
    importantAssumptions: ['Base salary ฿25,000/mo', '15% social security', '3-month sales velocity'],
    decisionDate: '2025-01-22',
    reviewDate: '2025-05-22',
    status: 'Under Review',
    relatedActions: ['act-001'],
    actualOutcome: null, // Placeholder: Actual outcome not yet entered
  },
];

export async function getActionsData(): Promise<ActionsPageData> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    actions: MOCK_ACTIONS,
    decisions: MOCK_DECISIONS,
  };
}
