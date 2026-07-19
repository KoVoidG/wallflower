'use client';

import { useState } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { H2 } from '@/components/ui/typography';
import { FadeInView } from '@/components/motion';
import {
  BusinessPulse,
  TodaysInsights,
  TrendChartSection,
  ScenarioCta,
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
  // Trends contains months like 'Aug', 'Sep', etc. We'll map them back
  // or define snapshot months from initial data
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
    // Optimistic UI updates
    const monthVal = newSnapshot.month; // e.g. '2025-02'
    const yearStr = monthVal.split('-')[0];
    const monthNum = parseInt(monthVal.split('-')[1]);
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = monthsShort[monthNum - 1];

    const revenue = Number(newSnapshot.revenue);
    const cashReserve = Number(newSnapshot.cashReserve);

    // Sum expense categories
    let totalExpenses = 0;
    Object.values(newSnapshot.expenseCategories).forEach((val: number) => {
      totalExpenses += Number(val);
    });

    const netProfit = revenue - totalExpenses;
    const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
    const runway = totalExpenses > 0 ? cashReserve / totalExpenses : 12; // cap runway

    // 1. Update Trend Data
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
        updatedTrends.shift(); // keep 6 months
      }
    }

    // 2. Update KPIs
    const updatedKpis: KpiData[] = data.kpis.map((kpi) => {
      if (kpi.label === 'Monthly Revenue') {
        const prevRevenue = data.kpis.find((k) => k.label === 'Monthly Revenue')?.numericValue || revenue;
        const pctChange = prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : 0;
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
        const prevRunway = data.kpis.find((k) => k.label === 'Cash Runway')?.numericValue || runway;
        const change = runway - prevRunway;
        const trend = [...(kpi.trend || [])];
        trend.push(Number(runway.toFixed(1)));
        if (trend.length > 6) trend.shift();

        return {
          ...kpi,
          value: runway.toFixed(1),
          numericValue: Number(runway.toFixed(1)),
          change: Number(change.toFixed(1)),
          status: runway < 3 ? 'danger' : runway < 6 ? 'warning' : 'healthy',
          trend,
        };
      }

      if (kpi.label === 'Profit Margin') {
        const prevMargin = data.kpis.find((k) => k.label === 'Profit Margin')?.numericValue || profitMargin;
        const change = profitMargin - prevMargin;
        const trend = [...(kpi.trend || [])];
        trend.push(Number(profitMargin.toFixed(1)));
        if (trend.length > 6) trend.shift();

        return {
          ...kpi,
          value: profitMargin.toFixed(1),
          numericValue: Number(profitMargin.toFixed(1)),
          change: Number(change.toFixed(1)),
          status: profitMargin < 5 ? 'danger' : profitMargin < 15 ? 'warning' : 'healthy',
          trend,
        };
      }

      if (kpi.label === 'Monthly Burn') {
        const prevBurn = data.kpis.find((k) => k.label === 'Monthly Burn')?.numericValue || totalExpenses;
        const pctChange = prevBurn > 0 ? ((totalExpenses - prevBurn) / prevBurn) * 100 : 0;
        const trend = [...(kpi.trend || [])];
        trend.push(totalExpenses);
        if (trend.length > 6) trend.shift();

        return {
          ...kpi,
          value: `฿${totalExpenses.toLocaleString()}`,
          numericValue: totalExpenses,
          change: Number(pctChange.toFixed(1)),
          trend,
        };
      }

      return kpi;
    });

    // 3. Update Health metadata
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

    // 4. Update Business Pulse
    const updatedPulse = {
      ...data.pulse,
      dataAsOf: monthVal + '-01',
      summary: `Your business has been updated with the snapshot for ${monthName} ${yearStr}. Runway is ${runway.toFixed(1)} months.`,
    };

    // Apply the updates to local state
    setData({
      ...data,
      pulse: updatedPulse,
      kpis: updatedKpis,
      trends: updatedTrends,
      health: updatedHealth,
    });
  };

  const isStale = data.health.completeness.staleDays > 30 || data.health.completeness.hasStaleWarning;

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Page Header with Snapshot Action */}
      <div className="flex items-center justify-between gap-4">
        <H2>Dashboard</H2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-brand text-white hover:bg-brand-hover transition-colors cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Record Snapshot</span>
        </button>
      </div>

      {/* 2. Stale Data Banner Alert */}
      {isStale && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-warning-soft border border-warning/30 rounded-[var(--radius-md)] text-text-primary animate-in fade-in slide-in-from-top-4 duration-200 motion-reduce:animate-none">
          <div className="flex gap-2">
            <AlertTriangle className="size-5 text-warning shrink-0" />
            <div className="text-[13px]">
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

      {/* 3. Business Pulse */}
      <FadeInView>
        <BusinessPulse data={data.pulse} />
      </FadeInView>

      {/* 4. Today's Insights */}
      <FadeInView>
        <TodaysInsights insights={data.insights} />
      </FadeInView>

      {/* 5. Core KPIs */}
      <KpiSection kpis={data.kpis} />

      {/* 6. Financial Trends */}
      <FadeInView>
        <TrendChartSection data={data.trends} />
      </FadeInView>

      {/* 7. Scenario CTA */}
      <FadeInView>
        <ScenarioCta />
      </FadeInView>

      {/* 8. Snapshot Modal Overlay */}
      <SnapshotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSnapshot}
        existingMonths={existingMonths}
      />
    </div>
  );
}
