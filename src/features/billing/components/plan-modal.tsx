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
      <div className="space-y-6 pt-1">
        {/* Subtitle */}
        <p className="text-xs sm:text-sm font-medium text-text-secondary leading-relaxed">
          {t('subtitle')}
        </p>

        {/* Prototype notice banner */}
        <div className="flex items-start gap-3 rounded-2xl border border-tertiary/30 bg-tertiary/10 p-3.5 text-xs text-text-secondary shadow-2xs">
          <Info
            className="size-4 shrink-0 text-tertiary mt-0.5"
            aria-hidden="true"
          />
          <p className="font-semibold text-text-primary text-xs leading-relaxed">
            {t('prototypeNotice')}
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 text-left">
          {/* Basic Plan (Current) */}
          <div className="flex flex-col justify-between rounded-2xl border-2 border-border-strong bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-border-strong relative">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-display text-base font-bold text-text-primary">
                  {t('basicTier')}
                </span>
                <Badge
                  variant="info"
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                >
                  {t('currentPlan')}
                </Badge>
              </div>
              <p className="text-xs text-text-muted font-medium mb-4 min-h-[32px]">
                {t('basicDesc')}
              </p>
              <ul className="space-y-2.5 text-xs text-text-secondary">
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-tertiary shrink-0" />
                  <span className="font-medium text-text-primary">
                    {t('featureValues.basicSnapshots')}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-tertiary shrink-0" />
                  <span className="font-medium">
                    {t('features.riskDetection')}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-tertiary shrink-0" />
                  <span className="font-medium">
                    {t('featureValues.basicSimulations')}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-tertiary shrink-0" />
                  <span className="font-medium">
                    {t('featureValues.basicAi')}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pro Plan (Highlighted Card) */}
          <div className="flex flex-col justify-between rounded-2xl border-2 border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/20 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/15 relative shadow-md">
            {/* Top Recommended Tag */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[9px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              Recommended
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 font-display text-base font-bold text-text-primary">
                  <Sparkles className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{t('proTier')}</span>
                </div>
              </div>
              <p className="text-xs text-text-muted font-medium mb-4 min-h-[32px]">
                {t('proDesc')}
              </p>
              <ul className="space-y-2.5 text-xs text-text-secondary">
                <li className="flex items-center gap-2 font-bold text-text-primary">
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{t('featureValues.proSnapshots')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-medium text-text-primary">
                    {t('features.riskDetection')}
                  </span>
                </li>
                <li className="flex items-center gap-2 font-bold text-text-primary">
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{t('featureValues.proSimulations')}</span>
                </li>
                <li className="flex items-center gap-2 font-bold text-text-primary">
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{t('featureValues.proAi')}</span>
                </li>
                <li className="flex items-center gap-2 font-bold text-text-primary">
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{t('features.reports')}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="flex flex-col justify-between rounded-2xl border-2 border-border-strong bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-border-strong relative">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 font-display text-base font-bold text-text-primary">
                  <Zap className="size-4 text-tertiary" />
                  <span>{t('enterpriseTier')}</span>
                </div>
              </div>
              <p className="text-xs text-text-muted font-medium mb-4 min-h-[32px]">
                {t('enterpriseDesc')}
              </p>
              <ul className="space-y-2.5 text-xs text-text-secondary">
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-tertiary shrink-0" />
                  <span className="font-medium text-text-primary">
                    {t('featureValues.enterpriseSnapshots')}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-tertiary shrink-0" />
                  <span className="font-medium text-text-primary">
                    {t('featureValues.enterpriseSimulations')}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-tertiary shrink-0" />
                  <span className="font-medium text-text-primary">
                    {t('featureValues.enterpriseAi')}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 text-tertiary shrink-0" />
                  <span className="font-medium text-text-primary">
                    {t('features.multiEntity')}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="flex justify-end pt-3 border-t border-border/60">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-tertiary px-5 py-2 text-xs font-bold text-on-primary hover:bg-tertiary-hover transition-colors cursor-pointer shadow-2xs"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
