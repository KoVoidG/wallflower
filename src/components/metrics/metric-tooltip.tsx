'use client';

import { useState, useRef, useId } from 'react';
import { cn } from '@/lib/utils';

interface MetricTooltipProps {
  content: string;
  children: React.ReactElement<{ 'aria-describedby'?: string; onMouseEnter?: () => void; onMouseLeave?: () => void; onFocus?: () => void; onBlur?: () => void }>;
  className?: string;
}

/**
 * Reusable tooltip for metric explanations.
 * Shows on hover/focus with accessible aria-describedby pattern.
 */
export function MetricTooltip({ content, children, className }: MetricTooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  function show() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(true);
  }

  function hide() {
    timeoutRef.current = setTimeout(() => setVisible(false), 100);
  }

  return (
    <div className={cn('relative w-full h-full', className)}>
      <div
        className="w-full h-full"
        aria-describedby={visible ? tooltipId : undefined}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </div>
      <div
        id={tooltipId}
        role="tooltip"
        className={cn(
          'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50',
          'rounded-[var(--radius-sm)] bg-surface-raised px-3 py-2 shadow-md',
          'text-[13px]/[18px] font-normal text-text-secondary',
          'max-w-[240px] w-max',
          'pointer-events-none',
          'transition-opacity duration-[160ms] ease-out',
          visible ? 'opacity-100' : 'opacity-0 invisible',
          className
        )}
      >
        {content}
        {/* Arrow */}
        <span
          className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-surface-raised"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
