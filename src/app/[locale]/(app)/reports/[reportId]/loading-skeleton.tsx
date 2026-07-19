// src/app/[locale]/(app)/reports/[reportId]/loading-skeleton.tsx
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

export function ReportDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto" aria-hidden="true">
      {/* Cover skeleton */}
      <div className="py-12 border-b border-border">
        <Skeleton className="h-8 w-8 rounded-lg mb-8" />
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-10 w-3/4 mb-6" />
        <div className="flex gap-6">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Executive summary skeleton */}
      <div className="py-10 border-b border-border">
        <Skeleton className="h-8 w-56 mb-6" />
        <SkeletonText lines={4} className="max-w-2xl" />
      </div>

      {/* Metrics skeleton */}
      <div className="py-10 border-b border-border">
        <Skeleton className="h-8 w-40 mb-6" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Risk skeleton */}
      <div className="py-10 border-b border-border">
        <Skeleton className="h-8 w-52 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-border rounded-[var(--radius-md)] p-4">
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Simulation skeleton */}
      <div className="py-10 border-b border-border">
        <Skeleton className="h-8 w-52 mb-6" />
        <Skeleton className="h-5 w-40 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-5 w-24" />
              <div className="flex gap-4">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
