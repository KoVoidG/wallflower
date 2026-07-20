'use client';

import { useState, useRef, useEffect, useCallback, useId } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/components/motion/use-reduced-motion';
import { DURATIONS, EASINGS } from '@/components/motion/motion-config';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  label,
  error,
  disabled = false,
  className,
  id,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const prefersReduced = useReducedMotion();
  const generatedId = useId();
  const selectId = id || generatedId;
  const listboxId = `${selectId}-listbox`;

  const selectedOption = options.find((o) => o.value === value);

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

  // Scroll highlighted item into view
  useEffect(() => {
    if (!open || highlightedIndex < 0) return;
    const item = listboxRef.current?.children[highlightedIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: 'nearest' });
  }, [highlightedIndex, open]);

  const openDropdown = useCallback(() => {
    if (disabled) return;
    setOpen(true);
    const idx = options.findIndex((o) => o.value === value);
    setHighlightedIndex(idx >= 0 ? idx : 0);
  }, [disabled, options, value]);

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setHighlightedIndex(-1);
  }, []);

  const selectOption = useCallback(
    (optValue: string) => {
      onChange(optValue);
      closeDropdown();
    },
    [onChange, closeDropdown]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!open) {
          openDropdown();
        } else if (highlightedIndex >= 0) {
          selectOption(options[highlightedIndex].value);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!open) {
          openDropdown();
        } else {
          setHighlightedIndex((prev) => (prev + 1) % options.length);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!open) {
          openDropdown();
        } else {
          setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
        }
        break;
      case 'Escape':
        e.preventDefault();
        closeDropdown();
        break;
      case 'Tab':
        if (open) closeDropdown();
        break;
    }
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-[13px]/[18px] font-[550] text-text-primary mb-1.5"
        >
          {label}
        </label>
      )}

      {/* Trigger button */}
      <button
        id={selectId}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : undefined}
        disabled={disabled}
        onClick={() => (open ? closeDropdown() : openDropdown())}
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
        <span className={cn(!selectedOption && 'text-text-muted', selectedOption && 'text-text-primary')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-text-muted transition-transform duration-150',
            'motion-reduce:transition-none',
            open && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {/* Error message */}
      {error && (
        <span id={`${selectId}-error`} className="block mt-1 text-[12px] text-danger" role="alert">
          {error}
        </span>
      )}

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-label={label || placeholder}
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -4, scale: 0.98 }}
            animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -4, scale: 0.98 }}
            transition={
              prefersReduced
                ? { duration: 0 }
                : { duration: DURATIONS.cardPanel, ease: EASINGS.default }
            }
            className={cn(
              'absolute z-50 mt-1 w-full max-h-60 overflow-y-auto',
              'rounded-[var(--radius-md)] border border-border dark:border-border-strong bg-surface shadow-lg dark:shadow-black/40',
              'py-1'
            )}
          >
            {options.map((option, idx) => {
              const isSelected = option.value === value;
              const isHighlighted = idx === highlightedIndex;

              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  onClick={() => selectOption(option.value)}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 text-[14px] cursor-pointer',
                    'transition-colors duration-75',
                    isHighlighted && 'bg-brand-soft',
                    isSelected && !isHighlighted && 'text-brand font-[500]',
                    !isHighlighted && !isSelected && 'text-text-primary'
                  )}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <Check className="size-4 shrink-0 text-brand" aria-hidden="true" />
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
