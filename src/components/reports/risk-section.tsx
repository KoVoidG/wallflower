// src/components/reports/risk-section.tsx
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { ReportRiskAnalysis } from '@/features/reports/adapters/reports.adapter';

interface RiskSectionProps {
  data: ReportRiskAnalysis;
  className?: string;
}

export function RiskSection({ data, className }: RiskSectionProps) {
  return (
    <section
      className={cn('py-10 md:py-12 border-b border-border', className)}
      aria-labelledby="risk-heading"
    >
      <h2
        id="risk-heading"
        className="text-[28px]/[36px] font-[650] text-text-primary mb-4"
      >
        Health &amp; Risk Analysis
      </h2>

      {/* Summary counts */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Badge variant="danger" dot>{data.criticalCount} Critical</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="warning" dot>{data.warningCount} Warning</Badge>
        </div>
      </div>

      {/* Incomplete note */}
      {data.isIncomplete && (
        <div className="flex items-start gap-2 bg-warning-soft rounded-[var(--radius-md)] px-4 py-3 mb-6">
          <AlertTriangle className="size-4 text-warning shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-[13px]/[20px] text-text-secondary">
            Some risk categories could not be fully assessed due to insufficient data.
          </p>
        </div>
      )}

      {/* Risk list */}
      <div className="space-y-4">
        {data.risks.map((risk, index) => (
          <div
            key={index}
            className="border border-border rounded-[var(--radius-md)] p-4"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-[15px]/[24px] font-[600] text-text-primary">
                {risk.title}
              </h3>
              <Badge
                variant={risk.severity === 'critical' ? 'danger' : 'warning'}
              >
                {risk.severity === 'critical' ? 'Critical' : 'Warning'}
              </Badge>
            </div>
            <p className="text-[13px]/[20px] text-text-secondary">
              {risk.evidence}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
