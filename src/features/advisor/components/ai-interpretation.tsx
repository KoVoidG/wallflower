// src/features/advisor/components/ai-interpretation.tsx
'use client';

import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface AIInterpretationProps {
  body: string;
  disclaimer?: string;
  className?: string;
}

/**
 * AI-generated explanation with cyan left border.
 * Icon: Sparkles. Badge: "AI Insight" (ai variant). Disclaimer footer.
 */
export function AIInterpretation({ body, disclaimer, className }: AIInterpretationProps) {
  return (
    <div
      className={cn(
        'border-l-3 border-ai bg-surface rounded-[var(--radius-md)] p-4',
        className
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="size-4 text-ai" aria-hidden="true" />
        <Badge variant="ai">AI Insight</Badge>
      </div>
      <p className="text-[15px]/[24px] text-text-secondary">{body}</p>
      {disclaimer && (
        <p className="mt-3 pt-3 border-t border-border text-[12px]/[18px] text-text-muted">
          {disclaimer}
        </p>
      )}
    </div>
  );
}
