'use client';

import { cn } from '@/lib/utils';
import { Save, GitCompare, FileText, RotateCcw, FlaskConical } from 'lucide-react';
import { H3, Caption } from '@/components/ui/typography';
import type { PostureType } from '@/features/simulations/adapters/simulations.adapter';

interface ResultActionsProps {
  posture?: PostureType;
  onSave?: () => void;
  onCompare?: () => void;
  onReport?: () => void;
  onRerun?: () => void;
  className?: string;
}

const primaryActions: Record<PostureType, { label: string; icon: React.ElementType }> = {
  bullish: { label: 'Save decision plan', icon: Save },
  cautious: { label: 'Test a safer variation', icon: FlaskConical },
  neutral: { label: 'Adjust assumptions', icon: RotateCcw },
};

export function ResultActions({
  posture = 'neutral',
  onSave,
  onCompare,
  onReport,
  onRerun,
  className,
}: ResultActionsProps) {
  const primary = primaryActions[posture];
  const PrimaryIcon = primary.icon;

  return (
    <section
      className={cn('rounded-[var(--radius-lg)] border border-border bg-surface p-6 flex flex-col gap-4', className)}
      aria-label="Next actions"
    >
      <div className="flex flex-col gap-1">
        <H3 className="text-[16px]/[22px]">What would you like to do next?</H3>
        <Caption as="p" className="text-text-secondary">
          Based on the {posture === 'bullish' ? 'positive' : posture === 'cautious' ? 'cautious' : 'neutral'} outlook, we suggest:
        </Caption>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={posture === 'bullish' ? onSave : posture === 'cautious' ? onRerun : onRerun}
          className={cn(
            'inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)]',
            'bg-brand text-white font-[600] text-[14px]',
            'hover:bg-brand-hover transition-colors cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40'
          )}
        >
          <PrimaryIcon className="size-4" aria-hidden="true" />
          {primary.label}
        </button>

        <button
          type="button"
          onClick={onSave}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)]',
            'border border-border bg-surface text-text-primary font-[550] text-[14px]',
            'hover:bg-surface-subtle transition-colors cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40'
          )}
        >
          <Save className="size-4" aria-hidden="true" />
          Save
        </button>

        <button
          type="button"
          onClick={onCompare}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)]',
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
            'inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)]',
            'border border-border bg-surface text-text-primary font-[550] text-[14px]',
            'hover:bg-surface-subtle transition-colors cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40'
          )}
        >
          <FileText className="size-4" aria-hidden="true" />
          Report
        </button>
      </div>
    </section>
  );
}
