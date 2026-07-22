'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/lib/i18n/navigation';
import { Printer, Globe, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TocItem {
  id: string;
  title: string;
}

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  effectiveDate: string;
  lastUpdated: string;
  version: string;
  tocItems: TocItem[];
  children: React.ReactNode;
}

export function LegalLayout({
  title,
  subtitle,
  effectiveDate,
  lastUpdated,
  version,
  tocItems,
  children,
}: LegalLayoutProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [activeToc, setActiveToc] = useState<string>(tocItems[0]?.id || '');

  const handleLanguageToggle = () => {
    const nextLocale = locale === 'en' ? 'th' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      {/* Dedicated Shared Legal Header - NO Marketing Navbar, NO Absolute Positioning */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface shadow-xs print:hidden">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo & Legal Title linking to root landing page (/) */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0 group hover:opacity-90 transition-opacity"
            title="Go to Wallflower Homepage"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand text-white font-bold text-xs">
              W
            </div>
            <span className="text-base sm:text-lg font-bold text-text-primary group-hover:text-brand transition-colors whitespace-nowrap">
              Wallflower Legal
            </span>
          </Link>

          {/* Header Actions: Language Selector & Print Action */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Selector */}
            <button
              type="button"
              onClick={handleLanguageToggle}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors cursor-pointer"
              title="Switch language"
            >
              <Globe className="size-3.5" />
              <span>{locale === 'en' ? 'TH' : 'EN'}</span>
            </button>

            {/* Print Action */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-text-secondary hover:bg-surface-subtle hover:text-text-primary transition-colors cursor-pointer"
              title="Print document"
            >
              <Printer className="size-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Legal Content Container */}
      <main className="flex-1 mx-auto max-w-6xl w-full px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        {/* Document Metadata & Banner */}
        <div className="space-y-4 border-b border-border/60 pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
              {version}
            </span>
            <span className="text-xs text-text-muted">Effective: {effectiveDate}</span>
            <span className="text-xs text-text-muted">•</span>
            <span className="text-xs text-text-muted">Last Updated: {lastUpdated}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-text-secondary max-w-3xl leading-relaxed">
            {subtitle}
          </p>

          {/* Prototype Plain-Language Summary Banner */}
          <div className="flex items-start gap-3 rounded-lg border border-brand/30 bg-brand-soft/20 p-4 text-xs sm:text-sm text-text-primary">
            <Info className="size-5 text-brand shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-brand">
                Interactive Prototype Notice
              </p>
              <p className="text-text-secondary leading-relaxed">
                Wallflower is currently an interactive frontend prototype. Real account management, persistent database storage, production security controls, external payment billing, and binding legal contracts are not integrated.
              </p>
            </div>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="mt-8 flex flex-col md:flex-row gap-8 items-start">
          {/* Desktop Table of Contents Navigation */}
          <nav
            aria-label="Table of Contents"
            className="hidden md:block w-[220px] shrink-0 sticky top-24 space-y-2 text-xs print:hidden"
          >
            <span className="font-bold text-text-muted uppercase tracking-wider block px-2 pb-1">
              Contents
            </span>
            <ul className="space-y-1 border-l border-border pl-2">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setActiveToc(item.id)}
                    className={cn(
                      'block py-1 px-2 rounded-md text-text-secondary hover:text-brand hover:bg-surface-subtle transition-colors truncate',
                      activeToc === item.id && 'font-semibold text-brand bg-brand-soft/30'
                    )}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main Document Article Body (Readable 700-760px max width) */}
          <article className="flex-1 min-w-0 max-w-[760px] w-full space-y-10 text-sm sm:text-base text-text-secondary leading-relaxed">
            {children}

            {/* Document Footer Info */}
            <div className="pt-8 border-t border-border/60 space-y-3 text-xs text-text-muted">
              <p className="font-semibold text-text-primary">Operator & Support Contact</p>
              <p>
                Wallflower Decision Intelligence Platform • Bangkok, Thailand<br />
                For queries or support, contact:{' '}
                <a
                  href="mailto:support@wallflower.app"
                  className="text-brand font-medium hover:underline"
                >
                  support@wallflower.app
                </a>
              </p>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
