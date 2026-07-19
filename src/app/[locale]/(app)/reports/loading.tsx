// src/app/[locale]/(app)/reports/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function ReportsLoading() {
  return (
    <div aria-hidden="true">
      {/* Header skeleton */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-10 w-44 rounded-lg" />
      </div>

      {/* Card skeletons */}
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[var(--radius-md)] border border-border bg-surface p-4"
          >
            <div className="flex items-start gap-3">
              <Skeleton className="size-10 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-5 w-56 mb-1.5" />
                <Skeleton className="h-4 w-36" />
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
