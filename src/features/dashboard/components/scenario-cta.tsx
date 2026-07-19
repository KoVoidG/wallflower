// src/features/dashboard/components/scenario-cta.tsx
import { FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/navigation';
import { H3, Body } from '@/components/ui/typography';

interface ScenarioCtaProps {
  className?: string;
}

export function ScenarioCta({ className }: ScenarioCtaProps) {
  return (
    <section
      className={cn(
        'rounded-[var(--radius-md)] bg-brand-soft p-5 flex flex-col gap-3',
        className
      )}
      aria-label="Run a scenario simulation"
    >
      <div className="flex items-center gap-2.5">
        <span className="shrink-0 text-brand" aria-hidden="true">
          <FlaskConical className="size-5" />
        </span>
        <H3 className="text-[18px]/[24px]">Test a business decision</H3>
      </div>

      <Body>
        See how a price change, new hire, or expansion would affect your cash flow and
        profitability before you commit.
      </Body>

      <Link
        href="/simulation"
        className={cn(
          'inline-flex items-center justify-center self-start',
          'rounded-[var(--radius-md)] px-4 py-2',
          'bg-brand text-white text-[14px]/[20px] font-[600]',
          'hover:bg-brand/90 transition-colors duration-150',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'
        )}
      >
        Run simulation
      </Link>
    </section>
  );
}
