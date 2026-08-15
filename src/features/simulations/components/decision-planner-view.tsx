// src/features/simulations/components/decision-planner-view.tsx
'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AppPage } from '@/components/ui/layout';
import { DecisionPlannerSkeleton } from '@/components/ui/skeleton';
import { Library, Sliders, Scale, Activity, ArrowUpRight, Workflow } from 'lucide-react';
import {
  ScenarioLibraryView,
  type ScenarioItem,
} from './scenario-library-view';
import { ScenarioWorkspaceView } from './scenario-workspace-view';
import { CompareSimulationsView } from './compare-simulations-view';
import { BottleneckAnalysisView } from './bottleneck-analysis-view';
import type { SavedSimulation } from '@/features/simulations/adapters/simulations.adapter';
import type { BottleneckResult } from '@/lib/liquiflow-types';

export type DecisionPlannerTab =
  | 'library'
  | 'workspace'
  | 'bottleneck'
  | 'compare';

interface DecisionPlannerViewProps {
  initialHistory?: SavedSimulation[];
}

export function DecisionPlannerView({}: DecisionPlannerViewProps) {
  const t = useTranslations('simulations');
  const [activeTab, setActiveTab] = useState<DecisionPlannerTab>(() => {
    if (typeof window === 'undefined') return 'library';
    const params = new URLSearchParams(window.location.search);
    const tabFromUrl = params.get('tab') as DecisionPlannerTab | null;
    const tabFromStorage = localStorage.getItem(
      'decision_planner_active_tab',
    ) as DecisionPlannerTab | null;
    const validTabs: DecisionPlannerTab[] = [
      'library',
      'workspace',
      'bottleneck',
      'compare',
    ];

    if (tabFromUrl && validTabs.includes(tabFromUrl)) return tabFromUrl;
    if (tabFromStorage && validTabs.includes(tabFromStorage))
      return tabFromStorage;
    return 'library';
  });

  const [activeScenario, setActiveScenario] = useState<ScenarioItem | null>(
    null,
  );
  const [activeBottleneckResult, setActiveBottleneckResult] = useState<BottleneckResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 350);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tab: DecisionPlannerTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      localStorage.setItem('decision_planner_active_tab', tab);
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleOpenScenario = (scen: ScenarioItem) => {
    if (scen.type === 'bottleneck') {
      setActiveBottleneckResult(scen.bottleneckResult || null);
      handleTabChange('bottleneck');
    } else {
      setActiveScenario(scen);
      handleTabChange('workspace');
    }
  };

  const handleCompareScenario = (scen: ScenarioItem) => {
    setActiveScenario(scen);
    handleTabChange('compare');
  };

  const handleSimulateIntervention = (b: BottleneckResult['bottlenecks'][number]) => {
    const loc = b.location.toLowerCase();
    let templateId = 'equipment_purchase';
    let inputValues: Record<string, number | string> = {};

    if (loc.includes('invoice') || loc.includes('vendor') || loc.includes('account')) {
      templateId = 'cost_reduction';
      inputValues = { costReductionPercent: 15, timeHorizonMonths: 6 };
    } else if (loc.includes('employee') || loc.includes('staff') || loc.includes('hiring') || loc.includes('onboard')) {
      templateId = 'hire_employee';
      inputValues = { numberOfEmployees: 2, timeHorizonMonths: 6 };
    } else if (loc.includes('packing') || loc.includes('order') || loc.includes('fulfillment') || loc.includes('warehouse')) {
      templateId = 'equipment_purchase';
      inputValues = { equipmentCost: 50000, efficiencyGainPercent: 25, timeHorizonMonths: 6 };
    } else if (loc.includes('inventory') || loc.includes('stock')) {
      templateId = 'inventory_expansion';
      inputValues = { inventoryIncreasePercent: 20, timeHorizonMonths: 6 };
    } else {
      templateId = 'cost_reduction';
      inputValues = { costReductionPercent: 12, timeHorizonMonths: 6 };
    }

    const scen: ScenarioItem = {
      id: `bottleneck_intervention_${Date.now()}`,
      name: `Intervention: ${b.location}`,
      strategyTag: 'Bottleneck Relief',
      goal: `Optimize throughput & resolve ${b.location} constraint`,
      status: 'Simulated',
      lastSimulated: 'Just now',
      riskLevel: 'Low',
      icon: Workflow,
      templateId,
      inputValues,
    };

    setActiveScenario(scen);
    handleTabChange('workspace');
  };

  if (isLoading) {
    return <DecisionPlannerSkeleton />;
  }

  return (
    <AppPage className="py-0 px-0 -mt-3 sm:-mt-4 space-y-5 sm:space-y-6">
      <div className="space-y-5 sm:space-y-6 max-w-[1600px] mx-auto pb-4">
        {/* ── Top Navigation & Credits Bar ──────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 dark:border-[#1E2638] gap-4">
          <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => handleTabChange('library')}
              className={cn(
                'pb-3 text-xs sm:text-sm font-medium transition-all relative cursor-pointer whitespace-nowrap flex items-center gap-2 px-2',
                activeTab === 'library'
                  ? 'text-[#4F46E5] dark:text-[#A5B4FC] font-bold'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white',
              )}
            >
              <Library className="size-4" />
              <span>{t('tabs.library')}</span>
              {activeTab === 'library' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('workspace')}
              className={cn(
                'pb-3 text-xs sm:text-sm font-medium transition-all relative cursor-pointer whitespace-nowrap flex items-center gap-2 px-2',
                activeTab === 'workspace'
                  ? 'text-[#4F46E5] dark:text-[#A5B4FC] font-bold'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white',
              )}
            >
              <Sliders className="size-4" />
              <span>{t('tabs.workspace')}</span>
              {activeTab === 'workspace' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('bottleneck')}
              className={cn(
                'pb-3 text-xs sm:text-sm font-medium transition-all relative cursor-pointer whitespace-nowrap flex items-center gap-2 px-2',
                activeTab === 'bottleneck'
                  ? 'text-[#4F46E5] dark:text-[#A5B4FC] font-bold'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white',
              )}
            >
              <Activity className="size-4" />
              <span>{t('tabs.bottleneck')}</span>
              {activeTab === 'bottleneck' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('compare')}
              className={cn(
                'pb-3 text-xs sm:text-sm font-medium transition-all relative cursor-pointer whitespace-nowrap flex items-center gap-2 px-2',
                activeTab === 'compare'
                  ? 'text-[#4F46E5] dark:text-[#A5B4FC] font-bold'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white',
              )}
            >
              <Scale className="size-4" />
              <span>{t('tabs.compare')}</span>
              {activeTab === 'compare' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-3.5 pb-2 self-start sm:self-auto shrink-0">
            {/* Simulation Credits Badge */}
            <div className="px-3.5 py-2 rounded-2xl border border-slate-200/80 dark:border-[#1E2638] bg-white dark:bg-[#111622] flex items-center gap-3 shadow-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider block">
                  {t('simulationCredits')}
                </span>
                <p className="text-xs font-mono font-bold text-[#0F172A] dark:text-white">
                  <span className="text-[#6366F1] dark:text-[#A5B4FC] font-extrabold">
                    4
                  </span>{' '}
                  / 10 used this month
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-16 h-2 bg-slate-100 dark:bg-[#1E2638] rounded-full overflow-hidden shrink-0">
                <div className="h-full bg-linear-to-r from-[#6366F1] to-[#8B5CF6] rounded-full w-[40%]" />
              </div>
            </div>

            {/* Upgrade Plan Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs font-bold gap-1.5 border border-purple-200 dark:border-purple-800/60 bg-purple-50 dark:bg-purple-950/50 text-[#6366F1] dark:text-[#A5B4FC] hover:bg-purple-100 dark:hover:bg-purple-900/50 cursor-pointer h-10 px-3.5 rounded-xl shadow-2xs transition-all"
            >
              <span>{t('upgradePlan')}</span>
              <ArrowUpRight className="size-3.5" />
            </Button>
          </div>
        </div>

        {/* ── Active Tab View Content ──────────────────────────────────── */}
        {activeTab === 'library' && (
          <ScenarioLibraryView
            onOpenScenario={handleOpenScenario}
            onCompareScenario={handleCompareScenario}
          />
        )}

        {activeTab === 'workspace' && (
          <ScenarioWorkspaceView
            scenario={activeScenario}
            onBackToLibrary={() => handleTabChange('library')}
            onCompareScenario={handleCompareScenario}
          />
        )}

        {activeTab === 'bottleneck' && (
          <BottleneckAnalysisView
            initialResult={activeBottleneckResult}
            onSimulateIntervention={handleSimulateIntervention}
          />
        )}

        {activeTab === 'compare' && <CompareSimulationsView />}
      </div>
    </AppPage>
  );
}
