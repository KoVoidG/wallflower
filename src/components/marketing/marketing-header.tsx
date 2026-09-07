'use client';

import { useState, useEffect } from 'react';
import { Link, usePathname, useRouter } from '@/lib/i18n/navigation';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';

export function MarketingHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = (e: React.MouseEvent) => {
    setMobileOpen(false);
    if (pathname === '/' || pathname === '') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 200);
    }
  };

  const scrollToSection = (targetId?: string) => {
    if (!targetId) return;
    setMobileOpen(false);
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
    <header 
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out",
        scrolled 
          ? "bg-white/60 backdrop-blur-xl py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between gap-6">
        {/* Left: Brand Logo */}
        <Link
          href="/"
          onClick={scrollToTop}
          className="flex items-center group transition-opacity hover:opacity-75 cursor-pointer text-zinc-950"
          title="Wallflower - Back to top"
        >
          <Logo size="md" wordmarkClassName="text-zinc-950 dark:text-zinc-950" />
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold">
          {/* Product Dropdown */}
          <div className="relative group">
            <button className="text-zinc-600 hover:text-zinc-950 transition-colors flex items-center gap-1 py-2">
              Product
              <ChevronDown className="size-3.5 opacity-50 group-hover:rotate-180 transition-transform duration-200" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="w-56 bg-white/95 backdrop-blur-xl border border-black/5 rounded-2xl shadow-xl p-2 flex flex-col gap-1">
                <button onClick={() => scrollToSection('health')} className="text-left px-4 py-2.5 text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors text-sm font-medium">Business Health</button>
                <button onClick={() => scrollToSection('risks')} className="text-left px-4 py-2.5 text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors text-sm font-medium">Risk Detection</button>
                <button onClick={() => scrollToSection('simulator')} className="text-left px-4 py-2.5 text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors text-sm font-medium">Scenario Simulator</button>
                <button onClick={() => scrollToSection('comparison')} className="text-left px-4 py-2.5 text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors text-sm font-medium">Decision Reports</button>
              </div>
            </div>
          </div>

          {/* Solutions Dropdown */}
          <div className="relative group">
            <button className="text-zinc-600 hover:text-zinc-950 transition-colors flex items-center gap-1 py-2">
              Solutions
              <ChevronDown className="size-3.5 opacity-50 group-hover:rotate-180 transition-transform duration-200" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="w-56 bg-white/95 backdrop-blur-xl border border-black/5 rounded-2xl shadow-xl p-2 flex flex-col gap-1">
                <button onClick={() => scrollToSection('features')} className="text-left px-4 py-2.5 text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors text-sm font-medium">Specialty Retail</button>
                <button onClick={() => scrollToSection('features')} className="text-left px-4 py-2.5 text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors text-sm font-medium">F&B & Cafes</button>
                <button onClick={() => scrollToSection('features')} className="text-left px-4 py-2.5 text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors text-sm font-medium">Apparel & Boutiques</button>
                <button onClick={() => scrollToSection('features')} className="text-left px-4 py-2.5 text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors text-sm font-medium">Wholesale & B2B</button>
              </div>
            </div>
          </div>

          {/* Resources Dropdown */}
          <div className="relative group">
            <button className="text-zinc-600 hover:text-zinc-950 transition-colors flex items-center gap-1 py-2">
              Resources
              <ChevronDown className="size-3.5 opacity-50 group-hover:rotate-180 transition-transform duration-200" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="w-56 bg-white/95 backdrop-blur-xl border border-black/5 rounded-2xl shadow-xl p-2 flex flex-col gap-1">
                <button onClick={() => scrollToSection('journey')} className="text-left px-4 py-2.5 text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors text-sm font-medium">How Wallflower Works</button>
                <button onClick={() => scrollToSection('faq')} className="text-left px-4 py-2.5 text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors text-sm font-medium">Documentation</button>
                <button onClick={() => scrollToSection('faq')} className="text-left px-4 py-2.5 text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors text-sm font-medium">FAQ</button>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <button
            type="button"
            onClick={() => scrollToSection('pricing')}
            className="text-zinc-600 hover:text-zinc-950 transition-colors py-2"
          >
            Pricing
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold rounded-full bg-zinc-950 text-white hover:bg-zinc-800 transition-colors shadow-md"
          >
            <span>Start Free</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* Mobile menu triggers */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center justify-center size-9 rounded-xl border border-black/5 text-zinc-600 bg-black/5 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav sheet */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl px-6 py-6 space-y-6 shadow-2xl border-t border-black/5">
          <div className="flex flex-col gap-6 text-sm font-semibold text-zinc-600">
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Product</div>
              <div className="flex flex-col pl-2 gap-3 border-l-2 border-indigo-100">
                <button onClick={() => scrollToSection('health')} className="text-left hover:text-indigo-600">Business Health</button>
                <button onClick={() => scrollToSection('risks')} className="text-left hover:text-indigo-600">Risk Detection</button>
                <button onClick={() => scrollToSection('simulator')} className="text-left hover:text-indigo-600">Scenario Simulator</button>
                <button onClick={() => scrollToSection('comparison')} className="text-left hover:text-indigo-600">Decision Reports</button>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Solutions</div>
              <div className="flex flex-col pl-2 gap-3 border-l-2 border-indigo-100">
                <button onClick={() => scrollToSection('features')} className="text-left hover:text-indigo-600">Specialty Retail</button>
                <button onClick={() => scrollToSection('features')} className="text-left hover:text-indigo-600">F&B & Cafes</button>
                <button onClick={() => scrollToSection('features')} className="text-left hover:text-indigo-600">Apparel & Boutiques</button>
                <button onClick={() => scrollToSection('features')} className="text-left hover:text-indigo-600">Wholesale & B2B</button>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Resources</div>
              <div className="flex flex-col pl-2 gap-3 border-l-2 border-indigo-100">
                <button onClick={() => scrollToSection('journey')} className="text-left hover:text-indigo-600">How Wallflower Works</button>
                <button onClick={() => scrollToSection('faq')} className="text-left hover:text-indigo-600">Documentation</button>
                <button onClick={() => scrollToSection('faq')} className="text-left hover:text-indigo-600">FAQ</button>
              </div>
            </div>
            <button onClick={() => scrollToSection('pricing')} className="text-left hover:text-zinc-950 font-bold">Pricing</button>
          </div>
          <div className="pt-6 border-t border-black/5 flex items-center gap-3">
            <Link href="/login" onClick={() => setMobileOpen(false)} className="w-1/2 py-3 text-center text-sm font-semibold rounded-xl text-zinc-600 bg-black/5">
              Sign In
            </Link>
            <Link href="/register" onClick={() => setMobileOpen(false)} className="w-1/2 py-3 text-center text-sm font-semibold bg-zinc-950 text-white rounded-xl shadow-md">
              Start Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
