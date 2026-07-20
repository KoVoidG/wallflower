// src/features/dashboard/components/todays-insights.tsx
import { Lightbulb, ClipboardCheck, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/navigation';
import { Caption } from '@/components/ui/typography';
import type { InsightData } from '../adapters/dashboard.adapter';

interface RecentActivityProps {
  insights: InsightData[];
  className?: string;
}

/**
 * Recent activity / opportunities / action items.
 * Risks are handled separately by RiskSummary; this shows non-risk insights.
 */
export function RecentActivity({ insights, className }: RecentActivityProps) {
  // Filter to non-risk insights
  const items = insights.filter((i) => i.category !== 'risk');

  if (items.length === 0) return null;

  return (
    <section className={cn('flex flex-col gap-3', className)} aria-label="Recent activity and opportunities">
      <span className="text-[13px]/[18px] font-[600] text-text-muted uppercase tracking-wide">
        Opportunities &amp; Actions
      </span>
      <div className="flex flex-col gap-2">
        {items.map((insight) => (
          <ActivityItem key={insight.id} insight={insight} />
        ))}
      </div>
    </section>
  );
}

function ActivityItem({ insight }: { insight: InsightData }) {
  const isOpportunity = insight.category === 'opportunity';
  const Icon = isOpportunity ? Lightbulb : ClipboardCheck;
  const iconClass = isOpportunity ? 'text-brand' : 'text-warning';

  const content = (
    <div
      className={cn(
        'flex items-start gap-3 rounded-[var(--radius-md)] p-3.5',
        'bg-surface-subtle/60 border border-border/60',
        insight.href && 'cursor-pointer hover:bg-surface-subtle hover:border-border transition-colors duration-150'
      )}
    >
      <span className={cn('shrink-0 mt-0.5', iconClass)} aria-hidden="true">
        <Icon className="size-4" />
      </span>
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="text-[14px]/[20px] font-[550] text-text-primary">
          {insight.title}
        </span>
        <Caption as="span" className="text-text-secondary">
          {insight.description}
        </Caption>
      </div>
      {insight.href && (
        <ArrowRight className="size-3.5 shrink-0 text-text-muted mt-0.5" aria-hidden="true" />
      )}
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

// Keep the old export name for backward compatibility
export { RecentActivity as TodaysInsights };
