'use client';

import { Link } from '@/lib/i18n/navigation';
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-background text-left">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-[500px] bg-gradient-to-r from-brand/20 via-purple-500/20 to-indigo-600/20 blur-3xl pointer-events-none -z-10 rounded-full" />

      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <div className="relative rounded-3xl sm:rounded-[36px] border-2 border-brand/40 bg-surface/95 backdrop-blur-2xl p-8 sm:p-12 lg:p-16 shadow-2xl space-y-8 text-center overflow-hidden">
          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Top Pill */}
          <div className="relative z-10 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-4 py-1.5 text-xs font-bold text-brand shadow-xs">
            <Sparkles className="size-3.5 text-ai animate-pulse" />
            <span>INSTANT SETUP • NO CREDIT CARD NEEDED</span>
          </div>

          {/* Main Headline */}
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight leading-[1.1]">
              Make your next business decision with{' '}
              <span className="bg-gradient-to-r from-brand via-purple-500 to-indigo-400 bg-clip-text text-transparent">
                mathematical certainty
              </span>
              .
            </h2>
            <p className="text-base sm:text-lg text-text-secondary font-medium leading-relaxed max-w-2xl mx-auto">
              Join retail SME owners who test pricing, payroll, promotions, and inventory orders in Wallflower before spending real capital.
            </p>
          </div>

          {/* Action Button & Trust Guarantee */}
          <div className="relative z-10 flex flex-col items-center gap-4 pt-2">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm font-bold rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:opacity-95 active:scale-[0.99] transition-all shadow-xl shadow-indigo-500/30 cursor-pointer"
              >
                <span>Start Your Free 14-Day Trial</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs font-bold text-text-muted">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>3-Minute Onboarding</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-500" />
                <span>100% Deterministic Math</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>Cancel Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
