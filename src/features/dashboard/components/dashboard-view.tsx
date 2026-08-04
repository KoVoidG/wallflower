'use client';

import { useState } from 'react';
import {
  RotateCw,
  Calendar,
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BotAvatar } from '@/components/ui/bot-avatar';
import {
  FadeInView,
  ProgressGauge,
  CountUp,
  ChartInView,
} from '@/components/motion';
import type { DashboardData } from '../adapters/dashboard.adapter';

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
  const [selectedRange, setSelectedRange] = useState<'30D' | '90D' | '12M'>(
    '90D',
  );
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
            <p className="font-sans text-sm text-text-secondary mt-1">
              Here&apos;s what&apos;s happening with Somchai Retail today.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
              <span>Last updated 2 hours ago</span>
              <button
                type="button"
                onClick={handleRefresh}
                className="p-1 rounded hover:bg-surface-hover transition-colors text-text-secondary hover:text-text-primary cursor-pointer"
                title="Refresh dashboard data"
              >
                <RotateCw
                  className={`size-3.5 ${isRefreshing ? 'animate-spin text-tertiary' : ''}`}
                />
              </button>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-surface text-xs font-medium text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
            >
              <Calendar className="size-3.5 text-text-secondary" />
              <span>May 20, 2024</span>
              <ChevronDown className="size-3.5 text-text-secondary" />
            </button>
          </div>
        </div>
      </FadeInView>

      {/* ── Row 1: Business Health & Today's Priorities ─────────────────────── */}
      <FadeInView offset={14} duration={0.35}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Business Health Card */}
          <Card className="lg:col-span-6 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <h2 className="font-display text-lg font-semibold text-text-primary">
                  Business Health
                </h2>
                <Info className="size-4 text-text-secondary cursor-help" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center py-2">
              {/* Score Ring Motion Component */}
              <div className="sm:col-span-5 flex items-center justify-center">
                <ProgressGauge
                  score={84}
                  maxScore={100}
                  label="Healthy"
                  size={132}
                />
              </div>

              {/* Health Metrics List */}
              <div className="sm:col-span-7 space-y-3">
                <Link
                  href="/cash-flow"
                  className="flex items-center justify-between p-2.5 rounded-md hover:bg-surface-hover transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="size-4 text-tertiary shrink-0" />
                    <span className="text-xs font-medium text-text-secondary">
                      Cash Runway
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-xs font-semibold text-tertiary">
                      8.2 months
                    </span>
                    <ChevronRight className="size-4 text-text-secondary group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>

                <Link
                  href="/risks"
                  className="flex items-center justify-between p-2.5 rounded-md hover:bg-surface-hover transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="size-4 text-tertiary shrink-0" />
                    <span className="text-xs font-medium text-text-secondary">
                      Risk Level
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-xs font-semibold text-tertiary">
                      Low
                    </span>
                    <ChevronRight className="size-4 text-text-secondary group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>

                <Link
                  href="/advisor"
                  className="flex items-center justify-between p-2.5 rounded-md hover:bg-surface-hover transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="size-4 text-tertiary shrink-0" />
                    <span className="text-xs font-medium text-text-secondary">
                      Decision Confidence
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-xs font-semibold text-tertiary">
                      High
                    </span>
                    <ChevronRight className="size-4 text-text-secondary group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Bottom Banner */}
            <div className="rounded-md bg-success-soft/20 border border-success/30 px-3.5 py-2.5 text-xs text-tertiary font-medium flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>
                Your business is in a strong position. Keep an eye on inventory
                turnover.
              </span>
            </div>
          </Card>

          {/* Today's Priorities Card */}
          <Card className="lg:col-span-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <h2 className="font-display text-lg font-semibold text-text-primary">
                  Today&apos;s Priorities
                </h2>
                <Info className="size-4 text-text-secondary cursor-help" />
              </div>
              <Link
                href="/actions"
                className="text-xs font-medium text-tertiary hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="divide-y divide-border/60">
              <Link
                href="/business-health"
                className="py-3 flex items-center justify-between hover:bg-surface-hover px-2 rounded-md transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-full bg-warning-soft/40 text-warning flex items-center justify-center shrink-0">
                    <AlertTriangle className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">
                      Inventory turnover decreased for 2 months
                    </p>
                    <p className="text-[11px] text-text-secondary">
                      Current:{' '}
                      <span className="font-mono font-medium">3.1x</span>{' '}
                      (Target: 4.0x)
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-text-secondary group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/cash-flow"
                className="py-3 flex items-center justify-between hover:bg-surface-hover px-2 rounded-md transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-full bg-warning-soft/40 text-warning flex items-center justify-center shrink-0">
                    <AlertTriangle className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">
                      Cash runway decreased by 0.8 months
                    </p>
                    <p className="text-[11px] text-text-secondary">
                      Current:{' '}
                      <span className="font-mono font-medium">8.2 months</span>
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-text-secondary group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/simulations"
                className="py-3 flex items-center justify-between hover:bg-surface-hover px-2 rounded-md transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-full bg-info-soft/40 text-info flex items-center justify-center shrink-0">
                    <Info className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">
                      Supplier costs increased 5% this month
                    </p>
                    <p className="text-[11px] text-text-secondary">
                      Review your scenarios
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-text-secondary group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/simulations"
                className="py-3 flex items-center justify-between hover:bg-surface-hover px-2 rounded-md transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-full bg-success-soft/40 text-tertiary flex items-center justify-center shrink-0">
                    <CheckCircle2 className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">
                      New simulation template available
                    </p>
                    <p className="text-[11px] text-text-secondary">
                      Launch Promotion – Summer Campaign
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-text-secondary group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/business-health"
                className="py-3 flex items-center justify-between hover:bg-surface-hover px-2 rounded-md transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-full bg-surface-hover text-text-secondary flex items-center justify-center shrink-0">
                    <Package className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">
                      Update inventory value
                    </p>
                    <p className="text-[11px] text-text-secondary">
                      Last updated 18 days ago
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-text-secondary group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </Card>
        </div>
      </FadeInView>

      {/* ── Row 2: 4 KPI Cards ────────────────────────────────────────────────── */}
      <FadeInView offset={16} duration={0.4}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* KPI 1: Monthly Revenue */}
          <Card className="flex flex-col justify-between gap-2 p-5">
            <span className="font-sans text-xs font-medium text-text-secondary">
              Monthly Revenue
            </span>
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-mono text-xl sm:text-2xl font-semibold text-text-primary">
                ฿
                <CountUp
                  to={1250000}
                  duration={0.65}
                  formatter={(val) => Math.round(val).toLocaleString()}
                />
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-tertiary">
                <ArrowUpRight className="size-3.5" /> 8.4% vs last month
              </span>
              <div className="h-8 w-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueSparkline}>
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
          </Card>

          {/* KPI 2: Net Profit */}
          <Card className="flex flex-col justify-between gap-2 p-5">
            <span className="font-sans text-xs font-medium text-text-secondary">
              Net Profit
            </span>
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-mono text-xl sm:text-2xl font-semibold text-text-primary">
                ฿
                <CountUp
                  to={186000}
                  duration={0.65}
                  formatter={(val) => Math.round(val).toLocaleString()}
                />
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-tertiary">
                <ArrowUpRight className="size-3.5" /> 6.7% vs last month
              </span>
              <div className="h-8 w-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={profitSparkline}>
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
          </Card>

          {/* KPI 3: Cash Runway */}
          <Card className="flex flex-col justify-between gap-2 p-5">
            <span className="font-sans text-xs font-medium text-text-secondary">
              Cash Runway
            </span>
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-mono text-xl sm:text-2xl font-semibold text-text-primary">
                <CountUp to={8.2} decimals={1} duration={0.65} /> months
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-warning">
                <ArrowDownRight className="size-3.5" /> -0.8 vs last month
              </span>
              <div className="h-8 w-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={runwaySparkline}>
                    <Line
                      type="monotone"
                      dataKey="val"
                      stroke="#F5B942"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* KPI 4: Inventory Turnover */}
          <Card className="flex flex-col justify-between gap-2 p-5">
            <span className="font-sans text-xs font-medium text-text-secondary">
              Inventory Turnover
            </span>
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-mono text-xl sm:text-2xl font-semibold text-text-primary">
                <CountUp to={3.1} decimals={1} duration={0.65} />x
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-warning">
                <ArrowDownRight className="size-3.5" /> -0.4 vs last month
              </span>
              <div className="h-8 w-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={turnoverSparkline}>
                    <Line
                      type="monotone"
                      dataKey="val"
                      stroke="#F5B942"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>
      </FadeInView>

      {/* ── Row 3: Revenue & Profit Trend (Full Width) ─────────────────────── */}
      <FadeInView offset={18} duration={0.45}>
        <Card className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg font-semibold text-text-primary">
                Revenue & Profit Trend
              </h2>
              <Info className="size-4 text-text-secondary cursor-help" />
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-tertiary" />
                  <span className="text-text-secondary font-medium">
                    Revenue (฿)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-info" />
                  <span className="text-text-secondary font-medium">
                    Net Profit (฿)
                  </span>
                </div>
              </div>

              <div className="flex items-center bg-surface-hover rounded-md p-1 border border-border">
                {(['30D', '90D', '12M'] as const).map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setSelectedRange(range)}
                    className={`px-2.5 py-1 text-xs font-mono font-medium rounded transition-colors cursor-pointer ${
                      selectedRange === range
                        ? 'bg-surface text-text-primary border border-border shadow-xs'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {range}
                  </button>
                ))}
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-sans text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
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
                          stopColor="#00D395"
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor="#00D395"
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
                          stopColor="#4FA8FF"
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor="#4FA8FF"
                          stopOpacity={0.0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      stroke="#98A2B3"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#98A2B3"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `${val / 1000}K`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#141820',
                        borderColor: '#2A3240',
                        borderRadius: '8px',
                        color: '#F2F4F7',
                        fontSize: '12px',
                        fontFamily: 'JetBrains Mono',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="#00D395"
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
                      stroke="#4FA8FF"
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

      {/* ── Row 4: AI Executive Summary (Full Width) ───────────────────────── */}
      <FadeInView offset={20} duration={0.5}>
        <Card className="bg-surface-hover border-l-4 border-l-info space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg font-semibold text-text-primary">
                AI Executive Summary
              </h2>
              <Info className="size-4 text-text-secondary cursor-help" />
            </div>
            <Badge variant="success" dot className="mr-13">
              High Confidence
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-9 space-y-4">
              <blockquote className="font-sans text-base leading-relaxed text-text-primary italic border-l-2 border-border pl-4">
                &ldquo;Revenue remains stable with healthy growth, but inventory
                turnover has slowed for the second consecutive month. If the
                trend continues, working capital pressure may increase within
                the next quarter.&rdquo;
              </blockquote>

              <div className="space-y-2 pt-2">
                <span className="font-mono text-xs uppercase tracking-wider text-text-secondary font-semibold">
                  Key Takeaways
                </span>
                <ul className="space-y-1.5 text-xs sm:text-sm font-medium">
                  <li className="flex items-center gap-2 text-text-primary">
                    <CheckCircle2 className="size-4 text-tertiary shrink-0" />
                    <span>Maintain current cash position</span>
                  </li>
                  <li className="flex items-center gap-2 text-text-primary">
                    <CheckCircle2 className="size-4 text-tertiary shrink-0" />
                    <span>Improve inventory turnover</span>
                  </li>
                  <li className="flex items-center gap-2 text-text-primary">
                    <AlertTriangle className="size-4 text-warning shrink-0" />
                    <span>Review slow-moving categories</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Custom SVG Bot Avatar Illustration */}
            <div className="lg:col-span-3 flex flex-col items-center justify-center gap-3 border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-6">
              <BotAvatar size={80} animate />
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto mt-1"
              >
                <Link
                  href="/advisor"
                  className="inline-flex items-center gap-2"
                >
                  <MessageSquare className="size-3.5 text-info" />
                  <span>Ask AI Advisor</span>
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </FadeInView>

      {/* ── Row 5: Recent Simulations & Recent Reports ──────────────────────── */}
      <FadeInView offset={22} duration={0.55}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Simulations */}
          <Card className="flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-text-primary">
                Recent Simulations
              </h2>
              <Link
                href="/simulations"
                className="text-xs font-medium text-tertiary hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="divide-y divide-border/60">
              <Link
                href="/simulations"
                className="py-3 flex items-center justify-between hover:bg-surface-hover px-2 rounded-md transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-md bg-success-soft/40 text-tertiary flex items-center justify-center shrink-0">
                    <TrendingUp className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      Price Increase +5%
                    </p>
                    <p className="text-xs text-text-secondary">
                      Updated 2 days ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="success">Recommended</Badge>
                  <ChevronRight className="size-4 text-text-secondary group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>

              <Link
                href="/simulations"
                className="py-3 flex items-center justify-between hover:bg-surface-hover px-2 rounded-md transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-md bg-info-soft/40 text-info flex items-center justify-center shrink-0">
                    <Layers className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      Hire 1 Staff
                    </p>
                    <p className="text-xs text-text-secondary">
                      Updated 5 days ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="warning">Moderate Impact</Badge>
                  <ChevronRight className="size-4 text-text-secondary group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>

              <Link
                href="/simulations"
                className="py-3 flex items-center justify-between hover:bg-surface-hover px-2 rounded-md transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-md bg-warning-soft/40 text-warning flex items-center justify-center shrink-0">
                    <ShoppingBag className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      Launch Promotion
                    </p>
                    <p className="text-xs text-text-secondary">
                      Updated 1 week ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="warning">Moderate Impact</Badge>
                  <ChevronRight className="size-4 text-text-secondary group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </div>
          </Card>

          {/* Recent Reports */}
          <Card className="flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-text-primary">
                Recent Reports
              </h2>
              <Link
                href="/reports"
                className="text-xs font-medium text-tertiary hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="divide-y divide-border/60">
              <div className="py-3 flex items-center justify-between hover:bg-surface-hover px-2 rounded-md transition-colors">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-md bg-surface-hover text-text-secondary flex items-center justify-center shrink-0 border border-border">
                    <FileText className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      Executive Report – May 2024
                    </p>
                    <p className="text-xs text-text-secondary">
                      Generated 2 days ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="neutral">PDF</Badge>
                  <button
                    type="button"
                    className="p-1.5 text-text-secondary hover:text-text-primary rounded hover:bg-surface transition-colors cursor-pointer"
                    title="Download report"
                  >
                    <Download className="size-4" />
                  </button>
                </div>
              </div>

              <div className="py-3 flex items-center justify-between hover:bg-surface-hover px-2 rounded-md transition-colors">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-md bg-surface-hover text-text-secondary flex items-center justify-center shrink-0 border border-border">
                    <FileText className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      Cash Flow Summary – Q2 2024
                    </p>
                    <p className="text-xs text-text-secondary">
                      Generated 1 week ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="neutral">PDF</Badge>
                  <button
                    type="button"
                    className="p-1.5 text-text-secondary hover:text-text-primary rounded hover:bg-surface transition-colors cursor-pointer"
                    title="Download report"
                  >
                    <Download className="size-4" />
                  </button>
                </div>
              </div>

              <div className="py-3 flex items-center justify-between hover:bg-surface-hover px-2 rounded-md transition-colors">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-md bg-surface-hover text-text-secondary flex items-center justify-center shrink-0 border border-border">
                    <FileText className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      Business Health Report – April 2024
                    </p>
                    <p className="text-xs text-text-secondary">
                      Generated 2 weeks ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="neutral">PDF</Badge>
                  <button
                    type="button"
                    className="p-1.5 text-text-secondary hover:text-text-primary rounded hover:bg-surface transition-colors cursor-pointer"
                    title="Download report"
                  >
                    <Download className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </FadeInView>
    </div>
  );
}
