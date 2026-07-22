'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ShieldCheck, Info, RotateCcw, Trash2, AlertTriangle } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';

export function DataPrivacySettings() {
  const t = useTranslations('settingsPage.privacyPage');
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [actionDoneNotice, setActionDoneNotice] = useState('');

  const handleConfirmReset = () => {
    setResetModalOpen(false);
    setActionDoneNotice('Prototype data reset to default SME baseline.');
    setTimeout(() => setActionDoneNotice(''), 4000);
  };

  const handleConfirmClear = () => {
    setClearModalOpen(false);
    setActionDoneNotice('Business profile and snapshot data cleared.');
    setTimeout(() => setActionDoneNotice(''), 4000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-text-primary">{t('title')}</h2>
        <p className="text-sm text-text-secondary">
          Understand how business records are processed and manage prototype data state.
        </p>
      </div>

      {actionDoneNotice && (
        <div className="rounded-lg border border-brand/40 bg-brand-soft px-4 py-3 text-sm text-brand font-medium">
          {actionDoneNotice}
        </div>
      )}

      {/* Prototype Notice Banner */}
      <div className="flex items-start gap-3 rounded-lg border border-border bg-surface-subtle p-3.5 text-xs text-text-secondary">
        <Info className="size-4 text-brand shrink-0 mt-0.5" />
        <p>{t('prototypeNotice')}</p>
      </div>

      {/* How Data is Used */}
      <div className="rounded-lg border border-border bg-surface p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <ShieldCheck className="size-4 text-brand" />
          <h3 className="text-base font-semibold text-text-primary">{t('dataUsageTitle')}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="rounded-md border border-border/60 bg-surface-subtle p-3.5 space-y-1">
            <span className="font-semibold text-text-primary block">Deterministic Math Engine</span>
            <p className="text-text-muted text-xs leading-relaxed">{t('mathUsage')}</p>
          </div>

          <div className="rounded-md border border-border/60 bg-surface-subtle p-3.5 space-y-1">
            <span className="font-semibold text-text-primary block">AI Advisor Explanations</span>
            <p className="text-text-muted text-xs leading-relaxed">{t('aiUsage')}</p>
          </div>
        </div>
      </div>

      {/* Data Status & Completeness */}
      <div className="rounded-lg border border-border bg-surface p-4 sm:p-6 space-y-4">
        <h3 className="text-base font-semibold text-text-primary border-b border-border/60 pb-3">
          {t('statusTitle')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div>
            <span className="block text-text-muted">{t('dataThrough')}</span>
            <span className="font-semibold text-text-primary">May 2026</span>
          </div>
          <div>
            <span className="block text-text-muted">{t('completenessScore')}</span>
            <span className="font-semibold text-text-primary">85% (4 of 6 snapshots)</span>
          </div>
          <div>
            <span className="block text-text-muted">{t('missingCategories')}</span>
            <span className="font-semibold text-text-primary">Payroll Q1, Inventory details</span>
          </div>
        </div>
      </div>

      {/* Destructive Prototype Data Actions */}
      <div className="rounded-lg border border-border bg-surface p-4 sm:p-6 space-y-4">
        <h3 className="text-base font-semibold text-text-primary border-b border-border/60 pb-3">
          {t('destructiveTitle')}
        </h3>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-md border border-border/60 bg-surface-subtle p-3.5">
            <div>
              <span className="text-sm font-semibold text-text-primary block">{t('resetData')}</span>
              <span className="text-xs text-text-muted">{t('resetDataDesc')}</span>
            </div>
            <button
              type="button"
              onClick={() => setResetModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer self-start sm:self-center"
            >
              <RotateCcw className="size-3.5 text-brand" />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-md border border-border/60 bg-surface-subtle p-3.5">
            <div>
              <span className="text-sm font-semibold text-text-primary block">{t('clearData')}</span>
              <span className="text-xs text-text-muted">{t('clearDataDesc')}</span>
            </div>
            <button
              type="button"
              onClick={() => setClearModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer self-start sm:self-center"
            >
              <Trash2 className="size-3.5 text-danger" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <Dialog open={resetModalOpen} onClose={() => setResetModalOpen(false)} title="Reset Prototype Data?">
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            This action will reset your business data to the default SME baseline fixtures. Any custom financial entries will be restored to defaults.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setResetModalOpen(false)}
              className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-subtle cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmReset}
              className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover cursor-pointer"
            >
              Confirm Reset
            </button>
          </div>
        </div>
      </Dialog>

      {/* Clear Confirmation Dialog */}
      <Dialog open={clearModalOpen} onClose={() => setClearModalOpen(false)} title="Clear Business Profile Data?">
        <div className="space-y-4">
          <div className="flex items-start gap-2.5 rounded-md border border-danger/40 bg-danger-soft/40 p-3 text-xs text-danger">
            <AlertTriangle className="size-4 shrink-0 mt-0.5" />
            <span>Clearing profile data removes saved monthly snapshot inputs in local prototype state.</span>
          </div>
          <p className="text-sm text-text-secondary">Are you sure you want to clear saved business inputs?</p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setClearModalOpen(false)}
              className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-subtle cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmClear}
              className="rounded-md bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-danger/90 cursor-pointer"
            >
              Clear Data
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
