'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/i18n/navigation';
import { AppPage } from '@/components/ui/layout';
import { FadeIn } from '@/components/motion';
import { ReportLibraryView } from './report-library-view';
import { ReportViewer, type ReportItem } from './report-viewer';

export function ReportsView() {
  const router = useRouter();
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  const handleNewSimulation = () => {
    router.push('/simulations?tab=library');
  };

  return (
    <AppPage className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <FadeIn>
        {selectedReport ? (
          <ReportViewer
            report={selectedReport}
            onBackToLibrary={() => setSelectedReport(null)}
          />
        ) : (
          <ReportLibraryView
            onSelectReport={(rpt) => setSelectedReport(rpt)}
            onNewSimulation={handleNewSimulation}
          />
        )}
      </FadeIn>
    </AppPage>
  );
}
