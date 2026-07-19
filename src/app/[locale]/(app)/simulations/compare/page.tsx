'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, BarChart3, Plus, Check, Trophy, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Surface } from '@/components/ui/surface';
import { Badge } from '@/components/ui/badge';
import { H2, H3, Body, Caption } from '@/components/ui/typography';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { FadeIn, StaggerChildren } from '@/components/motion';
import { ComparisonChart } from '@/components/charts';
import { Link } from '@/lib/i18n/navigation';
import {
  getSimulationHistory,
  getSimulation,
  type SimulationData,
  type SavedSimulation,
  type SimulationBaseline,
} from '@/features/simulations/adapters/simulations.adapter';

type MetricKey = 'revenue' | 'expenses' | 'profit' | 'cashRunway' | 'workingCapital' | 'roi';

const METRICS: MetricKey[] = ['revenue', 'expenses', 'profit', 'cashRunway', 'workingCapital', 'roi'];

type PageState = 'loading' | 'selecting' | 'comparing' | 'empty';

export default function ComparisonPage() {
  const t = useTranslations('simulations');
  const [state, setState] = useState<PageState>('loading');
  const [history, setHistory] = useState<SavedSimulation[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [simulations, setSimulations] = useState<SimulationData[]>([]);

  useEffect(() => {
    async function load() {
      const saved = await getSimulationHistory();
      setHistory(saved);
      if (saved.length < 2) {
        setState('empty');
      } else {
        setState('selecting');
      }
    }
    load();
  }, []);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }, []);

  const loadComparison = useCallback(async () => {
    setState('loading');
    const results = await Promise.all(
      selectedIds.map((id) => getSimulation(id))
    );
    setSimulations(results.filter(Boolean) as SimulationData[]);
    setState('comparing');
  }, [selectedIds]);

  if (state === 'loading') {
    return <ComparisonSkeleton />;
  }

  if (state === 'empty') {
    return (
      <FadeIn className="py-8">
        <EmptyState
          icon={<BarChart3 />}
          title={t('compare.emptyTitle')}
          description={t('compare.emptyDescription')}
          action={
            <Link
              href="/simulations/new"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-brand px-4 py-2 text-[14px] font-[550] text-white transition-colors hover:bg-brand-hover cursor-pointer"
            >
              <Plus className="size-4" aria-hidden="true" />
              {t('newSimulation')}
            </Link>
          }
        />
      </FadeIn>
    );
  }

  if (state === 'selecting') {
    return (
      <FadeIn className="space-y-6">
        <div>
          <H2>{t('compare.pageTitle')}</H2>
          <Body className="mt-1">{t('compare.selectDescription')}</Body>
        </div>

        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {history.map((sim) => {
            const isSelected = selectedIds.includes(sim.id);
            return (
              <StaggerChildren.Item key={sim.id}>
                <button
                  type="button"
                  onClick={() => toggleSelection(sim.id)}
                  className={cn(
                    'w-full text-left rounded-[var(--radius-md)] border p-4 transition-all cursor-pointer',
                    isSelected
                      ? 'border-brand bg-brand-soft/50 ring-1 ring-brand'
                      : 'border-border bg-surface hover:border-brand/50'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-[14px]/[20px] font-[550] text-text-primary">{sim.name}</p>
                    {isSelected && (
                      <span className="flex items-center justify-center size-5 rounded-full bg-brand text-white">
                        <Check className="size-3" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={sim.posture === 'bullish' ? 'success' : sim.posture === 'cautious' ? 'warning' : 'default'}>
                      {t(`posture.${sim.posture}`)}
                    </Badge>
                    <Caption>{new Date(sim.createdAt).toLocaleDateString()}</Caption>
                  </div>
                </button>
              </StaggerChildren.Item>
            );
          })}
        </StaggerChildren>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Caption>
            {t('compare.selected', { count: selectedIds.length, max: 3 })}
          </Caption>
          <button
            type="button"
            disabled={selectedIds.length < 2}
            onClick={loadComparison}
            className={cn(
              'inline-flex items-center gap-2 rounded-[var(--radius-md)] px-4 py-2 text-[14px] font-[550] text-white transition-colors cursor-pointer',
              selectedIds.length >= 2
                ? 'bg-brand hover:bg-brand-hover'
                : 'bg-brand/40 cursor-not-allowed'
            )}
          >
            {t('compare.compareButton')}
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </FadeIn>
    );
  }

  // Comparing state
  const baseline = simulations[0]?.baseline;

  return (
    <FadeIn className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <H2>{t('compare.resultsTitle')}</H2>
          <Body className="mt-1">
            {t('compare.resultsDescription', { count: simulations.length })}
          </Body>
        </div>
        <button
          type="button"
          onClick={() => setState('selecting')}
          className="text-[14px] font-[550] text-brand hover:text-brand-hover transition-colors cursor-pointer"
        >
          {t('compare.changeSelection')}
        </button>
      </div>

      {/* Comparison Table */}
      <ComparisonTable
        baseline={baseline}
        simulations={simulations}
        metrics={METRICS}
      />

      {/* Comparison Chart */}
      <Surface variant="default" border>
        <H3 className="text-[16px] mb-4">{t('compare.chartTitle')}</H3>
        <ComparisonChartView simulations={simulations} baseline={baseline} />
      </Surface>
    </FadeIn>
  );
}

// ── Comparison Table ────────────────────────────────────────────────────────

function ComparisonTable({
  baseline,
  simulations,
  metrics,
}: {
  baseline: SimulationBaseline;
  simulations: SimulationData[];
  metrics: MetricKey[];
}) {
  const t = useTranslations('simulations');

  const getBestWorst = (metric: MetricKey) => {
    const values = simulations.map((sim) => {
      const expected = sim.results.find((r) => r.caseType === 'expected');
      return expected ? (expected[metric] ?? 0) : 0;
    });
    const isLowerBetter = metric === 'expenses';
    const bestIdx = isLowerBetter
      ? values.indexOf(Math.min(...values))
      : values.indexOf(Math.max(...values));
    const worstIdx = isLowerBetter
      ? values.indexOf(Math.max(...values))
      : values.indexOf(Math.min(...values));
    return { bestIdx, worstIdx };
  };

  const formatMetricValue = (value: number | undefined, metric: MetricKey) => {
    if (value === undefined) return '—';
    if (metric === 'cashRunway') return `${value.toFixed(1)} mo`;
    if (metric === 'roi') return `${value}%`;
    return `฿${value.toLocaleString()}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-3 font-[550] text-text-primary">
              {t('metrics.revenue').replace('Revenue', 'Metric')}
            </th>
            <th className="text-right py-3 px-3 font-[550] text-text-muted">
              {t('comparison.baseline')}
            </th>
            {simulations.map((sim) => (
              <th key={sim.id} className="text-right py-3 px-3 font-[550] text-text-primary">
                {sim.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric) => {
            const { bestIdx, worstIdx } = getBestWorst(metric);
            const baselineValue = (baseline as unknown as Record<string, number | undefined>)[metric];
            return (
              <tr key={metric} className="border-b border-border/50">
                <td className="py-3 px-3 text-text-secondary font-[500]">
                  {t(`metrics.${metric}`)}
                </td>
                <td className="text-right py-3 px-3 text-text-muted tabular-nums">
                  {formatMetricValue(baselineValue, metric)}
                </td>
                {simulations.map((sim, idx) => {
                  const expected = sim.results.find((r) => r.caseType === 'expected');
                  const val = expected ? (expected[metric] ?? undefined) : undefined;
                  const isBest = idx === bestIdx;
                  const isWorst = idx === worstIdx;
                  return (
                    <td
                      key={sim.id}
                      className={cn(
                        'text-right py-3 px-3 tabular-nums font-[550]',
                        isBest && 'text-success',
                        isWorst && 'text-danger',
                        !isBest && !isWorst && 'text-text-primary'
                      )}
                    >
                      <span className="inline-flex items-center gap-1">
                        {isBest && <Trophy className="size-3 text-success" aria-label="Best" />}
                        {isWorst && <AlertTriangle className="size-3 text-danger" aria-label="Worst" />}
                        {formatMetricValue(val, metric)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Comparison Chart View ───────────────────────────────────────────────────

function ComparisonChartView({
  simulations,
  baseline,
}: {
  simulations: SimulationData[];
  baseline: SimulationBaseline;
}) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const data = months.map((month, i) => {
    const point: Record<string, unknown> = { month };
    point['baseline'] = baseline.revenue;
    simulations.forEach((sim) => {
      const expected = sim.results.find((r) => r.caseType === 'expected');
      if (expected) {
        // Simple projection: scale monthly with slight growth
        const growthFactor = 1 + (i * 0.02);
        point[sim.id] = Math.round(expected.revenue * growthFactor);
      }
    });
    return point;
  });

  const labels: Record<string, string> = { baseline: 'Current Baseline' };
  simulations.forEach((sim) => {
    labels[sim.id] = sim.name;
  });

  return (
    <ComparisonChart
      data={data}
      xKey="month"
      baselineKey="baseline"
      scenarioKeys={simulations.map((s) => s.id)}
      labels={labels}
      height={280}
      ariaLabel="Revenue comparison across scenarios"
    />
  );
}

// ── Skeleton ────────────────────────────────────────────────────────────────

function ComparisonSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading comparison">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-5 w-80" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-[var(--radius-md)]" />
        ))}
      </div>
    </div>
  );
}
