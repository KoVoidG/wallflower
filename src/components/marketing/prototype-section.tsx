'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { BodyLarge } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { ArrowRight, Layers } from 'lucide-react';

export function PrototypeSection() {
  const t = useTranslations('landing.prototype');

  return (
    <section id="prototype" className="py-16 sm:py-20 border-b border-border bg-background">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-[var(--radius-xl)] border border-brand/30 bg-brand-soft/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4 max-w-2xl">
            <div className="size-12 rounded-xl bg-brand text-white flex items-center justify-center shrink-0 mt-1">
              <Layers className="size-6" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-[22px]/[30px] font-[700] text-text-primary tracking-tight">
                {t('title')}
              </h3>
              <BodyLarge className="text-text-secondary text-[15px]/[24px] mt-1">
                {t('subtitle')}
              </BodyLarge>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <Button asChild size="lg" variant="primary" className="w-full md:w-auto">
              <Link href="/dashboard">
                {t('exploreCta')}
                <ArrowRight className="size-4 ml-1" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
