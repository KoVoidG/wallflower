'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Eye,
  Scale,
  MoreVertical,
  CheckCircle2,
  TrendingUp,
  Tag,
  Megaphone,
  Users,
  Box,
  Store,
} from 'lucide-react';
import { NewScenarioModal, type StartingTemplate } from './new-scenario-modal';

export interface ScenarioItem {
  id: string;
  name: string;
  strategyTag: string;
  status: 'Simulated' | 'Draft' | 'Archived';
  goal: string;
  lastSimulated: string;
  healthScore?: number;
  riskLevel?: 'Low' | 'Medium' | 'High';
  confidence?: number;
  icon: React.ComponentType<{ className?: string }>;
}

export const INITIAL_SCENARIOS: ScenarioItem[] = [
  {
    id: 'scen_baseline',
    name: 'Current Baseline',
    strategyTag: 'Baseline',
    status: 'Simulated',
    goal: 'Continued current position',
    lastSimulated: 'Today, 09:42 AM',
    healthScore: 76,
    riskLevel: 'Medium',
    confidence: 88,
    icon: TrendingUp,
  },
  {
    id: 'scen_price',
    name: 'Price Increase +5%',
    strategyTag: 'Pricing Increase',
    status: 'Simulated',
    goal: 'Increase profit margin',
    lastSimulated: 'Today, 10:15 AM',
    healthScore: 84,
    riskLevel: 'Low',
    confidence: 91,
    icon: Tag,
  },
  {
    id: 'scen_promo',
    name: 'Holiday Promotion',
    strategyTag: 'Marketing Strategy',
    status: 'Simulated',
    goal: 'Boost revenue during holidays',
    lastSimulated: 'Wednesday, 04:21 PM',
    healthScore: 72,
    riskLevel: 'Medium',
    confidence: 85,
    icon: Megaphone,
  },
  {
    id: 'scen_hire',
    name: 'Hire 1 Sales Associate',
    strategyTag: 'People Security',
    status: 'Simulated',
    goal: 'Increase sales capacity',
    lastSimulated: '3 days ago',
    healthScore: 76,
    riskLevel: 'Medium',
    confidence: 82,
    icon: Users,
  },
  {
    id: 'scen_inventory',
    name: 'Expand Inventory +20%',
    strategyTag: 'Inventory Strategy',
    status: 'Draft',
    goal: 'Reduce stockouts',
    lastSimulated: 'Today, 09:11 AM',
    icon: Box,
  },
  {
    id: 'scen_branch',
    name: 'Open New Branch',
    strategyTag: 'Expansion Strategy',
    status: 'Draft',
    goal: 'Increase market presence',
    lastSimulated: '3 days ago',
    icon: Store,
  },
];

interface ScenarioLibraryViewProps {
  onOpenScenario: (scenario: ScenarioItem) => void;
  onCompareScenario: (scenario: ScenarioItem) => void;
}

