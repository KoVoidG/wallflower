// src/features/org-analytics/components/SimulationCharts.tsx
'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { SimulationResult } from '@/lib/liquiflow-types';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Activity, Clock, DollarSign, Award } from 'lucide-react';

export function SimulationCharts({ result }: { result: SimulationResult | null }) {
  const isThroughputGood = (result?.deltaPercent?.throughput ?? 0) >= 0;
  const throughputProjectedColor = isThroughputGood ? '#10B981' : '#F43F5E';

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
        isGood: result.deltaPercent.cycleTime <= 0, // Lower cycle time is good!
      },
      {
        name: 'Quality Score',
        Current: result.currentState.qualityScore,
        Projected: result.projectedState.qualityScore,
        isGood: result.deltaPercent.quality >= 0,
      },
      {
        name: 'Satisfaction',
        Current: result.currentState.employeeSatisfaction,
        Projected: result.projectedState.employeeSatisfaction,
        isGood: result.deltaPercent.satisfaction >= 0,
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
      isGood: result.deltaPercent.throughput >= 0,
    },
    {
      label: 'Avg Cycle Time',
      current: `${result.currentState.avgCycleTimeHours}h`,
      projected: `${result.projectedState.avgCycleTimeHours}h`,
      pct: result.deltaPercent.cycleTime,
      icon: Clock,
      isGood: result.deltaPercent.cycleTime <= 0,
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
      isGood: result.deltaPercent.satisfaction >= 0,
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* 4 Stat KPI Cards matching Business Health & Dashboard design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((m) => {
          const Icon = m.icon;
          return (
            <Card
              key={m.label}
              className="flex flex-col justify-between space-y-4 p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white flex items-center justify-center border border-slate-200 dark:border-[#2A344A]">
                    <Icon className="size-3.5" />
                  </div>
                  <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                    {m.label}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-mono text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                  {m.projected}
                </div>
                <div className={cn(
                  'flex items-center gap-1 text-xs font-semibold',
                  m.isGood ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                )}>
                  {m.isGood ? (
                    <ArrowUpRight className="size-3.5" />
                  ) : (
                    <ArrowDownRight className="size-3.5" />
                  )}
                  <span>
                    {m.pct > 0 ? '+' : ''}{m.pct}% from {m.current}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 2 Focused Comparison Charts with Dynamic Green/Red Bar Fills */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Throughput Scale Chart */}
        <Card className="md:col-span-5 p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-[#1E2638] pb-3">
            <div>
              <h4 className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">
                Throughput Volume
              </h4>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                Completed workflow items per week
              </p>
            </div>
            <span className={cn(
              'text-xs font-bold font-mono px-2 py-0.5 rounded-lg border',
              isThroughputGood
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40'
                : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/40'
            )}>
              {result.deltaPercent.throughput > 0 ? '+' : ''}
              {result.deltaPercent.throughput}%
            </span>
          </div>

          <div className="h-52 w-full">
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
                  tick={{ fill: '#888888', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#888888', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#1E293B',
                    color: '#F8FAFC',
                    fontSize: 11,
                    borderRadius: 12,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                <Bar
                  dataKey="Current"
                  fill="#94A3B8"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={44}
                />
                <Bar
                  dataKey="Projected"
                  fill={throughputProjectedColor}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={44}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Velocity & Quality Metrics */}
        <Card className="md:col-span-7 p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-[#1E2638] pb-3">
            <div>
              <h4 className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">
                Velocity & Quality Metrics
              </h4>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                Cycle time reduction and satisfaction metrics
              </p>
            </div>
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-lg border text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40">
              {result.deltaPercent.cycleTime}% cycle time
            </span>
          </div>

          <div className="h-52 w-full">
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
                  tick={{ fill: '#888888', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#888888', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#1E293B',
                    color: '#F8FAFC',
                    fontSize: 11,
                    borderRadius: 12,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                <Bar
                  dataKey="Current"
                  fill="#94A3B8"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={32}
                />
                <Bar
                  dataKey="Projected"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={32}
                >
                  {velocityData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isGood ? '#10B981' : '#F43F5E'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
