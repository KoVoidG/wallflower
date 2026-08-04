'use client';

import { Sparkles, TrendingUp } from 'lucide-react';

export function ProductPreview() {
  return (
    <div className="rounded-2xl border-2 border-border-strong bg-surface p-5 md:p-6 shadow-2xl space-y-5 text-left transition-all">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-emerald-500" />
          <span className="font-display text-sm font-bold text-text-primary">Overview</span>
        </div>
        <span className="text-xs font-bold text-text-muted">Live Prototype</span>
      </div>

      {/* Top 2 Cards: Business Health & AI Executive Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Business Health Gauge Card */}
        <div className="p-4 rounded-xl border border-border bg-surface-subtle space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">Business Health</span>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">84</span>
            <span className="text-xs font-bold text-text-muted">/100</span>
            <span className="ml-auto text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">Good</span>
          </div>
          <p className="text-[11px] text-text-muted font-medium">+12 vs last month</p>
        </div>

        {/* AI Executive Summary Card */}
        <div className="p-4 rounded-xl border border-border bg-surface-subtle space-y-2">
          <div className="flex items-center gap-1.5 text-tertiary">
            <Sparkles className="size-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-wider block">AI Executive Summary</span>
          </div>
          <p className="text-xs text-text-secondary font-medium leading-snug line-clamp-2">
            Revenue is up 12% this month, driven by higher sales in Beverages and Snacks.
          </p>
          <span className="inline-block text-[11px] font-bold text-tertiary hover:underline cursor-pointer">
            View Full Report →
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3 text-left">
        <div className="p-3.5 rounded-xl border border-border bg-surface-subtle space-y-1">
          <span className="text-[11px] font-bold text-text-muted block">Revenue (This Month)</span>
          <span className="font-display text-sm sm:text-base font-extrabold text-text-primary block">฿1,280,000</span>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">+12.5% vs last month</span>
        </div>

        <div className="p-3.5 rounded-xl border border-border bg-surface-subtle space-y-1">
          <span className="text-[11px] font-bold text-text-muted block">Net Profit</span>
          <span className="font-display text-sm sm:text-base font-extrabold text-text-primary block">฿163,000</span>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">+18.3% vs last month</span>
        </div>

        <div className="p-3.5 rounded-xl border border-border bg-surface-subtle space-y-1">
          <span className="text-[11px] font-bold text-text-muted block">Cash Runway</span>
          <span className="font-display text-sm sm:text-base font-extrabold text-text-primary block">5.1 months</span>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">+0.9 vs last month</span>
        </div>
      </div>

      {/* Revenue Trend SVG Line Chart */}
      <div className="p-4 rounded-xl border border-border bg-surface-subtle space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
            <TrendingUp className="size-4 text-emerald-500" />
            <span>Revenue Trend</span>
          </span>
          <span className="text-[11px] font-bold text-text-muted">This Year ▾</span>
        </div>

        <div className="h-28 w-full pt-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 400 80" preserveAspectRatio="none">
            <defs>
              <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M0 60 Q 50 50, 100 45 T 200 30 T 300 20 T 400 10 L 400 80 L 0 80 Z"
              fill="url(#heroGradient)"
            />
            <path
              d="M0 60 Q 50 50, 100 45 T 200 30 T 300 20 T 400 10"
              fill="none"
              stroke="#10B981"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Dots */}
            <circle cx="100" cy="45" r="4" fill="#10B981" />
            <circle cx="200" cy="30" r="4" fill="#10B981" />
            <circle cx="300" cy="20" r="4" fill="#10B981" />
            <circle cx="400" cy="10" r="4" fill="#10B981" />
          </svg>
        </div>

        <div className="flex justify-between text-[10px] font-bold text-text-muted px-1">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
          <span>Aug</span>
        </div>
      </div>
    </div>
  );
}
