// src/components/ui/tooltip.tsx
'use client';

import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InfoTooltipProps {
  text?: string;
  content?: string;
  className?: string;
  iconClassName?: string;
  side?: 'top' | 'bottom';
}

export function InfoTooltip({
  text,
  content,
  className,
  iconClassName,
  side = 'bottom',
}: InfoTooltipProps) {
  const tooltipText = text || content || '';

  return (
    <div className={cn('relative group/tooltip inline-flex items-center', className)}>
      <Info
        className={cn(
          'size-3.5 text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white transition-colors cursor-pointer',
          iconClassName
        )}
      />
      <div
        className={cn(
          'absolute hidden group-hover/tooltip:block z-50 w-56 p-2.5 rounded-xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-[#263042] shadow-xl text-[11px] font-sans text-[#475569] dark:text-slate-200 leading-snug pointer-events-none animate-in fade-in duration-150 text-left',
          side === 'bottom'
            ? 'top-full left-1/2 -translate-x-1/2 mt-2'
            : 'bottom-full left-1/2 -translate-x-1/2 mb-2'
        )}
      >
        {tooltipText}
        <div
          className={cn(
            'absolute left-1/2 -translate-x-1/2 border-4 border-transparent',
            side === 'bottom'
              ? 'bottom-full border-b-white dark:border-b-[#111622]'
              : 'top-full border-t-white dark:border-t-[#111622]'
          )}
        />
      </div>
    </div>
  );
}

export { InfoTooltip as Tooltip };
