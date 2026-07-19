'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from './use-reduced-motion';

export interface FadeInViewProps {
  children: React.ReactNode;
  /** Vertical offset in pixels. Defaults to 24. */
  offset?: number;
  /** Animation duration (seconds). Defaults to 0.5. */
  duration?: number;
  className?: string;
}

/**
 * A wrapper that animates children when they first enter the viewport.
 * Fades in + translates up. When reduced motion is preferred, renders instantly.
 */
export function FadeInView({
  children,
  offset = 24,
  duration = 0.5,
  className,
}: FadeInViewProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration,
        ease: [0, 0, 0.2, 1], // ease-out
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
