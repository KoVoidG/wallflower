'use client';

import { cn } from '@/lib/utils';

import {
  Building2,
  DollarSign,
  ShieldAlert,
  Edit2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label, Caption, H2, H3, BodySmall } from '@/components/ui/typography';
import { OnboardingData, BusinessValue } from '../schemas';

interface StepReviewGapsProps {
  data: OnboardingData;
  onChange: (updated: Partial<OnboardingData>) => void;
  onEditStep: (stepNumber: number) => void;
}

export function StepReviewGaps({
  data,
  onChange,
  onEditStep,
}: StepReviewGapsProps) {
  const business = data.business;
  const financials = data.financials;
  const gaps = data.gaps || {};

  // Data completeness calculation
  const finValues = [
    financials.monthlyRevenue?.value,
    financials.monthlyExpenses?.value,
    financials.availableCash?.value,
    financials.receivables?.value,
    financials.upcomingPayables?.value,
    financials.totalDebt?.value,
  ];

  const providedCount = finValues.filter(
    (v) => v !== null && v !== undefined && !isNaN(v)
  ).length;
  const totalCoreFields = 6;
  const completenessPercent = Math.round((providedCount / totalCoreFields) * 100);

  // Data confidence logic
  const actualCount = Object.values(financials).filter(
    (v) => (v as BusinessValue)?.quality === 'actual'
  ).length;
  const estimateCount = Object.values(financials).filter(
    (v) => (v as BusinessValue)?.quality === 'estimate'
  ).length;

  const dataConfidenceLabel =
    actualCount >= 4 ? 'High' : actualCount + estimateCount >= 4 ? 'Medium' : 'Low';

  const updateGapField = (key: keyof NonNullable<OnboardingData['gaps']>, val: unknown) => {
    onChange({
      gaps: {
        ...gaps,
        [key]: val,
      },
    });
  };

  const formatTHB = (num: number | null | undefined): string => {
    if (num === null || num === undefined || isNaN(num)) return '—';
    return `฿${new Intl.NumberFormat('en-US').format(num)}`;
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-brand-soft text-brand font-bold text-sm">
            3
          </div>
          <div>
            <H2 className="text-xl font-bold text-text-primary">Review & Quality Check</H2>
            <BodySmall className="text-text-secondary">
              Inspect your input summary, completeness score, and operational context.
            </BodySmall>
          </div>
        </div>
      </div>

      {/* Completeness & Confidence Score Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-text-primary uppercase tracking-wide">
              Data Completeness
            </Label>
            <span className="text-sm font-extrabold text-brand tabular-nums">
              {completenessPercent}%
            </span>
          </div>
          <div className="w-full bg-surface-subtle rounded-full h-2 overflow-hidden border border-border/40">
            <div
              className="bg-brand h-full transition-all duration-300 rounded-full"
              style={{ width: `${completenessPercent}%` }}
            />
          </div>
          <Caption className="text-[11px] text-text-muted block">
            {providedCount} of {totalCoreFields} core financial fields provided.
          </Caption>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-text-primary uppercase tracking-wide">
              Data Quality Confidence
            </Label>
            <Badge
              variant={
                dataConfidenceLabel === 'High'
                  ? 'success'
                  : dataConfidenceLabel === 'Medium'
                  ? 'warning'
                  : 'danger'
              }
              className="font-bold text-xs"
            >
              {dataConfidenceLabel} Confidence
            </Badge>
          </div>
          <Caption className="text-[11px] text-text-secondary leading-normal block">
            Based on {actualCount} actual record entries and {estimateCount} estimated inputs.
          </Caption>
        </div>
      </div>

      {/* Grouped Editable Summary Cards */}
      <div className="space-y-4">
        <H3 className="text-base font-bold text-text-primary">Input Summary</H3>

        {/* Business Profile Summary Card */}
        <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-brand" />
              <Label className="text-xs font-bold text-text-primary uppercase tracking-wide">
                1. Business Profile & Goals
              </Label>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline cursor-pointer"
            >
              <Edit2 className="size-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <Caption className="text-text-muted block">Business Name</Caption>
              <span className="font-semibold text-text-primary">{business.name || '—'}</span>
            </div>
            <div>
              <Caption className="text-text-muted block">Industry</Caption>
              <span className="font-semibold text-text-primary">{business.industry || '—'}</span>
            </div>
            <div>
              <Caption className="text-text-muted block">Stage</Caption>
              <span className="font-semibold text-text-primary">{business.stage || '—'}</span>
            </div>
          </div>

          {data.goals.selectedGoals && data.goals.selectedGoals.length > 0 && (
            <div className="pt-2 border-t border-border/40">
              <Caption className="text-text-muted block text-[11px]">Selected Goals:</Caption>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {data.goals.selectedGoals.map((g) => (
                  <span
                    key={g}
                    className="inline-flex items-center rounded-md border border-brand/30 bg-brand-soft/20 px-2 py-0.5 text-[11px] font-semibold text-brand"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Financial Baseline Summary Card */}
        <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <div className="flex items-center gap-2">
              <DollarSign className="size-4 text-brand" />
              <Label className="text-xs font-bold text-text-primary uppercase tracking-wide">
                2. Financial Baseline
              </Label>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline cursor-pointer"
            >
              <Edit2 className="size-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <Caption className="text-text-muted block">Monthly Revenue</Caption>
              <span className="font-semibold text-text-primary">
                {formatTHB(financials.monthlyRevenue?.value)}
              </span>
            </div>
            <div>
              <Caption className="text-text-muted block">Monthly Expenses</Caption>
              <span className="font-semibold text-text-primary">
                {formatTHB(financials.monthlyExpenses?.value)}
              </span>
            </div>
            <div>
              <Caption className="text-text-muted block">Available Cash</Caption>
              <span className="font-semibold text-text-primary">
                {formatTHB(financials.availableCash?.value)}
              </span>
            </div>
            <div>
              <Caption className="text-text-muted block">Receivables</Caption>
              <span className="font-semibold text-text-primary">
                {formatTHB(financials.receivables?.value)}
              </span>
            </div>
            <div>
              <Caption className="text-text-muted block">Payables (30 days)</Caption>
              <span className="font-semibold text-text-primary">
                {formatTHB(financials.upcomingPayables?.value)}
              </span>
            </div>
            <div>
              <Caption className="text-text-muted block">Total Debt</Caption>
              <span className="font-semibold text-text-primary">
                {formatTHB(financials.totalDebt?.value)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Risk Context (3-Option Choices) */}
      <div className="space-y-4 pt-4 border-t border-border/60">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-4 text-brand" />
          <H3 className="text-base font-bold text-text-primary">Operational Risk Context</H3>
        </div>
        <Caption className="text-text-muted block text-xs">
          Answer quick questions to help Wallflower detect hidden operational vulnerabilities.
        </Caption>

        <div className="space-y-3">
          <ThreeChoiceField
            label="Are sales heavily reliant on 1–2 key customers (>40% of revenue)?"
            value={gaps.customerConcentration}
            onChange={(val) => updateGapField('customerConcentration', val)}
          />

          <ThreeChoiceField
            label="Are unusual or non-recurring expenses expected in the next 3 months?"
            value={gaps.unusualExpenses}
            onChange={(val) => updateGapField('unusualExpenses', val)}
          />

          <ThreeChoiceField
            label="Is a large tax, lump-sum, or debt payment due within 60 days?"
            value={gaps.largePaymentDue}
            onChange={(val) => updateGapField('largePaymentDue', val)}
          />
        </div>
      </div>
    </div>
  );
}

// ── Three-Choice Option Control (Yes / No / Not sure) ───────────────────────

interface ThreeChoiceFieldProps {
  label: string;
  value?: boolean | string;
  onChange: (val: boolean | string) => void;
}

function ThreeChoiceField({ label, value, onChange }: ThreeChoiceFieldProps) {
  const options = [
    { label: 'Yes', val: true },
    { label: 'No', val: false },
    { label: 'Not sure', val: 'not_sure' },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-border/70 bg-surface p-3 text-xs">
      <span className="font-medium text-text-primary leading-tight">{label}</span>
      <div className="inline-flex rounded-md border border-border bg-surface-subtle/50 p-0.5 shrink-0">
        {options.map((opt) => {
          const isSelected = value === opt.val;
          return (
            <button
              key={String(opt.val)}
              type="button"
              onClick={() => onChange(opt.val)}
              className={cn(
                'px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer select-none',
                isSelected
                  ? 'bg-brand text-white shadow-2xs'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
