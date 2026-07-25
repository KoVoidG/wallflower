import { Skeleton } from '@/components/ui/skeleton';
import { AppPage } from '@/components/ui/layout';

export default function SimulationsLoading() {
  return (
    <AppPage>
      <div className="space-y-6" aria-hidden="true">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div className="space-y-2">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>

        {/* Templates Grid Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-44" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        </div>

        {/* List Table Skeleton */}
        <div className="p-4 rounded-xl border border-border/80 bg-surface space-y-3">
          <Skeleton className="h-5 w-48" />
          <div className="space-y-2 pt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </AppPage>
  );
}
