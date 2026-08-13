// src/features/business-profile/components/step-assumptions.tsx
'use client';

import { ArrowLeft, ArrowRight, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import type { OnboardingData } from '../schemas';

interface StepAssumptionsProps {
  data: OnboardingData;
  onChange: (updated: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const DEMAND_OPTIONS = ['Declining', 'Stable', 'Growing'] as const;
const SUPPLIER_OPTIONS = ['Falling', 'Stable', 'Rising'] as const;
const SEASONALITY_OPTIONS = ['None', 'Low', 'Medium', 'High'] as const;
const COMPETITION_OPTIONS = ['Low', 'Medium', 'High'] as const;
const CONFIDENCE_OPTIONS = ['Low', 'Moderate', 'High', 'Very High'] as const;

export function StepAssumptions({
  data,
  onChange,
  onNext,
  onPrev,
}: StepAssumptionsProps) {
  const asm = data.assumptions || {
    demand: 'Stable' as const,
    supplierCostTrend: 'Stable' as const,
    seasonality: 'Low' as const,
    competition: 'Medium' as const,
    recordConfidence: 'High' as const,
    expansionPlans: '',
  };

  const updateAsm = (fields: Partial<typeof asm>) => {
    onChange({
      assumptions: {
        ...asm,
        ...fields,
      },
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
      {/* ── Fixed White Box Card (Zero Scroll Canvas) ──────────────────── */}
      <div className="w-full rounded-3xl border border-slate-200/90 dark:border-[#1E2638] bg-white dark:bg-[#111622] shadow-2xl shadow-slate-900/5 dark:shadow-black/60 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 overflow-hidden">
        {/* Header */}
        <div className="space-y-1 text-center sm:text-left border-b border-slate-100 dark:border-[#1E2638] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
              <Sliders className="size-4" />
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                Business Assumptions & Outlook
              </h2>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">
                Calibrate predictions, market trends, and sensitivity parameters.
              </p>
            </div>
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="space-y-4 text-left">
          {/* Row 1: Demand & Supplier Cost Trend */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F172A] dark:text-white block">
                Expected Market Demand
              </label>
              <SegmentedControl
                options={DEMAND_OPTIONS}
                value={asm.demand}
                onChange={(val) => updateAsm({ demand: val })}
                layoutId="segmented-demand"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F172A] dark:text-white block">
                Supplier Cost Trend
              </label>
              <SegmentedControl
                options={SUPPLIER_OPTIONS}
                value={asm.supplierCostTrend}
                onChange={(val) => updateAsm({ supplierCostTrend: val })}
                layoutId="segmented-supplier"
              />
            </div>
          </div>

          {/* Row 2: Seasonality & Competition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F172A] dark:text-white block">
                Seasonality Impact
              </label>
              <SegmentedControl
                options={SEASONALITY_OPTIONS}
                value={asm.seasonality}
                onChange={(val) => updateAsm({ seasonality: val })}
                layoutId="segmented-seasonality"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F172A] dark:text-white block">
                Local Market Competition
              </label>
              <SegmentedControl
                options={COMPETITION_OPTIONS}
                value={asm.competition}
                onChange={(val) => updateAsm({ competition: val })}
                layoutId="segmented-competition"
              />
            </div>
          </div>

          {/* Row 3: Record Confidence */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0F172A] dark:text-white block">
              Confidence in Financial Estimates
            </label>
            <SegmentedControl
              options={CONFIDENCE_OPTIONS}
              value={asm.recordConfidence}
              onChange={(val) => updateAsm({ recordConfidence: val })}
              layoutId="segmented-confidence"
            />
          </div>
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
            <span>Continue</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
