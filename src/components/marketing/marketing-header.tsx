'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useTheme } from 'next-themes';
import { useRouter, usePathname, Link } from '@/lib/i18n/navigation';
import { Menu, X, Globe, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type SectionNavItem = { labelKey: string; type: 'section'; id: string };
type PageNavItem = { labelKey: string; type: 'page'; href: string };
type NavItem = SectionNavItem | PageNavItem;

const navigation: NavItem[] = [
  { labelKey: 'howItWorks', type: 'section', id: 'how-it-works' },
  { labelKey: 'decisions', type: 'section', id: 'decisions' },
  { labelKey: 'whyUs', type: 'section', id: 'why-us' },
  { labelKey: 'prototype', type: 'section', id: 'prototype' },
  { labelKey: 'pricing', type: 'page', href: '/pricing' },
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
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  const isLandingPage = pathname === '/' || pathname === '';
  const isPricingPage = pathname.includes('/pricing');

  const handleNavClick = useCallback(
    (item: NavItem) => {
      setMobileOpen(false);

      if (item.type === 'page') {
        router.push(item.href);
        return;
      }

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

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 border-b border-border transition-colors duration-200">
      {/* Full width container with generous padding & breathing room */}
      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 h-[72px] flex items-center justify-between gap-6">
        {/* Left: Brand Logo */}
        <div className="flex items-center shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-display font-bold text-[18px]/[24px] text-text-primary hover:opacity-90 transition-opacity whitespace-nowrap"
            aria-label="Wallflower homepage"
          >
            <FlowerMark className="size-7" />
            <span className="tracking-tight">Wallflower</span>
          </Link>
        </div>

        {/* Center: Navigation Links with ample spacing */}
        <nav
          className="hidden md:flex items-center gap-6 lg:gap-8 xl:gap-10 shrink-0"
          aria-label="Main navigation"
        >
          {navigation.map((item) => {
            const isActive =
              item.type === 'page'
                ? isPricingPage
                : isLandingPage && activeSection === item.id;
            return (
              <button
                key={item.labelKey}
                type="button"
                onClick={() => handleNavClick(item)}
                className={cn(
                  'text-[14px]/[20px] font-[500] transition-colors cursor-pointer relative py-1.5 whitespace-nowrap',
                  isActive
                    ? 'text-tertiary font-[600]'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                {t(item.labelKey)}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-tertiary rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Controls & CTAs */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4 shrink-0">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={handleLanguageToggle}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[13px]/[18px] font-[550] text-text-secondary hover:text-text-primary rounded-md border border-border/60 hover:border-border transition-all cursor-pointer whitespace-nowrap"
            aria-label={`Switch language to ${locale === 'en' ? 'Thai' : 'English'}`}
          >
            <Globe className="size-4 text-text-muted" aria-hidden="true" />
            <span>{locale === 'en' ? 'TH' : 'EN'}</span>
          </button>

          {/* Sign In */}
          <Link
            href="/login"
            className="text-[14px]/[20px] font-[550] text-text-secondary hover:text-text-primary transition-colors px-3 py-2 whitespace-nowrap"
          >
            {t('signIn')}
          </Link>

          {/* Primary Action Button */}
          <Button asChild size="md" variant="primary" className="whitespace-nowrap px-5">
            <Link href="/register">{t('analyseMyBusiness')}</Link>
          </Button>
        </div>

        {/* Mobile menu controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={handleLanguageToggle}
            className="flex items-center gap-1 px-2 py-1 text-[12px] font-[550] text-text-secondary rounded border border-border whitespace-nowrap"
          >
            <Globe className="size-3.5 text-text-muted" aria-hidden="true" />
            <span>{locale === 'en' ? 'TH' : 'EN'}</span>
          </button>

          <button
            type="button"
            onClick={handleThemeToggle}
            className="flex items-center justify-center p-1.5 text-text-secondary rounded border border-border"
            aria-label="Toggle dark/light theme"
          >
            {mounted && resolvedTheme === 'dark' ? (
              <Sun className="size-3.5 text-amber-400" aria-hidden="true" />
            ) : (
              <Moon className="size-3.5 text-text-muted" aria-hidden="true" />
            )}
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
        <div className="md:hidden bg-background border-b border-border px-6 py-4">
          <div className="w-full flex flex-col gap-3">
            <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
              {navigation.map((item) => (
                <button
                  key={item.labelKey}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className="text-left text-[15px]/[22px] font-[500] text-text-secondary hover:text-text-primary py-2 cursor-pointer bg-transparent border-none whitespace-nowrap"
                >
                  {t(item.labelKey)}
                </button>
              ))}
            </nav>

            <hr className="border-border my-1" />

            <div className="flex flex-col gap-2.5 pt-1">
              <Link
                href="/login"
                className="text-[14px]/[20px] font-[550] text-text-secondary py-2 text-center border border-border rounded-md whitespace-nowrap"
              >
                {t('signIn')}
              </Link>
              <Button asChild size="md" variant="primary" className="w-full whitespace-nowrap">
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