export function ScenarioLibraryView({ onOpenScenario, onCompareScenario }: ScenarioLibraryViewProps) {
  const [scenarios, setScenarios] = useState<ScenarioItem[]>(INITIAL_SCENARIOS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [sortBy, setSortBy] = useState('Last Updated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectTemplate = (template: StartingTemplate) => {
    const newScen: ScenarioItem = {
      id: `scen_${Date.now()}`,
      name: template.title,
      strategyTag: template.strategyTag,
      status: 'Draft',
      goal: template.goal,
      lastSimulated: 'Just now',
      icon: template.icon,
    };

    setScenarios((prev) => [newScen, ...prev]);
    onOpenScenario(newScen);
  };

  const filteredScenarios = useMemo(() => {
    return scenarios
      .filter((s) => {
        // Search filter
        const matchSearch =
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.goal.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.strategyTag.toLowerCase().includes(searchQuery.toLowerCase());

        // Status filter
        const matchStatus =
          statusFilter === 'All Status' || s.status.toLowerCase() === statusFilter.toLowerCase();

        // Type filter
        const matchType =
          typeFilter === 'All Types' || s.strategyTag.toLowerCase().includes(typeFilter.toLowerCase());

        return matchSearch && matchStatus && matchType;
      })
      .sort((a, b) => {
        if (sortBy === 'Highest Health') return (b.healthScore || 0) - (a.healthScore || 0);
        if (sortBy === 'Lowest Risk') {
          const riskRank = { Low: 1, Medium: 2, High: 3 };
          return (riskRank[a.riskLevel || 'High'] || 3) - (riskRank[b.riskLevel || 'High'] || 3);
        }
        if (sortBy === 'Alphabetical') return a.name.localeCompare(b.name);
        return 0; // Default Last Updated
      });
  }, [scenarios, searchQuery, statusFilter, typeFilter, sortBy]);

  return (
    <div className="space-y-6">
      {/* ── 1. Control & Filter Bar ────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl border border-border-strong bg-surface shadow-2xs">
        {/* Left Side: + New Scenario & Search Input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-bold gap-2 cursor-pointer bg-tertiary hover:bg-tertiary-hover text-on-primary shrink-0 shadow-2xs"
          >
            <Plus className="size-4" />
            <span>New Scenario</span>
          </Button>

          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search scenarios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-surface text-xs text-text-primary focus:outline-hidden focus:border-tertiary font-medium placeholder:text-text-muted"
            />
          </div>
        </div>

        {/* Right Side: Filters, Sort, and View Mode Switcher */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Status Filter */}
          <div className="w-32">
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'All Status', label: 'All Status' },
                { value: 'Simulated', label: 'Simulated' },
                { value: 'Draft', label: 'Draft' },
                { value: 'Archived', label: 'Archived' },
              ]}
            />
          </div>

          {/* Type Filter */}
          <div className="w-36">
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              options={[
                { value: 'All Types', label: 'All Types' },
                { value: 'Pricing', label: 'Pricing Increase' },
                { value: 'Marketing', label: 'Marketing Strategy' },
                { value: 'People', label: 'People Security' },
                { value: 'Inventory', label: 'Inventory Strategy' },
                { value: 'Expansion', label: 'Expansion Strategy' },
                { value: 'Baseline', label: 'Baseline' },
              ]}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="w-36">
            <Select
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: 'Last Updated', label: 'Last Updated' },
                { value: 'Highest Health', label: 'Highest Health' },
                { value: 'Lowest Risk', label: 'Lowest Risk' },
                { value: 'Alphabetical', label: 'Alphabetical' },
              ]}
            />
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center p-1 border border-border rounded-lg bg-surface-subtle shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-1.5 rounded-md text-xs transition-colors cursor-pointer',
                viewMode === 'grid'
                  ? 'bg-surface text-tertiary font-bold shadow-2xs'
                  : 'text-text-muted hover:text-text-primary'
              )}
              title="Grid View (Detailed Cards)"
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={cn(
                'p-1.5 rounded-md text-xs transition-colors cursor-pointer',
                viewMode === 'list'
                  ? 'bg-surface text-tertiary font-bold shadow-2xs'
                  : 'text-text-muted hover:text-text-primary'
              )}
              title="List View (Line by Line)"
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Grid View (Square Detailed Cards Matching Screenshot) ───────── */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {filteredScenarios.map((scen) => {
            const Icon = scen.icon;
            const isSimulated = scen.status === 'Simulated';

            return (
              <Card
                key={scen.id}
                className={cn(
                  'group flex flex-col justify-between p-5 border-border-strong bg-surface',
                  'transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md hover:border-tertiary/50 space-y-4'
                )}
              >
                {/* Card Header: Icon, Title, Strategy Tag & Status */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 rounded-xl bg-surface-hover text-text-primary border border-border/80 shadow-2xs shrink-0">
                        <Icon className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-display text-sm font-bold text-text-primary leading-snug truncate">
                          {scen.name}
                        </h3>
                        <p className="text-[11px] font-medium text-text-muted truncate">
                          {scen.strategyTag}
                        </p>
                      </div>
                    </div>

                    <span
                      className={cn(
                        'px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide border shrink-0',
                        isSimulated
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30'
                      )}
                    >
                      {scen.status}
                    </span>
                  </div>

                  {/* Goal & Timestamp */}
                  <div className="space-y-1 text-xs">
                    <p className="text-text-muted text-[11px]">
                      Goal:{' '}
                      <span className="font-semibold text-text-primary">
                        {scen.goal}
                      </span>
                    </p>
                    <p className="text-text-muted text-[11px]">
                      {isSimulated ? 'Last Simulated: ' : 'Last Modified: '}
                      <span className="font-medium text-text-secondary">
                        {scen.lastSimulated}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Metrics Strip */}
                <div className="p-3 rounded-xl border border-border/60 bg-surface-subtle/40 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
                      Health Score
                    </span>
                    {isSimulated ? (
                      <span className="font-mono text-xs font-bold text-text-primary inline-flex items-center gap-1">
                        <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                        {scen.healthScore}
                      </span>
                    ) : (
                      <span className="text-text-muted font-mono">—</span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
                      Risk Level
                    </span>
                    {isSimulated ? (
                      <span className="font-sans text-xs font-semibold text-text-primary inline-flex items-center gap-1">
                        <span
                          className={cn(
                            'size-2 rounded-full',
                            scen.riskLevel === 'Low' && 'bg-emerald-500',
                            scen.riskLevel === 'Medium' && 'bg-amber-500',
                            scen.riskLevel === 'High' && 'bg-rose-500'
                          )}
                        />
                        {scen.riskLevel}
                      </span>
                    ) : (
                      <span className="text-text-muted font-mono">—</span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
                      Confidence
                    </span>
                    {isSimulated ? (
                      <span className="font-mono text-xs font-bold text-text-primary">
                        {scen.confidence}%
                      </span>
                    ) : (
                      <span className="text-text-muted font-mono">—</span>
                    )}
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onOpenScenario(scen)}
                      className="text-xs font-medium gap-1.5 text-text-secondary hover:text-text-primary cursor-pointer h-8 px-2.5"
                    >
                      <Eye className="size-3.5" />
                      <span>Open</span>
                    </Button>

                    {isSimulated && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onCompareScenario(scen)}
                        className="text-xs font-medium gap-1.5 text-text-secondary hover:text-text-primary cursor-pointer h-8 px-2.5"
                      >
                        <Scale className="size-3.5" />
                        <span>Compare</span>
                      </Button>
                    )}
                  </div>

                  <button
                    type="button"
                    className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
                    title="More actions"
                  >
                    <MoreVertical className="size-4" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── 3. List View (Line by Line Compact View) ──────────────────────── */}
      {viewMode === 'list' && (
        <Card className="border-border-strong overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle text-text-muted border-b border-border/80 text-[11px] font-semibold">
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
              <tbody className="divide-y divide-border/40 font-sans">
                {filteredScenarios.map((scen) => {
                  const Icon = scen.icon;
                  const isSimulated = scen.status === 'Simulated';

                  return (
                    <tr key={scen.id} className="hover:bg-surface-hover/50 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-surface-hover text-text-primary border border-border/80 shadow-2xs shrink-0">
                            <Icon className="size-4" />
                          </div>
                          <div>
                            <p className="font-bold text-text-primary">{scen.name}</p>
                            <p className="text-[11px] text-text-muted">{scen.strategyTag}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide border inline-block',
                            isSimulated
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                              : 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30'
                          )}
                        >
                          {scen.status}
                        </span>
                      </td>

                      <td className="p-3.5 text-text-secondary font-medium">{scen.goal}</td>
                      <td className="p-3.5 text-text-muted font-mono">{scen.lastSimulated}</td>

                      <td className="p-3.5 text-center font-mono font-bold text-text-primary">
                        {isSimulated ? (
                          <span className="inline-flex items-center gap-1">
                            <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                            {scen.healthScore}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>

                      <td className="p-3.5 text-center font-semibold text-text-primary">
                        {isSimulated ? (
                          <span className="inline-flex items-center gap-1">
                            <span
                              className={cn(
                                'size-2 rounded-full',
                                scen.riskLevel === 'Low' && 'bg-emerald-500',
                                scen.riskLevel === 'Medium' && 'bg-amber-500',
                                scen.riskLevel === 'High' && 'bg-rose-500'
                              )}
                            />
                            {scen.riskLevel}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>

                      <td className="p-3.5 text-center font-mono font-bold text-text-primary">
                        {isSimulated ? `${scen.confidence}%` : '—'}
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onOpenScenario(scen)}
                            className="text-xs h-7 px-2 cursor-pointer"
                          >
                            <Eye className="size-3" />
                            <span>Open</span>
                          </Button>
                          {isSimulated && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => onCompareScenario(scen)}
                              className="text-xs h-7 px-2 cursor-pointer"
                            >
                              <Scale className="size-3" />
                              <span>Compare</span>
                            </Button>
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
