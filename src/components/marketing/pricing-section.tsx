'use client';

import { useState } from 'react';
import { Check, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  const tiers = [
    {
      id: 'free',
      name: 'Free Starter',
      badge: null,
      desc: 'For curious business owners wanting to explore baseline health.',
      monthlyPrice: '฿0',
      annualPrice: '฿0',
      period: '/month',
      ctaText: 'Get Started Free',
      ctaHref: '/register',
      isPopular: false,
      features: [
        '1 Business Entity',
        '2 Decision Simulations / month',
        'Business Health Score (0–100)',
        'Basic Financial Snapshot',
        'Standard Web View Reports',
        'Community Support',
      ],
    },
    {
      id: 'starter',
      name: 'Pro Workspace',
      badge: 'MOST POPULAR',
      desc: 'For active retail & SME operators testing regular business decisions.',
      monthlyPrice: '฿599',
      annualPrice: '฿479',
      period: '/month',
      ctaText: 'Start 14-Day Free Trial',
      ctaHref: '/register',
      isPopular: true,
      features: [
        '1 Business Entity',
        '30 Decision Simulations / month',
        'Full Risk Detection & Alert Radar',
        'Multi-Scenario Comparison Matrix',
        'Full Capybot AI Synthesis Memos',
        'Export to Excel & PDF Reports',
        'Custom Scenario Variables',
        'Standard Email Support',
      ],
    },
    {
      id: 'business',
      name: 'Multi-Branch & Scale',
      badge: 'ENTERPRISE SME',
      desc: 'For multi-location retailers, franchises, and high-volume operators.',
      monthlyPrice: '฿1,599',
      annualPrice: '฿1,279',
      period: '/month',
      ctaText: 'Start 14-Day Free Trial',
      ctaHref: '/register',
      isPopular: false,
      features: [
        'Up to 5 Branches / Businesses',
        'Unlimited Decision Simulations',
        'Multi-Branch Consolidated Reporting',
        'POS & LiquiFlow Automated Sync',
        'Bank-Ready Cryptographic Verification',
        'Custom Team Access Roles',
        'Priority Phone & WhatsApp Support',
        'Dedicated Financial Model Onboarding',
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 sm:py-28 border-b border-border/60 bg-background text-left">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 space-y-14 text-center">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand">
            <Sparkles className="size-3.5 text-ai" />
            <span>TRANSPARENT, VALUE-FIRST PRICING</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight">
            Predictable pricing that pays for itself in one decision.
          </h2>
          <p className="text-base sm:text-lg text-text-secondary font-medium leading-relaxed">
            Avoid one bad hire or one pricing mistake, and Wallflower has paid for decades of subscriptions.
          </p>

          {/* Annual / Monthly Toggle Switch */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span
              className={`text-xs font-bold transition-colors cursor-pointer ${
                !isAnnual ? 'text-text-primary' : 'text-text-muted'
              }`}
              onClick={() => setIsAnnual(false)}
            >
              Monthly Billing
            </span>

            <button
              type="button"
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-12 h-6 rounded-full bg-surface border-2 border-border p-0.5 transition-colors cursor-pointer"
              aria-label="Toggle annual billing discount"
            >
              <div
                className={`size-4 rounded-full bg-brand transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>

            <span
              className={`text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isAnnual ? 'text-text-primary' : 'text-text-muted'
              }`}
              onClick={() => setIsAnnual(true)}
            >
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                SAVE 20%
              </span>
            </span>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left items-stretch max-w-6xl mx-auto">
          {tiers.map((tier) => {
            const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;
            return (
              <div
                key={tier.id}
                className={`relative flex flex-col justify-between rounded-3xl p-7 sm:p-8 transition-all duration-300 ${
                  tier.isPopular
                    ? 'border-2 border-brand bg-brand-soft/30 shadow-2xl shadow-brand/10 ring-1 ring-brand/30 lg:-translate-y-2'
                    : 'border-2 border-border-strong bg-surface shadow-xl hover:border-border-strong hover:shadow-2xl'
                }`}
              >
                {/* Popular Badge */}
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-[10px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {tier.badge}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Card Header */}
                  <div>
                    <h3 className="font-display text-xl font-bold text-text-primary">
                      {tier.name}
                    </h3>
                    <p className="text-xs text-text-secondary font-medium mt-1.5 leading-relaxed min-h-[36px]">
                      {tier.desc}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="flex items-baseline gap-1.5 border-b border-border/60 pb-5">
                    <span className="font-metric text-4xl sm:text-5xl font-extrabold text-text-primary">
                      {price}
                    </span>
                    <span className="text-xs font-bold text-text-muted">
                      {tier.period}
                    </span>
                    {isAnnual && tier.id !== 'free' && (
                      <span className="text-[10px] font-bold text-emerald-500 ml-1">
                        (Billed annually)
                      </span>
                    )}
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 text-xs font-medium text-text-secondary">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-text-primary leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom CTA Button */}
                <div className="mt-8 pt-5 border-t border-border/60">
                  <Link
                    href={tier.ctaHref}
                    className={`flex w-full items-center justify-center py-3.5 rounded-2xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                      tier.isPopular
                        ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:opacity-95 shadow-md shadow-indigo-500/25'
                        : 'border border-border-strong bg-surface text-text-primary hover:bg-surface-hover'
                    }`}
                  >
                    {tier.ctaText}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badges Bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-text-muted pt-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-500" />
            <span>14-day free trial on Pro plans</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <Check className="size-4 text-emerald-500" />
            <span>Cancel anytime with 1-click</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-brand" />
            <span>No credit card required for setup</span>
          </div>
        </div>
      </div>
    </section>
  );
}
