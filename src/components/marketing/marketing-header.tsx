'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils';

const scrollLinks = [
  { href: '#how-it-works', label: 'How it Works' },
  { href: '#scenarios', label: 'Features' },
  { href: '#why-us', label: 'Why Us' },
];

const pageLinks = [
  { href: '/pricing', label: 'Pricing' },
];

export function MarketingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleScrollClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileOpen(false);
  }

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
          {scrollLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleScrollClick(e, link.href)}
              className="text-[15px]/[24px] font-[500] text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            >
              {link.label}
            </a>
          ))}
          {pageLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px]/[24px] font-[500] text-text-secondary hover:text-text-primary transition-colors"
            >
              {link.label}
            </Link>
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
            {scrollLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleScrollClick(e, link.href)}
                className="text-[15px]/[24px] font-[500] text-text-secondary hover:text-text-primary py-2 cursor-pointer"
              >
                {link.label}
              </a>
            ))}
            {pageLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-[15px]/[24px] font-[500] text-text-secondary hover:text-text-primary py-2"
              >
                {link.label}
              </Link>
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
      <circle cx="8.5" cy="8.5" r="2.5" className="fill-brand" opacity="0.5" />
      <circle cx="19.5" cy="8.5" r="2.5" className="fill-brand" opacity="0.5" />
      <circle cx="8.5" cy="19.5" r="2.5" className="fill-brand" opacity="0.5" />
      <circle cx="19.5" cy="19.5" r="2.5" className="fill-brand" opacity="0.5" />
    </svg>
  );
}
