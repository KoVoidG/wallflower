'use client';

import { useState, useRef, useEffect, useCallback, useId } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/components/motion/use-reduced-motion';
import { DURATIONS, EASINGS } from '@/components/motion/motion-config';

const SHORT_MONTH_NAMES = [
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

const WEEKDAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export interface DatePickerProps {
  value?: string; // ISO YYYY-MM-DD
  onChange: (value: string) => void;
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  placeholder?: string;
  id?: string;
  name?: string;
  required?: boolean;
  align?: 'start' | 'end';
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  label,
  helperText,
  error,
  disabled = false,
  minDate,
  maxDate,
  placeholder = 'Select date...',
  id,
  required,
  align = 'start',
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const generatedId = useId();
  const pickerId = id || generatedId;

  // Internal view date (year & month)
  const initialDate = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  // Direct year options (15 years back to 10 years ahead)
  const currentSysYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 26 }, (_, i) => currentSysYear - 15 + i);

  // Close on outside click
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
      if (!prev && value) {
        const parsed = new Date(value);
        if (!isNaN(parsed.getTime())) {
          setViewYear(parsed.getFullYear());
          setViewMonth(parsed.getMonth());
        }
      }
      return !prev;
    });
  }, [disabled, value, setViewYear, setViewMonth]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (!open) {
        e.preventDefault();
        toggle();
      }
    }
  };

  const handleSelectDay = (day: number) => {
    const formattedMonth = String(viewMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const isoString = `${viewYear}-${formattedMonth}-${formattedDay}`;

    onChange(isoString);
    setOpen(false);
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Format canonical YYYY-MM-DD into "28 Feb 2025" for display
  const formatDisplay = (iso?: string) => {
    if (!iso) return null;
    const [y, m, d] = iso.split('-').map(Number);
    if (!y || !m || !d) return null;
    const shortMonth = SHORT_MONTH_NAMES[m - 1] || '';
    return `${d} ${shortMonth} ${y}`;
  };

  // Calendar calculations
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayIso = new Date().toISOString().split('T')[0];

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {label && (
        <label htmlFor={pickerId} className="block mb-1.5 text-[13px] font-[550] text-text-primary cursor-pointer">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}

      {/* Trigger Button - Matches canonical Select style */}
      <button
        id={pickerId}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-describedby={error ? `${pickerId}-error` : helperText ? `${pickerId}-helper` : undefined}
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
        <span className={cn(!value && 'text-text-muted', value && 'text-text-primary font-semibold')}>
          {formatDisplay(value) || placeholder}
        </span>
        <CalendarIcon className="size-4 shrink-0 text-text-secondary" aria-hidden="true" />
      </button>

      {/* Helper or Error Message */}
      {error ? (
        <span id={`${pickerId}-error`} className="block mt-1 text-[11px] text-danger" role="alert">
          {error}
        </span>
      ) : helperText ? (
        <span id={`${pickerId}-helper`} className="block mt-1 text-[11px] text-text-muted">
          {helperText}
        </span>
      ) : null}

      {/* Calendar Popover */}
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
              'absolute z-50 mt-1 w-[280px]',
              align === 'end' ? 'right-0' : 'left-0',
              'rounded-[var(--radius-md)] border border-border dark:border-border-strong bg-surface shadow-xl dark:shadow-black/50',
              'p-3 space-y-3'
            )}
            role="dialog"
            aria-label="Calendar date picker"
          >
            {/* Direct Month & Year Navigation Header (Req 11) */}
            <div className="flex items-center justify-between border-b border-border/60 pb-2 gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded-md text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors cursor-pointer"
                aria-label="Previous month"
              >
                <ChevronLeft className="size-4 text-text-secondary" />
              </button>

              <div className="flex items-center gap-1.5">
                {/* Direct Month Selector */}
                <select
                  aria-label="Select month"
                  value={viewMonth}
                  onChange={(e) => setViewMonth(Number(e.target.value))}
                  className="px-1.5 py-0.5 rounded bg-surface-subtle border border-border/60 text-xs font-semibold text-text-primary cursor-pointer hover:border-brand focus:outline-none"
                >
                  {SHORT_MONTH_NAMES.map((name, idx) => (
                    <option key={name} value={idx}>
                      {name}
                    </option>
                  ))}
                </select>

                {/* Direct Year Selector */}
                <select
                  aria-label="Select year"
                  value={viewYear}
                  onChange={(e) => setViewYear(Number(e.target.value))}
                  className="px-1.5 py-0.5 rounded bg-surface-subtle border border-border/60 text-xs font-semibold text-text-primary cursor-pointer hover:border-brand focus:outline-none"
                >
                  {yearOptions.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded-md text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors cursor-pointer"
                aria-label="Next month"
              >
                <ChevronRight className="size-4 text-text-secondary" />
              </button>
            </div>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-text-muted">
              {WEEKDAY_NAMES.map((wd) => (
                <span key={wd}>{wd}</span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1" role="grid">
              {/* Empty leading slots */}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {/* Month days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const formattedMonth = String(viewMonth + 1).padStart(2, '0');
                const formattedDay = String(dayNum).padStart(2, '0');
                const dayIso = `${viewYear}-${formattedMonth}-${formattedDay}`;

                const isSelected = value === dayIso;
                const isToday = todayIso === dayIso;

                let isDisabled = false;
                if (minDate && dayIso < minDate) isDisabled = true;
                if (maxDate && dayIso > maxDate) isDisabled = true;

                return (
                  <button
                    key={dayNum}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleSelectDay(dayNum)}
                    className={cn(
                      'size-8 rounded-md text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer',
                      isSelected
                        ? 'bg-brand text-white dark:text-background font-semibold shadow-xs'
                        : isToday
                        ? 'bg-surface-subtle border border-brand/40 text-brand font-bold'
                        : 'text-text-primary hover:bg-brand-soft hover:text-brand',
                      isDisabled && 'opacity-30 cursor-not-allowed hover:bg-transparent hover:text-text-primary'
                    )}
                  >
                    {dayNum}
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
