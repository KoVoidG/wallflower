// src/features/simulations/components/workspace/custom-scenario-builder.tsx
// Structured "Build a Decision" workspace for the Blank Custom Scenario.
'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Plus, X, Target, Layers, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../engine/business-baseline';
import {
  CUSTOM_VARIABLE_CATEGORIES,
  CUSTOM_OBJECTIVES,
  type CustomObjective,
  type VariableOption,
} from '../../engine/scenario-configs';
import { calculateCustomScenario, type SimulationPreview as SimulationPreviewData } from '../../engine/simulation-engine';
import { SimulationPreview } from './simulation-preview';
import { BaselineSection } from './baseline-section';

interface CustomVariable extends VariableOption {
  changeValue: number;
  changeType: 'absolute' | 'percent';
}

interface CustomScenarioBuilderProps {
  onRunSimulation: (preview: SimulationPreviewData) => void;
}

export function CustomScenarioBuilder({ onRunSimulation }: CustomScenarioBuilderProps) {
  const [variables, setVariables] = useState<CustomVariable[]>([]);
  const [objective, setObjective] = useState<CustomObjective>('increase_profit');
  const [showVariablePicker, setShowVariablePicker] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const addVariable = (option: VariableOption) => {
    if (variables.some((v) => v.key === option.key)) return;
    setVariables((prev) => [
      ...prev,
      {
        ...option,
        changeValue: option.unit === 'percent' ? 5 : Math.round(option.defaultCurrent * 0.05),
        changeType: option.unit === 'percent' ? 'percent' : 'absolute',
      },
    ]);
    setShowVariablePicker(false);
  };

  const removeVariable = (key: string) => {
    setVariables((prev) => prev.filter((v) => v.key !== key));
  };

  const updateVariableChange = (key: string, changeValue: number) => {
    setVariables((prev) =>
      prev.map((v) => (v.key === key ? { ...v, changeValue } : v)),
    );
  };

  const preview = useMemo(() => {
    if (variables.length === 0) return null;
    return calculateCustomScenario(
      variables.map((v) => ({
        key: v.key,
        currentValue: v.defaultCurrent,
        changeValue: v.changeValue,
        unit: v.unit,
      })),
    );
  }, [variables]);

  const handleRunSimulation = () => {
    if (!preview) return;
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      onRunSimulation(preview);
    }, 800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column */}
      <div className="lg:col-span-7 space-y-6 min-w-0">
        {/* Objective Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="size-7 rounded-lg bg-[#6366F1]/10 dark:bg-[#6366F1]/20 flex items-center justify-center shrink-0">
              <Target className="size-4 text-[#6366F1] dark:text-[#A5B4FC]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">
                What are you trying to achieve?
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Select a goal to focus the simulation on the most relevant metrics.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CUSTOM_OBJECTIVES.map((obj) => (
              <button
                key={obj.value}
                type="button"
                onClick={() => setObjective(obj.value)}
                className={cn(
                  'px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-left',
                  objective === obj.value
                    ? 'border-[#6366F1] bg-[#6366F1]/5 dark:bg-[#6366F1]/10 text-[#6366F1] dark:text-[#A5B4FC] shadow-xs'
                    : 'border-slate-200 dark:border-[#2A344A] bg-white dark:bg-[#111622] text-[#64748B] dark:text-[#94A3B8] hover:border-[#6366F1]/40',
                )}
              >
                {obj.label}
              </button>
            ))}
          </div>
        </div>

        {/* Variable Cards */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="size-7 rounded-lg bg-[#6366F1]/10 dark:bg-[#6366F1]/20 flex items-center justify-center shrink-0">
              <Layers className="size-4 text-[#6366F1] dark:text-[#A5B4FC]" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">
                What are you trying to change?
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Add business variables to model your decision.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowVariablePicker(true)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold',
                'bg-[#6366F1] text-white hover:bg-[#4F46E5] transition-colors cursor-pointer shadow-xs',
              )}
            >
              <Plus className="size-4" />
              <span>Add Variable</span>
            </button>
          </div>

          {variables.length === 0 && (
            <div className={cn(
              'p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-[#2A344A]',
              'flex flex-col items-center justify-center text-center space-y-3',
            )}>
              <div className="size-12 rounded-xl bg-slate-100 dark:bg-[#1E2638] flex items-center justify-center">
                <Plus className="size-5 text-[#94A3B8]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#64748B] dark:text-[#94A3B8]">
                  No variables added yet
                </p>
                <p className="text-xs text-[#94A3B8] dark:text-[#475569] mt-0.5">
                  Click &ldquo;Add Variable&rdquo; to start building your custom scenario.
                </p>
              </div>
            </div>
          )}

          {variables.map((variable) => (
            <div
              key={variable.key}
              className={cn(
                'p-4 rounded-2xl border border-slate-200/80 dark:border-[#1E2638]',
                'bg-white dark:bg-[#111622] shadow-xs space-y-3',
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">{variable.label}</h4>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">{variable.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeVariable(variable.key)}
                  className="p-1.5 rounded-lg text-[#94A3B8] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8] block">Current</span>
                  <span className="text-sm font-bold font-mono text-[#0F172A] dark:text-white tabular-nums block">
                    {variable.unit === 'currency'
                      ? formatCurrency(variable.defaultCurrent)
                      : variable.unit === 'percent'
                        ? `${variable.defaultCurrent}%`
                        : variable.defaultCurrent}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8] block">Change</span>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
                      {variable.unit === 'currency' ? '฿' : variable.unit === 'percent' ? '%' : ''}
                    </span>
                    <input
                      type="number"
                      value={variable.changeValue}
                      onChange={(e) => updateVariableChange(variable.key, Number(e.target.value))}
                      className={cn(
                        'w-full py-2.5 rounded-xl border border-slate-200 dark:border-[#2A344A] text-sm font-mono font-bold',
                        'bg-white dark:bg-[#0B0F17] text-[#0F172A] dark:text-white',
                        'focus:outline-none focus:border-[#6366F1]',
                        variable.unit === 'currency' ? 'pl-7 pr-3' : variable.unit === 'percent' ? 'pl-7 pr-3' : 'pl-3 pr-3',
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Baseline */}
        <BaselineSection />

        {/* Action Buttons */}
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
            Save as Draft
          </button>
          <button
            type="button"
            onClick={handleRunSimulation}
            disabled={variables.length === 0 || isSimulating}
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
      </div>

      {/* Right Column: Preview */}
      <div className="lg:col-span-5 min-w-0 lg:sticky lg:top-20 self-start">
        {preview ? (
          <SimulationPreview preview={preview} timeHorizonMonths={6} />
        ) : (
          <div className={cn(
            'rounded-2xl border border-slate-200/80 dark:border-[#1E2638]',
            'bg-white dark:bg-[#111622] shadow-xs p-8',
            'flex flex-col items-center text-center space-y-3',
          )}>
            <Sparkles className="size-8 text-[#94A3B8]" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">Preview will appear here</h4>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-xs leading-relaxed">
                Add variables and configure your custom scenario to see the projected impact.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Variable Picker Modal */}
      {showVariablePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className={cn(
              'relative w-full max-w-lg bg-white dark:bg-[#111622]',
              'border border-slate-200 dark:border-[#1E2638] rounded-2xl shadow-xl p-6 space-y-5',
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1E2638]">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">Add Variable</h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Choose a business variable to include in your scenario.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowVariablePicker(false)}
                className="p-2 rounded-lg text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1E2638] transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {CUSTOM_VARIABLE_CATEGORIES.map((category) => (
                <div key={category.name} className="space-y-2">
                  <h4 className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                    {category.name}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {category.variables.map((v) => {
                      const alreadyAdded = variables.some((existing) => existing.key === v.key);
                      return (
                        <button
                          key={v.key}
                          type="button"
                          disabled={alreadyAdded}
                          onClick={() => addVariable(v)}
                          className={cn(
                            'p-3 rounded-xl border text-left transition-all cursor-pointer',
                            alreadyAdded
                              ? 'border-slate-200 dark:border-[#2A344A] bg-slate-50 dark:bg-[#0B0F17] opacity-50 cursor-not-allowed'
                              : 'border-slate-200 dark:border-[#2A344A] bg-white dark:bg-[#111622] hover:border-[#6366F1]/40 hover:shadow-xs',
                          )}
                        >
                          <span className="text-xs font-bold text-[#0F172A] dark:text-white block">{v.label}</span>
                          <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] block mt-0.5">
                            {v.description} · {v.unit === 'currency' ? formatCurrency(v.defaultCurrent) : `${v.defaultCurrent}${v.unit === 'percent' ? '%' : ''}`}
                          </span>
                          {alreadyAdded && (
                            <span className="text-[10px] text-[#6366F1] dark:text-[#A5B4FC] font-bold mt-1 block">Already added</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Import Sparkles for the empty preview state

