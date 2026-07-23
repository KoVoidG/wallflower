'use client';

import { CheckCircle2, ArrowRight, LayoutDashboard } from 'lucide-react';
import { useRouter } from '@/lib/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { OnboardingData, BusinessValue } from '../schemas';


interface CompletionStateProps {
  data: OnboardingData;
  onEditMissingData?: () => void;
}

export function CompletionState({ data, onEditMissingData }: CompletionStateProps) {
  const router = useRouter();

  const financials = data.financials;

  const coreFields = [
    financials.monthlyRevenue?.value,
    financials.monthlyExpenses?.value,
    financials.availableCash?.value,
    financials.receivables?.value,
    financials.upcomingPayables?.value,
    financials.totalDebt?.value,
  ];

  const filledCount = coreFields.filter((v) => v !== null && v !== undefined && !isNaN(v)).length;
  const completenessPct = Math.round((filledCount / coreFields.length) * 100);

  // Estimated field count
  const estimatedCount = Object.values(financials).filter(
    (v) => (v as BusinessValue)?.quality === 'estimate'
  ).length;

  // Cautious Posture Wording
  const rev = financials.monthlyRevenue?.value || 0;
  const exp = financials.monthlyExpenses?.value || 0;

  const isProfitable = rev >= exp;
  const postureLabel = isProfitable ? 'Appears stable' : 'Appears under pressure';
  const postureVariant = isProfitable ? 'success' : 'warning';
  const firstConcern = isProfitable
    ? 'Monitor receivables collection timing'
    : 'Monthly operating expenses exceed current revenue';

  const handleGoDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="mx-auto max-w-2xl py-6 space-y-6 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div className="text-center space-y-2 border-b border-border/60 pb-6">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-7" />
        </div>
        <h2 className="text-2xl font-extrabold text-text-primary">
          Business Baseline Established
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary">
          Your initial financial & operational baseline is ready for scenario testing and decision intelligence.
        </p>
      </div>

      {/* Posture & Confidence Card */}
      <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
              Initial Baseline Assessment
            </span>
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2 mt-0.5">
              <span>{postureLabel}</span>
              <Badge variant={postureVariant}>{postureLabel}</Badge>
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-text-muted">Completeness:</span>
            <span className="font-extrabold text-brand tabular-nums">{completenessPct}%</span>
          </div>
        </div>

        {/* Insight Detail Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="rounded-md border border-border/60 bg-surface-subtle p-3 space-y-0.5">
            <span className="text-text-muted text-[10px] uppercase font-semibold">Estimated Fields</span>
            <p className="font-bold text-text-primary">{estimatedCount} fields</p>
          </div>
          <div className="rounded-md border border-border/60 bg-surface-subtle p-3 space-y-0.5">
            <span className="text-text-muted text-[10px] uppercase font-semibold">First Concern</span>
            <p className="font-bold text-text-primary truncate" title={firstConcern}>{firstConcern}</p>
          </div>
          <div className="rounded-md border border-border/60 bg-surface-subtle p-3 space-y-0.5">
            <span className="text-text-muted text-[10px] uppercase font-semibold">Confidence</span>
            <p className="font-bold text-text-primary">
              {estimatedCount === 0 ? 'High' : 'Medium'}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleGoDashboard}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover transition-colors cursor-pointer shadow-xs"
        >
          <LayoutDashboard className="size-4" />
          <span>View Dashboard</span>
          <ArrowRight className="size-4" />
        </button>

        {onEditMissingData && completenessPct < 100 && (
          <button
            type="button"
            onClick={onEditMissingData}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-primary sm:ml-auto cursor-pointer"
          >
            <span>Complete missing fields</span>
          </button>
        )}
      </div>
    </div>
  );
}
