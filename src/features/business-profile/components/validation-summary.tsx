'use client';

import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Surface } from '@/components/ui/surface';
import { Label, BodySmall } from '@/components/ui/typography';

interface ValidationError {
  step: number;
  stepLabel: string;
  field: string;
  message: string;
}

interface ValidationSummaryProps {
  errors: ValidationError[];
  onNavigateToStep: (step: number) => void;
  className?: string;
}

/**
 * Displays a summary of all validation errors across all onboarding steps.
 * Clickable items navigate to the relevant step.
 */
export function ValidationSummary({ errors, onNavigateToStep, className }: ValidationSummaryProps) {
  if (errors.length === 0) return null;

  // Group errors by step
  const grouped = errors.reduce<Record<number, ValidationError[]>>((acc, error) => {
    if (!acc[error.step]) acc[error.step] = [];
    acc[error.step].push(error);
    return acc;
  }, {});

  return (
    <Surface
      variant="default"
      border
      className={cn('border-danger/40 bg-danger-soft/30', className)}
      role="alert"
      aria-label="Validation errors summary"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="size-5 text-danger shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1 space-y-3">
          <Label as="span" className="text-danger">
            Please fix the following errors
          </Label>

          {Object.entries(grouped).map(([stepNum, stepErrors]) => (
            <div key={stepNum} className="space-y-1">
              <BodySmall className="font-[550] text-text-primary">
                Step {stepNum}: {stepErrors[0].stepLabel}
              </BodySmall>
              <ul className="space-y-0.5">
                {stepErrors.map((error, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => onNavigateToStep(error.step)}
                      className={cn(
                        'text-[13px] text-danger hover:text-danger/80',
                        'underline underline-offset-2 transition-colors cursor-pointer',
                        'text-left'
                      )}
                    >
                      {error.field}: {error.message}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Surface>
  );
}
