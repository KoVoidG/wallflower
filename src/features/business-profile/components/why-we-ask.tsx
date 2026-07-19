'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Expand } from '@/components/motion';
import { BodySmall } from '@/components/ui/typography';

interface WhyWeAskProps {
  /** The section/field this guidance relates to */
  section: string;
  /** Contextual explanation for why data is needed */
  children: React.ReactNode;
  className?: string;
}

/**
 * Collapsible info panel explaining why certain data is collected.
 * Uses the Expand motion primitive for smooth reveal.
 * Placed near sensitive fields (financial data) to build trust.
 */
export function WhyWeAsk({ section, children, className }: WhyWeAskProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn('space-y-1.5', className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={`why-we-ask-${section}`}
        className={cn(
          'inline-flex items-center gap-1.5 text-[12px] font-[500]',
          'text-info hover:text-info/80 transition-colors cursor-pointer'
        )}
      >
        <Info className="size-3.5" aria-hidden="true" />
        <span>Why do we ask this?</span>
      </button>

      <Expand open={isOpen}>
        <div
          id={`why-we-ask-${section}`}
          className={cn(
            'rounded-[var(--radius-md)] p-3 mt-1',
            'bg-info-soft/40 border border-info/20'
          )}
          role="note"
        >
          <BodySmall className="text-text-secondary">{children}</BodySmall>
        </div>
      </Expand>
    </div>
  );
}
