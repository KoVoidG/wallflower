import type { Metadata } from 'next';
import { HeroSection } from '@/components/marketing/hero-section';
import { ProofStrip } from '@/components/marketing/proof-strip';
import { WorkflowSection } from '@/components/marketing/workflow-section';
import { ScenariosSection } from '@/components/marketing/scenarios-section';
import { ExplainabilitySection } from '@/components/marketing/explainability-section';
import { ThaiSmeSection } from '@/components/marketing/thai-sme-section';
import { PrototypeSection } from '@/components/marketing/prototype-section';
import { CtaSection } from '@/components/marketing/cta-section';
import { HashScrollHandler } from '@/components/marketing/hash-scroll-handler';

export const metadata: Metadata = {
  title: 'Wallflower — Decision Intelligence for Thai SMEs',
  description:
    'See how a business decision affects your cash before you commit. Business diagnostics, risk detection, and decision simulations for Thai small businesses.',
  openGraph: {
    title: 'Wallflower — Decision Intelligence for Thai SMEs',
    description:
      'See how a business decision affects your cash before you commit. Business diagnostics, risk detection, and decision simulations for Thai small businesses.',
    type: 'website',
  },
};

export default function MarketingPage() {
  return (
    <>
      <HashScrollHandler />
      <HeroSection />
      <ProofStrip />
      <WorkflowSection />
      <ScenariosSection />
      <ExplainabilitySection />
      <ThaiSmeSection />
      <PrototypeSection />
      <CtaSection />
    </>
  );
}
