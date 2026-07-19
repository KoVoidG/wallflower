'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from '@/lib/i18n/navigation';
import { Menu, X } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils';

// ── Navigation config ───────────────────────────────────────────────────────

type SectionNavItem = { label: string; type: 'section'; id: string };
type PageNavItem = { label: string; type: 'page'; href: string };
type NavItem = SectionNavItem | PageNavItem;

const navigation: NavItem[] = [
  { label: 'How it Works', type: 'section', id: 'how-it-works' },
  { label: 'Features', type: 'section', id: 'scenarios' },
  { label: 'Why Wallflower', type: 'section', id: 'why-us' },
  { label: 'Pricing', type: 'page', href: '/pricing' },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Smooth-scroll to a section by ID if it exists on the current page. */
function scrollToSection(id: string): boolean {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Clean up hash from URL after scroll completes (approx 600ms)
    setTimeout(() => {
      history.replaceState(null, '', window.location.pathname);
    }, 600);
    return true;
  }
  return false;
}

// ── Component ───────────────────────────────────────────────────────────────

export function MarketingHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLandingPage = pathname === '/' || pathname === '';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback(
    (item: NavItem) => {
      setMobileOpen(false);

      if (item.type === 'page') {
        router.push(item.href);
        return;
      }

      // Section link
      if (isLandingPage) {
        // Already on landing page — just scroll
        scrollToSection(item.id);
      } else {
        // On another page — navigate to landing with hash
        router.push(`/#${item.id}`);
      }
    },
    [router, isLandingPage]
  );

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-colors duration-200',
        scrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-[650] text-[18px] text-text-primary">
          <FlowerMark className="size-7" />
          Wallflower
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {navigation.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleNavClick(item)}
              className="text-[15px]/[24px] font-[500] text-text-secondary hover:text-text-primary transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-[15px]/[24px] font-[550] text-text-secondary hover:text-text-primary transition-colors px-3 py-2"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-4 py-2 rounded-[var(--radius-md)] bg-brand text-white text-[15px]/[24px] font-[550] hover:bg-brand-hover transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden p-2 text-text-secondary hover:text-text-primary cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-6 pb-4">
          <nav className="flex flex-col gap-3" aria-label="Mobile navigation">
            {navigation.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavClick(item)}
                className="text-left text-[15px]/[24px] font-[500] text-text-secondary hover:text-text-primary py-2 cursor-pointer bg-transparent border-none p-0"
              >
                {item.label}
              </button>
            ))}
            <hr className="border-border my-2" />
            <Link
              href="/login"
              className="text-[15px]/[24px] font-[550] text-text-secondary py-2"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-[var(--radius-md)] bg-brand text-white text-[15px]/[24px] font-[550]"
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

// ── Flower Mark SVG ─────────────────────────────────────────────────────────

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
      <circle cx="8.5" cy="8.5" r="2.5" className="fill-brand" opacity="0.5" />
      <circle cx="19.5" cy="8.5" r="2.5" className="fill-brand" opacity="0.5" />
      <circle cx="8.5" cy="19.5" r="2.5" className="fill-brand" opacity="0.5" />
      <circle cx="19.5" cy="19.5" r="2.5" className="fill-brand" opacity="0.5" />
    </svg>
  );
}
