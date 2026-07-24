'use client';

import { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ListFilter,
  Grid,
  Calendar,
  Play,
  CheckCircle2,
  Bot,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/navigation';
import { AppPage, PageHeader } from '@/components/ui/layout';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FinancialValue } from '@/components/ui/domain-values';
import { RiskCenterSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { FadeIn, Expand } from '@/components/motion';
import {
  getRisksData,
  type RisksData,
  type DetailedRiskItem,
} from '@/features/risks/adapters/risks.adapter';

export default function RiskCenterPage() {
  const [data, setData] = useState<RisksData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'priority' | 'matrix' | 'timeline'>('priority');
  const [selectedRisk, setSelectedRisk] = useState<DetailedRiskItem | null>(null);
  const [showEvidence, setShowEvidence] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRisksData();
      setData(res);
      if (res.risks.length > 0) {
        setSelectedRisk(res.risks[0]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load risk center assessment.');
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
          if (res.risks.length > 0) setSelectedRisk(res.risks[0]);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load risk center assessment.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <RiskCenterSkeleton />;
  if (error) return <ErrorState onRetry={loadData} title="Risk Investigation Error" description={error} />;
  if (!data) return <EmptyState icon={<ShieldAlert />} title="No Risk Data" description="Record a financial snapshot to begin risk investigation." />;

  const { summary, risks } = data;

  return (
    <AppPage>
      <FadeIn>
        <div className="space-y-6">
          {/* Header Controls */}
          <PageHeader
            title={
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="size-6 text-danger shrink-0" aria-hidden="true" />
                <span>Risk Investigation Workspace</span>
              </div>
            }
            description="Investigate active risk vulnerabilities, evidence, financial exposure, and mitigation scenarios."
            badge={
              <Badge variant={summary.overallStatus === 'healthy' ? 'success' : 'danger'} dot>
                {summary.criticalCount} Critical Risk{summary.criticalCount !== 1 ? 's' : ''}
              </Badge>
            }
            actions={
              <div className="flex items-center gap-2">
                {/* View Switcher Controls */}
                <div className="flex items-center p-1 rounded-lg border border-border bg-surface-subtle text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setActiveView('priority')}
                    className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer',
                      activeView === 'priority' ? 'bg-surface text-brand font-semibold shadow-2xs' : 'text-text-muted hover:text-text-primary'
                    )}
                  >
                    <ListFilter className="size-3.5" />
                    <span>Priority</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveView('matrix')}
                    className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer',
                      activeView === 'matrix' ? 'bg-surface text-brand font-semibold shadow-2xs' : 'text-text-muted hover:text-text-primary'
                    )}
                  >
                    <Grid className="size-3.5" />
                    <span>Matrix</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveView('timeline')}
                    className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer',
                      activeView === 'timeline' ? 'bg-surface text-brand font-semibold shadow-2xs' : 'text-text-muted hover:text-text-primary'
                    )}
                  >
                    <Calendar className="size-3.5" />
                    <span>Timeline</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={loadData}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-surface hover:bg-surface-subtle transition-colors cursor-pointer"
                >
                  <RefreshCw className="size-3.5" />
                  <span>Refresh</span>
                </button>
              </div>
            }
          />

          {/* Risk Summary Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="p-4 space-y-1">
              <span className="text-xs text-text-muted font-medium block">Total Exposure</span>
              <FinancialValue value={summary.totalEstimatedExposure} className="text-lg sm:text-xl font-bold text-danger" />
              <span className="text-[11px] text-text-muted block">Across {risks.length} active risks</span>
            </Card>

            <Card className="p-4 space-y-1">
              <span className="text-xs text-text-muted font-medium block">Critical Risks</span>
              <span className="text-lg sm:text-xl font-bold text-danger tabular-nums block">{summary.criticalCount}</span>
              <span className="text-[11px] text-text-muted block">Require immediate action</span>
            </Card>

            <Card className="p-4 space-y-1">
              <span className="text-xs text-text-muted font-medium block">Medium Priority</span>
              <span className="text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400 tabular-nums block">{summary.mediumCount}</span>
              <span className="text-[11px] text-text-muted block">Under active monitoring</span>
            </Card>

            <Card className="p-4 space-y-1">
              <span className="text-xs text-text-muted font-medium block">Risk Posture Score</span>
              <span className="text-lg sm:text-xl font-bold text-brand tabular-nums block">{summary.overallScore}/100</span>
              <span className="text-[11px] text-text-muted block">Deterministic rule score</span>
            </Card>
          </div>

          {/* Main Risk Investigation Grid (Left: Active View | Right: Detailed Risk Panel) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (7 cols): Selected View Content */}
            <div className="lg:col-span-7 space-y-4">
              {activeView === 'priority' && (
                <PriorityListView risks={risks} selectedId={selectedRisk?.id} onSelect={setSelectedRisk} />
              )}
              {activeView === 'matrix' && (
                <RiskMatrixView risks={risks} selectedId={selectedRisk?.id} onSelect={setSelectedRisk} />
              )}
              {activeView === 'timeline' && (
                <RiskTimelineView risks={risks} selectedId={selectedRisk?.id} onSelect={setSelectedRisk} />
              )}
            </div>

            {/* Right Column (5 cols): Risk Detail Panel / Drawer */}
            <div className="lg:col-span-5">
              {selectedRisk ? (
                <Card className="sticky top-20 border-brand/30 p-5 space-y-5">
                  {/* Panel Header */}
                  <div className="space-y-2 border-b border-border pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant={selectedRisk.severity === 'critical' ? 'critical' : 'warning'} dot>
                        {selectedRisk.severity.toUpperCase()} SEVERITY
                      </Badge>
                      <span className="text-xs text-text-muted capitalize">Category: {selectedRisk.category.replace('_', ' ')}</span>
                    </div>

                    <h3 className="text-base font-bold text-text-primary leading-snug">
                      {selectedRisk.title}
                    </h3>
                  </div>

                  {/* Exposure & Timing Grid */}
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-lg border border-border bg-surface-subtle/50 text-xs">
                    <div>
                      <span className="text-text-muted block">Estimated Exposure</span>
                      <FinancialValue value={selectedRisk.estimatedExposure} className="text-sm font-bold text-danger" />
                    </div>
                    <div>
                      <span className="text-text-muted block">Expected Timing</span>
                      <span className="text-sm font-semibold text-text-primary block truncate">{selectedRisk.expectedTiming}</span>
                    </div>
                    <div>
                      <span className="text-text-muted block">Likelihood</span>
                      <span className="font-semibold text-text-primary capitalize">{selectedRisk.likelihood}</span>
                    </div>
                    <div>
                      <span className="text-text-muted block">Confidence</span>
                      <span className="font-semibold text-text-primary uppercase">{selectedRisk.confidence}</span>
                    </div>
                  </div>

                  {/* Affected Metrics */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block">Affected Metrics</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRisk.affectedMetrics.map((metric) => (
                        <span key={metric} className="px-2 py-0.5 rounded-md border border-border bg-surface text-xs text-text-primary font-medium">
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Evidence Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block">Trigger Evidence</span>
                      <button
                        type="button"
                        onClick={() => setShowEvidence(!showEvidence)}
                        className="text-xs font-semibold text-brand hover:text-brand-hover cursor-pointer"
                      >
                        {showEvidence ? 'Hide Evidence' : 'View Evidence'}
                      </button>
                    </div>

                    <Expand open={showEvidence}>
                      <div className="p-3 rounded-lg border border-border/80 bg-surface space-y-1.5 text-xs text-text-secondary">
                        {selectedRisk.evidence.map((ev, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-brand font-bold">•</span>
                            <span>{ev}</span>
                          </div>
                        ))}
                      </div>
                    </Expand>
                  </div>

                  {/* Recommended Mitigation */}
                  <div className="p-3.5 rounded-lg border border-brand/20 bg-brand-soft/10 space-y-1">
                    <span className="text-xs font-bold text-brand uppercase tracking-wider block">Recommended Mitigation</span>
                    <p className="text-xs text-text-primary leading-relaxed">
                      {selectedRisk.recommendedMitigation}
                    </p>
                  </div>

                  {/* 4 Action Buttons */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block">Actions</span>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/simulations/new?type=${selectedRisk.mitigationScenario || 'payment_delay'}`}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-brand text-white hover:bg-brand-hover text-xs font-semibold transition-colors shadow-2xs text-center"
                      >
                        <Play className="size-3.5" />
                        <span>Test Mitigation</span>
                      </Link>

                      <Link
                        href="/actions"
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-text-primary transition-colors text-center"
                      >
                        <CheckCircle2 className="size-3.5 text-brand" />
                        <span>Create Action</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => setShowEvidence(!showEvidence)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-text-primary transition-colors text-center cursor-pointer"
                      >
                        <ListFilter className="size-3.5 text-text-muted" />
                        <span>View Evidence</span>
                      </button>

                      <Link
                        href="/advisor"
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-text-primary transition-colors text-center"
                      >
                        <Bot className="size-3.5 text-ai" />
                        <span>Ask Advisor</span>
                      </Link>
                    </div>
                  </div>
                </Card>
              ) : (
                <EmptyState icon={<ShieldAlert />} title="Select a Risk" description="Click on any risk card to inspect detailed evidence and test mitigations." />
              )}
            </div>
          </div>
        </div>
      </FadeIn>
    </AppPage>
  );
}

