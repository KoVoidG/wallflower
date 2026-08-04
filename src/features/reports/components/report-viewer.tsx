'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  Download,
  Printer,
  MoreHorizontal,
  Sparkles,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { ExportModal } from './export-modal';

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

export function ReportViewer({ report, onBackToLibrary }: ReportViewerProps) {
  const [isExportOpen, setIsExportOpen] = useState(false);

  const title = report?.title || 'Price Increase +5%';
  const type = report?.type || 'Executive Summary Report';
  const date = report?.date || 'Aug 3, 2025 10:24 AM';
  const horizon = report?.horizon || '6 Months';
  const confidenceBadge = report?.confidenceBadge || 'High Confidence';
  const healthScore = report?.healthScore || 84;
  const confidence = report?.confidence || 91;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="space-y-3 border-b border-border/60 pb-4">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBackToLibrary}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-tertiary hover:underline cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Reports</span>
          </button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsExportOpen(true)}
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
              onClick={handlePrint}
              className="text-xs font-semibold gap-1.5 cursor-pointer border-border-strong"
            >
              <Printer className="size-3.5 text-text-secondary" />
              <span>Print</span>
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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display text-2xl font-bold text-text-primary">
                {title}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border tracking-wide bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                {confidenceBadge}
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1 font-medium">
              {type} • Generated on {date}
            </p>
          </div>

          <div className="text-right text-xs font-medium text-text-secondary">
            Time Horizon:{' '}
            <strong className="text-text-primary">{horizon}</strong>
          </div>
        </div>
      </div>

      <Card className="p-6 border-border-strong bg-surface space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-1.5 max-w-xl">
            <h3 className="font-display text-sm font-bold text-text-primary">
              Executive Summary
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Increasing prices by 5% is projected to improve monthly profit by
              35.8% while maintaining a strong cash position. The business
              remains in a healthy position with low overall risk.
            </p>
          </div>

          <div className="flex items-center gap-4.5 shrink-0 px-5 py-3.5 rounded-2xl bg-surface-subtle/60 border border-border/80 shadow-2xs">
            <div className="space-y-0.5 text-left">
              <span className="text-xs font-bold text-text-primary block">
                Business Health
              </span>
              <span className="text-[11px] text-text-muted font-medium block">
                {healthScore} / 100{' '}
                <span className="text-emerald-500 font-bold ml-1">Good</span>
              </span>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-0.5">
                + 12 vs Current Baseline
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-2">
        <h3 className="font-display text-xs font-bold uppercase tracking-wider text-text-muted">
          Key Performance Indicators
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 border-border-strong bg-surface space-y-2">
            <span className="text-[11px] font-semibold text-text-muted block">
              Revenue (Monthly)
            </span>
            <p className="font-mono text-xl font-bold text-text-primary">
              ฿1,260,000
            </p>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
              <span className="text-emerald-500 font-bold">↑ 5.0%</span>
              <span className="text-text-muted font-mono text-[11px]">
                vs ฿1,200,000
              </span>
            </div>
          </Card>

          <Card className="p-4 border-border-strong bg-surface space-y-2">
            <span className="text-[11px] font-semibold text-text-muted block">
              Profit (Monthly)
            </span>
            <p className="font-mono text-xl font-bold text-text-primary">
              ฿163,000
            </p>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
              <span className="text-emerald-500 font-bold">↑ 35.8%</span>
              <span className="text-text-muted font-mono text-[11px]">
                vs ฿120,000
              </span>
            </div>
          </Card>

          <Card className="p-4 border-border-strong bg-surface space-y-2">
            <span className="text-[11px] font-semibold text-text-muted block">
              Cash Runway
            </span>
            <p className="font-mono text-xl font-bold text-text-primary">
              5.1 months
            </p>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
              <span className="text-emerald-500 font-bold">↑ 0.9 mo</span>
              <span className="text-text-muted font-mono text-[11px]">
                vs 4.2 months
              </span>
            </div>
          </Card>

          <Card className="p-4 border-border-strong bg-surface space-y-2">
            <span className="text-[11px] font-semibold text-text-muted block">
              ROI (6 Months)
            </span>
            <p className="font-mono text-xl font-bold text-text-primary">
              28.7%
            </p>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
              <span className="text-emerald-500 font-bold">↑ 10.5 pp</span>
              <span className="text-text-muted font-mono text-[11px]">
                vs 18.2%
              </span>
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-5 border-border-strong bg-surface space-y-4">
        <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
          <h3 className="font-display text-sm font-bold text-text-primary">
            Financial Outlook{' '}
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
          <div className="p-3 rounded-xl border border-border/60 bg-surface-subtle/30 space-y-2">
            <span className="text-xs font-bold text-text-primary block">
              Revenue
            </span>
            <MiniChart
              data={[1.0, 1.1, 1.25, 1.28, 1.35, 1.5]}
              color="#10B981"
            />
            <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-text-muted">
              <span>M1 M2 M3 M4 M5 M6</span>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-border/60 bg-surface-subtle/30 space-y-2">
            <span className="text-xs font-bold text-text-primary block">
              Profit (Net)
            </span>
            <MiniChart data={[120, 140, 155, 170, 185, 200]} color="#F59E0B" />
            <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-text-muted">
              <span>M1 M2 M3 M4 M5 M6</span>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-border/60 bg-surface-subtle/30 space-y-2">
            <span className="text-xs font-bold text-text-primary block">
              Cash Balance
            </span>
            <MiniChart data={[800, 780, 760, 740, 720, 856]} color="#3B82F6" />
            <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-text-muted">
              <span>M1 M2 M3 M4 M5 M6</span>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-border/60 bg-surface-subtle/30 space-y-2">
            <span className="text-xs font-bold text-text-primary block">
              Inventory Value
            </span>
            <MiniChart data={[400, 410, 420, 425, 428, 430]} color="#14B8A6" />
            <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-text-muted">
              <span>M1 M2 M3 M4 M5 M6</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-4 border-border-strong bg-surface space-y-3.5">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <h3 className="font-display text-xs font-bold text-text-primary">
              Risk Assessment
            </h3>
            <span className="font-sans text-xs font-semibold text-text-primary inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/15">
              <span className="size-2 rounded-full bg-emerald-500" />
              Low
            </span>
          </div>

          <div className="space-y-2 text-xs font-sans">
            <div className="flex items-center justify-between text-text-secondary">
              <span>Cash Flow Risk</span>
              <span className="font-sans text-xs font-semibold text-text-primary inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                Low
              </span>
            </div>
            <div className="flex items-center justify-between text-text-secondary">
              <span>Market Demand Risk</span>
              <span className="font-sans text-xs font-semibold text-text-primary inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                Low
              </span>
            </div>
            <div className="flex items-center justify-between text-text-secondary">
              <span>Inventory Risk</span>
              <span className="font-sans text-xs font-semibold text-text-primary inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-amber-500" />
                Medium
              </span>
            </div>
            <div className="flex items-center justify-between text-text-secondary">
              <span>Operational Risk</span>
              <span className="font-sans text-xs font-semibold text-text-primary inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                Low
              </span>
            </div>
            <div className="flex items-center justify-between text-text-secondary">
              <span>Profitability Risk</span>
              <span className="font-sans text-xs font-semibold text-text-primary inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                Low
              </span>
            </div>
          </div>

          <button
            type="button"
            className="text-xs font-semibold text-tertiary hover:underline block pt-1 cursor-pointer"
          >
            View detailed risk analysis →
          </button>
        </Card>

        <Card className="p-4 border-border-strong bg-surface space-y-3">
          <div className="flex items-center gap-2 border-b border-border/60 pb-2">
            <Sparkles className="size-4 text-tertiary" />
            <h3 className="font-display text-xs font-bold text-text-primary">
              AI Insights
            </h3>
          </div>

          <ul className="space-y-2 text-xs text-text-secondary leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-tertiary font-bold">•</span>
              <span>
                Profit improvement is driven by higher average selling price.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-tertiary font-bold">•</span>
              <span>
                Cash runway improves by 0.9 months, strengthening financial
                stability.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-tertiary font-bold">•</span>
              <span>
                Inventory risk slightly increases. Monitor stock turnover to
                avoid overstock.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-tertiary font-bold">•</span>
              <span>
                Demand is expected to remain stable with minimal impact.
              </span>
            </li>
          </ul>
        </Card>

        <Card className="p-4 border-border-strong bg-surface space-y-3">
          <div className="flex items-center gap-2 border-b border-border/60 pb-2">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <h3 className="font-display text-xs font-bold text-text-primary">
              Recommendations
            </h3>
          </div>

          <ul className="space-y-2 text-xs text-text-secondary leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                Implement the price increase gradually to monitor customer
                response.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                Consider bundling or promotions to maintain demand elasticity.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                Reinvest additional profit into high-margin products or
                marketing for growth.
              </span>
            </li>
          </ul>
        </Card>
      </div>

      <Card className="p-4 border-border-strong bg-surface flex items-center justify-between gap-4">
        <div className="space-y-0.5 min-w-0">
          <h4 className="font-display text-sm font-bold text-text-primary">
            AI Confidence
          </h4>
          <p className="text-xs text-text-secondary">
            High confidence based on historical data and market trends.
          </p>
        </div>

        <div className="relative size-12 flex items-center justify-center font-mono font-bold text-sm text-text-primary shrink-0">
          <svg className="size-12 -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-border"
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
          <span className="text-xs ml-1">{confidence}%</span>
        </div>
      </Card>

      <ExportModal open={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
}
