import type { Metadata } from 'next';
import { Link } from '@/lib/i18n/navigation';
import { Check, Info, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Plans & Features — Wallflower',
  description: 'Explore Wallflower decision-intelligence plans and features for Thai SMEs.',
};

const plans = [
  {
    name: 'Basic',
    price: 'Prototype',
    period: '',
    description: 'Core diagnostics & snapshot tracking for SME founders.',
    features: [
      'Up to 6 monthly financial snapshots',
      'Deterministic risk engine rules',
      '3 scenario simulations / month',
      'Standard AI decision summaries',
      'Business health pulse indicator',
      'Community support & FAQ access',
    ],
    cta: 'Explore Basic',
    href: '/dashboard',
    highlighted: false,
    badge: 'Current Prototype',
  },
  {
    name: 'Pro',
    price: 'Preview',
    period: '',
    description: 'Advanced decision simulations, risk mitigation & deep AI analysis.',
    features: [
      'Unlimited monthly snapshots',
      'Full deterministic risk detection engine',
      'Unlimited scenario simulations',
      'Deep AI diagnostic breakdown & explanations',
      'Print-safe decision reports (PDF export)',
      'Side-by-side scenario comparison (up to 3)',
      '90-Day evidence-backed action plans',
      'Priority email & ticket support',
    ],
    cta: 'View Plan Overview',
    href: '/settings?section=plan',
    highlighted: true,
    badge: 'Recommended',
  },
  {
    name: 'Enterprise',
    price: 'Preview',
    period: '',
    description: 'Dedicated multi-entity analysis, custom export templates & priority support.',
    features: [
      'Everything in Pro',
      'Multi-entity consolidation',
      'Custom risk engine thresholds',
      'Priority AI model & custom prompts',
      'Dedicated strategy & financial onboarding',
      'Team workspace access (coming soon)',
      'Custom report templates',
      '24/7 priority support',
    ],
    cta: 'View Enterprise Specs',
    href: '/settings?section=plan',
    highlighted: false,
    badge: 'Multi-Entity',
  },
];

export default function PricingPage() {
  return (
    <div className="py-20 md:py-28 bg-background">
      <div className="mx-auto w-full max-w-[1280px] px-4 md:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
            <Sparkles className="size-3.5" />
            <span>Decision Intelligence Tiers</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold text-text-primary tracking-tight">
            Wallflower Plans & Capabilities
          </h1>
          <p className="text-base md:text-lg text-text-secondary leading-relaxed">
            Understand your business, simulate major decisions, and see financial outcomes before committing real capital.
          </p>

          {/* Prototype Notice Banner */}
          <div className="flex items-center justify-center gap-2.5 rounded-lg border border-border-strong bg-surface-subtle p-3.5 text-xs md:text-sm text-text-secondary max-w-xl mx-auto">
            <Info className="size-4 text-brand shrink-0" />
            <span className="font-medium text-text-primary">
              Pricing and purchasing are not yet available in this prototype.
            </span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'flex flex-col justify-between rounded-lg border p-6 md:p-8 transition-colors',
                plan.highlighted
                  ? 'border-2 border-brand bg-brand-soft/20 shadow-md'
                  : 'border-border bg-surface'
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand">
                    {plan.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {plan.name === 'Enterprise' ? (
                    <Zap className="size-5 text-brand" />
                  ) : plan.name === 'Pro' ? (
                    <Sparkles className="size-5 text-brand" />
                  ) : null}
                  <h2 className="text-xl font-semibold text-text-primary">{plan.name}</h2>
                </div>

                <p className="mt-1.5 text-xs text-text-muted leading-relaxed">{plan.description}</p>

                <div className="mt-5 flex items-baseline gap-1 border-b border-border/60 pb-4">
                  <span className="text-3xl font-bold text-text-primary">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-text-muted">{plan.period}</span>
                  )}
                </div>

                <ul className="mt-6 flex flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-xs sm:text-sm text-text-secondary">
                      <Check className="size-4 text-brand shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-border/50">
                <Link
                  href={plan.href}
                  className={cn(
                    'flex w-full items-center justify-center px-4 py-2.5 rounded-md text-sm font-semibold transition-colors',
                    plan.highlighted
                      ? 'bg-brand text-white hover:bg-brand-hover'
                      : 'border border-border bg-surface text-text-primary hover:bg-surface-subtle'
                  )}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center max-w-xl mx-auto space-y-1 text-xs text-text-muted">
          <p>Wallflower separates deterministic math from AI explanations for complete financial transparency.</p>
          <p>© Wallflower Decision Intelligence. Prototype Environment.</p>
        </div>
      </div>
    </div>
  );
}
