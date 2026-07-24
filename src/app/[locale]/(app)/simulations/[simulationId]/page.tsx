'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  FlaskConical,
  Play,
  Layers,
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
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/navigation';
import { AppPage, PageHeader } from '@/components/ui/layout';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartCard } from '@/components/charts/chart-card';
import { FinancialValue, QualityBadge } from '@/components/ui/domain-values';
import { SimulationResultsSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { FadeIn, FadeInView } from '@/components/motion';
import {
  getSimulation,
  type DetailedSimulationResult,
} from '@/features/simulations/adapters/simulations.adapter';
import { formatThbAxis, AXIS_STYLES, GRID_STYLES } from '@/components/charts/chart-config';

export default function SimulationResultPage() {
  const params = useParams();
  const simulationId = (params.simulationId as string) || 'sim-001';

  const [data, setData] = useState<DetailedSimulationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSimulation(simulationId);
      setData(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to compute scenario simulation.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getSimulation(simulationId)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to compute scenario simulation.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [simulationId]);

  if (loading) return <SimulationResultsSkeleton />;
  if (error) return <ErrorState onRetry={loadData} title="Simulation Calculation Error" description={error} />;
  if (!data) return <EmptyState icon={<FlaskConical />} title="Simulation Not Found" description="The requested scenario simulation could not be retrieved." />;

  const { name, recommendation, recommendationRationale, answers, scenarios, cashImpactTimeline, sensitivityAnalysis, guardrails, assumptionQualities, confidence } = data;

  const recBadgeVariant = recommendation === 'Appears affordable' ? 'success' as const : recommendation === 'Proceed cautiously' ? 'warning' as const : 'danger' as const;

  return (
    <AppPage>
      <FadeIn>
        <div className="space-y-6">
          {/* Header Controls */}
          <PageHeader
            title={
              <div className="flex items-center gap-2.5">
                <FlaskConical className="size-6 text-brand shrink-0" aria-hidden="true" />
                <span>{name}</span>
              </div>
            }
            description="Decision simulation results, break-even velocity, scenario comparison, and safety guardrails."
            badge={<Badge variant={recBadgeVariant} dot>{recommendation}</Badge>}
            actions={
              <div className="flex items-center gap-2">
                <Link
                  href="/simulations/new"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-surface hover:bg-surface-subtle transition-colors"
                >
                  <Play className="size-3.5 text-brand" />
                  <span>Adjust Assumptions</span>
                </Link>
                <Link
                  href="/simulations/compare"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand text-white hover:bg-brand-hover transition-colors shadow-2xs"
                >
                  <Layers className="size-3.5" />
                  <span>Compare Options</span>
                </Link>
              </div>
            }
          />

          {/* 1. Recommendation Summary Banner */}
          <section className="rounded-xl border border-brand/20 bg-brand-soft/15 p-5 md:p-6 space-y-4" aria-label="Recommendation Summary">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={recBadgeVariant} dot>{recommendation}</Badge>
                  <span className="text-xs text-text-muted">Data Confidence: <strong className="text-text-primary uppercase">{confidence}</strong></span>
                </div>
                <h3 className="text-base font-bold text-text-primary">
                  Affordability & Decision Posture Statement
                </h3>
                <p className="text-xs sm:text-sm text-text-primary leading-relaxed max-w-3xl">
                  {recommendationRationale}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-brand/15 bg-surface text-[11px] text-text-muted">
              <strong>Cautionary Note:</strong> Simulation outputs are deterministic scenario models built from your baseline inputs. They do not constitute guaranteed financial or investment advice.
            </div>
          </section>

          {/* 2. 7 Core Decision Answers Grid */}
          <FadeInView>
            <Card className="p-5 space-y-4">
              <CardTitle>Core Decision Diagnostic Answers</CardTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-lg border border-border bg-surface-subtle/50 space-y-1">
                  <span className="text-text-muted font-semibold block">1. Can we afford this decision?</span>
                  <p className="text-text-primary font-medium">{answers.canAfford}</p>
                </div>

                <div className="p-3 rounded-lg border border-border bg-surface-subtle/50 space-y-1">
                  <span className="text-text-muted font-semibold block">2. What improves?</span>
                  <p className="text-text-primary font-medium">{answers.whatImproves}</p>
                </div>

                <div className="p-3 rounded-lg border border-border bg-surface-subtle/50 space-y-1">
                  <span className="text-text-muted font-semibold block">3. What becomes worse?</span>
                  <p className="text-text-primary font-medium">{answers.whatWorsens}</p>
                </div>

                <div className="p-3 rounded-lg border border-border bg-surface-subtle/50 space-y-1">
                  <span className="text-text-muted font-semibold block">4. When does it break even?</span>
                  <p className="text-text-primary font-medium">{answers.breakEvenPoint}</p>
                </div>

                <div className="p-3 rounded-lg border border-border bg-surface-subtle/50 space-y-1">
                  <span className="text-text-muted font-semibold block">5. Which assumption matters most?</span>
                  <p className="text-text-primary font-medium">{answers.keyAssumption}</p>
                </div>

                <div className="p-3 rounded-lg border border-border bg-surface-subtle/50 space-y-1">
                  <span className="text-text-muted font-semibold block">6. What makes it unsafe?</span>
                  <p className="text-text-primary font-medium">{answers.unsafeConditions}</p>
                </div>
              </div>
            </Card>
          </FadeInView>

          {/* 3. Scenario Comparison Cards & Table */}
          <FadeInView className="space-y-4">
            <CardTitle>Scenario Comparison: Baseline vs Expected vs Optimistic vs Conservative</CardTitle>

            <div className="overflow-x-auto rounded-xl border border-border bg-surface">
              <table className="w-full text-left text-xs text-text-primary">
                <thead className="border-b border-border bg-surface-subtle text-text-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Metric</th>
                    {scenarios.map((s) => (
                      <th key={s.caseType} className="px-4 py-3 font-semibold">
                        <span className={cn(s.caseType === 'expected' && 'text-brand font-bold')}>{s.label}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr>
                    <td className="px-4 py-3 font-medium text-text-muted">Monthly Revenue</td>
                    {scenarios.map((s) => (
                      <td key={s.caseType} className="px-4 py-3 font-bold tabular-nums">
                        <FinancialValue value={s.monthlyRevenue} />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-text-muted">Monthly Operating Profit</td>
                    {scenarios.map((s) => (
                      <td key={s.caseType} className="px-4 py-3 font-bold tabular-nums">
                        <FinancialValue value={s.monthlyProfit} />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-text-muted">Cash Runway</td>
                    {scenarios.map((s) => (
                      <td key={s.caseType} className="px-4 py-3 font-bold tabular-nums">
                        {s.cashRunwayMonths} months
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-text-muted">Lowest Projected Cash</td>
                    {scenarios.map((s) => (
                      <td key={s.caseType} className="px-4 py-3 font-bold tabular-nums">
                        <FinancialValue value={s.lowestCashBalance} />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-text-muted">Break-Even Period</td>
                    {scenarios.map((s) => (
                      <td key={s.caseType} className="px-4 py-3 font-bold tabular-nums">
                        {s.breakEvenPeriodMonths > 0 ? `Month ${s.breakEvenPeriodMonths}` : 'N/A'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </FadeInView>

          {/* 4. Cash Impact Chart & Break-even View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 cols: Cash Impact Chart */}
            <FadeInView className="lg:col-span-8">
              <ChartCard
                title="Cash Balance Impact Trajectory"
                description="Comparing baseline vs expected, optimistic, and conservative scenario trajectories over 5 months."
                legendItems={[
                  { label: 'Expected', color: '#0F766E' },
                  { label: 'Optimistic', color: '#16A34A' },
                  { label: 'Conservative', color: '#DC2626' },
                  { label: 'Baseline', color: '#64748B' },
                ]}
              >
                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={cashImpactTimeline} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray={GRID_STYLES.strokeDasharray} stroke="var(--border)" opacity={GRID_STYLES.strokeOpacity} />
                      <XAxis dataKey="month" {...AXIS_STYLES} stroke="var(--text-muted)" />
                      <YAxis tickFormatter={formatThbAxis} {...AXIS_STYLES} stroke="var(--text-muted)" />
                      <Tooltip formatter={(val) => [typeof val === 'number' ? `฿${val.toLocaleString()}` : String(val ?? '—'), 'Cash Balance']} />
                      <Line type="monotone" dataKey="expectedCash" stroke="#0F766E" strokeWidth={2.5} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="optimisticCash" stroke="#16A34A" strokeWidth={2} strokeDasharray="3 3" />
                      <Line type="monotone" dataKey="conservativeCash" stroke="#DC2626" strokeWidth={2} strokeDasharray="3 3" />
                      <Line type="monotone" dataKey="baselineCash" stroke="#64748B" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </FadeInView>

            {/* Right 4 cols: Break-even View & Sensitivity */}
            <FadeInView className="lg:col-span-4 space-y-6">
              <Card className="p-5 space-y-3 border-brand/20 bg-brand-soft/10">
                <CardTitle>Break-Even Analysis</CardTitle>
                <div className="space-y-1 text-xs">
                  <span className="text-text-muted block">Expected Break-Even Point</span>
                  <span className="text-2xl font-extrabold text-brand block">Month 5</span>
                  <p className="text-text-secondary pt-1">
                    Cumulative gross margin generated exceeds initial investment and onboarding capex in Month 5.
                  </p>
                </div>
              </Card>

              {/* Sensitivity Analysis */}
              <Card className="p-5 space-y-3">
                <CardTitle>Sensitivity Analysis</CardTitle>
                <CardDescription>Assumptions with largest impact on runway.</CardDescription>
                <div className="space-y-2.5 text-xs">
                  {sensitivityAnalysis.map((item) => (
                    <div key={item.assumptionName} className="p-2.5 rounded-lg border border-border space-y-1">
                      <div className="flex items-center justify-between font-semibold">
                        <span>{item.assumptionName}</span>
                        <span className="text-danger font-bold">{item.runwayImpactMonths} mo</span>
                      </div>
                      <span className="text-text-muted text-[11px] block">Varied: {item.variedValue} · Impact: <FinancialValue value={item.profitImpactTHB} /></span>
                    </div>
                  ))}
                </div>
              </Card>
            </FadeInView>
          </div>

          {/* 5. Decision Guardrails */}
          <FadeInView>
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle>Decision Safety Guardrails</CardTitle>
                <Badge variant="warning">3 Safety Rules</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {guardrails.map((g) => (
                  <div key={g.parameter} className={cn('p-4 rounded-xl border space-y-2', g.isBreached ? 'border-danger/30 bg-danger-soft/10' : 'border-border bg-surface')}>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-text-primary block truncate">{g.parameter}</span>
                      <Badge variant={g.isBreached ? 'critical' : 'success'} className="text-[10px]">
                        {g.isBreached ? 'BREACHED' : 'SAFE'}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-text-muted space-y-0.5">
                      <div>Limit: <strong className="text-text-primary">{g.safeLimit}</strong></div>
                      <div>Projected: <strong className="text-text-primary">{g.currentProjected}</strong></div>
                    </div>
                    <p className="text-[11px] text-text-secondary pt-1 border-t border-border/40">
                      {g.warningNote}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </FadeInView>

          {/* 6. Assumption Quality Table */}
          <FadeInView>
            <Card className="p-5 space-y-3">
              <CardTitle>Assumption Quality & Source Provenance</CardTitle>
              <div className="overflow-x-auto rounded-lg border border-border bg-surface">
                <table className="w-full text-left text-xs text-text-primary">
                  <thead className="border-b border-border bg-surface-subtle text-text-muted">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Assumption Field</th>
                      <th className="px-3 py-2 font-semibold">Value Used</th>
                      <th className="px-3 py-2 font-semibold">Quality Badge</th>
                      <th className="px-3 py-2 font-semibold">Source Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {assumptionQualities.map((aq) => (
                      <tr key={aq.fieldLabel}>
                        <td className="px-3 py-2 font-medium">{aq.fieldLabel}</td>
                        <td className="px-3 py-2 font-bold tabular-nums">{aq.value}</td>
                        <td className="px-3 py-2"><QualityBadge quality={aq.quality} /></td>
                        <td className="px-3 py-2 text-text-muted">{aq.sourceNote}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </FadeInView>

          {/* 7. Action Bar */}
          <FadeInView>
            <Card className="p-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold text-text-primary">Scenario Decision Actions:</span>
              <div className="flex flex-wrap items-center gap-2">
                <Link href="/simulations/compare" className="px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-text-primary transition-colors">
                  Compare Another Option
                </Link>
                <Link href="/actions" className="px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-text-primary transition-colors">
                  Create Action Plan
                </Link>
                <Link href="/reports" className="px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-text-primary transition-colors">
                  Generate Decision Report
                </Link>
                <Link href="/advisor" className="px-3 py-1.5 rounded-lg bg-brand text-white hover:bg-brand-hover text-xs font-semibold transition-colors shadow-2xs">
                  Ask Advisor
                </Link>
              </div>
            </Card>
          </FadeInView>
        </div>
      </FadeIn>
    </AppPage>
  );
}
