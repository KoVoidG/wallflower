// src/features/dashboard/components/trend-chart-section.tsx
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Surface } from '@/components/ui/surface';
import { H3, Caption } from '@/components/ui/typography';
import { LineChart } from '@/components/charts';
import { formatThbAxis } from '@/components/charts';
import { formatBaht } from '@/lib/calculations/money';
import type { TrendDataPoint } from '../adapters/dashboard.adapter';

interface TrendChartSectionProps {
  data: TrendDataPoint[];
  className?: string;
}

const lines = [
  { key: 'revenue', label: 'Revenue', color: 'var(--brand)' },
  { key: 'expenses', label: 'Expenses', color: 'var(--warning)' },
  { key: 'profit', label: 'Profit', color: 'var(--success)' },
  { key: 'cashFlow', label: 'Cash Flow', color: 'var(--info)' },
];

export function TrendChartSection({ data, className }: TrendChartSectionProps) {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  return (
    <Surface border className={cn('flex flex-col gap-3 p-5', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-baseline gap-2">
          <H3 className="text-[18px]/[24px]">Financial Trends</H3>
          <Caption>Last 6 months</Caption>
        </div>

        {/* Chart/Table segmented control */}
        <div className="flex items-center gap-1 bg-surface-subtle p-1 rounded-lg border border-border print:hidden" role="tablist" aria-label="View format">
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'chart'}
            onClick={() => setViewMode('chart')}
            className={cn(
              'px-3 py-1 text-[12px] font-medium rounded-md transition-colors cursor-pointer',
              viewMode === 'chart'
                ? 'bg-brand text-white'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            Chart
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'table'}
            onClick={() => setViewMode('table')}
            className={cn(
              'px-3 py-1 text-[12px] font-medium rounded-md transition-colors cursor-pointer',
              viewMode === 'table'
                ? 'bg-brand text-white'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            Table
          </button>
        </div>
      </div>

      {/* Chart View */}
      <div className={cn(viewMode === 'chart' ? 'block' : 'hidden', 'print:hidden w-full h-[280px]')}>
        <LineChart
          data={data as unknown as Record<string, unknown>[]}
          lines={lines}
          xKey="month"
          height={280}
          formatY={formatThbAxis}
          showGrid
          showLegend
          ariaLabel="Financial trends over the last 6 months showing revenue, expenses, profit, and cash flow"
        />
      </div>

      {/* Table View (shown dynamically, and always visible on print) */}
      <div className={cn(viewMode === 'table' ? 'block' : 'hidden', 'print:block w-full overflow-x-auto')}>
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-text-muted">
              <th className="py-2 px-3 font-semibold">Month</th>
              <th className="py-2 px-3 font-semibold text-right">Revenue</th>
              <th className="py-2 px-3 font-semibold text-right">Expenses</th>
              <th className="py-2 px-3 font-semibold text-right">Profit</th>
              <th className="py-2 px-3 font-semibold text-right">Cash Flow</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.month} className="border-b border-border/60 hover:bg-surface-subtle/50 text-text-primary">
                <td className="py-2.5 px-3 font-medium">{row.month}</td>
                <td className="py-2.5 px-3 text-right tabular-nums">{formatBaht(row.revenue, true)}</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-warning">{formatBaht(row.expenses, true)}</td>
                <td className={cn(
                  'py-2.5 px-3 text-right tabular-nums font-medium',
                  row.profit >= 0 ? 'text-success' : 'text-danger'
                )}>
                  {formatBaht(row.profit, true)}
                </td>
                <td className="py-2.5 px-3 text-right tabular-nums text-info">{formatBaht(row.cashFlow, true)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Surface>
  );
}

