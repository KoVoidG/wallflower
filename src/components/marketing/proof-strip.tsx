'use client';

import { useTranslations } from 'next-intl';
import { Stethoscope, Activity, Scale, CheckCircle2 } from 'lucide-react';

export function ProofStrip() {
  const t = useTranslations('landing.proof');

  const items = [
    { icon: Stethoscope, label: t('diagnose') },
    { icon: Activity, label: t('simulate') },
    { icon: Scale, label: t('tradeOffs') },
    { icon: CheckCircle2, label: t('act') },
  ];

  return (
    <section className="py-6 sm:py-8 border-b border-border bg-surface-subtle">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center justify-between">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 justify-start md:justify-center"
            >
              <div className="size-7 rounded-md bg-brand-soft flex items-center justify-center shrink-0">
                <item.icon className="size-4 text-brand" aria-hidden="true" />
              </div>
              <span className="text-[13px]/[20px] sm:text-[14px]/[22px] font-[600] text-text-primary">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
