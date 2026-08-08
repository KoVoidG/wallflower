// src/components/charts/chart-config.ts

/**
 * Chart color palette — ordered series for light and dark modes.
 * Semantic mapping assigns meaning to specific colors.
 */

export const CHART_PALETTE_LIGHT = [
  '#4C23FC', // Electric Indigo (Primary Scenario / Brand)
  '#0040FC', // Royal Cobalt (Alternative / Cash Flow)
  '#059669', // Emerald Green (Net Profit / Gain)
  '#D97706', // Amber (Expenses / Cost)
  '#8B5CF6', // Violet (AI Projected Baseline)
  '#64748B', // Slate (Reference / Inactive)
] as const;

export const CHART_PALETTE_DARK = [
  '#818CF8', // Luminous Indigo
  '#38BDF8', // Electric Cyan-Cobalt
  '#34D399', // Neon Emerald
  '#FBBF24', // Radiant Amber
  '#C084FC', // Glow Violet
  '#94A3B8', // Slate
] as const;

/**
 * Semantic color mapping for business metrics.
 * Each metric has a fixed position in the palette.
 */
export const SEMANTIC_COLORS = {
  revenue: { light: '#4C23FC', dark: '#818CF8' },
  expenses: { light: '#D97706', dark: '#FBBF24' },
  profit: { light: '#059669', dark: '#34D399' },
  cashFlow: { light: '#0040FC', dark: '#38BDF8' },
  baseline: { light: '#64748B', dark: '#94A3B8' },
  expected: { light: '#4C23FC', dark: '#818CF8' },
  bestCase: { light: '#059669', dark: '#34D399' },
  worstCase: { light: '#DC2626', dark: '#F87171' },
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
