import type { BottleneckResult, SimulationResult, OrgProfile, WorkflowPlanResult } from "./liquiflow-types";
import { DEMO_DEPARTMENTS, DEMO_WORKFLOW_STEPS } from "./liquiflow-types";

// ─── Pre-Built Demo Bottleneck Result ────────────────────────────────────────

export const DEMO_BOTTLENECK_RESULT: BottleneckResult = {
  overallHealthScore: 58,
  summary:
    "Applying Theory of Constraints (Goldratt, 1984) to Meridian Group's 6 departments and 8 workflow steps, the binding system constraint is Contract Review (115h cycle time vs. 168h APQC median — but at 12 items/week × 115h = 1,380 demand-hours, consuming 92% of Operations capacity). Little's Law (L = λW) predicts 32.6 average work-in-progress items trapped in the system at any time. Vendor Invoice Processing contributes a 15% defect rate (DPMO: 150,000; Sigma level: 2.6σ vs. best-in-class 4.0σ), compounding queue buildup. Eliminating the top 3 constraints would recover an estimated 62–68% of lost productivity within 10 weeks, reducing system WIP by 18+ items.",
  quickWins: [
    "Implement 3-way PO matching for invoices — cuts 15% error rate to <3% within 30 days (Aberdeen best-in-class target)",
    "Enable mobile approvals for pending queues — Operations has 41 items stalled vs. APQC 8-item median",
    "Template-driven contract drafting — reduces 115h Contract Review to APQC 48h best-in-class",
    "SLA auto-escalation after 48h inactivity — prevents queue buildup at the Operations constraint",
    "Async status updates replace 6+ weekly Operations check-in meetings — reclaims 9h/week of deep work per employee",
  ],
  bottlenecks: [
    {
      id: "b-1",
      location: "Contract Review (Operations)",
      severity: "critical",
      type: "process_inefficiency",
      impact:
        "At 115h avg duration with 12 items/week, Contract Review generates 1,380 weekly demand-hours against 1,000h Operations capacity (138% utilization). M/M/1 queuing model predicts this queue is unstable — backlog grows by ~3.4 items/week indefinitely at current throughput rate. APQC best-in-class benchmark is 48h; median performers achieve 168h. Meridian is competitive on duration but critically overloaded on volume. This is the primary system constraint per Theory of Constraints.",
      recommendation:
        "Apply TOC elevation strategy: (1) parallel review tracks so legal and commercial review simultaneously, (2) pre-approved template library for standard contracts (reduces novel review to 20% of items), (3) AI draft pre-screening to flag non-standard clauses before human review. Target: reduce effective cycle time impact by 40% within 8 weeks.",
      estimatedHoursLostPerWeek: 380,
      costPerWeek: 13300,
    },
    {
      id: "b-2",
      location: "Operations — Approval Queue",
      severity: "high",
      type: "approval_bottleneck",
      impact:
        "Operations holds 41 pending approvals (APQC median: 8) and 12 overdue items. Using Little's Law, with λ = 55 POs/week and avg response time of 38.7h, WIP = 53.6 items perpetually in-flight. At 18 meetings/week consuming 22.5h, effective manager attention for approvals is reduced to ~5h/day — yielding an approval throughput of ~1 item/hour vs. the 1.4/hr needed to clear queue. This gap causes exponential queue growth.",
      recommendation:
        "Delegate Purchase Order approvals under ฿50,000 to team leads (removes ~70% of items). Enable one-tap mobile approvals with pre-populated context. Set 24h auto-escalation. Target: reduce pending approvals from 41 → 12 within 3 weeks.",
      estimatedHoursLostPerWeek: 137,
      costPerWeek: 4795,
    },
    {
      id: "b-3",
      location: "Vendor Invoice Processing (Finance)",
      severity: "high",
      type: "process_inefficiency",
      impact:
        "15% error rate produces DPMO of 150,000 (Sigma level: 2.6σ). Aberdeen Group top quartile achieves <1% error rate (DPMO: 10,000; 3.8σ). Each error triggers rework adding ~19h to the 71h cycle time. At 29 invoices/week with 4.35 errors/week, rework consumes 82.7 hours — equivalent to 2.1 FTE-days per week. Late payments also risk supplier penalty clauses averaging 1.5% of invoice value.",
      recommendation:
        "Implement 3-way matching (PO → Goods Receipt → Invoice) to catch 80% of errors at entry. Deploy OCR-based data extraction to eliminate manual keying errors. Target: reach 3σ (DPMO <66,807) within 12 weeks, matching Aberdeen median performer.",
      estimatedHoursLostPerWeek: 83,
      costPerWeek: 2905,
    },
    {
      id: "b-4",
      location: "Human Resources — Meeting Overhead",
      severity: "medium",
      type: "resource_constraint",
      impact:
        "HR holds 11 meetings/week × 1.25h avg = 13.75h of scheduled meeting time. Combined with 22 pending approvals and 7 overdue items, HR's 8-person team has effective deep-work capacity of only 26.25h/week per person — 34% below knowledge-work best practice of 40h. McKinsey research identifies fragmented attention as reducing complex-task throughput by 23–40%.",
      recommendation:
        "Audit all HR recurring meetings — cancel those without standing agenda. Shift status updates to async Loom recordings (5min summary replaces 30min sync). Protect Mon/Wed/Fri mornings as no-meeting deep-work blocks. Target: reduce to 6 meetings/week, reclaiming 6.25h/person/week.",
      estimatedHoursLostPerWeek: 50,
      costPerWeek: 1750,
    },
    {
      id: "b-5",
      location: "Cross-Department Handoffs",
      severity: "low",
      type: "communication_gap",
      impact:
        "Average handoff delay between Finance, Operations, and HR is 4.2h per boundary crossing. With 7+ cross-department boundaries per day across Meridian Group, this accumulates to 147h/week of invisible waiting time — invisible because it doesn't appear in any single department's metrics. APQC identifies unclear RACI as the #1 contributor to handoff delay.",
      recommendation:
        "Define RACI matrices for all cross-team workflows. Implement automated LiquiFlow handoff notifications with full context payload (assignee, deadline, linked documents). Track handoff SLA compliance as a standalone KPI. Target: reduce boundary delay from 4.2h → 1.5h.",
      estimatedHoursLostPerWeek: 29,
      costPerWeek: 1015,
    },
  ],
};

