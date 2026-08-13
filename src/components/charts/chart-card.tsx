// src/components/charts/chart-card.tsx

import React from 'react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { ChartLegend, type LegendItem } from './chart-legend';

interface ChartCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  legendItems?: LegendItem[];
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  description,
  legendItems,
  action,
  children,
  className,
  ...props
}: ChartCardProps) {
  const hasLegend = Boolean(legendItems?.length);

  return (
    <Card className={cn('flex h-full flex-col', className)} {...props}>
      <CardHeader className="space-y-0 border-b-0 pb-0">
        {/* Title and action */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            {typeof title === 'string' ? <CardTitle>{title}</CardTitle> : title}

            {description &&
              (typeof description === 'string' ? (
                <CardDescription>{description}</CardDescription>
              ) : (
                description
              ))}
          </div>

          {action && <div className="shrink-0 self-start">{action}</div>}
        </div>

        {/* Legend gets its own row */}
        {hasLegend && (
          <div className="mt-4 border-t border-border/60 pt-3">
            <div className="overflow-x-auto">
              <ChartLegend items={legendItems!} />
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className={cn('flex-1', hasLegend ? 'pt-3' : 'pt-4')}>
        {children}
      </CardContent>
    </Card>
  );
}
