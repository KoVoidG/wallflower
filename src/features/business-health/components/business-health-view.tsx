'use client';

import { useState, useEffect } from 'react';
import { RotateCw, Edit, LineChart, Building2, Package, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppPage } from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { FadeInView } from '@/components/motion';
import { BusinessHealthSkeleton } from '@/components/ui/skeleton';
import { FinancialSnapshotView } from './financial-snapshot-view';
import { OperationsView } from './operations-view';
import { InventoryView } from './inventory-view';
import { UnitEconomicsView } from './unit-economics-view';

export type BusinessTab = 'snapshot' | 'operations' | 'inventory' | 'assumptions';

export function BusinessHealthView() {
  const [activeTab, setActiveTab] = useState<BusinessTab>(() => {
    if (typeof window === 'undefined') return 'snapshot';
    const params = new URLSearchParams(window.location.search);
    const tabFromUrl = params.get('tab') as BusinessTab | null;
    const tabFromStorage = localStorage.getItem('business_active_tab') as BusinessTab | null;
    const validTabs: BusinessTab[] = ['snapshot', 'operations', 'inventory', 'assumptions'];

    if (tabFromUrl && validTabs.includes(tabFromUrl)) return tabFromUrl;
    if (tabFromStorage && validTabs.includes(tabFromStorage)) return tabFromStorage;
    return 'snapshot';
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleTabChange = (tab: BusinessTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      localStorage.setItem('business_active_tab', tab);
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 350);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  if (isLoading) {
    return <BusinessHealthSkeleton />;
  }

  return (
    <AppPage>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
        {/* ── Page Header ────────────────────────────────────────────────────────── */}
        <FadeInView offset={8}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                Business Health
              </h1>
              <p className="font-sans text-xs sm:text-sm text-text-secondary mt-1">
                Monitor key financial metrics, operating ratios, and health indicators.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-sans text-text-secondary">
                <span className="font-medium">Data updated: May 2024</span>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="p-1 text-text-secondary hover:text-text-primary rounded-md transition-colors cursor-pointer"
                  title="Refresh business data"
                >
                  <RotateCw className={`size-3.5 ${isRefreshing ? 'animate-spin text-tertiary' : ''}`} />
                </button>
              </div>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="inline-flex items-center gap-2 border-border bg-surface text-text-primary hover:bg-surface-hover cursor-pointer"
              >
                <Edit className="size-3.5 text-text-secondary" />
                <span>Edit Business Info</span>
              </Button>
            </div>
          </div>
        </FadeInView>

        {/* ── Internal Tabs Bar ──────────────────────────────────────────────── */}
        <FadeInView offset={12}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/80 gap-4">
            <div className="flex items-center gap-6 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => handleTabChange('snapshot')}
                className={cn(
                  'pb-3 text-sm font-medium transition-colors relative cursor-pointer whitespace-nowrap flex items-center gap-2',
                  activeTab === 'snapshot'
                    ? 'text-tertiary font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                <LineChart className="size-4" />
                <span>Financial Snapshot</span>
                {activeTab === 'snapshot' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-tertiary rounded-full" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('operations')}
                className={cn(
                  'pb-3 text-sm font-medium transition-colors relative cursor-pointer whitespace-nowrap flex items-center gap-2',
                  activeTab === 'operations'
                    ? 'text-tertiary font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                <Building2 className="size-4" />
                <span>Operations</span>
                {activeTab === 'operations' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-tertiary rounded-full" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('inventory')}
                className={cn(
                  'pb-3 text-sm font-medium transition-colors relative cursor-pointer whitespace-nowrap flex items-center gap-2',
                  activeTab === 'inventory'
                    ? 'text-tertiary font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                <Package className="size-4" />
                <span>Inventory Overview</span>
                {activeTab === 'inventory' && (
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
                <SlidersHorizontal className="size-4" />
                <span>Assumptions</span>
                {activeTab === 'assumptions' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-tertiary rounded-full" />
                )}
              </button>
            </div>
          </div>
        </FadeInView>

        {/* ── Active Tab View ────────────────────────────────────────────────── */}
        {activeTab === 'snapshot' && <FinancialSnapshotView />}

        {activeTab === 'operations' && <OperationsView />}

        {activeTab === 'inventory' && <InventoryView />}

        {activeTab === 'assumptions' && <UnitEconomicsView />}
      </div>
    </AppPage>
  );
}
