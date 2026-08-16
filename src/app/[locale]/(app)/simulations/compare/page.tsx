'use client';

import { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Play,
  Scale,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Link } from '@/lib/i18n/navigation';
import { AppPage } from '@/components/ui/layout';
import { Card, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartCard } from '@/components/charts/chart-card';
import { FinancialValue, FreshnessIndicator } from '@/components/ui/domain-values';
import { SimulationResultsSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { FadeIn, FadeInView, ChartInView } from '@/components/motion';
import {
  getSimulation,
  type DetailedSimulationResult,
} from '@/features/simulations/adapters/simulations.adapter';
import { formatThbAxis, AXIS_STYLES, GRID_STYLES } from '@/components/charts/chart-config';

export default function CompareSimulationsPage() {
  const [sim1, setSim1] = useState<DetailedSimulationResult | null>(null);
  const [sim2, setSim2] = useState<DetailedSimulationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [res1, res2] = await Promise.all([
        getSimulation('sim-hire-01'),
        getSimulation('sim-equip-02'),
      ]);
      setSim1(res1);
      setSim2(res2);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load scenario comparisons.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    Promise.all([getSimulation('sim-hire-01'), getSimulation('sim-equip-02')])
      .then(([res1, res2]) => {
        if (isMounted) {
          setSim1(res1);
          setSim2(res2);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load scenario comparisons.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <SimulationResultsSkeleton />;
  if (error) return <ErrorState onRetry={loadData} title="Comparison Error" description={error} />;
  if (!sim1 || !sim2) return <EmptyState icon={<Layers />} title="No Simulations Selected" description="Select at least two scenario simulations to compare." />;

  // Chart data overlaying option trajectories
  const chartData = [
    { month: 'Jan 2025', baseline: 345000, optionA: 345000, optionB: 345000 },
    { month: 'Feb 2025', baseline: 332600, optionA: 337200, optionB: 350000 },
    { month: 'Mar 2025', baseline: 319600, optionA: 329400, optionB: 355000 },
    { month: 'Apr 2025', baseline: 314600, optionA: 321600, optionB: 362000 },
    { month: 'May 2025', baseline: 302600, optionA: 313800, optionB: 370000 },
  ];

  return (
    <AppPage>
      <FadeIn>
        <div className="space-y-6">
          {/* Header Controls (No generic Refresh button) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <Layers className="size-6 text-brand shrink-0" aria-hidden="true" />
                <h1 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight">
                  Scenario Comparison Workspace
                </h1>
                <Badge variant="healthy" dot>2 Options Selected</Badge>
              </div>
              <p className="text-xs text-text-secondary">
                Side-by-side comparison of decision scenarios, financial trade-offs, break-even velocity, and risk impacts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <FreshnessIndicator lastUpdated="2025-01-20" staleDays={5} />
              <Button asChild variant="primary" size="md" className="text-xs">
                <Link href="/simulations/new">
                  <Plus className="size-3.5" />
                  <span>Simulate New Option</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* 1. Side-by-Side Scenario Identity Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Option A */}
            <Card className="p-5 border-brand/40 bg-surface space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <Badge variant="brand">OPTION A</Badge>
                <Badge variant="warning">{sim1.recommendation}</Badge>
              </div>
              <h3 className="text-base font-bold text-text-primary">{sim1.name}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{sim1.recommendationRationale}</p>
              <div className="flex items-center justify-between text-[11px] text-text-muted pt-2 border-t border-border/40">
                <span>Type: <strong className="text-text-primary capitalize">{sim1.scenarioType.replace('_', ' ')}</strong></span>
                <span className="font-semibold text-brand">12-Month Horizon</span>
              </div>
            </Card>

            {/* Option B */}
            <Card className="p-5 border-success/40 bg-surface space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <Badge variant="success">OPTION B (RECOMMENDED)</Badge>
                <Badge variant="success">{sim2.recommendation}</Badge>
              </div>
              <h3 className="text-base font-bold text-text-primary">{sim2.name}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{sim2.recommendationRationale}</p>
              <div className="flex items-center justify-between text-[11px] text-text-muted pt-2 border-t border-border/40">
                <span>Type: <strong className="text-text-primary capitalize">{sim2.scenarioType.replace('_', ' ')}</strong></span>
                <span className="font-semibold text-success">24-Month Horizon</span>
              </div>
            </Card>
          </div>

          {/* 2. Side-by-Side Metric Comparison Table */}
          <FadeInView>
            <Card className="p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <CardTitle>Side-by-Side Metric & Risk Comparison Matrix</CardTitle>
                <span className="text-xs text-text-muted">Comparing vs Baseline</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border bg-surface">
                <table className="w-full text-left text-xs text-text-primary">
                  <thead className="border-b border-border bg-surface-subtle text-text-muted text-[11px]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Comparison Metric</th>
                      <th className="px-4 py-3 font-semibold text-brand">Option A: {sim1.name}</th>
                      <th className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">Option B: {sim2.name}</th>
                      <th className="px-4 py-3 font-semibold">Strategic Advantage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr>
                      <td className="px-4 py-3 font-medium text-text-muted">Decision Type</td>
                      <td className="px-4 py-3 font-bold capitalize">{sim1.scenarioType.replace('_', ' ')}</td>
                      <td className="px-4 py-3 font-bold capitalize">{sim2.scenarioType.replace('_', ' ')}</td>
                      <td className="px-4 py-3 text-text-muted">Different strategic focus</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-text-muted">Expected Monthly Revenue</td>
                      <td className="px-4 py-3 font-bold tabular-nums"><FinancialValue value={sim1.scenarios[1].monthlyRevenue} /></td>
                      <td className="px-4 py-3 font-bold tabular-nums"><FinancialValue value={sim2.scenarios[1].monthlyRevenue} /></td>
                      <td className="px-4 py-3 text-emerald-600 font-semibold">Option B (+฿10,000/mo)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-text-muted">Expected Monthly Profit</td>
                      <td className="px-4 py-3 font-bold tabular-nums"><FinancialValue value={sim1.scenarios[1].monthlyProfit} /></td>
                      <td className="px-4 py-3 font-bold tabular-nums"><FinancialValue value={sim2.scenarios[1].monthlyProfit} /></td>
                      <td className="px-4 py-3 text-emerald-600 font-semibold">Option B (+฿15,000/mo)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-text-muted">Projected Cash Runway</td>
                      <td className="px-4 py-3 font-bold tabular-nums">{sim1.scenarios[1].cashRunwayMonths} months</td>
                      <td className="px-4 py-3 font-bold tabular-nums">{sim2.scenarios[1].cashRunwayMonths} months</td>
                      <td className="px-4 py-3 text-emerald-600 font-semibold">Option B (+2.2 months)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-text-muted">Break-Even Velocity</td>
                      <td className="px-4 py-3 font-bold tabular-nums">Month {sim1.scenarios[1].breakEvenPeriodMonths}</td>
                      <td className="px-4 py-3 font-bold tabular-nums">Month {sim2.scenarios[1].breakEvenPeriodMonths}</td>
                      <td className="px-4 py-3 text-brand font-semibold">Option B (2 months faster)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-text-muted">Breached Guardrails</td>
                      <td className="px-4 py-3 font-bold text-danger">1 Guardrail Breached</td>
                      <td className="px-4 py-3 font-bold text-emerald-600">0 Guardrails Breached</td>
                      <td className="px-4 py-3 text-emerald-600 font-semibold">Option B (Safer posture)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-text-muted">Rule Confidence</td>
                      <td className="px-4 py-3 font-bold uppercase">{sim1.confidence}</td>
                      <td className="px-4 py-3 font-bold uppercase">{sim2.confidence}</td>
                      <td className="px-4 py-3 text-text-muted">Equivalent baseline inputs</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </FadeInView>

          {/* 3. Trajectory Overlay Chart */}
          <ChartInView>
            {(shouldRenderChart) => (
              <ChartCard
                title="Trajectory Trajectory Overlay: Option A vs Option B vs Baseline"
                description="Visualizing projected cash balance curves over 5 months for both options against baseline."
                legendItems={[
                  { label: 'Option A (Hire Staff)', color: '#0F766E' },
                  { label: 'Option B (Equipment Loan)', color: '#16A34A' },
                  { label: 'Baseline', color: '#64748B' },
                ]}
              >
                <div className="h-64 w-full pt-2">
                  {shouldRenderChart && (
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray={GRID_STYLES.strokeDasharray} stroke="var(--border)" opacity={GRID_STYLES.strokeOpacity} />
                        <XAxis dataKey="month" {...AXIS_STYLES} stroke="var(--text-muted)" />
                        <YAxis tickFormatter={formatThbAxis} {...AXIS_STYLES} stroke="var(--text-muted)" />
                        <Tooltip
                          cursor={{ fill: 'var(--surface-subtle)', fillOpacity: 0.35 }}
                          formatter={(val) => [typeof val === 'number' ? `฿${val.toLocaleString()}` : String(val ?? '—'), 'Cash Balance']}
                          contentStyle={{
                            backgroundColor: 'var(--surface)',
                            borderColor: 'var(--border)',
                            borderRadius: '10px',
                            fontSize: '12px',
                            color: 'var(--text-primary)',
                          }}
                        />
                        <Line type="monotone" dataKey="optionA" stroke="#0F766E" strokeWidth={2.5} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="optionB" stroke="#16A34A" strokeWidth={2.5} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="baseline" stroke="#64748B" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </ChartCard>
            )}
          </ChartInView>

          {/* 4. Detailed Strategic Trade-off Analysis */}
          <FadeInView>
            <Card className="p-5 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 border-b border-border/60 pb-2">
                <Scale className="size-4 text-brand" />
                <CardTitle>Detailed Financial Trade-off Analysis</CardTitle>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-brand/20 bg-brand-soft/10 space-y-2">
                  <span className="font-bold text-brand block uppercase text-[11px]">Option A Characteristics</span>
                  <ul className="space-y-1.5 text-text-primary">
                    <li className="flex items-start gap-2">
                      <span className="text-brand font-bold">•</span>
                      <span>Increases customer service throughput and long-term revenue ceiling.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-danger font-bold">•</span>
                      <span>Requires immediate fixed monthly payroll outlay (฿28,750/mo), reducing runway buffer to 1.5 months.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-success/20 bg-success-soft/10 space-y-2">
                  <span className="font-bold text-success block uppercase text-[11px]">Option B Characteristics</span>
                  <ul className="space-y-1.5 text-text-primary">
                    <li className="flex items-start gap-2">
                      <span className="text-success font-bold">•</span>
                      <span>Spreads capex outlays across 24 monthly bank loan installments (฿13,400/mo).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success font-bold">•</span>
                      <span>Preserves usable cash buffer above ฿200,000 threshold with 0 breached guardrails.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </FadeInView>

          {/* 5. Final Action Selection */}
          <FadeInView>
            <div className="p-4 rounded-xl border border-border/80 bg-surface shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-text-primary block">Recommended Choice: Option B (Equipment Loan)</span>
                <span className="text-[11px] text-text-muted block">Option B preserves liquidity while achieving break-even 2 months faster.</span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Button asChild variant="secondary" size="md" className="text-xs">
                  <Link href="/simulations/new">
                    <Play className="size-3.5" />
                    <span>Adjust Assumptions</span>
                  </Link>
                </Button>

                <Button asChild variant="primary" size="md" className="text-xs">
                  <Link href="/advisor">
                    <CheckCircle2 className="size-3.5" />
                    <span>Select Option B & Open Strategic Advisor</span>
                  </Link>
                </Button>
              </div>
            </div>
          </FadeInView>

          {/* Disclaimer Footer */}
          <div className="flex items-start gap-2.5 p-4 rounded-xl bg-surface-subtle border border-border/60 text-xs text-text-muted">
            <AlertTriangle className="size-4 mt-0.5 shrink-0 text-warning" aria-hidden="true" />
            <p className="leading-relaxed">
              Comparison results evaluate deterministic scenario outputs across shared baseline metrics. They highlight relative trade-offs and do not guarantee funding or operational execution.
            </p>
          </div>
        </div>
      </FadeIn>
    </AppPage>
  );
}
