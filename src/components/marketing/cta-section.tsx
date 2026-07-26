'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { H2, BodyLarge } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export function CtaSection() {
  const t = useTranslations('landing.cta');

  return (
    <section id="cta" className="py-16 sm:py-20 border-b border-border bg-brand-soft/30">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center gap-5 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-soft text-brand text-[13px]/[18px] font-[600]">
            <ShieldCheck className="size-4" aria-hidden="true" />
            <span>Deterministic Math • Evidence-Based Action</span>
          </div>

          <H2 className="text-[26px]/[34px] sm:text-[34px]/[42px] font-[700] text-text-primary tracking-tight">
            {t('title')}
          </H2>

          <BodyLarge className="text-text-secondary text-[15px]/[24px] sm:text-[16px]/[26px]">
            {t('subtitle')}
          </BodyLarge>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button asChild size="lg" variant="primary">
              <Link href="/register">
                {t('primaryCta')}
                <ArrowRight className="size-4 ml-1" aria-hidden="true" />
              </Link>
            </Button>

            <Button asChild size="lg" variant="secondary">
              <a href="#decisions">
                {t('secondaryCta')}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
