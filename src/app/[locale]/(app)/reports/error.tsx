'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import { Surface } from '@/components/ui/surface';

export default function ReportsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Surface border className="flex flex-col items-center gap-4 p-8 max-w-md text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-danger-soft">
          <AlertCircle className="size-6 text-danger" aria-hidden="true" />
        </div>
        <h2 className="text-[18px]/[26px] font-[600] text-text-primary">
          Failed to load reports
        </h2>
        <p className="text-[14px]/[22px] text-text-secondary">
          Something went wrong while loading your reports. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] px-4 py-2.5 text-[14px] font-[550] bg-brand text-white hover:bg-brand-hover transition-colors cursor-pointer"
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          Try Again
        </button>
      </Surface>
    </div>
  );
}
