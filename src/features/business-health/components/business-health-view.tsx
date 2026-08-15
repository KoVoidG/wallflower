// src/features/business-health/components/business-health-view.tsx
'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { RotateCw, Edit, LineChart, Building2, Package, SlidersHorizontal, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppPage } from '@/components/ui/layout';
import { FadeInView } from '@/components/motion';
import { BusinessHealthSkeleton } from '@/components/ui/skeleton';
import { FinancialSnapshotView } from './financial-snapshot-view';
import { OperationsView } from './operations-view';
import { InventoryView } from './inventory-view';
import { UnitEconomicsView } from './unit-economics-view';
import { RiskView } from './risk-view';

export type BusinessTab = 'snapshot' | 'operations' | 'inventory' | 'assumptions' | 'risks';

export function BusinessHealthView() {
  const t = useTranslations('businessHealth');
  const tCommon = useTranslations('common');
  const [activeTab, setActiveTab] = useState<BusinessTab>(() => {
    if (typeof window === 'undefined') return 'snapshot';
    const params = new URLSearchParams(window.location.search);
    const tabFromUrl = params.get('tab') as BusinessTab | null;
    const tabFromStorage = localStorage.getItem('business_active_tab') as BusinessTab | null;
    const validTabs: BusinessTab[] = ['snapshot', 'operations', 'inventory', 'assumptions', 'risks'];

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
    const timer = setTimeout(() => setIsLoading(false), 250);
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
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white">
                {t('pageTitle')}
              </h1>
              <p className="font-sans text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">
                {t('subtitle')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#111622] text-xs font-sans text-[#64748B] dark:text-[#94A3B8] shadow-xs">
                <span className="font-medium">Data updated: May 2024</span>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="p-1 text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white rounded-md transition-colors cursor-pointer"
                  title="Refresh business data"
                >
                  <RotateCw className={`size-3.5 ${isRefreshing ? 'animate-spin text-[#6366F1]' : ''}`} />
                </button>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#111622] text-xs font-semibold text-[#0F172A] dark:text-white hover:bg-[#6366F1]/10 dark:hover:bg-[#6366F1]/20 hover:border-[#6366F1]/30 transition-all cursor-pointer shadow-xs"
              >
                <Edit className="size-3.5 text-[#6366F1]" />
                <span>{tCommon('edit')}</span>
              </button>
            </div>
          </div>
        </FadeInView>

        {/* ── Internal Tabs Bar ──────────────────────────────────────────────── */}
        <FadeInView offset={12}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 dark:border-[#1E2638] gap-4">
            <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => handleTabChange('snapshot')}
                className={cn(
                  'pb-3 text-xs sm:text-sm font-medium transition-all relative cursor-pointer whitespace-nowrap flex items-center gap-2 px-2',
                  activeTab === 'snapshot'
                    ? 'text-[#4F46E5] dark:text-[#A5B4FC] font-bold'
                    : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
                )}
              >
                <LineChart className="size-4" />
                <span>{t('tabs.snapshot')}</span>
                {activeTab === 'snapshot' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('operations')}
                className={cn(
                  'pb-3 text-xs sm:text-sm font-medium transition-all relative cursor-pointer whitespace-nowrap flex items-center gap-2 px-2',
                  activeTab === 'operations'
                    ? 'text-[#4F46E5] dark:text-[#A5B4FC] font-bold'
                    : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
                )}
              >
                <Building2 className="size-4" />
                <span>{t('tabs.operations')}</span>
                {activeTab === 'operations' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('inventory')}
                className={cn(
                  'pb-3 text-xs sm:text-sm font-medium transition-all relative cursor-pointer whitespace-nowrap flex items-center gap-2 px-2',
                  activeTab === 'inventory'
                    ? 'text-[#4F46E5] dark:text-[#A5B4FC] font-bold'
                    : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
                )}
              >
                <Package className="size-4" />
                <span>{t('tabs.inventory')}</span>
                {activeTab === 'inventory' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('assumptions')}
                className={cn(
                  'pb-3 text-xs sm:text-sm font-medium transition-all relative cursor-pointer whitespace-nowrap flex items-center gap-2 px-2',
                  activeTab === 'assumptions'
                    ? 'text-[#4F46E5] dark:text-[#A5B4FC] font-bold'
                    : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
                )}
              >
                <SlidersHorizontal className="size-4" />
                <span>{t('tabs.unitEconomics')}</span>
                {activeTab === 'assumptions' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('risks')}
                className={cn(
                  'pb-3 text-xs sm:text-sm font-medium transition-all relative cursor-pointer whitespace-nowrap flex items-center gap-2 px-2',
                  activeTab === 'risks'
                    ? 'text-[#4F46E5] dark:text-[#A5B4FC] font-bold'
                    : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
                )}
              >
                <ShieldAlert className="size-4" />
                <span>{t('tabs.risks')}</span>
                {activeTab === 'risks' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full" />
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

        {activeTab === 'risks' && <RiskView />}
      </div>
    </AppPage>
  );
}
