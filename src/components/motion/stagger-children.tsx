'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from './use-reduced-motion';
import { DURATIONS, EASINGS } from './motion-config';

export interface StaggerChildrenProps {
  children: React.ReactNode;
  /** Delay between each child animation (seconds). Defaults to 0.05. */
  staggerDelay?: number;
  /** When true, uses whileInView instead of animate so items stagger on scroll. */
  triggerOnView?: boolean;
  className?: string;
}

const containerVariants = {
  hidden: {},
  visible: (staggerDelay: number) => ({
    transition: {
      staggerChildren: staggerDelay,
    },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATIONS.cardPanel,
      ease: EASINGS.default,
    },
  },
};

/**
 * Staggers the entrance animation of child items.
 * Each direct child should be wrapped in `<StaggerChildren.Item>`.
 * When reduced motion is preferred, all children appear instantly.
 */
export function StaggerChildren({
  children,
  staggerDelay = 0.05,
  triggerOnView = false,
  className,
}: StaggerChildrenProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  // When triggerOnView is true, use whileInView instead of animate
  if (triggerOnView) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={staggerDelay}
        className={cn(className)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      custom={staggerDelay}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div variants={itemVariants} className={cn(className)}>
      {children}
    </motion.div>
  );
}

StaggerChildren.Item = StaggerItem;
