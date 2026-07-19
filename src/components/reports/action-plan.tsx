// src/components/reports/action-plan.tsx
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { ReportActionPlan, ActionPhase } from '@/features/reports/adapters/reports.adapter';

interface ActionPlanProps {
  data: ReportActionPlan;
  className?: string;
}

const priorityConfig = {
  high: { label: 'High', variant: 'danger' as const },
  medium: { label: 'Medium', variant: 'warning' as const },
  low: { label: 'Low', variant: 'default' as const },
};

export function ActionPlan({ data, className }: ActionPlanProps) {
  return (
    <section
      className={cn('py-10 md:py-12 border-b border-border', className)}
      aria-labelledby="action-plan-heading"
    >
      <h2
        id="action-plan-heading"
        className="text-[28px]/[36px] font-[650] text-text-primary mb-6"
      >
        90-Day Action Plan
      </h2>

      <div className="space-y-8">
        {data.phases.map((phase, index) => (
          <PhaseCard key={index} phase={phase} index={index} />
        ))}
      </div>
    </section>
  );
}

function PhaseCard({ phase }: { phase: ActionPhase; index: number }) {
  return (
    <div className="relative pl-6 border-l-2 border-brand/30">
      {/* Timeline dot */}
      <div className="absolute -left-[7px] top-0 size-3 rounded-full bg-brand" aria-hidden="true" />

      <h3 className="text-[20px]/[28px] font-[600] text-text-primary mb-3">
        {phase.label}
      </h3>

      <ul className="space-y-2">
        {phase.items.map((item, itemIndex) => {
          const priority = priorityConfig[item.priority];
          return (
            <li key={itemIndex} className="flex items-start gap-2">
              <Badge variant={priority.variant} className="mt-0.5 shrink-0 text-[11px]">
                {priority.label}
              </Badge>
              <span className="text-[15px]/[24px] text-text-secondary">
                {item.text}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
