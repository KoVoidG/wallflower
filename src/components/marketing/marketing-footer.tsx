'use client';

import { Link, usePathname, useRouter } from '@/lib/i18n/navigation';
import { Logo } from '@/components/ui/logo';
import { ShieldCheck } from 'lucide-react';

export function MarketingFooter() {
  const pathname = usePathname();
  const router = useRouter();

  const scrollToSection = (targetId: string) => {
    if (pathname === '/' || pathname === '') {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      router.push('/');
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  };

  return (
    <footer className="border-t border-border/60 bg-surface-subtle/50 pt-16 pb-12 text-left">
      <div className="w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 space-y-12">
        {/* Top: 4 Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col (2 cols on md+) */}
          <div className="col-span-2 space-y-4">
            <Link
              href="/"
              onClick={(e) => {
                if (pathname === '/' || pathname === '') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="flex items-center group transition-opacity hover:opacity-95 cursor-pointer"
              title="Wallflower - Back to top"
            >
              <Logo size="md" />
            </Link>
            <p className="text-xs text-text-secondary font-medium leading-relaxed max-w-[320px]">
              Wallflower is the business decision workspace. Simulate price changes, staffing, promotions, and inventory orders with deterministic financial precision.
            </p>

            {/* Live Operational Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-[11px] font-bold text-text-secondary shadow-xs">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Simulation Engines Operational</span>
            </div>
          </div>

          {/* Col 2: Decision Product */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-text-primary">
              Product
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-text-secondary">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('journey')}
                  className="hover:text-brand transition-colors cursor-pointer text-left"
                >
                  Decision Lifecycle
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('simulator')}
                  className="hover:text-brand transition-colors cursor-pointer text-left"
                >
                  Interactive Simulator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('features')}
                  className="hover:text-brand transition-colors cursor-pointer text-left"
                >
                  Health &amp; Risk Radar
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('pricing')}
                  className="hover:text-brand transition-colors cursor-pointer text-left"
                >
                  Pricing Plans
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: SME Solutions */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-text-primary">
              SME Solutions
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-text-secondary">
              <li>
                <span className="text-text-muted cursor-default">Specialty Retail</span>
              </li>
              <li>
                <span className="text-text-muted cursor-default">F&amp;B &amp; Cafes</span>
              </li>
              <li>
                <span className="text-text-muted cursor-default">Apparel &amp; Boutiques</span>
              </li>
              <li>
                <span className="text-text-muted cursor-default">Wholesale &amp; B2B</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Legal */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-text-primary">
              Trust &amp; Security
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-text-secondary">
              <li>
                <Link href="/privacy" className="hover:text-brand transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('faq')}
                  className="hover:text-brand transition-colors cursor-pointer text-left"
                >
                  FAQ &amp; Documentation
                </button>
              </li>
              <li className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                <ShieldCheck className="size-3.5" />
                <span>AES-256 Encrypted</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-text-muted">
          <p>
            © {new Date().getFullYear()} Wallflower Decision Intelligence. All rights reserved.
          </p>
          <p>Built for retail and SME operators with deterministic financial modeling.</p>
        </div>
      </div>
    </footer>
  );
}
