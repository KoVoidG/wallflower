'use client';

import { useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/components/motion/use-reduced-motion';
import { DURATIONS, EASINGS } from '@/components/motion/motion-config';

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
} as const;

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  dismissOnBackdrop?: boolean;
}

export function Dialog({
  open,
  onClose,
  title,
  children,
  size = 'md',
  dismissOnBackdrop = true,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const prefersReduced = useReducedMotion();

  // Body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Focus management
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Focus first focusable element after animation
      const timer = setTimeout(() => {
        const focusable = dialogRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusable?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      // Restore focus
      previousFocusRef.current?.focus();
    }
  }, [open]);

  // Escape to close + focus trap
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const handleBackdropClick = useCallback(() => {
    if (dismissOnBackdrop) onClose();
  }, [dismissOnBackdrop, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={
              prefersReduced
                ? { duration: 0 }
                : { duration: DURATIONS.drawerDialog, ease: EASINGS.default }
            }
            className="fixed inset-0 bg-black/50 backdrop-blur-md"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'dialog-title' : undefined}
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
            animate={prefersReduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            transition={
              prefersReduced
                ? { duration: 0 }
                : { duration: 0.2, ease: EASINGS.default }
            }
            className={cn(
              'relative z-10 w-full rounded-[var(--radius-lg)] border border-border/80 dark:border-border bg-surface/95 dark:bg-surface/90 backdrop-blur-lg shadow-2xl dark:shadow-black/60',
              'max-h-[90vh] overflow-y-auto',
              sizeClasses[size]
            )}
          >
            {title && (
              <div className="border-b border-border px-6 py-4">
                <h2 id="dialog-title" className="text-[20px]/[28px] font-[600] text-text-primary">
                  {title}
                </h2>
              </div>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
