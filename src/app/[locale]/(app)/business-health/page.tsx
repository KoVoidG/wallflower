'use client';

import { useState, useEffect } from 'react';
import {
  HeartPulse,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Activity,
  ChevronDown,
  RefreshCw,
  HelpCircle,
  Play,
  Sparkles,
  Banknote,
  ShieldAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { cn } from '@/lib/utils';
import { AppPage } from '@/components/ui/layout';
import { Card, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartCard } from '@/components/charts/chart-card';
import {
  FreshnessIndicator,
  CompletenessIndicator,
  QualityBadge,
} from '@/components/ui/domain-values';
import { BusinessHealthSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { FadeInView, Expand, ChartInView } from '@/components/motion';
import { Link } from '@/lib/i18n/navigation';
import {
  BusinessHealthAdapter,
  type BusinessHealthAssessment,
} from '@/features/business-health/adapters/business-health.adapter';
import type { HealthPostureStatus } from '@/features/business-health/lib/thresholds';
import { AXIS_STYLES, GRID_STYLES } from '@/components/charts/chart-config';

export default function BusinessHealthPage() {
  const [assessment, setAssessment] = useState<BusinessHealthAssessment | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDimension, setExpandedDimension] = useState<string | null>(
    'working-capital',
  );

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await BusinessHealthAdapter.getHealthAssessment({
        simulatedDelayMs: 300,
      });
      setAssessment(res);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load business health diagnostic.',
      );
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
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load business health diagnostic.',
          );
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <BusinessHealthSkeleton />;
  if (error)
    return (
      <ErrorState
        onRetry={loadData}
        title="Assessment Error"
        description={error}
      />
    );
  if (!assessment)
    return (
      <EmptyState
        icon={<HeartPulse />}
        title="No Health Assessment"
        description="Record a financial snapshot to generate your business health diagnostic."
      />
    );

  const {
    overallScore,
    posture,
    summaryExplanation,
    strongestDimension,
    weakestDimension,
    mostImportantChange,
    recommendedAction,
    confidence,
    diagnosticDimensions,
    strengths,
    vulnerabilities,
    completeness,
  } = assessment;

  const postureBadgeVariant =
    posture === 'Strong'
      ? ('success' as const)
      : posture === 'Stable'
        ? ('healthy' as const)
        : ('warning' as const);

  // Diagnostic score trend data for the chart
  const scoreTrendData = [
    {
      period: 'Nov 2024',
      Liquidity: 72,
      Profitability: 70,
      WorkingCapital: 58,
      DebtPressure: 68,
      Efficiency: 62,
      Growth: 48,
    },
    {
      period: 'Dec 2024',
      Liquidity: 68,
      Profitability: 74,
      WorkingCapital: 52,
      DebtPressure: 70,
      Efficiency: 64,
      Growth: 52,
    },
    {
      period: 'Jan 2025',
      Liquidity: 62,
      Profitability: 78,
      WorkingCapital: 45,
      DebtPressure: 70,
      Efficiency: 65,
      Growth: 55,
    },
  ];

  return (
    <AppPage>
      <div data-tour="health-score" className="space-y-6">
        {/* 1. Header (Canonical Single Metadata Group in Toolbar) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight">
                Business Health Diagnostic
              </h1>
              <Badge variant={postureBadgeVariant} dot>
                Posture: {posture}
              </Badge>
            </div>
            <p className="text-xs text-text-secondary">
              Diagnostic evaluation of liquidity, profitability, working
              capital, debt pressure, operating efficiency, and growth
              readiness.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <FreshnessIndicator
              lastUpdated={completeness.lastUpdated}
              staleDays={completeness.staleDays}
            />
            <CompletenessIndicator
              score={completeness.completenessScore}
              confidence={confidence}
            />
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="text-xs"
              onClick={loadData}
            >
              <RefreshCw className="size-3.5" aria-hidden="true" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* 2. Overall Health Executive Summary (Cleaned Score Hierarchy) */}
        <div className="rounded-xl border border-brand/30 bg-surface p-5 sm:p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles
                className="size-4 text-brand shrink-0"
                aria-hidden="true"
              />
              <span className="text-xs font-semibold text-brand uppercase tracking-wider">
                Overall Business Health Assessment
              </span>
            </div>
            <Badge
              variant={
                overallScore >= 70
                  ? 'success'
                  : overallScore >= 40
                    ? 'warning'
                    : 'danger'
              }
              dot
            >
              Score: {overallScore}/100
            </Badge>
          </div>

          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-semibold text-text-primary leading-snug">
              Overall Score: {overallScore}/100
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-3xl">
              {summaryExplanation}
            </p>
          </div>

          {/* Quick Diagnostic Callouts Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-lg border border-success/20 bg-surface-subtle/50 flex items-start gap-2.5 text-xs">
              <TrendingUp className="size-4 text-success shrink-0 mt-0.5" />
              <div>
                <span className="text-text-muted font-medium block text-[11px] uppercase tracking-wider">
                  What is Healthy?
                </span>
                <span className="font-semibold text-text-primary">
                  {strongestDimension.label} ({strongestDimension.score}/100)
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-warning/20 bg-surface-subtle/50 flex items-start gap-2.5 text-xs">
              <TrendingDown className="size-4 text-warning shrink-0 mt-0.5" />
              <div>
                <span className="text-text-muted font-medium block text-[11px] uppercase tracking-wider">
                  Needs Attention
                </span>
                <span className="font-semibold text-text-primary">
                  {weakestDimension.label} ({weakestDimension.score}/100)
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-brand/20 bg-surface-subtle/50 flex items-start gap-2.5 text-xs">
              <Activity className="size-4 text-brand shrink-0 mt-0.5" />
              <div>
                <span className="text-text-muted font-medium block text-[11px] uppercase tracking-wider">
                  Key Recent Change
                </span>
                <span className="font-semibold text-text-primary line-clamp-1">
                  {mostImportantChange}
                </span>
              </div>
            </div>
          </div>

          {/* Recommended Action & CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border/50">
            <div className="text-xs space-y-0.5 max-w-xl">
              <span className="text-text-muted block text-[11px] uppercase tracking-wider font-medium">
                Primary Recommendation
              </span>
              <span className="font-semibold text-brand">
                {recommendedAction}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Button asChild variant="primary" size="md" className="text-xs">
                <Link href="/cash-flow">
                  <Banknote aria-hidden="true" />
                  <span>Review Cash Forecast</span>
                </Link>
              </Button>
              <Button asChild variant="secondary" size="md" className="text-xs">
                <Link href="/advisor">
                  <Sparkles aria-hidden="true" />
                  <span>Consult AI Advisor</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* 3. Six Diagnostic Health Dimensions (Tightened Collapsed Rows) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div>
              <h2 className="text-base font-semibold text-text-primary">
                Diagnostic Health Dimensions
              </h2>
              <p className="text-xs text-text-secondary">
                Detailed assessment across 6 financial dimensions. Click any row
                to expand diagnostic findings.
              </p>
            </div>
            <span className="text-xs text-text-muted font-medium">
              6 Dimensions Assessed
            </span>
          </div>

          <div className="space-y-2.5">
            {diagnosticDimensions.map((dim) => {
              const isExpanded = expandedDimension === dim.id;
              const postureBadge = getPostureBadgeVariant(dim.status);

              return (
                <Card
                  key={dim.id}
                  className="overflow-hidden border-border/80 bg-surface shadow-2xs hover:border-brand/40 transition-colors"
                >
                  {/* Tightened Collapsed Row */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedDimension(isExpanded ? null : dim.id)
                    }
                    className="w-full py-3 px-4 sm:px-5 flex items-center justify-between gap-4 text-left hover:bg-surface-subtle/50 transition-colors cursor-pointer"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-1.5 rounded-lg bg-surface-subtle border border-border/60 text-brand shrink-0">
                        <Activity className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-semibold text-text-primary tracking-tight">
                          {dim.title}
                        </h3>
                        <span className="text-[11px] sm:text-xs text-text-muted block truncate">
                          {dim.changeSummary}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right hidden sm:block">
                        <span className="text-[10px] text-text-muted uppercase tracking-wider block">
                          Score
                        </span>
                        <span className="text-xs sm:text-sm font-bold tabular-nums text-text-primary">
                          {dim.score}/100
                        </span>
                      </div>
                      <Badge variant={postureBadge.variant} dot>
                        {dim.status}
                      </Badge>
                      <ChevronDown
                        className={cn(
                          'size-4 text-text-muted transition-transform duration-200',
                          isExpanded && 'rotate-180 text-brand',
                        )}
                      />
                    </div>
                  </button>

                  {/* Simplified Expanded Content */}
                  <Expand open={isExpanded}>
                    <div className="border-t border-border/60 bg-surface-subtle/20 p-4 sm:p-5 space-y-4">
                      {/* Simple Status & Metadata Row (Unnested) */}
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-text-muted pb-2 border-b border-border/50">
                        <div className="flex items-center gap-2.5">
                          <Badge variant={postureBadge.variant} dot>
                            {dim.status}
                          </Badge>
                          <span>
                            Trend:{' '}
                            <strong className="text-text-primary capitalize">
                              {dim.recentTrend}
                            </strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px]">
                          <span>
                            Confidence:{' '}
                            <strong className="text-text-primary uppercase">
                              {dim.confidence}
                            </strong>
                          </span>
                          <QualityBadge quality={dim.dataQualityBadge} />
                        </div>
                      </div>

                      {/* Diagnostic Explanation */}
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                          Diagnostic Analysis
                        </h4>
                        <p className="text-xs sm:text-sm text-text-primary leading-relaxed">
                          {dim.explanation}
                        </p>
                      </div>

                      {/* Contributing Metrics Table */}
                      <div className="space-y-2">
                        <h4 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                          Contributing Metrics
                        </h4>
                        <div className="overflow-x-auto rounded-lg border border-border/80 bg-surface">
                          <table className="w-full text-left text-xs text-text-primary">
                            <thead className="border-b border-border/60 bg-surface-subtle/60 text-text-muted">
                              <tr>
                                <th className="px-3.5 py-2 font-semibold">
                                  Metric
                                </th>
                                <th className="px-3.5 py-2 font-semibold">
                                  Current Value
                                </th>
                                <th className="px-3.5 py-2 font-semibold">
                                  Previous
                                </th>
                                <th className="px-3.5 py-2 font-semibold">
                                  Status
                                </th>
                                <th className="px-3.5 py-2 font-semibold">
                                  Weight
                                </th>
                                <th className="px-3.5 py-2 font-semibold">
                                  Quality
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                              {dim.metrics.map((m) => {
                                const metricBadge = getPostureBadgeVariant(
                                  m.status,
                                );
                                return (
                                  <tr
                                    key={m.id}
                                    className="hover:bg-surface-subtle/30"
                                  >
                                    <td className="px-3.5 py-2 font-medium">
                                      {m.name}
                                    </td>
                                    <td className="px-3.5 py-2 font-bold tabular-nums">
                                      {m.formattedValue}
                                    </td>
                                    <td className="px-3.5 py-2 text-text-muted tabular-nums">
                                      {m.formattedPrevious}
                                    </td>
                                    <td className="px-3.5 py-2">
                                      <Badge
                                        variant={metricBadge.variant}
                                        className="text-[10px] py-0.5 px-1.5"
                                      >
                                        {m.status}
                                      </Badge>
                                    </td>
                                    <td className="px-3.5 py-2 text-text-muted">
                                      {m.contributionScore}%
                                    </td>
                                    <td className="px-3.5 py-2">
                                      <QualityBadge
                                        quality={m.quality}
                                        className="text-[10px]"
                                      />
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Why This Matters Callout */}
                      <div className="p-3.5 rounded-lg border border-brand/20 bg-brand-soft/10 space-y-1">
                        <h4 className="text-[11px] font-bold text-brand uppercase tracking-wider">
                          Why This Matters
                        </h4>
                        <p className="text-xs text-text-primary leading-relaxed">
                          {dim.whyItMatters}
                        </p>
                      </div>

                      {/* Recommended Actions Strip */}
                      <div className="space-y-2">
                        <h4 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                          Recommended Next Actions
                        </h4>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button asChild variant="primary" size="sm">
                            <Link href={dim.primaryAction.href}>
                              <Play aria-hidden="true" />
                              <span>{dim.primaryAction.label}</span>
                            </Link>
                          </Button>
                          {dim.secondaryActions.map((sec) => (
                            <Button
                              key={sec.label}
                              asChild
                              variant="secondary"
                              size="sm"
                            >
                              <Link href={sec.href}>
                                <ArrowRight aria-hidden="true" />
                                <span>{sec.label}</span>
                              </Link>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Assessment Disclosure */}
                      <div className="pt-2 border-t border-border/50 text-[11px] text-text-muted space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-text-primary">
                          <HelpCircle className="size-3.5 text-text-muted" />
                          <span>Assessment Method & Confidence Disclosure</span>
                        </div>
                        <p>
                          {dim.assessmentDisclosure.relativeImportanceSummary}{' '}
                          {dim.assessmentDisclosure.confidenceNote} Assessment
                          rules are deterministic prototype calculations.
                        </p>
                      </div>

                      {/* 3-Month Score History */}
                      {dim.history && dim.history.length > 0 && (
                        <div className="flex items-center gap-3 pt-2 border-t border-border/50 text-xs">
                          <span className="text-text-muted font-medium">
                            3-Month Score History:
                          </span>
                          <div className="flex items-center gap-3">
                            {dim.history.map((h) => (
                              <div
                                key={h.period}
                                className="flex items-center gap-1"
                              >
                                <span className="text-text-muted text-[11px]">
                                  {h.period}:
                                </span>
                                <span className="font-bold tabular-nums text-text-primary">
                                  {h.score}
                                </span>
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

        {/* 4. Health Visualization (Chart with Emphasized Key Series) */}
        <ChartInView>
          {(shouldRenderChart) => (
            <ChartCard
              title="3-Month Diagnostic Health Score Trends"
              description="Tracking historical score velocity across all six business health diagnostic dimensions."
              action={
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-hover"
                >
                  <span>Return to Decision Cockpit</span>
                  <ArrowRight className="size-3" />
                </Link>
              }
              legendItems={[
                { label: 'Profitability (Strongest)', color: '#16A34A' },
                { label: 'Working Capital (Weakest)', color: '#DC2626' },
                { label: 'Liquidity', color: '#0F766E' },
                { label: 'Debt Pressure', color: '#2563EB' },
                { label: 'Operating Efficiency', color: '#D97706' },
                { label: 'Growth Readiness', color: '#0891B2' },
              ]}
            >
              <div className="h-72 w-full pt-2">
                {shouldRenderChart && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={scoreTrendData}
                      margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray={GRID_STYLES.strokeDasharray}
                        stroke="var(--border)"
                        opacity={0.15}
                      />
                      <XAxis
                        dataKey="period"
                        {...AXIS_STYLES}
                        stroke="var(--text-muted)"
                      />
                      <YAxis
                        domain={[0, 100]}
                        {...AXIS_STYLES}
                        stroke="var(--text-muted)"
                      />
                      <Tooltip
                        formatter={(val) => [`${val}/100`, 'Score']}
                        contentStyle={{
                          backgroundColor: 'var(--surface)',
                          borderColor: 'var(--border)',
                          borderRadius: '10px',
                          fontSize: '12px',
                          color: 'var(--text-primary)',
                        }}
                      />
                      {/* Emphasized Primary Series: Profitability & Working Capital */}
                      <Line
                        type="monotone"
                        dataKey="Profitability"
                        stroke="#16A34A"
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                        animationDuration={800}
                      />
                      <Line
                        type="monotone"
                        dataKey="WorkingCapital"
                        stroke="#DC2626"
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                        animationDuration={800}
                      />
                      {/* De-emphasized Secondary Series */}
                      <Line
                        type="monotone"
                        dataKey="Liquidity"
                        stroke="#0F766E"
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                        dot={{ r: 3 }}
                        animationDuration={800}
                      />
                      <Line
                        type="monotone"
                        dataKey="DebtPressure"
                        stroke="#2563EB"
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                        dot={{ r: 3 }}
                        animationDuration={800}
                      />
                      <Line
                        type="monotone"
                        dataKey="Efficiency"
                        stroke="#D97706"
                        strokeWidth={1.5}
                        strokeDasharray="3 3"
                        dot={{ r: 3 }}
                        animationDuration={800}
                      />
                      <Line
                        type="monotone"
                        dataKey="Growth"
                        stroke="#0891B2"
                        strokeWidth={1.5}
                        strokeDasharray="2 2"
                        dot={{ r: 3 }}
                        animationDuration={800}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </ChartCard>
          )}
        </ChartInView>

        {/* 5. Priority Findings (Simplified Bullet Rows without Individual Box Enclosures) */}
        <FadeInView>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Business Strengths */}
            <Card className="border-emerald-500/30 bg-emerald-500/5 p-5 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    className="size-4 text-emerald-600 dark:text-emerald-400"
                    aria-hidden="true"
                  />
                  <CardTitle>Core Business Strengths</CardTitle>
                </div>
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  {strengths.length} pillars
                </span>
              </div>

              <div className="divide-y divide-border/40">
                {strengths.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-start gap-2.5 text-xs text-text-primary">
                    <span className="text-emerald-600 dark:text-emerald-400 shrink-0 font-bold">
                      •
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Active Vulnerabilities */}
            <Card className="border-danger/30 bg-danger-soft/10 p-5 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-danger/20 pb-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert
                    className="size-4 text-danger"
                    aria-hidden="true"
                  />
                  <CardTitle>Active Vulnerabilities & Pressures</CardTitle>
                </div>
                <span className="text-xs font-medium text-danger">
                  {vulnerabilities.length} priorities
                </span>
              </div>

              <div className="divide-y divide-border/40">
                {vulnerabilities.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-start gap-2.5 text-xs text-text-primary">
                    <span className="text-danger shrink-0 font-bold">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-danger/15">
                <Link
                  href="/risks"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-hover transition-colors"
                >
                  <span>Open Risk Detection Center</span>
                  <ArrowRight className="size-3" aria-hidden="true" />
                </Link>
              </div>
            </Card>
          </div>
        </FadeInView>

        {/* 6. Recommended Next Actions Section */}
        <FadeInView>
          <div className="rounded-xl border border-border bg-surface p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-text-primary">
                  Recommended Next Steps
                </h3>
                <p className="text-xs text-text-secondary">
                  Targeted actions to resolve vulnerabilities and build cash
                  runway.
                </p>
              </div>
              <span className="text-xs font-medium text-brand">
                Actionable
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild variant="primary" size="md">
                <Link href="/cash-flow">
                  <Banknote aria-hidden="true" />
                  <span>Review Cash Forecast & Runway</span>
                </Link>
              </Button>

              <Button asChild variant="secondary" size="md">
                <Link href="/simulations/new?type=payment_delay">
                  <Play aria-hidden="true" />
                  <span>Simulate Payment Delay</span>
                </Link>
              </Button>

              <Button asChild variant="outline" size="md">
                <Link href="/advisor">
                  <Sparkles aria-hidden="true" />
                  <span>Ask AI Advisor for Cost Plan</span>
                </Link>
              </Button>
            </div>
          </div>
        </FadeInView>

        {/* Prototype Disclaimer Footer */}
        <div className="flex items-start gap-2.5 p-4 rounded-xl bg-surface-subtle border border-border/60 text-xs text-text-muted">
          <AlertTriangle
            className="size-4 mt-0.5 shrink-0 text-warning"
            aria-hidden="true"
          />
          <p className="leading-relaxed">
            Business Health Diagnostic outputs are deterministic calculations
            derived from snapshots. They do not constitute guaranteed financial,
            tax, or legal advice.
          </p>
        </div>
      </div>
    </AppPage>
  );
}

function getPostureBadgeVariant(status: HealthPostureStatus): {
  variant: 'success' | 'healthy' | 'warning' | 'danger';
} {
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
