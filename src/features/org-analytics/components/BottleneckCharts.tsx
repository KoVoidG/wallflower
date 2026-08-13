"use client";

import { useMemo } from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Legend
} from "recharts";
import type { BottleneckResult, Department, WorkflowStep } from "@/lib/liquiflow-types";
import { utilizationColor } from "@/lib/liquiflow-algorithms";

export function BottleneckCharts({
  departments,
  workflows,
  result
}: {
  departments: Department[];
  workflows: WorkflowStep[];
  result: BottleneckResult | null;
}) {
  // Radar data: summarize errors, volume, duration per department
  const radarData = useMemo(() => {
    return departments.map(d => {
      const deptWfs = workflows.filter(w => w.department === d.name);
      const totalVolume = deptWfs.reduce((s, w) => s + w.volume, 0);
      const avgDuration = deptWfs.length ? deptWfs.reduce((s, w) => s + w.avgDurationHours, 0) / deptWfs.length : 0;
      const maxVolume = Math.max(...workflows.map(w => w.volume), 1);
      const maxDuration = Math.max(...workflows.map(w => w.avgDurationHours), 1);
      
      return {
        subject: d.name,
        Volume: (totalVolume / maxVolume) * 100,
        Duration: (avgDuration / maxDuration) * 100,
        Risk: Math.min(100, (d.pendingApprovals + d.overdueItems) * 5),
      };
    });
  }, [departments, workflows]);

  // Bar data: utilization approx by workflow
  const barData = useMemo(() => {
    return workflows.slice(0, 7).map(w => {
      const lambda = w.volume / 40;
      const mu = 1 / w.avgDurationHours;
      const util = Math.min(1.5, lambda / mu) * 100;
      return {
        name: w.name.length > 15 ? w.name.slice(0, 15) + "..." : w.name,
        Utilization: util,
        color: utilizationColor(util / 100)
      };
    }).sort((a, b) => b.Utilization - a.Utilization);
  }, [workflows]);

  if (!result) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      <div className="h-64 bg-surface border-border/80 rounded-xl p-4 shadow-2xs">
        <h4 className="text-xs font-semibold text-text-secondary mb-2">Department Risk Profile</h4>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
            <PolarGrid stroke="rgba(150,150,150,0.15)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#888888', fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="Volume" dataKey="Volume" stroke="#0F766E" fill="#0F766E" fillOpacity={0.3} />
            <Radar name="Risk" dataKey="Risk" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
            <Tooltip contentStyle={{ backgroundColor: 'var(--surface, #0f172a)', borderColor: 'var(--border, #1e293b)', color: 'var(--text-primary, #f8fafc)' }} itemStyle={{ fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="h-64 bg-surface border-border/80 rounded-xl p-4 shadow-2xs">
        <h4 className="text-xs font-semibold text-text-secondary mb-2">Workflow Utilization</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(150,150,150,0.1)" />
            <XAxis type="number" domain={[0, 150]} tick={{ fill: '#888888', fontSize: 10 }} />
            <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#888888', fontSize: 9 }} />
            <Tooltip 
              formatter={(val: number) => [`${val.toFixed(0)}%`, "Utilization"]}
              contentStyle={{ backgroundColor: 'var(--surface, #0f172a)', borderColor: 'var(--border, #1e293b)', color: 'var(--text-primary, #f8fafc)' }} 
            />
            <Bar dataKey="Utilization" radius={[0, 4, 4, 0]}>
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
