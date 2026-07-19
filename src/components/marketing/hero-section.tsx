'use client';

import { Link } from '@/lib/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { Display, BodyLarge } from '@/components/ui/typography';
import { FadeIn } from '@/components/motion';
import { useReducedMotion } from '@/components/motion';
import { motion } from 'motion/react';
import { EASINGS, DURATIONS } from '@/components/motion/motion-config';
import { ProductPreview } from './product-preview';

const headlineLines = [
  'See the impact',
  'before you make',
  'the move.',
];

export function HeroSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="relative min-h-[760px] flex items-center pt-24 pb-16 md:pb-24">
      <div className="mx-auto max-w-[1280px] px-6 md:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Copy */}
          <div className="flex flex-col gap-6 max-w-xl">
            <FadeIn delay={0.1}>
              <Badge variant="brand">
                Decision intelligence for Thai SMEs
              </Badge>
            </FadeIn>

            {/* Headline reveal by line */}
            <div>
              {headlineLines.map((line, i) => {
                if (prefersReduced) {
                  return (
                    <Display key={i} as="span" className="block">
                      {line}
                    </Display>
                  );
                }
                return (
                  <motion.span
                    key={i}
                    className="block text-[38px]/[42px] md:text-[44px]/[48px] lg:text-[64px]/[68px] font-[650] text-text-primary"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: DURATIONS.pageReveal,
                      delay: 0.2 + i * 0.12,
                      ease: EASINGS.default,
                    }}
                  >
                    {line}
                  </motion.span>
                );
              })}
            </div>

            <FadeIn delay={0.6}>
              <BodyLarge>
                Wallflower turns your business data into clear diagnostics, risk
                warnings, and decision simulations—so you can act with evidence
                instead of guesswork.
              </BodyLarge>
            </FadeIn>

            <FadeIn delay={0.75}>
              <div className="flex flex-wrap gap-3 mt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-[var(--radius-md)] bg-brand text-white text-[15px]/[24px] font-[550] hover:bg-brand-hover transition-colors"
                >
                  Analyze my business
                </Link>
                <a
                  href="#scenarios"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-[var(--radius-md)] border border-border text-text-primary text-[15px]/[24px] font-[550] hover:bg-surface-subtle transition-colors"
                >
                  See a sample simulation
                </a>
              </div>
            </FadeIn>
          </div>

          {/* Product preview */}
          <FadeIn delay={0.5} className="relative">
            <ProductPreview />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
