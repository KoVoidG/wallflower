'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { FadeIn, StaggerChildren } from '@/components/motion';
import { Surface } from '@/components/ui/surface';
import { ScenarioSelector } from '@/components/simulations/scenario-selector';
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
import { ArrowLeft, Play, Loader2 } from 'lucide-react';
import type {
  ScenarioType,
  ScenarioConfig,
  SimulationData,
  SimulationInput,
  CaseType,
} from '@/features/simulations/adapters/simulations.adapter';
import { getScenarioConfigs, runSimulation } from '@/features/simulations/adapters/simulations.adapter';

type WizardStep = 1 | 2 | 3;

const STEP_LABELS = ['Select Scenario', 'Configure', 'Results'];

export default function NewSimulationPage() {
  const [step, setStep] = useState<WizardStep>(1);
  const [scenarios, setScenarios] = useState<ScenarioConfig[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<SimulationData | null>(null);
  const [selectedCase, setSelectedCase] = useState<CaseType>('expected');
  const [scenariosLoaded, setScenariosLoaded] = useState(false);

  // Load scenarios on mount
  if (!scenariosLoaded) {
    getScenarioConfigs().then((configs) => {
      setScenarios(configs);
      setScenariosLoaded(true);
    });
  }

  const handleScenarioSelect = useCallback((type: ScenarioType) => {
    setSelectedScenario(type);
    setStep(2);
  }, []);

  const handleFormSubmit = useCallback(
    async (values: Record<string, unknown>) => {
      if (!selectedScenario) return;

      setIsRunning(true);
      setStep(3);

      const input: SimulationInput = {
        scenarioType: selectedScenario,
        assumptions: values as Record<string, number | string>,
      };

      try {
        const data = await runSimulation(input);
        setResult(data);
      } finally {
        setIsRunning(false);
      }
    },
    [selectedScenario]
  );

  const goBack = useCallback(() => {
    if (step === 2) setStep(1);
    else if (step === 3 && !isRunning) {
      setStep(2);
      setResult(null);
    }
  }, [step, isRunning]);

  const selectedConfig = scenarios.find((s) => s.type === selectedScenario);
  const currentResult = result?.results.find((r) => r.caseType === selectedCase);

  return (
    <FadeIn className="flex flex-col gap-6 pb-8">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEP_LABELS.map((label, i) => {
          const stepNum = (i + 1) as WizardStep;
          const isActive = step === stepNum;
          const isCompleted = step > stepNum;
          return (
            <div key={label} className="flex items-center gap-2">
              {i > 0 && (
                <div className={cn('w-8 h-px', isCompleted ? 'bg-brand' : 'bg-border')} />
              )}
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'size-7 rounded-full flex items-center justify-center text-[13px] font-[600]',
                    isActive && 'bg-brand text-white',
                    isCompleted && 'bg-brand-soft text-brand',
                    !isActive && !isCompleted && 'bg-surface-subtle text-text-muted border border-border'
                  )}
                >
                  {stepNum}
                </span>
                <span
                  className={cn(
                    'text-[13px] font-[550] hidden sm:inline',
                    isActive ? 'text-text-primary' : 'text-text-muted'
                  )}
                >
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step 1: Select Scenario */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-[20px] font-[600] text-text-primary">Choose a Decision to Simulate</h1>
            <p className="text-[15px] text-text-muted mt-1">
              Select a business scenario to explore its potential impact.
            </p>
          </div>
          <ScenarioSelector
            scenarios={scenarios}
            selected={selectedScenario}
            onSelect={handleScenarioSelect}
          />
        </div>
      )}

      {/* Step 2: Configure */}
      {step === 2 && selectedScenario && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goBack}
              className="p-1.5 rounded-[var(--radius-sm)] hover:bg-surface-subtle transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              aria-label="Go back"
            >
              <ArrowLeft className="size-5 text-text-muted" />
            </button>
            <div>
              <h1 className="text-[20px] font-[600] text-text-primary">
                {selectedConfig?.title ?? 'Configure Scenario'}
              </h1>
              <p className="text-[13px] text-text-muted">
                Enter your assumptions to run the simulation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Surface border className="p-5">
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

                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    form="sim-form"
                    className={cn(
                      'inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)]',
                      'bg-brand text-white font-[550] text-[14px]',
                      'hover:bg-brand-hover transition-colors cursor-pointer',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40'
                    )}
                  >
                    <Play className="size-4" aria-hidden="true" />
                    Run Simulation
                  </button>
                </div>
              </Surface>
            </div>

            {/* Review panel */}
            <div className="hidden lg:block">
              <Surface border className="p-4 sticky top-4">
                <span className="text-[13px] font-[550] text-text-muted">Scenario</span>
                <p className="text-[15px] font-[600] text-text-primary mt-1">
                  {selectedConfig?.title}
                </p>
                <p className="text-[13px] text-text-muted mt-1">
                  {selectedConfig?.description}
                </p>
                <div className="mt-4 pt-3 border-t border-border">
                  <span className="text-[12px] font-[550] text-text-muted uppercase tracking-wider">
                    Current Baseline
                  </span>
                  <div className="mt-2 flex flex-col gap-1.5 text-[13px]">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Revenue</span>
                      <span className="font-[550] text-text-primary tabular-nums">฿152,400</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Expenses</span>
                      <span className="font-[550] text-text-primary tabular-nums">฿164,800</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Profit</span>
                      <span className="font-[550] text-danger tabular-nums">-฿12,400</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Cash Runway</span>
                      <span className="font-[550] text-text-primary tabular-nums">2.1 months</span>
                    </div>
                  </div>
                </div>
              </Surface>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 3 && (
        <div className="flex flex-col gap-5">
          {isRunning ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="size-10 text-brand animate-spin motion-reduce:animate-none" aria-hidden="true" />
              <div className="text-center">
                <p className="text-[15px] font-[600] text-text-primary">Running simulation...</p>
                <p className="text-[13px] text-text-muted mt-1">
                  Calculating best, expected, and worst case scenarios.
                </p>
              </div>
            </div>
          ) : result ? (
            <StaggerChildren staggerDelay={0.08} className="flex flex-col gap-5">
              <StaggerChildren.Item>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={goBack}
                    className="p-1.5 rounded-[var(--radius-sm)] hover:bg-surface-subtle transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                    aria-label="Go back"
                  >
                    <ArrowLeft className="size-5 text-text-muted" />
                  </button>
                  <h1 className="text-[20px] font-[600] text-text-primary">
                    Simulation Results
                  </h1>
                </div>
              </StaggerChildren.Item>

              <StaggerChildren.Item>
                <ResultSummary
                  posture={result.posture}
                  confidence={result.confidence}
                  results={result.results}
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
                  <ComparisonTable baseline={result.baseline} result={currentResult} />
                )}
              </StaggerChildren.Item>

              <StaggerChildren.Item>
                <TimelineChart baseline={result.baseline} results={result.results} />
              </StaggerChildren.Item>

              <StaggerChildren.Item>
                <AssumptionPanel input={result.input} scenarioConfig={selectedConfig} />
              </StaggerChildren.Item>

              <StaggerChildren.Item>
                <ResultActions
                  onSave={() => {}}
                  onCompare={() => {}}
                  onReport={() => {}}
                />
              </StaggerChildren.Item>
            </StaggerChildren>
          ) : null}
        </div>
      )}
    </FadeIn>
  );
}
