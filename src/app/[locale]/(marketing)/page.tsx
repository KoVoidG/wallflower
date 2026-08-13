import type { Metadata } from 'next';
import { HeroSection } from '@/components/marketing/hero-section';
import { ProofStrip } from '@/components/marketing/proof-strip';
import { WorkflowSection } from '@/components/marketing/workflow-section';
import { ScenariosSection } from '@/components/marketing/scenarios-section';
import { ExplainabilitySection } from '@/components/marketing/explainability-section';
import { PricingSection } from '@/components/marketing/pricing-section';
import { FaqSection } from '@/components/marketing/faq-section';
import { TrustStrip } from '@/components/marketing/trust-strip';
import { CtaSection } from '@/components/marketing/cta-section';
import { FadeInView } from '@/components/motion/fade-in-view';

export const metadata: Metadata = {
  title: 'Wallflower — Make Better Business Decisions Before They Cost You Money',
  description:
    'Simulate pricing, hiring, inventory, and expansion with deterministic financial models and AI insights built for retail SMEs.',
};

export default function MarketingPage() {
  return (
    <div className="space-y-0 overflow-x-hidden">
      <HeroSection />

      <FadeInView offset={20} duration={0.4}>
        <ProofStrip />
      </FadeInView>

      <FadeInView offset={24} duration={0.45}>
        <WorkflowSection />
      </FadeInView>

      <FadeInView offset={24} duration={0.45}>
        <ScenariosSection />
      </FadeInView>

      <FadeInView offset={24} duration={0.45}>
        <ExplainabilitySection />
      </FadeInView>

      <FadeInView offset={24} duration={0.45}>
        <PricingSection />
      </FadeInView>

      <FadeInView offset={24} duration={0.45}>
        <FaqSection />
      </FadeInView>

      <FadeInView offset={24} duration={0.45}>
        <TrustStrip />
      </FadeInView>

      <FadeInView offset={24} duration={0.45}>
        <CtaSection />
      </FadeInView>
    </div>
  );
}
