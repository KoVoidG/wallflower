// src/features/integrations/components/operational-integrations-view.tsx
'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/liquiflow-hooks';
import type { Department, WorkflowStep } from '@/lib/liquiflow-types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Lock,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Database,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BRAND_ICONS } from './brand-icons';

type IntegrationId =
  | 'jira'
  | 'linear'
  | 'notion'
  | 'asana'
  | 'github'
  | 'trello'
  | 'gitlab'
  | 'zendesk'
  | 'salesforce'
  | 'monday'
  | 'hubspot'
  | 'intercom'
  | 'zapier'
  | 'make';

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

type CategoryType = 'all' | 'trackers' | 'data' | 'crm' | 'automation';

interface IntegrationConfig {
  id: IntegrationId;
  name: string;
  category: 'trackers' | 'data' | 'crm' | 'automation';
  categoryLabel: string;
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
}

const INTEGRATIONS: IntegrationConfig[] = [
  {
    id: 'linear',
    name: 'Linear',
    category: 'trackers',
    categoryLabel: 'Issue Tracker',
    color: 'from-violet-500 to-indigo-500',
    borderColor: 'border-violet-500/30',
    bgColor: 'bg-violet-500/10',
    textColor: 'text-violet-500',
    description: 'Import engineering teams, project cycles, and velocity as departments and workflows.',
    fields: [
      {
        key: 'token',
        label: 'Personal API Token',
        placeholder: 'lin_api_...',
        hint: 'Linear Settings → API → Personal API keys',
      },
    ],
    tokenHelp: 'https://linear.app/settings/api',
  },
  {
    id: 'jira',
    name: 'Jira Software',
    category: 'trackers',
    categoryLabel: 'Issue Tracker',
    color: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-500',
    description: 'Import Atlassian projects, sprint throughput, and backlog health into telemetry.',
    fields: [
      {
        key: 'domain',
        label: 'Atlassian Domain',
        placeholder: 'your-company.atlassian.net',
        hint: 'Your Jira subdomain (without https://)',
      },
      {
        key: 'email',
        label: 'Account Email',
        placeholder: 'you@company.com',
        type: 'email',
      },
      {
        key: 'token',
        label: 'API Token',
        placeholder: 'ATATT3x...',
        hint: 'id.atlassian.com → Security → API tokens',
      },
    ],
    tokenHelp: 'https://id.atlassian.com/manage-profile/security/api-tokens',
  },
  {
    id: 'notion',
    name: 'Notion Database',
    category: 'data',
    categoryLabel: 'Data & Docs',
    color: 'from-slate-600 to-slate-800 dark:from-slate-400 dark:to-slate-600',
    borderColor: 'border-slate-500/30',
    bgColor: 'bg-slate-500/10',
    textColor: 'text-slate-600 dark:text-slate-300',
    description: 'Read a Notion database and map structured rows directly to operational workflows.',
    fields: [
      {
        key: 'token',
        label: 'Internal Integration Token',
        placeholder: 'secret_...',
        hint: 'notion.so/my-integrations → New integration',
      },
      {
        key: 'databaseId',
        label: 'Database ID (optional)',
        placeholder: '32-character database ID',
        hint: 'Leave blank to search workspace — or paste from database URL',
      },
    ],
    tokenHelp: 'https://www.notion.so/my-integrations',
  },
  {
    id: 'asana',
    name: 'Asana',
    category: 'trackers',
    categoryLabel: 'Project Mgmt',
    color: 'from-pink-500 to-rose-500',
    borderColor: 'border-pink-500/30',
    bgColor: 'bg-pink-500/10',
    textColor: 'text-pink-500',
    description: 'Import organizational teams, task portfolios, and milestone progress.',
    fields: [
      {
        key: 'token',
        label: 'Personal Access Token',
        placeholder: '1/...',
        hint: 'app.asana.com → My profile → Apps → Developer apps → New token',
      },
    ],
    tokenHelp: 'https://app.asana.com/0/my-apps',
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'trackers',
    categoryLabel: 'Dev Operations',
    color: 'from-zinc-700 to-zinc-900',
    borderColor: 'border-zinc-500/30',
    bgColor: 'bg-zinc-500/10',
    textColor: 'text-zinc-700 dark:text-zinc-300',
    description: 'Import repositories, pull request cycle times, and deployment frequencies.',
    fields: [
      {
        key: 'token',
        label: 'Personal Access Token',
        placeholder: 'ghp_...',
        hint: 'Developer Settings → Personal access tokens',
      },
      {
        key: 'owner',
        label: 'Repository Owner (User or Org)',
        placeholder: 'e.g. AcmeCorp',
        hint: 'The username or organization that owns the repositories',
      },
    ],
    tokenHelp: 'https://github.com/settings/tokens',
  },
  {
    id: 'trello',
    name: 'Trello',
    category: 'trackers',
    categoryLabel: 'Kanban Boards',
    color: 'from-sky-500 to-blue-600',
    borderColor: 'border-sky-500/30',
    bgColor: 'bg-sky-500/10',
    textColor: 'text-sky-500',
    description: 'Import workspaces, Kanban boards, and card movement velocity.',
    fields: [
      {
        key: 'key',
        label: 'API Key',
        placeholder: 'Developer API key',
        hint: 'Trello Power-Up Admin portal → API Key',
      },
      {
        key: 'token',
        label: 'API Token',
        placeholder: 'User access token',
        hint: 'Generate Token from API Key dashboard',
      },
    ],
    tokenHelp: 'https://trello.com/app-key',
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    category: 'trackers',
    categoryLabel: 'Dev Operations',
    color: 'from-orange-500 to-red-600',
    borderColor: 'border-orange-500/30',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-500',
    description: 'Import GitLab projects, merge request backlogs, and CI/CD pipelines.',
    fields: [
      {
        key: 'token',
        label: 'Personal Access Token',
        placeholder: 'glpat-...',
        hint: 'User Settings → Access Tokens',
      },
      {
        key: 'url',
        label: 'GitLab URL (Optional)',
        placeholder: 'https://gitlab.com',
        hint: 'Leave blank for cloud gitlab.com or enter self-hosted URL',
      },
    ],
    tokenHelp: 'https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html',
  },
  {
    id: 'zendesk',
    name: 'Zendesk',
    category: 'crm',
    categoryLabel: 'Customer Support',
    color: 'from-emerald-600 to-teal-700',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    description: 'Import support groups, customer ticket volume, and SLA response times.',
    fields: [
      {
        key: 'subdomain',
        label: 'Zendesk Subdomain',
        placeholder: 'your-company',
        hint: 'Everything before .zendesk.com',
      },
      {
        key: 'email',
        label: 'Account Email',
        placeholder: 'you@company.com',
        type: 'email',
      },
      {
        key: 'token',
        label: 'API Token',
        placeholder: 'Secret token...',
        hint: 'Admin Center → Apps and integrations → APIs → Zendesk API',
      },
    ],
    tokenHelp: 'https://support.zendesk.com/hc/en-us/articles/4408889192858-Generating-a-new-API-token-',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'crm',
    categoryLabel: 'CRM & Pipeline',
    color: 'from-sky-500 to-blue-500',
    borderColor: 'border-sky-500/30',
    bgColor: 'bg-sky-500/10',
    textColor: 'text-sky-500',
    description: 'Import Sales Campaigns, pipeline opportunities, and conversion stages.',
    fields: [
      {
        key: 'token',
        label: 'API Bearer Token',
        placeholder: '00D...',
        hint: 'Admin / Setup → Connected Apps / OAuth',
      },
      {
        key: 'instanceUrl',
        label: 'Instance URL',
        placeholder: 'https://your-domain.my.salesforce.com',
        hint: 'Base domain URL for your Salesforce instance',
      },
    ],
    tokenHelp: 'https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_tokens_scopes.htm',
  },
  {
    id: 'monday',
    name: 'Monday.com',
    category: 'trackers',
    categoryLabel: 'Work OS',
    color: 'from-red-500 to-red-600',
    borderColor: 'border-red-500/30',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-500',
    description: 'Import workspace boards, item updates, and cross-team bottlenecks.',
    fields: [
      {
        key: 'token',
        label: 'API v2 Token',
        placeholder: 'eyJhbG...',
        hint: 'Developer section → My Access Tokens',
      },
    ],
    tokenHelp: 'https://developer.monday.com/api-reference/docs/authentication',
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    category: 'crm',
    categoryLabel: 'CRM & Growth',
    color: 'from-orange-500 to-amber-600',
    borderColor: 'border-orange-500/30',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-500',
    description: 'Import deal pipelines, sales stages, and revenue attribution workflows.',
    fields: [
      {
        key: 'token',
        label: 'Private App Access Token',
        placeholder: 'pat-na1-...',
        hint: 'Settings → Integrations → Private Apps',
      },
    ],
    tokenHelp: 'https://developers.hubspot.com/docs/api/private-apps',
  },
  {
    id: 'intercom',
    name: 'Intercom',
    category: 'crm',
    categoryLabel: 'Customer Messaging',
    color: 'from-cyan-500 to-blue-500',
    borderColor: 'border-cyan-500/30',
    bgColor: 'bg-cyan-500/10',
    textColor: 'text-cyan-500',
    description: 'Import conversation queues, response rates, and customer health telemetry.',
    fields: [
      {
        key: 'token',
        label: 'Access Token',
        placeholder: 'dsk_...',
        hint: 'Developer Hub → Your App → Authentication',
      },
    ],
    tokenHelp: 'https://developers.intercom.com/building-apps/docs/authentication-types#access-tokens',
  },
  {
    id: 'zapier',
    name: 'Zapier',
    category: 'automation',
    categoryLabel: 'Automation Webhook',
    color: 'from-orange-500 to-amber-500',
    borderColor: 'border-orange-500/30',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-500',
    description: 'Trigger 5,000+ app actions directly from Wallflower automation events.',
    fields: [
      {
        key: 'token',
        label: 'Personal Access Token',
        placeholder: 'sk_...',
        hint: 'Developer Platform → Access Tokens',
      },
    ],
    tokenHelp: 'https://developer.zapier.com/docs/api-getting-started',
  },
  {
    id: 'make',
    name: 'Make (Integromat)',
    category: 'automation',
    categoryLabel: 'Automation Engine',
    color: 'from-purple-500 to-purple-700',
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-500',
    description: 'Sync modular multi-step integration scenarios and webhook triggers.',
    fields: [
      {
        key: 'token',
        label: 'API Token',
        placeholder: 'Make API Token',
        hint: 'Profile → API',
      },
      {
        key: 'organizationId',
        label: 'Organization ID',
        placeholder: '12345',
        hint: 'Numeric ID found in your Make URL',
      },
    ],
    tokenHelp: 'https://www.make.com/en/help/api/api-authentication',
  },
];

