'use client';

import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Surface } from '@/components/ui/surface';
import { Body, Label } from '@/components/ui/typography';

interface DraftBannerProps {
  onContinue: () => void;
  onClear: () => void;
  className?: string;
}

/**
 * Banner displayed when a saved onboarding draft is detected.
 * Offers options to resume or start fresh.
 */
export function DraftBanner({ onContinue, onClear, className }: DraftBannerProps) {
  return (
    <Surface
      variant="default"
      border
      className={cn('border-info/40 bg-info-soft/30', className)}
      role="status"
      aria-label="Saved draft available"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center justify-center size-9 rounded-full bg-info-soft shrink-0">
            <FileText className="size-4 text-info" aria-hidden="true" />
          </div>
          <div>
            <Label as="span">Resume where you left off</Label>
            <Body className="text-[13px]">
              We found a saved draft of your onboarding data.
            </Body>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:shrink-0">
          <button
            type="button"
            onClick={onContinue}
            className={cn(
              'px-3 py-1.5 rounded-[var(--radius-md)] text-[13px] font-[550]',
              'bg-info text-white dark:text-on-primary hover:bg-info/90 transition-colors cursor-pointer'
            )}
          >
            Continue
          </button>
          <button
            type="button"
            onClick={onClear}
            className={cn(
              'px-3 py-1.5 rounded-[var(--radius-md)] text-[13px] font-[550]',
              'border border-border text-text-secondary',
              'hover:bg-surface-subtle transition-colors cursor-pointer'
            )}
          >
            Start fresh
          </button>
        </div>
      </div>
    </Surface>
  );
}