// ── 1. Priority List View ───────────────────────────────────────────────────

function PriorityListView({
  risks,
  selectedId,
  onSelect,
}: {
  risks: DetailedRiskItem[];
  selectedId?: string;
  onSelect: (risk: DetailedRiskItem) => void;
}) {
  return (
    <div className="space-y-3">
      {risks.map((risk) => {
        const isSelected = risk.id === selectedId;
        const isCritical = risk.severity === 'critical';

        return (
          <button
            key={risk.id}
            type="button"
            onClick={() => onSelect(risk)}
            className={cn(
              'w-full p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2',
              isSelected
                ? 'border-brand bg-brand-soft/10 ring-1 ring-brand shadow-xs'
                : 'border-border bg-surface hover:bg-surface-subtle/50'
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Badge variant={isCritical ? 'critical' : 'warning'} dot>
                  {risk.severity.toUpperCase()}
                </Badge>
                <span className="text-xs text-text-muted capitalize">{risk.category.replace('_', ' ')}</span>
              </div>
              <FinancialValue value={risk.estimatedExposure} className="text-xs sm:text-sm font-bold text-danger" />
            </div>

            <h4 className="text-xs sm:text-sm font-semibold text-text-primary">
              {risk.title}
            </h4>

            <div className="flex items-center justify-between text-[11px] text-text-muted pt-1 border-t border-border/40">
              <div className="flex items-center gap-2">
                <Clock className="size-3" />
                <span>Timing: {risk.expectedTiming}</span>
              </div>
              <span className="text-brand font-semibold hover:underline">Inspect details →</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── 2. Risk Matrix View ──────────────────────────────────────────────────────

function RiskMatrixView({
  risks,
  selectedId,
  onSelect,
}: {
  risks: DetailedRiskItem[];
  selectedId?: string;
  onSelect: (risk: DetailedRiskItem) => void;
}) {
  const categories = ['high', 'medium', 'low'] as const;

  return (
    <Card className="p-4 space-y-4">
      <div>
        <CardTitle>Impact vs Likelihood Risk Matrix</CardTitle>
        <CardDescription>2D investigation grid mapping active risks by severity and likelihood.</CardDescription>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {categories.map((impact) =>
          categories.map((likelihood) => {
            const cellRisks = risks.filter((r) => r.severity === (impact === 'high' ? 'critical' : impact) || r.likelihood === likelihood);
            const isHighRiskCell = impact === 'high' && likelihood === 'high';

            return (
              <div
                key={`${impact}-${likelihood}`}
                className={cn(
                  'p-3 rounded-lg border min-h-28 space-y-2',
                  isHighRiskCell ? 'border-danger/30 bg-danger-soft/10' : 'border-border bg-surface-subtle/30'
                )}
              >
                <div className="flex items-center justify-between text-[10px] text-text-muted uppercase font-bold">
                  <span>Imp: {impact}</span>
                  <span>Like: {likelihood}</span>
                </div>

                <div className="space-y-1">
                  {cellRisks.slice(0, 2).map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => onSelect(r)}
                      className={cn(
                        'w-full p-1.5 rounded text-[11px] font-medium text-left truncate transition-colors cursor-pointer block',
                        r.id === selectedId ? 'bg-brand text-white' : 'bg-surface border border-border text-text-primary hover:bg-surface-subtle'
                      )}
                    >
                      {r.title}
                    </button>
                  ))}
                  {cellRisks.length > 2 && (
                    <span className="text-[10px] text-text-muted block text-center">+{cellRisks.length - 2} more</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}

// ── 3. Risk Timeline View ───────────────────────────────────────────────────

function RiskTimelineView({
  risks,
  selectedId,
  onSelect,
}: {
  risks: DetailedRiskItem[];
  selectedId?: string;
  onSelect: (risk: DetailedRiskItem) => void;
}) {
  return (
    <Card className="p-4 space-y-4">
      <div>
        <CardTitle>Risk Event Timeline</CardTitle>
        <CardDescription>Chronological timeline of anticipated risk trigger events.</CardDescription>
      </div>

      <div className="space-y-3 relative pl-4 border-l-2 border-brand/30">
        {risks.map((risk) => (
          <div key={risk.id} className="relative space-y-1">
            <div className="absolute -left-[21px] top-1 size-3 rounded-full bg-brand ring-4 ring-surface" />
            <button
              type="button"
              onClick={() => onSelect(risk)}
              className={cn(
                'w-full p-3 rounded-lg border text-left transition-colors cursor-pointer',
                risk.id === selectedId ? 'border-brand bg-brand-soft/10' : 'border-border bg-surface hover:bg-surface-subtle'
              )}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-primary">{risk.title}</span>
                <FinancialValue value={risk.estimatedExposure} className="font-bold text-danger" />
              </div>
              <span className="text-[11px] text-text-muted block">Expected: {risk.expectedTiming}</span>
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}
