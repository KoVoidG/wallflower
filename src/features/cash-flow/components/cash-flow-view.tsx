'use client';

import { useState, useEffect } from 'react';
import {
  Banknote,
  AlertTriangle,
  Calendar as CalendarIcon,
  ArrowUpRight,
  ArrowDownRight,
  Play,
  RefreshCw,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/navigation';
import { AppPage } from '@/components/ui/layout';
import { Card, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartCard } from '@/components/charts/chart-card';
import {
  FinancialValue,
  FreshnessIndicator,
  CompletenessIndicator,
  QualityBadge,
} from '@/components/ui/domain-values';
import { CashFlowSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { FadeInView, ChartInView } from '@/components/motion';
import { useAdvisorDrawer } from '@/features/advisor/context/advisor-drawer-context';
import {
  CashFlowService,
  type CashFlowServiceResponse,
} from '@/services/cash-flow-service';
import { formatThbAxis, AXIS_STYLES, GRID_STYLES } from '@/components/charts/chart-config';

export function CashFlowView() {
  const { openDrawer } = useAdvisorDrawer();
  const [data, setData] = useState<CashFlowServiceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeScenario, setActiveScenario] = useState<'all' | 'expected' | 'conservative' | 'optimistic'>('all');
  const [activeHorizon, setActiveHorizon] = useState<'all' | '30d' | '60d' | '90d'>('all');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await CashFlowService.fetchCashFlowData(400);
      setData(res);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load cash flow workspace.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    CashFlowService.fetchCashFlowData(400)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load cash flow workspace.',
          );
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <CashFlowSkeleton />;
  if (error)
    return (
      <ErrorState
        onRetry={loadData}
        title="Cash Flow Workspace Error"
        description={error}
      />
    );
  if (!data)
    return (
      <EmptyState
        icon={<Banknote />}
        title="No Cash Flow Data"
        description="Record a financial snapshot to start forecasting cash flow."
      />
    );

  const {
    position,
    forecastPoints,
    events,
    gapWarning,
    receivablesAging,
    upcomingPayables,
    expenseBreakdown,
    metadata,
  } = data;

  const filteredForecastPoints = forecastPoints.filter((pt) => {
    if (activeHorizon === '30d')
      return ['Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025'].includes(pt.period);
    if (activeHorizon === '60d')
      return ['Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025'].includes(pt.period);
    if (activeHorizon === '90d')
      return ['Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025'].includes(pt.period);
    return true;
  });

  const lowestBalance = 270000;
  const safeBuffer = lowestBalance - position.minimumSafeCash;

  const singleEvents = events.filter((e) => e.expectedDate !== '2025-02-28');
  const feb28Events = events.filter((e) => e.expectedDate === '2025-02-28');
  const feb28CombinedOutflow = feb28Events.reduce((sum, e) => sum + e.amount, 0);

  return (
    <AppPage>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight">
                Cash Flow Workspace
              </h1>
              <Badge variant="healthy" dot>
                Stable Liquidity
              </Badge>
            </div>
            <p className="text-xs text-text-secondary">
              Time-based cash forecasting, transaction timeline, and working-capital risk analysis.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <FreshnessIndicator
              lastUpdated={metadata.lastUpdated}
              staleDays={metadata.staleDays}
            />
            <CompletenessIndicator
              score={metadata.completenessScore}
              confidence="high"
            />
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="text-xs cursor-pointer"
              onClick={loadData}
            >
              <RefreshCw className="size-3.5" aria-hidden="true" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-surface p-3.5 sm:p-4 shadow-2xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
            <div className="space-y-0.5 sm:pr-4">
              <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium block">
                Total Available Cash
              </span>
              <FinancialValue
                value={position.totalCash}
                compact
                className="text-base sm:text-lg font-bold text-text-primary block"
              />
              <span className="text-[11px] text-text-muted block">In bank accounts</span>
            </div>

            <div className="space-y-0.5 pt-2 sm:pt-0 sm:px-4">
              <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium block">
                Usable Liquidity
              </span>
              <FinancialValue
                value={position.usableCash}
                compact
                className="text-base sm:text-lg font-bold text-brand block"
              />
              <span className="text-[11px] text-text-muted block">Operating cash</span>
            </div>

            <div className="space-y-0.5 pt-2 sm:pt-0 sm:px-4">
              <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium block">
                Safe Minimum
              </span>
              <FinancialValue
                value={position.minimumSafeCash}
                compact
                className="text-base sm:text-lg font-bold text-text-secondary block"
              />
              <span className="text-[11px] text-text-muted block">1-month threshold</span>
            </div>

            <div className="space-y-0.5 pt-2 sm:pt-0 sm:px-4">
              <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium block">
                Estimated Runway
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-bold text-warning tabular-nums">
                  {position.estimatedRunwayMonths}
                </span>
                <span className="text-xs text-text-muted">months</span>
              </div>
              <span className="text-[11px] text-text-muted block">At current burn</span>
            </div>

            <div className="space-y-0.5 pt-2 sm:pt-0 sm:pl-4 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium block">
                Forecasted Lowest Balance
              </span>
              <FinancialValue
                value={lowestBalance}
                compact
                className="text-base sm:text-lg font-bold text-warning block"
              />
              <span className="text-[11px] text-text-muted block">May 2025 conservative</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7 space-y-3 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-border/80 bg-surface shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <SlidersHorizontal className="size-3.5 text-brand" />
                <span className="font-medium text-text-primary">Scenario View:</span>
                <div className="inline-flex rounded-lg border border-border p-0.5 bg-surface-subtle">
                  <button
                    type="button"
                    onClick={() => setActiveScenario('all')}
                    className={cn(
                      'px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer',
                      activeScenario === 'all'
                        ? 'bg-surface text-text-primary shadow-2xs'
                        : 'text-text-muted hover:text-text-primary'
                    )}
                  >
                    All Cases
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveScenario('expected')}
                    className={cn(
                      'px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer',
                      activeScenario === 'expected'
                        ? 'bg-brand text-white shadow-2xs'
                        : 'text-text-muted hover:text-text-primary'
                    )}
                  >
                    Expected
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveScenario('conservative')}
                    className={cn(
                      'px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer',
                      activeScenario === 'conservative'
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'text-text-muted hover:text-text-primary'
                    )}
                  >
                    Conservative
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <span className="font-medium text-text-primary">Horizon:</span>
                <div className="inline-flex rounded-lg border border-border p-0.5 bg-surface-subtle">
                  {(['all', '30d', '60d', '90d'] as const).map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setActiveHorizon(h)}
                      className={cn(
                        'px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer uppercase',
                        activeHorizon === h
                          ? 'bg-surface text-text-primary shadow-2xs'
                          : 'text-text-muted hover:text-text-primary'
                      )}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <ChartInView>
              {(shouldRenderChart) => (
                <ChartCard
                  title="Cash Balance History & Forward Forecast"
                  description="Historical cash balance alongside conservative, expected, and optimistic projections against safe minimum threshold."
                  action={
                    <Link
                      href="/simulations/new"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-hover"
                    >
                      <span>Simulate Scenarios</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  }
                  legendItems={[
                    { label: 'Expected Case', color: '#0F766E' },
                    { label: 'Conservative Case', color: '#D97706' },
                    { label: 'Optimistic Case', color: '#16A34A' },
                    { label: 'Safe Minimum Threshold', color: '#DC2626' },
                  ]}
                >
                  <div className="h-72 w-full pt-2">
                    {shouldRenderChart && (
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                          data={filteredForecastPoints}
                          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray={GRID_STYLES.strokeDasharray}
                            stroke="var(--border)"
                            opacity={0.15}
                          />
                          <XAxis
                            dataKey="period"
                            {...AXIS_STYLES}
                            stroke="var(--text-muted)"
                          />
                          <YAxis
                            tickFormatter={formatThbAxis}
                            {...AXIS_STYLES}
                            stroke="var(--text-muted)"
                          />
                          <Tooltip
                            formatter={(val) => [
                              typeof val === 'number'
                                ? `฿${val.toLocaleString()}`
                                : String(val ?? '—'),
                              'Cash Balance',
                            ]}
                            contentStyle={{
                              backgroundColor: 'var(--surface)',
                              borderColor: 'var(--border)',
                              borderRadius: '10px',
                              fontSize: '12px',
                              color: 'var(--text-primary)',
                            }}
                          />
                          <ReferenceLine
                            x="Feb 2025"
                            stroke="var(--warning)"
                            strokeDasharray="3 3"
                            opacity={0.6}
                            label={{
                              value: 'Feb 28 Payroll+Loan',
                              fill: 'var(--text-muted)',
                              fontSize: 10,
                              position: 'insideTopRight',
                            }}
                          />
                          {(activeScenario === 'all' || activeScenario === 'optimistic') && (
                            <Area
                              type="monotone"
                              dataKey="optimisticCase"
                              stroke="#16A34A"
                              fill="#16A34A"
                              fillOpacity={0.08}
                              strokeWidth={1.5}
                              animationDuration={800}
                            />
                          )}
                          {(activeScenario === 'all' || activeScenario === 'conservative') && (
                            <Area
                              type="monotone"
                              dataKey="conservativeCase"
                              stroke="#D97706"
                              fill="#D97706"
                              fillOpacity={0.08}
                              strokeWidth={1.5}
                              animationDuration={800}
                            />
                          )}
                          {(activeScenario === 'all' || activeScenario === 'expected') && (
                            <Line
                              type="monotone"
                              dataKey="expectedBalance"
                              stroke="#0F766E"
                              strokeWidth={2.5}
                              dot={{ r: 4, fill: '#0F766E' }}
                              animationDuration={800}
                            />
                          )}
                          <Line
                            type="monotone"
                            dataKey="safeMinimumThreshold"
                            stroke="#DC2626"
                            strokeDasharray="4 4"
                            strokeWidth={1.5}
                            dot={false}
                            animationDuration={800}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </ChartCard>
              )}
            </ChartInView>
          </div>

          <div className="xl:col-span-5 min-w-0">
            <Card className="p-5 space-y-4 shadow-2xs border-brand/30 bg-surface h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-brand shrink-0" aria-hidden="true" />
                    <h3 className="text-sm font-semibold text-text-primary tracking-tight">
                      Forecast Analysis
                    </h3>
                  </div>
                  <span className="text-[11px] text-text-muted font-medium">
                    Forecast confidence: <strong className="text-text-primary">High</strong>
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium block">
                      Projected Pressure Period
                    </span>
                    <span className="font-bold text-text-primary text-sm block">
                      {gapWarning.expectedTiming}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-warning/25 bg-warning-soft/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-warning text-xs">
                        Monthly Operating Deficit:
                      </span>
                      <span className="font-bold text-warning tabular-nums">
                        ฿{gapWarning.gapAmount.toLocaleString()}/mo
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-warning/20 text-[11px]">
                      <span className="text-text-secondary">
                        Buffer Above Safe Minimum (฿164.8k):
                      </span>
                      <span className="font-semibold text-success tabular-nums">
                        +฿{safeBuffer.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium block">
                      Primary Pressure Driver
                    </span>
                    <p className="text-text-secondary leading-relaxed">
                      Monthly operating expenses (฿164,800) exceed expected customer inflows (฿152,400) by ฿12,400/month, aggravated by ฿21,340 in overdue receivables.
                    </p>
                  </div>

                  <div className="space-y-1 pt-0.5">
                    <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium block">
                      Critical Scheduled Outflow Event
                    </span>
                    <div className="p-2.5 rounded-lg border border-border/70 bg-surface-subtle/50 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-text-primary block">
                          Feb 28 Payroll & Loan Installment
                        </span>
                        <span className="text-[11px] text-text-muted">
                          ฿{feb28CombinedOutflow.toLocaleString()} combined outflow
                        </span>
                      </div>
                      <Badge variant="warning" className="text-[10px]">
                        Lowest Cash Point
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/60 space-y-2">
                <Button asChild variant="primary" size="md" className="w-full text-xs cursor-pointer">
                  <Link href="/simulations/new?type=payment_delay">
                    <Play aria-hidden="true" />
                    <span>Simulate Customer Payment Delay</span>
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <FadeInView>
          <Card className="p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <CardTitle>Chronological Cash Calendar & Event Schedule</CardTitle>
                <p className="text-xs text-text-secondary pt-0.5">
                  Ordered transaction timeline indicating which events drive cash flow inflows and outflows.
                </p>
              </div>
              <span className="text-xs font-medium text-brand">
                {events.length} Scheduled Events
              </span>
            </div>

            <div className="relative border-l-2 border-brand/30 ml-3 sm:ml-4 pl-4 sm:pl-6 space-y-4 py-2">
              {singleEvents.map((event) => {
                const isInflow = event.type === 'inflow';
                const userFacingQuality = event.quality === 'actual' ? 'Confirmed' : 'Estimated';

                return (
                  <div key={event.id} className="relative group">
                    <div
                      className={cn(
                        'absolute -left-[25px] sm:-left-[33px] top-1.5 size-4 sm:size-5 rounded-full border-2 bg-surface flex items-center justify-center transition-colors',
                        isInflow
                          ? 'border-success text-success'
                          : 'border-border text-text-muted'
                      )}
                    >
                      <div
                        className={cn(
                          'size-1.5 rounded-full',
                          isInflow ? 'bg-success' : 'bg-text-muted'
                        )}
                      />
                    </div>

                    <div className="p-3.5 rounded-lg border border-border/70 bg-surface hover:border-brand/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={cn(
                            'p-2 rounded-lg shrink-0 mt-0.5',
                            isInflow ? 'bg-success-soft text-success' : 'bg-surface-subtle text-text-muted'
                          )}
                        >
                          {isInflow ? (
                            <ArrowDownRight className="size-4" />
                          ) : (
                            <ArrowUpRight className="size-4" />
                          )}
                        </div>

                        <div className="space-y-1 min-w-0">
                          <span className="font-semibold text-text-primary text-xs sm:text-sm block">
                            {event.title}
                          </span>
                          <div className="flex items-center gap-3 text-[11px] text-text-muted">
                            <span className="flex items-center gap-1 font-medium text-text-primary">
                              <CalendarIcon className="size-3" aria-hidden="true" />
                              {event.expectedDate}
                            </span>
                            <span>·</span>
                            <span>Category: {event.category}</span>
                            <span>·</span>
                            <Badge variant="neutral" className="text-[9px] py-0 px-1">
                              {userFacingQuality}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                        <FinancialValue
                          value={event.amount}
                          className={cn(
                            'text-xs sm:text-sm font-bold block',
                            isInflow ? 'text-success' : 'text-text-primary'
                          )}
                        />
                        <Badge
                          variant={
                            event.status === 'confirmed'
                              ? 'success'
                              : event.status === 'expected'
                                ? 'healthy'
                                : 'warning'
                          }
                          className="text-[10px] uppercase"
                        >
                          {event.status === 'confirmed' ? 'Scheduled' : event.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}

              {feb28Events.length > 0 && (
                <div className="relative group">
                  <div className="absolute -left-[25px] sm:-left-[33px] top-1.5 size-4 sm:size-5 rounded-full border-2 border-warning bg-warning-soft text-warning flex items-center justify-center">
                    <div className="size-1.5 rounded-full bg-warning" />
                  </div>

                  <div className="p-4 rounded-lg border border-warning/30 bg-warning-soft/10 hover:border-warning/50 transition-colors space-y-3 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-warning/20 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-text-primary text-sm">
                          February 28, 2025 — Critical Outflow Date
                        </span>
                        <Badge variant="warning" className="text-[10px]">
                          Lowest Cash Point
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <span className="text-[11px] text-text-muted">Combined Outflow:</span>
                        <FinancialValue
                          value={feb28CombinedOutflow}
                          className="text-sm font-bold text-warning"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      {feb28Events.map((item) => (
                        <div
                          key={item.id}
                          className="p-2.5 rounded-md border border-border/60 bg-surface flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-1 rounded bg-surface-subtle text-text-muted">
                              <ArrowUpRight className="size-3.5" />
                            </div>
                            <div>
                              <span className="font-semibold text-text-primary block">
                                {item.title}
                              </span>
                              <span className="text-[11px] text-text-muted">
                                {item.category} · Confirmed Baseline
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <FinancialValue value={item.amount} className="font-bold text-text-primary" />
                            <Badge variant="success" className="text-[9px] uppercase">
                              Scheduled
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </FadeInView>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <FadeInView className="lg:col-span-6">
            <Card className="p-5 space-y-3 shadow-2xs h-full">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <div>
                  <CardTitle>Receivables Aging Breakdown</CardTitle>
                  <p className="text-xs text-text-secondary pt-0.5">
                    Uncollected client invoices grouped by overdue period.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-border/40">
                {receivablesAging.map((bucket) => {
                  const isZeroBucket = bucket.amount === 0 || bucket.invoiceCount === 0;
                  const badgeVariant = isZeroBucket
                    ? 'neutral'
                    : bucket.riskLevel === 'low'
                      ? 'success'
                      : bucket.riskLevel === 'medium'
                        ? 'warning'
                        : 'danger';

                  return (
                    <div
                      key={bucket.bucket}
                      className="py-2.5 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-text-primary block">
                          {bucket.label}
                        </span>
                        <span className="text-[11px] text-text-muted block">
                          {bucket.invoiceCount} invoice
                          {bucket.invoiceCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <FinancialValue
                          value={bucket.amount}
                          className="font-bold text-text-primary"
                        />
                        <Badge variant={badgeVariant} className="text-[10px]">
                          {isZeroBucket ? 'NONE' : bucket.riskLevel.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </FadeInView>

          <FadeInView className="lg:col-span-6">
            <Card className="p-5 space-y-3 shadow-2xs h-full">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <div>
                  <CardTitle>Upcoming Scheduled Payables</CardTitle>
                  <p className="text-xs text-text-secondary pt-0.5">
                    Vendor liabilities and scheduled debt obligations.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-border/40">
                {upcomingPayables.map((payable) => (
                  <div
                    key={payable.id}
                    className="py-2.5 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="space-y-0.5">
                      <span className="font-semibold text-text-primary block">
                        {payable.vendor}
                      </span>
                      <span className="text-[11px] text-text-muted block">
                        Due {payable.dueDate} · {payable.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <FinancialValue
                        value={payable.amount}
                        className="font-bold text-text-primary"
                      />
                      {payable.isHighPressure && (
                        <Badge variant="danger" className="text-[10px]">
                          High Pressure
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </FadeInView>
        </div>

        <FadeInView>
          <Card className="p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <CardTitle>Cash Forecast Assumptions & Structure</CardTitle>
                <p className="text-xs text-text-secondary pt-0.5">
                  Baseline expense breakdown and data confidence classifications.
                </p>
              </div>
              <span className="text-xs font-medium text-brand">
                Baseline Inputs
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {expenseBreakdown.map((exp) => (
                <div
                  key={exp.category}
                  className="p-3 rounded-lg border border-border/70 bg-surface-subtle/50 space-y-2 text-xs h-full flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-text-primary leading-tight text-xs">
                        {exp.label}
                      </span>
                      <QualityBadge quality={exp.quality} className="text-[9px] shrink-0" />
                    </div>
                    <span className="text-[11px] text-text-muted block">
                      {exp.percentageOfTotal}% of monthly burn
                    </span>
                  </div>
                  <FinancialValue
                    value={exp.amount}
                    className="font-bold text-text-primary block text-sm pt-1 border-t border-border/40"
                  />
                </div>
              ))}
            </div>
          </Card>
        </FadeInView>

        <FadeInView>
          <div className="rounded-xl border border-border bg-surface p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-text-primary">
                  Recommended Next Steps
                </h3>
                <p className="text-xs text-text-secondary">
                  High-value execution actions to protect cash runway and resolve deficits.
                </p>
              </div>
              <span className="text-xs font-medium text-brand">
                Actionable
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild variant="primary" size="md" className="cursor-pointer">
                <Link href="/simulations/new?type=payment_delay">
                  <Play aria-hidden="true" />
                  <span>Simulate Customer Payment Delay</span>
                </Link>
              </Button>

              <Button asChild variant="secondary" size="md" className="cursor-pointer">
                <Link href="/actions">
                  <Banknote aria-hidden="true" />
                  <span>Create Invoice Follow-Up Action Item</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={() =>
                  openDrawer(
                    'How can I optimize cash flow and reduce fixed operating expenses?',
                  )
                }
                className="cursor-pointer"
              >
                <Sparkles aria-hidden="true" />
                <span>Ask AI Advisor for Cost Reduction</span>
              </Button>
            </div>
          </div>
        </FadeInView>

        <div className="flex items-start gap-2.5 p-4 rounded-xl bg-surface-subtle border border-border/60 text-xs text-text-muted">
          <AlertTriangle
            className="size-4 mt-0.5 shrink-0 text-warning"
            aria-hidden="true"
          />
          <p className="leading-relaxed">
            Cash Flow Workspace forecasts are deterministic calculations derived from financial snapshot baselines and expected payment schedules. They do not constitute guaranteed bank validation or tax advice.
          </p>
        </div>
      </div>
    </AppPage>
  );
}
