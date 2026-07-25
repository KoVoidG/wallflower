import type { Transition, Variants } from 'motion/react';

/**
 * Preferred easing curve — fast start, gentle end.
 */
export const EASINGS = {
  default: [0.22, 1, 0.36, 1] as [number, number, number, number],
} as const;

/**
 * Named durations (in seconds) mapped to interaction types.
 */
export const DURATIONS = {
  hoverPress: 0.14,
  tooltip: 0.16,
  cardPanel: 0.2,
  drawerDialog: 0.26,
  pageReveal: 0.35,
  simulationResult: 1.2,
} as const;

/**
 * Restrained spring configuration for natural-feeling motion.
 */
export const SPRING: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 28,
  mass: 0.8,
} as const;

/**
 * Returns motion variants that resolve instantly when reduced motion is preferred.
 * Use as a base for any animation — passes through normal variants when motion is allowed.
 */
export function getReducedMotionVariants(
  prefersReduced: boolean,
  normalVariants: Variants
): Variants {
  if (prefersReduced) {
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 },
    };
  }
  return normalVariants;
}
