// src/components/ui/metric-value.tsx
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricValueProps {
  value: string | number;
  unit?: string;
  label?: string;
  change?: number;
  changeLabel?: string;
  className?: string;
  /** Format value as THB currency */
  currency?: boolean;
}

function formatThb(value: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function MetricValue({
  value,
  unit,
  label,
  change,
  changeLabel,
  className,
  currency = false,
}: MetricValueProps) {
  const displayValue = currency && typeof value === 'number' ? formatThb(value) : value;

  const changeColor =
    change === undefined || change === 0
      ? 'text-text-muted'
      : change > 0
        ? 'text-success'
        : 'text-danger';

  const ChangeIcon =
    change === undefined || change === 0
      ? Minus
      : change > 0
        ? TrendingUp
        : TrendingDown;

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <span className="text-[13px]/[18px] font-[550] text-text-muted">{label}</span>
      )}
      <div className="flex items-baseline gap-1.5">
        <span className="text-[34px]/[40px] font-[650] text-text-primary tabular-nums">
          {displayValue}
        </span>
        {unit && !currency && (
          <span className="text-[15px]/[24px] font-normal text-text-muted">{unit}</span>
        )}
      </div>
      {change !== undefined && (
        <div className={cn('flex items-center gap-1', changeColor)}>
          <ChangeIcon className="size-3.5" aria-hidden="true" />
          <span className="text-[13px]/[20px] font-[550] tabular-nums">
            {change > 0 ? '+' : ''}
            {change}%
          </span>
          {changeLabel && (
            <span className="text-[13px]/[20px] font-normal text-text-muted">
              {changeLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
