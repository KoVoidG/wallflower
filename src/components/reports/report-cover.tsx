// src/components/reports/report-cover.tsx
import { Calendar, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReportCover as ReportCoverData } from '@/features/reports/adapters/reports.adapter';

interface ReportCoverProps {
  data: ReportCoverData;
  className?: string;
}

export function ReportCover({ data, className }: ReportCoverProps) {
  return (
    <header
      className={cn(
        'py-12 md:py-16 border-b border-border',
        className
      )}
    >
      <div className="max-w-2xl">
        {/* Branding */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex size-8 items-center justify-center rounded-lg bg-brand text-white font-bold text-xs">
            W
          </div>
          <span className="text-[13px]/[18px] font-[550] text-text-muted">
            Wallflower
          </span>
        </div>

        {/* Business name */}
        <p className="text-[15px]/[24px] font-[550] text-brand mb-2">
          {data.businessName}
        </p>

        {/* Report title */}
        <h1 className="text-[36px]/[44px] font-[650] text-text-primary mb-6">
          {data.reportTitle}
        </h1>

        {/* Metadata row */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px]/[20px] text-text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3.5" aria-hidden="true" />
            Generated: {data.generatedDate}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3.5" aria-hidden="true" />
            Data through: {data.dataThroughDate}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Hash className="size-3.5" aria-hidden="true" />
            Calc v{data.calculationVersion}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Hash className="size-3.5" aria-hidden="true" />
            Report v{data.reportVersion}
          </span>
        </div>
      </div>
    </header>
  );
}
