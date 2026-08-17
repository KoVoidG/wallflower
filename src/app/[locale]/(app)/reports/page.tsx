import { Suspense } from 'react';
import { FadeIn } from '@/components/motion';
import { ReportsView } from '@/features/reports/components';
import { getReportsData } from '@/features/reports/adapters/reports.adapter';
import { ReportsSkeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Reports',
};

export default function ReportsPage() {
  return (
    <Suspense fallback={<ReportsSkeleton />}>
      <ReportsContent />
    </Suspense>
  );
}

async function ReportsContent() {
  await getReportsData();

  return (
    <FadeIn>
      <ReportsView />
    </FadeIn>
  );
}
