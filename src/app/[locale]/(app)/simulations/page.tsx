import { Suspense } from 'react';
import { FadeIn } from '@/components/motion';
import { getSimulationHistory } from '@/features/simulations/adapters/simulations.adapter';
import { DecisionPlannerView } from '@/features/simulations/components';
import { DecisionPlannerSkeleton } from '@/components/ui/skeleton';
import { WhatIfScenarioEngine } from '@/features/simulations/components/what-if-scenario-engine';

export const metadata = {
  title: 'Simulations',
};

export default function SimulationsPage() {
  return (
    <Suspense fallback={<DecisionPlannerSkeleton />}>
      <SimulationsContent />
    </Suspense>
  );
}

async function SimulationsContent() {
  const history = await getSimulationHistory();

  return (
    <FadeIn>
      <div data-tour="simulations-view">
        <DecisionPlannerView initialHistory={history} />
        <WhatIfScenarioEngine />
      </div>
    </FadeIn>
  );
}
