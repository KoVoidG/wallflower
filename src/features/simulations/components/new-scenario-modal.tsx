'use client';

import { cn } from '@/lib/utils';
import {
  X,
  Tag,
  Users,
  ShoppingBag,
  Megaphone,
  Wrench,
  Box,
  Store,
  PlusCircle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export interface StartingTemplate {
  id: string;
  title: string;
  strategyTag: string;
  description: string;
  goal: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const STARTING_TEMPLATES: StartingTemplate[] = [
  {
    id: 'price_increase',
    title: 'Price Increase +5%',
    strategyTag: 'Pricing Strategy',
    description: 'Evaluate the profit impact of increasing average product prices while maintaining volume.',
    goal: 'Increase profit margin',
    icon: Tag,
  },
  {
    id: 'hire_employee',
    title: 'Hire 1 Sales Associate',
    strategyTag: 'People Security',
    description: 'Assess total payroll expansion versus projected sales growth from extra staff.',
    goal: 'Increase sales capacity',
    icon: Users,
  },
  {
    id: 'cost_reduction',
    title: 'Reduce Supplier Cost',
    strategyTag: 'Cost Efficiency',
    description: 'Model vendor discounts and cost-of-goods reductions on net profit & cash runway.',
    goal: 'Lower operating expense',
    icon: ShoppingBag,
  },
  {
    id: 'holiday_promo',
    title: 'Holiday Promotion',
    strategyTag: 'Marketing Strategy',
    description: 'Simulate short-term marketing spend boost and seasonal revenue surges.',
    goal: 'Boost revenue during holidays',
    icon: Megaphone,
  },
  {
    id: 'equipment_purchase',
    title: 'Purchase Equipment',
    strategyTag: 'Capital Investment',
    description: 'Analyze upfront capital expenditure versus operational efficiency gains.',
    goal: 'Expand production capacity',
    icon: Wrench,
  },
  {
    id: 'inventory_expansion',
    title: 'Expand Inventory +20%',
    strategyTag: 'Inventory Strategy',
    description: 'Assess carrying costs and holding risk against higher stock availability.',
    goal: 'Prevent stockouts',
    icon: Box,
  },
  {
    id: 'new_branch',
    title: 'Open New Branch',
    strategyTag: 'Expansion Strategy',
    description: 'Simulate multi-location expansion, initial setup costs, and runway requirements.',
    goal: 'Increase market presence',
    icon: Store,
  },
  {
    id: 'blank_scenario',
    title: 'Blank Custom Scenario',
    strategyTag: 'Custom Strategy',
    description: 'Start from a clean slate with fully customizable revenue, price, and cost sliders.',
    goal: 'Custom business objective',
    icon: PlusCircle,
  },
];

interface NewScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: StartingTemplate) => void;
}

export function NewScenarioModal({ isOpen, onClose, onSelectTemplate }: NewScenarioModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-3xl bg-surface border border-border-strong rounded-2xl shadow-xl p-6 space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-surface-hover text-text-primary border border-border/80 shadow-2xs">
              <Sparkles className="size-5 text-tertiary" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-text-primary">
                Choose Starting Template
              </h2>
              <p className="text-xs text-text-secondary">
                Select a baseline template or start with a custom blank scenario.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {STARTING_TEMPLATES.map((tpl) => {
            const Icon = tpl.icon;
            return (
              <div
                key={tpl.id}
                onClick={() => {
                  onSelectTemplate(tpl);
                  onClose();
                }}
                className={cn(
                  'group flex flex-col justify-between p-4 rounded-xl border border-border-strong bg-surface',
                  'hover:border-tertiary/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer space-y-3'
                )}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-surface-hover text-text-primary border border-border/80 shadow-2xs shrink-0">
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-xs font-bold text-text-primary truncate">
                        {tpl.title}
                      </h3>
                      <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
                        {tpl.strategyTag}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                    {tpl.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-text-muted">
                  <span className="truncate">Goal: <strong className="text-text-primary font-medium">{tpl.goal}</strong></span>
                  <ChevronRight className="size-4 text-text-secondary group-hover:translate-x-0.5 transition-transform shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
