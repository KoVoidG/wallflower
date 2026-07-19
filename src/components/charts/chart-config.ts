// src/components/charts/chart-config.ts

/**
 * Chart color palette — ordered series for light and dark modes.
 * Semantic mapping assigns meaning to specific colors.
 */

export const CHART_PALETTE_LIGHT = [
  '#0F766E', // Teal
  '#2563EB', // Blue
  '#16A34A', // Green
  '#D97706', // Amber
  '#E85D5D', // Coral
  '#64748B', // Slate
] as const;

export const CHART_PALETTE_DARK = [
  '#2DD4BF', // Teal
  '#60A5FA', // Blue
  '#4ADE80', // Green
  '#FBBF24', // Amber
  '#F87171', // Coral
  '#94A3B8', // Slate
] as const;

/**
 * Semantic color mapping for business metrics.
 * Each metric has a fixed position in the palette.
 */
export const SEMANTIC_COLORS = {
  revenue: { light: '#0F766E', dark: '#2DD4BF' },
  expenses: { light: '#D97706', dark: '#FBBF24' },
  profit: { light: '#16A34A', dark: '#4ADE80' },
  cashFlow: { light: '#2563EB', dark: '#60A5FA' },
  baseline: { light: '#64748B', dark: '#94A3B8' },
  expected: { light: '#0F766E', dark: '#2DD4BF' },
  bestCase: { light: '#16A34A', dark: '#4ADE80' },
  worstCase: { light: '#E85D5D', dark: '#F87171' },
} as const;

export type SemanticColorKey = keyof typeof SEMANTIC_COLORS;

/**
 * Default chart margins (px).
 */
export const CHART_MARGINS = {
  top: 8,
  right: 16,
  bottom: 8,
  left: 16,
} as const;

/**
 * Shared axis style tokens.
 */
export const AXIS_STYLES = {
  fontSize: 12,
  fontFamily: 'var(--font-geist-sans), sans-serif',
  tickLine: false,
  axisLine: false,
} as const;

/**
 * Grid style.
 */
export const GRID_STYLES = {
  strokeDasharray: '3 3',
  strokeOpacity: 0.3,
} as const;

/**
 * Format a number as THB currency (compact for axis labels).
 */
export function formatThbAxis(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `฿${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `฿${(value / 1_000).toFixed(0)}K`;
  }
  return `฿${value}`;
}

/**
 * Format a number as THB currency for tooltips (full precision).
 */
export function formatThbTooltip(value: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number as percentage for axis labels.
 */
export function formatPercentAxis(value: number): string {
  return `${value}%`;
}

/**
 * Format a number as percentage for tooltips.
 */
export function formatPercentTooltip(value: number): string {
  return `${value.toFixed(1)}%`;
}
