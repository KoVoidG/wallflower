// src/features/automation/components/NodeLibraryDrawer.tsx
'use client';

import { useState } from 'react';
import {
  X,
  Search,
  Zap,
  ShieldAlert,
  SlidersHorizontal,
  FileText,
  Activity,
  LineChart,
  Bot,
  GitPullRequest,
  Bell,
  CheckSquare,
  Clock,
  Package,
  Split,
  Play,
} from 'lucide-react';
import {
  NODE_LIBRARY_PRESETS,
  type NodeLibraryItem,
  type NodeCategory,
} from '../types/automation.types';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldAlert,
  SlidersHorizontal,
  FileText,
  Activity,
  LineChart,
  Bot,
  GitPullRequest,
  Bell,
  CheckSquare,
  Zap,
  Clock,
  Package,
  Split,
  Play,
};

interface NodeLibraryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNodeItem: (item: NodeLibraryItem) => void;
}

export function NodeLibraryDrawer({
  isOpen,
  onClose,
  onSelectNodeItem,
}: NodeLibraryDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categoryColorMap: Record<NodeCategory, { bg: string; text: string; border: string }> = {
    trigger: {
      bg: 'bg-purple-500/10 dark:bg-purple-500/20',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-500/30',
    },
    analysis: {
      bg: 'bg-blue-500/10 dark:bg-blue-500/20',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-500/30',
    },
    logic: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-500/30',
    },
    action: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-500/30',
    },
    data: {
      bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-500/30',
    },
    terminate: {
      bg: 'bg-rose-500/10 dark:bg-rose-500/20',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-500/30',
    },
  };

  const filteredCategories = NODE_LIBRARY_PRESETS.map((group) => {
    const items = group.items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || selectedCategory === group.category;
      return matchesSearch && matchesCategory;
    });

    return { ...group, items };
  }).filter((group) => group.items.length > 0);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-stretch justify-end bg-black/50 backdrop-blur-xs transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop click to dismiss */}
      <div className="flex-1 cursor-pointer" onClick={onClose} />

      {/* Drawer Panel: Smooth Slide In & Out */}
      <div
        className={`w-full max-w-md bg-surface border-l border-border shadow-2xl flex flex-col h-full transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-text-primary">
              Node Library
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Click a block to add it to your workflow canvas.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Search & Category Pills */}
        <div className="p-4 border-b border-border space-y-3 bg-surface-subtle">
          <div className="relative">
            <Search className="size-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search triggers, analysis, logic, actions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand transition-colors"
            />
          </div>

          {/* Quick Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
            {[
              { id: 'all', label: 'All Blocks' },
              { id: 'trigger', label: 'Triggers' },
              { id: 'analysis', label: 'Analysis' },
              { id: 'logic', label: 'Logic' },
              { id: 'action', label: 'Actions' },
              { id: 'data', label: 'Data' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-brand text-white shadow-2xs'
                    : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Drawer Body: Categorized Node List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {filteredCategories.map((group) => (
            <div key={group.category} className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-text-muted uppercase tracking-wider text-[10px]">
                  {group.label}
                </span>
                <span className="text-[10px] text-text-muted font-mono">
                  {group.items.length} options
                </span>
              </div>

              <div className="space-y-2">
                {group.items.map((item) => {
                  const Icon = ICON_MAP[item.iconName] || Zap;
                  const theme = categoryColorMap[item.category];

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        onSelectNodeItem(item);
                        onClose();
                      }}
                      className="group p-3 rounded-xl border border-border bg-surface hover:border-brand/40 hover:bg-surface-subtle transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs flex items-start gap-3 hover:-translate-y-0.5"
                    >
                      <div
                        className={`w-9 h-9 rounded-xl ${theme.bg} ${theme.border} border flex items-center justify-center ${theme.text} shrink-0 group-hover:scale-105 transition-transform mt-0.5`}
                      >
                        <Icon className="size-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-text-primary group-hover:text-brand transition-colors truncate">
                            {item.name}
                          </h4>
                          <span
                            className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-md ${theme.bg} ${theme.text}`}
                          >
                            {item.category}
                          </span>
                        </div>

                        <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="text-center py-12 text-xs text-text-muted space-y-2">
              <Search className="size-6 mx-auto text-text-muted/60" />
              <p>No nodes found matching &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
