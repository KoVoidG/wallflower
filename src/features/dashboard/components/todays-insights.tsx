// src/features/dashboard/components/todays-insights.tsx
import { AlertTriangle, Lightbulb, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/navigation';
import { H3, Caption } from '@/components/ui/typography';
import type { InsightCategory, InsightData } from '../adapters/dashboard.adapter';

const categoryConfig: Record<
  InsightCategory,
  { borderClass: string; icon: React.ElementType; iconClass: string }
> = {
  risk: {
    borderClass: 'border-l-danger',
    icon: AlertTriangle,
    iconClass: 'text-danger',
  },
  opportunity: {
    borderClass: 'border-l-brand',
    icon: Lightbulb,
    iconClass: 'text-brand',
  },
  action: {
    borderClass: 'border-l-warning',
    icon: ClipboardCheck,
    iconClass: 'text-warning',
  },
};

interface TodaysInsightsProps {
  insights: InsightData[];
  className?: string;
}

export function TodaysInsights({ insights, className }: TodaysInsightsProps) {
  if (insights.length === 0) return null;

  return (
    <section className={cn('flex flex-col gap-3', className)} aria-label="Today's insights">
      <H3 className="text-[18px]/[24px]">Today&apos;s Insights</H3>
      <div className="flex flex-col gap-2">
        {insights.map((insight) => (
          <InsightItem key={insight.id} insight={insight} />
        ))}
      </div>
    </section>
  );
}

function InsightItem({ insight }: { insight: InsightData }) {
  const config = categoryConfig[insight.category];
  const Icon = config.icon;

  const content = (
    <div
      className={cn(
        'flex gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-3.5',
        'border-l-[3px]',
        config.borderClass,
        insight.href && 'cursor-pointer hover:bg-surface-subtle transition-colors duration-150'
      )}
    >
      <span className={cn('shrink-0 mt-0.5', config.iconClass)} aria-hidden="true">
        <Icon className="size-4" />
      </span>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[14px]/[20px] font-[600] text-text-primary">
          {insight.title}
        </span>
        <Caption as="span">{insight.description}</Caption>
      </div>
    </div>
  );

  if (insight.href) {
    return (
      <Link href={insight.href} className="block no-underline">
        {content}
      </Link>
    );
  }

  return content;
}
