// src/components/motion/chart-in-view.tsx

'use client';

import type { ReactNode } from 'react';
import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

import { cn } from '@/lib/utils';
import { useReducedMotion } from './use-reduced-motion';

interface ChartInViewProps {
  children: (shouldRenderChart: boolean) => ReactNode;
  className?: string;
  amount?: number;
  delay?: number;
}

export function ChartInView({
  children,
  className,
  amount = 0.35,
  delay = 0,
}: ChartInViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const isInView = useInView(ref, {
    once: true,
    amount,
    margin: '0px 0px -8% 0px',
  });

  const shouldRenderChart = prefersReducedMotion || isInView;

  return (
    <motion.div
      ref={ref}
      initial={
        prefersReducedMotion
          ? false
          : {
              opacity: 0,
              y: 14,
            }
      }
      animate={
        shouldRenderChart
          ? {
              opacity: 1,
              y: 0,
            }
          : {
              opacity: 0,
              y: 14,
            }
      }
      transition={{
        duration: 0.28,
        delay,
        ease: [0, 0, 0.2, 1],
      }}
      className={cn(className)}
    >
      {children(shouldRenderChart)}
    </motion.div>
  );
}