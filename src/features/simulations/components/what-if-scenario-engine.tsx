"use client";

import { useState } from "react";
import { Sparkles, SlidersHorizontal, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/liquiflow-hooks";
import type { SimulationScenario, SimulationResult } from "@/lib/liquiflow-types";
import { SimulationCharts, OrgDataSetupSheet, Simulation3D } from "@/features/org-analytics/components";

const PRESETS: SimulationScenario[] = [
  {
    name: "AI Automation Injection",
    description: "Model the impact of deploying AI agents on high-volume repetitive tasks (30% automation rate).",
    changes: { automation_rate: 0.3, headcount_increase: 0, process_improvement: 0 }
  },
  {
    name: "Aggressive Expansion",
    description: "Increase headcount by 20% across all departments while maintaining current processes.",
    changes: { automation_rate: 0, headcount_increase: 20, process_improvement: 0 }
  },
  {
    name: "Process Optimization (Lean)",
    description: "Apply Lean Six Sigma to reduce cycle times by 15% through continuous improvement.",
    changes: { automation_rate: 0, headcount_increase: 0, process_improvement: 0.15 }
  },
  {
    name: "Downsizing / Consolidation",
    description: "Reduce headcount by 10% and offset with a 10% process automation rate.",
    changes: { automation_rate: 0.1, headcount_increase: -10, process_improvement: 0 }
  }
];

export function WhatIfScenarioEngine() {
  const { departments, workflows, isDemoMode } = useAppStore();
  const [showSetup, setShowSetup] = useState(false);
  const [activePreset, setActivePreset] = useState<SimulationScenario>(PRESETS[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [automationRate, setAutomationRate] = useState(activePreset.changes.automation_rate ?? 0);
  const [headcountChange, setHeadcountChange] = useState(activePreset.changes.headcount_increase ?? 0);
  const [processImprovement, setProcessImprovement] = useState(activePreset.changes.process_improvement ?? 0);

  const selectPreset = (p: SimulationScenario) => {
    setActivePreset(p);
    setAutomationRate(p.changes.automation_rate ?? 0);
    setHeadcountChange(p.changes.headcount_increase ?? 0);
    setProcessImprovement(p.changes.process_improvement ?? 0);
  };

  const runSimulation = async () => {
    setIsSimulating(true);
    setError(null);
    try {
      const scenario: SimulationScenario = {
        name: activePreset.name,
        description: activePreset.description,
        changes: {
          automation_rate: automationRate,
          headcount_increase: headcountChange,
          process_improvement: processImprovement
        }
      };

      const res = await fetch("/api/liquiflow/simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario, departments, workflows, isDemoMode })
      });
      if (!res.ok) throw new Error("Failed to run simulation");
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="mt-12 space-y-6 max-w-[1600px] mx-auto border-t border-border/80 pt-10 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="size-5 text-brand" />
          <h2 className="text-xl font-bold text-text-primary tracking-tight">AI What-If Scenario Engine</h2>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowSetup(true)} className="gap-2 text-xs">
          <SlidersHorizontal className="size-3.5" />
          Configure Org Data
        </Button>
      </div>
      <p className="text-sm text-text-muted">
        Run rigorous operations research simulations using your active organizational layout. Modifies throughput and WIP using Theory of Constraints and Little's Law.
      </p>

      <OrgDataSetupSheet open={showSetup} onClose={() => setShowSetup(false)} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-sm font-semibold text-text-secondary">Presets</h3>
          <div className="grid grid-cols-1 gap-2">
            {PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => selectPreset(p)}
                className={`p-3 text-left rounded-xl border transition-all text-sm ${activePreset.name === p.name ? 'border-brand bg-brand-soft/20' : 'border-border/80 bg-surface-subtle/50 hover:bg-surface-subtle'}`}
              >
                <h4 className={`font-bold mb-1 ${activePreset.name === p.name ? 'text-text-primary' : 'text-text-secondary'}`}>{p.name}</h4>
                <p className="text-[11px] text-text-muted line-clamp-2">{p.description}</p>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-border/80 space-y-4 mt-6">
            <h3 className="text-sm font-semibold text-text-secondary">Custom Parameters</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-muted">Automation Rate</span>
                  <span className="font-bold text-text-primary">{(Number(automationRate) * 100).toFixed(0)}%</span>
                </div>
                <input type="range" min="0" max="1" step="0.05" value={automationRate} onChange={e => setAutomationRate(parseFloat(e.target.value))} className="w-full accent-brand" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-muted">Headcount Change</span>
                  <span className="font-bold text-text-primary">{Number(headcountChange) > 0 ? '+' : ''}{headcountChange}%</span>
                </div>
                <input type="range" min="-50" max="100" step="5" value={headcountChange} onChange={e => setHeadcountChange(parseFloat(e.target.value))} className="w-full accent-brand" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-muted">Process Improvement</span>
                  <span className="font-bold text-text-primary">{(Number(processImprovement) * 100).toFixed(0)}%</span>
                </div>
                <input type="range" min="0" max="0.5" step="0.05" value={processImprovement} onChange={e => setProcessImprovement(parseFloat(e.target.value))} className="w-full accent-brand" />
              </div>
            </div>
          </div>

          <Button variant="primary" onClick={runSimulation} disabled={isSimulating} className="w-full mt-6 gap-2 py-5">
            {isSimulating ? (
              <>
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Simulating...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Run Simulation {isDemoMode ? "(Demo)" : ""}
              </>
            )}
          </Button>

          {error && <div className="p-3 text-xs text-danger bg-danger-soft/10 rounded-lg mt-3">{error}</div>}
        </div>

        <div className="lg:col-span-8">
          <Card className="h-full bg-surface border-border/80 p-6 min-h-[500px] flex flex-col relative shadow-2xl overflow-hidden">
            <div className="mb-6 h-[320px]">
              <Simulation3D result={result} isSimulating={isSimulating} workflows={workflows} />
            </div>

            {result && (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-surface-subtle p-4 rounded-xl border border-border/60 text-sm text-text-secondary leading-relaxed italic">
                  "{result.narrative}"
                </div>

                <SimulationCharts result={result} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-3">Implementation Roadmap</h4>
                    <div className="space-y-3 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/60 before:to-transparent">
                      {result.implementationPlan.map((phase, i) => (
                        <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full border border-border bg-surface text-[10px] font-bold text-text-secondary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            {i+1}
                          </div>
                          <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-3 rounded-lg border border-border/60 bg-surface-subtle shadow">
                            <div className="text-[10px] font-bold text-brand uppercase">{phase.duration}</div>
                            <h5 className="text-xs font-bold text-text-primary mt-1 mb-1">{phase.phase}</h5>
                            <p className="text-[10px] text-text-muted leading-relaxed">{phase.expectedImpact}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2">Key Risks</h4>
                      <ul className="space-y-2">
                        {result.risks.map((risk, i) => (
                          <li key={i} className="flex gap-2 text-xs text-danger/80 items-start">
                            <span className="text-danger mt-0.5 font-bold">!</span> <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2 mt-4">Recommendations</h4>
                      <ul className="space-y-2">
                        {result.recommendations.map((rec, i) => (
                          <li key={i} className="flex gap-2 text-xs text-text-secondary items-start">
                            <span className="text-brand mt-0.5 font-bold">✓</span> <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
