'use client';

// src/components/charts/line-chart.tsx
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useReducedMotion } from '@/components/motion/use-reduced-motion';
import { cn } from '@/lib/utils';
import {
  CHART_MARGINS,
  AXIS_STYLES,
  GRID_STYLES,
  formatThbAxis,
} from './chart-config';
import { useChartColors } from './use-chart-colors';
import { ChartTooltip, type TooltipEntry } from './chart-tooltip';
import { ChartLegend, type LegendItem } from './chart-legend';

export interface LineConfig {
  /** Data key in each data object */
  key: string;
  /** Display label */
  label: string;
  /** Override color (defaults to palette order) */
  color?: string;
  /** Render as dashed line (for baseline/projected) */
  dashed?: boolean;
}

interface LineChartProps {
  /** Array of data points */
  data: Record<string, unknown>[];
  /** Line series configuration */
  lines: LineConfig[];
  /** Key for x-axis values */
  xKey: string;
  /** Chart height in pixels */
  height?: number;
  /** Y-axis value formatter */
  formatY?: (value: number) => string;
  /** X-axis value formatter */
  formatX?: (value: string) => string;
  /** Show grid lines */
  showGrid?: boolean;
  /** Show legend above chart */
  showLegend?: boolean;
  /** Accessible label for the chart */
  ariaLabel?: string;
  /** Additional class names on wrapper */
  className?: string;
}

/**
 * Reusable line chart with multiple series support.
 * Accessible, responsive, dark-mode aware, reduced-motion safe.
 * Legend is placed above the plot area and wraps into 2 rows on mobile.
 */
export function LineChart({
  data,
  lines,
  xKey,
  height = 300,
  formatY = formatThbAxis,
  formatX,
  showGrid = true,
  showLegend = true,
  ariaLabel = 'Line chart',
  className,
}: LineChartProps) {
  const prefersReduced = useReducedMotion();
  const { palette } = useChartColors();

  const legendItems: LegendItem[] = lines.map((line, i) => ({
    label: line.label,
    color: line.color ?? palette[i % palette.length],
    dashed: line.dashed,
  }));

  return (
    <div
      className={cn('w-full flex flex-col', className)}
      role="img"
      aria-label={ariaLabel}
    >
      {/* Legend placed ABOVE the plot area */}
      {showLegend && <ChartLegend items={legendItems} className="mb-3 px-1" />}

      {/* Plot area */}
      <div className="w-full flex-1">
        <ResponsiveContainer width="100%" height={height}>
          <RechartsLineChart data={data} margin={CHART_MARGINS}>
            <title>{ariaLabel}</title>
            <desc>
              {`Line chart with ${lines.length} series: ${lines.map((l) => l.label).join(', ')}`}
            </desc>

            {showGrid && (
              <CartesianGrid
                strokeDasharray={GRID_STYLES.strokeDasharray}
                strokeOpacity={GRID_STYLES.strokeOpacity}
                vertical={false}
              />
            )}

            <XAxis
              dataKey={xKey}
              fontSize={AXIS_STYLES.fontSize}
              tickLine={AXIS_STYLES.tickLine}
              axisLine={AXIS_STYLES.axisLine}
              tickFormatter={formatX}
              tick={{ fill: 'var(--text-muted)' }}
            />

            <YAxis
              fontSize={AXIS_STYLES.fontSize}
              tickLine={AXIS_STYLES.tickLine}
              axisLine={AXIS_STYLES.axisLine}
              tickFormatter={formatY}
              tick={{ fill: 'var(--text-muted)' }}
              width={60}
            />

            <Tooltip
              content={({ active, label, payload }) => {
                const entries: TooltipEntry[] = (payload ?? []).map((p) => {
                  const lineConfig = lines.find((l) => l.key === p.dataKey);
                  return {
                    name: lineConfig?.label ?? String(p.dataKey),
                    value: p.value as number,
                    color: String(p.color),
                    dashed: lineConfig?.dashed,
                  };
                });
                return (
                  <ChartTooltip
                    active={active}
                    label={String(label)}
                    entries={entries}
                    formatValue={formatY}
                  />
                );
              }}
            />

            {lines.map((line, i) => {
              const color =
                line.color ?? palette[i % palette.length];
              return (
                <Line
                  key={line.key}
                  type="monotone"
                  dataKey={line.key}
                  stroke={color}
                  strokeWidth={2}
                  strokeDasharray={line.dashed ? '6 4' : undefined}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2 }}
                  isAnimationActive={!prefersReduced}
                  animationDuration={350}
                />
              );
            })}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
