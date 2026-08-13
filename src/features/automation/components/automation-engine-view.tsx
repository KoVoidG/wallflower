// src/features/automation/components/automation-engine-view.tsx
'use client';

import { useState, useEffect } from "react";
import { 
  Zap, Play, CheckCircle2, Clock, BarChart3, Database, FileText, ArrowRight, Activity, Terminal, Shield, 
  Settings, Link as LinkIcon, RefreshCcw, ChevronRight, X, AlertTriangle, Code, Circle
} from "lucide-react";
import { useAppStore } from "@/lib/liquiflow-hooks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AutomationStep {
  name: string;
  type: "extract" | "transform" | "load" | "llm" | "audit";
  duration: number; // mock ms
  logMsgs: string[];
}

interface AutomationTask {
  id: string;
  title: string;
  description: string;
  icon: any;
  status: "idle" | "running" | "success" | "failed";
  lastRun?: Date;
  metrics: { label: string; value: string }[];
  config: { cron: string, endpoint: string, threshold: string };
  steps: AutomationStep[];
}

const INITIAL_TASKS: AutomationTask[] = [
  {
    id: "data-sync",
    title: "ERP/CRM Data Pipeline",
    description: "Extracts transaction ledgers, transforms via LLM schema mapping, and loads into DW.",
    icon: Database,
    status: "idle",
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 2),
    metrics: [
      { label: "Throughput", value: "14.2k/hr" },
      { label: "Data Quality", value: "99.8%" }
    ],
    config: { cron: "0 */4 * * *", endpoint: "wss://int.erp.local/v2/stream", threshold: "High" },
    steps: [
      { name: "Establish Secure Tunnel", type: "extract", duration: 800, logMsgs: ["Negotiating TLS 1.3 handshake...", "Token authenticated. Tunnel active."] },
      { name: "Extract Ledger Delta", type: "extract", duration: 1200, logMsgs: ["Querying diff since last cursor...", "Streaming 1,402 new rows."] },
      { name: "LLM Schema Inference", type: "llm", duration: 2000, logMsgs: ["Initializing GPT-4o embedding space...", "Resolving 4 schema conflicts via LLM mapping."] },
      { name: "Load to Data Warehouse", type: "load", duration: 1000, logMsgs: ["Batch inserting into normalized tables...", "Commit successful."] }
    ]
  },
  {
    id: "invoice-processing",
    title: "Agentic Invoice Router",
    description: "Ingests PDF invoices, performs 3-way matching via AI, and routes exceptions.",
    icon: FileText,
    status: "idle",
    metrics: [
      { label: "Queue", value: "29 items" },
      { label: "Auto-matched", value: "~70%" }
    ],
    config: { cron: "*/15 * * * *", endpoint: "api.finance.hq/invoices", threshold: "Strict" },
    steps: [
      { name: "Fetch AP Queue", type: "extract", duration: 600, logMsgs: ["Connecting to AP Inbox...", "Found 29 pending attachments."] },
      { name: "OCR & Text Splitting", type: "transform", duration: 1500, logMsgs: ["Running multi-modal bounding box analysis...", "Extracted tabular line items."] },
      { name: "Agentic 3-Way Match", type: "llm", duration: 2500, logMsgs: ["Agent spawned to cross-reference PO database.", "Match confidence: 94%.", "Exception generated for Vendor XYZ mismatch."] },
      { name: "ERP Write-back", type: "load", duration: 900, logMsgs: ["Updating 20 records in ERP.", "Sending 9 items to human review queue."] }
    ]
  },
  {
    id: "bottleneck-scan",
    title: "M/M/1 Queue Monitor",
    description: "Continuous bottleneck scanning across all departments using Operations Research math.",
    icon: Activity,
    status: "idle",
    lastRun: new Date(Date.now() - 1000 * 60 * 30),
    metrics: [
      { label: "Active Nodes", value: "14" },
      { label: "Next Run", value: "3 mins" }
    ],
    config: { cron: "* * * * *", endpoint: "internal.queue.metrics", threshold: "Normal" },
    steps: [
      { name: "Poll Department Queues", type: "extract", duration: 500, logMsgs: ["Fetching arrival rates (λ) and service rates (μ)..."] },
      { name: "Calculate Utilization (ρ)", type: "transform", duration: 800, logMsgs: ["Finance dept ρ=0.95 (CRITICAL).", "Support dept ρ=0.61 (HEALTHY)."] },
      { name: "TOC Constraint Ident", type: "llm", duration: 1500, logMsgs: ["Applying Little's Law to project queue backlogs...", "Finance identified as absolute system constraint."] }
    ]
  }
];

