'use client';

import { useParams, useRouter } from 'next/navigation';
import { AppPage } from '@/components/ui/layout';
import { FadeIn } from '@/components/motion';
import { ReportViewer } from '@/features/reports/components';

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = (params.reportId as string) || 'rpt-1';

  return (
    <AppPage className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <FadeIn>
        <ReportViewer
          report={{
            id: reportId,
            title: 'Price Increase +5%',
            type: 'Executive Summary Report',
            date: 'Aug 5, 2025 • 10:24 AM',
            horizon: '6 Months',
            healthScore: 84,
            profit: '฿163,000',
            confidence: 91,
            confidenceBadge: 'High Confidence',
            iconColor: 'emerald',
          }}
          onBackToLibrary={() => router.push('/reports')}
        />
      </FadeIn>
    </AppPage>
  );
}
