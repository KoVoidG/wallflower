'use client';

import { cn } from '@/lib/utils';
import { LineChart } from '@/components/charts';
import { Surface } from '@/components/ui/surface';
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
    // Simulate monthly cash changes
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

  return (
    <Surface border className={cn('p-4', className)}>
      <div className="mb-3">
        <span className="text-[15px] font-[600] text-text-primary">Cash Runway Timeline</span>
        <p className="text-[13px] text-text-muted mt-0.5">Projected cash balance over 12 months</p>
      </div>
      <LineChart
        data={data}
        xKey="month"
        lines={[
          { key: 'baseline', label: 'Baseline', dashed: true },
          { key: 'best', label: 'Best Case', color: 'var(--success)' },
          { key: 'expected', label: 'Expected', color: 'var(--brand)' },
          { key: 'worst', label: 'Worst Case', color: 'var(--danger)' },
        ]}
        height={260}
        ariaLabel="Cash runway projection timeline"
      />
    </Surface>
  );
}
