'use client';

import { useTranslations } from 'next-intl';
import { H2, BodyLarge } from '@/components/ui/typography';
import { Clock, Calculator, ShieldAlert, ArrowRight } from 'lucide-react';

export function ThaiSmeSection() {
  const t = useTranslations('landing.thaiSme');

  const problems = [
    {
      icon: Clock,
      title: t('problems.0.title'),
      impact: t('problems.0.impact'),
      solution: t('problems.0.solution'),
    },
    {
      icon: Calculator,
      title: t('problems.1.title'),
      impact: t('problems.1.impact'),
      solution: t('problems.1.solution'),
    },
    {
      icon: ShieldAlert,
      title: t('problems.2.title'),
      impact: t('problems.2.impact'),
      solution: t('problems.2.solution'),
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 border-b border-border bg-surface-subtle">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <H2 className="text-[26px]/[34px] sm:text-[32px]/[40px] font-[700] text-text-primary tracking-tight">
            {t('title')}
          </H2>
          <BodyLarge className="mt-3 text-text-secondary text-[15px]/[24px] sm:text-[16px]/[26px]">
            {t('subtitle')}
          </BodyLarge>
        </div>

        {/* Problem and Response Rows */}
        <div className="flex flex-col gap-5 max-w-4xl mx-auto">
          {problems.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-[var(--radius-lg)] border border-border bg-surface shadow-xs flex flex-col md:flex-row md:items-center gap-6 justify-between"
            >
              {/* Left: Problem & Impact */}
              <div className="flex items-start gap-4 flex-1">
                <div className="size-11 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-warning flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon className="size-5 text-warning" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-[17px]/[24px] font-[700] text-text-primary">
                    {item.title}
                  </h3>
                  <p className="text-[14px]/[22px] text-text-secondary mt-1">
                    {item.impact}
                  </p>
                </div>
              </div>

              {/* Arrow indicator (desktop) */}
              <div className="hidden md:flex text-border shrink-0" aria-hidden="true">
                <ArrowRight className="size-5" />
              </div>

              {/* Right: Wallflower Response */}
              <div className="p-4 rounded-lg bg-brand-soft/40 border border-brand/30 md:w-[320px] shrink-0">
                <span className="text-[11px]/[16px] font-[700] text-brand uppercase tracking-wider block mb-1">
                  Wallflower Response
                </span>
                <p className="text-[13px]/[20px] font-[550] text-text-primary">
                  {item.solution}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
