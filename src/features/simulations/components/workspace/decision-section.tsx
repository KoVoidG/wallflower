// src/features/simulations/components/workspace/decision-section.tsx
// Renders the primary decision input(s) from scenario config.
'use client';

import { cn } from '@/lib/utils';
import { DynamicInput } from './input-controls';
import { BUSINESS_BASELINE, formatCurrency } from '../../engine/business-baseline';
import type { ScenarioTemplate } from '../../engine/scenario-configs';

interface DecisionSectionProps {
  template: ScenarioTemplate;
  values: Record<string, number | string>;
  onChange: (key: string, value: number | string) => void;
}

export function DecisionSection({ template, values, onChange }: DecisionSectionProps) {
  if (template.decisionInputs.length === 0) return null;

  // Generate computed preview text based on template
  const getComputedPreview = () => {
    if (template.id === 'price_increase') {
      const priceChange = Number(values.priceChangePercent) || 0;
      const currentPrice = BUSINESS_BASELINE.averagePrice;
      const newPrice = currentPrice * (1 + priceChange / 100);
      return `New average price: ${formatCurrency(newPrice)} · Current: ${formatCurrency(currentPrice)}`;
    }
    if (template.id === 'hire_employee') {
      const count = Number(values.numberOfEmployees) || 1;
      return `Adding ${count} new team member${count > 1 ? 's' : ''} to the business`;
    }
    if (template.id === 'cost_reduction') {
      const reduction = Number(values.costReductionPercent) || 0;
      const currentCOGS = BUSINESS_BASELINE.monthlyCOGS;
      const savings = currentCOGS * (reduction / 100);
      return `Monthly COGS savings: ${formatCurrency(savings)} · Current COGS: ${formatCurrency(currentCOGS)}`;
    }
    if (template.id === 'inventory_expansion') {
      const increase = Number(values.inventoryIncreasePercent) || 20;
      const additionalInventory = BUSINESS_BASELINE.inventoryValue * (increase / 100);
      return `Additional inventory: ${formatCurrency(additionalInventory)} · Current: ${formatCurrency(BUSINESS_BASELINE.inventoryValue)}`;
    }
    return null;
  };

  const preview = getComputedPreview();

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="size-7 rounded-lg bg-[#6366F1]/10 dark:bg-[#6366F1]/20 flex items-center justify-center shrink-0">
          <span className="text-xs font-extrabold text-[#6366F1] dark:text-[#A5B4FC]">1</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">Decision</h3>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Set the primary decision you want to evaluate.</p>
        </div>
      </div>

      {/* Decision Input Card */}
      <div className={cn(
        'p-5 rounded-2xl border border-slate-200/80 dark:border-[#1E2638]',
        'bg-white dark:bg-[#111622] shadow-xs space-y-5',
      )}>
        {template.decisionInputs.map((input) => (
          <DynamicInput
            key={input.key}
            config={input}
            value={values[input.key] ?? input.defaultValue}
            onChange={(val) => onChange(input.key, val)}
          />
        ))}

        {/* Computed Preview */}
        {preview && (
          <div className="pt-3 border-t border-slate-100 dark:border-[#1E2638]">
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">
              {preview}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
