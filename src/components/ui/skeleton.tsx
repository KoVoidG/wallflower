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
          'rounded-md bg-border/50 animate-pulse motion-reduce:animate-none',
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
    <AppPage aria-busy="true" aria-label="Loading business health">
      <div className="space-y-2 pb-5 border-b border-border/60">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-44 w-full rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
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
    <AppPage aria-busy="true" aria-label="Loading AI advisor">
      <div className="space-y-2 pb-5 border-b border-border/60">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
        <Skeleton className="hidden lg:block lg:col-span-4 h-80 rounded-xl" />
      </div>
    </AppPage>
  );
}

export function ActionPlanSkeleton() {
  return (
    <AppPage aria-busy="true" aria-label="Loading action plan">
      <div className="space-y-2 pb-5 border-b border-border/60">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-60" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
      </div>
    </AppPage>
  );
}

export function ReportsSkeleton() {
  return (
    <AppPage aria-busy="true" aria-label="Loading reports">
      <div className="space-y-2 pb-5 border-b border-border/60">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className="h-52 w-full rounded-xl" />
      <div className="space-y-3">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
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
