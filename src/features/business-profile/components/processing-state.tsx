'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FadeIn } from '@/components/motion';

interface ProcessingStateProps {
  onComplete: () => void;
}

const STAGES = [
  'Organizing business information',
  'Checking data completeness',
  'Preparing the initial business-health view',
  'Identifying possible risks',
  'Preparing the dashboard',
];

export function ProcessingState({ onComplete }: ProcessingStateProps) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  useEffect(() => {
    if (currentStageIdx < STAGES.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStageIdx((prev) => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [currentStageIdx, onComplete]);

  return (
    <FadeIn>
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-md mx-auto space-y-6">
        <div className="flex size-14 items-center justify-center rounded-full bg-brand-soft text-brand shadow-xs">
          <Loader2 className="size-7 animate-spin motion-reduce:animate-none" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-text-primary">
            Constructing Business Baseline
          </h2>
          <p className="text-xs text-text-secondary">
            Preparing your structured baseline and initial decision views.
          </p>
        </div>

        <div className="w-full space-y-2.5 text-left rounded-lg border border-border bg-surface p-4 text-xs">
          {STAGES.map((stage, idx) => {
            const isDone = idx < currentStageIdx;
            const isCurrent = idx === currentStageIdx;

            return (
              <div
                key={stage}
                className={cn(
                  'flex items-center gap-2.5 transition-colors',
                  isDone
                    ? 'text-success font-medium'
                    : isCurrent
                    ? 'text-brand font-semibold'
                    : 'text-text-muted opacity-50'
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="size-4 shrink-0 text-success" />
                ) : isCurrent ? (
                  <Loader2 className="size-4 shrink-0 animate-spin text-brand" />
                ) : (
                  <div className="size-4 rounded-full border border-border shrink-0" />
                )}
                <span>{stage}</span>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-text-muted italic">
          Prototype Note: Staged preview sequence preparing client baseline snapshot.
        </p>
      </div>
    </FadeIn>
  );
}
