// src/features/advisor/components/disclaimer.tsx
'use client';

import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DisclaimerProps {
  text?: string;
  className?: string;
}

const DEFAULT_TEXT =
  'This analysis is for informational purposes only and does not constitute financial, legal, or professional advice. Always consult qualified professionals before making business decisions.';

/**
 * Legal/advisory disclaimer with surface-subtle background.
 * Small text, text-muted. Shield icon.
 */
export function Disclaimer({ text = DEFAULT_TEXT, className }: DisclaimerProps) {
  return (
    <div
      className={cn(
        'bg-surface-subtle rounded-[var(--radius-md)] px-4 py-3 flex items-start gap-2.5',
        className
      )}
    >
      <Shield className="size-4 text-text-muted shrink-0 mt-0.5" aria-hidden="true" />
      <p className="text-[12px]/[18px] text-text-muted">{text}</p>
    </div>
  );
}
