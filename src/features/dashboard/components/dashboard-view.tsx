// src/features/dashboard/components/dashboard-view.tsx
'use client';

import { useState } from 'react';
import {
  RotateCw,
  ChevronDown,
  Info,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  MessageSquare,
  FileText,
  Download,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Layers,
  ShoppingBag,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Link } from '@/lib/i18n/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BotAvatar } from '@/components/ui/bot-avatar';
import { InfoTooltip } from '@/components/ui/tooltip';
import { DatePicker } from '@/components/ui/date-picker';
import { useAdvisorDrawer } from '@/features/advisor/context/advisor-drawer-context';
import {
  FadeInView,
  ProgressGauge,
  CountUp,
  ChartInView,
} from '@/components/motion';
import type { DashboardData } from '../adapters/dashboard.adapter';
import { BrainCircuit } from 'lucide-react';

interface DashboardViewProps {
  initialData?: DashboardData;
}

// Sparkline datasets for Row 2 KPI Cards
const revenueSparkline = [
  { val: 1100000 },
  { val: 1150000 },
  { val: 1120000 },
  { val: 1180000 },
  { val: 1210000 },
  { val: 1250000 },
];

const profitSparkline = [
  { val: 160000 },
  { val: 168000 },
  { val: 165000 },
  { val: 175000 },
  { val: 180000 },
  { val: 186000 },
];

const runwaySparkline = [
  { val: 9.2 },
  { val: 9.0 },
  { val: 8.8 },
  { val: 8.6 },
  { val: 8.4 },
  { val: 8.2 },
];

const turnoverSparkline = [
  { val: 3.8 },
  { val: 3.6 },
  { val: 3.5 },
  { val: 3.4 },
  { val: 3.2 },
  { val: 3.1 },
];

// Dual-line Trend Dataset for Row 3
const trendChartData = [
  { date: 'Feb 20', revenue: 1050000, profit: 160000 },
  { date: 'Mar 5', revenue: 1220000, profit: 210000 },
  { date: 'Mar 19', revenue: 1180000, profit: 185000 },
  { date: 'Apr 2', revenue: 1280000, profit: 240000 },
  { date: 'Apr 16', revenue: 1150000, profit: 190000 },
  { date: 'Apr 30', revenue: 1350000, profit: 270000 },
  { date: 'May 14', revenue: 1250000, profit: 230000 },
];

