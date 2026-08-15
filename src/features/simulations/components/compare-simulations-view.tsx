// src/features/simulations/components/compare-simulations-view.tsx
'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import {
  CheckCircle2,
  ArrowRight,
  Check,
  FileText,
  Eye,
  TrendingUp,
  Tag,
  Megaphone,
  Users,
  ShoppingBag,
} from 'lucide-react';
import { useRouter } from '@/lib/i18n/navigation';
import { saveReport } from '@/features/reports/engine/reports-store';
import type { ScenarioItem } from './scenario-library-view';
import { FadeInView } from '@/components/motion';
import { BotAvatar } from '@/components/ui/bot-avatar';
import { useSimulationHistory } from '../engine/simulation-history-store';

interface CompareSimulationsViewProps {
  scenarios?: ScenarioItem[];
  initialSelectedIds?: string[];
}

export interface SimulatedComparisonData {
  id: string;
  name: string;
  strategyTag: string;
  isRecommended?: boolean;
  revenue: string;
  revenueDiff?: string;
  profit: string;
  profitDiff?: string;
  runway: string;
  runwayDiff?: string;
  workingCapital: string;
  capitalDiff?: string;
  health: number;
  healthDiff?: string;
  risk: 'Low' | 'Medium' | 'High';
  roi: string;
  confidence: number;
}

const COMPARISON_DATA_MAP: Record<string, SimulatedComparisonData> = {
  scen_baseline: {
    id: 'scen_baseline',
    name: 'Current Baseline',
    strategyTag: 'Baseline',
    revenue: '฿1,200,000',
    profit: '฿120,000',
    runway: '4.2 months',
    workingCapital: '฿240,000',
    health: 76,
    risk: 'Medium',
    roi: '18.2%',
    confidence: 88,
  },
  scen_price: {
    id: 'scen_price',
    name: 'Price Increase +5%',
    strategyTag: 'Pricing Strategy',
    revenue: '฿1,260,000',
    revenueDiff: '(+5.0%)',
    profit: '฿163,000',
    profitDiff: '(+35.8%)',
    runway: '5.1 months',
    runwayDiff: '(+0.9 mo)',
    workingCapital: '฿268,000',
    capitalDiff: '(+11.7%)',
    health: 84,
    healthDiff: '(+8)',
    risk: 'Low',
    roi: '28.7%',
    confidence: 91,
  },
  scen_promo: {
    id: 'scen_promo',
    name: 'Holiday Promotion',
    strategyTag: 'Marketing Strategy',
    revenue: '฿1,310,000',
    revenueDiff: '(+9.2%)',
    profit: '฿158,000',
    profitDiff: '(+12.2%)',
    runway: '4.6 months',
    runwayDiff: '(+0.1 mo)',
    workingCapital: '฿240,000',
    capitalDiff: '(-4.2%)',
    health: 78,
    healthDiff: '(-5)',
    risk: 'Medium',
    roi: '21.5%',
    confidence: 85,
  },
  scen_hire: {
    id: 'scen_hire',
    name: 'Hire 1 Sales Associate',
    strategyTag: 'People Security',
    revenue: '฿1,240,000',
    revenueDiff: '(+3.3%)',
    profit: '฿132,000',
    profitDiff: '(+10.0%)',
    runway: '4.8 months',
    runwayDiff: '(+0.6 mo)',
    workingCapital: '฿255,000',
    capitalDiff: '(+6.3%)',
    health: 82,
    healthDiff: '(+6)',
    risk: 'Low',
    roi: '24.1%',
    confidence: 87,
  },
  scen_cost: {
    id: 'scen_cost',
    name: 'Reduce Supplier Cost',
    strategyTag: 'Cost Efficiency',
    revenue: '฿1,200,000',
    revenueDiff: '(0.0%)',
    profit: '฿148,000',
    profitDiff: '(+23.3%)',
    runway: '5.4 months',
    runwayDiff: '(+1.2 mo)',
    workingCapital: '฿280,000',
    capitalDiff: '(+16.7%)',
    health: 86,
    healthDiff: '(+10)',
    risk: 'Low',
    roi: '31.2%',
    confidence: 93,
  },
};

