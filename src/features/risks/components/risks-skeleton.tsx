// src/features/risks/components/risks-skeleton.tsx
import { cn } from '@/lib/utils';

function Skeleton({ className }: { className?: string }) {
  return (
    <span
      className={cn('block animate-pulse motion-reduce:animate-none rounded-[var(--radius-md)] bg-border', className)}
      aria-hidden="true"
    />
  );
}

/** Skeleton for the Risk Overview summary card */
export function RiskSummarySkeleton() {
  return (
    <div className="rounded-[var(--radius-md)] border border-border p-5 flex flex-col gap-4">
      {/* Title row */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      {/* Score + metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex flex-col items-center gap-2 py-3">
          <Skeleton className="size-16 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex flex-col items-center gap-2 py-3">
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex flex-col items-center gap-2 py-3">
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex flex-col items-center gap-2 py-3">
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      {/* Score explanation */}
      <Skeleton className="h-4 w-full max-w-[420px]" />
    </div>
  );
}

/** Skeleton for the filters bar */
export function RiskFiltersSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Skeleton className="h-10 w-full sm:w-64" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
      <Skeleton className="h-8 w-32 rounded-full ml-auto" />
    </div>
  );
}

/** Skeleton for a single risk card */
function RiskCardSkeleton() {
  return (
    <div className="rounded-[var(--radius-md)] border border-border p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="size-5 rounded" />
      </div>
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-4 w-full max-w-[320px]" />
    </div>
  );
}

/** Skeleton for the risk cards list */
export function RiskCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <RiskCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Full page skeleton combining all sections */
export function RisksPageSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading risk center">
      {/* Page title */}
      <Skeleton className="h-9 w-44" />
      <RiskSummarySkeleton />
      <RiskFiltersSkeleton />
      <RiskCardsSkeleton />
    </div>
  );
}
