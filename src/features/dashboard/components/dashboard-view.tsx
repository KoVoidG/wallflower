'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Plus,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Play,
  Banknote,
  CheckCircle2,
  Clock,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { Link } from '@/lib/i18n/navigation';
import { AppPage } from '@/components/ui/layout';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChartCard } from '@/components/charts/chart-card';
import { KpiCard } from '@/components/metrics';
import { FadeInView, StaggerChildren, ChartInView } from '@/components/motion';
import {
  FreshnessIndicator,
  FinancialValue,
} from '@/components/ui/domain-values';
import { SnapshotModal } from '@/features/dashboard/components';
import type {
  DashboardData,
  TrendDataPoint,
  KpiData,
} from '../adapters/dashboard.adapter';
import {
  formatThbAxis,
  AXIS_STYLES,
  GRID_STYLES,
} from '@/components/charts/chart-config';

interface DashboardViewProps {
  initialData: DashboardData;
}

export function DashboardView({ initialData }: DashboardViewProps) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2025-01');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const existingMonths = [
    '2024-08',
    '2024-09',
    '2024-10',
    '2024-11',
    '2024-12',
    '2025-01',
  ];

  const periodOptions = [
    { value: '2025-01', label: 'Jan 2025 (Current)' },
    { value: '2024-12', label: 'Dec 2024' },
    { value: '2024-11', label: 'Nov 2024' },
    { value: '2024-10', label: 'Oct 2024' },
  ];

  const handleSaveSnapshot = (newSnapshot: {
    month: string;
    revenue: number;
    cashReserve: number;
    receivables: number;
    payables: number;
    debt: number;
    expenseCategories: Record<string, number>;
  }) => {
    const monthVal = newSnapshot.month;
    const monthNum = parseInt(monthVal.split('-')[1]);
    const monthsShort = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthName = monthsShort[monthNum - 1];

    const revenue = Number(newSnapshot.revenue);
    const cashReserve = Number(newSnapshot.cashReserve);

    let totalExpenses = 0;
    Object.values(newSnapshot.expenseCategories).forEach((val: number) => {
      totalExpenses += Number(val);
    });

    const netProfit = revenue - totalExpenses;
    const runway = totalExpenses > 0 ? cashReserve / totalExpenses : 12;

    const updatedTrends = [...data.trends];
    const existingIndex = updatedTrends.findIndex((t) => t.month === monthName);

    const newTrendPoint: TrendDataPoint = {
      month: monthName,
      revenue,
      expenses: totalExpenses,
      profit: netProfit,
      cashFlow: cashReserve,
    };

    if (existingIndex > -1) {
      updatedTrends[existingIndex] = newTrendPoint;
    } else {
      updatedTrends.push(newTrendPoint);
      if (updatedTrends.length > 6) {
        updatedTrends.shift();
      }
    }

    const updatedKpis: KpiData[] = data.kpis.map((kpi) => {
      if (kpi.label === 'Monthly Revenue') {
        const prevRevenue =
          data.kpis.find((k) => k.label === 'Monthly Revenue')?.numericValue ||
          revenue;
        const pctChange =
          prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : 0;
        const trend = [...(kpi.trend || [])];
        trend.push(revenue);
        if (trend.length > 6) trend.shift();
        return {
          ...kpi,
          value: `฿${revenue.toLocaleString()}`,
          numericValue: revenue,
          change: Number(pctChange.toFixed(1)),
          trend,
        };
      }
      if (kpi.label === 'Cash Runway') {
        const prevRunway =
          data.kpis.find((k) => k.label === 'Cash Runway')?.numericValue ||
          runway;
        const change = runway - prevRunway;
        const trend = [...(kpi.trend || [])];
        trend.push(Number(runway.toFixed(1)));
        if (trend.length > 6) trend.shift();
        return {
          ...kpi,
          value: runway.toFixed(1),
          numericValue: Number(runway.toFixed(1)),
          change: Number(change.toFixed(1)),
          status:
            runway < 3
              ? ('danger' as const)
              : runway < 6
                ? ('warning' as const)
                : ('healthy' as const),
          trend,
        };
      }
      return kpi;
    });

    const updatedHealth = {
      ...data.health,
      completeness: {
        ...data.health.completeness,
        lastUpdated: monthVal + '-01',
        staleDays: 0,
        hasStaleWarning: false,
        periodCount:
          data.health.completeness.periodCount + (existingIndex === -1 ? 1 : 0),
      },
    };

    const updatedPulse = {
      ...data.pulse,
      dataAsOf: monthVal + '-01',
      summary: `Your business has been updated with the snapshot for ${monthName}. Runway is ${runway.toFixed(1)} months.`,
    };

    setData({
      ...data,
      pulse: updatedPulse,
      kpis: updatedKpis,
      trends: updatedTrends,
      health: updatedHealth,
    });
  };

  const isStale =
    data.health.completeness.staleDays > 30 ||
    data.health.completeness.hasStaleWarning;

  // Supporting Financial Summary Metrics
  const supportingSummary = [
    {
      label: 'Net Cash Flow',
      value: 12000,
      change: '+฿12,000/mo',
      isPositive: true,
    },
    {
      label: 'Monthly Debt Repayment',
      value: 15000,
      change: 'On Schedule (฿15k)',
      isPositive: true,
    },
  ];

  // Primary Charts Datasets
  const cashForecastData = [
    {
      period: 'Nov',
      actual: 380000,
      expected: 380000,
      conservative: 380000,
      threshold: 164800,
    },
    {
      period: 'Dec',
      actual: 360000,
      expected: 360000,
      conservative: 360000,
      threshold: 164800,
    },
    {
      period: 'Jan',
      actual: 345000,
      expected: 345000,
      conservative: 345000,
      threshold: 164800,
    },
    {
      period: 'Feb',
      expected: 332600,
      conservative: 310000,
      threshold: 164800,
    },
    {
      period: 'Mar',
      expected: 319600,
      conservative: 285000,
      threshold: 164800,
    },
    {
      period: 'Apr',
      expected: 314600,
      conservative: 270000,
      threshold: 164800,
    },
  ];

  const inflowsOutflowsData = [
    { month: 'Nov', inflows: 138000, outflows: 142000 },
    { month: 'Dec', inflows: 145000, outflows: 138500 },
    { month: 'Jan', inflows: 152400, outflows: 140400 },
    { month: 'Feb (Est)', inflows: 152400, outflows: 164800 },
  ];

  const receivablesAgingData = [
    { range: '0-30 days', amount: 32000, color: '#0F766E' },
    { range: '31-60 days', amount: 14340, color: '#D97706' },
    { range: '61-90 days', amount: 7000, color: '#DC2626' },
    { range: '90+ days', amount: 0, color: '#991B1B' },
  ];

  const expenseBreakdownData = [
    { category: 'Payroll', amount: 85000, pct: 51.6 },
    { category: 'Rent', amount: 32000, pct: 19.4 },
    { category: 'Supplies', amount: 28400, pct: 17.2 },
    { category: 'Marketing', amount: 12000, pct: 7.3 },
    { category: 'Utilities', amount: 7400, pct: 4.5 },
  ];

  return (
    <AppPage>
      <div className="space-y-6">
        {/* 1. Simplified Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight">
                Dashboard
              </h1>
              <Badge variant="healthy" dot>
                Stable Posture
              </Badge>
            </div>
            <p className="text-xs text-text-secondary">
              Decision cockpit summarizing posture, cash runway, active risks,
              and forward actions.
            </p>
            <div className="text-[11px] text-text-muted pt-0.5">
              Data through{' '}
              <strong>{data.health.completeness.lastUpdated}</strong> ·{' '}
              <strong>{data.health.completeness.score}% Completeness</strong> ·{' '}
              <strong>High Confidence</strong>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-44">
              <Select
                value={selectedPeriod}
                onChange={setSelectedPeriod}
                options={periodOptions}
              />
            </div>
            <FreshnessIndicator
              lastUpdated={data.health.completeness.lastUpdated}
              staleDays={data.health.completeness.staleDays}
            />
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="text-xs"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus aria-hidden="true" />
              <span>Record Snapshot</span>
            </Button>
          </div>
        </div>

        {/* Stale Warning Banner */}
        {isStale && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-warning-soft border border-warning/30 rounded-xl text-text-primary">
            <div className="flex gap-2">
              <AlertTriangle
                className="size-5 text-warning shrink-0"
                aria-hidden="true"
              />
              <div className="text-xs">
                <span className="font-semibold">Financial data is stale.</span>{' '}
                Your last snapshot was recorded on{' '}
                {data.health.completeness.lastUpdated}. Update your snapshot to
                keep forecasts accurate.
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="text-xs"
              onClick={() => setIsModalOpen(true)}
            >
              <span>Update Snapshot</span>
            </Button>
          </div>
        )}

        {/* 2. Business Pulse Section (Above-the-fold, immediate reveal, clear 5-level hierarchy) */}
        <div className="rounded-xl border border-brand/30 bg-surface p-5 sm:p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles
                className="size-4 text-brand shrink-0"
                aria-hidden="true"
              />
              <span className="text-xs font-semibold text-brand uppercase tracking-wider">
                Business Pulse
              </span>
            </div>
            <span className="text-xs text-text-muted">Jan 2025 Assessment</span>
          </div>

          <div className="space-y-2">
            {/* 1. Current Posture */}
            <h2 className="text-base sm:text-lg font-semibold text-text-primary leading-snug">
              Your business remains stable, but cash collection is slowing.
            </h2>
            {/* 2. Key Change & Consequence */}
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-3xl">
              Revenue improved <strong>+8.2% to ฿152,400</strong> this month.
              However,{' '}
              <strong>customer payment delays (฿21,340 overdue)</strong> may
              reduce your cash buffer over the next eight weeks.
            </p>
          </div>

          {/* 3. Concerns & Actions Strip */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border/50">
            <div className="text-xs space-y-0.5">
              <span className="text-text-muted block text-[11px] uppercase tracking-wider font-medium">
                Primary Risk Exposure
              </span>
              <span className="font-semibold text-danger">
                3 client invoices over 30 days overdue
              </span>
            </div>

            {/* Dominant Primary Action + Quieter Secondary CTA */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Button asChild variant="primary" size="md" className="text-xs">
                <Link href="/cash-flow">
                  <Banknote aria-hidden="true" />
                  <span>Review Cash Forecast</span>
                </Link>
              </Button>
              <Button asChild variant="secondary" size="md" className="text-xs">
                <Link href="/simulations/new?type=payment_delay">
                  <Play aria-hidden="true" />
                  <span>Simulate Delay</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* 3. Four Primary KPI Cards (Above-the-fold, immediate reveal, interactive affordances) */}
        <section aria-label="Primary Key Performance Indicators">
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StaggerChildren.Item key="revenue" className="h-full">
              <Link href="/business-health" className="block h-full group">
                <KpiCard
                  label="Monthly Revenue"
                  value="฿152,400"
                  numericValue={152400}
                  change={8.2}
                  changePeriod="vs last month"
                  status="healthy"
                  tooltip="Gross sales earned in current month — Click to open Business Health"
                  trend={[128000, 135000, 141000, 138000, 145000, 152400]}
                  className="group-hover:border-brand/40 transition-all"
                />
              </Link>
            </StaggerChildren.Item>

            <StaggerChildren.Item key="profit" className="h-full">
              <Link href="/business-health" className="block h-full group">
                <KpiCard
                  label="Operating Profit"
                  value="฿28,200"
                  numericValue={28200}
                  change={14.5}
                  changePeriod="vs last month"
                  status="healthy"
                  tooltip="Revenue minus operating expenses — Click to open Business Health"
                  trend={[-4000, 5000, 12500, 9000, 16400, 28200]}
                  className="group-hover:border-brand/40 transition-all"
                />
              </Link>
            </StaggerChildren.Item>

            <StaggerChildren.Item key="runway" className="h-full">
              <Link href="/cash-flow" className="block h-full group">
                <KpiCard
                  label="Cash Runway"
                  value="2.1"
                  numericValue={2.1}
                  unit="months"
                  change={-0.4}
                  changePeriod="vs last month"
                  status="warning"
                  tooltip="Estimated months until cash reserve depletion — Click to open Cash Flow"
                  trend={[3.2, 3.0, 2.8, 2.6, 2.4, 2.1]}
                  className="group-hover:border-amber-500/40 transition-all"
                />
              </Link>
            </StaggerChildren.Item>

            <StaggerChildren.Item key="receivables" className="h-full">
              <Link href="/risks" className="block h-full group">
                <KpiCard
                  label="Overdue Receivables"
                  value="฿21,340"
                  numericValue={21340}
                  change={12.0}
                  changePeriod="3 unpaid invoices"
                  status="danger"
                  tooltip="Uncollected customer invoices past due date — Click to open Risk Center"
                  trend={[8000, 10500, 14000, 16000, 19000, 21340]}
                  className="group-hover:border-rose-500/40 transition-all"
                />
              </Link>
            </StaggerChildren.Item>
          </StaggerChildren>
        </section>

        {/* Supporting Financial Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {supportingSummary.map((item) => (
            <div
              key={item.label}
              className="p-3.5 rounded-lg border border-border/80 bg-surface flex items-center justify-between text-xs"
            >
              <span className="font-medium text-text-muted">{item.label}</span>
              <div className="flex items-center gap-2">
                <FinancialValue
                  value={item.value}
                  className="font-semibold text-text-primary"
                />
                <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 4. Primary Analysis (Viewport-triggered reveal for below-the-fold sections) */}
        <div className="space-y-6">
          <ChartInView>
            {(shouldRenderChart) => (
              <ChartCard
                title="Cash Balance History & 3-Month Forward Forecast"
                description="What is our cash trajectory?"
                action={
                  <Link
                    href="/cash-flow"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-hover"
                  >
                    Cash Flow Workspace
                    <ArrowRight className="size-3" />
                  </Link>
                }
                legendItems={[
                  { label: 'Historical Cash', color: '#0F766E' },
                  { label: 'Expected Forecast', color: '#2563EB' },
                  { label: 'Conservative Forecast', color: '#60A5FA' },
                  { label: 'Safe Minimum Threshold', color: '#DC2626' },
                ]}
              >
                <div className="h-72 w-full pt-2">
                  {shouldRenderChart && (
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={cashForecastData}
                        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray={GRID_STYLES.strokeDasharray}
                          stroke="var(--border)"
                          opacity={0.15}
                        />

                        <XAxis
                          dataKey="period"
                          {...AXIS_STYLES}
                          stroke="var(--text-muted)"
                        />

                        <YAxis
                          tickFormatter={formatThbAxis}
                          {...AXIS_STYLES}
                          stroke="var(--text-muted)"
                        />

                        <Tooltip
                          formatter={(value) => [
                            typeof value === 'number'
                              ? `฿${value.toLocaleString()}`
                              : String(value ?? '—'),
                            'Cash Balance',
                          ]}
                          contentStyle={{
                            backgroundColor: 'var(--surface)',
                            borderColor: 'var(--border)',
                            borderRadius: '10px',
                            fontSize: '12px',
                            color: 'var(--text-primary)',
                          }}
                        />

                        <Area
                          type="monotone"
                          dataKey="actual"
                          stroke="#0F766E"
                          fill="#0F766E"
                          fillOpacity={0.15}
                          strokeWidth={2.5}
                          animationDuration={800}
                          animationEasing="ease-out"
                        />

                        <Line
                          type="monotone"
                          dataKey="expected"
                          stroke="#2563EB"
                          strokeDasharray="5 5"
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: '#2563EB' }}
                          animationBegin={100}
                          animationDuration={800}
                          animationEasing="ease-out"
                        />

                        <Line
                          type="monotone"
                          dataKey="conservative"
                          stroke="#60A5FA"
                          strokeDasharray="3 3"
                          strokeWidth={2}
                          dot={{ r: 3, fill: '#60A5FA' }}
                          animationBegin={180}
                          animationDuration={800}
                          animationEasing="ease-out"
                        />

                        <Line
                          type="monotone"
                          dataKey="threshold"
                          stroke="#DC2626"
                          strokeDasharray="2 2"
                          strokeWidth={1.5}
                          dot={false}
                          animationBegin={240}
                          animationDuration={600}
                          animationEasing="ease-out"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </ChartCard>
            )}
          </ChartInView>

          <ChartInView>
            {(shouldRenderChart) => (
              <ChartCard
                title="Revenue, Expenses & Operating Profit Trend"
                description="Are margins expanding?"
                action={
                  <Link
                    href="/business-health"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-hover"
                  >
                    <span>Business Health Diagnostic</span>
                    <ArrowRight className="size-3" />
                  </Link>
                }
                legendItems={[
                  { label: 'Revenue', color: '#0F766E' },
                  { label: 'Operating Expenses', color: '#D97706' },
                  { label: 'Operating Profit', color: '#16A34A' },
                ]}
              >
                <div className="h-72 w-full pt-2">
                  {shouldRenderChart && (
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={data.trends}
                        margin={{
                          top: 10,
                          right: 10,
                          left: -10,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray={GRID_STYLES.strokeDasharray}
                          stroke="var(--border)"
                          opacity={0.15}
                        />

                        <XAxis
                          dataKey="month"
                          {...AXIS_STYLES}
                          stroke="var(--text-muted)"
                        />

                        <YAxis
                          tickFormatter={formatThbAxis}
                          {...AXIS_STYLES}
                          stroke="var(--text-muted)"
                        />

                        <Tooltip
                          formatter={(value) => [
                            typeof value === 'number'
                              ? `฿${value.toLocaleString()}`
                              : String(value ?? '—'),
                            'Amount',
                          ]}
                          contentStyle={{
                            backgroundColor: 'var(--surface)',
                            borderColor: 'var(--border)',
                            borderRadius: '10px',
                            fontSize: '12px',
                            color: 'var(--text-primary)',
                          }}
                        />

                        <Bar
                          dataKey="revenue"
                          fill="#0F766E"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={28}
                          animationDuration={700}
                          animationEasing="ease-out"
                        />

                        <Bar
                          dataKey="expenses"
                          fill="#D97706"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={28}
                          animationBegin={100}
                          animationDuration={700}
                          animationEasing="ease-out"
                        />

                        <Line
                          type="monotone"
                          dataKey="profit"
                          stroke="#16A34A"
                          strokeWidth={2.5}
                          dot={{
                            r: 4,
                            fill: '#16A34A',
                          }}
                          animationBegin={180}
                          animationDuration={750}
                          animationEasing="ease-out"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </ChartCard>
            )}
          </ChartInView>
        </div>

        {/* 5. Supporting Analysis Grid (Viewport-triggered reveal) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartInView delay={0}>
            {(shouldRenderChart) => (
              <ChartCard title="Cash Inflows vs Outflows">
                <div className="h-48">
                  {shouldRenderChart && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={inflowsOutflowsData}
                        margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray={GRID_STYLES.strokeDasharray}
                          stroke="var(--border)"
                          opacity={0.15}
                        />
                        <XAxis
                          dataKey="month"
                          {...AXIS_STYLES}
                          stroke="var(--text-muted)"
                        />
                        <YAxis
                          tickFormatter={formatThbAxis}
                          {...AXIS_STYLES}
                          stroke="var(--text-muted)"
                        />
                        <Tooltip
                          formatter={(val) => [
                            typeof val === 'number'
                              ? `฿${val.toLocaleString()}`
                              : String(val ?? '—'),
                            'Cash Flow',
                          ]}
                        />
                        <Bar
                          dataKey="inflows"
                          fill="#16A34A"
                          radius={[3, 3, 0, 0]}
                          maxBarSize={20}
                          isAnimationActive
                        />
                        <Bar
                          dataKey="outflows"
                          fill="#DC2626"
                          radius={[3, 3, 0, 0]}
                          maxBarSize={20}
                          isAnimationActive
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </ChartCard>
            )}
          </ChartInView>

          {/* Receivables Aging Breakdown */}
          <ChartInView delay={0.06}>
            {(shouldRenderChart) => (
              <ChartCard title="Receivables Aging">
                <div className="h-48">
                  {shouldRenderChart && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={receivablesAgingData}
                        layout="vertical"
                        margin={{ top: 5, right: 10, left: 15, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray={GRID_STYLES.strokeDasharray}
                          stroke="var(--border)"
                          opacity={0.15}
                        />
                        <XAxis
                          type="number"
                          tickFormatter={formatThbAxis}
                          {...AXIS_STYLES}
                          stroke="var(--text-muted)"
                        />
                        <YAxis
                          type="category"
                          dataKey="range"
                          {...AXIS_STYLES}
                          stroke="var(--text-muted)"
                        />
                        <Tooltip
                          formatter={(val) => [
                            typeof val === 'number'
                              ? `฿${val.toLocaleString()}`
                              : String(val ?? '—'),
                            'Overdue',
                          ]}
                        />
                        <Bar
                          dataKey="amount"
                          radius={[0, 4, 4, 0]}
                          maxBarSize={18}
                          isAnimationActive
                        >
                          {receivablesAgingData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </ChartCard>
            )}
          </ChartInView>

          {/* Expense Breakdown */}
          <ChartInView delay={0.12}>
            {(isVisible) => (
              <ChartCard
                title="Expense Breakdown"
                description="Monthly operating expenditure by main category."
              >
                <div className="space-y-2.5 pt-1">
                  {expenseBreakdownData.map((exp, index) => (
                    <div key={exp.category} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-text-primary">
                          {exp.category}
                        </span>

                        <div className="flex items-center gap-2">
                          <FinancialValue
                            value={exp.amount}
                            className="font-semibold"
                          />

                          <span className="text-[11px] text-text-muted">
                            ({exp.pct}%)
                          </span>
                        </div>
                      </div>

                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-subtle">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: isVisible ? `${exp.pct}%` : 0,
                          }}
                          transition={{
                            duration: 0.55,
                            delay: index * 0.07,
                            ease: [0, 0, 0.2, 1],
                          }}
                          className="h-full rounded-full bg-brand"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCard>
            )}
          </ChartInView>
        </div>

        {/* 6. Risks and Opportunities (Viewport-triggered reveal) */}
        <FadeInView>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risks */}
            <Card className="border-danger/30 bg-danger-soft/10 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert
                    className="size-4 text-danger"
                    aria-hidden="true"
                  />
                  <CardTitle>Active Risks & Vulnerabilities</CardTitle>
                </div>
                <Badge variant="critical">2 Active</Badge>
              </div>

              <div className="space-y-2.5">
                <Link href="/risks" className="block group">
                  <div className="p-3 rounded-lg border border-danger/20 bg-surface space-y-1 group-hover:border-danger/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-primary group-hover:text-brand">
                        Landlord 5% Rent Increase
                      </span>
                      <Badge variant="warning">WARNING</Badge>
                    </div>
                    <p className="text-xs text-text-secondary">
                      Expected March 2025 · Exposure: ฿3,500/month burn
                      increase.
                    </p>
                    <div className="pt-1 flex items-center justify-between text-[11px]">
                      <span className="text-text-muted">
                        Recommended: Negotiate 50% deferral
                      </span>
                      <span className="text-brand font-medium group-hover:underline">
                        Inspect →
                      </span>
                    </div>
                  </div>
                </Link>

                <Link href="/risks" className="block group">
                  <div className="p-3 rounded-lg border border-danger/20 bg-surface space-y-1 group-hover:border-danger/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-primary group-hover:text-brand">
                        ฿21,340 Overdue Receivables
                      </span>
                      <Badge variant="critical">CRITICAL</Badge>
                    </div>
                    <p className="text-xs text-text-secondary">
                      3 client invoices over 30 days overdue · Direct runway
                      drag.
                    </p>
                    <div className="pt-1 flex items-center justify-between text-[11px]">
                      <span className="text-text-muted">
                        Recommended: Offer 2% prompt discount
                      </span>
                      <span className="text-brand font-medium group-hover:underline">
                        Simulate →
                      </span>
                    </div>
                  </div>
                </Link>
              </div>

              <Link
                href="/risks"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-hover transition-colors"
              >
                <span>View full risk investigation center</span>
                <ArrowRight className="size-3" aria-hidden="true" />
              </Link>
            </Card>

            {/* Opportunities */}
            <Card className="border-emerald-500/30 bg-emerald-500/5 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    className="size-4 text-emerald-600 dark:text-emerald-400"
                    aria-hidden="true"
                  />
                  <CardTitle>Growth Opportunities</CardTitle>
                </div>
                <Badge variant="success">2 Upsides</Badge>
              </div>

              <div className="space-y-2.5">
                <Link
                  href="/simulations/new?type=hire_employees"
                  className="block group"
                >
                  <div className="p-3 rounded-lg border border-emerald-500/20 bg-surface space-y-1 group-hover:border-emerald-500/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-primary group-hover:text-brand">
                        Weekend Brunch Expansion
                      </span>
                      <Badge variant="success">HIGH CONFIDENCE</Badge>
                    </div>
                    <p className="text-xs text-text-secondary">
                      Possible Benefit: +฿18,000/month upside · Assumption:
                      Saturday demand +40%.
                    </p>
                    <div className="pt-1 flex items-center justify-between text-[11px]">
                      <span className="text-text-muted">
                        Requires 1 part-time barista
                      </span>
                      <span className="text-brand font-medium group-hover:underline">
                        Test Scenario →
                      </span>
                    </div>
                  </div>
                </Link>

                <Link href="/simulations/new" className="block group">
                  <div className="p-3 rounded-lg border border-emerald-500/20 bg-surface space-y-1 group-hover:border-emerald-500/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-primary group-hover:text-brand">
                        Supplier Early Settlement Discount
                      </span>
                      <Badge variant="success">MEDIUM CONFIDENCE</Badge>
                    </div>
                    <p className="text-xs text-text-secondary">
                      Possible Benefit: Saves ฿5,600/month · Assumption: Paid
                      within 10 days.
                    </p>
                    <div className="pt-1 flex items-center justify-between text-[11px]">
                      <span className="text-text-muted">
                        Improves gross margin by +1.4%
                      </span>
                      <span className="text-brand font-medium group-hover:underline">
                        Test Scenario →
                      </span>
                    </div>
                  </div>
                </Link>
              </div>

              <Link
                href="/simulations/new"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-hover transition-colors"
              >
                <span>Test opportunities in decision lab</span>
                <ArrowRight className="size-3" aria-hidden="true" />
              </Link>
            </Card>
          </div>
        </FadeInView>

        {/* 7. Actions and Recent Decisions (Viewport-triggered reveal) */}
        <FadeInView>
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <CardTitle>Actions & Operational Decisions</CardTitle>
                <CardDescription>
                  Execution tasks derived from risks and simulated scenarios.
                </CardDescription>
              </div>
              <Link
                href="/actions"
                className="text-xs font-semibold text-brand hover:underline inline-flex items-center gap-1"
              >
                <span>View Action Log</span>
                <ChevronRight className="size-3" />
              </Link>
            </div>

            <div className="divide-y divide-border/50 text-xs">
              <Link href="/actions" className="block py-2.5 group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <Clock className="size-3.5 text-warning shrink-0" />
                    <div>
                      <span className="font-semibold text-text-primary group-hover:text-brand block">
                        Negotiate Early Invoice Collection for Client Invoice
                        #1042
                      </span>
                      <span className="text-[11px] text-text-muted">
                        Related: OVERDUE_RECEIVABLES_DRAG · Due Feb 5, 2025
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <Badge variant="warning">In Progress</Badge>
                    <span className="text-brand font-medium group-hover:underline">
                      Review →
                    </span>
                  </div>
                </div>
              </Link>

              <Link href="/actions" className="block py-2.5 group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="size-3.5 text-brand shrink-0" />
                    <div>
                      <span className="font-semibold text-text-primary group-hover:text-brand block">
                        Request Landlord Commercial Rent Adjustment Deferral
                      </span>
                      <span className="text-[11px] text-text-muted">
                        Related: LANDLORD_RENT_INCREASE · Due Feb 15, 2025
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <Badge variant="default">Not Started</Badge>
                    <span className="text-brand font-medium group-hover:underline">
                      Review →
                    </span>
                  </div>
                </div>
              </Link>

              <Link href="/simulations" className="block py-2.5 group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-text-primary group-hover:text-brand block">
                        Simulate SME Bank Loan vs Equipment Lease
                      </span>
                      <span className="text-[11px] text-text-muted">
                        Outcome: Avoided ฿200,000 capex drag · Completed Jan 20,
                        2025
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <Badge variant="success">Completed</Badge>
                    <span className="text-brand font-medium group-hover:underline">
                      View Decision →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </Card>
        </FadeInView>

        {/* Snapshot Modal */}
        <SnapshotModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveSnapshot}
          existingMonths={existingMonths}
        />
      </div>
    </AppPage>
  );
}
