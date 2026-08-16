// src/features/automation/components/NodeInspector.tsx
'use client';

import {
  Split,
  ShieldAlert,
  Bot,
  Bell,
  LineChart,
  Copy,
  Trash2,
  SlidersHorizontal,
  Package,
  Activity,
  Zap,
  Clock,
  Play,
  FileText,
  CheckSquare,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import type { WorkflowNodeData } from '../types/automation.types';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldAlert,
  SlidersHorizontal,
  FileText,
  Activity,
  LineChart,
  Bot,
  GitPullRequest: Activity,
  Bell,
  CheckSquare,
  Zap,
  Clock,
  Package,
  Split,
  Play,
};

interface NodeInspectorProps {
  nodeData: WorkflowNodeData | null;
  onUpdateNodeData: (updated: Partial<WorkflowNodeData>) => void;
  onDuplicateNode?: () => void;
  onDeleteNode?: () => void;
}

export function NodeInspector({
  nodeData,
  onUpdateNodeData,
  onDuplicateNode,
  onDeleteNode,
}: NodeInspectorProps) {
  if (!nodeData) {
    return (
      <Card className="p-6 shadow-2xs border-border bg-surface text-center space-y-3">
        <div className="w-10 h-10 rounded-2xl bg-surface-subtle border border-border flex items-center justify-center text-text-muted mx-auto">
          <SlidersHorizontal className="size-5" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
            No Node Selected
          </h3>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            Click any block on the canvas to configure its trigger logic, parameters, and action targets.
          </p>
        </div>
      </Card>
    );
  }

  const name = nodeData.name || '';
  const description = nodeData.description || '';
  const config = nodeData.config || {};
  const Icon = ICON_MAP[nodeData.iconName] || Bot;

  const handleConfigChange = (key: string, value: unknown) => {
    const updatedConfig = { ...config, [key]: value };
    onUpdateNodeData({
      config: updatedConfig,
    });
  };

  return (
    <Card className="p-5 shadow-2xs border-border bg-surface space-y-4">
      {/* Inspector Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0">
            <Icon className="size-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-text-primary leading-tight truncate">
              {name || 'Selected Block'}
            </h3>
            <span className="text-xs font-semibold text-brand dark:text-purple-400 capitalize">
              {nodeData.category} Configuration
            </span>
          </div>
        </div>

        {/* Quick Node Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onDuplicateNode && (
            <button
              type="button"
              onClick={onDuplicateNode}
              title="Duplicate Node"
              className="p-1.5 rounded-lg border border-border bg-surface-subtle hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            >
              <Copy className="size-3.5" />
            </button>
          )}

          {onDeleteNode && (
            <button
              type="button"
              onClick={onDeleteNode}
              title="Delete Node"
              className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Basic Node Metadata */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1.5">
            Node Label / Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              onUpdateNodeData({ name: e.target.value });
            }}
            className="w-full bg-surface-subtle border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-brand transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              onUpdateNodeData({ description: e.target.value });
            }}
            rows={2}
            className="w-full bg-surface-subtle border border-border rounded-xl p-2.5 text-xs text-text-primary focus:outline-none focus:border-brand resize-none transition-colors"
          />
        </div>
      </div>

      {/* ── Dynamic Category Specific Controls ───────────────────────────────── */}
      <div className="space-y-3.5 pt-3 border-t border-border">
        {/* 1. Trigger Node Config */}
        {nodeData.category === 'trigger' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Trigger Criteria
            </h4>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Trigger Metric
              </label>
              <Select
                value={config.metric || 'Cash Runway'}
                onChange={(val) => handleConfigChange('metric', val)}
                options={[
                  { value: 'Cash Runway', label: 'Cash Runway (Months)' },
                  { value: 'Deadstock Holding Days', label: 'Deadstock Holding Days' },
                  { value: 'AP Overdue Invoices', label: 'AP Overdue Invoices' },
                  { value: 'Department Queue Depth', label: 'Department Queue Depth' },
                  { value: 'Receivables Overdue Days', label: 'Receivables Overdue Days' },
                ]}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                  Operator
                </label>
                <Select
                  value={config.operator || 'is less than'}
                  onChange={(val) => handleConfigChange('operator', val)}
                  options={[
                    { value: 'is less than', label: '< Less than' },
                    { value: 'is greater than', label: '> Greater than' },
                    { value: 'equals', label: '= Equals' },
                    { value: 'exceeds threshold', label: 'Exceeds limit' },
                  ]}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                  Threshold Value
                </label>
                <input
                  type="text"
                  value={config.value || '3.0'}
                  onChange={(e) => handleConfigChange('value', e.target.value)}
                  className="w-full bg-surface-subtle border border-border rounded-xl px-3 py-2 text-xs text-text-primary font-bold focus:outline-none focus:border-brand"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Evaluation Frequency
              </label>
              <Select
                value={config.frequency || 'Every 4 hours'}
                onChange={(val) => handleConfigChange('frequency', val)}
                options={[
                  { value: 'Continuous', label: 'Real-time Continuous' },
                  { value: 'Every 15 minutes', label: 'Every 15 minutes' },
                  { value: 'Every 4 hours', label: 'Every 4 hours' },
                  { value: 'Daily (9:00 AM)', label: 'Daily (9:00 AM)' },
                  { value: 'Weekly', label: 'Weekly' },
                ]}
                className="text-xs"
              />
            </div>
          </div>
        )}

        {/* 2. Logic / If-Else Node Config */}
        {nodeData.category === 'logic' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Next Step Routing
            </h4>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Branch Logic Mode
              </label>
              <Select
                value={config.logicType || 'if_else'}
                onChange={(val) => handleConfigChange('logicType', val)}
                options={[
                  { value: 'if_else', label: 'If / Else (Conditional Branch)' },
                  { value: 'condition', label: 'Sequential Filter' },
                  { value: 'wait', label: 'Timed Delay' },
                ]}
                className="text-xs"
              />
            </div>

            {/* True Branch */}
            <div className="p-3 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="size-2 rounded-full bg-emerald-500" />
                True (Condition Met)
              </span>
              <Select
                value={config.trueAction || 'Analyze Cash Position'}
                onChange={(val) => handleConfigChange('trueAction', val)}
                options={[
                  { value: 'Analyze Cash Position', label: 'Analyze Cash Position' },
                  { value: 'Capybot AI Analysis', label: 'Capybot AI Analysis' },
                  { value: 'Run Simulation', label: 'Run Simulation' },
                  { value: 'Send Notification', label: 'Send Notification' },
                ]}
                className="text-xs"
              />
            </div>

            {/* False Branch */}
            <div className="p-3 rounded-xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 space-y-1.5">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                <span className="size-2 rounded-full bg-rose-500" />
                False (Else Fallback)
              </span>
              <Select
                value={config.falseAction || 'Stop and log (Bypass execution)'}
                onChange={(val) => handleConfigChange('falseAction', val)}
                options={[
                  { value: 'Stop and log (Bypass execution)', label: 'Stop and log (Bypass)' },
                  { value: 'Send low-priority digest', label: 'Send low-priority digest' },
                ]}
                className="text-xs"
              />
            </div>
          </div>
        )}

        {/* 3. Analysis / AI Node Config */}
        {nodeData.category === 'analysis' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Analysis & AI Reasoning
            </h4>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Analysis Mode
              </label>
              <Select
                value={config.analysisType || 'capybot'}
                onChange={(val) => handleConfigChange('analysisType', val)}
                options={[
                  { value: 'capybot', label: 'Capybot AI Synthesis' },
                  { value: 'metric', label: 'Financial Metric Calculation' },
                  { value: 'risk', label: 'Cross-Departmental Risk Scan' },
                  { value: 'simulation', label: 'Sandbox What-If Simulation' },
                ]}
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Reasoning Objective / Purpose
              </label>
              <textarea
                value={config.purpose || ''}
                onChange={(e) => handleConfigChange('purpose', e.target.value)}
                rows={2}
                placeholder="What should the AI analyze or compute?"
                className="w-full bg-surface-subtle border border-border rounded-xl p-2.5 text-xs text-text-primary focus:outline-none focus:border-brand resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Structured Output Format
              </label>
              <input
                type="text"
                value={config.output || ''}
                onChange={(e) => handleConfigChange('output', e.target.value)}
                placeholder="e.g., Structured mitigation levers & recommendations"
                className="w-full bg-surface-subtle border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-brand"
              />
            </div>
          </div>
        )}

        {/* 4. Action Node Config */}
        {nodeData.category === 'action' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Action & Dispatch Settings
            </h4>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Action Type
              </label>
              <Select
                value={config.actionType || 'notification'}
                onChange={(val) => handleConfigChange('actionType', val)}
                options={[
                  { value: 'notification', label: 'Send Notification / Alert' },
                  { value: 'action_item', label: 'Create Kanban Action Item' },
                  { value: 'update_record', label: 'Update ERP / Database Record' },
                  { value: 'run_workflow', label: 'Trigger Sub-Workflow' },
                ]}
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Notification Channel
              </label>
              <Select
                value={config.channel || 'In-App + Email Digest'}
                onChange={(val) => handleConfigChange('channel', val)}
                options={[
                  { value: 'In-App + Email Digest', label: 'In-App + Email Digest' },
                  { value: 'In-App Alert Only', label: 'In-App Alert Only' },
                  { value: 'Email Alert', label: 'Email Alert' },
                  { value: 'Slack Webhook', label: 'Slack Webhook' },
                ]}
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Target Stakeholders / Recipients
              </label>
              <input
                type="text"
                value={config.recipients || ''}
                onChange={(e) => handleConfigChange('recipients', e.target.value)}
                placeholder="e.g., Business Owner / Finance Team"
                className="w-full bg-surface-subtle border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-brand"
              />
            </div>
          </div>
        )}

        {/* 5. Data Node Config */}
        {nodeData.category === 'data' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Connected Data Source
            </h4>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Data Domain
              </label>
              <Select
                value={config.dataSource || 'financial'}
                onChange={(val) => handleConfigChange('dataSource', val)}
                options={[
                  { value: 'financial', label: 'Financial Ledger & Cash Stream' },
                  { value: 'inventory', label: 'Warehouse & SKU Database' },
                  { value: 'operations', label: 'Operations Throughput Queue' },
                ]}
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1.5">
                Query Expression / Fields
              </label>
              <textarea
                value={config.query || ''}
                onChange={(e) => handleConfigChange('query', e.target.value)}
                rows={2}
                className="w-full bg-surface-subtle border border-border rounded-xl p-2.5 text-xs font-mono text-text-primary focus:outline-none focus:border-brand resize-none"
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
