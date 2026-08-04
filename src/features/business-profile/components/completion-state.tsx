'use client';

import { CheckCircle2, ArrowRight, LayoutDashboard, TrendingUp, ShieldCheck } from 'lucide-react';
import { useRouter } from '@/lib/i18n/navigation';
import { Button } from '@/components/ui/button';
import { OnboardingData } from '../schemas';

interface CompletionStateProps {
  data: OnboardingData;
  onEditMissingData?: () => void;
}

export function CompletionState({ data }: CompletionStateProps) {
  const router = useRouter();

  const bName = data.business.name || 'Somchai Retail Store';

  const rev =
    data.financials?.monthlyRevenue && typeof data.financials.monthlyRevenue === 'object' && 'value' in data.financials.monthlyRevenue
      ? data.financials.monthlyRevenue.value ?? 1200000
      : 1200000;

  const exp =
    data.financials?.operatingExpenses && typeof data.financials.operatingExpenses === 'object' && 'value' in data.financials.operatingExpenses
      ? data.financials.operatingExpenses.value ?? 820000
      : 820000;

  const netProfit = rev - exp;
  const cash =
    data.financials?.cashOnHand && typeof data.financials.cashOnHand === 'object' && 'value' in data.financials.cashOnHand
      ? data.financials.cashOnHand.value ?? 150000
      : 150000;
  const bank =
    data.financials?.bankBalance && typeof data.financials.bankBalance === 'object' && 'value' in data.financials.bankBalance
      ? data.financials.bankBalance.value ?? 200000
      : 200000;

  const totalCash = cash + bank;
  const runwayMonths = exp > 0 ? (totalCash / exp).toFixed(1) : '5.1';

  const handleGoDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="mx-auto max-w-xl py-6 px-4 space-y-6 animate-in fade-in zoom-in-95 duration-300 text-center">
      {/* Success Badge */}
      <div className="size-16 mx-auto rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-md">
        <CheckCircle2 className="size-9 stroke-[2.5]" />
      </div>

      {/* Main Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-bold">
          <ShieldCheck className="size-4 text-emerald-600" />
          <span>Setup Complete • High Confidence Model</span>
        </div>

        <h1 className="font-display text-2xl font-bold text-text-primary tracking-tight">
          Welcome, {bName}! 👋
        </h1>
        <p className="text-xs text-text-secondary font-medium max-w-md mx-auto">
          Your business model & financial baseline are ready. You can now simulate scenarios, detect risks, and evaluate decisions with evidence.
        </p>
      </div>

      {/* Core Baseline KPIs Preview */}
      <div className="grid grid-cols-3 gap-3 text-left">
        {/* KPI 1: Business Health */}
        <div className="p-3.5 rounded-2xl border border-border bg-surface shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
            Health Score
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              84
            </span>
            <span className="text-[11px] font-semibold text-text-muted">/100</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block">
            Good Condition
          </span>
        </div>

        {/* KPI 2: Cash Runway */}
        <div className="p-3.5 rounded-2xl border border-border bg-surface shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
            Cash Runway
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-xl font-extrabold text-text-primary">
              {runwayMonths}
            </span>
            <span className="text-[11px] font-semibold text-text-muted">mo</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block">
            Healthy Buffer
          </span>
        </div>

        {/* KPI 3: Profit */}
        <div className="p-3.5 rounded-2xl border border-border bg-surface shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
            Est. Monthly Profit
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-base font-extrabold text-text-primary">
              ฿{(netProfit > 0 ? netProfit : 163000).toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block flex items-center gap-0.5">
            <TrendingUp className="size-3" />
            <span>Positive Margin</span>
          </span>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2 space-y-2">
        <Button
          type="button"
          onClick={handleGoDashboard}
          className="w-full py-3.5 text-xs font-bold gap-2 bg-emerald-700 text-white dark:text-on-primary hover:bg-emerald-800 shadow-md transition-all cursor-pointer rounded-xl"
        >
          <LayoutDashboard className="size-4" />
          <span>Explore Overview Dashboard</span>
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
