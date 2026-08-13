// src/features/advisor/components/uncertainty-notice.tsx
'use client';

import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UncertaintyNoticeProps {
  items: string[];
  completeness?: number; // 0-100
  className?: string;
}

/**
 * Shows confidence limitations.
 * Warning-soft background, AlertCircle icon.
 * Lists what's uncertain and why, with a data completeness indicator.
 */
export function UncertaintyNotice({ items, completeness, className }: UncertaintyNoticeProps) {
  return (
    <div
      className={cn(
        'bg-warning-soft rounded-[var(--radius-md)] p-4',
        className
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="size-4 text-warning" aria-hidden="true" />
        <span className="text-[13px]/[18px] font-[550] text-warning">Uncertainty</span>
      </div>
      <ul className="space-y-1 text-[13px]/[20px] text-text-secondary" role="list">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="shrink-0 mt-1.5 size-1.5 rounded-full bg-warning" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
      {completeness !== undefined && (
        <div className="mt-3 pt-3 border-t border-warning/20">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[12px]/[16px] text-text-muted">Data completeness</span>
            <span className="text-[12px]/[16px] font-[550] text-text-secondary">{completeness}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-warning/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-warning transition-all"
              style={{ width: `${Math.min(100, Math.max(0, completeness))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
