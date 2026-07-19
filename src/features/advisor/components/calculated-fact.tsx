// src/features/advisor/components/calculated-fact.tsx
'use client';

import { Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface CalculatedFactProps {
  value: string;
  unit?: string;
  source?: string;
  className?: string;
}

/**
 * Displays a deterministic calculation result.
 * Left border: brand color. Icon: Calculator. Badge: "Calculated".
 */
export function CalculatedFact({ value, unit, source, className }: CalculatedFactProps) {
  return (
    <div
      className={cn(
        'border-l-3 border-brand bg-surface rounded-[var(--radius-md)] p-4',
        className
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Calculator className="size-4 text-brand" aria-hidden="true" />
        <Badge variant="brand">Calculated</Badge>
      </div>
      <p className="text-[20px]/[28px] font-[600] text-text-primary tabular-nums">
        {value}
        {unit && <span className="ml-1 text-[14px] font-normal text-text-muted">{unit}</span>}
      </p>
      {source && (
        <p className="mt-1 text-[12px]/[18px] text-text-muted">{source}</p>
      )}
    </div>
  );
}
