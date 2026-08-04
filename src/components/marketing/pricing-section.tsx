'use client';

import { useState } from 'react';
import { Check, Sparkles, Zap } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { PlanModal } from '@/features/billing/components/plan-modal';

export function PricingSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="pricing" className="py-20 md:py-28 bg-background border-t border-border/60">
      <div className="mx-auto w-full max-w-[1280px] px-4 md:px-8 space-y-12 text-center">
        {/* Header */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-tertiary/30 bg-tertiary/10 px-3.5 py-1 text-xs font-bold text-tertiary">
            <Sparkles className="size-3.5" />
            <span>SIMPLE & TRANSPARENT PRICING</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-text-primary tracking-tight">
            Simple pricing for every stage of your business
          </h2>
          <p className="text-base md:text-lg text-text-secondary font-medium leading-relaxed">
            Understand your business, simulate major decisions, and see financial outcomes before committing real capital.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left items-stretch">
          {/* Tier 1: Free */}
          <div className="flex flex-col justify-between rounded-2xl border-2 border-border-strong bg-surface p-6 md:p-8 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 relative">
            <div>
              <h3 className="font-display text-xl font-bold text-text-primary">Free</h3>
              <p className="text-xs text-text-secondary font-medium mt-1">Perfect for getting started</p>
              
              <div className="my-6 flex items-baseline gap-1 border-b border-border/60 pb-5">
                <span className="font-display text-4xl font-extrabold text-text-primary">฿0</span>
                <span className="text-xs font-bold text-text-muted">/month</span>
              </div>

              <ul className="space-y-3.5 text-xs font-medium text-text-secondary">
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-tertiary shrink-0" />
                  <span className="text-text-primary font-bold">1 Business</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-tertiary shrink-0" />
                  <span>2 Simulations / month</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-tertiary shrink-0" />
                  <span>Basic Reports</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-tertiary shrink-0" />
                  <span>AI Insights (Limited)</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-border/60">
              <Link
                href="/register"
                className="flex w-full items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold border border-border-strong bg-surface text-text-primary hover:bg-surface-hover transition-colors shadow-2xs"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Tier 2: Starter (Highlighted / MOST POPULAR) */}
          <div className="flex flex-col justify-between rounded-2xl border-2 border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/20 p-6 md:p-8 transition-all duration-200 hover:shadow-2xl hover:shadow-emerald-500/15 hover:-translate-y-1 relative shadow-xl">
            {/* Top Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              MOST POPULAR
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-text-primary">Starter</h3>
                <Sparkles className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-xs text-text-secondary font-medium mt-1">For growing retail businesses</p>
              
              <div className="my-6 flex items-baseline gap-1 border-b border-border/60 pb-5">
                <span className="font-display text-4xl font-extrabold text-text-primary">฿599</span>
                <span className="text-xs font-bold text-text-muted">/month</span>
              </div>

              <ul className="space-y-3.5 text-xs font-medium text-text-secondary">
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-text-primary font-bold">1 Business</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-text-primary font-bold">30 Simulations / month</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>All Reports</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-text-primary font-bold">AI Insights (Full)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Export to Excel</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-border/60">
              <Link
                href="/register"
                className="flex w-full items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-md"
              >
                Start Free Trial
              </Link>
            </div>
          </div>

          {/* Tier 3: Business */}
          <div className="flex flex-col justify-between rounded-2xl border-2 border-border-strong bg-surface p-6 md:p-8 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 relative">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-text-primary">Business</h3>
                <Zap className="size-5 text-tertiary" />
              </div>
              <p className="text-xs text-text-secondary font-medium mt-1">For multi-branch businesses</p>
              
              <div className="my-6 flex items-baseline gap-1 border-b border-border/60 pb-5">
                <span className="font-display text-4xl font-extrabold text-text-primary">฿1,599</span>
                <span className="text-xs font-bold text-text-muted">/month</span>
              </div>

              <ul className="space-y-3.5 text-xs font-medium text-text-secondary">
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-tertiary shrink-0" />
                  <span className="text-text-primary font-bold">Up to 5 Businesses</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-tertiary shrink-0" />
                  <span className="text-text-primary font-bold">Unlimited Simulations</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-tertiary shrink-0" />
                  <span>All Reports & Exports</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-tertiary shrink-0" />
                  <span>Priority Support</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-tertiary shrink-0" />
                  <span>Custom Access Roles</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-border/60">
              <Link
                href="/register"
                className="flex w-full items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold border border-border-strong bg-surface text-text-primary hover:bg-surface-hover transition-colors shadow-2xs"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Subtext */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-text-muted pt-4">
          <span>14-day free trial</span>
          <span>•</span>
          <span>Cancel anytime</span>
          <span>•</span>
          <span>No credit card required</span>
        </div>
      </div>

      <PlanModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
