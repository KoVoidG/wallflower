// src/app/[locale]/(app)/reports/[reportId]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getReport } from '@/features/reports/adapters/reports.adapter';
import { ReportDetailContent } from './report-detail-content';
import { ReportDetailSkeleton } from './loading-skeleton';

interface ReportDetailPageProps {
  params: Promise<{ reportId: string; locale: string }>;
}

export default async function ReportDetailPage({ params }: ReportDetailPageProps) {
  const { reportId } = await params;
  const report = await getReport(reportId);

  if (!report) {
    notFound();
  }

  return (
    <Suspense fallback={<ReportDetailSkeleton />}>
      <ReportDetailContent report={report} />
    </Suspense>
  );
}
