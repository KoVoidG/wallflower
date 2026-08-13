/**
 * LiquiFlow Operations Research Algorithms
 *
 * Implements well-researched mathematical models for workflow analysis:
 * - Little's Law (Little, 1961) — L = λW
 * - M/M/1 Queuing Theory — single-server queue model
 * - Theory of Constraints (Goldratt, 1984) — identify and elevate the system constraint
 * - Lean Six Sigma — sigma-level process quality calculation
 * - Utilization / Capacity analysis
 */

import type { Department, WorkflowStep } from "./liquiflow-types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WorkflowMetrics {
  workflowId: string;
  workflowName: string;
  department: string;

  // Little's Law: L = λ × W
  arrivalRatePerHour: number;  // λ — items arriving per hour
  serviceRatePerHour: number;  // μ — items processed per hour (1/avgDurationHours)
  avgQueueLength: number;      // L — average WIP in system
  avgWaitTimeHours: number;    // W — average time spent per item

  // M/M/1 Queuing
  utilizationRate: number;     // ρ = λ/μ  (>1 = overloaded)
  avgQueueLengthWaiting: number; // Lq = ρ²/(1-ρ)
  avgWaitInQueueHours: number;   // Wq = ρ/(μ-λ) in hours

  // Lean Six Sigma
  dpmo: number;               // Defects Per Million Opportunities
  sigmaLevel: number;         // Process Sigma Level (0-6)

  // Derived
  hoursLostToErrorsPerWeek: number;
  isConstraint: boolean;       // Theory of Constraints — is this the system bottleneck?
  constraintScore: number;     // Higher = more likely the binding constraint
  weeklyCapacityHours: number;
  weeklyDemandHours: number;

  // Industry benchmark comparison
  benchmarkCycleTimeHours: number; // APQC industry benchmark
  benchmarkDeviation: number;      // How much worse/better vs benchmark (ratio)
}

export interface DepartmentMetrics {
  departmentId: string;
  departmentName: string;
  totalWeeklyDemandHours: number;
  availableCapacityHours: number;   // headcount × 40h
  overallUtilizationRate: number;
  pendingItems: number;
  estimatedQueueBuildupPerWeek: number; // New items added to backlog each week
  stressScore: number;                  // 0-100
}

export interface BottleneckAnalysis {
  workflowMetrics: WorkflowMetrics[];
  departmentMetrics: DepartmentMetrics[];
  primaryConstraint: WorkflowMetrics | null;     // TOC: binding constraint
  secondaryConstraints: WorkflowMetrics[];
  systemThroughput: number;                       // Tasks/week limited by constraint
  systemWIP: number;                              // Total average WIP (Little's Law)
  systemAvgCycleTimeHours: number;
  totalHoursLostPerWeek: number;
  totalCostPerWeek: number;
  overallHealthScore: number;
}

export interface SimulationProjection {
  throughputGainPct: number;
  cycleTimeReductionPct: number;
  costChangePct: number;
  qualityGainPct: number;
  satisfactionGainPct: number;
  newSystemThroughput: number;
  newAvgCycleTimeHours: number;
  newCostPerWeek: number;
  newQualityScore: number;
  newSatisfactionScore: number;
  confidenceScore: number;
  modelNotes: string[];
}

