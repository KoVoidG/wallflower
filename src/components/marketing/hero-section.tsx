'use client';

import { Link } from '@/lib/i18n/navigation';
import { Sparkles, Play, CheckCircle2 } from 'lucide-react';
import { ProductPreview } from './product-preview';

export function HeroSection() {

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden border-b border-border/60 bg-background text-left">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="flex flex-col gap-6 max-w-[620px]">
            {/* Top Badge */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand">
                <Sparkles className="size-3.5 text-ai" />
                <span>AI-POWERED DECISION INTELLIGENCE</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight leading-[1.1]">
              Make better business <span className="text-brand">decisions</span> before they cost you money.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-text-secondary font-medium leading-relaxed">
              Simulate pricing, hiring, inventory, and expansion with deterministic financial models and AI insights built for retail SMEs.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-bold rounded-xl bg-brand hover:bg-brand-hover text-on-primary transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                Start Free
              </Link>

              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold rounded-xl border border-border-strong bg-surface text-text-primary hover:bg-surface-hover transition-all cursor-pointer shadow-2xs"
              >
                <Play className="size-4 fill-current text-tertiary" />
                <span>Watch Demo</span>
              </a>
            </div>

            {/* Bullet points subtext */}
            <div className="flex items-center gap-6 pt-1 text-xs font-bold text-text-muted">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>Setup in 3 minutes</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dashboard Mockup */}
          <div className="w-full">
            <ProductPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
