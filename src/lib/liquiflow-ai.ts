import { GoogleGenAI } from "@google/genai";
import { analyzeBottlenecks, projectSimulation } from "./liquiflow-algorithms";
import type { Department, WorkflowStep, SimulationScenario, BottleneckResult, SimulationResult } from "./liquiflow-types";


// Ensure you have GEMINI_API_KEY set in your environment variables
const ai = new GoogleGenAI({});

export const AI_MODEL = "gemini-2.5-flash"; // Using Gemini Flash as requested

export type { BottleneckResult, SimulationResult };

// ─── Bottleneck Detection ─────────────────────────────────────────────────────

export async function detectBottlenecks(
  departments: Department[],
  workflows: WorkflowStep[],
  avgSalaryCostPerHour: number = 35,
  forceDemo: boolean = false
): Promise<BottleneckResult> {
  const isDemoMode = forceDemo || !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "demo";

  if (isDemoMode) {
    return generateDemoBottlenecks(departments, workflows, avgSalaryCostPerHour);
  }

  const prompt = `You are an organizational efficiency analyst. Analyze the following data and identify bottlenecks using rigorous operations research methods.

DEPARTMENTS:
${JSON.stringify(departments, null, 2)}

WORKFLOW STEPS:
${JSON.stringify(workflows, null, 2)}

Average salary cost per hour: $${avgSalaryCostPerHour}

ANALYSIS METHODOLOGY — apply all three frameworks explicitly:

1. **Theory of Constraints (Goldratt, 1984)**: Identify the primary system constraint — the single workflow step that limits total organizational throughput. Rank all workflows by constraint score = utilization × volume × duration. The highest-scoring step IS the system bottleneck.

2. **Little's Law (Little, 1961)**: Apply L = λW to calculate average WIP (work-in-progress) for each workflow:
   - λ = volume/40 (arrival rate per working hour)
   - W = avgDurationHours
   - L = λ × W (average items in-flight)
   Report the system-level WIP and explain how the constraint is inflating it.

3. **M/M/1 Queuing Theory**: For each workflow compute utilization ρ = λ/μ where μ = 1/avgDurationHours. If ρ ≥ 1.0, the queue is unstable and grows infinitely. If 0.8 < ρ < 1.0, queue length Lq = ρ²/(1-ρ) can be very large.

4. **Lean Six Sigma**: Calculate DPMO = errorRate × 1,000,000 and the Sigma level for each workflow. Flag any workflow below 3σ (DPMO > 66,807) as a quality bottleneck.

5. **APQC Benchmarks**: Compare cycle times to published APQC Process Classification Framework benchmarks. Quantify how much above/below benchmark each workflow is.

If data is missing key fields (error rates, specific volumes), explicitly request them in the summary.

Return a JSON object:
{
  bottlenecks: Array<{
    id: string,
    location: string,
    severity: "critical" | "high" | "medium" | "low",
    type: string, // "approval_bottleneck" | "process_inefficiency" | "resource_constraint" | "communication_gap"
    impact: string, // Must include: utilization rate, Little's Law WIP, benchmark comparison, and financial impact
    recommendation: string, // Reference specific methodology (TOC elevation, Six Sigma, etc.)
    estimatedHoursLostPerWeek: number,
    costPerWeek: number
  }>,
  overallHealthScore: number, // 0-100 — derived from avg utilization + hours lost ratio
  summary: string, // Lead with TOC primary constraint, quote Little's Law system WIP, reference Sigma levels
  quickWins: string[] // Top 5; each must reference a specific metric (e.g. "reduces DPMO from X to Y")
}`;

  const response = await ai.models.generateContent({
    model: AI_MODEL,
    contents: [
      { role: "user", parts: [{ text: prompt }] }
    ],
    config: {
      temperature: 0.15,
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || "{}") as BottleneckResult;
}

// ─── Simulation ───────────────────────────────────────────────────────────────

export async function runSimulation(
  departments: Department[],
  workflows: WorkflowStep[],
  scenario: SimulationScenario,
  avgSalaryCostPerHour: number = 35,
  forceDemo: boolean = false
): Promise<SimulationResult> {
  const isDemoMode = forceDemo || !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "demo";

  if (isDemoMode) {
    return generateDemoSimulation(departments, workflows, scenario, avgSalaryCostPerHour);
  }

  const prompt = `You are a business process simulation AI. Run a what-if simulation using rigorous operations research methodology.

CURRENT ORGANIZATIONAL DATA:
Departments: ${JSON.stringify(departments, null, 2)}
Workflows: ${JSON.stringify(workflows, null, 2)}
Average salary cost per hour: $${avgSalaryCostPerHour}

SIMULATION SCENARIO:
Name: ${scenario.name}
Description: ${scenario.description}
Parameter changes: ${JSON.stringify(scenario.changes, null, 2)}

SIMULATION METHODOLOGY — apply all three frameworks:

1. **Theory of Constraints** — does this scenario elevate, exploit, or ignore the primary constraint? If it ignores the constraint, cap throughput gain at 5% max.

2. **Little's Law** — model how the scenario changes cycle times W and thus system WIP L = λW. A 30% reduction in W gives a 30% WIP reduction at same arrival rate.

3. **M/M/1 Queuing** — if the scenario reduces utilization ρ at a bottleneck step from >0.9 to <0.8, queue wait time drops dramatically (non-linear improvement).

4. **Cost accounting** — headcount changes: direct cost. Automation savings: model as labor-equivalent reduction. Training: 5.4× McKinsey average ROI implies cost eventually recovers.

5. **Confidence** — higher if the constraint is directly addressed, lower if it's ignored, lower for high automation rates (change management risk).

Return:
{
  scenario: string,
  currentState: { throughput: number, avgCycleTimeHours: number, costPerWeekUSD: number, qualityScore: number, employeeSatisfaction: number },
  projectedState: { throughput: number, avgCycleTimeHours: number, costPerWeekUSD: number, qualityScore: number, employeeSatisfaction: number },
  deltaPercent: { throughput: number, cycleTime: number, cost: number, quality: number, satisfaction: number },
  risks: string[],
  recommendations: string[],
  implementationPlan: Array<{ phase: string, duration: string, actions: string[], expectedImpact: string }>,
  confidenceScore: number,
  narrative: string // Explain methodology used, cite Little's Law and TOC explicitly with numbers
}`;

  const response = await ai.models.generateContent({
    model: AI_MODEL,
    contents: [
      { role: "user", parts: [{ text: prompt }] }
    ],
    config: {
      temperature: 0.15,
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || "{}") as SimulationResult;
}

// ─── Agentic Workflow Agents ──────────────────────────────────────────────────

export const PLANNER_PROMPT = `You are the Planner Agent in an agentic workflow engine for organizational optimization.

Given a user goal and the current organizational context (departments, workflows, metrics), your job is to:
1. Decompose the goal into 3-5 concrete sub-tasks
2. Identify which departments and workflows are most relevant
3. Specify what operational data is needed for each sub-task
4. Estimate the complexity and interdependencies of each sub-task

Output a structured plan with clear, actionable sub-tasks. Be specific about which metrics to target.`;

export const RESEARCHER_PROMPT = `You are the Researcher Agent in an agentic workflow engine for organizational optimization.

You receive a structured plan from the Planner Agent. Your job is to:
1. Apply rigorous operations research methodology to each sub-task:
   - Theory of Constraints (Goldratt): identify binding constraints
   - Little's Law (L = λW): model WIP and cycle time relationships
   - M/M/1 Queuing Theory: compute utilization ρ and queue lengths
   - Lean Six Sigma: calculate DPMO, sigma levels, and defect costs
2. Benchmark each target metric against APQC Process Classification Framework
3. Calculate precise improvement potential for each sub-task with quantified metrics
4. Identify implementation prerequisites and dependencies

Output detailed research findings with specific numbers and methodology citations.`;

export const CRITIC_PROMPT = `You are the Critic Agent in an agentic workflow engine for organizational optimization.

You receive the Planner's plan and the Researcher's findings. Your job is to:
1. Challenge assumptions — identify what could go wrong
2. Flag risks: change management resistance, resource constraints, interdependency failures
3. Check for logical inconsistencies or unsupported claims
4. Identify missing data that would significantly change recommendations
5. Apply McKinsey's transformation failure analysis: 70% of transformations fail due to people factors — assess this risk specifically
6. Suggest specific mitigations for each identified risk

Be constructively critical. The goal is to make the final plan robust, not to reject it.`;

export const WORKFLOW_SYNTHESIZER_PROMPT = `You are the Synthesizer Agent in an agentic workflow engine for organizational optimization.

You receive a comprehensive plan (Planner), research findings (Researcher), and critical review (Critic). Your job is to:
1. Merge the best insights from all three agents
2. Incorporate the Critic's risk mitigations into each action item
3. Produce a final, rigorous action plan

Return a JSON object in exactly this format:
{
  "goal": "...",
  "executiveSummary": "...",
  "actionItems": [
    {
      "id": "action-1",
      "title": "...",
      "description": "...",
      "priority": "critical" | "high" | "medium" | "low",
      "department": "...",
      "timeline": "...",
      "effort": "low" | "medium" | "high",
      "expectedImpact": "...",
      "metrics": { "before": "...", "after": "...", "methodology": "..." },
      "risks": ["..."],
      "mitigations": ["..."]
    }
  ],
  "phases": [
    { "phase": "...", "duration": "...", "focus": "...", "actions": ["action-1"] }
  ],
  "projectedImpact": {
    "cycleTimeReductionPct": 0,
    "costSavingsPerWeek": 0,
    "qualityImprovementPct": 0,
    "paybackWeeks": 0
  },
  "confidenceScore": 0.85,
  "keyRisks": ["..."],
  "dataGaps": ["..."]
}`;

export async function runPlanner(goal: string, orgContext: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: AI_MODEL,
    contents: [
      { role: "user", parts: [{ text: PLANNER_PROMPT + "\\n\\nGOAL: " + goal + "\\n\\nORG CONTEXT:\\n" + orgContext }] }
    ],
    config: { temperature: 0.2 }
  });
  return response.text || "";
}

export async function runResearcher(plan: string, orgContext: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: AI_MODEL,
    contents: [
      { role: "user", parts: [{ text: RESEARCHER_PROMPT + "\\n\\nPLAN:\\n" + plan + "\\n\\nORG CONTEXT:\\n" + orgContext }] }
    ],
    config: { temperature: 0.1 }
  });
  return response.text || "";
}

