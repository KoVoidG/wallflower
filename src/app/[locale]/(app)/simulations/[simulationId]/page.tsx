import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { FadeIn } from '@/components/motion';
import { getSimulation, getScenarioConfigs } from '@/features/simulations/adapters/simulations.adapter';
import { SimulationDetailView } from '@/components/simulations/simulation-detail-view';
import { Skeleton } from '@/components/ui/skeleton';

interface SimulationDetailPageProps {
  params: Promise<{ simulationId: string }>;
}

export const metadata = {
  title: 'Simulation Detail',
};

export default async function SimulationDetailPage({ params }: SimulationDetailPageProps) {
  const { simulationId } = await params;

  return (
    <Suspense fallback={<SimulationDetailSkeleton />}>
      <SimulationDetailContent simulationId={simulationId} />
    </Suspense>
  );
}

async function SimulationDetailContent({ simulationId }: { simulationId: string }) {
  const [simulation, scenarios] = await Promise.all([
    getSimulation(simulationId),
    getScenarioConfigs(),
  ]);

  if (!simulation) {
    notFound();
  }

  const scenarioConfig = scenarios.find((s) => s.type === simulation.scenarioType);

  return (
    <FadeIn>
      <SimulationDetailView simulation={simulation} scenarioConfig={scenarioConfig} />
    </FadeIn>
  );
}

function SimulationDetailSkeleton() {
  return (
    <div className="flex flex-col gap-5" aria-hidden="true">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-10 w-full max-w-sm" />
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
