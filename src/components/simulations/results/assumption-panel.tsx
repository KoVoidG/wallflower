'use client';

import { cn } from '@/lib/utils';
import { Surface } from '@/components/ui/surface';
import { Badge } from '@/components/ui/badge';
import type { SimulationInput, ScenarioConfig } from '@/features/simulations/adapters/simulations.adapter';

interface AssumptionPanelProps {
  input: SimulationInput;
  scenarioConfig?: ScenarioConfig;
  className?: string;
}

export function AssumptionPanel({ input, scenarioConfig, className }: AssumptionPanelProps) {
  const entries = Object.entries(input.assumptions);

  return (
    <Surface border className={cn('', className)}>
      <div className="px-4 py-3 border-b border-border">
        <span className="text-[15px] font-[600] text-text-primary">Assumptions</span>
      </div>
      <div className="p-4">
        <div className="flex flex-col gap-2.5">
          {entries.map(([key, value]) => {
            const fieldConfig = scenarioConfig?.fields.find((f) => f.name === key);
            const label = fieldConfig?.label ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
            const isFromBaseline = fieldConfig?.fromBaseline;

            return (
              <div key={key} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-text-secondary">{label}</span>
                  {isFromBaseline && (
                    <Badge variant="info">Baseline</Badge>
                  )}
                </div>
                <span className="text-[13px] font-[550] text-text-primary tabular-nums">
                  {fieldConfig?.unit === 'THB' ? `฿${Number(value).toLocaleString()}` :
                   fieldConfig?.unit === '%' ? `${value}%` :
                   String(value)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Sensitivity notes */}
        <div className="mt-4 pt-3 border-t border-border">
          <span className="text-[12px] font-[550] text-text-muted uppercase tracking-wider">Sensitivity Notes</span>
          <p className="text-[13px] text-text-muted mt-1.5">
            Results are most sensitive to revenue assumptions. A ±10% change in projected revenue impacts profit by approximately ±฿15,000/month.
          </p>
        </div>
      </div>
    </Surface>
  );
}
