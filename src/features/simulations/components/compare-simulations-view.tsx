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

interface CompareSimulationsViewProps {
  scenarios?: ScenarioItem[];
  initialSelectedIds?: string[];
}

export interface SimulatedComparisonData {
  id: string;
  name: string;
  strategyTag: string;
  revenue: string;
  revenueDiff: string;
  profit: string;
  profitDiff: string;
  runway: string;
  runwayDiff: string;
  workingCapital: string;
  capitalDiff: string;
  health: number;
  healthDiff: string;
  risk: 'Low' | 'Medium' | 'High';
  roi: string;
  confidence: number;
  isRecommended?: boolean;
}

const COMPARISON_DATA_MAP: Record<string, SimulatedComparisonData> = {
  scen_baseline: {
    id: 'scen_baseline',
    name: 'Current Baseline',
    strategyTag: 'Baseline',
    revenue: '฿1,200,000',
    revenueDiff: '',
    profit: '฿120,000',
    profitDiff: '',
    runway: '4.2 months',
    runwayDiff: '',
    workingCapital: '฿240,000',
    capitalDiff: '',
    health: 76,
    healthDiff: '',
    risk: 'Medium',
    roi: '18.2%',
    confidence: 88,
  },
  scen_price: {
    id: 'scen_price',
    name: 'Price Increase +5%',
    strategyTag: 'Pricing Increase',
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
    isRecommended: true,
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
    roi: '24.1%',
    confidence: 87,
  },
  scen_hire: {
    id: 'scen_hire',
    name: 'Hire 1 Sales Associate',
    strategyTag: 'People Security',
    revenue: '฿1,250,000',
    revenueDiff: '(+4.1%)',
    profit: '฿112,000',
    profitDiff: '(-6.6%)',
    runway: '3.9 months',
    runwayDiff: '(-0.3 mo)',
    workingCapital: '฿220,000',
    capitalDiff: '(-8.3%)',
    health: 74,
    healthDiff: '(-2)',
    risk: 'Medium',
    roi: '16.5%',
    confidence: 82,
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

export function CompareSimulationsView({ scenarios = DEFAULT_SIMULATED_SCENARIOS }: CompareSimulationsViewProps) {
  // Filter ONLY scenarios with Simulated status
  const simulatedOnlyScenarios = useMemo(() => {
    return scenarios.filter((s) => s.status === 'Simulated');
  }, [scenarios]);

  // Selected scenario IDs state (default: baseline, price, promo)
  const [selectedIds, setSelectedIds] = useState<string[]>(['scen_baseline', 'scen_price', 'scen_promo']);

  // Results Visibility state (Only pops up after clicking Compare button!)
  const [showResults, setShowResults] = useState<boolean>(true);
  const [activeComparisonIds, setActiveComparisonIds] = useState<string[]>(['scen_baseline', 'scen_price', 'scen_promo']);

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
    return activeComparisonIds
      .map((id) => COMPARISON_DATA_MAP[id] || {
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
      });
  }, [activeComparisonIds, scenarios]);

  const recommendedOption = useMemo(() => {
    return activeComparisonData.find((d) => d.isRecommended) || activeComparisonData[1] || activeComparisonData[0];
  }, [activeComparisonData]);

  return (
    <div className="space-y-6">
      {/* ── 1. Select Scenarios Section ───────────────────────────────────── */}
      <Card className="p-5 space-y-4 border-border-strong bg-surface">
        <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div className="space-y-0.5">
            <h3 className="font-display text-sm font-bold text-text-primary">
              1. Select Scenarios (Max 4)
            </h3>
            <p className="text-xs text-text-secondary">
              Select simulated scenarios to compare side by side.
            </p>
          </div>

          <span className="font-mono text-xs font-bold text-text-muted">
            {selectedIds.length} / 4 selected
          </span>
        </div>

        {/* 2-Row Scrollable Grid (Max 4 items per row, up to 2 rows visible, smooth vertical scrolling) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-h-[170px] overflow-y-auto pr-1">
          {simulatedOnlyScenarios.map((scen) => {
            const isSelected = selectedIds.includes(scen.id);

            return (
              <div
                key={scen.id}
                onClick={() => handleToggleScenario(scen.id)}
                className={cn(
                  'flex items-center justify-between p-3.5 rounded-xl border transition-all duration-150 cursor-pointer select-none',
                  isSelected
                    ? 'border-tertiary bg-emerald-500/10 dark:bg-emerald-500/15 shadow-2xs'
                    : 'border-border-strong bg-surface/50 hover:bg-surface-hover/70'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      'size-5 rounded-md border flex items-center justify-center shrink-0 transition-colors',
                      isSelected
                        ? 'bg-tertiary border-tertiary text-on-primary'
                        : 'border-border-strong bg-surface'
                    )}
                  >
                    {isSelected && <Check className="size-3.5 stroke-[3]" />}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-text-primary truncate">
                      {scen.name}
                    </p>
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      Simulated
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Right Compare Button */}
        <div className="pt-2 flex justify-end">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleRunCompare}
            disabled={selectedIds.length === 0}
            className="text-xs font-bold gap-2 bg-tertiary text-on-primary hover:bg-tertiary-hover cursor-pointer shadow-2xs px-5"
          >
            <span>Compare</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </Card>

      {/* ── 2. Comparison Results & AI Recommendation Panel ───────────────── */}
      {showResults && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <h3 className="font-display text-sm font-bold text-text-primary px-1">
            2. Comparison Results
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left/Center Matrix Table (Lg 8 cols) */}
            <Card className="lg:col-span-8 p-5 border-border-strong bg-surface overflow-x-auto space-y-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 text-text-muted">
                    <th className="p-3 font-semibold w-1/4">Metric</th>
                    {activeComparisonData.map((d) => (
                      <th
                        key={d.id}
                        className={cn(
                          'p-3 text-center min-w-[140px] relative',
                          d.isRecommended && 'bg-emerald-500/10 dark:bg-emerald-500/15 rounded-t-xl'
                        )}
                      >
                        {d.isRecommended && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-tertiary text-on-primary text-[9px] font-bold tracking-wide uppercase shadow-2xs">
                            Recommended
                          </div>
                        )}
                        <span className="block font-bold text-text-primary pt-1">{d.name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-mono">
                  {/* Revenue */}
                  <tr>
                    <td className="p-3 font-sans font-medium text-text-primary">Revenue</td>
                    {activeComparisonData.map((d) => (
                      <td
                        key={d.id}
                        className={cn(
                          'p-3 text-center',
                          d.isRecommended && 'bg-emerald-500/5 dark:bg-emerald-500/10 font-bold'
                        )}
                      >
                        <span className="text-text-primary">{d.revenue}</span>
                        {d.revenueDiff && (
                          <span className="text-emerald-500 ml-1.5 text-[11px] font-semibold">
                            {d.revenueDiff}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Net Profit */}
                  <tr>
                    <td className="p-3 font-sans font-medium text-text-primary">Profit (Net)</td>
                    {activeComparisonData.map((d) => (
                      <td
                        key={d.id}
                        className={cn(
                          'p-3 text-center',
                          d.isRecommended && 'bg-emerald-500/5 dark:bg-emerald-500/10 font-bold'
                        )}
                      >
                        <span className="text-text-primary">{d.profit}</span>
                        {d.profitDiff && (
                          <span className="text-emerald-500 ml-1.5 text-[11px] font-semibold">
                            {d.profitDiff}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Cash Runway */}
                  <tr>
                    <td className="p-3 font-sans font-medium text-text-primary">Cash Runway</td>
                    {activeComparisonData.map((d) => (
                      <td
                        key={d.id}
                        className={cn(
                          'p-3 text-center',
                          d.isRecommended && 'bg-emerald-500/5 dark:bg-emerald-500/10 font-bold'
                        )}
                      >
                        <span className="text-text-primary">{d.runway}</span>
                        {d.runwayDiff && (
                          <span className="text-emerald-500 ml-1.5 text-[11px] font-semibold">
                            {d.runwayDiff}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Working Capital */}
                  <tr>
                    <td className="p-3 font-sans font-medium text-text-primary">Working Capital</td>
                    {activeComparisonData.map((d) => (
                      <td
                        key={d.id}
                        className={cn(
                          'p-3 text-center',
                          d.isRecommended && 'bg-emerald-500/5 dark:bg-emerald-500/10 font-bold'
                        )}
                      >
                        <span className="text-text-primary">{d.workingCapital}</span>
                        {d.capitalDiff && (
                          <span
                            className={cn(
                              'ml-1.5 text-[11px] font-semibold',
                              d.capitalDiff.includes('-') ? 'text-rose-500' : 'text-emerald-500'
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
                    <td className="p-3 font-sans font-medium text-text-primary">Business Health</td>
                    {activeComparisonData.map((d) => (
                      <td
                        key={d.id}
                        className={cn(
                          'p-3 text-center',
                          d.isRecommended && 'bg-emerald-500/5 dark:bg-emerald-500/10 font-bold'
                        )}
                      >
                        <span className="text-text-primary">{d.health}</span>
                        {d.healthDiff && (
                          <span
                            className={cn(
                              'ml-1.5 text-[11px] font-semibold',
                              d.healthDiff.includes('-') ? 'text-rose-500' : 'text-emerald-500'
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
                    <td className="p-3 font-sans font-medium text-text-primary">Risk Level</td>
                    {activeComparisonData.map((d) => (
                      <td
                        key={d.id}
                        className={cn(
                          'p-3 text-center font-sans font-semibold',
                          d.isRecommended && 'bg-emerald-500/5 dark:bg-emerald-500/10 font-bold'
                        )}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className={cn(
                              'size-2 rounded-full',
                              d.risk === 'Low' && 'bg-emerald-500',
                              d.risk === 'Medium' && 'bg-amber-500',
                              d.risk === 'High' && 'bg-rose-500'
                            )}
                          />
                          {d.risk}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* ROI (Forecast) */}
                  <tr>
                    <td className="p-3 font-sans font-medium text-text-primary">ROI (Forecast)</td>
                    {activeComparisonData.map((d) => (
                      <td
                        key={d.id}
                        className={cn(
                          'p-3 text-center font-bold text-text-primary',
                          d.isRecommended && 'bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-500'
                        )}
                      >
                        {d.roi}
                      </td>
                    ))}
                  </tr>

                  {/* Confidence */}
                  <tr>
                    <td className="p-3 font-sans font-medium text-text-primary">Confidence</td>
                    {activeComparisonData.map((d) => (
                      <td
                        key={d.id}
                        className={cn(
                          'p-3 text-center text-text-primary',
                          d.isRecommended && 'bg-emerald-500/5 dark:bg-emerald-500/10 font-bold'
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
              <Card className="p-5 border-border-strong bg-surface space-y-4">
                <div className="flex flex-col items-center text-center space-y-2 pb-3 border-b border-border/60">
                  <div className="p-3 rounded-full bg-emerald-500/15 text-emerald-500 inline-flex">
                    <Award className="size-6" />
                  </div>
                  <h4 className="font-display text-sm font-bold text-text-primary">
                    AI Recommendation
                  </h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                      Best Option
                    </span>
                    <h3 className="font-display text-base font-bold text-text-primary">
                      {recommendedOption.name}
                    </h3>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed">
                    This scenario provides the highest profit increase with low risk and strong cash position improvement.
                  </p>

                  <div className="space-y-2 pt-1 border-t border-border/40 text-xs">
                    <div className="flex items-center gap-2 text-text-primary font-medium">
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                      <span>Highest ROI ({recommendedOption.roi})</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-primary font-medium">
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                      <span>Improved cash runway (+0.9 mo)</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-primary font-medium">
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                      <span>Low risk level</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-primary font-medium">
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                      <span>High confidence ({recommendedOption.confidence}%)</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Export & Save Action Buttons */}
                <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs font-semibold gap-1.5 cursor-pointer"
                  >
                    <Download className="size-3.5" />
                    <span>Export Comparison</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs font-semibold gap-1.5 cursor-pointer"
                  >
                    <Save className="size-3.5" />
                    <span>Save Report</span>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
