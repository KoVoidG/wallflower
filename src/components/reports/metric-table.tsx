// src/components/reports/metric-table.tsx
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReportMetrics as ReportMetricsData } from '@/features/reports/adapters/reports.adapter';

interface MetricTableProps {
  data: ReportMetricsData;
  className?: string;
}

export function MetricTable({ data, className }: MetricTableProps) {
  return (
    <section
      className={cn('py-10 md:py-12 border-b border-border', className)}
      aria-labelledby="metrics-heading"
    >
      <h2
        id="metrics-heading"
        className="text-[28px]/[36px] font-[650] text-text-primary mb-6"
      >
        Key Metrics
      </h2>

      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full min-w-[480px]">
          <thead>
            <tr className="border-b border-border-strong">
              <th className="text-left text-[13px]/[18px] font-[550] text-text-muted py-3 pr-4">
                Metric
              </th>
              <th className="text-right text-[13px]/[18px] font-[550] text-text-muted py-3 px-4">
                Value
              </th>
              <th className="text-right text-[13px]/[18px] font-[550] text-text-muted py-3 pl-4">
                Change
              </th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((metric) => (
              <tr key={metric.label} className="border-b border-border">
                <td className="text-[15px]/[24px] font-normal text-text-primary py-3 pr-4">
                  {metric.label}
                </td>
                <td className="text-right text-[14px]/[20px] font-[550] text-text-primary tabular-nums py-3 px-4">
                  {metric.formatted}
                </td>
                <td className="text-right py-3 pl-4">
                  {metric.change != null && (
                    <ChangeIndicator
                      change={metric.change}
                      direction={metric.changeDirection}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ChangeIndicator({
  change,
  direction,
}: {
  change: number;
  direction?: 'up' | 'down' | 'flat';
}) {
  const isPositive = direction === 'up';
  const isNegative = direction === 'down';

  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;
  const colorClass = isPositive
    ? 'text-success'
    : isNegative
      ? 'text-danger'
      : 'text-text-muted';

  return (
    <span className={cn('inline-flex items-center gap-1 text-[13px]/[18px] font-[550] tabular-nums', colorClass)}>
      <Icon className="size-3.5" aria-hidden="true" />
      {Math.abs(change).toFixed(1)}%
    </span>
  );
}
