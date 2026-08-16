// src/features/automation/components/AutomationBuilder.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  Terminal,
  Activity,
  Save,
  Check,
  Radio,
  Trash2,
  Sparkles,
  Settings2,
  History,
  Clock,
  CheckCircle2,
  LayoutGrid,
} from 'lucide-react';
import {
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
} from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { AutomationWorkflowCanvas } from './AutomationWorkflowCanvas';
import { NodeLibraryDrawer } from './NodeLibraryDrawer';
import { NodeInspector } from './NodeInspector';
import { AutomationSettingsModal } from './AutomationSettingsModal';
import { TemplatePickerModal } from './TemplatePickerModal';
import {
  NODE_LIBRARY_PRESETS,
  type AutomationRule,
  type AutomationActionItem,
  type ExecutionRecord,
  type WorkflowNodeData,
  type NodeLibraryItem,
} from '../types/automation.types';

interface AutomationBuilderProps {
  mode: 'create' | 'edit';
  automation?: AutomationRule;
  onBack: () => void;
  onSave: (rule: AutomationRule) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
}

interface TelemetryLog {
  id: string;
  time: string;
  tag: 'POLL' | 'EVAL' | 'AI-AGENT' | 'TRIGGER' | 'SUCCESS' | 'INFO';
  msg: string;
}

const TELEMETRY_STREAM_MESSAGES: Record<string, { tag: TelemetryLog['tag']; msg: string }[]> = {
  'cash-runway-guardrail': [
    { tag: 'POLL', msg: 'Querying liquid reserves from Financial Ledger (฿245,000 liquid, ฿164,800 burn rate)...' },
    { tag: 'EVAL', msg: 'Evaluating condition: Cash runway = 2.14 months (Safety Floor: 3.00 months) [BREACH DETECTED]' },
    { tag: 'AI-AGENT', msg: 'Capybot synthesized 3 liquidity mitigation levers (Primary: ฿21,340 overdue receivables).' },
    { tag: 'TRIGGER', msg: 'Triggering automated Cash Triage simulation in background sandbox.' },
    { tag: 'SUCCESS', msg: 'Runway simulation verified. Projected extension +2.1 months. Notifications staged.' },
  ],
  'inventory-risk-alert': [
    { tag: 'POLL', msg: 'Scanning 412 active SKU stock cards from POS & Warehouse DB...' },
    { tag: 'EVAL', msg: 'Evaluating deadstock coverage: 5 categories exceed 75 days (Slow-moving ratio: 14.1%).' },
    { tag: 'AI-AGENT', msg: 'Capybot generating clearance promo bundle recommendations for slow-moving categories.' },
    { tag: 'SUCCESS', msg: 'Inventory Risk Radar updated. Sync complete.' },
  ],
  'invoice-processing-router': [
    { tag: 'POLL', msg: 'Polling Accounts Payable inbox delta (Queue depth: 29 pending attachments)...' },
    { tag: 'EVAL', msg: 'Running OCR & bounding box extraction on incoming vendor invoices.' },
    { tag: 'AI-AGENT', msg: 'Agentic 3-way match: 20 clean records auto-matched (69%), 9 price exceptions routed for review.' },
    { tag: 'SUCCESS', msg: 'Batch approved. Payment batch committed to ERP.' },
  ],
};

const DEFAULT_STREAM_MESSAGES = [
  { tag: 'POLL' as const, msg: 'Telemetry heartbeat: System status normal. Data streams synchronized.' },
  { tag: 'EVAL' as const, msg: 'Evaluating trigger rules against incoming telemetry events.' },
  { tag: 'AI-AGENT' as const, msg: 'Capybot monitoring business health indices and queue backlog rates.' },
  { tag: 'SUCCESS' as const, msg: 'All validation criteria checked with 0 errors.' },
];

