// src/features/dashboard/components/scenario-cta.tsx
'use client';

import { FlaskConical, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/navigation';
import { H3, Body, Caption } from '@/components/ui/typography';

interface ScenarioCtaProps {
  /** Contextual simulation suggestion based on business state */
  suggestion?: string;
  /** Brief rationale for why this simulation is relevant */
  rationale?: string;
  className?: string;
}

export function ScenarioCta({
  suggestion = 'Test whether hiring a new employee is affordable',
  rationale = 'Based on your current runway and profit margin, workforce decisions have the highest impact on cash safety.',
  className,
}: ScenarioCtaProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-[var(--radius-lg)] p-6 md:p-8',
        'bg-brand-soft border border-brand/15',
        className
      )}
      aria-label="Run a scenario simulation"
    >
      {/* Background decoration */}
      <div
        className="absolute top-0 right-0 w-48 h-48 opacity-[0.04] pointer-events-none"
        aria-hidden="true"
      >
        <FlaskConical className="w-full h-full" />
      </div>

      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="flex flex-col gap-3 max-w-[560px]">
          <div className="flex items-center gap-2.5">
            <span className="shrink-0 text-brand" aria-hidden="true">
              <FlaskConical className="size-5" />
            </span>
            <H3 className="text-[18px]/[24px]">Simulate a decision</H3>
          </div>

          <Body className="text-text-primary text-[15px]/[24px]">
            {suggestion}
          </Body>

          <Caption as="p" className="text-text-secondary">
            {rationale}
          </Caption>
        </div>

        <Link
          href="/simulations"
          className={cn(
            'inline-flex items-center justify-center gap-2 self-start md:self-center shrink-0',
            'rounded-[var(--radius-md)] px-5 py-3',
            'bg-brand text-white text-[15px]/[20px] font-[600]',
            'hover:bg-brand-hover transition-colors duration-150 cursor-pointer',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'
          )}
        >
          Run simulation
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
