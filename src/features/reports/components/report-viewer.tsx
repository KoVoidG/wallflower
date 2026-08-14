// src/features/reports/components/report-viewer.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  Download,
  Printer,
  MoreHorizontal,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';
import { ExportModal } from './export-modal';
import { FadeInView } from '@/components/motion';

export interface ReportItem {
  id: string;
  title: string;
  type: string;
  date: string;
  horizon: string;
  healthScore: number;
  profit: string;
  confidence: number;
  confidenceBadge: 'High Confidence' | 'Medium Confidence' | 'Low Confidence';
  iconColor: 'emerald' | 'blue' | 'rose';
}

interface ReportViewerProps {
  report?: ReportItem | null;
  onBackToLibrary: () => void;
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
      <path d={`M 0,38 ${points} L 140,38 Z`} fill={`${color}20`} />
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

export function ReportViewer({ report, onBackToLibrary }: ReportViewerProps) {
  const [isExportOpen, setIsExportOpen] = useState(false);

  const title = report?.title || 'Price Increase +5%';
  const type = report?.type || 'Executive Summary Report';
  const date = report?.date || 'Aug 3, 2025 • 10:24 AM';
  const horizon = report?.horizon || '6 Months Horizon';
  const confidenceBadge = report?.confidenceBadge || 'High Confidence';
  const healthScore = report?.healthScore || 84;
  const confidence = report?.confidence || 91;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Actions Bar */}
      <FadeInView offset={10}>
        <div className="space-y-4 pb-2">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <button
              type="button"
              onClick={onBackToLibrary}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#4F46E5] dark:text-[#A5B4FC] hover:underline cursor-pointer transition-all"
            >
              <ArrowLeft className="size-4" />
              <span>Back to Reports Library</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsExportOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#111622] border border-slate-200/80 dark:border-[#1E2638] text-sm font-semibold text-[#0F172A] dark:text-white hover:bg-slate-50 dark:hover:bg-[#1E2638] transition-all cursor-pointer shadow-xs"
              >
                <Download className="size-4 text-[#64748B] dark:text-[#94A3B8]" />
                <span>Export Report</span>
                <ChevronDown className="size-4 text-[#94A3B8]" />
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#111622] border border-slate-200/80 dark:border-[#1E2638] text-sm font-semibold text-[#0F172A] dark:text-white hover:bg-slate-50 dark:hover:bg-[#1E2638] transition-all cursor-pointer shadow-xs"
              >
                <Printer className="size-4 text-[#64748B] dark:text-[#94A3B8]" />
                <span>Print</span>
              </button>

              <button
                type="button"
                className="p-2 rounded-xl bg-white dark:bg-[#111622] border border-slate-200/80 dark:border-[#1E2638] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1E2638] transition-all cursor-pointer shadow-xs"
              >
                <MoreHorizontal className="size-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-[#1E2638]">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white">
                  {title}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border tracking-wide bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60">
                  {confidenceBadge}
                </span>
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 font-medium">
                {type} • Generated on {date}
              </p>
            </div>

            <div className="text-right text-xs text-[#64748B] dark:text-[#94A3B8]">
              Time Horizon:{' '}
              <strong className="text-[#0F172A] dark:text-white font-mono font-bold">
                {horizon}
              </strong>
            </div>
          </div>
        </div>
      </FadeInView>

