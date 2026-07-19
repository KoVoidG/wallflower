'use client';

import { Clock, Info, ShieldAlert, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Surface } from '@/components/ui/surface';
import { Badge } from '@/components/ui/badge';
import type { RiskSummaryData } from '@/features/risks/adapters/risks.adapter';

interface RiskSummaryProps {
  summary: RiskSummaryData;
  t: {
    title: string;
    overallScore: string;
    scoreExplanation: string;
    totalRisks: string;
    criticalRisks: string;
    warningRisks: string;
    lastAssessment: string;
    staleBanner: string;
    incompleteBanner: string;
  };
}

const scoreColorClass = (score: number) => {
  if (score >= 70) return 'text-success border-success/40 bg-success-soft/40';
  if (score >= 40) return 'text-warning border-warning/40 bg-warning-soft/40';
  return 'text-danger border-danger/40 bg-danger-soft/40';
};

const statusBadgeVariant = (status: 'healthy' | 'warning' | 'critical') => {
  if (status === 'healthy') return 'success' as const;
  if (status === 'warning') return 'warning' as const;
  return 'danger' as const;
};

const statusIcon = (status: 'healthy' | 'warning' | 'critical') => {
  if (status === 'healthy') return <ShieldCheck className="size-4" />;
  return <ShieldAlert className="size-4" />;
};

export function RiskSummary({ summary, t }: RiskSummaryProps) {
  return (
    <Surface variant="default" border className="p-5 print:shadow-none print:border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[20px]/[28px] font-[600] text-text-primary">
          {t.title}
        </h2>
        <Badge
          variant={statusBadgeVariant(summary.overallStatus)}
          icon={statusIcon(summary.overallStatus)}
          dot={false}
        >
          {summary.overallStatus === 'healthy' ? 'Healthy' : summary.overallStatus === 'warning' ? 'Warning' : 'Critical'}
        </Badge>
      </div>

      {/* Stale / Incomplete banners */}
      {summary.isStale && (
        <div
          className="flex gap-2 p-3 mb-4 bg-warning-soft text-warning border border-warning/30 rounded-[var(--radius-md)]"
          role="alert"
        >
          <Clock className="size-5 shrink-0 mt-0.5" />
          <p className="text-[13px]/[20px]">{t.staleBanner}</p>
        </div>
      )}
      {summary.isIncomplete && (
        <div
          className="flex gap-2 p-3 mb-4 bg-info-soft text-info border border-info/30 rounded-[var(--radius-md)]"
          role="alert"
        >
          <Info className="size-5 shrink-0 mt-0.5" />
          <p className="text-[13px]/[20px]">{t.incompleteBanner}</p>
        </div>
      )}

      {/* Metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Overall Score */}
        <div className="flex flex-col items-center gap-1.5 py-3">
          <div
            className={cn(
              'flex items-center justify-center size-16 rounded-full border-2 text-[24px] font-[650] tabular-nums',
              scoreColorClass(summary.overallScore)
            )}
            aria-label={`${t.overallScore}: ${summary.overallScore}`}
          >
            {summary.overallScore}
          </div>
          <span className="text-[12px]/[18px] font-[450] text-text-muted text-center">
            {t.overallScore}
          </span>
        </div>

        {/* Total */}
        <div className="flex flex-col items-center gap-1.5 py-3">
          <span className="text-[28px]/[34px] font-[650] text-text-primary tabular-nums">
            {summary.totalCount}
          </span>
          <span className="text-[12px]/[18px] font-[450] text-text-muted">
            {t.totalRisks}
          </span>
        </div>

        {/* Critical */}
        <div className="flex flex-col items-center gap-1.5 py-3">
          <span className="text-[28px]/[34px] font-[650] text-danger tabular-nums">
            {summary.criticalCount}
          </span>
          <span className="text-[12px]/[18px] font-[450] text-text-muted">
            {t.criticalRisks}
          </span>
        </div>

        {/* Warning */}
        <div className="flex flex-col items-center gap-1.5 py-3">
          <span className="text-[28px]/[34px] font-[650] text-warning tabular-nums">
            {summary.warningCount}
          </span>
          <span className="text-[12px]/[18px] font-[450] text-text-muted">
            {t.warningRisks}
          </span>
        </div>
      </div>

      {/* Score explanation */}
      <p className="text-[12px]/[18px] text-text-muted mt-3 max-w-lg">
        {t.scoreExplanation}
      </p>

      {/* Last Assessment */}
      <div className="flex items-center gap-1.5 mt-3 text-[12px]/[18px] text-text-muted">
        <Clock className="size-3.5" aria-hidden="true" />
        <span>{t.lastAssessment}: {summary.lastAssessmentDate}</span>
      </div>
    </Surface>
  );
}
