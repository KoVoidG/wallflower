// src/features/simulations/components/scenario-library-view.tsx
'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import {
  Tag,
  Users,
  Box,
  ShoppingBag,
  Sparkles,
  Search,
  LayoutGrid,
  List,
  Eye,
  Scale,
  Plus,
  CheckCircle2,
  Clock,
  Activity,
  Workflow,
  PlusCircle,
  Wrench,
  Store,
} from 'lucide-react';
import { NewScenarioModal, type StartingTemplate } from './new-scenario-modal';
import { FadeInView } from '@/components/motion';
import {
  useSimulationHistory,
  type SavedSimulationRun,
} from '../engine/simulation-history-store';
import type { SimulationResult, BottleneckResult } from '@/lib/liquiflow-types';

export interface ScenarioItem {
  id: string;
  type?: 'what_if' | 'bottleneck';
  name: string;
  strategyTag: string;
  goal: string;
  status: 'Simulated' | 'Draft' | 'Archived';
  healthScore?: number;
  lastSimulated: string;
  riskLevel?: 'Low' | 'Medium' | 'High';
  confidence?: number;
  icon: typeof Tag;
  templateId?: string;
  whatIfResult?: SimulationResult;
  bottleneckResult?: BottleneckResult;
  inputValues?: Record<string, number | string>;
}

function getScenarioIcon(scen: Partial<SavedSimulationRun>): typeof Tag {
  if (scen.type === 'bottleneck') return Activity;
  const t = (scen.templateId || scen.name || '').toLowerCase();
  if (t.includes('price')) return Tag;
  if (t.includes('hire') || t.includes('sales')) return Users;
  if (t.includes('inventory')) return Box;
  if (t.includes('cost') || t.includes('supplier')) return ShoppingBag;
  if (t.includes('holiday') || t.includes('promo')) return Sparkles;
  if (t.includes('equipment')) return Wrench;
  if (t.includes('branch')) return Store;
  if (t.includes('custom') || t.includes('blank')) return PlusCircle;
  return Workflow;
}

interface ScenarioLibraryViewProps {
  onOpenScenario: (scenario: ScenarioItem) => void;
  onCompareScenario: (scenario: ScenarioItem) => void;
}

