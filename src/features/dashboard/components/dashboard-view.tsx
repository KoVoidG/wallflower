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
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { Card } from '@/components/ui/card';
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
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
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
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white flex items-center gap-2">
              {t('goodMorning', { name: 'Somchai' })}{' '}
              <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="font-sans text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">
              {t('overviewSubtitle', { businessName: 'Somchai Retail' })}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
              <span>{t('lastUpdatedTwoHours')}</span>
              <button
                type="button"
                onClick={handleRefresh}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1E2638] transition-colors text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white cursor-pointer"
                title={t('refreshData')}
              >
                <RotateCw
                  className={`size-3.5 ${isRefreshing ? 'animate-spin text-[#6366F1]' : ''}`}
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
          <Card className="lg:col-span-6 flex flex-col justify-between space-y-4 rounded-2xl p-6 bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <h2 className="font-display text-base sm:text-lg font-bold text-[#0F172A] dark:text-white">
                  {t('businessHealth')}
                </h2>
                <InfoTooltip content={t('healthTooltip')} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center py-2">
              {/* Score Ring Motion Component with Accurate 84% Arc */}
              <div className="sm:col-span-5 flex items-center justify-center">
                <ProgressGauge
                  score={84}
                  maxScore={100}
                  label={t('healthy')}
                  size={132}
                  color="#00D395"
                />
              </div>

              {/* Health Metrics List with updated tab links and purple bounce hover */}
              <div className="sm:col-span-7 space-y-2.5">
                <Link
                  href="/business-health?tab=operations"
                  className="flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:border-[#6366F1]/30 hover:bg-[#6366F1]/10 dark:hover:bg-[#6366F1]/20 dark:hover:border-[#6366F1]/40 hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="size-4 text-[#64748B] group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] transition-colors shrink-0" />
                    <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:font-semibold transition-all">
                      {t('cashRunway')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:font-bold">
                      8.2 {tCommon('units.months')}
                    </span>
                    <ChevronRight className="size-4 text-[#94A3B8] group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>

                <Link
                  href="/business-health?tab=snapshot"
                  className="flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:border-[#6366F1]/30 hover:bg-[#6366F1]/10 dark:hover:bg-[#6366F1]/20 dark:hover:border-[#6366F1]/40 hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="size-4 text-[#64748B] group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] transition-colors shrink-0" />
                    <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:font-semibold transition-all">
                      {t('riskLevel')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:font-bold">
                      {t('low')}
                    </span>
                    <ChevronRight className="size-4 text-[#94A3B8] group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>

                <Link
                  href="/simulations?tab=workspace"
                  className="flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:border-[#6366F1]/30 hover:bg-[#6366F1]/10 dark:hover:bg-[#6366F1]/20 dark:hover:border-[#6366F1]/40 hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="size-4 text-[#8B5CF6] group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] transition-colors shrink-0" />
                    <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:font-semibold transition-all">
                      {t('decisionConfidence')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:font-bold">
                      {t('high')}
                    </span>
                    <ChevronRight className="size-4 text-[#94A3B8] group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Bottom Banner */}
            <div className="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] dark:bg-emerald-950/40 dark:border-emerald-800/50 px-3.5 py-2.5 text-xs text-[#065F46] dark:text-emerald-300 font-medium flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{t('strongBanner')}</span>
            </div>
          </Card>

          {/* Today's Priorities Card */}
          <Card className="lg:col-span-6 flex flex-col justify-between rounded-2xl p-6 bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <h2 className="font-display text-base sm:text-lg font-bold text-[#0F172A] dark:text-white">
                  {t('todaysPriorities')}
                </h2>
                <InfoTooltip content={t('prioritiesSubtitle')} />
              </div>
              <Link
                href="/business-health?tab=operations"
                className="text-xs font-semibold text-[#4F46E5] dark:text-[#818CF8] hover:underline hover:font-bold transition-all"
              >
                {tCommon('viewAll')}
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-[#1E2638]">
              <Link
                href="/business-health?tab=inventory"
                className="py-3 flex items-center justify-between hover:bg-[#6366F1]/10 dark:hover:bg-[#6366F1]/20 px-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-700/60 group-hover:scale-105 transition-transform">
                    <AlertTriangle className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#0F172A] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:font-bold transition-all">
                      Inventory turnover decreased for 2 months
                    </p>
                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      Current:{' '}
                      <span className="font-mono font-medium">3.1x</span>{' '}
                      (Target: 4.0x)
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-[#94A3B8] group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/business-health?tab=operations"
                className="py-3 flex items-center justify-between hover:bg-[#6366F1]/10 dark:hover:bg-[#6366F1]/20 px-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-700/60 group-hover:scale-105 transition-transform">
                    <AlertTriangle className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#0F172A] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:font-bold transition-all">
                      Cash runway decreased by 0.8 months
                    </p>
                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      Current:{' '}
                      <span className="font-mono font-medium">8.2 months</span>
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-[#94A3B8] group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/simulations?tab=workspace"
                className="py-3 flex items-center justify-between hover:bg-[#6366F1]/10 dark:hover:bg-[#6366F1]/20 px-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-700/60 group-hover:scale-105 transition-transform">
                    <Info className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#0F172A] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:font-bold transition-all">
                      Supplier costs increased 5% this month
                    </p>
                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      Review your scenarios
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-[#94A3B8] group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/simulations?tab=library"
                className="py-3 flex items-center justify-between hover:bg-[#6366F1]/10 dark:hover:bg-[#6366F1]/20 px-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-700/60 group-hover:scale-105 transition-transform">
                    <CheckCircle2 className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#0F172A] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:font-bold transition-all">
                      New simulation template available
                    </p>
                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      Launch Promotion – Summer Campaign
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-[#94A3B8] group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                href="/business-health?tab=inventory"
                className="py-3 flex items-center justify-between hover:bg-[#6366F1]/10 dark:hover:bg-[#6366F1]/20 px-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-full bg-slate-100 dark:bg-[#1E2638] text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0 border border-slate-200 dark:border-[#2A344A] group-hover:scale-105 transition-transform">
                    <Package className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#0F172A] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:font-bold transition-all">
                      Update inventory value
                    </p>
                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      Last updated 18 days ago
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-[#94A3B8] group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:translate-x-1 transition-all" />
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
            <Card className="flex flex-col justify-between gap-2 p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
              <span className="font-sans text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                {t('monthlyRevenue')}
              </span>
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white">
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
                  <ArrowUpRight className="size-3.5" /> 8.4% {t('vsPrevMonth')}
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
          </Link>

          {/* KPI 2: Net Profit */}
          <Link
            href="/business-health?tab=snapshot"
            className="block"
          >
            <Card className="flex flex-col justify-between gap-2 p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
              <span className="font-sans text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                {t('netProfit')}
              </span>
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white">
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
                  <ArrowUpRight className="size-3.5" /> 6.7% {t('vsPrevMonth')}
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
          </Link>

          {/* KPI 3: Cash Runway */}
          <Link
            href="/business-health?tab=operations"
            className="block"
          >
            <Card className="flex flex-col justify-between gap-2 p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
              <span className="font-sans text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                {t('cashRunway')}
              </span>
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white">
                  <CountUp to={8.2} decimals={1} duration={0.65} /> {tCommon('units.months')}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                  <ArrowDownRight className="size-3.5" /> -0.8 {t('vsPrevMonth')}
                </span>
                <div className="h-8 w-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={runwaySparkline}>
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
            </Card>
          </Link>

          {/* KPI 4: Inventory Turnover */}
          <Link
            href="/business-health?tab=inventory"
            className="block"
          >
            <Card className="flex flex-col justify-between gap-2 p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
              <span className="font-sans text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                {t('inventoryTurnover')}
              </span>
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white">
                  <CountUp to={3.1} decimals={1} duration={0.65} />{tCommon('units.times')}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                  <ArrowDownRight className="size-3.5" /> -0.4 {t('vsPrevMonth')}
                </span>
                <div className="h-8 w-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={turnoverSparkline}>
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
            </Card>
          </Link>
        </div>
      </FadeInView>

      {/* ── Row 3: Revenue & Profit Trend (Full Width) ─────────────────────── */}
      <FadeInView offset={18} duration={0.45}>
        <Card className="space-y-4 rounded-2xl p-6 bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base sm:text-lg font-bold text-[#0F172A] dark:text-white">
                {t('revenueAndProfitTrend')}
              </h2>
              <InfoTooltip content={t('trendSubtitle')} />
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-blue-500 shadow-2xs" />
                  <span className="text-[#64748B] dark:text-[#94A3B8] font-semibold">
                    {t('revenue')} (฿)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-emerald-500 shadow-2xs" />
                  <span className="text-[#64748B] dark:text-[#94A3B8] font-semibold">
                    {t('profit')} (฿)
                  </span>
                </div>
              </div>

              <div className="flex items-center bg-[#F1F5F9] dark:bg-[#0B0F17] rounded-xl p-1 border border-slate-200/80 dark:border-[#1E2638]">
                {(['30D', '90D', '12M'] as const).map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setSelectedRange(range)}
                    className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                      selectedRange === range
                        ? 'bg-white dark:bg-[#1E2638] text-[#0F172A] dark:text-white shadow-xs'
                        : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
                    }`}
                  >
                    {range}
                  </button>
                ))}
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-sans text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white transition-colors cursor-pointer"
                >
                  <span>{tCommon('compare')}</span>
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
                          stopColor="#3B82F6"
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3B82F6"
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
                          stopColor="#00D395"
                          stopOpacity={0.22}
                        />
                        <stop
                          offset="95%"
                          stopColor="#00D395"
                          stopOpacity={0.0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#E2E8F0"
                      className="dark:stroke-[#1E2638]"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `${val / 1000}K`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#111622',
                        borderColor: '#263042',
                        borderRadius: '12px',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontFamily: 'JetBrains Mono',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="#3B82F6"
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
                      stroke="#00D395"
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
        <div className="bg-gradient-to-r from-[#F5F3FF] via-[#EDE9FE] to-[#F3E8FF] dark:from-[#181438] dark:via-[#1B1742] dark:to-[#111622] border border-[#DDD6FE] dark:border-purple-900/50 rounded-2xl p-6 relative shadow-sm hover:shadow-md transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Content Area */}
            <div className="lg:col-span-9 space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base font-bold text-[#4F46E5] dark:text-purple-300 flex items-center gap-2">
                  <Sparkles className="size-4 text-[#8B5CF6] dark:text-purple-400" />
                  <span>{t('aiAdvisorCTA')}</span>
                </h2>
                <InfoTooltip
                  content={t('aiAdvisorSubtitle')}
                  iconClassName="text-[#8B5CF6]/70 dark:text-purple-400/70 hover:text-[#8B5CF6] dark:hover:text-purple-300"
                />
              </div>

              <blockquote className="bg-white/80 dark:bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-purple-100/80 dark:border-purple-900/40 text-[#1E1B4B] dark:text-purple-100/90 text-sm leading-relaxed italic">
                &ldquo;Revenue remains stable with healthy growth, but inventory
                turnover has slowed for the second consecutive month. If the
                trend continues, working capital pressure may increase within
                the next quarter.&rdquo;
              </blockquote>

              <div className="space-y-2 pt-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#6D28D9] dark:text-purple-300 font-bold">
                  Key Takeaways
                </span>
                <ul className="space-y-1.5 text-xs sm:text-sm font-medium">
                  <li className="flex items-center gap-2 text-[#0F172A] dark:text-slate-200">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    <span>Maintain current cash position</span>
                  </li>
                  <li className="flex items-center gap-2 text-[#0F172A] dark:text-slate-200">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    <span>Improve inventory turnover</span>
                  </li>
                  <li className="flex items-center gap-2 text-[#0F172A] dark:text-slate-200">
                    <AlertTriangle className="size-4 text-amber-500 shrink-0" />
                    <span>Review slow-moving categories</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: High Confidence Badge aligned directly above Bot Avatar and Action Button */}
            <div className="lg:col-span-3 flex flex-col items-center justify-center gap-3.5 border-t lg:border-t-0 lg:border-l border-[#DDD6FE]/60 dark:border-purple-900/40 pt-4 lg:pt-0 lg:pl-6">
              <div className="bg-[#EDE9FE] dark:bg-purple-950/80 text-[#6D28D9] dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#DDD6FE] dark:border-purple-700/60 flex items-center gap-1.5 shadow-2xs">
                <span className="size-1.5 rounded-full bg-[#8B5CF6] dark:bg-purple-400" />
                <span>HIGH CONFIDENCE</span>
              </div>

              <div
                onClick={() => openDrawer('Can you summarize my business health and key priority recommendations?')}
                className="cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                title={t('aiAdvisorCTA')}
              >
                <BotAvatar size={84} animate />
              </div>

              <button
                type="button"
                onClick={() => openDrawer('Can you summarize my business health and key priority recommendations?')}
                className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-semibold text-xs shadow-md shadow-indigo-500/25 hover:opacity-95 hover:scale-105 active:scale-95 cursor-pointer transition-all"
              >
                <MessageSquare className="size-3.5" />
                <span>{t('aiAdvisorCTA')}</span>
              </button>
            </div>
          </div>
        </div>
      </FadeInView>

      {/* ── Row 5: Recent Simulations & Recent Reports ──────────────────────── */}
      <FadeInView offset={22} duration={0.55}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Simulations */}
          <Card className="flex flex-col justify-between rounded-2xl p-6 bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-base sm:text-lg font-bold text-[#0F172A] dark:text-white">
                {t('recentDecisions')}
              </h2>
              <Link
                href="/simulations?tab=library"
                className="text-xs font-semibold text-[#4F46E5] dark:text-[#818CF8] hover:underline hover:font-bold transition-all"
              >
                {tCommon('viewAll')}
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-[#1E2638]">
              <Link
                href="/simulations?tab=workspace"
                className="py-3 flex items-center justify-between hover:bg-[#6366F1]/10 dark:hover:bg-[#6366F1]/20 px-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-slate-50 dark:bg-[#1E2638] text-[#64748B] dark:text-slate-300 flex items-center justify-center shrink-0 border border-slate-200/80 dark:border-[#2A344A] group-hover:scale-105 transition-transform">
                    <TrendingUp className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:font-bold transition-all">
                      Price Increase +5%
                    </p>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                      Updated 2 days ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="border border-emerald-300 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-700/60 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md">
                    RECOMMENDED
                  </span>
                  <ChevronRight className="size-4 text-[#94A3B8] group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:translate-x-1 transition-all" />
                </div>
              </Link>

              <Link
                href="/simulations?tab=workspace"
                className="py-3 flex items-center justify-between hover:bg-[#6366F1]/10 dark:hover:bg-[#6366F1]/20 px-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-slate-50 dark:bg-[#1E2638] text-[#64748B] dark:text-slate-300 flex items-center justify-center shrink-0 border border-slate-200/80 dark:border-[#2A344A] group-hover:scale-105 transition-transform">
                    <Layers className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:font-bold transition-all">
                      Hire 1 Staff
                    </p>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                      Updated 5 days ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="border border-amber-300 text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-700/60 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md">
                    MODERATE IMPACT
                  </span>
                  <ChevronRight className="size-4 text-[#94A3B8] group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:translate-x-1 transition-all" />
                </div>
              </Link>

              <Link
                href="/simulations?tab=workspace"
                className="py-3 flex items-center justify-between hover:bg-[#6366F1]/10 dark:hover:bg-[#6366F1]/20 px-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-slate-50 dark:bg-[#1E2638] text-[#64748B] dark:text-slate-300 flex items-center justify-center shrink-0 border border-slate-200/80 dark:border-[#2A344A] group-hover:scale-105 transition-transform">
                    <ShoppingBag className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:font-bold transition-all">
                      Launch Promotion
                    </p>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                      Updated 1 week ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="border border-amber-300 text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-700/60 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md">
                    MODERATE IMPACT
                  </span>
                  <ChevronRight className="size-4 text-[#94A3B8] group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </div>
          </Card>

          {/* Recent Reports */}
          <Card className="flex flex-col justify-between rounded-2xl p-6 bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-base sm:text-lg font-bold text-[#0F172A] dark:text-white">
                Recent Reports
              </h2>
              <Link
                href="/reports"
                className="text-xs font-semibold text-[#4F46E5] dark:text-[#818CF8] hover:underline hover:font-bold transition-all"
              >
                {tCommon('viewAll')}
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-[#1E2638]">
              <Link
                href="/reports"
                className="py-3 flex items-center justify-between hover:bg-[#6366F1]/10 dark:hover:bg-[#6366F1]/20 px-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-slate-50 dark:bg-[#1E2638] text-[#64748B] dark:text-slate-300 flex items-center justify-center shrink-0 border border-slate-200/80 dark:border-[#2A344A] group-hover:scale-105 transition-transform">
                    <FileText className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:font-bold transition-all">
                      Executive Report – May 2024
                    </p>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                      Generated 2 days ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="border border-slate-200 text-slate-600 dark:text-slate-300 dark:border-[#2A344A] bg-slate-50 dark:bg-[#1E2638] text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md">
                    PDF
                  </span>
                  <div
                    className="p-1.5 text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] transition-colors"
                    title={tCommon('download')}
                  >
                    <Download className="size-4" />
                  </div>
                </div>
              </Link>

              <Link
                href="/reports"
                className="py-3 flex items-center justify-between hover:bg-[#6366F1]/10 dark:hover:bg-[#6366F1]/20 px-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-slate-50 dark:bg-[#1E2638] text-[#64748B] dark:text-slate-300 flex items-center justify-center shrink-0 border border-slate-200/80 dark:border-[#2A344A] group-hover:scale-105 transition-transform">
                    <FileText className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:font-bold transition-all">
                      Cash Flow Summary – Q2 2024
                    </p>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                      Generated 1 week ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="border border-slate-200 text-slate-600 dark:text-slate-300 dark:border-[#2A344A] bg-slate-50 dark:bg-[#1E2638] text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md">
                    PDF
                  </span>
                  <div
                    className="p-1.5 text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] transition-colors"
                    title={tCommon('download')}
                  >
                    <Download className="size-4" />
                  </div>
                </div>
              </Link>

              <Link
                href="/reports"
                className="py-3 flex items-center justify-between hover:bg-[#6366F1]/10 dark:hover:bg-[#6366F1]/20 px-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-xs transition-all duration-150 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-slate-50 dark:bg-[#1E2638] text-[#64748B] dark:text-slate-300 flex items-center justify-center shrink-0 border border-slate-200/80 dark:border-[#2A344A] group-hover:scale-105 transition-transform">
                    <FileText className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:font-bold transition-all">
                      Business Health Report – April 2024
                    </p>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                      Generated 2 weeks ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="border border-slate-200 text-slate-600 dark:text-slate-300 dark:border-[#2A344A] bg-slate-50 dark:bg-[#1E2638] text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md">
                    PDF
                  </span>
                  <div
                    className="p-1.5 text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] transition-colors"
                    title={tCommon('download')}
                  >
                    <Download className="size-4" />
                  </div>
                </div>
              </Link>
            </div>
          </Card>
        </div>
      </FadeInView>
    </div>
  );
}
