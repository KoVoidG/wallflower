// src/features/dashboard/components/risk-summary.tsx
'use client';

import { AlertTriangle, ArrowRight, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { H3, Caption } from '@/components/ui/typography';
import { Link } from '@/lib/i18n/navigation';
import type { InsightData } from '../adapters/dashboard.adapter';

interface RiskSummaryProps {
  risks: InsightData[];
  className?: string;
}

export function RiskSummary({ risks, className }: RiskSummaryProps) {
  if (risks.length === 0) {
    return (
      <section
        className={cn('flex flex-col gap-3 rounded-[var(--radius-lg)] p-6 bg-surface border border-border', className)}
        aria-label="Risk summary"
      >
        <H3 className="text-[16px]/[22px]">Risks</H3>
        <div className="flex flex-col items-center justify-center py-6 gap-2 text-center">
          <span className="text-text-muted" aria-hidden="true">
            <AlertTriangle className="size-5" />
          </span>
          <Caption as="p" className="max-w-[200px]">
            No active risks detected. Keep your data current for accurate monitoring.
          </Caption>
        </div>
      </section>
    );
  }

  const primaryRisk = risks[0];
  const otherRisks = risks.slice(1);

  return (
    <section
      className={cn('flex flex-col gap-4 rounded-[var(--radius-lg)] p-6 bg-surface border border-border', className)}
      aria-label="Risk summary"
    >
      <div className="flex items-center justify-between gap-2">
        <H3 className="text-[16px]/[22px]">Active Risks</H3>
        <Badge variant="warning" dot>
          {risks.length}
        </Badge>
      </div>

      {/* Primary risk - expanded */}
      <div className="flex flex-col gap-2.5 rounded-[var(--radius-md)] bg-warning-soft/50 p-4 border border-warning/15">
        <div className="flex items-start gap-2">
          <AlertTriangle className="size-4 text-warning shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[14px]/[20px] font-[600] text-text-primary">
              {primaryRisk.title}
            </span>
            <span className="text-[13px]/[20px] text-text-secondary">
              {primaryRisk.description}
            </span>
          </div>
        </div>
        {primaryRisk.href && (
          <Link
            href={primaryRisk.href}
            className="inline-flex items-center gap-1 self-start text-[13px]/[18px] font-[550] text-brand hover:text-brand-hover transition-colors cursor-pointer"
          >
            Test mitigation
            <ArrowRight className="size-3" aria-hidden="true" />
          </Link>
        )}
      </div>

      {/* Secondary risks - compact */}
      {otherRisks.length > 0 && (
        <div className="flex flex-col gap-1.5 pt-1">
          {otherRisks.map((risk) => (
            <div
              key={risk.id}
              className="flex items-center gap-2 py-1.5 text-[13px]/[18px] text-text-secondary"
            >
              <TrendingDown className="size-3 shrink-0 text-text-muted" aria-hidden="true" />
              <span className="truncate">{risk.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* View all link */}
      <Link
        href="/risks"
        className="inline-flex items-center gap-1 self-start text-[13px]/[18px] font-[550] text-brand hover:text-brand-hover transition-colors pt-1 cursor-pointer"
      >
        View all risks
        <ArrowRight className="size-3" aria-hidden="true" />
      </Link>
    </section>
  );
}
