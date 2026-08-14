import { NextRequest } from "next/server";
import { runPlanner, runResearcher, runCritic, runWorkflowSynthesizer } from "@/lib/liquiflow-ai";
import type { Department, WorkflowStep } from "@/lib/liquiflow-types";
import { DEMO_WORKFLOW_RESULT, DEMO_ONBOARDING_RESULT, DEMO_SUPPLY_CHAIN_RESULT } from "@/lib/liquiflow-demo-data";

export const maxDuration = 120;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: NextRequest) {
  const { goal, departments, workflows, isDemoMode } = await req.json() as {
    goal: string;
    departments: Department[];
    workflows: WorkflowStep[];
    isDemoMode?: boolean;
  };

  if (!goal) {
    return new Response("No goal provided", { status: 400 });
  }

  const encoder = new TextEncoder();

  // ─── Demo mode: replay pre-built result with simulated agent delays ───────────
  if (isDemoMode) {
    const stream = new ReadableStream({
      async start(controller) {
        function sendEvent(type: string, data: unknown) {
          controller.enqueue(
            encoder.encode(`event: ${type}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        }

        try {
          let selectedResult = DEMO_WORKFLOW_RESULT;
          let plannerContent = "";
          let researcherContent = "";
          let criticContent = "";

          const lowerGoal = goal.toLowerCase();
          if (lowerGoal.includes("onboarding")) {
            selectedResult = DEMO_ONBOARDING_RESULT;
            plannerContent = `GOAL DECOMPOSITION — "${selectedResult.goal}"\n\nSub-tasks identified:\n1. Map end-to-end onboarding touchpoints\n2. Quantify delay in compliance verification steps\n3. Evaluate client portal automation solutions\n4. Estimate cycle-time reduction`;
            researcherContent = `OPERATIONS RESEARCH ANALYSIS\n\nCurrent Onboarding Cycle: 14 days\nCompliance Review Queue: 60% of total cycle time\n\nProjected improvements via Self-Serve Portal:\n- 35% overall cycle time reduction\n- 12-week ROI payback period`;
            criticContent = `CRITICAL REVIEW — Risks & Assumptions Challenged\n\n✗ ASSUMPTION CHALLENGED: "Clients will prefer a portal"\n  → Reality: High-touch clients may expect white-glove email service.\n\n✓ VALIDATED: Compliance queue reduction math holds true.\n\nData gaps flagged:\n• Exact drop-off rates at each manual step`;
          } else if (lowerGoal.includes("supply chain") || lowerGoal.includes("constraint")) {
            selectedResult = DEMO_SUPPLY_CHAIN_RESULT;
            plannerContent = `GOAL DECOMPOSITION — "${selectedResult.goal}"\n\nSub-tasks identified:\n1. Audit current procurement bottlenecks\n2. Evaluate Vendor Managed Inventory (VMI) feasibility for C-parts\n3. Model impact of dynamic approval routing\n4. Calculate throughput gains`;
            researcherContent = `OPERATIONS RESEARCH ANALYSIS\n\nProcurement Queue Analysis:\n- Current throughput limited by static approval rules\n- VMI implementation offloads 40% of PO volume\n\nProjected Impact:\n- 28% cycle time reduction\n- Cost savings: $15,200/wk`;
            criticContent = `CRITICAL REVIEW — Risks & Assumptions Challenged\n\n✗ ASSUMPTION CHALLENGED: "VMI applies to all vendors"\n  → Reality: Only top 20% of vendors have maturity for VMI.\n\n✓ VALIDATED: Dynamic routing accelerates 60% of remaining cycles.\n\nData gaps flagged:\n• Supplier IT readiness survey needed`;
          } else {
            selectedResult = DEMO_WORKFLOW_RESULT;
            plannerContent = `GOAL DECOMPOSITION — "${selectedResult.goal}"\n\nSub-tasks identified:\n1. Quantify current AP workflow constraint (71.2h cycle, 15% error, 29 items/wk)\n2. Identify root-cause error categories (manual keying vs. matching vs. approval delay)\n3. Model intervention options: OCR extraction, 3-way PO matching, delegation authority\n4. Estimate cycle-time impact of each lever using Little's Law\n5. Sequence interventions by ROI and implementation complexity`;
            researcherContent = `OPERATIONS RESEARCH ANALYSIS\n\nLittle's Law (L = λW): λ = 29 invoices/wk, W = 71.2h → L = 86.3 avg invoices in-flight\nTarget: W_target = 42.7h (−40%), so L_target = 51.8\n\nM/M/1 Approval queue: Finance at ~95% utilization\n  E[Wq] ≈ 14h (queue wait contribution at ρ=0.95)\n  After delegation → ρ ≈ 0.55 → E[Wq] ≈ 1.8h\n\nLean Six Sigma DPMO:\n  Current: 150,000 DPMO (2.6σ)\n  With OCR + 3-way match: 20,000 DPMO (3.5σ)\n  Aberdeen top-quartile target: 10,000 DPMO (3.8σ)\n\nProjected savings: $12,400/wk | Payback: week 9`;
            criticContent = `CRITICAL REVIEW — Risks & Assumptions Challenged\n\n✗ ASSUMPTION CHALLENGED: "OCR will work immediately"\n  → Reality: ERP PO master data may be 20–30% incomplete. Run data audit first.\n\n✗ ASSUMPTION CHALLENGED: "Delegation is low-effort"\n  → Reality: Requires CFO sign-off + fraud controls. Underestimated stakeholder friction.\n\n✓ VALIDATED: Little's Law projections — math checks out given stated λ and W values\n✓ VALIDATED: 3-way matching ROI — Aberdeen 2023 confirms median 73% error reduction\n\nData gaps flagged:\n• Per-stage timing breakdown unavailable (entry vs. matching vs. approval)\n• Vendor e-invoicing readiness unknown — survey required`;
          }

          // Step 1: Planner
          sendEvent("status", { agent: "planner", state: "running", message: "Decomposing goal into actionable sub-tasks..." });
          await sleep(900);
          sendEvent("status", { agent: "planner", state: "done", message: "Planning complete — sub-tasks identified.", content: plannerContent });

          // Step 2: Researcher
          await sleep(300);
          sendEvent("status", { agent: "researcher", state: "running", message: "Applying OR methodology: Little's Law, TOC, M/M/1 queuing..." });
          await sleep(1100);
          sendEvent("status", { agent: "researcher", state: "done", message: "Research complete — quantified improvement potential.", content: researcherContent });

          // Step 3: Critic
          await sleep(300);
          sendEvent("status", { agent: "critic", state: "running", message: "Challenging assumptions, flagging risks and data gaps..." });
          await sleep(900);
          sendEvent("status", { agent: "critic", state: "done", message: "Critical review complete — risks and mitigations identified.", content: criticContent });

          // Step 4: Synthesizer
          await sleep(300);
          sendEvent("status", { agent: "synthesizer", state: "running", message: "Synthesizing final action plan from all agent outputs..." });
          await sleep(800);
          sendEvent("status", { agent: "synthesizer", state: "done", message: "Synthesis complete — action plan ready." });

          // Result
          sendEvent("result", { ...selectedResult, goal });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "An error occurred";
          controller.enqueue(encoder.encode(`event: error\\ndata: ${JSON.stringify({ message })}\\n\\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  }

  // ─── Live mode: real multi-agent pipeline ────────────────────────────────────

  const orgContext = `
DEPARTMENTS (${departments.length}):
${departments.map(d =>
  `- ${d.name}: ${d.headcount} headcount, ${d.avgTasksPerWeek} tasks/wk, ${d.avgResponseTimeHours}h avg response, ${d.pendingApprovals} pending, ${d.overdueItems} overdue, ${d.meetingsPerWeek} meetings/wk`
).join("\\n")}

WORKFLOW STEPS (${workflows.length}):
${workflows.map(w =>
  `- ${w.name} (${w.department}): ${w.avgDurationHours}h avg duration, ${Math.round(w.errorRate * 100)}% error rate, ${w.volume} items/wk`
).join("\\n")}
`.trim();

  const stream = new ReadableStream({
    async start(controller) {
      function sendEvent(type: string, data: unknown) {
        controller.enqueue(
          encoder.encode(`event: ${type}\\ndata: ${JSON.stringify(data)}\\n\\n`)
        );
      }

      try {
        // Step 1: Planner
        sendEvent("status", {
          agent: "planner",
          state: "running",
          message: "Decomposing goal into actionable sub-tasks...",
        });
        const plannerOutput = await runPlanner(goal, orgContext);
        sendEvent("status", {
          agent: "planner",
          state: "done",
          message: "Planning complete — sub-tasks identified.",
          content: plannerOutput,
        });

        // Step 2: Researcher
        sendEvent("status", {
          agent: "researcher",
          state: "running",
          message: "Applying OR methodology: Little's Law, TOC, M/M/1 queuing...",
        });
        const researchOutput = await runResearcher(plannerOutput, orgContext);
        sendEvent("status", {
          agent: "researcher",
          state: "done",
          message: "Research complete — quantified improvement potential.",
          content: researchOutput,
        });

        // Step 3: Critic
        sendEvent("status", {
          agent: "critic",
          state: "running",
          message: "Challenging assumptions, flagging risks and data gaps...",
        });
        const criticOutput = await runCritic(plannerOutput, researchOutput, orgContext);
        sendEvent("status", {
          agent: "critic",
          state: "done",
          message: "Critical review complete — risks and mitigations identified.",
          content: criticOutput,
        });

        // Step 4: Synthesizer
        sendEvent("status", {
          agent: "synthesizer",
          state: "running",
          message: "Synthesizing final action plan from all agent outputs...",
        });
        const finalJsonString = await runWorkflowSynthesizer(plannerOutput, researchOutput, criticOutput, goal);
        sendEvent("status", {
          agent: "synthesizer",
          state: "done",
          message: "Synthesis complete — action plan ready.",
        });

        sendEvent("result", JSON.parse(finalJsonString));
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An error occurred";
        sendEvent("error", { message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