// ─── Pre-Built Demo Simulation Results ────────────────────────────────────────

export const DEMO_SIMULATION_RESULTS: Record<string, SimulationResult> = {
  "Automate Finance Workflows": {
    scenario: "Automate Finance Workflows",
    currentState: {
      throughput: 1073,    
      avgCycleTimeHours: 67.9, 
      costPerWeekUSD: 123760,  
      qualityScore: 72,    
      employeeSatisfaction: 68, 
    },
    projectedState: {
      throughput: 1481,    
      avgCycleTimeHours: 40.5, 
      costPerWeekUSD: 106100,  
      qualityScore: 86,    
      employeeSatisfaction: 76, 
    },
    deltaPercent: {
      throughput: 38.0,   
      cycleTime: -40.4,   
      cost: -14.3,        
      quality: 19.4,      
      satisfaction: 11.8, 
    },
    risks: [
      "Change resistance: 65% of finance staff report anxiety about automation (Deloitte 2023 survey) — structured change management is required",
      "Shadow-mode pilot (weeks 4-7) may temporarily reveal hidden errors causing a quality dip before improvement",
      "Quality gains depend on 3-way matching supplier data accuracy — onboarding suppliers to e-invoicing takes 4-6 weeks",
      "ROI break-even: implementation costs ~$52,000; payback at week 8 if savings hold",
    ],
    recommendations: [
      "Begin with 3-way PO matching for A-tier suppliers (top 20% by volume) — 80% of gain with 20% of effort",
      "Run 2-week shadow mode where AI suggests but humans approve, to build Finance team trust",
      "Train 2 Finance automation champions who become internal experts and peer coaches",
      "Establish baseline KPI measurements this week (cycle time, error rate, cost/invoice) before any changes",
      "Set monthly simulation re-runs to compare actual results vs. this projection",
    ],
    implementationPlan: [
      {
        phase: "Phase 1: Baseline & Design",
        duration: "Weeks 1–2",
        actions: ["Measure 4 weeks of baseline KPIs (cycle time, error rate, cost/invoice)", "Map current Finance workflow in detail", "Select 3-way matching platform and e-invoicing vendor", "Identify and brief Finance automation champions"],
        expectedImpact: "No operational change — foundation set",
      },
      {
        phase: "Phase 2: Shadow Mode Pilot",
        duration: "Weeks 3–6",
        actions: ["Deploy 3-way matching in shadow mode (suggests, human decides)", "OCR extraction live for manual keying elimination", "Weekly retrospectives with 4-person Finance pilot team", "Fine-tune matching thresholds on real invoice sample"],
        expectedImpact: "~30% error reduction in pilot scope; zero productivity disruption",
      },
      {
        phase: "Phase 3: Full Activation",
        duration: "Weeks 7–12",
        actions: ["Enable auto-approval for invoices matching within 2% tolerance", "Scale to all 29 weekly invoices", "Enable one-tap mobile approvals for Finance team", "SLA auto-escalation live (48h breach → manager)"],
        expectedImpact: "75–85% of projected +38% throughput gain; 3σ quality level achieved",
      },
      {
        phase: "Phase 4: Optimization",
        duration: "Weeks 13+",
        actions: ["Extend automation to Procurement POs", "Adjust AI thresholds based on 90-day real data", "Run updated simulation with actuals vs. projection", "Plan next constraint elevation (Contract Review)"],
        expectedImpact: "Full +38% throughput gain and -40% cycle time reduction realized",
      },
    ],
    confidenceScore: 0.88,
    narrative:
      "Applying Little's Law (L = λW) and Theory of Constraints to Meridian Group's Finance workflows: the primary productivity lever is the Vendor Invoice Processing constraint (15% error rate, 71h cycle time). By implementing 3-way matching and OCR-based extraction, error rate is projected to drop from 15% (DPMO 150,000; Sigma 2.6) to <1% (DPMO 10,000; Sigma 3.8), matching Aberdeen Group's top-quartile benchmark. Reducing the constraint's cycle time reverberates through the system via TOC's throughput theorem — system throughput increases by approximately 38%. Little's Law confirms WIP reduction: with W decreasing 40%, average items-in-flight drop from 32.6 to 19.4, directly reducing the approval queue. Net cost savings of $17,660/week are realized by week 8 after implementation costs. Confidence is high (88%) because the constraint is well-identified, the intervention is technically proven, and the scope is contained.",
  },

  "Expand Operations Team": {
    scenario: "Expand Operations Team",
    currentState: {
      throughput: 1073,
      avgCycleTimeHours: 67.9,
      costPerWeekUSD: 123760,
      qualityScore: 72,
      employeeSatisfaction: 68,
    },
    projectedState: {
      throughput: 1280,    
      avgCycleTimeHours: 54.4, 
      costPerWeekUSD: 137760,  
      qualityScore: 78,    
      employeeSatisfaction: 75, 
    },
    deltaPercent: {
      throughput: 19.3,   
      cycleTime: -19.9,   
      cost: 11.3,         
      quality: 8.3,       
      satisfaction: 10.3, 
    },
    risks: [
      "Operations utilization of 138% won't stabilize until week 10 — existing staff remain critically overloaded during hiring period",
      "Onboarding 10 simultaneously may overwhelm HR (currently at 96h onboarding cycle for each hire)",
      "Without resolving the Contract Review process, new hires inherit the same bottleneck patterns",
      "Payback period ~7 months assuming full productivity achieved — slower ROI than automation scenario",
    ],
    recommendations: [
      "Stagger hiring 5 + 5 across months 1 and 2 to avoid overwhelming HR onboarding capacity",
      "Pair each new hire with an Operations veteran for 30-day buddy program to accelerate ramp",
      "Combine with Meeting Reduction Initiative to free management capacity for effective onboarding",
      "Prioritize hiring for roles that directly address the Contract Review constraint (legal/commercial specialists)",
      "Track 90-day productivity ramp — flag anyone below 60% productivity at day 45",
    ],
    implementationPlan: [
      { phase: "Phase 1: Hiring Sprint", duration: "Weeks 1–4", actions: ["Finalize JDs for 5 priority Operations roles", "Activate recruiting pipeline (internal referral + LinkedIn)", "Offer letters for cohort 1", "Onboarding checklist and buddy assignment"], expectedImpact: "Hiring pipeline active; no operational change" },
      { phase: "Phase 2: Onboarding Cohort 1", duration: "Weeks 5–9", actions: ["Week 1–2: Orientation and process shadowing", "Week 3–4: Supervised workflow handling with buddy", "Cohort 2 of 5 hired", "Productivity tracking: target 40% by end of week 9"], expectedImpact: "20% throughput gain in Operations; queue starts stabilizing" },
      { phase: "Phase 3: Full Team Active", duration: "Weeks 10–16", actions: ["All 10 new hires at ≥80% productivity", "Workload rebalanced across full team of 35", "OKRs set for new roles", "Contract Review capacity review"], expectedImpact: "85% of projected +19% throughput gain achieved" },
      { phase: "Phase 4: Optimization", duration: "Weeks 17+", actions: ["90-day performance review for all new hires", "Process documentation updated to reflect expanded team", "Re-run simulation with actuals", "Identify next constraint to address"], expectedImpact: "Full +19% throughput; team stable at <95% utilization" },
    ],
    confidenceScore: 0.79,
    narrative:
      "M/M/1 queuing analysis reveals Operations is at 138% utilization — mathematically impossible to sustain without queue collapse. Adding 10 FTEs brings utilization from 138% to approximately 95%, which is stable but still high. Little's Law predicts average queue length (Lq) drops from ∞ (unstable queue) to a manageable 4.2 items once utilization falls below 1.0. System cycle time (W) reduces by 19.9% as the Operations queue drains. This scenario is reliable (79% confidence) but slower than automation — full throughput gain materializes only after the 10-week onboarding ramp. Unlike automation, headcount expansion doesn't fix the root cause (Contract Review process); those 35 Ops employees will still face the same 115h cycle-time workflow. For maximum ROI, combine with the Automate Finance Workflows scenario.",
  },

  "Meeting Reduction Initiative": {
    scenario: "Meeting Reduction Initiative",
    currentState: {
      throughput: 1073,
      avgCycleTimeHours: 67.9,
      costPerWeekUSD: 123760,
      qualityScore: 72,
      employeeSatisfaction: 68,
    },
    projectedState: {
      throughput: 1252,   
      avgCycleTimeHours: 50.9, 
      costPerWeekUSD: 112100, 
      qualityScore: 80,   
      employeeSatisfaction: 83, 
    },
    deltaPercent: {
      throughput: 16.7,
      cycleTime: -25.0,  
      cost: -9.4,
      quality: 11.1,
      satisfaction: 22.1, 
    },
    risks: [
      "Senior management may resist async norms — top-down adoption critical (without CEO buy-in, 73% of meeting reduction initiatives fail — Harvard Business Review 2022)",
      "Information silos can form if meeting reduction isn't paired with strong written documentation practices",
      "2-3 week productivity dip during habit change phase is normal and expected — communicate this proactively",
    ],
    recommendations: [
      "Begin with a 30-day Meeting Audit: score every recurring meeting on value/time ratio; cancel bottom 30%",
      "Mandate Loom async video for status updates — targets the #1 reason meetings occur (status sharing)",
      "Implement company-wide No-Meeting Mornings (Mon/Wed/Fri before noon) as a formal policy",
      "Create an async-first playbook: document what requires meetings vs. what should be async",
    ],
    implementationPlan: [
      { phase: "Phase 1: Audit & Policy", duration: "Weeks 1–2", actions: ["Meeting audit across all 6 departments (capture: attendees, duration, purpose, value)", "CEO/leadership sign-off on No-Meeting Morning policy", "Publish async communication playbook", "Cancel bottom 30% of recurring meetings immediately"], expectedImpact: "Policy in place; 5-10% immediate satisfaction lift" },
      { phase: "Phase 2: Habit Change", duration: "Weeks 3–6", actions: ["Roll out Loom for async status updates", "Train all managers on async-first facilitation", "No-Meeting Morning blocks enforced", "Weekly 'focus time' metric published to teams"], expectedImpact: "~8% throughput improvement from freed focus time" },
      { phase: "Phase 3: Normalize", duration: "Weeks 7–12", actions: ["Remaining low-value meetings cancelled or converted", "Async norms fully embedded in team culture", "Employee satisfaction survey checkpoint", "Approval response time SLA measured and published"], expectedImpact: "Full 17% throughput gain; 22pt satisfaction boost realized" },
    ],
    confidenceScore: 0.85,
    narrative:
      "Meeting overhead is Meridian Group's highest-leverage, lowest-cost intervention. Operations (18 meetings/week) and Sales (22 meetings/week) lead the firm in meeting load. Using McKinsey's documented 23–28% productivity loss from attention fragmentation, recovering 30% of meeting time (≈9h/employee/week in Operations) directly reduces approval response times at the Operations bottleneck. M/M/1 queuing predicts that reducing manager response time by 30% cuts average queue wait from 19h to 13h — directly improving system cycle time via Little's Law (W decreases → L decreases → throughput increases). The 22-point satisfaction gain is the highest of all scenarios, grounded in Self-Determination Theory: employees with autonomy over their time consistently score 15–30 points higher on engagement. Confidence is high (85%) as the intervention requires zero technology investment and has low execution risk.",
  },

  "Company-Wide Upskilling": {
    scenario: "Company-Wide Upskilling",
    currentState: {
      throughput: 1073,
      avgCycleTimeHours: 67.9,
      costPerWeekUSD: 123760,
      qualityScore: 72,
      employeeSatisfaction: 68,
    },
    projectedState: {
      throughput: 1177,   
      avgCycleTimeHours: 61.1, 
      costPerWeekUSD: 131200,  
      qualityScore: 88,   
      employeeSatisfaction: 79, 
    },
    deltaPercent: {
      throughput: 9.7,
      cycleTime: -10.0,
      cost: 6.0,
      quality: 22.2,
      satisfaction: 16.2,
    },
    risks: [
      "Training weeks temporarily reduce available capacity by 10% — plan around peak demand periods",
      "Quality gains plateau at 16 weeks — without skill application opportunities, training investment depreciates 40% in 6 months (Ebbinghaus Forgetting Curve)",
      "Without visible career paths tied to new skills, 30-40% of upskilling investments don't translate to retention (Bersin by Deloitte 2023)",
    ],
    recommendations: [
      "Prioritize training on automation/AI tools to compound returns when Finance automation scenario is layered in",
      "Pair upskilling with immediate application via cross-functional project rotations (combats Ebbinghaus forgetting curve)",
      "Create visible skill badges tied to performance reviews to signal organizational commitment",
      "Focus first on the 3 skill gaps that directly address the Contract Review bottleneck (legal reading, negotiation, AI contract tools)",
    ],
    implementationPlan: [
      { phase: "Phase 1: Skills Gap Analysis", duration: "Weeks 1–3", actions: ["Company-wide skill inventory using role competency matrices", "Identify top 10 critical skill gaps by impact (link to bottleneck analysis)", "Design personalized learning paths per department", "Select LMS platform and external training vendors"], expectedImpact: "Gap analysis complete; no operational change" },
      { phase: "Phase 2: Learning Rollout", duration: "Weeks 4–10", actions: ["4h weekly learning block per employee (protected time)", "External expert workshops for top 3 critical skill gaps", "Manager coaching sessions on applying new skills", "Skill progress dashboard live for all managers"], expectedImpact: "Employees 40% through learning paths; early quality improvements visible" },
      { phase: "Phase 3: Apply & Reinforce", duration: "Weeks 11–16", actions: ["Cross-functional project rotations (apply new skills immediately)", "Skill badge ceremony — public recognition of completion", "Peer teaching sessions (teaching consolidates 90% of learning)", "Performance review criteria updated to include new skills"], expectedImpact: "80% quality improvement realized; full satisfaction impact" },
    ],
    confidenceScore: 0.73,
    narrative:
      "The Company-Wide Upskilling program targets the root cause of Meridian Group's quality gap: skill deficiencies driving a 10.1% weighted-average error rate (Sigma 2.8 vs. industry best 4.0σ). By closing the top 3 skill gaps, DPMO is projected to drop from ~93,000 to 12,000 (Sigma 3.6), bringing Meridian to APQC median performance. Little's Law predicts this quality improvement alone reduces WIP by 18% — because fewer rework loops mean fewer items re-entering the workflow. The 40-hour training investment per person follows McKinsey's documented 5.4× average ROI on skills training in professional services. Throughput gains are modest (9.7%) because training temporarily reduces available capacity. Confidence is moderate (73%): skill transfer to job performance depends heavily on manager coaching quality and immediate application opportunities — outcome variance is higher than automation scenarios.",
  },
};