export async function runCritic(plan: string, research: string, orgContext: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: AI_MODEL,
    contents: [
      { role: "user", parts: [{ text: CRITIC_PROMPT + "\\n\\nPLAN:\\n" + plan + "\\n\\nRESEARCH:\\n" + research + "\\n\\nORG CONTEXT:\\n" + orgContext }] }
    ],
    config: { temperature: 0.2 }
  });
  return response.text || "";
}

export async function runWorkflowSynthesizer(plan: string, research: string, criticism: string, goal: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: AI_MODEL,
    contents: [
      { role: "user", parts: [{ text: WORKFLOW_SYNTHESIZER_PROMPT + "\\n\\nGOAL: " + goal + "\\n\\nPLAN:\\n" + plan + "\\n\\nRESEARCH:\\n" + research + "\\n\\nCRITIC REVIEW:\\n" + criticism }] }
    ],
    config: {
      temperature: 0.1,
      responseMimeType: "application/json"
    }
  });
  return response.text || "";
}

// ─── Demo Mode Generators (Algorithm-Driven) ─────────────────────────────────

function generateDemoBottlenecks(
  departments: Department[],
  workflows: WorkflowStep[],
  avgCostPerHour: number
): BottleneckResult {
  const analysis = analyzeBottlenecks(departments, workflows, avgCostPerHour);
  const { workflowMetrics, departmentMetrics, primaryConstraint } = analysis;
  const sortedWorkflows = [...workflowMetrics].sort((a, b) => b.constraintScore - a.constraintScore);
  const bottlenecks: BottleneckResult["bottlenecks"] = [];

  if (sortedWorkflows[0]) {
    const wf = sortedWorkflows[0];
    bottlenecks.push({
      id: "b-1",
      location: `${wf.workflowName} (${wf.department})`,
      severity: "critical",
      type: "process_inefficiency",
      impact: `Theory of Constraints identifies this as the primary system constraint. Utilization: ${(wf.utilizationRate * 100).toFixed(0)}%${wf.utilizationRate >= 1 ? " — queue is UNSTABLE and grows indefinitely" : ""}. Little's Law: L = ${wf.arrivalRatePerHour.toFixed(2)} items/hr × ${wf.avgWaitTimeHours}h = ${wf.avgQueueLength.toFixed(1)} average items in-flight. APQC benchmark: ${wf.benchmarkCycleTimeHours}h median; current cycle time is ${wf.benchmarkDeviation.toFixed(1)}× that benchmark. DPMO: ${Math.round(wf.dpmo).toLocaleString()} (Sigma ${wf.sigmaLevel.toFixed(1)}σ).`,
      recommendation: `Apply TOC Elevation: (1) parallelize execution to increase throughput at this stage, (2) reduce batch sizes to decrease per-item cycle time, (3) implement SLA alerts at ${Math.round(wf.benchmarkCycleTimeHours * 1.5)}h to catch queue buildup early. Target: reduce to APQC best-in-class ${wf.benchmarkCycleTimeHours * 0.5}h.`,
      estimatedHoursLostPerWeek: Math.round(wf.hoursLostToErrorsPerWeek + Math.max(0, (wf.avgWaitTimeHours - wf.benchmarkCycleTimeHours) * wf.avgQueueLength * 0.15)),
      costPerWeek: Math.round((wf.hoursLostToErrorsPerWeek + Math.max(0, (wf.avgWaitTimeHours - wf.benchmarkCycleTimeHours) * wf.avgQueueLength * 0.15)) * avgCostPerHour),
    });
  }

  const mostStressedDept = [...departmentMetrics].sort((a, b) => b.stressScore - a.stressScore)[0];
  if (mostStressedDept) {
    const dept = departments.find(d => d.id === mostStressedDept.departmentId)!;
    bottlenecks.push({
      id: "b-2",
      location: `${mostStressedDept.departmentName} — Approval Queue`,
      severity: "high",
      type: "approval_bottleneck",
      impact: `${dept?.pendingApprovals} pending approvals (APQC median: 8). M/M/1 queuing model: at current arrival rate and response time, queue wait time is ${(dept.avgResponseTimeHours * 2.5).toFixed(1)}h per item. Department stress score: ${mostStressedDept.stressScore}/100. Meeting load: ${dept.meetingsPerWeek} meetings/week consuming ${(dept.meetingsPerWeek * 1.25).toFixed(1)}h — reduces effective approval capacity by ${Math.round((dept.meetingsPerWeek * 1.25 / (dept.headcount * 8)) * 100)}%.`,
      recommendation: `Delegate approvals for items below standard threshold (removes ~70%). Enable single-tap mobile approvals. Set 24h auto-escalation. Target: reduce pending from ${dept.pendingApprovals} to ≤8 (APQC median).`,
      estimatedHoursLostPerWeek: Math.round(dept.pendingApprovals * dept.avgResponseTimeHours * 0.4),
      costPerWeek: Math.round(dept.pendingApprovals * dept.avgResponseTimeHours * 0.4 * avgCostPerHour),
    });
  }

  const worstQuality = [...workflowMetrics].sort((a, b) => b.dpmo - a.dpmo)[0];
  if (worstQuality && worstQuality.workflowId !== sortedWorkflows[0]?.workflowId) {
    bottlenecks.push({
      id: "b-3",
      location: worstQuality.workflowName,
      severity: "high",
      type: "process_inefficiency",
      impact: `DPMO: ${Math.round(worstQuality.dpmo).toLocaleString()} (Sigma ${worstQuality.sigmaLevel.toFixed(1)}σ). Industry best-in-class is ≥4.0σ (DPMO ≤6,210). Each defect triggers rework adding ~${Math.round(worstQuality.avgWaitTimeHours * 0.3)}h to the ${worstQuality.avgWaitTimeHours}h cycle time. Rework hours lost: ${worstQuality.hoursLostToErrorsPerWeek.toFixed(1)}h/week.`,
      recommendation: `Apply Lean Six Sigma DMAIC cycle: Define → Measure (establish baseline DPMO) → Analyze (Pareto chart of defect types) → Improve (input validation, automated checks) → Control (SPC charts with control limits). Target 3.0σ within 12 weeks (DPMO <66,807).`,
      estimatedHoursLostPerWeek: Math.round(worstQuality.hoursLostToErrorsPerWeek),
      costPerWeek: Math.round(worstQuality.hoursLostToErrorsPerWeek * avgCostPerHour),
    });
  }

  const highMeetingDept = [...departments].sort((a, b) => b.meetingsPerWeek - a.meetingsPerWeek)[0];
  if (highMeetingDept) {
    const meetingHours = highMeetingDept.meetingsPerWeek * 1.25;
    const deepWorkCapacity = highMeetingDept.headcount * 8 - meetingHours;
    bottlenecks.push({
      id: "b-4",
      location: `${highMeetingDept.name} — Meeting Overhead`,
      severity: "medium",
      type: "resource_constraint",
      impact: `${highMeetingDept.meetingsPerWeek} meetings/week × 1.25h avg = ${meetingHours.toFixed(1)}h of scheduled meeting time. Effective deep-work capacity: ${deepWorkCapacity.toFixed(1)}h/person/day vs. 8h available. McKinsey research: attention fragmentation reduces complex-task throughput by 23–40%. ${highMeetingDept.overdueItems} overdue items signal resulting capacity crunch.`,
      recommendation: `Conduct 30-day meeting audit: score each by value/time ratio; cancel bottom 30%. Mandate async video (Loom) for status updates. Protect 3 morning blocks/week as No-Meeting time. Target: ${Math.round(highMeetingDept.meetingsPerWeek * 0.7)} meetings/week.`,
      estimatedHoursLostPerWeek: Math.round(highMeetingDept.meetingsPerWeek * 0.3 * 1.25 * highMeetingDept.headcount * 0.8),
      costPerWeek: Math.round(highMeetingDept.meetingsPerWeek * 0.3 * 1.25 * highMeetingDept.headcount * 0.8 * avgCostPerHour),
    });
  }

  bottlenecks.push({
    id: "b-5",
    location: "Cross-Department Handoffs",
    severity: "low",
    type: "communication_gap",
    impact: `Average handoff delay between departments creates invisible wait time impossible to see in any single department's metrics. APQC identifies unclear RACI as #1 handoff delay driver. With ${workflows.length} workflow steps spanning ${departments.length} departments, boundary crossings are frequent.`,
    recommendation: "Define RACI matrices for all cross-team workflows. Implement automated LiquiFlow handoff notifications with full context. Track handoff SLA compliance as a standalone KPI visible to all department heads.",
    estimatedHoursLostPerWeek: Math.round(departments.length * 4.2 * 1.2),
    costPerWeek: Math.round(departments.length * 4.2 * 1.2 * avgCostPerHour),
  });

  const totalHoursLost = bottlenecks.reduce((s, b) => s + b.estimatedHoursLostPerWeek, 0);

  return {
    bottlenecks,
    overallHealthScore: analysis.overallHealthScore,
    summary: `Applying Theory of Constraints (Goldratt, 1984) to ${departments.length} departments and ${workflows.length} workflow steps: the binding system constraint is **${primaryConstraint?.workflowName || "highest-duration workflow"}** (utilization ${((primaryConstraint?.utilizationRate ?? 0) * 100).toFixed(0)}%). Little's Law (L = λW) predicts ${analysis.systemWIP.toFixed(1)} average work-in-progress items trapped system-wide. ${sortedWorkflows.filter(w => w.sigmaLevel < 3).length} workflows operate below 3σ quality (DPMO > 66,807), creating compounding rework queues. Total estimated productivity loss: ${totalHoursLost}h/week (≈$${(totalHoursLost * avgCostPerHour).toLocaleString()}/week). Addressing the top 3 constraints could recover 60–70% of this within 10 weeks.`,
    quickWins: [
      `Target the primary constraint (${primaryConstraint?.workflowName}) — TOC theory: even 20% improvement here increases total system throughput`,
      `Reduce ${worstQuality?.workflowName || "highest error-rate workflow"} DPMO from ${Math.round(worstQuality?.dpmo ?? 0).toLocaleString()} to <66,807 (3σ) via input validation`,
      `Delegate approval authority in ${mostStressedDept?.departmentName} — reduces ${mostStressedDept?.pendingItems} pending items toward APQC 8-item median threshold`,
      `Cut ${departments.sort((a, b) => b.meetingsPerWeek - a.meetingsPerWeek)[0]?.meetingsPerWeek ? Math.round(departments.sort((a, b) => b.meetingsPerWeek - a.meetingsPerWeek)[0].meetingsPerWeek * 0.3) : 5} low-value meetings/week — frees ${Math.round(departments.sort((a, b) => b.meetingsPerWeek - a.meetingsPerWeek)[0]?.headcount * 0.3 * 1.25 || 10)}h/week of deep-work capacity`,
      "Define RACI for cross-department workflows — eliminates invisible handoff delays at all 6 department boundaries",
    ],
  };
}

