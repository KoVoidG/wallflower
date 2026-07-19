// src/components/charts/index.ts
export { LineChart } from './line-chart';
export type { LineConfig } from './line-chart';

export { ComparisonChart } from './comparison-chart';

export { ChartLegend } from './chart-legend';
export type { LegendItem } from './chart-legend';

export { ChartTooltip } from './chart-tooltip';
export type { TooltipEntry } from './chart-tooltip';

export {
  CHART_PALETTE_LIGHT,
  CHART_PALETTE_DARK,
  SEMANTIC_COLORS,
  CHART_MARGINS,
  AXIS_STYLES,
  GRID_STYLES,
  formatThbAxis,
  formatThbTooltip,
  formatPercentAxis,
  formatPercentTooltip,
} from './chart-config';
export type { SemanticColorKey } from './chart-config';

export { useChartColors } from './use-chart-colors';
