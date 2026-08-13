"use client";

import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import type { SimulationResult } from "@/lib/liquiflow-types";

export function SimulationCharts({ result }: { result: SimulationResult | null }) {
  const data = useMemo(() => {
    if (!result) return [];
    return [
      {
        metric: "Throughput",
        Current: result.currentState.throughput,
        Projected: result.projectedState.throughput,
      },
      {
        metric: "Cycle Time (h)",
        Current: result.currentState.avgCycleTimeHours,
        Projected: result.projectedState.avgCycleTimeHours,
      },
      {
        metric: "Quality Score",
        Current: result.currentState.qualityScore,
        Projected: result.projectedState.qualityScore,
      }
    ];
  }, [result]);

  if (!result) return null;

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Throughput", pct: result.deltaPercent.throughput, val: result.projectedState.throughput },
          { label: "Cycle Time", pct: result.deltaPercent.cycleTime, val: `${result.projectedState.avgCycleTimeHours}h` },
          { label: "Cost/Week", pct: result.deltaPercent.cost, val: `$${result.projectedState.costPerWeekUSD.toLocaleString()}` },
          { label: "Satisfaction", pct: result.deltaPercent.satisfaction, val: result.projectedState.employeeSatisfaction },
        ].map(m => (
          <div key={m.label} className="bg-surface border border-border/50 rounded-xl p-4 flex flex-col items-center text-center shadow-2xs">
            <div className="text-xs text-text-muted mb-1">{m.label}</div>
            <div className="text-xl font-bold text-text-primary mb-2">{m.val}</div>
            <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              (m.label === "Cycle Time" || m.label === "Cost/Week") 
                ? (m.pct < 0 ? "text-success bg-success-soft/10" : "text-danger bg-danger-soft/10")
                : (m.pct > 0 ? "text-success bg-success-soft/10" : "text-danger bg-danger-soft/10")
            }`}>
              {m.pct > 0 ? "+" : ""}{m.pct}%
            </div>
          </div>
        ))}
      </div>

      <div className="h-64 bg-surface border-border/80 rounded-xl p-4 shadow-2xs">
        <h4 className="text-xs font-semibold text-text-secondary mb-4">Current vs Projected Performance</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150,150,150,0.15)" />
            <XAxis dataKey="metric" tick={{ fill: '#888888', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#888888', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--surface, #0f172a)', borderColor: 'var(--border, #1e293b)', color: 'var(--text-primary, #f8fafc)' }} 
              itemStyle={{ fontSize: 12 }}
              cursor={{ fill: 'rgba(150,150,150,0.05)' }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Current" fill="#888888" radius={[4, 4, 0, 0]} maxBarSize={50} />
            <Bar dataKey="Projected" fill="#0F766E" radius={[4, 4, 0, 0]} maxBarSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
