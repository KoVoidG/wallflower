import type { Metadata } from 'next';
import { HeroSection } from '@/components/marketing/hero-section';
import { ProblemSection } from '@/components/marketing/problem-section';
import { DecisionJourneySection } from '@/components/marketing/decision-journey-section';
import { BusinessIntelligenceSection } from '@/components/marketing/business-intelligence-section';
import { RiskDetectionSection } from '@/components/marketing/risk-detection-section';
import { InteractiveSimulatorSection } from '@/components/marketing/interactive-simulator-section';
import { ScenarioComparisonSection } from '@/components/marketing/scenario-comparison-section';
import { FeaturesBentoSection } from '@/components/marketing/features-bento-section';
import { DifferentiationSection } from '@/components/marketing/differentiation-section';
import { IntegrationsMarqueeSection } from '@/components/marketing/integrations-marquee-section';
import { TrustProofSection } from '@/components/marketing/trust-proof-section';
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
    <div className="space-y-0 overflow-x-clip bg-white">
      {/* ── 01. Light Hero ── */}
      <HeroSection />

      {/* ── 02. Soft Lavender Problem ── */}
      <ProblemSection />

      {/* ── Transition: Light → Deep Navy ── */}
      <div className="relative h-32 sm:h-48 -mt-12 overflow-visible z-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8F9FC] via-[#0A0F24]/80 to-[#0A0F24]" />
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl rounded-full" />
      </div>

      {/* ── 04. Deep Navy Workflow (Decision Journey) ── */}
      <DecisionJourneySection />

      {/* ── Transition: Deep Navy → Light ── */}
      <div className="relative h-32 sm:h-48 -mt-12 overflow-visible z-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F24] via-[#FAFAFC]/80 to-[#FAFAFC]" />
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-indigo-500/10 to-transparent blur-3xl rounded-full" />
      </div>

      {/* ── 06. Light Business Health ── */}
      <BusinessIntelligenceSection />

      {/* ── 07. Light Risk Detection (Soft Lavender) ── */}
      <RiskDetectionSection />

      {/* ── Transition: Light → Deep Navy ── */}
      <div className="relative h-32 sm:h-48 -mt-12 overflow-visible z-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFC] via-[#0A0F24]/80 to-[#0A0F24]" />
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-indigo-500/10 to-transparent blur-3xl rounded-full" />
      </div>

      {/* ── 08. Deep Navy Simulation (Interactive Simulator) ── */}
      <InteractiveSimulatorSection />

      {/* ── Transition: Dark → Light ── */}
      <div className="relative h-32 sm:h-48 -mt-12 overflow-visible z-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F24] via-[#FAFAFC]/80 to-[#FAFAFC]" />
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl rounded-full" />
      </div>

      {/* ── 09 & 10. Light Scenario Comparison & Decision Support ── */}
      <ScenarioComparisonSection />

      {/* ── Transition: Light → Deep Navy ── */}
      <div className="relative h-32 sm:h-48 -mt-12 overflow-visible z-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFC] via-[#0A0F24]/80 to-[#0A0F24]" />
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-blue-500/10 to-transparent blur-3xl rounded-full" />
      </div>

      {/* ── 11. Deep Navy Operational Rigor (Features Bento) ── */}
      <FeaturesBentoSection />

      {/* ── Transition: Dark Navy → Light ── */}
      <div className="relative h-32 sm:h-48 -mt-12 overflow-visible z-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F24] via-[#FAFAFC]/80 to-[#FAFAFC]" />
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-indigo-500/10 to-transparent blur-3xl rounded-full" />
      </div>

      {/* ── 13. Light Differentiation ── */}
      <DifferentiationSection />

      {/* ── 14. Light Integrations ── */}
      <IntegrationsMarqueeSection />

      {/* ── 15. Light Reporting / Trust Proof ── */}
      <TrustProofSection />

      {/* ── 16. Light Pricing ── */}
      <PricingSection />

      {/* ── 17. Lavender FAQ ── */}
      <FaqSection />

      {/* ── Transition: Light → Deep Navy ── */}
      <div className="relative h-32 sm:h-48 -mt-12 overflow-visible z-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFC] via-[#0A0F24]/80 to-[#0A0F24]" />
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl rounded-full" />
      </div>

      {/* ── 18. Deep Navy Final CTA ── */}
      <CtaSection />
    </div>
  );
}
