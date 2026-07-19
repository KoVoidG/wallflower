'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
  label: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

/**
 * Premium step indicator for multi-step flows.
 * Clean horizontal layout with circles, connecting lines, and labels.
 */
export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <nav aria-label="Onboarding progress" className={cn('w-full', className)}>
      <ol className="flex items-start">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.label}
              className={cn('flex items-start', isLast ? 'flex-shrink-0' : 'flex-1')}
              aria-current={isCurrent ? 'step' : undefined}
            >
              {/* Step circle + connector row */}
              <div className="flex items-center w-full">
                {/* Circle */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      'relative flex items-center justify-center size-9 rounded-full text-[13px] font-[600] transition-all duration-200',
                      isCompleted && 'bg-brand text-white shadow-sm',
                      isCurrent && 'bg-brand text-white shadow-md shadow-brand/25',
                      !isCompleted && !isCurrent && 'bg-surface border-2 border-border text-text-muted'
                    )}
                    aria-hidden="true"
                  >
                    {isCompleted ? (
                      <Check className="size-4" strokeWidth={2.5} />
                    ) : (
                      stepNumber
                    )}
                  </div>

                  {/* Label below circle */}
                  <span
                    className={cn(
                      'text-[12px]/[16px] font-[500] whitespace-nowrap',
                      isCurrent && 'text-brand font-[600]',
                      isCompleted && 'text-text-secondary',
                      !isCompleted && !isCurrent && 'text-text-muted'
                    )}
                  >
                    <span className="sr-only">
                      {isCompleted ? 'Completed: ' : isCurrent ? 'Current: ' : 'Upcoming: '}
                    </span>
                    {step.label}
                  </span>
                </div>

                {/* Connector line */}
                {!isLast && (
                  <div className="flex-1 mx-3 mt-[18px] self-start">
                    <div
                      className={cn(
                        'h-[2px] w-full rounded-full transition-colors duration-300',
                        isCompleted ? 'bg-brand' : 'bg-border'
                      )}
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
