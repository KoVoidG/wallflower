'use client';

import { useState, useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { Link, usePathname, useRouter } from '@/lib/i18n/navigation';
import { Menu, X, Sun, Moon, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';

const emptySubscribe = () => () => {};

export function MarketingHeader() {
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Decision Journey', targetId: 'journey' },
    { label: 'Simulator', targetId: 'simulator' },
    { label: 'Features', targetId: 'features' },
    { label: 'Pricing', targetId: 'pricing' },
    { label: 'FAQ', targetId: 'faq' },
  ];

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const scrollToTop = (e: React.MouseEvent) => {
    setMobileOpen(false);

    if (pathname === '/' || pathname === '') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 200);
    }
  };

  const scrollToSection = (targetId: string) => {
    setMobileOpen(false);

    if (pathname === '/' || pathname === '') {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      router.push('/');
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border/60 transition-colors">
      <div className="w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 h-[72px] flex items-center justify-between gap-6 text-left">
        {/* Left: Brand Logo (Smooth scroll to top without hash) */}
        <Link
          href="/"
          onClick={scrollToTop}
          className="flex items-center group transition-opacity hover:opacity-95 cursor-pointer"
          title="Wallflower - Back to top"
        >
          <Logo size="md" />
        </Link>

        {/* Center: Navigation Jump Links without URL Hash */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-bold">
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => scrollToSection(link.targetId)}
              className="text-text-secondary hover:text-text-primary transition-colors py-1 hover:text-brand cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Dashboard-Style Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className={cn(
              'inline-flex items-center justify-center rounded-xl p-2 text-xs font-semibold',
              'text-[#64748B] dark:text-[#94A3B8] hover:bg-slate-100 dark:hover:bg-[#1E2638] hover:text-[#0F172A] dark:hover:text-white',
              'transition-colors duration-150',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6366F1]',
              'cursor-pointer shadow-2xs border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60'
            )}
            aria-label="Switch theme"
            title={
              mounted
                ? resolvedTheme === 'dark'
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
                : undefined
            }
          >
            {mounted && resolvedTheme === 'dark' ? (
              <Sun className="size-4 text-[#A5B4FC]" aria-hidden="true" />
            ) : (
              <Moon className="size-4 text-[#64748B]" aria-hidden="true" />
            )}
          </button>

          {/* Log In */}
          <Link
            href="/login"
            className="text-xs font-bold text-text-secondary hover:text-text-primary transition-colors px-3 py-2"
          >
            Sign In
          </Link>

          {/* Start Free CTA */}
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#8B5CF6] text-white hover:opacity-95 active:scale-[0.99] transition-all shadow-md shadow-purple-500/20 cursor-pointer"
          >
            <span>Start Free</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* Mobile menu triggers */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className={cn(
              'inline-flex items-center justify-center rounded-xl p-2 text-xs font-semibold',
              'text-[#64748B] dark:text-[#94A3B8] hover:bg-slate-100 dark:hover:bg-[#1E2638]',
              'transition-colors duration-150 cursor-pointer'
            )}
            aria-label="Switch theme"
          >
            {mounted && resolvedTheme === 'dark' ? (
              <Sun className="size-4 text-[#A5B4FC]" />
            ) : (
              <Moon className="size-4 text-[#64748B]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center justify-center size-9 rounded-xl border border-border text-text-secondary bg-surface cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav sheet */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border bg-surface px-6 py-5 space-y-4 text-left shadow-xl">
          <div className="flex flex-col gap-3 text-xs font-bold text-text-primary">
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => scrollToSection(link.targetId)}
                className="py-1.5 text-left hover:text-brand cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-border flex items-center gap-3">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="w-1/2 py-2.5 text-center text-xs font-bold border border-border rounded-xl bg-surface"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="w-1/2 py-2.5 text-center text-xs font-bold bg-brand hover:bg-brand-hover text-white rounded-xl shadow-xs"
            >
              Start Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
