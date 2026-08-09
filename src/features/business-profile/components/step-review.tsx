'use client';

import {
  Building2,
  Users,
  DollarSign,
  Package,
  Sliders,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { OnboardingData } from '../schemas';

interface StepReviewProps {
  data: OnboardingData;
  onEditStep: (stepId: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function StepReview({
  data,
  onEditStep,
  onNext,
  onPrev,
}: StepReviewProps) {
  const b = data.business;
  const o = data.operations;
  const f = data.financials;
  const i = data.inventory;
  const a = data.assumptions;

  const revVal =
    f.monthlyRevenue && typeof f.monthlyRevenue === 'object' && 'value' in f.monthlyRevenue
      ? (f.monthlyRevenue.value ?? 1200000).toLocaleString()
      : '1,200,000';

  const expVal =
    f.operatingExpenses && typeof f.operatingExpenses === 'object' && 'value' in f.operatingExpenses
      ? (f.operatingExpenses.value ?? 820000).toLocaleString()
      : '820,000';

  const cashVal =
    f.cashOnHand && typeof f.cashOnHand === 'object' && 'value' in f.cashOnHand
      ? (f.cashOnHand.value ?? 150000).toLocaleString()
      : '150,000';

  const invVal =
    i?.estimatedValue && typeof i.estimatedValue === 'object' && 'value' in i.estimatedValue
      ? (i.estimatedValue.value ?? 350000).toLocaleString()
      : '350,000';

  const reviewItems = [
    {
      stepId: 3,
      icon: Building2,
      iconBg: 'bg-[#6366F1]/10 text-[#4F46E5] dark:text-[#A5B4FC]',
      title: 'Business Profile',
      summary: `${b.name || 'Somchai Retail Store'} • ${b.category || 'Grocery Store'} • ${b.size || 'Micro'} • ${b.age || '1–3 years'}`,
    },
    {
      stepId: 4,
      icon: Users,
      iconBg: 'bg-[#6366F1]/10 text-[#4F46E5] dark:text-[#A5B4FC]',
      title: 'Business Operations',
      summary: `${o?.employees || 6} employees • ${o?.operatingDays || '6 days/week'} • ${o?.transactionsPerDay || 120} transactions/day`,
    },
    {
      stepId: 5,
      icon: DollarSign,
      iconBg: 'bg-[#6366F1]/10 text-[#4F46E5] dark:text-[#A5B4FC]',
      title: 'Financial Baseline',
      summary: `Revenue ฿${revVal} • Expenses ฿${expVal} • Cash ฿${cashVal}`,
    },
    {
      stepId: 6,
      icon: Package,
      iconBg: 'bg-[#6366F1]/10 text-[#4F46E5] dark:text-[#A5B4FC]',
      title: 'Inventory',
      summary: `Value ฿${invVal} • ${i?.categories?.length || 3} categories • Shortages: ${i?.shortages || 'Sometimes'}`,
    },
    {
      stepId: 7,
      icon: Sliders,
      iconBg: 'bg-[#6366F1]/10 text-[#4F46E5] dark:text-[#A5B4FC]',
      title: 'Business Assumptions',
      summary: `Demand: ${a?.demand || 'Stable'} • Supplier Trend: ${a?.supplierCostTrend || 'Stable'} • Seasonality: ${a?.seasonality || 'Low'}`,
    },
  ];

  return (
    <div className="max-w-xl mx-auto py-4 px-4 space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="space-y-1 text-left">
        <h2 className="font-display text-xl font-bold text-text-primary tracking-tight">
          Review your business information
        </h2>
        <p className="text-xs text-text-secondary font-medium">
          Please confirm your details before we perform the data quality check.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-3 text-left">
        {reviewItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-border bg-surface hover:border-border-strong transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`p-2.5 rounded-xl shrink-0 ${item.iconBg}`}>
                  <Icon className="size-4" />
                </div>

                <div className="min-w-0 space-y-0.5">
                  <h3 className="text-xs font-bold text-text-primary truncate">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-text-secondary font-medium truncate">
                    {item.summary}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onEditStep(item.stepId)}
                className="text-xs font-semibold px-3 py-1.5 h-auto text-text-primary border-border hover:bg-surface-hover shrink-0 cursor-pointer"
              >
                Edit
              </Button>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-border/60">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          className="text-xs font-semibold gap-1.5 cursor-pointer px-4"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back</span>
        </Button>

        <Button
          type="button"
          onClick={onNext}
          className="text-xs font-bold gap-1.5 cursor-pointer bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:opacity-95 shadow-md shadow-indigo-500/25 px-5 border-0"
        >
          <span>Generate Business Baseline</span>
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
