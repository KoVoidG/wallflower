// src/components/ui/domain-values.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import type { DataQuality, DataConfidence } from '@/types/domain';

interface FinancialValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number | null | undefined;
  currency?: string;
  quality?: DataQuality;
  showChip?: boolean;
  compact?: boolean;
  className?: string;
}

export function FinancialValue({
  value,
  currency = '฿',
  quality,
  showChip = false,
  compact = false,
  className,
  ...props
}: FinancialValueProps) {
  if (value === null || value === undefined) {
    return <span className="text-text-muted italic">—</span>;
  }

  const formatted = compact
    ? Math.abs(value) >= 1_000_000
      ? `${currency}${(value / 1_000_000).toFixed(1)}M`
      : Math.abs(value) >= 1_000
      ? `${currency}${(value / 1_000).toFixed(0)}K`
      : `${currency}${value.toLocaleString()}`
    : `${currency}${Math.round(value).toLocaleString()}`;

  return (
    <span className={cn('inline-flex items-baseline gap-1.5 tabular-nums', className)} {...props}>
      <span className="font-semibold text-text-primary">{formatted}</span>
      {showChip && quality && <QualityBadge quality={quality} className="text-[10px] py-0 px-1.5" />}
    </span>
  );
}

interface PercentageValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number | null | undefined;
  showSign?: boolean;
  decimals?: number;
  className?: string;
}

export function PercentageValue({
  value,
  showSign = false,
  decimals = 1,
  className,
  ...props
}: PercentageValueProps) {
  if (value === null || value === undefined) {
    return <span className="text-text-muted italic">—</span>;
  }

  const sign = showSign && value > 0 ? '+' : '';
  const color = value > 0 ? 'text-success' : value < 0 ? 'text-danger' : 'text-text-primary';

  return (
    <span className={cn('tabular-nums font-semibold', color, className)} {...props}>
      {sign}
      {value.toFixed(decimals)}%
    </span>
  );
}

export function QualityBadge({
  quality,
  className,
}: {
  quality: DataQuality;
  className?: string;
}) {
  const qualityMap: Record<DataQuality, { variant: BadgeVariant; label: string }> = {
    actual: { variant: 'actual', label: 'Actual' },
    estimated: { variant: 'estimated', label: 'Estimated' },
    imported: { variant: 'imported', label: 'Imported' },
    sample: { variant: 'sample', label: 'Sample' },
    missing: { variant: 'missing', label: 'Missing' },
  };

  const conf = qualityMap[quality] || qualityMap.actual;
  return <Badge variant={conf.variant} className={className}>{conf.label}</Badge>;
}

export function FreshnessIndicator({
  lastUpdated,
  staleDays,
  hasWarning = false,
  className,
}: {
  lastUpdated: string;
  staleDays: number;
  hasWarning?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-1.5 text-xs text-text-muted', className)}>
      {hasWarning ? (
        <AlertTriangle className="size-3.5 text-warning shrink-0" aria-hidden="true" />
      ) : (
        <Clock className="size-3.5 text-text-muted shrink-0" aria-hidden="true" />
      )}
      <span>Data through {lastUpdated}</span>
      {staleDays > 30 && (
        <span className="text-warning font-medium">({staleDays}d ago)</span>
      )}
    </div>
  );
}

export function CompletenessIndicator({
  score,
  confidence,
  className,
}: {
  score: number;
  confidence?: DataConfidence;
  className?: string;
}) {
  const badgeVariant: BadgeVariant = score >= 80 ? 'success' : score >= 50 ? 'warning' : 'danger';

  return (
    <div className={cn('flex items-center gap-2 text-xs', className)}>
      <ShieldCheck className="size-3.5 text-text-muted shrink-0" aria-hidden="true" />
      <span className="text-text-muted">Completeness:</span>
      <span className="font-semibold tabular-nums text-text-primary">{score}%</span>
      <Badge variant={badgeVariant} dot className="text-[11px] py-0 px-1.5">
        {confidence ? `${confidence.toUpperCase()} CONFIDENCE` : score >= 80 ? 'HIGH' : score >= 50 ? 'MEDIUM' : 'LOW'}
      </Badge>
    </div>
  );
}

export function SourceLabel({
  source,
  className,
}: {
  source: string;
  className?: string;
}) {
  return (
    <span className={cn('inline-block text-[11px] font-medium text-text-muted bg-surface-subtle border border-border/60 rounded px-1.5 py-0.5', className)}>
      Source: {source}
    </span>
  );
}
