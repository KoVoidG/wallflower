// src/features/simulations/components/workspace/scenario-workspace.tsx
'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  Settings2,
  AlertTriangle,
  Tag,
  Users,
  ShoppingBag,
  Megaphone,
  Wrench,
  Package,
  Store,
  PlusCircle,
  Workflow,
  RotateCcw,
  Edit3,
  CheckCircle2,
  ChevronRight,
  ChevronUp,
  Award,
  Scale,
  FileText,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import { useRouter } from '@/lib/i18n/navigation';
import { saveReport } from '@/features/reports/engine/reports-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FadeInView } from '@/components/motion';
import { BotAvatar } from '@/components/ui/bot-avatar';
import { useAppStore } from '@/lib/liquiflow-hooks';
import type { SimulationResult, SimulationScenario } from '@/lib/liquiflow-types';
import {
  Simulation3D,
  SimulationCharts,
  OrgDataSetupSheet,
} from '@/features/org-analytics/components';
import {
  getScenarioTemplate,
  SCENARIO_TEMPLATES,
  type ScenarioTemplate,
} from '../../engine/scenario-configs';
import { saveSimulationRun } from '../../engine/simulation-history-store';
import { DecisionSection } from './decision-section';
import { AssumptionsSection } from './assumptions-section';
import { CustomScenarioBuilder } from './custom-scenario-builder';
import { BaselineSection } from './baseline-section';
import { SimulationPreview } from './simulation-preview';
import {
  runScenarioCalculation,
  type SimulationPreview as SimulationPreviewData,
} from '../../engine/simulation-engine';

interface ScenarioWorkspaceProps {
  templateId?: string;
  scenarioName?: string;
  isSimulated?: boolean;
  initialResult?: SimulationResult | null;
  initialInputValues?: Record<string, number | string>;
  onBackToLibrary?: () => void;
  onRunSimulationSuccess?: () => void;
  onSwitchToResultsMode?: () => void;
  showSubTabs?: boolean;
}

