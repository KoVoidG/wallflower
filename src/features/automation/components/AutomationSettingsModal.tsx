// src/features/automation/components/AutomationSettingsModal.tsx
'use client';

import { useState } from 'react';
import { X, Settings2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import type { AutomationRule } from '../types/automation.types';

interface AutomationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  automation: AutomationRule;
  onSave: (updated: Partial<AutomationRule>) => void;
}

export function AutomationSettingsModal({
  isOpen,
  onClose,
  automation,
  onSave,
}: AutomationSettingsModalProps) {
  const [title, setTitle] = useState(automation.title);
  const [description, setDescription] = useState(automation.description);
  const [category, setCategory] = useState(automation.category);
  const [connectedSystem, setConnectedSystem] = useState(automation.connectedSystem);
  const [autoRun, setAutoRun] = useState(automation.runtimeSettings.autoRunOnTrigger);
  const [stopOnError, setStopOnError] = useState(automation.runtimeSettings.stopOnError);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      title,
      description,
      category,
      connectedSystem,
      runtimeSettings: {
        ...automation.runtimeSettings,
        autoRunOnTrigger: autoRun,
        stopOnError,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-surface border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
              <Settings2 className="size-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">
                Automation Settings
              </h3>
              <p className="text-xs text-text-muted">
                Configure workflow metadata and execution parameters.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Settings Form */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-text-primary mb-1">
              Automation Name / Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface-subtle border border-border rounded-xl px-3.5 py-2 text-xs text-text-primary font-bold focus:outline-none focus:border-brand"
            />
          </div>

          <div>
            <label className="block font-semibold text-text-muted mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-surface-subtle border border-border rounded-xl p-2.5 text-xs text-text-primary focus:outline-none focus:border-brand resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-text-primary mb-1">
                Category
              </label>
              <Select
                value={category}
                onChange={setCategory}
                options={[
                  { value: 'Finance & Liquidity', label: 'Finance & Liquidity' },
                  { value: 'Inventory & Supply Chain', label: 'Inventory & Supply Chain' },
                  { value: 'Accounts Payable', label: 'Accounts Payable' },
                  { value: 'Operations & Throughput', label: 'Operations & Throughput' },
                  { value: 'Executive Reporting', label: 'Executive Reporting' },
                  { value: 'Receivables & Collections', label: 'Receivables & Collections' },
                ]}
                className="text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-primary mb-1">
                Connected Integration
              </label>
              <input
                type="text"
                value={connectedSystem}
                onChange={(e) => setConnectedSystem(e.target.value)}
                className="w-full bg-surface-subtle border border-border rounded-xl px-3.5 py-2 text-xs text-text-primary focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          {/* Runtime toggles */}
          <div className="p-3.5 rounded-xl bg-surface-subtle border border-border space-y-3">
            <span className="font-bold text-text-primary uppercase tracking-wider text-[10px] block">
              Runtime Governance
            </span>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-text-primary block">
                  Automatic Trigger Dispatch
                </span>
                <span className="text-text-muted text-[11px]">
                  Run full pipeline when trigger conditions are met.
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoRun}
                onChange={(e) => setAutoRun(e.target.checked)}
                className="size-4 accent-brand cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <div>
                <span className="font-semibold text-text-primary block">
                  Halt Pipeline on Error
                </span>
                <span className="text-text-muted text-[11px]">
                  Stop downstream actions if a validation step fails.
                </span>
              </div>
              <input
                type="checkbox"
                checked={stopOnError}
                onChange={(e) => setStopOnError(e.target.checked)}
                className="size-4 accent-brand cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            className="text-xs gap-1.5"
          >
            <Save className="size-3.5" />
            <span>Save Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
