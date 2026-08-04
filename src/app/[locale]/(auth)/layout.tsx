'use client';

import { ReactNode, useSyncExternalStore } from 'react';
import { usePathname, Link } from '@/lib/i18n/navigation';
import { useTheme } from 'next-themes';
import { Sun, Moon, Globe, Shield, Sparkles } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter } from '@/lib/i18n/navigation';

const emptySubscribe = () => () => {};

export default function AuthLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const isRegister = pathname.includes('/register');

  const handleLanguageToggle = () => {
    const nextLocale = locale === 'en' ? 'th' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex min-h-screen bg-background text-text-primary overflow-hidden">
      {/* Top Floating Controls */}
      <div className="fixed top-5 right-5 z-50 flex items-center gap-3">
        <button
          type="button"
          onClick={handleThemeToggle}
          className="p-2.5 rounded-xl border border-border bg-surface text-text-secondary hover:text-text-primary shadow-sm transition-colors cursor-pointer"
          aria-label="Toggle dark/light theme"
        >
          {mounted && resolvedTheme === 'dark' ? (
            <Sun className="size-4 text-amber-400" />
          ) : (
            <Moon className="size-4 text-text-muted" />
          )}
        </button>

        <button
          type="button"
          onClick={handleLanguageToggle}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-text-secondary hover:text-text-primary rounded-xl border border-border bg-surface shadow-sm transition-colors cursor-pointer"
        >
          <Globe className="size-3.5 text-text-muted" />
          <span>{locale === 'en' ? 'TH' : 'EN'}</span>
        </button>
      </div>

      {/* Main Split Grid (50 / 50) */}
      <div className="w-full flex flex-col lg:flex-row min-h-screen">
        {/* Left Panel: Form Container (50% desktop width) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-background z-10 min-h-screen">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-display font-extrabold text-xl text-text-primary tracking-tight"
            >
              <div className="size-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-2xs">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span>Wallflower</span>
            </Link>
          </div>

          {/* Dynamic Form Content */}
          <div className="w-full max-w-[420px] mx-auto py-8">
            {children}
          </div>

          {/* Form Footer Links */}
          <div className="flex items-center justify-center gap-4 text-xs font-semibold text-text-muted">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
          </div>
        </div>

        {/* Right Panel: Product Preview Panel (50% desktop width) */}
        <div className="hidden lg:flex w-1/2 bg-surface-subtle text-text-primary p-12 lg:p-16 flex-col justify-between relative overflow-hidden border-l border-border transition-colors">
          {/* Ambient Glow */}
          <div className="absolute -top-20 -right-20 size-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 size-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-2 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <Sparkles className="size-3.5" />
              <span>DECISION INTELLIGENCE</span>
            </div>
            <h3 className="font-display text-2xl font-extrabold text-text-primary tracking-tight">
              {isRegister ? 'Start your journey to better business decisions.' : 'Welcome back to your financial intelligence workspace.'}
            </h3>
          </div>

          {/* Floating Realistic Product Mockup */}
          <div className="relative z-10 my-auto py-6">
            {!isRegister ? (
              /* Login Dashboard Mockup Card */
              <div className="rounded-2xl border-2 border-border-strong bg-surface p-6 shadow-2xl space-y-4 max-w-[440px] mx-auto text-left transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-emerald-500" />
                    <span className="font-display text-xs font-bold text-text-primary">Overview</span>
                  </div>
                  <span className="text-[10px] font-bold text-text-muted">Wallflower SME Engine</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-surface-subtle border border-border space-y-1">
                    <span className="text-[10px] font-bold text-text-muted block uppercase tracking-wider">Business Health</span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">84</span>
                      <span className="text-[10px] text-text-muted">/100</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">Good</span>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-subtle border border-border space-y-1">
                    <span className="text-[10px] font-bold text-text-muted block uppercase tracking-wider">Cash Runway</span>
                    <span className="font-display text-xl font-extrabold text-text-primary block">5.1 months</span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">+0.9 vs last month</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-subtle border border-border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-text-muted block">Revenue (This Month)</span>
                    <span className="font-display text-lg font-extrabold text-text-primary">฿1,280,000</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">+12.5%</span>
                </div>
              </div>
            ) : (
              /* Register Scenario & Report Mockup Card */
              <div className="space-y-4 max-w-[440px] mx-auto text-left">
                <div className="p-5 rounded-2xl border-2 border-border-strong bg-surface shadow-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Scenario Preview</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Increase Prices +5%</span>
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-[10px] text-text-muted block">Projected Profit</span>
                      <span className="font-display text-xl font-extrabold text-emerald-600 dark:text-emerald-400">+18% (฿163,000)</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">★ Recommended</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border-2 border-border-strong bg-surface shadow-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="size-4" />
                    <span className="font-display text-xs font-bold">Executive Report Summary</span>
                  </div>
                  <p className="text-xs text-text-secondary font-medium leading-snug">
                    Simulates pricing, cash runway, and risk sensitivity with 100% deterministic financial calculations.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 flex items-center gap-3 pt-4 border-t border-border/60 text-xs font-bold text-text-muted text-left">
            <Shield className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Deterministic math engine & encrypted SME business records.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
