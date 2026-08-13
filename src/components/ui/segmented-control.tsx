// src/components/ui/segmented-control.tsx
'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface SegmentedControlProps<T extends string> {
  options: readonly T[] | T[];
  value: T;
  onChange: (val: T) => void;
  layoutId: string;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  layoutId,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        'relative flex items-center p-1 bg-[#F8FAFC] dark:bg-[#0B0F17] border border-slate-200/80 dark:border-[#1E2638] rounded-2xl shadow-xs w-full overflow-hidden',
        className
      )}
    >
      {options.map((opt) => {
        const isSelected = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              'relative flex-1 py-2 px-3 text-xs font-bold transition-colors cursor-pointer select-none text-center rounded-xl z-10',
              isSelected
                ? 'text-white font-extrabold'
                : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white font-semibold'
            )}
          >
            {isSelected && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-xl shadow-md shadow-indigo-500/25 z-[-1]"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
            <span className="relative z-10 block truncate">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}
