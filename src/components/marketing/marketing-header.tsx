'use client';

import { useState, useSyncExternalStore } from 'react';
import { useLocale } from 'next-intl';
import { useTheme } from 'next-themes';
import { useRouter, usePathname, Link } from '@/lib/i18n/navigation';
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

const emptySubscribe = () => () => {};

export function MarketingHeader() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Product', href: '/' },
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Resources', href: '/#faq' },
    { label: 'About', href: '/#how-it-works' },
  ];

  const handleLanguageToggle = () => {
    const nextLocale = locale === 'en' ? 'th' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/60 transition-colors">
      <div className="w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 h-[72px] flex items-center justify-between gap-6 text-left">
        {/* Left: Brand Logo */}
        <Link
          href="/"
          className="flex items-center group transition-opacity hover:opacity-95"
        >
          <Logo size="md" />
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Switcher */}
          <button
            type="button"
            onClick={handleThemeToggle}
            className="p-2 rounded-xl border border-border bg-surface text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {mounted && resolvedTheme === 'dark' ? (
              <Sun className="size-4 text-amber-400" />
            ) : (
              <Moon className="size-4 text-text-muted" />
            )}
          </button>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={handleLanguageToggle}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-border bg-surface text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <Globe className="size-3.5 text-text-muted" />
            <span>{locale === 'en' ? 'TH' : 'EN'}</span>
          </button>

          {/* Log In */}
          <Link
            href="/login"
            className="text-xs font-bold text-text-primary hover:text-brand transition-colors px-3 py-2"
          >
            Log in
          </Link>

          {/* Start Free CTA */}
          <Link
            href="/register"
            className="px-4 py-2 text-xs font-bold rounded-xl bg-brand hover:bg-brand-hover text-on-primary transition-colors shadow-2xs cursor-pointer"
          >
            Start Free
          </Link>
        </div>

        {/* Mobile menu controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={handleThemeToggle}
            className="p-1.5 rounded-lg border border-border text-text-secondary"
          >
            {mounted && resolvedTheme === 'dark' ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-lg border border-border text-text-secondary"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav sheet */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border bg-surface px-6 py-4 space-y-3 text-left">
          <div className="flex flex-col gap-3 text-xs font-bold text-text-primary">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-1 hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-border flex items-center gap-3">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="w-1/2 py-2 text-center text-xs font-bold border border-border rounded-xl bg-surface"
            >
              Log in
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="w-1/2 py-2 text-center text-xs font-bold bg-brand hover:bg-brand-hover text-on-primary rounded-xl"
            >
              Start Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
