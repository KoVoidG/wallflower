import { cn } from '@/lib/utils';

function Skeleton({ className }: { className?: string }) {
  return (
    <span
      className={cn('block animate-pulse motion-reduce:animate-none rounded-[var(--radius-md)] bg-border', className)}
      aria-hidden="true"
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading dashboard">
      {/* Page header */}
      <Skeleton className="h-9 w-40" />

      {/* Business Pulse skeleton */}
      <div className="rounded-[var(--radius-md)] border border-border p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-5 w-full max-w-[400px]" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Insights skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>

      {/* KPI grid skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-[var(--radius-md)] border border-border p-4 flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="rounded-[var(--radius-md)] border border-border p-5 flex flex-col gap-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-[280px] w-full" />
      </div>

      {/* Scenario CTA skeleton */}
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

export default DashboardSkeleton;
