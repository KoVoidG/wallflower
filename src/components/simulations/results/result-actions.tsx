'use client';

import { cn } from '@/lib/utils';
import { Save, GitCompare, FileText } from 'lucide-react';

interface ResultActionsProps {
  onSave?: () => void;
  onCompare?: () => void;
  onReport?: () => void;
  className?: string;
}

export function ResultActions({ onSave, onCompare, onReport, className }: ResultActionsProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <button
        type="button"
        onClick={onSave}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)]',
          'bg-brand text-white font-[550] text-[14px]',
          'hover:bg-brand-hover transition-colors cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40'
        )}
      >
        <Save className="size-4" aria-hidden="true" />
        Save Simulation
      </button>

      <button
        type="button"
        onClick={onCompare}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)]',
          'border border-border bg-surface text-text-primary font-[550] text-[14px]',
          'hover:bg-surface-subtle transition-colors cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40'
        )}
      >
        <GitCompare className="size-4" aria-hidden="true" />
        Compare
      </button>

      <button
        type="button"
        onClick={onReport}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)]',
          'border border-border bg-surface text-text-primary font-[550] text-[14px]',
          'hover:bg-surface-subtle transition-colors cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40'
        )}
      >
        <FileText className="size-4" aria-hidden="true" />
        Generate Report
      </button>
    </div>
  );
}