// ─── Pre-Built Organization Profiles ────────────────────────────────────────

export const ORG_PROFILES: OrgProfile[] = [
  {
    id: "profile-1",
    name: "Mid-Market Tech Co",
    industry: "Professional Services / Tech",
    description: "88-person firm facing high meeting loads, cross-department handoff delays, and overloaded review queues.",
    departments: DEMO_DEPARTMENTS, // Uses the original Meridian Group benchmark data
    workflows: DEMO_WORKFLOW_STEPS,
  },
  {
    id: "profile-2",
    name: "Regional Healthcare Provider",
    industry: "Healthcare",
    description: "200-person clinic ecosystem dealing with patient intake delays, insurance authorization bottlenecks, and compliance review.",
    departments: [
      { id: "dept-hc1", name: "Clinical Staff", headcount: 85, avgTasksPerWeek: 1200, avgResponseTimeHours: 1.5, pendingApprovals: 8, overdueItems: 2, meetingsPerWeek: 2 },
      { id: "dept-hc2", name: "Billing & Insurance", headcount: 30, avgTasksPerWeek: 450, avgResponseTimeHours: 24.0, pendingApprovals: 156, overdueItems: 85, meetingsPerWeek: 4 },
      { id: "dept-hc3", name: "Admin & Intake", headcount: 40, avgTasksPerWeek: 850, avgResponseTimeHours: 4.0, pendingApprovals: 45, overdueItems: 12, meetingsPerWeek: 3 },
      { id: "dept-hc4", name: "Compliance & Legal", headcount: 12, avgTasksPerWeek: 150, avgResponseTimeHours: 72.0, pendingApprovals: 65, overdueItems: 30, meetingsPerWeek: 8 },
      { id: "dept-hc5", name: "Facilities / IT", headcount: 33, avgTasksPerWeek: 320, avgResponseTimeHours: 8.5, pendingApprovals: 12, overdueItems: 4, meetingsPerWeek: 5 },
    ],
    workflows: [
      { id: "wf-hc1", name: "Patient Intake Processing", department: "Admin & Intake", avgDurationHours: 1.5, errorRate: 0.18, volume: 820 },
      { id: "wf-hc2", name: "Insurance Prior Authorization", department: "Billing & Insurance", avgDurationHours: 168.0, errorRate: 0.22, volume: 340 },
      { id: "wf-hc3", name: "Clinical Diagnosis Coding", department: "Clinical Staff", avgDurationHours: 4.5, errorRate: 0.08, volume: 1100 },
      { id: "wf-hc4", name: "Claim Denial Review", department: "Billing & Insurance", avgDurationHours: 48.0, errorRate: 0.15, volume: 110 },
      { id: "wf-hc5", name: "HIPAA Patient Disclosure Review", department: "Compliance & Legal", avgDurationHours: 125.0, errorRate: 0.02, volume: 85 },
      { id: "wf-hc6", name: "Medical Equipment Maintenance", department: "Facilities / IT", avgDurationHours: 36.0, errorRate: 0.05, volume: 45 },
    ],
  },
  {
    id: "profile-3",
    name: "Industrial Manufacturing SME",
    industry: "Manufacturing & Supply Chain",
    description: "150-person discrete manufacturing plant struggling with supply chain QA hold-ups and slow maintenance turnaround.",
    departments: [
      { id: "dept-m1", name: "Production Floor", headcount: 95, avgTasksPerWeek: 4000, avgResponseTimeHours: 2.0, pendingApprovals: 15, overdueItems: 5, meetingsPerWeek: 1 },
      { id: "dept-m2", name: "Quality Assurance (QA)", headcount: 15, avgTasksPerWeek: 800, avgResponseTimeHours: 18.5, pendingApprovals: 145, overdueItems: 40, meetingsPerWeek: 5 },
      { id: "dept-m3", name: "Supply Chain & Procurement", headcount: 18, avgTasksPerWeek: 350, avgResponseTimeHours: 42.0, pendingApprovals: 65, overdueItems: 22, meetingsPerWeek: 7 },
      { id: "dept-m4", name: "Maintenance & Plant Techs", headcount: 12, avgTasksPerWeek: 120, avgResponseTimeHours: 8.0, pendingApprovals: 14, overdueItems: 8, meetingsPerWeek: 3 },
      { id: "dept-m5", name: "Sales & Fulfillment", headcount: 10, avgTasksPerWeek: 250, avgResponseTimeHours: 6.5, pendingApprovals: 20, overdueItems: 5, meetingsPerWeek: 12 },
    ],
    workflows: [
      { id: "wf-m1", name: "Inbound Component QA", department: "Quality Assurance (QA)", avgDurationHours: 48.0, errorRate: 0.04, volume: 320 },
      { id: "wf-m2", name: "Assembly Line Setup & Calibration", department: "Production Floor", avgDurationHours: 3.5, errorRate: 0.02, volume: 150 },
      { id: "wf-m3", name: "Custom Part Procurement", department: "Supply Chain & Procurement", avgDurationHours: 120.0, errorRate: 0.12, volume: 85 },
      { id: "wf-m4", name: "Equipment Breakdown Repair", department: "Maintenance & Plant Techs", avgDurationHours: 34.0, errorRate: 0.18, volume: 24 },
      { id: "wf-m5", name: "Finished Goods Final Inspection", department: "Quality Assurance (QA)", avgDurationHours: 12.5, errorRate: 0.06, volume: 480 },
      { id: "wf-m6", name: "Order Fulfillment & Logistics", department: "Sales & Fulfillment", avgDurationHours: 24.0, errorRate: 0.09, volume: 250 },
    ],
  },
];

