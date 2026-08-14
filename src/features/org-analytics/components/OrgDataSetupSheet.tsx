"use client";

import { useState, useRef } from "react";
import type { Department, WorkflowStep } from "@/lib/liquiflow-types";
import {
  useAppStore,
  parseDepartmentsCSV,
  parseWorkflowsCSV,
  generateDepartmentsCSVTemplate,
  generateWorkflowsCSVTemplate,
} from "@/lib/liquiflow-hooks";
import { ORG_PROFILES } from "@/lib/liquiflow-demo-data";

function downloadText(content: string, filename: string, type = "text/csv") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Compact department row editor
function DeptRow({
  dept,
  onChange,
  onDelete,
}: {
  dept: Department;
  onChange: (d: Department) => void;
  onDelete: () => void;
}) {
  const cell = (
    field: keyof Department,
    type: "text" | "number" = "number",
    placeholder = ""
  ) => (
      <input
        type={type}
        value={dept[field] as string | number}
        onChange={(e) =>
          onChange({
            ...dept,
            [field]: type === "number" ? parseFloat(e.target.value) || 0 : e.target.value,
          })
        }
        placeholder={placeholder}
        className="w-full bg-transparent text-xs text-text-secondary focus:outline-none focus:text-text-primary border-b border-border/40 focus:border-brand py-1 transition-colors"
      />
  );

  return (
    <tr className="border-b border-white/5 group">
      <td className="py-2 pr-3">{cell("name", "text", "Department name")}</td>
      <td className="py-2 pr-3 w-16">{cell("headcount")}</td>
      <td className="py-2 pr-3 w-20">{cell("avgTasksPerWeek")}</td>
      <td className="py-2 pr-3 w-24">{cell("avgResponseTimeHours")}</td>
      <td className="py-2 pr-3 w-20">{cell("pendingApprovals")}</td>
      <td className="py-2 pr-3 w-16">{cell("overdueItems")}</td>
      <td className="py-2 pr-3 w-16">{cell("meetingsPerWeek")}</td>
      <td className="py-2 w-8">
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-danger transition-all text-sm"
        >
          ×
        </button>
      </td>
    </tr>
  );
}

function WfRow({
  wf,
  deptNames,
  onChange,
  onDelete,
}: {
  wf: WorkflowStep;
  deptNames: string[];
  onChange: (w: WorkflowStep) => void;
  onDelete: () => void;
}) {
  return (
    <tr className="border-b border-border/20 group">
      <td className="py-2 pr-3">
        <input
          type="text"
          value={wf.name}
          onChange={(e) => onChange({ ...wf, name: e.target.value })}
          className="w-full bg-transparent text-xs text-text-secondary focus:outline-none focus:text-text-primary border-b border-border/40 focus:border-brand py-1"
        />
      </td>
      <td className="py-2 pr-3 w-36">
        <select
          value={wf.department}
          onChange={(e) => onChange({ ...wf, department: e.target.value })}
          className="w-full bg-transparent text-xs text-text-secondary focus:outline-none border-b border-border/40 py-1 cursor-pointer"
        >
          {deptNames.map((d) => (
            <option key={d} value={d} className="bg-surface">
              {d}
            </option>
          ))}
        </select>
      </td>
      <td className="py-2 pr-3 w-24">
        <input
          type="number"
          value={wf.avgDurationHours}
          onChange={(e) => onChange({ ...wf, avgDurationHours: parseFloat(e.target.value) || 0 })}
          className="w-full bg-transparent text-xs text-text-secondary focus:outline-none border-b border-border/40 py-1"
        />
      </td>
      <td className="py-2 pr-3 w-20">
        <input
          type="number"
          value={wf.errorRate}
          step={0.01}
          min={0}
          max={1}
          onChange={(e) => onChange({ ...wf, errorRate: parseFloat(e.target.value) || 0 })}
          className="w-full bg-transparent text-xs text-text-secondary focus:outline-none border-b border-border/40 py-1"
        />
      </td>
      <td className="py-2 pr-3 w-16">
        <input
          type="number"
          value={wf.volume}
          onChange={(e) => onChange({ ...wf, volume: parseInt(e.target.value) || 0 })}
          className="w-full bg-transparent text-xs text-text-secondary focus:outline-none border-b border-border/40 py-1"
        />
      </td>
      <td className="py-2 w-8">
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-danger transition-all text-sm"
        >
          ×
        </button>
      </td>
    </tr>
  );
}

