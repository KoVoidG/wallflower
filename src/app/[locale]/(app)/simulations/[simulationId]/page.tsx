'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  FlaskConical,
  SlidersHorizontal,
  Columns,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
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
import { AppPage } from '@/components/ui/layout';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BotAvatar } from '@/components/ui/bot-avatar';
import { ChartCard } from '@/components/charts/chart-card';
import { FinancialValue, QualityBadge } from '@/components/ui/domain-values';
import { SimulationResultsSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { FadeIn, FadeInView, ChartInView, Expand } from '@/components/motion';
import { getSimulation, type DetailedSimulationResult } from '@/features/simulations/adapters/simulations.adapter';
import { formatThbAxis, AXIS_STYLES, GRID_STYLES } from '@/components/charts/chart-config';
import { useAdvisorDrawer } from '@/features/advisor/context/advisor-drawer-context';

export default function SimulationResultPage() {
  const { openDrawer } = useAdvisorDrawer();
  const params = useParams();
  const simulationId = (params.simulationId as string) || 'sim-001';

  const [data, setData] = useState<DetailedSimulationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDiagnosticDetails, setShowDiagnosticDetails] = useState(false);
  const [showAllAssumptions, setShowAllAssumptions] = useState(false);

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

  const { name, scenarioType, recommendation, recommendationRationale, answers, scenarios, cashImpactTimeline, sensitivityAnalysis, guardrails, assumptionQualities } = data;

  const recBadgeVariant = recommendation === 'Appears affordable' ? 'success' as const : recommendation === 'Proceed cautiously' ? 'warning' as const : 'danger' as const;

  const expectedScenario = scenarios.find((s) => s.caseType === 'expected') || scenarios[1] || scenarios[0];
  const netProfitShift = expectedScenario.monthlyProfit - scenarios[0].monthlyProfit;

  return (
    <AppPage>
      <FadeIn>
        <div className="space-y-6">
          {/* 1. Redesigned Result Header Composition (Req 10 & 12) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
            <div className="space-y-1.5 min-w-0">
              <h1 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight truncate">
                {name}
              </h1>
              {/* Quiet inline text metadata row without badge soup */}
              <div className="flex items-center gap-2 flex-wrap text-xs text-text-muted">
                <Badge variant="healthy" className="text-[10px]">Completed</Badge>
                <span className="text-text-muted">•</span>
                <span className="capitalize font-medium text-text-primary">{scenarioType.replace('_', ' ')}</span>
                <span className="text-text-muted">•</span>
                <span>12-month horizon</span>
                <span className="text-text-muted">•</span>
                <span>Verified Jan 2025 snapshot</span>
              </div>
            </div>

            {/* Right Utility Toolbar (Req 10) */}
            <div className="flex items-center gap-2 shrink-0 self-start md:self-auto w-full md:w-auto">
              <Button asChild variant="secondary" size="sm" className="text-xs flex-1 md:flex-none justify-center">
                <Link href="/simulations/new">
                  <SlidersHorizontal className="size-3.5" />
                  <span>Adjust assumptions</span>
                </Link>
              </Button>

              <Button asChild variant="outline" size="sm" className="text-xs flex-1 md:flex-none justify-center">
                <Link href="/simulations/compare">
                  <Columns className="size-3.5" />
                  <span>Compare</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* 2. Coherent Decision Verdict Surface (Req 11 & 13) */}
          <section className="rounded-xl border border-brand/20 bg-brand-soft/15 p-5 sm:p-6 space-y-4 shadow-2xs" aria-label="Decision Verdict">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={recBadgeVariant} dot>{recommendation}</Badge>
                  <span className="text-xs text-text-muted">Rule Confidence: <strong className="text-text-primary">High</strong></span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-text-primary">
                  Decision Verdict & Affordability Conclusion
                </h2>
              </div>

              {/* Dominant Primary Decision Action */}
              <Button asChild variant="primary" size="sm" className="text-xs self-start sm:self-auto">
                <Link href="/advisor">
                  <CheckCircle2 className="size-3.5" />
                  <span>Open Strategic Advisor</span>
                </Link>
              </Button>
            </div>

            <p className="text-xs sm:text-sm text-text-primary leading-relaxed max-w-3xl font-medium">
              {recommendationRationale}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-lg border border-border/80 bg-surface space-y-1">
                <span className="text-emerald-600 font-semibold block uppercase text-[10px] tracking-wider">Strongest Upside</span>
                <p className="text-text-primary font-medium">{answers.whatImproves}</p>
              </div>

              <div className="p-3 rounded-lg border border-border/80 bg-surface space-y-1">
                <span className="text-danger font-semibold block uppercase text-[10px] tracking-wider">Primary Downside Risk</span>
                <p className="text-text-primary font-medium">{answers.whatWorsens}</p>
              </div>

              <div className="p-3 rounded-lg border border-border/80 bg-surface space-y-1">
                <span className="text-brand font-semibold block uppercase text-[10px] tracking-wider">Critical Condition</span>
                <p className="text-text-primary font-medium">{answers.unsafeConditions}</p>
              </div>
            </div>

            {/* Diagnostic Rationale Progressive Disclosure Expander */}
            <div className="pt-2 border-t border-brand/20">
              <button
                type="button"
                onClick={() => setShowDiagnosticDetails(!showDiagnosticDetails)}
                className="flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-hover cursor-pointer"
              >
                <span>{showDiagnosticDetails ? 'Hide Diagnostic Reasoning' : 'Why Wallflower reached this result'}</span>
                <ChevronDown className={cn('size-3.5 transition-transform', showDiagnosticDetails && 'rotate-180')} />
              </button>

              <Expand open={showDiagnosticDetails}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs">
                  <div className="p-3 rounded-lg border border-border/70 bg-surface space-y-1">
                    <span className="text-text-muted font-medium block">Affordability Evaluation</span>
                    <p className="text-text-primary">{answers.canAfford}</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border/70 bg-surface space-y-1">
                    <span className="text-text-muted font-medium block">Break-Even Velocity</span>
                    <p className="text-text-primary">{answers.breakEvenPoint}</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border/70 bg-surface space-y-1">
                    <span className="text-text-muted font-medium block">Primary Sensitivity Driver</span>
                    <p className="text-text-primary">{answers.keyAssumption}</p>
                  </div>
                </div>
              </Expand>
            </div>
          </section>

          {/* 3. Compact Key Scenario Outcomes Strip with Explicit Numerical Values (Req 13) */}
          <div className="p-4 rounded-xl border border-border/80 bg-surface shadow-2xs">
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-2 px-1">
              Key Scenario Outcomes Summary
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-surface-subtle/60 border border-border/60">
                <span className="text-text-muted text-[11px] block">Net Profit Shift</span>
                <FinancialValue value={netProfitShift} className={cn('text-sm font-bold block', netProfitShift >= 0 ? 'text-emerald-600' : 'text-danger')} />
              </div>
              <div className="p-2.5 rounded-lg bg-surface-subtle/60 border border-border/60">
                <span className="text-text-muted text-[11px] block">Cash Runway</span>
                <span className="text-sm font-bold text-warning block tabular-nums">{expectedScenario.cashRunwayMonths} months</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-subtle/60 border border-border/60">
                <span className="text-text-muted text-[11px] block">Lowest Cash Floor</span>
                <FinancialValue value={expectedScenario.lowestCashBalance} className="text-sm font-bold text-text-primary block" />
              </div>
              <div className="p-2.5 rounded-lg bg-surface-subtle/60 border border-border/60">
                <span className="text-text-muted text-[11px] block">Safe Reserve Floor</span>
                <span className="text-xs font-bold text-emerald-600 tabular-nums block">฿164,800 Preserved</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-subtle/60 border border-border/60">
                <span className="text-text-muted text-[11px] block">Break-Even Horizon</span>
                <span className="text-sm font-bold text-brand block">Month {expectedScenario.breakEvenPeriodMonths > 0 ? expectedScenario.breakEvenPeriodMonths : '5'}</span>
              </div>
            </div>
          </div>

          {/* 4. Scenario Trajectory Chart & Interpretation Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left ~65%: Trajectory Chart */}
            <ChartInView className="lg:col-span-8">
              {(shouldRenderChart) => (
                <ChartCard
                  title="Cash Balance Trajectory Across Scenarios"
                  description="Comparing baseline vs expected, optimistic, and conservative scenario cash curves."
                  legendItems={[
                    { label: 'Expected', color: '#0F766E' },
                    { label: 'Optimistic', color: '#16A34A' },
                    { label: 'Conservative', color: '#DC2626' },
                    { label: 'Baseline', color: '#64748B' },
                  ]}
                >
                  <div className="h-64 w-full pt-2">
                    {shouldRenderChart && (
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={cashImpactTimeline} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                          <Line type="monotone" dataKey="expectedCash" stroke="#0F766E" strokeWidth={2.5} dot={{ r: 4 }} />
                          <Line type="monotone" dataKey="optimisticCash" stroke="#16A34A" strokeWidth={2} strokeDasharray="3 3" />
                          <Line type="monotone" dataKey="conservativeCash" stroke="#DC2626" strokeWidth={2} strokeDasharray="3 3" />
                          <Line type="monotone" dataKey="baselineCash" stroke="#64748B" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </ChartCard>
              )}
            </ChartInView>

            {/* Right ~35%: Interpretation Panel */}
            <FadeInView className="lg:col-span-4 space-y-4">
              <Card className="p-5 space-y-3 border-brand/20 bg-brand-soft/10 shadow-2xs">
                <CardTitle className="text-sm">Trajectory Interpretation</CardTitle>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-text-muted block text-[11px]">Largest Trajectory Divergence</span>
                    <span className="font-bold text-text-primary">Month 3 (+฿65,200 vs baseline)</span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[11px]">Lowest Projected Cash Point</span>
                    <FinancialValue value={expectedScenario.lowestCashBalance} className="font-bold text-brand" />
                  </div>
                  <div>
                    <span className="text-text-muted block text-[11px]">Break-Even Horizon</span>
                    <span className="font-bold text-text-primary">Month 5 under Expected Case</span>
                  </div>
                </div>
              </Card>

              {/* Sensitivity Drivers */}
              <Card className="p-4 space-y-2.5 shadow-2xs">
                <CardTitle className="text-sm">Sensitivity Drivers</CardTitle>
                <div className="space-y-2 text-xs">
                  {sensitivityAnalysis.slice(0, 2).map((item) => (
                    <div key={item.assumptionName} className="p-2.5 rounded-lg border border-border/70 space-y-0.5">
                      <div className="flex items-center justify-between font-semibold">
                        <span>{item.assumptionName}</span>
                        <span className="text-danger font-bold">{item.runwayImpactMonths} mo</span>
                      </div>
                      <span className="text-text-muted text-[11px] block">Varied: {item.variedValue}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </FadeInView>
          </div>

          {/* 5. Detailed Baseline vs Scenario Comparison Table */}
          <FadeInView className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <CardTitle>Detailed Scenario Comparison</CardTitle>
              <span className="text-xs text-text-muted">Baseline vs Expected, Optimistic & Conservative</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-2xs">
              <table className="w-full text-left text-xs text-text-primary">
                <thead className="border-b border-border bg-surface-subtle text-text-muted text-[11px]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Financial Metric</th>
                    {scenarios.map((s) => (
                      <th key={s.caseType} className="px-4 py-3 font-semibold">
                        <span className={cn(s.caseType === 'expected' && 'text-brand font-bold')}>{s.label}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  <tr>
                    <td className="px-4 py-3 font-medium text-text-muted">Monthly Revenue</td>
                    {scenarios.map((s) => (
                      <td key={s.caseType} className="px-4 py-3 font-bold tabular-nums">
                        <FinancialValue value={s.monthlyRevenue} />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-text-muted">Monthly Expenses</td>
                    {scenarios.map((s) => (
                      <td key={s.caseType} className="px-4 py-3 font-bold tabular-nums">
                        <FinancialValue value={s.monthlyExpenses} />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-text-muted">Monthly Profit</td>
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
                    <td className="px-4 py-3 font-medium text-text-muted">Lowest Cash Balance</td>
                    {scenarios.map((s) => (
                      <td key={s.caseType} className="px-4 py-3 font-bold tabular-nums">
                        <FinancialValue value={s.lowestCashBalance} />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </FadeInView>

          {/* 6. Decision Safety Guardrails (Grouped rows - Req 14) */}
          <FadeInView>
            <Card className="p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <CardTitle>Decision Safety Guardrails</CardTitle>
                <Badge variant="warning">3 Rules Evaluated</Badge>
              </div>

              <div className="divide-y divide-border/60 text-xs">
                {guardrails.map((g) => (
                  <div key={g.parameter} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text-primary">{g.parameter}</span>
                        <Badge variant={g.isBreached ? 'critical' : 'success'} className="text-[10px]">
                          {g.isBreached ? 'BREACHED' : 'SAFE'}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-text-secondary">{g.warningNote}</p>
                    </div>

                    <div className="text-[11px] text-text-muted shrink-0 text-left sm:text-right space-y-0.5">
                      <div>Threshold: <strong className="text-text-primary">{g.safeLimit}</strong></div>
                      <div>Projected: <strong className="text-text-primary">{g.currentProjected}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </FadeInView>

          {/* 7. Assumptions & Provenance Expander (Req 14) */}
          <FadeInView>
            <Card className="p-5 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Assumption Quality & Provenance</CardTitle>
                  <CardDescription className="text-xs">Summary of baseline and user-entered assumptions.</CardDescription>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAllAssumptions(!showAllAssumptions)}
                  className="text-xs font-semibold text-brand hover:text-brand-hover cursor-pointer flex items-center gap-1"
                >
                  <span>{showAllAssumptions ? 'Hide Assumptions Table' : 'View All Assumptions Table'}</span>
                  <ChevronDown className={cn('size-3.5 transition-transform', showAllAssumptions && 'rotate-180')} />
                </button>
              </div>

              <Expand open={showAllAssumptions}>
                <div className="overflow-x-auto rounded-lg border border-border bg-surface pt-2">
                  <table className="w-full text-left text-xs text-text-primary">
                    <thead className="border-b border-border bg-surface-subtle text-text-muted text-[11px]">
                      <tr>
                        <th className="px-3 py-2.5 font-semibold">Assumption Field</th>
                        <th className="px-3 py-2.5 font-semibold">Value Used</th>
                        <th className="px-3 py-2.5 font-semibold">Quality Badge</th>
                        <th className="px-3 py-2.5 font-semibold">Source Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
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
              </Expand>
            </Card>
          </FadeInView>

          {/* 8. Single Final Focused Action Area (Req 11) */}
          <FadeInView>
            <div className="p-4 rounded-xl border border-border/80 bg-surface shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold text-text-primary">Decision Guidance Actions:</span>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    openDrawer(
                      `Can you analyze the financial projection and risks for simulation: ${data?.name || simulationId}?`,
                    )
                  }
                  className="text-xs cursor-pointer gap-2"
                >
                  <BotAvatar size={20} animate={false} />
                  <span>Ask Capybot</span>
                </Button>
              </div>
            </div>
          </FadeInView>

          {/* Disclaimer Footer */}
          <div className="flex items-start gap-2.5 p-4 rounded-xl bg-surface-subtle border border-border/60 text-xs text-text-muted">
            <AlertTriangle className="size-4 mt-0.5 shrink-0 text-warning" aria-hidden="true" />
            <p className="leading-relaxed">
              Simulation outputs are deterministic scenario calculations based on user-supplied assumptions and financial baseline snapshots. They highlight trade-offs and do not constitute guaranteed investment advice.
            </p>
          </div>
        </div>
      </FadeIn>
    </AppPage>
  );
}
