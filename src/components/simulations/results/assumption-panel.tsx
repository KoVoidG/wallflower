'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { H3, Caption } from '@/components/ui/typography';
import { AlertTriangle, Target } from 'lucide-react';
import type { SimulationInput, ScenarioConfig, ConfidenceLevel } from '@/features/simulations/adapters/simulations.adapter';

interface AssumptionPanelProps {
  input: SimulationInput;
  scenarioConfig?: ScenarioConfig;
  confidence?: ConfidenceLevel;
  className?: string;
}

export function AssumptionPanel({ input, scenarioConfig, confidence = 'medium', className }: AssumptionPanelProps) {
  const entries = Object.entries(input.assumptions);

  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-12 gap-5', className)}>
      {/* Sensitivity boundary */}
      <section
        className="lg:col-span-5 rounded-[var(--radius-lg)] border border-warning/20 bg-warning-soft/20 p-6 flex flex-col gap-4"
        aria-label="Sensitivity analysis"
      >
        <div className="flex items-center gap-2">
          <Target className="size-4 text-warning" aria-hidden="true" />
          <H3 className="text-[16px]/[22px]">Sensitivity boundary</H3>
        </div>

        <p className="text-[14px]/[22px] text-text-primary">
          {getSensitivityStatement(input)}
        </p>

        <div className="pt-3 border-t border-warning/15">
          <Caption as="p" className="text-text-secondary">
            This is the assumption most likely to change the recommendation.
            A small change in this variable has a large effect on outcomes.
          </Caption>
        </div>
      </section>

      {/* Assumptions list */}
      <section
        className="lg:col-span-7 rounded-[var(--radius-lg)] border border-border bg-surface p-6 flex flex-col gap-4"
        aria-label="Assumptions and confidence"
      >
        <div className="flex items-center justify-between">
          <H3 className="text-[16px]/[22px]">Assumptions</H3>
          <Badge variant={confidence === 'high' ? 'success' : confidence === 'medium' ? 'warning' : 'danger'} dot>
            {confidence === 'high' ? 'High' : confidence === 'medium' ? 'Medium' : 'Low'} confidence
          </Badge>
        </div>

        <div className="flex flex-col">
          {entries.map(([key, value]) => {
            const fieldConfig = scenarioConfig?.fields.find((f) => f.name === key);
            const label = fieldConfig?.label ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
            const isFromBaseline = fieldConfig?.fromBaseline;

            return (
              <div key={key} className="flex items-center justify-between gap-3 py-2.5 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[14px] text-text-primary truncate">{label}</span>
                  {isFromBaseline ? (
                    <Badge variant="info">Baseline</Badge>
                  ) : (
                    <Badge variant="brand">Your input</Badge>
                  )}
                </div>
                <span className="text-[14px] font-[600] text-text-primary tabular-nums shrink-0">
                  {fieldConfig?.unit === 'THB' ? `฿${Number(value).toLocaleString()}` :
                   fieldConfig?.unit === '%' ? `${value}%` :
                   String(value)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Confidence explanation */}
        <div className="pt-3 border-t border-border flex items-start gap-2">
          <AlertTriangle className="size-3.5 mt-0.5 shrink-0 text-text-muted" aria-hidden="true" />
          <Caption as="p" className="text-text-secondary">
            Results are prototype estimates. They use simplified financial models and do not account
            for all market conditions, seasonality, or operational constraints.
          </Caption>
        </div>
      </section>
    </div>
  );
}

function getSensitivityStatement(input: SimulationInput): string {
  switch (input.scenarioType) {
    case 'hire_employees': {
      const salary = Number(input.assumptions.salary || 25000);
      const threshold = Math.round(salary * 1.4);
      return `This decision remains manageable while total per-person cost stays below ฿${threshold.toLocaleString()}/month. If salary plus benefits exceeds this threshold, the recommendation shifts from "Proceed" to "Delay."`;
    }
    case 'change_price': {
      const elasticity = Number(input.assumptions.elasticity || 1.2);
      const threshold = (elasticity * 0.9).toFixed(1);
      return `This decision remains profitable while demand elasticity stays below ${threshold}. If customers are more price-sensitive than assumed, revenue may decline enough to eliminate the benefit of the price increase.`;
    }
    case 'marketing_investment': {
      const budget = Number(input.assumptions.budget || 50000);
      const breakEvenReach = Math.round(budget / 5);
      return `This campaign breaks even when it reaches at least ${breakEvenReach.toLocaleString()} converting customers. Below this threshold, the investment does not generate enough revenue to justify the spend.`;
    }
    case 'purchase_equipment': {
      const cost = Number(input.assumptions.cost || 200000);
      const maxCost = Math.round(cost * 1.3);
      return `This purchase remains affordable while total cost stays below ฿${maxCost.toLocaleString()}. Unexpected maintenance costs or financing rate changes could push the effective cost above this boundary.`;
    }
    case 'payment_delay': {
      const delay = Number(input.assumptions.delayDays || 30);
      const threshold = Math.round(delay * 1.5);
      return `Cash flow remains manageable while average payment delay stays below ${threshold} days. Beyond this threshold, working capital pressure becomes critical and may require bridge financing.`;
    }
    default:
      return 'Results are most sensitive to revenue assumptions.';
  }
}
