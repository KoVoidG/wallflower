'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from './use-reduced-motion';
import { DURATIONS, EASINGS } from './motion-config';

export interface SlideUpProps {
  children: React.ReactNode;
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Vertical offset in pixels. Defaults to 12. */
  offset?: number;
  className?: string;
}

/**
 * Slides children up from a small offset with a fade.
 * Uses card/panel transition timing (180–240ms).
 * When reduced motion is preferred, renders instantly.
 */
export function SlideUp({
  children,
  delay = 0,
  offset = 12,
  className,
}: SlideUpProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: offset }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: DURATIONS.cardPanel,
        delay,
        ease: EASINGS.default,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
