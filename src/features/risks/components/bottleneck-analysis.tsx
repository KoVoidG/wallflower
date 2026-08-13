"use client";

import { useState } from "react";
import { Sparkles, Settings2, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/liquiflow-hooks";
import type { BottleneckResult } from "@/lib/liquiflow-types";
import { OrgDataSetupSheet, HealthScoreRing, BottleneckCharts, Bottleneck3D } from "@/features/org-analytics/components";

export function BottleneckAnalysisSection() {
  const { departments, workflows, isDemoMode } = useAppStore();
  const [showSetup, setShowSetup] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<BottleneckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async () => {
    setIsScanning(true);
    setError(null);
    try {
      const res = await fetch("/api/liquiflow/bottleneck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ departments, workflows, isDemoMode })
      });
      if (!res.ok) throw new Error("Failed to run analysis");
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-brand" />
          <h2 className="text-lg font-bold text-text-primary">AI Workflow Bottleneck Analysis</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowSetup(true)} className="gap-2 text-xs">
            <Settings2 className="size-3.5" />
            Configure Org Data
          </Button>
          <Button variant="primary" size="sm" onClick={runAnalysis} disabled={isScanning} className="gap-2 text-xs">
            {isScanning ? (
              <>
                <span className="size-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Sparkles className="size-3.5" />
                Run Analysis {isDemoMode ? "(Demo)" : ""}
              </>
            )}
          </Button>
        </div>
      </div>

      <OrgDataSetupSheet open={showSetup} onClose={() => setShowSetup(false)} />

      {error && (
        <div className="p-4 rounded-xl border border-danger/20 bg-danger-soft/10 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="mt-6 mb-6">
        <Bottleneck3D 
          departments={departments} 
          workflows={workflows} 
          result={result} 
          isScanning={isScanning} 
        />
      </div>

      {result && !isScanning && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="p-6 shadow-2xs border-border/80 bg-surface">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-shrink-0">
                <HealthScoreRing score={result.overallHealthScore} isScanning={isScanning} />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-2">Executive Summary</h3>
                  <p className="text-xs text-text-secondary leading-relaxed bg-surface-subtle p-3 rounded-lg border border-border/60">
                    {result.summary}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-2">Quick Wins</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {result.quickWins.map((win, i) => (
                      <li key={i} className="flex items-start gap-2 text-text-secondary">
                        <span className="text-brand font-bold mt-0.5">•</span>
                        <span>{win}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          <BottleneckCharts departments={departments} workflows={workflows} result={result} />

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Identified Constraints</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.bottlenecks.map(b => (
                <Card key={b.id} className="p-4 bg-surface border-border/80 shadow-2xs flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant={b.severity === 'critical' ? 'critical' : b.severity === 'high' ? 'warning' : 'neutral'} dot>
                      {b.severity.toUpperCase()}
                    </Badge>
                    <span className="text-[10px] uppercase text-text-muted font-semibold">{b.type.replace('_', ' ')}</span>
                  </div>
                  <h4 className="text-sm font-bold text-text-primary mb-2">{b.location}</h4>
                  <div className="text-[11px] text-text-muted space-y-2 mb-4 flex-1">
                    <p><strong className="text-text-secondary">Impact:</strong> {b.impact}</p>
                  </div>
                  <div className="mt-auto pt-3 border-t border-border/40">
                    <p className="text-[11px] text-text-secondary mb-3"><strong className="text-brand">Recommendation:</strong> {b.recommendation}</p>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-danger">{b.estimatedHoursLostPerWeek}h lost/wk</span>
                      <span className="text-danger">${b.costPerWeek.toLocaleString()}/wk impact</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {!result && !isScanning && !error && (
        <Card className="p-8 text-center bg-surface/50 border-dashed border-border/80">
          <ShieldAlert className="size-8 text-text-muted mx-auto mb-3" />
          <h3 className="text-sm font-medium text-text-secondary mb-1">No Analysis Run Yet</h3>
          <p className="text-xs text-text-muted max-w-md mx-auto">
            Click "Run Analysis" to let AI apply Operations Research methodology to your organizational structure and identify operational bottlenecks.
          </p>
        </Card>
      )}
    </div>
  );
}
