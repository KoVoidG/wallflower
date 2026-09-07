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
    <section id="pricing" className="py-24 sm:py-32 bg-[#FAFAFC] text-left relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-50/50 via-transparent to-transparent pointer-events-none" />

      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 space-y-14 text-center relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700">
            <Sparkles className="size-3.5 text-indigo-500" />
            <span>TRANSPARENT, VALUE-FIRST PRICING</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900 tracking-tight leading-[1.1]">
            Clear pricing for clearer decisions.
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 font-medium leading-relaxed">
            Avoid one bad hire or one pricing mistake, and Wallflower has paid for decades of subscriptions.
          </p>

          {/* Annual / Monthly Toggle Switch */}
          <div className="pt-8 flex items-center justify-center gap-4">
            <span
              className={`text-sm font-bold transition-colors cursor-pointer ${
                !isAnnual ? 'text-zinc-900' : 'text-zinc-500'
              }`}
              onClick={() => setIsAnnual(false)}
            >
              Monthly Billing
            </span>

            <button
              type="button"
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-7 rounded-full bg-zinc-200 border-2 border-transparent p-0.5 transition-colors cursor-pointer data-[state=checked]:bg-indigo-600"
              data-state={isAnnual ? 'checked' : 'unchecked'}
              aria-label="Toggle annual billing discount"
            >
              <div
                className={`size-5 rounded-full bg-white shadow-sm transition-transform ${
                  isAnnual ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>

            <span
              className={`text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                isAnnual ? 'text-zinc-900' : 'text-zinc-500'
              }`}
              onClick={() => setIsAnnual(true)}
            >
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-700 border border-emerald-200">
                SAVE 20%
              </span>
            </span>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left items-stretch max-w-6xl mx-auto pt-6">
          {tiers.map((tier) => {
            const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;
            return (
              <div
                key={tier.id}
                className={`relative flex flex-col justify-between rounded-3xl p-7 sm:p-8 transition-all duration-300 ${
                  tier.isPopular
                    ? 'border-2 border-indigo-500 bg-indigo-50/50 shadow-2xl lg:-translate-y-2'
                    : 'border border-black/5 bg-white shadow-xl hover:shadow-2xl'
                }`}
              >
                {/* Popular Badge */}
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {tier.badge}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Card Header */}
                  <div>
                    <h3 className="font-display text-xl font-bold text-zinc-900">
                      {tier.name}
                    </h3>
                    <p className="text-xs text-zinc-600 font-medium mt-1.5 leading-relaxed min-h-[36px]">
                      {tier.desc}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="flex items-baseline gap-1.5 pb-5">
                    <span className="font-display text-5xl font-extrabold text-zinc-900">
                      {price}
                    </span>
                    <span className="text-sm font-bold text-zinc-500">
                      {tier.period}
                    </span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 text-xs font-medium text-zinc-700">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom CTA Button */}
                <div className="mt-8 pt-5">
                  <Link
                    href={tier.ctaHref}
                    className={`flex w-full items-center justify-center py-3.5 rounded-2xl text-sm font-bold transition-all shadow-sm cursor-pointer ${
                      tier.isPopular
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-95 shadow-lg shadow-indigo-600/20'
                        : 'border border-black/10 bg-zinc-50 text-zinc-900 hover:bg-zinc-100'
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
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-zinc-500 pt-8">
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
            <Zap className="size-4 text-indigo-500" />
            <span>No credit card required for setup</span>
          </div>
        </div>
      </div>
    </section>
  );
}
