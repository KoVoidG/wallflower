import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true" aria-label="Loading dashboard">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* Business Pulse + Recommended Action - 8 + 4 grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        <div className="lg:col-span-8 rounded-[var(--radius-lg)] border border-border p-6 md:p-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-5 rounded-full" />
              <Skeleton className="h-7 w-28" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-5 w-full max-w-[480px]" />
          <div className="flex gap-6">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Skeleton className="h-4 w-40 mt-2" />
        </div>
        <div className="lg:col-span-4 rounded-[var(--radius-lg)] border border-border p-6 md:p-8 flex flex-col gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-10 w-24 rounded-[var(--radius-md)] mt-auto" />
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-[var(--radius-md)] border border-border p-4 flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>

      {/* Trend + Risks - 8 + 4 grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-6 w-80" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="rounded-[var(--radius-md)] border border-border p-5">
            <Skeleton className="h-[280px] w-full" />
          </div>
        </div>
        <div className="lg:col-span-4 rounded-[var(--radius-lg)] border border-border p-6 flex flex-col gap-4">
          <Skeleton className="h-5 w-24" />
          <div className="rounded-[var(--radius-md)] bg-border/20 p-4 flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
          <Skeleton className="h-3 w-28" />
        </div>
      </div>

      {/* Scenario CTA */}
      <Skeleton className="h-36 w-full rounded-[var(--radius-lg)]" />
    </div>
  );
}

export default DashboardSkeleton;
