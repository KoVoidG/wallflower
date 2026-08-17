import { Suspense } from 'react';
import { FadeIn } from '@/components/motion';
import { StrategicAdvisorWorkspace } from '@/features/advisor/components';
import { getAdvisorInitialData } from '@/features/advisor/adapters/advisor.adapter';
import { AdvisorSkeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Strategic Advisor',
};

export default function AdvisorPage() {
  return (
    <Suspense fallback={<AdvisorSkeleton />}>
      <AdvisorContent />
    </Suspense>
  );
}

async function AdvisorContent() {
  const data = await getAdvisorInitialData();

  return (
    <FadeIn>
      <StrategicAdvisorWorkspace initialPrompts={data.suggestedPrompts} />
    </FadeIn>
  );
}
