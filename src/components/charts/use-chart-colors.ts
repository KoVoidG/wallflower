'use client';

import { useTheme } from 'next-themes';
import { CHART_PALETTE_LIGHT, CHART_PALETTE_DARK, SEMANTIC_COLORS, type SemanticColorKey } from './chart-config';

/**
 * Returns the chart color palette appropriate for the current theme.
 * Falls back to light palette during SSR / before hydration.
 */
export function useChartColors() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const palette = isDark ? CHART_PALETTE_DARK : CHART_PALETTE_LIGHT;

  function semantic(key: SemanticColorKey): string {
    return isDark ? SEMANTIC_COLORS[key].dark : SEMANTIC_COLORS[key].light;
  }

  return { palette, semantic, isDark };
}
