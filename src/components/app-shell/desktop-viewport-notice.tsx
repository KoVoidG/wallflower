'use client';

import { useSyncExternalStore } from 'react';
import { ArrowLeft, Monitor, RotateCw, LineChart, Cpu } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';

// Subscribe to media query changes (1024px minimum desktop/laptop workspace threshold)
const subscribe = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const mql = window.matchMedia('(min-width: 1024px)');
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
};

const getSnapshot = () => {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(min-width: 1024px)').matches;
};

const getServerSnapshot = () => true;

export function useIsDesktopWorkspace() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function DesktopViewportNotice() {
  const isDesktop = useIsDesktopWorkspace();

  // If the viewport is wide enough (>= 1024px), do not render the notice
  if (isDesktop) {
    return null;
  }

  const handleRefresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div
      role="region"
      aria-label="Desktop Workspace Notice"
      className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-2xl flex flex-col justify-between overflow-y-auto px-4 py-8 sm:px-8 text-center select-none"
      style={{
        paddingTop: 'max(2rem, env(safe-area-inset-top, 2rem))',
        paddingBottom: 'max(2rem, env(safe-area-inset-bottom, 2rem))',
      }}
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-gradient-to-r from-[#6366F1]/15 via-[#8B5CF6]/15 to-transparent blur-[100px] pointer-events-none -z-10" />

      {/* Top Bar: Brand Logo */}
      <div className="flex items-center justify-center">
        <Link href="/" className="inline-flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Logo size="md" />
        </Link>
      </div>

      {/* Center Content Card */}
      <div className="my-auto max-w-lg mx-auto w-full space-y-6 py-6 text-left">
        {/* Header Pill */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/25 text-brand text-xs font-bold uppercase tracking-wider shadow-xs mb-4">
            <Monitor className="size-3.5 text-brand" />
            <span>Desktop Workspace</span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            More room.{' '}
            <span className="bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#8B5CF6] bg-clip-text text-transparent">
              Better decisions.
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed max-w-md mx-auto">
            Wallflower is designed for laptop and desktop screens so you have enough space to explore your business, compare scenarios, and understand your numbers side by side.
          </p>
        </div>

        {/* Stylized Wallflower Desktop Workspace Representation */}
        <div className="rounded-2xl border border-slate-200 dark:border-[#1E2638] bg-white/80 dark:bg-[#111622]/90 shadow-xl p-4 sm:p-5 space-y-3 relative overflow-hidden backdrop-blur-md">
          {/* Mock Window Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1A2234] pb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-rose-400/80" />
              <span className="size-2.5 rounded-full bg-amber-400/80" />
              <span className="size-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Wallflower Workspace
            </span>
            <div className="size-2 rounded-full bg-brand animate-pulse" />
          </div>

          {/* Mock Multi-Column Workspace Preview */}
          <div className="grid grid-cols-12 gap-2 text-[10px]">
            {/* Mock Mini Sidebar */}
            <div className="col-span-2 rounded-xl bg-slate-100 dark:bg-[#182030] p-2 flex flex-col items-center gap-2 border border-slate-200/60 dark:border-[#243048]">
              <div className="size-4 rounded bg-brand/30 flex items-center justify-center text-brand">
                <LineChart className="size-2.5" />
              </div>
              <div className="size-4 rounded bg-slate-200 dark:bg-slate-700/50" />
              <div className="size-4 rounded bg-slate-200 dark:bg-slate-700/50" />
            </div>

            {/* Mock Dashboard & Simulation Content */}
            <div className="col-span-10 space-y-2">
              {/* Top Row: Mini KPI Cards */}
              <div className="grid grid-cols-3 gap-1.5">
                <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#161D2B] border border-slate-200/60 dark:border-[#243048]">
                  <span className="text-[9px] text-slate-400 block font-mono">Runway</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">9.2 mo</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#161D2B] border border-slate-200/60 dark:border-[#243048]">
                  <span className="text-[9px] text-slate-400 block font-mono">Profit</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">+18.5%</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#161D2B] border border-slate-200/60 dark:border-[#243048]">
                  <span className="text-[9px] text-slate-400 block font-mono">Math</span>
                  <span className="font-bold text-brand">100%</span>
                </div>
              </div>

              {/* Middle Row: Mock Trajectory Curve */}
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#161D2B] border border-slate-200/60 dark:border-[#243048] flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300">
                    Deterministic Simulation
                  </span>
                  <span className="text-[8px] text-slate-400 block">
                    Comparing 3 scenarios side by side
                  </span>
                </div>
                <div className="w-20 h-6 bg-gradient-to-r from-brand/20 via-purple-500/20 to-emerald-500/20 rounded border border-brand/30 flex items-center justify-center text-brand font-mono text-[9px] font-bold">
                  +฿68k/mo
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Banner */}
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/40 text-[11px] text-purple-900 dark:text-purple-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Cpu className="size-3.5 text-brand shrink-0" />
              For the best experience, please open on desktop.
            </span>
            <span className="size-1.5 rounded-full bg-purple-500 shrink-0" />
          </div>
        </div>

        {/* Coming Soon Pill */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Mobile experience coming soon.</span>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#8B5CF6] text-white font-bold text-xs shadow-md shadow-purple-500/20 hover:opacity-95 transition-all text-center cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Homepage</span>
          </Link>

          <Button
            type="button"
            variant="outline"
            onClick={handleRefresh}
            className="w-full sm:w-1/2 h-11 text-xs font-semibold gap-2 border-slate-200 dark:border-[#243048]"
          >
            <RotateCw className="size-3.5" />
            <span>Check Viewport</span>
          </Button>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="text-[11px] text-slate-400 dark:text-slate-500 text-center">
        <span>Wallflower Decision Intelligence — Minimum workspace width: 1024px</span>
      </div>
    </div>
  );
}
