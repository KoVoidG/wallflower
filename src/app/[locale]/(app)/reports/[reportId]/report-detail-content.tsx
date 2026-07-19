// src/app/[locale]/(app)/reports/[reportId]/report-detail-content.tsx
'use client';

import { useState } from 'react';
import { ArrowLeft, Printer, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/navigation';
import {
  ReportCover,
  ExecutiveSummary,
  MetricTable,
  RiskSection,
  SimulationSection,
  RecommendationSection,
  ActionPlan,
  ReportMetadata,
  StaleDataWarning,
} from '@/components/reports';
import type { ReportData } from '@/features/reports/adapters/reports.adapter';

interface ReportDetailContentProps {
  report: ReportData;
}

export function ReportDetailContent({ report }: ReportDetailContentProps) {
  const [printPreview, setPrintPreview] = useState(false);

  function handlePrint() {
    window.print();
  }

  return (
    <div className={cn(printPreview && 'print-preview')}>
      {/* Top actions — hidden in print */}
      <div className="flex items-center justify-between gap-4 mb-6" data-print-hide>
        <Link
          href="/reports"
          className="inline-flex items-center gap-1.5 text-[13px]/[18px] font-[550] text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to Reports
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPrintPreview((prev) => !prev)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px]/[18px] font-[550]',
              'border border-border hover:bg-surface-subtle transition-colors cursor-pointer',
              printPreview ? 'bg-brand-soft text-brand border-brand/30' : 'text-text-secondary'
            )}
          >
            {printPreview ? (
              <>
                <EyeOff className="size-4" aria-hidden="true" />
                Exit Preview
              </>
            ) : (
              <>
                <Eye className="size-4" aria-hidden="true" />
                Print Preview
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px]/[18px] font-[550]',
              'bg-brand text-white hover:bg-brand-hover transition-colors cursor-pointer'
            )}
          >
            <Printer className="size-4" aria-hidden="true" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Stale data warning */}
      <StaleDataWarning
        dataThroughDate={report.cover.dataThroughDate}
        className="mb-6"
      />

      {/* Report content — editorial layout */}
      <article className="max-w-3xl mx-auto">
        <ReportCover data={report.cover} />
        <ExecutiveSummary data={report.executiveSummary} />
        <MetricTable data={report.metrics} />
        <RiskSection data={report.riskAnalysis} />
        <SimulationSection data={report.simulation} />
        <RecommendationSection data={report.recommendation} />
        <ActionPlan data={report.actionPlan} />
        <ReportMetadata data={report.metadata} />
      </article>
    </div>
  );
}
