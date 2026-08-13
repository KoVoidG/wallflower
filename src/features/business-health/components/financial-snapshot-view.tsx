// src/features/business-health/components/financial-snapshot-view.tsx
'use client';

import {
  TrendingUp,
  Receipt,
  Wallet,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  ChevronRight,
  PiggyBank,
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { Card } from '@/components/ui/card';
import { FadeInView, CountUp } from '@/components/motion';

const greenSparkline1 = [
  { val: 1.55 },
  { val: 1.58 },
  { val: 1.6 },
  { val: 1.62 },
  { val: 1.65 },
];
const greenSparkline2 = [
  { val: 1.08 },
  { val: 1.1 },
  { val: 1.12 },
  { val: 1.14 },
  { val: 1.15 },
];
const redSparkline = [
  { val: 3.8 },
  { val: 3.6 },
  { val: 3.4 },
  { val: 3.2 },
  { val: 3.1 },
];
const greenSparkline3 = [
  { val: 7.8 },
  { val: 8.0 },
  { val: 8.2 },
  { val: 8.4 },
  { val: 8.6 },
];
const greenSparkline4 = [
  { val: 15.0 },
  { val: 15.4 },
  { val: 15.8 },
  { val: 16.0 },
  { val: 16.4 },
];
const workingCapitalSparkline = [
  { val: 720000 },
  { val: 750000 },
  { val: 740000 },
  { val: 780000 },
  { val: 800000 },
];

export function FinancialSnapshotView() {
  const t = useTranslations('businessHealth.snapshot');
  const tCommon = useTranslations('common');
  const tHealth = useTranslations('businessHealth');

  return (
    <div className="space-y-6">
      {/* ── Row 1: 4 Top Metric Cards (No hover effect, B&W icons) ─────────────────────── */}
      <FadeInView offset={14}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* 1. Total Revenue */}
          <Card className="flex flex-col justify-between space-y-4 p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white flex items-center justify-center border border-slate-200 dark:border-[#2A344A]">
                  <TrendingUp className="size-3.5" />
                </div>
                <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                  {t('revenue')}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-mono text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                ฿
                <CountUp
                  to={1250000}
                  duration={0.8}
                  formatter={(v) => Math.round(v).toLocaleString()}
                />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="size-3.5" />
                <span>8.4% vs Apr 2024</span>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-[#1E2638] pt-3 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] dark:text-[#94A3B8]">
                  Avg. Transaction Value
                </span>
                <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                  ฿620
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] dark:text-[#94A3B8]">
                  Transactions / Month
                </span>
                <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                  2,016
                </span>
              </div>
            </div>
          </Card>

          {/* 2. Gross Profit */}
          <Card className="flex flex-col justify-between space-y-4 p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white flex items-center justify-center border border-slate-200 dark:border-[#2A344A]">
                  <PiggyBank className="size-3.5" />
                </div>
                <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                  {t('grossProfit')}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-mono text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                ฿
                <CountUp
                  to={425000}
                  duration={0.8}
                  formatter={(v) => Math.round(v).toLocaleString()}
                />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="size-3.5" />
                <span>7.1% vs Apr 2024</span>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-[#1E2638] pt-3 flex items-center justify-between text-xs">
              <span className="text-[#64748B] dark:text-[#94A3B8]">
                {t('grossMargin')}
              </span>
              <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                34.0%
              </span>
            </div>
          </Card>

          {/* 3. Net Profit */}
          <Card className="flex flex-col justify-between space-y-4 p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white flex items-center justify-center border border-slate-200 dark:border-[#2A344A]">
                  <Wallet className="size-3.5" />
                </div>
                <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                  {t('netProfit')}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-mono text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                ฿
                <CountUp
                  to={186000}
                  duration={0.8}
                  formatter={(v) => Math.round(v).toLocaleString()}
                />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="size-3.5" />
                <span>6.7% vs Apr 2024</span>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-[#1E2638] pt-3 flex items-center justify-between text-xs">
              <span className="text-[#64748B] dark:text-[#94A3B8]">
                {t('netMargin')}
              </span>
              <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                14.9%
              </span>
            </div>
          </Card>

          {/* 4. Cash Runway */}
          <Card className="flex flex-col justify-between space-y-4 p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white flex items-center justify-center border border-slate-200 dark:border-[#2A344A]">
                  <Clock className="size-3.5" />
                </div>
                <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                  {t('runwayMonths')}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-mono text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                <CountUp to={8.2} decimals={1} duration={0.8} />{' '}
                {tCommon('units.months')}
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                <ArrowDownRight className="size-3.5" />
                <span>-0.8 vs Apr 2024</span>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-[#1E2638] pt-3 flex items-center justify-between text-xs">
              <span className="text-[#64748B] dark:text-[#94A3B8]">
                Target Runway
              </span>
              <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                6.0 {tCommon('units.months')}
              </span>
            </div>
          </Card>
        </div>
      </FadeInView>

      {/* ── Row 2: 3 Financial Breakdown Cards ───────────────────────── */}
      <FadeInView offset={16}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1. Expenses Card (B&W Icon, Up=Green, Down=Red, No change=Dull) */}
          <Card className="flex flex-col justify-between space-y-4 p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white flex items-center justify-center border border-slate-200 dark:border-[#2A344A]">
                  <Receipt className="size-3.5" />
                </div>
                <h2 className="font-display text-base font-bold text-[#0F172A] dark:text-white">
                  {t('expenses')}
                </h2>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    Rent
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                      ฿120,000
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 font-mono w-14 text-right">
                      - 0%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    Payroll
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                      ฿320,000
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold w-14 text-right">
                      ▲ 3.2%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    Utilities
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                      ฿25,000
                    </span>
                    <span className="text-rose-600 dark:text-rose-400 font-mono font-semibold w-14 text-right">
                      ▼ -2.1%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    Marketing
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                      ฿40,000
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold w-14 text-right">
                      ▲ 12.4%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    Other Operating Costs
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                      ฿159,000
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 font-mono w-14 text-right">
                      - 0%
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-[#1E2638] pt-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-[#0F172A] dark:text-white">
                  {t('expenses')}
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-[#0F172A] dark:text-white text-sm">
                    ฿664,000
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold w-14 text-right">
                    ▲ 2.1%
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/business-health?tab=operations"
              className="pt-2 text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#4F46E5] dark:hover:text-[#A5B4FC] transition-colors flex items-center justify-between group cursor-pointer"
            >
              <span>{tCommon('view')}</span>
              <ChevronRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Card>

          {/* 2. Cash & Debt Card (B&W Icon) */}
          <Card className="flex flex-col justify-between space-y-4 p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white flex items-center justify-center border border-slate-200 dark:border-[#2A344A]">
                  <Wallet className="size-3.5" />
                </div>
                <h2 className="font-display text-base font-bold text-[#0F172A] dark:text-white">
                  Cash & Debt
                </h2>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    Cash on Hand
                  </span>
                  <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                    ฿540,000
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    Bank Balance
                  </span>
                  <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                    ฿260,000
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    Short-term Debt
                  </span>
                  <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                    ฿150,000
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-[#1E2638] pt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Total Available Cash
                  </span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    ฿800,000
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    Debt-to-Equity
                  </span>
                  <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                    0.90x
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/business-health?tab=operations"
              className="pt-2 text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#4F46E5] dark:hover:text-[#A5B4FC] transition-colors flex items-center justify-between group cursor-pointer"
            >
              <span>{tCommon('view')}</span>
              <ChevronRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Card>

          {/* 3. Balance Sheet (Summary) Card (B&W Icon) */}
          <Card className="flex flex-col justify-between space-y-4 p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white flex items-center justify-center border border-slate-200 dark:border-[#2A344A]">
                  <Building2 className="size-3.5" />
                </div>
                <h2 className="font-display text-base font-bold text-[#0F172A] dark:text-white">
                  Balance Sheet (Summary)
                </h2>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    Total Assets
                  </span>
                  <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                    ฿2,150,000
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    Total Liabilities
                  </span>
                  <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                    ฿1,020,000
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    Owner&apos;s Equity
                  </span>
                  <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                    ฿1,130,000
                  </span>
                </div>
              </div>

              {/* Inner Dark Banner for Working Capital + Sparkline */}
              <div className="rounded-xl bg-[#F8FAFC] dark:bg-[#0B0F17] border border-slate-200/80 dark:border-[#1E2638] p-3 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-sans text-[#64748B] dark:text-[#94A3B8] block">
                    {t('workingCapital')}
                  </span>
                  <span className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
                    ฿800,000
                  </span>
                  <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] block mt-0.5">
                    Current Assets - Current Liabilities
                  </span>
                </div>
                <div className="h-8 w-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={workingCapitalSparkline}>
                      <Line
                        type="monotone"
                        dataKey="val"
                        stroke="#00D395"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <Link
              href="/reports"
              className="pt-2 text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#4F46E5] dark:hover:text-[#A5B4FC] transition-colors flex items-center justify-between group cursor-pointer"
            >
              <span>{tCommon('view')}</span>
              <ChevronRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Card>
        </div>
      </FadeInView>

      {/* ── Row 3: Key Financial Ratios & Data Completeness ────────────── */}
      <FadeInView offset={18}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 1. Key Financial Ratios (9 Columns) */}
          <Card className="lg:col-span-9 flex flex-col justify-between space-y-4 p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1E2638] pb-3">
              <h2 className="font-display text-base font-bold text-[#0F172A] dark:text-white">
                Key Financial Ratios
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-1">
              {/* Current Ratio */}
              <div className="space-y-2">
                <span className="text-xs font-sans text-[#64748B] dark:text-[#94A3B8] block">
                  {t('currentRatio')}
                </span>
                <span className="font-mono text-xl font-bold text-[#0F172A] dark:text-white block">
                  <CountUp to={1.65} decimals={2} duration={0.6} />x
                </span>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>▲ 0.05 vs Apr</span>
                </div>
                <div className="h-8 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={greenSparkline1}>
                      <Line
                        type="monotone"
                        dataKey="val"
                        stroke="#00D395"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quick Ratio */}
              <div className="space-y-2">
                <span className="text-xs font-sans text-[#64748B] dark:text-[#94A3B8] block">
                  Quick Ratio
                </span>
                <span className="font-mono text-xl font-bold text-[#0F172A] dark:text-white block">
                  <CountUp to={1.15} decimals={2} duration={0.6} />x
                </span>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>▲ 0.04 vs Apr</span>
                </div>
                <div className="h-8 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={greenSparkline2}>
                      <Line
                        type="monotone"
                        dataKey="val"
                        stroke="#00D395"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Inventory Turnover (Down = Red) */}
              <div className="space-y-2">
                <span className="text-xs font-sans text-[#64748B] dark:text-[#94A3B8] block">
                  {tHealth('inventory.turnover')}
                </span>
                <span className="font-mono text-xl font-bold text-[#0F172A] dark:text-white block">
                  <CountUp to={3.1} decimals={1} duration={0.6} />x
                </span>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                  <span>▼ -0.4 vs Apr</span>
                </div>
                <div className="h-8 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={redSparkline}>
                      <Line
                        type="monotone"
                        dataKey="val"
                        stroke="#F43F5E"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ROA */}
              <div className="space-y-2">
                <span className="text-xs font-sans text-[#64748B] dark:text-[#94A3B8] block">
                  Return on Assets (ROA)
                </span>
                <span className="font-mono text-xl font-bold text-[#0F172A] dark:text-white block">
                  <CountUp to={8.6} decimals={1} duration={0.6} />%
                </span>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>▲ 0.6% vs Apr</span>
                </div>
                <div className="h-8 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={greenSparkline3}>
                      <Line
                        type="monotone"
                        dataKey="val"
                        stroke="#00D395"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ROE */}
              <div className="space-y-2">
                <span className="text-xs font-sans text-[#64748B] dark:text-[#94A3B8] block">
                  Return on Equity (ROE)
                </span>
                <span className="font-mono text-xl font-bold text-[#0F172A] dark:text-white block">
                  <CountUp to={16.4} decimals={1} duration={0.6} />%
                </span>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>▲ 1.2% vs Apr</span>
                </div>
                <div className="h-8 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={greenSparkline4}>
                      <Line
                        type="monotone"
                        dataKey="val"
                        stroke="#00D395"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </Card>

          {/* 2. Data Completeness (3 Columns) */}
          <Card className="lg:col-span-3 flex flex-col justify-between space-y-4 p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="space-y-4">
              <h2 className="font-display text-base font-bold text-[#0F172A] dark:text-white">
                Data Completeness
              </h2>

              <div className="flex items-center gap-4 py-1">
                {/* SVG Gauge Ring */}
                <div className="relative size-16 shrink-0 flex items-center justify-center">
                  <svg
                    className="size-full transform -rotate-90"
                    viewBox="0 0 60 60"
                  >
                    <circle
                      cx="30"
                      cy="30"
                      r="24"
                      stroke="#E2E8F0"
                      className="dark:stroke-[#1E2638]"
                      strokeWidth="5"
                      fill="transparent"
                    />
                    <circle
                      cx="30"
                      cy="30"
                      r="24"
                      stroke="#00D395"
                      strokeWidth="5"
                      strokeDasharray="150.7"
                      strokeDashoffset={150.7 * (1 - 0.92)}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-mono text-sm font-bold text-[#0F172A] dark:text-white">
                      92%
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Great! Your business data is mostly complete.
                </p>
              </div>
            </div>

            <Link
              href="/settings"
              className="pt-2 text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#4F46E5] dark:hover:text-[#A5B4FC] transition-colors flex items-center justify-between group cursor-pointer"
            >
              <span>{tCommon('view')}</span>
              <ChevronRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Card>
        </div>
      </FadeInView>
    </div>
  );
}
