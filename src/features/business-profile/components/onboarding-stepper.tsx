// src/features/business-profile/components/onboarding-stepper.tsx
'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';

export interface StepItem {
  id: number;
  label: string;
}

export const ONBOARDING_STEPS: StepItem[] = [
  { id: 2, label: 'Profile' },
  { id: 3, label: 'Operations' },
  { id: 4, label: 'Financials' },
  { id: 5, label: 'Inventory' },
  { id: 6, label: 'Assumptions' },
  { id: 7, label: 'Review' },
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
  // Only display stepper if current step is within steps 2..7 (after setup method)
  if (currentStep < 2 || currentStep > 7) return null;

  const progressPct = Math.max(
    0,
    Math.min(100, ((currentStep - 2) / (ONBOARDING_STEPS.length - 1)) * 100),
  );

  return (
    <div className="w-full py-3 mb-4 space-y-4">
      {/* Centered Wallflower Logo and Brand Wordmark Above Stepper */}
      <div className="flex items-center justify-center">
        <Logo size="md" showWordmark={true} />
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <div className="mt-10 flex items-center justify-between relative">
          {/* Connecting line track bounded between node 1 and node 6 */}
          <div className="absolute top-[14px] left-4 right-4 -translate-y-1/2 h-[2px] bg-slate-200 dark:bg-[#1E2638] z-0 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] transition-all duration-300 ease-out"
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
                      ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-2xs'
                      : isActive
                        ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white ring-4 ring-[#6366F1]/20 shadow-2xs scale-105'
                        : 'bg-white dark:bg-[#111622] border-2 border-slate-200 dark:border-[#1E2638] text-[#64748B] hover:border-slate-400',
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-4 stroke-[3]" />
                  ) : (
                    <span>{step.id - 1}</span>
                  )}
                </button>
                <span
                  className={cn(
                    'text-[11px] font-semibold mt-1.5 transition-colors hidden sm:block',
                    isActive
                      ? 'text-[#4F46E5] dark:text-[#A5B4FC] font-bold'
                      : isCompleted
                        ? 'text-[#0F172A] dark:text-white font-medium'
                        : 'text-[#64748B] dark:text-[#94A3B8]',
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
