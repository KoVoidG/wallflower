// src/features/org-analytics/components/SimulationCharts.tsx
'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { SimulationResult } from '@/lib/liquiflow-types';
import { Card } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Activity, Clock, DollarSign, Award } from 'lucide-react';

export function SimulationCharts({ result }: { result: SimulationResult | null }) {
  const throughputData = useMemo(() => {
    if (!result) return [];
    return [
      {
        name: 'Weekly Throughput',
        Current: result.currentState.throughput,
        Projected: result.projectedState.throughput,
      },
    ];
  }, [result]);

  const velocityData = useMemo(() => {
    if (!result) return [];
    return [
      {
        name: 'Cycle Time (hrs)',
        Current: result.currentState.avgCycleTimeHours,
        Projected: result.projectedState.avgCycleTimeHours,
      },
      {
        name: 'Quality Score',
        Current: result.currentState.qualityScore,
        Projected: result.projectedState.qualityScore,
      },
      {
        name: 'Satisfaction',
        Current: result.currentState.employeeSatisfaction,
        Projected: result.projectedState.employeeSatisfaction,
      },
    ];
  }, [result]);

  if (!result) return null;

  const kpis = [
    {
      label: 'Throughput',
      current: `${result.currentState.throughput}/wk`,
      projected: `${result.projectedState.throughput}/wk`,
      pct: result.deltaPercent.throughput,
      icon: Activity,
      isGood: result.deltaPercent.throughput > 0,
    },
    {
      label: 'Avg Cycle Time',
      current: `${result.currentState.avgCycleTimeHours}h`,
      projected: `${result.projectedState.avgCycleTimeHours}h`,
      pct: result.deltaPercent.cycleTime,
      icon: Clock,
      isGood: result.deltaPercent.cycleTime < 0,
    },
    {
      label: 'Cost / Week',
      current: `฿${result.currentState.costPerWeekUSD.toLocaleString()}`,
      projected: `฿${result.projectedState.costPerWeekUSD.toLocaleString()}`,
      pct: result.deltaPercent.cost,
      icon: DollarSign,
      isGood: result.deltaPercent.cost <= 0,
    },
    {
      label: 'Satisfaction',
      current: `${result.currentState.employeeSatisfaction}/100`,
      projected: `${result.projectedState.employeeSatisfaction}/100`,
      pct: result.deltaPercent.satisfaction,
      icon: Award,
      isGood: result.deltaPercent.satisfaction > 0,
    },
  ];

  return (
    <div className="w-full space-y-5">
      {/* 4 Stat KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {kpis.map((m) => {
          const Icon = m.icon;
          return (
            <Card
              key={m.label}
              className="p-4 shadow-2xs border-border/80 bg-surface flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] text-text-muted font-medium uppercase tracking-wider">
                  {m.label}
                </span>
                <div className="p-1.5 rounded-lg bg-surface-subtle border border-border/60 text-brand shrink-0">
                  <Icon className="size-3.5" />
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-lg font-bold text-text-primary">
                    {m.projected}
                  </span>
                  <span className="text-[10px] text-text-muted">
                    from {m.current}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-0.5 ${
                      m.isGood
                        ? 'text-emerald-600 bg-emerald-500/10 border border-emerald-500/20'
                        : 'text-amber-600 bg-amber-500/10 border border-amber-500/20'
                    }`}
                  >
                    {m.pct > 0 ? (
                      <ArrowUpRight className="size-3" />
                    ) : (
                      <ArrowDownRight className="size-3" />
                    )}
                    {m.pct > 0 ? '+' : ''}
                    {m.pct}%
                  </span>
                  <span className="text-[10px] text-text-muted">projected</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 2 Focused Comparison Charts */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Throughput Scale Chart */}
        <Card className="md:col-span-5 p-4 shadow-2xs border-border/80 bg-surface flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 border-b border-border/60 pb-2">
            <div>
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Throughput Volume
              </h4>
              <p className="text-[10px] text-text-muted">
                Completed workflow items per week
              </p>
            </div>
            <span className="text-xs font-bold text-brand">
              {result.deltaPercent.throughput > 0 ? '+' : ''}
              {result.deltaPercent.throughput}%
            </span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={throughputData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(150,150,150,0.12)"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#888888', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#888888', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface, #0f172a)',
                    borderColor: 'var(--border, #1e293b)',
                    color: 'var(--text-primary, #f8fafc)',
                    fontSize: 11,
                    borderRadius: 8,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar
                  dataKey="Current"
                  fill="#94a3b8"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                <Bar
                  dataKey="Projected"
                  fill="#0F766E"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Velocity & Quality Metrics */}
        <Card className="md:col-span-7 p-4 shadow-2xs border-border/80 bg-surface flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 border-b border-border/60 pb-2">
            <div>
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Velocity & Quality Metrics
              </h4>
              <p className="text-[10px] text-text-muted">
                Cycle time reduction and satisfaction metrics
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600">
              {result.deltaPercent.cycleTime}% cycle time
            </span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={velocityData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(150,150,150,0.12)"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#888888', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#888888', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface, #0f172a)',
                    borderColor: 'var(--border, #1e293b)',
                    color: 'var(--text-primary, #f8fafc)',
                    fontSize: 11,
                    borderRadius: 8,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar
                  dataKey="Current"
                  fill="#94a3b8"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={30}
                />
                <Bar
                  dataKey="Projected"
                  fill="#0F766E"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
