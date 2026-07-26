'use client';

import { useState, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname, Link } from '@/lib/i18n/navigation';
import { Menu, X, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type NavItem = {
  key: string;
  id: string;
};

const navigation: NavItem[] = [
  { key: 'howItWorks', id: 'how-it-works' },
  { key: 'decisions', id: 'decisions' },
  { key: 'whyUs', id: 'why-us' },
  { key: 'prototype', id: 'prototype' },
];

function scrollToSection(id: string): boolean {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      history.replaceState(null, '', window.location.pathname);
    }, 600);
    return true;
  }
  return false;
}

export function MarketingHeader() {
  const t = useTranslations('landing.header');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  const isLandingPage = pathname === '/' || pathname === '';

  const handleNavClick = useCallback(
    (item: NavItem) => {
      setMobileOpen(false);
      setActiveSection(item.id);

      if (isLandingPage) {
        scrollToSection(item.id);
      } else {
        router.push(`/#${item.id}`);
      }
    },
    [router, isLandingPage]
  );

  const handleLanguageToggle = () => {
    const nextLocale = locale === 'en' ? 'th' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 border-b border-border transition-colors duration-200">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8 h-[70px] flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
        {/* Col 1: Logo */}
        <div className="flex items-center justify-self-start">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-[650] text-[18px]/[24px] text-text-primary hover:opacity-90 transition-opacity"
            aria-label="Wallflower homepage"
          >
            <FlowerMark className="size-7" />
            <span className="tracking-tight">Wallflower</span>
          </Link>
        </div>

        {/* Col 2: Navigation (desktop geometrically centered) */}
        <nav
          className="hidden md:flex items-center gap-7 justify-self-center"
          aria-label="Main navigation"
        >
          {navigation.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleNavClick(item)}
                className={cn(
                  'text-[14px]/[20px] font-[500] transition-colors cursor-pointer relative py-1',
                  isActive
                    ? 'text-brand font-[600]'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                {t(item.key)}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Col 3: Controls (desktop end) */}
        <div className="hidden md:flex items-center gap-3 justify-self-end">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={handleLanguageToggle}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[13px]/[18px] font-[550] text-text-secondary hover:text-text-primary rounded-md border border-transparent hover:border-border transition-all cursor-pointer"
            aria-label={`Switch language to ${locale === 'en' ? 'Thai' : 'English'}`}
          >
            <Globe className="size-4 text-text-muted" aria-hidden="true" />
            <span>{locale === 'en' ? 'TH' : 'EN'}</span>
          </button>

          {/* Sign In */}
          <Link
            href="/login"
            className="text-[14px]/[20px] font-[550] text-text-secondary hover:text-text-primary transition-colors px-3 py-2"
          >
            {t('signIn')}
          </Link>

          {/* Primary Action Button */}
          <Button asChild size="md" variant="primary">
            <Link href="/register">{t('analyseMyBusiness')}</Link>
          </Button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={handleLanguageToggle}
            className="flex items-center gap-1 px-2 py-1 text-[12px] font-[550] text-text-secondary rounded border border-border"
          >
            <Globe className="size-3.5 text-text-muted" aria-hidden="true" />
            <span>{locale === 'en' ? 'TH' : 'EN'}</span>
          </button>

          <button
            type="button"
            className="p-2 text-text-secondary hover:text-text-primary cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation sheet */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-5 py-4">
          <div className="mx-auto w-full max-w-[1200px] flex flex-col gap-3">
            <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
              {navigation.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className="text-left text-[15px]/[22px] font-[500] text-text-secondary hover:text-text-primary py-2 cursor-pointer bg-transparent border-none"
                >
                  {t(item.key)}
                </button>
              ))}
            </nav>

            <hr className="border-border my-1" />

            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/login"
                className="text-[14px]/[20px] font-[550] text-text-secondary py-2 text-center border border-border rounded-md"
              >
                {t('signIn')}
              </Link>
              <Button asChild size="md" variant="primary" className="w-full">
                <Link href="/register">{t('analyseMyBusiness')}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
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
      <circle cx="8.5" cy="8.5" r="2.5" className="fill-brand" opacity="0.5" />
      <circle cx="19.5" cy="8.5" r="2.5" className="fill-brand" opacity="0.5" />
      <circle cx="8.5" cy="19.5" r="2.5" className="fill-brand" opacity="0.5" />
      <circle cx="19.5" cy="19.5" r="2.5" className="fill-brand" opacity="0.5" />
    </svg>
  );
}
