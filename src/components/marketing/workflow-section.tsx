'use client';

import { useTranslations } from 'next-intl';
import { H2, Body, BodyLarge } from '@/components/ui/typography';
import { Stethoscope, Sliders, CheckCircle2 } from 'lucide-react';

export function WorkflowSection() {
  const t = useTranslations('landing.workflow');

  const steps = [
    {
      number: '01',
      icon: Stethoscope,
      title: t('step01Title'),
      description: t('step01Desc'),
    },
    {
      number: '02',
      icon: Sliders,
      title: t('step02Title'),
      description: t('step02Desc'),
    },
    {
      number: '03',
      icon: CheckCircle2,
      title: t('step03Title'),
      description: t('step03Desc'),
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 border-b border-border bg-background">
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

        {/* Connected Process Layout */}
        <div className="relative">
          {/* Desktop horizontal connecting line */}
          <div
            className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-[2px] bg-border z-0"
            aria-hidden="true"
          />

          <div className="grid md:grid-cols-3 gap-8 md:gap-6 relative z-10">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center text-center group">
                {/* Step Icon Badge */}
                <div className="size-14 rounded-full bg-surface border-2 border-brand text-brand font-[700] text-[16px] flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105 mb-5 shrink-0">
                  <step.icon className="size-6 text-brand" aria-hidden="true" />
                </div>

                {/* Step Content */}
                <div className="flex flex-col gap-2">
                  <span className="text-[12px]/[18px] font-[700] text-brand uppercase tracking-wider">
                    Step {step.number}
                  </span>
                  <h3 className="text-[18px]/[26px] font-[650] text-text-primary">
                    {step.title}
                  </h3>
                  <Body className="text-[14px]/[22px] text-text-secondary max-w-[320px] mx-auto">
                    {step.description}
                  </Body>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