// ─── APQC Industry Benchmark Cycle Times (hours) ─────────────────────────────
export const APQC_BENCHMARKS: Record<string, { median: number; bestInClass: number; source: string }> = {
  "expense reimbursement": {
    median: 76.8,    // 3.2 days × 24h — APQC accounts payable benchmark
    bestInClass: 24, // 1 day
    source: "APQC Open Standards Benchmarking - Accounts Payable 2023"
  },
  "vendor invoice processing": {
    median: 314.4,   // 13.1 days — Aberdeen Group AP benchmark (average company)
    bestInClass: 93.6, // 3.9 days — Aberdeen top performer
    source: "Aberdeen Group: AP & Invoicing Report 2023"
  },
  "leave request approval": {
    median: 48,      // 2 days — typical HR SLA
    bestInClass: 8,  // 4 hours — automated systems
    source: "SHRM HR Technology Benchmark 2023"
  },
  "new employee onboarding": {
    median: 720,     // 30 days — SHRM average time to productivity
    bestInClass: 360, // 15 days with digital onboarding
    source: "SHRM Onboarding Practices Report 2023"
  },
  "it support ticket": {
    median: 16,      // HDI Support Center Practices benchmark
    bestInClass: 4,
    source: "HDI Support Center Practices & Salary Report 2023"
  },
  "purchase order approval": {
    median: 48,      // 2 days — APQC procurement benchmark
    bestInClass: 8,
    source: "APQC Procurement Cycle Time Benchmark 2023"
  },
  "contract review": {
    median: 168,     // 7 days — World Commerce & Contracting benchmark
    bestInClass: 48,
    source: "World Commerce & Contracting: Contract Management Report 2023"
  },
  "performance review cycle": {
    median: 336,     // 14 days — SHRM performance management benchmark
    bestInClass: 120, // 5 days with continuous feedback tools
    source: "SHRM Performance Management Survey 2023"
  },
};

function getBenchmark(workflowName: string): { median: number; bestInClass: number; source: string } {
  const key = workflowName.toLowerCase();
  for (const [benchKey, val] of Object.entries(APQC_BENCHMARKS)) {
    if (key.includes(benchKey) || benchKey.includes(key)) return val;
  }
  // Default: generic knowledge-work task
  return { median: 24, bestInClass: 8, source: "Generic knowledge-work benchmark" };
}

// ─── Normal Distribution Approximation (for sigma level) ─────────────────────
function normInvApprox(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const a = [2.515517, 0.802853, 0.010328];
  const b = [1.432788, 0.189269, 0.001308];
  const t = Math.sqrt(-2 * Math.log(p < 0.5 ? p : 1 - p));
  const num = a[0] + a[1] * t + a[2] * t * t;
  const den = 1 + b[0] * t + b[1] * t * t + b[2] * t * t * t;
  const z = t - num / den;
  return p < 0.5 ? -z : z;
}

// ─── Core Algorithms ──────────────────────────────────────────────────────────

function littlesLaw(volumePerWeek: number, avgDurationHours: number) {
  const workingHoursPerWeek = 40;
  const lambdaPerHour = volumePerWeek / workingHoursPerWeek; // λ
  const wip = lambdaPerHour * avgDurationHours;              // L = λW
  return { lambdaPerHour, wip };
}

function mm1Queue(lambdaPerHour: number, avgServiceHours: number) {
  const muPerHour = 1 / avgServiceHours; // μ — service rate
  const rho = lambdaPerHour / muPerHour; // ρ — utilization

  // Cap rho at 0.99 for finite calculations (fully saturated queue)
  const rhoStable = Math.min(rho, 0.99);
  const lq = (rhoStable * rhoStable) / (1 - rhoStable); // Queue length (waiting)
  const wqHours = lq / lambdaPerHour;                     // Wait time in queue

  return {
    utilizationRate: rho,
    avgQueueLengthWaiting: isFinite(lq) ? lq : 999,
    avgWaitInQueueHours: isFinite(wqHours) ? wqHours : 999,
  };
}

function sigmaLevel(errorRate: number): { dpmo: number; sigma: number } {
  const dpmo = errorRate * 1_000_000;
  const shortTermSigma = normInvApprox(1 - dpmo / 1_000_000);
  const longTermSigma = shortTermSigma + 1.5;
  return { dpmo, sigma: Math.max(0, Math.min(6, longTermSigma)) };
}

