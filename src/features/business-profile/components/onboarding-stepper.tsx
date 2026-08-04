'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StepItem {
  id: number;
  label: string;
}

export const ONBOARDING_STEPS: StepItem[] = [
  { id: 3, label: 'Profile' },
  { id: 4, label: 'Operations' },
  { id: 5, label: 'Financials' },
  { id: 6, label: 'Inventory' },
  { id: 7, label: 'Assumptions' },
  { id: 8, label: 'Review' },
];

interface OnboardingStepperProps {
  currentStep: number;
  onStepClick?: (stepId: number) => void;
  maxStepReached: number;
}

export function OnboardingStepper({
  currentStep,
  onStepClick,
  maxStepReached,
}: OnboardingStepperProps) {
  // Only display stepper if current step is within steps 3..8
  if (currentStep < 3 || currentStep > 8) return null;

  const progressPct = Math.max(
    0,
    Math.min(100, ((currentStep - 3) / (ONBOARDING_STEPS.length - 1)) * 100)
  );

  return (
    <div className="w-full py-4 border-b border-border/60 bg-surface/40 mb-6">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between relative">
          {/* Connecting line track bounded exactly between node 1 and node 6 */}
          <div className="absolute top-[14px] left-4 right-4 -translate-y-1/2 h-[2px] bg-border z-0 overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {ONBOARDING_STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            const isClickable = step.id <= maxStepReached && onStepClick;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center relative z-10 group"
              >
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable}
                  className={cn(
                    'size-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 cursor-pointer',
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : isActive
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/20 shadow-2xs scale-105'
                      : 'bg-surface border-2 border-border text-text-muted hover:border-text-muted'
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-4 stroke-[3]" />
                  ) : (
                    <span>{step.id - 2}</span>
                  )}
                </button>
                <span
                  className={cn(
                    'text-[11px] font-semibold mt-1.5 transition-colors hidden sm:block',
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                      : isCompleted
                      ? 'text-text-primary font-medium'
                      : 'text-text-muted'
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
