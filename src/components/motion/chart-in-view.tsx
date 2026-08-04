'use client';

import type { ReactNode } from 'react';
import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from './use-reduced-motion';

export interface ChartInViewProps {
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
    amount: amount ?? 0.35,
    margin: '0px 0px -100px 0px',
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
              y: 24,
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
              y: 24,
            }
      }
      transition={{
        duration: 0.5,
        delay,
        ease: [0, 0, 0.2, 1],
      }}
      className={cn('w-full h-full min-h-[260px]', className)}
    >
      {children(shouldRenderChart)}
    </motion.div>
  );
}