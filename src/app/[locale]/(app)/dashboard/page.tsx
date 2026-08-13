import { Suspense } from 'react';
import { FadeIn } from '@/components/motion';
import { DashboardView } from '@/features/dashboard/components';
import { getDashboardData } from '@/features/dashboard/adapters/dashboard.adapter';
import { DashboardSkeleton } from './loading';

export const metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const data = await getDashboardData();

  return (
    <FadeIn>
      <DashboardView initialData={data} />
    </FadeIn>
  );
}

