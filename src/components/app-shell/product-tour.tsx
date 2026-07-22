'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from '@/lib/i18n/navigation';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Check,
  HeartPulse,
  BarChart3,
  ShieldAlert,
  FlaskConical,
  Bot,
  FileText,
  Settings as SettingsIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/components/motion/use-reduced-motion';

export interface TourStepConfig {
  id: string;
  route: string;
  selector: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TOUR_STEPS: TourStepConfig[] = [
  {
    id: 'dashboard',
    route: '/dashboard',
    selector: '[data-tour="pulse"]',
    title: '1. Dashboard — Pulse & KPIs',
    desc: 'Monitor core business health indicators, warning alerts, and monthly snapshot performance metrics.',
    icon: HeartPulse,
  },
  {
    id: 'business-health',
    route: '/business-health',
    selector: '[data-tour="health-score"]',
    title: '2. Business Health & Metrics',
    desc: 'Inspect historical health trends, snapshot history, and contributing ratio breakdown scores.',
    icon: BarChart3,
  },
  {
    id: 'risks',
    route: '/risks',
    selector: '[data-tour="risks-view"]',
    title: '3. Risk Center',
    desc: 'Review urgent financial risks automatically detected by our deterministic risk engine with actionable mitigation steps.',
    icon: ShieldAlert,
  },
  {
    id: 'simulations',
    route: '/simulations',
    selector: '[data-tour="simulations-view"]',
    title: '4. Decision Simulations',
    desc: 'Model what-if business decisions—like price increases or hiring—before spending real capital.',
    icon: FlaskConical,
  },
  {
    id: 'advisor',
    route: '/advisor',
    selector: '[data-tour="advisor-view"]',
    title: '5. AI Advisor Interpretation',
    desc: 'Receive AI interpretations that translate calculated financial facts into actionable strategic recommendations.',
    icon: Bot,
  },
  {
    id: 'reports',
    route: '/reports',
    selector: '[data-tour="reports-view"]',
    title: '6. Decision Reports',
    desc: 'Generate comprehensive, print-safe decision reports complete with evidence snapshots and action plans.',
    icon: FileText,
  },
  {
    id: 'settings',
    route: '/settings',
    selector: '[data-tour="settings-view"]',
    title: '7. Settings & Replay Controls',
    desc: 'Customize financial thresholds, theme preferences, and replay this tour anytime from Help & Support.',
    icon: SettingsIcon,
  },
];

const STORAGE_KEYS = {
  ACTIVE: 'wallflower_tour_active',
  STEP: 'wallflower_tour_current_step',
  COMPLETED: 'wallflower_tour_completed',
  SKIPPED: 'wallflower_tour_skipped',
};

export function ProductTour() {
  const router = useRouter();
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();

  const [active, setActive] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEYS.ACTIVE) === 'true';
  });

  const [currentStepIdx, setCurrentStepIdx] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    const savedStep = localStorage.getItem(STORAGE_KEYS.STEP);
    return savedStep !== null ? Number(savedStep) : 0;
  });

  const [showSkipToast, setShowSkipToast] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  // Initialize tour state from localStorage or auto-start on first dashboard visit
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const tourActive = localStorage.getItem(STORAGE_KEYS.ACTIVE) === 'true';
    const isCompleted = localStorage.getItem(STORAGE_KEYS.COMPLETED) === 'true';
    const isSkipped = localStorage.getItem(STORAGE_KEYS.SKIPPED) === 'true';

    if (!tourActive && !isCompleted && !isSkipped && pathname.endsWith('/dashboard')) {
      // Auto start on first dashboard visit after onboarding
      const timer = setTimeout(() => {
        setActive(true);
        setCurrentStepIdx(0);
        localStorage.setItem(STORAGE_KEYS.ACTIVE, 'true');
        localStorage.setItem(STORAGE_KEYS.STEP, '0');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Listen for custom replay event
  useEffect(() => {
    const handleReplay = () => {
      localStorage.setItem(STORAGE_KEYS.ACTIVE, 'true');
      localStorage.setItem(STORAGE_KEYS.STEP, '0');
      localStorage.removeItem(STORAGE_KEYS.SKIPPED);
      localStorage.removeItem(STORAGE_KEYS.COMPLETED);
      setActive(true);
      setCurrentStepIdx(0);
      router.push('/dashboard');
    };

    window.addEventListener('wallflower_start_tour', handleReplay);
    return () => window.removeEventListener('wallflower_start_tour', handleReplay);
  }, [router]);

  const currentStepConfig = TOUR_STEPS[currentStepIdx] || TOUR_STEPS[0];

  // Element spotlight & scroll effect when step or route changes
  useEffect(() => {
    if (!active) return;

    let checkCount = 0;
    const interval = setInterval(() => {
      checkCount++;
      const el = document.querySelector(currentStepConfig.selector);
      if (el) {
        clearInterval(interval);
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);
        el.scrollIntoView({
          behavior: prefersReduced ? 'auto' : 'smooth',
          block: 'center',
        });
      } else if (checkCount > 15) {
        clearInterval(interval);
        setTargetRect(null);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [active, currentStepIdx, currentStepConfig, pathname, prefersReduced]);

  const goToStep = useCallback(
    (stepIdx: number) => {
      if (stepIdx < 0 || stepIdx >= TOUR_STEPS.length) return;
      setCurrentStepIdx(stepIdx);
      localStorage.setItem(STORAGE_KEYS.STEP, String(stepIdx));
      const targetStep = TOUR_STEPS[stepIdx];

      if (!pathname.endsWith(targetStep.route)) {
        router.push(targetStep.route);
      }
    },
    [pathname, router]
  );

  const handleSkip = useCallback(() => {
    setActive(false);
    setTargetRect(null);
    localStorage.setItem(STORAGE_KEYS.ACTIVE, 'false');
    localStorage.setItem(STORAGE_KEYS.SKIPPED, 'true');
    setShowSkipToast(true);
    setTimeout(() => setShowSkipToast(false), 4500);
  }, []);

  const handleFinish = useCallback(() => {
    setActive(false);
    setTargetRect(null);
    localStorage.setItem(STORAGE_KEYS.ACTIVE, 'false');
    localStorage.setItem(STORAGE_KEYS.COMPLETED, 'true');
  }, []);

  const handleNext = useCallback(() => {
    if (currentStepIdx < TOUR_STEPS.length - 1) {
      goToStep(currentStepIdx + 1);
    } else {
      handleFinish();
    }
  }, [currentStepIdx, goToStep, handleFinish]);

  const handleBack = useCallback(() => {
    if (currentStepIdx > 0) {
      goToStep(currentStepIdx - 1);
    }
  }, [currentStepIdx, goToStep]);

  // Keyboard controls
  useEffect(() => {
    if (!active) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handleBack();
      if (e.key === 'Escape') handleSkip();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [active, handleNext, handleBack, handleSkip]);

  const StepIcon = currentStepConfig.icon;
  const isLastStep = currentStepIdx === TOUR_STEPS.length - 1;

  return (
    <>
      {/* Skip Notification Toast */}
      {showSkipToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg border border-brand/40 bg-surface p-4 shadow-xl flex items-center gap-3 animate-in fade-in-50 slide-in-from-bottom-5">
          <Sparkles className="size-5 text-brand shrink-0" />
          <p className="text-xs sm:text-sm font-medium text-text-primary">
            Tour skipped. You can replay it anytime from <strong>Help & Support</strong>.
          </p>
        </div>
      )}

      {/* Active Guided Tour Spotlight & Overlay */}
      {active && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {/* Spotlight Highlight Ring around target element */}
          {targetRect && (
            <div
              className="absolute border-2 border-brand rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] transition-all duration-300 motion-reduce:transition-none pointer-events-none"
              style={{
                top: `${Math.max(10, targetRect.top - 6)}px`,
                left: `${Math.max(10, targetRect.left - 6)}px`,
                width: `${targetRect.width + 12}px`,
                height: `${targetRect.height + 12}px`,
              }}
            />
          )}

          {/* Fallback backdrop if element not found */}
          {!targetRect && (
            <div className="absolute inset-0 bg-black/50 pointer-events-auto" />
          )}

          {/* Tour Explanation Card (Desktop Floating / Mobile Bottom Sheet) */}
          <div
            className={cn(
              'pointer-events-auto fixed z-50 w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-2xl',
              'bottom-4 left-4 sm:left-auto sm:right-6 sm:bottom-6',
              !prefersReduced && 'animate-in fade-in-50 zoom-in-95 duration-150'
            )}
          >
            {/* Step Header */}
            <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-brand text-white shrink-0 font-bold">
                  <StepIcon className="size-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-brand uppercase tracking-wider">
                    Step {currentStepIdx + 1} of {TOUR_STEPS.length}
                  </span>
                  <h3 className="text-base font-semibold text-text-primary">
                    {currentStepConfig.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSkip}
                className="rounded-lg p-1 text-text-muted hover:bg-surface-subtle hover:text-text-primary transition-colors cursor-pointer"
                aria-label="Exit tour"
                title="Exit tour (Escape)"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Step Explanation */}
            <div className="py-4">
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                {currentStepConfig.desc}
              </p>
            </div>

            {/* Actions & Controls */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={handleSkip}
                className="text-xs font-semibold text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                Skip tour
              </button>

              <div className="flex items-center gap-2">
                {currentStepIdx > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="size-3.5" />
                    <span>Back</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 rounded-md bg-brand px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-hover transition-colors cursor-pointer"
                >
                  <span>{isLastStep ? 'Finish' : 'Next'}</span>
                  {isLastStep ? (
                    <Check className="size-3.5" />
                  ) : (
                    <ArrowRight className="size-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Global Helper function to trigger replay from Help & Support or Settings */
export function replayProductTour() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('wallflower_start_tour'));
  }
}
