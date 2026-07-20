'use client';

import { useState, useRef, useEffect, useCallback, useId } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/components/motion/use-reduced-motion';
import { DURATIONS, EASINGS } from '@/components/motion/motion-config';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export interface MonthPickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function MonthPicker({
  value,
  onChange,
  label,
  error,
  disabled = false,
  className,
}: MonthPickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const generatedId = useId();
  const pickerId = generatedId;

  // viewYear tracks the currently displayed year in the picker
  const [viewYear, setViewYear] = useState(() => (value ? value.getFullYear() : new Date().getFullYear()));

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const toggle = useCallback(() => {
    if (disabled) return;
    setOpen((prev) => {
      if (!prev) {
        // When opening, sync viewYear to the current value
        setViewYear(value ? value.getFullYear() : new Date().getFullYear());
      }
      return !prev;
    });
  }, [disabled, value]);

  const selectMonth = useCallback(
    (monthIndex: number) => {
      onChange(new Date(viewYear, monthIndex, 1));
      setOpen(false);
    },
    [viewYear, onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  };

  const formatValue = () => {
    if (!value || isNaN(value.getTime())) return null;
    return `${MONTHS[value.getMonth()]} ${value.getFullYear()}`;
  };

  const isSelected = (monthIndex: number) => {
    if (!value) return false;
    return value.getFullYear() === viewYear && value.getMonth() === monthIndex;
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {label && (
        <label
          htmlFor={pickerId}
          className="block text-[13px]/[18px] font-[550] text-text-primary mb-1.5"
        >
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        id={pickerId}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-describedby={error ? `${pickerId}-error` : undefined}
        disabled={disabled}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex w-full items-center justify-between gap-2 px-3 py-2 rounded-[var(--radius-md)] border bg-surface text-[15px] text-left',
          'outline-none transition-colors cursor-pointer',
          'focus-visible:ring-2 focus-visible:ring-brand/40',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-danger' : 'border-border dark:border-border-strong',
          !error && !disabled && 'hover:border-border-strong'
        )}
      >
        <span className={cn(!formatValue() && 'text-text-muted', formatValue() && 'text-text-primary')}>
          {formatValue() || 'Select month...'}
        </span>
        <Calendar className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
      </button>

      {/* Error */}
      {error && (
        <span id={`${pickerId}-error`} className="block mt-1 text-[12px] text-danger" role="alert">
          {error}
        </span>
      )}

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -4, scale: 0.98 }}
            animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -4, scale: 0.98 }}
            transition={
              prefersReduced
                ? { duration: 0 }
                : { duration: DURATIONS.cardPanel, ease: EASINGS.default }
            }
            className={cn(
              'absolute z-50 mt-1 w-full min-w-[260px]',
              'rounded-[var(--radius-md)] border border-border dark:border-border-strong bg-surface shadow-lg dark:shadow-black/40',
              'p-3'
            )}
            role="dialog"
            aria-label="Pick a month"
          >
            {/* Year navigation */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => setViewYear((y) => y - 1)}
                className="p-1 rounded-md text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-brand"
                aria-label="Previous year"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-[14px] font-[600] text-text-primary tabular-nums">
                {viewYear}
              </span>
              <button
                type="button"
                onClick={() => setViewYear((y) => y + 1)}
                className="p-1 rounded-md text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-brand"
                aria-label="Next year"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            {/* Month grid */}
            <div className="grid grid-cols-3 gap-1.5" role="grid" aria-label="Months">
              {MONTHS.map((month, idx) => {
                const selected = isSelected(idx);
                return (
                  <button
                    key={month}
                    type="button"
                    onClick={() => selectMonth(idx)}
                    aria-pressed={selected}
                    className={cn(
                      'px-2 py-2 rounded-[var(--radius-sm)] text-[13px] font-[500] transition-colors cursor-pointer',
                      'focus-visible:outline-2 focus-visible:outline-brand',
                      selected
                        ? 'bg-brand text-white'
                        : 'text-text-secondary hover:bg-brand-soft hover:text-brand'
                    )}
                  >
                    {month}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
