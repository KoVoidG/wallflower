import { Link } from '@/lib/i18n/navigation';

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1280px] px-6 md:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <FlowerMark className="size-5" />
            <span className="text-[15px]/[24px] font-[600] text-text-primary">
              Wallflower
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6" aria-label="Footer navigation">
            <Link
              href="/privacy"
              className="text-[13px]/[20px] text-text-muted hover:text-text-secondary transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-[13px]/[20px] text-text-muted hover:text-text-secondary transition-colors"
            >
              Terms
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-[13px]/[20px] text-text-muted">
            © {new Date().getFullYear()} Wallflower. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

/** Simplified flower mark SVG */
function FlowerMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="14" cy="14" r="4" className="fill-brand" />
      <circle cx="14" cy="6" r="3" className="fill-brand" opacity="0.7" />
      <circle cx="14" cy="22" r="3" className="fill-brand" opacity="0.7" />
      <circle cx="6" cy="14" r="3" className="fill-brand" opacity="0.7" />
      <circle cx="22" cy="14" r="3" className="fill-brand" opacity="0.7" />
    </svg>
  );
}