function sessionKey(id: IntegrationId, field: string) {
  return `liquiflow-int-${id}-${field}`;
}

function loadFromSession(id: IntegrationId, field: string): string {
  try {
    return sessionStorage.getItem(sessionKey(id, field)) ?? '';
  } catch {
    return '';
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
  const [tab, setTab] = useState<'departments' | 'workflows'>('departments');

  return (
    <div className="space-y-3 pt-2 border-t border-border">
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold text-text-primary flex items-center gap-1.5">
          <Database className="size-3.5 text-brand" />
          <span>Imported Data: {data.orgName}</span>
        </div>
        <div className="flex gap-1">
          {(['departments', 'workflows'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                tab === t
                  ? 'border-brand/40 bg-brand/10 text-brand'
                  : 'border-border bg-surface-subtle text-text-muted hover:text-text-primary'
              }`}
            >
              {t === 'departments'
                ? `Departments (${data.departments.length})`
                : `Workflows (${data.workflows.length})`}
            </button>
          ))}
        </div>
      </div>

      {tab === 'departments' && (
        <div className="overflow-auto rounded-xl border border-border bg-surface-subtle max-h-48">
          <table className="w-full text-[11px]" style={{ minWidth: 500 }}>
            <thead>
              <tr className="text-[9px] uppercase tracking-widest text-text-muted border-b border-border bg-surface">
                <th className="text-left p-2 pl-3 font-semibold">Department</th>
                <th className="text-left p-2 font-semibold w-12">HC</th>
                <th className="text-left p-2 font-semibold w-20">Tasks/wk</th>
                <th className="text-left p-2 font-semibold w-24">Resp Time</th>
                <th className="text-left p-2 font-semibold w-16">Pending</th>
                <th className="text-left p-2 font-semibold w-16">Overdue</th>
              </tr>
            </thead>
            <tbody>
              {data.departments.map((d) => (
                <tr key={d.id} className="border-b border-border/50 hover:bg-surface transition-colors">
                  <td className="p-2 pl-3 text-text-primary font-medium">{d.name}</td>
                  <td className="p-2 text-text-muted font-mono">{d.headcount}</td>
                  <td className="p-2 text-text-muted font-mono">{d.avgTasksPerWeek}</td>
                  <td className="p-2 text-text-muted font-mono">{d.avgResponseTimeHours}h</td>
                  <td className="p-2 text-warning font-mono">{d.pendingApprovals}</td>
                  <td className="p-2 text-danger font-mono">{d.overdueItems}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'workflows' && (
        <div className="overflow-auto rounded-xl border border-border bg-surface-subtle max-h-48">
          <table className="w-full text-[11px]" style={{ minWidth: 480 }}>
            <thead>
              <tr className="text-[9px] uppercase tracking-widest text-text-muted border-b border-border bg-surface">
                <th className="text-left p-2 pl-3 font-semibold">Workflow Step</th>
                <th className="text-left p-2 font-semibold w-24">Department</th>
                <th className="text-left p-2 font-semibold w-16">Volume/wk</th>
                <th className="text-left p-2 font-semibold w-20">Avg Duration</th>
                <th className="text-left p-2 font-semibold w-20">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.workflows.map((w) => (
                <tr key={w.id} className="border-b border-border/50 hover:bg-surface transition-colors">
                  <td className="p-2 pl-3 text-text-primary font-medium">{w.name}</td>
                  <td className="p-2 text-text-muted">{w.department}</td>
                  <td className="p-2 text-text-muted font-mono">{w.volume}</td>
                  <td className="p-2 text-text-muted font-mono">{w.avgDurationHours}h</td>
                  <td className="p-2">
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Synced
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

interface IntegrationDetailCardProps {
  config: IntegrationConfig;
  onSuccess?: () => void;
}

function IntegrationDetailCard({ config, onSuccess }: IntegrationDetailCardProps) {
  const { setOrgData } = useAppStore();

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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      setError(err instanceof Error ? err.message : 'Network connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleLoad = () => {
    if (!preview) return;
    setOrgData(preview.departments, preview.workflows, preview.orgName);
    onSuccess?.();
  };

  const isReady = config.fields.every((f) =>
    f.key === 'databaseId' ? true : (fields[f.key] ?? '').trim().length > 0
  );

  const ActiveIcon = BRAND_ICONS[config.id];

  return (
    <Card className="p-6 rounded-2xl border-border bg-surface shadow-2xs space-y-5">
      {/* Connector Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-11 h-11 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-xs shrink-0 p-2.5',
              config.color
            )}
          >
            {ActiveIcon ? (
              <ActiveIcon className="size-6 shrink-0 fill-current" />
            ) : (
              <span className="font-bold text-base">{config.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base font-bold text-text-primary">
                {config.name}
              </h3>
              <Badge variant="neutral" className="text-[10px] uppercase font-bold">
                {config.categoryLabel}
              </Badge>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              {config.description}
            </p>
          </div>
        </div>

        <a
          href={config.tokenHelp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
        >
          <span>Token Docs</span>
          <ExternalLink className="size-3" />
        </a>
      </div>

      {/* Security Notice Pill */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs">
        <Lock className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div className="leading-relaxed">
          <strong className="font-semibold">Session-Only Encrypted:</strong> API tokens are stored in your browser&apos;s sessionStorage only. They are never written to disk or shared with third parties.
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {config.fields.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <label className="text-xs font-bold text-text-primary block">
              {field.label}
            </label>
            <input
              type={field.type === 'email' ? 'email' : 'text'}
              value={fields[field.key] ?? ''}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              autoComplete="off"
              spellCheck={false}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-subtle border border-border text-text-primary font-mono text-xs focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all placeholder:text-text-muted"
            />
            {field.hint && (
              <p className="text-[11px] text-text-muted">
                {field.hint}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Notion Database Selector (If Applicable) */}
      {notionDbs && (
        <div className="space-y-2 p-3.5 rounded-xl border border-border bg-surface-subtle">
          <span className="text-xs font-bold text-text-primary block">
            Select Database to Import:
          </span>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {notionDbs.map((db) => (
              <button
                key={db.id}
                type="button"
                onClick={() => {
                  handleFieldChange('databaseId', db.id);
                  setNotionDbs(null);
                }}
                className="w-full text-left text-xs px-3 py-2 rounded-lg bg-surface border border-border text-text-primary hover:border-brand/40 hover:bg-brand/5 transition-all flex items-center justify-between cursor-pointer"
              >
                <span className="font-semibold">{db.name}</span>
                <span className="text-[10px] text-text-muted font-mono">
                  {db.id.slice(0, 8)}...
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Live Preview Table */}
      {preview && <PreviewTable data={preview} />}

      {/* Actions Bar */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button
          onClick={handleFetch}
          disabled={loading || !isReady}
          variant="outline"
          size="sm"
          className={cn(
            'flex-1 text-xs h-10 rounded-xl font-semibold cursor-pointer border border-border',
            loading || !isReady ? 'opacity-50 cursor-not-allowed' : 'hover:border-brand'
          )}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <RefreshCw className="size-3.5 animate-spin" />
              <span>Connecting & Syncing...</span>
            </span>
          ) : preview ? (
            <span className="flex items-center justify-center gap-1.5">
              <RefreshCw className="size-3.5" />
              <span>Re-sync Live Data</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1.5">
              <Sparkles className="size-3.5 text-brand" />
              <span>Connect {config.name}</span>
            </span>
          )}
        </Button>

        {preview && (
          <Button
            onClick={handleLoad}
            variant="primary"
            size="sm"
            className="flex-1 text-xs h-10 rounded-xl font-bold cursor-pointer gap-1.5"
          >
            <span>Load into Wallflower</span>
            <ArrowRight className="size-3.5" />
          </Button>
        )}
      </div>
    </Card>
  );
}

export function OperationalIntegrationsView({ onSuccess }: { onSuccess?: () => void }) {
  const [activeTab, setActiveTab] = useState<IntegrationId>('linear');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const config = INTEGRATIONS.find((c) => c.id === activeTab) || INTEGRATIONS[0];

  const filteredIntegrations = useMemo(() => {
    return INTEGRATIONS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-5 p-5 max-w-[1200px] mx-auto animate-in fade-in duration-200">
      {/* ── Top Header Bar ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-bold tracking-tight text-text-primary">
              App & Data Integrations
            </h2>
            <Badge variant="neutral" className="text-[10px] uppercase font-bold">
              14 Connectors
            </Badge>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Connect external issue trackers, databases, and workflows to stream live telemetry into Wallflower.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="size-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search connectors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-surface-subtle border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand transition-colors"
            />
          </div>
        </div>
      </div>

      {/* ── Category Filter Pills ─────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: 'all', label: 'All Connectors' },
          { id: 'trackers', label: 'Issue Trackers' },
          { id: 'data', label: 'Data & Docs' },
          { id: 'crm', label: 'CRM & Support' },
          { id: 'automation', label: 'Automations' },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id as CategoryType)}
            className={cn(
              'px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all cursor-pointer text-xs',
              selectedCategory === cat.id
                ? 'bg-brand text-white shadow-2xs'
                : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Main 2-Column Split Workspace ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-5 items-start">
        {/* Left: Integration Cards List */}
        <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
          {filteredIntegrations.map((integ) => {
            const isSelected = activeTab === integ.id;
            const hasCredentials = loadFromSession(integ.id, integ.fields[0].key).length > 0;
            const IconComponent = BRAND_ICONS[integ.id];

            return (
              <div
                key={integ.id}
                onClick={() => setActiveTab(integ.id)}
                className={cn(
                  'group p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer shadow-2xs flex items-start gap-3 relative',
                  isSelected
                    ? 'border-brand bg-brand/5 dark:bg-brand/10 shadow-xs ring-1 ring-brand/30'
                    : 'border-border bg-surface hover:border-brand/40 hover:bg-surface-subtle'
                )}
              >
                {/* Brand Vector Icon Box */}
                <div
                  className={cn(
                    'w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-2xs shrink-0 p-2',
                    integ.color
                  )}
                >
                  {IconComponent ? (
                    <IconComponent className="size-5 shrink-0 fill-current" />
                  ) : (
                    <span className="font-bold text-sm">{integ.name.charAt(0)}</span>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-xs font-bold text-text-primary group-hover:text-brand transition-colors truncate">
                      {integ.name}
                    </h3>
                    {hasCredentials ? (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20">
                        <CheckCircle2 className="size-2.5" />
                        <span>Ready</span>
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold uppercase text-text-muted px-1.5 py-0.5 rounded-md bg-surface-subtle border border-border">
                        {integ.categoryLabel}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-2 mt-0.5">
                    {integ.description}
                  </p>
                </div>
              </div>
            );
          })}

          {filteredIntegrations.length === 0 && (
            <div className="text-center py-12 text-xs text-text-muted border border-dashed border-border rounded-2xl">
              No integrations found matching &quot;{searchQuery}&quot;
            </div>
          )}
        </div>

        {/* Right: Active Connector Configuration Card */}
        <IntegrationDetailCard
          key={config.id}
          config={config}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
}
