// src/features/business-health/components/unit-economics-view.tsx
'use client';

import {
  TrendingUp,
  Tag,
  ShoppingCart,
  UserCheck,
  Box,
  Calendar,
  MoreHorizontal,
  Percent,
  Wallet,
  Lightbulb,
  CheckSquare,
  AlertTriangle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FadeInView } from '@/components/motion';
import { useAdvisorDrawer } from '@/features/advisor/context/advisor-drawer-context';

export function UnitEconomicsView() {
  const { openDrawer } = useAdvisorDrawer();
  return (
    <div className="space-y-6">
      {/* Assumption Categories Section Title */}
      <FadeInView offset={12}>
        <h3 className="font-display text-base font-bold text-[#0F172A] dark:text-white">
          Assumption Categories
        </h3>
      </FadeInView>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── LEFT COLUMN (8 Cols) ─────────────────────────────────── */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Assumption Categories Grid (B&W default, colored on hover) */}
          <FadeInView offset={14}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. Growth & Demand */}
              <Card className="p-5 flex flex-col justify-between space-y-3 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs hover:shadow-md hover:-translate-y-1 hover:border-[#6366F1]/50 transition-all duration-200 group cursor-pointer">
                <div className="space-y-2">
                  <div className="size-8 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white border border-slate-200 dark:border-[#2A344A] flex items-center justify-center group-hover:bg-[#6366F1]/10 dark:group-hover:bg-[#6366F1]/20 group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:border-[#6366F1]/40 transition-all">
                    <TrendingUp className="size-4" />
                  </div>
                  <h4 className="font-display text-sm font-semibold text-[#0F172A] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] transition-colors">
                    Growth & Demand
                  </h4>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                    Assumptions about revenue growth, customer demand, and
                    market conditions.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#1E2638] text-xs">
                  <div className="flex items-center gap-1.5 text-[#64748B] dark:text-[#94A3B8] font-medium">
                    <span className="size-1.5 rounded-full bg-[#6366F1]" />
                    <span>2 updated</span>
                  </div>
                </div>
              </Card>

              {/* 2. Pricing */}
              <Card className="p-5 flex flex-col justify-between space-y-3 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs hover:shadow-md hover:-translate-y-1 hover:border-[#6366F1]/50 transition-all duration-200 group cursor-pointer">
                <div className="space-y-2">
                  <div className="size-8 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white border border-slate-200 dark:border-[#2A344A] flex items-center justify-center group-hover:bg-[#6366F1]/10 dark:group-hover:bg-[#6366F1]/20 group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:border-[#6366F1]/40 transition-all">
                    <Tag className="size-4" />
                  </div>
                  <h4 className="font-display text-sm font-semibold text-[#0F172A] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] transition-colors">
                    Pricing
                  </h4>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                    Assumptions about pricing strategy and expected price
                    changes.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#1E2638] text-xs">
                  <div className="flex items-center gap-1.5 text-[#64748B] dark:text-[#94A3B8] font-medium">
                    <span className="size-1.5 rounded-full bg-[#6366F1]" />
                    <span>1 updated</span>
                  </div>
                </div>
              </Card>

              {/* 3. Costs & Expenses */}
              <Card className="p-5 flex flex-col justify-between space-y-3 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs hover:shadow-md hover:-translate-y-1 hover:border-[#6366F1]/50 transition-all duration-200 group cursor-pointer">
                <div className="space-y-2">
                  <div className="size-8 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white border border-slate-200 dark:border-[#2A344A] flex items-center justify-center group-hover:bg-[#6366F1]/10 dark:group-hover:bg-[#6366F1]/20 group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:border-[#6366F1]/40 transition-all">
                    <ShoppingCart className="size-4" />
                  </div>
                  <h4 className="font-display text-sm font-semibold text-[#0F172A] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] transition-colors">
                    Costs & Expenses
                  </h4>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                    Assumptions about cost increases and operating expense
                    behavior.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#1E2638] text-xs">
                  <div className="flex items-center gap-1.5 text-[#64748B] dark:text-[#94A3B8] font-medium">
                    <span className="size-1.5 rounded-full bg-[#6366F1]" />
                    <span>3 updated</span>
                  </div>
                </div>
              </Card>

              {/* 4. Payroll & People */}
              <Card className="p-5 flex flex-col justify-between space-y-3 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs hover:shadow-md hover:-translate-y-1 hover:border-[#6366F1]/50 transition-all duration-200 group cursor-pointer">
                <div className="space-y-2">
                  <div className="size-8 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white border border-slate-200 dark:border-[#2A344A] flex items-center justify-center group-hover:bg-[#6366F1]/10 dark:group-hover:bg-[#6366F1]/20 group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:border-[#6366F1]/40 transition-all">
                    <UserCheck className="size-4" />
                  </div>
                  <h4 className="font-display text-sm font-semibold text-[#0F172A] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] transition-colors">
                    Payroll & People
                  </h4>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                    Assumptions about headcount, salary growth, and hiring
                    plans.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#1E2638] text-xs">
                  <div className="flex items-center gap-1.5 text-[#64748B] dark:text-[#94A3B8] font-medium">
                    <span className="size-1.5 rounded-full bg-[#6366F1]" />
                    <span>1 updated</span>
                  </div>
                </div>
              </Card>

              {/* 5. Inventory & Supply */}
              <Card className="p-5 flex flex-col justify-between space-y-3 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs hover:shadow-md hover:-translate-y-1 hover:border-[#6366F1]/50 transition-all duration-200 group cursor-pointer">
                <div className="space-y-2">
                  <div className="size-8 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white border border-slate-200 dark:border-[#2A344A] flex items-center justify-center group-hover:bg-[#6366F1]/10 dark:group-hover:bg-[#6366F1]/20 group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:border-[#6366F1]/40 transition-all">
                    <Box className="size-4" />
                  </div>
                  <h4 className="font-display text-sm font-semibold text-[#0F172A] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] transition-colors">
                    Inventory & Supply
                  </h4>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                    Assumptions about inventory investment and supplier
                    conditions.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#1E2638] text-xs">
                  <div className="flex items-center gap-1.5 text-[#64748B] dark:text-[#94A3B8] font-medium">
                    <span className="size-1.5 rounded-full bg-[#6366F1]" />
                    <span>2 updated</span>
                  </div>
                </div>
              </Card>

              {/* 6. Seasonality */}
              <Card className="p-5 flex flex-col justify-between space-y-3 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs hover:shadow-md hover:-translate-y-1 hover:border-[#6366F1]/50 transition-all duration-200 group cursor-pointer">
                <div className="space-y-2">
                  <div className="size-8 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white border border-slate-200 dark:border-[#2A344A] flex items-center justify-center group-hover:bg-[#6366F1]/10 dark:group-hover:bg-[#6366F1]/20 group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:border-[#6366F1]/40 transition-all">
                    <Calendar className="size-4" />
                  </div>
                  <h4 className="font-display text-sm font-semibold text-[#0F172A] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] transition-colors">
                    Seasonality
                  </h4>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                    Assumptions about seasonal sales spikes and festive periods.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#1E2638] text-xs">
                  <div className="flex items-center gap-1.5 text-[#64748B] dark:text-[#94A3B8] font-medium">
                    <span className="size-1.5 rounded-full bg-[#6366F1]" />
                    <span>1 updated</span>
                  </div>
                </div>
              </Card>
            </div>
          </FadeInView>

          {/* 2. Key Assumptions Summary Table Card (B&W icons with row-hover effect) */}
          <FadeInView offset={16}>
            <Card className="p-6 space-y-4 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
              <h3 className="font-display text-base font-bold text-[#0F172A] dark:text-white">
                Key Assumptions Summary
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 dark:border-[#1E2638] text-[#64748B] dark:text-[#94A3B8]">
                    <tr>
                      <th className="py-2.5 font-medium">Assumption</th>
                      <th className="py-2.5 font-medium text-center">Value</th>
                      <th className="py-2.5 font-medium text-center">Trend</th>
                      <th className="py-2.5 font-medium text-center">
                        Confidence
                      </th>
                      <th className="py-2.5 font-medium text-right">Updated</th>
                      <th className="py-2.5 font-medium text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#1E2638]">
                    {[
                      {
                        name: 'Revenue Growth (Annual)',
                        val: '8.0%',
                        trend: '▲ +1.0%',
                        trendColor:
                          'text-emerald-600 dark:text-emerald-400 font-semibold',
                        conf: 'High',
                        confVariant: 'success' as const,
                        date: 'May 12, 2024',
                        icon: TrendingUp,
                      },
                      {
                        name: 'Average Price Change',
                        val: '2.0%',
                        trend: '- 0.0%',
                        trendColor:
                          'text-slate-400 dark:text-slate-500 font-mono',
                        conf: 'Medium',
                        confVariant: 'warning' as const,
                        date: 'May 10, 2024',
                        icon: Tag,
                      },
                      {
                        name: 'COGS Increase',
                        val: '5.0%',
                        trend: '▲ +1.5%',
                        trendColor:
                          'text-emerald-600 dark:text-emerald-400 font-semibold',
                        conf: 'Medium',
                        confVariant: 'warning' as const,
                        date: 'May 11, 2024',
                        icon: ShoppingCart,
                      },
                      {
                        name: 'Payroll Growth',
                        val: '6.0%',
                        trend: '- 0.0%',
                        trendColor:
                          'text-slate-400 dark:text-slate-500 font-mono',
                        conf: 'High',
                        confVariant: 'success' as const,
                        date: 'May 8, 2024',
                        icon: UserCheck,
                      },
                      {
                        name: 'Inflation Rate (Expected)',
                        val: '2.5%',
                        trend: '▲ +0.5%',
                        trendColor:
                          'text-emerald-600 dark:text-emerald-400 font-semibold',
                        conf: 'Medium',
                        confVariant: 'warning' as const,
                        date: 'May 6, 2024',
                        icon: Percent,
                      },
                      {
                        name: 'Supplier Cost Increase',
                        val: '3.0%',
                        trend: '▲ +0.5%',
                        trendColor:
                          'text-emerald-600 dark:text-emerald-400 font-semibold',
                        conf: 'Medium',
                        confVariant: 'warning' as const,
                        date: 'May 9, 2024',
                        icon: Box,
                      },
                      {
                        name: 'Inventory Investment Growth',
                        val: '5.0%',
                        trend: '▼ -1.0%',
                        trendColor:
                          'text-rose-600 dark:text-rose-400 font-semibold',
                        conf: 'Low',
                        confVariant: 'danger' as const,
                        date: 'May 7, 2024',
                        icon: Box,
                      },
                      {
                        name: 'Target Cash Runway',
                        val: '6.0 mo',
                        trend: '- 0.0 mo',
                        trendColor:
                          'text-slate-400 dark:text-slate-500 font-mono',
                        conf: 'High',
                        confVariant: 'success' as const,
                        date: 'May 5, 2024',
                        icon: Wallet,
                      },
                    ].map((row) => {
                      const IconComponent = row.icon;
                      return (
                        <tr
                          key={row.name}
                          className="group/row hover:bg-slate-50 dark:hover:bg-[#1E2638]/40 transition-colors"
                        >
                          <td className="py-3 font-medium text-[#0F172A] dark:text-white flex items-center gap-2">
                            <span className="size-6 rounded-md bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white border border-slate-200 dark:border-[#2A344A] flex items-center justify-center shrink-0 group-hover/row:bg-[#6366F1]/10 dark:group-hover/row:bg-[#6366F1]/20 group-hover/row:text-[#4F46E5] dark:group-hover/row:text-[#A5B4FC] group-hover/row:border-[#6366F1]/40 transition-all">
                              <IconComponent className="size-3.5" />
                            </span>
                            <span className="group-hover/row:text-[#4F46E5] dark:group-hover/row:text-[#A5B4FC] transition-colors">
                              {row.name}
                            </span>
                          </td>
                          <td className="py-3 text-center font-mono font-semibold text-[#0F172A] dark:text-white">
                            {row.val}
                          </td>
                          <td
                            className={`py-3 text-center font-mono ${row.trendColor}`}
                          >
                            {row.trend}
                          </td>
                          <td className="py-3 text-center">
                            <Badge
                              variant={row.confVariant}
                              className={
                                row.conf === 'High'
                                  ? 'text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 font-bold'
                                  : row.conf === 'Medium'
                                    ? 'text-[10px] px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 font-bold'
                                    : 'text-[10px] px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 font-bold'
                              }
                            >
                              {row.conf}
                            </Badge>
                          </td>
                          <td className="py-3 text-right text-[#64748B] dark:text-[#94A3B8]">
                            {row.date}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              type="button"
                              className="text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white p-1 cursor-pointer transition-colors"
                            >
                              <MoreHorizontal className="size-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </FadeInView>

          {/* 3. Bottom Sensitivity Analysis Banner */}
          <FadeInView offset={18}>
            <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#111622] border border-slate-200/80 dark:border-[#1E2638] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center shrink-0">
                  <Lightbulb className="size-4" />
                </div>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Your assumptions directly affect simulation results. Review
                  them regularly to keep your forecasts accurate.
                </p>
              </div>

              <Link
                href="/simulations?tab=workspace"
                className="shrink-0 px-4 py-2 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#141C2E] text-[#0F172A] dark:text-white hover:bg-[#6366F1]/10 dark:hover:bg-[#6366F1]/20 hover:border-[#6366F1]/40 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
              >
                <TrendingUp className="size-3.5 text-[#6366F1]" />
                <span>Run Sensitivity Analysis</span>
              </Link>
            </div>
          </FadeInView>
        </div>

        {/* ── RIGHT COLUMN (4 Cols) ────────────────────────────────── */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. Assumptions Overview Card (Color-coded by Good / Warning / Total Hierarchy) */}
          <FadeInView offset={14}>
            <Card className="p-6 space-y-4 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
              <h3 className="font-display text-base font-bold text-[#0F172A] dark:text-white">
                Assumptions Overview
              </h3>

              <div className="space-y-3">
                {/* 1. Good Status: Assumptions Confirmed (Green) */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/60 transition-all">
                  <div className="size-9 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-300/80 dark:border-emerald-700/60 flex items-center justify-center shrink-0">
                    <UserCheck className="size-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                        Assumptions Confirmed
                      </p>
                      <span className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
                        9
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 font-medium">
                      High confidence
                    </p>
                  </div>
                </div>

                {/* 2. Needs Attention: Need Review (Amber Caution) */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800/60 transition-all">
                  <div className="size-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-300/80 dark:border-amber-700/60 flex items-center justify-center shrink-0">
                    <AlertTriangle className="size-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                        Need Review
                      </p>
                      <span className="font-mono text-base font-bold text-amber-600 dark:text-amber-400">
                        3
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 font-medium">
                      Medium or low confidence
                    </p>
                  </div>
                </div>

                {/* 3. Total Baseline: Total Assumptions (Neutral Slate) */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0B0F17] border border-slate-200/80 dark:border-[#1E2638] transition-all">
                  <div className="size-9 rounded-xl bg-slate-100 dark:bg-[#1E2638] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#2A344A] flex items-center justify-center shrink-0">
                    <CheckSquare className="size-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <p className="text-xs font-semibold text-[#0F172A] dark:text-white">
                        Total Assumptions
                      </p>
                      <span className="font-mono text-base font-bold text-[#0F172A] dark:text-white">
                        12
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      Across 6 categories
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </FadeInView>

          {/* 2. Impact Summary (vs Last Month) Card */}
          <FadeInView offset={16}>
            <Card className="p-6 space-y-4 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
              <h3 className="font-display text-base font-bold text-[#0F172A] dark:text-white">
                Impact Summary (vs Last Month)
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-[#1E2638]">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    Revenue Impact
                  </span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    +2.1%
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-[#1E2638]">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    Profit Impact
                  </span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                    -1.3%
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-[#1E2638]">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    Cash Runway Impact
                  </span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    +0.4 months
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    Risk Level Impact
                  </span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    Low
                  </span>
                </div>
              </div>
            </Card>
          </FadeInView>

          {/* 3. Notes Card */}
          <FadeInView offset={18}>
            <Card className="p-6 space-y-3 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
              <h3 className="font-display text-base font-bold text-[#0F172A] dark:text-white">
                Notes
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                These assumptions are based on current business conditions and
                market outlook. Update them when you see changes in your
                business environment.
              </p>
            </Card>
          </FadeInView>

          {/* 4. Need Help? Card */}
          <FadeInView offset={20}>
            <div className="p-6 space-y-3 rounded-2xl bg-gradient-to-r from-[#F5F3FF] via-[#EDE9FE] to-[#F3E8FF] dark:from-[#181438] dark:via-[#1B1742] dark:to-[#111622] border border-[#DDD6FE] dark:border-purple-900/50 shadow-xs">
              <div className="flex items-center gap-2 text-[#4F46E5] dark:text-purple-300 font-bold text-sm">
                <Sparkles className="size-4" />
                <span>Need Help?</span>
              </div>
              <p className="text-xs text-[#1E1B4B] dark:text-slate-200 leading-relaxed">
                Ask AI Advisor to review your assumptions or explain any of
                them.
              </p>
              <button
                type="button"
                onClick={() =>
                  openDrawer(
                    'Can you review my business assumptions and unit economics model?',
                  )
                }
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-semibold text-xs shadow-md shadow-indigo-500/25 hover:opacity-95 hover:scale-105 active:scale-95 cursor-pointer transition-all mt-1"
              >
                <MessageSquare className="size-3.5" />
                <span>Ask AI Advisor</span>
              </button>
            </div>
          </FadeInView>
        </div>
      </div>
    </div>
  );
}
