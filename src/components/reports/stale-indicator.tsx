// src/components/reports/stale-indicator.tsx
import { AlertTriangle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StaleIndicatorProps {
  dataThroughDate: string;
  className?: string;
}

interface SectionIncompleteProps {
  sectionName: string;
  className?: string;
}

/**
 * Shows a warning banner if data is older than 30 days.
 */
export function StaleDataWarning({ dataThroughDate, className }: StaleIndicatorProps) {
  const dataDate = new Date(dataThroughDate);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - dataDate.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff <= 30) return null;

  return (
    <div
      className={cn(
        'flex items-start gap-2.5 bg-warning-soft border border-warning/20 rounded-[var(--radius-md)] px-4 py-3',
        className
      )}
      role="alert"
    >
      <Clock className="size-4 text-warning shrink-0 mt-0.5" aria-hidden="true" />
      <div>
        <p className="text-[13px]/[20px] font-[550] text-warning">
          Data may be outdated
        </p>
        <p className="text-[12px]/[18px] text-text-muted mt-0.5">
          This report is based on data from {dataThroughDate}, which is over 30 days old. 
          Results may not reflect your current business state.
        </p>
      </div>
    </div>
  );
}

/**
 * Inline label for sections with missing or incomplete data.
 */
export function SectionIncomplete({ className }: SectionIncompleteProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 bg-warning-soft text-warning rounded-full px-2.5 py-0.5 text-[12px]/[16px] font-[550]',
        className
      )}
      role="status"
    >
      <AlertTriangle className="size-3" aria-hidden="true" />
      Section incomplete
    </div>
  );
}
