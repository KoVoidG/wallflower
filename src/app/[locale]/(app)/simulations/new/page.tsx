'use client';

import { useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { FadeIn, FadeInView, StaggerChildren } from '@/components/motion';
import { H2, H3, Body, Caption } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import {
  HireEmployeesForm,
  ChangePriceForm,
  MarketingInvestmentForm,
  EquipmentPurchaseForm,
  PaymentDelayForm,
} from '@/components/simulations/forms';
import {
  ResultSummary,
  CaseSelector,
  ResultKpiRow,
  ComparisonTable,
  AssumptionPanel,
  TimelineChart,
  ResultActions,
} from '@/components/simulations/results';
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Users,
  DollarSign,
  Megaphone,
  Wrench,
  Clock,
  Check,
  AlertTriangle,
  Database,
  Calculator,
  FlaskConical,
  Target,
  FileText,
} from 'lucide-react';
import type {
  ScenarioType,
  ScenarioConfig,
  SimulationData,
  SimulationInput,
  CaseType,
  SimulationBaseline,
} from '@/features/simulations/adapters/simulations.adapter';
import { getScenarioConfigs, runSimulation } from '@/features/simulations/adapters/simulations.adapter';
import { formatBaht } from '@/lib/calculations/money';
import Link from 'next/link';

type Stage = 'choose' | 'assumptions' | 'review' | 'running' | 'results';

const STAGE_LABELS: Record<string, string> = {
  choose: 'Choose decision',
  assumptions: 'Set assumptions',
  review: 'Review & run',
};

const ICON_MAP: Record<string, React.ElementType> = {
  Users,
  DollarSign,
  Megaphone,
  Wrench,
  Clock,
};

const MOCK_BASELINE: SimulationBaseline = {
  revenue: 152400,
  expenses: 164800,
  profit: -12400,
  cashRunway: 2.1,
  workingCapital: -58860,
};

const CALC_STAGES = [
  { icon: Database, label: 'Reading business baseline' },
  { icon: Calculator, label: 'Applying assumptions' },
  { icon: FlaskConical, label: 'Calculating scenarios' },
  { icon: Target, label: 'Testing sensitivity' },
  { icon: FileText, label: 'Preparing recommendation' },
];

