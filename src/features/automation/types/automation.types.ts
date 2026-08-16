// src/features/automation/types/automation.types.ts

export type AutomationStatus = 'active' | 'paused' | 'draft';
export type ExecutionStatus = 'idle' | 'running' | 'success' | 'failed';
export type ActionType = 'extract' | 'llm' | 'simulation' | 'notification' | 'task';

export interface AutomationStep {
  name: string;
  type: ActionType;
  duration: number;
  logMsgs: string[];
}

export interface AutomationActionItem {
  id: string;
  name: string;
  description: string;
  type: ActionType;
  duration: string;
  iconName: string;
}

export interface ExecutionRecord {
  id: string;
  time: string;
  status: 'success' | 'running' | 'failed';
  duration: string;
  summary: string;
}

export interface AutomationRule {
  id: string;
  title: string;
  description: string;
  category: string;
  status: AutomationStatus;
  executionStatus: ExecutionStatus;
  trigger: {
    name: string;
    condition: string;
    conditionDescription: string;
    frequency: string;
    type: string;
  };
  connectedSystem: string;
  actionsCount: number;
  runsCount: number;
  successRate: number;
  lastCheck: string;
  iconName: string;
  actionItems: AutomationActionItem[];
  steps: AutomationStep[];
  history: ExecutionRecord[];
  runtimeSettings: {
    autoRunOnTrigger: boolean;
    timeoutMs: number;
    retryAttempts: number;
    stopOnError: boolean;
  };
  tags: string[];
}

export type NodeCategory =
  | 'trigger'
  | 'analysis'
  | 'logic'
  | 'action'
  | 'data'
  | 'terminate';

export interface WorkflowNodeConfig {
  // Trigger
  triggerType?: 'threshold' | 'schedule' | 'event' | 'manual';
  condition?: string;
  conditionDescription?: string;
  frequency?: string;
  metric?: string;
  operator?: string;
  value?: string;
  unit?: string;
  // Logic (If/Else / Branch)
  logicType?: 'if_else' | 'condition' | 'wait' | 'branch';
  trueAction?: string;
  falseAction?: string;
  waitDuration?: string;
  // Analysis / AI
  analysisType?: 'metric' | 'business_data' | 'capybot' | 'risk' | 'simulation';
  purpose?: string;
  output?: string;
  duration?: string;
  scenarioName?: string;
  simulationMode?: string;
  // Actions
  actionType?: 'notification' | 'action_item' | 'update_record' | 'run_workflow' | 'log_result';
  recipients?: string;
  channel?: string;
  targetRecord?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  // Data
  dataSource?: 'financial' | 'inventory' | 'operations';
  query?: string;
}

export interface WorkflowNodeData {
  name: string;
  category: NodeCategory;
  nodeType: string;
  description: string;
  iconName: string;
  stepNumber?: number;
  executionStatus?: ExecutionStatus;
  isActiveStep?: boolean;
  selected?: boolean;
  config: WorkflowNodeConfig;
  [key: string]: unknown;
}

export interface NodeLibraryItem {
  id: string;
  type: string;
  category: NodeCategory;
  name: string;
  description: string;
  iconName: string;
  defaultConfig: WorkflowNodeConfig;
}

