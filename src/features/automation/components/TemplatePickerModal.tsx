// src/features/automation/components/TemplatePickerModal.tsx
'use client';

import {
  X,
  Sparkles,
  ShieldAlert,
  SlidersHorizontal,
  FileText,
  Activity,
  Zap,
  Mail,
  Megaphone,
  ChevronRight,
  PlusCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
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

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: AutomationRule) => void;
  onSelectBlank?: () => void;
}

export function TemplatePickerModal({
  isOpen,
  onClose,
  onSelectTemplate,
  onSelectBlank,
}: TemplatePickerModalProps) {
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
              <Sparkles className="size-5 text-brand" />
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
          {INITIAL_AUTOMATIONS_DATA.map((template) => {
            const Icon = (template.iconName && ICON_MAP[template.iconName]) || Zap;

            return (
              <div
                key={template.id}
                onClick={() => {
                  onSelectTemplate(template);
                  onClose();
                }}
                className={cn(
                  'group flex flex-col justify-between p-4 rounded-xl border border-border-strong bg-surface',
                  'hover:border-brand/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer space-y-3'
                )}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-surface-hover text-text-primary border border-border/80 shadow-2xs shrink-0 group-hover:bg-brand/10 group-hover:text-brand transition-colors">
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-xs font-bold text-text-primary group-hover:text-brand transition-colors truncate">
                        {template.title}
                      </h3>
                      <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
                        {template.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                    {template.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-text-muted">
                  <span className="truncate">
                    Trigger: <strong className="text-text-primary font-medium">{template.trigger.condition}</strong>
                  </span>
                  <ChevronRight className="size-4 text-text-secondary group-hover:text-brand group-hover:translate-x-0.5 transition-transform shrink-0" />
                </div>
              </div>
            );
          })}

          {/* Blank Custom Automation Card */}
          <div
            onClick={() => {
              if (onSelectBlank) {
                onSelectBlank();
              }
              onClose();
            }}
            className={cn(
              'group flex flex-col justify-between p-4 rounded-xl border border-border-strong bg-surface',
              'hover:border-brand/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer space-y-3'
            )}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-surface-hover text-text-primary border border-border/80 shadow-2xs shrink-0 group-hover:bg-brand/10 group-hover:text-brand transition-colors">
                  <PlusCircle className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-xs font-bold text-text-primary group-hover:text-brand transition-colors truncate">
                    Blank Custom Automation
                  </h3>
                  <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
                    CUSTOM STRATEGY
                  </span>
                </div>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                Start from a clean slate with fully customizable triggers, AI reasoning, logic branches, and action blocks.
              </p>
            </div>

            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-text-muted">
              <span className="truncate">
                Goal: <strong className="text-text-primary font-medium">Build custom workflow</strong>
              </span>
              <ChevronRight className="size-4 text-text-secondary group-hover:text-brand group-hover:translate-x-0.5 transition-transform shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
