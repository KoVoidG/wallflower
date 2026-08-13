'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { PlanModal } from './plan-modal';

interface UpgradeCardProps {
  collapsed?: boolean;
}

export function UpgradeCard({ collapsed = false }: UpgradeCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const t = useTranslations('upgradeCard');

  if (collapsed) {
    return (
      <>
        <div className="px-2 py-2">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className={cn(
              'flex size-10 w-full items-center justify-center rounded-lg border border-border-strong bg-surface-subtle text-brand',
              'hover:bg-brand-soft hover:text-brand-dark transition-colors',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand cursor-pointer'
            )}
            title={t('title')}
            aria-label={t('title')}
          >
            <Sparkles className="size-4 shrink-0" aria-hidden="true" />
          </button>
        </div>
        <PlanModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <div className="px-3 py-2">
        <div className="flex flex-col gap-2 rounded-lg border border-border-strong bg-surface-subtle p-3 transition-colors">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-brand-soft text-brand">
              <Sparkles className="size-3" aria-hidden="true" />
              {t('badge')}
            </span>
          </div>

          <div className="space-y-0.5">
            <h3 className="text-xs font-semibold text-text-primary leading-snug">
              {t('title')}
            </h3>
            <p className="text-[11px] text-text-muted leading-tight">
              {t('description')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className={cn(
              'mt-1 w-full rounded-md border border-border-strong bg-surface px-2.5 py-1.5 text-xs font-medium text-text-primary',
              'hover:bg-surface-subtle hover:text-brand transition-colors',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand cursor-pointer text-center'
            )}
          >
            {t('viewPlans')}
          </button>
        </div>
      </div>
      <PlanModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
