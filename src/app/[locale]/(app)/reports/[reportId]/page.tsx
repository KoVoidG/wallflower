'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Printer,
  ArrowLeft,
  Edit,
  Sparkles,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { AppPage } from '@/components/ui/layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  const router = useRouter();
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
      setError(
        err instanceof Error ? err.message : 'Failed to load report document.',
      );
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
          setError(
            err instanceof Error ? err.message : 'Failed to load report document.',
          );
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
  if (error)
    return (
      <ErrorState
        onRetry={loadData}
        title="Report Error"
        description={error}
      />
    );
  if (!report)
    return (
      <EmptyState
        icon={<FileText />}
        title="Report Not Found"
        description="The requested report document could not be retrieved."
      />
    );

  const memo = report.decisionMemo || {
    decisionTitle: 'Procure Commercial Oven via 24-Month SME Bank Loan',
    optionsConsidered: [
      'Outright Cash Purchase (฿200,000)',
      'SME Bank Loan (24 mo @ 7.5%)',
      'Equipment Lease',
    ],
    selectedScenario: 'SME Bank Loan Financing',
    expectedResult:
      'Increases monthly operating revenue capacity by +฿19,600/month after 3-month onboarding.',
    downsideCase:
      'Monthly debt service increases by ฿9,200; runway drops to 1.8 months under conservative sales.',
    assumptions: [
      'Useful life: 5 years',
      'Annual maintenance: ฿12,000',
      '3-month sales velocity',
    ],
    guardrails: [
      'Minimum cash buffer floor: ฿164,800',
      'Maximum affordable capex: ฿120,000',
    ],
    recommendedActions: [
      'Finalize loan contract',
      'Schedule installation for Feb 12',
      'Follow up on overdue invoice collection',
    ],
    reviewDate: '2025-04-18',
  };

  return (
    <AppPage>
      <FadeIn>
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Document Preview Actions Bar (Outside Document Surface — Hidden during Print) */}
          <div className="print:hidden flex items-center justify-between gap-3 flex-wrap border-b border-border pb-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/reports">
                <ArrowLeft className="size-4" />
                <span>Back to Reports</span>
              </Link>
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.push('/reports')}
              >
                <Edit className="size-3.5" />
                <span>Edit Preferences</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => loadData()}
              >
                <RefreshCw className="size-3.5" />
                <span>Regenerate</span>
              </Button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handlePrint}
              >
                <Printer className="size-3.5" />
                <span>Print / Save as PDF</span>
              </Button>
            </div>
          </div>

          {/* Printable Document Surface (Clean document width & typography, MAX 1 status badge) */}
          <div className="p-6 sm:p-8 rounded-xl border border-border bg-surface shadow-xs space-y-6 print:border-none print:shadow-none print:p-0 print:bg-white text-xs leading-relaxed text-text-primary">
            {/* Document Header (Req 13 — Title, Business Name, Reporting Period, ONE status badge) */}
            <div className="border-b border-border pb-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-brand uppercase tracking-wider">
                  {report.type}
                </span>
                {/* MAX ONE Status Badge (Req 13) */}
                <Badge variant="success">Generated</Badge>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                {report.title}
              </h1>

              {/* Plain Metadata Text (Req 13 — NO badge collection!) */}
              <div className="text-xs text-text-muted flex items-center gap-2 flex-wrap font-medium">
                <span>Business: <strong className="text-text-primary">GreenCafe</strong></span>
                <span>•</span>
                <span>Period: <strong className="text-text-primary">{report.reportingPeriod}</strong></span>
                <span>•</span>
                <span>Audience: <strong className="text-text-primary">{report.audience || 'Business owner'}</strong></span>
                <span>•</span>
                <span>Generated {report.createdDate}</span>
              </div>
            </div>

            {/* 1. Executive Conclusion (Req 15 — Prose narrative with single callout) */}
            <div className="space-y-2">
              <span className="font-bold text-text-primary uppercase tracking-wider text-[11px] block">
                1. Executive Conclusion
              </span>
              <div className="p-4 rounded-xl border border-brand/20 bg-brand-soft/10 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-brand uppercase tracking-wider text-[10px]">
                  <Sparkles className="size-3.5" />
                  <span>Primary Recommendation & Finding</span>
                </div>
                <p className="text-text-primary font-medium leading-relaxed">
                  GreenCafe maintains steady monthly revenue of ฿152,400 with a 2.1-month cash runway. To expand operating capacity without depleting liquid cash reserves below the ฿164,800 safety floor, Wallflower recommends procuring the commercial oven via a 24-month SME Bank Loan while accelerating overdue invoice collection.
                </p>
              </div>
            </div>

            {/* 2. Current Situation & Specifications (Req 16 — Definition Table, NO KPI Cards Grid!) */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <span className="font-bold text-text-primary uppercase tracking-wider text-[11px] block">
                2. Decision & Financial Position Specifications
              </span>
              <div className="border border-border rounded-lg overflow-hidden bg-surface-subtle/30">
                <table className="w-full text-xs text-left">
                  <tbody className="divide-y divide-border/60">
                    <tr className="hover:bg-surface-subtle">
                      <td className="p-3 font-semibold text-text-muted w-1/3">Decision Tested</td>
                      <td className="p-3 font-bold text-text-primary">{memo.decisionTitle}</td>
                    </tr>
                    <tr className="hover:bg-surface-subtle">
                      <td className="p-3 font-semibold text-text-muted">Selected Option</td>
                      <td className="p-3 font-medium text-text-primary">{memo.selectedScenario}</td>
                    </tr>
                    <tr className="hover:bg-surface-subtle">
                      <td className="p-3 font-semibold text-text-muted">Expected Monthly Gain</td>
                      <td className="p-3 font-bold text-brand tabular-nums">+฿19,600 / month</td>
                    </tr>
                    <tr className="hover:bg-surface-subtle">
                      <td className="p-3 font-semibold text-text-muted">Monthly Debt Service</td>
                      <td className="p-3 font-bold text-danger tabular-nums">฿9,200 / month</td>
                    </tr>
                    <tr className="hover:bg-surface-subtle">
                      <td className="p-3 font-semibold text-text-muted">Lowest Projected Cash Runway</td>
                      <td className="p-3 font-semibold text-text-primary tabular-nums">1.8 months (Downside Case)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Expected Effect vs Downside Risk Case (Req 17 — Semantic Color Tokens) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/60">
              <div className="p-4 rounded-xl border border-success/30 bg-success-soft space-y-1">
                <span className="font-bold text-success uppercase tracking-wider block text-[10px]">
                  Expected Positive Outcome
                </span>
                <p className="text-text-primary font-medium">{memo.expectedResult}</p>
              </div>

              <div className="p-4 rounded-xl border border-danger/30 bg-danger-soft/10 space-y-1">
                <span className="font-bold text-danger uppercase tracking-wider block text-[10px]">
                  Downside Risk Conditions
                </span>
                <p className="text-text-primary font-medium">{memo.downsideCase}</p>
              </div>
            </div>

            {/* 4. Risks & Guardrails (Req 18 — Structured Table) */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <span className="font-bold text-text-primary uppercase tracking-wider text-[11px] block">
                3. Key Risks & Safety Mitigation Guardrails
              </span>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-subtle border-b border-border text-text-muted">
                    <tr>
                      <th className="p-2.5 font-semibold">Risk / Condition</th>
                      <th className="p-2.5 font-semibold">Supporting Evidence</th>
                      <th className="p-2.5 font-semibold">Mitigation Guardrail</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    <tr>
                      <td className="p-2.5 font-bold text-text-primary">Overdue Receivables Drag</td>
                      <td className="p-2.5 text-text-secondary">฿21,340 overdue invoice balance</td>
                      <td className="p-2.5 font-semibold text-brand">Offer 2% early settlement discount</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-text-primary">Fixed Debt Overhead Increase</td>
                      <td className="p-2.5 text-text-secondary">฿9,200/mo loan repayment obligation</td>
                      <td className="p-2.5 font-semibold text-brand">Maintain ฿164,800 safe cash floor</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. Recommended Actions (Req 19 — Compact Report Table) */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <span className="font-bold text-text-primary uppercase tracking-wider text-[11px] block">
                4. Recommended Action Plan
              </span>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-subtle border-b border-border text-text-muted">
                    <tr>
                      <th className="p-2.5 font-semibold">Action Objective</th>
                      <th className="p-2.5 font-semibold">Owner</th>
                      <th className="p-2.5 font-semibold">Target Timing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {memo.recommendedActions.map((act, idx) => (
                      <tr key={idx} className="hover:bg-surface-subtle/30">
                        <td className="p-2.5 font-bold text-text-primary">{act}</td>
                        <td className="p-2.5 text-text-secondary">{idx === 0 ? 'General Manager' : idx === 1 ? 'Operations Lead' : 'Business Owner'}</td>
                        <td className="p-2.5 text-text-muted font-medium">{idx === 0 ? 'Before contract commitment' : idx === 1 ? 'Feb 12, 2025' : 'Within 30 days'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 6. Data Basis & Assumptions (Req 21 — Plain Metadata Text at End) */}
            <div className="pt-4 border-t border-border/80 text-[11px] text-text-muted space-y-1">
              <span className="font-bold text-text-primary uppercase tracking-wider text-[10px] block">
                5. Data Basis & Calculation Metadata
              </span>
              <p>
                Calculated using Wallflower Deterministic Engine v1.2.0 • Data through {report.reportingPeriod} • Source classification: Confirmed Actual Baseline.
              </p>
              <p className="italic">
                Assumptions: {memo.assumptions.join(' · ')}
              </p>
            </div>
          </div>
        </div>
      </FadeIn>
    </AppPage>
  );
}

function ReportDetailSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
