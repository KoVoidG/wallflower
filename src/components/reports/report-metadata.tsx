// src/components/reports/report-metadata.tsx
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReportMetadataInfo } from '@/features/reports/adapters/reports.adapter';

interface ReportMetadataProps {
  data: ReportMetadataInfo;
  className?: string;
}

export function ReportMetadata({ data, className }: ReportMetadataProps) {
  return (
    <footer
      className={cn('py-10 md:py-12 border-b border-border', className)}
      aria-labelledby="metadata-heading"
    >
      <h2
        id="metadata-heading"
        className="text-[28px]/[36px] font-[650] text-text-primary mb-6"
      >
        Assumptions &amp; Limitations
      </h2>

      {/* Metadata fields */}
      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-[13px]/[20px]">
        <div>
          <dt className="font-[550] text-text-muted">Data Through</dt>
          <dd className="text-text-primary mt-0.5">{data.dataThroughDate}</dd>
        </div>
        <div>
          <dt className="font-[550] text-text-muted">Calculation Version</dt>
          <dd className="text-text-primary mt-0.5">v{data.calculationVersion}</dd>
        </div>
        <div>
          <dt className="font-[550] text-text-muted">Report Version</dt>
          <dd className="text-text-primary mt-0.5">v{data.reportVersion}</dd>
        </div>
      </dl>

      {/* Assumptions list */}
      <div className="mb-6">
        <h3 className="text-[15px]/[24px] font-[600] text-text-primary mb-3">
          Assumptions
        </h3>
        <ul className="space-y-1.5">
          {data.assumptions.map((assumption, index) => (
            <li
              key={index}
              className="text-[13px]/[20px] text-text-secondary flex items-start gap-2"
            >
              <span className="text-text-muted select-none" aria-hidden="true">•</span>
              {assumption}
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="bg-surface-subtle rounded-[var(--radius-md)] px-4 py-3 flex items-start gap-2.5">
        <Shield className="size-4 text-text-muted shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-[12px]/[18px] text-text-muted">
          {data.disclaimer}
        </p>
      </div>
    </footer>
  );
}
