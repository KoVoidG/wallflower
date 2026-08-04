import type { Metadata } from 'next';
import { PricingSection } from '@/components/marketing/pricing-section';

export const metadata: Metadata = {
  title: 'Pricing — Wallflower Decision Intelligence',
  description: 'Simple pricing for every stage of your business.',
};

export default function PricingPage() {
  return <PricingSection />;
}
