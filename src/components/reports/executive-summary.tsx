// src/components/reports/executive-summary.tsx
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { ReportExecutiveSummary as ExecSummaryData } from '@/features/reports/adapters/reports.adapter';

interface ExecutiveSummaryProps {
  data: ExecSummaryData;
  className?: string;
}

const postureConfig = {
  healthy: { label: 'Healthy', variant: 'success' as const },
  cautious: { label: 'Cautious', variant: 'warning' as const },
  critical: { label: 'Critical', variant: 'danger' as const },
};

export function ExecutiveSummary({ data, className }: ExecutiveSummaryProps) {
  const posture = postureConfig[data.posture];

  return (
    <section
      className={cn('py-10 md:py-12 border-b border-border', className)}
      aria-labelledby="exec-summary-heading"
    >
      <div className="flex items-center gap-3 mb-6">
        <h2
          id="exec-summary-heading"
          className="text-[28px]/[36px] font-[650] text-text-primary"
        >
          Executive Summary
        </h2>
        <Badge variant={posture.variant} dot>
          {posture.label}
        </Badge>
      </div>

      <p className="text-[18px]/[30px] font-normal text-text-secondary max-w-3xl mb-6">
        {data.overview}
      </p>

      <div className="bg-brand-soft rounded-[var(--radius-md)] px-4 py-3">
        <p className="text-[15px]/[24px] font-[550] text-brand">
          Key Takeaway
        </p>
        <p className="text-[15px]/[24px] text-text-primary mt-1">
          {data.keyTakeaway}
        </p>
      </div>
    </section>
  );
}
