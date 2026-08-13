// src/features/business-profile/components/step-review.tsx
'use client';

import {
  Building2,
  Users,
  DollarSign,
  Package,
  Sliders,
  ArrowLeft,
  ArrowRight,
  Edit2,
  CheckCircle2,
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
      stepId: 2,
      icon: Building2,
      title: 'Business Profile',
      summary: `${b.name || 'Somchai Retail Store'} • ${b.category || 'Grocery Store'} • ${b.size || 'Micro'}`,
    },
    {
      stepId: 3,
      icon: Users,
      title: 'Business Operations',
      summary: `${o?.employees || 6} employees • ${o?.operatingDays || '6 days/week'} • ${o?.transactionsPerDay || 120} tx/day`,
    },
    {
      stepId: 4,
      icon: DollarSign,
      title: 'Financial Baseline',
      summary: `Revenue ฿${revVal} • Expenses ฿${expVal} • Cash ฿${cashVal}`,
    },
    {
      stepId: 5,
      icon: Package,
      title: 'Inventory Health',
      summary: `Value ฿${invVal} • ${i?.categories?.length || 3} categories • Shortages: ${i?.shortages || 'Sometimes'}`,
    },
    {
      stepId: 6,
      icon: Sliders,
      title: 'Assumptions & Outlook',
      summary: `Demand: ${a?.demand || 'Stable'} • Supplier: ${a?.supplierCostTrend || 'Stable'} • Confidence: ${a?.recordConfidence || 'High'}`,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
      {/* ── Fixed White Box Card (Zero Scroll Canvas) ──────────────────── */}
      <div className="w-full rounded-3xl border border-slate-200/90 dark:border-[#1E2638] bg-white dark:bg-[#111622] shadow-2xl shadow-slate-900/5 dark:shadow-black/60 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 overflow-hidden">
        {/* Header */}
        <div className="space-y-1 text-center sm:text-left border-b border-slate-100 dark:border-[#1E2638] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
              <CheckCircle2 className="size-4" />
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                Review & Confirm Details
              </h2>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">
                Please verify your details before we calibrate the financial baseline model.
              </p>
            </div>
          </div>
        </div>

        {/* Review Items List */}
        <div className="space-y-2.5">
          {reviewItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/90 dark:border-[#1E2638] bg-slate-50/50 dark:bg-[#182032]/60 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-8 rounded-xl bg-slate-200/80 dark:bg-slate-700 text-slate-900 dark:text-white flex items-center justify-center shrink-0">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-[#0F172A] dark:text-white leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium truncate">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onEditStep(item.stepId)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                  title={`Edit ${item.title}`}
                >
                  <Edit2 className="size-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Navigation Inside Card */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-[#1E2638]">
          <Button
            type="button"
            variant="outline"
            onClick={onPrev}
            className="text-xs font-semibold gap-1.5 cursor-pointer px-4 border-slate-200 dark:border-[#1E2638]"
          >
            <ArrowLeft className="size-3.5" />
            <span>Go back</span>
          </Button>

          <Button
            type="button"
            onClick={onNext}
            className="text-xs font-bold gap-1.5 cursor-pointer bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:opacity-95 shadow-md shadow-indigo-500/25 px-6 py-2 rounded-xl transition-all border-0"
          >
            <span>Confirm & Build Baseline</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
