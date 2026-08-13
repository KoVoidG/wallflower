// src/components/ui/error-state.tsx
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  onRetry,
  retryLabel = 'Try again',
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-6',
        className
      )}
    >
      <div className="mb-4 text-danger" aria-hidden="true">
        <AlertTriangle className="size-12" />
      </div>
      <h3 className="text-[20px]/[28px] font-[600] text-text-primary mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-[15px]/[24px] font-normal text-text-muted max-w-sm mb-4">
          {description}
        </p>
      )}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-danger px-4 py-2 text-[14px] font-[550] text-white transition-colors hover:bg-danger/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger cursor-pointer"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
