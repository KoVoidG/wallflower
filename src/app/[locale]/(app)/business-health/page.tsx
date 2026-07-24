'use client';

import { useState, useEffect } from 'react';
import {
  HeartPulse,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Shield,
  Activity,
  ChevronDown,
  RefreshCw,
  HelpCircle,
  Play,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Body, SectionTitle, CardTitle } from '@/components/ui/typography';
import { AppPage, PageHeader } from '@/components/ui/layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FreshnessIndicator, CompletenessIndicator, QualityBadge } from '@/components/ui/domain-values';
import { BusinessHealthSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { FadeIn, FadeInView, Expand } from '@/components/motion';
import { Link } from '@/lib/i18n/navigation';
import {
  BusinessHealthAdapter,
  type BusinessHealthAssessment,
} from '@/features/business-health/adapters/business-health.adapter';
import type { HealthPostureStatus } from '@/features/business-health/lib/thresholds';

export default function BusinessHealthPage() {
  const [assessment, setAssessment] = useState<BusinessHealthAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDimension, setExpandedDimension] = useState<string | null>('working-capital');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await BusinessHealthAdapter.getHealthAssessment({ simulatedDelayMs: 300 });
      setAssessment(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load business health diagnostic.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    BusinessHealthAdapter.getHealthAssessment({ simulatedDelayMs: 300 })
      .then((res) => {
        if (isMounted) {
          setAssessment(res);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load business health diagnostic.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <BusinessHealthSkeleton />;
  if (error) return <ErrorState onRetry={loadData} title="Assessment Error" description={error} />;
  if (!assessment) return <EmptyState icon={<HeartPulse />} title="No Health Assessment" description="Record a financial snapshot to generate your business health diagnostic." />;

  const { overallScore, posture, summaryExplanation, strongestDimension, weakestDimension, mostImportantChange, recommendedAction, confidence, diagnosticDimensions, strengths, vulnerabilities, completeness } = assessment;

  const postureBadgeVariant = posture === 'Strong' ? 'success' as const : posture === 'Stable' ? 'healthy' as const : 'warning' as const;

  return (
    <AppPage>
      <FadeIn>
        <div data-tour="health-score" className="space-y-6">
          {/* Header Controls */}
          <PageHeader
            title={
              <div className="flex items-center gap-2.5">
                <HeartPulse className="size-6 text-brand shrink-0" aria-hidden="true" />
                <span>Business Health Diagnostic</span>
              </div>
            }
            description="Diagnostic evaluation of liquidity, profitability, working capital, debt pressure, operating efficiency, and growth readiness."
            badge={<Badge variant={postureBadgeVariant} dot>Estimated Posture: {posture}</Badge>}
            actions={
              <div className="flex items-center gap-2.5">
                <FreshnessIndicator lastUpdated={completeness.lastUpdated} staleDays={completeness.staleDays} />
                <CompletenessIndicator score={completeness.completenessScore} confidence={confidence} />
                <button
                  type="button"
                  onClick={loadData}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-surface hover:bg-surface-subtle transition-colors cursor-pointer"
                >
                  <RefreshCw className="size-3.5" aria-hidden="true" />
                  <span>Refresh</span>
                </button>
              </div>
            }
          />

          {/* Overall Health Executive Summary */}
          <section className="rounded-xl border border-brand/20 bg-brand-soft/15 p-5 md:p-6 space-y-4" aria-label="Overall business health summary">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <HeartPulse className="size-5 text-brand" aria-hidden="true" />
                <SectionTitle>Overall Posture: {posture}</SectionTitle>
              </div>
              <Badge variant={overallScore >= 70 ? 'success' : overallScore >= 40 ? 'warning' : 'danger'} dot>
                Score: {overallScore}/100
              </Badge>
            </div>

            <Body className="text-text-primary max-w-3xl leading-relaxed">
              {summaryExplanation}
            </Body>

            {/* Quick Diagnostic Callouts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-lg border border-success/20 bg-surface flex items-start gap-2 text-xs">
                <TrendingUp className="size-4 text-success shrink-0 mt-0.5" />
                <div>
                  <span className="text-text-muted font-medium block">What is Healthy?</span>
                  <span className="font-semibold text-text-primary">{strongestDimension.label} ({strongestDimension.score}/100)</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-warning/20 bg-surface flex items-start gap-2 text-xs">
                <TrendingDown className="size-4 text-warning shrink-0 mt-0.5" />
                <div>
                  <span className="text-text-muted font-medium block">What Needs Attention?</span>
                  <span className="font-semibold text-text-primary">{weakestDimension.label} ({weakestDimension.score}/100)</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-brand/20 bg-surface flex items-start gap-2 text-xs">
                <Activity className="size-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <span className="text-text-muted font-medium block">Key Recent Change</span>
                  <span className="text-text-primary line-clamp-1">{mostImportantChange}</span>
                </div>
              </div>
            </div>

            {/* Recommended Action & Confidence */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-brand/15 text-xs">
              <div className="flex items-center gap-1.5 text-text-muted">
                <Shield className="size-3.5 shrink-0" aria-hidden="true" />
                <span>Data Confidence: <strong className="text-text-primary uppercase">{confidence}</strong> (90% complete)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-brand">Recommended: {recommendedAction}</span>
              </div>
            </div>
          </section>

          {/* Diagnostic Dimensions Cards with Detailed Accordion */}
          <FadeInView>
            <div className="space-y-4">
              <SectionTitle>Diagnostic Health Dimensions</SectionTitle>

              <div className="space-y-4">
                {diagnosticDimensions.map((dim) => {
                  const isExpanded = expandedDimension === dim.id;
                  const postureBadge = getPostureBadgeVariant(dim.status);

                  return (
                    <Card key={dim.id} className="overflow-hidden border-border">
                      {/* Compact Collapsed Row */}
                      <button
                        type="button"
                        onClick={() => setExpandedDimension(isExpanded ? null : dim.id)}
                        className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left hover:bg-surface-subtle/50 transition-colors cursor-pointer"
                        aria-expanded={isExpanded}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-lg bg-surface-subtle text-brand shrink-0">
                            <Activity className="size-4" />
                          </div>
                          <div>
                            <CardTitle>{dim.title}</CardTitle>
                            <span className="text-xs text-text-muted block">{dim.metrics.length} metrics assessed</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right hidden sm:block">
                            <span className="text-xs text-text-muted block">Score</span>
                            <span className="text-sm font-bold tabular-nums text-text-primary">{dim.score}/100</span>
                          </div>
                          <Badge variant={postureBadge.variant} dot>{dim.status}</Badge>
                          <ChevronDown className={cn('size-4 text-text-muted transition-transform duration-200', isExpanded && 'rotate-180 text-brand')} />
                        </div>
                      </button>

                      {/* Expanded Rich Diagnostic Content */}
                      <Expand open={isExpanded}>
                        <div className="border-t border-border/60 bg-surface-subtle/30 p-4 sm:p-6 space-y-5">
                          {/* 1. Summary Row */}
                          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border border-border bg-surface">
                            <div className="flex items-center gap-3">
                              <Badge variant={postureBadge.variant} dot>{dim.status}</Badge>
                              <span className="text-xs text-text-muted font-medium">
                                Trend: <strong className="text-text-primary capitalize">{dim.recentTrend}</strong>
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                              <span className="text-text-muted">Confidence: <strong className="text-text-primary uppercase">{dim.confidence}</strong></span>
                              <QualityBadge quality={dim.dataQualityBadge} />
                            </div>
                          </div>

                          {/* 2. Diagnostic Explanation */}
                          <div className="space-y-1">
                            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Diagnostic Analysis</h4>
                            <p className="text-xs sm:text-sm text-text-primary leading-relaxed">
                              {dim.explanation}
                            </p>
                          </div>

                          {/* 3. Dense Diagnostic Table of Contributing Metrics */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Contributing Metrics</h4>
                            <div className="overflow-x-auto rounded-lg border border-border bg-surface">
                              <table className="w-full text-left text-xs text-text-primary">
                                <thead className="border-b border-border bg-surface-subtle/60 text-text-muted">
                                  <tr>
                                    <th className="px-3 py-2 font-semibold">Metric</th>
                                    <th className="px-3 py-2 font-semibold">Current Value</th>
                                    <th className="px-3 py-2 font-semibold">Previous</th>
                                    <th className="px-3 py-2 font-semibold">Status</th>
                                    <th className="px-3 py-2 font-semibold">Impact</th>
                                    <th className="px-3 py-2 font-semibold">Source</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                  {dim.metrics.map((m) => {
                                    const metricBadge = getPostureBadgeVariant(m.status);
                                    return (
                                      <tr key={m.id} className="hover:bg-surface-subtle/30">
                                        <td className="px-3 py-2 font-medium">{m.name}</td>
                                        <td className="px-3 py-2 font-bold tabular-nums">{m.formattedValue}</td>
                                        <td className="px-3 py-2 text-text-muted tabular-nums">{m.formattedPrevious}</td>
                                        <td className="px-3 py-2">
                                          <Badge variant={metricBadge.variant} className="text-[10px] py-0.5 px-1.5">{m.status}</Badge>
                                        </td>
                                        <td className="px-3 py-2 text-text-muted">{m.contributionScore}% weight</td>
                                        <td className="px-3 py-2">
                                          <QualityBadge quality={m.quality} className="text-[10px]" />
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* 4. Why This Matters */}
                          <div className="p-3 rounded-lg border border-brand/15 bg-brand-soft/10 space-y-1">
                            <h4 className="text-xs font-bold text-brand uppercase tracking-wider">Why This Matters</h4>
                            <p className="text-xs text-text-primary leading-relaxed">
                              {dim.whyItMatters}
                            </p>
                          </div>

                          {/* 5. Recommended Actions Grid */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Recommended Next Actions</h4>
                            <div className="flex flex-wrap items-center gap-2">
                              <Link
                                href={dim.primaryAction.href}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand text-white hover:bg-brand-hover text-xs font-semibold transition-colors shadow-2xs"
                              >
                                <Play className="size-3" />
                                <span>{dim.primaryAction.label}</span>
                              </Link>
                              {dim.secondaryActions.map((sec) => (
                                <Link
                                  key={sec.label}
                                  href={sec.href}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-text-primary transition-colors"
                                >
                                  <ArrowRight className="size-3 text-text-muted" />
                                  <span>{sec.label}</span>
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* 6. Assessment Disclosure */}
                          <div className="p-3 rounded-lg border border-border bg-surface text-[11px] text-text-muted space-y-1">
                            <div className="flex items-center gap-1.5 font-semibold text-text-primary">
                              <HelpCircle className="size-3.5 text-text-muted" />
                              <span>How This Is Assessed</span>
                            </div>
                            <p>
                              {dim.assessmentDisclosure.relativeImportanceSummary} {dim.assessmentDisclosure.confidenceNote} Assessment rules are prototype estimates derived from baseline inputs.
                            </p>
                          </div>

                          {/* 7. Mini Trend Context */}
                          {dim.history && dim.history.length > 0 && (
                            <div className="flex items-center gap-3 pt-2 border-t border-border/50 text-xs">
                              <span className="text-text-muted font-medium">3-Month Score Trend:</span>
                              <div className="flex items-center gap-2">
                                {dim.history.map((h) => (
                                  <div key={h.period} className="flex items-center gap-1">
                                    <span className="text-text-muted">{h.period}:</span>
                                    <span className="font-bold tabular-nums text-text-primary">{h.score}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </Expand>
                    </Card>
                  );
                })}
              </div>
            </div>
          </FadeInView>

          {/* Strengths & Vulnerabilities */}
          <FadeInView>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <section className="rounded-xl border border-success/15 bg-success-soft/10 p-5 space-y-3" aria-label="Strengths">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-success" aria-hidden="true" />
                  <CardTitle>Business Strengths</CardTitle>
                </div>
                <ul className="space-y-2">
                  {strengths.map((item, idx) => (
                    <li key={idx} className="flex gap-2 text-xs sm:text-sm text-text-primary">
                      <span className="text-success shrink-0 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-xl border border-warning/15 bg-warning-soft/10 p-5 space-y-3" aria-label="Vulnerabilities">
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-4 text-warning" aria-hidden="true" />
                  <CardTitle>Vulnerabilities</CardTitle>
                </div>
                <ul className="space-y-2">
                  {vulnerabilities.map((item, idx) => (
                    <li key={idx} className="flex gap-2 text-xs sm:text-sm text-text-primary">
                      <span className="text-warning shrink-0 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/risks" className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-hover transition-colors">
                  <span>View associated risk rules</span>
                  <ArrowRight className="size-3" aria-hidden="true" />
                </Link>
              </section>
            </div>
          </FadeInView>

          {/* Prototype Disclaimer */}
          <div className="flex items-start gap-2 p-4 rounded-xl bg-surface-subtle border border-border/60">
            <AlertTriangle className="size-4 mt-0.5 shrink-0 text-text-muted" aria-hidden="true" />
            <p className="text-xs text-text-muted leading-relaxed">
              Business health diagnostic outputs are prototype estimates derived deterministically from snapshot data. They do not constitute guaranteed financial validation.
            </p>
          </div>
        </div>
      </FadeIn>
    </AppPage>
  );
}

function getPostureBadgeVariant(status: HealthPostureStatus): { variant: 'success' | 'healthy' | 'warning' | 'danger' } {
  switch (status) {
    case 'Strong':
      return { variant: 'success' };
    case 'Stable':
      return { variant: 'healthy' };
    case 'Watch':
      return { variant: 'warning' };
    case 'Needs attention':
      return { variant: 'danger' };
    default:
      return { variant: 'healthy' };
  }
}