      {/* Executive Summary Card */}
      <FadeInView offset={12}>
        <Card className="p-6 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <h3 className="font-display text-sm font-bold text-[#0F172A] dark:text-white">
                Executive Summary
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                Increasing prices by 5% is projected to improve monthly profit by
                35.8% while maintaining a strong cash position. The business
                remains in a healthy position with low overall risk.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0 px-5 py-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0B0F17] border border-slate-200/80 dark:border-[#1E2638] shadow-2xs">
              <div className="space-y-0.5 text-left">
                <span className="text-xs font-bold text-[#0F172A] dark:text-white block">
                  Business Health
                </span>
                <span className="font-mono text-sm font-bold text-[#0F172A] dark:text-white block">
                  {healthScore} / 100{' '}
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold ml-1 font-sans text-xs">
                    Good
                  </span>
                </span>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-0.5">
                  + 12 vs Current Baseline
                </p>
              </div>
            </div>
          </div>
        </Card>
      </FadeInView>

      {/* Row: 4 KPI Cards (Clean static cards) */}
      <FadeInView offset={14}>
        <div className="space-y-2.5">
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
            Key Performance Indicators
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs space-y-2">
              <span className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] block">
                Revenue (Monthly)
              </span>
              <p className="font-mono text-2xl font-bold text-[#0F172A] dark:text-white">
                ฿1,260,000
              </p>
              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-100 dark:border-[#1E2638]">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                  <ArrowUpRight className="size-3.5" /> 5.0%
                </span>
                <span className="text-[#94A3B8] font-mono text-[11px]">
                  vs ฿1,200,000
                </span>
              </div>
            </Card>

            <Card className="p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs space-y-2">
              <span className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] block">
                Profit (Monthly)
              </span>
              <p className="font-mono text-2xl font-bold text-[#0F172A] dark:text-white">
                ฿163,000
              </p>
              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-100 dark:border-[#1E2638]">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                  <ArrowUpRight className="size-3.5" /> 35.8%
                </span>
                <span className="text-[#94A3B8] font-mono text-[11px]">
                  vs ฿120,000
                </span>
              </div>
            </Card>

            <Card className="p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs space-y-2">
              <span className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] block">
                Cash Runway
              </span>
              <p className="font-mono text-2xl font-bold text-[#0F172A] dark:text-white">
                5.1 months
              </p>
              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-100 dark:border-[#1E2638]">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                  <ArrowUpRight className="size-3.5" /> 0.9 mo
                </span>
                <span className="text-[#94A3B8] font-mono text-[11px]">
                  vs 4.2 months
                </span>
              </div>
            </Card>

            <Card className="p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs space-y-2">
              <span className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] block">
                ROI (6 Months)
              </span>
              <p className="font-mono text-2xl font-bold text-[#0F172A] dark:text-white">
                28.7%
              </p>
              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-100 dark:border-[#1E2638]">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                  <ArrowUpRight className="size-3.5" /> 10.5 pp
                </span>
                <span className="text-[#94A3B8] font-mono text-[11px]">
                  vs 18.2%
                </span>
              </div>
            </Card>
          </div>
        </div>
      </FadeInView>

      {/* Financial Outlook Card */}
      <FadeInView offset={16}>
        <Card className="p-6 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-[#1E2638] pb-3 flex-wrap">
            <h3 className="font-display text-sm font-bold text-[#0F172A] dark:text-white">
              Financial Outlook{' '}
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
            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] space-y-2">
              <span className="text-xs font-bold text-[#0F172A] dark:text-white block">
                Revenue
              </span>
              <MiniChart
                data={[1.0, 1.1, 1.25, 1.28, 1.35, 1.5]}
                color="#10B981"
              />
              <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-[#94A3B8]">
                <span>M1 M2 M3 M4 M5 M6</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] space-y-2">
              <span className="text-xs font-bold text-[#0F172A] dark:text-white block">
                Profit (Net)
              </span>
              <MiniChart data={[120, 140, 155, 170, 185, 200]} color="#F59E0B" />
              <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-[#94A3B8]">
                <span>M1 M2 M3 M4 M5 M6</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] space-y-2">
              <span className="text-xs font-bold text-[#0F172A] dark:text-white block">
                Cash Balance
              </span>
              <MiniChart data={[800, 780, 760, 740, 720, 856]} color="#3B82F6" />
              <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-[#94A3B8]">
                <span>M1 M2 M3 M4 M5 M6</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] space-y-2">
              <span className="text-xs font-bold text-[#0F172A] dark:text-white block">
                Inventory Value
              </span>
              <MiniChart data={[400, 410, 420, 425, 428, 430]} color="#8B5CF6" />
              <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-[#94A3B8]">
                <span>M1 M2 M3 M4 M5 M6</span>
              </div>
            </div>
          </div>
        </Card>
      </FadeInView>

      {/* Row: 3 Detail Cards (Risk, AI Insights, Recommendations) */}
      <FadeInView offset={18}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Risk Assessment */}
          <Card className="p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1E2638] pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldAlert className="size-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-display text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">
                  Risk Assessment
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/50">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Low Risk
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8]">
                <span>Cash Flow Risk</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Low
                </span>
              </div>
              <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8]">
                <span>Market Demand Risk</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Low
                </span>
              </div>
              <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8]">
                <span>Inventory Risk</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400 inline-flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-amber-500" />
                  Medium
                </span>
              </div>
              <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8]">
                <span>Operational Risk</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Low
                </span>
              </div>
              <div className="flex items-center justify-between text-[#64748B] dark:text-[#94A3B8]">
                <span>Profitability Risk</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Low
                </span>
              </div>
            </div>

            <button
              type="button"
              className="text-xs font-semibold text-[#4F46E5] dark:text-[#A5B4FC] hover:underline block pt-1 cursor-pointer"
            >
              View detailed risk analysis →
            </button>
          </Card>

          {/* 2. AI Insights */}
          <Card className="p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-[#1E2638] pb-2.5">
              <Sparkles className="size-4 text-[#8B5CF6]" />
              <h3 className="font-display text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">
                AI Insights
              </h3>
            </div>

            <ul className="space-y-2 text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#8B5CF6] font-bold">•</span>
                <span>
                  Profit improvement is driven by higher average selling price.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#8B5CF6] font-bold">•</span>
                <span>
                  Cash runway improves by 0.9 months, strengthening financial stability.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#8B5CF6] font-bold">•</span>
                <span>
                  Inventory risk slightly increases. Monitor stock turnover to avoid overstock.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#8B5CF6] font-bold">•</span>
                <span>
                  Demand is expected to remain stable with minimal volume drop.
                </span>
              </li>
            </ul>
          </Card>

          {/* 3. Recommendations */}
          <Card className="p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-[#1E2638] pb-2.5">
              <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-display text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">
                Recommendations
              </h3>
            </div>

            <ul className="space-y-2 text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Implement the price increase gradually to monitor customer response.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Consider bundling or promotions to maintain demand elasticity.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Reinvest additional profit into high-margin products or marketing.
                </span>
              </li>
            </ul>
          </Card>
        </div>
      </FadeInView>

      {/* AI Confidence Banner */}
      <FadeInView offset={20}>
        <Card className="p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs flex items-center justify-between gap-4">
          <div className="space-y-0.5 min-w-0">
            <h4 className="font-display text-sm font-bold text-[#0F172A] dark:text-white">
              AI Confidence Assessment
            </h4>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              High predictive confidence ({confidence}%) based on 12-month historical sales data, cost stability, and industry benchmarks.
            </p>
          </div>

          <div className="relative size-12 flex items-center justify-center font-mono font-bold text-xs text-[#0F172A] dark:text-white shrink-0">
            <svg className="size-12 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200 dark:text-[#1E2638]"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500"
                strokeDasharray={`${confidence}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
              {confidence}%
            </span>
          </div>
        </Card>
      </FadeInView>

      <ExportModal open={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
}
