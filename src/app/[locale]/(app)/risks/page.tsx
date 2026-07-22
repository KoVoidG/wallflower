import { Suspense } from 'react';
import { FadeIn } from '@/components/motion';
import { RisksView } from '@/features/risks/components';
import { getRisksData } from '@/features/risks/adapters/risks.adapter';
import { RisksPageSkeleton } from '@/features/risks/components';

export const metadata = {
  title: 'Risk Center',
};

export default async function RisksPage() {
  return (
    <Suspense fallback={<RisksPageSkeleton />}>
      <RisksContent />
    </Suspense>
  );
}

async function RisksContent() {
  const data = await getRisksData();

  return (
    <FadeIn>
      <div data-tour="risks-view">
        <RisksView initialData={data} />
      </div>
    </FadeIn>
  );
}
