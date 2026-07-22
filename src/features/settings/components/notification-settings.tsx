'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Bell, Info, Mail, Check } from 'lucide-react';

export function NotificationSettings() {
  const t = useTranslations('settingsPage.notificationsPage');
  const tCommon = useTranslations('settingsPage');

  const [criticalRisk, setCriticalRisk] = useState(true);
  const [runwayWarning, setRunwayWarning] = useState(true);
  const [staleData, setStaleData] = useState(true);
  const [simCompletion, setSimCompletion] = useState(true);
  const [monthlySummary, setMonthlySummary] = useState(true);
  const [reportReady, setReportReady] = useState(true);
  const [missingData, setMissingData] = useState(false);

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-text-primary">{t('title')}</h2>
        <p className="text-sm text-text-secondary">
          Configure in-app alerts and notifications for risk events and summary updates.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-success/40 bg-success-soft px-4 py-3 text-sm text-success font-medium">
          <Check className="size-4 shrink-0" />
          <span>{tCommon('saveBar.saved')}</span>
        </div>
      )}

      {/* Prototype Notice Banner */}
      <div className="flex items-start gap-3 rounded-lg border border-border bg-surface-subtle p-3.5 text-xs text-text-secondary">
        <Info className="size-4 text-brand shrink-0 mt-0.5" />
        <p>{t('emailNotice')}</p>
      </div>

      {/* Channels Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-brand bg-brand-soft/20 p-4 space-y-1">
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-brand" />
            <span className="text-sm font-semibold text-text-primary">{t('inApp')}</span>
          </div>
          <p className="text-xs text-text-muted">Active in dashboard topbar and contextual panel.</p>
        </div>

        <div className="rounded-lg border border-border bg-surface-subtle p-4 space-y-1 opacity-70">
          <div className="flex items-center gap-2">
            <Mail className="size-4 text-text-muted" />
            <span className="text-sm font-semibold text-text-muted">{t('email')}</span>
          </div>
          <p className="text-xs text-text-muted">Not connected in prototype.</p>
        </div>
      </div>

      {/* Alert Types & Switches */}
      <div className="rounded-lg border border-border bg-surface p-4 sm:p-6 space-y-4">
        <h3 className="text-base font-semibold text-text-primary border-b border-border/60 pb-3">
          {t('topicsTitle')}
        </h3>

        <div className="space-y-4">
          <label className="flex items-center justify-between gap-4 cursor-pointer">
            <div>
              <span className="block text-sm font-medium text-text-primary">{t('criticalRisk')}</span>
              <span className="text-xs text-text-muted">Immediate alert when cash runway or liquidity risks reach critical level.</span>
            </div>
            <input
              type="checkbox"
              checked={criticalRisk}
              onChange={(e) => setCriticalRisk(e.target.checked)}
              className="rounded accent-brand size-5 cursor-pointer shrink-0"
            />
          </label>

          <label className="flex items-center justify-between gap-4 cursor-pointer border-t border-border/40 pt-3">
            <div>
              <span className="block text-sm font-medium text-text-primary">{t('runwayWarning')}</span>
              <span className="text-xs text-text-muted">Alert when projected cash runway drops below configured threshold.</span>
            </div>
            <input
              type="checkbox"
              checked={runwayWarning}
              onChange={(e) => setRunwayWarning(e.target.checked)}
              className="rounded accent-brand size-5 cursor-pointer shrink-0"
            />
          </label>

          <label className="flex items-center justify-between gap-4 cursor-pointer border-t border-border/40 pt-3">
            <div>
              <span className="block text-sm font-medium text-text-primary">{t('staleData')}</span>
              <span className="text-xs text-text-muted">Notification when financial snapshot data is over 30 days old.</span>
            </div>
            <input
              type="checkbox"
              checked={staleData}
              onChange={(e) => setStaleData(e.target.checked)}
              className="rounded accent-brand size-5 cursor-pointer shrink-0"
            />
          </label>

          <label className="flex items-center justify-between gap-4 cursor-pointer border-t border-border/40 pt-3">
            <div>
              <span className="block text-sm font-medium text-text-primary">{t('simCompletion')}</span>
              <span className="text-xs text-text-muted">Notification when background scenario simulations complete.</span>
            </div>
            <input
              type="checkbox"
              checked={simCompletion}
              onChange={(e) => setSimCompletion(e.target.checked)}
              className="rounded accent-brand size-5 cursor-pointer shrink-0"
            />
          </label>

          <label className="flex items-center justify-between gap-4 cursor-pointer border-t border-border/40 pt-3">
            <div>
              <span className="block text-sm font-medium text-text-primary">{t('monthlySummary')}</span>
              <span className="text-xs text-text-muted">Monthly overview digest of business health and key metric changes.</span>
            </div>
            <input
              type="checkbox"
              checked={monthlySummary}
              onChange={(e) => setMonthlySummary(e.target.checked)}
              className="rounded accent-brand size-5 cursor-pointer shrink-0"
            />
          </label>

          <label className="flex items-center justify-between gap-4 cursor-pointer border-t border-border/40 pt-3">
            <div>
              <span className="block text-sm font-medium text-text-primary">{t('reportReady')}</span>
              <span className="text-xs text-text-muted">Alert when generated PDF decision reports are ready for review.</span>
            </div>
            <input
              type="checkbox"
              checked={reportReady}
              onChange={(e) => setReportReady(e.target.checked)}
              className="rounded accent-brand size-5 cursor-pointer shrink-0"
            />
          </label>

          <label className="flex items-center justify-between gap-4 cursor-pointer border-t border-border/40 pt-3">
            <div>
              <span className="block text-sm font-medium text-text-primary">{t('missingData')}</span>
              <span className="text-xs text-text-muted">Reminders when key financial snapshots or category data are missing.</span>
            </div>
            <input
              type="checkbox"
              checked={missingData}
              onChange={(e) => setMissingData(e.target.checked)}
              className="rounded accent-brand size-5 cursor-pointer shrink-0"
            />
          </label>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover transition-colors cursor-pointer"
          >
            {tCommon('saveBar.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
