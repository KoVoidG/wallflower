// src/features/simulations/components/compare-simulations-view.tsx
'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Award,
  CheckCircle2,
  Download,
  Save,
  ArrowRight,
  TrendingUp,
  Tag,
  Megaphone,
  Users,
  Check,
} from 'lucide-react';
import type { ScenarioItem } from './scenario-library-view';
import { FadeInView } from '@/components/motion';

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
    strategyTag: 'Pricing Increase',
    isRecommended: true,
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
};

const DEFAULT_SIMULATED_SCENARIOS: ScenarioItem[] = [
  {
    id: 'scen_baseline',
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
    name: 'Price Increase +5%',
    strategyTag: 'Pricing Increase',
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
    name: 'Holiday Promotion',
    strategyTag: 'Marketing Strategy',
    status: 'Simulated',
    goal: 'Boost revenue during holidays',
    lastSimulated: 'Wednesday, 04:21 PM',
    healthScore: 72,
    riskLevel: 'Medium',
    confidence: 85,
    icon: Megaphone,
  },
  {
    id: 'scen_hire',
    name: 'Hire 1 Sales Associate',
    strategyTag: 'People Security',
    status: 'Simulated',
    goal: 'Increase sales capacity',
    lastSimulated: '3 days ago',
    healthScore: 76,
    riskLevel: 'Medium',
    confidence: 82,
    icon: Users,
  },
];

