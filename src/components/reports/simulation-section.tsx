// src/components/reports/simulation-section.tsx
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { ReportSimulation } from '@/features/reports/adapters/reports.adapter';

interface SimulationSectionProps {
  data: ReportSimulation;
  className?: string;
}

function formatThb(value: number): string {
  return `฿${value.toLocaleString()}`;
}

function formatRunway(months: number): string {
  return `${months.toFixed(1)} mo`;
}

export function SimulationSection({ data, className }: SimulationSectionProps) {
  return (
    <section
      className={cn('py-10 md:py-12 border-b border-border', className)}
      aria-labelledby="simulation-heading"
    >
      <div className="flex items-center gap-3 mb-6">
        <h2
          id="simulation-heading"
          className="text-[28px]/[36px] font-[650] text-text-primary"
        >
          Simulation Outcome
        </h2>
        <Badge variant="info">{data.scenarioType}</Badge>
      </div>

      <p className="text-[15px]/[24px] text-text-secondary mb-6">
        Scenario: <span className="font-[550] text-text-primary">{data.scenarioName}</span>
      </p>

      {/* Comparison table */}
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full min-w-[560px]">
          <thead>
            <tr className="border-b border-border-strong">
              <th className="text-left text-[13px]/[18px] font-[550] text-text-muted py-3 pr-4">
                Metric
              </th>
              <th className="text-right text-[13px]/[18px] font-[550] text-text-muted py-3 px-3">
                Baseline
              </th>
              <th className="text-right text-[13px]/[18px] font-[550] text-success py-3 px-3">
                Best
              </th>
              <th className="text-right text-[13px]/[18px] font-[550] text-text-muted py-3 px-3">
                Expected
              </th>
              <th className="text-right text-[13px]/[18px] font-[550] text-danger py-3 pl-3">
                Worst
              </th>
            </tr>
          </thead>
          <tbody>
            <ComparisonRow
              label="Revenue"
              baseline={formatThb(data.baselineCase.revenue)}
              best={formatThb(data.bestCase.revenue)}
              expected={formatThb(data.expectedCase.revenue)}
              worst={formatThb(data.worstCase.revenue)}
            />
            <ComparisonRow
              label="Expenses"
              baseline={formatThb(data.baselineCase.expenses)}
              best={formatThb(data.bestCase.expenses)}
              expected={formatThb(data.expectedCase.expenses)}
              worst={formatThb(data.worstCase.expenses)}
            />
            <ComparisonRow
              label="Profit"
              baseline={formatThb(data.baselineCase.profit)}
              best={formatThb(data.bestCase.profit)}
              expected={formatThb(data.expectedCase.profit)}
              worst={formatThb(data.worstCase.profit)}
            />
            <ComparisonRow
              label="Cash Runway"
              baseline={formatRunway(data.baselineCase.cashRunway)}
              best={formatRunway(data.bestCase.cashRunway)}
              expected={formatRunway(data.expectedCase.cashRunway)}
              worst={formatRunway(data.worstCase.cashRunway)}
            />
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ComparisonRow({
  label,
  baseline,
  best,
  expected,
  worst,
}: {
  label: string;
  baseline: string;
  best: string;
  expected: string;
  worst: string;
}) {
  return (
    <tr className="border-b border-border">
      <td className="text-[15px]/[24px] font-normal text-text-primary py-3 pr-4">
        {label}
      </td>
      <td className="text-right text-[14px]/[20px] font-[550] text-text-muted tabular-nums py-3 px-3">
        {baseline}
      </td>
      <td className="text-right text-[14px]/[20px] font-[550] text-success tabular-nums py-3 px-3">
        {best}
      </td>
      <td className="text-right text-[14px]/[20px] font-[550] text-text-primary tabular-nums py-3 px-3">
        {expected}
      </td>
      <td className="text-right text-[14px]/[20px] font-[550] text-danger tabular-nums py-3 pl-3">
        {worst}
      </td>
    </tr>
  );
}
