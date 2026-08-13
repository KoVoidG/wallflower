'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Download, Archive, Trash2, Check } from 'lucide-react';

export function DataPrivacySettings() {
  const [analytics, setAnalytics] = useState(true);
  const [crashReports, setCrashReports] = useState(true);
  const [aiUsageConsent, setAiUsageConsent] = useState(true);
  const [personalizedRecs, setPersonalizedRecs] = useState(true);

  const [notice, setNotice] = useState('');

  const handleExport = (type: string) => {
    setNotice(`${type} exported successfully as JSON.`);
    setTimeout(() => setNotice(''), 3000);
  };

  const handleDestructive = (action: string) => {
    setNotice(`${action} completed.`);
    setTimeout(() => setNotice(''), 3000);
  };

  return (
    <div className="space-y-6 text-left">
      {notice && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-in fade-in-50">
          <Check className="size-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Top 2-Column Grid: Data Export & Data Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Data Export */}
        <Card className="p-5 border-border-strong bg-surface space-y-4">
          <div className="border-b border-border/60 pb-3">
            <h3 className="font-display text-sm font-bold text-text-primary">Data Export</h3>
            <p className="text-xs text-text-secondary font-medium">Download a copy of your data.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border bg-surface-subtle">
              <div>
                <h4 className="text-xs font-bold text-text-primary">Business Data</h4>
                <p className="text-[11px] text-text-secondary font-medium">Includes business profile and settings.</p>
              </div>
              <button
                type="button"
                onClick={() => handleExport('Business Data')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors cursor-pointer shrink-0"
              >
                <Download className="size-4 text-tertiary" />
                <span>Export</span>
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border bg-surface-subtle">
              <div>
                <h4 className="text-sm font-semibold text-text-primary">Simulation Data</h4>
                <p className="text-xs text-text-secondary font-medium">Includes all scenarios and results.</p>
              </div>
              <button
                type="button"
                onClick={() => handleExport('Simulation Data')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors cursor-pointer shrink-0"
              >
                <Download className="size-4 text-tertiary" />
                <span>Export</span>
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border bg-surface-subtle">
              <div>
                <h4 className="text-sm font-semibold text-text-primary">Reports</h4>
                <p className="text-xs text-text-secondary font-medium">Includes all generated reports.</p>
              </div>
              <button
                type="button"
                onClick={() => handleExport('Reports Data')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors cursor-pointer shrink-0"
              >
                <Download className="size-4 text-tertiary" />
                <span>Export</span>
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border bg-surface-subtle">
              <div>
                <h4 className="text-sm font-semibold text-text-primary">Account Data</h4>
                <p className="text-xs text-text-secondary font-medium">Includes account and activity data.</p>
              </div>
              <button
                type="button"
                onClick={() => handleExport('Account Data')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors cursor-pointer shrink-0"
              >
                <Download className="size-4 text-tertiary" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </Card>

        {/* Card 2: Data Management */}
        <Card className="p-5 border-border-strong bg-surface space-y-4">
          <div className="border-b border-border/60 pb-3">
            <h3 className="font-display text-sm font-bold text-text-primary">Data Management</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 dark:bg-rose-950/10">
              <div>
                <h4 className="text-sm font-semibold text-text-primary">Archive Business</h4>
                <p className="text-xs text-text-secondary font-medium">Permanently archive this business and its data.</p>
              </div>
              <button
                type="button"
                onClick={() => handleDestructive('Archive Business')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl border border-rose-500/40 text-danger hover:bg-danger-soft/40 transition-colors cursor-pointer shrink-0"
              >
                <Archive className="size-4" />
                <span>Archive</span>
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 dark:bg-rose-950/10">
              <div>
                <h4 className="text-sm font-semibold text-text-primary">Delete All Reports</h4>
                <p className="text-xs text-text-secondary font-medium">Permanently delete all reports.</p>
              </div>
              <button
                type="button"
                onClick={() => handleDestructive('Delete All Reports')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl border border-rose-500/40 text-danger hover:bg-danger-soft/40 transition-colors cursor-pointer shrink-0"
              >
                <Trash2 className="size-4" />
                <span>Delete</span>
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 dark:bg-rose-950/10">
              <div>
                <h4 className="text-sm font-semibold text-text-primary">Delete Simulations</h4>
                <p className="text-xs text-text-secondary font-medium">Permanently delete all simulations.</p>
              </div>
              <button
                type="button"
                onClick={() => handleDestructive('Delete Simulations')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl border border-rose-500/40 text-danger hover:bg-danger-soft/40 transition-colors cursor-pointer shrink-0"
              >
                <Trash2 className="size-4" />
                <span>Delete</span>
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 dark:bg-rose-950/10">
              <div>
                <h4 className="text-sm font-semibold text-text-primary">Delete Historical Records</h4>
                <p className="text-xs text-text-secondary font-medium">Permanently delete all history data.</p>
              </div>
              <button
                type="button"
                onClick={() => handleDestructive('Delete Historical Records')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl border border-rose-500/40 text-danger hover:bg-danger-soft/40 transition-colors cursor-pointer shrink-0"
              >
                <Trash2 className="size-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom 2-Column Grid: Privacy Preferences & AI & Personalization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 3: Privacy Preferences */}
        <Card className="p-5 border-border-strong bg-surface space-y-4">
          <div className="border-b border-border/60 pb-3">
            <h3 className="font-display text-sm font-bold text-text-primary">Privacy Preferences</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border bg-surface-subtle">
              <div>
                <h4 className="text-xs font-bold text-text-primary">Analytics</h4>
                <p className="text-[11px] text-text-secondary font-medium">Help improve Wallflower by sharing usage data.</p>
              </div>
              <Switch checked={analytics} onCheckedChange={setAnalytics} ariaLabel="Toggle Analytics" />
            </div>

            <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border bg-surface-subtle">
              <div>
                <h4 className="text-xs font-bold text-text-primary">Crash Reports</h4>
                <p className="text-[11px] text-text-secondary font-medium">Automatically send crash reports.</p>
              </div>
              <Switch checked={crashReports} onCheckedChange={setCrashReports} ariaLabel="Toggle Crash Reports" />
            </div>
          </div>
        </Card>

        {/* Card 4: AI & Personalization */}
        <Card className="p-5 border-border-strong bg-surface space-y-4">
          <div className="border-b border-border/60 pb-3">
            <h3 className="font-display text-sm font-bold text-text-primary">AI & Personalization</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border bg-surface-subtle">
              <div>
                <h4 className="text-xs font-bold text-text-primary">AI Usage Consent</h4>
                <p className="text-[11px] text-text-secondary font-medium">Allow AI to analyze your data for insights.</p>
              </div>
              <Switch checked={aiUsageConsent} onCheckedChange={setAiUsageConsent} ariaLabel="Toggle AI Usage Consent" />
            </div>

            <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border bg-surface-subtle">
              <div>
                <h4 className="text-xs font-bold text-text-primary">Personalized Recommendations</h4>
                <p className="text-[11px] text-text-secondary font-medium">Receive personalized tips and suggestions.</p>
              </div>
              <Switch checked={personalizedRecs} onCheckedChange={setPersonalizedRecs} ariaLabel="Toggle Personalized Recommendations" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
