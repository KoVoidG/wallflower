// src/features/advisor/components/assumption-tag.tsx
'use client';

import { UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssumptionTagProps {
  label: string;
  className?: string;
}

/**
 * Shows a user-provided assumption as a tag/chip.
 * Icon: UserCircle. "Your input" label. Editable feel styling.
 */
export function AssumptionTag({ label, className }: AssumptionTagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
        'bg-warning-soft text-warning border border-warning/20',
        'text-[13px]/[18px] font-[550]',
        className
      )}
    >
      <UserCircle className="size-3.5 shrink-0" aria-hidden="true" />
      <span className="text-[11px] font-normal text-text-muted mr-1">Your input</span>
      {label}
    </span>
  );
}
