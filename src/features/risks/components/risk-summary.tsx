'use client';

import { Clock, Info, ShieldAlert, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { H2, Caption } from '@/components/ui/typography';
import type { RiskSummaryData } from '@/features/risks/adapters/risks.adapter';

interface RiskSummaryProps {
  summary: RiskSummaryData;
  estimatedExposure?: number;
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

const statusBadgeVariant = (status: 'healthy' | 'warning' | 'critical') => {
  if (status === 'healthy') return 'success' as const;
  if (status === 'warning') return 'warning' as const;
  return 'danger' as const;
};

const statusLabel = (status: 'healthy' | 'warning' | 'critical') => {
  if (status === 'healthy') return 'Low risk';
  if (status === 'warning') return 'Elevated';
  return 'Critical';
};

export function RiskSummary({ summary, estimatedExposure, t }: RiskSummaryProps) {
  const activeCount = summary.criticalCount + summary.warningCount;
  const hasUrgent = summary.criticalCount > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Stale / Incomplete banners */}
      {summary.isStale && (
        <div
          className="flex gap-2 p-3 bg-warning-soft text-warning border border-warning/30 rounded-[var(--radius-md)]"
          role="alert"
        >
          <Clock className="size-4 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-[13px]/[20px]">{t.staleBanner}</p>
        </div>
      )}
      {summary.isIncomplete && (
        <div
          className="flex gap-2 p-3 bg-info-soft text-info border border-info/30 rounded-[var(--radius-md)]"
          role="alert"
        >
          <Info className="size-4 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-[13px]/[20px]">{t.incompleteBanner}</p>
        </div>
      )}

      {/* Risk position section */}
      <section
        className={cn(
          'rounded-[var(--radius-lg)] p-6 md:p-8 border',
          hasUrgent ? 'bg-danger-soft/30 border-danger/15' : summary.overallStatus === 'warning' ? 'bg-warning-soft/30 border-warning/15' : 'bg-success-soft/30 border-success/15'
        )}
        aria-label="Overall risk position"
      >
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className={cn('shrink-0', hasUrgent ? 'text-danger' : summary.overallStatus === 'warning' ? 'text-warning' : 'text-success')}>
                {hasUrgent ? <ShieldAlert className="size-5" /> : <ShieldCheck className="size-5" />}
              </span>
              <H2 className="text-[22px]/[28px] md:text-[24px]/[32px]">
                {hasUrgent ? `${summary.criticalCount} critical risk${summary.criticalCount > 1 ? 's' : ''} require action` : activeCount > 0 ? `${activeCount} risks being monitored` : 'No active risks detected'}
              </H2>
            </div>
            <Badge variant={statusBadgeVariant(summary.overallStatus)} dot>
              {statusLabel(summary.overallStatus)}
            </Badge>
          </div>

          {/* Position statement */}
          <p className="text-[15px]/[26px] text-text-primary max-w-[700px]">
            {generatePositionStatement(summary, estimatedExposure)}
          </p>

          {/* Key metrics row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/40">
            <div className="flex flex-col gap-0.5">
              <Caption>Estimated exposure</Caption>
              <span className="text-[20px]/[26px] font-[650] tabular-nums text-text-primary">
                {estimatedExposure ? `฿${estimatedExposure.toLocaleString()}` : '—'}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <Caption>Critical</Caption>
              <span className={cn('text-[20px]/[26px] font-[650] tabular-nums', summary.criticalCount > 0 ? 'text-danger' : 'text-text-primary')}>
                {summary.criticalCount}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <Caption>Warning</Caption>
              <span className={cn('text-[20px]/[26px] font-[650] tabular-nums', summary.warningCount > 0 ? 'text-warning' : 'text-text-primary')}>
                {summary.warningCount}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <Caption>Resolved</Caption>
              <span className="text-[20px]/[26px] font-[650] tabular-nums text-success">
                {summary.totalCount - activeCount}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-[12px] text-text-muted">
              <Clock className="size-3.5" aria-hidden="true" />
              <span>Last assessment: {summary.lastAssessmentDate}</span>
            </div>
            <Caption className="text-text-muted">
              Risk score: {summary.overallScore}/100
            </Caption>
          </div>
        </div>
      </section>
    </div>
  );
}

function generatePositionStatement(summary: RiskSummaryData, exposure?: number): string {
  if (summary.criticalCount === 0 && summary.warningCount === 0) {
    return 'No active risks crossed the current alert thresholds. Continue monitoring and keep business data up to date.';
  }

  const parts: string[] = [];

  if (summary.criticalCount > 0) {
    parts.push(`${summary.criticalCount} critical risk${summary.criticalCount > 1 ? 's' : ''} require immediate attention`);
  }
  if (summary.warningCount > 0) {
    parts.push(`${summary.warningCount} warning${summary.warningCount > 1 ? 's' : ''} are being monitored`);
  }

  let statement = parts.join(' and ') + '.';

  if (exposure) {
    statement += ` Estimated total exposure is ฿${exposure.toLocaleString()}.`;
  }

  return statement;
}