function buildGraphFromAutomation(rule: AutomationRule): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // 1. Trigger Node
  nodes.push({
    id: 'node-trigger',
    type: 'triggerNode',
    position: { x: 40, y: 220 },
    data: {
      name: rule.trigger.name,
      category: 'trigger',
      nodeType: 'triggerNode',
      description: rule.trigger.conditionDescription,
      iconName: rule.iconName || 'ShieldAlert',
      config: {
        triggerType: 'threshold',
        condition: rule.trigger.condition,
        frequency: rule.trigger.frequency,
      },
    } satisfies WorkflowNodeData,
  });

  // 2. Validate / Decision Node
  nodes.push({
    id: 'node-decision',
    type: 'decisionNode',
    position: { x: 380, y: 220 },
    data: {
      name: 'Validate Threshold',
      category: 'logic',
      nodeType: 'decisionNode',
      description: `Validate criteria: ${rule.trigger.condition}`,
      iconName: 'Split',
      config: {
        logicType: 'if_else',
        condition: rule.trigger.condition,
        trueAction: 'Analyze Cash Position',
        falseAction: 'Stop and log (Bypass execution)',
      },
    } satisfies WorkflowNodeData,
  });

  edges.push({
    id: 'edge-trigger-decision',
    source: 'node-trigger',
    target: 'node-decision',
    type: 'default',
    animated: true,
    style: { stroke: '#A855F7', strokeWidth: 2, strokeDasharray: '4 4' },
  });

  // 3. Terminate Node (Upper Branch in Opero style)
  nodes.push({
    id: 'node-terminate',
    type: 'terminateNode',
    position: { x: 740, y: 60 },
    data: {
      name: 'Stop and log',
      category: 'terminate',
      nodeType: 'terminateNode',
      description: 'Normal threshold maintained. Logged to monitor history.',
      iconName: 'ShieldAlert',
      config: {},
    } satisfies WorkflowNodeData,
  });

  edges.push({
    id: 'edge-decision-terminate',
    source: 'node-decision',
    sourceHandle: 'out',
    target: 'node-terminate',
    type: 'default',
    label: 'else',
    labelStyle: { fill: '#F43F5E', fontSize: 10, fontWeight: 700 },
    style: { stroke: '#F43F5E', strokeWidth: 2, strokeDasharray: '4 4' },
  });

  // 4. Action Sequence Nodes
  let startX = 740;
  let prevNodeId = 'node-decision';
  let prevSourceHandle: string | undefined = 'out';

  const actionItems: AutomationActionItem[] = rule.actionItems || [];
  actionItems.forEach((act: AutomationActionItem, idx: number) => {
    const nodeId = `node-act-${idx}`;
    const nodeType =
      act.type === 'llm'
        ? 'analysisNode'
        : act.type === 'simulation'
        ? 'analysisNode'
        : 'actionNode';

    nodes.push({
      id: nodeId,
      type: nodeType,
      position: { x: startX, y: 220 },
      data: {
        stepNumber: idx + 1,
        name: act.name,
        category: act.type === 'llm' || act.type === 'simulation' ? 'analysis' : 'action',
        nodeType,
        description: act.description,
        iconName: act.iconName || 'Bot',
        executionStatus: 'idle',
        config: {
          actionType: act.type === 'notification' ? 'notification' : 'action_item',
          analysisType: act.type === 'llm' ? 'capybot' : act.type === 'simulation' ? 'simulation' : 'metric',
          purpose: act.description,
          duration: act.duration,
        },
      } satisfies WorkflowNodeData,
    });

    edges.push({
      id: `edge-${prevNodeId}-${nodeId}`,
      source: prevNodeId,
      sourceHandle: prevSourceHandle,
      target: nodeId,
      type: 'default',
      label: idx === 0 ? 'if valid' : undefined,
      labelStyle: { fill: '#10B981', fontSize: 10, fontWeight: 700 },
      style: {
        stroke: idx === 0 ? '#F59E0B' : '#6366F1',
        strokeWidth: 2,
        strokeDasharray: '4 4',
      },
    });

    prevNodeId = nodeId;
    prevSourceHandle = undefined;
    startX += 340;
  });

  return { nodes, edges };
}

