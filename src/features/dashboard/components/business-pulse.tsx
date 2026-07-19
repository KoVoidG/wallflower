// src/features/dashboard/components/business-pulse.tsx
import { HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Surface } from '@/components/ui/surface';
import { Badge } from '@/components/ui/badge';
import { H3, Body, Caption } from '@/components/ui/typography';
import type { BusinessPulseData, HealthStatus } from '../adapters/dashboard.adapter';

const statusConfig: Record<
  HealthStatus,
  { variant: 'success' | 'warning' | 'danger'; label: string; iconClass: string }
> = {
  healthy: { variant: 'success', label: 'Healthy', iconClass: 'text-success' },
  warning: { variant: 'warning', label: 'Warning', iconClass: 'text-warning' },
  critical: { variant: 'danger', label: 'Critical', iconClass: 'text-danger' },
};

interface BusinessPulseProps {
  data: BusinessPulseData;
  className?: string;
}

export function BusinessPulse({ data, className }: BusinessPulseProps) {
  const config = statusConfig[data.status];

  return (
    <Surface border className={cn('flex flex-col gap-3 p-5', className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className={cn('shrink-0', config.iconClass)} aria-hidden="true">
            <HeartPulse className="size-5" />
          </span>
          <H3 className="text-[18px]/[24px]">Business Pulse</H3>
        </div>
        <Badge variant={config.variant} dot>
          {config.label}
        </Badge>
      </div>

      <Body>{data.summary}</Body>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Caption>
          Data through{' '}
          {new Date(data.dataAsOf).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </Caption>
        {data.nextAction && (
          <Caption className="text-brand font-[550]">
            Next: {data.nextAction}
          </Caption>
        )}
      </div>
    </Surface>
  );
}
