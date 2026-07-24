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
} from 'recharts';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/navigation';
import { AppPage, PageHeader } from '@/components/ui/layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { FadeIn, FadeInView } from '@/components/motion';
import {
  CashFlowService,
  type CashFlowServiceResponse,
} from '@/services/cash-flow-service';
import { formatThbAxis, AXIS_STYLES, GRID_STYLES } from '@/components/charts/chart-config';

export default function CashFlowPage() {
  const [data, setData] = useState<CashFlowServiceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await CashFlowService.fetchCashFlowData(400);
      setData(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load cash flow workspace.');
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
          setError(err instanceof Error ? err.message : 'Failed to load cash flow workspace.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <CashFlowSkeleton />;
  if (error) return <ErrorState onRetry={loadData} title="Cash Flow Workspace Error" description={error} />;
  if (!data) return <EmptyState icon={<Banknote />} title="No Cash Flow Data" description="Record a financial snapshot to start forecasting cash flow." />;

  const { position, forecastPoints, events, gapWarning, receivablesAging, upcomingPayables, metadata } = data;

  return (
    <AppPage>
      <FadeIn>
        <div className="space-y-6">
          {/* 1. Header with Metadata Indicators */}
          <PageHeader
            title={
              <div className="flex items-center gap-2.5">
                <Banknote className="size-6 text-brand shrink-0" aria-hidden="true" />
                <span>Cash Flow Workspace</span>
              </div>
            }
            description="Detailed cash position, forward forecast, cash calendar, and receivables aging."
            badge={<Badge variant="healthy" dot>2.1 Months Runway</Badge>}
            actions={
              <div className="flex items-center gap-2.5">
                <FreshnessIndicator lastUpdated={metadata.lastUpdated} staleDays={metadata.staleDays} />
                <CompletenessIndicator score={metadata.completenessScore} confidence="high" />
                <button
                  type="button"
                  onClick={loadData}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-surface hover:bg-surface-subtle transition-colors cursor-pointer"
                >
                  <RefreshCw className="size-3.5" aria-hidden="true" />
                  <span>Refresh</span>
                </button>
              </div>
            }
          />

          {/* 2. Cash Position Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <Card className="p-3.5 sm:p-4 space-y-1">
              <span className="text-xs text-text-muted font-medium block">Total Cash</span>
              <FinancialValue value={position.totalCash} compact className="text-lg sm:text-xl font-bold" />
              <span className="text-[11px] text-text-muted block">In bank accounts</span>
            </Card>

            <Card className="p-3.5 sm:p-4 space-y-1">
              <span className="text-xs text-text-muted font-medium block">Reserved Cash</span>
              <FinancialValue value={position.reservedCash} compact className="text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400" />
              <span className="text-[11px] text-text-muted block">Taxes & emergency</span>
            </Card>

            <Card className="p-3.5 sm:p-4 space-y-1">
              <span className="text-xs text-text-muted font-medium block">Usable Cash</span>
              <FinancialValue value={position.usableCash} compact className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px] text-text-muted block">Operating liquidity</span>
            </Card>

            <Card className="p-3.5 sm:p-4 space-y-1">
              <span className="text-xs text-text-muted font-medium block">Safe Minimum</span>
              <FinancialValue value={position.minimumSafeCash} compact className="text-lg sm:text-xl font-bold text-slate-700 dark:text-slate-300" />
              <span className="text-[11px] text-text-muted block">1 mo. burn threshold</span>
            </Card>

            <Card className="p-3.5 sm:p-4 space-y-1">
              <span className="text-xs text-text-muted font-medium block">Projected 30-Day</span>
              <FinancialValue value={position.expectedEndingBalance} compact className="text-lg sm:text-xl font-bold text-brand" />
              <span className="text-[11px] text-text-muted block">Expected ending cash</span>
            </Card>

            <Card className="p-3.5 sm:p-4 space-y-1">
              <span className="text-xs text-text-muted font-medium block">Estimated Runway</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                  {position.estimatedRunwayMonths}
                </span>
                <span className="text-xs text-text-muted">months</span>
              </div>
              <span className="text-[11px] text-text-muted block">At current burn</span>
            </Card>
          </div>

          {/* 3. Cash-Gap Warning Banner */}
          {gapWarning.hasGap && (
            <div className="rounded-xl border border-warning/30 bg-warning-soft/30 p-4 sm:p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-warning/15 text-warning shrink-0 mt-0.5">
                    <AlertTriangle className="size-5" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-text-primary">
                        Cash-Gap Warning: Deficit of <FinancialValue value={gapWarning.gapAmount} className="text-warning" /> Expected in {gapWarning.expectedTiming}
                      </span>
                      <Badge variant="warning" dot>HIGH CONFIDENCE</Badge>
                    </div>
                    <p className="text-xs text-text-secondary max-w-3xl">
                      {gapWarning.mainCause}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-warning/20">
                <span className="text-xs font-semibold text-text-muted mr-1">Recommended actions:</span>
                {gapWarning.suggestedSimulations.map((sim) => (
                  <Link
                    key={sim.label}
                    href={sim.href}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-text-primary transition-colors shadow-2xs"
                  >
                    <Play className="size-3 text-brand" aria-hidden="true" />
                    <span>{sim.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 4. Cash Forecast Chart */}
          <FadeInView>
            <ChartCard
              title="Cash Balance History & Forward Forecast"
              description="Historical cash balance alongside conservative, expected, and optimistic projections against safe minimum threshold."
              legendItems={[
                { label: 'Expected Case', color: '#0F766E' },
                { label: 'Conservative Case', color: '#D97706' },
                { label: 'Optimistic Case', color: '#16A34A' },
                { label: 'Safe Minimum Threshold', color: '#DC2626' },
              ]}
            >
              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={forecastPoints} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray={GRID_STYLES.strokeDasharray} stroke="var(--border)" opacity={GRID_STYLES.strokeOpacity} />
                    <XAxis dataKey="period" {...AXIS_STYLES} stroke="var(--text-muted)" />
                    <YAxis tickFormatter={formatThbAxis} {...AXIS_STYLES} stroke="var(--text-muted)" />
                    <Tooltip
                      formatter={(val) => [typeof val === 'number' ? `฿${val.toLocaleString()}` : String(val ?? '—'), 'Cash Balance']}
                      contentStyle={{
                        backgroundColor: 'var(--surface)',
                        borderColor: 'var(--border)',
                        borderRadius: '10px',
                        fontSize: '12px',
                        color: 'var(--text-primary)',
                      }}
                    />
                    <Area type="monotone" dataKey="optimisticCase" stroke="#16A34A" fill="#16A34A" fillOpacity={0.08} strokeWidth={1.5} />
                    <Area type="monotone" dataKey="conservativeCase" stroke="#D97706" fill="#D97706" fillOpacity={0.08} strokeWidth={1.5} />
                    <Line type="monotone" dataKey="expectedBalance" stroke="#0F766E" strokeWidth={2.5} dot={{ r: 4, fill: '#0F766E' }} />
                    <Line type="monotone" dataKey="safeMinimumThreshold" stroke="#DC2626" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </FadeInView>

          {/* 5. Cash Calendar Events & Receivables/Payables Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 cols: Cash Calendar Events */}
            <FadeInView className="lg:col-span-7 space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Cash Calendar</CardTitle>
                      <CardDescription>Upcoming expected cash inflows and outflows by date.</CardDescription>
                    </div>
                    <Badge variant="brand">{events.length} Events</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {events.map((event) => {
                    const isInflow = event.type === 'inflow';
                    return (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-surface-subtle/50 hover:bg-surface-subtle transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={cn(
                              'p-2 rounded-lg shrink-0',
                              isInflow ? 'bg-emerald-500/15 text-emerald-600' : 'bg-rose-500/15 text-rose-600'
                            )}
                          >
                            {isInflow ? <ArrowDownRight className="size-4" /> : <ArrowUpRight className="size-4" />}
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <span className="text-xs sm:text-sm font-semibold text-text-primary block truncate">
                              {event.title}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-text-muted">
                              <CalendarIcon className="size-3" aria-hidden="true" />
                              <span>{event.expectedDate}</span>
                              <span>·</span>
                              <span>{event.category}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <FinancialValue
                            value={event.amount}
                            className={cn('text-xs sm:text-sm font-bold block', isInflow ? 'text-emerald-600 dark:text-emerald-400' : 'text-text-primary')}
                          />
                          <QualityBadge quality={event.quality} className="text-[10px] py-0 px-1 mt-0.5" />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </FadeInView>

            {/* Right 5 cols: Receivables Aging & Upcoming Payables */}
            <FadeInView className="lg:col-span-5 space-y-6">
              {/* Receivables Aging */}
              <Card>
                <CardHeader>
                  <CardTitle>Receivables Aging Breakdown</CardTitle>
                  <CardDescription>Overdue customer invoices grouped by risk category.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {receivablesAging.map((bucket) => {
                    const badgeVariant = bucket.riskLevel === 'low' ? 'success' : bucket.riskLevel === 'medium' ? 'warning' : 'danger';
                    return (
                      <div key={bucket.bucket} className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 bg-surface">
                        <div className="space-y-0.5">
                          <span className="text-xs font-semibold text-text-primary block">{bucket.label}</span>
                          <span className="text-[11px] text-text-muted block">{bucket.invoiceCount} invoice{bucket.invoiceCount !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FinancialValue value={bucket.amount} className="text-xs font-bold" />
                          <Badge variant={badgeVariant} className="text-[10px]">{bucket.riskLevel.toUpperCase()}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Upcoming Payables */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Payables</CardTitle>
                  <CardDescription>Scheduled vendor payments and high-pressure liabilities.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {upcomingPayables.map((payable) => (
                    <div key={payable.id} className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 bg-surface">
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-text-primary block">{payable.vendor}</span>
                        <span className="text-[11px] text-text-muted block">Due {payable.dueDate} · {payable.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FinancialValue value={payable.amount} className="text-xs font-bold" />
                        {payable.isHighPressure && <Badge variant="danger" className="text-[10px]">High Pressure</Badge>}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </FadeInView>
          </div>
        </div>
      </FadeIn>
    </AppPage>
  );
}
