import type { Metadata } from 'next';
import { Link } from '@/lib/i18n/navigation';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Pricing — Wallflower',
  description: 'Simple, transparent pricing for Thai SMEs. Start free, upgrade when you grow.',
};

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    description: 'Get started with basic business diagnostics.',
    features: [
      '1 business profile',
      'Monthly financial snapshots',
      'Basic health dashboard',
      '3 risk detections',
      '2 scenario simulations/month',
      'Community support',
    ],
    cta: 'Get Started',
    href: '/register',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '฿990',
    period: '/month',
    description: 'Full decision intelligence for growing businesses.',
    features: [
      'Everything in Starter',
      'Unlimited simulations',
      'Full risk detection engine',
      'AI-powered recommendations',
      'Decision reports with PDF export',
      'Scenario comparison (up to 5)',
      'Priority email support',
      '90-day action plans',
    ],
    cta: 'Start Free Trial',
    href: '/register',
    highlighted: true,
  },
  {
    name: 'Business',
    price: '฿2,490',
    period: '/month',
    description: 'For established SMEs needing advanced insights.',
    features: [
      'Everything in Growth',
      'Multiple business profiles',
      'Advanced scenario modeling',
      'Custom risk rules',
      'Team collaboration (coming soon)',
      'API access (coming soon)',
      'Dedicated support',
      'Quarterly strategy review',
    ],
    cta: 'Contact Us',
    href: '/register',
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="py-24 md:py-32">
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-[38px]/[42px] md:text-[44px]/[48px] lg:text-[56px]/[62px] font-[650] text-text-primary">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-[18px]/[30px] text-text-secondary">
            Start free. Upgrade when your business needs more intelligence.
            No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'flex flex-col rounded-[var(--radius-lg)] border p-6 md:p-8',
                plan.highlighted
                  ? 'border-brand bg-brand-soft/30 ring-1 ring-brand shadow-lg'
                  : 'border-border bg-surface'
              )}
            >
              {plan.highlighted && (
                <span className="self-start text-[12px]/[16px] font-[650] text-brand uppercase tracking-wider mb-3">
                  Most Popular
                </span>
              )}

              <h2 className="text-[20px]/[28px] font-[600] text-text-primary">{plan.name}</h2>
              <p className="mt-1 text-[13px]/[20px] text-text-muted">{plan.description}</p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-[36px]/[44px] font-[700] text-text-primary tabular-nums">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-[15px]/[24px] text-text-muted">{plan.period}</span>
                )}
              </div>

              <Link
                href={plan.href}
                className={cn(
                  'mt-6 inline-flex items-center justify-center px-5 py-2.5 rounded-[var(--radius-md)] text-[15px]/[24px] font-[550] transition-colors',
                  plan.highlighted
                    ? 'bg-brand text-white hover:bg-brand-hover'
                    : 'border border-border text-text-primary hover:bg-surface-subtle'
                )}
              >
                {plan.cta}
              </Link>

              <ul className="mt-8 flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="size-4 text-brand shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-[14px]/[22px] text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ note */}
        <p className="text-center mt-12 text-[14px]/[22px] text-text-muted max-w-lg mx-auto">
          All prices are in Thai Baht (THB). Pricing may change as we add new features.
          Current users will be notified 30 days before any changes take effect.
        </p>
      </div>
    </div>
  );
}
