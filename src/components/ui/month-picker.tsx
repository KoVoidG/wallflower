'use client';

import { useState, useRef, useEffect, useCallback, useId } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Caption } from '@/components/ui/typography';
import { useReducedMotion } from '@/components/motion/use-reduced-motion';
import { DURATIONS, EASINGS } from '@/components/motion/motion-config';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const FULL_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export interface MonthPickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  align?: 'start' | 'end';
  className?: string;
}

export function MonthPicker({
  value,
  onChange,
  label,
  error,
  disabled = false,
  align = 'start',
  className,
}: MonthPickerProps) {
  const [open, setOpen] = useState(false);
  const [showYearSelector, setShowYearSelector] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const generatedId = useId();
  const pickerId = generatedId;

  // viewYear tracks the currently displayed year in the picker
  const [viewYear, setViewYear] = useState(() => (value ? value.getFullYear() : new Date().getFullYear()));

  // Generate a broad list of years
  const currentSystemYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 26 }, (_, i) => currentSystemYear - 15 + i);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setShowYearSelector(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const toggle = useCallback(() => {
    if (disabled) return;
    setOpen((prev) => {
      if (!prev) {
        setViewYear(value ? value.getFullYear() : new Date().getFullYear());
        setShowYearSelector(false);
      }
      return !prev;
    });
  }, [disabled, value]);

  const selectMonth = useCallback(
    (monthIndex: number) => {
      onChange(new Date(viewYear, monthIndex, 1));
      setOpen(false);
      setShowYearSelector(false);
    },
    [viewYear, onChange]
  );

  const selectYear = (yr: number) => {
    setViewYear(yr);
    setShowYearSelector(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      setShowYearSelector(false);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  };

  const formatValue = () => {
    if (!value || isNaN(value.getTime())) return null;
    return `${FULL_MONTHS[value.getMonth()]} ${value.getFullYear()}`;
  };

  const isSelected = (monthIndex: number) => {
    if (!value) return false;
    return value.getFullYear() === viewYear && value.getMonth() === monthIndex;
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {label && (
        <label htmlFor={pickerId} className="block mb-1.5 text-[13px] font-[550] text-text-primary cursor-pointer">
          {label}
        </label>
      )}

      {/* Trigger Button - Matches canonical Select and DatePicker */}
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
          'flex w-full items-center justify-between gap-2 px-3 py-2 rounded-[var(--radius-md)] border bg-surface text-xs font-medium text-left',
          'outline-none transition-colors cursor-pointer',
          'focus-visible:ring-2 focus-visible:ring-brand/40',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-danger' : 'border-border dark:border-border-strong',
          !error && !disabled && 'hover:border-border-strong'
        )}
      >
        <span className={cn(!formatValue() && 'text-text-muted', formatValue() && 'text-text-primary font-semibold')}>
          {formatValue() || 'Select month & year...'}
        </span>
        <Calendar className="size-4 shrink-0 text-text-secondary" aria-hidden="true" />
      </button>

      {/* Error Message */}
      {error && (
        <span id={`${pickerId}-error`} className="block mt-1 text-[11px] text-danger" role="alert">
          {error}
        </span>
      )}

      {/* Popover Dropdown */}
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
              'absolute z-50 mt-1 w-[260px]',
              align === 'end' ? 'right-0' : 'left-0',
              'rounded-[var(--radius-md)] border border-border dark:border-border-strong bg-surface shadow-xl dark:shadow-black/50',
              'p-2.5 space-y-2.5 text-xs'
            )}
            role="dialog"
            aria-label="Pick a month and year"
          >
            {/* Header: Prev Year, Year Quick Selector, Next Year */}
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <button
                type="button"
                onClick={() => setViewYear((y) => y - 1)}
                className="p-1 rounded-md text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors cursor-pointer"
                aria-label="Previous year"
              >
                <ChevronLeft className="size-4 text-text-secondary" />
              </button>

              {/* Direct Year Dropdown Toggle */}
              <button
                type="button"
                onClick={() => setShowYearSelector((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-subtle border border-border/80 text-xs font-semibold text-text-primary hover:border-brand hover:text-brand transition-colors cursor-pointer"
                title="Click to choose year directly"
              >
                <span className="tabular-nums">{viewYear}</span>
                <ChevronDown className={cn('size-3.5 transition-transform', showYearSelector && 'rotate-180')} />
              </button>

              <button
                type="button"
                onClick={() => setViewYear((y) => y + 1)}
                className="p-1 rounded-md text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors cursor-pointer"
                aria-label="Next year"
              >
                <ChevronRight className="size-4 text-text-secondary" />
              </button>
            </div>

            {/* Direct Year Selector Grid */}
            {showYearSelector ? (
              <div className="space-y-2">
                <Caption className="block text-text-muted text-[10px] font-semibold uppercase tracking-wider">
                  Select Year Directly:
                </Caption>
                <div className="grid grid-cols-4 gap-1 max-h-44 overflow-y-auto p-1 border border-border/40 rounded-md bg-surface-subtle/30">
                  {yearOptions.map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => selectYear(yr)}
                      className={cn(
                        'py-1 rounded text-xs font-semibold tabular-nums transition-colors cursor-pointer',
                        yr === viewYear
                          ? 'bg-brand text-white dark:text-background font-semibold'
                          : 'text-text-primary hover:bg-surface-subtle hover:text-brand'
                      )}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Month Grid */
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
                        'px-2 py-1.5 rounded-[var(--radius-sm)] text-xs font-semibold transition-colors cursor-pointer',
                        selected
                          ? 'bg-brand text-white dark:text-background font-semibold shadow-xs'
                          : 'text-text-primary hover:bg-surface-subtle hover:text-brand'
                      )}
                    >
                      {month}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
