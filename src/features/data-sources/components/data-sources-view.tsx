'use client';

import { useState, useEffect } from 'react';
import {
  Database,
  Plus,
  Edit,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppPage, PageHeader } from '@/components/ui/layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Dialog } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { FadeIn } from '@/components/motion';
import {
  getDataWorkspaceData,
  type DataWorkspaceData,
  type DataSourceItem,
  type MonthlySnapshotHistory,
} from '../adapters/data-sources.adapter';
import { OperationalIntegrationsView } from '@/features/integrations/components/operational-integrations-view';

const CATEGORY_FILTER_OPTIONS = [
  { value: 'All', label: 'All categories' },
  { value: 'financial_summary', label: 'Financial Summary' },
  { value: 'cash_flow', label: 'Cash-Flow Activity' },
  { value: 'operations', label: 'Business Operations' },
  { value: 'assumptions', label: 'Decisions & Assumptions' },
];

export function DataSourcesView() {
  const [data, setData] = useState<DataWorkspaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'sources' | 'gaps' | 'connections' | 'operational'>('sources');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [needsReviewOnly, setNeedsReviewOnly] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState<string>('ds-001');

  const [showReadinessBasis, setShowReadinessBasis] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addMode, setAddMode] = useState<'choose' | 'manual' | 'import' | 'sample'>('choose');

  const [manualMonth, setManualMonth] = useState<Date | null>(new Date(2025, 0, 1));
  const [manualRevenue, setManualRevenue] = useState('152400');
  const [manualExpenses, setManualExpenses] = useState('164800');
  const [manualCash, setManualCash] = useState('245000');
  const [manualReceivables, setManualReceivables] = useState('53340');
  const [manualPayables, setManualPayables] = useState('32100');
  const [manualBuffer, setManualBuffer] = useState('164800');

  const [showConfirmStep, setShowConfirmStep] = useState(false);

  const [importedFile, setImportedFile] = useState<{ name: string; size: number; rows: number } | null>(null);
  const [importStep, setImportStep] = useState<'upload' | 'mapping' | 'preview'>('upload');
  const [colAmountMapping, setColAmountMapping] = useState('Invoice Total');
  const [colCustomerMapping, setColCustomerMapping] = useState('Customer Name');
  const [colDueDateMapping, setColDueDateMapping] = useState('Payment Due');
  const [colStatusMapping, setColStatusMapping] = useState('Status');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDataWorkspaceData();
      setData(res);
      const realSources = res.sources.filter((s) => !s.isExternalIntegration);
      if (realSources.length > 0) {
        setSelectedSourceId(realSources[0].id);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Failed to load data workspace.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getDataWorkspaceData()
      .then((res) => {
        if (isMounted) {
          setData(res);
          const realSources = res.sources.filter((s) => !s.isExternalIntegration);
          if (realSources.length > 0) {
            setSelectedSourceId(realSources[0].id);
          }
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load data workspace.',
          );
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const formatTHB = (val: string) => {
    const num = Number(val);
    if (isNaN(num)) return '฿0';
    return `฿${num.toLocaleString('en-US')}`;
  };

  const handleSaveManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmStep(true);
  };

  const handleFinalConfirmManual = () => {
    if (!data || !manualMonth) return;
    const periodStr = `${manualMonth.getFullYear()}-${String(manualMonth.getMonth() + 1).padStart(2, '0')}`;

    const newHistoryItem: MonthlySnapshotHistory = {
      period: periodStr,
      revenue: Number(manualRevenue) || 0,
      expenses: Number(manualExpenses) || 0,
      usableCash: Number(manualCash) || 0,
      receivables: Number(manualReceivables) || 0,
      quality: 'actual',
      status: 'verified',
    };

    const updatedHistory = [
      newHistoryItem,
      ...data.history.filter((h) => h.period !== periodStr),
    ];
    setData({
      ...data,
      summary: {
        ...data.summary,
        latestReportingPeriod: periodStr,
        lastUpdated: new Date().toISOString().split('T')[0],
      },
      history: updatedHistory,
    });
    setShowConfirmStep(false);
    setIsAddModalOpen(false);
    setAddMode('choose');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportedFile({
      name: file.name,
      size: Math.round(file.size / 1024),
      rows: 38,
    });
    setImportStep('mapping');
  };

  const handleConfirmImport = () => {
    if (!data || !importedFile) return;
    const newSourceItem: DataSourceItem = {
      id: `ds-${Date.now()}`,
      name: `Imported ${importedFile.name}`,
      provider: 'spreadsheet',
      status: 'connected',
      lastSync: new Date().toISOString().split('T')[0],
      reportingPeriod: 'Jan 2025',
      valuesContributed: importedFile.rows,
      quality: 'actual',
      category: 'cash_flow',
      description: `Parsed ${importedFile.rows} rows from ${importedFile.name} with mapped field validations.`,
      provenanceNote: `Imported File (${importedFile.name})`,
      affectedFeatures: ['Cash Flow', 'Risk Center', 'Action Plan', 'Reports'],
      issueCount: 0,
      issuesList: [],
    };

    setData({
      ...data,
      sources: [newSourceItem, ...data.sources],
    });
    setSelectedSourceId(newSourceItem.id);
    setIsAddModalOpen(false);
    setAddMode('choose');
    setImportedFile(null);
    setImportStep('upload');
  };

  if (loading) return <DataWorkspaceSkeleton />;
  if (error)
    return (
      <ErrorState
        onRetry={loadData}
        title="Data Workspace Error"
        description={error}
      />
    );
  if (!data)
    return (
      <EmptyState
        icon={<Database />}
        title="No Data Found"
        description="Record or import business data to configure your workspace."
      />
    );

  const { summary, sources, missingImpacts } = data;

  const realActiveSources = sources.filter((s) => !s.isExternalIntegration);
  const externalConnections = sources.filter((s) => s.isExternalIntegration);

  const filteredSources = realActiveSources.filter((s) => {
    if (selectedCategory !== 'All' && s.category !== selectedCategory) return false;
    if (needsReviewOnly && s.status !== 'stale' && !s.issueCount) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.reportingPeriod.toLowerCase().includes(q) ||
        s.provider.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selectedSource =
    realActiveSources.find((s) => s.id === selectedSourceId) ||
    filteredSources[0] ||
    realActiveSources[0];

  return (
    <AppPage>
      <FadeIn>
        <div className="space-y-6">
          <PageHeader
            title={
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight">
                  Data & Connections
                </h1>
              </div>
            }
            description="Manage the business information Wallflower uses for analysis and forecasts."
            actions={
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setAddMode('choose');
                  setIsAddModalOpen(true);
                }}
                className="shadow-2xs cursor-pointer"
              >
                <Plus className="size-4" />
                <span>Add Data</span>
              </Button>
            }
          />

          <div className="text-xs text-text-secondary space-y-1 pb-2 border-b border-border/80">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-3">
                <span>
                  Current baseline: <strong className="text-text-primary font-bold">{summary.latestReportingPeriod}</strong>
                </span>
                <span className="text-border">•</span>
                <span>
                  <strong className="text-text-primary font-semibold">{realActiveSources.length}</strong> active sources
                </span>
                <span className="text-border">•</span>
                <span className="text-amber-600 dark:text-amber-400 font-semibold">
                  {realActiveSources.filter((s) => s.status === 'stale' || s.issueCount).length} needs review
                </span>
                <span className="text-border">•</span>
                <span>
                  <strong className="text-text-primary">{summary.estimatedValueCount}</strong> estimated values
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowReadinessBasis(!showReadinessBasis)}
                className="text-text-muted hover:text-text-primary font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Data readiness: {summary.completenessScore}%</span>
                {showReadinessBasis ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
              </button>
            </div>

            {showReadinessBasis && (
              <div className="p-3 rounded-lg border border-border/60 bg-surface-subtle/50 text-[11px] text-text-muted space-y-1 mt-1">
                <span className="font-semibold text-text-primary block">Readiness Score Basis ({summary.completenessScore}%)</span>
                <p>
                  Calculated based on: 1) Confirmed monthly baseline availability, 2) Required core revenue & expense input coverage, 3) Verified receivable record mappings, and 4) Ratio of actual vs estimated values.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border-b border-border pb-3">
            {[
              { id: 'sources', label: `Sources (${realActiveSources.length})` },
              { id: 'gaps', label: `Data Gaps (${missingImpacts.length})` },
              { id: 'connections', label: `Connections (${externalConnections.length})` },
              { id: 'operational', label: `Operational Data` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as 'sources' | 'gaps' | 'connections' | 'operational')}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer',
                  activeTab === tab.id
                    ? 'bg-brand-soft text-brand border-brand/30 shadow-2xs'
                    : 'bg-surface text-text-secondary border-border hover:bg-surface-subtle hover:text-text-primary',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'sources' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 flex-1 max-w-xs relative">
                  <Search className="size-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search sources…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-brand"
                  />
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="w-48">
                    <Select
                      label=""
                      value={selectedCategory}
                      onChange={(val) => setSelectedCategory(val)}
                      options={CATEGORY_FILTER_OPTIONS}
                    />
                  </div>

                  <label className="flex items-center gap-1.5 text-xs text-text-primary cursor-pointer select-none font-medium">
                    <input
                      type="checkbox"
                      checked={needsReviewOnly}
                      onChange={(e) => setNeedsReviewOnly(e.target.checked)}
                      className="size-4 rounded accent-brand border-border cursor-pointer"
                    />
                    <span>Needs review only</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-6 items-start">
                <div className="border border-border rounded-xl bg-surface overflow-hidden divide-y divide-border">
                  <div className="p-3 bg-surface-subtle border-b border-border flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                      Data Inventory ({filteredSources.length})
                    </span>
                    <span className="text-[11px] text-text-muted">Select row</span>
                  </div>

                  {filteredSources.length === 0 ? (
                    <div className="p-6 text-center text-xs text-text-muted">
                      No data sources match the current filter.
                    </div>
                  ) : (
                    filteredSources.map((src) => {
                      const isSelected = src.id === selectedSource?.id;
                      const hasIssue = src.status === 'stale' || (src.issueCount && src.issueCount > 0);

                      return (
                        <div
                          key={src.id}
                          onClick={() => setSelectedSourceId(src.id)}
                          className={cn(
                            'p-3 transition-colors cursor-pointer space-y-1 select-none',
                            isSelected
                              ? 'bg-brand-soft/15 border-l-4 border-l-brand'
                              : 'hover:bg-surface-subtle/50',
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-text-primary truncate">
                              {src.name}
                            </span>
                            <Badge
                              variant={
                                hasIssue
                                  ? 'warning'
                                  : src.provider === 'sample'
                                    ? 'info'
                                    : 'success'
                              }
                              className="text-[10px] py-0 shrink-0"
                            >
                              {hasIssue
                                ? 'Needs review'
                                : src.provider === 'sample'
                                  ? 'Sample'
                                  : 'Ready'}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-text-muted">
                            <span>
                              {src.reportingPeriod} • <span className="capitalize">{src.provider} entry</span>
                            </span>
                            {hasIssue && (
                              <span className="text-danger font-semibold flex items-center gap-1">
                                <AlertTriangle className="size-3" />
                                <span>1 issue</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {selectedSource ? (
                  <div className="p-5 sm:p-6 rounded-xl border border-border bg-surface shadow-2xs space-y-5">
                    <div className="border-b border-border pb-4 space-y-3">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
                              {selectedSource.name}
                            </h3>
                            <Badge
                              variant={
                                selectedSource.status === 'stale' || selectedSource.issueCount
                                  ? 'warning'
                                  : 'success'
                              }
                              dot
                            >
                              {selectedSource.status === 'stale' || selectedSource.issueCount
                                ? 'Needs Review'
                                : 'Ready & Confirmed'}
                            </Badge>
                          </div>

                          <div className="text-xs text-text-muted font-medium">
                            <span className="capitalize">{selectedSource.provider} entry</span> • Period: {selectedSource.reportingPeriod} • Updated {selectedSource.lastSync}
                          </div>
                        </div>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setAddMode('manual');
                            setIsAddModalOpen(true);
                          }}
                        >
                          <Edit className="size-3.5" />
                          <span>
                            {selectedSource.issueCount ? 'Review Issue' : 'Replace Data'}
                          </span>
                        </Button>
                      </div>

                      <p className="text-xs text-text-secondary leading-relaxed">
                        {selectedSource.description}
                      </p>
                    </div>

                    <div className="border-b border-border pb-4 space-y-2 text-xs">
                      <span className="font-bold text-text-primary uppercase tracking-wider text-[11px] block">
                        Source Specifications
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                        <div className="flex items-center justify-between py-1 border-b border-border/40">
                          <span className="text-text-muted">Reporting period</span>
                          <span className="font-semibold text-text-primary">{selectedSource.reportingPeriod}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-border/40">
                          <span className="text-text-muted">Records contributed</span>
                          <span className="font-semibold text-text-primary tabular-nums">{selectedSource.valuesContributed}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-border/40">
                          <span className="text-text-muted">Current baseline</span>
                          <span className="font-semibold text-brand">Yes</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-border/40">
                          <span className="text-text-muted">Data classification</span>
                          <span className="font-semibold text-text-primary capitalize">{selectedSource.quality}</span>
                        </div>
                      </div>
                    </div>

                    {selectedSource.issuesList && selectedSource.issuesList.length > 0 && (
                      <div className="p-4 rounded-xl border border-danger/30 bg-danger-soft/10 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-danger uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                            <AlertTriangle className="size-4" />
                            <span>1 Validation Issue Requires Correction</span>
                          </span>
                          <Badge variant="warning" className="text-[9px]">Warning</Badge>
                        </div>
                        <ul className="space-y-1 text-text-primary font-medium">
                          {selectedSource.issuesList.map((iss, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-danger">•</span>
                              <span>{iss}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="border-b border-border pb-4 space-y-1.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-text-primary">Used by:</span>
                        <span className="text-text-secondary font-medium">
                          {selectedSource.affectedFeatures?.join(' · ') || 'Dashboard · Cash Flow'}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted leading-relaxed">
                        Replacing this source updates future analysis and forecasts. Existing generated reports and simulations remain historical snapshots.
                      </p>
                    </div>

                    <div className="text-xs text-text-muted space-y-1">
                      <span className="font-semibold text-text-primary block">Provenance & Storage</span>
                      <p>{selectedSource.provenanceNote || 'Manual Entry / Local Prototype Baseline'}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border flex-wrap gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setAddMode('manual');
                            setIsAddModalOpen(true);
                          }}
                        >
                          <Edit className="size-3.5" />
                          <span>Edit Source</span>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (!data) return;
                            setData({
                              ...data,
                              summary: { ...data.summary, latestReportingPeriod: selectedSource.reportingPeriod },
                            });
                          }}
                        >
                          <span>Set as Current Baseline</span>
                        </Button>
                      </div>

                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          if (!data) return;
                          setData({
                            ...data,
                            sources: data.sources.filter((s) => s.id !== selectedSource.id),
                          });
                        }}
                      >
                        <Trash2 className="size-3.5" />
                        <span>Remove Source</span>
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {activeTab === 'gaps' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-border bg-surface shadow-2xs space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-text-primary text-sm">Prioritised Data Gaps</h3>
                    <p className="text-text-muted text-[11px]">
                      Adding missing information improves forecasting precision and decision simulation fidelity.
                    </p>
                  </div>
                  <Badge variant="warning">{missingImpacts.length} Gaps Identified</Badge>
                </div>

                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-left text-xs text-text-primary">
                    <thead className="bg-surface-subtle border-b border-border text-text-muted">
                      <tr>
                        <th className="p-3 font-semibold">Missing Data</th>
                        <th className="p-3 font-semibold">Why It Matters</th>
                        <th className="p-3 font-semibold">Affected Features</th>
                        <th className="p-3 font-semibold">Priority</th>
                        <th className="p-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {missingImpacts.map((gap, idx) => (
                        <tr key={gap.missingField} className="hover:bg-surface-subtle/30 transition-colors">
                          <td className="p-3 font-bold text-text-primary min-w-[180px]">
                            {gap.missingField}
                          </td>
                          <td className="p-3 text-text-secondary leading-relaxed max-w-xs">
                            {gap.impactDescription}
                          </td>
                          <td className="p-3 text-text-muted text-[11px] min-w-[160px]">
                            {gap.improvesFeatures.join(' · ')}
                          </td>
                          <td className="p-3">
                            <Badge variant={idx === 0 ? 'warning' : 'neutral'} className="text-[10px] py-0">
                              {idx === 0 ? 'High' : 'Medium'}
                            </Badge>
                          </td>
                          <td className="p-3 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setAddMode('import');
                                setIsAddModalOpen(true);
                              }}
                            >
                              <span>Add Data</span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'connections' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-border bg-surface shadow-2xs space-y-3 text-xs">
                <div>
                  <h3 className="font-bold text-text-primary text-sm">External Accounting & Spreadsheet Connections</h3>
                  <p className="text-text-muted text-[11px]">
                    Direct integrations for automated financial sync. Labelled honestly according to prototype availability.
                  </p>
                </div>

                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-left text-xs text-text-primary">
                    <thead className="bg-surface-subtle border-b border-border text-text-muted">
                      <tr>
                        <th className="p-3 font-semibold">Connection</th>
                        <th className="p-3 font-semibold">Purpose</th>
                        <th className="p-3 font-semibold">Availability</th>
                        <th className="p-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {externalConnections.map((conn) => (
                        <tr key={conn.id} className="hover:bg-surface-subtle/30 transition-colors">
                          <td className="p-3 font-bold text-text-primary">
                            {conn.name}
                          </td>
                          <td className="p-3 text-text-secondary leading-relaxed">
                            {conn.description}
                          </td>
                          <td className="p-3">
                            <Badge variant="neutral" className="text-[10px] py-0">
                              Coming later
                            </Badge>
                          </td>
                          <td className="p-3 text-right">
                            <span className="text-[11px] text-text-muted italic">
                              Connection available later
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'operational' && (
            <div className="h-[600px] border border-border/60 rounded-xl overflow-hidden bg-surface shadow-2xs">
              <OperationalIntegrationsView />
            </div>
          )}

          <div className="text-[11px] text-text-muted text-center pt-2">
            Imported prototype data is stored locally in this browser. External integrations are not connected to server databases.
          </div>
        </div>
      </FadeIn>

      <Dialog
        open={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setAddMode('choose');
          setShowConfirmStep(false);
        }}
        title="Add Business Data"
        size="lg"
      >
        <div className="space-y-4 text-xs">
          {addMode === 'choose' && (
            <div className="space-y-3">
              <span className="font-bold text-text-primary uppercase tracking-wider text-[11px] block">
                Select Data Source Method
              </span>

              <div className="border border-border rounded-xl bg-surface divide-y divide-border">
                <div
                  onClick={() => setAddMode('manual')}
                  className="p-3.5 hover:bg-brand-soft/10 transition-colors cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <span className="font-bold text-text-primary group-hover:text-brand block">Monthly Financial Summary</span>
                    <span className="text-text-muted text-[11px]">Enter revenue, expenses, usable cash reserves, and receivables.</span>
                  </div>
                  <Button variant="outline" size="sm">Select</Button>
                </div>

                <div
                  onClick={() => setAddMode('import')}
                  className="p-3.5 hover:bg-brand-soft/10 transition-colors cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <span className="font-bold text-text-primary group-hover:text-brand block">Import Receivables or Payables (CSV)</span>
                    <span className="text-text-muted text-[11px]">Upload local CSV files with column mapping, preview, and validation.</span>
                  </div>
                  <Button variant="outline" size="sm">Select</Button>
                </div>

                <div
                  onClick={() => {
                    setAddMode('sample');
                    if (data) {
                      setData({
                        ...data,
                        summary: { ...data.summary, completenessScore: 100 },
                      });
                      setIsAddModalOpen(false);
                    }
                  }}
                  className="p-3.5 hover:bg-brand-soft/10 transition-colors cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <span className="font-bold text-text-primary group-hover:text-brand block">Use Sample Baseline Data</span>
                    <span className="text-text-muted text-[11px]">Restore preconfigured SME retail benchmark data baseline.</span>
                  </div>
                  <Button variant="outline" size="sm">Restore</Button>
                </div>
              </div>
            </div>
          )}

          {addMode === 'manual' && !showConfirmStep && (
            <form onSubmit={handleSaveManualEntry} className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="font-bold text-text-primary uppercase tracking-wider text-[11px]">
                  Monthly Financial Summary Entry
                </span>
                <button
                  type="button"
                  onClick={() => setAddMode('choose')}
                  className="text-brand hover:underline font-semibold text-[11px] cursor-pointer"
                >
                  ← Back to Choice
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-primary block">Reporting Month *</label>
                <DatePicker
                  value={manualMonth || undefined}
                  onChange={(dt: Date) => setManualMonth(dt)}
                  align="start"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-border/60">
                <span className="font-bold text-text-primary text-[11px] block">Core Financial Position</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-text-primary block">Monthly Revenue *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-bold">฿</span>
                      <input
                        type="number"
                        required
                        value={manualRevenue}
                        onChange={(e) => setManualRevenue(e.target.value)}
                        className="w-full pl-7 pr-3 py-1.5 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-brand"
                      />
                    </div>
                    <span className="text-[10px] text-text-muted font-medium block">
                      Interpretation: {formatTHB(manualRevenue)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-text-primary block">Operating Expenses *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-bold">฿</span>
                      <input
                        type="number"
                        required
                        value={manualExpenses}
                        onChange={(e) => setManualExpenses(e.target.value)}
                        className="w-full pl-7 pr-3 py-1.5 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-brand"
                      />
                    </div>
                    <span className="text-[10px] text-text-muted font-medium block">
                      Interpretation: {formatTHB(manualExpenses)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-text-primary block">Usable Cash Reserve *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-bold">฿</span>
                      <input
                        type="number"
                        required
                        value={manualCash}
                        onChange={(e) => setManualCash(e.target.value)}
                        className="w-full pl-7 pr-3 py-1.5 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-brand"
                      />
                    </div>
                    <span className="text-[10px] text-text-muted font-medium block">
                      Interpretation: {formatTHB(manualCash)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/60">
                <span className="font-bold text-text-primary text-[11px] block">Working Capital & Safety</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-text-primary block">Receivables (฿)</label>
                    <input
                      type="number"
                      value={manualReceivables}
                      onChange={(e) => setManualReceivables(e.target.value)}
                      className="w-full px-3 py-1.5 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-brand"
                    />
                    <span className="text-[10px] text-text-muted block">{formatTHB(manualReceivables)}</span>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-text-primary block">Payables Due (฿)</label>
                    <input
                      type="number"
                      value={manualPayables}
                      onChange={(e) => setManualPayables(e.target.value)}
                      className="w-full px-3 py-1.5 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-brand"
                    />
                    <span className="text-[10px] text-text-muted block">{formatTHB(manualPayables)}</span>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-text-primary block">Safe Cash Floor (฿)</label>
                    <input
                      type="number"
                      value={manualBuffer}
                      onChange={(e) => setManualBuffer(e.target.value)}
                      className="w-full px-3 py-1.5 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-brand"
                    />
                    <span className="text-[10px] text-text-muted block">{formatTHB(manualBuffer)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Review & Confirm Replacement
                </Button>
              </div>
            </form>
          )}

          {addMode === 'manual' && showConfirmStep && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-brand/30 bg-brand-soft/10 space-y-2">
                <span className="font-bold text-brand uppercase tracking-wider text-[11px] block">
                  Confirm Baseline Replacement
                </span>
                <p className="text-text-primary leading-relaxed">
                  This will replace the <strong>January 2025</strong> financial baseline with revenue of <strong>{formatTHB(manualRevenue)}</strong> and operating expenses of <strong>{formatTHB(manualExpenses)}</strong>.
                </p>
                <p className="text-text-muted text-[11px]">
                  Wallflower features including Dashboard, Business Health, Cash Flow, and Simulation analysis will update using this confirmed baseline.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowConfirmStep(false)}>
                  Back to Edit
                </Button>
                <Button type="button" variant="primary" size="sm" onClick={handleFinalConfirmManual}>
                  <CheckCircle2 className="size-4" />
                  <span>Replace January Baseline</span>
                </Button>
              </div>
            </div>
          )}

          {addMode === 'import' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="font-bold text-text-primary uppercase tracking-wider text-[11px]">
                  File Import & Preview Flow
                </span>
                <button
                  type="button"
                  onClick={() => setAddMode('choose')}
                  className="text-brand hover:underline font-semibold text-[11px] cursor-pointer"
                >
                  ← Back to Choice
                </button>
              </div>

              {importStep === 'upload' && (
                <div className="p-6 border-2 border-dashed border-border hover:border-brand/40 rounded-xl bg-surface-subtle/30 text-center space-y-3">
                  <Upload className="size-8 text-brand mx-auto" />
                  <div>
                    <span className="font-bold text-text-primary block">Select CSV or JSON File</span>
                    <span className="text-text-muted text-[11px]">Supported formats: .csv, .json (max 5 MB)</span>
                  </div>

                  <input
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload-input"
                  />
                  <label htmlFor="file-upload-input">
                    <Button type="button" variant="primary" size="sm" asChild className="cursor-pointer">
                      <span>Choose File</span>
                    </Button>
                  </label>
                </div>
              )}

              {importStep === 'mapping' && importedFile && (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-border bg-surface-subtle flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-text-primary">{importedFile.name}</span>
                      <span className="text-text-muted block text-[11px]">
                        {importedFile.size} KB • {importedFile.rows} rows detected
                      </span>
                    </div>
                    <Badge variant="success">Parsed Successfully</Badge>
                  </div>

                  <span className="font-bold text-text-primary uppercase tracking-wider text-[11px] block">
                    Map Column Fields
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Select
                      label="Amount Field (Required)"
                      value={colAmountMapping}
                      onChange={(val) => setColAmountMapping(val)}
                      options={[
                        { value: 'Invoice Total', label: 'Invoice Total (Detected)' },
                        { value: 'Amount', label: 'Amount' },
                        { value: 'Balance', label: 'Balance' },
                      ]}
                    />

                    <Select
                      label="Customer Field (Required)"
                      value={colCustomerMapping}
                      onChange={(val) => setColCustomerMapping(val)}
                      options={[
                        { value: 'Customer Name', label: 'Customer Name (Detected)' },
                        { value: 'Client', label: 'Client' },
                        { value: 'Account', label: 'Account' },
                      ]}
                    />

                    <Select
                      label="Due Date Field"
                      value={colDueDateMapping}
                      onChange={(val) => setColDueDateMapping(val)}
                      options={[
                        { value: 'Payment Due', label: 'Payment Due (Detected)' },
                        { value: 'Due Date', label: 'Due Date' },
                      ]}
                    />

                    <Select
                      label="Payment Status Field"
                      value={colStatusMapping}
                      onChange={(val) => setColStatusMapping(val)}
                      options={[
                        { value: 'Status', label: 'Status (Detected)' },
                        { value: 'Payment Status', label: 'Payment Status' },
                      ]}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                    <Button type="button" variant="outline" size="sm" onClick={() => setImportStep('upload')}>
                      Back
                    </Button>
                    <Button type="button" variant="primary" size="sm" onClick={() => setImportStep('preview')}>
                      Preview Rows & Validate
                    </Button>
                  </div>
                </div>
              )}

              {importStep === 'preview' && importedFile && (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-brand/30 bg-brand-soft/10 text-xs flex items-center justify-between">
                    <span>
                      <strong className="text-brand">38 rows ready</strong> • 1 warning (Client Invoice #1042 overdue)
                    </span>
                    <Badge variant="success">Validation Passed</Badge>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-[11px] text-text-primary">
                      <thead className="bg-surface-subtle border-b border-border text-text-muted">
                        <tr>
                          <th className="p-2 text-left">Customer</th>
                          <th className="p-2 text-right">Invoice Total</th>
                          <th className="p-2 text-left">Due Date</th>
                          <th className="p-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        <tr>
                          <td className="p-2 font-medium">Acme Corp Ltd</td>
                          <td className="p-2 text-right font-bold tabular-nums">฿21,340</td>
                          <td className="p-2 text-danger font-semibold">2025-01-10 (Overdue)</td>
                          <td className="p-2">
                            <Badge variant="danger" className="py-0 text-[9px]">Unpaid</Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 font-medium">Siam Retail Partners</td>
                          <td className="p-2 text-right font-bold tabular-nums">฿18,500</td>
                          <td className="p-2">2025-02-15</td>
                          <td className="p-2">
                            <Badge variant="success" className="py-0 text-[9px]">On Time</Badge>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                    <Button type="button" variant="outline" size="sm" onClick={() => setImportStep('mapping')}>
                      Edit Mapping
                    </Button>
                    <Button type="button" variant="primary" size="sm" onClick={handleConfirmImport}>
                      <CheckCircle2 className="size-4" />
                      <span>Confirm 38 Imported Records</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Dialog>
    </AppPage>
  );
}

function DataWorkspaceSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}