export default function NewSimulationPage() {
  const [stage, setStage] = useState<Stage>('choose');
  const [scenarios, setScenarios] = useState<ScenarioConfig[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType | null>(null);
  const [result, setResult] = useState<SimulationData | null>(null);
  const [selectedCase, setSelectedCase] = useState<CaseType>('expected');
  const [scenariosLoaded, setScenariosLoaded] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [calcStage, setCalcStage] = useState(0);

  if (!scenariosLoaded) {
    getScenarioConfigs().then((configs) => {
      setScenarios(configs);
      setScenariosLoaded(true);
    });
  }

  const selectedConfig = useMemo(
    () => scenarios.find((s) => s.type === selectedScenario),
    [scenarios, selectedScenario]
  );

  const handleScenarioSelect = useCallback((type: ScenarioType) => {
    setSelectedScenario(type);
    setStage('assumptions');
  }, []);

  const handleFormSubmit = useCallback((values: Record<string, unknown>) => {
    setFormValues(values);
    setStage('review');
  }, []);

  const handleRunSimulation = useCallback(async () => {
    if (!selectedScenario) return;
    setStage('running');
    setCalcStage(0);

    // Animate through calculation stages
    for (let i = 0; i < CALC_STAGES.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCalcStage(i + 1);
    }

    const input: SimulationInput = {
      scenarioType: selectedScenario,
      assumptions: formValues as Record<string, number | string>,
    };

    const data = await runSimulation(input);
    setResult(data);
    setStage('results');
  }, [selectedScenario, formValues]);

  const goBack = useCallback(() => {
    if (stage === 'assumptions') { setStage('choose'); }
    else if (stage === 'review') { setStage('assumptions'); }
    else if (stage === 'results') { setStage('review'); setResult(null); }
  }, [stage]);

  const currentResult = result?.results.find((r) => r.caseType === selectedCase);
  const stageOrder: Stage[] = ['choose', 'assumptions', 'review'];
  const currentStageIndex = stageOrder.indexOf(stage);

  return (
    <FadeIn className="flex flex-col gap-6 pb-8">
      {/* Stage navigation - only show during input stages */}
      {(stage === 'choose' || stage === 'assumptions' || stage === 'review') && (
        <nav aria-label="Simulation stages" className="flex items-center gap-1">
          {stageOrder.map((s, i) => {
            const isActive = stage === s;
            const isCompleted = currentStageIndex > i;
            return (
              <div key={s} className="flex items-center gap-1">
                {i > 0 && (
                  <div className={cn(
                    'w-6 sm:w-10 h-px mx-1',
                    isCompleted ? 'bg-brand' : 'bg-border'
                  )} />
                )}
                <button
                  type="button"
                  disabled={!isCompleted && !isActive}
                  onClick={() => isCompleted && setStage(s)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-md)] text-[13px] font-[550] transition-colors',
                    isActive && 'bg-brand-soft text-brand',
                    isCompleted && 'text-brand hover:bg-brand-soft/50 cursor-pointer',
                    !isActive && !isCompleted && 'text-text-muted cursor-default'
                  )}
                  aria-current={isActive ? 'step' : undefined}
                >
                  <span className={cn(
                    'size-5 rounded-full flex items-center justify-center text-[11px] font-[650] shrink-0',
                    isActive && 'bg-brand text-white',
                    isCompleted && 'bg-brand text-white',
                    !isActive && !isCompleted && 'bg-surface-subtle border border-border text-text-muted'
                  )}>
                    {isCompleted ? <Check className="size-3" /> : i + 1}
                  </span>
                  <span className="hidden sm:inline">{STAGE_LABELS[s]}</span>
                </button>
              </div>
            );
          })}
        </nav>
      )}

      {/* Stage 1: Choose Decision */}
      {stage === 'choose' && (
        <FadeInView>
          <div className="flex flex-col gap-5">
            <div>
              <H2 className="text-[22px]/[28px]">What decision do you want to test?</H2>
              <Body className="mt-1 text-text-secondary">
                Choose a business scenario and see how it would affect your finances.
              </Body>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {scenarios.map((scenario) => {
                const Icon = ICON_MAP[scenario.icon] || Users;
                const isSelected = selectedScenario === scenario.type;
                return (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => handleScenarioSelect(scenario.type)}
                    className={cn(
                      'text-left rounded-[var(--radius-lg)] p-5 border transition-all duration-200 cursor-pointer',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
                      'hover:border-brand/40 hover:bg-brand-soft/20',
                      isSelected
                        ? 'border-brand bg-brand-soft/30'
                        : 'border-border bg-surface'
                    )}
                    aria-pressed={isSelected}
                  >
                    <div className="flex flex-col gap-3">
                      <div className={cn(
                        'size-10 rounded-[var(--radius-md)] flex items-center justify-center',
                        isSelected ? 'bg-brand text-white' : 'bg-surface-subtle text-text-muted'
                      )}>
                        <Icon className="size-5" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[15px]/[20px] font-[600] text-text-primary">
                          {scenario.title}
                        </span>
                        <span className="text-[13px]/[20px] text-text-secondary">
                          {scenario.description}
                        </span>
                      </div>
                      <Caption className="text-text-muted">
                        {scenario.fields.length} assumptions required
                      </Caption>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </FadeInView>
      )}

      {/* Stage 2: Set Assumptions - Split Layout */}
      {stage === 'assumptions' && selectedScenario && (
        <FadeInView>
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goBack}
                className="p-2 rounded-[var(--radius-md)] hover:bg-surface-subtle transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                aria-label="Back to decision selection"
              >
                <ArrowLeft className="size-4 text-text-muted" />
              </button>
              <div>
                <H2 className="text-[22px]/[28px]">{selectedConfig?.title}</H2>
                <Caption className="mt-0.5">Enter your assumptions to model this decision</Caption>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Form */}
              <div className="lg:col-span-7 xl:col-span-8">
                <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-6">
                  <div className="flex items-center gap-2 mb-5 pb-4 border-b border-border">
                    <H3 className="text-[16px]/[22px]">Decision assumptions</H3>
                    <Badge variant="info">
                      {selectedConfig?.fields.filter(f => f.fromBaseline).length || 0} from baseline
                    </Badge>
                  </div>

                  {selectedScenario === 'hire_employees' && (
                    <HireEmployeesForm id="sim-form" onSubmit={handleFormSubmit as never} />
                  )}
                  {selectedScenario === 'change_price' && (
                    <ChangePriceForm id="sim-form" onSubmit={handleFormSubmit as never} />
                  )}
                  {selectedScenario === 'marketing_investment' && (
                    <MarketingInvestmentForm id="sim-form" onSubmit={handleFormSubmit as never} />
                  )}
                  {selectedScenario === 'purchase_equipment' && (
                    <EquipmentPurchaseForm id="sim-form" onSubmit={handleFormSubmit as never} />
                  )}
                  {selectedScenario === 'payment_delay' && (
                    <PaymentDelayForm id="sim-form" onSubmit={handleFormSubmit as never} />
                  )}

                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                    <button
                      type="button"
                      onClick={goBack}
                      className="text-[13px] font-[550] text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                    >
                      ← Change decision
                    </button>
                    <button
                      type="submit"
                      form="sim-form"
                      className={cn(
                        'inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)]',
                        'bg-brand text-white font-[600] text-[14px]',
                        'hover:bg-brand-hover transition-colors cursor-pointer',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40'
                      )}
                    >
                      Review decision
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Live Impact Preview */}
              <aside className="lg:col-span-5 xl:col-span-4" aria-label="Live impact preview">
                <div className="sticky top-6 rounded-[var(--radius-lg)] border border-border bg-surface-subtle/40 p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px]/[16px] font-[600] uppercase tracking-wide text-text-muted">
                      Impact Preview
                    </span>
                    <Badge variant="warning">Estimate</Badge>
                  </div>

                  <div className="flex flex-col gap-3">
                    <ImpactRow
                      label="Monthly Revenue"
                      baseline={MOCK_BASELINE.revenue}
                      status="stable"
                    />
                    <ImpactRow
                      label="Monthly Expenses"
                      baseline={MOCK_BASELINE.expenses}
                      status="stable"
                    />
                    <ImpactRow
                      label="Monthly Profit"
                      baseline={MOCK_BASELINE.profit}
                      status="danger"
                    />
                    <ImpactRow
                      label="Cash Runway"
                      baseline={MOCK_BASELINE.cashRunway}
                      unit="months"
                      status="warning"
                    />
                  </div>

                  <div className="pt-3 border-t border-border/60">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="size-3.5 mt-0.5 shrink-0 text-warning" aria-hidden="true" />
                      <Caption as="p" className="text-text-secondary">
                        Preview updates after you submit assumptions. Values are prototype estimates only.
                      </Caption>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/60">
                    <span className="text-[12px]/[16px] font-[600] uppercase tracking-wide text-text-muted">
                      Current Baseline
                    </span>
                    <div className="mt-2 flex flex-col gap-1.5 text-[13px]">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Revenue</span>
                        <span className="font-[550] text-text-primary tabular-nums">{formatBaht(MOCK_BASELINE.revenue, true)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Expenses</span>
                        <span className="font-[550] text-text-primary tabular-nums">{formatBaht(MOCK_BASELINE.expenses, true)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Profit</span>
                        <span className={cn('font-[550] tabular-nums', MOCK_BASELINE.profit >= 0 ? 'text-success' : 'text-danger')}>
                          {formatBaht(MOCK_BASELINE.profit, true)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Cash Runway</span>
                        <span className="font-[550] text-text-primary tabular-nums">{MOCK_BASELINE.cashRunway} months</span>
                      </div>
                    </div>
                    <Caption as="p" className="mt-2 text-text-muted">
                      Source: Business baseline · Jan 2025
                    </Caption>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </FadeInView>
      )}

      {/* Stage 3: Review & Run */}
      {stage === 'review' && selectedConfig && (
        <FadeInView>
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goBack}
                className="p-2 rounded-[var(--radius-md)] hover:bg-surface-subtle transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                aria-label="Back to assumptions"
              >
                <ArrowLeft className="size-4 text-text-muted" />
              </button>
              <H2 className="text-[22px]/[28px]">Review your decision</H2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Decision summary */}
              <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-5">
                {/* Human-readable summary */}
                <div className="rounded-[var(--radius-lg)] border border-brand/20 bg-brand-soft/20 p-6">
                  <Caption className="text-brand font-[600] uppercase tracking-wide">Decision Summary</Caption>
                  <p className="mt-2 text-[16px]/[26px] font-[500] text-text-primary">
                    {generateDecisionSummary(selectedConfig, formValues)}
                  </p>
                </div>

                {/* Assumptions table */}
                <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-6">
                  <H3 className="text-[16px]/[22px] mb-4">Assumptions</H3>
                  <div className="flex flex-col gap-2">
                    {selectedConfig.fields.map((field) => {
                      const value = formValues[field.name];
                      return (
                        <div key={field.name} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] text-text-primary">{field.label}</span>
                            {field.fromBaseline && (
                              <Badge variant="info">Baseline</Badge>
                            )}
                          </div>
                          <span className="text-[14px] font-[600] text-text-primary tabular-nums">
                            {field.unit === 'THB' ? `฿${Number(value || field.defaultValue).toLocaleString()}` :
                              field.unit === '%' ? `${value || field.defaultValue}%` :
                                String(value || field.defaultValue)}
                            {field.unit && field.unit !== 'THB' && field.unit !== '%' ? ` ${field.unit}` : ''}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => setStage('assumptions')}
                    className="mt-4 text-[13px] font-[550] text-brand hover:text-brand-hover transition-colors cursor-pointer"
                  >
                    ← Edit assumptions
                  </button>
                </div>

                {/* Data confidence notice */}
                <div className="flex items-start gap-3 p-4 rounded-[var(--radius-md)] bg-surface-subtle border border-border/60">
                  <AlertTriangle className="size-4 mt-0.5 shrink-0 text-warning" aria-hidden="true" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-[550] text-text-primary">Data confidence: Medium</span>
                    <Caption as="p" className="text-text-secondary">
                      Results are prototype estimates based on simplified financial models.
                      Actual outcomes depend on market conditions, execution, and assumptions not captured here.
                    </Caption>
                  </div>
                </div>
              </div>

              {/* Right: Run action */}
              <div className="lg:col-span-5 xl:col-span-4">
                <div className="sticky top-6 rounded-[var(--radius-lg)] border border-border bg-surface p-6 flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <H3 className="text-[16px]/[22px]">Ready to simulate</H3>
                    <Body className="text-text-secondary text-[13px]/[20px]">
                      Run the simulation to see best, expected, and worst case outcomes for this decision.
                    </Body>
                  </div>

                  <div className="flex flex-col gap-2 text-[13px]">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Decision</span>
                      <span className="font-[550] text-text-primary">{selectedConfig.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Assumptions</span>
                      <span className="font-[550] text-text-primary">{selectedConfig.fields.length} set</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Scenarios</span>
                      <span className="font-[550] text-text-primary">Best, Expected, Worst</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRunSimulation}
                    className={cn(
                      'w-full inline-flex items-center justify-center gap-2 px-5 py-3',
                      'rounded-[var(--radius-md)]',
                      'bg-brand text-white font-[600] text-[15px]',
                      'hover:bg-brand-hover transition-colors cursor-pointer',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40'
                    )}
                  >
                    <Play className="size-4" aria-hidden="true" />
                    Run Simulation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </FadeInView>
      )}

      {/* Running State: Calculation Sequence */}
      {stage === 'running' && (
        <FadeInView>
          <div className="flex flex-col items-center justify-center py-16 gap-8 max-w-md mx-auto">
            <div className="flex flex-col items-center gap-2 text-center">
              <H2 className="text-[20px]/[28px]">Simulating your decision</H2>
              <Caption as="p">{selectedConfig?.title}</Caption>
            </div>
            <div className="w-full flex flex-col gap-3" role="progressbar" aria-label="Simulation progress" aria-valuenow={calcStage} aria-valuemax={CALC_STAGES.length}>
              {CALC_STAGES.map((cs, i) => {
                const Icon = cs.icon;
                const isDone = calcStage > i;
                const isActive = calcStage === i;
                return (
                  <div
                    key={cs.label}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] transition-all duration-300 motion-reduce:transition-none',
                      isDone && 'bg-success-soft/50 border border-success/20',
                      isActive && 'bg-brand-soft border border-brand/20',
                      !isDone && !isActive && 'bg-surface-subtle/50 border border-transparent'
                    )}
                  >
                    <span className={cn(
                      'size-6 rounded-full flex items-center justify-center shrink-0',
                      isDone && 'bg-success text-white',
                      isActive && 'bg-brand text-white',
                      !isDone && !isActive && 'bg-border text-text-muted'
                    )}>
                      {isDone ? <Check className="size-3" /> : <Icon className="size-3" />}
                    </span>
                    <span className={cn(
                      'text-[14px] font-[500]',
                      isDone && 'text-success',
                      isActive && 'text-brand font-[550]',
                      !isDone && !isActive && 'text-text-muted'
                    )}>
                      {cs.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeInView>
      )}

      {/* Results Stage */}
      {stage === 'results' && result && (
        <StaggerChildren staggerDelay={0.08} className="flex flex-col gap-5">
          <StaggerChildren.Item>
            <div className="flex items-center gap-3">
              <Link
                href="/simulations"
                className="p-2 rounded-[var(--radius-md)] hover:bg-surface-subtle transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                aria-label="Back to review"
              >
                <ArrowLeft className="size-4 text-text-muted" />
              </Link>
              <H2 className="text-[22px]/[28px]">Simulation Results</H2>
            </div>
          </StaggerChildren.Item>

          <StaggerChildren.Item>
            <ResultSummary
              posture={result.posture}
              confidence={result.confidence}
              results={result.results}
              baseline={result.baseline}
            />
          </StaggerChildren.Item>

          <StaggerChildren.Item>
            <CaseSelector selected={selectedCase} onSelect={setSelectedCase} />
          </StaggerChildren.Item>

          <StaggerChildren.Item>
            {currentResult && <ResultKpiRow result={currentResult} baseline={result.baseline} />}
          </StaggerChildren.Item>

          <StaggerChildren.Item>
            {currentResult && (
              <ComparisonTable baseline={result.baseline} result={currentResult} />
            )}
          </StaggerChildren.Item>

          <StaggerChildren.Item>
            <TimelineChart baseline={result.baseline} results={result.results} />
          </StaggerChildren.Item>

          <StaggerChildren.Item>
            <AssumptionPanel input={result.input} scenarioConfig={selectedConfig} confidence={result.confidence} />
          </StaggerChildren.Item>

          <StaggerChildren.Item>
            <ResultActions
              posture={result.posture}
              onSave={() => { }}
              onCompare={() => { }}
              onReport={() => { }}
              onRerun={() => setStage('assumptions')}
            />
          </StaggerChildren.Item>
        </StaggerChildren>
      )}
    </FadeIn>
  );
}

// ── Helper Components ────────────────────────────────────────────────────────

function ImpactRow({
  label,
  baseline,
  unit = 'THB',
  status,
}: {
  label: string;
  baseline: number;
  unit?: string;
  status: 'stable' | 'warning' | 'danger';
}) {
  const statusColor = status === 'danger' ? 'text-danger' : status === 'warning' ? 'text-warning' : 'text-text-primary';
  const displayValue = unit === 'THB' ? formatBaht(baseline, true) : `${baseline} ${unit}`;

  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[13px] text-text-muted">{label}</span>
      <span className={cn('text-[13px] font-[550] tabular-nums', statusColor)}>
        {displayValue}
      </span>
    </div>
  );
}

function generateDecisionSummary(config: ScenarioConfig, values: Record<string, unknown>): string {
  switch (config.type) {
    case 'hire_employees': {
      const count = values.headcount || 1;
      const salary = Number(values.salary || 25000).toLocaleString();
      return `You are testing hiring ${count} employee${Number(count) > 1 ? 's' : ''} at ฿${salary}/month each, with a ${values.rampUpMonths || 3}-month ramp-up period starting in month ${values.startMonth || 1}.`;
    }
    case 'change_price': {
      const current = Number(values.currentPrice || 1500).toLocaleString();
      const newP = Number(values.newPrice || 1800).toLocaleString();
      return `You are testing a price change from ฿${current} to ฿${newP} for your ${values.product === 'secondary' ? 'secondary service' : 'main product'}, assuming a demand elasticity of ${values.elasticity || 1.2}.`;
    }
    case 'marketing_investment': {
      const budget = Number(values.budget || 50000).toLocaleString();
      return `You are testing a ฿${budget} marketing campaign over ${values.duration || 3} months via ${values.channel || 'social media'}, targeting ${Number(values.expectedReach || 10000).toLocaleString()} people.`;
    }
    case 'purchase_equipment': {
      const cost = Number(values.cost || 200000).toLocaleString();
      return `You are testing purchasing equipment worth ฿${cost} with a ${values.usefulLife || 5}-year useful life, financed via ${values.financing === 'loan' ? 'business loan' : values.financing === 'lease' ? 'lease' : 'cash purchase'}.`;
    }
    case 'payment_delay': {
      return `You are testing the impact of customers delaying payments by ${values.delayDays || 30} days, affecting ${values.affectedPercent || 40}% of your customer base.`;
    }
    default:
      return `You are testing: ${config.title}`;
  }
}
