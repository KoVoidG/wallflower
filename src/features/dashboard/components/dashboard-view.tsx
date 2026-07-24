'use client';

import { useState } from 'react';
import {
  Plus,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Play,
  Bot,
  Banknote,
  CheckCircle2,
  Clock,
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
import { AppPage, PageHeader } from '@/components/ui/layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartCard } from '@/components/charts/chart-card';
import { KpiCard } from '@/components/metrics';
import { FadeInView, StaggerChildren } from '@/components/motion';
import {
  FreshnessIndicator,
  CompletenessIndicator,
  QualityBadge,
  FinancialValue,
} from '@/components/ui/domain-values';
import { SnapshotModal } from '@/features/dashboard/components';
import type { DashboardData, TrendDataPoint, KpiData } from '../adapters/dashboard.adapter';
import { formatThbAxis, AXIS_STYLES, GRID_STYLES } from '@/components/charts/chart-config';

interface DashboardViewProps {
  initialData: DashboardData;
}

export function DashboardView({ initialData }: DashboardViewProps) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const existingMonths = ['2024-08', '2024-09', '2024-10', '2024-11', '2024-12', '2025-01'];

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
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
        const prevRevenue = data.kpis.find((k) => k.label === 'Monthly Revenue')?.numericValue || revenue;
        const pctChange = prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : 0;
        const trend = [...(kpi.trend || [])];
        trend.push(revenue);
        if (trend.length > 6) trend.shift();
        return { ...kpi, value: `฿${revenue.toLocaleString()}`, numericValue: revenue, change: Number(pctChange.toFixed(1)), trend };
      }
      if (kpi.label === 'Cash Runway') {
        const prevRunway = data.kpis.find((k) => k.label === 'Cash Runway')?.numericValue || runway;
        const change = runway - prevRunway;
        const trend = [...(kpi.trend || [])];
        trend.push(Number(runway.toFixed(1)));
        if (trend.length > 6) trend.shift();
        return { ...kpi, value: runway.toFixed(1), numericValue: Number(runway.toFixed(1)), change: Number(change.toFixed(1)), status: runway < 3 ? 'danger' as const : runway < 6 ? 'warning' as const : 'healthy' as const, trend };
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
        periodCount: data.health.completeness.periodCount + (existingIndex === -1 ? 1 : 0),
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

  const isStale = data.health.completeness.staleDays > 30 || data.health.completeness.hasStaleWarning;

  // 6 KPI Metrics
  const sixKpis: KpiData[] = [
    {
      label: 'Monthly Revenue',
      value: '฿152,400',
      numericValue: 152400,
      change: 8.2,
      changePeriod: 'vs last month',
      status: 'healthy',
      tooltip: 'Gross sales earned in current month',
      trend: [128000, 135000, 141000, 138000, 145000, 152400],
    },
    {
      label: 'Operating Profit',
      value: '฿28,200',
      numericValue: 28200,
      change: 14.5,
      changePeriod: 'vs last month',
      status: 'healthy',
      tooltip: 'Revenue minus operating expenses',
      trend: [-4000, 5000, 12500, 9000, 16400, 28200],
    },
    {
      label: 'Net Cash Flow',
      value: '+฿12,000',
      numericValue: 12000,
      change: -2.1,
      changePeriod: 'vs last month',
      status: 'healthy',
      tooltip: 'Net increase in cash reserves',
      trend: [5000, 8000, 11000, 9500, 10500, 12000],
    },
    {
      label: 'Cash Runway',
      value: '2.1',
      numericValue: 2.1,
      unit: 'months',
      change: -0.4,
      changePeriod: 'vs last month',
      status: 'warning',
      tooltip: 'Estimated months until cash reserve depletion',
      trend: [3.2, 3.0, 2.8, 2.6, 2.4, 2.1],
    },
    {
      label: 'Overdue Receivables',
      value: '฿21,340',
      numericValue: 21340,
      change: 12.0,
      changePeriod: '3 unpaid invoices',
      status: 'danger',
      tooltip: 'Uncollected customer invoices past due date',
      trend: [8000, 10500, 14000, 16000, 19000, 21340],
    },
    {
      label: 'Monthly Debt Repayment',
      value: '฿15,000',
      numericValue: 15000,
      change: 0.0,
      changePeriod: 'on schedule',
      status: 'healthy',
      tooltip: 'SME Bank loan principal and interest installment',
      trend: [15000, 15000, 15000, 15000, 15000, 15000],
    },
  ];

  // Supporting Chart Datasets
  const cashForecastData = [
    { period: 'Nov', actual: 380000, expected: 380000, threshold: 164800 },
    { period: 'Dec', actual: 360000, expected: 360000, threshold: 164800 },
    { period: 'Jan', actual: 345000, expected: 345000, threshold: 164800 },
    { period: 'Feb', expected: 332600, threshold: 164800 },
    { period: 'Mar', expected: 319600, threshold: 164800 },
    { period: 'Apr', expected: 314600, threshold: 164800 },
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
        {/* 1. Page Header & Data Freshness */}
        <PageHeader
          title="Executive Cockpit"
          description="Decision cockpit summarizing posture, cash runway, active risks, and forward actions."
          badge={<Badge variant="healthy" dot>Reporting Period: Jan 2025</Badge>}
          actions={
            <div className="flex flex-wrap items-center gap-2.5">
              <FreshnessIndicator lastUpdated={data.health.completeness.lastUpdated} staleDays={data.health.completeness.staleDays} />
              <CompletenessIndicator score={data.health.completeness.score} confidence="high" />
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand text-white hover:bg-brand-hover transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="size-3.5" aria-hidden="true" />
                <span>Record Snapshot</span>
              </button>
            </div>
          }
        />

        {/* Stale Warning Banner */}
        {isStale && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-warning-soft border border-warning/30 rounded-xl text-text-primary">
            <div className="flex gap-2">
              <AlertTriangle className="size-5 text-warning shrink-0" aria-hidden="true" />
              <div className="text-xs">
                <span className="font-semibold">Financial data is stale.</span> Your last snapshot was recorded on {data.health.completeness.lastUpdated}. Update your financial snapshot to keep forecasts and simulations accurate.
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold rounded-md bg-warning text-white hover:bg-warning/80 transition-colors cursor-pointer shrink-0"
            >
              Update Snapshot
            </button>
          </div>
        )}

        {/* 2. Executive Summary */}
        <FadeInView>
          <Card className="border-brand/20 bg-brand-soft/15 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-brand shrink-0" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand">Executive Summary</span>
                </div>
                <p className="text-xs sm:text-sm text-text-primary leading-relaxed max-w-3xl">
                  Overall business posture is <strong>Stable</strong>. Revenue grew 8.2% to ฿152,400, but cash runway stands at <strong>2.1 months</strong> due to ฿21,340 in overdue receivables and an upcoming 5% rent increase notification.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-brand/15">
              <Link
                href="/cash-flow"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-text-primary transition-colors shadow-2xs"
              >
                <Banknote className="size-3.5 text-brand" />
                <span>Review Cash Forecast</span>
              </Link>
              <Link
                href="/risks"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-text-primary transition-colors shadow-2xs"
              >
                <ShieldAlert className="size-3.5 text-danger" />
                <span>Open Highest-Priority Risk</span>
              </Link>
              <Link
                href="/simulations/new"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-text-primary transition-colors shadow-2xs"
              >
                <Play className="size-3.5 text-brand" />
                <span>Run Suggested Simulation</span>
              </Link>
              <Link
                href="/advisor"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-text-primary transition-colors shadow-2xs"
              >
                <Bot className="size-3.5 text-ai" />
                <span>Ask Advisor</span>
              </Link>
            </div>
          </Card>
        </FadeInView>

        {/* 3. Primary KPIs */}
        <section aria-label="Key performance indicators">
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sixKpis.map((kpi) => (
              <StaggerChildren.Item key={kpi.label} className="h-full">
                <KpiCard
                  label={kpi.label}
                  value={kpi.value}
                  unit={kpi.unit}
                  numericValue={kpi.numericValue}
                  change={kpi.change}
                  changePeriod={kpi.changePeriod}
                  status={kpi.status}
                  tooltip={kpi.tooltip}
                  trend={kpi.trend}
                />
              </StaggerChildren.Item>
            ))}
          </StaggerChildren>
        </section>

        {/* 4. Primary Charts (Wide Primary & Second Major) */}
        <FadeInView className="space-y-6">
          {/* Chart 1: Cash-Balance History & Forward Forecast (Primary Wide Chart) */}
          <ChartCard
            title="Cash Balance History & 3-Month Forward Forecast"
            description="What is our cash trajectory? Shows historical balance alongside 3-month forecast against 1-month safe minimum."
            action={
              <Link href="/cash-flow" className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-hover">
                <span>Cash Flow Workspace</span>
                <ArrowRight className="size-3" />
              </Link>
            }
            legendItems={[
              { label: 'Historical Cash', color: '#0F766E' },
              { label: 'Projected Cash', color: '#2DD4BF' },
              { label: 'Safe Minimum Threshold', color: '#DC2626' },
            ]}
          >
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={cashForecastData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray={GRID_STYLES.strokeDasharray} stroke="var(--border)" opacity={GRID_STYLES.strokeOpacity} />
                  <XAxis dataKey="period" {...AXIS_STYLES} stroke="var(--text-muted)" />
                  <YAxis tickFormatter={formatThbAxis} {...AXIS_STYLES} stroke="var(--text-muted)" />
                  <Tooltip
                    formatter={(val) => [typeof val === 'number' ? `฿${val.toLocaleString()}` : String(val ?? '—'), 'Cash Balance']}
                    contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '10px', fontSize: '12px', color: 'var(--text-primary)' }}
                  />
                  <Area type="monotone" dataKey="actual" stroke="#0F766E" fill="#0F766E" fillOpacity={0.15} strokeWidth={2.5} />
                  <Line type="monotone" dataKey="expected" stroke="#2DD4BF" strokeDasharray="5 5" strokeWidth={2.5} dot={{ r: 4, fill: '#2DD4BF' }} />
                  <Line type="monotone" dataKey="threshold" stroke="#DC2626" strokeDasharray="3 3" strokeWidth={1.5} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Chart 2: Revenue, Expenses, and Profit Trend (Second Major Chart) */}
          <ChartCard
            title="Revenue, Expenses & Operating Profit Trend"
            description="Are margins expanding? Compares monthly revenue against operating expenses and net profit velocity."
            action={
              <Link href="/business-health" className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-hover">
                <span>Business Health Diagnostic</span>
                <ArrowRight className="size-3" />
              </Link>
            }
            legendItems={[
              { label: 'Revenue', color: '#0F766E' },
              { label: 'Expenses', color: '#D97706' },
              { label: 'Operating Profit', color: '#16A34A' },
            ]}
          >
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data.trends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray={GRID_STYLES.strokeDasharray} stroke="var(--border)" opacity={GRID_STYLES.strokeOpacity} />
                  <XAxis dataKey="month" {...AXIS_STYLES} stroke="var(--text-muted)" />
                  <YAxis tickFormatter={formatThbAxis} {...AXIS_STYLES} stroke="var(--text-muted)" />
                  <Tooltip
                    formatter={(val) => [typeof val === 'number' ? `฿${val.toLocaleString()}` : String(val ?? '—'), 'Amount']}
                    contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '10px', fontSize: '12px', color: 'var(--text-primary)' }}
                  />
                  <Bar dataKey="revenue" fill="#0F766E" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="expenses" fill="#D97706" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  <Line type="monotone" dataKey="profit" stroke="#16A34A" strokeWidth={2.5} dot={{ r: 4, fill: '#16A34A' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </FadeInView>

        {/* 5. Supporting Charts Grid (Inflows/Outflows, Receivables Aging, Expense Breakdown) */}
        <FadeInView>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart 3: Cash Inflows vs Outflows */}
            <ChartCard
              title="Cash Inflows vs Outflows"
              description="Monthly cash collections vs total operating expenditures."
              legendItems={[
                { label: 'Inflows', color: '#16A34A' },
                { label: 'Outflows', color: '#DC2626' },
              ]}
            >
              <div className="h-48 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={inflowsOutflowsData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray={GRID_STYLES.strokeDasharray} stroke="var(--border)" opacity={GRID_STYLES.strokeOpacity} />
                    <XAxis dataKey="month" {...AXIS_STYLES} stroke="var(--text-muted)" />
                    <YAxis tickFormatter={formatThbAxis} {...AXIS_STYLES} stroke="var(--text-muted)" />
                    <Tooltip formatter={(val) => [typeof val === 'number' ? `฿${val.toLocaleString()}` : String(val ?? '—'), 'Cash Flow']} />
                    <Bar dataKey="inflows" fill="#16A34A" radius={[3, 3, 0, 0]} maxBarSize={20} />
                    <Bar dataKey="outflows" fill="#DC2626" radius={[3, 3, 0, 0]} maxBarSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            {/* Chart 4: Receivables Aging Breakdown */}
            <ChartCard
              title="Receivables Aging"
              description="Uncollected client invoices grouped by overdue period."
            >
              <div className="h-48 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={receivablesAgingData} layout="vertical" margin={{ top: 5, right: 10, left: 15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray={GRID_STYLES.strokeDasharray} stroke="var(--border)" opacity={GRID_STYLES.strokeOpacity} />
                    <XAxis type="number" tickFormatter={formatThbAxis} {...AXIS_STYLES} stroke="var(--text-muted)" />
                    <YAxis type="category" dataKey="range" {...AXIS_STYLES} stroke="var(--text-muted)" />
                    <Tooltip formatter={(val) => [typeof val === 'number' ? `฿${val.toLocaleString()}` : String(val ?? '—'), 'Overdue']} />
                    <Bar dataKey="amount" radius={[0, 4, 4, 0]} maxBarSize={18}>
                      {receivablesAgingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            {/* Chart 5: Expense Breakdown */}
            <ChartCard
              title="Expense Breakdown"
              description="Monthly operating expenditure by main category."
            >
              <div className="space-y-2.5 pt-1">
                {expenseBreakdownData.map((exp) => (
                  <div key={exp.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-text-primary">{exp.category}</span>
                      <div className="flex items-center gap-2">
                        <FinancialValue value={exp.amount} className="font-bold" />
                        <span className="text-[11px] text-text-muted">({exp.pct}%)</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
                      <div className="h-full bg-brand transition-all duration-300" style={{ width: `${exp.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </FadeInView>

        {/* 6. Risks and Opportunities */}
        <FadeInView>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Important Risks */}
            <Card className="border-danger/20 bg-danger-soft/10 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="size-4 text-danger" aria-hidden="true" />
                  <CardTitle>Important Risks</CardTitle>
                </div>
                <Badge variant="critical">2 Critical</Badge>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-lg border border-danger/15 bg-surface space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-primary">Landlord 5% Rent Increase</span>
                    <Badge variant="warning">Warning</Badge>
                  </div>
                  <p className="text-xs text-text-secondary">Expected March 2025 · Increases monthly burn by ฿3,500.</p>
                </div>

                <div className="p-3 rounded-lg border border-danger/15 bg-surface space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-primary">฿21,340 Overdue Receivables</span>
                    <Badge variant="critical">Critical</Badge>
                  </div>
                  <p className="text-xs text-text-secondary">3 client invoices over 30 days overdue · Direct runway drag.</p>
                </div>
              </div>

              <Link href="/risks" className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-hover transition-colors">
                <span>View all risk details</span>
                <ArrowRight className="size-3" aria-hidden="true" />
              </Link>
            </Card>

            {/* Possible Opportunities */}
            <Card className="border-success/20 bg-success-soft/10 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-success" aria-hidden="true" />
                  <CardTitle>Possible Opportunities</CardTitle>
                </div>
                <Badge variant="success">Estimated</Badge>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-lg border border-success/15 bg-surface space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-primary">Weekend Brunch Expansion</span>
                    <QualityBadge quality="estimated" />
                  </div>
                  <p className="text-xs text-text-secondary">Saturday revenue is 40% higher. Estimated +฿18,000/month upside.</p>
                </div>

                <div className="p-3 rounded-lg border border-success/15 bg-surface space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-primary">Supplier Early Payment Discount</span>
                    <QualityBadge quality="sample" />
                  </div>
                  <p className="text-xs text-text-secondary">2% discount if paid within 10 days · Saves ฿5,600/month.</p>
                </div>
              </div>

              <Link href="/simulations/new" className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-hover transition-colors">
                <span>Test opportunity in simulator</span>
                <ArrowRight className="size-3" aria-hidden="true" />
              </Link>
            </Card>
          </div>
        </FadeInView>

        {/* 7. Recent Decision Activity & Open Actions */}
        <FadeInView>
          <Card>
            <CardHeader>
              <CardTitle>Recent Decision Activity & Open Actions</CardTitle>
              <CardDescription>Latest scenario simulations, open actions, and executive decisions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-surface-subtle/40">
                <div className="flex items-center gap-3">
                  <Play className="size-4 text-brand" />
                  <div>
                    <span className="text-xs font-semibold text-text-primary block">Simulated: Equipment Purchase Financing</span>
                    <span className="text-[11px] text-text-muted">Jan 22, 2025 · Cautious posture</span>
                  </div>
                </div>
                <Link href="/simulations" className="text-xs font-semibold text-brand hover:text-brand-hover">View</Link>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-surface-subtle/40">
                <div className="flex items-center gap-3">
                  <Clock className="size-4 text-warning" />
                  <div>
                    <span className="text-xs font-semibold text-text-primary block">Action: Follow up on ฿14,340 overdue invoice</span>
                    <span className="text-[11px] text-text-muted">Due Feb 5, 2025 · High priority</span>
                  </div>
                </div>
                <Link href="/actions" className="text-xs font-semibold text-brand hover:text-brand-hover">Review</Link>
              </div>
            </CardContent>
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