export const NODE_LIBRARY_PRESETS: { category: NodeCategory; label: string; items: NodeLibraryItem[] }[] = [
  {
    category: 'trigger',
    label: 'Triggers',
    items: [
      {
        id: 'trigger-threshold',
        type: 'triggerNode',
        category: 'trigger',
        name: 'Threshold Trigger',
        description: 'Runs when a business metric crosses a predefined threshold.',
        iconName: 'ShieldAlert',
        defaultConfig: {
          triggerType: 'threshold',
          metric: 'Cash Runway',
          operator: 'is less than',
          value: '3.0',
          unit: 'months',
          condition: 'Cash runway < 3.0 months',
          frequency: 'Every 4 hours',
        },
      },
      {
        id: 'trigger-schedule',
        type: 'triggerNode',
        category: 'trigger',
        name: 'Schedule Trigger',
        description: 'Runs on a recurring schedule, cron pattern, or time interval.',
        iconName: 'SlidersHorizontal',
        defaultConfig: {
          triggerType: 'schedule',
          frequency: 'Daily (9:00 AM)',
          condition: 'Schedule: Daily at 9:00 AM',
        },
      },
      {
        id: 'trigger-event',
        type: 'triggerNode',
        category: 'trigger',
        name: 'Business Event',
        description: 'Triggers immediately when an external event or webhook arrives.',
        iconName: 'Zap',
        defaultConfig: {
          triggerType: 'event',
          condition: 'Event: New Invoice Received',
          frequency: 'Immediate Event Hook',
        },
      },
      {
        id: 'trigger-manual',
        type: 'triggerNode',
        category: 'trigger',
        name: 'Manual Trigger',
        description: 'Triggered on-demand by a user or an executive button click.',
        iconName: 'Play',
        defaultConfig: {
          triggerType: 'manual',
          condition: 'Manual On-Demand',
          frequency: 'Manual Trigger',
        },
      },
    ],
  },
  {
    category: 'analysis',
    label: 'Analysis & AI',
    items: [
      {
        id: 'analysis-metric',
        type: 'analysisNode',
        category: 'analysis',
        name: 'Calculate Metric',
        description: 'Compute operational burn rate, margins, or inventory coverage ratios.',
        iconName: 'LineChart',
        defaultConfig: {
          analysisType: 'metric',
          purpose: 'Calculate net cash burn and 30-day projected runway.',
          output: 'Projected runway & burn rate figures',
        },
      },
      {
        id: 'analysis-data',
        type: 'analysisNode',
        category: 'analysis',
        name: 'Analyze Business Data',
        description: 'Scan tabular data, extract trends, and detect anomalies.',
        iconName: 'FileText',
        defaultConfig: {
          analysisType: 'business_data',
          purpose: 'Scan accounts payable aging records for high-risk vendors.',
          output: 'Exception dataset with high-risk vendor tags',
        },
      },
      {
        id: 'analysis-capybot',
        type: 'analysisNode',
        category: 'analysis',
        name: 'Capybot AI Analysis',
        description: 'Invoke Capybot LLM reasoning to evaluate context and synthesize options.',
        iconName: 'Bot',
        defaultConfig: {
          analysisType: 'capybot',
          purpose: 'Synthesize actionable liquidity mitigation levers.',
          output: 'Structured recommendations & decision memo',
        },
      },
      {
        id: 'analysis-risk',
        type: 'analysisNode',
        category: 'analysis',
        name: 'Risk Radar Scan',
        description: 'Evaluate cross-departmental exposure and determine risk severity.',
        iconName: 'ShieldAlert',
        defaultConfig: {
          analysisType: 'risk',
          purpose: 'Assess inventory holding costs vs cash buffer risk.',
          output: 'Risk severity score (1-100)',
        },
      },
      {
        id: 'analysis-simulation',
        type: 'analysisNode',
        category: 'analysis',
        name: 'Run Simulation',
        description: 'Execute sandbox what-if financial or supply-chain simulations.',
        iconName: 'GitPullRequest',
        defaultConfig: {
          analysisType: 'simulation',
          scenarioName: 'Cash Triage (Expense Cut)',
          simulationMode: 'Expected Case',
          purpose: 'Model cash extension under 15% OPEX reduction.',
          output: 'Simulated cash trajectory & outcome matrix',
        },
      },
    ],
  },
  {
    category: 'logic',
    label: 'Logic & Branching',
    items: [
      {
        id: 'logic-ifelse',
        type: 'decisionNode',
        category: 'logic',
        name: 'If / Else Branch',
        description: 'Evaluate a condition and route execution into TRUE or FALSE paths.',
        iconName: 'Split',
        defaultConfig: {
          logicType: 'if_else',
          condition: 'Cash runway < 3.0 months',
          trueAction: 'Analyze Cash Position',
          falseAction: 'Stop and log (Bypass execution)',
        },
      },
      {
        id: 'logic-condition',
        type: 'decisionNode',
        category: 'logic',
        name: 'Condition Filter',
        description: 'Filter items that meet specific criteria before continuing.',
        iconName: 'SlidersHorizontal',
        defaultConfig: {
          logicType: 'condition',
          condition: 'Invoice Amount > ฿50,000',
        },
      },
      {
        id: 'logic-wait',
        type: 'decisionNode',
        category: 'logic',
        name: 'Wait / Delay',
        description: 'Pause workflow execution for a given time before next step.',
        iconName: 'Clock',
        defaultConfig: {
          logicType: 'wait',
          waitDuration: '24 hours',
        },
      },
    ],
  },
  {
    category: 'action',
    label: 'Actions & Outputs',
    items: [
      {
        id: 'action-notification',
        type: 'actionNode',
        category: 'action',
        name: 'Send Notification',
        description: 'Dispatch alerts via In-App, Email, Slack, or SMS.',
        iconName: 'Bell',
        defaultConfig: {
          actionType: 'notification',
          recipients: 'Business Owner / Finance Lead',
          channel: 'In-App + Email Digest',
          purpose: 'Notify stakeholders of safety threshold breach.',
        },
      },
      {
        id: 'action-create',
        type: 'actionNode',
        category: 'action',
        name: 'Create Action Item',
        description: 'Create a tracked task in the executive decision and action planner.',
        iconName: 'CheckSquare',
        defaultConfig: {
          actionType: 'action_item',
          priority: 'high',
          purpose: 'Add liquidity mitigation task to executive kanban.',
        },
      },
      {
        id: 'action-update',
        type: 'actionNode',
        category: 'action',
        name: 'Update Record',
        description: 'Update status fields in ERP, ledger, or inventory database.',
        iconName: 'FileText',
        defaultConfig: {
          actionType: 'update_record',
          targetRecord: 'Vendor Invoice Status -> Flagged',
        },
      },
      {
        id: 'action-workflow',
        type: 'actionNode',
        category: 'action',
        name: 'Run Sub-Workflow',
        description: 'Trigger a secondary automation or downstream pipeline.',
        iconName: 'Zap',
        defaultConfig: {
          actionType: 'run_workflow',
          purpose: 'Trigger Accounts Payable Expedited Batching.',
        },
      },
    ],
  },
  {
    category: 'data',
    label: 'Connected Data',
    items: [
      {
        id: 'data-financial',
        type: 'actionNode',
        category: 'data',
        name: 'Financial Ledger Data',
        description: 'Fetch real-time balances, cash receipts, and accounts payable.',
        iconName: 'LineChart',
        defaultConfig: {
          dataSource: 'financial',
          query: 'SELECT liquid_reserves, net_monthly_burn FROM cash_ledger',
        },
      },
      {
        id: 'data-inventory',
        type: 'actionNode',
        category: 'data',
        name: 'Inventory & SKU Data',
        description: 'Fetch stock cards, turn rates, and warehouse deadstock values.',
        iconName: 'Package',
        defaultConfig: {
          dataSource: 'inventory',
          query: 'SELECT sku, days_on_hand, deadstock_value FROM warehouse_db',
        },
      },
      {
        id: 'data-operations',
        type: 'actionNode',
        category: 'data',
        name: 'Operations Queue Data',
        description: 'Fetch department queue depths, cycle times, and throughput.',
        iconName: 'Activity',
        defaultConfig: {
          dataSource: 'operations',
          query: 'SELECT queue_depth, avg_cycle_time_min FROM operations_stream',
        },
      },
    ],
  },
];


