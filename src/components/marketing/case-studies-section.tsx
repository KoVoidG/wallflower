'use client';

import {
  Coffee,
  ShoppingBag,
  Cpu,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

interface CaseStudy {
  business: string;
  location: string;
  category: string;
  icon: typeof Coffee;
  dilemma: string;
  simulatedAction: string;
  outcomeMetric: string;
  outcomeDetail: string;
  quote: string;
  owner: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    business: 'Koffee Craft Roastery',
    location: 'Ari, Bangkok',
    category: 'Specialty Cafe & F&B',
    icon: Coffee,
    dilemma: 'Should we raise menu prices by 7% to cover rising dairy & green bean import costs?',
    simulatedAction: 'Simulated +7% price increase on top 15 beverage SKUs with historical demand elasticity.',
    outcomeMetric: '+฿48,500/mo Profit',
    outcomeDetail: '+22.4% Net Margin expansion with under 1.2% transaction volume change.',
    quote:
      'We were afraid of losing customers. Wallflower proved that our customers were price-inelastic on signature drinks, giving us the confidence to execute.',
    owner: 'Tanawat K., Founder',
  },
  {
    business: 'Vela Apparel Studio',
    location: 'Siam Square, Bangkok',
    category: 'Boutique Fashion Retail',
    icon: ShoppingBag,
    dilemma: 'Should we hire 2 full-time sales associates for the new collection season?',
    simulatedAction: 'Simulated 2 full-time hires (฿38k/mo) vs 1 weekend flex associate (฿12k/mo) during monsoon low season.',
    outcomeMetric: '฿90,000 Saved',
    outcomeDetail: 'Avoided severe cash runway compression from 5.2 months down to 1.9 months.',
    quote:
      'Wallflower saved us from an expensive over-hiring mistake right before the retail low season. We hired flex staff instead and kept our runway healthy.',
    owner: 'Pornthip S., Managing Director',
  },
  {
    business: 'Apex Tech Wholesale',
    location: 'Bangkok / B2B Distribution',
    category: 'Wholesale Electronics',
    icon: Cpu,
    dilemma: 'Should we accept a 12% bulk discount requiring ฿350k cash prepayment?',
    simulatedAction: 'Simulated inventory holding cost and liquidity buffer over 90 days vs financing costs.',
    outcomeMetric: '+฿142,000 Net ROI',
    outcomeDetail: 'Identified exact safe order volume that captured ฿142k in discount without bank overdraft.',
    quote:
      'Instead of guessing with spreadsheets, we saw the exact cash flow path for the next 4 months before sending the wire transfer.',
    owner: 'Chaiwat M., Operations Lead',
  },
];

export function CaseStudiesSection() {
  return (
    <section className="py-20 sm:py-28 border-b border-border/60 bg-surface-subtle/30 text-left">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand">
            <ShieldCheck className="size-3.5" />
            <span>REAL BUSINESS DECISIONS</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight">
            How real businesses test decisions before acting.
          </h2>
          <p className="text-base sm:text-lg text-text-secondary font-medium leading-relaxed">
            Real SME owners move from anxiety to mathematical clarity with Wallflower.
          </p>
        </div>

        {/* 3 Case Study Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {CASE_STUDIES.map((study) => {
            const Icon = study.icon;
            return (
              <div
                key={study.business}
                className="p-7 rounded-3xl border-2 border-border-strong bg-surface shadow-xl flex flex-col justify-between space-y-6 hover:border-brand/40 transition-all"
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-border/60 pb-3.5">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-brand-soft border border-brand-border text-brand flex items-center justify-center">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-display text-base font-bold text-text-primary">
                          {study.business}
                        </h3>
                        <span className="text-[11px] text-text-muted font-medium block">
                          {study.location} • {study.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dilemma & Simulated Action */}
                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-surface-subtle border border-border/70 space-y-1">
                      <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">
                        The Decision Dilemma
                      </span>
                      <p className="text-xs font-bold text-text-primary">
                        {study.dilemma}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-surface-subtle border border-border/70 space-y-1">
                      <span className="text-[10px] font-bold text-brand uppercase tracking-wider block">
                        Simulated in Wallflower
                      </span>
                      <p className="text-xs text-text-secondary font-medium leading-relaxed">
                        {study.simulatedAction}
                      </p>
                    </div>
                  </div>

                  {/* Outcome Metric Box */}
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                        Verified Financial Outcome
                      </span>
                      <ArrowUpRight className="size-3.5 text-emerald-500" />
                    </div>
                    <span className="font-metric text-xl font-extrabold text-emerald-600 dark:text-emerald-400 block">
                      {study.outcomeMetric}
                    </span>
                    <p className="text-[11px] text-text-secondary font-medium">
                      {study.outcomeDetail}
                    </p>
                  </div>
                </div>

                {/* Testimonial Quote */}
                <div className="pt-3 border-t border-border/60 space-y-2">
                  <p className="text-xs text-text-secondary italic leading-relaxed">
                    &quot;{study.quote}&quot;
                  </p>
                  <span className="text-[11px] font-bold text-text-primary block">
                    — {study.owner}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
