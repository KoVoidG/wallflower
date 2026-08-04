import { Link } from '@/lib/i18n/navigation';

export function MarketingFooter() {

  return (
    <footer className="border-t border-border/60 bg-background py-10 text-left">
      <div className="w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-display font-extrabold text-lg text-text-primary tracking-tight"
          >
            <div className="size-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-2xs">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span>Wallflower</span>
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
