'use client';

import { useEffect, useRef } from 'react';
import { animate, useInView, useMotionValue, useTransform } from 'motion/react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from './use-reduced-motion';
import { DURATIONS, EASINGS } from './motion-config';

export interface CountUpProps {
  /** Target value to animate to. */
  to: number;
  /** Starting value. Defaults to 0. */
  from?: number;
  /** Animation duration (seconds). Defaults to simulation result timing. */
  duration?: number;
  /** Number of decimal places to display. Defaults to 0. */
  decimals?: number;
  /** Optional formatter for the displayed value (e.g. add commas, currency). */
  formatter?: (value: number) => string;
  className?: string;
}

function defaultFormatter(value: number, decimals: number): string {
  return value.toFixed(decimals);
}

/**
 * Animates a number from `from` to `to` on first mount when visible.
 * Uses simulation result sequence timing (400–650ms).
 * Only animates once on first reveal (not on re-renders).
 * When reduced motion is preferred, shows final value immediately.
 * Uses `useInView` from motion to trigger only when visible.
 */
export function CountUp({
  to,
  from = 0,
  duration = DURATIONS.simulationResult,
  decimals = 0,
  formatter,
  className,
}: CountUpProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(from);
  const rounded = useTransform(motionValue, (v) =>
    formatter ? formatter(v) : defaultFormatter(v, decimals)
  );
  const isInView = useInView(ref, { once: true });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current || prefersReduced) return;
    hasAnimated.current = true;

    const controls = animate(motionValue, to, {
      duration,
      ease: EASINGS.default,
    });

    return () => controls.stop();
  }, [isInView, motionValue, to, duration, prefersReduced]);

  // Subscribe to rounded motion value and update DOM directly for performance
  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => {
      if (ref.current) {
        ref.current.textContent = v;
      }
    });
    return unsubscribe;
  }, [rounded]);

  const displayValue = formatter ? formatter(prefersReduced ? to : from) : defaultFormatter(prefersReduced ? to : from, decimals);

  return (
    <span ref={ref} className={cn(className)}>
      {displayValue}
    </span>
  );
}
