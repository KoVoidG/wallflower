'use client';

import { useTranslations } from 'next-intl';
import { Check, Info, Sparkles, Zap } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface PlanModalProps {
  open: boolean;
  onClose: () => void;
}

export function PlanModal({ open, onClose }: PlanModalProps) {
  const t = useTranslations('planModal');

  return (
    <Dialog open={open} onClose={onClose} size="lg" title={t('title')}>
      <div className="space-y-6">
        {/* Subtitle */}
        <p className="text-sm text-text-secondary">{t('subtitle')}</p>

        {/* Prototype notice banner */}
        <div className="flex items-start gap-3 rounded-lg border border-border-strong bg-surface-subtle p-3.5 text-sm text-text-secondary">
          <Info className="size-5 shrink-0 text-brand mt-0.5" aria-hidden="true" />
          <p className="font-medium text-text-primary text-xs sm:text-sm">
            {t('prototypeNotice')}
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Basic Plan (Current) */}
          <div className="flex flex-col justify-between rounded-lg border border-border bg-surface p-4 text-left">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-semibold text-text-primary text-base">
                  {t('basicTier')}
                </span>
                <Badge variant="info">{t('currentPlan')}</Badge>
              </div>
              <p className="text-xs text-text-muted mb-4">{t('basicDesc')}</p>
              <ul className="space-y-2.5 text-xs text-text-secondary">
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-brand shrink-0" />
                  <span>{t('featureValues.basicSnapshots')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-brand shrink-0" />
                  <span>{t('features.riskDetection')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-brand shrink-0" />
                  <span>{t('featureValues.basicSimulations')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-brand shrink-0" />
                  <span>{t('featureValues.basicAi')}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="flex flex-col justify-between rounded-lg border-2 border-brand bg-brand-soft/30 p-4 text-left relative">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 font-semibold text-text-primary text-base">
                  <Sparkles className="size-4 text-brand" />
                  <span>{t('proTier')}</span>
                </div>
                <Badge variant="success">Pro</Badge>
              </div>
              <p className="text-xs text-text-muted mb-4">{t('proDesc')}</p>
              <ul className="space-y-2.5 text-xs text-text-secondary">
                <li className="flex items-center gap-2 font-medium text-text-primary">
                  <Check className="size-4 text-brand shrink-0" />
                  <span>{t('featureValues.proSnapshots')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-brand shrink-0" />
                  <span>{t('features.riskDetection')}</span>
                </li>
                <li className="flex items-center gap-2 font-medium text-text-primary">
                  <Check className="size-4 text-brand shrink-0" />
                  <span>{t('featureValues.proSimulations')}</span>
                </li>
                <li className="flex items-center gap-2 font-medium text-text-primary">
                  <Check className="size-4 text-brand shrink-0" />
                  <span>{t('featureValues.proAi')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-brand shrink-0" />
                  <span>{t('features.reports')}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="flex flex-col justify-between rounded-lg border border-border bg-surface p-4 text-left">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 font-semibold text-text-primary text-base">
                  <Zap className="size-4 text-brand" />
                  <span>{t('enterpriseTier')}</span>
                </div>
              </div>
              <p className="text-xs text-text-muted mb-4">{t('enterpriseDesc')}</p>
              <ul className="space-y-2.5 text-xs text-text-secondary">
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-brand shrink-0" />
                  <span>{t('featureValues.enterpriseSnapshots')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-brand shrink-0" />
                  <span>{t('featureValues.enterpriseSimulations')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-brand shrink-0" />
                  <span>{t('featureValues.enterpriseAi')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-brand shrink-0" />
                  <span>{t('features.multiEntity')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
