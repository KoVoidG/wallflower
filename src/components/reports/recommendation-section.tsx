// src/components/reports/recommendation-section.tsx
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { ReportRecommendation } from '@/features/reports/adapters/reports.adapter';

interface RecommendationSectionProps {
  data: ReportRecommendation;
  className?: string;
}

export function RecommendationSection({ data, className }: RecommendationSectionProps) {
  return (
    <section
      className={cn('py-10 md:py-12 border-b border-border', className)}
      aria-labelledby="recommendation-heading"
    >
      <div className="flex items-center gap-3 mb-6">
        <h2
          id="recommendation-heading"
          className="text-[28px]/[36px] font-[650] text-text-primary"
        >
          Recommendation
        </h2>
        <Badge variant="ai" icon={<Bot />}>AI Generated</Badge>
      </div>

      {/* Summary */}
      <p className="text-[18px]/[30px] text-text-secondary max-w-3xl mb-6">
        {data.summary}
      </p>

      {/* Key actions */}
      <div className="mb-6">
        <h3 className="text-[15px]/[24px] font-[600] text-text-primary mb-3">
          Key Actions
        </h3>
        <ol className="list-decimal list-inside space-y-2">
          {data.actions.map((action, index) => (
            <li
              key={index}
              className="text-[15px]/[24px] text-text-secondary pl-1"
            >
              {action}
            </li>
          ))}
        </ol>
      </div>

      {/* Confidence note */}
      <div className="bg-ai-soft rounded-[var(--radius-md)] px-4 py-3">
        <p className="text-[13px]/[20px] text-text-secondary">
          <span className="font-[550] text-ai">Confidence Note: </span>
          {data.confidenceNote}
        </p>
      </div>
    </section>
  );
}
