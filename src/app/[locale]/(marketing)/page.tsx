import type { Metadata } from 'next';
import { HeroSection } from '@/components/marketing/hero-section';
import { WorkflowSection } from '@/components/marketing/workflow-section';
import { ScenariosSection } from '@/components/marketing/scenarios-section';
import { ExplainabilitySection } from '@/components/marketing/explainability-section';
import { ThaiSmeSection } from '@/components/marketing/thai-sme-section';
import { CtaSection } from '@/components/marketing/cta-section';

export const metadata: Metadata = {
  title: 'Wallflower — Decision Intelligence for Thai SMEs',
  description:
    'See the impact before you make the move. Business diagnostics, risk detection, and decision simulations for Thai small businesses.',
  openGraph: {
    title: 'Wallflower — Decision Intelligence for Thai SMEs',
    description:
      'See the impact before you make the move. Business diagnostics, risk detection, and decision simulations for Thai small businesses.',
    type: 'website',
  },
};

export default function MarketingPage() {
  return (
    <>
      <HeroSection />
      <WorkflowSection />
      <ScenariosSection />
      <ExplainabilitySection />
      <ThaiSmeSection />
      <CtaSection />
    </>
  );
}