// ─── Pre-Built Demo Agentic Workflow Result ───────────────────────────────────

export const DEMO_WORKFLOW_RESULT: WorkflowPlanResult = {
  goal: "Reduce vendor invoice processing cycle time by 40%",
  confidenceScore: 0.87,
  executiveSummary:
    "Analysis of Meridian Group's Finance department reveals that Vendor Invoice Processing (71.2h cycle time, 15% error rate, 29 items/week) is the primary constraint in the AP workflow. Applying Little's Law and Theory of Constraints, a 40% cycle-time reduction (71.2h → 42.7h) is achievable within 10 weeks through a three-lever intervention: (1) OCR-based data extraction to eliminate manual keying errors, (2) 3-way PO matching to catch 80% of errors at the point of entry, and (3) delegated approval authority for standard invoices under a threshold. The projected $12,400/week cost saving exceeds implementation cost by week 9. Confidence is high (87%) as the constraint is precisely quantified, the interventions are proven, and the scope is contained within Finance.",

  projectedImpact: {
    cycleTimeReductionPct: 40,
    costSavingsPerWeek: 12400,
    qualityImprovementPct: 22,
    paybackWeeks: 9,
  },

  actionItems: [
    {
      id: "ai-1",
      title: "Deploy OCR-Based Invoice Extraction",
      description:
        "Implement optical character recognition (OCR) to automatically extract vendor, amount, PO number, and line-item data from incoming invoices. This eliminates manual data keying — the root cause of 60–70% of Finance's 15% invoice error rate — and reduces per-invoice processing time by an estimated 28 minutes.",
      priority: "critical",
      department: "Finance",
      timeline: "Weeks 1–4",
      effort: "medium",
      expectedImpact:
        "Error rate drops from 15% to 4–5% (DPMO: 150,000 → 40,000–50,000; Sigma: 2.6σ → 3.1σ). Per-invoice cycle time reduces by ~28 minutes, contributing ~18% of the total 40% cycle-time target.",
      metrics: {
        before: "71.2h avg cycle time, 15% error rate (DPMO 150,000)",
        after: "~58h avg cycle time, 4–5% error rate (DPMO 40,000–50,000)",
        methodology: "Aberdeen Group AP top-quartile benchmark: <1% error via OCR + 3-way match",
      },
      risks: [
        "OCR accuracy depends on invoice format consistency — poor scan quality from some vendors may require manual fallback",
        "Vendor onboarding to structured e-invoicing adds 4–6 weeks for major suppliers",
      ],
      mitigations: [
        "Start with top 10 suppliers by volume (80% of invoices) where format consistency is highest",
        "Maintain manual processing queue as fallback for low-quality scans; measure fallback rate weekly",
      ],
    },
    {
      id: "ai-2",
      title: "Implement 3-Way PO Matching",
      description:
        "Configure automated matching between Purchase Orders, Goods Receipts, and Invoices before any invoice enters the approval queue. Invoices matching within a ±2% tolerance are auto-approved; exceptions are flagged for human review only. This eliminates systematic over-billing, duplicate submissions, and quantity discrepancies — the remaining 30–40% of Finance's error types.",
      priority: "critical",
      department: "Finance",
      timeline: "Weeks 2–5",
      effort: "medium",
      expectedImpact:
        "Combined with OCR, error rate falls below 2% (DPMO <20,000; Sigma 3.5). Approval queue for standard invoices drops by ~70%, reclaiming 8–10h/week of Finance manager attention for complex exceptions.",
      metrics: {
        before: "No systematic matching; 15% error rate; 18 Finance pending approvals",
        after: "<2% error rate; approvals reduced to ~5 complex exceptions/week",
        methodology: "Aberdeen median performer target: <3% error with 3-way match (2023 AP report)",
      },
      risks: [
        "PO data in ERP may be incomplete or stale — matching requires clean master data",
        "Business rules for tolerance thresholds (±2%) need Finance leadership sign-off",
      ],
      mitigations: [
        "Run a 2-week ERP data audit before go-live to identify and clean incomplete PO records",
        "Present 3 threshold-band options (±1%, ±2%, ±5%) to Finance Director with risk/volume trade-off analysis",
      ],
    },
    {
      id: "ai-3",
      title: "Delegate Standard Invoice Approvals to Team Leads",
      description:
        "Currently all 29 weekly invoices require Finance manager approval regardless of amount or type. By delegating invoices below a defined threshold (e.g., <$10,000 and matching PO exactly) to trained Finance team leads, manager review is reserved for strategic, high-value, or exception invoices only. This directly reduces the 71.2h wait time caused by approval queue depth.",
      priority: "high",
      department: "Finance",
      timeline: "Weeks 3–4",
      effort: "low",
      expectedImpact:
        "Removes ~65% of invoices from the manager approval bottleneck. M/M/1 queuing analysis: Finance approval utilization drops from ~95% to ~55%, eliminating queue-wait time contribution (~14h of the 71.2h cycle time).",
      metrics: {
        before: "71.2h cycle time — ~14h attributable to approval queue wait at 95% utilization",
        after: "~57h cycle time after queue relief; 19h total after full automation stack",
        methodology: "M/M/1 queuing: reducing utilization from 0.95 to 0.55 cuts E[Wq] from ~14h to <2h",
      },
      risks: [
        "Team leads may be hesitant to take accountability for approval decisions without clear policy",
        "Fraud risk if delegation thresholds are not paired with audit sampling",
      ],
      mitigations: [
        "Publish a clear Delegation of Authority policy document signed by CFO before go-live",
        "Implement random 10% audit sampling of delegated approvals with monthly reporting",
      ],
    },
    {
      id: "ai-4",
      title: "Activate SLA Auto-Escalation (48h Breach Rule)",
      description:
        "Configure automatic escalation triggers: any invoice sitting in any stage (data entry, matching, approval) for more than 48 hours without action generates an automated alert to the process owner, then to the Finance Director at 72 hours. This eliminates the 'invisible stall' — items that sit in queues without anyone knowing they are overdue.",
      priority: "medium",
      department: "Finance",
      timeline: "Week 4",
      effort: "low",
      expectedImpact:
        "Eliminates tail-end delays: currently the top 20% slowest invoices (>140h) account for 45% of aggregate cycle time. Escalation forces these outliers back into active processing, reducing P95 cycle time by an estimated 35%.",
      metrics: {
        before: "No SLA enforcement; P95 cycle time ~140h; 5 overdue items in Finance",
        after: "P95 cycle time <85h; overdue items reduced to <1 per week on average",
        methodology: "APQC: firms with formal AP SLA enforcement achieve 38% lower P95 cycle time vs. peers",
      },
      risks: [
        "Alert fatigue if thresholds are set too aggressively — team may start ignoring escalation emails",
      ],
      mitigations: [
        "Start with 72h threshold for 4 weeks, then reduce to 48h once team calibrates — avoid alert flooding at launch",
      ],
    },
    {
      id: "ai-5",
      title: "Establish Weekly AP KPI Dashboard & Review Cadence",
      description:
        "Implement a lightweight AP performance dashboard (visible to Finance team and leadership) tracking: (1) cycle time per invoice, (2) error rate, (3) approval queue depth, and (4) SLA breach count. Pair with a 20-minute weekly Finance review meeting to discuss trends and remove blockers. This creates a feedback loop that sustains improvement after initial implementation.",
      priority: "low",
      department: "Finance",
      timeline: "Week 5 (ongoing)",
      effort: "low",
      expectedImpact:
        "Sustains 90%+ of gains by preventing regression. Research shows process improvements without measurement revert to baseline within 6 months at a rate of 40% (Bersin by Deloitte, 2023).",
      metrics: {
        before: "No formal AP KPI tracking; performance measured only during audits",
        after: "Real-time dashboard; weekly 20-min review; targets: <45h cycle, <3% error, <3 overdue",
        methodology: "Kaizen principle: visible metrics drive continuous improvement (Womack & Jones, Lean Thinking)",
      },
      risks: [
        "Dashboard data quality depends on upstream OCR and matching systems being properly instrumented",
      ],
      mitigations: [
        "Instrument logging at each workflow stage during OCR/matching deployment (weeks 1–4) so dashboard has data from day 1",
      ],
    },
  ],

  phases: [
    {
      phase: "Phase 1: Foundation",
      duration: "Weeks 1–4",
      focus:
        "Deploy OCR extraction and begin 3-way matching pilot on top-10 suppliers. Establish delegation policy and baseline KPI measurement. No workflow disruption — changes run in parallel with existing process.",
      actions: [
        "Audit and clean ERP PO master data",
        "Select and configure OCR/e-invoicing vendor",
        "Publish Delegation of Authority policy (Finance Director sign-off)",
        "Measure 4-week baseline: cycle time, error rate, queue depth",
      ],
    },
    {
      phase: "Phase 2: Activation",
      duration: "Weeks 5–8",
      focus:
        "Activate 3-way matching auto-approval for standard invoices. Enable team-lead delegation. Go live with SLA escalation. Launch AP KPI dashboard. Finance team trained and comfortable with new processes.",
      actions: [
        "3-way matching live for all 29 weekly invoices",
        "Team-lead delegation active for invoices <$10,000",
        "48h SLA escalation engine live",
        "AP dashboard published to Finance + leadership",
        "Weekly 20-min AP review cadence starts",
      ],
    },
    {
      phase: "Phase 3: Optimize & Scale",
      duration: "Weeks 9–12+",
      focus:
        "Tune OCR thresholds and matching tolerances based on 4 weeks of real data. Extend delegation authority to broader invoice classes. Re-run simulation to compare actuals vs. projected 40% cycle-time reduction.",
      actions: [
        "Adjust OCR confidence threshold based on fallback rate data",
        "Extend 3-way matching to remaining suppliers",
        "Re-run LiquiFlow simulation with actual KPIs",
        "Plan next constraint elevation (Expense Reimbursement: 52h, 12% error)",
      ],
    },
  ],

  keyRisks: [
    "ERP master data quality is the single biggest dependency — if PO records are incomplete, 3-way matching will generate excessive false-positive exceptions, requiring manual review that negates cycle-time gains",
    "OCR vendor selection and contract negotiation may slip Phase 1 timeline by 1–2 weeks — build a 2-week buffer into the implementation calendar",
    "Change resistance from Finance team: delegation may be perceived as increased accountability without corresponding authority — address this explicitly in the policy document and in team announcements",
  ],

  dataGaps: [
    "Per-stage cycle time breakdown is unavailable — it is unclear whether the 71.2h is dominated by data entry, matching, or approval wait; instrument the workflow to measure each stage in Phase 1",
    "Vendor e-invoicing readiness is unknown — a structured survey of the top-10 suppliers by invoice volume should be completed in Week 1 before finalising the OCR rollout plan",
  ],
};
