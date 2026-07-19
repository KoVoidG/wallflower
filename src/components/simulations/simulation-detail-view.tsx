'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { StaggerChildren } from '@/components/motion';
import {
  ResultSummary,
  CaseSelector,
  ResultKpiRow,
  ComparisonTable,
  AssumptionPanel,
  TimelineChart,
} from '@/components/simulations/results';
import { GitCompare, FileText, Copy } from 'lucide-react';
import type {
  SimulationData,
  ScenarioConfig,
  CaseType,
} from '@/features/simulations/adapters/simulations.adapter';

interface SimulationDetailViewProps {
  simulation: SimulationData;
  scenarioConfig?: ScenarioConfig;
}

const scenarioLabels: Record<string, string> = {
  hire_employees: 'Hire Employees',
  change_price: 'Change Price',
  marketing_investment: 'Marketing Investment',
  purchase_equipment: 'Purchase Equipment',
  payment_delay: 'Payment Delay',
};

export function SimulationDetailView({ simulation, scenarioConfig }: SimulationDetailViewProps) {
  const [selectedCase, setSelectedCase] = useState<CaseType>('expected');
  const currentResult = simulation.results.find((r) => r.caseType === selectedCase);

  const createdDate = new Date(simulation.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <StaggerChildren staggerDelay={0.08} className="flex flex-col gap-5 pb-8">
      {/* Header */}
      <StaggerChildren.Item>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand">{scenarioLabels[simulation.scenarioType] ?? simulation.scenarioType}</Badge>
            <span className="text-[13px] text-text-muted">{createdDate}</span>
          </div>
          <h1 className="text-[20px] font-[600] text-text-primary">{simulation.name}</h1>
        </div>
      </StaggerChildren.Item>

      <StaggerChildren.Item>
        <ResultSummary
          posture={simulation.posture}
          confidence={simulation.confidence}
          results={simulation.results}
        />
      </StaggerChildren.Item>

      <StaggerChildren.Item>
        <CaseSelector selected={selectedCase} onSelect={setSelectedCase} />
      </StaggerChildren.Item>

      <StaggerChildren.Item>
        {currentResult && <ResultKpiRow result={currentResult} />}
      </StaggerChildren.Item>

      <StaggerChildren.Item>
        {currentResult && (
          <ComparisonTable baseline={simulation.baseline} result={currentResult} />
        )}
      </StaggerChildren.Item>

      <StaggerChildren.Item>
        <TimelineChart baseline={simulation.baseline} results={simulation.results} />
      </StaggerChildren.Item>

      <StaggerChildren.Item>
        <AssumptionPanel input={simulation.input} scenarioConfig={scenarioConfig} />
      </StaggerChildren.Item>

      <StaggerChildren.Item>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)]',
              'border border-border bg-surface text-text-primary font-[550] text-[14px]',
              'hover:bg-surface-subtle transition-colors cursor-pointer',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40'
            )}
          >
            <GitCompare className="size-4" aria-hidden="true" />
            Compare
          </button>
          <button
            type="button"
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)]',
              'border border-border bg-surface text-text-primary font-[550] text-[14px]',
              'hover:bg-surface-subtle transition-colors cursor-pointer',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40'
            )}
          >
            <FileText className="size-4" aria-hidden="true" />
            Generate Report
          </button>
          <button
            type="button"
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)]',
              'border border-border bg-surface text-text-primary font-[550] text-[14px]',
              'hover:bg-surface-subtle transition-colors cursor-pointer',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40'
            )}
          >
            <Copy className="size-4" aria-hidden="true" />
            Duplicate
          </button>
        </div>
      </StaggerChildren.Item>
    </StaggerChildren>
  );
}