export function OrgDataSetupSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { departments, workflows, setOrgData, loadProfile, orgName, syncWithWallflower } = useAppStore();
  const [mainTab, setMainTab] = useState<"templates" | "custom" | "wallflower">("wallflower");
  const [customTab, setCustomTab] = useState<"departments" | "workflows">("departments");
  
  const [localDepts, setLocalDepts] = useState<Department[]>([...departments]);
  const [localWfs, setLocalWfs] = useState<WorkflowStep[]>([...workflows]);
  const [localOrgName, setLocalOrgName] = useState(orgName);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const wasOpen = useRef(false);
  if (open && !wasOpen.current) {
    wasOpen.current = true;
    setLocalDepts([...departments]);
    setLocalWfs([...workflows]);
    setLocalOrgName(orgName);
    setError(null);
    setSaved(false);
    setMainTab("wallflower");
  }
  if (!open) wasOpen.current = false;

  const handleDeptCSV = (content: string) => {
    try {
      const parsed = parseDepartmentsCSV(content);
      setLocalDepts(parsed);
      setError(null);
    } catch (e) {
      setError("Departments CSV: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  const handleWfCSV = (content: string) => {
    try {
      const parsed = parseWorkflowsCSV(content);
      setLocalWfs(parsed);
      setError(null);
    } catch (e) {
      setError("Workflows CSV: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  const addDept = () => {
    const id = `dept-${Date.now()}`;
    setLocalDepts((d) => [
      ...d,
      { id, name: "New Department", headcount: 5, avgTasksPerWeek: 50, avgResponseTimeHours: 6, pendingApprovals: 5, overdueItems: 2, meetingsPerWeek: 8 },
    ]);
  };

  const addWf = () => {
    const id = `wf-${Date.now()}`;
    setLocalWfs((w) => [
      ...w,
      { id, name: "New Workflow", department: localDepts[0]?.name ?? "", avgDurationHours: 24, errorRate: 0.05, volume: 10 },
    ]);
  };

  const save = () => {
    if (localDepts.length === 0) {
      setError("Add at least one department");
      return;
    }
    setOrgData(localDepts, localWfs, localOrgName);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-surface-subtle/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] flex flex-col bg-surface border border-border/80 shadow-2xl rounded-2xl overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-soft/20 border border-brand/30 flex items-center justify-center text-sm text-brand">
              ⬡
            </div>
            <div>
              <div className="text-sm font-semibold text-text-primary">Organization Data Setup</div>
              <div className="text-xs text-text-muted">Define your org structure</div>
            </div>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">×</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border/80">
          <button onClick={() => setMainTab("wallflower")} className={`flex-1 py-3 text-sm font-medium transition-colors ${mainTab === "wallflower" ? "text-brand border-b-2 border-brand bg-brand-soft/10" : "text-text-muted hover:text-text-primary"}`}>Wallflower DB</button>
          <button onClick={() => setMainTab("templates")} className={`flex-1 py-3 text-sm font-medium transition-colors ${mainTab === "templates" ? "text-brand border-b-2 border-brand bg-brand-soft/10" : "text-text-muted hover:text-text-primary"}`}>Industry Templates</button>
          <button onClick={() => setMainTab("custom")} className={`flex-1 py-3 text-sm font-medium transition-colors ${mainTab === "custom" ? "text-brand border-b-2 border-brand bg-brand-soft/10" : "text-text-muted hover:text-text-primary"}`}>Custom Org Setup</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {mainTab === "wallflower" && (
            <div className="p-6 flex flex-col items-center justify-center text-center h-full space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-soft/20 border border-brand/30 flex items-center justify-center text-brand mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
              </div>
              <h3 className="text-lg font-bold text-text-primary">Sync with Wallflower Database</h3>
              <p className="text-sm text-text-muted max-w-md">
                Dynamically generate your organizational structure (departments, headcounts, and workflows) directly from your active Wallflower Business and Financial Snapshot records.
              </p>
              <button 
                onClick={async () => {
                  setError(null);
                  try {
                    await syncWithWallflower();
                    setSaved(true);
                    setTimeout(() => {
                      setSaved(false);
                      onClose();
                    }, 1000);
                  } catch (e: any) {
                    setError("Failed to sync: " + e.message);
                  }
                }}
                className="mt-4 px-6 py-2.5 text-sm font-semibold rounded-xl bg-brand hover:bg-brand-hover text-white transition-colors"
              >
                {saved ? "Synced successfully!" : "Sync Data Now"}
              </button>
              {error && <div className="text-xs text-danger mt-2">{error}</div>}
            </div>
          )}

          {mainTab === "templates" && (
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              {ORG_PROFILES.map((profile) => (
                <div key={profile.id} className="bg-surface-subtle/50 border border-border/60 rounded-xl p-5 hover:border-brand/50 transition-colors flex flex-col">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-brand mb-1">{profile.industry}</div>
                  <h3 className="text-base font-bold text-text-primary mb-2">{profile.name}</h3>
                  <p className="text-xs text-text-muted mb-4 flex-1">{profile.description}</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-surface-subtle/30 rounded-lg p-2 text-center">
                      <div className="text-[10px] text-text-muted/70">Depts</div>
                      <div className="text-sm font-semibold text-text-secondary">{profile.departments.length}</div>
                    </div>
                    <div className="bg-surface-subtle/30 rounded-lg p-2 text-center">
                      <div className="text-[10px] text-text-muted/70">Workflows</div>
                      <div className="text-sm font-semibold text-text-secondary">{profile.workflows.length}</div>
                    </div>
                  </div>
                  <button onClick={() => { loadProfile(profile.id); onClose(); }} className="w-full text-xs font-semibold rounded-lg bg-brand hover:opacity-90 text-white py-2 transition-colors">
                    Load Profile
                  </button>
                </div>
              ))}
            </div>
          )}

          {mainTab === "custom" && (
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-4 px-6 py-3 border-b border-border/80 bg-surface">
                <label className="text-xs text-text-muted">Org Name</label>
                <input value={localOrgName} onChange={(e) => setLocalOrgName(e.target.value)} className="flex-1 bg-surface-subtle border border-border/60 rounded-md px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-brand" />
              </div>
              
              <div className="flex gap-1 px-6 pt-3">
                <button onClick={() => setCustomTab("departments")} className={`px-4 py-2 rounded-t-lg text-xs font-medium border-b-2 ${customTab === "departments" ? "text-brand border-brand bg-brand-soft/10" : "text-text-muted border-transparent hover:text-text-primary"}`}>Departments</button>
                <button onClick={() => setCustomTab("workflows")} className={`px-4 py-2 rounded-t-lg text-xs font-medium border-b-2 ${customTab === "workflows" ? "text-brand border-brand bg-brand-soft/10" : "text-text-muted border-transparent hover:text-text-primary"}`}>Workflows</button>
              </div>

              <div className="flex-1 overflow-auto px-6 py-2 bg-surface-subtle/50">
                <div className="flex gap-2 mb-4">
                  <label className="text-[10px] px-3 py-1.5 rounded-md border border-border/60 hover:bg-surface-subtle text-text-secondary cursor-pointer">
                    <input type="file" accept=".csv" className="hidden" onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) { const r = new FileReader(); r.onload = (ev) => customTab === "departments" ? handleDeptCSV(ev.target?.result as string) : handleWfCSV(ev.target?.result as string); r.readAsText(f); }
                    }} />
                    ↑ Upload CSV
                  </label>
                  <button onClick={() => downloadText(customTab === "departments" ? generateDepartmentsCSVTemplate() : generateWorkflowsCSVTemplate(), "template.csv")} className="text-[10px] px-3 py-1.5 rounded-md border border-border/60 hover:bg-surface-subtle text-text-secondary">
                    ↓ Download Template
                  </button>
                  <button onClick={customTab === "departments" ? addDept : addWf} className="ml-auto text-[10px] px-3 py-1.5 rounded-md bg-brand-soft/20 border border-brand/30 text-brand hover:bg-brand-soft/30">
                    + Add Row
                  </button>
                </div>

                <table className="w-full" style={{ minWidth: 650 }}>
                  <thead>
                    <tr className="text-[10px] uppercase tracking-widest text-text-muted/70 border-b border-border/80">
                      {customTab === "departments" ? (
                        <>
                          <th className="text-left pb-2 font-normal">Name</th><th className="text-left pb-2 w-16">HC</th><th className="text-left pb-2 w-16">Tasks/wk</th><th className="text-left pb-2 w-20">Resp Time(h)</th><th className="text-left pb-2 w-16">Pending</th><th className="text-left pb-2 w-16">Overdue</th><th className="text-left pb-2 w-16">Mtgs/wk</th>
                        </>
                      ) : (
                        <>
                          <th className="text-left pb-2 font-normal">Name</th><th className="text-left pb-2 w-32">Department</th><th className="text-left pb-2 w-20">Duration(h)</th><th className="text-left pb-2 w-16">Error %</th><th className="text-left pb-2 w-16">Vol/wk</th>
                        </>
                      )}
                      <th className="w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {customTab === "departments" 
                      ? localDepts.map((d, i) => <DeptRow key={d.id} dept={d} onChange={(u) => setLocalDepts(p => p.map((x, j) => j===i ? u : x))} onDelete={() => setLocalDepts(p => p.filter((_,j) => j!==i))} />)
                      : localWfs.map((w, i) => <WfRow key={w.id} wf={w} deptNames={localDepts.map(d=>d.name)} onChange={(u) => setLocalWfs(p => p.map((x, j) => j===i ? u : x))} onDelete={() => setLocalWfs(p => p.filter((_,j) => j!==i))} />)
                    }
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {mainTab === "custom" && (
          <div className="flex items-center justify-between border-t border-border/80 px-6 py-3 bg-surface">
            <div className="text-xs text-text-muted">
              {error ? <span className="text-danger">⚠ {error}</span> : `${localDepts.length} depts, ${localWfs.length} workflows`}
            </div>
            <div className="flex gap-2">
              <button onClick={onClose} className="text-xs px-4 py-1.5 rounded-md border border-border/60 text-text-secondary hover:bg-surface-subtle">Cancel</button>
              <button onClick={save} disabled={localDepts.length === 0} className="text-xs px-4 py-1.5 rounded-md bg-brand text-white hover:opacity-90 disabled:opacity-50">
                {saved ? "✓ Saved" : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
