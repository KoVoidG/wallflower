'use client';

import { KpiCard } from '@/components/metrics';
import { StaggerChildren } from '@/components/motion';
import type { KpiData } from '@/features/dashboard/adapters/dashboard.adapter';

interface KpiSectionProps {
  kpis: KpiData[];
}

/** Derive a formatter function based on the display value pattern. */
function getFormatter(kpi: KpiData): ((value: number) => string) | undefined {
  if (!kpi.numericValue) return undefined;
  if (kpi.value.includes('฿')) {
    return (v: number) => `฿${Math.round(v).toLocaleString()}`;
  }
  if (kpi.unit === '%' || kpi.unit === 'months') {
    return (v: number) => v.toFixed(1);
  }
  return undefined;
}

/**
 * Client component that renders KPI cards with StaggerChildren animation
 * and CountUp number animation on first reveal.
 */
export function KpiSection({ kpis }: KpiSectionProps) {
  return (
    <section aria-label="Key performance indicators">
      <StaggerChildren className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <StaggerChildren.Item key={kpi.label} className="h-full">
            <KpiCard
              label={kpi.label}
              value={kpi.value}
              unit={kpi.unit}
              numericValue={kpi.numericValue}
              formatter={getFormatter(kpi)}
              decimals={kpi.unit === '%' || kpi.unit === 'months' ? 1 : 0}
              change={kpi.change}
              changePeriod={kpi.changePeriod}
              status={kpi.status}
              tooltip={kpi.tooltip}
              trend={kpi.trend}
            />
          </StaggerChildren.Item>
        ))}
      </StaggerChildren>
    </section>
  );
}
