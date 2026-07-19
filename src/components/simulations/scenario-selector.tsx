'use client';

import { cn } from '@/lib/utils';
import { Surface } from '@/components/ui/surface';
import { Users, DollarSign, Megaphone, Wrench, Clock } from 'lucide-react';
import type { ScenarioConfig, ScenarioType } from '@/features/simulations/adapters/simulations.adapter';

const ICON_MAP: Record<string, React.ReactNode> = {
  Users: <Users className="size-6" />,
  DollarSign: <DollarSign className="size-6" />,
  Megaphone: <Megaphone className="size-6" />,
  Wrench: <Wrench className="size-6" />,
  Clock: <Clock className="size-6" />,
};

interface ScenarioSelectorProps {
  scenarios: ScenarioConfig[];
  selected: ScenarioType | null;
  onSelect: (type: ScenarioType) => void;
  className?: string;
}

export function ScenarioSelector({
  scenarios,
  selected,
  onSelect,
  className,
}: ScenarioSelectorProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3',
        className
      )}
    >
      {scenarios.map((scenario) => {
        const isSelected = selected === scenario.type;
        return (
          <button
            key={scenario.id}
            type="button"
            onClick={() => onSelect(scenario.type)}
            className="text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded-[var(--radius-md)]"
            aria-pressed={isSelected}
            aria-label={scenario.title}
          >
            <Surface
              border
              className={cn(
                'flex flex-col gap-3 p-4 h-full transition-all duration-200',
                'hover:border-brand/50',
                isSelected && 'border-brand bg-brand-soft'
              )}
            >
              <span
                className={cn(
                  'text-text-muted transition-colors',
                  isSelected && 'text-brand'
                )}
                aria-hidden="true"
              >
                {ICON_MAP[scenario.icon] ?? <Users className="size-6" />}
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-[15px]/[20px] font-[600] text-text-primary">
                  {scenario.title}
                </span>
                <span className="text-[13px]/[18px] text-text-muted line-clamp-2">
                  {scenario.description}
                </span>
              </div>
            </Surface>
          </button>
        );
      })}
    </div>
  );
}
