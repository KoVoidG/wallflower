import type { ReactNode } from 'react';
import { MarketingFooter } from '@/components/marketing/marketing-footer';

export default function LegalRouteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
