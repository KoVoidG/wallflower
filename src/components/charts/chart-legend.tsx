'use client';

// src/components/charts/chart-legend.tsx
import { cn } from '@/lib/utils';

export interface LegendItem {
  label: string;
  color: string;
  dashed?: boolean;
}

interface ChartLegendProps {
  items: LegendItem[];
  className?: string;
}

/**
 * Custom accessible chart legend.
 * Shows colored line indicators with labels.
 * Uses proper text contrast and is keyboard-navigable when interactive.
 */
export function ChartLegend({ items, className }: ChartLegendProps) {
  if (!items.length) return null;

  return (
    <ul
      className={cn('flex flex-wrap items-center gap-x-4 gap-y-1.5', className)}
      role="list"
      aria-label="Chart legend"
    >
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5">
          <span
            className={cn(
              'inline-block h-0.5 w-4 rounded-full',
              item.dashed && 'border-t-2 border-dashed border-current bg-transparent'
            )}
            style={{
              backgroundColor: item.dashed ? 'transparent' : item.color,
              borderColor: item.dashed ? item.color : undefined,
            }}
            aria-hidden="true"
          />
          <span className="text-[13px]/[18px] font-[450] text-text-secondary">
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
