// src/features/simulations/components/workspace/simulation-preview.tsx
// Sticky right-side preview panel with real-time projected metrics.
'use client';

import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Lightbulb, Sparkles } from 'lucide-react';
import { formatPercent, formatMonths } from '../../engine/business-baseline';
import type { SimulationPreview as SimulationPreviewData } from '../../engine/simulation-engine';

interface SimulationPreviewProps {
  preview: SimulationPreviewData;
  timeHorizonMonths: number;
}

export function SimulationPreview({ preview, timeHorizonMonths }: SimulationPreviewProps) {
  const outlookConfig = {
    positive: {
      label: 'Positive',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-200 dark:border-emerald-800/40',
      text: 'text-emerald-700 dark:text-emerald-400',
      dot: 'bg-emerald-500',
    },
    neutral: {
      label: 'Neutral',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-200 dark:border-amber-800/40',
      text: 'text-amber-700 dark:text-amber-400',
      dot: 'bg-amber-500',
    },
    negative: {
      label: 'Negative',
      bg: 'bg-red-50 dark:bg-red-950/30',
      border: 'border-red-200 dark:border-red-800/40',
      text: 'text-red-700 dark:text-red-400',
      dot: 'bg-red-500',
    },
  };

  const outlookStyle = outlookConfig[preview.outlook];

  const projectedMetrics = [
    {
      label: 'Revenue',
      change: formatPercent(preview.revenueChangePercent),
      isPositive: preview.revenueChangePercent >= 0,
    },
    {
      label: 'Profit (Monthly)',
      change: formatPercent(preview.profitChangePercent),
      isPositive: preview.profitChangePercent >= 0,
    },
    {
      label: 'Cash Balance',
      change: formatPercent(preview.cashBalanceChangePercent),
      isPositive: preview.cashBalanceChangePercent >= 0,
    },
    {
      label: 'Cash Runway',
      change: formatMonths(preview.cashRunwayChangeMonths),
      isPositive: preview.cashRunwayChangeMonths >= 0,
    },
  ];

  return (
    <div className={cn(
      'rounded-2xl border border-slate-200/80 dark:border-[#1E2638]',
      'bg-white dark:bg-[#111622] shadow-xs overflow-hidden',
    )}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-[#1E2638]">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-[#8B5CF6]" />
          <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">Simulation Preview</h3>
        </div>
        <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
          This is a rough estimate based on your inputs.
        </p>
      </div>

      {/* Projected Impact */}
      <div className="px-5 py-4 space-y-3 border-b border-slate-100 dark:border-[#1E2638]">
        <h4 className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">
          Projected Impact ({timeHorizonMonths} Months)
        </h4>
        <div className="space-y-2.5">
          {projectedMetrics.map((metric) => (
            <div key={metric.label} className="flex items-center justify-between">
              <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">
                {metric.label}
              </span>
              <span className={cn(
                'text-sm font-bold font-mono tabular-nums',
                metric.isPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-500 dark:text-red-400',
              )}>
                {metric.change}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[#94A3B8] dark:text-[#475569] italic pt-1">
          Actual results may vary based on real-world factors and execution.
        </p>
      </div>

      {/* Overall Outlook */}
      <div className={cn(
        'mx-5 my-4 px-4 py-3.5 rounded-xl border',
        outlookStyle.bg,
        outlookStyle.border,
      )}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">Overall Outlook</h4>
          <span className={cn('inline-flex items-center gap-1.5 text-xs font-bold', outlookStyle.text)}>
            <span className={cn('size-1.5 rounded-full', outlookStyle.dot)} />
            {outlookStyle.label}
          </span>
        </div>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
          {preview.outlookExplanation}
        </p>
      </div>

      {/* What's Driving the Impact */}
      <div className="px-5 py-4 border-t border-slate-100 dark:border-[#1E2638] space-y-3">
        <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">
          What&apos;s Driving the Impact?
        </h4>
        <ul className="space-y-2">
          {preview.drivers.positive.map((driver, i) => (
            <li key={`pos-${i}`} className="flex items-start gap-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
              <TrendingUp className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{driver}</span>
            </li>
          ))}
          {preview.drivers.negative.map((driver, i) => (
            <li key={`neg-${i}`} className="flex items-start gap-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
              <TrendingDown className="size-3.5 text-red-400 shrink-0 mt-0.5" />
              <span>{driver}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tip */}
      <div className="mx-5 mb-5 px-4 py-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0B0F17] border border-slate-200/60 dark:border-[#1E2638]">
        <div className="flex items-start gap-2">
          <Lightbulb className="size-3.5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="text-[11px] font-bold text-[#0F172A] dark:text-white">Tip</span>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              {preview.tip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
