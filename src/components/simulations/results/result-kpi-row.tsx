'use client';

import { cn } from '@/lib/utils';
import { CountUp } from '@/components/motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Caption } from '@/components/ui/typography';
import type { SimulationResult, SimulationBaseline } from '@/features/simulations/adapters/simulations.adapter';

interface ResultKpiRowProps {
  result: SimulationResult;
  baseline?: SimulationBaseline;
  className?: string;
}

function formatThb(value: number): string {
  if (Math.abs(value) >= 1000000) {
    return `฿${(value / 1000000).toFixed(1)}M`;
  }
  return `฿${value.toLocaleString('en-US')}`;
}

function formatMonths(value: number): string {
  return `${value.toFixed(1)} mo`;
}

function formatPercent(value: number): string {
  return `${value > 0 ? '+' : ''}${value}%`;
}

interface KpiItem {
  key: keyof SimulationResult;
  label: string;
  formatter: (v: number) => string;
  baselineKey?: keyof SimulationBaseline;
  invertPositive?: boolean;
}

const KPI_CONFIG: KpiItem[] = [
  { key: 'revenue', label: 'Revenue', formatter: formatThb, baselineKey: 'revenue' },
  { key: 'profit', label: 'Profit', formatter: formatThb, baselineKey: 'profit' },
  { key: 'cashRunway', label: 'Cash Runway', formatter: formatMonths, baselineKey: 'cashRunway' },
  { key: 'workingCapital', label: 'Working Capital', formatter: formatThb, baselineKey: 'workingCapital' },
  { key: 'roi', label: 'ROI', formatter: formatPercent },
];

export function ResultKpiRow({ result, baseline, className }: ResultKpiRowProps) {
  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3', className)}>
      {KPI_CONFIG.map((kpi) => {
        const value = result[kpi.key];
        if (value === undefined) return null;
        const numValue = Number(value);
        const baselineValue = baseline && kpi.baselineKey ? Number(baseline[kpi.baselineKey]) : undefined;
        const delta = baselineValue !== undefined ? numValue - baselineValue : undefined;
        const isPositive = delta !== undefined ? (kpi.invertPositive ? delta < 0 : delta > 0) : false;
        const isNeutral = delta === 0;

        const ChangeIcon = isNeutral || delta === undefined ? Minus : isPositive ? TrendingUp : TrendingDown;
        const changeColor = isNeutral || delta === undefined ? 'text-text-muted' : isPositive ? 'text-success' : 'text-danger';

        return (
          <div
            key={kpi.key}
            className="rounded-[var(--radius-md)] border border-border bg-surface p-3.5 flex flex-col gap-1.5"
            role="group"
            aria-label={kpi.label}
          >
            <Caption>{kpi.label}</Caption>
            <CountUp
              to={numValue}
              decimals={kpi.key === 'cashRunway' ? 1 : 0}
              formatter={(v) => kpi.formatter(kpi.key === 'cashRunway' ? v : Math.round(v))}
              className={cn(
                'text-[20px]/[26px] font-[650] tabular-nums',
                kpi.key === 'profit' || kpi.key === 'roi'
                  ? numValue >= 0 ? 'text-success' : 'text-danger'
                  : 'text-text-primary'
              )}
            />
            {delta !== undefined && (
              <div className={cn('flex items-center gap-1 text-[12px] font-[550]', changeColor)}>
                <ChangeIcon className="size-3" aria-hidden="true" />
                <span className="tabular-nums">
                  {kpi.key === 'cashRunway'
                    ? `${delta > 0 ? '+' : ''}${delta.toFixed(1)} mo`
                    : kpi.key === 'roi'
                      ? `${delta > 0 ? '+' : ''}${delta}%`
                      : `${delta > 0 ? '+' : ''}${formatThb(delta)}`
                  }
                </span>
                <span className="text-text-muted font-normal">vs baseline</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
