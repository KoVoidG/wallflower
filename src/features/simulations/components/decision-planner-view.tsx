'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AppPage } from '@/components/ui/layout';
import { DecisionPlannerSkeleton } from '@/components/ui/skeleton';
import { Library, Sliders, Scale, Settings, ArrowUpRight } from 'lucide-react';
import {
  ScenarioLibraryView,
  type ScenarioItem,
} from './scenario-library-view';
import { ScenarioWorkspaceView } from './scenario-workspace-view';
import { CompareSimulationsView } from './compare-simulations-view';
import { GlobalAssumptionsView } from './global-assumptions-view';
import type { SavedSimulation } from '@/features/simulations/adapters/simulations.adapter';

export type DecisionPlannerTab =
  | 'library'
  | 'workspace'
  | 'compare'
  | 'assumptions';

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
      'compare',
      'assumptions',
    ];

    if (tabFromUrl && validTabs.includes(tabFromUrl)) return tabFromUrl;
    if (tabFromStorage && validTabs.includes(tabFromStorage))
      return tabFromStorage;
    return 'library';
  });

  const [activeScenario, setActiveScenario] = useState<ScenarioItem | null>(
    null,
  );
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
    setActiveScenario(scen);
    handleTabChange('workspace');
  };

  const handleCompareScenario = (scen: ScenarioItem) => {
    setActiveScenario(scen);
    handleTabChange('compare');
  };

  if (isLoading) {
    return <DecisionPlannerSkeleton />;
  }

  return (
    <AppPage className="pb-0">
      <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
        {/* ── 1. Page Header Bar with Credits & Upgrade Button ──────────── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-[#1E2638]">
          <div className="space-y-1">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              {t('pageTitle')}
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8]">
              {t('subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap self-start lg:self-auto">
            {/* Simulation Credits Badge inside Decision Planner */}
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
                <div className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full w-[40%]" />
              </div>
            </div>

            {/* Upgrade Plan Button inside Decision Planner */}
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

        {/* ── 2. 4 Sub-Tabs Bar ────────────────────────────────────────────── */}
        <div className="border-b border-slate-100 dark:border-[#1E2638]">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => handleTabChange('library')}
              className={cn(
                'pb-3 text-sm font-medium transition-colors relative cursor-pointer whitespace-nowrap flex items-center gap-2',
                activeTab === 'library'
                  ? 'text-[#4F46E5] dark:text-[#A5B4FC] font-semibold'
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
                'pb-3 text-sm font-medium transition-colors relative cursor-pointer whitespace-nowrap flex items-center gap-2',
                activeTab === 'workspace'
                  ? 'text-[#4F46E5] dark:text-[#A5B4FC] font-semibold'
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
              onClick={() => handleTabChange('compare')}
              className={cn(
                'pb-3 text-sm font-medium transition-colors relative cursor-pointer whitespace-nowrap flex items-center gap-2',
                activeTab === 'compare'
                  ? 'text-[#4F46E5] dark:text-[#A5B4FC] font-semibold'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white',
              )}
            >
              <Scale className="size-4" />
              <span>{t('tabs.compare')}</span>
              {activeTab === 'compare' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('assumptions')}
              className={cn(
                'pb-3 text-sm font-medium transition-colors relative cursor-pointer whitespace-nowrap flex items-center gap-2',
                activeTab === 'assumptions'
                  ? 'text-[#4F46E5] dark:text-[#A5B4FC] font-semibold'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white',
              )}
            >
              <Settings className="size-4" />
              <span>{t('tabs.assumptions')}</span>
              {activeTab === 'assumptions' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* ── 3. Active Tab View Content ──────────────────────────────────── */}
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

        {activeTab === 'compare' && <CompareSimulationsView />}

        {activeTab === 'assumptions' && <GlobalAssumptionsView />}
      </div>
    </AppPage>
  );
}
