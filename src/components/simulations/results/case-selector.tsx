'use client';

import { cn } from '@/lib/utils';
import type { CaseType } from '@/features/simulations/adapters/simulations.adapter';

interface CaseSelectorProps {
  selected: CaseType;
  onSelect: (caseType: CaseType) => void;
  className?: string;
}

const CASES: { type: CaseType; label: string; color: string }[] = [
  { type: 'best', label: 'Best Case', color: 'text-success' },
  { type: 'expected', label: 'Expected', color: 'text-brand' },
  { type: 'worst', label: 'Worst Case', color: 'text-danger' },
];

export function CaseSelector({ selected, onSelect, className }: CaseSelectorProps) {
  return (
    <div
      className={cn('flex items-center gap-1 p-1 rounded-[var(--radius-md)] bg-surface-subtle', className)}
      role="tablist"
      aria-label="Simulation case selector"
    >
      {CASES.map((c) => (
        <button
          key={c.type}
          type="button"
          role="tab"
          aria-selected={selected === c.type}
          onClick={() => onSelect(c.type)}
          className={cn(
            'flex-1 px-4 py-2 rounded-[var(--radius-sm)] text-[13px] font-[550] transition-all duration-200 cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
            selected === c.type
              ? 'bg-surface shadow-sm text-text-primary'
              : 'text-text-muted hover:text-text-secondary'
          )}
        >
          <span className={cn(selected === c.type && c.color)}>
            {c.label}
          </span>
        </button>
      ))}
    </div>
  );
}
