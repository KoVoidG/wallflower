'use client';

import { cn } from '@/lib/utils';
import { CountUp } from '@/components/motion';
import { Surface } from '@/components/ui/surface';
import type { SimulationResult } from '@/features/simulations/adapters/simulations.adapter';

interface ResultKpiRowProps {
  result: SimulationResult;
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

const KPI_CONFIG = [
  { key: 'revenue', label: 'Revenue', formatter: formatThb },
  { key: 'profit', label: 'Profit', formatter: formatThb },
  { key: 'cashRunway', label: 'Cash Runway', formatter: formatMonths },
  { key: 'workingCapital', label: 'Working Capital', formatter: formatThb },
  { key: 'roi', label: 'ROI', formatter: formatPercent },
] as const;

export function ResultKpiRow({ result, className }: ResultKpiRowProps) {
  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3', className)}>
      {KPI_CONFIG.map((kpi) => {
        const value = result[kpi.key as keyof SimulationResult];
        if (value === undefined) return null;
        const numValue = Number(value);

        return (
          <Surface key={kpi.key} border className="p-3 flex flex-col gap-1">
            <span className="text-[12px] text-text-muted">{kpi.label}</span>
            <CountUp
              to={numValue}
              decimals={kpi.key === 'cashRunway' ? 1 : 0}
              formatter={(v) => kpi.formatter(kpi.key === 'cashRunway' ? v : Math.round(v))}
              className={cn(
                'text-[20px] font-[650] tabular-nums',
                kpi.key === 'profit' || kpi.key === 'roi'
                  ? numValue >= 0 ? 'text-success' : 'text-danger'
                  : 'text-text-primary'
              )}
            />
          </Surface>
        );
      })}
    </div>
  );
}
