'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  FileText,
  Printer,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { AppPage, PageHeader } from '@/components/ui/layout';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { FadeIn } from '@/components/motion';
import {
  getReportById,
  type DetailedReportCard,
} from '@/features/reports/adapters/reports.adapter';

export default function ReportDetailPage() {
  const params = useParams();
  const reportId = (params.reportId as string) || 'rpt-memo-001';

  const [report, setReport] = useState<DetailedReportCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getReportById(reportId);
      setReport(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load report document.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getReportById(reportId)
      .then((res) => {
        if (isMounted) {
          setReport(res);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load report document.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [reportId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <ReportDetailSkeleton />;
  if (error) return <ErrorState onRetry={loadData} title="Report Error" description={error} />;
  if (!report) return <EmptyState icon={<FileText />} title="Report Not Found" description="The requested report document could not be retrieved." />;

  const memo = report.decisionMemo || {
    decisionTitle: 'Procure Commercial Oven via 24-Month SME Bank Loan',
    optionsConsidered: ['Outright Cash Purchase (฿200,000)', 'SME Bank Loan (24 mo @ 7.5%)', 'Equipment Lease'],
    selectedScenario: 'SME Bank Loan Financing',
    expectedResult: 'Increases monthly operating revenue capacity by +฿19,600/month after 3-month onboarding.',
    downsideCase: 'Monthly debt service increases by ฿9,200; runway drops to 1.8 months under conservative sales.',
    assumptions: ['Useful life: 5 years', 'Annual maintenance: ฿12,000', '3-month sales velocity'],
    guardrails: ['Minimum cash buffer floor: ฿164,800', 'Maximum affordable capex: ฿120,000'],
    recommendedActions: ['Finalize loan contract', 'Schedule installation for Feb 12', 'Follow up on overdue invoice collection'],
    reviewDate: '2025-04-18',
  };

  return (
    <AppPage>
      <FadeIn>
        <div className="space-y-6 print:space-y-4">
          {/* Header Controls (Hidden in Print) */}
          <div className="print:hidden">
            <PageHeader
              title={
                <div className="flex items-center gap-2.5">
                  <FileText className="size-6 text-brand shrink-0" aria-hidden="true" />
                  <span>{report.title}</span>
                </div>
              }
              description={`Official ${report.type} document prepared for ${report.reportingPeriod}.`}
              badge={<Badge variant="healthy" dot>{report.status.toUpperCase()}</Badge>}
              actions={
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand text-white hover:bg-brand-hover transition-colors shadow-2xs cursor-pointer"
                  >
                    <Printer className="size-3.5" />
                    <span>Browser Print / Save PDF</span>
                  </button>
                </div>
              }
            />
          </div>

          {/* Decision Memo Printable Document Container */}
          <div className="p-6 md:p-8 rounded-xl border border-border bg-surface shadow-xs space-y-6 print:border-none print:shadow-none print:p-0">
            {/* Memo Title & Provenance Header */}
            <div className="border-b border-border pb-4 space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="brand">{report.type.toUpperCase()}</Badge>
                <span className="text-xs text-text-muted">Generated: <strong>{report.createdDate}</strong></span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary">{memo.decisionTitle}</h2>
              <div className="text-xs text-text-muted">
                Reporting Period: <strong className="text-text-primary">{report.reportingPeriod}</strong> · Data Confidence: <strong className="text-text-primary uppercase">{report.confidence}</strong>
              </div>
            </div>

            {/* 1. Decision Statement */}
            <div className="p-4 rounded-xl border border-brand/20 bg-brand-soft/10 space-y-1.5 text-xs">
              <span className="font-bold text-brand uppercase tracking-wider block">Decision Statement</span>
              <p className="text-sm font-semibold text-text-primary leading-relaxed">
                Selected Option: <strong>{memo.selectedScenario}</strong>
              </p>
            </div>

            {/* 2. Options Considered */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">Options Considered</span>
              <ul className="space-y-1.5 text-xs text-text-primary">
                {memo.optionsConsidered.map((opt, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2.5 rounded-lg border border-border bg-surface-subtle/50">
                    <span className="text-brand font-bold">•</span>
                    <span>{opt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Expected Result vs Downside Case */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Expected Positive Result</span>
                <p className="text-text-primary font-medium">{memo.expectedResult}</p>
              </div>

              <div className="p-4 rounded-xl border border-danger/30 bg-danger-soft/10 space-y-1">
                <span className="font-bold text-danger uppercase tracking-wider block">Downside Risk Case</span>
                <p className="text-text-primary font-medium">{memo.downsideCase}</p>
              </div>
            </div>

            {/* 4. Assumptions & Guardrails */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <span className="font-bold text-text-muted uppercase tracking-wider block">Important Assumptions</span>
                <div className="p-3.5 rounded-lg border border-border bg-surface-subtle space-y-1.5 text-text-secondary">
                  {memo.assumptions.map((ass, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-brand font-bold">•</span>
                      <span>{ass}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-text-muted uppercase tracking-wider block">Decision Safety Guardrails</span>
                <div className="p-3.5 rounded-lg border border-border bg-surface-subtle space-y-1.5 text-text-secondary">
                  {memo.guardrails.map((gd, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Shield className="size-3.5 text-brand shrink-0" />
                      <span>{gd}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Recommended Actions & Scheduled Review */}
            <div className="p-4 rounded-xl border border-border bg-surface-subtle space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="font-bold text-text-primary uppercase tracking-wider">Recommended Next Action Plan</span>
                <span>Scheduled Review Date: <strong className="text-text-primary">{memo.reviewDate}</strong></span>
              </div>
              <ul className="space-y-1.5 text-text-secondary">
                {memo.recommendedActions.map((act, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-brand shrink-0" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer Disclaimer */}
            <div className="pt-4 border-t border-border text-[11px] text-text-muted text-center">
              This report is a frontend decision memo generated from Wallflower mock intelligence. Print/save using your browser’s standard print functionality (`window.print()`).
            </div>
          </div>
        </div>
      </FadeIn>
    </AppPage>
  );
}

function ReportDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
