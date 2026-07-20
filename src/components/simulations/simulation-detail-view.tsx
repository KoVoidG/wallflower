'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { H2, Caption } from '@/components/ui/typography';
import { StaggerChildren } from '@/components/motion';
import { Calendar, Clock } from 'lucide-react';
import {
  ResultSummary,
  CaseSelector,
  ResultKpiRow,
  ComparisonTable,
  AssumptionPanel,
  TimelineChart,
  ResultActions,
} from '@/components/simulations/results';
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
    <StaggerChildren staggerDelay={0.08} className="flex flex-col gap-6 pb-8">
      {/* Simulation context */}
      <StaggerChildren.Item>
        <header className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand">{scenarioLabels[simulation.scenarioType] ?? simulation.scenarioType}</Badge>
            <div className="flex items-center gap-1.5 text-[13px] text-text-muted">
              <Calendar className="size-3.5" aria-hidden="true" />
              <span>{createdDate}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-text-muted">
              <Clock className="size-3.5" aria-hidden="true" />
              <span>Baseline: Jan 2025</span>
            </div>
          </div>
          <H2 className="text-[22px]/[28px]">{simulation.name}</H2>
          <Caption as="p" className="text-text-secondary max-w-[640px]">
            {generateContextSummary(simulation, scenarioConfig)}
          </Caption>
        </header>
      </StaggerChildren.Item>

      {/* Decision Verdict */}
      <StaggerChildren.Item>
        <ResultSummary
          posture={simulation.posture}
          confidence={simulation.confidence}
          results={simulation.results}
          baseline={simulation.baseline}
        />
      </StaggerChildren.Item>

      {/* Case Selector */}
      <StaggerChildren.Item>
        <CaseSelector selected={selectedCase} onSelect={setSelectedCase} />
      </StaggerChildren.Item>

      {/* KPI Row */}
      <StaggerChildren.Item>
        {currentResult && <ResultKpiRow result={currentResult} baseline={simulation.baseline} />}
      </StaggerChildren.Item>

      {/* Comparison Table */}
      <StaggerChildren.Item>
        {currentResult && (
          <ComparisonTable baseline={simulation.baseline} result={currentResult} />
        )}
      </StaggerChildren.Item>

      {/* Timeline */}
      <StaggerChildren.Item>
        <TimelineChart baseline={simulation.baseline} results={simulation.results} />
      </StaggerChildren.Item>

      {/* Assumptions + Sensitivity */}
      <StaggerChildren.Item>
        <AssumptionPanel
          input={simulation.input}
          scenarioConfig={scenarioConfig}
          confidence={simulation.confidence}
        />
      </StaggerChildren.Item>

      {/* Actions */}
      <StaggerChildren.Item>
        <ResultActions
          posture={simulation.posture}
          onSave={() => {}}
          onCompare={() => {}}
          onReport={() => {}}
          onRerun={() => {}}
        />
      </StaggerChildren.Item>
    </StaggerChildren>
  );
}

function generateContextSummary(sim: SimulationData, config?: ScenarioConfig): string {
  const assumptions = sim.input.assumptions;
  switch (sim.scenarioType) {
    case 'hire_employees': {
      const count = assumptions.headcount || 1;
      const salary = Number(assumptions.salary || 25000).toLocaleString();
      return `Testing hiring ${count} employee${Number(count) > 1 ? 's' : ''} at ฿${salary}/month with a ${assumptions.rampUpMonths || 3}-month ramp-up period.`;
    }
    case 'change_price': {
      const current = Number(assumptions.currentPrice || 1500).toLocaleString();
      const newP = Number(assumptions.newPrice || 1800).toLocaleString();
      return `Testing a price change from ฿${current} to ฿${newP}, assuming demand elasticity of ${assumptions.elasticity || 1.2}.`;
    }
    case 'marketing_investment': {
      const budget = Number(assumptions.budget || 50000).toLocaleString();
      return `Testing a ฿${budget} marketing campaign over ${assumptions.duration || 3} months via ${assumptions.channel || 'social media'}.`;
    }
    case 'purchase_equipment': {
      const cost = Number(assumptions.cost || 200000).toLocaleString();
      return `Testing equipment purchase of ฿${cost} with ${assumptions.usefulLife || 5}-year useful life.`;
    }
    case 'payment_delay': {
      return `Testing the impact of ${assumptions.delayDays || 30}-day customer payment delays affecting ${assumptions.affectedPercent || 40}% of customers.`;
    }
    default:
      return config?.description || 'Simulation results.';
  }
}
