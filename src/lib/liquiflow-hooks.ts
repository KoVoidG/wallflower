"use client";

import { useState, useEffect, useRef } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Department, WorkflowStep } from "./liquiflow-types";
import { ORG_PROFILES } from "./liquiflow-demo-data";

// ─── App Store ────────────────────────────────────────────────────────────────

interface OrgDataStore {
  isDemoMode: boolean;
  departments: Department[];
  workflows: WorkflowStep[];
  orgName: string;
  lastUpdated: string | null;
  // Actions
  toggleDemo: () => void;
  setOrgData: (departments: Department[], workflows: WorkflowStep[], orgName?: string) => void;
  loadProfile: (profileId: string) => void;
  resetData: () => void;
  syncWithWallflower: () => Promise<void>;
}

export const useAppStore = create<OrgDataStore>()(
  persist(
    (set) => ({
      isDemoMode: true,
      departments: ORG_PROFILES[0].departments,
      workflows: ORG_PROFILES[0].workflows,
      orgName: ORG_PROFILES[0].name,
      lastUpdated: null,

      toggleDemo: () =>
        set((state) => ({
          isDemoMode: !state.isDemoMode,
        })),

      setOrgData: (departments, workflows, orgName) =>
        set({
          departments,
          workflows,
          orgName: orgName ?? "My Organization",
          lastUpdated: new Date().toISOString(),
          isDemoMode: false,
        }),

      loadProfile: (profileId: string) => {
        const profile = ORG_PROFILES.find((p) => p.id === profileId) || ORG_PROFILES[0];
        set({
          departments: profile.departments,
          workflows: profile.workflows,
          orgName: profile.name,
          isDemoMode: true,
          lastUpdated: null,
        });
      },

      resetData: () =>
        set({
          departments: [],
          workflows: [],
          orgName: "New Organization",
          isDemoMode: true,
          lastUpdated: null,
        }),

      syncWithWallflower: async () => {
        try {
          const res = await fetch("/api/liquiflow/sync");
          if (!res.ok) throw new Error("Failed to sync with Wallflower");
          const data = await res.json();
          if (data.success) {
            set({
              orgName: data.orgName,
              departments: data.departments,
              workflows: data.workflows,
              isDemoMode: data.isMockData ? true : false,
              lastUpdated: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error("Failed to sync Wallflower data:", error);
        }
      },
    }),
    {
      name: "liquiflow-org-data",
      // Only persist the data, not loading/error states
      partialize: (state) => ({
        departments: state.departments,
        workflows: state.workflows,
        orgName: state.orgName,
        isDemoMode: state.isDemoMode,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);

// ─── CSV Parsing Utilities ────────────────────────────────────────────────────

export function parseDepartmentsCSV(csv: string): Department[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) throw new Error("CSV must have a header row and at least one data row");
  
  const header = lines[0].toLowerCase().split(",").map((h) => h.trim().replace(/"/g, ""));
  
  const required = ["name", "headcount"];
  for (const req of required) {
    if (!header.includes(req)) throw new Error(`CSV missing required column: "${req}"`);
  }

  return lines.slice(1).map((line, i) => {
    const vals = parseCSVLine(line);
    const get = (col: string) => vals[header.indexOf(col)] ?? "";
    const num = (col: string, def = 0) => parseFloat(get(col)) || def;

    return {
      id: `dept-${i + 1}`,
      name: get("name") || `Department ${i + 1}`,
      headcount: num("headcount", 1),
      avgTasksPerWeek: num("avgtasksperweek") || num("tasks_per_week") || num("weekly_tasks", 50),
      avgResponseTimeHours: num("avgresponsetimehours") || num("response_time_hours", 6),
      pendingApprovals: num("pendingapprovals") || num("pending_approvals", 5),
      overdueItems: num("overdueitems") || num("overdue_items", 2),
      meetingsPerWeek: num("meetingsperweek") || num("meetings_per_week", 8),
    };
  });
}

export function parseWorkflowsCSV(csv: string): WorkflowStep[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) throw new Error("CSV must have a header row and at least one data row");
  
  const header = lines[0].toLowerCase().split(",").map((h) => h.trim().replace(/"/g, ""));
  const required = ["name", "department"];
  for (const req of required) {
    if (!header.includes(req)) throw new Error(`CSV missing required column: "${req}"`);
  }

  return lines.slice(1).map((line, i) => {
    const vals = parseCSVLine(line);
    const get = (col: string) => vals[header.indexOf(col)] ?? "";
    const num = (col: string, def = 0) => parseFloat(get(col)) || def;

    return {
      id: `wf-${i + 1}`,
      name: get("name") || `Workflow ${i + 1}`,
      department: get("department"),
      avgDurationHours: num("avgdurationhours") || num("duration_hours", 24),
      errorRate: Math.min(1, num("errorrate") || num("error_rate", 0.05)),
      volume: num("volume") || num("weekly_volume", 10),
    };
  });
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// CSV template generators
export function generateDepartmentsCSVTemplate(): string {
  const header = "name,headcount,avgTasksPerWeek,avgResponseTimeHours,pendingApprovals,overdueItems,meetingsPerWeek";
  const example = [
    "Finance,12,145,8.2,18,5,9",
    "Human Resources,8,98,6.1,22,7,11",
    "Operations,25,320,4.5,41,12,18",
  ].join("\n");
  return `${header}\n${example}`;
}

export function generateWorkflowsCSVTemplate(): string {
  const header = "name,department,avgDurationHours,errorRate,volume";
  const example = [
    "Leave Request Approval,Human Resources,18.5,0.06,45",
    "Expense Reimbursement,Finance,52.0,0.12,38",
    "Vendor Invoice Processing,Finance,71.2,0.15,29",
  ].join("\n");
  return `${header}\n${example}`;
}

// ─── Animation Hooks ──────────────────────────────────────────────────────────

/** Animates a number from 0 to `target` over `duration`ms */
export function useCountUp(target: number, duration = 1200, delay = 0) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      startRef.current = null;
      const tick = (ts: number) => {
        if (!startRef.current) startRef.current = ts;
        const elapsed = ts - startRef.current;
        const progress = Math.min(elapsed / duration, 1);
        // ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(target * eased));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, delay]);

  return value;
}

/** Simulates AI typewriter effect, returns {text, done} */
export function useTypewriter(
  fullText: string,
  speed = 18,
  enabled = true
): { text: string; done: boolean } {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!enabled || !fullText) return;
    const timer = setTimeout(() => setIndex(0), 0);
    const interval = setInterval(() => {
      setIndex((i) => {
        if (i >= fullText.length) {
          clearInterval(interval);
          return i;
        }
        return i + 1;
      });
    }, speed);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [fullText, speed, enabled]);

  return { text: fullText.slice(0, index), done: index >= fullText.length };
}

/** Returns true once the element enters the viewport */
export function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}
