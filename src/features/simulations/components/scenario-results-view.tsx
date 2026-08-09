// src/features/simulations/components/scenario-results-view.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  Copy,
  Scale,
  Download,
  MoreHorizontal,
  Sparkles,
  ChevronDown,
  Pencil,
} from 'lucide-react';
import { useRouter } from '@/lib/i18n/navigation';
import type { ScenarioItem } from './scenario-library-view';
import { FadeInView } from '@/components/motion';

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
      const y = 35 - ((val - min) / range) * 26;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg className="w-full h-10 overflow-visible" viewBox="0 0 140 40">
      <path d={`M 0,38 ${points} L 140,38 Z`} fill={`${color}15`} />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
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
    <div className="space-y-6">
      {/* ── Top Header Navigation Bar ────────────────────────────────────── */}
      <FadeInView offset={10}>
        <div className="space-y-3 pb-2 border-b border-slate-100 dark:border-[#1E2638]">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleBackToLibrary}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4F46E5] dark:text-[#A5B4FC] hover:underline cursor-pointer transition-all"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Library</span>
            </button>

            {/* Top Right Header Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-white dark:bg-[#111622] text-xs font-semibold text-[#0F172A] dark:text-white hover:bg-slate-50 dark:hover:bg-[#1E2638] shadow-xs cursor-pointer transition-colors"
              >
                <Copy className="size-3.5 text-[#64748B] dark:text-[#94A3B8]" />
                <span>Duplicate</span>
              </button>

              <button
                type="button"
                onClick={() => scenario && onCompareScenario?.(scenario)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-white dark:bg-[#111622] text-xs font-semibold text-[#0F172A] dark:text-white hover:bg-slate-50 dark:hover:bg-[#1E2638] shadow-xs cursor-pointer transition-colors"
              >
                <Scale className="size-3.5 text-[#64748B] dark:text-[#94A3B8]" />
                <span>Compare</span>
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-white dark:bg-[#111622] text-xs font-semibold text-[#0F172A] dark:text-white hover:bg-slate-50 dark:hover:bg-[#1E2638] shadow-xs cursor-pointer transition-colors"
              >
                <Download className="size-3.5 text-[#64748B] dark:text-[#94A3B8]" />
                <span>Export</span>
                <ChevronDown className="size-3 text-[#94A3B8]" />
              </button>

              <button
                type="button"
                className="p-1.5 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-white dark:bg-[#111622] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1E2638] shadow-xs cursor-pointer transition-colors"
              >
                <MoreHorizontal className="size-4" />
              </button>
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
                    className="font-display text-2xl font-bold text-[#0F172A] dark:text-white border-b border-[#6366F1] bg-transparent focus:outline-hidden px-1"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white">
                      {scenarioName}
                    </h1>
                    <button
                      type="button"
                      onClick={() => setIsEditingTitle(true)}
                      className="p-1 text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white transition-colors cursor-pointer"
                    >
                      <Pencil className="size-4" />
                    </button>
                  </div>
                )}

                {/* Purple "Simulated" Badge */}
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border inline-flex items-center gap-1.5 bg-purple-50 dark:bg-purple-950/50 text-[#6366F1] dark:text-[#A5B4FC] border-purple-200 dark:border-purple-800/60 shadow-2xs">
                  <span className="size-1.5 rounded-full bg-[#8B5CF6] shrink-0" />
                  <span>Simulated</span>
                </span>
              </div>

              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 font-medium">
                Pricing Strategy • Created on May 2, 2025 • Simulated on May 2,
                2025 10:24 AM
              </p>
            </div>
          </div>

          {/* Sub-tabs: Results Mode vs Edit Scenario */}
          <div className="flex items-center gap-6 pt-2">
            <button
              type="button"
              className="pb-2 text-sm font-semibold text-[#4F46E5] dark:text-[#A5B4FC] relative cursor-pointer"
            >
              Results Mode
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full" />
            </button>

            <button
              type="button"
              onClick={onSwitchToEditMode}
              className="pb-2 text-sm font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white transition-colors cursor-pointer"
            >
              Edit Scenario
            </button>
          </div>
        </div>
      </FadeInView>

      {/* ── RESULTS MODE CONTENT ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Lg 8 cols): Executive Summary, Financial Performance, Impact vs Baseline & Risk */}
        <div className="lg:col-span-8 space-y-6 min-w-0">
          {/* Executive Summary Card */}
          <FadeInView offset={12}>
            <Card className="p-6 space-y-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 dark:border-[#1E2638] pb-3.5">
                <div>
                  <h3 className="font-display text-base font-bold text-[#0F172A] dark:text-white">
                    Executive Summary
                  </h3>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 leading-relaxed">
                    This simulation shows the potential impact of increasing
                    prices by 5% across all product lines.
                  </p>
                </div>

                {/* Confidence Ring Meter */}
                <div className="flex items-center gap-3 shrink-0 p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0B0F17] border border-slate-200/80 dark:border-[#1E2638]">
                  <div className="relative size-11 flex items-center justify-center font-mono font-bold text-xs text-[#0F172A] dark:text-white">
                    <svg className="size-11 -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-200 dark:text-[#1E2638]"
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
                    <span className="text-xs font-bold text-[#0F172A] dark:text-white block">
                      Confidence Score
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                      High Confidence
                    </span>
                  </div>
                </div>
              </div>

              {/* 5 KPI Metric Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {/* Business Health */}
                <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] space-y-1">
                  <span className="text-[10px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider block">
                    Business Health
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-base font-bold text-[#0F172A] dark:text-white">
                      84
                    </span>
                    <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">/100</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                      Good
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    ↑ 12 vs Baseline
                  </p>
                </div>

                {/* Expected Profit */}
                <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] space-y-1">
                  <span className="text-[10px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider block">
                    Profit (Monthly)
                  </span>
                  <p className="font-mono text-base font-bold text-[#0F172A] dark:text-white truncate">
                    ฿163,000
                  </p>
                  <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-mono">
                    ↑ 35.8%
                  </span>
                </div>

                {/* Revenue */}
                <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] space-y-1">
                  <span className="text-[10px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider block">
                    Revenue (Monthly)
                  </span>
                  <p className="font-mono text-base font-bold text-[#0F172A] dark:text-white truncate">
                    ฿1,260,000
                  </p>
                  <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-mono">
                    ↑ 5.0%
                  </span>
                </div>

                {/* Cash Runway */}
                <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] space-y-1">
                  <span className="text-[10px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider block">
                    Cash Runway
                  </span>
                  <p className="font-mono text-base font-bold text-[#0F172A] dark:text-white truncate">
                    5.1 mo
                  </p>
                  <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-mono">
                    ↑ 0.9 mo
                  </span>
                </div>

                {/* ROI */}
                <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] space-y-1">
                  <span className="text-[10px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider block">
                    ROI (6 Months)
                  </span>
                  <p className="font-mono text-base font-bold text-[#0F172A] dark:text-white truncate">
                    28.7%
                  </p>
                  <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-mono">
                    ↑ 10.5%
                  </span>
                </div>
              </div>
            </Card>
          </FadeInView>

          {/* Financial Performance Card (6 Months Projection Charts) */}
          <FadeInView offset={14}>
            <Card className="p-6 space-y-4 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-[#1E2638] pb-3.5 flex-wrap">
                <h3 className="font-display text-sm font-bold text-[#0F172A] dark:text-white">
                  Financial Performance{' '}
                  <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-normal">
                    (6 Months Projection)
                  </span>
                </h3>

                <div className="flex items-center gap-4 text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 border-t-2 border-dashed border-[#94A3B8]" />
                    Current Baseline
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                    <span className="w-3 h-0.5 bg-emerald-500 rounded-full" />
                    Price Increase +5%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Revenue Chart */}
                <div className="p-4 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] space-y-2">
                  <span className="text-xs font-bold text-[#0F172A] dark:text-white block">
                    Revenue
                  </span>
                  <MiniChart
                    data={[1.0, 1.1, 1.25, 1.28, 1.35, 1.5]}
                    color="#10B981"
                  />
                  <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                    <span className="text-[#64748B] dark:text-[#94A3B8]">Total (6M)</span>
                    <span className="font-bold text-[#0F172A] dark:text-white">
                      ฿7.56M <span className="text-emerald-600 dark:text-emerald-400">↑ 5.0%</span>
                    </span>
                  </div>
                </div>

                {/* Profit (Net) Chart */}
                <div className="p-4 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] space-y-2">
                  <span className="text-xs font-bold text-[#0F172A] dark:text-white block">
                    Profit (Net)
                  </span>
                  <MiniChart
                    data={[120, 140, 155, 170, 185, 200]}
                    color="#F59E0B"
                  />
                  <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                    <span className="text-[#64748B] dark:text-[#94A3B8]">Total (6M)</span>
                    <span className="font-bold text-[#0F172A] dark:text-white">
                      ฿978K <span className="text-emerald-600 dark:text-emerald-400">↑ 35.8%</span>
                    </span>
                  </div>
                </div>

                {/* Cash Balance Chart */}
                <div className="p-4 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] space-y-2">
                  <span className="text-xs font-bold text-[#0F172A] dark:text-white block">
                    Cash Balance
                  </span>
                  <MiniChart
                    data={[800, 780, 760, 740, 720, 856]}
                    color="#3B82F6"
                  />
                  <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                    <span className="text-[#64748B] dark:text-[#94A3B8]">Ending Balance</span>
                    <span className="font-bold text-[#0F172A] dark:text-white">
                      ฿856K <span className="text-emerald-600 dark:text-emerald-400">↑ 9.3%</span>
                    </span>
                  </div>
                </div>

                {/* Inventory Value Chart */}
                <div className="p-4 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] space-y-2">
                  <span className="text-xs font-bold text-[#0F172A] dark:text-white block">
                    Inventory Value
                  </span>
                  <MiniChart
                    data={[400, 410, 420, 425, 428, 430]}
                    color="#8B5CF6"
                  />
                  <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                    <span className="text-[#64748B] dark:text-[#94A3B8]">Ending Value</span>
                    <span className="font-bold text-[#0F172A] dark:text-white">
                      ฿430K <span className="text-emerald-600 dark:text-emerald-400">↑ 7.1%</span>
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </FadeInView>

          {/* Impact vs Baseline & Risk Assessment */}
          <FadeInView offset={16}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Impact Table (Md 7 cols) */}
              <Card className="md:col-span-7 p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs space-y-3 overflow-x-auto">
                <h3 className="font-display text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">
                  Scenario Impact vs Current Baseline
                </h3>

                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 dark:border-[#1E2638] text-[11px] text-[#64748B] dark:text-[#94A3B8] font-semibold">
                    <tr>
                      <th className="pb-2">Metric</th>
                      <th className="pb-2">Baseline</th>
                      <th className="pb-2">Price +5%</th>
                      <th className="pb-2">Change</th>
                      <th className="pb-2 text-right">Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#1E2638] font-mono text-[11px]">
                    <tr>
                      <td className="py-2.5 font-sans font-medium text-[#0F172A] dark:text-white">
                        Revenue (Monthly)
                      </td>
                      <td className="py-2.5 text-[#64748B] dark:text-[#94A3B8]">฿1,200,000</td>
                      <td className="py-2.5 font-bold text-[#0F172A] dark:text-white">
                        ฿1,260,000
                      </td>
                      <td className="py-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                        +฿60,000
                      </td>
                      <td className="py-2.5 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                        ↑ 5.0%
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-sans font-medium text-[#0F172A] dark:text-white">
                        Profit (Monthly)
                      </td>
                      <td className="py-2.5 text-[#64748B] dark:text-[#94A3B8]">฿120,000</td>
                      <td className="py-2.5 font-bold text-[#0F172A] dark:text-white">
                        ฿163,000
                      </td>
                      <td className="py-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                        +฿43,000
                      </td>
                      <td className="py-2.5 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                        ↑ 35.8%
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-sans font-medium text-[#0F172A] dark:text-white">
                        Gross Margin
                      </td>
                      <td className="py-2.5 text-[#64748B] dark:text-[#94A3B8]">32.0%</td>
                      <td className="py-2.5 font-bold text-[#0F172A] dark:text-white">34.1%</td>
                      <td className="py-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                        +2.1 pp
                      </td>
                      <td className="py-2.5 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                        ↑
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Card>

              {/* Risk Assessment (Md 5 cols) */}
              <Card className="md:col-span-5 p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1E2638] pb-2">
                  <h3 className="font-display text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">
                    Risk Assessment
                  </h3>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/50">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Low Risk
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8]">
                    <span>Cash Flow Risk</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Low</span>
                  </div>
                  <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8]">
                    <span>Market Demand Risk</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Low</span>
                  </div>
                  <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8]">
                    <span>Inventory Risk</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">Medium</span>
                  </div>
                </div>
              </Card>
            </div>
          </FadeInView>
        </div>

        {/* Right Column: AI Strategic Advisor (Lg 4 cols) */}
        <div className="lg:col-span-4 space-y-5 min-w-0 lg:sticky lg:top-20 self-start">
          <FadeInView offset={14}>
            <Card className="p-6 space-y-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
              <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-[#1E2638] pb-3.5">
                <div className="size-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-[#8B5CF6] border border-purple-200 dark:border-purple-800/60 flex items-center justify-center">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-[#0F172A] dark:text-white">
                    AI Strategic Advisor
                  </h3>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    Real-time execution guidance
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                <p>
                  Increasing prices by 5% generates an additional <strong className="text-emerald-600 dark:text-emerald-400 font-mono">฿43,000</strong> monthly profit with minimal churn risk.
                </p>
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0B0F17] border border-slate-200/80 dark:border-[#1E2638] space-y-2">
                  <span className="text-[11px] font-bold text-[#0F172A] dark:text-white uppercase tracking-wider block">
                    Recommended Action
                  </span>
                  <p className="text-xs text-[#0F172A] dark:text-white">
                    Apply price increase in 2 stages: 3% this week and 2% next month to protect customer volume.
                  </p>
                </div>
              </div>
            </Card>
          </FadeInView>
        </div>
      </div>
    </div>
  );
}
