'use client';

import { useTranslations } from 'next-intl';
import { H2, Body, BodyLarge } from '@/components/ui/typography';
import { Calculator, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export function ExplainabilitySection() {
  const t = useTranslations('landing.explainability');

  const calculatedItems: string[] = t.raw('calculatedItems');
  const aiItems: string[] = t.raw('aiItems');

  return (
    <section id="why-us" className="py-16 sm:py-20 lg:py-24 border-b border-border bg-background">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-soft text-brand text-[13px]/[18px] font-[600] mb-3">
            <ShieldCheck className="size-4" aria-hidden="true" />
            <span>Deterministic Math & Executive AI</span>
          </div>
          <H2 className="text-[26px]/[34px] sm:text-[32px]/[40px] font-[700] text-text-primary tracking-tight">
            {t('title')}
          </H2>
          <BodyLarge className="mt-3 text-text-secondary text-[15px]/[24px] sm:text-[16px]/[26px]">
            {t('subtitle')}
          </BodyLarge>
        </div>

        {/* Clean Split Layout with Central Divider */}
        <div className="relative border border-border rounded-[var(--radius-xl)] bg-surface shadow-xs p-6 sm:p-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 relative">
            {/* Central Vertical Divider (desktop) */}
            <div
              className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-border"
              aria-hidden="true"
            />

            {/* Left Column: Calculation Engine */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-lg bg-brand-soft flex items-center justify-center shrink-0">
                  <Calculator className="size-5 text-brand" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-[20px]/[28px] font-[700] text-text-primary">
                    {t('calculatedTitle')}
                  </h3>
                  <span className="text-[12px]/[18px] font-[600] text-brand uppercase tracking-wider">
                    Source of Truth
                  </span>
                </div>
              </div>

              <Body className="text-[14px]/[22px] text-text-secondary">
                {t('calculatedDesc')}
              </Body>

              <hr className="border-border my-1" />

              <ul className="flex flex-col gap-3.5">
                {calculatedItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="size-4 text-brand shrink-0 mt-1" aria-hidden="true" />
                    <span className="text-[14px]/[22px] font-[550] text-text-primary">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: AI Explanation */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-lg bg-ai-soft flex items-center justify-center shrink-0">
                  <Sparkles className="size-5 text-ai" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-[20px]/[28px] font-[700] text-text-primary">
                    {t('aiTitle')}
                  </h3>
                  <span className="text-[12px]/[18px] font-[600] text-ai uppercase tracking-wider">
                    Executive Interpretation
                  </span>
                </div>
              </div>

              <Body className="text-[14px]/[22px] text-text-secondary">
                {t('aiDesc')}
              </Body>

              <hr className="border-border my-1" />

              <ul className="flex flex-col gap-3.5">
                {aiItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="size-4 text-ai shrink-0 mt-1" aria-hidden="true" />
                    <span className="text-[14px]/[22px] font-[550] text-text-primary">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
