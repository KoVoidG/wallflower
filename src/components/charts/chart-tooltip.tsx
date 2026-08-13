'use client';

// src/components/charts/chart-tooltip.tsx
import { cn } from '@/lib/utils';
import { formatThbTooltip } from './chart-config';

export interface TooltipEntry {
  name: string;
  value: number;
  color: string;
  dashed?: boolean;
}

interface ChartTooltipProps {
  active?: boolean;
  label?: string;
  entries?: TooltipEntry[];
  formatValue?: (value: number) => string;
  className?: string;
}

/**
 * Custom chart tooltip styled with design tokens.
 * Shows metric name, color indicator, and formatted value.
 */
export function ChartTooltip({
  active,
  label,
  entries,
  formatValue = formatThbTooltip,
  className,
}: ChartTooltipProps) {
  if (!active || !entries?.length) return null;

  return (
    <div
      className={cn(
        'rounded-[var(--radius-md)] border border-border/80 bg-surface/95 dark:bg-surface/90 backdrop-blur-md px-3.5 py-2.5 shadow-md',
        className
      )}
    >
      {label && (
        <p className="mb-1.5 text-[12px]/[16px] font-[550] text-text-muted">
          {label}
        </p>
      )}
      <ul className="flex flex-col gap-1">
        {entries.map((entry) => (
          <li key={entry.name} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span
                className={cn(
                  'inline-block h-0.5 w-3 rounded-full',
                  entry.dashed && 'border-t border-dashed border-current bg-transparent'
                )}
                style={{
                  backgroundColor: entry.dashed ? 'transparent' : entry.color,
                  borderColor: entry.dashed ? entry.color : undefined,
                }}
                aria-hidden="true"
              />
              <span className="text-[13px]/[18px] text-text-secondary">
                {entry.name}
              </span>
            </span>
            <span className="text-[13px]/[18px] font-[550] tabular-nums text-text-primary">
              {formatValue(entry.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
