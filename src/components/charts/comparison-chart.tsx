'use client';

// src/components/charts/comparison-chart.tsx
import {
  LineChart,
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

interface ComparisonChartProps {
  /** Array of data points (each must include xKey, baselineKey, and scenarioKeys) */
  data: Record<string, unknown>[];
  /** Key for x-axis values */
  xKey?: string;
  /** Data key for the baseline series */
  baselineKey: string;
  /** Data keys for scenario series */
  scenarioKeys: string[];
  /** Display labels for each key */
  labels: Record<string, string>;
  /** Chart height in pixels */
  height?: number;
  /** Y-axis value formatter */
  formatY?: (value: number) => string;
  /** Accessible label for the chart */
  ariaLabel?: string;
  /** Additional class names */
  className?: string;
}

/**
 * Comparison chart for before/after scenario analysis.
 * Baseline is always rendered as a dashed slate line.
 * Scenarios use the ordered chart palette.
 * Legend is rendered at top above the plot area.
 */
export function ComparisonChart({
  data,
  xKey = 'month',
  baselineKey,
  scenarioKeys,
  labels,
  height = 300,
  formatY = formatThbAxis,
  ariaLabel = 'Scenario comparison chart',
  className,
}: ComparisonChartProps) {
  const prefersReduced = useReducedMotion();
  const { palette, semantic } = useChartColors();

  const baselineColor = semantic('baseline');

  const legendItems: LegendItem[] = [
    {
      label: labels[baselineKey] ?? 'Baseline',
      color: baselineColor,
      dashed: true,
    },
    ...scenarioKeys.map((key, i) => ({
      label: labels[key] ?? key,
      color: palette[i % palette.length],
      dashed: false,
    })),
  ];

  return (
    <div
      className={cn('w-full flex flex-col', className)}
      role="img"
      aria-label={ariaLabel}
    >
      {/* Legend placed ABOVE plot area */}
      <ChartLegend items={legendItems} className="mb-3 px-1" />

      <div className="w-full flex-1">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={CHART_MARGINS}>
            <title>{ariaLabel}</title>
            <desc>
              {`Comparison chart showing baseline (${labels[baselineKey] ?? baselineKey}) against ${scenarioKeys.length} scenario(s): ${scenarioKeys.map((k) => labels[k] ?? k).join(', ')}`}
            </desc>

            <CartesianGrid
              strokeDasharray={GRID_STYLES.strokeDasharray}
              strokeOpacity={GRID_STYLES.strokeOpacity}
              vertical={false}
            />

            <XAxis
              dataKey={xKey}
              fontSize={AXIS_STYLES.fontSize}
              tickLine={AXIS_STYLES.tickLine}
              axisLine={AXIS_STYLES.axisLine}
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
                  const isBaseline = p.dataKey === baselineKey;
                  return {
                    name: labels[String(p.dataKey)] ?? String(p.dataKey),
                    value: p.value as number,
                    color: String(p.color),
                    dashed: isBaseline,
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

            {/* Baseline — always dashed slate */}
            <Line
              type="monotone"
              dataKey={baselineKey}
              stroke={baselineColor}
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2 }}
              isAnimationActive={!prefersReduced}
              animationDuration={350}
            />

            {/* Scenario series */}
            {scenarioKeys.map((key, i) => {
              const color = palette[i % palette.length];
              return (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2 }}
                  isAnimationActive={!prefersReduced}
                  animationDuration={350}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
