"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Settings,
  Terminal,
  RefreshCcw,
  Activity,
  StopCircle,
  Code,
  FlaskConical,
  Zap,
} from "lucide-react";
import { AppPage } from "@/components/ui/layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ─── Demo Presets ─────────────────────────────────────────────────────────────

const DEMO_PRESETS: Array<{
  label: string;
  system: string;
  user: string;
  temperature: number;
  jsonFormat: boolean;
  response: string;
}> = [
  {
    label: "Bottleneck Summary",
    system:
      "You are an operations research analyst. Provide concise, quantified insights based on the data provided.",
    user: "Summarise the top bottleneck in this org: Finance dept, 12 people, 71h invoice cycle time, 15% error rate, 29 invoices/week.",
    temperature: 0.3,
    jsonFormat: false,
    response: `## Bottleneck Analysis — Finance / Vendor Invoice Processing

**Primary Constraint (Theory of Constraints):**
Vendor Invoice Processing is the binding system constraint.

**Key Metrics:**
- Cycle time: 71.2h (Aberdeen median: 13.1 days = 314h, but top-quartile is 24h — you are well above best-in-class)
- Error rate: 15% → DPMO: 150,000 → Sigma level: 2.6σ (best-in-class is 4.0σ, ~63 DPMO)
- Volume: 29 invoices/week × 71.2h = **2,064.8 demand-hours/week** against a 12-person Finance team with ~480h capacity

**Little's Law (L = λW):**
λ = 29/wk, W = 71.2h → L = **86.3 invoices perpetually in-flight**

**Root Cause:**
Manual data entry is responsible for ~60–70% of the 15% error rate. Each error adds ~19h of rework, consuming **82.7 hours/week** (≈ 2.1 FTE-days).

**Recommended Fix:**
1. OCR-based extraction → error rate: 15% → 4% within 4 weeks
2. 3-way PO matching → error rate: <2%, auto-approves 70% of invoices
3. Target: 71.2h → 42.7h cycle time (−40%), saving ~$12,400/week`,
  },
  {
    label: "JSON: Dept Health",
    system:
      "You are a business analyst. Always respond with valid JSON only. No markdown, no explanation outside the JSON object.",
    user: "Generate a health assessment JSON for: Operations dept, 25 staff, 320 tasks/wk, 4.5h response time, 41 pending approvals, 12 overdue.",
    temperature: 0.2,
    jsonFormat: true,
    response: `{
  "department": "Operations",
  "healthScore": 42,
  "status": "critical",
  "metrics": {
    "headcount": 25,
    "tasksPerWeek": 320,
    "avgResponseTimeHours": 4.5,
    "pendingApprovals": 41,
    "overdueItems": 12,
    "utilizationPct": 138
  },
  "flags": [
    {
      "severity": "critical",
      "issue": "Approval queue overload",
      "detail": "41 pending approvals vs APQC median of 8 — queue is 412% above benchmark"
    },
    {
      "severity": "high",
      "issue": "Overdue backlog",
      "detail": "12 overdue items indicate systemic SLA breach; items are not being escalated"
    },
    {
      "severity": "medium",
      "issue": "Utilization above sustainable threshold",
      "detail": "M/M/1 model: at 138% utilization, queue is mathematically unstable and grows indefinitely"
    }
  ],
  "recommendations": [
    "Delegate PO approvals under $10,000 to team leads — removes ~65% of queue items",
    "Enable 48h SLA auto-escalation to prevent overdue accumulation",
    "Cap meetings at 10/week to free 9h/manager/week for approval processing"
  ],
  "estimatedWeeklyHoursLost": 137,
  "estimatedWeeklyCostUSD": 4795
}`,
  },
  {
    label: "Workflow Action Plan",
    system:
      "You are a process improvement consultant specialising in Lean Six Sigma and Theory of Constraints.",
    user: "Provide a 3-step action plan to reduce new employee onboarding time from 96h to under 48h.",
    temperature: 0.5,
    jsonFormat: false,
    response: `## Onboarding Cycle Reduction: 96h → <48h

**Current State:** 96h avg onboarding cycle (SHRM benchmark: best-in-class is 48h for administrative onboarding, 30-day full productivity ramp).

---

### Step 1 — Pre-boarding Digitisation (Weeks 1–2)
**Action:** Move all paperwork (contracts, tax forms, policy acknowledgements) to a self-service digital portal accessible before Day 1.
**Impact:** Eliminates ~24h of Day 1 admin processing. New hires arrive "document-complete."
**Effort:** Low — most HRIS platforms support this natively.

---

### Step 2 — Parallel Provisioning (Week 2)
**Action:** Trigger IT provisioning (laptop, accounts, access rights) the moment an offer is accepted, not on Day 1.
**Impact:** Removes the single largest delay block: IT setup currently adds ~18–22h to the onboarding cycle.
**Effort:** Low — requires a workflow automation rule in your HRIS/IT ticketing system.

---

### Step 3 — Structured 30/60/90 Buddy Programme (Week 3+)
**Action:** Assign a trained buddy for each new hire with a templated daily schedule for the first 5 days.
**Impact:** Cuts knowledge-transfer time by ~30% vs. ad-hoc onboarding (SHRM: structured programmes reach full productivity 25% faster).
**Effort:** Medium — requires buddy training (2h) and template creation.

---

**Projected Result:** 96h → **44h** cycle time. Remaining 44h represents mandatory orientation content that cannot be safely compressed further.`,
  },
  {
    label: "Casual Chat",
    system:
      "You are a friendly AI assistant. Keep responses brief and conversational.",
    user: "What is Wallflower and what does it do?",
    temperature: 0.8,
    jsonFormat: false,
    response: `Wallflower is an AI-powered business intelligence platform that helps organisations understand and improve their operations.

Here's what it does:

🔍 **Bottleneck Detection** — Analyses your departments and workflows using Operations Research algorithms (Little's Law, Theory of Constraints, M/M/1 queuing) to pinpoint exactly where work is getting stuck.

🎮 **Business Simulation** — Lets you run "what-if" scenarios before committing to changes. Hire 10 people or automate Finance — simulate both and compare the outcome.

🤖 **Agentic Workflow** — A 4-agent AI pipeline (Planner → Researcher → Critic → Synthesizer) that produces rigorous, phased action plans backed by quantitative analysis.

📄 **Document Ingestion** — Paste a raw operations report; the multi-agent pipeline extracts departments, workflows, and KPIs automatically.

🔗 **App Integrations** — Pull live data directly from Jira, Linear, GitHub, Notion, Asana, and 10 more tools.

All analysis is grounded in real industry benchmarks (APQC, Aberdeen Group, SHRM, McKinsey) rather than generic AI guesses.`,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getNow(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

// ─── Page Component ────────────────────────────────────────────────────────────

export default function PlaygroundPage() {
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful AI assistant. Answer concisely."
  );
  const [userMessage, setUserMessage] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [jsonFormat, setJsonFormat] = useState(false);

  const [responseOutput, setResponseOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState({ latency: 0, tokens: 0 });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const demoAbortRef = useRef(false);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [responseOutput]);

  const handleRunTest = async () => {
    if (!userMessage.trim()) return;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setResponseOutput("");
    setErrorMsg(null);
    setMetrics({ latency: 0, tokens: 0 });

    const startTime = getNow();

    // Call the Gemini-powered ingest endpoint in "chat" mode by sending a
    // combined system + user prompt as the document text.
    const fullPrompt = `SYSTEM INSTRUCTIONS:\n${systemPrompt}\n\n---\n\nUSER MESSAGE:\n${userMessage}`;

    try {
      const response = await fetch("/api/liquiflow/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // The ingest route expects `text` — we pass our prompt as the doc
          text: fullPrompt,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          const lines = part.split("\n");
          let eventType = "";
          let dataStr = "";
          for (const line of lines) {
            if (line.startsWith("event: ")) eventType = line.slice(7).trim();
            if (line.startsWith("data: ")) dataStr = line.slice(6).trim();
          }
          if (!dataStr) continue;

          try {
            const data = JSON.parse(dataStr);
            if (eventType === "status") {
              if (data.state === "done" && data.content) {
                // Show the synthesized textual output from the Extractor step
                // which most closely resembles a direct AI response
                if (data.agent === "extractor") {
                  setResponseOutput(data.content);
                  const approxTokens = Math.floor(data.content.length / 4);
                  setMetrics({ latency: Math.round(getNow() - startTime), tokens: approxTokens });
                }
              }
            } else if (eventType === "result") {
              // The final synthesized result — show the finalReport if present
              if (data.finalReport) {
                setResponseOutput(
                  (prev) =>
                    prev +
                    (prev ? "\n\n---\n\n**Final Synthesis:**\n" + data.finalReport : data.finalReport)
                );
              }
              setMetrics((prev) => ({
                ...prev,
                latency: Math.round(getNow() - startTime),
              }));
            } else if (eventType === "error") {
              setErrorMsg(data.message || "An error occurred");
            }
          } catch {
            // ignore parse errors
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        setErrorMsg(err.message || "An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // Demo runner — streams canned response char by char
  const handleRunDemo = async (preset: (typeof DEMO_PRESETS)[number]) => {
    setSystemPrompt(preset.system);
    setUserMessage(preset.user);
    setTemperature(preset.temperature);
    setJsonFormat(preset.jsonFormat);
    setResponseOutput("");
    setErrorMsg(null);
    setMetrics({ latency: 0, tokens: 0 });
    setIsDemoRunning(true);
    demoAbortRef.current = false;

    const startTime = getNow();
    const text = preset.response;
    const CHUNK = 4;
    const DELAY = 18;
    let i = 0;
    let tokenCount = 0;

    while (i < text.length) {
      if (demoAbortRef.current) break;
      const slice = text.slice(i, i + CHUNK);
      setResponseOutput((prev) => prev + slice);
      tokenCount += Math.max(1, Math.floor(slice.length / 4));
      setMetrics({ latency: Math.round(getNow() - startTime), tokens: tokenCount });
      i += CHUNK;
      await new Promise((r) => setTimeout(r, DELAY));
    }

    setIsDemoRunning(false);
  };

  const stopRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
    if (isDemoRunning) {
      demoAbortRef.current = true;
      setIsDemoRunning(false);
    }
  };

  const anyLoading = isLoading || isDemoRunning;

  return (
    <AppPage>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-border/80 mb-6">
        <div className="space-y-1">
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            AI Playground
          </h1>
          <p className="font-sans text-xs sm:text-sm text-text-muted">
            Interactively test prompts against Wallflower&apos;s Gemini AI backend with live streaming.
          </p>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        {/* Model badge */}
        <div className="flex items-center gap-2">
          <Badge variant="ai" className="gap-1.5 text-xs py-1">
            <Zap className="w-3 h-3 text-amber-400" />
            Gemini 2.5 Flash
          </Badge>
          <Badge variant="ai" className="gap-1.5 text-xs py-1">
            <Activity className="w-3 h-3 text-emerald-400" />
            Live SSE Stream
          </Badge>
        </div>

        {metrics.latency > 0 && (
          <div className="flex items-center gap-4 text-xs font-mono text-text-muted bg-surface-subtle rounded-full px-4 py-2 border border-border/60">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Latency: {(metrics.latency / 1000).toFixed(2)}s
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              ~{metrics.tokens} tokens
            </span>
          </div>
        )}
      </div>

      {/* Demo Presets Strip */}
      <div className="flex items-center gap-2 flex-wrap mb-5">
        <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold shrink-0">
          Demo presets:
        </span>
        {DEMO_PRESETS.map((p) => (
          <button
            key={p.label}
            id={`demo-preset-${p.label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
            onClick={() => handleRunDemo(p)}
            disabled={anyLoading}
            className="text-[11px] px-3 py-1.5 rounded-lg bg-brand/10 border border-brand/20
                       text-brand hover:bg-brand/20 hover:border-brand/40
                       disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium cursor-pointer"
          >
            ▶ {p.label}
          </button>
        ))}
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5 min-h-150">
        {/* Left Pane — Configuration */}
        <div className="flex flex-col gap-4">
          {/* Parameters Card */}
          <Card className="p-5 space-y-5 border-border/60">
            <div className="flex items-center gap-2 text-text-primary font-medium">
              <Settings className="w-4 h-4 text-brand" />
              Parameters
            </div>

            {/* Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-text-muted uppercase tracking-widest">
                  Temperature
                </label>
                <span className="text-xs text-brand font-mono">
                  {temperature}
                </span>
              </div>
              <input
                id="playground-temperature"
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-[hsl(var(--brand))]"
              />
            </div>

            {/* Toggles */}
            <div
              id="toggle-json-format"
              className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle border border-border/60 cursor-pointer hover:bg-surface-hover transition-colors"
              onClick={() => setJsonFormat(!jsonFormat)}
              role="checkbox"
              aria-checked={jsonFormat}
            >
              <span className="text-sm font-medium text-text-secondary flex items-center gap-2">
                <Code className="w-4 h-4" /> Enforce JSON output
              </span>
              <div
                className={`w-10 h-5 rounded-full p-1 flex items-center transition-colors ${
                  jsonFormat ? "bg-brand" : "bg-surface-muted"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                    jsonFormat ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </div>
            </div>
          </Card>

          {/* Prompts Card */}
          <Card className="p-5 flex-1 flex flex-col gap-4 border-border/60">
            <div>
              <label className="text-xs font-medium text-text-muted uppercase tracking-widest mb-2 block">
                System Prompt
              </label>
              <textarea
                id="playground-system-prompt"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full min-h-20 bg-surface-subtle border border-border/60 rounded-xl p-3 text-xs text-text-secondary focus:outline-none focus:border-brand/50 resize-none font-mono"
                placeholder="You are a helpful assistant..."
              />
            </div>

            <div className="flex-1">
              <label className="text-xs font-medium text-text-muted uppercase tracking-widest mb-2 block">
                User Message
              </label>
              <textarea
                id="playground-user-message"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                className="w-full min-h-30 bg-surface-subtle border border-border/60 rounded-xl p-3 text-sm text-text-primary focus:outline-none focus:border-brand/50 resize-none"
                placeholder="Ask something to generate..."
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                id="playground-submit"
                onClick={handleRunTest}
                disabled={anyLoading || !userMessage.trim()}
                className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl font-bold transition-all text-sm cursor-pointer ${
                  anyLoading || !userMessage.trim()
                    ? "bg-surface-subtle text-text-muted cursor-not-allowed border border-border/60"
                    : "bg-brand hover:bg-brand/90 text-white shadow-lg shadow-brand/20"
                }`}
              >
                {isLoading ? (
                  <RefreshCcw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
                {isLoading ? "Running..." : "Submit"}
              </button>

              {anyLoading && (
                <button
                  id="playground-stop"
                  onClick={stopRequest}
                  className="px-4 py-3 rounded-xl bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20 transition-all flex items-center justify-center cursor-pointer"
                >
                  <StopCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </Card>
        </div>

        {/* Right Pane — Output Terminal */}
        <Card className="flex flex-col overflow-hidden border-border/60 min-h-125">
          {/* Terminal Title Bar */}
          <div className="h-12 border-b border-border/60 flex items-center px-4 bg-surface-subtle shrink-0">
            <div className="flex items-center gap-2 select-none">
              <div className="w-3 h-3 rounded-full bg-danger/50" />
              <div className="w-3 h-3 rounded-full bg-warning/50" />
              <div className="w-3 h-3 rounded-full bg-success/50" />
            </div>
            <div className="mx-auto flex items-center gap-2 text-xs font-mono text-text-muted uppercase tracking-widest font-semibold">
              <Terminal className="w-4 h-4" />
              Output Console
            </div>
            {isDemoRunning && (
              <span className="text-[10px] uppercase tracking-widest text-brand font-bold animate-pulse">
                ● Demo
              </span>
            )}
          </div>

          {/* Output Content */}
          <div
            ref={outputRef}
            id="playground-output"
            className="flex-1 p-6 overflow-y-auto font-mono text-sm leading-relaxed text-text-secondary relative"
          >
            {errorMsg ? (
              <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger">
                <div className="font-bold flex items-center gap-2 mb-1">
                  <Terminal className="w-4 h-4" /> Error Occurred
                </div>
                {errorMsg}
              </div>
            ) : responseOutput ? (
              <div className="whitespace-pre-wrap wrap-break-word">
                {responseOutput}
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-text-muted flex-col gap-3">
                <FlaskConical className="w-12 h-12 opacity-20" />
                <p>Awaiting execution...</p>
                <p className="text-xs text-text-muted/60">
                  Use a demo preset above or submit a message
                </p>
              </div>
            )}

            {anyLoading && (
              <span className="inline-block w-2.5 h-4 ml-1 translate-y-0.5 bg-brand animate-pulse" />
            )}
          </div>
        </Card>
      </div>
    </AppPage>
  );
}
