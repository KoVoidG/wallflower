'use client';

import Link from 'next/link';
import { ShieldCheck, HeartPulse, Plus, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RiskEmptyProps {
  t: {
    title: string;
    description: string;
    actionHealth: string;
    actionSnapshot: string;
    actionSimulation: string;
  };
}

const linkClass = cn(
  'inline-flex items-center gap-2 px-4 py-2 text-[14px] font-[550] rounded-[var(--radius-md)]',
  'border border-border text-text-primary bg-surface hover:bg-surface-subtle transition-colors',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand cursor-pointer'
);

export function RiskEmpty({ t }: RiskEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="mb-5 text-success" aria-hidden="true">
        <ShieldCheck className="size-14" />
      </div>
      <h3 className="text-[20px]/[28px] font-[600] text-text-primary mb-2">
        {t.title}
      </h3>
      <p className="text-[15px]/[24px] text-text-muted max-w-md mb-8">
        {t.description}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/business-health" className={linkClass}>
          <HeartPulse className="size-4" aria-hidden="true" />
          {t.actionHealth}
        </Link>
        <Link href="/dashboard" className={linkClass}>
          <Plus className="size-4" aria-hidden="true" />
          {t.actionSnapshot}
        </Link>
        <Link href="/simulations/new" className={linkClass}>
          <BarChart3 className="size-4" aria-hidden="true" />
          {t.actionSimulation}
        </Link>
      </div>
    </div>
  );
}
