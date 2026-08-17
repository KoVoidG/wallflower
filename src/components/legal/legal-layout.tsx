'use client';

import { useState } from 'react';
import { Link } from '@/lib/i18n/navigation';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';

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
  const [activeToc, setActiveToc] = useState<string>(tocItems[0]?.id || '');

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      {/* Clean Minimal Legal Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-surface/90 backdrop-blur-xl shadow-2xs print:hidden">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          {/* Logo & Legal Title linking to root landing page (/) */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0 group transition-opacity hover:opacity-90"
            title="Go to Wallflower Homepage"
          >
            <Logo size="sm" showWordmark={false} />
            <span className="text-base sm:text-lg font-bold font-display text-text-primary group-hover:text-brand transition-colors whitespace-nowrap">
              Wallflower Legal
            </span>
          </Link>
        </div>
      </header>

      {/* Main Legal Content Container */}
      <main className="flex-1 mx-auto max-w-6xl w-full px-5 py-8 sm:px-8 md:py-12">
        {/* Document Header & Metadata Banner */}
        <div className="space-y-4 border-b border-border/60 pb-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded-full bg-brand-soft border border-brand/30 px-3 py-1 text-xs font-bold text-brand">
              {version}
            </span>
            <span className="text-xs text-text-muted font-medium">Effective: {effectiveDate}</span>
            <span className="text-xs text-text-muted">•</span>
            <span className="text-xs text-text-muted font-medium">Last Updated: {lastUpdated}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight">
            {title}
          </h1>
          <p className="text-base sm:text-lg text-text-secondary max-w-3xl leading-relaxed font-medium">
            {subtitle}
          </p>

          {/* Plain-Language Mathematical & Privacy Guarantee Notice */}
          <div className="flex items-start gap-3.5 rounded-2xl border border-brand/30 bg-brand-soft/30 p-4 text-xs sm:text-sm text-text-primary">
            <ShieldCheck className="size-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-brand">
                Deterministic Accuracy &amp; Privacy Guarantee
              </p>
              <p className="text-text-secondary font-medium leading-relaxed">
                Wallflower runs on a 100% deterministic financial mathematical engine. Your financial records are encrypted at rest with AES-256 and are never used to train public generative AI foundation models.
              </p>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar TOC + Main Document Body */}
        <div className="mt-8 flex flex-col md:flex-row gap-10 items-start">
          {/* Desktop Table of Contents Navigation */}
          <nav
            aria-label="Table of Contents"
            className="hidden md:block w-[240px] shrink-0 sticky top-24 space-y-2 text-xs print:hidden"
          >
            <span className="font-display font-bold text-text-muted uppercase tracking-wider block px-2 pb-1 text-[11px]">
              Table of Contents
            </span>
            <ul className="space-y-1 border-l-2 border-border/80 pl-2">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setActiveToc(item.id)}
                    className={cn(
                      'block py-1.5 px-2.5 rounded-xl text-text-secondary hover:text-brand hover:bg-surface-subtle transition-all truncate font-medium',
                      activeToc === item.id && 'font-bold text-brand bg-brand-soft/60 shadow-2xs'
                    )}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main Document Article Body */}
          <article className="flex-1 min-w-0 max-w-[760px] w-full space-y-10 text-sm sm:text-base text-text-secondary leading-relaxed font-normal">
            {children}

            {/* Document Footer Info */}
            <div className="pt-8 border-t border-border/60 space-y-2 text-xs text-text-muted font-medium">
              <p className="font-bold text-text-primary">Operator &amp; Compliance Contact</p>
              <p>
                Wallflower Decision Intelligence Platform • Bangkok, Thailand<br />
                For compliance inquiries or support, contact:{' '}
                <a
                  href="mailto:support@wallflower.app"
                  className="text-brand font-bold hover:underline"
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
