'use client';

import { useState } from 'react';
import { Plus, AlertTriangle, Calendar } from 'lucide-react';
import { H2, Caption } from '@/components/ui/typography';
import { FadeInView } from '@/components/motion';
import {
  BusinessPulse,
  RecommendedAction,
  RecentActivity,
  TrendChartSection,
  ScenarioCta,
  RiskSummary,
  SnapshotModal,
} from '@/features/dashboard/components';
import { KpiSection } from '@/app/[locale]/(app)/dashboard/kpi-section';
import type { DashboardData, TrendDataPoint, KpiData } from '../adapters/dashboard.adapter';

interface DashboardViewProps {
  initialData: DashboardData;
}

export function DashboardView({ initialData }: DashboardViewProps) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Extract all existing months for duplicate detection
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
    const yearStr = monthVal.split('-')[0];
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
    const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
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
      if (kpi.label === 'Profit Margin') {
        const prevMargin = data.kpis.find((k) => k.label === 'Profit Margin')?.numericValue || profitMargin;
        const change = profitMargin - prevMargin;
        const trend = [...(kpi.trend || [])];
        trend.push(Number(profitMargin.toFixed(1)));
        if (trend.length > 6) trend.shift();
        return { ...kpi, value: profitMargin.toFixed(1), numericValue: Number(profitMargin.toFixed(1)), change: Number(change.toFixed(1)), status: profitMargin < 5 ? 'danger' as const : profitMargin < 15 ? 'warning' as const : 'healthy' as const, trend };
      }
      if (kpi.label === 'Monthly Burn') {
        const prevBurn = data.kpis.find((k) => k.label === 'Monthly Burn')?.numericValue || totalExpenses;
        const pctChange = prevBurn > 0 ? ((totalExpenses - prevBurn) / prevBurn) * 100 : 0;
        const trend = [...(kpi.trend || [])];
        trend.push(totalExpenses);
        if (trend.length > 6) trend.shift();
        return { ...kpi, value: `฿${totalExpenses.toLocaleString()}`, numericValue: totalExpenses, change: Number(pctChange.toFixed(1)), trend };
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
      summary: `Your business has been updated with the snapshot for ${monthName} ${yearStr}. Runway is ${runway.toFixed(1)} months.`,
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

  // Separate risk insights from opportunities/actions
  const riskInsights = data.insights.filter((i) => i.category === 'risk');
  const otherInsights = data.insights.filter((i) => i.category !== 'risk');

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Page Header with Data Freshness */}
      <header className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex flex-col gap-1">
          <H2>Dashboard</H2>
          <div className="flex items-center gap-2">
            <Calendar className="size-3.5 text-text-muted" aria-hidden="true" />
            <Caption>
              Data through{' '}
              {new Date(data.pulse.dataAsOf).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
              {' · '}{data.health.completeness.periodCount} months of history
            </Caption>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px]/[18px] font-[600] rounded-[var(--radius-md)] bg-brand text-white hover:bg-brand-hover transition-colors cursor-pointer self-start sm:self-center"
        >
          <Plus className="size-4" aria-hidden="true" />
          <span>Record Snapshot</span>
        </button>
      </header>

      {/* 2. Stale Data Warning */}
      {isStale && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-warning-soft border border-warning/30 rounded-[var(--radius-md)] text-text-primary animate-in fade-in slide-in-from-top-4 duration-200 motion-reduce:animate-none">
          <div className="flex gap-2">
            <AlertTriangle className="size-5 text-warning shrink-0" aria-hidden="true" />
            <div className="text-[13px]">
              <span className="font-semibold">Financial data is stale.</span> Your last snapshot was recorded on {data.health.completeness.lastUpdated}. Update your financial snapshot to keep forecasts and simulations accurate.
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 text-[12px] font-semibold rounded-[var(--radius-md)] bg-warning text-white hover:bg-warning/80 transition-colors cursor-pointer shrink-0"
          >
            Update Snapshot
          </button>
        </div>
      )}

      {/* 3. Business Pulse (8 cols) + Recommended Action (4 cols) */}
      <FadeInView>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          <BusinessPulse
            data={data.pulse}
            mostImportantChange="Revenue up 8.2% month-over-month with reduced burn rate"
            mostImportantRisk={riskInsights[0]?.title}
            className="lg:col-span-8"
          />
          <RecommendedAction
            action={data.pulse.nextAction || 'Review upcoming risks'}
            rationale="Rent increase notification requires planning. Simulate the impact to maintain runway."
            href="/risks"
            className="lg:col-span-4"
          />
        </div>
      </FadeInView>

      {/* 4. Four Supporting KPIs */}
      <KpiSection kpis={data.kpis} />

      {/* 5. Financial Trend (8 cols) + Risk Summary (4 cols) */}
      <FadeInView>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          <TrendChartSection data={data.trends} className="lg:col-span-8" />
          <RiskSummary risks={riskInsights} className="lg:col-span-4" />
        </div>
      </FadeInView>

      {/* 6. Scenario Simulation CTA */}
      <FadeInView>
        <ScenarioCta
          suggestion="Test whether the upcoming 5% rent increase is manageable without reducing other costs"
          rationale="A rent increase reduces monthly profit by approximately ฿3,500. Simulate alternatives to maintain your safety threshold."
        />
      </FadeInView>

      {/* 7. Recent Opportunities & Actions */}
      {otherInsights.length > 0 && (
        <FadeInView>
          <RecentActivity insights={otherInsights} />
        </FadeInView>
      )}

      {/* Snapshot Modal */}
      <SnapshotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSnapshot}
        existingMonths={existingMonths}
      />
    </div>
  );
}
