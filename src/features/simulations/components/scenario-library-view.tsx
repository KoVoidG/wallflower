// src/features/simulations/components/scenario-library-view.tsx
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import {
  Tag,
  Users,
  Box,
  Truck,
  Sparkles,
  Search,
  LayoutGrid,
  List,
  Eye,
  Scale,
  MoreVertical,
  Plus,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { NewScenarioModal, type StartingTemplate } from './new-scenario-modal';
import { FadeInView } from '@/components/motion';

export interface ScenarioItem {
  id: string;
  name: string;
  strategyTag: string;
  goal: string;
  status: 'Simulated' | 'Draft' | 'Archived';
  healthScore?: number;
  lastSimulated: string;
  riskLevel?: 'Low' | 'Medium' | 'High';
  confidence?: number;
  icon: typeof Tag;
}

const SAMPLE_SCENARIOS: ScenarioItem[] = [
  {
    id: 'scen-1',
    name: 'Price Increase +5%',
    strategyTag: 'Pricing Strategy',
    goal: 'Increase profit margin by 3%',
    status: 'Simulated',
    healthScore: 84,
    lastSimulated: 'Today, 09:42 AM',
    riskLevel: 'Low',
    confidence: 91,
    icon: Tag,
  },
  {
    id: 'scen-2',
    name: 'Hire 1 Sales Associate',
    strategyTag: 'Staffing Plan',
    goal: 'Expand customer capacity',
    status: 'Simulated',
    healthScore: 82,
    lastSimulated: 'Today, 10:15 AM',
    riskLevel: 'Low',
    confidence: 87,
    icon: Users,
  },
  {
    id: 'scen-3',
    name: 'Expand Inventory +20%',
    strategyTag: 'Inventory Management',
    goal: 'Meet holiday peak demand',
    status: 'Simulated',
    healthScore: 81,
    lastSimulated: 'Wednesday, 04:21 PM',
    riskLevel: 'Medium',
    confidence: 82,
    icon: Box,
  },
  {
    id: 'scen-4',
    name: 'Switch Supplier for Beverage',
    strategyTag: 'Cost Optimization',
    goal: 'Reduce COGS by 4%',
    status: 'Simulated',
    healthScore: 83,
    lastSimulated: '3 days ago',
    riskLevel: 'Low',
    confidence: 89,
    icon: Truck,
  },
  {
    id: 'scen-5',
    name: 'Launch Loyalty Program',
    strategyTag: 'Marketing Strategy',
    goal: 'Improve repeat customer rate',
    status: 'Draft',
    lastSimulated: 'Today, 09:11 AM',
    icon: Sparkles,
  },
  {
    id: 'scen-6',
    name: 'Open New Branch in District 2',
    strategyTag: 'Business Expansion',
    goal: 'Scale regional footprint',
    status: 'Draft',
    lastSimulated: '3 days ago',
    icon: Users,
  },
];

interface ScenarioLibraryViewProps {
  onOpenScenario: (scenario: ScenarioItem) => void;
  onCompareScenario: (scenario: ScenarioItem) => void;
}

export function ScenarioLibraryView({
  onOpenScenario,
  onCompareScenario,
}: ScenarioLibraryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [strategyFilter, setStrategyFilter] = useState('All Strategies');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [sortBy, setSortBy] = useState('Recently Simulated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scenariosList, setScenariosList] =
    useState<ScenarioItem[]>(SAMPLE_SCENARIOS);

  const handleSelectTemplate = (template: StartingTemplate) => {
    const newScen: ScenarioItem = {
      id: `scen-${Date.now()}`,
      name: template.title,
      strategyTag: template.strategyTag || 'New Strategy',
      goal: template.goal || 'Simulate financial impact',
      status: 'Draft',
      lastSimulated: 'Just now',
      icon: Tag,
    };
    setScenariosList([newScen, ...scenariosList]);
    setIsModalOpen(false);
    onOpenScenario(newScen);
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
              placeholder="Search scenarios by name, goal, strategy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B0F17] border border-slate-200/80 dark:border-[#1E2638] text-[#0F172A] dark:text-white placeholder:text-[#94A3B8] focus:outline-hidden focus:border-[#6366F1] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-40">
              <Select
                value={strategyFilter}
                onChange={setStrategyFilter}
                options={[
                  { value: 'All Strategies', label: 'All Strategies' },
                  { value: 'Pricing Strategy', label: 'Pricing Strategy' },
                  { value: 'Staffing Plan', label: 'Staffing Plan' },
                  {
                    value: 'Inventory Management',
                    label: 'Inventory Management',
                  },
                  { value: 'Cost Optimization', label: 'Cost Optimization' },
                  { value: 'Marketing Strategy', label: 'Marketing Strategy' },
                  { value: 'Business Expansion', label: 'Business Expansion' },
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

            <div className="w-44">
              <Select
                value={sortBy}
                onChange={setSortBy}
                options={[
                  {
                    value: 'Recently Simulated',
                    label: 'Recently Simulated',
                  },
                  { value: 'Highest Health Score', label: 'Highest Health' },
                  { value: 'Lowest Risk', label: 'Lowest Risk' },
                ]}
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-[#F8FAFC] dark:bg-[#0B0F17] border border-slate-200/80 dark:border-[#1E2638]">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-1.5 rounded-lg transition-all cursor-pointer',
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-[#1E2638] text-[#0F172A] dark:text-white shadow-xs'
                    : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white',
                )}
                title="Grid view"
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-1.5 rounded-lg transition-all cursor-pointer',
                  viewMode === 'list'
                    ? 'bg-white dark:bg-[#1E2638] text-[#0F172A] dark:text-white shadow-xs'
                    : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white',
                )}
                title="List view"
              >
                <List className="size-4" />
              </button>
            </div>

            {/* New Scenario Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs font-bold shadow-md shadow-indigo-500/25 hover:opacity-95 hover:scale-105 active:scale-95 cursor-pointer transition-all shrink-0"
            >
              <Plus className="size-4" />
              <span>New Scenario</span>
            </button>
          </div>
        </div>
      </FadeInView>

      {/* ── 2. Grid View ─────────────────────────────────────────────────── */}
      {viewMode === 'grid' && (
        <FadeInView offset={12}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredScenarios.map((scen) => {
              const Icon = scen.icon;
              const isSimulated = scen.status === 'Simulated';

              return (
                <Card
                  key={scen.id}
                  className="group flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-md dark:shadow-black/40 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-black/60 hover:-translate-y-1 hover:border-[#6366F1]/50 transition-all duration-200 space-y-4"
                >
                  {/* Card Header: Icon, Title, Strategy Tag & Status */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="size-9 rounded-xl bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white border border-slate-200 dark:border-[#2A344A] flex items-center justify-center shrink-0 group-hover:bg-[#6366F1]/10 dark:group-hover:bg-[#6366F1]/20 group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:border-[#6366F1]/40 transition-all">
                          <Icon className="size-4.5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-display text-sm sm:text-base font-bold text-[#0F172A] dark:text-white leading-snug truncate group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] transition-colors">
                            {scen.name}
                          </h3>
                          <p className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8] truncate">
                            {scen.strategyTag}
                          </p>
                        </div>
                      </div>

                      {/* Purple "Simulated" Badge */}
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
                        {isSimulated ? 'Last Simulated: ' : 'Last Modified: '}
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
                          {scen.healthScore}
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
                            )}
                          />
                          {scen.riskLevel}
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
                          {scen.confidence}%
                        </span>
                      ) : (
                        <span className="text-[#94A3B8] font-mono">—</span>
                      )}
                    </div>
                  </div>

                  {/* Footer Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 dark:border-[#1E2638] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenScenario(scen)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-white dark:bg-[#111622] text-xs font-semibold text-[#0F172A] dark:text-white hover:bg-slate-50 dark:hover:bg-[#1E2638] cursor-pointer shadow-xs transition-colors"
                      >
                        <Eye className="size-3.5 text-[#64748B] dark:text-[#94A3B8]" />
                        <span>Open</span>
                      </button>

                      {isSimulated && (
                        <button
                          type="button"
                          onClick={() => onCompareScenario(scen)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-white dark:bg-[#111622] text-xs font-semibold text-[#0F172A] dark:text-white hover:bg-slate-50 dark:hover:bg-[#1E2638] cursor-pointer shadow-xs transition-colors"
                        >
                          <Scale className="size-3.5 text-[#64748B] dark:text-[#94A3B8]" />
                          <span>Compare</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      className="p-1.5 rounded-xl text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E2638] transition-colors cursor-pointer"
                      title="More actions"
                    >
                      <MoreVertical className="size-4" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </FadeInView>
      )}

      {/* ── 3. List View ─────────────────────────────────────────────────── */}
      {viewMode === 'list' && (
        <FadeInView offset={12}>
          <Card className="rounded-2xl border-slate-100 dark:border-[#1E2638] bg-white dark:bg-[#111622] overflow-hidden shadow-md dark:shadow-black/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] dark:bg-[#0B0F17] text-[#64748B] dark:text-[#94A3B8] border-b border-slate-100 dark:border-[#1E2638] text-[11px] font-semibold">
                  <tr>
                    <th className="p-3.5">Scenario</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Goal</th>
                    <th className="p-3.5">Last Updated</th>
                    <th className="p-3.5 text-center">Health Score</th>
                    <th className="p-3.5 text-center">Risk Level</th>
                    <th className="p-3.5 text-center">Confidence</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#1E2638]">
                  {filteredScenarios.map((scen) => {
                    const Icon = scen.icon;
                    const isSimulated = scen.status === 'Simulated';

                    return (
                      <tr
                        key={scen.id}
                        className="group hover:bg-slate-50 dark:hover:bg-[#1E2638]/40 transition-colors"
                      >
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white border border-slate-200 dark:border-[#2A344A] flex items-center justify-center shrink-0 group-hover:bg-[#6366F1]/10 dark:group-hover:bg-[#6366F1]/20 group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] group-hover:border-[#6366F1]/40 transition-all">
                              <Icon className="size-4" />
                            </div>
                            <div>
                              <p className="font-bold text-[#0F172A] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] transition-colors">
                                {scen.name}
                              </p>
                              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                                {scen.strategyTag}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span
                            className={cn(
                              'px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border inline-flex items-center gap-1.5',
                              isSimulated
                                ? 'bg-purple-50 dark:bg-purple-950/50 text-[#6366F1] dark:text-[#A5B4FC] border-purple-200 dark:border-purple-800/60 shadow-2xs'
                                : 'bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800/60',
                            )}
                          >
                            {isSimulated && (
                              <span className="size-1.5 rounded-full bg-[#8B5CF6] shrink-0" />
                            )}
                            <span>{scen.status}</span>
                          </span>
                        </td>

                        <td className="p-3.5 text-[#64748B] dark:text-[#94A3B8] font-medium">
                          {scen.goal}
                        </td>
                        <td className="p-3.5 text-[#64748B] dark:text-[#94A3B8] font-mono">
                          {scen.lastSimulated}
                        </td>

                        <td className="p-3.5 text-center font-mono font-bold text-[#0F172A] dark:text-white">
                          {isSimulated ? (
                            <span className="inline-flex items-center gap-1">
                              <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                              {scen.healthScore}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>

                        <td className="p-3.5 text-center font-semibold text-[#0F172A] dark:text-white">
                          {isSimulated ? (
                            <span className="inline-flex items-center gap-1">
                              <span
                                className={cn(
                                  'size-2 rounded-full',
                                  scen.riskLevel === 'Low' && 'bg-emerald-500',
                                  scen.riskLevel === 'Medium' && 'bg-amber-500',
                                  scen.riskLevel === 'High' && 'bg-rose-500',
                                )}
                              />
                              {scen.riskLevel}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>

                        <td className="p-3.5 text-center font-mono font-bold text-[#0F172A] dark:text-white">
                          {isSimulated ? `${scen.confidence}%` : '—'}
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => onOpenScenario(scen)}
                              className="px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-[#1E2638] bg-white dark:bg-[#111622] text-xs font-semibold text-[#0F172A] dark:text-white hover:bg-slate-50 dark:hover:bg-[#1E2638] cursor-pointer shadow-xs transition-colors"
                            >
                              Open
                            </button>
                            {isSimulated && (
                              <button
                                type="button"
                                onClick={() => onCompareScenario(scen)}
                                className="px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-[#1E2638] bg-white dark:bg-[#111622] text-xs font-semibold text-[#0F172A] dark:text-white hover:bg-slate-50 dark:hover:bg-[#1E2638] cursor-pointer shadow-xs transition-colors"
                              >
                                Compare
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </FadeInView>
      )}

      {/* ── 4. New Scenario Template Selection Modal ──────────────────────── */}
      <NewScenarioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}
