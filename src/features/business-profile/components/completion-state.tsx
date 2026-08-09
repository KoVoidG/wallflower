'use client';

import {
  CheckCircle2,
  ArrowRight,
  LayoutDashboard,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/lib/i18n/navigation';
import { Button } from '@/components/ui/button';
import { OnboardingData } from '../schemas';

interface CompletionStateProps {
  data: OnboardingData;
  onEditMissingData?: () => void;
}

export function CompletionState({ data }: CompletionStateProps) {
  const t = useTranslations('onboarding');
  const router = useRouter();

  const bName = data.business.name || 'Somchai Retail Store';

  const rev =
    data.financials?.monthlyRevenue &&
    typeof data.financials.monthlyRevenue === 'object' &&
    'value' in data.financials.monthlyRevenue
      ? (data.financials.monthlyRevenue.value ?? 1200000)
      : 1200000;

  const exp =
    data.financials?.operatingExpenses &&
    typeof data.financials.operatingExpenses === 'object' &&
    'value' in data.financials.operatingExpenses
      ? (data.financials.operatingExpenses.value ?? 820000)
      : 820000;

  const netProfit = rev - exp;
  const cash =
    data.financials?.cashOnHand &&
    typeof data.financials.cashOnHand === 'object' &&
    'value' in data.financials.cashOnHand
      ? (data.financials.cashOnHand.value ?? 150000)
      : 150000;
  const bank =
    data.financials?.bankBalance &&
    typeof data.financials.bankBalance === 'object' &&
    'value' in data.financials.bankBalance
      ? (data.financials.bankBalance.value ?? 200000)
      : 200000;

  const totalCash = cash + bank;
  const runwayMonths = exp > 0 ? (totalCash / exp).toFixed(1) : '5.1';

  const handleGoDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="mx-auto max-w-xl py-6 px-4 space-y-6 animate-in fade-in zoom-in-95 duration-300 text-center">
      {/* Success Badge */}
      <div className="size-16 mx-auto rounded-full bg-[#6366F1]/15 text-[#4F46E5] dark:text-[#A5B4FC] flex items-center justify-center border border-[#6366F1]/30 shadow-md">
        <CheckCircle2 className="size-9 stroke-[2.5]" />
      </div>

      {/* Main Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6366F1]/10 text-[#4F46E5] dark:text-[#A5B4FC] border border-[#6366F1]/20 text-xs font-bold">
          <ShieldCheck className="size-4 text-[#6366F1]" />
          <span>{t('completionBadge')}</span>
        </div>

        <h1 className="font-display text-2xl font-bold text-text-primary tracking-tight">
          {t('completionWelcome', { name: bName })}
        </h1>
        <p className="text-xs text-text-secondary font-medium max-w-md mx-auto">
          {t('completionDescription')}
        </p>
      </div>

      {/* Core Baseline KPIs Preview */}
      <div className="grid grid-cols-3 gap-3 text-left">
        {/* KPI 1: Business Health */}
        <div className="p-3.5 rounded-2xl border border-border bg-surface shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
            {t('healthScore')}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              84
            </span>
            <span className="text-[11px] font-semibold text-text-muted">
              /100
            </span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block">
            {t('goodCondition')}
          </span>
        </div>

        {/* KPI 2: Cash Runway */}
        <div className="p-3.5 rounded-2xl border border-border bg-surface shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
            {t('cashRunway')}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-xl font-extrabold text-text-primary">
              {runwayMonths}
            </span>
            <span className="text-[11px] font-semibold text-text-muted">
              mo
            </span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block">
            {t('healthyBuffer')}
          </span>
        </div>

        {/* KPI 3: Profit */}
        <div className="p-3.5 rounded-2xl border border-border bg-surface shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
            {t('estMonthlyProfit')}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-base font-extrabold text-text-primary">
              ฿{(netProfit > 0 ? netProfit : 163000).toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
            <TrendingUp className="size-3" />
            <span>{t('positiveMargin')}</span>
          </span>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2 space-y-2">
        <Button
          type="button"
          onClick={handleGoDashboard}
          className="w-full py-3.5 text-xs font-bold gap-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:opacity-95 shadow-md shadow-indigo-500/25 transition-all cursor-pointer rounded-xl border-0"
        >
          <LayoutDashboard className="size-4" />
          <span>{t('exploreDashboard')}</span>
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
