// src/features/simulations/components/bottleneck-analysis-view.tsx
'use client';

import { useState } from 'react';
import {
  Sparkles,
  Settings2,
  AlertTriangle,
  Clock,
  Lightbulb,
  CheckCircle2,
  Workflow,
  TrendingDown,
  ArrowRight,
} from 'lucide-react';
import { useRouter } from '@/lib/i18n/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FinancialValue } from '@/components/ui/domain-values';
import { EmptyState } from '@/components/ui/empty-state';
import { FadeInView } from '@/components/motion';
import { useAppStore } from '@/lib/liquiflow-hooks';
import type { BottleneckResult } from '@/lib/liquiflow-types';
import {
  OrgDataSetupSheet,
  HealthScoreRing,
  BottleneckCharts,
  Bottleneck3D,
} from '@/features/org-analytics/components';

import { saveSimulationRun } from '../engine/simulation-history-store';

interface BottleneckAnalysisViewProps {
  initialResult?: BottleneckResult | null;
  onSimulateIntervention?: (bottleneck: BottleneckResult['bottlenecks'][number]) => void;
}

export function BottleneckAnalysisView({
  initialResult = null,
  onSimulateIntervention,
}: BottleneckAnalysisViewProps) {
  const router = useRouter();
  const { departments, workflows, isDemoMode } = useAppStore();
  const [showSetup, setShowSetup] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<BottleneckResult | null>(initialResult);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async () => {
    setIsScanning(true);
    setError(null);
    try {
      const res = await fetch('/api/liquiflow/bottleneck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departments, workflows, isDemoMode }),
      });
      if (!res.ok) throw new Error('Failed to run bottleneck simulation.');
      const data: BottleneckResult = await res.json();
      setResult(data);

      // Auto-save bottleneck run to library history
      saveSimulationRun({
        id: `bottleneck-${Date.now()}`,
        type: 'bottleneck',
        name: 'Org Bottleneck & Constraints Scan',
        strategyTag: 'Operations Research',
        goal: 'Identify department throughput constraints',
        status: 'Simulated',
        healthScore: data.overallHealthScore,
        confidence: 94,
        riskLevel: data.overallHealthScore < 70 ? 'High' : data.overallHealthScore < 85 ? 'Medium' : 'Low',
        bottleneckResult: data,
      });
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : 'Failed to run bottleneck simulation.',
      );
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6 pb-4">
      <OrgDataSetupSheet open={showSetup} onClose={() => setShowSetup(false)} />

      {error && (
        <div className="p-4 rounded-xl border border-danger/30 bg-danger-soft/10 text-xs text-danger flex items-center gap-2.5">
          <AlertTriangle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 3D Interactive Topology Section */}
      <FadeInView offset={8}>
        <Card className="p-1 overflow-hidden shadow-2xs border-border/80 bg-surface">
          <div className="p-3 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Workflow className="size-4 text-brand" />
                <span className="text-xs font-bold text-text-primary">
                  3D Organizational Workflow Topology
                </span>
              </div>
              <span className="hidden md:inline text-[11px] text-text-muted font-medium border-l border-border/60 pl-3">
                {departments.length} Departments • {workflows.length} Connected Workflows
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSetup(true)}
                className="gap-2 text-xs font-semibold cursor-pointer h-8 px-3"
              >
                <Settings2 className="size-3.5" />
                Configure Org Data
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={runAnalysis}
                disabled={isScanning}
                className="gap-2 text-xs font-bold cursor-pointer h-8 px-3"
              >
                {isScanning ? (
                  <>
                    <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Simulating...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-3.5" />
                    Run Analysis {isDemoMode ? '(Demo)' : ''}
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden bg-surface-subtle/30">
            <Bottleneck3D
              departments={departments}
              workflows={workflows}
              result={result}
              isScanning={isScanning}
            />
          </div>
        </Card>
      </FadeInView>

      {/* Results View */}
      {result && !isScanning && (
        <div className="space-y-6">
          {/* 1. Executive Health Overview */}
          <FadeInView offset={20}>
            <Card className="p-5 shadow-2xs border-border/80 bg-surface">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="shrink-0">
                  <HealthScoreRing
                    score={result.overallHealthScore}
                    isScanning={isScanning}
                  />
                </div>
                <div className="flex-1 space-y-4 w-full">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                      Executive Summary
                    </h3>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed bg-surface-subtle p-3.5 rounded-xl border border-border/60">
                      {result.summary}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2 flex items-center gap-1.5">
                      <Lightbulb className="size-3.5 text-amber-500" />
                      Quick Win Recommendations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {result.quickWins.map((win, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-xs text-text-secondary p-2.5 rounded-lg bg-surface-subtle/50 border border-border/40"
                        >
                          <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-snug">{win}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </FadeInView>

          {/* 2. Throughput & Capacity Charts */}
          <FadeInView offset={20}>
            <BottleneckCharts
              departments={departments}
              workflows={workflows}
              result={result}
            />
          </FadeInView>

          {/* 3. Constraint Details Cards */}
          <FadeInView offset={20}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-text-primary">
                  Identified Bottlenecks & Constraints
                </h3>
                <span className="text-xs text-text-muted font-medium">
                  {result.bottlenecks.length} Critical Points Detected
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.bottlenecks.map((b) => {
                  const isCritical = b.severity === 'critical';
                  const isHigh = b.severity === 'high';

                  return (
                    <Card
                      key={b.id}
                      className="p-4 bg-surface border-border/80 shadow-2xs flex flex-col justify-between h-full hover:border-brand/40 transition-colors group"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2.5">
                          <Badge
                            variant={
                              isCritical
                                ? 'critical'
                                : isHigh
                                  ? 'warning'
                                  : 'neutral'
                            }
                            dot
                            className="text-[10px] uppercase font-bold"
                          >
                            {b.severity.toUpperCase()}
                          </Badge>
                          <span className="text-[10px] uppercase text-text-muted font-semibold tracking-wider">
                            {b.type.replace('_', ' ')}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-text-primary mb-1.5">
                          {b.location}
                        </h4>

                        <p className="text-xs text-text-secondary leading-relaxed mb-4">
                          <strong className="text-text-primary font-semibold">
                            Impact:{' '}
                          </strong>
                          {b.impact}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-border/60 space-y-3">
                        <div className="bg-surface-subtle p-2.5 rounded-lg border border-border/40">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand block mb-0.5">
                            Optimization
                          </span>
                          <p className="text-xs text-text-secondary leading-snug">
                            {b.recommendation}
                          </p>
                        </div>

                        <div className="flex justify-between items-center text-xs font-semibold pt-1">
                          <div className="flex items-center gap-1 text-text-muted">
                            <Clock className="size-3.5 text-text-muted" />
                            <span>
                              {b.estimatedHoursLostPerWeek}h lost / wk
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-danger font-bold">
                            <TrendingDown className="size-3.5" />
                            <FinancialValue
                              value={b.costPerWeek}
                              compact
                              className="text-danger"
                            />
                            <span>/wk</span>
                          </div>
                        </div>

                        {/* Cross-Tab Action: Simulate in What-If */}
                        <div className="pt-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              if (onSimulateIntervention) {
                                onSimulateIntervention(b);
                              } else {
                                router.push('/simulations?tab=workspace');
                              }
                            }}
                            className="w-full gap-1.5 text-xs font-bold h-8 rounded-lg cursor-pointer bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:opacity-95 shadow-2xs transition-all"
                          >
                            <span>Simulate in What-If</span>
                            <ArrowRight className="size-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </FadeInView>
        </div>
      )}

      {/* Initial Empty State */}
      {!result && !isScanning && !error && (
        <FadeInView offset={12}>
          <Card className="p-8 text-center bg-surface/50 border-dashed border-border/80">
            <EmptyState
              icon={<Workflow className="size-8 text-brand" />}
              title="No Bottleneck Simulation Run Yet"
              description="Execute a simulation to apply Operations Research modeling to your organizational workflows and pinpoint throughput bottlenecks."
            />
          </Card>
        </FadeInView>
      )}
    </div>
  );
}
