'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContextualDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function ContextualDrawer({ open, onClose, title, children }: ContextualDrawerProps) {
  const t = useTranslations('common');
  const drawerRef = useRef<HTMLDivElement>(null);

  // Trap focus and handle Escape key
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Prevent body scroll when open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* Backdrop - visible on mobile/tablet only */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 lg:hidden',
          'transition-opacity duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
          'motion-reduce:transition-none',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-[320px] flex-col border-l border-border bg-surface shadow-lg',
          'lg:static lg:z-auto lg:shadow-none',
          'transition-transform duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
          'motion-reduce:transition-none',
          // Mobile/tablet: slides from right
          open ? 'translate-x-0' : 'translate-x-full',
          // Desktop: no transform, conditionally rendered in layout
          'lg:translate-x-0'
        )}
        role="complementary"
        aria-label={title || 'Contextual panel'}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {title && (
            <h2 className="text-sm font-semibold text-text-primary truncate">{title}</h2>
          )}
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'ml-auto inline-flex items-center justify-center rounded-lg p-2',
              'text-text-secondary hover:bg-surface-subtle hover:text-text-primary',
              'transition-colors duration-150',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
              'cursor-pointer'
            )}
            aria-label={t('close')}
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </>
  );
}
