"use client";

import { useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Position,
  Handle,
  type NodeProps,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

export type AgentId = "planner" | "researcher" | "critic" | "synthesizer";
export type AgentNodeState = "idle" | "running" | "done" | "error";

export interface AgentNodeData extends Record<string, unknown> {
  agentId: AgentId;
  label: string;
  icon: string;
  color: string;
  glowColor: string;
  state: AgentNodeState;
  message: string;
  content?: string;
}

export type AgentFlowNode = Node<AgentNodeData, "agentNode">;

function AgentNode({ data }: NodeProps<AgentFlowNode>) {
  const { label, icon, color, glowColor, state, message, content } = data;

  const borderColor =
    state === "running" ? color : state === "done" ? "#34d399" : state === "error" ? "#f87171" : "rgba(150,150,150,0.2)";

  const bgGlow = state === "running" ? `0 0 20px ${glowColor}40` : state === "done" ? "0 0 16px rgba(52,211,153,0.25)" : "none";

  return (
    <div
      className="relative rounded-xl border border-border/80 bg-surface shadow-2xs transition-all duration-500 overflow-hidden"
      style={{
        width: 220,
        backdropFilter: "blur(12px)",
        borderColor: state === "idle" ? undefined : borderColor,
        boxShadow: bgGlow,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />

      <div className="flex items-center gap-3 px-3 py-2 border-b border-border/60 bg-surface-subtle">
        <span
          className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${state === "running" ? "animate-ping" : ""}`}
          style={{ background: state === "running" ? color : state === "done" ? "#34d399" : state === "error" ? "#f87171" : "hsl(var(--muted))" }}
        />
        <span className="text-sm">{icon}</span>
        <span className="text-xs font-semibold text-text-primary truncate">{label}</span>
        {state === "done" && <span className="ml-auto text-[8px] font-bold text-success uppercase tracking-wider">Done</span>}
        {state === "running" && <span className="ml-auto text-[8px] font-bold uppercase tracking-wider" style={{ color }}>Active</span>}
      </div>

      <div className="px-3 py-2 space-y-2">
        <p className="text-[10px] leading-relaxed text-text-muted">
          {message}
        </p>
        {content && (
          <div className="mt-2 rounded-md p-2 max-h-24 overflow-y-auto bg-surface border border-border/50 shadow-inner custom-scrollbar">
            <pre className="text-[9px] text-text-muted font-mono whitespace-pre-wrap leading-relaxed">
              {content.slice(0, 300)}{content.length > 300 ? "..." : ""}
            </pre>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
}

const nodeTypes = { agentNode: AgentNode };

const AGENT_CONFIGS: Record<AgentId, Omit<AgentNodeData, "state" | "message" | "content">> = {
  planner: { agentId: "planner", label: "Planner", icon: "🗺", color: "#0F766E", glowColor: "#0F766E" },
  researcher: { agentId: "researcher", label: "Researcher", icon: "🔬", color: "#0ea5e9", glowColor: "#0ea5e9" },
  critic: { agentId: "critic", label: "Critic", icon: "🧠", color: "#f59e0b", glowColor: "#f59e0b" },
  synthesizer: { agentId: "synthesizer", label: "Synthesizer", icon: "✦", color: "#d946ef", glowColor: "#d946ef" },
};

const IDLE_MESSAGE: Record<AgentId, string> = {
  planner: "Waiting to decompose goal...",
  researcher: "Waiting for plan...",
  critic: "Waiting to review...",
  synthesizer: "Waiting to produce final plan...",
};

function buildInitialNodes() {
  const agents: AgentId[] = ["planner", "researcher", "critic", "synthesizer"];
  return agents.map((id, i) => ({
    id,
    type: "agentNode",
    position: { x: i * 260, y: 0 },
    data: {
      ...AGENT_CONFIGS[id],
      state: "idle" as AgentNodeState,
      message: IDLE_MESSAGE[id],
    },
  }));
}

const INITIAL_EDGES = [
  { id: "e1", source: "planner", target: "researcher", animated: false, style: { stroke: "rgba(150,150,150,0.2)" } },
  { id: "e2", source: "researcher", target: "critic", animated: false, style: { stroke: "rgba(150,150,150,0.2)" } },
  { id: "e3", source: "critic", target: "synthesizer", animated: false, style: { stroke: "rgba(150,150,150,0.2)" } },
];

export interface AgentStatus {
  agent: AgentId;
  state: "running" | "done";
  message: string;
  content?: string;
}

export function AgentWorkflowCanvas({
  agentStatuses,
  className = "",
  height = "h-[260px]",
}: {
  agentStatuses: Record<AgentId, AgentStatus | null>;
  className?: string;
  height?: string;
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(buildInitialNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);

  useEffect(() => {
    setNodes((prev) =>
      prev.map((node) => {
        const agentId = node.id as AgentId;
        const status = agentStatuses[agentId];
        if (!status) return node;
        return {
          ...node,
          data: {
            ...node.data,
            state: status.state,
            message: status.message,
            content: status.content,
          },
        };
      })
    );
  }, [agentStatuses, setNodes]);

  useEffect(() => {
    const runningAgent = Object.entries(agentStatuses).find(([, s]) => s?.state === "running")?.[0] as AgentId | undefined;
    const ORDER: AgentId[] = ["planner", "researcher", "critic", "synthesizer"];
    const runningIdx = runningAgent ? ORDER.indexOf(runningAgent) : -1;

    setEdges((prev) =>
      prev.map((edge) => {
        const sourceIdx = ORDER.indexOf(edge.source as AgentId);
        const shouldAnimate = runningIdx > 0 && sourceIdx === runningIdx - 1;
        return {
          ...edge,
          animated: shouldAnimate,
          style: {
            stroke: shouldAnimate ? "#6366F1" : "rgba(150,150,150,0.25)",
            strokeWidth: shouldAnimate ? 2 : 1,
          },
        };
      })
    );
  }, [agentStatuses, setEdges]);

  const onConnect = useCallback(() => {}, []);

  return (
    <div className={`w-full ${height} bg-surface-subtle/50 rounded-xl border border-border/80 overflow-hidden shadow-inner ${className}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        proOptions={{ hideAttribution: true }}
        panOnScroll={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        panOnDrag={true}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
      >
        <Background color="rgba(150,150,150,0.15)" gap={20} />
        <Controls
          className="!bg-surface !border !border-border/80 !rounded-lg !shadow-md [&>button]:!bg-surface [&>button]:!border-border/60 [&>button]:!fill-text-primary [&>button:hover]:!bg-surface-hover"
          showInteractive={false}
        />
      </ReactFlow>
    </div>
  );
}
