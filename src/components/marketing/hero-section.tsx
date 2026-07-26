'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { H1, BodyLarge } from '@/components/ui/typography';
import { ProductPreview } from './product-preview';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  const t = useTranslations('landing.hero');

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden border-b border-border bg-background">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Copy (50% desktop width) */}
          <div className="flex flex-col gap-5 max-w-[580px]">
            <div>
              <Badge variant="brand">
                {t('badge')}
              </Badge>
            </div>

            {/* Headline visible immediately without zero-opacity flicker */}
            <H1 className="text-[32px]/[38px] sm:text-[40px]/[48px] lg:text-[48px]/[54px] font-[700] text-text-primary tracking-tight">
              {t('headline')}
            </H1>

            <BodyLarge className="text-text-secondary text-[16px]/[26px] sm:text-[17px]/[28px] max-w-[540px]">
              {t('subheadline')}
            </BodyLarge>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
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

          {/* Product Demonstration (50% desktop width) */}
          <div className="w-full">
            <ProductPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
