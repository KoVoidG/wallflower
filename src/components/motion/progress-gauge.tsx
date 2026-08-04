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
  size = 128,
  strokeWidth = 8,
  color = '#00D395',
  trackColor = 'var(--border-strong)',
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
  const percentage = Math.min(Math.max(score / maxScore, 0), 1);
  const targetOffset = circumference * (1 - percentage);

  useEffect(() => {
    if (!isInView || prefersReduced) return;

    const duration = 1200; // ms
    const startTime = performance.now();

    const animateCount = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
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
      className={cn('flex flex-col items-center justify-center text-center', className)}
      style={{ width: size }}
    >
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Animated Progress Circle */}
          {prefersReduced ? (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={targetOffset}
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
              whileInView={{ strokeDashoffset: targetOffset }}
              viewport={{ once: true, amount: 0.2, margin: '0px 0px -40px 0px' }}
              transition={{
                duration: 1.2,
                ease: [0, 0, 0.2, 1],
              }}
              strokeLinecap="round"
              fill="transparent"
            />
          )}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-3xl font-bold text-text-primary tracking-tight">
            {currentScore}
          </span>
          <span className="font-sans text-[10px] font-medium text-text-secondary">/{maxScore}</span>
        </div>
      </div>

      {label && (
        <span className="font-display text-sm font-semibold text-tertiary mt-2">
          {label}
        </span>
      )}
    </div>
  );
}
