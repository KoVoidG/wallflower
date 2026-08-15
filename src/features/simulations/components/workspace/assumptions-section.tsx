// src/features/simulations/components/workspace/assumptions-section.tsx
// Renders assumption inputs with sliders, descriptions, and contextual notes.
'use client';

import { cn } from '@/lib/utils';
import { DynamicInput } from './input-controls';
import type {
  ScenarioTemplate,
  InputConfig,
} from '../../engine/scenario-configs';

interface AssumptionsSectionProps {
  template: ScenarioTemplate;
  values: Record<string, number | string>;
  onChange: (key: string, value: number | string) => void;
}

function getContextNote(
  key: string,
  value: number | string,
): string | undefined {
  const v = Number(value);
  const notes: Record<string, (v: number) => string> = {
    demandResponsePercent: (v) =>
      v < -5
        ? 'Significant drop — Customers are very price-sensitive in this range.'
        : v < 0
          ? 'Slight decrease — Customers may buy less at higher prices.'
          : v === 0
            ? 'No change — Demand remains stable despite price adjustment.'
            : 'Increase — Lower prices could attract more customers.',
    supplierCostChangePercent: (v) =>
      v > 5
        ? 'Notable increase — Consider renegotiating supplier contracts.'
        : v > 0
          ? 'Slight increase — Based on current contracts and market trend.'
          : v === 0
            ? 'Stable — No expected change in supplier costs.'
            : 'Decrease — Favorable supplier pricing expected.',
    marketingSpendChangePercent: (v) =>
      v > 10
        ? 'Significant increase — Ensure marketing ROI justifies the spend.'
        : v > 0
          ? 'Increase — Support price change with more awareness.'
          : v === 0
            ? 'No change — Marketing budget remains the same.'
            : 'Decrease — Reduced marketing may limit price change awareness.',
    rampUpMonths: (v) =>
      v <= 2
        ? 'Fast ramp — Assumes experienced hire with existing network.'
        : v <= 4
          ? 'Standard ramp — Typical for a sales role with training.'
          : 'Slow ramp — Complex product or market may require longer onboarding.',
    sellThroughRatePercent: (v) =>
      v >= 90
        ? 'Excellent — Very strong sell-through expected.'
        : v >= 75
          ? 'Good — Healthy sell-through rate.'
          : 'Moderate — Some overstock risk at this rate.',
    holdingCostPercent: (v) =>
      v >= 5
        ? 'High — Perishable goods or expensive storage.'
        : v >= 2
          ? 'Standard — Typical warehouse and insurance costs.'
          : 'Low — Minimal storage and handling overhead.',
  };

  const fn = notes[key];
  return fn ? fn(v) : undefined;
}

export function AssumptionsSection({
  template,
  values,
  onChange,
}: AssumptionsSectionProps) {
  if (template.assumptions.length === 0) return null;

  // Separate time horizon from other assumptions
  const timeHorizonInput = template.assumptions.find(
    (a) => a.key === 'timeHorizonMonths',
  );
  const otherAssumptions = template.assumptions.filter(
    (a) => a.key !== 'timeHorizonMonths',
  );

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] px-1">
        2. Scenario Assumptions
      </h4>

      {/* Assumptions Card */}
      <div
        className={cn(
          'p-5 rounded-2xl border border-slate-200/80 dark:border-[#1E2638]',
          'bg-white dark:bg-[#111622] shadow-xs',
        )}
      >
        <div className="divide-y divide-slate-100 dark:divide-[#1E2638]">
        {otherAssumptions.map((input: InputConfig, idx: number) => (
          <div key={input.key} className={cn('py-4', idx === 0 && 'pt-0')}>
            <DynamicInput
              config={input}
              value={values[input.key] ?? input.defaultValue}
              onChange={(val) => onChange(input.key, val)}
              contextNote={getContextNote(
                input.key,
                values[input.key] ?? input.defaultValue,
              )}
            />
          </div>
        ))}

        {/* Time Horizon */}
        {timeHorizonInput && (
          <div className="pt-4">
            <DynamicInput
              config={timeHorizonInput}
              value={
                values[timeHorizonInput.key] ?? timeHorizonInput.defaultValue
              }
              onChange={(val) => onChange(timeHorizonInput.key, val)}
            />
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