export function AutomationEngineView() {
  const { orgName } = useAppStore();
  const [tasks, setTasks] = useState<AutomationTask[]>(INITIAL_TASKS);
  const [selectedTask, setSelectedTask] = useState<AutomationTask | null>(INITIAL_TASKS[0]);
  
  // Per-task execution state
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [logs, setLogs] = useState<{ time: string; msg: string; type: "info" | "success" | "error" | "start" }[]>([]);

  useEffect(() => {
    // Reset view state when selecting a different task
    if (selectedTask && selectedTask.status !== "running") {
      setActiveStepIndex(-1);
      setLogs([]);
    }
  }, [selectedTask?.id]);

  const addLog = (msg: string, type: "info" | "success" | "error" | "start" = "info") => {
    setLogs(prev => {
      const newLog = { time: new Date().toLocaleTimeString(), msg, type };
      return [newLog, ...prev].slice(0, 100);
    });
  };

  const runSelectedTask = async () => {
    if (!selectedTask || selectedTask.status === "running") return;

    const setTaskStatus = (id: string, s: "idle"|"running"|"success"|"failed") => {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: s } : t));
      setSelectedTask(prev => prev && prev.id === id ? { ...prev, status: s } : prev);
    };

    setTaskStatus(selectedTask.id, "running");
    setLogs([]);
    setActiveStepIndex(0);
    addLog(`Initiating advanced engine run for [${selectedTask.title}]`, "start");

    for (let i = 0; i < selectedTask.steps.length; i++) {
      setActiveStepIndex(i);
      const step = selectedTask.steps[i];
      
      for (const msg of step.logMsgs) {
        addLog(`[${step.name}] ${msg}`, "info");
        await new Promise(r => setTimeout(r, step.duration / step.logMsgs.length));
      }
    }

    setActiveStepIndex(selectedTask.steps.length);
    setTaskStatus(selectedTask.id, "success");
    addLog(`Pipeline execution completed successfully in ${selectedTask.steps.reduce((a,b)=>a+b.duration,0)/1000}s.`, "success");
  };

  return (
    <div className="p-8 h-full flex flex-col animate-fade-in relative">
      <div className="flex items-start justify-between mb-8 z-10 shrink-0">
        <div>
          <div className="text-xs uppercase tracking-widest text-text-muted mb-2">Wallflower Core</div>
          <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
            Automation Engine
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 bg-brand-soft/20 text-brand rounded-md border border-brand/30">
              Agentic v2
            </span>
          </h1>
          <p className="text-text-secondary mt-2 max-w-xl">
            Design and orchestrate multi-step agentic pipelines. Configure node parameters, monitor runtime telemtry, and connect to internal APIs for <span className="text-text-primary font-medium">{orgName}</span>.
          </p>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0 z-10">
        <div className="w-[380px] flex flex-col gap-4 overflow-y-auto pr-2 pb-8">
          <div className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-1 flex items-center gap-2">
           <Activity className="w-3.5 h-3.5" /> Deployed Pipelines
          </div>
          
          {tasks.map((task) => {
            const isSelected = selectedTask?.id === task.id;
            return (
              <button 
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`text-left w-full rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden bg-surface shadow-2xs ${
                  isSelected 
                    ? "border-brand/60 bg-brand-soft/10 shadow-[0_0_20px_rgba(var(--brand),0.15)]" 
                    : "border-border/60 hover:border-border hover:bg-surface-hover"
                }`}
              >
                {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand shadow-[0_0_10px_rgba(var(--brand),1)]" />}
                
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl border flex-shrink-0 ${
                    task.status === "running" ? "bg-brand/20 border-brand/40 text-brand" :
                    task.status === "success" ? "bg-success/10 border-success/20 text-success" :
                    "bg-surface-subtle border-border/60 text-text-secondary"
                  }`}>
                    <task.icon className={`w-6 h-6 ${task.status === "running" ? "animate-pulse" : ""}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold truncate text-base ${isSelected ? "text-text-primary" : "text-text-secondary"}`}>{task.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {task.status === "running" ? (
                        <span className="text-[11px] text-brand font-bold tracking-widest items-center flex gap-1.5 uppercase">
                           <RefreshCcw className="w-3 h-3 animate-spin"/> Running
                        </span>
                      ) : (
                        <span className="text-[11px] text-text-muted items-center flex gap-1.5">
                          <Clock className="w-3 h-3" />
                          {task.lastRun ? `Run: ${task.lastRun.toLocaleTimeString()}` : "Never run"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {selectedTask ? (
          <div className="flex-1 bg-surface rounded-2xl border border-border/80 flex flex-col overflow-hidden relative shadow-md">
            <div className="h-16 border-b border-border/60 bg-surface-subtle flex items-center justify-between px-6 shrink-0">
               <div className="flex items-center gap-3">
                 <selectedTask.icon className="w-5 h-5 text-brand" />
                 <h2 className="font-bold text-lg text-text-primary">{selectedTask.title}</h2>
                 <span className="px-2 py-0.5 rounded-md bg-surface border border-border/60 text-[10px] text-text-muted font-mono flex items-center gap-1.5">
                   ID: {selectedTask.id}
                 </span>
               </div>
               
               <Button
                  onClick={runSelectedTask}
                  disabled={selectedTask.status === "running"}
                  variant="primary"
                  className="flex items-center gap-2 px-5 py-2"
                >
                  {selectedTask.status === "running" ? (
                    <><RefreshCcw className="w-3.5 h-3.5 animate-spin" /> In Progress...</>
                  ) : (
                    <><Play className="w-3.5 h-3.5 fill-current" /> Execute Pipeline</>
                  )}
                </Button>
            </div>

            <div className="flex flex-1 min-h-0">
              <div className="w-[45%] border-r border-border/60 overflow-y-auto p-6 bg-surface">
                 
                 <h3 className="text-xs uppercase tracking-widest text-text-muted font-semibold flex items-center gap-2 mb-6">
                   <Settings className="w-3.5 h-3.5"/> Parameter Config
                 </h3>
                 
                 <div className="space-y-4 mb-8">
                   <div>
                     <label className="text-[10px] text-text-muted uppercase tracking-widest pl-1 mb-1 block">Cron Schedule</label>
                     <div className="flex px-3 py-2 bg-surface-subtle border border-border/60 rounded-lg text-text-primary font-mono text-xs items-center justify-between">
                       {selectedTask.config.cron}
                       <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand/10 text-brand">Active</span>
                     </div>
                   </div>
                   <div>
                     <label className="text-[10px] text-text-muted uppercase tracking-widest pl-1 mb-1 block">Target Endpoint</label>
                     <div className="flex px-3 py-2 bg-surface-subtle border border-border/60 rounded-lg text-text-primary font-mono text-xs items-center gap-2 truncate">
                       <LinkIcon className="w-3 h-3 text-text-muted shrink-0" />
                       {selectedTask.config.endpoint}
                     </div>
                   </div>
                 </div>

                 <h3 className="text-xs uppercase tracking-widest text-text-muted font-semibold flex items-center gap-2 mb-6">
                   <ArrowRight className="w-3.5 h-3.5"/> Execution Nodes
                 </h3>

                 <div className="relative">
                   <div className="absolute left-[15px] top-[20px] bottom-[30px] w-[2px] bg-border/60" />

                   <div className="space-y-6">
                     {selectedTask.steps.map((step, idx) => {
                       const isPast = activeStepIndex > idx;
                       const isActive = activeStepIndex === idx;
                       const isPending = activeStepIndex < idx && activeStepIndex !== -1;
                       const isIdle = activeStepIndex === -1;
                       
                       let nodeColor = "border-border/60 bg-surface-subtle text-text-muted";
                       let icon = <Circle className="w-4 h-4" />;
                       
                       if (isPast) {
                         nodeColor = "border-success/40 bg-success/10 text-success";
                         icon = <CheckCircle2 className="w-4 h-4" />;
                       } else if (isActive) {
                         nodeColor = "border-brand bg-brand-soft/20 text-brand shadow-[0_0_15px_rgba(var(--brand),0.5)]";
                         icon = <RefreshCcw className="w-4 h-4 animate-spin" />;
                       } else if (isPending) {
                         nodeColor = "border-border/40 bg-surface text-text-muted";
                         icon = <Circle className="w-4 h-4" />;
                       }

                       return (
                         <div key={idx} className="relative flex items-start gap-4">
                           <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all duration-300 ${nodeColor} bg-surface`}>
                             {icon}
                           </div>
                           <div className={`flex-1 pt-1 ${isActive ? 'opacity-100' : isPending ? 'opacity-40' : 'opacity-80'}`}>
                             <div className="text-sm font-bold text-text-primary">{step.name}</div>
                             <div className="text-[10px] font-mono text-text-secondary flex items-center gap-2 mt-1 uppercase">
                               <span className="px-1.5 rounded bg-surface-subtle border border-border/60">{step.type}</span>
                               <span>~{step.duration}ms</span>
                             </div>
                           </div>
                         </div>
                       )
                     })}
                   </div>
                 </div>
              </div>

              <div className="flex-1 bg-[#1a1c23] flex flex-col relative rounded-br-2xl overflow-hidden">
                <div className="h-10 border-b border-white/10 flex items-center px-4 shrink-0 bg-white/5">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold flex-1">
                    <Terminal className="w-3.5 h-3.5" /> Telemetry Stream
                  </div>
                  {selectedTask.status === "running" && (
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] uppercase tracking-widest font-bold text-brand animate-pulse">Live</span>
                       <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                    </div>
                  )}
                </div>

                <div className="flex-1 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed flex flex-col-reverse relative z-10">
                   <div className="space-y-2">
                     {logs.map((log, i) => (
                        <div key={i} className="flex items-start gap-3 animate-fade-in group hover:bg-white/5 p-1 -mx-1 rounded break-words">
                           <span className="text-slate-500 flex-shrink-0 w-16 select-none">{log.time}</span>
                           <span className={`flex-1 ${
                             log.type === "success" ? "text-emerald-400" :
                             log.type === "error" ? "text-rose-400" : 
                             log.type === "start" ? "text-brand font-bold" :
                             "text-slate-300"
                           }`}>
                             {log.type === "start" && <ChevronRight className="w-3 h-3 inline mr-1 -mt-0.5" />}
                             {log.msg}
                           </span>
                        </div>
                     ))}
                     {logs.length === 0 && (
                       <div className="pt-20 flex flex-col items-center justify-center text-slate-500 gap-3 opacity-50 select-none">
                          <Code className="w-10 h-10" />
                          <p>Awaiting engine start command...</p>
                       </div>
                     )}
                   </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-surface rounded-2xl border border-border/60 flex flex-col items-center justify-center text-text-muted">
            <Activity className="w-12 h-12 mb-4 opacity-20" />
            <p>Select a pipeline to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
}
