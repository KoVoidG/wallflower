'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  ListFilter,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/navigation';
import { AppPage, PageHeader } from '@/components/ui/layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { FadeIn } from '@/components/motion';
import {
  getReportsData,
  type DetailedReportCard,
  type ReportType,
} from '@/features/reports/adapters/reports.adapter';

export default function ReportsPage() {
  const [reports, setReports] = useState<DetailedReportCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<ReportType | 'All'>('All');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getReportsData();
      setReports(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load report documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getReportsData()
      .then((res) => {
        if (isMounted) {
          setReports(res);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load report documents.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <ReportsPageSkeleton />;
  if (error) return <ErrorState onRetry={loadData} title="Reports Error" description={error} />;
  if (reports.length === 0) return <EmptyState icon={<FileText />} title="No Reports Generated" description="Generate a decision memo or cash forecast to populate your decision reports." />;

  const filteredReports = typeFilter === 'All' ? reports : reports.filter((r) => r.type === typeFilter);

  return (
    <AppPage>
      <FadeIn>
        <div className="space-y-6">
          {/* Page Header */}
          <PageHeader
            title={
              <div className="flex items-center gap-2.5">
                <FileText className="size-6 text-brand shrink-0" aria-hidden="true" />
                <span>Decision Intelligence Reports</span>
              </div>
            }
            description="Structured executive reports, decision memos, and forward forecasts grounded in business data."
            badge={<Badge variant="healthy" dot>{reports.length} Reports</Badge>}
            actions={
              <div className="flex items-center gap-2">
                <Link
                  href="/reports/rpt-memo-001"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand text-white hover:bg-brand-hover transition-colors shadow-2xs"
                >
                  <Plus className="size-3.5" />
                  <span>Generate Decision Memo</span>
                </Link>
              </div>
            }
          />

          {/* Report Type Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-border bg-surface text-xs">
            <div className="flex items-center gap-1.5">
              <ListFilter className="size-3.5 text-text-muted" />
              <span className="font-semibold text-text-muted">Report Type:</span>
              {(['All', 'Decision memo', 'Executive summary', 'Cash-flow forecast', 'Risk report', 'Simulation comparison'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer',
                    typeFilter === t ? 'bg-brand text-white' : 'text-text-muted hover:text-text-primary'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Report Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReports.map((report) => (
              <Link key={report.id} href={`/reports/${report.id}`} className="block">
                <Card className="p-5 space-y-3 border-border hover:border-brand/40 transition-colors h-full flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant={report.type === 'Decision memo' ? 'brand' : 'healthy'}>{report.type}</Badge>
                      <Badge variant={report.status === 'final' ? 'success' : 'default'} className="capitalize">{report.status}</Badge>
                    </div>

                    <h3 className="text-base font-bold text-text-primary leading-snug">{report.title}</h3>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border/60 text-xs text-text-muted">
                    <div className="flex items-center justify-between">
                      <span>Reporting Period: <strong className="text-text-primary">{report.reportingPeriod}</strong></span>
                      <span>Created: <strong>{report.createdDate}</strong></span>
                    </div>
                    <div>Source Data: <strong className="text-text-primary truncate block">{report.sourceData}</strong></div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-text-muted">Confidence: <strong className="text-text-primary uppercase">{report.confidence}</strong></span>
                    <span className="text-brand font-semibold hover:underline inline-flex items-center gap-1">
                      <span>View Document</span>
                      <ArrowRight className="size-3" />
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </FadeIn>
    </AppPage>
  );
}

function ReportsPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}
