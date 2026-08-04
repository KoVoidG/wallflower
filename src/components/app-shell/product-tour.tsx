'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { usePathname, useRouter } from '@/lib/i18n/navigation';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  LayoutDashboard,
  Building2,
  GitPullRequest,
  FileText,
  UserCheck,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/components/motion/use-reduced-motion';
import { H3, Label, Caption, BodySmall } from '@/components/ui/typography';

export interface SidebarTourStep {
  id: string;
  selector: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SIDEBAR_TOUR_STEPS: SidebarTourStep[] = [
  {
    id: 'dashboard',
    selector: '[data-tour="sidebar-dashboard"]',
    title: 'Overview — Executive Cockpit',
    desc: 'Review overall financial posture, cash runway countdown, health scores, and recommended actions at a glance.',
    icon: LayoutDashboard,
  },
  {
    id: 'business',
    selector: '[data-tour="sidebar-business"]',
    title: 'Business Diagnostics & Health',
    desc: 'Inspect financial strengths, operating capacity, inventory turnover, and diagnostic metric trends.',
    icon: Building2,
  },
  {
    id: 'planner',
    selector: '[data-tour="sidebar-planner"]',
    title: 'Decision Planner & Simulations',
    desc: 'Model strategic decisions like hiring, price changes, or capex loans before committing business capital.',
    icon: GitPullRequest,
  },
  {
    id: 'reports',
    selector: '[data-tour="sidebar-reports"]',
    title: 'Decision Intelligence Reports',
    desc: 'Generate, review, and export formal decision memos and executive reports to share with partners or lenders.',
    icon: FileText,
  },
  {
    id: 'account-menu',
    selector: '[data-tour="sidebar-account-menu"]',
    title: 'Account & Settings Control',
    desc: 'Manage your settings, view plan details, switch appearance themes, access support, or replay this tour anytime.',
    icon: UserCheck,
  },
];

const STORAGE_KEYS = {
  ACTIVE: 'wallflower_tour_active',
  STEP: 'wallflower_tour_current_step',
  COMPLETED: 'wallflower_tour_completed',
  SKIPPED: 'wallflower_tour_skipped',
};

export function ProductTour() {
  const pathname = usePathname();
  const router = useRouter();
  const prefersReduced = useReducedMotion();

  const [active, setActive] = useState<boolean>(false);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [showSkipToast, setShowSkipToast] = useState(false);

  // Initialize tour check on Dashboard mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const tourActive = localStorage.getItem(STORAGE_KEYS.ACTIVE) === 'true';
    const isCompleted = localStorage.getItem(STORAGE_KEYS.COMPLETED) === 'true';
    const isSkipped = localStorage.getItem(STORAGE_KEYS.SKIPPED) === 'true';

    // Auto-trigger sidebar tour when user enters dashboard for the first time
    if ((tourActive || (!isCompleted && !isSkipped)) && pathname.endsWith('/dashboard')) {
      const timer = setTimeout(() => {
        setActive(true);
        setCurrentStepIdx(0);
        localStorage.setItem(STORAGE_KEYS.ACTIVE, 'true');
      }, 300);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setActive(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Global custom event listener for replay tour
  useEffect(() => {
    const handleReplay = () => {
      localStorage.setItem(STORAGE_KEYS.ACTIVE, 'true');
      localStorage.setItem(STORAGE_KEYS.STEP, '0');
      localStorage.removeItem(STORAGE_KEYS.SKIPPED);
      localStorage.removeItem(STORAGE_KEYS.COMPLETED);
      setActive(true);
      setCurrentStepIdx(0);

      if (!pathname.endsWith('/dashboard')) {
        router.push('/dashboard');
      }
    };

    window.addEventListener('wallflower_start_tour', handleReplay);
    return () => window.removeEventListener('wallflower_start_tour', handleReplay);
  }, [pathname, router]);

  const currentStep = SIDEBAR_TOUR_STEPS[currentStepIdx] || SIDEBAR_TOUR_STEPS[0];

  // Measure target sidebar item bounding rect
  useEffect(() => {
    if (!active) return;

    let checkCount = 0;
    const interval = setInterval(() => {
      checkCount++;
      const el = document.querySelector(currentStep.selector);
      if (el) {
        clearInterval(interval);
        setTargetRect(el.getBoundingClientRect());
      } else if (checkCount > 10) {
        clearInterval(interval);
        setTargetRect(null);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [active, currentStepIdx, currentStep]);

  const handleNext = useCallback(() => {
    if (currentStepIdx < SIDEBAR_TOUR_STEPS.length - 1) {
      const next = currentStepIdx + 1;
      setCurrentStepIdx(next);
      localStorage.setItem(STORAGE_KEYS.STEP, String(next));
    } else {
      // Finish
      setActive(false);
      localStorage.setItem(STORAGE_KEYS.ACTIVE, 'false');
      localStorage.setItem(STORAGE_KEYS.COMPLETED, 'true');
    }
  }, [currentStepIdx]);

  const handleBack = useCallback(() => {
    if (currentStepIdx > 0) {
      const prev = currentStepIdx - 1;
      setCurrentStepIdx(prev);
      localStorage.setItem(STORAGE_KEYS.STEP, String(prev));
    }
  }, [currentStepIdx]);

  const handleSkip = useCallback(() => {
    setActive(false);
    localStorage.setItem(STORAGE_KEYS.ACTIVE, 'false');
    localStorage.setItem(STORAGE_KEYS.SKIPPED, 'true');
    setShowSkipToast(true);
    setTimeout(() => setShowSkipToast(false), 4000);
  }, []);

  // Keyboard navigation
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

  if (!active) {
    if (showSkipToast) {
      return (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg border border-brand/40 bg-surface p-4 shadow-xl flex items-center gap-3 animate-in fade-in-50 slide-in-from-bottom-5">
          <Sparkles className="size-5 text-brand shrink-0" />
          <BodySmall className="font-medium text-text-primary">
            Sidebar tour completed. Replay anytime from <strong>Help & Support</strong> or the account menu.
          </BodySmall>
        </div>
      );
    }
    return null;
  }

  const StepIcon = currentStep.icon;
  const isLastStep = currentStepIdx === SIDEBAR_TOUR_STEPS.length - 1;

  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const popoverHeight = 220;

  let tooltipTop = 100;
  let tooltipLeft = 260;

  if (targetRect) {
    tooltipLeft = targetRect.right + 12;

    if (targetRect.top + popoverHeight > windowHeight - 20) {
      tooltipTop = Math.max(16, targetRect.bottom - popoverHeight);
    } else {
      tooltipTop = Math.max(16, targetRect.top - 8);
    }
  }

  const cutoutPadding = 6;
  const clipPathStyle = targetRect
    ? `polygon(
        0% 0%,
        0% 100%,
        ${targetRect.left - cutoutPadding}px 100%,
        ${targetRect.left - cutoutPadding}px ${targetRect.top - cutoutPadding}px,
        ${targetRect.right + cutoutPadding}px ${targetRect.top - cutoutPadding}px,
        ${targetRect.right + cutoutPadding}px ${targetRect.bottom + cutoutPadding}px,
        ${targetRect.left - cutoutPadding}px ${targetRect.bottom + cutoutPadding}px,
        ${targetRect.left - cutoutPadding}px 100%,
        100% 100%,
        100% 0%
      )`
    : undefined;

  return (
    <>
      {/* Blurred & Darkened Backdrop Overlay with cutout hole for highlighted element */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md transition-all duration-200 pointer-events-auto"
        onClick={handleSkip}
        style={{
          clipPath: clipPathStyle,
          WebkitClipPath: clipPathStyle,
        }}
      />

      {/* Focus Highlight Border Ring around active sidebar item */}
      {targetRect && (
        <div
          className="fixed z-40 border-2 border-tertiary rounded-xl shadow-[0_0_0_4px_rgba(16,185,129,0.25)] transition-all duration-200 pointer-events-none"
          style={{
            top: `${targetRect.top - cutoutPadding}px`,
            left: `${targetRect.left - cutoutPadding}px`,
            width: `${targetRect.width + cutoutPadding * 2}px`,
            height: `${targetRect.height + cutoutPadding * 2}px`,
          }}
        />
      )}

      {/* Compact Tooltip Popover (Unblurred, sitting above backdrop) */}
      <div
        className={cn(
          'pointer-events-auto fixed z-50 w-80 max-h-[calc(100vh-32px)] overflow-y-auto rounded-2xl border-2 border-tertiary/40 bg-surface p-4.5 shadow-2xl dark:shadow-black/70',
          !prefersReduced && 'animate-in fade-in-50 zoom-in-95 duration-150'
        )}
        style={{
          top: `${tooltipTop}px`,
          left: `${tooltipLeft}px`,
        }}
      >
        {/* Step Header */}
        <div className="flex items-start justify-between gap-2 border-b border-border/60 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-tertiary/15 text-tertiary border border-tertiary/30 shrink-0">
              <StepIcon className="size-4" />
            </div>
            <div>
              <Caption className="text-[10px] font-bold text-tertiary uppercase tracking-wider block">
                Product Tour ({currentStepIdx + 1} of {SIDEBAR_TOUR_STEPS.length})
              </Caption>
              <H3 className="text-xs font-bold text-text-primary leading-snug">
                {currentStep.title}
              </H3>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSkip}
            className="rounded-md p-1 text-text-muted hover:bg-surface-subtle hover:text-text-primary transition-colors cursor-pointer"
            title="Close tour (Escape)"
          >
            <X className="size-3.5" />
          </button>
        </div>

        {/* Description */}
        <BodySmall className="text-xs text-text-secondary leading-relaxed py-3">
          {currentStep.desc}
        </BodySmall>

        {/* Controls */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/60">
          <button
            type="button"
            onClick={handleSkip}
            className="text-[11px] font-semibold text-text-muted hover:text-text-primary cursor-pointer"
          >
            Skip
          </button>

          <div className="flex items-center gap-1.5">
            {currentStepIdx > 0 && !isLastStep && (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-text-primary hover:bg-surface-subtle cursor-pointer"
              >
                <ArrowLeft className="size-3" />
                <span>Back</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 rounded-lg bg-tertiary px-3.5 py-1.5 text-xs font-bold text-on-primary hover:bg-tertiary-hover cursor-pointer shadow-2xs"
            >
              <span>{isLastStep ? 'Start exploring Wallflower' : 'Next'}</span>
              {!isLastStep && <ArrowRight className="size-3" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/** Global Helper function to trigger replay from Help & Support, Settings, or Account Menu */
export function replayProductTour() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('wallflower_start_tour'));
  }
}

/** Component for lightweight first-visit contextual hints on individual pages */
interface PageContextualHintProps {
  hintKey: string;
  title: string;
  message: string;
  className?: string;
}

export function PageContextualHint({ hintKey, title, message, className }: PageContextualHintProps) {
  const storageKey = `wallflower_hint_dismissed_${hintKey}`;

  const isDismissedInStorage = useSyncExternalStore(
    (callback: () => void) => {
      window.addEventListener('storage', callback);
      return () => window.removeEventListener('storage', callback);
    },
    () => (typeof window !== 'undefined' ? localStorage.getItem(storageKey) === 'true' : true),
    () => true
  );

  const [dismissedLocally, setDismissedLocally] = useState<boolean>(false);

  if (isDismissedInStorage || dismissedLocally) return null;

  const handleGotIt = () => {
    setDismissedLocally(true);
  };

  const handleNeverShow = () => {
    setDismissedLocally(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, 'true');
    }
  };

  return (
    <div
      className={cn(
        'rounded-lg border border-brand/30 bg-brand-soft/20 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs',
        className
      )}
    >
      <div className="flex items-start gap-2.5">
        <Lightbulb className="size-4 text-brand shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <Label className="font-semibold text-text-primary block">{title}</Label>
          <BodySmall className="text-text-secondary leading-relaxed">{message}</BodySmall>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <button
          type="button"
          onClick={handleGotIt}
          className="rounded bg-brand px-3 py-1 text-xs font-medium text-white hover:bg-brand-hover transition-colors cursor-pointer"
        >
          Got it
        </button>
        <button
          type="button"
          onClick={handleNeverShow}
          className="text-text-muted hover:text-text-primary text-[11px] cursor-pointer"
        >
          Do not show again
        </button>
      </div>
    </div>
  );
}
