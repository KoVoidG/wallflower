'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePathname } from '@/lib/i18n/navigation';
import { useReducedMotion } from '@/components/motion';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;
const PANEL_DURATION = 0.46;
const CONTENT_FADE_IN = 0.24;

type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-password';

function getMode(pathname: string): AuthMode {
  if (pathname.includes('/register')) return 'register';
  if (pathname.includes('/forgot-password')) return 'forgot-password';
  if (pathname.includes('/reset-password')) return 'reset-password';
  return 'login';
}

// Direction: login is "left", register is "right"
function getDirection(from: AuthMode, to: AuthMode): 'left' | 'right' | 'none' {
  if (from === 'login' && to === 'register') return 'right';
  if (from === 'register' && to === 'login') return 'left';
  return 'none';
}

const productCopy: Record<AuthMode, { headline: string; body: string }> = {
  login: {
    headline: 'Understand the business before making the next move.',
    body: 'Continue reviewing your business health, risks, and decisions.',
  },
  register: {
    headline: 'Build your business baseline.',
    body: 'Create an account, then add the financial data Wallflower uses to identify risks and simulate decisions.',
  },
  'forgot-password': {
    headline: 'Understand the business before making the next move.',
    body: 'Wallflower helps SMEs identify financial pressure, test business decisions, and understand how cash position, profit, and risk may change before acting.',
  },
  'reset-password': {
    headline: 'Understand the business before making the next move.',
    body: 'Wallflower helps SMEs identify financial pressure, test business decisions, and understand how cash position, profit, and risk may change before acting.',
  },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const mode = getMode(pathname);
  const prefersReduced = useReducedMotion();
  const formContainerRef = useRef<HTMLDivElement>(null);

  const isSwapped = mode === 'register';

  // Track direction for content offset using state (avoids ref-during-render)
  const [contentOffset, setContentOffset] = useState(0);
  const prevModeForOffset = useRef<AuthMode>(mode);
  useEffect(() => {
    const dir = getDirection(prevModeForOffset.current, mode);
    setContentOffset(dir === 'right' ? -16 : dir === 'left' ? 16 : 0);
    prevModeForOffset.current = mode;
  }, [mode]);

  // Focus first input after transition
  useEffect(() => {
    const timer = setTimeout(() => {
      const firstInput = formContainerRef.current?.querySelector<HTMLInputElement>(
        'input:not([type="hidden"])'
      );
      firstInput?.focus();
    }, prefersReduced ? 50 : 500);
    return () => clearTimeout(timer);
  }, [mode, prefersReduced]);

  const copy = productCopy[mode];

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Desktop split layout with animated panel positions */}
      <div className="hidden lg:flex lg:flex-1 relative">
        {/* Product panel */}
        <motion.div
          className={cn(
            'absolute inset-y-0 w-[58%] bg-surface-subtle overflow-hidden',
          )}
          animate={{
            left: isSwapped ? '42%' : '0%',
            right: isSwapped ? '0%' : '42%',
          }}
          transition={prefersReduced ? { duration: 0 } : { duration: PANEL_DURATION, ease: EASE }}
        >
          <div className={cn(
            'flex flex-col justify-center h-full px-12 xl:px-16 py-12 w-full max-w-[640px]',
            isSwapped ? 'mr-auto' : 'ml-auto'
          )}>
            {/* Brand */}
            <div className="flex items-center gap-2.5 mb-10">
              <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-brand">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-[18px] font-[650] text-text-primary">Wallflower</span>
            </div>

            {/* Animated product copy */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReduced ? {} : { opacity: 0, y: -8 }}
                transition={{ duration: CONTENT_FADE_IN, ease: EASE }}
              >
                <h2 className="text-[28px]/[36px] font-[650] text-text-primary mb-3">
                  {copy.headline}
                </h2>
                <p className="text-[15px]/[24px] text-text-secondary mb-10 max-w-[480px]">
                  {copy.body}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Product preview */}
            <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 max-w-[420px]">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="brand">Decision Simulation</Badge>
                <span className="text-[12px] text-text-muted">Sample preview</span>
              </div>
              <p className="text-[14px]/[20px] font-[550] text-text-primary mb-4">
                What if you hire two employees?
              </p>
              <div className="flex flex-col gap-2.5 text-[13px]">
                <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                  <span className="text-text-muted">Cash runway</span>
                  <span className="tabular-nums text-text-primary">
                    8.2 → <span className="text-warning font-[550]">5.1 months</span>
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                  <span className="text-text-muted">Monthly profit</span>
                  <span className="tabular-nums text-text-primary">
                    ฿35,000 → <span className="text-danger font-[550]">-฿12,400</span>
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                  <span className="text-text-muted">Working capital needed</span>
                  <span className="tabular-nums font-[550] text-text-primary">฿180,000</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-text-muted">Recommendation</span>
                  <Badge variant="warning">Proceed cautiously</Badge>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border/50 flex items-start gap-2">
                <AlertTriangle className="size-3.5 mt-0.5 shrink-0 text-text-muted" aria-hidden="true" />
                <span className="text-[11px]/[16px] text-text-muted">
                  Sensitivity: payroll above ฿120,000/month changes recommendation to &ldquo;Delay&rdquo;
                </span>
              </div>
            </div>

            {/* Trust */}
            <div className="flex items-start gap-2 mt-8">
              <Shield className="size-4 mt-0.5 shrink-0 text-text-muted" aria-hidden="true" />
              <p className="text-[13px]/[20px] text-text-muted max-w-[400px]">
                Wallflower separates calculated results from AI interpretation. Every recommendation shows its assumptions and confidence level.
              </p>
            </div>
          </div>

          {/* Background pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.03]" aria-hidden="true">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="auth-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1" fill="currentColor" className="text-brand" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#auth-grid)" />
            </svg>
          </div>
        </motion.div>

        {/* Form panel */}
        <motion.div
          className="absolute inset-y-0 w-[42%] flex flex-col items-center justify-center bg-background"
          animate={{
            left: isSwapped ? '0%' : '58%',
            right: isSwapped ? '58%' : '0%',
          }}
          transition={prefersReduced ? { duration: 0 } : { duration: PANEL_DURATION, ease: EASE }}
        >
          <div ref={formContainerRef} className="w-full max-w-[420px] px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={prefersReduced ? {} : { opacity: 0, x: contentOffset }}
                animate={{ opacity: 1, x: 0 }}
                exit={prefersReduced ? {} : { opacity: 0, x: -contentOffset }}
                transition={{
                  duration: CONTENT_FADE_IN,
                  ease: EASE,
                }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Mobile layout - single column with content transitions */}
      <div className="flex flex-col flex-1 lg:hidden min-h-screen bg-background">
        {/* Mobile brand */}
        <div className="flex items-center gap-2 px-5 pt-8 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-brand">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-[18px] font-[650] text-text-primary">Wallflower</span>
        </div>

        {/* Mobile form content with directional transition */}
        <div className="flex-1 flex flex-col justify-center px-5 sm:px-8 pb-8">
          <div ref={formContainerRef} className="w-full max-w-[420px] mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={prefersReduced ? {} : { opacity: 0, x: contentOffset * 0.8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={prefersReduced ? {} : { opacity: 0, x: contentOffset * -0.8 }}
                transition={{ duration: CONTENT_FADE_IN, ease: EASE }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
