'use client';

import { Calculator, Sparkles, CheckCircle } from 'lucide-react';
import { H2, H3, Body, BodyLarge } from '@/components/ui/typography';
import { Surface } from '@/components/ui/surface';
import { FadeIn } from '@/components/motion';

const calculatedItems = [
  'Revenue projections from your data',
  'Cash runway and burn rate',
  'Break-even analysis',
  'Working capital ratios',
  'ROI and payback period',
];

const aiItems = [
  'Summarizes what the numbers mean',
  'Explains risks in plain language',
  'Suggests things to consider',
  'Highlights assumptions made',
  'Never overrides calculations',
];

export function ExplainabilitySection() {
  return (
    <section id="why-us" className="py-20 md:py-28">
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <FadeIn>
          <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
            <H2>Your numbers, calculated. Not predicted.</H2>
            <BodyLarge className="mt-3">
              Wallflower separates deterministic math from AI interpretation.
              You always know which is which.
            </BodyLarge>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Calculated column */}
          <FadeIn delay={0.15}>
            <Surface border className="p-6 h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center justify-center size-10 rounded-full bg-brand-soft">
                  <Calculator className="size-5 text-brand" aria-hidden="true" />
                </div>
                <H3>Calculated</H3>
              </div>
              <Body className="mb-4">
                Deterministic formulas produce exact, reproducible results from your business data.
              </Body>
              <ul className="flex flex-col gap-3">
                {calculatedItems.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-brand shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-[14px]/[22px] text-text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </Surface>
          </FadeIn>

          {/* AI Explained column */}
          <FadeIn delay={0.3}>
            <Surface border className="p-6 h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center justify-center size-10 rounded-full bg-ai-soft">
                  <Sparkles className="size-5 text-ai" aria-hidden="true" />
                </div>
                <H3>AI Explained</H3>
              </div>
              <Body className="mb-4">
                AI reads the calculated results and explains them in context — it never calculates financial values.
              </Body>
              <ul className="flex flex-col gap-3">
                {aiItems.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-ai shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-[14px]/[22px] text-text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </Surface>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
