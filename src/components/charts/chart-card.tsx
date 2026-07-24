// src/components/charts/chart-card.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ChartLegend, type LegendItem } from './chart-legend';

interface ChartCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
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
  return (
    <Card className={cn('flex flex-col justify-between', className)} {...props}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b-0 pb-2 mb-0">
        <div className="space-y-1 min-w-0">
          {typeof title === 'string' ? <CardTitle>{title}</CardTitle> : title}
          {description && (
            typeof description === 'string' ? (
              <CardDescription>{description}</CardDescription>
            ) : (
              description
            )
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
          {legendItems && legendItems.length > 0 && <ChartLegend items={legendItems} />}
          {action}
        </div>
      </CardHeader>
      <CardContent className="pt-2">{children}</CardContent>
    </Card>
  );
}
