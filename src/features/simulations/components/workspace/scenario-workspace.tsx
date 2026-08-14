// src/features/simulations/components/workspace/scenario-workspace.tsx
// Main workspace container for the simulation edit mode.
// Renders decision inputs, assumptions, baseline, and preview panel.
'use client';

import { useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ArrowLeft, Save, Edit, ChevronRight } from 'lucide-react';
import {
  getScenarioTemplate,
  type ScenarioTemplate,
} from '../../engine/scenario-configs';
import {
  runScenarioCalculation,
  type SimulationPreview as SimulationPreviewData,
} from '../../engine/simulation-engine';
import { DecisionSection } from './decision-section';
import { AssumptionsSection } from './assumptions-section';
import { BaselineSection } from './baseline-section';
import { SimulationPreview } from './simulation-preview';
import { CustomScenarioBuilder } from './custom-scenario-builder';
import { FadeInView } from '@/components/motion';

interface ScenarioWorkspaceProps {
  templateId: string;
  scenarioName?: string;
  isSimulated?: boolean;
  onBackToLibrary: () => void;
  onRunSimulationSuccess?: () => void;
  onSwitchToResultsMode?: () => void;
  showSubTabs?: boolean;
}

export function ScenarioWorkspace({
  templateId,
  scenarioName: initialName,
  isSimulated = false,
  onBackToLibrary,
  onRunSimulationSuccess,
  onSwitchToResultsMode,
  showSubTabs = false,
}: ScenarioWorkspaceProps) {
  const template = getScenarioTemplate(templateId);

  // Fallback if template not found
  const effectiveTemplate: ScenarioTemplate = template ?? {
    id: 'price_increase',
    name: 'Price Increase +5%',
    category: 'Pricing Strategy',
    description: '',
    objective: '',
    decisionInputs: [],
    assumptions: [],
    relevantBaselineKeys: [],
    resultMetrics: [],
  };

  const [scenarioName, setScenarioName] = useState(
    initialName ?? effectiveTemplate.name,
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Initialize input values from template defaults
  const [inputValues, setInputValues] = useState<
    Record<string, number | string>
  >(() => {
    const defaults: Record<string, number | string> = {};
    [
      ...effectiveTemplate.decisionInputs,
      ...effectiveTemplate.assumptions,
      ...(effectiveTemplate.advancedInputs ?? []),
    ].forEach((input) => {
      defaults[input.key] = input.defaultValue as number | string;
    });
    return defaults;
  });

  const handleInputChange = useCallback(
    (key: string, value: number | string) => {
      setInputValues((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleResetDefaults = useCallback(() => {
    const defaults: Record<string, number | string> = {};
    [
      ...effectiveTemplate.decisionInputs,
      ...effectiveTemplate.assumptions,
      ...(effectiveTemplate.advancedInputs ?? []),
    ].forEach((input) => {
      defaults[input.key] = input.defaultValue as number | string;
    });
    setInputValues(defaults);
  }, [effectiveTemplate]);

  // Calculate preview reactively
  const preview = useMemo<SimulationPreviewData>(() => {
    return runScenarioCalculation(effectiveTemplate.id, inputValues);
  }, [effectiveTemplate.id, inputValues]);

  const timeHorizonMonths = Number(inputValues.timeHorizonMonths) || 6;

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      onRunSimulationSuccess?.();
    }, 900);
  };

  // Custom scenario uses its own builder
  if (effectiveTemplate.id === 'blank_scenario') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <FadeInView offset={10}>
          <WorkspaceHeader
            scenarioName={scenarioName}
            isEditingTitle={isEditingTitle}
            isSimulated={isSimulated}
            category={effectiveTemplate.category}
            onBackToLibrary={onBackToLibrary}
            onSetName={setScenarioName}
            onToggleEditTitle={setIsEditingTitle}
            showSubTabs={showSubTabs}
            onSwitchToResultsMode={onSwitchToResultsMode}
          />
        </FadeInView>

        {/* Stepper */}
        <FadeInView offset={12}>
          <WorkspaceStepper currentStep={1} />
        </FadeInView>

        <CustomScenarioBuilder
          onRunSimulation={() => onRunSimulationSuccess?.()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeInView offset={10}>
        <WorkspaceHeader
          scenarioName={scenarioName}
          isEditingTitle={isEditingTitle}
          isSimulated={isSimulated}
          category={effectiveTemplate.category}
          onBackToLibrary={onBackToLibrary}
          onSetName={setScenarioName}
          onToggleEditTitle={setIsEditingTitle}
          showSubTabs={showSubTabs}
          onSwitchToResultsMode={onSwitchToResultsMode}
        />
      </FadeInView>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-7 space-y-6 min-w-0">
          <div className="bg-white dark:bg-[#111622] border border-slate-200/80 dark:border-[#1E2638] shadow-sm rounded-2xl p-6 sm:p-8 space-y-8">
            {/* Stepper */}
            <FadeInView offset={12}>
              <WorkspaceStepper currentStep={1} />
            </FadeInView>
            {/* Decision Section */}
            <FadeInView offset={14}>
              <DecisionSection
                template={effectiveTemplate}
                values={inputValues}
                onChange={handleInputChange}
              />
            </FadeInView>

            {/* Assumptions Section */}
            <FadeInView offset={16}>
              <AssumptionsSection
                template={effectiveTemplate}
                values={inputValues}
                onChange={handleInputChange}
                onResetDefaults={handleResetDefaults}
              />
            </FadeInView>

            {/* Baseline Section */}
            <FadeInView offset={18}>
              <BaselineSection />
            </FadeInView>

            {/* Action Buttons */}
            <FadeInView offset={20}>
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  className={cn(
                    'inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold',
                    'border border-slate-200 dark:border-[#2A344A] bg-white dark:bg-[#111622]',
                    'text-[#64748B] dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1E2638]',
                    'transition-colors cursor-pointer shadow-xs',
                  )}
                >
                  <Save className="size-4" />
                  <span>Save as Draft</span>
                </button>
                <button
                  type="button"
                  onClick={handleRunSimulation}
                  disabled={isSimulating}
                  className={cn(
                    'inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold',
                    'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white',
                    'shadow-lg shadow-indigo-500/20 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99]',
                    'transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
                  )}
                >
                  {isSimulating ? (
                    <>
                      <div className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Calculating...</span>
                    </>
                  ) : (
                    <span>Review & Run Simulation →</span>
                  )}
                </button>
              </div>
            </FadeInView>
          </div>
        </div>

        {/* Right Column: Preview (Sticky) */}
        <div className="lg:col-span-5 min-w-0 lg:sticky lg:top-20 self-start">
          <FadeInView offset={14}>
            <SimulationPreview
              preview={preview}
              timeHorizonMonths={timeHorizonMonths}
            />
          </FadeInView>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-Components ────────────────────────────────────────────────────────

interface WorkspaceHeaderProps {
  scenarioName: string;
  isEditingTitle: boolean;
  isSimulated: boolean;
  category: string;
  onBackToLibrary: () => void;
  onSetName: (name: string) => void;
  onToggleEditTitle: (editing: boolean) => void;
  showSubTabs?: boolean;
  onSwitchToResultsMode?: () => void;
}

function WorkspaceHeader({
  scenarioName,
  isEditingTitle,
  isSimulated,
  category,
  onBackToLibrary,
  onSetName,
  onToggleEditTitle,
  showSubTabs,
  onSwitchToResultsMode,
}: WorkspaceHeaderProps) {
  return (
    <div className="space-y-3 pb-2 border-b border-slate-100 dark:border-[#1E2638]">
      {/* Back Link */}
      <button
        type="button"
        onClick={onBackToLibrary}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4F46E5] dark:text-[#A5B4FC] hover:underline cursor-pointer transition-all"
      >
        <ArrowLeft className="size-3.5" />
        <span>Back to Library</span>
      </button>

      {/* Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          {isEditingTitle ? (
            <input
              type="text"
              value={scenarioName}
              onChange={(e) => onSetName(e.target.value)}
              onBlur={() => onToggleEditTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && onToggleEditTitle(false)}
              autoFocus
              className="font-display text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white border-b-2 border-[#6366F1] bg-transparent focus:outline-none px-1"
            />
          ) : (
            <h2
              className="font-display text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white cursor-pointer hover:text-[#4F46E5] dark:hover:text-[#A5B4FC] transition-colors"
              onClick={() => onToggleEditTitle(true)}
            >
              {scenarioName}
            </h2>
          )}

          <button
            type="button"
            onClick={() => onToggleEditTitle(!isEditingTitle)}
            className="p-1 text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white transition-colors cursor-pointer"
          >
            <Edit className="size-4" />
          </button>

          {/* Status Badge */}
          <span
            className={cn(
              'px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border inline-flex items-center gap-1.5',
              isSimulated
                ? 'bg-purple-50 dark:bg-purple-950/50 text-[#6366F1] dark:text-[#A5B4FC] border-purple-200 dark:border-purple-800/60'
                : 'bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800/60',
            )}
          >
            <span
              className={cn(
                'size-1.5 rounded-full',
                isSimulated ? 'bg-[#8B5CF6]' : 'bg-sky-500',
              )}
            />
            <span>{isSimulated ? 'Simulated' : 'Draft'}</span>
          </span>
        </div>
      </div>

      {/* Meta line */}
      <p className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">
        {category} · Created on{' '}
        {new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}{' '}
        · Last edited Today,{' '}
        {new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })}
      </p>

      {/* Sub-tabs if scenario has been simulated */}
      {showSubTabs && (
        <div className="flex items-center gap-6 pt-2">
          <button
            type="button"
            onClick={onSwitchToResultsMode}
            className="pb-2 text-sm font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white transition-colors cursor-pointer"
          >
            Results Mode
          </button>
          <button
            type="button"
            className="pb-2 text-sm font-semibold text-[#4F46E5] dark:text-[#A5B4FC] relative cursor-pointer"
          >
            Edit Scenario
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full" />
          </button>
        </div>
      )}
    </div>
  );
}

interface WorkspaceStepperProps {
  currentStep: 1 | 2 | 3;
}

function WorkspaceStepper({ currentStep }: WorkspaceStepperProps) {
  const steps = [
    {
      num: 1,
      label: 'Configure Scenario',
      desc: 'Set your decision & assumptions',
    },
    { num: 2, label: 'Review & Run', desc: 'See preview and run simulation' },
    { num: 3, label: 'Results', desc: 'View analysis and insights' },
  ];

  return (
    <div
      className={cn(
        'flex items-center gap-0 rounded-2xl overflow-hidden',
        'border border-slate-200/80 dark:border-[#1E2638] shadow-xs',
        'bg-white dark:bg-[#111622]',
      )}
    >
      {steps.map((step, idx) => (
        <div key={step.num} className="flex items-center flex-1 min-w-0">
          <div
            className={cn(
              'flex items-center gap-3 px-4 py-3 flex-1 min-w-0',
              currentStep === step.num
                ? 'bg-[#6366F1]/5 dark:bg-[#6366F1]/10'
                : '',
            )}
          >
            <div
              className={cn(
                'size-7 rounded-full flex items-center justify-center shrink-0 text-xs font-extrabold',
                currentStep === step.num
                  ? 'bg-[#6366F1] text-white'
                  : currentStep > step.num
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-slate-100 dark:bg-[#1E2638] text-[#94A3B8]',
              )}
            >
              {currentStep > step.num ? '✓' : step.num}
            </div>
            <div className="min-w-0">
              <span
                className={cn(
                  'text-xs font-bold block truncate',
                  currentStep === step.num
                    ? 'text-[#6366F1] dark:text-[#A5B4FC]'
                    : 'text-[#0F172A] dark:text-white',
                )}
              >
                {step.label}
              </span>
              <span className="text-[10px] text-[#94A3B8] block truncate hidden sm:block">
                {step.desc}
              </span>
            </div>
          </div>
          {idx < steps.length - 1 && (
            <ChevronRight className="size-4 text-[#CBD5E1] dark:text-[#334155] shrink-0 mx-1" />
          )}
        </div>
      ))}
    </div>
  );
}
