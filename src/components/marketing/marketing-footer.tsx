import { Link } from '@/lib/i18n/navigation';
import { Logo } from '@/components/ui/logo';

export function MarketingFooter() {

  return (
    <footer className="border-t border-border/60 bg-background py-10 text-left">
      <div className="w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center group transition-opacity hover:opacity-95"
          >
            <Logo size="sm" />
          </Link>

          {/* Navigation Links (Public Marketing Only) */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-text-secondary">
            <Link
              href="/#features"
              className="hover:text-text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#pricing"
              className="hover:text-text-primary transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/#faq"
              className="hover:text-text-primary transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/#faq"
              className="hover:text-text-primary transition-colors"
            >
              Help & Support
            </Link>
            <Link
              href="/privacy"
              className="hover:text-text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </nav>
        </div>

        <div className="border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-text-muted">
          <p>
            © {new Date().getFullYear()} Wallflower Decision Intelligence. All
            rights reserved.
          </p>
          <p>Built for retail SMEs with deterministic financial models.</p>
        </div>
      </div>
    </footer>
  );
}
