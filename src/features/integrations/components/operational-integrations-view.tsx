// src/features/integrations/components/operational-integrations-view.tsx
'use client';

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/liquiflow-hooks";
import type { Department, WorkflowStep } from "@/lib/liquiflow-types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type IntegrationId = "jira" | "linear" | "notion" | "asana" | "github" | "trello" | "gitlab" | "zendesk" | "salesforce" | "monday" | "hubspot" | "intercom" | "zapier" | "make";

interface PreviewData {
  departments: Department[];
  workflows: WorkflowStep[];
  orgName: string;
  meta?: Record<string, string | number>;
}

interface NotionDatabase {
  id: string;
  name: string;
}

const INTEGRATIONS: {
  id: IntegrationId;
  name: string;
  icon: string;
  color: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  description: string;
  fields: {
    key: string;
    label: string;
    placeholder: string;
    type?: string;
    hint?: string;
  }[];
  tokenHelp: string;
}[] = [
  {
    id: "linear",
    name: "Linear",
    icon: "◈",
    color: "from-violet-500 to-indigo-500",
    borderColor: "border-violet-500/30",
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-500",
    description: "Import teams and issue cycles as departments and workflows.",
    fields: [
      {
        key: "token",
        label: "Personal API Token",
        placeholder: "lin_api_...",
        hint: "Settings → API → Personal API keys",
      },
    ],
    tokenHelp: "https://linear.app/settings/api",
  },
  {
    id: "jira",
    name: "Jira",
    icon: "◉",
    color: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-500/30",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-500",
    description: "Import projects and issue statistics as departments and workflows.",
    fields: [
      {
        key: "domain",
        label: "Atlassian Domain",
        placeholder: "your-company.atlassian.net",
        hint: "Your Jira subdomain (without https://)",
      },
      {
        key: "email",
        label: "Account Email",
        placeholder: "you@company.com",
        type: "email",
      },
      {
        key: "token",
        label: "API Token",
        placeholder: "ATATT3x...",
        hint: "id.atlassian.com → Security → API tokens",
      },
    ],
    tokenHelp: "https://id.atlassian.com/manage-profile/security/api-tokens",
  },
  {
    id: "notion",
    name: "Notion",
    icon: "□",
    color: "from-slate-400 to-slate-600",
    borderColor: "border-slate-500/30",
    bgColor: "bg-slate-500/10",
    textColor: "text-slate-500",
    description: "Read a Notion database and map rows to departments and workflows.",
    fields: [
      {
        key: "token",
        label: "Internal Integration Token",
        placeholder: "secret_...",
        hint: "notion.so/my-integrations → New integration",
      },
      {
        key: "databaseId",
        label: "Database ID (optional)",
        placeholder: "32-character database ID",
        hint: "Leave blank to search workspace — or paste from the database URL",
      },
    ],
    tokenHelp: "https://www.notion.so/my-integrations",
  },
  {
    id: "asana",
    name: "Asana",
    icon: "◎",
    color: "from-pink-500 to-rose-500",
    borderColor: "border-pink-500/30",
    bgColor: "bg-pink-500/10",
    textColor: "text-pink-500",
    description: "Import teams and projects as departments and workflows.",
    fields: [
      {
        key: "token",
        label: "Personal Access Token",
        placeholder: "1/...",
        hint: "app.asana.com → My profile → Apps → Manage developer apps → New token",
      },
    ],
    tokenHelp: "https://app.asana.com/0/my-apps",
  },
  {
    id: "github",
    name: "GitHub",
    icon: "🐙",
    color: "from-zinc-600 to-zinc-800",
    borderColor: "border-zinc-500/30",
    bgColor: "bg-zinc-500/10",
    textColor: "text-zinc-500",
    description: "Import repositories and PR stats as departments and workflows.",
    fields: [
      {
        key: "token",
        label: "Personal Access Token",
        placeholder: "ghp_...",
        hint: "Developer Settings → Personal access tokens",
      },
      {
        key: "owner",
        label: "Repository Owner (User or Org)",
        placeholder: "e.g. AcmeCorp",
        hint: "The username or organization name that owns the repositories",
      },
    ],
    tokenHelp: "https://github.com/settings/tokens",
  },
  {
    id: "trello",
    name: "Trello",
    icon: "◫",
    color: "from-sky-500 to-blue-600",
    borderColor: "border-sky-500/30",
    bgColor: "bg-sky-500/10",
    textColor: "text-sky-500",
    description: "Import workspaces and boards as departments and workflows.",
    fields: [
      {
        key: "key",
        label: "API Key",
        placeholder: "Your developer API key",
        hint: "Trello Power-Up Admin portal → API Key",
      },
      {
        key: "token",
        label: "API Token",
        placeholder: "Your user token",
        hint: "Generate a Token using your API Key",
      },
    ],
    tokenHelp: "https://trello.com/app-key",
  },
  {
    id: "gitlab",
    name: "GitLab",
    icon: "🦊",
    color: "from-orange-500 to-red-600",
    borderColor: "border-orange-500/30",
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-500",
    description: "Import projects and merge requests as departments and workflows.",
    fields: [
      {
        key: "token",
        label: "Personal Access Token",
        placeholder: "glpat-...",
        hint: "User Settings → Access Tokens",
      },
      {
        key: "url",
        label: "GitLab URL (Optional)",
        placeholder: "https://gitlab.com",
        hint: "Leave blank for gitlab.com, or enter your self-hosted URL",
      },
    ],
    tokenHelp: "https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html",
  },
  {
    id: "zendesk",
    name: "Zendesk",
    icon: "◬",
    color: "from-emerald-600 to-teal-700",
    borderColor: "border-emerald-500/30",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-500",
    description: "Import support groups and ticket queues as departments and workflows.",
    fields: [
      {
        key: "subdomain",
        label: "Zendesk Subdomain",
        placeholder: "your-company",
        hint: "Everything before .zendesk.com",
      },
      {
        key: "email",
        label: "Account Email",
        placeholder: "you@company.com",
        type: "email",
      },
      {
        key: "token",
        label: "API Token",
        placeholder: "Secret token...",
        hint: "Admin Center → Apps and integrations → APIs → Zendesk API",
      },
    ],
    tokenHelp: "https://support.zendesk.com/hc/en-us/articles/4408889192858-Generating-a-new-API-token-",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    icon: "☁️",
    color: "from-sky-500 to-blue-500",
    borderColor: "border-sky-500/30",
    bgColor: "bg-sky-500/10",
    textColor: "text-sky-500",
    description: "Import Campaigns and Opportunities as departments and workflows.",
    fields: [
      {
        key: "token",
        label: "API Bearer Token",
        placeholder: "00D...",
        hint: "Admin / Setup → Connected Apps / OAuth",
      },
      {
        key: "instanceUrl",
        label: "Instance URL",
        placeholder: "https://your-domain.my.salesforce.com",
        hint: "The base URL for your Salesforce instance",
      },
    ],
    tokenHelp: "https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_tokens_scopes.htm",
  },
  {
    id: "monday",
    name: "Monday.com",
    icon: "M",
    color: "from-red-500 to-red-400",
    borderColor: "border-red-500/30",
    bgColor: "bg-red-500/10",
    textColor: "text-red-500",
    description: "Import workspaces and boards as departments and workflows.",
    fields: [
      {
        key: "token",
        label: "API v2 Token",
        placeholder: "eyJhbG...",
        hint: "Developer section → My Access Tokens",
      },
    ],
    tokenHelp: "https://developer.monday.com/api-reference/docs/authentication",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    icon: "🧲",
    color: "from-orange-400 to-orange-500",
    borderColor: "border-orange-500/30",
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-500",
    description: "Import Sales Deals and Pipelines as departments and workflows.",
    fields: [
      {
        key: "token",
        label: "Private App Access Token",
        placeholder: "pat-na1-...",
        hint: "Settings → Integrations → Private Apps",
      },
    ],
    tokenHelp: "https://developers.hubspot.com/docs/api/private-apps",
  },
  {
    id: "intercom",
    name: "Intercom",
    icon: "💬",
    color: "from-cyan-400 to-blue-500",
    borderColor: "border-cyan-500/30",
    bgColor: "bg-cyan-500/10",
    textColor: "text-cyan-500",
    description: "Import Support Teams and Conversations as departments and workflows.",
    fields: [
      {
        key: "token",
        label: "Access Token",
        placeholder: "dsk_...",
        hint: "Developer Hub → Your App → Authentication",
      },
    ],
    tokenHelp: "https://developers.intercom.com/building-apps/docs/authentication-types#access-tokens",
  },
  {
    id: "zapier",
    name: "Zapier",
    icon: "⚡",
    color: "from-orange-500 to-amber-500",
    borderColor: "border-orange-500/30",
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-500",
    description: "Import Folders and Zaps as departments and workflows.",
    fields: [
      {
        key: "token",
        label: "Personal Access Token",
        placeholder: "sk_...",
        hint: "Developer Platform → Access Tokens",
      },
    ],
    tokenHelp: "https://developer.zapier.com/docs/api-getting-started",
  },
  {
    id: "make",
    name: "Make",
    icon: "Ⓜ",
    color: "from-purple-500 to-purple-700",
    borderColor: "border-purple-500/30",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-500",
    description: "Import Teams and Scenarios as departments and workflows.",
    fields: [
      {
        key: "token",
        label: "API Token",
        placeholder: "Your Make environment API Token",
        hint: "Profile → API",
      },
      {
        key: "organizationId",
        label: "Organization ID",
        placeholder: "12345",
        hint: "Numeric ID found in your Make URL",
      },
    ],
    tokenHelp: "https://www.make.com/en/help/api/api-authentication",
  },
];

