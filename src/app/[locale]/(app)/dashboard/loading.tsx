import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12" aria-busy="true" aria-label="Loading dashboard">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-md" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-36 rounded-md" />
          <Skeleton className="h-8 w-32 rounded-md" />
        </div>
      </div>

      {/* Row 1: Business Health & Today's Priorities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Business Health Skeleton */}
        <div className="lg:col-span-6 rounded-[14px] border border-border bg-surface p-6 flex flex-col justify-between space-y-4">
          <Skeleton className="h-6 w-36 rounded-md" />
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center py-2">
            <div className="sm:col-span-5 flex flex-col items-center justify-center">
              <Skeleton className="size-32 rounded-full" />
              <Skeleton className="h-4 w-16 rounded-md mt-2" />
            </div>
            <div className="sm:col-span-7 space-y-3">
              <Skeleton className="h-9 w-full rounded-md" />
              <Skeleton className="h-9 w-full rounded-md" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Today's Priorities Skeleton */}
        <div className="lg:col-span-6 rounded-[14px] border border-border bg-surface p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3 w-full">
                  <Skeleton className="size-7 rounded-full shrink-0" />
                  <div className="space-y-1 w-full">
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                    <Skeleton className="h-3 w-1/2 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-[14px] border border-border bg-surface p-5 flex flex-col gap-3">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-7 w-36 rounded-md" />
            <div className="flex items-center justify-between gap-2 pt-1">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Row 3: Revenue & Profit Trend Chart */}
      <div className="rounded-[14px] border border-border bg-surface p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Skeleton className="h-6 w-48 rounded-md" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-8 w-36 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-72 w-full rounded-md" />
      </div>

      {/* Row 4: AI Executive Summary */}
      <div className="rounded-[14px] border border-border bg-surface-hover p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-44 rounded-md" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-9 space-y-3">
            <Skeleton className="h-16 w-full rounded-md" />
            <Skeleton className="h-4 w-32 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-60 rounded-md" />
              <Skeleton className="h-4 w-56 rounded-md" />
              <Skeleton className="h-4 w-52 rounded-md" />
            </div>
          </div>
          <div className="lg:col-span-3 flex flex-col items-center justify-center gap-3">
            <Skeleton className="size-16 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-md" />
          </div>
        </div>
      </div>

      {/* Row 5: Recent Simulations & Recent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-[14px] border border-border bg-surface p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-8 rounded-md" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32 rounded-md" />
                    <Skeleton className="h-3 w-24 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[14px] border border-border bg-surface p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-36 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-8 rounded-md" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-44 rounded-md" />
                    <Skeleton className="h-3 w-28 rounded-md" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-12 rounded-md" />
                  <Skeleton className="size-6 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardSkeleton;
