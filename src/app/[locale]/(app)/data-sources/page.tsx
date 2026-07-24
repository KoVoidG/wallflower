'use client';

import { useState, useEffect } from 'react';
import {
  Database,
  Plus,
  Info,
  Edit,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppPage, PageHeader } from '@/components/ui/layout';
import { Card, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FinancialValue, QualityBadge, CompletenessIndicator } from '@/components/ui/domain-values';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { FadeIn, FadeInView } from '@/components/motion';
import { SnapshotModal } from '@/features/dashboard/components';
import {
  getDataWorkspaceData,
  type DataWorkspaceData,
  type MonthlySnapshotHistory,
} from '@/features/data-sources/adapters/data-sources.adapter';

export default function DataSourcesPage() {
  const [data, setData] = useState<DataWorkspaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);

  const existingMonths = ['2024-08', '2024-09', '2024-10', '2024-11', '2024-12', '2025-01'];

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDataWorkspaceData();
      setData(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load data workspace.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getDataWorkspaceData()
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load data workspace.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveSnapshot = (newSnapshot: {
    month: string;
    revenue: number;
    cashReserve: number;
    receivables: number;
    payables: number;
    debt: number;
    expenseCategories: Record<string, number>;
  }) => {
    if (!data) return;
    let totalExpenses = 0;
    Object.values(newSnapshot.expenseCategories).forEach((val) => { totalExpenses += Number(val); });

    const newHistoryItem: MonthlySnapshotHistory = {
      period: newSnapshot.month,
      revenue: Number(newSnapshot.revenue),
      expenses: totalExpenses,
      usableCash: Number(newSnapshot.cashReserve),
      receivables: Number(newSnapshot.receivables),
      quality: 'actual',
      status: 'verified',
    };

    const updatedHistory = [newHistoryItem, ...data.history.filter((h) => h.period !== newSnapshot.month)];
    setData({
      ...data,
      summary: {
        ...data.summary,
        latestReportingPeriod: newSnapshot.month,
        lastUpdated: new Date().toISOString().split('T')[0],
      },
      history: updatedHistory,
    });
    setIsSnapshotModalOpen(false);
  };

  if (loading) return <DataWorkspaceSkeleton />;
  if (error) return <ErrorState onRetry={loadData} title="Data Workspace Error" description={error} />;
  if (!data) return <EmptyState icon={<Database />} title="No Data Found" description="Record a financial snapshot to configure your business data workspace." />;

  const { summary, sources, history, missingImpacts } = data;

  return (
    <AppPage>
      <FadeIn>
        <div className="space-y-6">
          {/* Page Header */}
          <PageHeader
            title={
              <div className="flex items-center gap-2.5">
                <Database className="size-6 text-brand shrink-0" aria-hidden="true" />
                <span>Data & Connections Workspace</span>
              </div>
            }
            description="Manage business data sources, baseline financial history, completeness quality, and connection provenance."
            badge={<Badge variant="healthy" dot>Reporting Period: {summary.latestReportingPeriod}</Badge>}
            actions={
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSnapshotModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand text-white hover:bg-brand-hover transition-colors shadow-2xs cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>Record Snapshot</span>
                </button>
              </div>
            }
          />

          {/* 1. Data Status Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="p-4 space-y-1">
              <span className="text-xs text-text-muted font-medium block">Data Completeness</span>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold text-brand tabular-nums">{summary.completenessScore}%</span>
                <CompletenessIndicator score={summary.completenessScore} confidence={summary.confidenceRating} />
              </div>
              <span className="text-[11px] text-text-muted block">High confidence rating</span>
            </Card>

            <Card className="p-4 space-y-1">
              <span className="text-xs text-text-muted font-medium block">Latest Snapshot</span>
              <span className="text-lg sm:text-xl font-bold text-text-primary block">{summary.latestReportingPeriod}</span>
              <span className="text-[11px] text-text-muted block">Updated {summary.lastUpdated}</span>
            </Card>

            <Card className="p-4 space-y-1">
              <span className="text-xs text-text-muted font-medium block">Estimated Values</span>
              <span className="text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400 tabular-nums block">{summary.estimatedValueCount} Fields</span>
              <span className="text-[11px] text-text-muted block">3 values require verification</span>
            </Card>

            <Card className="p-4 space-y-1">
              <span className="text-xs text-text-muted font-medium block">Missing Fields</span>
              <span className="text-lg sm:text-xl font-bold text-text-primary tabular-nums block">{summary.missingHighImpactFields.length} High-Impact</span>
              <span className="text-[11px] text-text-muted block">See improvement guide below</span>
            </Card>
          </div>

          {/* 2. Data Sources Grid */}
          <FadeInView className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle>Connected & Available Data Sources</CardTitle>
              <Badge variant="healthy">6 Data Connectors</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sources.map((src) => {
                const isComingLater = src.status === 'coming_later';
                const isStale = src.status === 'stale';

                return (
                  <Card key={src.id} className={cn('p-4 space-y-3', isComingLater && 'opacity-70 bg-surface-subtle/40')}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={isComingLater ? 'default' : isStale ? 'warning' : 'success'} dot>
                          {isComingLater ? 'Coming Later' : isStale ? 'Stale' : 'Connected'}
                        </Badge>
                        <QualityBadge quality={src.quality} />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-text-primary leading-tight">{src.name}</h4>
                      <span className="text-[11px] text-text-muted block mt-0.5">
                        {isComingLater ? 'Planned external integration' : `Last sync: ${src.lastSync} (${src.reportingPeriod})`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                      <span className="text-text-muted">Values Contributed: <strong className="text-text-primary">{src.valuesContributed}</strong></span>
                      {!isComingLater ? (
                        <button
                          type="button"
                          onClick={() => setIsSnapshotModalOpen(true)}
                          className="text-xs font-semibold text-brand hover:text-brand-hover cursor-pointer"
                        >
                          Review Data →
                        </button>
                      ) : (
                        <span className="text-[10px] text-text-muted italic">Integration Planned</span>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </FadeInView>

          {/* 3. Monthly Snapshot History Table */}
          <FadeInView className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle>Baseline Financial History Snapshots</CardTitle>
              <button
                type="button"
                onClick={() => setIsSnapshotModalOpen(true)}
                className="text-xs font-semibold text-brand hover:underline cursor-pointer"
              >
                + Record New Snapshot
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border bg-surface">
              <table className="w-full text-left text-xs text-text-primary">
                <thead className="border-b border-border bg-surface-subtle text-text-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Reporting Period</th>
                    <th className="px-4 py-3 font-semibold">Revenue</th>
                    <th className="px-4 py-3 font-semibold">Expenses</th>
                    <th className="px-4 py-3 font-semibold">Usable Cash Reserve</th>
                    <th className="px-4 py-3 font-semibold">Receivables</th>
                    <th className="px-4 py-3 font-semibold">Data Quality</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {history.map((h) => (
                    <tr key={h.period} className="hover:bg-surface-subtle/40 transition-colors">
                      <td className="px-4 py-3 font-bold">{h.period}</td>
                      <td className="px-4 py-3 font-bold tabular-nums"><FinancialValue value={h.revenue} /></td>
                      <td className="px-4 py-3 font-bold tabular-nums"><FinancialValue value={h.expenses} /></td>
                      <td className="px-4 py-3 font-bold tabular-nums text-emerald-600 dark:text-emerald-400"><FinancialValue value={h.usableCash} /></td>
                      <td className="px-4 py-3 font-bold tabular-nums"><FinancialValue value={h.receivables} /></td>
                      <td className="px-4 py-3"><QualityBadge quality={h.quality} /></td>
                      <td className="px-4 py-3">
                        <Badge variant={h.status === 'verified' ? 'success' : 'warning'} className="text-[10px] capitalize">
                          {h.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setIsSnapshotModalOpen(true)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline cursor-pointer"
                        >
                          <Edit className="size-3" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeInView>

          {/* 4. Missing Information Improvement Guide */}
          <FadeInView>
            <Card className="p-5 space-y-4 border-brand/20 bg-brand-soft/10">
              <div className="flex items-center gap-2">
                <Info className="size-4 text-brand" />
                <CardTitle>Missing Data Feature Improvement Guide</CardTitle>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {missingImpacts.map((imp) => (
                  <div key={imp.missingField} className="p-4 rounded-xl border border-border bg-surface space-y-2">
                    <span className="font-bold text-text-primary block">{imp.missingField}</span>
                    <p className="text-text-secondary leading-relaxed">{imp.impactDescription}</p>
                    <div className="pt-2 border-t border-border/40 space-y-1">
                      <span className="text-[11px] font-semibold text-brand uppercase tracking-wider block">Improves Features:</span>
                      {imp.improvesFeatures.map((f) => (
                        <div key={f} className="text-[11px] text-text-muted flex items-center gap-1">
                          <span>•</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </FadeInView>

          {/* Snapshot Modal */}
          <SnapshotModal
            isOpen={isSnapshotModalOpen}
            onClose={() => setIsSnapshotModalOpen(false)}
            onSave={handleSaveSnapshot}
            existingMonths={existingMonths}
          />
        </div>
      </FadeIn>
    </AppPage>
  );
}

function DataWorkspaceSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-4 gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
