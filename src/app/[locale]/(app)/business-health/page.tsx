import { Suspense } from 'react';
import { FadeIn } from '@/components/motion';
import { BusinessHealthView } from '@/features/business-health/components';
import { BusinessHealthAdapter } from '@/features/business-health/adapters/business-health.adapter';
import { BusinessHealthSkeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Business Health',
};

export default function BusinessHealthPage() {
  return (
    <Suspense fallback={<BusinessHealthSkeleton />}>
      <BusinessHealthContent />
    </Suspense>
  );
}

async function BusinessHealthContent() {
  await BusinessHealthAdapter.getHealthAssessment({ simulatedDelayMs: 400 });

  return (
    <FadeIn>
      <BusinessHealthView />
    </FadeIn>
  );
}