export function CompareSimulationsView({
  scenarios = DEFAULT_SIMULATED_SCENARIOS,
}: CompareSimulationsViewProps) {
  // Filter ONLY scenarios with Simulated status
  const simulatedOnlyScenarios = useMemo(() => {
    return scenarios.filter((s) => s.status === 'Simulated');
  }, [scenarios]);

  // Selected scenario IDs state (default: baseline, price, promo)
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'scen_baseline',
    'scen_price',
    'scen_promo',
  ]);

  // Results Visibility state (Only pops up after clicking Compare button!)
  const [showResults, setShowResults] = useState<boolean>(true);
  const [activeComparisonIds, setActiveComparisonIds] = useState<string[]>([
    'scen_baseline',
    'scen_price',
    'scen_promo',
  ]);

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

  // Selected Comparison Datasets
  const activeComparisonData = useMemo(() => {
    return activeComparisonIds.map(
      (id) =>
        COMPARISON_DATA_MAP[id] || {
          id,
          name: scenarios.find((s) => s.id === id)?.name || id,
          strategyTag: 'Strategy',
          revenue: '฿1,250,000',
          revenueDiff: '(+4.1%)',
          profit: '฿145,000',
          profitDiff: '(+10.0%)',
          runway: '5.0 months',
          runwayDiff: '(+0.5 mo)',
          workingCapital: '฿250,000',
          capitalDiff: '(+4.0%)',
          health: 80,
          healthDiff: '(+4)',
          risk: 'Low',
          roi: '22.0%',
          confidence: 89,
        },
    );
  }, [activeComparisonIds, scenarios]);

  const recommendedOption = useMemo(() => {
    return (
      activeComparisonData.find((d) => d.isRecommended) ||
      activeComparisonData[1] ||
      activeComparisonData[0]
    );
  }, [activeComparisonData]);

  return (
    <div className="space-y-6">
      {/* ── 1. Select Scenarios Section ───────────────────────────────────── */}
      <FadeInView offset={10}>
        <Card className="p-6 space-y-4 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-[#1E2638] pb-3.5">
            <div className="space-y-0.5">
              <h3 className="font-display text-sm font-bold text-[#0F172A] dark:text-white">
                1. Select Scenarios (Max 4)
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Select simulated scenarios to compare side by side.
              </p>
            </div>

            <span className="font-mono text-xs font-bold text-[#64748B] dark:text-[#94A3B8]">
              {selectedIds.length} / 4 selected
            </span>
          </div>

          {/* 2-Row Scrollable Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 max-h-[170px] overflow-y-auto pr-1">
            {simulatedOnlyScenarios.map((scen) => {
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
                          ? 'bg-gradient-to-b from-[#7577f0] to-[#494af1] border-transparent text-white shadow-2xs'
                          : 'border-slate-300 dark:border-[#2A344A] bg-white dark:bg-[#111622]',
                      )}
                    >
                      {isSelected && <Check className="size-3.5 stroke-3" />}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0F172A] dark:text-white truncate">
                        {scen.name}
                      </p>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950/30 text-[#6366F1] dark:text-[#A5B4FC] border border-purple-200 dark:border-purple-800/40 shadow-2xs mt-0.5">
                        <span className="size-1 rounded-full bg-[#8B5CF6]" />
                        <span>Simulated</span>
                      </span>
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
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:opacity-95 cursor-pointer shadow-md shadow-indigo-500/25 transition-all disabled:opacity-50"
            >
              <span>Compare</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </Card>
      </FadeInView>

      {/* ── 2. Comparison Results & AI Recommendation Panel ───────────────── */}
      {showResults && (
        <FadeInView offset={12}>
          <div className="space-y-4">
            <h3 className="font-display text-sm font-bold text-[#0F172A] dark:text-white px-1">
              2. Comparison Results
            </h3>

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
                            'p-3.5 text-center min-w-[150px] relative transition-colors',
                            d.isRecommended
                              ? 'bg-[#6366F1]/[0.05] dark:bg-[#6366F1]/[0.07] border-t border-x border-[#6366F1]/25 dark:border-[#6366F1]/30 rounded-t-xl'
                              : 'bg-transparent',
                          )}
                        >
                          {d.isRecommended && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-[9.5px] font-bold tracking-wider uppercase shadow-xs">
                              Recommended
                            </div>
                          )}
                          <span className="block font-bold text-[#0F172A] dark:text-white pt-0.5">
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
                              ? 'bg-[#6366F1]/[0.04] dark:bg-[#6366F1]/[0.06] border-x border-[#6366F1]/20 dark:border-[#6366F1]/25'
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
                              ? 'bg-[#6366F1]/[0.04] dark:bg-[#6366F1]/[0.06] border-x border-[#6366F1]/20 dark:border-[#6366F1]/25'
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
                              ? 'bg-[#6366F1]/[0.04] dark:bg-[#6366F1]/[0.06] border-x border-[#6366F1]/20 dark:border-[#6366F1]/25'
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
                              ? 'bg-[#6366F1]/[0.04] dark:bg-[#6366F1]/[0.06] border-x border-[#6366F1]/20 dark:border-[#6366F1]/25'
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

                    {/* Business Health */}
                    <tr>
                      <td className="p-3.5 font-sans font-medium text-[#0F172A] dark:text-white">
                        Business Health
                      </td>
                      {activeComparisonData.map((d) => (
                        <td
                          key={d.id}
                          className={cn(
                            'p-3.5 text-center transition-colors',
                            d.isRecommended
                              ? 'bg-[#6366F1]/[0.04] dark:bg-[#6366F1]/[0.06] border-x border-[#6366F1]/20 dark:border-[#6366F1]/25'
                              : '',
                          )}
                        >
                          <span className="text-[#0F172A] dark:text-white font-medium">
                            {d.health}
                          </span>
                          {d.healthDiff && (
                            <span
                              className={cn(
                                'ml-1.5 text-[11px] font-semibold',
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
                            'p-3.5 text-center font-sans font-semibold transition-colors',
                            d.isRecommended
                              ? 'bg-[#6366F1]/[0.04] dark:bg-[#6366F1]/[0.06] border-x border-[#6366F1]/20 dark:border-[#6366F1]/25'
                              : '',
                          )}
                        >
                          <span className="inline-flex items-center gap-1.5 text-[#0F172A] dark:text-white">
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

                    {/* ROI (Forecast) */}
                    <tr>
                      <td className="p-3.5 font-sans font-medium text-[#0F172A] dark:text-white">
                        ROI (Forecast)
                      </td>
                      {activeComparisonData.map((d) => (
                        <td
                          key={d.id}
                          className={cn(
                            'p-3.5 text-center font-bold transition-colors',
                            d.isRecommended
                              ? 'bg-[#6366F1]/[0.04] dark:bg-[#6366F1]/[0.06] border-x border-[#6366F1]/20 dark:border-[#6366F1]/25 text-[#0F172A] dark:text-white'
                              : 'text-[#0F172A] dark:text-white',
                          )}
                        >
                          {d.roi}
                        </td>
                      ))}
                    </tr>

                    {/* Confidence */}
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
                              ? 'bg-[#6366F1]/[0.04] dark:bg-[#6366F1]/[0.06] border-b border-x border-[#6366F1]/20 dark:border-[#6366F1]/25 font-bold rounded-b-xl text-[#0F172A] dark:text-white'
                              : 'text-[#0F172A] dark:text-white',
                          )}
                        >
                          {d.confidence}%
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </Card>

              {/* Right Column: AI Recommendation Panel (Lg 4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                <Card className="p-6 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs space-y-4">
                  <div className="flex flex-col items-center text-center space-y-2 pb-3.5 border-b border-slate-100 dark:border-[#1E2638]">
                    <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-[#8B5CF6] border border-purple-200 dark:border-purple-800/60 inline-flex shadow-2xs">
                      <Award className="size-6" />
                    </div>
                    <h4 className="font-display text-sm font-bold text-[#0F172A] dark:text-white">
                      AI Recommendation
                    </h4>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider block">
                        Best Option
                      </span>
                      <h3 className="font-display text-base font-bold text-[#0F172A] dark:text-white">
                        {recommendedOption.name}
                      </h3>
                    </div>

                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                      This scenario provides the highest profit increase with
                      low risk and strong cash position improvement.
                    </p>

                    <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-[#1E2638] text-xs">
                      <div className="flex items-center gap-2 text-[#0F172A] dark:text-white font-medium">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                        <span>Highest ROI ({recommendedOption.roi})</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#0F172A] dark:text-white font-medium">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                        <span>Improved cash runway (+0.9 mo)</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#0F172A] dark:text-white font-medium">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                        <span>Low risk level</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#0F172A] dark:text-white font-medium">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                        <span>
                          High confidence ({recommendedOption.confidence}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Export & Save Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 dark:border-[#1E2638] flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs font-semibold gap-1.5 cursor-pointer rounded-xl"
                    >
                      <Download className="size-3.5" />
                      <span>Export Comparison</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs font-semibold gap-1.5 cursor-pointer rounded-xl"
                    >
                      <Save className="size-3.5" />
                      <span>Save Report</span>
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </FadeInView>
      )}
    </div>
  );
}
