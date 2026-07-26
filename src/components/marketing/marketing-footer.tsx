'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';

export function MarketingFooter() {
  const t = useTranslations('landing.footer');

  return (
    <footer className="border-t border-border bg-background py-8 sm:py-10">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6 text-center md:text-left">
          {/* Col 1: Brand & Tagline */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2.5 justify-self-start">
            <Link
              href="/"
              className="flex items-center gap-2 font-[650] text-[16px] text-text-primary"
            >
              <FlowerMark className="size-6" />
              <span>Wallflower</span>
            </Link>
          </div>

          {/* Col 2: Navigation Links (centered on desktop) */}
          <nav
            className="flex flex-wrap items-center justify-center gap-5 justify-self-center"
            aria-label="Footer navigation"
          >
            <Link
              href="/privacy"
              className="text-[13px]/[20px] text-text-muted hover:text-text-primary transition-colors"
            >
              {t('privacy')}
            </Link>
            <Link
              href="/terms"
              className="text-[13px]/[20px] text-text-muted hover:text-text-primary transition-colors"
            >
              {t('terms')}
            </Link>
          </nav>

          {/* Col 3: Copyright (end on desktop) */}
          <div className="justify-self-end text-center md:text-right">
            <p className="text-[13px]/[20px] text-text-muted">
              {t('copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FlowerMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="14" cy="14" r="4" className="fill-brand" />
      <circle cx="14" cy="6" r="3" className="fill-brand" opacity="0.75" />
      <circle cx="14" cy="22" r="3" className="fill-brand" opacity="0.75" />
      <circle cx="6" cy="14" r="3" className="fill-brand" opacity="0.75" />
      <circle cx="22" cy="14" r="3" className="fill-brand" opacity="0.75" />
    </svg>
  );
}
