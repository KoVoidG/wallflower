'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label, Caption, BodySmall, H3 } from '@/components/ui/typography';
import { useReducedMotion } from '@/components/motion/use-reduced-motion';
import { DURATIONS, EASINGS } from '@/components/motion/motion-config';

interface ContextPanelProps {
  currentStep: number;
  focusedFieldKey?: string;
  className?: string;
}

interface ContextGuidanceItem {
  title: string;
  tip: string;
  whyItMatters: string;
}

const FIELD_GUIDANCE: Record<string, ContextGuidanceItem> = {
  goals: {
    title: 'Goals & Primary Objectives',
    tip: 'Wallflower prioritizes risk warnings and scenarios matching your top selected goals.',
    whyItMatters: 'Filters irrelevant alerts and focuses dashboard recommendations.',
  },
  revenue: {
    title: 'Monthly Revenue',
    tip: 'Enter net sales revenue generated in your operating month.',
    whyItMatters: 'Used as the baseline denominator for fixed cost coverage and runway calculations.',
  },
  expenses: {
    title: 'Operating Expenses',
    tip: 'Total monthly cash outflow including payroll, rent, inventory, and utilities.',
    whyItMatters: 'High expense burn rate directly reduces your cash runway months.',
  },
  cash: {
    title: 'Available Cash Reserves',
    tip: 'Unencumbered cash in bank accounts immediately accessible for operations.',
    whyItMatters: 'Forms your primary safety shield during low revenue periods.',
  },
  receivables: {
    title: 'Outstanding Receivables',
    tip: 'Billed invoices awaiting customer payment.',
    whyItMatters: 'Delayed receivables can trigger acute liquidity squeezes.',
  },
  payables: {
    title: 'Upcoming Payables',
    tip: 'Supplier bills & invoices due within 30 days.',
    whyItMatters: 'Immediate cash demand that must be satisfied before discretionary spending.',
  },
  debt: {
    title: 'Total Debt & Repayments',
    tip: 'Outstanding loans and monthly debt obligations.',
    whyItMatters: 'Ensures debt service is prioritized in cash flow stress scenarios.',
  },
  preferences: {
    title: 'Risk Tolerance Preferences',
    tip: 'Set your target cash buffer months and forecast horizon.',
    whyItMatters: 'Configures warning sensitivity across all simulations.',
  },
};

export function ContextPanel({
  currentStep,
  focusedFieldKey,
  className,
}: ContextPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const prefersReduced = useReducedMotion();

  const guidance =
    (focusedFieldKey && FIELD_GUIDANCE[focusedFieldKey]) ||
    FIELD_GUIDANCE[getFallbackKey(currentStep)];

  function getFallbackKey(step: number): string {
    if (step === 1) return 'goals';
    if (step === 2) return 'revenue';
    if (step === 3) return 'receivables';
    return 'preferences';
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-surface p-4 shadow-2xs transition-all overflow-hidden',
        className
      )}
    >
      {/* Header with Collapsible Toggle */}
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
        <div className="flex items-center gap-2">
          <HelpCircle className="size-4 text-brand" />
          <Label className="text-xs font-bold text-text-primary uppercase tracking-wide">
            Contextual Guidance
          </Label>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-text-muted hover:text-text-primary cursor-pointer"
        >
          <span>{collapsed ? 'Show' : 'Hide'}</span>
          {collapsed ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
        </button>
      </div>

      {/* Smooth Motion Collapse / Expand Animation */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, height: 0 }}
            animate={prefersReduced ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={prefersReduced ? { opacity: 1 } : { opacity: 0, height: 0 }}
            transition={
              prefersReduced
                ? { duration: 0 }
                : { duration: DURATIONS.cardPanel, ease: EASINGS.default }
            }
            className="overflow-hidden space-y-3 pt-3"
          >
            <div>
              <H3 className="text-xs font-bold text-text-primary">{guidance.title}</H3>
              <BodySmall className="text-xs text-text-secondary leading-relaxed mt-1">{guidance.tip}</BodySmall>
            </div>

            <div className="rounded-md border border-brand/20 bg-brand-soft/20 p-2.5 space-y-0.5">
              <Caption className="text-[10px] font-bold text-brand uppercase tracking-wider block">
                Why it matters
              </Caption>
              <Caption className="text-[11px] text-text-secondary leading-normal block">
                {guidance.whyItMatters}
              </Caption>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
