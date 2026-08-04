import { Suspense } from 'react';
import { ReportsView } from '@/features/reports/components';
import { ReportsSkeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Reports',
};

export default function ReportsPage() {
  return (
    <Suspense fallback={<ReportsSkeleton />}>
      <ReportsView />
    </Suspense>
  );
}
