import type { ReactNode } from 'react';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
