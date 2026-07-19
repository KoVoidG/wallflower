'use client';

import { Suspense, useState, useEffect } from 'react';
import {
  HeartPulse,
  CheckCircle2,
  AlertCircle,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { H2, H3, Caption } from '@/components/ui/typography';
import { Surface } from '@/components/ui/surface';
import { Badge } from '@/components/ui/badge';
import { FadeIn, StaggerChildren } from '@/components/motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getDashboardData } from '@/features/dashboard/adapters/dashboard.adapter';
import type { DashboardData, HealthScoreItem } from '@/features/dashboard/adapters/dashboard.adapter';

export default function BusinessHealthPage() {
  return (
    <Suspense fallback={<HealthPageSkeleton />}>
      <HealthPageLoader />
    </Suspense>
  );
}

function HealthPageLoader() {
  const [data, setData] = useState<DashboardData | null>(null);

  // Fetch the data from the consolidated adapter client-side in useEffect
  useEffect(() => {
    let active = true;
    getDashboardData().then((res) => {
      if (active) {
        setData(res);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  if (!data) {
    return <HealthPageSkeleton />;
  }

  return <BusinessHealthContent data={data} />;
}

interface BusinessHealthContentProps {
  data: DashboardData;
}

function BusinessHealthContent({ data }: BusinessHealthContentProps) {
  const { health } = data;
  const comp = health.completeness;

  return (
    <FadeIn>
      <div className="flex flex-col gap-6">
        {/* Title */}
        <div className="flex items-center gap-2">
          <HeartPulse className="size-6 text-brand" />
          <H2>Business Health</H2>
        </div>

        {/* 1. Persistent Completeness Card */}
        <Surface border className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <H3 className="text-[16px]">Data Completeness & Freshness</H3>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-text-muted text-[13px]">
              <span className="flex items-center gap-1">
                <Calendar className="size-4 shrink-0 text-text-secondary" />
                <span>Snapshots recorded: <strong className="text-text-primary font-semibold">{comp.periodCount} months</strong></span>
              </span>
              <span>•</span>
              <span>Last snapshot date: <strong className="text-text-primary font-semibold">{comp.lastUpdated}</strong></span>
              {comp.staleDays > 0 && (
                <>
                  <span>•</span>
                  <span>Days since update: <strong className="text-text-primary font-semibold">{comp.staleDays} days</strong></span>
                </>
              )}
            </div>
            {comp.staleDays > 30 && (
              <div className="flex items-center gap-1.5 mt-2 text-[12px] text-warning font-medium">
                <AlertTriangle className="size-4 shrink-0" />
                <span>Update snapshot soon to keep runway and risk checks accurate.</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 shrink-0 self-stretch md:self-auto border-t md:border-t-0 border-border pt-3 md:pt-0">
            <div className="flex flex-col items-end">
              <span className="text-[12px] text-text-muted">Completeness Score</span>
              <span className="text-2xl font-bold text-brand">{comp.score}%</span>
            </div>
            <div className="w-16 h-2 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-brand rounded-full" style={{ width: `${comp.score}%` }} />
            </div>
          </div>
        </Surface>

        {/* 2. Detail Score Tabs */}
        <Tabs defaultValue="financial" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full bg-surface-subtle border border-border p-1 rounded-lg">
            <TabsTrigger value="financial" className="cursor-pointer">Financial Health</TabsTrigger>
            <TabsTrigger value="operational" className="cursor-pointer">Operational Health</TabsTrigger>
            <TabsTrigger value="growth" className="cursor-pointer">Growth Readiness</TabsTrigger>
            <TabsTrigger value="strengths" className="cursor-pointer">Strengths & Risks</TabsTrigger>
          </TabsList>

          {/* Financial Health Tab */}
          <TabsContent value="financial" className="mt-4 focus:outline-none">
            <HealthSectionView item={health.financial} title="Financial Health Summary" />
          </TabsContent>

          {/* Operational Health Tab */}
          <TabsContent value="operational" className="mt-4 focus:outline-none">
            <HealthSectionView item={health.operational} title="Operational Efficiency Summary" />
          </TabsContent>

          {/* Growth Readiness Tab */}
          <TabsContent value="growth" className="mt-4 focus:outline-none">
            <HealthSectionView item={health.growth} title="Expansion & Growth Readiness" />
          </TabsContent>

          {/* Strengths & Weaknesses Tab */}
          <TabsContent value="strengths" className="mt-4 focus:outline-none">
            <Surface border className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="space-y-3">
                  <H3 className="text-[16px] text-success flex items-center gap-1.5 border-b border-success/15 pb-2">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span>Business Strengths</span>
                  </H3>
                  <ul className="space-y-2.5">
                    {health.strengths.map((item, idx) => (
                      <li key={idx} className="flex gap-2 text-text-primary text-[14px]">
                        <span className="text-success font-bold select-none shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risks / Weaknesses */}
                <div className="space-y-3">
                  <H3 className="text-[16px] text-warning flex items-center gap-1.5 border-b border-warning/15 pb-2">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>Potential Vulnerabilities</span>
                  </H3>
                  <ul className="space-y-2.5">
                    {health.weaknesses.map((item, idx) => (
                      <li key={idx} className="flex gap-2 text-text-primary text-[14px]">
                        <span className="text-warning font-bold select-none shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Surface>
          </TabsContent>
        </Tabs>
      </div>
    </FadeIn>
  );
}

// Inner helper component for Health scores & contributing metrics
function HealthSectionView({ item, title }: { item: HealthScoreItem; title: string }) {
  return (
    <Surface border className="p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <H3 className="text-[16px] text-text-primary">{title}</H3>
          <Caption className="text-text-muted mt-0.5">Contributing metrics that determine this score</Caption>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={item.status === 'healthy' ? 'success' : 'warning'}>
            {item.status.toUpperCase()}
          </Badge>
          <div className="flex items-baseline gap-0.5">
            <span className="text-3xl font-extrabold text-text-primary">{item.score}</span>
            <span className="text-text-muted text-[13px]">/100</span>
          </div>
        </div>
      </div>

      <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {item.metrics.map((metric) => (
          <StaggerChildren.Item key={metric.label}>
            <Surface variant="subtle" className="p-4 rounded-[var(--radius-md)] border border-border/50 h-full flex flex-col gap-1.5">
              <div className="flex items-center justify-between border-b border-border/30 pb-2">
                <span className="text-[13px] font-[550] text-text-primary">{metric.label}</span>
                <span className={cn(
                  'text-sm font-semibold tabular-nums px-2 py-0.5 rounded-full border text-[12px]',
                  metric.status === 'healthy' && 'text-success border-success/30 bg-success-soft/30',
                  metric.status === 'warning' && 'text-warning border-warning/30 bg-warning-soft/30',
                  metric.status === 'danger' && 'text-danger border-danger/30 bg-danger-soft/30'
                )}>
                  {metric.value} {metric.unit}
                </span>
              </div>
              <p className="text-[13px] leading-[18px] text-text-secondary">
                {metric.description}
              </p>
            </Surface>
          </StaggerChildren.Item>
        ))}
      </StaggerChildren>
    </Surface>
  );
}

// Skeleton loading layout for A11y & visual loading indicator
function HealthPageSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse motion-reduce:animate-none">
      <div className="h-8 w-48 bg-border rounded" />
      <div className="h-24 w-full bg-border rounded-lg" />
      <div className="h-10 w-full bg-border rounded-md" />
      <div className="h-64 w-full bg-border rounded-lg" />
    </div>
  );
}
