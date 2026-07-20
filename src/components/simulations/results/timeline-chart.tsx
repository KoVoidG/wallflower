'use client';

import { cn } from '@/lib/utils';
import { LineChart } from '@/components/charts';
import { H3, Caption } from '@/components/ui/typography';
import { formatThbAxis } from '@/components/charts';
import type { SimulationResult, SimulationBaseline } from '@/features/simulations/adapters/simulations.adapter';

interface TimelineChartProps {
  baseline: SimulationBaseline;
  results: SimulationResult[];
  className?: string;
}

function generateTimelineData(baseline: SimulationBaseline, results: SimulationResult[]) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const expected = results.find((r) => r.caseType === 'expected');
  const best = results.find((r) => r.caseType === 'best');
  const worst = results.find((r) => r.caseType === 'worst');

  let baselineCash = 280000;
  let expectedCash = 280000;
  let bestCash = 280000;
  let worstCash = 280000;

  return months.map((month, i) => {
    baselineCash += baseline.profit;
    expectedCash += expected ? expected.profit * (i < 2 ? 0.5 : 1) : 0;
    bestCash += best ? best.profit * (i < 2 ? 0.5 : 1) : 0;
    worstCash += worst ? worst.profit * (i < 2 ? 0.5 : 1) : 0;

    return {
      month,
      baseline: Math.max(0, Math.round(baselineCash)),
      expected: Math.max(0, Math.round(expectedCash)),
      best: Math.max(0, Math.round(bestCash)),
      worst: Math.max(0, Math.round(worstCash)),
    };
  });
}

export function TimelineChart({ baseline, results, className }: TimelineChartProps) {
  const data = generateTimelineData(baseline, results);
  const expected = results.find((r) => r.caseType === 'expected');
  const worst = results.find((r) => r.caseType === 'worst');

  // Find the lowest cash position in worst case
  const worstMin = Math.min(...data.map((d) => d.worst));
  const worstMinMonth = data.find((d) => d.worst === worstMin)?.month ?? '';

  // Safety threshold (4 months of expenses)
  const safetyThreshold = baseline.expenses * 4;

  return (
    <section className={cn('flex flex-col gap-4', className)} aria-label="Cash runway timeline">
      <div className="flex flex-col gap-1">
        <H3 className="text-[18px]/[24px]">
          Will cash remain above the safety threshold?
        </H3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Caption>12-month projection · Decision starts in Month 1</Caption>
          {worst && worstMin < safetyThreshold && (
            <Caption className="text-danger font-[550]">
              Worst case drops below safety in {worstMinMonth}
            </Caption>
          )}
          {expected && data[data.length - 1].expected > data[0].expected && (
            <Caption className="text-success font-[550]">
              Expected case recovers by month 12
            </Caption>
          )}
        </div>
      </div>

      <div className="rounded-[var(--radius-md)] bg-surface border border-border p-5">
        <LineChart
          data={data}
          xKey="month"
          lines={[
            { key: 'baseline', label: 'Baseline (no change)', dashed: true },
            { key: 'best', label: 'Best Case', color: 'var(--success)' },
            { key: 'expected', label: 'Expected', color: 'var(--brand)' },
            { key: 'worst', label: 'Worst Case', color: 'var(--danger)' },
          ]}
          height={280}
          formatY={formatThbAxis}
          showGrid
          showLegend
          ariaLabel={`Cash runway projection over 12 months. Expected case ends at ฿${data[data.length - 1]?.expected?.toLocaleString() ?? 0}. Worst case minimum is ฿${worstMin.toLocaleString()} in ${worstMinMonth}.`}
        />
      </div>
    </section>
  );
}
