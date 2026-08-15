// src/features/actions/adapters/actions.adapter.ts

export type ActionPriority = 'high' | 'medium' | 'low';
export type ActionExecutionStatus =
  | 'Planned'
  | 'In progress'
  | 'Blocked'
  | 'Execution complete'
  | 'Cancelled';

export type ActionStatus = ActionExecutionStatus | 'Action required' | 'Completed' | 'Monitoring';

export type OutcomeStatus =
  | 'Not ready for review'
  | 'Review due'
  | 'Monitoring'
  | 'Target met'
  | 'Partially met'
  | 'Target not met'
  | 'Not measurable'
  | 'Pending review';

export type ActionSource = 'risk' | 'simulation' | 'advisor' | 'manual' | 'cash_flow' | 'health';

export interface ExecutionStep {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  blocker?: string;
}

export interface DetailedActionItem {
  id: string;
  title: string;
  description: string;
  objective: string;
  relatedRiskOrDecision: string;
  expectedImpact: string;
  owner: string;
  startDate?: string;
  dueDate: string;
  reviewDate?: string;
  priority: ActionPriority;
  executionStatus: ActionExecutionStatus;
  status: ActionStatus;
  notes: string;
  source: ActionSource;
  sourceItemTitle?: string;
  sourceHref?: string;
  createdDate: string;
  steps?: ExecutionStep[];
  blocker?: {
    description: string;
    dateReported: string;
    affectedStep?: string;
  };
  outcomeReview?: {
    expectedTarget: string;
    observedResult?: string;
    status: OutcomeStatus;
    recordedDate?: string;
    notes?: string;
    followUpAction?: string;
  };
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
    title: 'Request landlord rent deferral proposal',
    description: 'Propose postponing annual 5% commercial lease increase until Q3 2025 sales ramp-up.',
    objective: 'Prevent fixed expense expansion to maintain monthly operating burn below current deficit threshold.',
    relatedRiskOrDecision: 'LANDLORD_RENT_INCREASE',
    expectedImpact: 'Preserves ฿3,500/mo operating burn buffer through June 2025.',
    owner: 'General Manager',
    startDate: '2025-01-22',
    dueDate: '2025-02-02',
    reviewDate: '2025-02-28',
    priority: 'high',
    executionStatus: 'Blocked',
    status: 'Blocked',
    notes: 'Landlord requested formal sales statement before considering deferral.',
    source: 'advisor',
    sourceItemTitle: 'Capybot · Fixed Expense Optimisation',
    sourceHref: '/dashboard',
    createdDate: '2025-01-20',
    blocker: {
      description: 'Waiting for Q4 verified sales statement from accounting advisor.',
      dateReported: '2025-01-26',
      affectedStep: 'Submit formal deferral petition letter',
    },
    steps: [
      { id: 'st-201', title: 'Obtain verified Q4 sales statement', completed: false, dueDate: '2025-01-30', blocker: 'Accounting audit delayed' },
      { id: 'st-202', title: 'Send revised lease proposal', completed: false, dueDate: '2025-02-01' },
      { id: 'st-203', title: 'Sign amended lease addendum', completed: false, dueDate: '2025-02-02' },
    ],
    outcomeReview: {
      expectedTarget: 'Preserve ฿3,500/mo operating burn buffer',
      status: 'Not ready for review',
    },
  },
  {
    id: 'act-002',
    title: 'Negotiate early invoice collection for Client #1042',
    description: 'Offer 2% prompt settlement discount to collect ฿21,340 overdue invoice balance before Feb 15 payroll.',
    objective: 'Collect overdue receivables from Client A to protect the minimum usable cash buffer of ฿164,800.',
    relatedRiskOrDecision: 'OVERDUE_RECEIVABLES_DRAG',
    expectedImpact: 'Recovers ฿21,340 usable cash immediately; extends runway by +0.3 months.',
    owner: 'Sales Lead',
    startDate: '2025-01-20',
    dueDate: '2025-02-05',
    reviewDate: '2025-02-15',
    priority: 'high',
    executionStatus: 'In progress',
    status: 'In progress',
    notes: 'Contacted Client A accounting department on Jan 22; payment authorization pending final CFO sign-off.',
    source: 'risk',
    sourceItemTitle: 'Risk Center · Overdue Receivables Drag',
    sourceHref: '/business-health?tab=risks',
    createdDate: '2025-01-18',
    steps: [
      { id: 'st-1', title: 'Issue formal payment reminder with 2% discount offer', completed: true, dueDate: '2025-01-22' },
      { id: 'st-2', title: 'Confirm revised payment schedule with Client CFO', completed: true, dueDate: '2025-01-25' },
      { id: 'st-3', title: 'Verify bank deposit and record cash receipt in ledger', completed: false, dueDate: '2025-02-05' },
    ],
    outcomeReview: {
      expectedTarget: 'Recovers ฿21,340 cash buffer',
      status: 'Not ready for review',
    },
  },
  {
    id: 'act-003',
    title: 'Procure commercial oven via 24-month SME bank loan',
    description: 'Structure commercial oven expansion via SME bank financing rather than outright cash capital expenditure.',
    objective: 'Increase production capacity by 15% without reducing the ฿164,800 liquid cash reserve.',
    relatedRiskOrDecision: 'EQUIPMENT_CAPEX_PRESSURE',
    expectedImpact: 'Avoids ฿200,000 immediate cash outlay; preserves +1.4 months runway.',
    owner: 'Financial Officer',
    startDate: '2025-01-10',
    dueDate: '2025-01-28',
    reviewDate: '2025-03-01',
    priority: 'medium',
    executionStatus: 'Execution complete',
    status: 'Execution complete',
    notes: 'SME Bank loan approved at 7.5% tenure; oven installed and operational on Feb 12.',
    source: 'simulation',
    sourceItemTitle: 'Simulation · Equipment Purchase via SME Loan',
    sourceHref: '/simulations',
    createdDate: '2025-01-15',
    steps: [
      { id: 'st-301', title: 'Run simulation comparing cash purchase vs loan', completed: true, dueDate: '2025-01-15' },
      { id: 'st-302', title: 'Submit bank loan application for ฿200,000 principal', completed: true, dueDate: '2025-01-20' },
      { id: 'st-303', title: 'Finalize vendor equipment delivery agreement', completed: true, dueDate: '2025-01-28' },
    ],
    outcomeReview: {
      expectedTarget: 'Avoid ฿200,000 cash depletion & expand revenue capacity',
      observedResult: 'Revenue variance +฿14,200/mo; profit variance +฿5,000/mo.',
      status: 'Review due',
      recordedDate: '2025-03-01',
      notes: 'Oven installation increased weekend batch output by 18%.',
      followUpAction: 'Review first-quarter debt service ratio in April',
    },
  },
  {
    id: 'act-004',
    title: 'Audit marketing acquisition budget allocations',
    description: 'Reallocate ฿12,000 monthly ad spend toward high-conversion local organic channels.',
    objective: 'Optimize marketing acquisition cost and raise sales conversion efficiency.',
    relatedRiskOrDecision: 'MARKETING_ACQUISITION_EFFICIENCY',
    expectedImpact: 'Improves customer acquisition ROI from 2.4x to 3.1x.',
    owner: 'Marketing Lead',
    dueDate: '2025-03-15',
    priority: 'low',
    executionStatus: 'Planned',
    status: 'Planned',
    notes: 'Scheduled for implementation after Q1 sales campaign evaluation.',
    source: 'manual',
    sourceItemTitle: 'User Created',
    createdDate: '2025-01-22',
    steps: [
      { id: 'st-401', title: 'Audit Facebook ad campaign performance metrics', completed: false, dueDate: '2025-03-01' },
      { id: 'st-402', title: 'Reallocate ฿12,000 spend to local influencer trial', completed: false, dueDate: '2025-03-15' },
    ],
    outcomeReview: {
      expectedTarget: 'Raise acquisition ROI to 3.1x',
      status: 'Not ready for review',
    },
  },
  {
    id: 'act-005',
    title: 'Implement barista cross-training program',
    description: 'Train existing shift staff on specialty coffee preparation to cover peak weekend rushes without additional hiring.',
    objective: 'Maintain customer wait times under 4 minutes while capping payroll expansion.',
    relatedRiskOrDecision: 'STAFFING_CAPACITY_LIMIT',
    expectedImpact: 'Saves ฿25,000/mo in new barista hiring costs.',
    owner: 'Operations Lead',
    startDate: '2024-12-01',
    dueDate: '2024-12-28',
    reviewDate: '2025-01-15',
    priority: 'medium',
    executionStatus: 'Execution complete',
    status: 'Execution complete',
    notes: 'Training completed across 4 full-time baristas.',
    source: 'health',
    sourceItemTitle: 'Business Health · Labor Productivity Diagnostic',
    sourceHref: '/health',
    createdDate: '2024-11-25',
    steps: [
      { id: 'st-501', title: 'Conduct espresso machine calibration workshop', completed: true, dueDate: '2024-12-10' },
      { id: 'st-502', title: 'Evaluate weekend speed & quality metrics', completed: true, dueDate: '2024-12-28' },
    ],
    outcomeReview: {
      expectedTarget: 'Keep wait times under 4 minutes & save ฿25,000/mo payroll',
      observedResult: 'Wait times reduced to 3.2 mins; payroll burn capped.',
      status: 'Target met',
      recordedDate: '2025-01-15',
      notes: 'Cross-training successfully absorbed weekend volume spikes.',
      followUpAction: 'Schedule refresher workshop in Q2',
    },
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
];

export async function getActionsData(): Promise<ActionsPageData> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return {
    actions: MOCK_ACTIONS,
    decisions: MOCK_DECISIONS,
  };
}
