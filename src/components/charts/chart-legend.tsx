'use client';

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
 * Custom accessible chart legend rendered ABOVE the plot area.
 * Uses line samples + shapes + text labels for full accessibility (does not rely on color alone).
 * Wraps gracefully across 1-2 rows on mobile viewports.
 */
export function ChartLegend({ items, className }: ChartLegendProps) {
  if (!items.length) return null;

  return (
    <ul
      className={cn(
        'flex flex-wrap items-center gap-x-4 gap-y-2 mb-3 px-1 text-xs sm:text-sm select-none',
        className
      )}
      role="list"
      aria-label="Chart legend"
    >
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          {/* Accessible Line Sample Indicator */}
          <span
            className="flex items-center justify-center shrink-0 w-5 h-2"
            aria-hidden="true"
          >
            {item.dashed ? (
              <span
                className="w-full border-t-2 border-dashed"
                style={{ borderColor: item.color }}
              />
            ) : (
              <span
                className="w-full h-0.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
            )}
          </span>

          {/* Label Text */}
          <span className="font-medium text-text-primary">
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