const DEFAULT_WHATIF_SCENARIOS: ScenarioItem[] = [
  {
    id: 'scen_baseline',
    type: 'what_if',
    name: 'Current Baseline',
    strategyTag: 'Baseline',
    status: 'Simulated',
    goal: 'Continued current position',
    lastSimulated: 'Today, 09:42 AM',
    healthScore: 76,
    riskLevel: 'Medium',
    confidence: 88,
    icon: TrendingUp,
  },
  {
    id: 'scen_price',
    type: 'what_if',
    name: 'Price Increase +5%',
    strategyTag: 'Pricing Strategy',
    status: 'Simulated',
    goal: 'Increase profit margin',
    lastSimulated: 'Today, 10:15 AM',
    healthScore: 84,
    riskLevel: 'Low',
    confidence: 91,
    icon: Tag,
  },
  {
    id: 'scen_promo',
    type: 'what_if',
    name: 'Holiday Promotion',
    strategyTag: 'Marketing Strategy',
    status: 'Simulated',
    goal: 'Boost revenue during holidays',
    lastSimulated: 'Wednesday, 04:21 PM',
    healthScore: 78,
    riskLevel: 'Medium',
    confidence: 85,
    icon: Megaphone,
  },
  {
    id: 'scen_hire',
    type: 'what_if',
    name: 'Hire 1 Sales Associate',
    strategyTag: 'People Security',
    status: 'Simulated',
    goal: 'Increase sales capacity',
    lastSimulated: '3 days ago',
    healthScore: 82,
    riskLevel: 'Low',
    confidence: 87,
    icon: Users,
  },
  {
    id: 'scen_cost',
    type: 'what_if',
    name: 'Reduce Supplier Cost',
    strategyTag: 'Cost Efficiency',
    status: 'Simulated',
    goal: 'Lower vendor expenses',
    lastSimulated: '4 days ago',
    healthScore: 86,
    riskLevel: 'Low',
    confidence: 93,
    icon: ShoppingBag,
  },
];

