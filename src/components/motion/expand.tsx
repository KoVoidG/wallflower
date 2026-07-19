'use client';

import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from './use-reduced-motion';
import { DURATIONS, EASINGS } from './motion-config';

export interface ExpandProps {
  children: React.ReactNode;
  /** Whether the content is expanded. */
  open: boolean;
  className?: string;
}

/**
 * Animates height from 0 to auto for expandable sections (e.g. risk details).
 * Uses card/panel transition timing (180–240ms).
 * When reduced motion is preferred, expands/collapses instantly.
 */
export function Expand({ children, open, className }: ExpandProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return open ? <div className={className}>{children}</div> : null;
  }

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            height: { duration: DURATIONS.cardPanel, ease: EASINGS.default },
            opacity: { duration: DURATIONS.cardPanel * 0.8, ease: EASINGS.default },
          }}
          className={cn('overflow-hidden', className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