function sessionKey(id: IntegrationId, field: string) {
  return `liquiflow-int-${id}-${field}`;
}

function loadFromSession(id: IntegrationId, field: string): string {
  try {
    return sessionStorage.getItem(sessionKey(id, field)) ?? "";
  } catch {
    return "";
  }
}

function saveToSession(id: IntegrationId, field: string, value: string) {
  try {
    sessionStorage.setItem(sessionKey(id, field), value);
  } catch {
    /* ignore */
  }
}

function PreviewTable({ data }: { data: PreviewData }) {
  const [tab, setTab] = useState<"departments" | "workflows">("departments");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-text-primary">
          Preview — {data.orgName}
        </div>
        <div className="flex gap-1">
          {(["departments", "workflows"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all ${
                tab === t
                  ? "border-brand/40 bg-brand-soft/15 text-brand"
                  : "border-border/60 text-text-muted hover:text-text-primary"
              }`}
            >
              {t === "departments"
                ? `Departments (${data.departments.length})`
                : `Workflows (${data.workflows.length})`}
            </button>
          ))}
        </div>
      </div>

      {tab === "departments" && (
        <div className="overflow-auto rounded-xl border border-border/80 bg-surface-subtle">
          <table className="w-full text-[11px]" style={{ minWidth: 560 }}>
            <thead>
              <tr className="text-[9px] uppercase tracking-widest text-text-muted border-b border-border/60">
                <th className="text-left p-2 pl-3 font-normal">Name</th>
                <th className="text-left p-2 font-normal w-10">HC</th>
                <th className="text-left p-2 font-normal w-18">Tasks/wk</th>
                <th className="text-left p-2 font-normal w-22">Resp Time (h)</th>
                <th className="text-left p-2 font-normal w-14">Pending</th>
                <th className="text-left p-2 font-normal w-14">Overdue</th>
              </tr>
            </thead>
            <tbody>
              {data.departments.map((d) => (
                <tr key={d.id} className="border-b border-border/60 hover:bg-surface-hover transition-colors">
                  <td className="p-2 pl-3 text-text-primary font-medium">{d.name}</td>
                  <td className="p-2 text-text-muted">{d.headcount}</td>
                  <td className="p-2 text-text-muted">{d.avgTasksPerWeek}</td>
                  <td className="p-2 text-text-muted">{d.avgResponseTimeHours}h</td>
                  <td className="p-2 text-warning">{d.pendingApprovals}</td>
                  <td className="p-2 text-danger">{d.overdueItems}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "workflows" && (
        <div className="overflow-auto rounded-xl border border-border/80 bg-surface-subtle">
          <table className="w-full text-[11px]" style={{ minWidth: 520 }}>
            <thead>
              <tr className="text-[9px] uppercase tracking-widest text-text-muted border-b border-border/60">
                <th className="text-left p-2 pl-3 font-normal">Name</th>
                <th className="text-left p-2 font-normal w-28">Department</th>
                <th className="text-left p-2 font-normal w-20">Duration (h)</th>
                <th className="text-left p-2 font-normal w-18">Error Rate</th>
                <th className="text-left p-2 font-normal w-14">Vol/wk</th>
              </tr>
            </thead>
            <tbody>
              {data.workflows.map((w) => (
                <tr key={w.id} className="border-b border-border/60 hover:bg-surface-hover transition-colors">
                  <td className="p-2 pl-3 text-text-primary font-medium">{w.name}</td>
                  <td className="p-2 text-text-muted">{w.department}</td>
                  <td className="p-2 text-text-muted">{w.avgDurationHours}h</td>
                  <td className="p-2 text-text-muted">
                    <span className={w.errorRate > 0.15 ? "text-danger" : "text-success"}>
                      {(w.errorRate * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="p-2 text-text-muted">{w.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.meta && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(data.meta).map(([k, v]) => (
            <span key={k} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-subtle text-text-muted">
              {k}: <span className="text-text-primary font-medium">{String(v)}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function IntegrationCard({
  config,
  onLoad,
}: {
  config: (typeof INTEGRATIONS)[number];
  onLoad: () => void;
}) {
  const [fields, setFields] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const f of config.fields) {
      initial[f.key] = loadFromSession(config.id, f.key);
    }
    return initial;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [notionDbs, setNotionDbs] = useState<NotionDatabase[] | null>(null);

  const { setOrgData } = useAppStore();

  const handleFieldChange = (key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    saveToSession(config.id, key, value);
  };

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    setPreview(null);
    setNotionDbs(null);

    try {
      const res = await fetch(`/api/liquiflow/integrations/${config.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? `Error ${res.status}`);
        return;
      }

      if (json.availableDatabases) {
        setNotionDbs(json.availableDatabases);
        return;
      }

      setPreview(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleLoad = () => {
    if (!preview) return;
    setOrgData(preview.departments, preview.workflows, preview.orgName);
    onLoad();
  };

  const isReady = config.fields.every((f) =>
    f.key === "databaseId" ? true : (fields[f.key] ?? "").trim().length > 0
  );

  return (
    <Card className={`rounded-2xl border ${config.borderColor} p-5 flex flex-col gap-4 transition-all shadow-2xs`}>
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-white font-bold text-lg`}
        >
          {config.icon}
        </div>
        <div>
          <div className={`font-bold text-sm ${config.textColor}`}>{config.name}</div>
          <div className="text-[10px] text-text-muted mt-0.5 leading-relaxed">{config.description}</div>
        </div>
      </div>

      <div className="space-y-3">
        {config.fields.map((field) => (
          <div key={field.key} className="space-y-1">
            <Label className="text-[10px] text-text-muted block mb-1">{field.label}</Label>
            <Input
              type={field.type === "email" ? "email" : "text"}
              value={fields[field.key] ?? ""}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              autoComplete="off"
              spellCheck={false}
              className="w-full bg-surface-subtle border-border/60 focus:border-brand font-mono text-xs"
            />
            {field.hint && (
              <div className="text-[10px] text-text-muted mt-0.5">{field.hint}</div>
            )}
          </div>
        ))}
      </div>

      {notionDbs && (
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-text-muted">
            Select a database to import:
          </div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {notionDbs.map((db) => (
              <button
                key={db.id}
                onClick={() => {
                  handleFieldChange("databaseId", db.id);
                  setNotionDbs(null);
                }}
                className="w-full text-left text-xs px-3 py-2 rounded-lg bg-surface-subtle border border-border/60 text-text-primary hover:border-brand/30 hover:bg-brand-soft/5 transition-all"
              >
                <span className="font-medium">{db.name}</span>
                <span className="ml-2 text-text-muted font-mono text-[10px]">
                  {db.id.slice(0, 8)}...
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="text-[11px] text-danger bg-danger-soft/10 border border-danger/20 rounded-lg px-3 py-2">
          ⚠ {error}
        </div>
      )}

      {preview && <PreviewTable data={preview} />}

      <div className="flex gap-2 mt-auto">
        <Button
          onClick={handleFetch}
          disabled={loading || !isReady}
          variant="outline"
          className={`flex-1 text-xs font-semibold py-2.5 rounded-xl transition-all h-auto
            ${loading || !isReady
              ? "opacity-40 cursor-not-allowed border-border/60 text-text-muted"
              : `${config.bgColor} ${config.borderColor} ${config.textColor} hover:opacity-90`
            }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-1.5">
              <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
              Fetching…
            </span>
          ) : preview ? (
            "Re-fetch"
          ) : (
            `Connect ${config.name}`
          )}
        </Button>

        {preview && (
          <Button
            onClick={handleLoad}
            variant="primary"
            className="flex-1 text-xs font-bold py-2.5 rounded-xl h-auto"
          >
            Load into LiquiFlow ✓
          </Button>
        )}
      </div>

      <a
        href={config.tokenHelp}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] text-text-muted hover:text-text-primary text-center transition-colors"
      >
        How to get a {config.name} API token →
      </a>
    </Card>
  );
}

