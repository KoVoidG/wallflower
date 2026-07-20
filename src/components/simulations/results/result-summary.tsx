'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { H2, Caption } from '@/components/ui/typography';
import {
  CheckCircle2,
  AlertTriangle,
  Shield,
} from 'lucide-react';
import type {
  PostureType,
  ConfidenceLevel,
  SimulationResult,
  SimulationBaseline,
} from '@/features/simulations/adapters/simulations.adapter';

interface ResultSummaryProps {
  posture: PostureType;
  confidence: ConfidenceLevel;
  results: SimulationResult[];
  baseline?: SimulationBaseline;
  className?: string;
}

const postureConfig: Record<
  PostureType,
  {
    verdict: string;
    icon: React.ElementType;
    bgClass: string;
    borderClass: string;
    iconClass: string;
  }
> = {
  bullish: {
    verdict: 'Proceed',
    icon: CheckCircle2,
    bgClass: 'bg-success-soft/40',
    borderClass: 'border-success/20',
    iconClass: 'text-success',
  },
  cautious: {
    verdict: 'Proceed cautiously',
    icon: AlertTriangle,
    bgClass: 'bg-warning-soft/40',
    borderClass: 'border-warning/20',
    iconClass: 'text-warning',
  },
  neutral: {
    verdict: 'Evaluate further',
    icon: Shield,
    bgClass: 'bg-info-soft/30',
    borderClass: 'border-info/20',
    iconClass: 'text-info',
  },
};

const confidenceConfig: Record<ConfidenceLevel, { label: string; variant: 'success' | 'warning' | 'danger'; explanation: string }> = {
  high: { label: 'High confidence', variant: 'success', explanation: 'Based on complete baseline data and well-defined assumptions' },
  medium: { label: 'Medium confidence', variant: 'warning', explanation: 'Some assumptions are estimated. Actual outcomes may vary.' },
  low: { label: 'Low confidence', variant: 'danger', explanation: 'Limited data available. Results should be treated as directional only.' },
};

function formatThb(value: number): string {
  return `฿${Math.abs(value).toLocaleString('en-US')}`;
}

export function ResultSummary({
  posture,
  confidence,
  results,
  baseline,
  className,
}: ResultSummaryProps) {
  const expected = results.find((r) => r.caseType === 'expected');
  const best = results.find((r) => r.caseType === 'best');
  const worst = results.find((r) => r.caseType === 'worst');

  const config = postureConfig[posture];
  const confConfig = confidenceConfig[confidence];
  const Icon = config.icon;

  // Generate rationale from mock data
  const profitChange = expected ? expected.profit - (baseline?.profit ?? -12400) : 0;
  const rationale = generateRationale(posture, expected, worst, profitChange);

  return (
    <section
      className={cn(
        'rounded-[var(--radius-lg)] p-6 md:p-8 border',
        config.bgClass,
        config.borderClass,
        className
      )}
      aria-label="Decision verdict"
    >
      {/* Verdict header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={cn('shrink-0', config.iconClass)}>
              <Icon className="size-6" aria-hidden="true" />
            </span>
            <H2 className="text-[24px]/[32px] md:text-[28px]/[36px]">
              {config.verdict}
            </H2>
          </div>
          <Badge variant={confConfig.variant} dot>
            {confConfig.label}
          </Badge>
        </div>

        {/* Rationale */}
        <p className="text-[15px]/[26px] text-text-primary max-w-[720px]">
          {rationale}
        </p>

        {/* Key outcomes grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/40">
          <div className="flex flex-col gap-1">
            <Caption>Expected outcome</Caption>
            <span className={cn(
              'text-[22px]/[28px] font-[650] tabular-nums',
              expected && expected.profit >= 0 ? 'text-success' : 'text-danger'
            )}>
              {expected ? (expected.profit >= 0 ? '+' : '-') + formatThb(expected.profit) : '—'}
            </span>
            <Caption>monthly profit</Caption>
          </div>

          <div className="flex flex-col gap-1">
            <Caption>Largest upside</Caption>
            <span className="text-[22px]/[28px] font-[650] tabular-nums text-success">
              {best ? '+' + formatThb(best.profit) : '—'}
            </span>
            <Caption>best case profit</Caption>
          </div>

          <div className="flex flex-col gap-1">
            <Caption>Largest downside</Caption>
            <span className="text-[22px]/[28px] font-[650] tabular-nums text-danger">
              {worst ? '-' + formatThb(Math.abs(worst.profit)) : '—'}
            </span>
            <Caption>worst case profit</Caption>
          </div>
        </div>

        {/* Confidence explanation */}
        <div className="flex items-start gap-2 pt-3">
          <Shield className="size-3.5 mt-0.5 shrink-0 text-text-muted" aria-hidden="true" />
          <Caption as="p" className="text-text-secondary">{confConfig.explanation}</Caption>
        </div>
      </div>
    </section>
  );
}

function generateRationale(
  posture: PostureType,
  expected: SimulationResult | undefined,
  worst: SimulationResult | undefined,
  profitChange: number
): string {
  if (!expected) return 'Insufficient data to generate a recommendation.';

  const profitStr = formatThb(Math.abs(profitChange));
  const direction = profitChange >= 0 ? 'improves' : 'reduces';
  const runwayStr = `${expected.cashRunway.toFixed(1)} months`;

  switch (posture) {
    case 'bullish':
      return `This decision ${direction} expected monthly profit by ${profitStr} and maintains a cash runway of ${runwayStr}. The worst case still shows manageable risk relative to the potential gain.`;
    case 'cautious':
      return `This decision ${direction} expected monthly profit by ${profitStr}, but the worst case reduces cash runway to ${worst?.cashRunway.toFixed(1) ?? '?'} months. Consider testing a smaller scale or securing additional working capital.`;
    case 'neutral':
      return `This decision has a modest impact on expected monthly profit (${profitChange >= 0 ? '+' : '-'}${profitStr}). The outcome depends heavily on assumptions that carry significant uncertainty.`;
    default:
      return '';
  }
}
