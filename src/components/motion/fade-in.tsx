'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from './use-reduced-motion';
import { DURATIONS, EASINGS } from './motion-config';

export interface FadeInProps {
  children: React.ReactNode;
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Animation duration (seconds). Defaults to page reveal timing. */
  duration?: number;
  className?: string;
}

/**
 * Fades children in with opacity 0→1 using page content reveal timing.
 * When reduced motion is preferred, renders instantly with no animation.
 */
export function FadeIn({
  children,
  delay = 0,
  duration = DURATIONS.pageReveal,
  className,
}: FadeInProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration,
        delay,
        ease: EASINGS.default,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
