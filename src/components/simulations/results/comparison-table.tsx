'use client';

import { cn } from '@/lib/utils';
import { Surface } from '@/components/ui/surface';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { SimulationResult, SimulationBaseline } from '@/features/simulations/adapters/simulations.adapter';

interface ComparisonTableProps {
  baseline: SimulationBaseline;
  result: SimulationResult;
  className?: string;
}

function formatThb(value: number): string {
  return `฿${value.toLocaleString('en-US')}`;
}

interface MetricRow {
  label: string;
  baselineValue: number;
  projectedValue: number;
  unit: 'thb' | 'months';
}

export function ComparisonTable({ baseline, result, className }: ComparisonTableProps) {
  const metrics: MetricRow[] = [
    { label: 'Revenue', baselineValue: baseline.revenue, projectedValue: result.revenue, unit: 'thb' },
    { label: 'Expenses', baselineValue: baseline.expenses, projectedValue: result.expenses, unit: 'thb' },
    { label: 'Profit', baselineValue: baseline.profit, projectedValue: result.profit, unit: 'thb' },
    { label: 'Cash Runway', baselineValue: baseline.cashRunway, projectedValue: result.cashRunway, unit: 'months' },
    { label: 'Working Capital', baselineValue: baseline.workingCapital, projectedValue: result.workingCapital, unit: 'thb' },
  ];

  return (
    <Surface border className={cn('overflow-hidden', className)}>
      <div className="px-4 py-3 border-b border-border">
        <span className="text-[15px] font-[600] text-text-primary">Baseline vs Projected</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="border-b border-border bg-surface-subtle">
              <th className="text-left px-4 py-2.5 font-[550] text-text-muted">Metric</th>
              <th className="text-right px-4 py-2.5 font-[550] text-text-muted">Baseline</th>
              <th className="text-right px-4 py-2.5 font-[550] text-text-muted">Projected</th>
              <th className="text-right px-4 py-2.5 font-[550] text-text-muted">Change</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => {
              const diff = metric.projectedValue - metric.baselineValue;
              const isExpenseRow = metric.label === 'Expenses';
              const isPositive = isExpenseRow ? diff < 0 : diff > 0;
              const isNeutral = diff === 0;
              const ChangeIcon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
              const changeColor = isNeutral ? 'text-text-muted' : isPositive ? 'text-success' : 'text-danger';

              const format = metric.unit === 'thb' ? formatThb : (v: number) => `${v.toFixed(1)} mo`;

              return (
                <tr key={metric.label} className="border-b border-border last:border-0">
                  <td className="px-4 py-2.5 font-[500] text-text-primary">{metric.label}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-text-secondary">
                    {format(metric.baselineValue)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums font-[550] text-text-primary">
                    {format(metric.projectedValue)}
                  </td>
                  <td className={cn('px-4 py-2.5 text-right tabular-nums font-[550]', changeColor)}>
                    <span className="inline-flex items-center gap-1">
                      <ChangeIcon className="size-3.5" aria-hidden="true" />
                      {metric.unit === 'thb'
                        ? (diff > 0 ? '+' : '') + formatThb(diff)
                        : (diff > 0 ? '+' : '') + diff.toFixed(1) + ' mo'
                      }
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Surface>
  );
}
