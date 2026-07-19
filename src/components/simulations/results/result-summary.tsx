'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Surface } from '@/components/ui/surface';
import { TrendingUp, TrendingDown, Shield } from 'lucide-react';
import type { PostureType, ConfidenceLevel, SimulationResult } from '@/features/simulations/adapters/simulations.adapter';

interface ResultSummaryProps {
  posture: PostureType;
  confidence: ConfidenceLevel;
  results: SimulationResult[];
  className?: string;
}

const postureConfig: Record<PostureType, { label: string; variant: 'success' | 'warning' | 'default'; icon: React.ReactNode }> = {
  bullish: { label: 'Bullish', variant: 'success', icon: <TrendingUp className="size-4" /> },
  cautious: { label: 'Cautious', variant: 'warning', icon: <TrendingDown className="size-4" /> },
  neutral: { label: 'Neutral', variant: 'default', icon: <Shield className="size-4" /> },
};

const confidenceConfig: Record<ConfidenceLevel, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  high: { label: 'High Confidence', variant: 'success' },
  medium: { label: 'Medium Confidence', variant: 'warning' },
  low: { label: 'Low Confidence', variant: 'danger' },
};

function formatThb(value: number): string {
  return `฿${Math.abs(value).toLocaleString('en-US')}`;
}

export function ResultSummary({ posture, confidence, results, className }: ResultSummaryProps) {
  const expected = results.find((r) => r.caseType === 'expected');
  const best = results.find((r) => r.caseType === 'best');
  const worst = results.find((r) => r.caseType === 'worst');

  const postureConf = postureConfig[posture];
  const confidenceConf = confidenceConfig[confidence];

  return (
    <Surface border className={cn('p-5', className)}>
      <div className="flex flex-col gap-4">
        {/* Top badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={postureConf.variant} icon={postureConf.icon}>
            {postureConf.label}
          </Badge>
          <Badge variant={confidenceConf.variant} dot>
            {confidenceConf.label}
          </Badge>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[13px] text-text-muted">Expected Outcome</span>
            <span className={cn(
              'text-[20px] font-[650] tabular-nums',
              expected && expected.profit >= 0 ? 'text-success' : 'text-danger'
            )}>
              {expected ? (expected.profit >= 0 ? '+' : '-') + formatThb(expected.profit) : '—'}
            </span>
            <span className="text-[12px] text-text-muted">monthly profit</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[13px] text-text-muted">Largest Upside</span>
            <span className="text-[20px] font-[650] tabular-nums text-success">
              {best ? '+' + formatThb(best.profit) : '—'}
            </span>
            <span className="text-[12px] text-text-muted">best case profit</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[13px] text-text-muted">Largest Downside</span>
            <span className="text-[20px] font-[650] tabular-nums text-danger">
              {worst ? '-' + formatThb(Math.abs(worst.profit)) : '—'}
            </span>
            <span className="text-[12px] text-text-muted">worst case profit</span>
          </div>
        </div>
      </div>
    </Surface>
  );
}
