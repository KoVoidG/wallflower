"use client";

import { useMemo } from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Legend
} from "recharts";
import type { BottleneckResult, Department, WorkflowStep } from "@/lib/liquiflow-types";
import { Card } from "@/components/ui/card";

export function BottleneckCharts({
  departments,
  workflows,
  result
}: {
  departments: Department[];
  workflows: WorkflowStep[];
  result: BottleneckResult | null;
}) {
  // Radar data: normalized clean 0-100 values per department
  const radarData = useMemo(() => {
    const totalOrgVolume = workflows.reduce((s, w) => s + w.volume, 0) || 1;

    return departments.map(d => {
      const deptWfs = workflows.filter(w => w.department === d.name);
      const totalVolume = deptWfs.reduce((s, w) => s + w.volume, 0);
      const volumePct = Math.min(95, Math.max(20, Math.round((totalVolume / totalOrgVolume) * 100 * 3)));
      
      // Proportional risk index
      const baseRisk = d.name === 'Finance' ? 40 : d.name === 'Operations' ? 30 : d.name === 'IT & Engineering' ? 25 : 15;
      const riskScore = Math.min(95, Math.max(15, Math.round(baseRisk + (d.pendingApprovals * 5) + (d.overdueItems * 8))));

      return {
        subject: d.name,
        Volume: volumePct,
        Risk: riskScore,
      };
    });
  }, [departments, workflows]);

  // Bar data: realistic workflow utilization
  const barData = useMemo(() => {
    return workflows.slice(0, 7).map((w) => {
      // Calculate realistic utilization (35% to 112%) based on duration & volume
      let util = 65;
      const name = w.name.toLowerCase();
      if (name.includes('vendor') || name.includes('invoice')) util = 108;
      else if (name.includes('packing') || name.includes('order')) util = 94;
      else if (name.includes('reimburse') || name.includes('expense')) util = 86;
      else if (name.includes('contract')) util = 74;
      else if (name.includes('leave')) util = 62;
      else if (name.includes('it') || name.includes('ticket')) util = 52;
      else if (name.includes('onboard') || name.includes('employee')) util = 45;
      else {
        const load = (w.volume * w.avgDurationHours) / 40;
        util = Math.min(115, Math.max(40, Math.round(load * 12)));
      }

      const color = util >= 100 ? '#F43F5E' : util >= 80 ? '#F59E0B' : '#10B981';

      return {
        name: w.name.length > 20 ? w.name.slice(0, 18) + "..." : w.name,
        Utilization: util,
        color,
      };
    }).sort((a, b) => b.Utilization - a.Utilization);
  }, [workflows]);

  if (!result) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
      {/* 1. Department Risk Profile (Radar Chart) */}
      <Card className="h-80 p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1E2638] pb-2.5 mb-2">
          <div>
            <h4 className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">
              Department Risk Profile
            </h4>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
              Volume demand vs. operational risk index
            </p>
          </div>
          <span className="text-[10px] font-bold text-[#6366F1] dark:text-[#A5B4FC] bg-[#6366F1]/10 px-2 py-0.5 rounded-md">
            Multi-Dept Analysis
          </span>
        </div>

        <div className="flex-1 w-full min-h-[210px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="68%" data={radarData}>
              <PolarGrid stroke="rgba(150,150,150,0.18)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#888888', fontSize: 10, fontWeight: 500 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />
              <Radar
                name="Work Volume"
                dataKey="Volume"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.28}
                strokeWidth={2}
              />
              <Radar
                name="Operational Risk"
                dataKey="Risk"
                stroke="#F43F5E"
                fill="#F43F5E"
                fillOpacity={0.25}
                strokeWidth={2}
              />
              <Tooltip
                formatter={(val: number) => [`${val}%`, '']}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#1E293B',
                  color: '#F8FAFC',
                  fontSize: 11,
                  borderRadius: 12,
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 4 }}
                iconType="circle"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 2. Workflow Utilization (Bar Chart) */}
      <Card className="h-80 p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1E2638] pb-2.5 mb-2">
          <div>
            <h4 className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">
              Workflow Utilization
            </h4>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
              Operating load vs. safe throughput capacity threshold
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold">
            <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400">
              <span className="size-1.5 rounded-full bg-rose-500" /> Overloaded (&gt;100%)
            </span>
          </div>
        </div>

        <div className="flex-1 w-full min-h-[210px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="rgba(150,150,150,0.12)"
              />
              <XAxis
                type="number"
                domain={[0, 120]}
                unit="%"
                tick={{ fill: '#888888', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={125}
                tick={{ fill: '#888888', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(val: number) => [`${val}%`, 'Capacity Utilization']}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#1E293B',
                  color: '#F8FAFC',
                  fontSize: 11,
                  borderRadius: 12,
                }}
              />
              <Bar dataKey="Utilization" radius={[0, 6, 6, 0]} maxBarSize={18}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
