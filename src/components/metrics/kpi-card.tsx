'use client';

import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Surface } from '@/components/ui/surface';
import { Badge } from '@/components/ui/badge';
import { CountUp } from '@/components/motion';
import { FinancialValue } from '@/components/ui/domain-values';
import { MetricTooltip } from './metric-tooltip';
import { Skeleton } from '@/components/ui/skeleton';

export interface KpiCardProps {
  /** Metric label (e.g. "Monthly Revenue") */
  label: string;
  /** Display value (e.g. "฿1,250,000" or 1250000) */
  value: string | number;
  /** Unit suffix (e.g. "THB", "%") */
  unit?: string;
  /** Raw numeric value for CountUp animation on first reveal */
  numericValue?: number;
  /** Formatter for the CountUp animated value (e.g. currency formatting) */
  formatter?: (value: number) => string;
  /** Number of decimal places for CountUp (defaults to 0) */
  decimals?: number;
  /** Percentage change from comparison period */
  change?: number;
  /** Comparison period label (e.g. "vs last month") */
  changePeriod?: string;
  /** Status indicator */
  status?: 'healthy' | 'warning' | 'danger';
  /** Explanation text shown in tooltip on hover */
  tooltip?: string;
  /** Mini trend data for sparkline indicator */
  trend?: number[];
  /** Optional icon displayed next to label */
  icon?: React.ReactNode;
  /** Shows skeleton loading state */
  loading?: boolean;
  className?: string;
}

const statusVariant = {
  healthy: 'success',
  warning: 'warning',
  danger: 'danger',
} as const;

const statusLabel = {
  healthy: 'Healthy',
  warning: 'Warning',
  danger: 'At Risk',
} as const;

function MiniSparkline({ data, className }: { data: number[]; className?: string }) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const height = 24;
  const width = 48;
  const step = width / (data.length - 1);

  const points = data
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn('w-12 h-6 shrink-0', className)}
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-brand"
      />
    </svg>
  );
}

/**
 * KPI card component for displaying a single metric with optional
 * change indicator, status badge, sparkline, and tooltip.
 * Uses FinancialValue from ui/domain-values for currency metrics.
 */
export function KpiCard({
  label,
  value,
  unit,
  numericValue,
  formatter,
  decimals = 0,
  change,
  changePeriod,
  status,
  tooltip,
  trend,
  icon,
  loading = false,
  className,
}: KpiCardProps) {
  const changeColor =
    change === undefined || change === 0
      ? 'text-text-muted'
      : change > 0
        ? 'text-success'
        : 'text-danger';

  const ChangeIcon =
    change === undefined || change === 0 ? Minus : change > 0 ? TrendingUp : TrendingDown;

  const isNonCurrency = unit === 'months' || unit === '%';

  const content = (
    <Surface
      border
      className={cn('flex flex-col gap-2 p-4 h-full', className)}
      role="group"
      aria-label={label}
    >
      {/* Header: label + status */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {icon && (
            <span className="shrink-0 text-text-muted [&>svg]:size-4" aria-hidden="true">
              {icon}
            </span>
          )}
          {loading ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            <span className="text-[13px]/[18px] font-medium text-text-muted truncate">
              {label}
            </span>
          )}
        </div>
        {status && !loading && (
          <Badge variant={statusVariant[status]} dot>
            {statusLabel[status]}
          </Badge>
        )}
      </div>

      {/* Value row */}
      <div className="flex items-end justify-between gap-3">
        <div className="flex items-baseline gap-1.5 min-w-0">
          {loading ? (
            <Skeleton className="h-9 w-28" />
          ) : (
            <>
              {isNonCurrency ? (
                <>
                  {numericValue !== undefined ? (
                    <CountUp
                      to={numericValue}
                      decimals={decimals}
                      formatter={formatter}
                      className="text-[26px]/[32px] md:text-[28px]/[34px] font-[650] tracking-tight text-text-primary tabular-nums truncate"
                    />
                  ) : (
                    <span className="text-[26px]/[32px] md:text-[28px]/[34px] font-[650] tracking-tight text-text-primary tabular-nums truncate">
                      {value}
                    </span>
                  )}
                  {unit && (
                    <span className="text-[15px]/[24px] font-normal text-text-muted">
                      {unit}
                    </span>
                  )}
                </>
              ) : (
                <FinancialValue
                  value={
                    numericValue !== undefined
                      ? numericValue
                      : typeof value === 'number'
                      ? value
                      : parseFloat(String(value).replace(/[^0-9.-]/g, '')) || 0
                  }
                  className="[&>span]:text-[26px]/[32px] md:[&>span]:text-[28px]/[34px] [&>span]:font-[650] [&>span]:tracking-tight [&>span]:text-text-primary [&>span]:tabular-nums [&>span]:truncate"
                />
              )}
            </>
          )}
        </div>
        {trend && !loading && <MiniSparkline data={trend} />}
      </div>

      {/* Change indicator */}
      {loading ? (
        <Skeleton className="h-4 w-28" />
      ) : (
        change !== undefined && (
          <div className={cn('flex items-center gap-1', changeColor)}>
            <ChangeIcon className="size-3.5" aria-hidden="true" />
            <span className="text-[13px]/[20px] font-[550] tabular-nums">
              {change > 0 ? '+' : ''}
              {change}%
            </span>
            {changePeriod && (
              <span className="text-[13px]/[20px] font-normal text-text-muted">
                {changePeriod}
              </span>
            )}
          </div>
        )
      )}
    </Surface>
  );

  if (tooltip && !loading) {
    return <MetricTooltip content={tooltip}>{content}</MetricTooltip>;
  }

  return content;
}
