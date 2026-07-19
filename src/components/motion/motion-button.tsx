'use client';

import { motion } from 'motion/react';
import { useReducedMotion } from './use-reduced-motion';

export interface MotionButtonProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps any button with subtle scale micro-interactions.
 * whileHover: scale 1.02, whileTap: scale 0.98.
 * When reduced motion is preferred, renders children without animation.
 */
export function MotionButton({ children, className }: MotionButtonProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
