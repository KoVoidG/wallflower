// src/features/business-health/components/risk-view.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  Play,
  ArrowRight,
  Clock,
  ChevronRight,
  Star,
  Plus,
  Banknote,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
} from 'recharts';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FinancialValue } from '@/components/ui/domain-values';
import { Select, type SelectOption } from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { FadeInView } from '@/components/motion';
import {
  getRisksData,
  type RisksData,
} from '../adapters/risks.adapter';

const COLORS = {
  critical: '#EF4444',
  high: '#F97316',
  medium: '#FBBF24',
  low: '#34D399',
};

const SEVERITY_LEVELS = ['critical', 'high', 'medium', 'low'] as const;

const FILTER_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Risks' },
  { value: 'critical', label: 'Critical Only' },
  { value: 'financial', label: 'Financial' },
];

export function RiskView() {
  const [data, setData] = useState<RisksData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  const [showAllFilter, setShowAllFilter] = useState('all');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRisksData();
      setData(res);
      if (res.risks.length > 0) {
        setSelectedRiskId(res.risks[0].id);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load risk center assessment.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getRisksData()
      .then((res) => {
        if (isMounted) {
          setData(res);
          if (res.risks.length > 0) setSelectedRiskId(res.risks[0].id);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load risk center assessment.',
          );
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const { summary, risks } = data || {
    summary: {
      overallScore: 0,
      overallStatus: 'healthy' as const,
      totalCount: 0,
      criticalCount: 0,
      highCount: 0,
      mediumCount: 0,
      warningCount: 0,
      totalEstimatedExposure: 0,
      lastAssessmentDate: '',
      isStale: false,
      isIncomplete: false,
    },
    risks: [],
  };

  const filteredRisks = useMemo(() => {
    if (!risks) return [];
    if (showAllFilter === 'critical') {
      return risks.filter((r) => r.severity === 'critical');
    }
    if (showAllFilter === 'financial') {
      return risks.filter(
        (r) =>
          r.category.includes('cash') ||
          r.category.includes('financial') ||
          r.category.includes('expense') ||
          r.category.includes('revenue'),
      );
    }
    return risks;
  }, [risks, showAllFilter]);

  const selectedRisk = useMemo(() => {
    if (!data || data.risks.length === 0) return null;
    return (
      data.risks.find((r) => r.id === selectedRiskId) || data.risks[0] || null
    );
  }, [data, selectedRiskId]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-32 rounded-xl bg-surface-subtle border border-border/60" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-64 rounded-xl bg-surface-subtle border border-border/60" />
          <div className="h-64 rounded-xl bg-surface-subtle border border-border/60" />
        </div>
        <div className="h-64 rounded-xl bg-surface-subtle border border-border/60" />
      </div>
    );
  }

  if (error)
    return (
      <ErrorState
        onRetry={loadData}
        title="Risk Investigation Error"
        description={error}
      />
    );
  if (!data)
    return (
      <EmptyState
        icon={<ShieldAlert />}
        title="No Risk Data"
        description="Record a financial snapshot to begin risk triage."
      />
    );

  // Compute distribution for donut
  const distributionData = [
    { name: 'Critical', value: summary.criticalCount, color: COLORS.critical },
    { name: 'High', value: summary.highCount, color: COLORS.high },
    { name: 'Medium', value: summary.mediumCount, color: COLORS.medium },
    {
      name: 'Low',
      value: risks.filter((r) => r.severity === 'low').length,
      color: COLORS.low,
    },
  ].filter((d) => d.value > 0);

  // Compute heatmap grid (4x4: Impact vs Likelihood)
  const heatmapData: number[][] = Array(4)
    .fill(0)
    .map(() => Array(4).fill(0));

  risks.forEach((risk) => {
    const impactVal = risk.impact as (typeof SEVERITY_LEVELS)[number] | undefined;
    const likelihoodVal = risk.likelihood as (typeof SEVERITY_LEVELS)[number] | undefined;
    const impactIdx = impactVal ? SEVERITY_LEVELS.indexOf(impactVal) : -1;
    const likelihoodIdx = likelihoodVal ? SEVERITY_LEVELS.indexOf(likelihoodVal) : -1;
    if (impactIdx >= 0 && likelihoodIdx >= 0) {
      // Y-axis (Impact): 0=Critical (top) to 3=Low (bottom)
      // X-axis (Likelihood): 0=Low (left) to 3=Critical (right) -> 3 - likelihoodIdx
      const colIdx = 3 - likelihoodIdx;
      heatmapData[impactIdx][colIdx] += 1;
    }
  });

  const getCellBg = (rIdx: number, cIdx: number) => {
    // rIdx: 0=Critical, 1=High, 2=Medium, 3=Low
    // cIdx: 0=Low, 1=Medium, 2=High, 3=Critical
    const score = (3 - rIdx) + cIdx;
    if (score >= 5) return 'bg-[#E05252] text-white';
    if (score === 4) return 'bg-[#F28B66] text-white';
    if (score === 3) return 'bg-[#F6BF59] text-slate-900';
    if (score === 2) return 'bg-[#F9D896] text-slate-900';
    if (score === 1) return 'bg-[#A3E3C9] text-slate-900';
    return 'bg-[#48BB78] text-white';
  };

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto">
      {/* ── 1. Risk Overview ──────────────────────────────────────────────── */}
      <FadeInView offset={8}>
        <Card className="p-5 shadow-2xs">
          <div className="mb-3">
            <h2 className="text-sm font-bold text-text-primary">
              Risk Overview
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
            {/* Overall Risk */}
            <div className="space-y-1.5 md:pr-3">
              <span className="text-[11px] text-text-muted font-medium block">
                Overall Risk Level
              </span>
              <div>
                <Badge
                  variant={
                    summary.overallStatus === 'critical'
                      ? 'critical'
                      : summary.overallStatus === 'warning'
                        ? 'warning'
                        : 'healthy'
                  }
                  className="text-xs px-2.5 py-0.5 uppercase tracking-wide font-bold"
                >
                  {summary.overallStatus.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-baseline gap-1.5 pt-0.5">
                <span className="text-xs font-bold text-text-primary whitespace-nowrap">
                  Score {summary.overallScore} / 100
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 whitespace-nowrap">
                  <TrendingUp className="size-2.5 shrink-0" />
                  8 pts vs Apr 2024
                </span>
              </div>
            </div>

            {/* Critical Risks */}
            <div className="space-y-0.5 md:border-l md:border-border/60 md:pl-4">
              <span className="text-[11px] text-text-muted font-medium block">
                Critical Risks
              </span>
              <span className="text-2xl font-bold text-text-primary block">
                {summary.criticalCount}
              </span>
              <span className="text-[10px] font-medium text-rose-500 block">
                Require immediate action
              </span>
            </div>

            {/* Active Risks */}
            <div className="space-y-0.5 md:border-l md:border-border/60 md:pl-4">
              <span className="text-[11px] text-text-muted font-medium block">
                Active Risks
              </span>
              <span className="text-2xl font-bold text-text-primary block">
                {summary.warningCount + summary.criticalCount}
              </span>
              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="size-2.5" />
                1 vs Apr 2024
              </span>
            </div>

            {/* Monitored Indicators */}
            <div className="space-y-0.5 md:border-l md:border-border/60 md:pl-4">
              <span className="text-[11px] text-text-muted font-medium block">
                Monitored Indicators
              </span>
              <span className="text-2xl font-bold text-text-primary block">
                24
              </span>
              <span className="text-[10px] text-text-muted block">
                Across financial & ops
              </span>
            </div>

            {/* Mini Chart */}
            <div className="col-span-2 md:col-span-1 md:border-l md:border-border/60 md:pl-4 h-[65px] flex flex-col justify-end">
              <div className="h-11 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { name: 'Jan', score: 85 },
                      { name: 'Feb', score: 78 },
                      { name: 'Mar', score: 82 },
                      { name: 'Apr', score: 64 },
                      { name: 'May', score: 72 },
                    ]}
                    margin={{ top: 2, right: 2, left: 2, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorScore"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#EF4444"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#EF4444"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#EF4444"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorScore)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between text-[9px] text-text-muted px-0.5">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span className="font-bold text-text-primary">May</span>
              </div>
            </div>
          </div>
        </Card>
      </FadeInView>

      {/* ── 2. Distribution & Heat Map ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <FadeInView offset={12}>
          <Card className="p-5 h-full shadow-2xs flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-text-primary mb-4">
                Risk Distribution
              </h2>
              <div className="flex items-center justify-center gap-6 relative py-2">
                <div className="w-[160px] h-[160px] relative shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-text-primary">
                      {risks.length}
                    </span>
                    <span className="text-[9px] text-text-muted uppercase tracking-wider font-semibold">
                      Total Risks
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {distributionData.map((d, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="flex items-center gap-2 min-w-[70px]">
                        <div
                          className="size-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: d.color }}
                        />
                        <span className="text-xs font-semibold text-text-primary">
                          {d.name}
                        </span>
                      </div>
                      <div className="text-xs text-text-muted font-medium text-right">
                        {d.value} ({Math.round((d.value / risks.length) * 100)}%)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60">
              <Link
                href="#"
                className="text-xs font-semibold text-brand hover:text-brand-hover inline-flex items-center gap-1"
              >
                View all risks <ArrowRight className="size-3" />
              </Link>
            </div>
          </Card>
        </FadeInView>

        {/* Risk Heat Map */}
        <FadeInView offset={12}>
          <Card className="p-5 h-full shadow-2xs flex flex-col justify-between">
            <div>
              <div className="mb-3">
                <h2 className="text-sm font-bold text-text-primary">
                  Risk Heat Map
                </h2>
                <span className="text-[11px] text-text-muted">
                  Impact vs Likelihood
                </span>
              </div>

              {/* Heatmap Matrix with aligned flex layout */}
              <div className="flex items-center gap-2.5 py-1">
                {/* Y Axis Title & Labels */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="-rotate-90 text-[9px] text-text-muted tracking-widest uppercase font-bold select-none w-4 text-center">
                    Impact
                  </span>
                  <div className="flex flex-col justify-between h-36 py-1 text-right w-12 shrink-0">
                    <span className="text-[10px] text-text-muted font-medium">
                      Critical
                    </span>
                    <span className="text-[10px] text-text-muted font-medium">
                      High
                    </span>
                    <span className="text-[10px] text-text-muted font-medium">
                      Medium
                    </span>
                    <span className="text-[10px] text-text-muted font-medium">
                      Low
                    </span>
                  </div>
                </div>

                {/* Grid and X Axis */}
                <div className="flex-1 flex flex-col gap-1">
                  <div className="grid grid-rows-4 grid-cols-4 gap-1.5 h-36 w-full">
                    {heatmapData.map((row, rIdx) =>
                      row.map((val, cIdx) => (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          className={cn(
                            'rounded-md flex items-center justify-center transition-all shadow-2xs',
                            getCellBg(rIdx, cIdx),
                          )}
                        >
                          {val > 0 && (
                            <div className="bg-white text-slate-900 size-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs">
                              {val}
                            </div>
                          )}
                        </div>
                      )),
                    )}
                  </div>

                  {/* X Axis Labels */}
                  <div className="grid grid-cols-4 text-center px-1 pt-1">
                    <span className="text-[10px] text-text-muted font-medium">
                      Low
                    </span>
                    <span className="text-[10px] text-text-muted font-medium">
                      Medium
                    </span>
                    <span className="text-[10px] text-text-muted font-medium">
                      High
                    </span>
                    <span className="text-[10px] text-text-muted font-medium">
                      Critical
                    </span>
                  </div>
                  <div className="text-center pt-0.5">
                    <span className="text-[9px] text-text-muted tracking-widest uppercase font-bold select-none">
                      Likelihood
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 mt-2">
              <Link
                href="#"
                className="text-xs font-semibold text-brand hover:text-brand-hover inline-flex items-center gap-1"
              >
                View heat map details <ArrowRight className="size-3" />
              </Link>
            </div>
          </Card>
        </FadeInView>
      </div>

      {/* ── 3. Active & Emerging Risks (List) ─────────────────────────────── */}
      <FadeInView offset={16}>
        <Card className="shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-border/60 flex items-center justify-between bg-surface">
            <h2 className="text-sm font-bold text-text-primary">
              Active & Emerging Risks
            </h2>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-text-muted font-medium">Show</span>
              <Select
                value={showAllFilter}
                onChange={setShowAllFilter}
                options={FILTER_OPTIONS}
                className="w-36"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60 bg-surface-subtle/30 text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4 font-semibold">Risk</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Severity</th>
                  <th className="py-3 px-4 font-semibold">Impact</th>
                  <th className="py-3 px-4 font-semibold">Likelihood</th>
                  <th className="py-3 px-4 font-semibold">Trend</th>
                  <th className="py-3 px-4 font-semibold text-right">
                    Last Updated
                  </th>
                  <th className="py-3 px-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredRisks.map((risk) => {
                  const isSelected = selectedRisk?.id === risk.id;
                  return (
                    <tr
                      key={risk.id}
                      onClick={() => setSelectedRiskId(risk.id)}
                      className={cn(
                        'cursor-pointer transition-colors group',
                        isSelected
                          ? 'bg-brand-soft/10'
                          : 'hover:bg-surface-subtle/50 bg-surface',
                      )}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              'p-2 rounded-lg shrink-0 mt-0.5',
                              risk.severity === 'critical'
                                ? 'bg-danger-soft text-danger'
                                : risk.severity === 'high'
                                  ? 'bg-warning-soft text-warning'
                                  : 'bg-surface-subtle text-text-muted',
                            )}
                          >
                            <AlertTriangle className="size-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-text-primary line-clamp-1">
                              {risk.title}
                            </p>
                            <p className="text-[11px] text-text-muted line-clamp-1 mt-0.5">
                              {risk.evidence[0]}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-xs">
                          <p className="font-semibold text-text-primary capitalize">
                            {risk.category.split('_')[0]}
                          </p>
                          <p className="text-[10px] text-text-muted capitalize">
                            {risk.category.replace('_', ' ')}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            risk.severity === 'critical'
                              ? 'critical'
                              : risk.severity === 'high'
                                ? 'warning'
                                : 'neutral'
                          }
                          className="text-[10px] uppercase shadow-xs"
                        >
                          {risk.severity}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-text-primary font-medium capitalize">
                          {risk.impact?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-text-primary font-medium capitalize">
                          {risk.likelihood}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-16 h-6">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={
                                risk.severity === 'critical'
                                  ? [{ val: 4 }, { val: 6 }, { val: 5 }, { val: 11 }]
                                  : risk.severity === 'high'
                                    ? [{ val: 3 }, { val: 7 }, { val: 5 }, { val: 8 }]
                                    : [{ val: 2 }, { val: 4 }, { val: 3 }, { val: 5 }]
                              }
                            >
                              <Line
                                type="monotone"
                                dataKey="val"
                                stroke={
                                  risk.severity === 'critical'
                                    ? COLORS.critical
                                    : COLORS.high
                                }
                                strokeWidth={1.5}
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-[11px] text-text-muted whitespace-nowrap">
                          May 20, 2024
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <ChevronRight
                          className={cn(
                            'size-4 text-text-muted transition-transform',
                            isSelected
                              ? 'text-brand translate-x-1'
                              : 'group-hover:translate-x-1',
                          )}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-border/60 bg-surface">
            <Link
              href="#"
              className="text-xs font-semibold text-brand hover:text-brand-hover inline-flex items-center gap-1 ml-2"
            >
              View all risks <ArrowRight className="size-3" />
            </Link>
          </div>
        </Card>
      </FadeInView>

      {/* ── 4. Selected Risk Details ──────────────────────────────────────── */}
      {selectedRisk && (
        <FadeInView offset={20}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Detail Panel */}
            <Card className="lg:col-span-2 p-6 shadow-2xs bg-surface border-border">
              <Badge
                variant={
                  selectedRisk.severity === 'critical' ? 'critical' : 'warning'
                }
                className="mb-4 text-[10px] uppercase font-bold tracking-wider"
              >
                {selectedRisk.severity} RISK
              </Badge>

              <h2 className="text-lg sm:text-xl font-bold text-text-primary mb-2">
                {selectedRisk.title}
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
                Based on current trends, cash balance is projected to fall below
                minimum threshold of ฿100,000 by {selectedRisk.expectedTiming}.
              </p>

              <div className="mb-6">
                <h3 className="text-[11px] font-bold text-text-primary mb-3">
                  Key Details
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-surface-subtle rounded-lg p-3 border border-border/60">
                    <span className="text-[10px] text-text-muted block mb-1">
                      Category
                    </span>
                    <span className="text-xs font-bold text-text-primary capitalize">
                      {selectedRisk.category.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="bg-surface-subtle rounded-lg p-3 border border-border/60">
                    <span className="text-[10px] text-text-muted block mb-1">
                      Impact
                    </span>
                    <span className="text-xs font-bold text-text-primary capitalize">
                      {selectedRisk.impact}
                    </span>
                  </div>
                  <div className="bg-surface-subtle rounded-lg p-3 border border-border/60">
                    <span className="text-[10px] text-text-muted block mb-1">
                      Likelihood
                    </span>
                    <span className="text-xs font-bold text-text-primary capitalize">
                      {selectedRisk.likelihood}
                    </span>
                  </div>
                  <div className="bg-surface-subtle rounded-lg p-3 border border-border/60">
                    <span className="text-[10px] text-text-muted block mb-1">
                      Estimated Impact
                    </span>
                    <FinancialValue
                      value={selectedRisk.estimatedExposure}
                      className="text-xs font-bold text-text-primary block"
                    />
                  </div>
                  <div className="bg-surface-subtle rounded-lg p-3 border border-border/60">
                    <span className="text-[10px] text-text-muted block mb-1">
                      Earliest Occurrence
                    </span>
                    <span className="text-xs font-bold text-text-primary">
                      {selectedRisk.expectedTiming}
                    </span>
                  </div>
                  <div className="bg-surface-subtle rounded-lg p-3 border border-border/60">
                    <span className="text-[10px] text-text-muted block mb-1">
                      Confidence
                    </span>
                    <span className="text-xs font-bold text-text-primary capitalize">
                      {selectedRisk.confidence}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-[11px] font-bold text-text-primary mb-2">
                    What Could Happen
                  </h3>
                  <ul className="space-y-2 text-xs text-text-secondary">
                    <li className="flex items-start gap-2">
                      <span className="text-text-muted mt-0.5">•</span>{' '}
                      Inability to pay suppliers on time
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-text-muted mt-0.5">•</span>{' '}
                      Disruption in operations
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-text-muted mt-0.5">•</span>{' '}
                      Potential late fees and penalties
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-text-muted mt-0.5">•</span> Loss of
                      supplier trust
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-[11px] font-bold text-text-primary mb-2">
                    Root Contributing Factors
                  </h3>
                  <ul className="space-y-2 text-xs text-text-secondary">
                    {selectedRisk.evidence.map((ev, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-text-muted mt-0.5">•</span> {ev}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* Right: Actions Panel */}
            <Card className="p-6 shadow-2xs bg-surface border-border flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="size-4 text-brand fill-brand" />
                  <h2 className="text-sm font-bold text-text-primary">
                    Recommended Actions
                  </h2>
                </div>

                <div className="space-y-3 mb-6">
                  {/* Action 1 */}
                  <div className="p-3 border border-border/80 rounded-xl bg-surface-subtle/50 flex gap-3">
                    <div className="p-1.5 bg-brand-soft text-brand rounded-lg shrink-0 h-fit">
                      <ShieldAlert className="size-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-xs font-bold text-text-primary">
                          Accelerate Receivables Collection
                        </h4>
                        <Badge
                          variant="critical"
                          className="text-[8px] px-1.5 py-0"
                        >
                          HIGH
                        </Badge>
                      </div>
                      <p className="text-[10px] text-text-muted leading-relaxed">
                        Follow up on overdue invoices and offer early payment
                        incentives.
                      </p>
                    </div>
                  </div>

                  {/* Action 2 */}
                  <div className="p-3 border border-border/80 rounded-xl bg-surface-subtle/50 flex gap-3">
                    <div className="p-1.5 bg-success-soft text-success rounded-lg shrink-0 h-fit">
                      <Banknote className="size-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-xs font-bold text-text-primary">
                          Reduce Non-Essential Expenses
                        </h4>
                        <Badge
                          variant="warning"
                          className="text-[8px] px-1.5 py-0"
                        >
                          MEDIUM
                        </Badge>
                      </div>
                      <p className="text-[10px] text-text-muted leading-relaxed">
                        Cut or defer discretionary spending for next 60 days.
                      </p>
                    </div>
                  </div>

                  {/* Action 3 */}
                  <div className="p-3 border border-border/80 rounded-xl bg-surface-subtle/50 flex gap-3">
                    <div className="p-1.5 bg-warning-soft text-warning rounded-lg shrink-0 h-fit">
                      <Clock className="size-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-xs font-bold text-text-primary">
                          Negotiate Supplier Terms
                        </h4>
                        <Badge
                          variant="warning"
                          className="text-[8px] px-1.5 py-0"
                        >
                          MEDIUM
                        </Badge>
                      </div>
                      <p className="text-[10px] text-text-muted leading-relaxed">
                        Extend payment terms by 15-30 days where possible.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  className="w-full text-xs font-bold cursor-pointer"
                  size="md"
                >
                  <Play className="size-3.5 mr-1.5" fill="currentColor" />
                  Simulate impact
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-xs font-bold cursor-pointer"
                  size="md"
                >
                  <Plus className="size-3.5 mr-1.5" />
                  Add to Action Plan
                </Button>
              </div>
            </Card>
          </div>
        </FadeInView>
      )}
    </div>
  );
}