export function ScenarioWorkspace({
  templateId: initialTemplateId = 'price_increase',
  scenarioName: initialName,
  isSimulated = false,
  initialResult = null,
  initialInputValues,
}: ScenarioWorkspaceProps) {
  const router = useRouter();
  const { departments, workflows, isDemoMode } = useAppStore();
  const [showSetup, setShowSetup] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplateId);
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(initialResult);
  const [error, setError] = useState<string | null>(null);
  const [isEditingParams, setIsEditingParams] = useState(!initialResult);

  const activeTemplate: ScenarioTemplate = useMemo(() => {
    return (
      getScenarioTemplate(selectedTemplateId) ??
      SCENARIO_TEMPLATES[0] ?? {
        id: 'price_increase',
        name: 'Price Increase +5%',
        category: 'Pricing Strategy',
        description: '',
        objective: '',
        decisionInputs: [],
        assumptions: [],
        relevantBaselineKeys: [],
        resultMetrics: [],
      }
    );
  }, [selectedTemplateId]);

  // Dynamic input values matching the active template
  const [inputValues, setInputValues] = useState<Record<string, number | string>>(() => {
    if (initialInputValues && Object.keys(initialInputValues).length > 0) {
      return initialInputValues;
    }
    const defaults: Record<string, number | string> = {};
    [
      ...activeTemplate.decisionInputs,
      ...activeTemplate.assumptions,
      ...(activeTemplate.advancedInputs ?? []),
    ].forEach((input) => {
      defaults[input.key] = input.defaultValue as number | string;
    });
    return defaults;
  });

  const handleInputChange = useCallback((key: string, value: number | string) => {
    setInputValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSelectTemplate = (tId: string) => {
    setSelectedTemplateId(tId);
    const tmpl = getScenarioTemplate(tId);
    if (!tmpl) return;

    const defaults: Record<string, number | string> = {};
    [
      ...tmpl.decisionInputs,
      ...tmpl.assumptions,
      ...(tmpl.advancedInputs ?? []),
    ].forEach((input) => {
      defaults[input.key] = input.defaultValue as number | string;
    });
    setInputValues(defaults);
  };

  const templatePreview = useMemo(() => {
    return runScenarioCalculation(selectedTemplateId, inputValues);
  }, [selectedTemplateId, inputValues]);

  // Convert template inputs into simulation engine parameters
  const runSimulation = useCallback(async (customPreview?: SimulationPreviewData) => {
    setIsSimulating(true);
    setError(null);
    try {
      let autoRate = 0;
      let hcChange = 0;
      let procImp = 0;

      if (customPreview) {
        // Map from custom scenario builder calculation
        const revDelta = customPreview.revenueChangePercent || 0;
        const profitDelta = customPreview.profitChangePercent || 0;
        procImp = Math.max(0, (profitDelta / 100) * 0.5);
        autoRate = Math.max(0, (revDelta / 100) * 0.3);
      } else if (selectedTemplateId === 'price_increase') {
        const pricePct = Number(inputValues.priceChangePercent) || 5;
        procImp = Math.max(0, (pricePct / 100) * 0.4);
      } else if (selectedTemplateId === 'hire_employee') {
        const hires = Number(inputValues.numberOfEmployees) || 1;
        hcChange = hires * 15;
        procImp = 0.08;
      } else if (selectedTemplateId === 'cost_reduction') {
        const costPct = Number(inputValues.costReductionPercent) || 10;
        procImp = (costPct / 100) * 0.8;
        autoRate = 0.1;
      } else if (selectedTemplateId === 'holiday_promo') {
        const discPct = Number(inputValues.discountPercent) || 15;
        hcChange = 5;
        procImp = (discPct / 100) * 0.2;
      } else if (selectedTemplateId === 'equipment_purchase') {
        procImp = 0.25;
        autoRate = 0.2;
      } else if (selectedTemplateId === 'inventory_expansion') {
        const invPct = Number(inputValues.inventoryIncreasePercent) || 20;
        procImp = (invPct / 100) * 0.3;
        hcChange = 5;
      } else if (selectedTemplateId === 'new_branch') {
        hcChange = 40;
        procImp = 0.2;
      } else {
        autoRate = 0.15;
        hcChange = 0;
        procImp = 0.1;
      }

      const scenarioPayload: SimulationScenario = {
        name: activeTemplate.name,
        description: activeTemplate.description,
        changes: {
          automation_rate: autoRate,
          headcount_increase: hcChange,
          process_improvement: procImp,
        },
      };

      const res = await fetch('/api/liquiflow/simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: scenarioPayload,
          departments,
          workflows,
          isDemoMode,
        }),
      });

      if (!res.ok) throw new Error('Failed to compute scenario simulation.');
      const data: SimulationResult = await res.json();
      setResult(data);
      // Once simulation finishes, collapse input parameters so 3D pipeline and results take center stage
      setIsEditingParams(false);

      // Auto-save to simulation history (like ChatGPT history)
      saveSimulationRun({
        id: `whatif-${Date.now()}`,
        type: 'what_if',
        name: initialName || activeTemplate.name,
        templateId: selectedTemplateId,
        strategyTag: activeTemplate.category,
        goal: activeTemplate.objective || 'Optimized throughput & capacity',
        status: 'Simulated',
        healthScore: Math.round(80 + Math.min(15, Math.max(0, data.deltaPercent.throughput / 2))),
        confidence: 90,
        riskLevel: data.risks.length > 2 ? 'High' : data.risks.length > 0 ? 'Medium' : 'Low',
        whatIfResult: data,
        inputValues,
      });

      // Smoothly scroll to the very top of the page so user sees post-sim 3D and results immediately
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : 'Simulation computation failed.',
      );
    } finally {
      setIsSimulating(false);
    }
  }, [
    activeTemplate.category,
    activeTemplate.description,
    activeTemplate.name,
    activeTemplate.objective,
    departments,
    initialName,
    inputValues,
    isDemoMode,
    selectedTemplateId,
    workflows,
  ]);

  // Automatically execute simulation when opened as an active intervention
  useEffect(() => {
    if (isSimulated && !initialResult) {
      void runSimulation();
    }
  }, [isSimulated, initialResult, runSimulation]);

  // 8 Complete Scenario Templates matching library
  const templateOptions = [
    {
      id: 'price_increase',
      title: 'Price Increase +5%',
      strategyTag: 'Pricing Strategy',
      goal: 'Increase profit margin',
      description: 'Evaluate the profit impact of increasing average product prices while maintaining volume.',
      icon: Tag,
    },
    {
      id: 'hire_employee',
      title: 'Hire 1 Sales Associate',
      strategyTag: 'People Security',
      goal: 'Increase sales capacity',
      description: 'Assess total payroll expansion versus projected sales growth from extra staff.',
      icon: Users,
    },
    {
      id: 'cost_reduction',
      title: 'Reduce Supplier Cost',
      strategyTag: 'Cost Efficiency',
      goal: 'Lower operating expense',
      description: 'Model vendor discounts and cost-of-goods reductions on net profit & cash runway.',
      icon: ShoppingBag,
    },
    {
      id: 'holiday_promo',
      title: 'Holiday Promotion',
      strategyTag: 'Marketing Strategy',
      goal: 'Boost revenue during holidays',
      description: 'Simulate short-term marketing spend boost and seasonal revenue surges.',
      icon: Megaphone,
    },
    {
      id: 'equipment_purchase',
      title: 'Purchase Equipment',
      strategyTag: 'Capital Investment',
      goal: 'Expand production capacity',
      description: 'Analyze upfront capital expenditure versus operational efficiency gains.',
      icon: Wrench,
    },
    {
      id: 'inventory_expansion',
      title: 'Expand Inventory +20%',
      strategyTag: 'Inventory Strategy',
      goal: 'Prevent stockouts',
      description: 'Assess carrying costs and holding risk against higher stock availability.',
      icon: Package,
    },
    {
      id: 'new_branch',
      title: 'Open New Branch',
      strategyTag: 'Expansion Strategy',
      goal: 'Increase market presence',
      description: 'Simulate multi-location expansion, initial setup costs, and runway requirements.',
      icon: Store,
    },
    {
      id: 'blank_scenario',
      title: 'Blank Custom Scenario',
      strategyTag: 'Custom Strategy',
      goal: 'Custom business objective',
      description: 'Start from a clean slate with fully customizable revenue, price, and cost sliders.',
      icon: PlusCircle,
    },
  ];

  return (
    <div className="space-y-6 pb-4">
      <OrgDataSetupSheet open={showSetup} onClose={() => setShowSetup(false)} />

      {error && (
        <div className="p-4 rounded-xl border border-danger/30 bg-danger-soft/10 text-xs text-danger flex items-center gap-2.5">
          <AlertTriangle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Active Scenario Banner (When results are active and inputs collapsed) ── */}
      {result && !isEditingParams && (
        <FadeInView offset={6}>
          <div className="p-4 rounded-xl border border-brand/40 bg-brand-soft/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-brand text-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 className="size-4.5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="brand" className="text-[10px] uppercase font-bold tracking-wider">
                    {activeTemplate.category}
                  </Badge>
                  <span className="text-xs font-bold text-text-primary">
                    {initialName || activeTemplate.name}
                  </span>
                </div>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Goal: <strong className="text-text-secondary">{activeTemplate.objective || 'Optimized Throughput'}</strong> • Simulation active
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingParams(true)}
                className="gap-2 text-xs font-semibold cursor-pointer h-8 px-3"
              >
                <Edit3 className="size-3.5 text-brand" />
                Edit Parameters
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => runSimulation()}
                disabled={isSimulating}
                className="gap-2 text-xs font-bold cursor-pointer h-8 px-3"
              >
                {isSimulating ? (
                  <>
                    <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Re-calculating...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-3.5" />
                    Re-Run Simulation
                  </>
                )}
              </Button>
            </div>
          </div>
        </FadeInView>
      )}

      {/* ── 1. 3D Interactive Simulation Topology Card (Full Width - Clean Header) ─────── */}
      <FadeInView offset={8}>
        <Card className="p-1 overflow-hidden shadow-2xs border-border/80 bg-surface">
          <div className="p-3.5 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <Workflow className="size-4 text-brand" />
              <span className="text-xs font-bold text-text-primary">
                3D Workflow Pipeline Simulation
              </span>
            </div>
            <span className="text-[11px] text-text-muted font-medium">
              {workflows.length} Connected Workflow Stages • Theory of Constraints
            </span>
          </div>

          <div className="h-90 sm:h-100 rounded-lg overflow-hidden bg-surface-subtle/30">
            <Simulation3D
              result={result}
              isSimulating={isSimulating}
              workflows={workflows}
            />
          </div>
        </Card>
      </FadeInView>

      {/* ── 2. Scenario Configuration & Template Parameter Controls (Shown when editing) ── */}
      {isEditingParams && (
        <FadeInView offset={10} className="space-y-6">
          {/* Distinct Card 1: Header & Template Selector Grid */}
          <Card className="p-5 shadow-xs border-slate-200/80 dark:border-[#1E2638] bg-white dark:bg-[#111622] rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="brand" className="text-[10px] uppercase font-bold tracking-wider">
                  Select Scenario Template
                </Badge>
                <h3 className="text-sm font-bold text-text-primary">
                  {initialName || activeTemplate.name}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSetup(true)}
                  className="gap-2 text-xs font-semibold cursor-pointer h-8 px-3"
                >
                  <Settings2 className="size-3.5 text-brand" />
                  Configure Org Data
                </Button>
                {result && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingParams(false)}
                    className="gap-1.5 text-xs text-text-muted hover:text-text-primary h-8 px-2.5"
                  >
                    <ChevronUp className="size-3.5" />
                    Hide Parameters
                  </Button>
                )}
              </div>
            </div>

            {/* 8 Complete Templates Grid with Library Hover Effects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
              {templateOptions.map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id;
                const Icon = tpl.icon;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl.id)}
                    className={cn(
                      'group flex flex-col justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer space-y-3',
                      isSelected
                        ? 'border-brand bg-brand-soft/20 ring-1 ring-brand/30 shadow-md -translate-y-0.5'
                        : 'border-border/80 bg-surface hover:border-brand/50 hover:shadow-md hover:-translate-y-0.5 hover:bg-surface-subtle/50',
                    )}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'p-2 rounded-lg border shadow-2xs shrink-0 transition-colors',
                          isSelected
                            ? 'bg-brand text-white border-brand'
                            : 'bg-surface-subtle text-text-primary border-border/80 group-hover:bg-brand-soft group-hover:text-brand group-hover:border-brand/40',
                        )}>
                          <Icon className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className={cn(
                            'text-xs font-bold truncate transition-colors',
                            isSelected ? 'text-text-primary' : 'text-text-primary group-hover:text-brand',
                          )}>
                            {tpl.title}
                          </h4>
                          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
                            {tpl.strategyTag}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                        {tpl.description}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-border/50 flex items-center justify-between text-[11px] text-text-muted">
                      <span className="truncate">Goal: <strong className="text-text-primary font-medium">{tpl.goal}</strong></span>
                      <ChevronRight className={cn(
                        'size-4 text-text-secondary transition-transform shrink-0',
                        isSelected ? 'text-brand translate-x-0.5' : 'group-hover:translate-x-1 group-hover:text-brand',
                      )} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Distinct Div 2: Inputs (Left) & Sticky Preview (Right) */}
          {selectedTemplateId === 'blank_scenario' ? (
            <CustomScenarioBuilder
              onRunSimulation={(preview) => runSimulation(preview)}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: 1. Inputs, 2. Assumptions, 3. Baseline */}
              <div className="lg:col-span-7 space-y-6 min-w-0">
                {/* 1. What are you trying to change? (Primary Inputs) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3 px-1">
                    <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                      1. What are you trying to change?
                    </h4>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSelectTemplate(selectedTemplateId)}
                      className="gap-1.5 text-xs text-text-muted hover:text-text-primary h-7 px-2 cursor-pointer"
                    >
                      <RotateCcw className="size-3" />
                      Reset Defaults
                    </Button>
                  </div>

                  {activeTemplate.decisionInputs.length > 0 && (
                    <DecisionSection
                      template={activeTemplate}
                      values={inputValues}
                      onChange={handleInputChange}
                    />
                  )}
                </div>

                {/* 2. Scenario Assumptions */}
                {activeTemplate.assumptions.length > 0 && (
                  <AssumptionsSection
                    template={activeTemplate}
                    values={inputValues}
                    onChange={handleInputChange}
                  />
                )}

                {/* 3. Baseline Section */}
                <BaselineSection badgeNumber={3} />
              </div>

              {/* Right Column: Live Simulation Preview (5 cols, sticky) */}
              <div className="lg:col-span-5 min-w-0 lg:sticky lg:top-20 self-start space-y-4">
                <SimulationPreview
                  preview={templatePreview}
                  timeHorizonMonths={Number(inputValues.timeHorizonMonths) || 6}
                />

                <button
                  type="button"
                  onClick={() => runSimulation()}
                  disabled={isSimulating}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:opacity-95 font-bold text-sm cursor-pointer shadow-md shadow-indigo-500/25 transition-all disabled:opacity-50"
                >
                  {isSimulating ? (
                    <>
                      <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Calculating Workflow Impact...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      <span>Run What-If Simulation {isDemoMode ? '(Demo)' : ''}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </FadeInView>
      )}

      {/* ── 3. Results Section (Full Width Stacked Layout) ──────────────── */}
      {result && !isSimulating && (
        <div className="space-y-6">
          {/* Executive AI Verdict & Strategic Summary */}
          <FadeInView offset={16}>
            <Card className="p-6 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs space-y-5">
              {/* Header: Title + Recommendation, Confidence & Risk Badges */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-[#1E2638]">
                <div className="flex items-center gap-3">
                  <BotAvatar size={42} className="shrink-0" />
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#0F172A] dark:text-white">
                      Capybot Executive Verdict
                    </h3>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                      Capybot&apos;s synthesis &amp; implementation assessment for {initialName || activeTemplate.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Implementation Verdict Badge */}
                  {((result.deltaPercent.throughput >= 0 && result.deltaPercent.cost <= 15) || result.deltaPercent.cycleTime < 0) ? (
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                      <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>RECOMMENDED TO IMPLEMENT</span>
                    </div>
                  ) : (
                    <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                      <AlertTriangle className="size-3.5 text-amber-600 dark:text-amber-400" />
                      <span>PROCEED WITH CAUTION</span>
                    </div>
                  )}

                  {/* Confidence Score Badge */}
                  <div className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-[#6366F1] dark:text-[#A5B4FC] text-xs font-bold flex items-center gap-1.5 shadow-2xs font-mono">
                    <span className="size-2 rounded-full bg-[#6366F1]" />
                    <span>
                      {Math.round(
                        (result.confidenceScore ?? 85) <= 1
                          ? (result.confidenceScore ?? 0.85) * 100
                          : (result.confidenceScore ?? 85)
                      )}% Confidence
                    </span>
                  </div>

                  {/* Risk Level Badge */}
                  <div className={cn(
                    'px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-2xs',
                    (result.deltaPercent.cost > 20 || result.deltaPercent.throughput < -5)
                      ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-400'
                      : (result.deltaPercent.cost > 10 || result.deltaPercent.cycleTime > 0)
                        ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-400'
                        : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400'
                  )}>
                    <ShieldAlert className="size-3.5" />
                    <span>
                      {(result.deltaPercent.cost > 20 || result.deltaPercent.throughput < -5)
                        ? 'High Risk'
                        : (result.deltaPercent.cost > 10 || result.deltaPercent.cycleTime > 0)
                          ? 'Medium Risk'
                          : 'Low Risk'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3-Column Summary Cards: Strategic Upside, Key Risks, Implementation Recommendation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Strategic Upside */}
                <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-[#0B0F17]/60 border border-slate-200/70 dark:border-[#1E2638] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">
                    <TrendingUp className="size-4 text-emerald-500" />
                    <span>Strategic Upside</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
                    {result.recommendations && result.recommendations.length > 0 ? (
                      result.recommendations.slice(0, 2).map((rec, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold shrink-0">✓</span>
                          <span>{rec}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold shrink-0">✓</span>
                          <span>Throughput projected to improve by +{result.deltaPercent.throughput}%</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold shrink-0">✓</span>
                          <span>Cycle time reduced by {Math.abs(result.deltaPercent.cycleTime)}%</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {/* 2. Key Risks & Bottlenecks */}
                <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-[#0B0F17]/60 border border-slate-200/70 dark:border-[#1E2638] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">
                    <AlertTriangle className="size-4 text-amber-500" />
                    <span>Watchouts & Risks</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
                    {result.risks && result.risks.length > 0 ? (
                      result.risks.slice(0, 2).map((risk, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold shrink-0">⚠</span>
                          <span>{risk}</span>
                        </li>
                      ))
                    ) : (
                      <li className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold shrink-0">⚠</span>
                        <span>Ensure downstream capacity matches increased throughput rate.</span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* 3. Implementation Verdict Summary */}
                <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-[#0B0F17]/60 border border-slate-200/70 dark:border-[#1E2638] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">
                    <Award className="size-4 text-[#6366F1] dark:text-[#A5B4FC]" />
                    <span>Action Summary</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#6366F1] dark:text-[#A5B4FC] font-bold shrink-0">➔</span>
                      <span>
                        {((result.deltaPercent.throughput >= 0 && result.deltaPercent.cost <= 15) || result.deltaPercent.cycleTime < 0)
                          ? `Greenlight ${result.implementationPlan?.[0]?.phase || 'Phase 1'} rollout over ${result.implementationPlan?.[0]?.duration || '2 weeks'}.`
                          : 'Conduct risk audit & validate baseline assumptions before committing capital.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#6366F1] dark:text-[#A5B4FC] font-bold shrink-0">➔</span>
                      <span>Monitor weekly throughput constraints and operational cash buffer.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Structured Operational Synthesis Breakdown */}
              <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-[#0B0F17] border border-slate-200/80 dark:border-[#1E2638] space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-[#1E2638] pb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                    Theory of Constraints &amp; Operational Synthesis
                  </span>
                  <span className="text-[10px] font-mono text-text-muted">
                    Little&apos;s Law Engine (L = &lambda;W)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-white dark:bg-[#111622] border border-slate-200/60 dark:border-[#1E2638] space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#64748B] dark:text-[#94A3B8] block">
                      Constraint Impact
                    </span>
                    <p className="text-xs font-semibold text-[#0F172A] dark:text-white">
                      Throughput +{result.deltaPercent.throughput}% · Cycle time {result.deltaPercent.cycleTime}%
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white dark:bg-[#111622] border border-slate-200/60 dark:border-[#1E2638] space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#64748B] dark:text-[#94A3B8] block">
                      Cost &amp; Profit Yield
                    </span>
                    <p className="text-xs font-semibold text-[#0F172A] dark:text-white">
                      Net weekly impact: {result.deltaPercent.cost > 0 ? `+${result.deltaPercent.cost}%` : `${result.deltaPercent.cost}%`}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white dark:bg-[#111622] border border-slate-200/60 dark:border-[#1E2638] space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#64748B] dark:text-[#94A3B8] block">
                      Quality &amp; Satisfaction
                    </span>
                    <p className="text-xs font-semibold text-[#0F172A] dark:text-white">
                      Satisfaction: {result.projectedState.employeeSatisfaction}/100 ({result.deltaPercent.satisfaction > 0 ? '+' : ''}{result.deltaPercent.satisfaction}%)
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </FadeInView>

          {/* Current vs Projected Performance Charts */}
          <FadeInView offset={16}>
            <SimulationCharts result={result} />
          </FadeInView>

          {/* Phased Implementation Roadmap (Infographic Hexagon Timeline Design) */}
          <FadeInView offset={16}>
            <Card className="p-6 sm:p-8 shadow-2xs border-border/80 bg-surface">
              <div className="text-center max-w-lg mx-auto mb-10 pb-4 border-b border-border/60">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand block mb-1">
                  Step-by-Step Execution
                </span>
                <h4 className="text-base sm:text-lg font-bold text-text-primary uppercase tracking-tight">
                  Implementation Roadmap & Execution Timeline
                </h4>
                <p className="text-xs text-text-muted mt-1">
                  Sequential operational rollout designed to minimize disruption while maximizing throughput.
                </p>
              </div>

              {/* Central Spine Infographic Timeline */}
              <div className="relative py-4">
                {/* Central Vertical Spine Line (center on md, left on mobile) */}
                <div className="absolute top-0 bottom-0 left-6 md:left-1/2 -translate-x-1/2 w-0.5 bg-linear-to-b from-teal-500 via-indigo-500 to-amber-500/80" />

                <div className="space-y-12 md:space-y-16">
                  {result.implementationPlan.map((phase, i) => {
                    const stepNum = String(i + 1).padStart(2, '0');
                    const isEven = i % 2 === 1;
                    const colors = [
                      '#0F766E', // Stage 1 Teal
                      '#0D9488', // Stage 2 Teal-Green
                      '#6366F1', // Stage 3 Indigo
                      '#D97706', // Stage 4 Amber
                      '#E11D48', // Stage 5 Rose
                    ];
                    const stageColor = colors[i % colors.length];

                    return (
                      <div
                        key={i}
                        className="relative flex flex-col md:flex-row items-start md:items-center w-full"
                      >
                        {/* ── Left Side (Desktop) ── */}
                        <div className="hidden md:flex flex-1 justify-end items-center pr-8 min-w-0">
                          {!isEven ? (
                            /* Text on Left for Odd Steps (01, 03, 05) */
                            <div className="text-right space-y-1.5 max-w-md">
                              <span
                                className="text-[10px] font-bold uppercase tracking-wider block font-mono"
                                style={{ color: stageColor }}
                              >
                                {phase.duration}
                              </span>
                              <h5 className="text-xs sm:text-sm font-bold text-text-primary uppercase tracking-tight">
                                {phase.phase}
                              </h5>
                              <p className="text-xs text-text-muted leading-relaxed">
                                {phase.expectedImpact}
                              </p>
                            </div>
                          ) : (
                            /* Hexagon Badge + Branch Connector on Left for Even Steps (02, 04) */
                            <div className="flex items-center gap-3">
                              <div className="relative flex items-center justify-center w-14 h-16 shrink-0 transition-transform duration-200 hover:scale-105">
                                <svg
                                  viewBox="0 0 100 115"
                                  className="w-full h-full drop-shadow-xs"
                                  style={{ color: stageColor }}
                                >
                                  <polygon
                                    points="50,5 95,27.5 95,82.5 50,105 5,82.5 5,27.5"
                                    fill="var(--surface)"
                                    stroke="currentColor"
                                    strokeWidth="3.5"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <span
                                  className="absolute inset-0 flex items-center justify-center font-mono font-bold text-sm select-none"
                                  style={{ color: stageColor }}
                                >
                                  {stepNum}
                                </span>
                              </div>
                              <div
                                className="w-8 h-0.5"
                                style={{ backgroundColor: stageColor }}
                              />
                            </div>
                          )}
                        </div>

                        {/* ── Central Node Dot on Spine ── */}
                        <div
                          className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center size-3.5 rounded-full border-2 border-surface shadow-xs z-10"
                          style={{ backgroundColor: stageColor }}
                        />

                        {/* ── Right Side (Desktop) / Main Column (Mobile) ── */}
                        <div className="flex-1 pl-14 md:pl-8 min-w-0">
                          {/* Desktop Right Side Content */}
                          <div className="hidden md:flex items-center">
                            {!isEven ? (
                              /* Branch Connector + Hexagon Badge on Right for Odd Steps (01, 03, 05) */
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-0.5"
                                  style={{ backgroundColor: stageColor }}
                                />
                                <div className="relative flex items-center justify-center w-14 h-16 shrink-0 transition-transform duration-200 hover:scale-105">
                                  <svg
                                    viewBox="0 0 100 115"
                                    className="w-full h-full drop-shadow-xs"
                                    style={{ color: stageColor }}
                                  >
                                    <polygon
                                      points="50,5 95,27.5 95,82.5 50,105 5,82.5 5,27.5"
                                      fill="var(--surface)"
                                      stroke="currentColor"
                                      strokeWidth="3.5"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <span
                                    className="absolute inset-0 flex items-center justify-center font-mono font-bold text-sm select-none"
                                    style={{ color: stageColor }}
                                  >
                                    {stepNum}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              /* Text on Right for Even Steps (02, 04) */
                              <div className="text-left space-y-1.5 max-w-md">
                                <span
                                  className="text-[10px] font-bold uppercase tracking-wider block font-mono"
                                  style={{ color: stageColor }}
                                >
                                  {phase.duration}
                                </span>
                                <h5 className="text-xs sm:text-sm font-bold text-text-primary uppercase tracking-tight">
                                  {phase.phase}
                                </h5>
                                <p className="text-xs text-text-muted leading-relaxed">
                                  {phase.expectedImpact}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Mobile View: Hexagon + Text stacked */}
                          <div className="md:hidden space-y-2">
                            <div className="flex items-center gap-3">
                              <div className="relative flex items-center justify-center w-12 h-14 shrink-0">
                                <svg
                                  viewBox="0 0 100 115"
                                  className="w-full h-full"
                                  style={{ color: stageColor }}
                                >
                                  <polygon
                                    points="50,5 95,27.5 95,82.5 50,105 5,82.5 5,27.5"
                                    fill="var(--surface)"
                                    stroke="currentColor"
                                    strokeWidth="3.5"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <span
                                  className="absolute inset-0 flex items-center justify-center font-mono font-bold text-xs"
                                  style={{ color: stageColor }}
                                >
                                  {stepNum}
                                </span>
                              </div>
                              <span
                                className="text-[10px] font-bold uppercase tracking-wider font-mono px-2 py-0.5 rounded-full bg-surface-subtle border border-border/60"
                                style={{ color: stageColor }}
                              >
                                {phase.duration}
                              </span>
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-text-primary uppercase tracking-tight">
                                {phase.phase}
                              </h5>
                              <p className="text-xs text-text-muted leading-relaxed mt-0.5">
                                {phase.expectedImpact}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </FadeInView>

          {/* Key Risks & Strategic Recommendations (2 Columns) */}
          <FadeInView offset={16}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-5 shadow-2xs border-border/80 bg-surface">
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-3">
                  Identified Operational Risks
                </h4>
                <ul className="space-y-2.5">
                  {result.risks.map((r, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-xs text-danger/90 bg-danger-soft/10 p-3 rounded-xl border border-danger/20"
                    >
                      <span className="font-bold text-danger mt-0.5">•</span>
                      <span className="leading-snug">{r}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-5 shadow-2xs border-border/80 bg-surface">
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-3">
                  Strategic Recommendations
                </h4>
                <ul className="space-y-2.5">
                  {result.recommendations.map((rec, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-xs text-text-secondary bg-surface-subtle p-3 rounded-xl border border-border/50"
                    >
                      <span className="font-bold text-emerald-500 mt-0.5">✓</span>
                      <span className="leading-snug">{rec}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </FadeInView>

          {/* ── Wallflower Recommendation & Decision Actions (Section 13) ── */}
          <FadeInView offset={18}>
            <Card className="p-6 rounded-2xl bg-linear-to-br from-[#6366F1]/10 via-white to-purple-500/10 dark:from-[#6366F1]/15 dark:via-[#111622] dark:to-purple-950/25 border-2 border-[#6366F1]/50 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-xl bg-[#6366F1] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Award className="size-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6366F1] dark:text-[#A5B4FC]">
                        Wallflower Verdict
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <span className="size-1 rounded-full bg-emerald-500" />
                        <span>Recommended Decision</span>
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-text-primary">
                      {initialName || activeTemplate.name}
                    </h4>
                    <p className="text-xs text-text-muted leading-relaxed max-w-2xl pt-1">
                      The simulation projects positive throughput gains (+{result.deltaPercent?.throughput || 0}%) while preserving working capital resilience and manageable execution risk.
                    </p>
                  </div>
                </div>

                {/* Cross-Tab Actions: Generate Report & Compare */}
                <div className="flex items-center gap-2.5 flex-wrap self-end sm:self-center shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/simulations?tab=compare')}
                    className="gap-2 text-xs font-semibold cursor-pointer h-9 px-3.5 rounded-xl border border-slate-200 dark:border-[#2A344A]"
                  >
                    <Scale className="size-3.5 text-[#6366F1]" />
                    <span>Compare Alternatives</span>
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      saveReport({
                        id: `rpt-sim-${activeTemplate.id}`,
                        title: `${initialName || activeTemplate.name} (Simulation Memo)`,
                        type: 'Executive Summary',
                        date: 'Today • Just now',
                        horizon: '6 Months Horizon',
                        healthScore: 84,
                        profit: `฿${Math.round(120000 * (1 + (result.deltaPercent?.throughput || 0) * 0.006)).toLocaleString()}`,
                        confidence: 91,
                        confidenceBadge: 'High Confidence',
                        iconColor: 'emerald',
                      });
                      router.push('/reports');
                    }}
                    className="gap-2 text-xs font-bold cursor-pointer h-9 px-4 rounded-xl bg-[#6366F1] text-white hover:bg-[#4F46E5] shadow-sm shadow-indigo-500/20"
                  >
                    <FileText className="size-3.5" />
                    <span>Generate Decision Report</span>
                  </Button>
                </div>
              </div>
            </Card>
          </FadeInView>
        </div>
      )}
    </div>
  );
}
