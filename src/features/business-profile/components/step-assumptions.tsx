'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
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
    <div className="max-w-xl mx-auto py-4 px-4 space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="space-y-1 text-left">
        <h2 className="font-display text-xl font-bold text-text-primary tracking-tight">
          Business Assumptions & Outlook
        </h2>
        <p className="text-xs text-text-secondary font-medium">
          Calibrate baseline predictions and scenario sensitivity.
        </p>
      </div>

      {/* Form Fields Grid */}
      <div className="space-y-4 text-left">
        {/* Expected Demand */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text-primary block">
            Expected Demand
          </label>
          <SegmentedControl
            options={DEMAND_OPTIONS}
            value={asm.demand}
            onChange={(val) => updateAsm({ demand: val })}
            layoutId="segmented-demand"
          />
        </div>

        {/* Supplier Cost Trend */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text-primary block">
            Supplier Cost Trend
          </label>
          <SegmentedControl
            options={SUPPLIER_OPTIONS}
            value={asm.supplierCostTrend}
            onChange={(val) => updateAsm({ supplierCostTrend: val })}
            layoutId="segmented-supplier"
          />
        </div>

        {/* Seasonality Impact */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text-primary block">
            Seasonality Impact
          </label>
          <SegmentedControl
            options={SEASONALITY_OPTIONS}
            value={asm.seasonality}
            onChange={(val) => updateAsm({ seasonality: val })}
            layoutId="segmented-seasonality"
          />
        </div>

        {/* Market Competition */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text-primary block">
            Market Competition
          </label>
          <SegmentedControl
            options={COMPETITION_OPTIONS}
            value={asm.competition}
            onChange={(val) => updateAsm({ competition: val })}
            layoutId="segmented-competition"
          />
        </div>

        {/* Financial Record Confidence */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text-primary block">
            Confidence in Financial Records
          </label>
          <SegmentedControl
            options={CONFIDENCE_OPTIONS}
            value={asm.recordConfidence}
            onChange={(val) => updateAsm({ recordConfidence: val })}
            layoutId="segmented-confidence"
          />
        </div>
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
          className="text-xs font-bold gap-1.5 cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs px-5"
        >
          <span>Continue</span>
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