export function AutomationBuilder({
  mode,
  automation: initialAutomation,
  onBack,
  onSave,
  onDelete,
  onToggleStatus,
}: AutomationBuilderProps) {
  // ── State: Automation Metadata ─────────────────────────────────────────────
  const [currentAutomation, setCurrentAutomation] = useState<AutomationRule>(() => {
    if (mode === 'edit' && initialAutomation) {
      return initialAutomation;
    }
    return {
      id: `auto-${Date.now()}`,
      title: 'Untitled Automation',
      description: 'Monitor business conditions and execute automated workflows.',
      category: 'Finance & Liquidity',
      status: 'draft',
      executionStatus: 'idle',
      trigger: {
        name: 'Threshold Trigger',
        condition: 'Metric crosses threshold',
        conditionDescription: 'Trigger when business metrics cross defined limits.',
        frequency: 'Every 4 hours',
        type: 'Threshold Trigger',
      },
      connectedSystem: 'Wallflower Ledger & Integrations',
      actionsCount: 0,
      runsCount: 0,
      successRate: 0,
      lastCheck: '—',
      iconName: 'ShieldAlert',
      actionItems: [],
      steps: [],
      history: [],
      runtimeSettings: {
        autoRunOnTrigger: true,
        timeoutMs: 15000,
        retryAttempts: 2,
        stopOnError: true,
      },
      tags: ['custom'],
    };
  });

  // ── State: ReactFlow Graph ─────────────────────────────────────────────────
  const initialGraph = initialAutomation && mode === 'edit'
    ? buildGraphFromAutomation(initialAutomation)
    : { nodes: [], edges: [] };

  const [nodes, setNodes, onNodesChangeOriginal] = useNodesState(initialGraph.nodes);
  const [edges, setEdges, onEdgesChangeOriginal] = useEdgesState(initialGraph.edges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    initialGraph.nodes[0]?.id || null
  );
  const [isDirty, setIsDirty] = useState(false);

  const onNodesChange: typeof onNodesChangeOriginal = useCallback((changes) => {
    const isUserEdit = changes.some(
      (c) => (c.type === 'position' && c.dragging) || c.type === 'remove'
    );
    if (isUserEdit) {
      setIsDirty(true);
    }
    onNodesChangeOriginal(changes);
  }, [onNodesChangeOriginal]);

  const onEdgesChange: typeof onEdgesChangeOriginal = useCallback((changes) => {
    const isUserEdit = changes.some(
      (c) => c.type === 'remove'
    );
    if (isUserEdit) {
      setIsDirty(true);
    }
    onEdgesChangeOriginal(changes);
  }, [onEdgesChangeOriginal]);

  // ── State: Modals & Drawers ────────────────────────────────────────────────
  const [isNodeLibraryOpen, setIsNodeLibraryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [saveBanner, setSaveBanner] = useState(false);

  // ── State: Telemetry & Execution Runner ────────────────────────────────────
  const [isRunning, setIsRunning] = useState(false);
  const [isStreaming, setIsStreaming] = useState(true);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [history, setHistory] = useState<ExecutionRecord[]>(
    currentAutomation.history || []
  );
  const [logs, setLogs] = useState<TelemetryLog[]>(() => [
    {
      id: `log-init-${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      tag: 'INFO',
      msg: `Live Telemetry engine initialized for [${currentAutomation.title}]`,
    },
  ]);
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  const addTelemetryLog = useCallback((tag: TelemetryLog['tag'], msg: string) => {
    setLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}-${Math.random()}`,
        time: new Date().toLocaleTimeString(),
        tag,
        msg,
      },
    ].slice(-80));
  }, []);

  // Background Telemetry Poller (Runs smoothly without scrolling screen)
  useEffect(() => {
    if (!isStreaming || isRunning) return;

    const streamPool =
      TELEMETRY_STREAM_MESSAGES[currentAutomation.id] || DEFAULT_STREAM_MESSAGES;
    let streamIdx = 0;

    const interval = setInterval(() => {
      const item = streamPool[streamIdx % streamPool.length];
      addTelemetryLog(item.tag, item.msg);
      streamIdx++;
    }, 3500);

    return () => clearInterval(interval);
  }, [currentAutomation.id, isStreaming, isRunning, addTelemetryLog]);

  // Auto-scroll internally in terminal box without moving page
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop =
        terminalContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // ── Graph Connection Handler ───────────────────────────────────────────────
  const onConnect = useCallback(
    (connection: Connection) => {
      setIsDirty(true);
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: 'default',
            style: {
              stroke: '#6366F1',
              strokeWidth: 2,
              strokeDasharray: '4 4',
            },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  // ── Node Selection ─────────────────────────────────────────────────────────
  const handleSelectNode = (node: Node) => {
    setSelectedNodeId(node.id);
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          selected: n.id === node.id,
        },
      }))
    );
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedNodeData = (selectedNode?.data as WorkflowNodeData) || null;

  // ── Node Data Updates from Inspector ───────────────────────────────────────
  const handleUpdateNodeData = (updated: Partial<WorkflowNodeData>) => {
    if (!selectedNodeId) return;
    setIsDirty(true);

    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === selectedNodeId) {
          return {
            ...n,
            data: {
              ...n.data,
              ...updated,
            },
          };
        }
        return n;
      })
    );
  };

  // ── Add Node from Library ──────────────────────────────────────────────────
  const handleAddNodeFromLibrary = (item: NodeLibraryItem) => {
    setIsDirty(true);
    const newId = `node-${Date.now()}`;
    const prevNode = selectedNode || nodes[nodes.length - 1];
    const newX = prevNode ? prevNode.position.x + 340 : 80;
    const newY = prevNode ? prevNode.position.y : 220;

    const newNode: Node = {
      id: newId,
      type: item.type,
      position: { x: newX, y: newY },
      data: {
        name: item.name,
        category: item.category,
        nodeType: item.type,
        description: item.description,
        iconName: item.iconName,
        stepNumber: nodes.filter((n) => n.data.category === 'action' || n.data.category === 'analysis').length + 1,
        executionStatus: 'idle',
        config: item.defaultConfig,
      } satisfies WorkflowNodeData,
    };

    setNodes((nds) => [...nds, newNode]);

    // Connect automatically from previous node if available
    if (prevNode) {
      setEdges((eds) => [
        ...eds,
        {
          id: `edge-${prevNode.id}-${newId}`,
          source: prevNode.id,
          target: newId,
          type: 'default',
          style: {
            stroke: '#6366F1',
            strokeWidth: 2,
            strokeDasharray: '4 4',
          },
        },
      ]);
    }

    handleSelectNode(newNode);
    addTelemetryLog('INFO', `Added block [${item.name}] to canvas.`);
  };

  // ── Quick Trigger Selection (From Guided Empty State) ──────────────────────
  const handleAddQuickTrigger = (type: string) => {
    setIsDirty(true);
    const preset =
      NODE_LIBRARY_PRESETS[0].items.find((i) => i.defaultConfig.triggerType === type) ||
      NODE_LIBRARY_PRESETS[0].items[0];

    const triggerNode: Node = {
      id: 'node-trigger',
      type: 'triggerNode',
      position: { x: 80, y: 220 },
      data: {
        name: preset.name,
        category: 'trigger',
        nodeType: 'triggerNode',
        description: preset.description,
        iconName: preset.iconName,
        config: preset.defaultConfig,
      } satisfies WorkflowNodeData,
    };

    setNodes([triggerNode]);
    setSelectedNodeId('node-trigger');
    addTelemetryLog('INFO', `Trigger [${preset.name}] set as workflow entry point.`);
  };

  // ── Clone Template ─────────────────────────────────────────────────────────
  const handleCloneTemplate = (template: AutomationRule) => {
    setIsDirty(true);
    setCurrentAutomation({
      ...template,
      id: `auto-${Date.now()}`,
      title: `${template.title} (Custom)`,
      status: 'draft',
    });

    const graph = buildGraphFromAutomation(template);
    setNodes(graph.nodes);
    setEdges(graph.edges);
    setSelectedNodeId(graph.nodes[0]?.id || null);
    addTelemetryLog('INFO', `Cloned workflow blueprint from [${template.title}].`);
  };

  // ── Duplicate Selected Node ────────────────────────────────────────────────
  const handleDuplicateNode = () => {
    if (!selectedNode) return;
    setIsDirty(true);
    const newId = `node-${Date.now()}`;
    const duplicated: Node = {
      ...selectedNode,
      id: newId,
      position: {
        x: selectedNode.position.x + 40,
        y: selectedNode.position.y + 40,
      },
      data: {
        ...selectedNode.data,
        name: `${selectedNode.data.name} (Copy)`,
        selected: true,
      },
    };

    setNodes((nds) => [...nds, duplicated]);
    handleSelectNode(duplicated);
    addTelemetryLog('INFO', `Duplicated block [${selectedNode.data.name}].`);
  };

  // ── Delete Selected Node ───────────────────────────────────────────────────
  const handleDeleteSelectedNode = () => {
    if (!selectedNodeId) return;
    setIsDirty(true);
    setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
    setEdges((eds) =>
      eds.filter(
        (e) => e.source !== selectedNodeId && e.target !== selectedNodeId
      )
    );
    setSelectedNodeId(null);
    addTelemetryLog('INFO', `Removed block from workflow canvas.`);
  };

  // ── Auto Layout (Horizontally organizes nodes left-to-right) ───────────────
  const handleAutoLayout = () => {
    setIsDirty(true);
    setNodes((currentNodes) => {
      let currentX = 80;
      return currentNodes.map((n) => {
        const isTerminate = n.type === 'terminateNode';
        const y = isTerminate ? 60 : 220;
        const updated = {
          ...n,
          position: { x: currentX, y },
        };
        if (!isTerminate) {
          currentX += 340;
        }
        return updated;
      });
    });
    addTelemetryLog('INFO', 'Applied automated workflow alignment.');
  };

  // ── Save Workflow ──────────────────────────────────────────────────────────
  const handleSaveWorkflow = () => {
    const updatedRule: AutomationRule = {
      ...currentAutomation,
      actionsCount: nodes.filter((n) => n.data.category === 'action').length,
    };
    onSave(updatedRule);
    setIsDirty(false);
    setSaveBanner(true);
    addTelemetryLog('SUCCESS', `Workflow [${currentAutomation.title}] saved successfully.`);
    setTimeout(() => setSaveBanner(false), 2500);
  };

  // ── Live Test Execution Runner ─────────────────────────────────────────────
  const handleRunNow = async () => {
    if (isRunning || nodes.length === 0) return;
    setIsRunning(true);
    setActiveStepIndex(0);
    addTelemetryLog('TRIGGER', `Starting test execution for [${currentAutomation.title}]...`);

    for (let i = 0; i < nodes.length; i++) {
      setActiveStepIndex(i);
      const curr = nodes[i];
      const name = curr.data.name || `Step ${i + 1}`;

      setNodes((nds) =>
        nds.map((n, idx) => ({
          ...n,
          data: {
            ...n.data,
            isActiveStep: idx === i,
            executionStatus: idx === i ? 'running' : idx < i ? 'success' : 'idle',
          },
        }))
      );

      addTelemetryLog(
        curr.data.category === 'analysis'
          ? 'AI-AGENT'
          : curr.data.category === 'trigger'
          ? 'POLL'
          : 'TRIGGER',
        `Executing [${name}]...`
      );

      await new Promise((r) => setTimeout(r, 600));
    }

    // Mark all complete
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isActiveStep: false,
          executionStatus: 'success',
        },
      }))
    );

    setIsRunning(false);
    setActiveStepIndex(nodes.length);
    addTelemetryLog('SUCCESS', 'Test run completed with 0 errors. All nodes validated.');

    const newRecord: ExecutionRecord = {
      id: `run-${Date.now()}`,
      time: 'Just now',
      status: 'success',
      duration: `${(nodes.length * 0.6).toFixed(1)}s`,
      summary: 'Verified & Executed',
    };
    setHistory((prev) => [newRecord, ...prev].slice(0, 10));
  };

  const handleBackWithDraftSave = () => {
    if (isDirty) {
      const draftRule: AutomationRule = {
        ...currentAutomation,
        status: currentAutomation.status === 'active' ? 'active' : 'draft',
        actionsCount: nodes.filter((n) => n.data.category === 'action').length,
      };
      onSave(draftRule);
    }
    onBack();
  };

  return (
    <div className="space-y-4 max-w-[1700px] mx-auto pb-12 animate-in fade-in duration-300">
      {/* ── Top Header & Actions Bar ──────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-border">
        <div>
          <button
            onClick={handleBackWithDraftSave}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-brand transition-colors mb-2 cursor-pointer group"
          >
            <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Automations</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative group/title flex items-center">
              <input
                type="text"
                value={currentAutomation.title}
                onChange={(e) => {
                  setCurrentAutomation((prev) => ({ ...prev, title: e.target.value }));
                  setIsDirty(true);
                }}
                placeholder="Automation Name"
                className="font-display text-xl sm:text-2xl font-bold tracking-tight text-text-primary bg-transparent border-b border-transparent hover:border-border focus:border-brand focus:bg-surface-subtle px-1 -ml-1 rounded-lg transition-all outline-none"
              />
            </div>
            <Badge
              variant={
                currentAutomation.status === 'active'
                  ? 'success'
                  : currentAutomation.status === 'paused'
                  ? 'warning'
                  : 'neutral'
              }
              dot
              className="uppercase text-xs"
            >
              {currentAutomation.status}
            </Badge>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="p-1.5 rounded-lg border border-border bg-surface-subtle hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              title="Edit Automation Details"
            >
              <Settings2 className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Toolbar & Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTemplatePickerOpen(true)}
            className="gap-1.5 text-xs h-9 rounded-xl border border-border cursor-pointer hidden sm:inline-flex"
          >
            <Sparkles className="size-3.5 text-brand" />
            <span>Templates</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleAutoLayout}
            className="gap-1.5 text-xs h-9 rounded-xl border border-border cursor-pointer"
            title="Auto-align workflow layout"
          >
            <LayoutGrid className="size-3.5" />
            <span className="hidden md:inline">Auto Layout</span>
          </Button>

          {onToggleStatus && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleStatus(currentAutomation.id)}
              className="gap-1.5 text-xs h-9 rounded-xl border border-border cursor-pointer"
            >
              {currentAutomation.status === 'active' ? (
                <>
                  <Pause className="size-3.5 text-warning" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="size-3.5 text-success fill-success" />
                  <span>Activate</span>
                </>
              )}
            </Button>
          )}

          {onDelete && mode === 'edit' && (
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="gap-1.5 text-xs h-9 px-3 rounded-xl border border-rose-300 dark:border-rose-800/80 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:border-rose-400 font-semibold transition-all cursor-pointer flex items-center shadow-xs"
              title="Delete Automation"
            >
              <Trash2 className="size-3.5 text-rose-600 dark:text-rose-400" />
              <span>Delete</span>
            </button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleRunNow}
            disabled={isRunning || nodes.length === 0}
            className="gap-1.5 text-xs h-9 rounded-xl border border-border text-brand hover:bg-brand/10 cursor-pointer"
          >
            {isRunning ? (
              <>
                <Activity className="size-3.5 animate-spin" />
                <span>Testing...</span>
              </>
            ) : (
              <>
                <Play className="size-3.5 fill-brand" />
                <span>Run Now (Test)</span>
              </>
            )}
          </Button>

          {/* Save Button: Only active/visible when actual modifications exist */}
          {(isDirty || saveBanner || (mode === 'create' && nodes.length > 0)) && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveWorkflow}
              className="gap-1.5 text-xs h-9 rounded-xl shadow-xs cursor-pointer animate-in fade-in zoom-in-95 duration-150"
            >
              {saveBanner ? (
                <>
                  <Check className="size-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="size-3.5" />
                  <span>{mode === 'create' ? 'Save Automation' : 'Save Changes'}</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* ── Main Workspace: Canvas on Left + Inspector on Right ─────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-5 items-stretch">
        {/* Left Column: Interactive Workflow Canvas + Telemetry Console */}
        <div className="flex flex-col gap-4">
          <div className="shrink-0">
            <AutomationWorkflowCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              selectedNodeId={selectedNodeId}
              onSelectNode={handleSelectNode}
              onAddTriggerQuick={handleAddQuickTrigger}
              onOpenTemplates={() => setIsTemplatePickerOpen(true)}
              onOpenNodeLibrary={() => setIsNodeLibraryOpen(true)}
              height="h-[580px]"
              activeStepIndex={activeStepIndex}
              isRunning={isRunning}
            />
          </div>

          {/* Live Telemetry Output Console (Stretches to align bottom) */}
          <Card className="p-4 shadow-2xs border-border bg-surface flex-1 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5 pb-2 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                    <Terminal className="size-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                    <span>Live Execution Telemetry</span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {isStreaming ? 'STREAMING ACTIVE' : 'STREAM PAUSED'}
                    </span>
                  </h3>
                </div>

                {/* Telemetry Actions */}
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsStreaming(!isStreaming)}
                    className="px-2.5 py-1 rounded-lg border border-border bg-surface-subtle hover:bg-surface-hover text-text-secondary transition-colors cursor-pointer flex items-center gap-1.5 text-[11px]"
                  >
                    <Radio className={`size-3 ${isStreaming ? 'text-emerald-500' : 'text-text-muted'}`} />
                    <span>{isStreaming ? 'Pause Stream' : 'Resume Stream'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLogs([])}
                    className="p-1 rounded-lg border border-border bg-surface-subtle hover:bg-surface-hover text-text-muted hover:text-danger transition-colors cursor-pointer"
                    title="Clear Terminal Output"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Terminal Log Stream Window */}
              <div
                ref={terminalContainerRef}
                className="p-3.5 rounded-xl font-mono text-xs bg-surface-subtle dark:bg-[#070A10] text-text-primary dark:text-slate-100 min-h-36 max-h-52 overflow-y-auto space-y-1.5 shadow-inner border border-border dark:border-slate-800/80"
              >
                {logs.length > 0 ? (
                  logs.map((l) => {
                    const tagColors: Record<string, string> = {
                      POLL: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30',
                      EVAL: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30',
                      'AI-AGENT': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30',
                      TRIGGER: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30',
                      SUCCESS: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30',
                      INFO: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/20 dark:text-slate-300 dark:border-slate-500/30',
                    };

                    return (
                      <div key={l.id} className="flex items-start gap-2 leading-relaxed text-[11px]">
                        <span className="text-text-muted dark:text-slate-500 select-none shrink-0 font-mono text-[10px] pt-0.5">
                          [{l.time}]
                        </span>
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border shrink-0 ${
                            tagColors[l.tag] || tagColors.INFO
                          }`}
                        >
                          {l.tag}
                        </span>
                        <span
                          className={
                            l.tag === 'SUCCESS'
                              ? 'text-emerald-700 dark:text-emerald-300 font-semibold'
                              : l.tag === 'TRIGGER'
                              ? 'text-rose-700 dark:text-rose-300 font-semibold'
                              : l.tag === 'AI-AGENT'
                              ? 'text-purple-700 dark:text-purple-300'
                              : 'text-text-secondary dark:text-slate-300'
                          }
                        >
                          {l.msg}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-text-muted dark:text-slate-600 text-center py-6 text-[11px]">
                    Initializing telemetry event listeners...
                  </div>
                )}
              </div>
            </div>

            {/* Terminal Status Footer */}
            <div className="flex items-center justify-between pt-2.5 mt-2 text-[10px] text-text-muted border-t border-border">
              <span className="font-mono">Events logged: {logs.length}</span>
              <span className="flex items-center gap-1.5 text-text-secondary">
                <Activity className="size-3 text-emerald-600 dark:text-emerald-400" />
                <span>Connected to {currentAutomation.connectedSystem}</span>
              </span>
            </div>
          </Card>
        </div>

        {/* Right Column: Node Inspector & Recent Runs (Stretches to align bottom) */}
        <div className="flex flex-col gap-4">
          <div className="shrink-0">
            <NodeInspector
              nodeData={selectedNodeData}
              onUpdateNodeData={handleUpdateNodeData}
              onDuplicateNode={handleDuplicateNode}
              onDeleteNode={handleDeleteSelectedNode}
            />
          </div>

          {/* Recent Runs Execution History Card (Fills remaining height) */}
          <Card className="p-4 shadow-2xs border-border bg-surface flex-1 flex flex-col min-h-0 justify-between space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <History className="size-3.5 text-brand" />
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                  Recent Runs
                </h4>
              </div>
              <span className="text-[10px] font-semibold text-text-muted">
                {history.length} records
              </span>
            </div>

            <div className="space-y-2 flex-1 overflow-y-auto min-h-[140px] max-h-[220px] pr-1">
              {history.length > 0 ? (
                history.map((record) => (
                  <div
                    key={record.id}
                    className="p-2.5 rounded-xl border border-border bg-surface-subtle hover:bg-surface-hover hover:border-brand/30 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xs cursor-pointer flex items-center justify-between gap-3 text-xs group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                        <CheckCircle2 className="size-3" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-text-primary block truncate group-hover:text-brand transition-colors text-[11px]">
                          {record.summary}
                        </span>
                        <span className="text-[10px] text-text-muted flex items-center gap-1">
                          <Clock className="size-2.5" />
                          <span>{record.time}</span>
                        </span>
                      </div>
                    </div>

                    <span className="font-mono text-[10px] font-semibold text-text-secondary px-2 py-0.5 rounded-md bg-surface border border-border shrink-0">
                      {record.duration}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-text-muted text-center py-4 text-xs">
                  No previous runs recorded
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* ── Modals & Drawers ──────────────────────────────────────────────── */}
      <NodeLibraryDrawer
        isOpen={isNodeLibraryOpen}
        onClose={() => setIsNodeLibraryOpen(false)}
        onSelectNodeItem={handleAddNodeFromLibrary}
      />

      <TemplatePickerModal
        isOpen={isTemplatePickerOpen}
        onClose={() => setIsTemplatePickerOpen(false)}
        onSelectTemplate={handleCloneTemplate}
        onSelectBlank={() => {
          setNodes([]);
          setEdges([]);
          setSelectedNodeId(null);
          setIsDirty(true);
          addTelemetryLog('INFO', 'Started fresh blank canvas automation.');
        }}
      />

      <AutomationSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        automation={currentAutomation}
        onSave={(updated: Partial<AutomationRule>) => {
          setCurrentAutomation((prev: AutomationRule) => ({ ...prev, ...updated }));
          addTelemetryLog('INFO', 'Updated automation settings metadata.');
        }}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-danger shrink-0">
                <Trash2 className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-text-primary">
                  Delete Automation
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Are you sure you want to delete &quot;{currentAutomation.title}&quot;?
                </p>
              </div>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed bg-surface-subtle p-3 rounded-xl border border-border">
              This action will permanently delete this automation rule, stop all background monitoring, and remove its workflow configuration.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  onDelete?.(currentAutomation.id);
                  onBack();
                }}
                className="text-xs gap-1.5"
              >
                <Trash2 className="size-3.5" />
                <span>Delete Automation</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
