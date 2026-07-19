'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { Caption } from '@/components/ui/typography';

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
 * Progress step indicator showing current position in a multi-step flow.
 * Displays completed, current, and upcoming steps with accessible labels.
 */
export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <nav aria-label="Onboarding progress" className={cn('w-full', className)}>
      <ol className="flex items-center gap-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <li
              key={step.label}
              className="flex flex-1 items-center gap-2"
              aria-current={isCurrent ? 'step' : undefined}
            >
              <div className="flex flex-col items-center gap-1 flex-1">
                <div className="flex items-center w-full gap-2">
                  {/* Step circle */}
                  <div
                    className={cn(
                      'flex items-center justify-center size-8 rounded-full shrink-0 text-[13px] font-[600] transition-colors',
                      isCompleted && 'bg-brand text-white',
                      isCurrent && 'bg-brand text-white ring-2 ring-brand-soft ring-offset-2 ring-offset-surface',
                      !isCompleted && !isCurrent && 'bg-surface-subtle text-text-muted border border-border'
                    )}
                    aria-hidden="true"
                  >
                    {isCompleted ? (
                      <Check className="size-4" strokeWidth={2.5} />
                    ) : (
                      stepNumber
                    )}
                  </div>

                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'flex-1 h-0.5 rounded-full transition-colors',
                        isCompleted ? 'bg-brand' : 'bg-border'
                      )}
                      aria-hidden="true"
                    />
                  )}
                </div>

                {/* Label */}
                <Caption
                  className={cn(
                    'text-center w-full',
                    isCurrent && 'text-brand font-[550]',
                    isCompleted && 'text-text-secondary'
                  )}
                >
                  <span className="sr-only">
                    {isCompleted ? 'Completed: ' : isCurrent ? 'Current: ' : 'Upcoming: '}
                  </span>
                  {step.label}
                </Caption>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
