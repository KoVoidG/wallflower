import { Suspense } from 'react';
import { BusinessHealthView } from '@/features/business-health/components';
import { BusinessHealthSkeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Business Health',
};

export default function BusinessHealthPage() {
  return (
    <Suspense fallback={<BusinessHealthSkeleton />}>
      <BusinessHealthView />
    </Suspense>
  );
}
