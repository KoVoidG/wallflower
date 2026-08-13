"use client";

import { useState } from "react";
import { Send, BrainCircuit, Activity, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppPage } from "@/components/ui/layout";
import { AgentWorkflowCanvas, AgentId, AgentStatus } from "@/features/org-analytics/components";
import { useAppStore } from "@/lib/liquiflow-hooks";
import type { WorkflowPlanResult } from "@/lib/liquiflow-types";

export default function AdvisorPage() {
  const { departments, workflows, isDemoMode } = useAppStore();
  const [goal, setGoal] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  
  const [agentStatuses, setAgentStatuses] = useState<Record<AgentId, AgentStatus | null>>({
    planner: null,
    researcher: null,
    critic: null,
    synthesizer: null,
  });
  
  const [result, setResult] = useState<WorkflowPlanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startPipeline = async (overrideGoal?: string) => {
    const targetGoal = overrideGoal || goal;
    if (!targetGoal.trim()) return;
    
    setIsRunning(true);
    setResult(null);
    setError(null);
    
    setAgentStatuses({
      planner: { agent: "planner", state: "running", message: "Decomposing goal..." },
      researcher: null,
      critic: null,
      synthesizer: null,
    });

    try {
      const response = await fetch("/api/liquiflow/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: targetGoal, departments, workflows, isDemoMode })
      });

      if (!response.ok) {
        throw new Error("Failed to start workflow pipeline");
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        let currentEvent = "";
        for (const line of lines) {
          if (line.startsWith("event: ")) {
            currentEvent = line.replace("event: ", "").trim();
          } else if (line.startsWith("data: ")) {
            const dataStr = line.replace("data: ", "").trim();
            if (dataStr) {
              const data = JSON.parse(dataStr);
              if (currentEvent === "status") {
                setAgentStatuses(prev => ({
                  ...prev,
                  [data.agent]: data
                }));
              } else if (currentEvent === "result") {
                setResult(data);
              } else if (currentEvent === "error") {
                throw new Error(data.message);
              }
            }
          }
        }
      }
    } catch (e: any) {
      setError(e.message);
      // Mark running agent as error
      setAgentStatuses(prev => {
        const next = { ...prev };
        for (const key of Object.keys(next) as AgentId[]) {
          if (next[key]?.state === "running") {
            next[key] = { ...next[key]!, state: "done", message: "Failed due to error" }; // No error state in agent schema, map to done for now or handle appropriately
          }
        }
        return next;
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      startPipeline();
    }
  };

  return (
    <AppPage>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-border/80">
          <div className="space-y-1">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              AI Operations Advisor
            </h1>
            <p className="font-sans text-xs sm:text-sm text-text-muted">
              Multi-agent operations research pipeline. Define a goal and let the agents decompose, analyze, and synthesize an action plan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-4 space-y-6">
            <Card className="p-5 shadow-2xs border-brand/30 bg-surface">
              <h2 className="text-sm font-semibold text-text-primary mb-3">What's your operational goal?</h2>
              <div className="relative">
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. Cut Accounts Payable processing time by 40% without increasing headcount."
                  className="w-full bg-surface-subtle border border-border/80 rounded-xl p-3 pr-12 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand/60 resize-none h-28"
                  disabled={isRunning}
                />
                <Button
                  size="icon"
                  className="absolute bottom-3 right-3 h-8 w-8 bg-brand hover:bg-brand-hover text-white rounded-lg cursor-pointer"
                  disabled={!goal.trim() || isRunning}
                  onClick={() => startPipeline()}
                >
                  <Send className="size-4" />
                </Button>
              </div>

              <div className="mt-4 pt-4 border-t border-border/60">
                <p className="text-xs text-text-muted mb-2">Or try an example:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant="neutral" 
                    className="cursor-pointer hover:bg-brand-soft/20 text-xs font-normal transition-colors"
                    onClick={() => {
                      setGoal("Reduce customer onboarding cycle time by 30%.");
                      startPipeline("Reduce customer onboarding cycle time by 30%.");
                    }}
                  >
                    Reduce onboarding time
                  </Badge>
                  <Badge 
                    variant="neutral" 
                    className="cursor-pointer hover:bg-brand-soft/20 text-xs font-normal transition-colors"
                    onClick={() => {
                      setGoal("Identify and eliminate the primary constraint in the Supply Chain department.");
                      startPipeline("Identify and eliminate the primary constraint in the Supply Chain department.");
                    }}
                  >
                    Find supply chain constraint
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="p-0 shadow-2xs border-brand/30 bg-surface overflow-hidden" style={{ minHeight: 200 }}>
              <div className="p-3 border-b border-border/60 flex items-center gap-2 bg-surface-subtle/50">
                <BrainCircuit className="size-4 text-brand" />
                <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">Agent Pipeline</h3>
              </div>
              <AgentWorkflowCanvas agentStatuses={agentStatuses} />
            </Card>
          </div>

          <div className="xl:col-span-8">
            <Card className="h-full p-6 shadow-2xs border-brand/30 bg-surface min-h-[600px] flex flex-col">
              {error && (
                <div className="p-4 rounded-xl border border-danger/20 bg-danger-soft/10 text-sm text-danger mb-4">
                  {error}
                </div>
              )}

              {result ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-start justify-between border-b border-border/60 pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-text-primary mb-1">Synthesized Action Plan</h2>
                      <p className="text-sm text-text-muted">Goal: {result.goal}</p>
                    </div>
                    <Badge variant="brand" className="text-xs">
                      {Math.round(result.confidenceScore * 100)}% Confidence
                    </Badge>
                  </div>

                  <div className="bg-brand-soft/10 p-4 rounded-xl border border-brand/20 text-sm text-text-primary leading-relaxed font-medium">
                    {result.executiveSummary}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg border border-border/60 bg-surface-subtle text-center">
                      <div className="text-[10px] uppercase text-text-muted font-bold tracking-wider mb-1">Cycle Time Drop</div>
                      <div className="text-xl font-bold text-brand">{result.projectedImpact.cycleTimeReductionPct}%</div>
                    </div>
                    <div className="p-3 rounded-lg border border-border/60 bg-surface-subtle text-center">
                      <div className="text-[10px] uppercase text-text-muted font-bold tracking-wider mb-1">Cost Savings</div>
                      <div className="text-xl font-bold text-success">${result.projectedImpact.costSavingsPerWeek.toLocaleString()}/wk</div>
                    </div>
                    <div className="p-3 rounded-lg border border-border/60 bg-surface-subtle text-center">
                      <div className="text-[10px] uppercase text-text-muted font-bold tracking-wider mb-1">Quality Boost</div>
                      <div className="text-xl font-bold text-brand">+{result.projectedImpact.qualityImprovementPct}%</div>
                    </div>
                    <div className="p-3 rounded-lg border border-border/60 bg-surface-subtle text-center">
                      <div className="text-[10px] uppercase text-text-muted font-bold tracking-wider mb-1">ROI Payback</div>
                      <div className="text-xl font-bold text-text-primary">{result.projectedImpact.paybackWeeks} wks</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Action Items</h3>
                    <div className="space-y-3">
                      {result.actionItems.map(action => (
                        <div key={action.id} className="p-4 rounded-xl border border-border/80 bg-surface shadow-2xs hover:border-brand/40 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-text-primary text-sm">{action.title}</h4>
                            <Badge variant={action.priority === 'critical' ? 'critical' : action.priority === 'high' ? 'warning' : 'neutral'} dot>
                              {action.priority.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-xs text-text-muted mb-3">{action.description}</p>
                          <div className="flex flex-wrap gap-3 text-[11px] text-text-muted">
                            <span className="flex items-center gap-1"><Activity className="size-3" /> {action.department}</span>
                            <span className="flex items-center gap-1"><Clock className="size-3" /> {action.timeline}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-text-muted max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-2xl bg-surface-subtle border border-border/60 flex items-center justify-center mb-4">
                    <BrainCircuit className="size-8 text-border" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Awaiting Goal Directive</h3>
                  <p className="text-sm leading-relaxed">
                    Enter an operational goal to wake up the agent pipeline. They will autonomously coordinate to research, critique, and synthesize a comprehensive execution plan.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AppPage>
  );
}