function generateDemoSimulation(
  departments: Department[],
  workflows: WorkflowStep[],
  scenario: SimulationScenario,
  avgCostPerHour: number
): SimulationResult {
  const totalTasksPerWeek = departments.reduce((s, d) => s + d.avgTasksPerWeek, 0);
  const totalHeadcount = departments.reduce((s, d) => s + d.headcount, 0);
  const workingHoursPerWeek = 40;
  const currentCost = totalHeadcount * workingHoursPerWeek * avgCostPerHour;
  const avgErrorRate = workflows.reduce((s, w) => s + w.errorRate, 0) / Math.max(workflows.length, 1);
  const currentQuality = Math.round(Math.max(55, Math.min(85, (1 - avgErrorRate) * 88)));
  const currentSatisfaction = 68;

  const analysis = analyzeBottlenecks(departments, workflows, avgCostPerHour);
  const projection = projectSimulation(departments, workflows, scenario.changes, avgCostPerHour);

  const narrative = `Rooted in Theory of Constraints and Little's Law: The "${scenario.name}" scenario ${
    projection.throughputGainPct > 0
      ? `projects a ${projection.throughputGainPct}% increase in organizational throughput`
      : "does not directly address system throughput"
  } and a ${Math.abs(projection.cycleTimeReductionPct)}% ${projection.cycleTimeReductionPct < 0 ? "reduction" : "increase"} in average cycle time (from ${analysis.systemAvgCycleTimeHours.toFixed(1)}h → ${projection.newAvgCycleTimeHours.toFixed(1)}h). ${
    analysis.primaryConstraint
      ? `Primary system constraint identified: "${analysis.primaryConstraint.workflowName}" at ${(analysis.primaryConstraint.utilizationRate * 100).toFixed(0)}% utilization (${analysis.primaryConstraint.avgQueueLength.toFixed(1)} items WIP via Little's Law). `
      : ""
  }${
    projection.cycleTimeReductionPct < 0
      ? `Reducing cycle time W by ${Math.abs(projection.cycleTimeReductionPct).toFixed(1)}% decreases system WIP L = λW proportionally (from ${analysis.systemWIP.toFixed(1)} to ${(analysis.systemWIP * (1 + projection.cycleTimeReductionPct / 100)).toFixed(1)} items). `
      : ""
  }Net weekly cost impact: ${projection.costChangePct < 0 ? "savings" : "increase"} of $${Math.abs(projection.newCostPerWeek - currentCost).toLocaleString()}/week. Confidence: ${Math.round(projection.confidenceScore * 100)}%${projection.modelNotes.length > 0 ? " — " + projection.modelNotes[0] : ""}.`;

  const automationRate = (scenario.changes.automation_rate as number) ?? 0;
  const headcountChange = (scenario.changes.headcount_increase as number) ?? 0;
  const processImprovement = (scenario.changes.process_improvement as number) ?? 0;

  return {
    scenario: scenario.name,
    currentState: {
      throughput: totalTasksPerWeek,
      avgCycleTimeHours: Math.round(analysis.systemAvgCycleTimeHours * 10) / 10,
      costPerWeekUSD: Math.round(currentCost),
      qualityScore: currentQuality,
      employeeSatisfaction: currentSatisfaction,
    },
    projectedState: {
      throughput: projection.newSystemThroughput,
      avgCycleTimeHours: projection.newAvgCycleTimeHours,
      costPerWeekUSD: projection.newCostPerWeek,
      qualityScore: projection.newQualityScore,
      employeeSatisfaction: projection.newSatisfactionScore,
    },
    deltaPercent: {
      throughput: projection.throughputGainPct,
      cycleTime: projection.cycleTimeReductionPct,
      cost: projection.costChangePct,
      quality: projection.qualityGainPct,
      satisfaction: projection.satisfactionGainPct,
    },
    risks: [
      ...projection.modelNotes,
      automationRate > 0.3 ? "High automation rate may cause resistance — structured change management required (Deloitte 2023: 65% of employees anxious about automation)" : "",
      headcountChange < -5 ? "Rapid headcount reduction risks knowledge loss and morale impact — plan 90-day knowledge transfer" : "",
      analysis.primaryConstraint && automationRate === 0 && processImprovement === 0
        ? `Scenario does not target primary constraint (${analysis.primaryConstraint.workflowName}) — system throughput gain will be limited by this unchanged bottleneck`
        : "",
      "Implementation disruption may temporarily reduce throughput 8–12% in weeks 1–4; plan accordingly",
    ].filter(Boolean),
    recommendations: [
      `Phase changes over 12 weeks to minimize disruption to ${totalHeadcount} employees`,
      "Run a 2-week pilot in one department before full rollout — validate model assumptions with real data",
      "Establish baseline KPI measurements (cycle time, error rate, WIP count) before any changes begin",
      automationRate > 0 ? "Invest in change management training — McKinsey: 70% of transformations fail due to people factors, not technology" : "",
      "Schedule monthly simulation re-runs to compare actual results vs. this projection and recalibrate",
    ].filter(Boolean),
    implementationPlan: [
      {
        phase: "Phase 1: Preparation & Baseline",
        duration: "Weeks 1–2",
        actions: ["Measure 4-week baseline KPIs (throughput, cycle time, error rates, WIP count)", "Stakeholder communication plan", "Pilot team selection", "Change champion identification"],
        expectedImpact: "Zero operational change — foundation set for measurement",
      },
      {
        phase: "Phase 2: Pilot",
        duration: "Weeks 3–6",
        actions: ["Deploy changes in pilot department", "Daily monitoring of target metrics", "Weekly retrospectives", "Adjust based on feedback loop"],
        expectedImpact: `~${Math.round(projection.throughputGainPct * 0.4)}% of projected throughput gain in pilot area`,
      },
      {
        phase: "Phase 3: Rollout",
        duration: "Weeks 7–12",
        actions: ["Scale to all departments", "Full training program", "Process documentation updated", "Support channel active"],
        expectedImpact: `75–85% of projected ${projection.throughputGainPct}% throughput gain`,
      },
      {
        phase: "Phase 4: Optimize",
        duration: "Weeks 13+",
        actions: ["Tune based on actuals vs. model", "Re-run simulation with real performance data", "Address next system constraint (TOC continuous improvement)", "Plan next improvement cycle"],
        expectedImpact: `Full ${projection.throughputGainPct}% throughput + ${Math.abs(projection.cycleTimeReductionPct)}% cycle time improvement`,
      },
    ],
    confidenceScore: projection.confidenceScore,
    narrative,
  };
}
