// src/components/motion/progress-gauge.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from './use-reduced-motion';

export interface ProgressGaugeProps {
  score: number;
  maxScore?: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  className?: string;
}

export function ProgressGauge({
  score,
  maxScore = 100,
  label = 'Healthy',
  size = 132,
  strokeWidth = 9,
  color = '#00D395',
  trackColor,
  className,
}: ProgressGaugeProps) {
  const prefersReduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, {
    once: true,
    amount: 0.2,
    margin: '0px 0px -40px 0px',
  });
  const [currentScore, setCurrentScore] = useState(prefersReduced ? score : 0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Ensure the progress accurately reflects the score proportion (e.g. 84 / 100 = 84%)
  const percentage = Math.min(Math.max(score / maxScore, 0), 1);
  const strokeDashoffset = circumference * (1 - percentage);

  useEffect(() => {
    if (!isInView || prefersReduced) return;

    const duration = 1200; // ms
    const startTime = performance.now();

    const animateCount = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCurrentScore(Math.round(easeProgress * score));

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    const handle = requestAnimationFrame(animateCount);
    return () => cancelAnimationFrame(handle);
  }, [isInView, score, prefersReduced]);

  return (
    <div
      ref={containerRef}
      className={cn('flex flex-col items-center justify-center text-center select-none', className)}
      style={{ width: size }}
    >
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background Track Circle - Visible clean track in light and dark mode */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor || '#E2E8F0'}
            strokeWidth={strokeWidth}
            fill="transparent"
            className="dark:stroke-[#1E2638]"
          />

          {/* Animated Progress Circle - Exactly up to the score percentage (e.g. 84%) */}
          {prefersReduced ? (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          ) : (
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={isInView ? { strokeDashoffset } : { strokeDashoffset: circumference }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              strokeLinecap="round"
              fill="transparent"
            />
          )}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">
            {currentScore}
          </span>
          <span className="font-sans text-[10px] font-medium text-[#64748B] dark:text-[#94A3B8]">/{maxScore}</span>
        </div>
      </div>

      {label && (
        <span className="font-sans text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2">
          {label}
        </span>
      )}
    </div>
  );
}
