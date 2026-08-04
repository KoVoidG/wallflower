'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FadeIn } from '@/components/motion';

interface ProcessingStateProps {
  onComplete: () => void;
}

const STAGES = [
  'Business Profile & Operations Context Analysis',
  'Financial Baseline & Expense Margin Audit',
  'Inventory Turnover & Shortage Sensitivity Check',
  'Deterministic Cash Runway & Risk Calibration',
  'Generating AI Executive Summary & Priorities',
];

export function ProcessingState({ onComplete }: ProcessingStateProps) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [progressPct, setProgressPct] = useState(15);

  useEffect(() => {
    // Stage transition timer
    const stageTimer = setInterval(() => {
      setCurrentStageIdx((prev) => {
        if (prev < STAGES.length - 1) {
          return prev + 1;
        }
        clearInterval(stageTimer);
        return prev;
      });
    }, 900);

    // Progress bar animation timer
    const progressTimer = setInterval(() => {
      setProgressPct((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return Math.min(100, prev + 18);
      });
    }, 700);

    return () => {
      clearInterval(stageTimer);
      clearInterval(progressTimer);
    };
  }, []);

  useEffect(() => {
    if (progressPct >= 100 && currentStageIdx === STAGES.length - 1) {
      const finishTimer = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(finishTimer);
    }
  }, [progressPct, currentStageIdx, onComplete]);

  return (
    <FadeIn>
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center max-w-lg mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
        {/* Animated Icon Header */}
        <div className="relative flex size-16 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-md">
          <Loader2 className="size-8 animate-spin" />
          <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-600 text-white shadow-xs">
            <Sparkles className="size-3" />
          </div>
        </div>

        {/* Headline & Subtitle */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
            <ShieldCheck className="size-3.5" />
            <span>Data Quality Check & Model Generation</span>
          </div>

          <h2 className="font-display text-2xl font-bold text-text-primary tracking-tight">
            Building Your Business Model...
          </h2>
          <p className="text-xs text-text-secondary font-medium max-w-sm mx-auto">
            Wallflower is analyzing your financial records and calibrating your baseline.
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full space-y-1.5">
          <div className="flex justify-between items-center text-xs font-bold px-1">
            <span className="text-text-muted uppercase tracking-wider text-[10px]">
              Processing Data
            </span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">{progressPct}%</span>
          </div>
          <div className="w-full h-2.5 bg-surface border border-border rounded-full overflow-hidden p-0.5 shadow-2xs">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Stages Checklist */}
        <div className="w-full space-y-2.5 text-left rounded-2xl border border-border bg-surface/60 p-4 text-xs shadow-2xs">
          {STAGES.map((stage, idx) => {
            const isDone = idx < currentStageIdx || (idx === currentStageIdx && progressPct === 100);
            const isCurrent = idx === currentStageIdx && progressPct < 100;

            return (
              <div
                key={stage}
                className={cn(
                  'flex items-center gap-3 p-2 rounded-xl transition-all duration-200',
                  isDone
                    ? 'text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-500/5'
                    : isCurrent
                    ? 'text-emerald-600 font-bold bg-surface border border-emerald-500/20 shadow-2xs'
                    : 'text-text-muted opacity-50'
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600 stroke-[2.5]" />
                ) : isCurrent ? (
                  <Loader2 className="size-4 shrink-0 animate-spin text-emerald-600" />
                ) : (
                  <div className="size-4 rounded-full border border-border shrink-0" />
                )}
                <span className="truncate">{stage}</span>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Note */}
        <p className="text-[11px] text-text-muted font-medium">
          🔒 Strict deterministic verification — zero hallucinated financial values.
        </p>
      </div>
    </FadeIn>
  );
}