export const INITIAL_AUTOMATIONS_DATA: AutomationRule[] = [
  {
    id: 'cash-runway-guardrail',
    title: 'Cash Runway Safety Guardrail',
    description: 'Monitor cash runway and automatically respond to prevent cash shortfalls.',
    category: 'Finance & Liquidity',
    status: 'active',
    executionStatus: 'idle',
    trigger: {
      name: 'Cash Runway Below Threshold',
      condition: 'Cash runway < 3 months',
      conditionDescription: 'When projected cash runway contracts below 3 months based on net monthly burn.',
      frequency: 'Every 4 hours',
      type: 'Threshold Trigger',
    },
    connectedSystem: 'Financial Ledger & Cash Stream',
    actionsCount: 2,
    runsCount: 24,
    successRate: 96,
    lastCheck: '12 mins ago',
    iconName: 'ShieldAlert',
    actionItems: [
      {
        id: 'act-1',
        name: 'Analyze Cash Position',
        description: 'Calculate projected runway and identify contributing factors.',
        type: 'extract',
        duration: '~10 sec',
        iconName: 'LineChart',
      },
      {
        id: 'act-2',
        name: 'AI Risk Analysis (Capybot)',
        description: 'Capybot analyzes liquidity risks and recommends actionable levers.',
        type: 'llm',
        duration: '~20 sec',
        iconName: 'Bot',
      },
      {
        id: 'act-3',
        name: 'Run Cash Triage Simulation',
        description: 'Simulate cost-reduction and cash-flow recovery scenarios.',
        type: 'simulation',
        duration: '~45 sec',
        iconName: 'GitPullRequest',
      },
      {
        id: 'act-4',
        name: 'Notify Stakeholders',
        description: 'Send alert to finance team and business owner via Email & In-App.',
        type: 'notification',
        duration: '~5 sec',
        iconName: 'Bell',
      },
      {
        id: 'act-5',
        name: 'Create Action Item',
        description: 'Create prioritized task in executive action plan with recommended mitigations.',
        type: 'task',
        duration: '~5 sec',
        iconName: 'CheckSquare',
      },
    ],
    steps: [
      {
        name: 'Fetch Cash Balance & Debt Load',
        type: 'extract',
        duration: 700,
        logMsgs: ['Querying current liquid reserves (฿245,000)...', 'Verifying monthly fixed burn rate (฿164,800)...'],
      },
      {
        name: 'Compute Runway Trajectory',
        type: 'extract',
        duration: 900,
        logMsgs: ['Calculating net cash drain trajectory...', 'Runway computed: 2.1 months (breaches 3.0mo safety floor).'],
      },
      {
        name: 'Capybot Risk Synthesis',
        type: 'llm',
        duration: 1500,
        logMsgs: ['Synthesizing liquidity mitigation playbook...', 'Identified ฿21,340 overdue receivables as primary rescue lever.'],
      },
      {
        name: 'Run Cash Triage Simulation',
        type: 'simulation',
        duration: 1200,
        logMsgs: ['Simulating 30-day accelerated collections scenario...', 'Projected runway extended from 2.1 to 4.2 months.'],
      },
      {
        name: 'Dispatch Stakeholder Alerts',
        type: 'notification',
        duration: 600,
        logMsgs: ['Sent priority alert to CFO & Managing Director.', 'Created task in executive action plan.'],
      },
    ],
    history: [
      { id: 'h-1', time: 'Today, 10:12 AM', status: 'success', duration: '1m 23s', summary: 'Runway: 2.1 months' },
      { id: 'h-2', time: 'Today, 6:12 AM', status: 'success', duration: '1m 18s', summary: 'Runway: 2.3 months' },
      { id: 'h-3', time: 'Yesterday, 10:12 PM', status: 'success', duration: '1m 15s', summary: 'Runway: 2.4 months' },
      { id: 'h-4', time: 'Yesterday, 6:12 PM', status: 'success', duration: '1m 20s', summary: 'Runway: 2.6 months' },
      { id: 'h-5', time: 'Yesterday, 2:12 PM', status: 'success', duration: '1m 17s', summary: 'Runway: 2.8 months' },
    ],
    runtimeSettings: {
      autoRunOnTrigger: true,
      timeoutMs: 15000,
      retryAttempts: 3,
      stopOnError: true,
    },
    tags: ['liquidity', 'finance', 'safety-net', 'cash-flow'],
  },
  {
    id: 'inventory-risk-alert',
    title: 'Slow-Moving Inventory Alert',
    description: 'Detect and act on aging inventory risks and deadstock buildup.',
    category: 'Inventory & Supply Chain',
    status: 'active',
    executionStatus: 'idle',
    trigger: {
      name: 'Slow-Moving Stock Exceeds Ratio',
      condition: 'Slow-moving stock > 20%',
      conditionDescription: 'When deadstock with >75 days coverage exceeds 20% of total inventory value.',
      frequency: 'Every 2 hours',
      type: 'Inventory Scan',
    },
    connectedSystem: 'POS & Warehouse Inventory DB',
    actionsCount: 2,
    runsCount: 18,
    successRate: 94,
    lastCheck: '2 hours ago',
    iconName: 'SlidersHorizontal',
    actionItems: [
      {
        id: 'act-inv-1',
        name: 'Scan SKU Turnover Ledger',
        description: 'Read 412 active SKU stock cards and evaluate aging trends.',
        type: 'extract',
        duration: '~8 sec',
        iconName: 'Package',
      },
      {
        id: 'act-inv-2',
        name: 'AI Bundle Promo Modeling',
        description: 'Capybot computes discount elasticity and clearance bundle bundles.',
        type: 'llm',
        duration: '~25 sec',
        iconName: 'Bot',
      },
      {
        id: 'act-inv-3',
        name: 'Update Inventory Risk Radar',
        description: 'Sync updated risk levels with Business Health Inventory module.',
        type: 'task',
        duration: '~5 sec',
        iconName: 'CheckSquare',
      },
    ],
    steps: [
      {
        name: 'Scan Inventory SKU Ledger',
        type: 'extract',
        duration: 800,
        logMsgs: ['Reading 412 active SKU stock cards...', 'Calculating turnover velocity for past 90 days.'],
      },
      {
        name: 'Identify Slow-Moving Items',
        type: 'extract',
        duration: 1100,
        logMsgs: ['Detected 5 categories exceeding 75 days of coverage (฿120,000).', 'Slow-moving ratio: 14.1% of inventory value.'],
      },
      {
        name: 'Generate Promo Bundle Levers',
        type: 'llm',
        duration: 1800,
        logMsgs: ['Modeling 15% discount bundle to liquidate instant noodles & wafer boxes.', 'Projected cash recovery: ฿45,000.'],
      },
      {
        name: 'Update Inventory Risk Radar',
        type: 'task',
        duration: 700,
        logMsgs: ['Synchronized with Business Health Inventory tab.'],
      },
    ],
    history: [
      { id: 'h-inv-1', time: 'Today, 8:00 AM', status: 'success', duration: '54s', summary: 'Slow stock: 14.1%' },
      { id: 'h-inv-2', time: 'Yesterday, 8:00 AM', status: 'success', duration: '52s', summary: 'Slow stock: 13.8%' },
      { id: 'h-inv-3', time: '2 days ago', status: 'success', duration: '49s', summary: 'Slow stock: 12.5%' },
    ],
    runtimeSettings: {
      autoRunOnTrigger: true,
      timeoutMs: 10000,
      retryAttempts: 2,
      stopOnError: false,
    },
    tags: ['inventory', 'deadstock', 'warehouse', 'promotions'],
  },
  {
    id: 'invoice-processing-router',
    title: 'Agentic Invoice Processing Router',
    description: 'Route and process incoming vendor invoices with automated 3-way matching.',
    category: 'Accounts Payable',
    status: 'active',
    executionStatus: 'idle',
    trigger: {
      name: 'AP Inbox Queue Exceeds Backlog',
      condition: 'Invoice backlog > 20 items',
      conditionDescription: 'When AP inbox backlog exceeds 20 pending vendor invoices.',
      frequency: 'Every 15 mins',
      type: 'Queue Monitor',
    },
    connectedSystem: 'Accounts Payable Inbox & ERP',
    actionsCount: 3,
    runsCount: 47,
    successRate: 98,
    lastCheck: '25 mins ago',
    iconName: 'FileText',
    actionItems: [
      {
        id: 'act-ap-1',
        name: 'OCR & Bounding Box Extraction',
        description: 'Extract vendor details, line items, and invoice totals from attachments.',
        type: 'extract',
        duration: '~15 sec',
        iconName: 'FileText',
      },
      {
        id: 'act-ap-2',
        name: '3-Way Match Verification',
        description: 'Cross-reference purchase order, receipt note, and invoice pricing.',
        type: 'llm',
        duration: '~20 sec',
        iconName: 'Bot',
      },
      {
        id: 'act-ap-3',
        name: 'ERP Payment Batch Dispatch',
        description: 'Auto-approve clean matches and route discrepancies for approval.',
        type: 'task',
        duration: '~10 sec',
        iconName: 'CheckSquare',
      },
    ],
    steps: [
      {
        name: 'Fetch AP Queue Delta',
        type: 'extract',
        duration: 600,
        logMsgs: ['Connecting to AP inbox...', 'Found 29 pending attachments.'],
      },
      {
        name: 'OCR & Line Item Extraction',
        type: 'extract',
        duration: 1500,
        logMsgs: ['Running multi-modal bounding box analysis...', 'Extracted tabular line items and vendor tax IDs.'],
      },
      {
        name: 'Agentic 3-Way Match Verification',
        type: 'llm',
        duration: 2500,
        logMsgs: ['Cross-referencing ERP Purchase Orders...', 'Auto-matched 20 clean records (69% match rate).', 'Flagged 9 price discrepancy exceptions for human review.'],
      },
      {
        name: 'ERP Write-back & Sync',
        type: 'task',
        duration: 900,
        logMsgs: ['Committed 20 invoices to payment batch.', 'Updated queue backlog.'],
      },
    ],
    history: [
      { id: 'h-ap-1', time: 'Today, 11:30 AM', status: 'success', duration: '42s', summary: 'Matched: 20/29' },
      { id: 'h-ap-2', time: 'Today, 10:15 AM', status: 'success', duration: '39s', summary: 'Matched: 18/22' },
      { id: 'h-ap-3', time: 'Today, 9:00 AM', status: 'success', duration: '45s', summary: 'Matched: 25/30' },
    ],
    runtimeSettings: {
      autoRunOnTrigger: true,
      timeoutMs: 20000,
      retryAttempts: 3,
      stopOnError: true,
    },
    tags: ['accounts-payable', 'ocr', 'matching', 'automation'],
  },
  {
    id: 'operations-bottleneck-monitor',
    title: 'Operations Bottleneck & Queue Monitor',
    description: 'Monitor department utilization and queue backlogs to prevent bottlenecks.',
    category: 'Operations & Throughput',
    status: 'active',
    executionStatus: 'idle',
    trigger: {
      name: 'Department Utilization Critical',
      condition: 'Dept utilization > 85%',
      conditionDescription: 'When arrival rate vs service capacity signals unstable queue backlogs.',
      frequency: 'Every 40 mins',
      type: 'Queue Telemetry',
    },
    connectedSystem: 'Operations Queue Telemetry',
    actionsCount: 2,
    runsCount: 31,
    successRate: 97,
    lastCheck: '40 mins ago',
    iconName: 'Activity',
    actionItems: [
      {
        id: 'act-op-1',
        name: 'Poll Department Task Arrival (λ)',
        description: 'Fetch arrival rates and processing times across all units.',
        type: 'extract',
        duration: '~6 sec',
        iconName: 'Activity',
      },
      {
        id: 'act-op-2',
        name: 'TOC Constraint Elevation',
        description: 'Apply Little\'s Law (L = λW) and recommend capacity shifts.',
        type: 'llm',
        duration: '~18 sec',
        iconName: 'Bot',
      },
    ],
    steps: [
      {
        name: 'Poll Department Task Arrival (λ)',
        type: 'extract',
        duration: 600,
        logMsgs: ['Fetching arrival rates and average processing times...'],
      },
      {
        name: 'Compute M/M/1 Utilization (ρ)',
        type: 'extract',
        duration: 900,
        logMsgs: ['Finance department ρ=0.95 (CRITICAL CONGESTION).', 'Support department ρ=0.61 (HEALTHY).'],
      },
      {
        name: 'TOC Constraint Elevation',
        type: 'llm',
        duration: 1600,
        logMsgs: ['Applying Little\'s Law (L = λW)...', 'Finance identified as primary system constraint inflating WIP to 86.3 items.'],
      },
      {
        name: 'Update Dashboard Queue Watch',
        type: 'task',
        duration: 500,
        logMsgs: ['Sync complete. Next scan scheduled.'],
      },
    ],
    history: [
      { id: 'h-op-1', time: 'Today, 9:45 AM', status: 'success', duration: '35s', summary: 'Max ρ: Finance 95%' },
      { id: 'h-op-2', time: 'Today, 8:45 AM', status: 'success', duration: '34s', summary: 'Max ρ: Finance 94%' },
    ],
    runtimeSettings: {
      autoRunOnTrigger: true,
      timeoutMs: 12000,
      retryAttempts: 2,
      stopOnError: false,
    },
    tags: ['operations', 'bottleneck', 'littles-law', 'queues'],
  },
  {
    id: 'weekly-business-health-digest',
    title: 'Weekly Business Health Digest',
    description: 'Weekly summary of key performance metrics, liquidity status, and alerts.',
    category: 'Executive Reporting',
    status: 'paused',
    executionStatus: 'idle',
    trigger: {
      name: 'Scheduled Weekly Dispatch',
      condition: 'Every Monday at 09:00',
      conditionDescription: 'Automated executive roundup generated at start of business week.',
      frequency: 'Weekly (Mon 09:00)',
      type: 'Cron Schedule',
    },
    connectedSystem: 'Analytics & Financial DB',
    actionsCount: 2,
    runsCount: 12,
    successRate: 100,
    lastCheck: '—',
    iconName: 'Mail',
    actionItems: [
      {
        id: 'act-wk-1',
        name: 'Aggregate KPI Performance',
        description: 'Summarize revenue, gross margin, cash runway, and department throughput.',
        type: 'extract',
        duration: '~12 sec',
        iconName: 'LineChart',
      },
      {
        id: 'act-wk-2',
        name: 'Executive Email Dispatch',
        description: 'Format high-level briefing and dispatch to executive leadership.',
        type: 'notification',
        duration: '~4 sec',
        iconName: 'Mail',
      },
    ],
    steps: [
      {
        name: 'Compile 7-Day Performance Metrics',
        type: 'extract',
        duration: 1000,
        logMsgs: ['Gathering weekly revenues, burn rates, and department throughput.'],
      },
      {
        name: 'Generate Executive Briefing',
        type: 'llm',
        duration: 1500,
        logMsgs: ['Capybot generating key takeaways and recommended focus areas for the week.'],
      },
      {
        name: 'Dispatch Weekly Email Digest',
        type: 'notification',
        duration: 500,
        logMsgs: ['Sent executive summary to 4 stakeholders.'],
      },
    ],
    history: [
      { id: 'h-wk-1', time: 'Last Monday, 9:00 AM', status: 'success', duration: '30s', summary: 'Digest Delivered' },
      { id: 'h-wk-2', time: '2 weeks ago', status: 'success', duration: '31s', summary: 'Digest Delivered' },
    ],
    runtimeSettings: {
      autoRunOnTrigger: false,
      timeoutMs: 15000,
      retryAttempts: 2,
      stopOnError: true,
    },
    tags: ['reports', 'weekly', 'digest', 'leadership'],
  },
  {
    id: 'customer-payment-followup',
    title: 'Customer Payment Follow-up',
    description: 'Follow up on overdue customer receivables with automated friendly reminders.',
    category: 'Receivables & Collections',
    status: 'draft',
    executionStatus: 'idle',
    trigger: {
      name: 'Receivables Ageing Threshold',
      condition: 'Overdue > 15 days',
      conditionDescription: 'When customer unpaid balances cross 15 days past agreed payment terms.',
      frequency: 'Daily (10:00 AM)',
      type: 'Receivables Monitor',
    },
    connectedSystem: 'Invoicing & Collections API',
    actionsCount: 2,
    runsCount: 0,
    successRate: 0,
    lastCheck: '—',
    iconName: 'Megaphone',
    actionItems: [
      {
        id: 'act-pay-1',
        name: 'Scan Overdue Invoices',
        description: 'Filter unpaid customer balances exceeding credit terms.',
        type: 'extract',
        duration: '~5 sec',
        iconName: 'FileText',
      },
      {
        id: 'act-pay-2',
        name: 'Generate Courteous Reminder',
        description: 'Personalize friendly reminder email with payment link attachment.',
        type: 'llm',
        duration: '~15 sec',
        iconName: 'Bot',
      },
    ],
    steps: [
      {
        name: 'Scan Overdue Invoices',
        type: 'extract',
        duration: 800,
        logMsgs: ['Checking 14 customer balances...', 'Found 3 invoices past 15 days overdue.'],
      },
      {
        name: 'Compose Friendly Follow-up Email',
        type: 'llm',
        duration: 1200,
        logMsgs: ['Drafted payment reminder emails with invoice summary and direct payment link.'],
      },
    ],
    history: [],
    runtimeSettings: {
      autoRunOnTrigger: false,
      timeoutMs: 10000,
      retryAttempts: 1,
      stopOnError: true,
    },
    tags: ['receivables', 'collections', 'cash-flow', 'customers'],
  },
];
