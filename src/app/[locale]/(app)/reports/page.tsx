'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  ArrowRight,
  Sparkles,
  FileText,
} from 'lucide-react';
import { AppPage, PageHeader } from '@/components/ui/layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { MonthPicker } from '@/components/ui/month-picker';
import { Dialog } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { FadeIn } from '@/components/motion';
import {
  getReportsData,
  OPINIONATED_REPORT_OPTIONS,
  type CoreReportType,
  type DetailedReportCard,
} from '@/features/reports/adapters/reports.adapter';

// Status Filter Options
const STATUS_FILTER_OPTIONS = [
  { value: 'All', label: 'All reports' },
  { value: 'Generated', label: 'Generated' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Archived', label: 'Archived' },
];

// Target Audience Options
const AUDIENCE_OPTIONS = [
  { value: 'Business owner', label: 'Business owner & leadership' },
  { value: 'Internal management', label: 'Internal decision makers' },
  { value: 'Bank or lender', label: 'Bank or lender' },
  { value: 'Investor', label: 'Investor' },
  { value: 'Accountant or advisor', label: 'Accountant or advisor' },
];

// Simulation Source Options for Decision Memo
const SIMULATION_SOURCE_OPTIONS = [
  { value: 'oven-loan-sim', label: 'Oven Replacement Simulation (Loan Option)' },
  { value: 'hiring-sim', label: 'Barista Hiring vs Capex Comparison' },
  { value: 'rent-increase-sim', label: 'Store Lease Renewal Sensitivity' },
];

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<DetailedReportCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Generate Report Preference Dialog State
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<CoreReportType>('Business Overview');
  const [reportingMonth, setReportingMonth] = useState<Date | null>(new Date(2025, 0, 1));
  const [targetAudience, setTargetAudience] = useState('Business owner');
  const [detailLevel, setDetailLevel] = useState<'concise' | 'detailed'>('concise');
  const [selectedSimulation, setSelectedSimulation] = useState('oven-loan-sim');
  const [reportTitle, setReportTitle] = useState('January 2025 Executive Business Overview');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getReportsData();
      setReports(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load reports data.');
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
          setError(err instanceof Error ? err.message : 'Failed to load reports data.');
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenGenerateDialog = (type?: CoreReportType) => {
    const targetType = type || 'Business Overview';
    setSelectedReportType(targetType);
    const monthStr = reportingMonth ? reportingMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' }) : 'January 2025';
    setReportTitle(`${monthStr} ${targetType}`);
    setIsGenerateDialogOpen(true);
  };

  const handleGenerateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const monthStr = reportingMonth ? reportingMonth.toLocaleString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2025';
    const newReport: DetailedReportCard = {
      id: `rpt-gen-${Date.now()}`,
      title: reportTitle,
      type: selectedReportType,
      reportingPeriod: monthStr,
      createdDate: new Date().toISOString().split('T')[0],
      sourceData: 'Current Business Baseline',
      confidence: 'high',
      status: 'Generated',
      audience: targetAudience,
      detailLevel,
    };

    setReports([newReport, ...reports]);
    setIsGenerateDialogOpen(false);
    // Navigate directly to full report preview
    router.push(`/reports/${newReport.id}`);
  };

  if (loading) return <ReportsPageSkeleton />;
  if (error)
    return (
      <ErrorState
        onRetry={loadData}
        title="Reports Workspace Error"
        description={error}
      />
    );

  // Filter reports for library table
  const filteredReports = reports.filter((r) => {
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.reportingPeriod.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <AppPage>
      <FadeIn>
        <div className="space-y-6">
          {/* Header (Req 3) — Clean Header: Title, Description & Generate Report CTA */}
          <PageHeader
            title={
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight">
                  Reports
                </h1>
              </div>
            }
            description="Generate clear business reports from the information already in Wallflower."
            actions={
              <Button
                variant="primary"
                size="md"
                onClick={() => handleOpenGenerateDialog()}
                className="shadow-2xs"
              >
                <Plus className="size-4" />
                <span>Generate Report</span>
              </Button>
            }
          />

          {/* Current Business Brief (Req 4 — Prominent but Restrained Single Surface) */}
          <div className="p-4 rounded-xl border border-border bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-brand" />
                <h3 className="font-bold text-text-primary text-sm">Current Business Brief</h3>
                <span className="text-xs text-brand font-semibold">• January 2025</span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Latest financial position, risks, decisions and active actions. Updated from the current confirmed baseline.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenGenerateDialog('Business Overview')}
              className="shrink-0"
            >
              <span>View Brief</span>
              <ArrowRight className="size-3.5 ml-1" />
            </Button>
          </div>

          {/* Generated Reports Library (Req 5 & 6 — Compact Inventory Table & Search/Filter Toolbar) */}
          <div className="space-y-3">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 flex-1 max-w-xs relative">
                <Search className="size-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search reports…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-brand"
                />
              </div>

              <div className="w-44">
                <Select
                  label=""
                  value={statusFilter}
                  onChange={(val) => setStatusFilter(val)}
                  options={STATUS_FILTER_OPTIONS}
                />
              </div>
            </div>

            {/* Reports List / Table (Req 5 — Compact list, quiet metadata, MAX 1 badge per row) */}
            <div className="border border-border rounded-xl bg-surface overflow-hidden divide-y divide-border">
              <div className="p-3 bg-surface-subtle border-b border-border flex items-center justify-between text-xs font-bold text-text-primary uppercase tracking-wider">
                <span>Generated Report Library ({filteredReports.length})</span>
                <span className="text-[11px] text-text-muted normal-case font-normal">Click row to view</span>
              </div>

              {filteredReports.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <EmptyState
                    icon={<FileText />}
                    title="No Reports Generated"
                    description="Generate a report and Wallflower will assemble it from your current business information."
                    action={
                      <Button variant="primary" size="sm" onClick={() => handleOpenGenerateDialog()}>
                        <Plus className="size-3.5" />
                        <span>Generate Report</span>
                      </Button>
                    }
                  />
                </div>
              ) : (
                filteredReports.map((rpt) => (
                  <div
                    key={rpt.id}
                    onClick={() => router.push(`/reports/${rpt.id}`)}
                    className="p-3.5 sm:p-4 hover:bg-surface-subtle/50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs select-none"
                  >
                    <div className="space-y-1 min-w-0">
                      <h4 className="font-bold text-text-primary text-sm hover:text-brand transition-colors truncate">
                        {rpt.title}
                      </h4>
                      {/* Quiet Metadata Row (Req 5 & 7 — NO badge for type/audience/period!) */}
                      <div className="text-text-muted text-[11px] flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-text-primary">{rpt.type}</span>
                        <span>•</span>
                        <span>Period: {rpt.reportingPeriod}</span>
                        <span>•</span>
                        <span>Generated {rpt.createdDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* MAX ONE Status Badge per row (Req 5 & 7) */}
                      <Badge
                        variant={
                          rpt.status === 'Generated' || rpt.status === 'final'
                            ? 'success'
                            : rpt.status === 'Draft' || rpt.status === 'draft'
                            ? 'warning'
                            : 'neutral'
                        }
                      >
                        {rpt.status === 'final' ? 'Generated' : rpt.status}
                      </Badge>

                      <span className="text-brand font-semibold flex items-center gap-1 text-xs">
                        <span>View</span>
                        <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Generate Report Centered Preference Dialog (Req 8 & 9 — NO side-by-side builder, NO miniature preview) */}
      <Dialog
        open={isGenerateDialogOpen}
        onClose={() => setIsGenerateDialogOpen(false)}
        title="Generate Business Report"
        size="md"
      >
        <form onSubmit={handleGenerateSubmit} className="space-y-4 text-xs">
          {/* 1. Report Type Selector (Req 8 — Selectable Rows for 4 Opinionated Types) */}
          <div className="space-y-2">
            <label className="font-bold text-text-primary uppercase tracking-wider text-[11px] block">
              Select Report Type *
            </label>
            <div className="border border-border rounded-xl divide-y divide-border overflow-hidden bg-surface">
              {OPINIONATED_REPORT_OPTIONS.map((opt) => {
                const isSelected = selectedReportType === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      setSelectedReportType(opt.id);
                      const monthStr = reportingMonth
                        ? reportingMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })
                        : 'January 2025';
                      setReportTitle(`${monthStr} ${opt.name}`);
                    }}
                    className={`p-3 transition-colors cursor-pointer space-y-0.5 ${
                      isSelected ? 'bg-brand-soft/15 border-l-4 border-l-brand' : 'hover:bg-surface-subtle/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text-primary text-xs">{opt.name}</span>
                      {isSelected && <span className="text-brand font-bold text-[11px]">Selected</span>}
                    </div>
                    <p className="text-[11px] text-text-muted leading-relaxed">{opt.purpose}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Preferences Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
            <div className="space-y-1">
              <MonthPicker
                label="Reporting Period *"
                value={reportingMonth}
                onChange={(dt) => setReportingMonth(dt)}
              />
            </div>

            <div className="space-y-1">
              <Select
                label="Target Audience *"
                value={targetAudience}
                onChange={(val) => setTargetAudience(val)}
                options={AUDIENCE_OPTIONS}
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <Select
                label="Detail Level *"
                value={detailLevel}
                onChange={(val) => setDetailLevel(val as 'concise' | 'detailed')}
                options={[
                  { value: 'concise', label: 'Concise (High-level summary for quick decision review)' },
                  { value: 'detailed', label: 'Detailed (Comprehensive breakdown with full evidence & data basis)' },
                ]}
              />
            </div>

            {/* Conditional Simulation Source Choice for Simulation Decision Memo */}
            {selectedReportType === 'Simulation Decision Memo' && (
              <div className="space-y-1 sm:col-span-2">
                <Select
                  label="Select Simulation Source *"
                  value={selectedSimulation}
                  onChange={(val) => setSelectedSimulation(val)}
                  options={SIMULATION_SOURCE_OPTIONS}
                />
              </div>
            )}

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-text-primary block">Report Title</label>
              <input
                type="text"
                required
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full px-3 py-1.5 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsGenerateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              <Sparkles className="size-3.5" />
              <span>Generate Report</span>
            </Button>
          </div>
        </form>
      </Dialog>
    </AppPage>
  );
}

function ReportsPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-20 w-full" />
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
