'use client';

import { useState, useEffect } from 'react';
import {
  HeartPulse,
  CheckCircle2,
  AlertCircle,
  Calendar,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Shield,
  Activity,
  Rocket,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { H2, H3, Body, Caption } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { FadeIn, FadeInView } from '@/components/motion';
import { Link } from '@/lib/i18n/navigation';
import { getDashboardData } from '@/features/dashboard/adapters/dashboard.adapter';
import type { DashboardData, HealthScoreItem, HealthMetric } from '@/features/dashboard/adapters/dashboard.adapter';

export default function BusinessHealthPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    let active = true;
    getDashboardData().then((res) => {
      if (active) setData(res);
    });
    return () => { active = false; };
  }, []);

  if (!data) return <HealthPageSkeleton />;

  return (
    <FadeIn>
      <BusinessHealthContent data={data} />
    </FadeIn>
  );
}

function BusinessHealthContent({ data }: { data: DashboardData }) {
  const { health } = data;
  const comp = health.completeness;

  // Determine strongest and weakest areas
  const areas = [
    { key: 'financial', label: 'Financial', score: health.financial.score, status: health.financial.status, icon: Activity },
    { key: 'operational', label: 'Operational', score: health.operational.score, status: health.operational.status, icon: HeartPulse },
    { key: 'growth', label: 'Growth readiness', score: health.growth.score, status: health.growth.status, icon: Rocket },
  ];
  const strongest = areas.reduce((a, b) => (a.score >= b.score ? a : b));
  const weakest = areas.reduce((a, b) => (a.score <= b.score ? a : b));

  // Overall posture
  const avgScore = Math.round(areas.reduce((sum, a) => sum + a.score, 0) / areas.length);
  const posture = avgScore >= 75 ? 'Strong' : avgScore >= 55 ? 'Stable' : avgScore >= 35 ? 'Needs attention' : 'Under pressure';
  const postureColor = avgScore >= 75 ? 'text-success' : avgScore >= 55 ? 'text-brand' : avgScore >= 35 ? 'text-warning' : 'text-danger';
  const postureBg = avgScore >= 75 ? 'bg-success-soft/30 border-success/15' : avgScore >= 55 ? 'bg-brand-soft/30 border-brand/15' : avgScore >= 35 ? 'bg-warning-soft/30 border-warning/15' : 'bg-danger-soft/30 border-danger/15';

  return (
    <div className="flex flex-col gap-8">
      {/* Page heading + data freshness */}
      <header className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <HeartPulse className="size-5 text-brand" aria-hidden="true" />
            <H2>Business Health</H2>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="size-3.5 text-text-muted" aria-hidden="true" />
            <Caption>
              Assessment through {comp.lastUpdated} · {comp.periodCount} months of data
            </Caption>
          </div>
        </div>
      </header>

      {/* Overall health summary - dominant */}
      <section
        className={cn('rounded-[var(--radius-lg)] p-6 md:p-8 border', postureBg)}
        aria-label="Overall business health"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <HeartPulse className={cn('size-5', postureColor)} aria-hidden="true" />
              <H2 className="text-[22px]/[28px] md:text-[24px]/[32px]">{posture}</H2>
            </div>
            <Badge variant={avgScore >= 70 ? 'success' : avgScore >= 40 ? 'warning' : 'danger'} dot>
              {avgScore}/100
            </Badge>
          </div>

          <Body className="text-text-primary max-w-[700px] text-[15px]/[26px]">
            {generateHealthSummary(health, strongest, weakest)}
          </Body>

          {/* Strongest / weakest indicators */}
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            <div className="flex items-start gap-2 text-[13px]/[20px]">
              <TrendingUp className="size-3.5 mt-0.5 shrink-0 text-success" aria-hidden="true" />
              <span className="text-text-secondary">
                <span className="font-[550] text-text-primary">{strongest.label}</span> is strongest at {strongest.score}/100
              </span>
            </div>
            <div className="flex items-start gap-2 text-[13px]/[20px]">
              <TrendingDown className="size-3.5 mt-0.5 shrink-0 text-warning" aria-hidden="true" />
              <span className="text-text-secondary">
                <span className="font-[550] text-text-primary">{weakest.label}</span> needs attention at {weakest.score}/100
              </span>
            </div>
          </div>

          {/* Footer: confidence + recommendation */}
          <div className="flex flex-col gap-3 pt-4 border-t border-border/40">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Shield className="size-3.5 text-text-muted" aria-hidden="true" />
                <Caption>{comp.score >= 80 ? 'High confidence' : comp.score >= 50 ? 'Medium confidence' : 'Low confidence'} · {comp.score}% data completeness</Caption>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Caption className="text-brand font-[550]">
                Recommended: {getTopRecommendation(weakest.key)}
              </Caption>
            </div>
          </div>
        </div>
      </section>

      {/* Health categories - all visible */}
      <FadeInView>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <HealthCategorySection
            title="Financial Health"
            icon={<Activity className="size-4" />}
            item={health.financial}
          />
          <HealthCategorySection
            title="Operational Health"
            icon={<HeartPulse className="size-4" />}
            item={health.operational}
          />
          <HealthCategorySection
            title="Growth Readiness"
            icon={<Rocket className="size-4" />}
            item={health.growth}
          />
        </div>
      </FadeInView>

      {/* Strengths and weaknesses */}
      <FadeInView>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Strengths */}
          <section className="rounded-[var(--radius-lg)] border border-success/15 bg-success-soft/10 p-6 flex flex-col gap-4" aria-label="Business strengths">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-success" aria-hidden="true" />
              <H3 className="text-[16px]/[22px]">Strengths</H3>
            </div>
            <ul className="flex flex-col gap-2.5">
              {health.strengths.map((item, idx) => (
                <li key={idx} className="flex gap-2 text-[14px]/[22px] text-text-primary">
                  <span className="text-success shrink-0 mt-1" aria-hidden="true">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Weaknesses */}
          <section className="rounded-[var(--radius-lg)] border border-warning/15 bg-warning-soft/10 p-6 flex flex-col gap-4" aria-label="Potential vulnerabilities">
            <div className="flex items-center gap-2">
              <AlertCircle className="size-4 text-warning" aria-hidden="true" />
              <H3 className="text-[16px]/[22px]">Vulnerabilities</H3>
            </div>
            <ul className="flex flex-col gap-2.5">
              {health.weaknesses.map((item, idx) => (
                <li key={idx} className="flex gap-2 text-[14px]/[22px] text-text-primary">
                  <span className="text-warning shrink-0 mt-1" aria-hidden="true">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/risks"
              className="inline-flex items-center gap-1 self-start text-[13px] font-[550] text-brand hover:text-brand-hover transition-colors cursor-pointer"
            >
              View risks
              <ArrowRight className="size-3" aria-hidden="true" />
            </Link>
          </section>
        </div>
      </FadeInView>

      {/* Data completeness and confidence */}
      <FadeInView>
        <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 flex flex-col gap-4" aria-label="Data completeness">
          <div className="flex items-center justify-between">
            <H3 className="text-[16px]/[22px]">Assessment confidence</H3>
            <Badge variant={comp.score >= 80 ? 'success' : comp.score >= 50 ? 'warning' : 'danger'} dot>
              {comp.score >= 80 ? 'High' : comp.score >= 50 ? 'Medium' : 'Low'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col gap-0.5">
              <Caption>Data completeness</Caption>
              <span className="text-[18px]/[24px] font-[650] tabular-nums text-text-primary">{comp.score}%</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <Caption>Periods recorded</Caption>
              <span className="text-[18px]/[24px] font-[650] tabular-nums text-text-primary">{comp.periodCount}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <Caption>Last updated</Caption>
              <span className="text-[14px]/[20px] font-[550] text-text-primary">{comp.lastUpdated}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <Caption>Days since update</Caption>
              <span className={cn('text-[18px]/[24px] font-[650] tabular-nums', comp.staleDays > 30 ? 'text-warning' : 'text-text-primary')}>
                {comp.staleDays}
              </span>
            </div>
          </div>

          {comp.hasStaleWarning && (
            <div className="flex items-start gap-2 p-3 rounded-[var(--radius-md)] bg-warning-soft/50 border border-warning/15">
              <AlertTriangle className="size-4 mt-0.5 shrink-0 text-warning" aria-hidden="true" />
              <Caption as="p" className="text-text-primary">
                Financial data may be stale. Update your snapshot to maintain assessment accuracy.
              </Caption>
            </div>
          )}

          <Caption as="p" className="text-text-secondary max-w-[600px]">
            Assessment reliability depends on data freshness and completeness.
            Scores are prototype estimates and should not be treated as validated financial assessments.
            Missing data may affect accuracy in specific categories.
          </Caption>
        </section>
      </FadeInView>
    </div>
  );
}

// ── Helper Components ────────────────────────────────────────────────────

function HealthCategorySection({
  title,
  icon,
  item,
}: {
  title: string;
  icon: React.ReactNode;
  item: HealthScoreItem;
}) {
  const statusColor = item.status === 'healthy' ? 'text-success' : item.status === 'warning' ? 'text-warning' : 'text-danger';
  const statusLabel = item.status === 'healthy' ? 'Strong' : item.status === 'warning' ? 'Needs attention' : 'Critical';

  return (
    <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 flex flex-col gap-4" aria-label={title}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className="text-text-muted" aria-hidden="true">{icon}</span>
          <H3 className="text-[15px]/[20px]">{title}</H3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={item.status === 'healthy' ? 'success' : 'warning'} dot>
            {statusLabel}
          </Badge>
        </div>
      </div>

      {/* Score */}
      <div className="flex items-baseline gap-1.5">
        <span className={cn('text-[28px]/[34px] font-[650] tabular-nums', statusColor)}>
          {item.score}
        </span>
        <span className="text-[14px] text-text-muted">/100</span>
      </div>

      {/* Contributing metrics */}
      <div className="flex flex-col gap-2">
        {item.metrics.map((metric) => (
          <MetricRow key={metric.label} metric={metric} />
        ))}
      </div>
    </section>
  );
}

function MetricRow({ metric }: { metric: HealthMetric }) {
  const statusColor = metric.status === 'healthy' ? 'text-success' : metric.status === 'warning' ? 'text-warning' : 'text-danger';
  const statusIcon = metric.status === 'healthy' ? '↑' : metric.status === 'warning' ? '→' : '↓';

  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
      <div className="flex items-center gap-2 min-w-0">
        <span className={cn('text-[11px] shrink-0', statusColor)} aria-hidden="true">
          {statusIcon}
        </span>
        <span className="text-[13px] text-text-primary truncate">{metric.label}</span>
      </div>
      <span className={cn('text-[13px] font-[600] tabular-nums shrink-0', statusColor)}>
        {metric.value}{metric.unit ? ` ${metric.unit}` : ''}
      </span>
    </div>
  );
}

// ── Helper Functions ─────────────────────────────────────────────────────

function generateHealthSummary(
  health: DashboardData['health'],
  strongest: { key: string; label: string; score: number },
  weakest: { key: string; label: string; score: number }
): string {
  if (strongest.score === weakest.score) {
    return `All business areas are performing at a similar level. Continue monitoring key metrics and keep financial data current.`;
  }

  const weakMetrics = weakest.key === 'financial' ? health.financial.metrics :
    weakest.key === 'operational' ? health.operational.metrics : health.growth.metrics;

  const warningMetric = weakMetrics.find(m => m.status === 'warning' || m.status === 'danger');

  let summary = `${strongest.label} health is the strongest area at ${strongest.score}/100. `;
  summary += `${weakest.label} needs the most attention at ${weakest.score}/100`;

  if (warningMetric) {
    summary += `, primarily because ${warningMetric.label.toLowerCase()} (${warningMetric.value}${warningMetric.unit ? ' ' + warningMetric.unit : ''}) is below target.`;
  } else {
    summary += '.';
  }

  return summary;
}

function getTopRecommendation(weakestKey: string): string {
  switch (weakestKey) {
    case 'financial':
      return 'Review cash reserves and overdue receivables to improve financial resilience.';
    case 'operational':
      return 'Review operational efficiency and identify process bottlenecks.';
    case 'growth':
      return 'Evaluate customer acquisition costs and market expansion feasibility.';
    default:
      return 'Keep business data current and monitor key metrics.';
  }
}

// ── Skeleton ─────────────────────────────────────────────────────────────

function HealthPageSkeleton() {
  return (
    <div className="flex flex-col gap-8 animate-pulse motion-reduce:animate-none" aria-busy="true" aria-label="Loading business health">
      <div className="flex flex-col gap-1">
        <div className="h-9 w-48 bg-border/60 rounded-[var(--radius-md)]" />
        <div className="h-4 w-64 bg-border/60 rounded-[var(--radius-md)]" />
      </div>
      <div className="h-52 w-full bg-border/60 rounded-[var(--radius-lg)]" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="h-64 bg-border/60 rounded-[var(--radius-lg)]" />
        <div className="h-64 bg-border/60 rounded-[var(--radius-lg)]" />
        <div className="h-64 bg-border/60 rounded-[var(--radius-lg)]" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="h-40 bg-border/60 rounded-[var(--radius-lg)]" />
        <div className="h-40 bg-border/60 rounded-[var(--radius-lg)]" />
      </div>
    </div>
  );
}
