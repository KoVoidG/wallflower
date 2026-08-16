// src/features/automation/components/AutomationWorkflowCanvas.tsx
'use client';

import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type Connection,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  Zap,
  Bot,
  GitPullRequest,
  Bell,
  CheckSquare,
  LineChart,
  SlidersHorizontal,
  FileText,
  Activity,
  Package,
  Mail,
  Megaphone,
  ShieldAlert,
  CheckCircle2,
  Loader2,
  Circle,
  Split,
  Plus,
  Sparkles,
  Hand,
  Layers,
  Clock,
  Play,
} from 'lucide-react';
import type {
  WorkflowNodeData,
  ExecutionStatus,
} from '../types/automation.types';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldAlert,
  SlidersHorizontal,
  FileText,
  Activity,
  Package,
  Mail,
  Megaphone,
  LineChart,
  Bot,
  GitPullRequest,
  Bell,
  CheckSquare,
  Zap,
  Clock,
  Split,
  Play,
};

// ── 1. Custom Trigger Node ───────────────────────────────────────────────────
function CustomTriggerNode({
  data,
  selected,
}: {
  data: WorkflowNodeData;
  selected?: boolean;
}) {
  const Icon = ICON_MAP[data.iconName] || Zap;

  return (
    <div
      className={`w-72 rounded-2xl border-2 transition-all p-4 shadow-sm bg-surface cursor-grab active:cursor-grabbing ${
        selected
          ? 'border-purple-500 ring-4 ring-purple-500/10 shadow-lg'
          : 'border-purple-500/40 hover:border-purple-500/80'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Icon className="size-3.5" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-purple-600 dark:text-purple-400">
            Trigger
          </span>
        </div>
        <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
          {data.config?.triggerType || 'Threshold'}
        </span>
      </div>

      <h4 className="text-xs font-bold text-text-primary mb-1">
        {data.name || 'Condition Trigger'}
      </h4>
      <p className="text-[11px] text-text-primary font-mono bg-surface-subtle p-2 rounded-lg border border-border leading-relaxed">
        {data.config?.condition || data.description || 'Condition criteria'}
      </p>

      <div className="flex items-center justify-between mt-3 text-[10px] text-text-muted">
        <span>Schedule:</span>
        <span className="font-semibold text-text-secondary">
          {data.config?.frequency || 'Continuous'}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3! h-3! bg-purple-500! border-2! border-surface!"
      />
    </div>
  );
}

// ── 2. Custom Logic / Decision Node ─────────────────────────────────────────
function CustomDecisionNode({
  data,
  selected,
}: {
  data: WorkflowNodeData;
  selected?: boolean;
}) {
  const Icon = ICON_MAP[data.iconName] || Split;

  return (
    <div
      className={`w-72 rounded-2xl border-2 transition-all p-4 shadow-sm bg-surface cursor-grab active:cursor-grabbing ${
        selected
          ? 'border-amber-500 ring-4 ring-amber-500/10 shadow-lg'
          : 'border-amber-500/40 hover:border-amber-500/80'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3! h-3! bg-amber-500! border-2! border-surface!"
      />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Icon className="size-3.5" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400">
            Logic Branch
          </span>
        </div>
        <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
          {data.config?.logicType || 'If / Else'}
        </span>
      </div>

      <h4 className="text-xs font-bold text-text-primary mb-1">
        {data.name || 'Validate Threshold'}
      </h4>
      <p className="text-[11px] text-text-secondary leading-relaxed mb-2.5">
        {data.config?.condition || data.description}
      </p>

      {/* True / False Indicator Pills */}
      <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[10px]">
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          True → Action
        </span>
        <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-rose-500" />
          False → Stop
        </span>
      </div>

      {/* Right Source Handle for Splitting Lines */}
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="w-3! h-3! bg-amber-500! border-2! border-surface!"
      />
    </div>
  );
}

// ── 3. Custom Analysis / AI Node ────────────────────────────────────────────
function CustomAnalysisNode({
  data,
  selected,
}: {
  data: WorkflowNodeData;
  selected?: boolean;
}) {
  const Icon = ICON_MAP[data.iconName] || Bot;
  const status: ExecutionStatus = data.executionStatus || 'idle';
  const isActiveStep = data.isActiveStep || false;

  return (
    <div
      className={`w-72 rounded-2xl border-2 transition-all p-4 shadow-sm bg-surface cursor-grab active:cursor-grabbing ${
        selected
          ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-lg'
          : isActiveStep
            ? 'border-brand ring-4 ring-brand/10 shadow-brand/10'
            : status === 'success'
              ? 'border-emerald-500/50 hover:border-emerald-500'
              : 'border-blue-500/30 hover:border-blue-500/70'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3! h-3! bg-blue-500! border-2! border-surface!"
      />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {data.stepNumber && (
            <div className="w-5 h-5 rounded-md bg-surface-subtle border border-border flex items-center justify-center text-[10px] font-bold text-text-secondary">
              {data.stepNumber}
            </div>
          )}
          <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            {data.config?.analysisType || 'AI Analysis'}
          </span>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-1">
          {status === 'running' || isActiveStep ? (
            <span className="text-brand flex items-center gap-1 text-[10px] font-semibold">
              <Loader2 className="size-3 animate-spin" />
              <span>Analyzing</span>
            </span>
          ) : status === 'success' ? (
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[10px] font-semibold">
              <CheckCircle2 className="size-3" />
              <span>Done</span>
            </span>
          ) : (
            <span className="text-text-muted flex items-center gap-1 text-[10px]">
              <Circle className="size-2.5" />
              <span>Ready</span>
            </span>
          )}
        </div>
      </div>

      <div className="flex items-start gap-2.5 my-2">
        <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
          <Icon className="size-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-bold text-text-primary leading-tight truncate">
            {data.name}
          </h4>
          <p className="text-[11px] text-text-secondary mt-0.5 leading-snug line-clamp-2">
            {data.config?.purpose || data.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[10px] text-text-muted">
        <span>Target</span>
        <span className="font-semibold text-text-secondary truncate max-w-[150px]">
          {data.config?.output || 'Report Memo'}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3! h-3! bg-blue-500! border-2! border-surface!"
      />
    </div>
  );
}

// ── 4. Custom Action Node ───────────────────────────────────────────────────
function CustomActionNode({
  data,
  selected,
}: {
  data: WorkflowNodeData;
  selected?: boolean;
}) {
  const Icon = ICON_MAP[data.iconName] || Bell;
  const status: ExecutionStatus = data.executionStatus || 'idle';
  const isActiveStep = data.isActiveStep || false;

  return (
    <div
      className={`w-72 rounded-2xl border-2 transition-all p-4 shadow-sm bg-surface cursor-grab active:cursor-grabbing ${
        selected
          ? 'border-brand ring-4 ring-brand/10 shadow-lg'
          : isActiveStep
            ? 'border-brand ring-4 ring-brand/10 shadow-brand/10'
            : status === 'success'
              ? 'border-emerald-500/50 hover:border-emerald-500'
              : 'border-border hover:border-brand/40'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3! h-3! bg-brand! border-2! border-surface!"
      />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {data.stepNumber && (
            <div className="w-5 h-5 rounded-md bg-surface-subtle border border-border flex items-center justify-center text-[10px] font-bold text-text-secondary">
              {data.stepNumber}
            </div>
          )}
          <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {data.config?.actionType || 'Action'}
          </span>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-1">
          {status === 'running' || isActiveStep ? (
            <span className="text-brand flex items-center gap-1 text-[10px] font-semibold">
              <Loader2 className="size-3 animate-spin" />
              <span>Running</span>
            </span>
          ) : status === 'success' ? (
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[10px] font-semibold">
              <CheckCircle2 className="size-3" />
              <span>Done</span>
            </span>
          ) : (
            <span className="text-text-muted flex items-center gap-1 text-[10px]">
              <Circle className="size-2.5" />
              <span>Ready</span>
            </span>
          )}
        </div>
      </div>

      <div className="flex items-start gap-2.5 my-2">
        <div className="w-8 h-8 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0 mt-0.5">
          <Icon className="size-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-bold text-text-primary leading-tight truncate">
            {data.name}
          </h4>
          <p className="text-[11px] text-text-secondary mt-0.5 leading-snug line-clamp-2">
            {data.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[10px] text-text-muted">
        <span>Channel</span>
        <span className="font-semibold text-text-secondary truncate max-w-[150px]">
          {data.config?.channel || 'In-App + Email'}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3! h-3! bg-brand! border-2! border-surface!"
      />
    </div>
  );
}

// ── 5. Custom Terminate Node (Stop and Log / Bypass) ─────────────────────────
function CustomTerminateNode({
  data,
  selected,
}: {
  data: WorkflowNodeData;
  selected?: boolean;
}) {
  return (
    <div
      className={`w-60 rounded-2xl border-2 transition-all p-3.5 text-xs shadow-xs cursor-grab active:cursor-grabbing bg-surface ${
        selected
          ? 'border-rose-500 ring-4 ring-rose-500/10'
          : 'border-rose-500/40 hover:border-rose-500/70'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3! h-3! bg-rose-400! border-2! border-surface!"
      />
      <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
        <span className="w-2 h-2 rounded-full bg-rose-500" />
        <span>{data.name || 'Stop and log'}</span>
      </div>
      <p className="text-[11px] text-text-secondary mt-1 leading-snug">
        {data.description || 'Normal threshold maintained. Execution bypassed.'}
      </p>
    </div>
  );
}

const nodeTypes = {
  triggerNode: CustomTriggerNode,
  decisionNode: CustomDecisionNode,
  analysisNode: CustomAnalysisNode,
  actionNode: CustomActionNode,
  terminateNode: CustomTerminateNode,
};

interface AutomationWorkflowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  selectedNodeId?: string | null;
  onSelectNode: (node: Node) => void;
  onAddTriggerQuick: (type: string) => void;
  onOpenTemplates?: () => void;
  onOpenNodeLibrary?: () => void;
  height?: string;
  activeStepIndex?: number;
  isRunning?: boolean;
}

export function AutomationWorkflowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onSelectNode,
  onAddTriggerQuick,
  onOpenTemplates,
  onOpenNodeLibrary,
  height = 'h-[640px]',
}: AutomationWorkflowCanvasProps) {
  const isCanvasEmpty = nodes.length === 0;

  return (
    <div
      className={`w-full ${height} rounded-2xl overflow-hidden border border-border bg-surface-subtle relative`}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => onSelectNode(node)}
        nodesDraggable={true}
        elementsSelectable={true}
        panOnDrag={true}
        panOnScroll={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.2}
        maxZoom={1.5}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.5}
          color="var(--border-strong)"
          className="opacity-40"
        />
        <Controls
          showInteractive={false}
          className="bg-surface! border-border! rounded-xl! shadow-sm! [&>button]:bg-surface! [&>button]:border-border! [&>button]:text-text-primary!"
        />
      </ReactFlow>

      {/* ── Empty State Guided Trigger Builder ─────────────────────────────── */}
      {isCanvasEmpty && (
        <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
          <div className="bg-surface/95 border border-border rounded-3xl p-8 max-w-lg w-full text-center shadow-xl backdrop-blur-md space-y-6 pointer-events-auto animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand mx-auto shadow-xs">
              <Zap className="size-7" />
            </div>

            <div>
              <h3 className="font-display text-lg font-bold text-text-primary">
                Create New Automation
              </h3>
              <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto leading-relaxed">
                What should start this automation? Choose a trigger or start from a proven template.
              </p>
            </div>

            {/* Quick Trigger Chips */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => onAddTriggerQuick('threshold')}
                className="p-3 rounded-xl border border-border bg-surface-subtle hover:bg-surface-hover hover:border-purple-500/40 text-left transition-all duration-150 cursor-pointer group"
              >
                <div className="flex items-center gap-2 font-bold text-text-primary group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  <ShieldAlert className="size-4 text-purple-500" />
                  <span>Threshold</span>
                </div>
                <p className="text-[11px] text-text-muted mt-1 leading-snug">
                  Metric crosses critical safety limit.
                </p>
              </button>

              <button
                type="button"
                onClick={() => onAddTriggerQuick('schedule')}
                className="p-3 rounded-xl border border-border bg-surface-subtle hover:bg-surface-hover hover:border-purple-500/40 text-left transition-all duration-150 cursor-pointer group"
              >
                <div className="flex items-center gap-2 font-bold text-text-primary group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  <SlidersHorizontal className="size-4 text-purple-500" />
                  <span>Schedule / Cron</span>
                </div>
                <p className="text-[11px] text-text-muted mt-1 leading-snug">
                  Runs daily, weekly, or recurring.
                </p>
              </button>

              <button
                type="button"
                onClick={() => onAddTriggerQuick('event')}
                className="p-3 rounded-xl border border-border bg-surface-subtle hover:bg-surface-hover hover:border-purple-500/40 text-left transition-all duration-150 cursor-pointer group"
              >
                <div className="flex items-center gap-2 font-bold text-text-primary group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  <Zap className="size-4 text-purple-500" />
                  <span>Business Event</span>
                </div>
                <p className="text-[11px] text-text-muted mt-1 leading-snug">
                  New invoice, POS delta, webhook.
                </p>
              </button>

              <button
                type="button"
                onClick={() => onAddTriggerQuick('manual')}
                className="p-3 rounded-xl border border-border bg-surface-subtle hover:bg-surface-hover hover:border-purple-500/40 text-left transition-all duration-150 cursor-pointer group"
              >
                <div className="flex items-center gap-2 font-bold text-text-primary group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  <Play className="size-4 text-purple-500" />
                  <span>Manual Trigger</span>
                </div>
                <p className="text-[11px] text-text-muted mt-1 leading-snug">
                  Triggered on-demand by user.
                </p>
              </button>
            </div>

            {/* Template option */}
            {onOpenTemplates && (
              <div className="pt-2 border-t border-border flex items-center justify-center gap-2">
                <span className="text-xs text-text-muted">or</span>
                <button
                  type="button"
                  onClick={onOpenTemplates}
                  className="text-xs font-semibold text-brand hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="size-3.5" />
                  <span>Start from an existing template</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Floating Canvas Controls */}
      {!isCanvasEmpty && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1 rounded-xl bg-surface/90 border border-border shadow-lg backdrop-blur-md text-xs font-semibold text-text-primary">
          {onOpenNodeLibrary && (
            <button
              type="button"
              onClick={onOpenNodeLibrary}
              className="px-3 py-1.5 rounded-lg bg-brand text-white hover:bg-brand/90 flex items-center gap-1.5 text-xs shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="size-3.5" />
              <span>Add Node</span>
            </button>
          )}

          <div className="px-3 py-1.5 rounded-lg bg-surface-subtle text-text-primary flex items-center gap-1.5 text-xs border border-border">
            <Hand className="size-3.5 text-brand" />
            <span>Drag Enabled</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-surface-subtle text-text-primary flex items-center gap-1.5 text-xs border border-border">
            <Layers className="size-3.5 text-brand" />
            <span>{nodes.length} Nodes</span>
          </div>
        </div>
      )}
    </div>
  );
}
