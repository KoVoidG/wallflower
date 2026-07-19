// src/app/[locale]/(app)/reports/page.tsx
import { FileText, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { getReportHistory } from '@/features/reports/adapters/reports.adapter';

export default async function ReportsPage() {
  const reports = await getReportHistory();

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px]/[36px] font-[650] text-text-primary">
            Reports
          </h1>
          <p className="text-[15px]/[24px] text-text-secondary mt-1">
            Decision intelligence reports for your business.
          </p>
        </div>

        <button
          type="button"
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[13px]/[18px] font-[550]',
            'bg-brand text-white hover:bg-brand-hover transition-colors cursor-pointer'
          )}
        >
          <Plus className="size-4" aria-hidden="true" />
          Generate New Report
        </button>
      </div>

      {/* Report list or empty state */}
      {reports.length === 0 ? (
        <EmptyState
          icon={<FileText />}
          title="No reports yet"
          description="Generate your first decision intelligence report to get actionable insights about your business."
          action={
            <button
              type="button"
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[13px]/[18px] font-[550]',
                'bg-brand text-white hover:bg-brand-hover transition-colors cursor-pointer'
              )}
            >
              <Plus className="size-4" aria-hidden="true" />
              Generate First Report
            </button>
          }
        />
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <Link
              key={report.id}
              href={`/reports/${report.id}`}
              className={cn(
                'block rounded-[var(--radius-md)] border border-border bg-surface p-4',
                'hover:border-brand/30 hover:bg-surface-subtle transition-colors cursor-pointer',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                    <FileText className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-[15px]/[24px] font-[600] text-text-primary">
                      {report.name}
                    </h2>
                    <p className="text-[13px]/[20px] text-text-muted mt-0.5">
                      {report.businessName} · {report.generatedDate}
                    </p>
                  </div>
                </div>

                <Badge variant="info">{report.scenarioType}</Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
