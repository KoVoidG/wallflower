// src/features/automation/components/automation-engine-view.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  ShieldAlert,
  SlidersHorizontal,
  FileText,
  Activity,
  Mail,
  Megaphone,
  Pause,
  Play,
  ChevronRight,
  TrendingUp,
  Zap,
  Trash2,
} from 'lucide-react';
import { AppPage } from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { AutomationBuilder } from './AutomationBuilder';
import {
  INITIAL_AUTOMATIONS_DATA,
  type AutomationRule,
} from '../types/automation.types';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldAlert,
  SlidersHorizontal,
  FileText,
  Activity,
  Mail,
  Megaphone,
  Zap,
};

export function AutomationEngineView() {
  const [automations, setAutomations] = useState<AutomationRule[]>(INITIAL_AUTOMATIONS_DATA);
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  });
  const [automationToDelete, setAutomationToDelete] = useState<AutomationRule | null>(null);

  // Synchronize browser history for deep-linking & browser Back button
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const idFromUrl = params.get('id');
      setSelectedId(idFromUrl);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectAutomation = (rule: AutomationRule) => {
    setSelectedId(rule.id);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('id', rule.id);
      window.history.pushState({ id: rule.id }, '', url.toString());
    }
  };

  const handleCreateNew = () => {
    setSelectedId('new');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('id', 'new');
      window.history.pushState({ id: 'new' }, '', url.toString());
    }
  };

  const handleBackToOverview = () => {
    setSelectedId(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('id');
      window.history.pushState({}, '', url.toString());
    }
  };

  const handleToggleStatus = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAutomations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'active' ? 'paused' : 'active';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const handleDeleteAutomation = (id: string) => {
    setAutomations((prev) => prev.filter((item) => item.id !== id));
    if (selectedId === id) {
      handleBackToOverview();
    }
  };

  const handleSaveAutomation = (rule: AutomationRule) => {
    setAutomations((prev) => {
      const exists = prev.some((a) => a.id === rule.id);
      if (exists) {
        return prev.map((a) => (a.id === rule.id ? rule : a));
      }
      return [rule, ...prev];
    });
  };

  // 1. Create Mode
  if (selectedId === 'new') {
    return (
      <AppPage>
        <AutomationBuilder
          mode="create"
          onBack={handleBackToOverview}
          onSave={handleSaveAutomation}
        />
      </AppPage>
    );
  }

  // 2. Edit Mode
  const selectedAutomation = automations.find((a) => a.id === selectedId);
  if (selectedAutomation) {
    return (
      <AppPage>
        <AutomationBuilder
          mode="edit"
          automation={selectedAutomation}
          onBack={handleBackToOverview}
          onSave={handleSaveAutomation}
          onDelete={handleDeleteAutomation}
          onToggleStatus={(id) => handleToggleStatus(id)}
        />
      </AppPage>
    );
  }

  // 3. Active Automations Overview
  return (
    <AppPage>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-12 animate-in fade-in duration-300">
        {/* ── Page Header ───────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                Automation
              </h1>
              <Badge variant="brand" className="text-xs">
                Active Monitoring
              </Badge>
            </div>
            <p className="font-sans text-xs sm:text-sm text-text-muted">
              Let Wallflower monitor important business conditions and automatically run workflows when they occur.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleCreateNew}
            className="gap-2 text-xs h-9 rounded-xl shadow-xs cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Create Automation</span>
          </Button>
        </div>

        {/* ── Automations List ──────────────────────────────────────────────── */}
        <div className="space-y-3">
          {automations.map((item) => {
            const Icon = (item.iconName && ICON_MAP[item.iconName]) || Zap;

            return (
              <Card
                key={item.id}
                onClick={() => handleSelectAutomation(item)}
                className="p-4 sm:p-5 hover:border-brand/40 transition-all duration-200 ease-out hover:-translate-y-1 cursor-pointer group shadow-2xs hover:shadow-md bg-surface"
              >
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                  {/* Left Column: Icon + Category + Title + Status */}
                  <div className="flex items-start gap-3.5 min-w-[320px] max-w-[440px]">
                    <div className="w-10 h-10 rounded-xl bg-surface-subtle border border-border flex items-center justify-center text-text-secondary dark:text-text-muted shrink-0 group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:bg-brand/10 group-hover:border-brand/30 group-hover:text-brand transition-all duration-200 ease-out mt-0.5 shadow-2xs group-hover:shadow-xs">
                      <Icon className="size-5 transition-colors duration-200" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted group-hover:text-brand transition-colors">
                          {item.category}
                        </span>
                        <Badge
                          variant={
                            item.status === 'active'
                              ? 'success'
                              : item.status === 'paused'
                              ? 'warning'
                              : 'neutral'
                          }
                          dot
                          className="text-[10px] uppercase font-bold py-0"
                        >
                          {item.status}
                        </Badge>
                      </div>

                      <h3 className="text-sm font-bold text-text-primary group-hover:text-brand transition-colors leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs text-text-muted leading-relaxed line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: 5 Metrics + Actions */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 xl:flex items-center gap-4 xl:gap-8 pt-3 xl:pt-0 border-t xl:border-t-0 border-border/60 text-xs">
                    {/* Metric 1: Trigger */}
                    <div className="min-w-[120px]">
                      <span className="text-[10px] uppercase font-semibold text-text-muted block">
                        Trigger
                      </span>
                      <span className="font-mono text-xs font-semibold text-text-primary truncate block max-w-[140px]" title={item.trigger.condition}>
                        {item.trigger.condition}
                      </span>
                    </div>

                    {/* Metric 2: Last check */}
                    <div className="min-w-[100px]">
                      <span className="text-[10px] uppercase font-semibold text-text-muted block">
                        Last check
                      </span>
                      <span className="font-semibold text-text-secondary">
                        {item.lastCheck}
                      </span>
                    </div>

                    {/* Metric 3: Actions sequence */}
                    <div className="min-w-[90px]">
                      <span className="text-[10px] uppercase font-semibold text-text-muted block">
                        Actions
                      </span>
                      <span className="font-semibold text-text-primary">
                        {item.actionsCount} steps
                      </span>
                    </div>

                    {/* Metric 4: Runs count */}
                    <div className="min-w-[80px]">
                      <span className="text-[10px] uppercase font-semibold text-text-muted block">
                        Runs
                      </span>
                      <span className="font-semibold text-text-primary">
                        {item.runsCount}
                      </span>
                    </div>

                    {/* Metric 5: Success rate */}
                    <div className="min-w-[90px]">
                      <span className="text-[10px] uppercase font-semibold text-text-muted block">
                        Success rate
                      </span>
                      <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                        {item.successRate > 0 ? (
                          <>
                            <TrendingUp className="size-3.5" />
                            <span>{item.successRate}%</span>
                          </>
                        ) : (
                          <span className="text-text-muted font-normal">—</span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons: Pause/Resume + Delete */}
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {/* 1-Click Pause / Resume Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleStatus(item.id, e)}
                        title={item.status === 'active' ? 'Pause Automation' : 'Resume Automation'}
                        className="p-1.5 rounded-lg border border-border bg-surface-subtle hover:bg-surface-hover text-text-muted hover:text-brand transition-colors cursor-pointer"
                      >
                        {item.status === 'active' ? (
                          <Pause className="size-3.5 text-warning" />
                        ) : (
                          <Play className="size-3.5 text-success fill-success" />
                        )}
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAutomationToDelete(item);
                        }}
                        title="Delete Automation"
                        className="p-1.5 rounded-lg border border-border bg-surface-subtle hover:bg-rose-500/10 hover:border-rose-500/30 text-text-muted hover:text-danger transition-colors cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>

                    <ChevronRight className="size-4 text-text-muted group-hover:text-brand group-hover:translate-x-0.5 transition-all hidden xl:block" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* ── Delete Confirmation Modal ───────────────────────────────────── */}
        {automationToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-surface border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-danger shrink-0">
                  <Trash2 className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-primary">
                    Delete Automation
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    Are you sure you want to delete &quot;{automationToDelete.title}&quot;?
                  </p>
                </div>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed bg-surface-subtle p-3 rounded-xl border border-border">
                This action will permanently delete this automation rule, stop all background monitoring, and remove its workflow configuration.
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAutomationToDelete(null)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    handleDeleteAutomation(automationToDelete.id);
                    setAutomationToDelete(null);
                  }}
                  className="text-xs gap-1.5"
                >
                  <Trash2 className="size-3.5" />
                  <span>Delete Automation</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppPage>
  );
}
