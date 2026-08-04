'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  TrendingDown,
  Search,
  SlidersHorizontal,
  Play,
  Sparkles,
  Banknote,
  ArrowRight,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/navigation';
import { AppPage } from '@/components/ui/layout';
import { Card, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartCard } from '@/components/charts/chart-card';
import {
  FinancialValue,
  FreshnessIndicator,
  CompletenessIndicator,
} from '@/components/ui/domain-values';
import { RiskCenterSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { FadeInView, ChartInView } from '@/components/motion';
import {
  getRisksData,
  type RisksData,
  type RiskSeverity,
  type RiskCategory,
} from '../adapters/risks.adapter';
import { formatThbAxis, AXIS_STYLES, GRID_STYLES } from '@/components/charts/chart-config';

type TriageStageFilter = 'all' | 'action_required' | 'monitoring' | 'mitigating' | 'resolved';

export function RisksView() {
  const [data, setData] = useState<RisksData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<TriageStageFilter>('all');
  const [severityFilter, setSeverityFilter] = useState<RiskSeverity | 'all'>('all');
  const [categoryFilter] = useState<RiskCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'exposure' | 'severity'>('priority');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRisksData();
      setData(res);
      if (res.risks.length > 0) {
        setSelectedRiskId(res.risks[0].id);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load risk center assessment.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getRisksData()
      .then((res) => {
        if (isMounted) {
          setData(res);
          if (res.risks.length > 0) setSelectedRiskId(res.risks[0].id);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load risk center assessment.',
          );
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const triageStageCounts = useMemo(() => {
    if (!data) return { actionRequired: 0, monitoring: 0, mitigating: 0, resolved: 0 };
    const actionRequired = data.risks.filter(r => r.status === 'active' && (r.severity === 'critical' || r.severity === 'high')).length;
    const monitoring = data.risks.filter(r => r.status === 'active' && (r.severity === 'medium' || r.severity === 'low' || r.severity === 'warning')).length;
    const mitigating = data.risks.filter(r => r.status === 'mitigated').length;
    const resolved = 0;
    return { actionRequired, monitoring, mitigating, resolved };
  }, [data]);

  const filteredRisks = useMemo(() => {
    if (!data) return [];
    let result = [...data.risks];

    if (stageFilter === 'action_required') {
      result = result.filter(r => r.status === 'active' && (r.severity === 'critical' || r.severity === 'high'));
    } else if (stageFilter === 'monitoring') {
      result = result.filter(r => r.status === 'active' && (r.severity === 'medium' || r.severity === 'low' || r.severity === 'warning'));
    } else if (stageFilter === 'mitigating') {
      result = result.filter(r => r.status === 'mitigated');
    } else if (stageFilter === 'resolved') {
      result = result.filter(r => r.status === 'ignored');
    }

    if (severityFilter !== 'all') {
      result = result.filter((r) => r.severity === severityFilter);
    }
    if (categoryFilter !== 'all') {
      result = result.filter((r) => r.category === categoryFilter);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.category.toLowerCase().includes(query) ||
          r.ruleId.toLowerCase().includes(query),
      );
    }

    const severityWeight: Record<RiskSeverity, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
      warning: 4,
    };

    result.sort((a, b) => {
      if (sortBy === 'priority' || sortBy === 'severity') {
        const diff = severityWeight[a.severity] - severityWeight[b.severity];
        if (diff !== 0) return diff;
        return b.estimatedExposure - a.estimatedExposure;
      }
      return b.estimatedExposure - a.estimatedExposure;
    });

    return result;
  }, [data, stageFilter, severityFilter, categoryFilter, searchQuery, sortBy]);

  const selectedRisk = useMemo(() => {
    if (!data) return null;
    return data.risks.find((r) => r.id === selectedRiskId) || data.risks[0] || null;
  }, [data, selectedRiskId]);

  if (loading) return <RiskCenterSkeleton />;
  if (error)
    return (
      <ErrorState
        onRetry={loadData}
        title="Risk Investigation Error"
        description={error}
      />
    );
  if (!data)
    return (
      <EmptyState
        icon={<ShieldAlert />}
        title="No Risk Data"
        description="Record a financial snapshot to begin risk triage."
      />
    );

  const { summary, risks } = data;

  const sortedCategoryExposureChartData = [
    { category: 'Operational', exposure: 285000, count: 2 },
    { category: 'Cash Flow', exposure: 33740, count: 2 },
    { category: 'Growth', exposure: 12000, count: 1 },
    { category: 'Expense', exposure: 3500, count: 1 },
  ];

  return (
    <AppPage>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight">
                Risk Center
              </h1>
            </div>
            <p className="text-xs text-text-secondary">
              Risk triage and investigation workspace. Prioritize threats, inspect trigger evidence, and execute mitigations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <FreshnessIndicator
              lastUpdated={summary.lastAssessmentDate}
              staleDays={summary.isStale ? 35 : 5}
            />
            <CompletenessIndicator score={90} confidence="high" />
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-surface p-3.5 sm:p-4 shadow-2xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
            <div className="space-y-0.5 sm:pr-4">
              <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium block">
                Active Risks
              </span>
              <span className="text-base sm:text-lg font-bold text-text-primary block tabular-nums">
                {summary.totalCount} Tracked
              </span>
              <span className="text-[11px] text-text-muted block">Deterministic rules</span>
            </div>

            <div className="space-y-0.5 pt-2 sm:pt-0 sm:px-4">
              <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium block">
                Combined Exposure
              </span>
              <FinancialValue
                value={summary.totalEstimatedExposure}
                compact
                className="text-base sm:text-lg font-bold text-danger block"
              />
              <span className="text-[11px] text-text-muted block">Estimated financial risk</span>
            </div>

            <div className="space-y-0.5 pt-2 sm:pt-0 sm:px-4">
              <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium block">
                Worsening Trends
              </span>
              <div className="flex items-center gap-1">
                <TrendingDown className="size-4 text-warning" />
                <span className="text-base sm:text-lg font-bold text-warning tabular-nums">
                  2 Risks
                </span>
              </div>
              <span className="text-[11px] text-text-muted block">Velocity accelerating</span>
            </div>

            <div className="space-y-0.5 pt-2 sm:pt-0 sm:pl-4 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium block">
                Highest Priority Threat
              </span>
              <span className="text-xs font-semibold text-danger block truncate">
                Cash Deficit (Feb 28)
              </span>
              <span className="text-[11px] text-text-muted block">฿12,400 projected gap</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-surface p-3 sm:p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-text-primary uppercase tracking-wider">
              Workflow Triage Status
            </span>
            <span className="text-[11px] text-text-muted">
              Click stage to filter prioritized queue
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => setStageFilter(stageFilter === 'action_required' ? 'all' : 'action_required')}
              className={cn(
                'p-2.5 rounded-lg border text-left transition-colors cursor-pointer space-y-1',
                stageFilter === 'action_required'
                  ? 'border-warning/50 bg-warning-soft/30 ring-1 ring-warning'
                  : 'border-border/70 bg-surface-subtle/50 hover:bg-surface-subtle'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-primary">Action Required</span>
                <Badge variant="warning" className="text-[10px] tabular-nums">
                  {triageStageCounts.actionRequired}
                </Badge>
              </div>
              <span className="text-[11px] text-text-muted block">Requires immediate intervention</span>
            </button>

            <button
              type="button"
              onClick={() => setStageFilter(stageFilter === 'monitoring' ? 'all' : 'monitoring')}
              className={cn(
                'p-2.5 rounded-lg border text-left transition-colors cursor-pointer space-y-1',
                stageFilter === 'monitoring'
                  ? 'border-brand/50 bg-brand-soft/20 ring-1 ring-brand'
                  : 'border-border/70 bg-surface-subtle/50 hover:bg-surface-subtle'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-primary">Monitoring</span>
                <Badge variant="neutral" className="text-[10px] tabular-nums">
                  {triageStageCounts.monitoring}
                </Badge>
              </div>
              <span className="text-[11px] text-text-muted block">Under active observation</span>
            </button>

            <button
              type="button"
              onClick={() => setStageFilter(stageFilter === 'mitigating' ? 'all' : 'mitigating')}
              className={cn(
                'p-2.5 rounded-lg border text-left transition-colors cursor-pointer space-y-1',
                stageFilter === 'mitigating'
                  ? 'border-brand/50 bg-brand-soft/20 ring-1 ring-brand'
                  : 'border-border/70 bg-surface-subtle/50 hover:bg-surface-subtle'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-primary">Mitigating</span>
                <Badge variant="ai" className="text-[10px] tabular-nums">
                  {triageStageCounts.mitigating}
                </Badge>
              </div>
              <span className="text-[11px] text-text-muted block">Response strategy active</span>
            </button>

            <button
              type="button"
              onClick={() => setStageFilter(stageFilter === 'resolved' ? 'all' : 'resolved')}
              className={cn(
                'p-2.5 rounded-lg border text-left transition-colors cursor-pointer space-y-1',
                stageFilter === 'resolved'
                  ? 'border-success/50 bg-success-soft/30 ring-1 ring-success'
                  : 'border-border/70 bg-surface-subtle/50 hover:bg-surface-subtle'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-primary">Resolved</span>
                <Badge variant="success" className="text-[10px] tabular-nums">
                  {triageStageCounts.resolved}
                </Badge>
              </div>
              <span className="text-[11px] text-text-muted block">Cleared threat conditions</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-5 space-y-3 min-w-0">
            <div className="p-3 rounded-xl border border-border/80 bg-surface shadow-2xs space-y-2.5">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 size-3.5 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search risks or rule IDs..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border bg-surface-subtle text-xs text-text-primary placeholder:text-text-muted focus:outline-hidden focus:border-brand"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal className="size-3.5 text-brand" />
                  <div className="inline-flex rounded-lg border border-border p-0.5 bg-surface-subtle flex-wrap">
                    <button
                      type="button"
                      onClick={() => setSeverityFilter('all')}
                      className={cn(
                        'px-2 py-0.5 text-[11px] font-medium rounded-md cursor-pointer transition-colors',
                        severityFilter === 'all'
                          ? 'bg-surface text-text-primary font-semibold shadow-2xs'
                          : 'text-text-muted hover:text-text-primary'
                      )}
                    >
                      All ({risks.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeverityFilter('critical')}
                      className={cn(
                        'px-2 py-0.5 text-[11px] font-medium rounded-md cursor-pointer transition-colors',
                        severityFilter === 'critical'
                          ? 'bg-danger-soft text-danger font-semibold'
                          : 'text-text-muted hover:text-text-primary'
                      )}
                    >
                      Critical (2)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeverityFilter('medium')}
                      className={cn(
                        'px-2 py-0.5 text-[11px] font-medium rounded-md cursor-pointer transition-colors',
                        severityFilter === 'medium'
                          ? 'bg-warning-soft text-warning font-semibold'
                          : 'text-text-muted hover:text-text-primary'
                      )}
                    >
                      Medium (3)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeverityFilter('low')}
                      className={cn(
                        'px-2 py-0.5 text-[11px] font-medium rounded-md cursor-pointer transition-colors',
                        severityFilter === 'low'
                          ? 'bg-surface-subtle text-text-primary font-semibold'
                          : 'text-text-muted hover:text-text-primary'
                      )}
                    >
                      Low (1)
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-text-muted">
                  <span>Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'priority' | 'exposure' | 'severity')}
                    className="bg-transparent font-semibold text-text-primary border-none focus:outline-hidden cursor-pointer"
                  >
                    <option value="priority">Priority</option>
                    <option value="exposure">Exposure</option>
                    <option value="severity">Severity</option>
                  </select>
                </div>
              </div>
            </div>

            <Card className="p-3 shadow-2xs space-y-2">
              <div className="flex items-center justify-between border-b border-border/60 pb-2 px-1">
                <span className="text-xs font-semibold text-text-primary">
                  Prioritized Risk Queue
                </span>
                <span className="text-[11px] text-text-muted font-medium">
                  {filteredRisks.length} threats listed
                </span>
              </div>

              {filteredRisks.length === 0 ? (
                <div className="p-6 text-center text-xs text-text-muted space-y-2">
                  <p>No active risks match your current search or filter rules.</p>
                  <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setSeverityFilter('all'); setStageFilter('all'); }}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {filteredRisks.map((risk) => {
                    const isSelected = risk.id === selectedRisk?.id;
                    const isCritical = risk.severity === 'critical';

                    return (
                      <button
                        key={risk.id}
                        type="button"
                        onClick={() => setSelectedRiskId(risk.id)}
                        className={cn(
                          'w-full py-3 px-2.5 rounded-lg text-left transition-colors cursor-pointer space-y-1.5 group',
                          isSelected
                            ? 'bg-brand-soft/20 border border-brand/40 ring-1 ring-brand/30 shadow-2xs'
                            : 'hover:bg-surface-subtle/50'
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <Badge
                              variant={isCritical ? 'critical' : 'warning'}
                              dot
                              className="shrink-0 text-[10px]"
                            >
                              {risk.severity.toUpperCase()}
                            </Badge>
                            <span className="text-[11px] text-text-muted capitalize truncate font-medium">
                              {risk.category.replace('_', ' ')}
                            </span>
                          </div>

                          <FinancialValue
                            value={risk.estimatedExposure}
                            className="text-xs font-bold text-danger shrink-0"
                          />
                        </div>

                        <h4 className="text-xs font-semibold text-text-primary leading-tight line-clamp-1">
                          {risk.title}
                        </h4>

                        <div className="flex items-center justify-between text-[11px] text-text-muted pt-0.5">
                          <div className="flex items-center gap-1.5">
                            <Clock className="size-3 text-text-muted" />
                            <span>{risk.expectedTiming}</span>
                          </div>
                          <ChevronRight className="size-4 text-text-muted transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          <div className="xl:col-span-7 min-w-0">
            {selectedRisk ? (
              <Card className="p-5 space-y-5 shadow-2xs border-brand/30 bg-surface h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="border-b border-border/60 pb-3 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={selectedRisk.severity === 'critical' ? 'critical' : 'warning'}
                          dot
                        >
                          {selectedRisk.severity.toUpperCase()} SEVERITY
                        </Badge>
                        <Badge variant="healthy">
                          {selectedRisk.status.toUpperCase()}
                        </Badge>
                      </div>

                      <span className="text-xs text-text-muted font-medium">
                        Rule confidence: <strong className="text-text-primary">High</strong>
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-text-primary leading-snug">
                      {selectedRisk.title}
                    </h2>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-text-muted uppercase tracking-wider font-semibold block">
                      Risk Statement & Context
                    </span>
                    <p className="text-xs sm:text-sm text-text-primary leading-relaxed">
                      Wallflower detected a <strong>{selectedRisk.severity}</strong> risk vulnerability affecting{' '}
                      <strong className="text-brand">{selectedRisk.category.replace('_', ' ')}</strong>.
                      If unmitigated, expected consequences include cash buffer erosion and operating line impairment by {selectedRisk.expectedTiming}.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-lg border border-border/80 bg-surface-subtle/50 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-text-muted text-[11px] block">Likelihood</span>
                      <span className="font-bold text-text-primary capitalize text-xs">
                        {selectedRisk.likelihood} Probability
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-text-muted text-[11px] block">Financial Exposure</span>
                      <FinancialValue
                        value={selectedRisk.estimatedExposure}
                        className="font-bold text-danger text-xs block"
                      />
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-text-muted text-[11px] block">Time Horizon</span>
                      <span className="font-bold text-text-primary text-xs block truncate">
                        {selectedRisk.expectedTiming}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-text-muted text-[11px] block">Affected Dimension</span>
                      <span className="font-bold text-text-primary capitalize text-xs truncate block">
                        {selectedRisk.affectedMetrics[0] || 'Cash Flow'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] text-text-muted uppercase tracking-wider font-semibold block">
                      Deterministic Evidence & Trigger Rules
                    </span>
                    <div className="p-3.5 rounded-lg border border-border/80 bg-surface space-y-2 text-xs">
                      {selectedRisk.evidence.map((ev, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-text-primary">
                          <span className="text-brand shrink-0 font-bold">•</span>
                          <span className="leading-relaxed">{ev}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg border border-danger/25 bg-danger-soft/10 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-danger font-semibold text-[11px] uppercase tracking-wider">
                      <AlertTriangle className="size-3.5 shrink-0" />
                      <span>Potential Consequence if Ignored</span>
                    </div>
                    <p className="text-text-primary leading-relaxed">
                      Financial exposure of <FinancialValue value={selectedRisk.estimatedExposure} className="font-bold text-danger" /> will directly erode usable cash buffer, impacting metrics: {selectedRisk.affectedMetrics.join(', ')}.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg border border-brand/20 bg-brand-soft/10 space-y-1 text-xs">
                    <span className="text-[11px] font-bold text-brand uppercase tracking-wider block">
                      Recommended Mitigation Response
                    </span>
                    <p className="text-text-primary leading-relaxed font-medium">
                      {selectedRisk.recommendedMitigation}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/60 flex flex-wrap items-center gap-2.5">
                  <Button asChild variant="primary" size="md" className="text-xs cursor-pointer">
                    <Link
                      href={`/simulations/new?type=${selectedRisk.mitigationScenario || 'payment_delay'}`}
                    >
                      <Play aria-hidden="true" />
                      <span>Simulate Mitigation Impact</span>
                    </Link>
                  </Button>

                  <Button asChild variant="secondary" size="md" className="text-xs cursor-pointer">
                    <Link href="/actions">
                      <Banknote aria-hidden="true" />
                      <span>Add to Action Plan</span>
                    </Link>
                  </Button>

                  <Button asChild variant="outline" size="md" className="text-xs cursor-pointer">
                    <Link href="/advisor">
                      <Sparkles aria-hidden="true" />
                      <span>Ask AI Advisor</span>
                    </Link>
                  </Button>
                </div>
              </Card>
            ) : (
              <EmptyState
                icon={<ShieldAlert />}
                title="Select a Risk"
                description="Click any row in the prioritized queue to inspect evidence and test mitigations."
              />
            )}
          </div>
        </div>

        <ChartInView>
          {(shouldRenderChart) => (
            <ChartCard
              title="Financial Exposure Breakdown by Risk Category"
              description="Comparing total estimated financial risk across categories, sorted from highest to lowest exposure."
              action={
                <Link
                  href="/simulations/new"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-hover"
                >
                  <span>Test Protective Scenarios</span>
                  <ArrowRight className="size-3" />
                </Link>
              }
              legendItems={[
                { label: 'Financial Exposure (฿)', color: '#0F766E' },
              ]}
            >
              <div className="h-48 sm:h-56 w-full pt-2">
                {shouldRenderChart && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={sortedCategoryExposureChartData}
                      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray={GRID_STYLES.strokeDasharray}
                        stroke="var(--border)"
                        opacity={0.15}
                      />
                      <XAxis
                        dataKey="category"
                        {...AXIS_STYLES}
                        stroke="var(--text-muted)"
                      />
                      <YAxis
                        tickFormatter={formatThbAxis}
                        {...AXIS_STYLES}
                        stroke="var(--text-muted)"
                      />
                      <Tooltip
                        cursor={{ fill: 'var(--surface-subtle)', fillOpacity: 0.35 }}
                        formatter={(val) => [
                          typeof val === 'number'
                            ? `฿${val.toLocaleString()}`
                            : String(val ?? '—'),
                          'Financial Exposure',
                        ]}
                        contentStyle={{
                          backgroundColor: 'var(--surface)',
                          borderColor: 'var(--border)',
                          borderRadius: '10px',
                          fontSize: '12px',
                          color: 'var(--text-primary)',
                        }}
                      />
                      <Bar
                        dataKey="exposure"
                        fill="#0F766E"
                        radius={[6, 6, 0, 0]}
                        activeBar={{
                          fillOpacity: 0.85,
                          stroke: 'var(--brand)',
                          strokeWidth: 1,
                        }}
                        animationDuration={800}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </ChartCard>
          )}
        </ChartInView>

        <FadeInView>
          <Card className="p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-brand" />
                <CardTitle>Recent Risk Movement & Trigger Activity Log</CardTitle>
              </div>
              <span className="text-xs text-text-muted font-medium">Last 30 Days</span>
            </div>

            <div className="divide-y divide-border/40 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-danger" />
                  <span className="font-semibold text-text-primary">Newly Detected: Cash Deficit Late Feb (฿12,400)</span>
                </div>
                <span className="text-text-muted text-[11px]">Jan 15, 2025</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-warning" />
                  <span className="font-semibold text-text-primary">Worsened: ฿21.3k Overdue Receivables Drag</span>
                </div>
                <span className="text-text-muted text-[11px]">Jan 10, 2025</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-brand" />
                  <span className="font-semibold text-text-primary">Monitoring: Commercial Rent Lease Increase (+5%)</span>
                </div>
                <span className="text-text-muted text-[11px]">Jan 05, 2025</span>
              </div>
            </div>
          </Card>
        </FadeInView>
      </div>
    </AppPage>
  );
}