export function ScenarioLibraryView({
  onOpenScenario,
  onCompareScenario,
}: ScenarioLibraryViewProps) {
  const { history, saveRun } = useSimulationHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [strategyFilter, setStrategyFilter] = useState('All Strategies');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Convert saved runs from persistent store into scenario items
  const scenariosList: ScenarioItem[] = useMemo(() => {
    return history.map((h) => ({
      id: h.id,
      type: h.type,
      name: h.name,
      strategyTag: h.strategyTag,
      goal: h.goal,
      status: h.status,
      healthScore: h.healthScore,
      lastSimulated: h.lastSimulated,
      riskLevel: h.riskLevel,
      confidence: h.confidence,
      icon: getScenarioIcon(h),
      templateId: h.templateId,
      whatIfResult: h.whatIfResult,
      bottleneckResult: h.bottleneckResult,
      inputValues: h.inputValues,
    }));
  }, [history]);

  const handleSelectTemplate = (template: StartingTemplate) => {
    const newRun = saveRun({
      id: `scen-${Date.now()}`,
      type: 'what_if',
      name: template.title,
      templateId: template.id,
      strategyTag: template.strategyTag || 'New Strategy',
      goal: template.goal || 'Simulate financial impact',
      status: 'Draft',
      lastSimulated: 'Just now',
    });

    setIsModalOpen(false);
    onOpenScenario({
      id: newRun.id,
      type: 'what_if',
      name: newRun.name,
      strategyTag: newRun.strategyTag,
      goal: newRun.goal,
      status: newRun.status,
      lastSimulated: newRun.lastSimulated,
      icon: getScenarioIcon(newRun),
      templateId: newRun.templateId,
    });
  };

  const filteredScenarios = scenariosList.filter((scen) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (
        !scen.name.toLowerCase().includes(q) &&
        !scen.goal.toLowerCase().includes(q) &&
        !scen.strategyTag.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (
      strategyFilter !== 'All Strategies' &&
      scen.strategyTag !== strategyFilter
    ) {
      return false;
    }
    if (statusFilter !== 'All Status' && scen.status !== statusFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* ── 1. Search, Filter & View Mode Toolbar ─────────────────────────── */}
      <FadeInView offset={10}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-sm dark:shadow-black/20">
          <div className="relative flex-1 max-w-md">
            <Search className="size-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search simulations (What-If, Bottleneck, Scenarios)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-[#F8FAFC] dark:bg-[#0B0F17] border border-slate-200/80 dark:border-[#1E2638] text-[#0F172A] dark:text-white placeholder:text-[#94A3B8] focus:outline-hidden focus:border-[#6366F1] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-44">
              <Select
                value={strategyFilter}
                onChange={setStrategyFilter}
                options={[
                  { value: 'All Strategies', label: 'All Categories' },
                  { value: 'Pricing Strategy', label: 'Pricing Strategy' },
                  { value: 'People Security', label: 'People Security' },
                  { value: 'Operations Research', label: 'Operations Research' },
                  { value: 'Cost Efficiency', label: 'Cost Efficiency' },
                  { value: 'Marketing Strategy', label: 'Marketing Strategy' },
                  { value: 'Inventory Strategy', label: 'Inventory Strategy' },
                  { value: 'Expansion Strategy', label: 'Expansion Strategy' },
                  { value: 'Custom Strategy', label: 'Custom Strategy' },
                ]}
              />
            </div>

            <div className="w-36">
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: 'All Status', label: 'All Status' },
                  { value: 'Simulated', label: 'Simulated' },
                  { value: 'Draft', label: 'Draft' },
                ]}
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#1E2638] border border-slate-200/80 dark:border-[#2A344A]">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-1.5 rounded-lg transition-all cursor-pointer',
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-[#111622] text-[#6366F1] dark:text-[#A5B4FC] shadow-2xs'
                    : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white',
                )}
                title="Grid View"
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-1.5 rounded-lg transition-all cursor-pointer',
                  viewMode === 'list'
                    ? 'bg-white dark:bg-[#111622] text-[#6366F1] dark:text-[#A5B4FC] shadow-2xs'
                    : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white',
                )}
                title="List View"
              >
                <List className="size-4" />
              </button>
            </div>

            {/* Start Simulation Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6366F1] text-white hover:bg-[#4F46E5] text-sm font-semibold transition-all cursor-pointer shadow-md shadow-indigo-500/20 active:scale-95"
            >
              <Plus className="size-4" />
              <span>New Simulation</span>
            </button>
          </div>
        </div>
      </FadeInView>

      {/* ── 2. Grid View ──────────────────────────────────────────────────── */}
      {viewMode === 'grid' && (
        <FadeInView offset={12}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredScenarios.map((scen) => {
              const Icon = scen.icon;
              const isSimulated = scen.status === 'Simulated';
              const isBottleneck = scen.type === 'bottleneck';

              return (
                <Card
                  key={scen.id}
                  onClick={() => onOpenScenario(scen)}
                  className="group flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-md dark:shadow-black/40 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-black/60 hover:-translate-y-1 hover:border-[#6366F1]/50 transition-all duration-200 space-y-4 cursor-pointer"
                >
                  {/* Card Header: Icon, Title, Strategy Tag & Status */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn(
                          'size-9 rounded-xl border flex items-center justify-center shrink-0 transition-all',
                          isBottleneck
                            ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                            : 'bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white border-slate-200 dark:border-[#2A344A] group-hover:bg-[#6366F1]/10 dark:group-hover:bg-[#6366F1]/20 group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:border-[#6366F1]/40',
                        )}>
                          <Icon className="size-4.5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-display text-sm sm:text-base font-bold text-[#0F172A] dark:text-white leading-snug truncate group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] transition-colors">
                            {scen.name}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {isBottleneck && (
                              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                Bottleneck
                              </span>
                            )}
                            <p className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8] truncate">
                              {scen.strategyTag}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border shrink-0 inline-flex items-center gap-1.5',
                          isSimulated
                            ? 'bg-purple-50 dark:bg-purple-950/50 text-[#6366F1] dark:text-[#A5B4FC] border-purple-200 dark:border-purple-800/60 shadow-2xs'
                            : 'bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800/60',
                        )}
                      >
                        {isSimulated ? (
                          <span className="size-1.5 rounded-full bg-[#8B5CF6] shrink-0" />
                        ) : (
                          <Clock className="size-3 shrink-0" />
                        )}
                        <span>{scen.status}</span>
                      </span>
                    </div>

                    {/* Goal & Timestamp */}
                    <div className="space-y-1 text-xs">
                      <p className="text-[#64748B] dark:text-[#94A3B8] text-[11px]">
                        Goal:{' '}
                        <span className="font-semibold text-[#0F172A] dark:text-white">
                          {scen.goal}
                        </span>
                      </p>
                      <p className="text-[#64748B] dark:text-[#94A3B8] text-[11px] font-mono">
                        {isSimulated ? 'Simulated: ' : 'Saved: '}
                        <span className="font-medium text-[#0F172A] dark:text-white">
                          {scen.lastSimulated}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Metrics Strip */}
                  <div className="p-3 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <span className="text-[10px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider block mb-1">
                        Health Score
                      </span>
                      {isSimulated ? (
                        <span className="font-mono text-xs font-bold text-[#0F172A] dark:text-white inline-flex items-center gap-1">
                          <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                          {scen.healthScore || 82}
                        </span>
                      ) : (
                        <span className="text-[#94A3B8] font-mono">—</span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider block mb-1">
                        Risk Level
                      </span>
                      {isSimulated ? (
                        <span className="font-sans text-xs font-semibold text-[#0F172A] dark:text-white inline-flex items-center gap-1">
                          <span
                            className={cn(
                              'size-2 rounded-full',
                              scen.riskLevel === 'Low' && 'bg-emerald-500',
                              scen.riskLevel === 'Medium' && 'bg-amber-500',
                              scen.riskLevel === 'High' && 'bg-rose-500',
                              !scen.riskLevel && 'bg-emerald-500',
                            )}
                          />
                          {scen.riskLevel || 'Low'}
                        </span>
                      ) : (
                        <span className="text-[#94A3B8] font-mono">—</span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider block mb-1">
                        Confidence
                      </span>
                      {isSimulated ? (
                        <span className="font-mono text-xs font-bold text-[#0F172A] dark:text-white">
                          {scen.confidence || 90}%
                        </span>
                      ) : (
                        <span className="text-[#94A3B8] font-mono">—</span>
                      )}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div
                    className="pt-2 border-t border-slate-100 dark:border-[#1E2638] flex items-center justify-between gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => onOpenScenario(scen)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#4F46E5] dark:text-[#A5B4FC] bg-[#6366F1]/5 dark:bg-[#6366F1]/10 hover:bg-[#6366F1]/10 dark:hover:bg-[#6366F1]/20 border border-[#6366F1]/20 transition-colors cursor-pointer"
                    >
                      <Eye className="size-3.5" />
                      <span>View Results</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onCompareScenario(scen)}
                      className="inline-flex items-center justify-center p-2 rounded-xl text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white bg-slate-50 dark:bg-[#1E2638] hover:bg-slate-100 dark:hover:bg-[#2A344A] border border-slate-200/80 dark:border-[#2A344A] transition-colors cursor-pointer"
                      title="Compare simulation"
                    >
                      <Scale className="size-3.5" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </FadeInView>
      )}

      {/* ── 3. List View ──────────────────────────────────────────────────── */}
      {viewMode === 'list' && (
        <FadeInView offset={12}>
          <div className="rounded-2xl border border-slate-100 dark:border-[#1E2638] bg-white dark:bg-[#111622] shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-[#1E2638]">
            {filteredScenarios.map((scen) => {
              const Icon = scen.icon;
              const isSimulated = scen.status === 'Simulated';
              const isBottleneck = scen.type === 'bottleneck';

              return (
                <div
                  key={scen.id}
                  onClick={() => onOpenScenario(scen)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-slate-50/70 dark:hover:bg-[#161D2E] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={cn(
                      'size-10 rounded-xl border flex items-center justify-center shrink-0',
                      isBottleneck
                        ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                        : 'bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white border-slate-200 dark:border-[#2A344A]',
                    )}>
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#0F172A] dark:text-white truncate">
                          {scen.name}
                        </h4>
                        {isBottleneck && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
                            Bottleneck
                          </span>
                        )}
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full text-[10px] font-bold border',
                            isSimulated
                              ? 'bg-purple-50 dark:bg-purple-950/50 text-[#6366F1] dark:text-[#A5B4FC] border-purple-200 dark:border-purple-800/60'
                              : 'bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800/60',
                          )}
                        >
                          {scen.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] dark:text-[#94A3B8] truncate mt-0.5">
                        {scen.strategyTag} · Goal: {scen.goal} · {scen.lastSimulated}
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-3 self-end sm:self-center shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isSimulated && (
                      <div className="flex items-center gap-4 text-xs font-mono pr-2">
                        <span>Score: <strong className="text-[#0F172A] dark:text-white">{scen.healthScore || 82}</strong></span>
                        <span>Confidence: <strong className="text-[#0F172A] dark:text-white">{scen.confidence || 90}%</strong></span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => onOpenScenario(scen)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#4F46E5] dark:text-[#A5B4FC] bg-[#6366F1]/5 dark:bg-[#6366F1]/10 hover:bg-[#6366F1]/15 border border-[#6366F1]/20 transition-colors cursor-pointer"
                    >
                      View Results
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeInView>
      )}

      {/* New Scenario Modal */}
      <NewScenarioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}
