'use client';

import { TrendingUp, Edit, Wallet, Clock, ArrowUpRight, ArrowDownRight, Receipt, Building2, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { Link } from '@/lib/i18n/navigation';
import { Card } from '@/components/ui/card';
import { FadeInView, CountUp } from '@/components/motion';

const greenSparkline1 = [{ val: 1.55 }, { val: 1.58 }, { val: 1.60 }, { val: 1.62 }, { val: 1.65 }];
const greenSparkline2 = [{ val: 1.08 }, { val: 1.10 }, { val: 1.12 }, { val: 1.14 }, { val: 1.15 }];
const redSparkline = [{ val: 3.8 }, { val: 3.6 }, { val: 3.4 }, { val: 3.2 }, { val: 3.1 }];
const greenSparkline3 = [{ val: 7.8 }, { val: 8.0 }, { val: 8.2 }, { val: 8.4 }, { val: 8.6 }];
const greenSparkline4 = [{ val: 15.0 }, { val: 15.4 }, { val: 15.8 }, { val: 16.0 }, { val: 16.4 }];
const workingCapitalSparkline = [{ val: 720000 }, { val: 750000 }, { val: 740000 }, { val: 780000 }, { val: 800000 }];

export function FinancialSnapshotView() {
  return (
    <div className="space-y-6">
      {/* ── Row 1: 4 Top Metric Cards ─────────────────────────────────── */}
      <FadeInView offset={14}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* 1. Total Revenue */}
          <Card className="flex flex-col justify-between space-y-4 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded bg-tertiary/15 text-tertiary flex items-center justify-center border border-tertiary/20">
                  <TrendingUp className="size-4" />
                </div>
                <span className="text-xs font-medium text-text-secondary">Total Revenue</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-mono text-2xl font-bold text-text-primary tracking-tight">
                ฿<CountUp to={1250000} duration={0.8} formatter={(v) => Math.round(v).toLocaleString()} />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-tertiary">
                <ArrowUpRight className="size-3.5" />
                <span>8.4% vs Apr 2024</span>
              </div>
            </div>

            <div className="border-t border-border/60 pt-3 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Avg. Transaction Value</span>
                <span className="font-mono font-medium text-text-primary">฿620</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Transactions / Month</span>
                <span className="font-mono font-medium text-text-primary">2,016</span>
              </div>
            </div>
          </Card>

          {/* 2. Gross Profit */}
          <Card className="flex flex-col justify-between space-y-4 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded bg-tertiary/15 text-tertiary flex items-center justify-center border border-tertiary/20">
                  <Edit className="size-3.5" />
                </div>
                <span className="text-xs font-medium text-text-secondary">Gross Profit</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-mono text-2xl font-bold text-text-primary tracking-tight">
                ฿<CountUp to={425000} duration={0.8} formatter={(v) => Math.round(v).toLocaleString()} />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-tertiary">
                <ArrowUpRight className="size-3.5" />
                <span>7.1% vs Apr 2024</span>
              </div>
            </div>

            <div className="border-t border-border/60 pt-3 flex items-center justify-between text-xs">
              <span className="text-text-secondary">Gross Margin</span>
              <span className="font-mono font-medium text-text-primary">34.0%</span>
            </div>
          </Card>

          {/* 3. Net Profit */}
          <Card className="flex flex-col justify-between space-y-4 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded bg-warning/15 text-warning flex items-center justify-center border border-warning/20">
                  <Wallet className="size-3.5" />
                </div>
                <span className="text-xs font-medium text-text-secondary">Net Profit</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-mono text-2xl font-bold text-text-primary tracking-tight">
                ฿<CountUp to={186000} duration={0.8} formatter={(v) => Math.round(v).toLocaleString()} />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-tertiary">
                <ArrowUpRight className="size-3.5" />
                <span>6.7% vs Apr 2024</span>
              </div>
            </div>

            <div className="border-t border-border/60 pt-3 flex items-center justify-between text-xs">
              <span className="text-text-secondary">Net Margin</span>
              <span className="font-mono font-medium text-text-primary">14.9%</span>
            </div>
          </Card>

          {/* 4. Cash Runway */}
          <Card className="flex flex-col justify-between space-y-4 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded bg-tertiary/15 text-tertiary flex items-center justify-center border border-tertiary/20">
                  <Clock className="size-3.5" />
                </div>
                <span className="text-xs font-medium text-text-secondary">Cash Runway</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-mono text-2xl font-bold text-text-primary tracking-tight">
                <CountUp to={8.2} decimals={1} duration={0.8} /> months
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-danger">
                <ArrowDownRight className="size-3.5" />
                <span>-0.8 vs Apr 2024</span>
              </div>
            </div>

            <div className="border-t border-border/60 pt-3 flex items-center justify-between text-xs">
              <span className="text-text-secondary">Target Runway</span>
              <span className="font-mono font-medium text-text-primary">6.0 months</span>
            </div>
          </Card>
        </div>
      </FadeInView>

      {/* ── Row 2: 3 Financial Breakdown Cards ───────────────────────── */}
      <FadeInView offset={16}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1. Expenses Card */}
          <Card className="flex flex-col justify-between space-y-4 p-5">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded bg-surface-hover text-text-secondary flex items-center justify-center border border-border">
                  <Receipt className="size-3.5" />
                </div>
                <h2 className="font-display text-base font-semibold text-text-primary">Expenses</h2>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1">
                  <span className="text-text-secondary">Rent</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium text-text-primary">฿120,000</span>
                    <span className="text-text-secondary font-mono w-14 text-right">- 0%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-text-secondary">Payroll</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium text-text-primary">฿320,000</span>
                    <span className="text-tertiary font-mono w-14 text-right">▲ 3.2%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-text-secondary">Utilities</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium text-text-primary">฿25,000</span>
                    <span className="text-danger font-mono w-14 text-right">▼ -2.1%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-text-secondary">Marketing</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium text-text-primary">฿40,000</span>
                    <span className="text-tertiary font-mono w-14 text-right">▲ 12.4%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-text-secondary">Other Operating Costs</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium text-text-primary">฿159,000</span>
                    <span className="text-text-secondary font-mono w-14 text-right">- 0%</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border/80 pt-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-text-primary">Total Expenses</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-text-primary text-sm">฿664,000</span>
                  <span className="text-tertiary font-mono w-14 text-right">▲ 2.1%</span>
                </div>
              </div>
            </div>

            <Link
              href="/cash-flow"
              className="pt-2 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center justify-between group cursor-pointer"
            >
              <span>View expense breakdown</span>
              <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Card>

          {/* 2. Cash & Debt Card */}
          <Card className="flex flex-col justify-between space-y-4 p-5">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded bg-surface-hover text-text-secondary flex items-center justify-center border border-border">
                  <Wallet className="size-3.5" />
                </div>
                <h2 className="font-display text-base font-semibold text-text-primary">Cash & Debt</h2>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1">
                  <span className="text-text-secondary">Cash on Hand</span>
                  <span className="font-mono font-medium text-text-primary">฿540,000</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-text-secondary">Bank Balance</span>
                  <span className="font-mono font-medium text-text-primary">฿260,000</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-text-secondary">Short-term Debt</span>
                  <span className="font-mono font-medium text-text-primary">฿150,000</span>
                </div>
              </div>

              <div className="border-t border-border/80 pt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-tertiary">Total Available Cash</span>
                  <span className="font-mono font-bold text-tertiary text-sm">฿800,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Debt-to-Equity</span>
                  <span className="font-mono font-medium text-text-primary">0.90x</span>
                </div>
              </div>
            </div>

            <Link
              href="/cash-flow"
              className="pt-2 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center justify-between group cursor-pointer"
            >
              <span>View cash flow summary</span>
              <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Card>

          {/* 3. Balance Sheet (Summary) Card */}
          <Card className="flex flex-col justify-between space-y-4 p-5">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded bg-surface-hover text-text-secondary flex items-center justify-center border border-border">
                  <Building2 className="size-3.5" />
                </div>
                <h2 className="font-display text-base font-semibold text-text-primary">Balance Sheet (Summary)</h2>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1">
                  <span className="text-text-secondary">Total Assets</span>
                  <span className="font-mono font-medium text-text-primary">฿2,150,000</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-text-secondary">Total Liabilities</span>
                  <span className="font-mono font-medium text-text-primary">฿1,020,000</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-text-secondary">Owner&apos;s Equity</span>
                  <span className="font-mono font-medium text-text-primary">฿1,130,000</span>
                </div>
              </div>

              {/* Inner Dark Banner for Working Capital + Sparkline */}
              <div className="rounded-lg bg-surface-hover/80 border border-border p-3 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-sans text-text-secondary block">Working Capital</span>
                  <span className="font-mono text-base font-bold text-tertiary">฿800,000</span>
                  <span className="text-[10px] text-text-secondary block mt-0.5">Current Assets - Current Liabilities</span>
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
              className="pt-2 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center justify-between group cursor-pointer"
            >
              <span>View full balance sheet</span>
              <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Card>
        </div>
      </FadeInView>

      {/* ── Row 3: Key Financial Ratios & Data Completeness ────────────── */}
      <FadeInView offset={18}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 1. Key Financial Ratios (9 Columns) */}
          <Card className="lg:col-span-9 flex flex-col justify-between space-y-4 p-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h2 className="font-display text-base font-semibold text-text-primary">
                Key Financial Ratios
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-1">
              {/* Current Ratio */}
              <div className="space-y-2">
                <span className="text-xs font-sans text-text-secondary block">Current Ratio</span>
                <span className="font-mono text-xl font-bold text-text-primary block">
                  <CountUp to={1.65} decimals={2} duration={0.6} />x
                </span>
                <div className="flex items-center gap-1 text-[11px] font-medium text-tertiary">
                  <span>◆ 0.05 vs Apr</span>
                </div>
                <div className="h-8 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={greenSparkline1}>
                      <Line type="monotone" dataKey="val" stroke="#00D395" strokeWidth={1.8} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quick Ratio */}
              <div className="space-y-2">
                <span className="text-xs font-sans text-text-secondary block">Quick Ratio</span>
                <span className="font-mono text-xl font-bold text-text-primary block">
                  <CountUp to={1.15} decimals={2} duration={0.6} />x
                </span>
                <div className="flex items-center gap-1 text-[11px] font-medium text-tertiary">
                  <span>◆ 0.04 vs Apr</span>
                </div>
                <div className="h-8 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={greenSparkline2}>
                      <Line type="monotone" dataKey="val" stroke="#00D395" strokeWidth={1.8} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Inventory Turnover */}
              <div className="space-y-2">
                <span className="text-xs font-sans text-text-secondary block">Inventory Turnover</span>
                <span className="font-mono text-xl font-bold text-text-primary block">
                  <CountUp to={3.1} decimals={1} duration={0.6} />x
                </span>
                <div className="flex items-center gap-1 text-[11px] font-medium text-danger">
                  <span>▼ -0.4 vs Apr</span>
                </div>
                <div className="h-8 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={redSparkline}>
                      <Line type="monotone" dataKey="val" stroke="#FF5C5C" strokeWidth={1.8} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ROA */}
              <div className="space-y-2">
                <span className="text-xs font-sans text-text-secondary block">Return on Assets (ROA)</span>
                <span className="font-mono text-xl font-bold text-text-primary block">
                  <CountUp to={8.6} decimals={1} duration={0.6} />%
                </span>
                <div className="flex items-center gap-1 text-[11px] font-medium text-tertiary">
                  <span>◆ 0.6% vs Apr</span>
                </div>
                <div className="h-8 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={greenSparkline3}>
                      <Line type="monotone" dataKey="val" stroke="#00D395" strokeWidth={1.8} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ROE */}
              <div className="space-y-2">
                <span className="text-xs font-sans text-text-secondary block">Return on Equity (ROE)</span>
                <span className="font-mono text-xl font-bold text-text-primary block">
                  <CountUp to={16.4} decimals={1} duration={0.6} />%
                </span>
                <div className="flex items-center gap-1 text-[11px] font-medium text-tertiary">
                  <span>◆ 1.2% vs Apr</span>
                </div>
                <div className="h-8 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={greenSparkline4}>
                      <Line type="monotone" dataKey="val" stroke="#00D395" strokeWidth={1.8} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </Card>

          {/* 2. Data Completeness (3 Columns) */}
          <Card className="lg:col-span-3 flex flex-col justify-between space-y-4 p-5">
            <div className="space-y-4">
              <h2 className="font-display text-base font-semibold text-text-primary">
                Data Completeness
              </h2>

              <div className="flex items-center gap-4 py-1">
                {/* SVG Gauge Ring */}
                <div className="relative size-16 shrink-0 flex items-center justify-center">
                  <svg className="size-full transform -rotate-90" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="24" stroke="var(--border-strong)" strokeWidth="5" fill="transparent" />
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
                    <span className="font-mono text-sm font-bold text-text-primary">92%</span>
                  </div>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  Great! Your business data is mostly complete.
                </p>
              </div>
            </div>

            <Link
              href="/settings"
              className="pt-2 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center justify-between group cursor-pointer"
            >
              <span>View missing data</span>
              <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Card>
        </div>
      </FadeInView>
    </div>
  );
}
