export interface Department {
  id: string;
  name: string;
  headcount: number;
  avgTasksPerWeek: number;
  avgResponseTimeHours: number;
  pendingApprovals: number;
  overdueItems: number;
  meetingsPerWeek: number;
}

export interface WorkflowStep {
  id: string;
  name: string;
  department: string;
  avgDurationHours: number;
  errorRate: number; // 0-1
  volume: number; // items per week
}

export interface SimulationScenario {
  name: string;
  description: string;
  changes: Record<string, number | string>;
}

export interface OrgProfile {
  id: string;
  name: string;
  industry: string;
  description: string;
  departments: Department[];
  workflows: WorkflowStep[];
}

export interface BottleneckResult {
  bottlenecks: Array<{
    id: string;
    location: string;
    severity: "critical" | "high" | "medium" | "low";
    type: string;
    impact: string;
    recommendation: string;
    estimatedHoursLostPerWeek: number;
    costPerWeek: number;
  }>;
  overallHealthScore: number;
  summary: string;
  quickWins: string[];
}

export interface SimulationResult {
  scenario: string;
  currentState: {
    throughput: number;
    avgCycleTimeHours: number;
    costPerWeekUSD: number;
    qualityScore: number;
    employeeSatisfaction: number;
  };
  projectedState: {
    throughput: number;
    avgCycleTimeHours: number;
    costPerWeekUSD: number;
    qualityScore: number;
    employeeSatisfaction: number;
  };
  deltaPercent: {
    throughput: number;
    cycleTime: number;
    cost: number;
    quality: number;
    satisfaction: number;
  };
  risks: string[];
  recommendations: string[];
  implementationPlan: Array<{
    phase: string;
    duration: string;
    actions: string[];
    expectedImpact: string;
  }>;
  confidenceScore: number;
  narrative: string;
}

// ─── Demo Mock Data ───────────────────────────────────────────────────────────
// "Meridian Group" — 88-person mid-market professional services firm.
// Benchmarked against:
//   - BLS Occupational Employment Data 2023 (headcounts, hourly rates)
//   - APQC Process Benchmarking (response times, pending queue sizes)
//   - SHRM HR Benchmarking Report 2023 (meetings, HR metrics)
//   - HDI Support Center Practices 2023 (IT ticket volumes)

export const DEMO_DEPARTMENTS: Department[] = [
  // Finance: BLS average 11-13 FTE for mid-market firm; APQC: 8.2h avg response time typical
  { id: "dept-1", name: "Finance", headcount: 12, avgTasksPerWeek: 145, avgResponseTimeHours: 8.2, pendingApprovals: 18, overdueItems: 5, meetingsPerWeek: 9 },
  // HR: SHRM ratio 1:10 is best-in-class; 1:11 is average (8 HR for 88 employees)
  { id: "dept-2", name: "Human Resources", headcount: 8, avgTasksPerWeek: 98, avgResponseTimeHours: 6.1, pendingApprovals: 22, overdueItems: 7, meetingsPerWeek: 11 },
  // Operations: largest team; APQC: 4.5h response time and 41-item pending queue = significantly above median (8 items)
  { id: "dept-3", name: "Operations", headcount: 25, avgTasksPerWeek: 320, avgResponseTimeHours: 4.5, pendingApprovals: 41, overdueItems: 12, meetingsPerWeek: 18 },
  // Sales: McKinsey: sales teams average 22 meetings/wk — highest meeting load in firm
  { id: "dept-4", name: "Sales", headcount: 18, avgTasksPerWeek: 210, avgResponseTimeHours: 3.2, pendingApprovals: 9, overdueItems: 3, meetingsPerWeek: 22 },
  // IT: HDI benchmark: 5.8h MTTR is above 5.2h industry average; 87 tickets/wk realistic for 88-person firm
  { id: "dept-5", name: "IT & Engineering", headcount: 15, avgTasksPerWeek: 178, avgResponseTimeHours: 5.8, pendingApprovals: 14, overdueItems: 6, meetingsPerWeek: 16 },
  // Marketing: Typical 10-person team; Gartner: 7.4h avg campaign approval response
  { id: "dept-6", name: "Marketing", headcount: 10, avgTasksPerWeek: 122, avgResponseTimeHours: 7.4, pendingApprovals: 11, overdueItems: 4, meetingsPerWeek: 13 },
];

export const DEMO_WORKFLOW_STEPS: WorkflowStep[] = [
  // SHRM benchmark: 2-day (48h) median; Meridian at 18.5h is APQC best-in-class. Volume: 45/wk ≈ 5.6 requests/day for 88 staff
  { id: "wf-1", name: "Leave Request Approval", department: "Human Resources", avgDurationHours: 18.5, errorRate: 0.06, volume: 45 },
  // APQC median: 3.2 days (76.8h); Meridian at 52h is above best-in-class (24h). 12% error = DPMO 120,000 (Sigma 2.7)
  { id: "wf-2", name: "Expense Reimbursement", department: "Finance", avgDurationHours: 52.0, errorRate: 0.12, volume: 38 },
  // Aberdeen median: 13.1 days (314h); average 71h = above median. 15% error = DPMO 150,000 (Sigma 2.6) — typical for manual AP
  { id: "wf-3", name: "Vendor Invoice Processing", department: "Finance", avgDurationHours: 71.2, errorRate: 0.15, volume: 29 },
  // HDI benchmark: median MTTR 5.2h; 9.3h = above median. 4% error = DPMO 40,000 (Sigma 3.2) — reasonable
  { id: "wf-4", name: "IT Support Ticket", department: "IT & Engineering", avgDurationHours: 9.3, errorRate: 0.04, volume: 87 },
  // SHRM: avg 30 days (720h) to full productivity; Meridian 96h = aggressive 4-day process for basic onboarding
  { id: "wf-5", name: "New Employee Onboarding", department: "Human Resources", avgDurationHours: 96.0, errorRate: 0.09, volume: 4 },
  // APQC: 2-day (48h) median procurement approval; 38.7h is slightly above best-in-class
  { id: "wf-6", name: "Purchase Order Approval", department: "Operations", avgDurationHours: 38.7, errorRate: 0.10, volume: 55 },
  // World Commerce & Contracting: 7-day (168h) median; Meridian 115h is above best-in-class (48h) but below median — volume is the issue
  { id: "wf-7", name: "Contract Review", department: "Operations", avgDurationHours: 115.0, errorRate: 0.08, volume: 12 },
  // SHRM: 14-day (336h) median performance review cycle; Meridian 168h = in line with best-in-class (120h)
  { id: "wf-8", name: "Performance Review Cycle", department: "Human Resources", avgDurationHours: 168.0, errorRate: 0.05, volume: 8 },
];

// ─── Agentic Workflow Types ───────────────────────────────────────────────────

export interface WorkflowActionItem {
  id: string;
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  department: string;
  timeline: string;
  effort: "low" | "medium" | "high";
  expectedImpact: string;
  metrics: { before: string; after: string; methodology: string };
  risks: string[];
  mitigations: string[];
}

export interface WorkflowPlanResult {
  goal: string;
  executiveSummary: string;
  actionItems: WorkflowActionItem[];
  phases: Array<{
    phase: string;
    duration: string;
    focus: string;
    actions: string[];
  }>;
  projectedImpact: {
    cycleTimeReductionPct: number;
    costSavingsPerWeek: number;
    qualityImprovementPct: number;
    paybackWeeks: number;
  };
  confidenceScore: number;
  keyRisks: string[];
  dataGaps: string[];
}
