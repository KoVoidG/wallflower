// src/components/ui/skeleton.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { AppPage } from '@/components/ui/layout';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Base skeleton block with shimmer animation.
 * Respects `prefers-reduced-motion` by disabling animation.
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-md bg-border/50 animate-shimmer motion-reduce:animate-none',
          className
        )}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

/**
 * Multi-line skeleton text placeholder.
 * The last line is shorter to mimic natural text endings.
 */
export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

interface SkeletonCardProps {
  className?: string;
}

/**
 * Skeleton card combining a header block, text lines, and a footer line.
 */
export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface p-4 space-y-4',
        className
      )}
      aria-hidden="true"
    >
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <SkeletonText lines={2} />
      <Skeleton className="h-8 w-24" />
    </div>
  );
}

// ── Route-Level Skeleton System ────────────────────────────────────────────────

export function DashboardSkeleton() {
  return (
    <AppPage aria-busy="true" aria-label="Loading dashboard">
      {/* Page Header */}
      <div className="flex justify-between items-center pb-5 border-b border-border/60">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-60" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {/* Pulse + Recommended Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Skeleton className="lg:col-span-8 h-48 rounded-xl" />
        <Skeleton className="lg:col-span-4 h-48 rounded-xl" />
      </div>

      {/* 4 KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
      </div>

      {/* Trend + Risk Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Skeleton className="lg:col-span-8 h-72 rounded-xl" />
        <Skeleton className="lg:col-span-4 h-72 rounded-xl" />
      </div>
    </AppPage>
  );
}

export function BusinessHealthSkeleton() {
  return (
    <AppPage aria-busy="true" aria-label="Loading business page">
      <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-40 rounded-md" />
            <Skeleton className="h-4 w-72 rounded-md" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-36 rounded-md" />
            <Skeleton className="h-8 w-36 rounded-md" />
          </div>
        </div>

        {/* Tabs Bar Skeleton */}
        <div className="flex justify-between items-center border-b border-border/80 pb-3">
          <div className="flex gap-6">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-5 w-24 rounded-md" />
            <Skeleton className="h-5 w-36 rounded-md" />
            <Skeleton className="h-5 w-28 rounded-md" />
          </div>
          <Skeleton className="h-7 w-32 rounded-md" />
        </div>

        {/* 4 Top Metric Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="size-7 rounded" />
                <Skeleton className="h-4 w-28 rounded" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-7 w-36 rounded" />
                <Skeleton className="h-4 w-24 rounded" />
              </div>
              <Skeleton className="h-4 w-full rounded pt-2" />
            </div>
          ))}
        </div>

        {/* 3 Breakdown Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="size-7 rounded" />
                <Skeleton className="h-5 w-32 rounded" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-full rounded" />
              </div>
              <Skeleton className="h-6 w-full rounded" />
            </div>
          ))}
        </div>

        {/* Key Ratios + Completeness Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-9 rounded-xl border border-border bg-surface p-5 space-y-4">
            <Skeleton className="h-5 w-40 rounded" />
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-20 rounded" />
                  <Skeleton className="h-6 w-16 rounded" />
                  <Skeleton className="h-3 w-16 rounded" />
                  <Skeleton className="h-8 w-full rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-3 rounded-xl border border-border bg-surface p-5 flex flex-col justify-between space-y-4">
            <Skeleton className="h-5 w-32 rounded" />
            <div className="flex items-center gap-4">
              <Skeleton className="size-16 rounded-full shrink-0" />
              <Skeleton className="h-4 w-full rounded" />
            </div>
            <Skeleton className="h-4 w-28 rounded" />
          </div>
        </div>
      </div>
    </AppPage>
  );
}

export function CashFlowSkeleton() {
  return (
    <AppPage aria-busy="true" aria-label="Loading cash flow forecast">
      <div className="space-y-2 pb-5 border-b border-border/60">
        <Skeleton className="h-7 w-44" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
      </div>
      <Skeleton className="h-80 w-full rounded-xl" />
    </AppPage>
  );
}

export function RiskCenterSkeleton() {
  return (
    <AppPage aria-busy="true" aria-label="Loading risk center">
      <div className="space-y-2 pb-5 border-b border-border/60">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-4 w-52" />
      </div>
      <Skeleton className="h-32 w-full rounded-xl" />
      <div className="flex gap-3">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-36 rounded-xl" />
        <Skeleton className="h-36 rounded-xl" />
        <Skeleton className="h-36 rounded-xl" />
      </div>
    </AppPage>
  );
}

export function SimulationResultsSkeleton() {
  return (
    <AppPage aria-busy="true" aria-label="Loading simulation results">
      <div className="space-y-2 pb-5 border-b border-border/60">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
      <Skeleton className="h-72 w-full rounded-xl" />
    </AppPage>
  );
}

export function AdvisorSkeleton() {
  return (
    <AppPage aria-busy="true" aria-label="Loading AI Advisor">
      <div className="flex justify-between items-center pb-4 border-b border-border/80">
        <div className="space-y-1">
          <Skeleton className="h-7 w-36 rounded-md" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
        <div className="min-w-0 space-y-6">
          <Skeleton className="h-56 rounded-2xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
        <div className="hidden lg:block lg:w-[320px] xl:w-[340px] shrink-0 space-y-4">
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    </AppPage>
  );
}

export function ActionPlanSkeleton() {
  return (
    <AppPage aria-busy="true" aria-label="Loading Action Plan">
      <div className="flex justify-between items-center pb-4 border-b border-border/80">
        <div className="space-y-1">
          <Skeleton className="h-7 w-36 rounded-md" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
      <div className="flex gap-2 pb-2">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[400px_minmax(0,1fr)] xl:grid-cols-[440px_minmax(0,1fr)] gap-6 items-start">
        <div className="space-y-3">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
        <div className="hidden lg:block space-y-4">
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    </AppPage>
  );
}

export function DecisionPlannerSkeleton() {
  return (
    <AppPage aria-busy="true" aria-label="Loading Decision Planner">
      <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
        {/* Header Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-border/60">
          <div className="space-y-2">
            <Skeleton className="h-8 w-52 rounded-md" />
            <Skeleton className="h-4 w-72 rounded-md" />
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 border border-border rounded-xl flex items-center gap-3 bg-surface">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-2 w-16 rounded-full" />
            </div>
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>

        {/* Sub-Tabs Bar Skeleton */}
        <div className="flex gap-6 border-b border-border/80 pb-3">
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="h-5 w-40 rounded-md" />
          <Skeleton className="h-5 w-36 rounded-md" />
        </div>

        {/* Search & Filter Toolbar Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Skeleton className="h-9 w-64 rounded-xl" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-32 rounded-xl" />
            <Skeleton className="h-9 w-32 rounded-xl" />
          </div>
        </div>

        {/* Scenario Cards Grid Skeleton (6 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4 rounded-md" />
                <Skeleton className="h-3.5 w-full rounded-md" />
                <Skeleton className="h-3.5 w-4/5 rounded-md" />
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40">
                <Skeleton className="h-10 rounded-md" />
                <Skeleton className="h-10 rounded-md" />
                <Skeleton className="h-10 rounded-md" />
              </div>
              <div className="flex justify-between pt-2 border-t border-border/40">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppPage>
  );
}

export function ReportsSkeleton() {
  return (
    <AppPage aria-busy="true" aria-label="Loading reports">
      <div className="space-y-6 max-w-7xl mx-auto py-2">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32 rounded-md" />
            <Skeleton className="h-4 w-60 rounded-md" />
          </div>
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>

        {/* Search & Filter Toolbar Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Skeleton className="h-9 w-full sm:w-80 rounded-xl" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-32 rounded-xl" />
            <Skeleton className="h-9 w-28 rounded-xl" />
            <Skeleton className="h-9 w-9 rounded-xl" />
          </div>
        </div>

        {/* Section Label */}
        <Skeleton className="h-4 w-32 rounded-md" />

        {/* Report Cards List Skeleton (4 cards) */}
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-border bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
            >
              <div className="flex items-start gap-3.5 flex-1">
                <Skeleton className="size-11 rounded-xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-48 rounded-md" />
                    <Skeleton className="h-4 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-3.5 w-32 rounded-md" />
                  <Skeleton className="h-3.5 w-44 rounded-md" />
                </div>
              </div>

              <div className="flex items-center gap-6 sm:gap-8 self-end sm:self-center shrink-0">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-20 rounded-md" />
                  <Skeleton className="h-5 w-14 rounded-md" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-20 rounded-md" />
                  <Skeleton className="h-5 w-16 rounded-md" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16 rounded-md" />
                  <Skeleton className="h-5 w-12 rounded-md" />
                </div>
                <Skeleton className="size-7 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Footer Skeleton */}
        <div className="flex items-center justify-between pt-3 border-t border-border/60">
          <Skeleton className="h-4 w-48 rounded-md" />
          <div className="flex gap-1.5">
            <Skeleton className="size-7 rounded-lg" />
            <Skeleton className="size-7 rounded-lg" />
            <Skeleton className="size-7 rounded-lg" />
            <Skeleton className="size-7 rounded-lg" />
          </div>
        </div>
      </div>
    </AppPage>
  );
}

export function DataConnectionsSkeleton() {
  return (
    <AppPage aria-busy="true" aria-label="Loading data connections">
      <div className="space-y-2 pb-5 border-b border-border/60">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    </AppPage>
  );
}