function constraintScore(
  utilizationRate: number,
  volumePerWeek: number,
  avgDurationHours: number,
  errorRate: number
): number {
  const queueingFactor = utilizationRate >= 1 ? 100 : Math.pow(utilizationRate, 4) / (1 - utilizationRate + 0.01);
  const throughputImpact = volumePerWeek * avgDurationHours;
  const qualityPenalty = errorRate * volumePerWeek * avgDurationHours;
  return queueingFactor * Math.log1p(throughputImpact) + qualityPenalty * 0.5;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function analyzeBottlenecks(
  departments: Department[],
  workflows: WorkflowStep[],
  avgCostPerHour: number = 35
): BottleneckAnalysis {
  const workingHoursPerWeek = 40;

  const deptCapacityMap = new Map<string, number>();
  for (const d of departments) {
    deptCapacityMap.set(d.name, d.headcount * workingHoursPerWeek);
  }

  const workflowMetrics: WorkflowMetrics[] = workflows.map(wf => {
    const { lambdaPerHour, wip } = littlesLaw(wf.volume, wf.avgDurationHours);
    const queue = mm1Queue(lambdaPerHour, wf.avgDurationHours);
    const { dpmo, sigma } = sigmaLevel(wf.errorRate);
    const benchmark = getBenchmark(wf.name);

    const weeklyDemandHours = wf.volume * wf.avgDurationHours;
    const deptCapacity = deptCapacityMap.get(wf.department) ?? workingHoursPerWeek;
    const hoursLostToErrors = wf.errorRate * wf.volume * wf.avgDurationHours * 0.3; 

    const score = constraintScore(queue.utilizationRate, wf.volume, wf.avgDurationHours, wf.errorRate);

    return {
      workflowId: wf.id,
      workflowName: wf.name,
      department: wf.department,
      arrivalRatePerHour: lambdaPerHour,
      serviceRatePerHour: 1 / wf.avgDurationHours,
      avgQueueLength: wip,
      avgWaitTimeHours: wf.avgDurationHours,
      utilizationRate: queue.utilizationRate,
      avgQueueLengthWaiting: queue.avgQueueLengthWaiting,
      avgWaitInQueueHours: queue.avgWaitInQueueHours,
      dpmo,
      sigmaLevel: sigma,
      hoursLostToErrorsPerWeek: hoursLostToErrors,
      isConstraint: false, 
      constraintScore: score,
      weeklyCapacityHours: deptCapacity,
      weeklyDemandHours,
      benchmarkCycleTimeHours: benchmark.median,
      benchmarkDeviation: wf.avgDurationHours / benchmark.median,
    };
  });

  const sorted = [...workflowMetrics].sort((a, b) => b.constraintScore - a.constraintScore);
  if (sorted[0]) sorted[0].isConstraint = true;

  const primaryConstraint = sorted[0] ?? null;
  const systemThroughput = primaryConstraint
    ? (1 / primaryConstraint.avgWaitTimeHours) * workingHoursPerWeek
    : workflows.reduce((s, w) => s + w.volume, 0);

  const systemWIP = workflowMetrics.reduce((s, m) => s + m.avgQueueLength, 0);

  const totalVolume = workflows.reduce((s, w) => s + w.volume, 0);
  const totalLambda = totalVolume / workingHoursPerWeek;
  const systemAvgCycleTimeHours = totalLambda > 0 ? systemWIP / totalLambda : 0;

  const secondaryConstraints = sorted.slice(1, 4);

  const totalHoursLostPerWeek = workflowMetrics.reduce((s, m) => {
    const aboveBenchmark = Math.max(0, (m.avgWaitTimeHours - m.benchmarkCycleTimeHours) * m.avgQueueLength * 0.1);
    return s + aboveBenchmark + m.hoursLostToErrorsPerWeek;
  }, 0);
  const totalCostPerWeek = totalHoursLostPerWeek * avgCostPerHour;

  const departmentMetrics: DepartmentMetrics[] = departments.map(d => {
    const deptWorkflows = workflowMetrics.filter(m => m.department === d.name);
    const totalDemand = deptWorkflows.reduce((s, m) => s + m.weeklyDemandHours, 0);
    const capacity = d.headcount * workingHoursPerWeek;
    const utilization = capacity > 0 ? totalDemand / capacity : 0;

    const meetingOverheadHours = d.meetingsPerWeek * 1.25; 
    const effectiveCapacity = capacity - meetingOverheadHours;
    const trueUtilization = effectiveCapacity > 0 ? totalDemand / effectiveCapacity : 1;

    const pendingGrowthRate = Math.max(0, trueUtilization - 1) * d.avgTasksPerWeek;

    const stress = Math.min(100, Math.round(
      trueUtilization * 40 +
      (d.pendingApprovals / Math.max(d.headcount, 1)) * 20 +
      (d.overdueItems / Math.max(d.headcount, 1)) * 25 +
      (d.meetingsPerWeek / 20) * 15
    ));

    return {
      departmentId: d.id,
      departmentName: d.name,
      totalWeeklyDemandHours: totalDemand,
      availableCapacityHours: capacity,
      overallUtilizationRate: utilization,
      pendingItems: d.pendingApprovals + d.overdueItems,
      estimatedQueueBuildupPerWeek: pendingGrowthRate,
      stressScore: stress,
    };
  });

  const avgUtilization = workflowMetrics.reduce((s, m) => s + Math.min(m.utilizationRate, 1.5), 0) / Math.max(workflowMetrics.length, 1);
  const hoursLostFactor = Math.min(totalHoursLostPerWeek / 500, 1); 
  const overallHealthScore = Math.round(Math.max(15, Math.min(95,
    100
    - avgUtilization * 30
    - hoursLostFactor * 35
    - (departments.reduce((s, d) => s + d.overdueItems, 0) / Math.max(totalVolume, 1)) * 20
  )));

  return {
    workflowMetrics,
    departmentMetrics,
    primaryConstraint: sorted[0] ?? null,
    secondaryConstraints,
    systemThroughput,
    systemWIP,
    systemAvgCycleTimeHours,
    totalHoursLostPerWeek,
    totalCostPerWeek,
    overallHealthScore,
  };
}

export function projectSimulation(
  departments: Department[],
  workflows: WorkflowStep[],
  scenario: { automation_rate?: number; headcount_increase?: number; process_improvement?: number; training_hours?: number; [key: string]: number | string | undefined },
  avgCostPerHour: number = 35
): SimulationProjection {
  const workingHoursPerWeek = 40;
  const totalHeadcount = departments.reduce((s, d) => s + d.headcount, 0);
  const totalTasksPerWeek = departments.reduce((s, d) => s + d.avgTasksPerWeek, 0);

  const automationRate = (scenario.automation_rate as number) ?? 0;
  const headcountChange = (scenario.headcount_increase as number) ?? 0;
  const processImprovement = (scenario.process_improvement as number) ?? 0;
  const trainingHours = (scenario.training_hours as number) ?? 0;

  const currentAnalysis = analyzeBottlenecks(departments, workflows, avgCostPerHour);

  const modelNotes: string[] = [];

  const constraintCycleTimeReduction = automationRate * 0.45 + processImprovement * 0.30;
  const wipReductionFactor = 1 - constraintCycleTimeReduction;
  const newSystemWIP = currentAnalysis.systemWIP * wipReductionFactor;
  const totalLambda = totalTasksPerWeek / workingHoursPerWeek;
  const newSystemCycleTime = totalLambda > 0 ? newSystemWIP / totalLambda : currentAnalysis.systemAvgCycleTimeHours;

  const headcountThroughputGain = headcountChange > 0
    ? (headcountChange / Math.max(totalHeadcount, 1)) * 0.65 
    : (headcountChange / Math.max(totalHeadcount, 1)) * 0.85; 
  const automationThroughputGain = automationRate * 0.38; 
  const processGain = processImprovement * 0.28;
  const trainingGain = trainingHours * 0.0018; 
  const totalThroughputGain = automationThroughputGain + headcountThroughputGain + processGain + trainingGain;

  const qualityGain = processImprovement * 0.22 + trainingHours * 0.0025 + automationRate * 0.12;

  const satisfactionGain =
    automationRate * 0.12 +
    trainingHours * 0.0022 +       
    processImprovement * 0.18 +    
    (headcountChange < 0 ? headcountChange / totalHeadcount * 0.4 : headcountChange / totalHeadcount * 0.1);

  const totalCurrentHours = totalHeadcount * workingHoursPerWeek;
  const currentCost = totalCurrentHours * avgCostPerHour;
  const automationSavings = automationRate * currentCost * 0.14;
  const headcountCostChange = headcountChange * avgCostPerHour * workingHoursPerWeek * 52; 
  const costChange = headcountCostChange / 52 - automationSavings;

  const avgErrorRate = workflows.reduce((s, w) => s + w.errorRate, 0) / Math.max(workflows.length, 1);
  const currentQuality = Math.round(Math.max(55, Math.min(85, (1 - avgErrorRate) * 88)));
  const currentSatisfaction = Math.round(Math.max(55, Math.min(80, 71 + (headcountChange >= 0 ? 0 : -5))));

  const constraintClarity = currentAnalysis.primaryConstraint
    ? currentAnalysis.primaryConstraint.constraintScore / (currentAnalysis.secondaryConstraints[0]?.constraintScore + 1)
    : 1;
  const baseConfidence = 0.72;
  const confidenceBonus = Math.min(0.18, constraintClarity * 0.05 + (workflows.length / 20) * 0.08);
  const confidencePenalty = automationRate > 0.5 ? 0.08 : 0; 
  const confidenceScore = Math.min(0.95, Math.max(0.55, baseConfidence + confidenceBonus - confidencePenalty));

  if (automationRate > 0.4) {
    modelNotes.push("High automation rate modeled: change management risk is significant — confidence adjusted down accordingly.");
  }
  if (workflows.length < 5) {
    modelNotes.push("Fewer than 5 workflow steps provided: adding more workflows would increase simulation accuracy.");
  }
  if (currentAnalysis.primaryConstraint && processImprovement === 0 && automationRate === 0) {
    modelNotes.push(`Primary constraint identified as "${currentAnalysis.primaryConstraint.workflowName}" — scenario does not directly target it; impact will be limited.`);
  }

  const cycleTimePct = ((newSystemCycleTime - currentAnalysis.systemAvgCycleTimeHours) / currentAnalysis.systemAvgCycleTimeHours) * 100;

  return {
    throughputGainPct: Math.round(totalThroughputGain * 1000) / 10,
    cycleTimeReductionPct: Math.round(cycleTimePct * 10) / 10,
    costChangePct: Math.round((costChange / currentCost) * 1000) / 10,
    qualityGainPct: Math.round(qualityGain * 1000) / 10,
    satisfactionGainPct: Math.round(satisfactionGain * 1000) / 10,
    newSystemThroughput: Math.round(totalTasksPerWeek * (1 + totalThroughputGain)),
    newAvgCycleTimeHours: Math.round(newSystemCycleTime * 10) / 10,
    newCostPerWeek: Math.round(currentCost + costChange),
    newQualityScore: Math.min(99, Math.round(currentQuality + qualityGain * 100)),
    newSatisfactionScore: Math.min(99, Math.round(currentSatisfaction + satisfactionGain * 100)),
    confidenceScore,
    modelNotes,
  };
}

export function utilizationColor(rate: number): string {
  if (rate < 0.7) return "#34d399";  
  if (rate < 0.85) return "#a3e635"; 
  if (rate < 1.0) return "#fbbf24";  
  if (rate < 1.2) return "#f87171";  
  return "#dc2626";                   
}

export function utilizationLabel(rate: number): string {
  if (rate < 0.7) return "Healthy";
  if (rate < 0.85) return "Moderate";
  if (rate < 1.0) return "High";
  if (rate < 1.2) return "Overloaded";
  return "Critical";
}
