'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';

export function MarketingFooter() {
  const t = useTranslations('landing.footer');

  return (
    <footer className="border-t border-border bg-background py-8 sm:py-10">
      {/* Full width container matching header spacing and width */}
      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          {/* Left: Brand & Tagline */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <Link
              href="/"
              className="flex items-center gap-2 font-[650] text-[16px] text-text-primary hover:opacity-90 transition-opacity"
            >
              <FlowerMark className="size-6" />
              <span>Wallflower</span>
            </Link>
          </div>

          {/* Center: Privacy & Terms Links */}
          <nav
            className="flex items-center gap-6"
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

          {/* Right: Copyright */}
          <div className="text-center sm:text-right">
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
