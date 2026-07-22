'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Sparkles, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PlanModal } from '@/features/billing/components/plan-modal';
import { DangerZone } from './danger-zone';

export function PlanUsageSettings() {
  const t = useTranslations('settingsPage.planPage');
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-text-primary">{t('title')}</h2>
        <p className="text-sm text-text-secondary">
          Overview of your current plan tier, included features, resource limits, and upgrade preview.
        </p>
      </div>

      {/* Prototype Notice Banner */}
      <div className="flex items-start gap-3 rounded-lg border border-border bg-surface-subtle p-3.5 text-xs text-text-secondary">
        <Info className="size-4 text-brand shrink-0 mt-0.5" />
        <p>{t('prototypeNotice')}</p>
      </div>

      {/* Current Plan Overview Card */}
      <div className="rounded-lg border border-border-strong bg-surface p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-brand-soft text-brand">
              <Sparkles className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-text-primary">{t('basicTier')}</h3>
                <Badge variant="info">Current</Badge>
              </div>
              <p className="text-xs text-text-muted">{t('basicDesc')}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="rounded-md border border-border-strong bg-surface px-4 py-2 text-xs font-semibold text-text-primary hover:bg-surface-subtle hover:text-brand transition-colors cursor-pointer self-start sm:self-center"
          >
            {t('viewPlans')}
          </button>
        </div>

        {/* Resource Usage Progress Indicators */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">{t('usageTitle')}</h4>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">{t('snapshotsUsed')}</span>
              <span className="font-semibold text-text-primary">4 / 6 snapshots</span>
            </div>
            <div className="h-2 w-full rounded-full bg-surface-subtle overflow-hidden">
              <div className="h-full bg-brand rounded-full w-[66%]" />
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">{t('simulationsRun')}</span>
              <span className="font-semibold text-text-primary">2 / 3 simulations</span>
            </div>
            <div className="h-2 w-full rounded-full bg-surface-subtle overflow-hidden">
              <div className="h-full bg-brand rounded-full w-[66%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Plan Modal Trigger */}
      <PlanModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Account Deletion / Danger Zone at bottom of Plan & Usage */}
      <div className="pt-4 border-t border-border/60">
        <DangerZone />
      </div>
    </div>
  );
}
