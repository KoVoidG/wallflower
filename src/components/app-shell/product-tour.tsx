'use client';

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from 'react';
import { usePathname, useRouter } from '@/lib/i18n/navigation';
import {
  Sparkles,
  ArrowLeft,
  X,
  LayoutDashboard,
  Building2,
  GitPullRequest,
  FileText,
  UserCheck,
  Lightbulb,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/components/motion/use-reduced-motion';
import { H3, Label, BodySmall } from '@/components/ui/typography';

export interface SidebarTourStep {
  id: string;
  selector: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string; // Tailwind color class for per-step accent variety
}

const SIDEBAR_TOUR_STEPS: SidebarTourStep[] = [
  {
    id: 'dashboard',
    selector: '[data-tour="sidebar-dashboard"]',
    title: 'Overview — Executive Cockpit',
    desc: 'Review overall financial posture, cash runway countdown, health scores, and recommended actions at a glance.',
    icon: LayoutDashboard,
    accent: 'from-[#6366F1] to-[#8B5CF6]',
  },
  {
    id: 'business',
    selector: '[data-tour="sidebar-business"]',
    title: 'Business Diagnostics & Health',
    desc: 'Inspect financial strengths, operating capacity, inventory turnover, and diagnostic metric trends.',
    icon: Building2,
    accent: 'from-[#6366F1] to-[#A78BFA]',
  },
  {
    id: 'planner',
    selector: '[data-tour="sidebar-planner"]',
    title: 'Decision Planner & Simulations',
    desc: 'Model strategic decisions like hiring, price changes, or capex loans before committing business capital.',
    icon: GitPullRequest,
    accent: 'from-[#7C3AED] to-[#6366F1]',
  },
  {
    id: 'reports',
    selector: '[data-tour="sidebar-reports"]',
    title: 'Decision Intelligence Reports',
    desc: 'Generate, review, and export formal decision memos and executive reports to share with partners or lenders.',
    icon: FileText,
    accent: 'from-[#6366F1] to-[#818CF8]',
  },
  {
    id: 'account-menu',
    selector: '[data-tour="sidebar-account-menu"]',
    title: 'Account & Settings Control',
    desc: 'Manage your settings, view plan details, switch appearance themes, access support, or replay this tour anytime.',
    icon: UserCheck,
    accent: 'from-[#8B5CF6] to-[#6366F1]',
  },
];

const STORAGE_KEYS = {
  ACTIVE: 'wallflower_tour_active',
  STEP: 'wallflower_tour_current_step',
  COMPLETED: 'wallflower_tour_completed',
  SKIPPED: 'wallflower_tour_skipped',
};

// Size of the pointing arrow (triangle)
const ARROW_SIZE = 10;
const TOOLTIP_GAP = 16; // gap between target and tooltip
const CUTOUT_PADDING = 6;
const POPOVER_WIDTH = 340;
const POPOVER_EST_HEIGHT = 260;

export function ProductTour() {
  const pathname = usePathname();
  const router = useRouter();
  const prefersReduced = useReducedMotion();

  const [active, setActive] = useState<boolean>(false);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [showSkipToast, setShowSkipToast] = useState(false);
  const [animKey, setAnimKey] = useState(0); // forces re-mount for animation
  const [cardHeight, setCardHeight] = useState(POPOVER_EST_HEIGHT);
  const cardRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        // Measure actual rendered card height
        setCardHeight(node.getBoundingClientRect().height);
      }
    },
    [currentStepIdx],
  ); // re-measure when step changes

  // Initialize tour check on Dashboard mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const tourActive = localStorage.getItem(STORAGE_KEYS.ACTIVE) === 'true';
    const isCompleted = localStorage.getItem(STORAGE_KEYS.COMPLETED) === 'true';
    const isSkipped = localStorage.getItem(STORAGE_KEYS.SKIPPED) === 'true';

    if (
      (tourActive || (!isCompleted && !isSkipped)) &&
      pathname.endsWith('/dashboard')
    ) {
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
      setAnimKey((k) => k + 1);

      if (!pathname.endsWith('/dashboard')) {
        router.push('/dashboard');
      }
    };

    window.addEventListener('wallflower_start_tour', handleReplay);
    return () =>
      window.removeEventListener('wallflower_start_tour', handleReplay);
  }, [pathname, router]);

  const currentStep =
    SIDEBAR_TOUR_STEPS[currentStepIdx] || SIDEBAR_TOUR_STEPS[0];

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
      setAnimKey((k) => k + 1);
      localStorage.setItem(STORAGE_KEYS.STEP, String(next));
    } else {
      setActive(false);
      localStorage.setItem(STORAGE_KEYS.ACTIVE, 'false');
      localStorage.setItem(STORAGE_KEYS.COMPLETED, 'true');
    }
  }, [currentStepIdx]);

  const handleBack = useCallback(() => {
    if (currentStepIdx > 0) {
      const prev = currentStepIdx - 1;
      setCurrentStepIdx(prev);
      setAnimKey((k) => k + 1);
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

  // Calculate tooltip positioning and arrow offset
  const layout = useMemo(() => {
    const windowH = typeof window !== 'undefined' ? window.innerHeight : 800;
    const h = cardHeight || POPOVER_EST_HEIGHT;

    let tooltipTop = 100;
    let tooltipLeft = 260;
    let arrowTop = 30;

    if (targetRect) {
      tooltipLeft = targetRect.right + TOOLTIP_GAP + ARROW_SIZE;

      // Center tooltip vertically on target, clamped to viewport
      const targetCenterY = targetRect.top + targetRect.height / 2;
      const idealTop = targetCenterY - h / 2;

      if (idealTop + h > windowH - 20) {
        tooltipTop = Math.max(16, windowH - h - 20);
      } else {
        tooltipTop = Math.max(16, idealTop);
      }

      // Arrow should point at target center, relative to tooltip top
      arrowTop = targetCenterY - tooltipTop;
      // Clamp arrow so it stays well within the card (30px from edges for rounded corners)
      arrowTop = Math.max(30, Math.min(arrowTop, h - 30));
    }

    return { tooltipTop, tooltipLeft, arrowTop };
  }, [targetRect, cardHeight]);

  if (!active) {
    if (showSkipToast) {
      return (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-[#6366F1]/30 bg-white dark:bg-[#111622] p-4 shadow-2xl flex items-center gap-3 animate-in fade-in-50 slide-in-from-bottom-5">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]">
            <Sparkles className="size-4 text-white" />
          </div>
          <BodySmall className="font-medium text-text-primary">
            Tour paused. Replay anytime from <strong>Help & Support</strong>.
          </BodySmall>
        </div>
      );
    }
    return null;
  }

  const StepIcon = currentStep.icon;
  const isLastStep = currentStepIdx === SIDEBAR_TOUR_STEPS.length - 1;

  const clipPathStyle = targetRect
    ? `polygon(
        0% 0%,
        0% 100%,
        ${targetRect.left - CUTOUT_PADDING}px 100%,
        ${targetRect.left - CUTOUT_PADDING}px ${targetRect.top - CUTOUT_PADDING}px,
        ${targetRect.right + CUTOUT_PADDING}px ${targetRect.top - CUTOUT_PADDING}px,
        ${targetRect.right + CUTOUT_PADDING}px ${targetRect.bottom + CUTOUT_PADDING}px,
        ${targetRect.left - CUTOUT_PADDING}px ${targetRect.bottom + CUTOUT_PADDING}px,
        ${targetRect.left - CUTOUT_PADDING}px 100%,
        100% 100%,
        100% 0%
      )`
    : undefined;

  return (
    <>
      {/* Backdrop Overlay with cutout */}
      <div
        className="fixed inset-0 z-40 bg-black/55 backdrop-blur-lg transition-all duration-300 pointer-events-auto"
        onClick={handleSkip}
        style={{
          clipPath: clipPathStyle,
          WebkitClipPath: clipPathStyle,
        }}
      />

      {/* Highlight Ring around active sidebar item — z-[51] to sit above sidebar (z-50) */}
      {targetRect && (
        <div
          className="fixed z-[51] rounded-xl pointer-events-none transition-all duration-300"
          style={{
            top: `${targetRect.top - CUTOUT_PADDING}px`,
            left: `${targetRect.left - CUTOUT_PADDING}px`,
            width: `${targetRect.width + CUTOUT_PADDING * 2}px`,
            height: `${targetRect.height + CUTOUT_PADDING * 2}px`,
            boxShadow:
              '0 0 0 2px var(--tertiary), 0 0 0 5px rgba(99,102,241,0.20)',
          }}
        />
      )}

      {/* Tooltip Popover with Pointing Arrow */}
      <div
        key={animKey}
        className={cn(
          'pointer-events-auto fixed z-50 overflow-visible',
          !prefersReduced &&
            'animate-in fade-in-0 slide-in-from-left-3 zoom-in-95 duration-200',
        )}
        style={{
          top: `${layout.tooltipTop}px`,
          left: `${layout.tooltipLeft}px`,
          width: `${POPOVER_WIDTH}px`,
        }}
      >
        {/* ─── Left-Pointing Arrow (emerges from the box) ─── */}
        {/* Outer border arrow (behind) */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: `${layout.arrowTop - ARROW_SIZE - 1}px`,
            left: `-${ARROW_SIZE + 1}px`,
            width: 0,
            height: 0,
            borderTop: `${ARROW_SIZE + 1}px solid transparent`,
            borderBottom: `${ARROW_SIZE + 1}px solid transparent`,
            borderRight: `${ARROW_SIZE + 1}px solid rgba(99,102,241,0.3)`,
            zIndex: 1,
          }}
        />
        {/* Inner fill arrow (covers the border where it meets the card) */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: `${layout.arrowTop - ARROW_SIZE - 1}px`,
            left: `-${ARROW_SIZE - 2}px`,
            width: 0,
            height: 0,
            borderTop: `${ARROW_SIZE + 1}px solid transparent`,
            borderBottom: `${ARROW_SIZE + 1}px solid transparent`,
            borderRight: `${ARROW_SIZE + 1}px solid var(--surface)`,
            zIndex: 2,
            filter: 'drop-shadow(-3px 0 3px rgba(99,102,241,0.12))',
          }}
        />

        {/* ─── Card Body ─── */}
        <div
          ref={cardRef}
          className="relative rounded-2xl border border-[#6366F1]/30 dark:border-[#6366F1]/25 bg-white dark:bg-[#111622] shadow-2xl dark:shadow-black/60 overflow-hidden"
        >
          {/* Gradient Header Bar */}
          <div
            className={cn(
              'bg-gradient-to-r px-4 py-3 flex items-center justify-between',
              currentStep.accent,
            )}
          >
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm border border-white/20">
                <StepIcon className="size-4 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest block leading-none">
                  Step {currentStepIdx + 1} of {SIDEBAR_TOUR_STEPS.length}
                </span>
                <H3 className="text-[13px] font-bold text-white leading-snug mt-0.5">
                  {currentStep.title}
                </H3>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSkip}
              className="rounded-lg p-1 text-white/60 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
              title="Close tour (Esc)"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Content Area */}
          <div className="px-4 py-3.5">
            <BodySmall className="text-[12.5px] text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              {currentStep.desc}
            </BodySmall>
          </div>

          {/* Step Dots + Progress Bar */}
          <div className="px-4 pb-2">
            <div className="flex items-center gap-1.5 mb-2">
              {SIDEBAR_TOUR_STEPS.map((step, i) => (
                <div
                  key={step.id}
                  className={cn(
                    'h-1 rounded-full transition-all duration-300',
                    i === currentStepIdx
                      ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] flex-[2]'
                      : i < currentStepIdx
                        ? 'bg-[#6366F1]/40 flex-1'
                        : 'bg-slate-200 dark:bg-[#1E2638] flex-1',
                  )}
                />
              ))}
            </div>
          </div>

          {/* Controls Footer */}
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-slate-100 dark:border-[#1E2638] bg-slate-50/50 dark:bg-[#0B0F17]/50">
            <button
              type="button"
              onClick={handleSkip}
              className="text-[11px] font-semibold text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white transition-colors cursor-pointer"
            >
              Skip tour
            </button>

            <div className="flex items-center gap-2">
              {currentStepIdx > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#111622] px-2.5 py-1.5 text-[11px] font-semibold text-[#0F172A] dark:text-white hover:bg-slate-50 dark:hover:bg-[#1A2232] cursor-pointer transition-colors"
                >
                  <ArrowLeft className="size-3" />
                  <span>Back</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[11px] font-bold text-white cursor-pointer shadow-md transition-all hover:shadow-lg active:scale-[0.98]',
                  'bg-gradient-to-r',
                  currentStep.accent,
                )}
              >
                <span>{isLastStep ? 'Start Exploring' : 'Next'}</span>
                {!isLastStep ? (
                  <ChevronRight className="size-3.5" />
                ) : (
                  <Sparkles className="size-3.5" />
                )}
              </button>
            </div>
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

export function PageContextualHint({
  hintKey,
  title,
  message,
  className,
}: PageContextualHintProps) {
  const storageKey = `wallflower_hint_dismissed_${hintKey}`;

  const isDismissedInStorage = useSyncExternalStore(
    (callback: () => void) => {
      window.addEventListener('storage', callback);
      return () => window.removeEventListener('storage', callback);
    },
    () =>
      typeof window !== 'undefined'
        ? localStorage.getItem(storageKey) === 'true'
        : true,
    () => true,
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
        className,
      )}
    >
      <div className="flex items-start gap-2.5">
        <Lightbulb className="size-4 text-brand shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <Label className="font-semibold text-text-primary block">
            {title}
          </Label>
          <BodySmall className="text-text-secondary leading-relaxed">
            {message}
          </BodySmall>
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
