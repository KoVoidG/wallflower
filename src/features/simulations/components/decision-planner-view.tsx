'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AppPage } from '@/components/ui/layout';
import { DecisionPlannerSkeleton } from '@/components/ui/skeleton';
import {
  Library,
  Sliders,
  Scale,
  Settings,
  ArrowUpRight,
} from 'lucide-react';
import { ScenarioLibraryView, type ScenarioItem } from './scenario-library-view';
import { ScenarioWorkspaceView } from './scenario-workspace-view';
import { CompareSimulationsView } from './compare-simulations-view';
import { GlobalAssumptionsView } from './global-assumptions-view';
import type { SavedSimulation } from '@/features/simulations/adapters/simulations.adapter';

export type DecisionPlannerTab = 'library' | 'workspace' | 'compare' | 'assumptions';

interface DecisionPlannerViewProps {
  initialHistory?: SavedSimulation[];
}

export function DecisionPlannerView({}: DecisionPlannerViewProps) {
  const [activeTab, setActiveTab] = useState<DecisionPlannerTab>(() => {
    if (typeof window === 'undefined') return 'library';
    const params = new URLSearchParams(window.location.search);
    const tabFromUrl = params.get('tab') as DecisionPlannerTab | null;
    const tabFromStorage = localStorage.getItem('decision_planner_active_tab') as DecisionPlannerTab | null;
    const validTabs: DecisionPlannerTab[] = ['library', 'workspace', 'compare', 'assumptions'];

    if (tabFromUrl && validTabs.includes(tabFromUrl)) return tabFromUrl;
    if (tabFromStorage && validTabs.includes(tabFromStorage)) return tabFromStorage;
    return 'library';
  });

  const [activeScenario, setActiveScenario] = useState<ScenarioItem | null>(null);
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
    <AppPage>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
        {/* ── 1. Page Header Bar with Credits & Upgrade Button ──────────── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-border/60">
          <div className="space-y-1">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              Decision Planner
            </h1>
            <p className="font-sans text-xs sm:text-sm text-text-secondary">
              Plan, simulate, and make smarter business decisions.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap self-start lg:self-auto">
            {/* Simulation Credits Badge inside Decision Planner */}
            <div className="px-3.5 py-2 rounded-xl border border-border-strong bg-surface flex items-center gap-3 shadow-2xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
                  Simulation Credits
                </span>
                <p className="text-xs font-mono font-bold text-text-primary">
                  <span className="text-emerald-500 font-extrabold">4</span> / 10 used this month
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-16 h-2 bg-border rounded-full overflow-hidden shrink-0">
                <div className="h-full bg-emerald-500 rounded-full w-[40%]" />
              </div>
            </div>

            {/* Upgrade Plan Button inside Decision Planner */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs font-bold gap-1.5 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer h-10 px-3.5"
            >
              <span>Upgrade Plan</span>
              <ArrowUpRight className="size-3.5" />
            </Button>
          </div>
        </div>

        {/* ── 2. 4 Sub-Tabs Bar ────────────────────────────────────────────── */}
        <div className="border-b border-border/80">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => handleTabChange('library')}
              className={cn(
                'pb-3 text-sm font-medium transition-colors relative cursor-pointer whitespace-nowrap flex items-center gap-2',
                activeTab === 'library'
                  ? 'text-tertiary font-semibold'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              <Library className="size-4" />
              <span>Scenario Library</span>
              {activeTab === 'library' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-tertiary rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('workspace')}
              className={cn(
                'pb-3 text-sm font-medium transition-colors relative cursor-pointer whitespace-nowrap flex items-center gap-2',
                activeTab === 'workspace'
                  ? 'text-tertiary font-semibold'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              <Sliders className="size-4" />
              <span>Scenario Workspace</span>
              {activeTab === 'workspace' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-tertiary rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('compare')}
              className={cn(
                'pb-3 text-sm font-medium transition-colors relative cursor-pointer whitespace-nowrap flex items-center gap-2',
                activeTab === 'compare'
                  ? 'text-tertiary font-semibold'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              <Scale className="size-4" />
              <span>Compare Simulations</span>
              {activeTab === 'compare' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-tertiary rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('assumptions')}
              className={cn(
                'pb-3 text-sm font-medium transition-colors relative cursor-pointer whitespace-nowrap flex items-center gap-2',
                activeTab === 'assumptions'
                  ? 'text-tertiary font-semibold'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              <Settings className="size-4" />
              <span>Global Assumptions</span>
              {activeTab === 'assumptions' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-tertiary rounded-full" />
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

        {activeTab === 'compare' && (
          <CompareSimulationsView />
        )}

        {activeTab === 'assumptions' && (
          <GlobalAssumptionsView />
        )}
      </div>
    </AppPage>
  );
}