export function DashboardView({}: DashboardViewProps) {
  const { openDrawer } = useAdvisorDrawer();
  const [selectedRange, setSelectedRange] = useState<'30D' | '90D' | '12M'>(
    '90D',
  );
  const [dashboardDate, setDashboardDate] = useState<string>('2024-05-20');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <FadeInView offset={10}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-primary flex items-center gap-2">
              Good morning, Somchai{' '}
              <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="font-sans text-sm text-text-muted mt-1">
              Here&apos;s what&apos;s happening with Somchai Retail today.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <span>Last updated 2 hours ago</span>
              <button
                type="button"
                onClick={handleRefresh}
                className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors text-text-muted hover:text-text-primary cursor-pointer"
                title="Refresh dashboard data"
              >
                <RotateCw
                  className={`size-3.5 ${isRefreshing ? 'animate-spin text-brand' : ''}`}
                />
              </button>
            </div>

            {/* Interactive Date & Month Picker */}
            <DatePicker
              value={dashboardDate}
              onChange={(_d, str) => setDashboardDate(str)}
              align="end"
            />
          </div>
        </div>
      </FadeInView>

      {/* ── Row 1: Business Health & Today's Priorities ─────────────────────── */}
      <FadeInView offset={14} duration={0.35}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Business Health Card */}
          <Card className="lg:col-span-6 flex flex-col justify-between space-y-4 rounded-2xl p-6 bg-surface border border-border/60 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <h2 className="font-display text-base sm:text-lg font-bold text-text-primary">
                  Business Health
                </h2>
                <InfoTooltip content="Composite score evaluating cash runway, risk factors, and financial stability." />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center py-2">
              {/* Score Ring Motion Component with Accurate 84% Arc */}
              <div className="sm:col-span-5 flex items-center justify-center">
                <ProgressGauge
                  score={84}
                  maxScore={100}
                  label="Healthy"
                  size={132}
                  color="var(--success)"
                />
              </div>

              {/* Health Metrics List with updated tab links and purple bounce hover */}
              <div className="sm:col-span-7 space-y-2.5">
                <Link
                  href="/business-health?tab=operations"
                  className="flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:border-brand/30 hover:bg-brand-soft/10 hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="size-4 text-text-muted group-hover:text-brand transition-colors shrink-0" />
                    <span className="text-xs font-medium text-text-muted group-hover:text-brand group-hover:font-semibold transition-all">
                      Cash Runway
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:font-bold">
                      8.2 months
                    </span>
                    <ChevronRight className="size-4 text-text-muted group-hover:text-brand group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>

                <Link
                  href="/business-health?tab=snapshot"
                  className="flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:border-brand/30 hover:bg-brand-soft/10 hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="size-4 text-text-muted group-hover:text-brand transition-colors shrink-0" />
                    <span className="text-xs font-medium text-text-muted group-hover:text-brand group-hover:font-semibold transition-all">
                      Risk Level
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:font-bold">
                      Low
                    </span>
                    <ChevronRight className="size-4 text-text-muted group-hover:text-brand group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>

                <Link
                  href="/simulations?tab=workspace"
                  className="flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:border-brand/30 hover:bg-brand-soft/10 hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="size-4 text-brand group-hover:text-brand transition-colors shrink-0" />
                    <span className="text-xs font-medium text-text-muted group-hover:text-brand group-hover:font-semibold transition-all">
                      Decision Confidence
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:font-bold">
                      High
                    </span>
                    <ChevronRight className="size-4 text-text-muted group-hover:text-brand group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Bottom Banner */}
            <div className="rounded-xl bg-success/10 border border-success/30 px-3.5 py-2.5 text-xs text-success font-medium flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>
                Your business is in a strong position. Keep an eye on inventory
                turnover.
              </span>
            </div>
          </Card>

          {/* Today's Priorities Card */}
          <Card className="lg:col-span-6 flex flex-col justify-between rounded-2xl p-6 bg-surface border border-border/60 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <h2 className="font-display text-base sm:text-lg font-bold text-text-primary">
                  Today&apos;s Priorities
                </h2>
                <InfoTooltip content="Actionable priority items and automated alerts requiring attention." />
              </div>
              <Link
                href="/business-health?tab=operations"
                className="text-xs font-semibold text-brand hover:underline hover:font-bold transition-all"
              >
                View all
              </Link>
            </div>

            <div className="divide-y divide-border/60">
              <Link
                href="/business-health?tab=inventory"
                className="py-3 flex items-center justify-between hover:bg-brand-soft/10 px-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-700/60 group-hover:scale-105 transition-transform">
                    <AlertTriangle className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary group-hover:text-brand group-hover:font-bold transition-all">
                      Inventory turnover decreased for 2 months
                    </p>
                    <p className="text-[11px] text-text-muted">
                      Current:{' '}
                      <span className="font-mono font-medium">3.1x</span>{' '}
                      (Target: 4.0x)
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-text-muted group-hover:text-brand group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/business-health?tab=operations"
                className="py-3 flex items-center justify-between hover:bg-brand-soft/10 px-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-700/60 group-hover:scale-105 transition-transform">
                    <AlertTriangle className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary group-hover:text-brand group-hover:font-bold transition-all">
                      Cash runway decreased by 0.8 months
                    </p>
                    <p className="text-[11px] text-text-muted">
                      Current:{' '}
                      <span className="font-mono font-medium">8.2 months</span>
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-text-muted group-hover:text-brand group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/simulations?tab=workspace"
                className="py-3 flex items-center justify-between hover:bg-brand-soft/10 px-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-700/60 group-hover:scale-105 transition-transform">
                    <Info className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary group-hover:text-brand group-hover:font-bold transition-all">
                      Supplier costs increased 5% this month
                    </p>
                    <p className="text-[11px] text-text-muted">
                      Review your scenarios
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-text-muted group-hover:text-brand group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/simulations?tab=library"
                className="py-3 flex items-center justify-between hover:bg-brand-soft/10 px-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-700/60 group-hover:scale-105 transition-transform">
                    <CheckCircle2 className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary group-hover:text-brand group-hover:font-bold transition-all">
                      New simulation template available
                    </p>
                    <p className="text-[11px] text-text-muted">
                      Launch Promotion – Summer Campaign
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-text-muted group-hover:text-brand group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/business-health?tab=inventory"
                className="py-3 flex items-center justify-between hover:bg-brand-soft/10 px-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-full bg-surface-subtle text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0 border border-border/60 group-hover:scale-105 transition-transform">
                    <Package className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary group-hover:text-brand group-hover:font-bold transition-all">
                      Update inventory value
                    </p>
                    <p className="text-[11px] text-text-muted">
                      Last updated 18 days ago
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-text-muted group-hover:text-brand group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </Card>
        </div>
      </FadeInView>

      {/* ── Row 2: 4 KPI Cards ─────────────────────────────────────────────────── */}
      <FadeInView offset={16} duration={0.4}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* KPI 1: Monthly Revenue */}
          <Link
            href="/business-health?tab=snapshot"
            className="block"
          >
            <Card className="flex flex-col justify-between gap-2 p-5 rounded-2xl bg-surface border border-border/60 shadow-xs">
              <span className="font-sans text-xs font-medium text-text-muted">
                Monthly Revenue
              </span>
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-xl sm:text-2xl font-bold text-text-primary">
                  ฿
                  <CountUp
                    to={1250000}
                    duration={0.65}
                    formatter={(val) => Math.round(val).toLocaleString()}
                  />
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="size-3.5" /> 8.4% vs last month
                </span>
                <div className="h-8 w-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueSparkline}>
                      <Line
                        type="monotone"
                        dataKey="val"
                        stroke="var(--success)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
          </Link>

          {/* KPI 2: Net Profit */}
          <Link
            href="/business-health?tab=snapshot"
            className="block"
          >
            <Card className="flex flex-col justify-between gap-2 p-5 rounded-2xl bg-surface border border-border/60 shadow-xs">
              <span className="font-sans text-xs font-medium text-text-muted">
                Net Profit
              </span>
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-xl sm:text-2xl font-bold text-text-primary">
                  ฿
                  <CountUp
                    to={186000}
                    duration={0.65}
                    formatter={(val) => Math.round(val).toLocaleString()}
                  />
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="size-3.5" /> 6.7% vs last month
                </span>
                <div className="h-8 w-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={profitSparkline}>
                      <Line
                        type="monotone"
                        dataKey="val"
                        stroke="var(--success)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
          </Link>

          {/* KPI 3: Cash Runway */}
          <Link
            href="/business-health?tab=operations"
            className="block"
          >
            <Card className="flex flex-col justify-between gap-2 p-5 rounded-2xl bg-surface border border-border/60 shadow-xs">
              <span className="font-sans text-xs font-medium text-text-muted">
                Cash Runway
              </span>
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-xl sm:text-2xl font-bold text-text-primary">
                  <CountUp to={8.2} decimals={1} duration={0.65} /> months
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                  <ArrowDownRight className="size-3.5" /> -0.8 vs last month
                </span>
                <div className="h-8 w-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={runwaySparkline}>
                      <Line
                        type="monotone"
                        dataKey="val"
                        stroke="var(--danger)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
          </Link>

          {/* KPI 4: Inventory Turnover */}
          <Link
            href="/business-health?tab=inventory"
            className="block"
          >
            <Card className="flex flex-col justify-between gap-2 p-5 rounded-2xl bg-surface border border-border/60 shadow-xs">
              <span className="font-sans text-xs font-medium text-text-muted">
                Inventory Turnover
              </span>
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-xl sm:text-2xl font-bold text-text-primary">
                  <CountUp to={3.1} decimals={1} duration={0.65} />x
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                  <ArrowDownRight className="size-3.5" /> -0.4 vs last month
                </span>
                <div className="h-8 w-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={turnoverSparkline}>
                      <Line
                        type="monotone"
                        dataKey="val"
                        stroke="var(--danger)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </FadeInView>

      {/* ── Row 3: Revenue & Profit Trend (Full Width) ─────────────────────── */}
      <FadeInView offset={18} duration={0.45}>
        <Card className="space-y-4 rounded-2xl p-6 bg-surface border border-border/60 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base sm:text-lg font-bold text-text-primary">
                Revenue & Profit Trend
              </h2>
              <InfoTooltip content="Historical comparison of total gross revenue against net bottom-line profit." />
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-blue-500 shadow-2xs" />
                  <span className="text-text-muted font-semibold">
                    Revenue (฿)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-emerald-500 shadow-2xs" />
                  <span className="text-text-muted font-semibold">
                    Net Profit (฿)
                  </span>
                </div>
              </div>

              <div className="flex items-center bg-surface-subtle rounded-xl p-1 border border-border/60">
                {(['30D', '90D', '12M'] as const).map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setSelectedRange(range)}
                    className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                      selectedRange === range
                        ? 'bg-surface text-text-primary shadow-xs'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {range}
                  </button>
                ))}
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-sans text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  <span>Compare</span>
                  <ChevronDown className="size-3" />
                </button>
              </div>
            </div>
          </div>
          <div className="h-72 w-full pt-4">
            <ChartInView className="h-full w-full">
              {(shouldRenderChart) => (
                <ResponsiveContainer width="100%" height="100%" minHeight={260}>
                  <AreaChart
                    data={trendChartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--brand)"
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--brand)"
                          stopOpacity={0.0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorProfit"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--success)"
                          stopOpacity={0.22}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--success)"
                          stopOpacity={0.0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                      className=""
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      stroke="var(--text-muted)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="var(--text-muted)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `${val / 1000}K`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--surface)',
                        borderColor: 'var(--border)',
                        borderRadius: '12px',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                        fontFamily: 'JetBrains Mono',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="var(--brand)"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorRev)"
                      isAnimationActive={shouldRenderChart}
                      animationDuration={1200}
                      animationEasing="ease-out"
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      name="Net Profit"
                      stroke="var(--success)"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorProfit)"
                      isAnimationActive={shouldRenderChart}
                      animationDuration={1200}
                      animationEasing="ease-out"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </ChartInView>
          </div>
        </Card>
      </FadeInView>

      {/* ── Row 4: AI Executive Summary (Full Width Lavender/Dark Violet Card) ── */}
      <FadeInView offset={20} duration={0.5}>
        <div className="bg-gradient-to-r from-brand-soft/10 via-brand-soft/20 to-brand-soft/10 border border-brand/30 rounded-2xl p-6 relative shadow-sm hover:shadow-md transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Content Area */}
            <div className="lg:col-span-9 space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base font-bold text-brand flex items-center gap-2">
                  <Sparkles className="size-4 text-brand dark:text-purple-400" />
                  <span>AI Executive Summary</span>
                </h2>
                <InfoTooltip
                  content="AI-generated financial synthesis and strategic next steps."
                  iconClassName="text-brand/70 dark:text-purple-400/70 hover:text-brand dark:hover:text-purple-300"
                />
              </div>

              <blockquote className="bg-surface-subtle/80 backdrop-blur-sm rounded-xl p-4 border border-brand/20 text-text-primary text-sm leading-relaxed italic">
                &ldquo;Revenue remains stable with healthy growth, but inventory
                turnover has slowed for the second consecutive month. If the
                trend continues, working capital pressure may increase within
                the next quarter.&rdquo;
              </blockquote>

              <div className="space-y-2 pt-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-brand font-bold">
                  Key Takeaways
                </span>
                <ul className="space-y-1.5 text-xs sm:text-sm font-medium">
                  <li className="flex items-center gap-2 text-text-primary">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    <span>Maintain current cash position</span>
                  </li>
                  <li className="flex items-center gap-2 text-text-primary">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    <span>Improve inventory turnover</span>
                  </li>
                  <li className="flex items-center gap-2 text-text-primary">
                    <AlertTriangle className="size-4 text-amber-500 shrink-0" />
                    <span>Review slow-moving categories</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: High Confidence Badge aligned directly above Bot Avatar and Action Button */}
            <div className="lg:col-span-3 flex flex-col items-center justify-center gap-3.5 border-t lg:border-t-0 lg:border-l border-brand/30 pt-4 lg:pt-0 lg:pl-6">
              <div className="bg-brand-soft/20 text-brand text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-brand/30 flex items-center gap-1.5 shadow-2xs">
                <span className="size-1.5 rounded-full bg-brand" />
                <span>HIGH CONFIDENCE</span>
              </div>

              <div
                onClick={() => openDrawer('Can you summarize my business health and key priority recommendations?')}
                className="cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                title="Click to talk to AI Advisor"
              >
                <BotAvatar size={84} animate />
              </div>

              <button
                type="button"
                onClick={() => openDrawer('Can you summarize my business health and key priority recommendations?')}
                className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full bg-brand text-white font-semibold text-xs shadow-md shadow-indigo-500/25 hover:opacity-95 hover:scale-105 active:scale-95 cursor-pointer transition-all"
              >
                <MessageSquare className="size-3.5" />
                <span>Ask AI Advisor</span>
              </button>
            </div>
          </div>
        </div>
      </FadeInView>

      {/* ── Row 5: Recent Simulations & Recent Reports ──────────────────────── */}
      <FadeInView offset={22} duration={0.55}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Simulations */}
          <Card className="flex flex-col justify-between rounded-2xl p-6 bg-surface border border-border/60 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-base sm:text-lg font-bold text-text-primary">
                Recent Simulations
              </h2>
              <Link
                href="/simulations?tab=library"
                className="text-xs font-semibold text-brand hover:underline hover:font-bold transition-all"
              >
                View all
              </Link>
            </div>

            <div className="divide-y divide-border/60">
              <Link
                href="/simulations?tab=workspace"
                className="py-3 flex items-center justify-between hover:bg-brand-soft/10 px-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-surface-subtle text-text-secondary flex items-center justify-center shrink-0 border border-border/80 group-hover:scale-105 transition-transform">
                    <TrendingUp className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary group-hover:text-brand group-hover:font-bold transition-all">
                      Price Increase +5%
                    </p>
                    <p className="text-xs text-text-muted">
                      Updated 2 days ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="border border-emerald-300 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-700/60 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md">
                    RECOMMENDED
                  </span>
                  <ChevronRight className="size-4 text-text-muted group-hover:text-brand group-hover:translate-x-1 transition-all" />
                </div>
              </Link>

              <Link
                href="/simulations?tab=workspace"
                className="py-3 flex items-center justify-between hover:bg-brand-soft/10 px-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-surface-subtle text-text-secondary flex items-center justify-center shrink-0 border border-border/80 group-hover:scale-105 transition-transform">
                    <Layers className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary group-hover:text-brand group-hover:font-bold transition-all">
                      Hire 1 Staff
                    </p>
                    <p className="text-xs text-text-muted">
                      Updated 5 days ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="border border-amber-300 text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-700/60 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md">
                    MODERATE IMPACT
                  </span>
                  <ChevronRight className="size-4 text-text-muted group-hover:text-brand group-hover:translate-x-1 transition-all" />
                </div>
              </Link>

              <Link
                href="/simulations?tab=workspace"
                className="py-3 flex items-center justify-between hover:bg-brand-soft/10 px-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-surface-subtle text-text-secondary flex items-center justify-center shrink-0 border border-border/80 group-hover:scale-105 transition-transform">
                    <ShoppingBag className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary group-hover:text-brand group-hover:font-bold transition-all">
                      Launch Promotion
                    </p>
                    <p className="text-xs text-text-muted">
                      Updated 1 week ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="border border-amber-300 text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-700/60 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md">
                    MODERATE IMPACT
                  </span>
                  <ChevronRight className="size-4 text-text-muted group-hover:text-brand group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </div>
          </Card>

          {/* Recent Reports */}
          <Card className="flex flex-col justify-between rounded-2xl p-6 bg-surface border border-border/60 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-base sm:text-lg font-bold text-text-primary">
                Recent Reports
              </h2>
              <Link
                href="/reports"
                className="text-xs font-semibold text-brand hover:underline hover:font-bold transition-all"
              >
                View all
              </Link>
            </div>

            <div className="divide-y divide-border/60">
              <Link
                href="/reports"
                className="py-3 flex items-center justify-between hover:bg-brand-soft/10 px-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-surface-subtle text-text-secondary flex items-center justify-center shrink-0 border border-border/80 group-hover:scale-105 transition-transform">
                    <FileText className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary group-hover:text-brand group-hover:font-bold transition-all">
                      Executive Report – May 2024
                    </p>
                    <p className="text-xs text-text-muted">
                      Generated 2 days ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="border border-border/80 text-text-secondary bg-surface-subtle text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md">
                    PDF
                  </span>
                  <div
                    className="p-1.5 text-text-muted group-hover:text-brand transition-colors"
                    title="Download report"
                  >
                    <Download className="size-4" />
                  </div>
                </div>
              </Link>

              <Link
                href="/reports"
                className="py-3 flex items-center justify-between hover:bg-brand-soft/10 px-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-surface-subtle text-text-secondary flex items-center justify-center shrink-0 border border-border/80 group-hover:scale-105 transition-transform">
                    <FileText className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary group-hover:text-brand group-hover:font-bold transition-all">
                      Cash Flow Summary – Q2 2024
                    </p>
                    <p className="text-xs text-text-muted">
                      Generated 1 week ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="border border-border/80 text-text-secondary bg-surface-subtle text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md">
                    PDF
                  </span>
                  <div
                    className="p-1.5 text-text-muted group-hover:text-brand transition-colors"
                    title="Download report"
                  >
                    <Download className="size-4" />
                  </div>
                </div>
              </Link>

              <Link
                href="/reports"
                className="py-3 flex items-center justify-between hover:bg-brand-soft/10 px-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-surface-subtle text-text-secondary flex items-center justify-center shrink-0 border border-border/80 group-hover:scale-105 transition-transform">
                    <FileText className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary group-hover:text-brand group-hover:font-bold transition-all">
                      Business Health Report – April 2024
                    </p>
                    <p className="text-xs text-text-muted">
                      Generated 2 weeks ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="border border-border/80 text-text-secondary bg-surface-subtle text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md">
                    PDF
                  </span>
                  <div
                    className="p-1.5 text-text-muted group-hover:text-brand transition-colors"
                    title="Download report"
                  >
                    <Download className="size-4" />
                  </div>
                </div>
              </Link>
            </div>
          </Card>
        </div>
      </FadeInView>

      {/* ── Row 6: Automation Engine Panel ──────────────────────────────────── */}
      <FadeInView offset={24} duration={0.6}>
        <div className="bg-brand-subtle border border-brand-border rounded-2xl p-6 relative shadow-sm hover:shadow-md transition-all group">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-brand-soft/20 text-brand flex items-center justify-center shrink-0 border border-brand/30">
                <BrainCircuit className="size-6" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-text-primary flex items-center gap-2">
                  AI Automation Agent Pipeline
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand bg-brand-soft/10 border border-brand/30 px-2 py-0.5 rounded-full">New</span>
                </h2>
                <p className="text-sm text-text-muted mt-1">
                  Let AI agents synthesize cost-saving workflows and autonomously identify operational bottlenecks.
                </p>
              </div>
            </div>
            <Button variant="primary" size="sm" asChild className="shrink-0 w-full md:w-auto shadow-md">
              <Link href="/advisor" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl">
                <Sparkles className="size-4" />
                <span>Launch Operations Advisor</span>
              </Link>
            </Button>
          </div>
        </div>
      </FadeInView>
    </div>
  );
}