export function OperationalIntegrationsView({ onSuccess }: { onSuccess?: () => void }) {
  const [activeTab, setActiveTab] = useState<IntegrationId>("linear");

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("liquiflow-int-tab") as IntegrationId | null;
      if (saved) setActiveTab(saved);
    } catch { /* ignore */ }
  }, []);

  const handleTabChange = (id: IntegrationId) => {
    setActiveTab(id);
    try { sessionStorage.setItem("liquiflow-int-tab", id); } catch { /* ignore */ }
  };

  const config = INTEGRATIONS.find((c) => c.id === activeTab)!;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex gap-1 px-6 pt-4 pb-0 flex-shrink-0 border-b border-border/60 overflow-x-auto no-scrollbar">
        {INTEGRATIONS.map((integ) => (
          <button
            key={integ.id}
            onClick={() => handleTabChange(integ.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-medium transition-all border-b-2 whitespace-nowrap ${
              activeTab === integ.id
                ? `${integ.textColor} border-current ${integ.bgColor}`
                : "text-text-muted border-transparent hover:text-text-primary"
            }`}
          >
            <span>{integ.icon}</span>
            <span>{integ.name}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-start gap-2 mb-5 px-3 py-2.5 rounded-xl bg-warning/5 border border-warning/15 text-[10px] text-warning leading-relaxed">
          <span className="mt-0.5 flex-shrink-0">🔒</span>
          <span>
            Tokens are stored in <strong>sessionStorage only</strong> — they are cleared when you
            close this browser tab and are never sent to any server other than{" "}
            {config.name}&apos;s API.
          </span>
        </div>

        <IntegrationCard
          key={activeTab}
          config={config}
          onLoad={() => onSuccess?.()}
        />
      </div>
    </div>
  );
}
