// src/app/[locale]/(app)/reports/page.tsx
import {
  FileText,
  Plus,
  Calendar,
  Clock,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { getReportHistory, getReport } from '@/features/reports/adapters/reports.adapter';

import { PageContextualHint } from '@/components/app-shell/product-tour';

export default async function ReportsPage() {
  const reports = await getReportHistory();
  // Load the latest report for the featured section
  const latestReport = reports.length > 0 ? await getReport(reports[0].id) : null;

  return (
    <div data-tour="reports-view" className="flex flex-col gap-6">
      {/* Page header */}
      <header className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[28px]/[36px] font-[650] text-text-primary">
            Reports
          </h1>
          <p className="text-[15px]/[24px] text-text-secondary">
            Decision intelligence reports for your business.
          </p>
        </div>
        <button
          type="button"
          className={cn(
            'inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-4 py-2.5 text-[13px]/[18px] font-[600]',
            'bg-brand text-white hover:bg-brand-hover transition-colors cursor-pointer self-start sm:self-center'
          )}
        >
          <Plus className="size-4" aria-hidden="true" />
          Generate Report
        </button>
      </header>

      {/* First-visit Contextual Hint */}
      <PageContextualHint
        hintKey="reports"
        title="Reports Guide"
        message="Review decision intelligence reports or click 'Generate Report' to create a print-safe summary of risks and recommendations."
      />

      {/* Empty state */}
      {reports.length === 0 ? (
        <EmptyState
          icon={<FileText />}
          title="No reports yet"
          description="Generate your first decision intelligence report to get actionable insights about your business. Reports combine health assessments, risk analysis, and simulation outcomes into a comprehensive business narrative."
          action={
            <button
              type="button"
              className={cn(
                'inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-4 py-2.5 text-[13px]/[18px] font-[600]',
                'bg-brand text-white hover:bg-brand-hover transition-colors cursor-pointer'
              )}
            >
              <Plus className="size-4" aria-hidden="true" />
              Generate First Report
            </button>
          }
        />
      ) : (
        <>
          {/* Featured / latest report */}
          {latestReport && (
            <section
              className="rounded-[var(--radius-lg)] border border-brand/15 bg-brand-soft/15 p-6 md:p-8"
              aria-label="Latest report"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="brand">Latest</Badge>
                      <Badge variant="success" dot>Ready</Badge>
                    </div>
                    <h2 className="text-[20px]/[28px] font-[600] text-text-primary mt-1">
                      {latestReport.cover.reportTitle}
                    </h2>
                  </div>
                </div>

                {/* Key finding */}
                <p className="text-[15px]/[26px] text-text-primary max-w-[640px]">
                  {latestReport.executiveSummary.keyTakeaway}
                </p>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" aria-hidden="true" />
                    Generated {latestReport.cover.generatedDate}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5" aria-hidden="true" />
                    Data through {latestReport.cover.dataThroughDate}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FileText className="size-3.5" aria-hidden="true" />
                    {latestReport.cover.businessName}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border/40">
                  <Link
                    href={`/reports/${latestReport.id}`}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-4 py-2.5',
                      'bg-brand text-white text-[14px] font-[600]',
                      'hover:bg-brand-hover transition-colors cursor-pointer'
                    )}
                  >
                    Preview report
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                  <button
                    type="button"
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-4 py-2.5',
                      'border border-border text-text-primary text-[14px] font-[550]',
                      'hover:bg-surface-subtle transition-colors cursor-pointer'
                    )}
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Report library */}
          <section aria-label="Report library" className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px]/[24px] font-[600] text-text-primary">
                All reports
              </h2>
              <span className="text-[13px] text-text-muted">
                {reports.length} report{reports.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {reports.map((report, idx) => (
                <Link
                  key={report.id}
                  href={`/reports/${report.id}`}
                  className={cn(
                    'group rounded-[var(--radius-md)] border border-border bg-surface p-4 md:p-5',
                    'hover:border-brand/30 hover:bg-surface-subtle/50 transition-colors cursor-pointer',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-2 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[15px]/[22px] font-[600] text-text-primary truncate">
                          {report.name}
                        </h3>
                        {idx === 0 && <Badge variant="success" dot>Ready</Badge>}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-text-muted">
                        <span>{report.businessName}</span>
                        <span>·</span>
                        <span>{report.generatedDate}</span>
                        <span>·</span>
                        <span className="font-[550] text-text-secondary">{report.scenarioType}</span>
                      </div>

                      {/* Mock key finding for context */}
                      <p className="text-[13px]/[20px] text-text-secondary line-clamp-1 mt-0.5">
                        {getReportFinding(report.id)}
                      </p>
                    </div>

                    <ArrowRight className="size-4 text-text-muted group-hover:text-brand shrink-0 mt-1 transition-colors" aria-hidden="true" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Prototype notice */}
          <div className="flex items-start gap-2 px-4 py-3 rounded-[var(--radius-md)] bg-surface-subtle border border-border/60">
            <AlertTriangle className="size-3.5 mt-0.5 shrink-0 text-text-muted" aria-hidden="true" />
            <p className="text-[12px]/[18px] text-text-muted">
              Reports use prototype calculations and mock business data. Export and sharing are simulated.
              Generated content should not be treated as validated professional advice.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function getReportFinding(reportId: string): string {
  const findings: Record<string, string> = {
    'rpt-001': 'Expense growth outpacing revenue gains. Action on cost control within 30 days recommended.',
    'rpt-002': 'Hiring 2 employees reduces expected runway from 4.2 to 2.9 months.',
    'rpt-003': 'Q4 revenue grew 5.2% but profit margin declined 2.1 percentage points.',
  };
  return findings[reportId] || 'Report contains detailed business analysis and recommendations.';
}
