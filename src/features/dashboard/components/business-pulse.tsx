// src/features/dashboard/components/business-pulse.tsx
'use client';

import { HeartPulse, ArrowRight, TrendingUp, AlertTriangle, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { H2, Body, Caption } from '@/components/ui/typography';
import { Link } from '@/lib/i18n/navigation';
import type { BusinessPulseData, HealthStatus } from '../adapters/dashboard.adapter';

const statusConfig: Record<
  HealthStatus,
  {
    variant: 'success' | 'warning' | 'danger';
    label: string;
    iconClass: string;
    bgClass: string;
    borderClass: string;
    pulseLabel: string;
  }
> = {
  healthy: {
    variant: 'success',
    label: 'Healthy',
    iconClass: 'text-success',
    bgClass: 'bg-success-soft/40',
    borderClass: 'border-success/20',
    pulseLabel: 'Stable',
  },
  warning: {
    variant: 'warning',
    label: 'Watch',
    iconClass: 'text-warning',
    bgClass: 'bg-warning-soft/40',
    borderClass: 'border-warning/20',
    pulseLabel: 'Pressured',
  },
  critical: {
    variant: 'danger',
    label: 'Critical',
    iconClass: 'text-danger',
    bgClass: 'bg-danger-soft/40',
    borderClass: 'border-danger/20',
    pulseLabel: 'Critical',
  },
};

interface BusinessPulseProps {
  data: BusinessPulseData;
  mostImportantChange?: string;
  mostImportantRisk?: string;
  className?: string;
}

export function BusinessPulse({
  data,
  mostImportantChange,
  mostImportantRisk,
  className,
}: BusinessPulseProps) {
  const config = statusConfig[data.status];

  return (
    <section
      className={cn(
        'relative flex flex-col gap-4 rounded-[var(--radius-lg)] p-6 md:p-8',
        config.bgClass,
        'border',
        config.borderClass,
        className
      )}
      aria-label="Business Pulse"
    >
      {/* Status header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <span className={cn('shrink-0', config.iconClass)} aria-hidden="true">
              <HeartPulse className="size-5" />
            </span>
            <H2 className="text-[22px]/[28px] md:text-[24px]/[32px]">
              {config.pulseLabel}
            </H2>
          </div>
        </div>
        <Badge variant={config.variant} dot>
          {config.label}
        </Badge>
      </div>

      {/* Summary */}
      <Body className="text-text-primary max-w-[640px] text-[15px]/[26px]">
        {data.summary}
      </Body>

      {/* Evidence grid */}
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
        {mostImportantChange && (
          <div className="flex items-start gap-2 text-[13px]/[20px]">
            <TrendingUp className="size-3.5 mt-0.5 shrink-0 text-brand" aria-hidden="true" />
            <span className="text-text-secondary">{mostImportantChange}</span>
          </div>
        )}
        {mostImportantRisk && (
          <div className="flex items-start gap-2 text-[13px]/[20px]">
            <AlertTriangle className="size-3.5 mt-0.5 shrink-0 text-warning" aria-hidden="true" />
            <span className="text-text-secondary">{mostImportantRisk}</span>
          </div>
        )}
      </div>

      {/* Footer: data freshness + confidence */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 border-t border-border/50">
        <Caption>
          Data through{' '}
          {new Date(data.dataAsOf).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </Caption>
        <div className="flex items-center gap-1">
          <Shield className="size-3 text-text-muted" aria-hidden="true" />
          <Caption>High confidence</Caption>
        </div>
      </div>
    </section>
  );
}

interface RecommendedActionProps {
  action: string;
  rationale?: string;
  href?: string;
  className?: string;
}

export function RecommendedAction({
  action,
  rationale,
  href = '/risks',
  className,
}: RecommendedActionProps) {
  return (
    <section
      className={cn(
        'flex flex-col justify-between gap-4 rounded-[var(--radius-lg)] p-6 md:p-8',
        'bg-surface border border-border',
        className
      )}
      aria-label="Recommended next action"
    >
      <div className="flex flex-col gap-2">
        <span className="text-[12px]/[16px] font-[600] uppercase tracking-wide text-brand">
          Next Action
        </span>
        <span className="text-[16px]/[24px] font-[600] text-text-primary">
          {action}
        </span>
        {rationale && (
          <Caption as="p" className="text-text-secondary">
            {rationale}
          </Caption>
        )}
      </div>
      <Link
        href={href}
        className={cn(
          'inline-flex items-center gap-1.5 self-start',
          'rounded-[var(--radius-md)] px-4 py-2.5',
          'bg-brand text-white text-[14px]/[20px] font-[600]',
          'hover:bg-brand-hover transition-colors duration-150 cursor-pointer',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'
        )}
      >
        Review
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </Link>
    </section>
  );
}
