import { Suspense } from 'react';
import { FadeIn } from '@/components/motion';
import { getSimulationHistory } from '@/features/simulations/adapters/simulations.adapter';
import { SimulationHistoryView } from '@/components/simulations/simulation-history-view';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Simulations',
};

export default async function SimulationsPage() {
  return (
    <Suspense fallback={<SimulationsPageSkeleton />}>
      <SimulationsContent />
    </Suspense>
  );
}

async function SimulationsContent() {
  const history = await getSimulationHistory();

  return (
    <FadeIn>
      <div data-tour="simulations-view">
        <SimulationHistoryView initialHistory={history} />
      </div>
    </FadeIn>
  );
}

function SimulationsPageSkeleton() {
  return (
    <div className="flex flex-col gap-5" aria-hidden="true">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  );
}
