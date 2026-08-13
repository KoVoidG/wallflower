// src/features/simulations/components/workspace/baseline-section.tsx
// Compact read-only row showing current business baseline metrics.
'use client';

import { cn } from '@/lib/utils';
import { BUSINESS_BASELINE, formatCurrency } from '../../engine/business-baseline';

export function BaselineSection() {
  const baseline = BUSINESS_BASELINE;

  const metrics = [
    { label: 'Monthly Revenue', value: formatCurrency(baseline.monthlyRevenue) },
    { label: 'Gross Margin', value: `${baseline.grossMarginPercent.toFixed(1)}%` },
    { label: 'Monthly Profit', value: formatCurrency(baseline.monthlyProfit) },
    { label: 'Cash Balance', value: formatCurrency(baseline.cashBalance) },
    { label: 'Cash Runway', value: `${baseline.cashRunwayMonths.toFixed(1)} months` },
  ];

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="size-7 rounded-lg bg-[#6366F1]/10 dark:bg-[#6366F1]/20 flex items-center justify-center shrink-0">
          <span className="text-xs font-extrabold text-[#6366F1] dark:text-[#A5B4FC]">3</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">Current Business Baseline</h3>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            These values come from your latest business data.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className={cn(
        'grid grid-cols-2 sm:grid-cols-5 gap-px rounded-2xl overflow-hidden',
        'border border-slate-200/80 dark:border-[#1E2638] shadow-xs',
      )}>
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-white dark:bg-[#111622] px-4 py-3.5 space-y-1"
          >
            <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium block">
              {metric.label}
            </span>
            <span className="text-sm font-bold font-mono text-[#0F172A] dark:text-white block tabular-nums">
              {metric.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
