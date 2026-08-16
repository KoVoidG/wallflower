// src/features/automation/components/CreateAutomationModal.tsx
'use client';

import { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import type { AutomationRule, ActionType } from '../types/automation.types';

interface CreateAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newRule: AutomationRule) => void;
}

export function CreateAutomationModal({
  isOpen,
  onClose,
  onCreate,
}: CreateAutomationModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Finance & Liquidity');

  const [triggerType, setTriggerType] = useState('Threshold Trigger');
  const [triggerMetric, setTriggerMetric] = useState('Cash Runway');
  const [triggerOperator, setTriggerOperator] = useState('is less than');
  const [triggerValue, setTriggerValue] = useState('3');
  const [triggerUnit, setTriggerUnit] = useState('months');
  const [frequency, setFrequency] = useState('Every 4 hours');

  const [actionsList, setActionsList] = useState<
    { id: string; name: string; type: ActionType; detail: string; iconName: string }[]
  >([
    {
      id: 'act-1',
      name: 'Send Notification',
      type: 'notification',
      detail: 'Email + In-app Alert',
      iconName: 'Bell',
    },
    {
      id: 'act-2',
      name: 'Run Simulation',
      type: 'simulation',
      detail: 'Cash Triage Analysis',
      iconName: 'GitPullRequest',
    },
    {
      id: 'act-3',
      name: 'Create Action Item',
      type: 'task',
      detail: 'Add to Action Plan',
      iconName: 'CheckSquare',
    },
  ]);

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [autoRun, setAutoRun] = useState(true);
  const [timeoutMs, setTimeoutMs] = useState(15000);
  const [retryAttempts, setRetryAttempts] = useState(3);
  const [stopOnError, setStopOnError] = useState(true);

  if (!isOpen) return null;

  const handleAddAction = () => {
    const newId = `act-${Date.now()}`;
    setActionsList((prev) => [
      ...prev,
      {
        id: newId,
        name: 'AI Risk Analysis (Capybot)',
        type: 'llm',
        detail: 'Capybot analyzes data and recommends levers',
        iconName: 'Bot',
      },
    ]);
  };

  const handleRemoveAction = (id: string) => {
    setActionsList((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const conditionText = `${triggerMetric} ${triggerOperator === 'is less than' ? '<' : '>'} ${triggerValue} ${triggerUnit}`;

    const newRule: AutomationRule = {
      id: `custom-${Date.now()}`,
      title: name.trim(),
      description: description.trim() || 'Custom monitoring automation rule.',
      category,
      status: 'active',
      executionStatus: 'idle',
      trigger: {
        name: `${triggerMetric} ${triggerOperator} ${triggerValue} ${triggerUnit}`,
        condition: conditionText,
        conditionDescription: `When ${triggerMetric.toLowerCase()} ${triggerOperator} ${triggerValue} ${triggerUnit}.`,
        frequency,
        type: triggerType,
      },
      connectedSystem: 'Live System Integration',
      actionsCount: actionsList.length,
      runsCount: 0,
      successRate: 100,
      lastCheck: 'Just created',
      iconName: 'Zap',
      actionItems: actionsList.map((a) => ({
        id: a.id,
        name: a.name,
        description: a.detail,
        type: a.type,
        duration: '~10 sec',
        iconName: a.iconName,
      })),
      steps: actionsList.map((a) => ({
        name: a.name,
        type: a.type,
        duration: 1000,
        logMsgs: [`Executing action: ${a.name}...`, `Completed step successfully.`],
      })),
      history: [],
      runtimeSettings: {
        autoRunOnTrigger: autoRun,
        timeoutMs,
        retryAttempts,
        stopOnError,
      },
      tags: ['custom', 'automated'],
    };

    onCreate(newRule);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-surface dark:bg-[#0E131F] border border-border/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/80 sticky top-0 bg-surface/95 dark:bg-[#0E131F]/95 backdrop-blur-sm z-10">
          <div>
            <div className="text-xs font-semibold text-text-muted flex items-center gap-1.5 mb-1">
              <span>Automation</span>
              <span>&gt;</span>
              <span className="text-text-primary">Create New</span>
            </div>
            <h2 className="text-lg font-bold text-text-primary">
              Create New Automation
            </h2>
            <p className="text-xs text-text-muted">
              Define when Wallflower should act and what actions to take.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-subtle transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
          {/* Section 1: Basic Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-brand uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center text-[10px]">
                1
              </span>
              <span>Basic Information</span>
            </div>

            <div className="space-y-3 pl-7">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
                  Automation Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., High Expense Alert"
                  className="w-full bg-surface-subtle border border-border/80 rounded-xl px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this automation monitor and do?"
                  className="w-full bg-surface-subtle border border-border/80 rounded-xl px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
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
            </div>
          </div>

          {/* Section 2: When (Trigger) */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <div className="flex items-center gap-2 text-xs font-bold text-brand uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center text-[10px]">
                2
              </span>
              <span>When (Trigger)</span>
            </div>

            <div className="space-y-3 pl-7">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
                  Trigger Type
                </label>
                <Select
                  value={triggerType}
                  onChange={setTriggerType}
                  options={[
                    { value: 'Threshold Trigger', label: 'Threshold Trigger' },
                    { value: 'Schedule / Cron', label: 'Schedule / Cron' },
                    { value: 'Queue Backlog Monitor', label: 'Queue Backlog Monitor' },
                    { value: 'Event Hook', label: 'Event Hook' },
                  ]}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
                  Conditions
                </label>
                <div className="p-3 rounded-xl bg-surface-subtle border border-border/80 flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-brand">IF</span>
                  <div className="w-40">
                    <Select
                      value={triggerMetric}
                      onChange={setTriggerMetric}
                      options={[
                        { value: 'Cash Runway', label: 'Cash Runway' },
                        { value: 'Slow-moving Stock', label: 'Slow-moving Stock' },
                        { value: 'Invoice Backlog', label: 'Invoice Backlog' },
                        { value: 'Dept Utilization', label: 'Dept Utilization' },
                      ]}
                      className="text-xs"
                    />
                  </div>

                  <div className="w-36">
                    <Select
                      value={triggerOperator}
                      onChange={setTriggerOperator}
                      options={[
                        { value: 'is less than', label: 'is less than' },
                        { value: 'is greater than', label: 'is greater than' },
                      ]}
                      className="text-xs"
                    />
                  </div>

                  <input
                    type="number"
                    value={triggerValue}
                    onChange={(e) => setTriggerValue(e.target.value)}
                    className="w-16 bg-surface border border-border rounded-lg px-2.5 py-2 text-xs text-text-primary focus:outline-none text-center"
                  />

                  <div className="w-28">
                    <Select
                      value={triggerUnit}
                      onChange={setTriggerUnit}
                      options={[
                        { value: 'months', label: 'months' },
                        { value: '%', label: '%' },
                        { value: 'items', label: 'items' },
                        { value: 'days', label: 'days' },
                      ]}
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
                  Check Frequency
                </label>
                <Select
                  value={frequency}
                  onChange={setFrequency}
                  options={[
                    { value: 'Every 15 mins', label: 'Every 15 mins' },
                    { value: 'Every 40 mins', label: 'Every 40 mins' },
                    { value: 'Every 2 hours', label: 'Every 2 hours' },
                    { value: 'Every 4 hours', label: 'Every 4 hours' },
                    { value: 'Daily (08:00 AM)', label: 'Daily (08:00 AM)' },
                    { value: 'Weekly (Mon 09:00)', label: 'Weekly (Mon 09:00)' },
                  ]}
                  className="text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 3: What Wallflower Will Do (Actions) */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-brand uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>What Wallflower Will Do (Actions)</span>
              </div>
              <button
                type="button"
                onClick={handleAddAction}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>Add Action</span>
              </button>
            </div>

            <div className="space-y-2 pl-7">
              {actionsList.map((action, idx) => (
                <div
                  key={action.id}
                  className="p-3 rounded-xl bg-surface-subtle border border-border/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-surface border border-border/80 flex items-center justify-center font-bold text-[10px] text-text-muted">
                      {idx + 1}
                    </span>
                    <div className="truncate">
                      <p className="font-semibold text-text-primary">{action.name}</p>
                      <p className="text-[11px] text-text-muted">{action.detail}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAction(action.id)}
                    className="p-1 text-text-muted hover:text-danger rounded-md transition-colors cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Advanced Settings (Optional) */}
          <div className="pt-2 border-t border-border/60">
            <button
              type="button"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="flex items-center justify-between w-full text-xs font-bold text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-surface-subtle text-text-muted flex items-center justify-center text-[10px]">
                  4
                </span>
                <span>Advanced Settings (Optional)</span>
              </div>
              {isAdvancedOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>

            {isAdvancedOpen && (
              <div className="mt-3 pl-7 space-y-3 text-xs">
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-surface-subtle border border-border/60 cursor-pointer">
                  <span>Auto-run on trigger</span>
                  <input
                    type="checkbox"
                    checked={autoRun}
                    onChange={(e) => setAutoRun(e.target.checked)}
                    className="accent-brand rounded"
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">
                      Timeout (ms)
                    </label>
                    <input
                      type="number"
                      value={timeoutMs}
                      onChange={(e) => setTimeoutMs(Number(e.target.value))}
                      className="w-full bg-surface-subtle border border-border/80 rounded-xl px-3 py-1.5 text-xs text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">
                      Retry Attempts
                    </label>
                    <input
                      type="number"
                      value={retryAttempts}
                      onChange={(e) => setRetryAttempts(Number(e.target.value))}
                      className="w-full bg-surface-subtle border border-border/80 rounded-xl px-3 py-1.5 text-xs text-text-primary"
                    />
                  </div>
                </div>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-surface-subtle border border-border/60 cursor-pointer">
                  <span>Stop pipeline on error</span>
                  <input
                    type="checkbox"
                    checked={stopOnError}
                    onChange={(e) => setStopOnError(e.target.checked)}
                    className="accent-brand rounded"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/80">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="text-xs"
            >
              Create Automation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
