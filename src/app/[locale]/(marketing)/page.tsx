import type { Metadata } from 'next';
import { HeroSection } from '@/components/marketing/hero-section';
import { ProofStrip } from '@/components/marketing/proof-strip';
import { DecisionJourneySection } from '@/components/marketing/decision-journey-section';
import { InteractiveSimulatorSection } from '@/components/marketing/interactive-simulator-section';
import { FeaturesBentoSection } from '@/components/marketing/features-bento-section';
import { IntegrationsMarqueeSection } from '@/components/marketing/integrations-marquee-section';
import { CaseStudiesSection } from '@/components/marketing/case-studies-section';
import { PricingSection } from '@/components/marketing/pricing-section';
import { FaqSection } from '@/components/marketing/faq-section';
import { CtaSection } from '@/components/marketing/cta-section';

export const metadata: Metadata = {
  title: 'Wallflower — Decision Intelligence & Simulation Workspace for SMEs',
  description:
    'Simulate pricing, hiring, inventory, and branch expansion with deterministic financial models and AI explainability built for retail SMEs.',
};

export default function MarketingPage() {
  return (
    <div className="space-y-0 overflow-x-hidden">
      {/* 1. Hero with Interactive Live Decision Sandbox */}
      <HeroSection />

      {/* 2. Proof & Trust Ticker */}
      <ProofStrip />

      {/* 3. The 5 Stages: Understand → Diagnose → Simulate → Compare → Decide */}
      <DecisionJourneySection />

      {/* 4. Interactive Deep What-If Simulation Station */}
      <InteractiveSimulatorSection />

      {/* 5. Features Bento Grid (Math Integrity, Capybot, Runway Radar) */}
      <FeaturesBentoSection />

      {/* 6. Animated Integrations Display (Linear, Jira, Notion, GitHub, Salesforce, etc.) */}
      <IntegrationsMarqueeSection />

      {/* 7. Authentic SME Case Studies & Decision Outcomes */}
      <CaseStudiesSection />

      {/* 8. Transparent Value-First Pricing */}
      <PricingSection />

      {/* 9. Interactive Searchable FAQ */}
      <FaqSection />

      {/* 10. Cinematic Closing CTA */}
      <CtaSection />
    </div>
  );
}
