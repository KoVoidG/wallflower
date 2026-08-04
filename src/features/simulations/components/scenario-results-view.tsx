'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  Copy,
  Scale,
  Download,
  MoreHorizontal,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  Trash2,
  Pencil,
  Activity,
} from 'lucide-react';
import { useRouter } from '@/lib/i18n/navigation';
import type { ScenarioItem } from './scenario-library-view';

interface ScenarioResultsViewProps {
  scenario?: ScenarioItem | null;
  onBackToLibrary?: () => void;
  onSwitchToEditMode?: () => void;
  onCompareScenario?: (scenario: ScenarioItem) => void;
}

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * 140;
      const y = 35 - ((val - min) / range) * 28;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg className="w-full h-10 overflow-visible" viewBox="0 0 140 40">
      <path d={`M 0,38 ${points} L 140,38 Z`} fill={`${color}15`} />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export function ScenarioResultsView({
  scenario,
  onBackToLibrary,
  onSwitchToEditMode,
  onCompareScenario,
}: ScenarioResultsViewProps) {
  const [scenarioName, setScenarioName] = useState<string>(
    scenario?.name || 'Price Increase +5%',
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const router = useRouter();

  const handleBackToLibrary = () => {
    if (onBackToLibrary) {
      onBackToLibrary();
    } else {
      router.push('/simulations?tab=library');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ── Top Header Navigation Bar ────────────────────────────────────── */}
      <div className="space-y-3 border-b border-border/60 pb-4">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBackToLibrary}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-tertiary hover:underline cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Library</span>
          </button>

          {/* Top Right Header Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs font-semibold gap-1.5 cursor-pointer border-border-strong"
            >
              <Copy className="size-3.5 text-text-secondary" />
              <span>Duplicate</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => scenario && onCompareScenario?.(scenario)}
              className="text-xs font-semibold gap-1.5 cursor-pointer border-border-strong"
            >
              <Scale className="size-3.5 text-text-secondary" />
              <span>Compare</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs font-semibold gap-1.5 cursor-pointer border-border-strong"
            >
              <Download className="size-3.5 text-text-secondary" />
              <span>Export</span>
              <ChevronDown className="size-3 text-text-muted" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs font-semibold cursor-pointer border-border-strong px-2"
            >
              <MoreHorizontal className="size-3.5 text-text-secondary" />
            </Button>
          </div>
        </div>

        {/* Title, Status Badge & Meta Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && setIsEditingTitle(false)
                  }
                  autoFocus
                  className="font-display text-2xl font-bold text-text-primary border-b border-tertiary bg-transparent focus:outline-hidden px-1"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-2xl font-bold text-text-primary">
                    {scenarioName}
                  </h1>
                  <button
                    type="button"
                    onClick={() => setIsEditingTitle(true)}
                    className="p-1 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  >
                    <Pencil className="size-4" />
                  </button>
                </div>
              )}

              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border tracking-wide bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                Simulated
              </span>
            </div>

            <p className="text-xs text-text-secondary mt-1 font-medium">
              Pricing Strategy • Created on May 2, 2025 • Simulated on May 2,
              2025 10:24 AM
            </p>
          </div>
        </div>

        {/* Sub-tabs: Results Mode vs Edit Scenario */}
        <div className="flex items-center gap-6 pt-2">
          <button
            type="button"
            className="pb-2 text-sm font-semibold text-tertiary relative cursor-pointer"
          >
            Results Mode
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-tertiary rounded-full" />
          </button>

          <button
            type="button"
            onClick={onSwitchToEditMode}
            className="pb-2 text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            Edit Scenario
          </button>
        </div>
      </div>

      {/* ── RESULTS MODE CONTENT ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Lg 8 cols): Executive Summary, Financial Performance, Impact vs Baseline & Risk */}
        <div className="lg:col-span-8 space-y-6 min-w-0">
          {/* Executive Summary Card */}
          <Card className="p-5 space-y-5 border-border-strong bg-surface">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border/60 pb-3">
              <div>
                <h3 className="font-display text-base font-bold text-text-primary">
                  Executive Summary
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  This simulation shows the potential impact of increasing
                  prices by 5% across all products.
                </p>
              </div>

              {/* Confidence Ring Meter */}
              <div className="flex items-center gap-3 shrink-0 p-2 rounded-xl bg-surface-subtle border border-border/60">
                <div className="relative size-11 flex items-center justify-center font-mono font-bold text-xs text-text-primary">
                  <svg className="size-11 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-border"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-500"
                      strokeDasharray="91, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span>91%</span>
                </div>

                <div className="text-left">
                  <span className="text-xs font-bold text-text-primary block">
                    Confidence Score
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                    High Confidence
                  </span>
                  <button
                    type="button"
                    className="text-[10px] text-tertiary hover:underline"
                  >
                    Why this score?
                  </button>
                </div>
              </div>
            </div>

            {/* 5 KPI Metric Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* Business Health */}
              <div className="p-3 rounded-xl border border-border/60 bg-surface-subtle/40 space-y-1">
                <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
                  Business Health
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-text-primary">
                    84
                  </span>
                  <span className="text-[10px] text-text-muted">/100</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-500">
                    Good
                  </span>
                </div>
                <p className="text-[10px] text-emerald-500 font-semibold">
                  ↑ 12 vs Current Baseline
                </p>
              </div>

              {/* Expected Profit */}
              <div className="p-3 rounded-xl border border-border/60 bg-surface-subtle/40 space-y-1">
                <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
                  Expected Profit (Monthly)
                </span>
                <p className="font-mono text-base font-bold text-text-primary truncate">
                  ฿163,000
                </p>
                <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-500">
                  ↑ 35.8%
                </span>
                <p className="text-[10px] text-text-muted truncate">
                  vs ฿120,000 (Baseline)
                </p>
              </div>

              {/* Revenue */}
              <div className="p-3 rounded-xl border border-border/60 bg-surface-subtle/40 space-y-1">
                <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
                  Revenue (Monthly)
                </span>
                <p className="font-mono text-base font-bold text-text-primary truncate">
                  ฿1,260,000
                </p>
                <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-500">
                  ↑ 5.0%
                </span>
                <p className="text-[10px] text-text-muted truncate">
                  vs ฿1,200,000 (Baseline)
                </p>
              </div>

              {/* Cash Runway */}
              <div className="p-3 rounded-xl border border-border/60 bg-surface-subtle/40 space-y-1">
                <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
                  Cash Runway
                </span>
                <p className="font-mono text-base font-bold text-text-primary truncate">
                  5.1 months
                </p>
                <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-500">
                  ↑ 0.9 mo
                </span>
                <p className="text-[10px] text-text-muted truncate">
                  vs 4.2 months (Baseline)
                </p>
              </div>

              {/* ROI */}
              <div className="p-3 rounded-xl border border-border/60 bg-surface-subtle/40 space-y-1">
                <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
                  ROI (6 Months)
                </span>
                <p className="font-mono text-base font-bold text-text-primary truncate">
                  28.7%
                </p>
                <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-500">
                  ↑ 10.5%
                </span>
                <p className="text-[10px] text-text-muted truncate">
                  vs 18.2% (Baseline)
                </p>
              </div>
            </div>
          </Card>

          {/* Financial Performance Card (6 Months Projection Charts) */}
          <Card className="p-5 space-y-4 border-border-strong bg-surface">
            <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
              <h3 className="font-display text-sm font-bold text-text-primary">
                Financial Performance{' '}
                <span className="text-xs text-text-muted font-normal">
                  (6 Months Projection)
                </span>
              </h3>

              <div className="flex items-center gap-4 text-xs font-medium text-text-secondary">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 border-t-2 border-dashed border-text-muted" />
                  Current Baseline
                </span>
                <span className="flex items-center gap-1.5 text-emerald-500 font-bold">
                  <span className="w-3 h-0.5 bg-emerald-500 rounded-full" />
                  Price Increase +5%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Revenue Chart */}
              <div className="p-3 rounded-xl border border-border/60 bg-surface-subtle/30 space-y-2">
                <span className="text-xs font-bold text-text-primary block">
                  Revenue
                </span>
                <MiniChart
                  data={[1.0, 1.1, 1.25, 1.28, 1.35, 1.5]}
                  color="#10B981"
                />
                <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                  <span className="text-text-muted">Total (6M)</span>
                  <span className="font-bold text-text-primary">
                    ฿7.56M <span className="text-emerald-500">↑ 5.0%</span>
                  </span>
                </div>
              </div>

              {/* Profit (Net) Chart */}
              <div className="p-3 rounded-xl border border-border/60 bg-surface-subtle/30 space-y-2">
                <span className="text-xs font-bold text-text-primary block">
                  Profit (Net)
                </span>
                <MiniChart
                  data={[120, 140, 155, 170, 185, 200]}
                  color="#F59E0B"
                />
                <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                  <span className="text-text-muted">Total (6M)</span>
                  <span className="font-bold text-text-primary">
                    ฿978K <span className="text-emerald-500">↑ 35.8%</span>
                  </span>
                </div>
              </div>

              {/* Cash Balance Chart */}
              <div className="p-3 rounded-xl border border-border/60 bg-surface-subtle/30 space-y-2">
                <span className="text-xs font-bold text-text-primary block">
                  Cash Balance
                </span>
                <MiniChart
                  data={[800, 780, 760, 740, 720, 856]}
                  color="#3B82F6"
                />
                <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                  <span className="text-text-muted">Ending Balance</span>
                  <span className="font-bold text-text-primary">
                    ฿856K <span className="text-emerald-500">↑ 9.3%</span>
                  </span>
                </div>
              </div>

              {/* Inventory Value Chart */}
              <div className="p-3 rounded-xl border border-border/60 bg-surface-subtle/30 space-y-2">
                <span className="text-xs font-bold text-text-primary block">
                  Inventory Value
                </span>
                <MiniChart
                  data={[400, 410, 420, 425, 428, 430]}
                  color="#14B8A6"
                />
                <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                  <span className="text-text-muted">Ending Value</span>
                  <span className="font-bold text-text-primary">
                    ฿430K <span className="text-emerald-500">↑ 7.1%</span>
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Impact vs Baseline & Risk Assessment Cards */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Impact Table (Md 7 cols) */}
            <Card className="md:col-span-7 p-4 border-border-strong bg-surface space-y-3 overflow-x-auto">
              <h3 className="font-display text-xs font-bold text-text-primary">
                Scenario Impact vs Current Baseline
              </h3>

              <table className="w-full text-left text-xs font-sans">
                <thead className="border-b border-border/80 text-[11px] text-text-muted font-semibold">
                  <tr>
                    <th className="pb-2">Metric</th>
                    <th className="pb-2">Baseline</th>
                    <th className="pb-2">Price +5%</th>
                    <th className="pb-2">Change</th>
                    <th className="pb-2 text-right">Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-mono text-[11px]">
                  <tr>
                    <td className="py-2 font-sans font-medium text-text-primary">
                      Revenue (Monthly)
                    </td>
                    <td className="py-2 text-text-muted">฿1,200,000</td>
                    <td className="py-2 font-bold text-text-primary">
                      ฿1,260,000
                    </td>
                    <td className="py-2 text-emerald-500 font-semibold">
                      +฿60,000
                    </td>
                    <td className="py-2 text-right text-emerald-500 font-semibold">
                      ↑ 5.0%
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-sans font-medium text-text-primary">
                      Profit (Monthly)
                    </td>
                    <td className="py-2 text-text-muted">฿120,000</td>
                    <td className="py-2 font-bold text-text-primary">
                      ฿163,000
                    </td>
                    <td className="py-2 text-emerald-500 font-semibold">
                      +฿43,000
                    </td>
                    <td className="py-2 text-right text-emerald-500 font-semibold">
                      ↑ 35.8%
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-sans font-medium text-text-primary">
                      Gross Margin
                    </td>
                    <td className="py-2 text-text-muted">32.0%</td>
                    <td className="py-2 font-bold text-text-primary">34.1%</td>
                    <td className="py-2 text-emerald-500 font-semibold">
                      +2.1 pp
                    </td>
                    <td className="py-2 text-right text-emerald-500 font-semibold">
                      ↑
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-sans font-medium text-text-primary">
                      Cash Runway
                    </td>
                    <td className="py-2 text-text-muted">4.2 months</td>
                    <td className="py-2 font-bold text-text-primary">
                      5.1 months
                    </td>
                    <td className="py-2 text-emerald-500 font-semibold">
                      +0.9 months
                    </td>
                    <td className="py-2 text-right text-emerald-500 font-semibold">
                      ↑
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-sans font-medium text-text-primary">
                      Working Capital
                    </td>
                    <td className="py-2 text-text-muted">฿240,000</td>
                    <td className="py-2 font-bold text-text-primary">
                      ฿286,000
                    </td>
                    <td className="py-2 text-emerald-500 font-semibold">
                      +฿46,000
                    </td>
                    <td className="py-2 text-right text-emerald-500 font-semibold">
                      ↑ 17.1%
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-sans font-medium text-text-primary">
                      ROI (6 Months)
                    </td>
                    <td className="py-2 text-text-muted">18.2%</td>
                    <td className="py-2 font-bold text-text-primary">28.7%</td>
                    <td className="py-2 text-emerald-500 font-semibold">
                      +10.5 pp
                    </td>
                    <td className="py-2 text-right text-emerald-500 font-semibold">
                      ↑
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-sans font-medium text-text-primary">
                      Inventory Turnover
                    </td>
                    <td className="py-2 text-text-muted">4.1x</td>
                    <td className="py-2 font-bold text-text-primary">4.3x</td>
                    <td className="py-2 text-emerald-500 font-semibold">
                      +0.2x
                    </td>
                    <td className="py-2 text-right text-emerald-500 font-semibold">
                      ↑
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>

            {/* Risk Assessment Card (Md 5 cols) */}
            <Card className="md:col-span-5 p-4 border-border-strong bg-surface space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
                  <ShieldCheck className="size-4 text-emerald-500" />
                  <span>Risk Assessment</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-text-muted">
                    Risk Score
                  </span>
                  <span className="font-mono text-xs font-bold text-text-primary">
                    22{' '}
                    <span className="text-[10px] text-text-muted font-normal">
                      /100
                    </span>
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-subtle/40 border border-border/60">
                  <span className="text-text-secondary font-medium">
                    Overall Risk Level
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-500">
                    🟢 Low
                  </span>
                </div>

                <div className="space-y-1.5 pt-1 font-sans text-[11px]">
                  <div className="flex items-center justify-between text-text-secondary">
                    <span>Cash Flow Risk</span>
                    <span className="text-emerald-500 font-semibold">
                      🟢 Low
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-text-secondary">
                    <span>Market Demand Risk</span>
                    <span className="text-emerald-500 font-semibold">
                      🟢 Low
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-text-secondary">
                    <span>Inventory Risk</span>
                    <span className="text-amber-500 font-semibold">
                      🟠 Medium
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-text-secondary">
                    <span>Operational Risk</span>
                    <span className="text-emerald-500 font-semibold">
                      🟢 Low
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-text-secondary">
                    <span>Profitability Risk</span>
                    <span className="text-emerald-500 font-semibold">
                      🟢 Low
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="text-xs font-semibold text-tertiary hover:underline block text-right pt-1"
              >
                View detailed risk analysis →
              </button>
            </Card>
          </div>
        </div>

        {/* Right Column (Lg 4 cols): AI Analysis Panel */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-20 self-start">
          <Card className="p-5 border-border-strong bg-surface space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-tertiary/15 text-tertiary">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-text-primary">
                    AI Analysis
                  </h4>
                  <p className="text-[10px] text-text-muted">
                    Generated on May 2, 2025 10:24 AM
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Summary */}
              <div className="space-y-1">
                <h5 className="font-bold text-text-primary">Summary</h5>
                <p className="text-text-secondary leading-relaxed">
                  Increasing prices by 5% is projected to improve profit by
                  35.8% without significantly impacting cash flow or inventory
                  levels. The business remains in a strong position with low
                  overall risk.
                </p>
              </div>

              {/* Key Takeaways */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                <h5 className="font-bold text-text-primary">Key Takeaways</h5>

                <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="size-3.5" />
                    <span>Strong Profit Improvement</span>
                  </div>
                  <p className="text-text-secondary text-[11px] leading-relaxed">
                    Monthly profit increases by ฿43,000 (+35.8%) due to higher
                    average selling price.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="size-3.5" />
                    <span>Healthy Cash Position</span>
                  </div>
                  <p className="text-text-secondary text-[11px] leading-relaxed">
                    Cash runway improves by 0.9 months, giving you more
                    financial flexibility.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                    <Activity className="size-3.5" />
                    <span>Moderate Inventory Risk</span>
                  </div>
                  <p className="text-text-secondary text-[11px] leading-relaxed">
                    Slight increase in inventory value. Monitor stock turnover
                    to avoid overstock.
                  </p>
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                <h5 className="font-bold text-text-primary">
                  AI Recommendations
                </h5>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-text-secondary text-[11px]">
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      Implement the price increase gradually to monitor customer
                      response.
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-text-secondary text-[11px]">
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      Consider bundling or promotions to maintain demand
                      elasticity.
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-text-secondary text-[11px]">
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      Reinvest additional profit into high-margin products or
                      marketing for growth.
                    </span>
                  </li>
                </ul>
              </div>

              {/* AI Confidence Card */}
              <div className="p-3 rounded-xl border border-border/60 bg-surface-subtle flex items-center justify-between gap-3 pt-2">
                <div className="min-w-0">
                  <h5 className="font-bold text-text-primary">AI Confidence</h5>
                  <p className="text-[10px] text-text-muted leading-tight">
                    High confidence based on historical data and market trends.
                  </p>
                </div>

                <div className="relative size-10 flex items-center justify-center font-mono font-bold text-xs text-text-primary shrink-0">
                  <svg className="size-10 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-border"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-500"
                      strokeDasharray="91, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="text-[10px]">91%</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom "What's Next?" Actions Bar */}
      <Card className="p-4 border-border-strong bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h4 className="font-display text-sm font-bold text-text-primary">
            What&apos;s Next?
          </h4>
          <p className="text-xs text-text-secondary">
            Take action based on this simulation or explore other scenarios.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSwitchToEditMode}
            className="text-xs font-semibold gap-1.5 cursor-pointer border-border-strong"
          >
            <Pencil className="size-3.5 text-text-secondary" />
            <span>Edit Scenario</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs font-semibold gap-1.5 cursor-pointer border-border-strong"
          >
            <Copy className="size-3.5 text-text-secondary" />
            <span>Duplicate</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => scenario && onCompareScenario?.(scenario)}
            className="text-xs font-semibold gap-1.5 cursor-pointer border-border-strong"
          >
            <Scale className="size-3.5 text-text-secondary" />
            <span>Compare</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            className="text-xs font-bold gap-1.5 cursor-pointer bg-tertiary text-on-primary hover:bg-tertiary-hover shadow-2xs"
          >
            <Download className="size-3.5" />
            <span>Export Report</span>
            <ChevronDown className="size-3" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs font-semibold gap-1.5 cursor-pointer text-rose-500 hover:text-rose-600 border-rose-500/30 hover:bg-rose-500/10"
          >
            <Trash2 className="size-3.5" />
            <span>Delete Scenario</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