export function CompareSimulationsView({}: CompareSimulationsViewProps) {
  const router = useRouter();
  const { history } = useSimulationHistory();

  // Filter ONLY What-If simulated scenarios (strictly exclude bottleneck scans)
  const whatIfSimulationsOnly = useMemo(() => {
    const fromHistory = history
      .filter((s) => s.type === 'what_if' && s.status === 'Simulated')
      .map((h) => ({
        id: h.id,
        type: 'what_if' as const,
        name: h.name,
        strategyTag: h.strategyTag,
        goal: h.goal,
        status: h.status,
        healthScore: h.healthScore,
        lastSimulated: h.lastSimulated,
        riskLevel: h.riskLevel,
        confidence: h.confidence,
        icon: Tag,
        whatIfResult: h.whatIfResult,
      }));

    if (fromHistory.length > 0) {
      return fromHistory;
    }
    return DEFAULT_WHATIF_SCENARIOS;
  }, [history]);

  // Selected scenario IDs state
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    const initial = whatIfSimulationsOnly.slice(0, 3).map((s) => s.id);
    return initial.length > 0
      ? initial
      : ['scen_baseline', 'scen_price', 'scen_promo'];
  });

  const [showResults, setShowResults] = useState<boolean>(false);
  const [activeComparisonIds, setActiveComparisonIds] = useState<string[]>(
    () => {
      const initial = whatIfSimulationsOnly.slice(0, 3).map((s) => s.id);
      return initial.length > 0
        ? initial
        : ['scen_baseline', 'scen_price', 'scen_promo'];
    },
  );

  const handleToggleScenario = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length <= 1) return; // Keep at least 1
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 4) return; // Max 4
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleRunCompare = () => {
    setActiveComparisonIds(selectedIds);
    setShowResults(true);
  };

  // Raw Comparison Datasets
  const rawDatasets = useMemo(() => {
    return activeComparisonIds.map((id) => {
      const match = whatIfSimulationsOnly.find((s) => s.id === id);
      if (COMPARISON_DATA_MAP[id]) {
        return { ...COMPARISON_DATA_MAP[id] };
      }

      if (match?.whatIfResult) {
        const res = match.whatIfResult;
        const revDelta = res.deltaPercent.throughput * 0.4;
        const profitDelta = res.deltaPercent.throughput * 0.6;
        const projRev = Math.round(1200000 * (1 + revDelta / 100));
        const projProfit = Math.round(120000 * (1 + profitDelta / 100));

        return {
          id,
          name: match.name,
          strategyTag: match.strategyTag,
          revenue: `฿${projRev.toLocaleString()}`,
          revenueDiff: `(${revDelta >= 0 ? '+' : ''}${revDelta.toFixed(1)}%)`,
          profit: `฿${projProfit.toLocaleString()}`,
          profitDiff: `(${profitDelta >= 0 ? '+' : ''}${profitDelta.toFixed(1)}%)`,
          runway: `${(4.2 + (profitDelta > 0 ? 0.8 : -0.2)).toFixed(1)} months`,
          runwayDiff: `(${profitDelta > 0 ? '+0.8' : '-0.2'} mo)`,
          workingCapital: `฿${Math.round(240000 * (1 + profitDelta / 200)).toLocaleString()}`,
          capitalDiff: `(${profitDelta >= 0 ? '+' : ''}${(profitDelta / 2).toFixed(1)}%)`,
          health: match.healthScore || 84,
          healthDiff: `(+${Math.round(match.healthScore ? match.healthScore - 76 : 8)})`,
          risk: (match.riskLevel || 'Low') as 'Low' | 'Medium' | 'High',
          roi: `${(20 + profitDelta * 0.5).toFixed(1)}%`,
          confidence: match.confidence || 90,
        };
      }

      return {
        id,
        name: match?.name || id,
        strategyTag: match?.strategyTag || 'What-If Strategy',
        revenue: '฿1,250,000',
        revenueDiff: '(+4.1%)',
        profit: '฿145,000',
        profitDiff: '(+10.0%)',
        runway: '5.0 months',
        runwayDiff: '(+0.5 mo)',
        workingCapital: '฿250,000',
        capitalDiff: '(+4.0%)',
        health: match?.healthScore || 80,
        healthDiff: '(+4)',
        risk: (match?.riskLevel || 'Low') as 'Low' | 'Medium' | 'High',
        roi: '22.0%',
        confidence: match?.confidence || 89,
      };
    });
  }, [activeComparisonIds, whatIfSimulationsOnly]);

  // Determine the single best recommended scenario out of the active comparison items
  const bestScenarioId = useMemo(() => {
    if (rawDatasets.length === 0) return null;

    // Prefer item that has highest health score + lowest risk + high ROI, avoiding baseline
    let best = rawDatasets[0];
    let bestScore = -999;

    rawDatasets.forEach((d) => {
      let score = d.health;
      if (d.risk === 'Low') score += 15;
      else if (d.risk === 'Medium') score += 5;

      const roiNum = parseFloat(d.roi) || 0;
      score += roiNum * 0.5;

      if (d.name.toLowerCase().includes('baseline')) {
        score -= 20; // Don't recommend staying on baseline if alternatives improve profit
      }

      if (score > bestScore) {
        bestScore = score;
        best = d;
      }
    });

    return best.id;
  }, [rawDatasets]);

  // Final datasets with isRecommended explicitly set
  const activeComparisonData = useMemo(() => {
    return rawDatasets.map((d) => ({
      ...d,
      isRecommended: d.id === bestScenarioId,
    }));
  }, [rawDatasets, bestScenarioId]);

  const recommendedOption = useMemo(() => {
    return (
      activeComparisonData.find((d) => d.isRecommended) ||
      activeComparisonData[0]
    );
  }, [activeComparisonData]);

  return (
    <div className="space-y-6">
      {/* ── Scenario Selection (What-If Scenarios Only) ───────────────── */}
      <FadeInView offset={10}>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div className="space-y-0.5">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                Select What-If Scenarios to Compare
              </h4>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Compare projected financial outcomes, ROI, and risk profiles
                across simulated What-If scenarios.
              </p>
            </div>

            <span className="font-mono text-xs font-bold text-[#64748B] dark:text-[#94A3B8] self-start sm:self-auto">
              {selectedIds.length} / 4 selected
            </span>
          </div>

          <Card className="p-5 space-y-4 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            {/* 2-Row Scrollable Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 max-h-[170px] overflow-y-auto pr-1">
              {whatIfSimulationsOnly.map((scen) => {
                const isSelected = selectedIds.includes(scen.id);

                return (
                  <div
                    key={scen.id}
                    onClick={() => handleToggleScenario(scen.id)}
                    className={cn(
                      'flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer select-none',
                      isSelected
                        ? 'border-[#6366F1]/40 dark:border-[#6366F1]/30 bg-[#6366F1]/10 dark:bg-[#6366F1]/8 shadow-sm'
                        : 'border-slate-200/80 dark:border-[#1E2638] bg-white dark:bg-[#111622] hover:border-slate-300 dark:hover:border-[#2A344A] hover:bg-slate-50 dark:hover:bg-[#1E2638]/50 shadow-2xs',
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          'size-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors',
                          isSelected
                            ? 'bg-linear-to-b from-[#7577f0] to-[#494af1] border-transparent text-white shadow-2xs'
                            : 'border-slate-300 dark:border-[#2A344A] bg-white dark:bg-[#111622]',
                        )}
                      >
                        {isSelected && <Check className="size-3.5 stroke-3" />}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0F172A] dark:text-white truncate">
                          {scen.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] truncate">
                            {scen.strategyTag}
                          </span>
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-purple-50 dark:bg-purple-950/30 text-[#6366F1] dark:text-[#A5B4FC] border border-purple-200 dark:border-purple-800/40">
                            <span className="size-1 rounded-full bg-[#8B5CF6]" />
                            <span>What-If</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Right Compare Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleRunCompare}
                disabled={selectedIds.length === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:opacity-95 cursor-pointer shadow-md shadow-indigo-500/25 transition-all disabled:opacity-50"
              >
                <span>Compare Scenarios</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </Card>
        </div>
      </FadeInView>

      {/* ── 1. Comparison Results & AI Recommendation Panel ───────────────── */}
      {showResults && (
        <FadeInView offset={12}>
          <div className="space-y-4">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] px-1">
              1. What-If Comparison Results
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left/Center Matrix Table (Lg 8 cols) */}
              <Card className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs overflow-x-auto space-y-4">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-[#1E2638] text-[#64748B] dark:text-[#94A3B8]">
                      <th className="p-3.5 font-semibold w-1/4">Metric</th>
                      {activeComparisonData.map((d) => (
                        <th
                          key={d.id}
                          className={cn(
                            'p-3.5 text-center min-w-[160px] relative transition-all duration-150',
                            d.isRecommended
                              ? 'bg-[#6366F1]/10 dark:bg-[#6366F1]/20 border-t-2 border-x-2 border-[#6366F1] rounded-t-2xl shadow-xs'
                              : 'bg-transparent',
                          )}
                        >
                          {d.isRecommended && (
                            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white text-[9.5px] font-extrabold tracking-wider uppercase shadow-sm whitespace-nowrap flex items-center gap-1.5 z-10">
                              <span>Capybot Top Pick</span>
                            </div>
                          )}
                          <span
                            className={cn(
                              'block font-bold pt-1 transition-colors',
                              d.isRecommended
                                ? 'text-[#4F46E5] dark:text-[#A5B4FC] text-sm'
                                : 'text-[#0F172A] dark:text-white',
                            )}
                          >
                            {d.name}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#1E2638] font-mono">
                    {/* Revenue */}
                    <tr>
                      <td className="p-3.5 font-sans font-medium text-[#0F172A] dark:text-white">
                        Revenue
                      </td>
                      {activeComparisonData.map((d) => (
                        <td
                          key={d.id}
                          className={cn(
                            'p-3.5 text-center transition-colors',
                            d.isRecommended
                              ? 'bg-[#6366F1]/[0.06] dark:bg-[#6366F1]/15 border-x-2 border-[#6366F1]/60'
                              : '',
                          )}
                        >
                          <span className="text-[#0F172A] dark:text-white font-medium">
                            {d.revenue}
                          </span>
                          {d.revenueDiff && (
                            <span className="text-emerald-600 dark:text-emerald-400 ml-1.5 text-[11px] font-semibold">
                              {d.revenueDiff}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Net Profit */}
                    <tr>
                      <td className="p-3.5 font-sans font-medium text-[#0F172A] dark:text-white">
                        Profit (Net)
                      </td>
                      {activeComparisonData.map((d) => (
                        <td
                          key={d.id}
                          className={cn(
                            'p-3.5 text-center transition-colors',
                            d.isRecommended
                              ? 'bg-[#6366F1]/[0.06] dark:bg-[#6366F1]/15 border-x-2 border-[#6366F1]/60'
                              : '',
                          )}
                        >
                          <span className="text-[#0F172A] dark:text-white font-medium">
                            {d.profit}
                          </span>
                          {d.profitDiff && (
                            <span className="text-emerald-600 dark:text-emerald-400 ml-1.5 text-[11px] font-semibold">
                              {d.profitDiff}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Cash Runway */}
                    <tr>
                      <td className="p-3.5 font-sans font-medium text-[#0F172A] dark:text-white">
                        Cash Runway
                      </td>
                      {activeComparisonData.map((d) => (
                        <td
                          key={d.id}
                          className={cn(
                            'p-3.5 text-center transition-colors',
                            d.isRecommended
                              ? 'bg-[#6366F1]/[0.06] dark:bg-[#6366F1]/15 border-x-2 border-[#6366F1]/60'
                              : '',
                          )}
                        >
                          <span className="text-[#0F172A] dark:text-white font-medium">
                            {d.runway}
                          </span>
                          {d.runwayDiff && (
                            <span className="text-emerald-600 dark:text-emerald-400 ml-1.5 text-[11px] font-semibold">
                              {d.runwayDiff}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Working Capital */}
                    <tr>
                      <td className="p-3.5 font-sans font-medium text-[#0F172A] dark:text-white">
                        Working Capital
                      </td>
                      {activeComparisonData.map((d) => (
                        <td
                          key={d.id}
                          className={cn(
                            'p-3.5 text-center transition-colors',
                            d.isRecommended
                              ? 'bg-[#6366F1]/[0.06] dark:bg-[#6366F1]/15 border-x-2 border-[#6366F1]/60'
                              : '',
                          )}
                        >
                          <span className="text-[#0F172A] dark:text-white font-medium">
                            {d.workingCapital}
                          </span>
                          {d.capitalDiff && (
                            <span
                              className={cn(
                                'ml-1.5 text-[11px] font-semibold',
                                d.capitalDiff.includes('-')
                                  ? 'text-rose-600 dark:text-rose-400'
                                  : 'text-emerald-600 dark:text-emerald-400',
                              )}
                            >
                              {d.capitalDiff}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Health Score */}
                    <tr>
                      <td className="p-3.5 font-sans font-medium text-[#0F172A] dark:text-white">
                        Health Score
                      </td>
                      {activeComparisonData.map((d) => (
                        <td
                          key={d.id}
                          className={cn(
                            'p-3.5 text-center transition-colors',
                            d.isRecommended
                              ? 'bg-[#6366F1]/[0.06] dark:bg-[#6366F1]/15 border-x-2 border-[#6366F1]/60'
                              : '',
                          )}
                        >
                          <span className="text-[#0F172A] dark:text-white font-bold inline-flex items-center gap-1">
                            <CheckCircle2 className="size-3.5 text-emerald-500" />
                            {d.health}
                          </span>
                          {d.healthDiff && (
                            <span
                              className={cn(
                                'ml-1 text-[11px] font-semibold',
                                d.healthDiff.includes('-')
                                  ? 'text-rose-600 dark:text-rose-400'
                                  : 'text-emerald-600 dark:text-emerald-400',
                              )}
                            >
                              {d.healthDiff}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Risk Level */}
                    <tr>
                      <td className="p-3.5 font-sans font-medium text-[#0F172A] dark:text-white">
                        Risk Level
                      </td>
                      {activeComparisonData.map((d) => (
                        <td
                          key={d.id}
                          className={cn(
                            'p-3.5 text-center transition-colors font-sans',
                            d.isRecommended
                              ? 'bg-[#6366F1]/[0.06] dark:bg-[#6366F1]/15 border-x-2 border-[#6366F1]/60'
                              : '',
                          )}
                        >
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F172A] dark:text-white">
                            <span
                              className={cn(
                                'size-2 rounded-full',
                                d.risk === 'Low' && 'bg-emerald-500',
                                d.risk === 'Medium' && 'bg-amber-500',
                                d.risk === 'High' && 'bg-rose-500',
                              )}
                            />
                            {d.risk}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Projected ROI */}
                    <tr>
                      <td className="p-3.5 font-sans font-medium text-[#0F172A] dark:text-white">
                        Projected ROI
                      </td>
                      {activeComparisonData.map((d) => (
                        <td
                          key={d.id}
                          className={cn(
                            'p-3.5 text-center transition-colors',
                            d.isRecommended
                              ? 'bg-[#6366F1]/[0.06] dark:bg-[#6366F1]/15 border-x-2 border-[#6366F1]/60'
                              : '',
                          )}
                        >
                          <span className="font-bold text-[#0F172A] dark:text-white">
                            {d.roi}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Simulation Confidence */}
                    <tr>
                      <td className="p-3.5 font-sans font-medium text-[#0F172A] dark:text-white">
                        Confidence
                      </td>
                      {activeComparisonData.map((d) => (
                        <td
                          key={d.id}
                          className={cn(
                            'p-3.5 text-center transition-colors',
                            d.isRecommended
                              ? 'bg-[#6366F1]/10 dark:bg-[#6366F1]/20 border-x-2 border-b-2 border-[#6366F1] rounded-b-2xl'
                              : '',
                          )}
                        >
                          <span className="text-[#64748B] dark:text-[#94A3B8]">
                            {d.confidence}%
                          </span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </Card>

              {/* Right Side: Capybot Strategic Recommendation Card (Lg 4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                <Card className="p-5 rounded-2xl bg-linear-to-br from-[#6366F1]/10 via-white to-purple-500/10 dark:from-[#6366F1]/20 dark:via-[#111622] dark:to-purple-950/30 border-2 border-[#6366F1] shadow-lg space-y-4">
                  <div className="flex items-center gap-3">
                    <BotAvatar size={36} animate={false} className="shrink-0" />
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider block text-[#6366F1] dark:text-[#A5B4FC]">
                        Capybot Top Recommendation
                      </span>
                      <h4 className="font-display text-sm font-bold text-[#0F172A] dark:text-white">
                        {recommendedOption?.name || 'Recommended Scenario'}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                    Based on your multi-scenario simulation,{' '}
                    <strong className="text-[#0F172A] dark:text-white">
                      {recommendedOption?.name}
                    </strong>{' '}
                    yields the highest risk-adjusted return (
                    {recommendedOption?.roi} ROI) while expanding profit margin
                    without exhausting cash runway.
                  </p>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B0F17] border border-slate-200/80 dark:border-[#1E2638] space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#64748B] dark:text-[#94A3B8]">
                        Projected Profit
                      </span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {recommendedOption?.profit}{' '}
                        {recommendedOption?.profitDiff}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#64748B] dark:text-[#94A3B8]">
                        Health Score
                      </span>
                      <span className="font-mono font-bold text-[#0F172A] dark:text-white">
                        {recommendedOption?.health} / 100
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#64748B] dark:text-[#94A3B8]">
                        Risk Level
                      </span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {recommendedOption?.risk}
                      </span>
                    </div>
                  </div>

                  {/* Wallflower Pick Action Buttons (Section 29) */}
                  <div className="pt-2 space-y-2">
                    <button
                      type="button"
                      onClick={() => router.push('/simulations?tab=workspace')}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white bg-white dark:bg-[#1E2638] hover:bg-slate-50 dark:hover:bg-[#2A344A] border border-slate-200 dark:border-[#2A344A] transition-colors cursor-pointer"
                    >
                      <Eye className="size-3.5 text-[#6366F1]" />
                      <span>View in What-If Workspace</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        saveReport({
                          id: `rpt-compare-${recommendedOption.id}`,
                          title: `Comparison Decision Memo (${recommendedOption.name})`,
                          type: 'Comparison Report',
                          date: 'Today • Just now',
                          horizon: '6 Months Horizon',
                          healthScore: recommendedOption.health,
                          profit: recommendedOption.profit,
                          confidence: recommendedOption.confidence,
                          confidenceBadge: 'High Confidence',
                          iconColor: 'emerald',
                        });
                        router.push('/reports');
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#6366F1] hover:bg-[#4F46E5] shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
                    >
                      <FileText className="size-3.5" />
                      <span>Generate Decision Memo</span>
                    </button>
                  </div>
                </Card>
              </div>
            </div>

            {/* ── 2. Explicit Trade-offs Comparison (Section 28) ──────────────── */}
            <div className="space-y-3 pt-2">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] px-1">
                2. Strategic Trade-offs Breakdown
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeComparisonData.map((d) => (
                  <Card
                    key={d.id}
                    className={cn(
                      'p-4 rounded-2xl bg-white dark:bg-[#111622] border transition-all space-y-3',
                      d.isRecommended
                        ? 'border-[#6366F1]/50 bg-[#6366F1]/[0.03] dark:bg-[#6366F1]/[0.05] shadow-md'
                        : 'border-slate-100 dark:border-[#1E2638] shadow-xs',
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-[#1E2638] pb-2.5">
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-[#0F172A] dark:text-white truncate">
                          {d.name}
                        </h5>
                        <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                          {d.strategyTag}
                        </span>
                      </div>
                      {d.isRecommended && (
                        <span className="px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/50 text-[#6366F1] dark:text-[#A5B4FC] text-[9.5px] font-bold border border-purple-200 dark:border-purple-800/40 shrink-0">
                          Recommended
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                          Advantages
                        </span>
                        <div className="flex items-start gap-1.5 text-text-secondary text-[11px]">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span>
                            {d.name.includes('Price')
                              ? 'High operating margin expansion without additional payroll overhead'
                              : d.name.includes('Hire')
                                ? 'Expands order fulfillment and sales capacity for scale'
                                : d.name.includes('Cost')
                                  ? 'Directly lowers cost of goods sold with zero customer friction'
                                  : 'Higher projected net profit and positive runway contribution'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
                          Key Trade-off / Risk
                        </span>
                        <div className="flex items-start gap-1.5 text-text-secondary text-[11px]">
                          <span className="text-rose-500 font-bold">✕</span>
                          <span>
                            {d.name.includes('Price')
                              ? 'Customer demand elasticity risk if competitors undercut'
                              : d.name.includes('Hire')
                                ? 'Increases fixed monthly salary commitment'
                                : d.name.includes('Promo')
                                  ? 'Temporary margin dilution during discount period'
                                  : 'Requires ongoing operational discipline to sustain gains'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </FadeInView>
      )}
    </div>
  );
}
