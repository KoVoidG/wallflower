'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import type { DataQuality, DataConfidence } from '@/types/domain';

/**
 * Smooth count-up animation hook for numeric values.
 * Animates from 0 (or initial) to target value over specified duration (default: 1400ms).
 */
export function useCountUp(target: number, duration: number = 1200): number {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;
    const startValue = 0;
    const diff = target - startValue;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Smooth easeOutCubic curve
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(startValue + diff * easeProgress);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [target, duration]);

  return displayValue;
}

interface FinancialValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number | null | undefined;
  currency?: string;
  quality?: DataQuality;
  showChip?: boolean;
  compact?: boolean;
  animate?: boolean;
  className?: string;
}

export function FinancialValue({
  value,
  currency = '฿',
  quality,
  showChip = false,
  compact = false,
  animate = true,
  className,
  ...props
}: FinancialValueProps) {
  const animatedValue = useCountUp(value ?? 0, 1200);

  if (value === null || value === undefined) {
    return <span className="text-text-muted italic">—</span>;
  }

  const currentVal = animate ? animatedValue : value;

  const formatted = compact
    ? Math.abs(currentVal) >= 1_000_000
      ? `${currency}${(currentVal / 1_000_000).toFixed(1)}M`
      : Math.abs(currentVal) >= 1_000
      ? `${currency}${(currentVal / 1_000).toFixed(0)}K`
      : `${currency}${Math.round(currentVal).toLocaleString()}`
    : `${currency}${Math.round(currentVal).toLocaleString()}`;

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
