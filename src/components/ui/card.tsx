// src/components/ui/card.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { CardTitle as CardTitleTypography, MetricValue, Label, Caption } from './typography';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'subtle' | 'interactive' | 'outline' | 'warning' | 'critical';
  className?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-border bg-surface p-4 sm:p-5 shadow-2xs transition-all',
          variant === 'subtle' && 'bg-surface-subtle border-border/60',
          variant === 'interactive' && 'hover:border-border-strong hover:bg-surface-subtle cursor-pointer select-none',
          variant === 'outline' && 'bg-transparent border-border',
          variant === 'warning' && 'border-warning/30 bg-warning-soft/20',
          variant === 'critical' && 'border-danger/30 bg-danger-soft/20',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export function CardHeader({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col space-y-1 border-b border-border/50 pb-3 mb-3', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
  as,
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  return <CardTitleTypography className={className} as={as}>{children}</CardTitleTypography>;
}

export function CardDescription({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-xs text-text-muted', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-3', className)} {...props}>{children}</div>;
}

export function CardFooter({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-between border-t border-border/50 pt-3 mt-3', className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ── MetricCard Primitive ──────────────────────────────────────────────────────

interface MetricCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  value: React.ReactNode;
  subtext?: React.ReactNode;
  badge?: React.ReactNode;
  trend?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtext,
  badge,
  trend,
  icon,
  className,
  ...props
}: MetricCardProps) {
  return (
    <Card className={cn('flex flex-col justify-between gap-3', className)} {...props}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {icon && <span className="text-brand shrink-0">{icon}</span>}
          <Label className="text-xs font-medium text-text-muted">{title}</Label>
        </div>
        {badge}
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline justify-between gap-2 flex-wrap">
          {typeof value === 'string' || typeof value === 'number' ? (
            <MetricValue>{value}</MetricValue>
          ) : (
            value
          )}
          {trend}
        </div>
        {subtext && (
          typeof subtext === 'string' ? (
            <Caption className="text-text-muted block">{subtext}</Caption>
          ) : (
            subtext
          )
        )}
      </div>
    </Card>
  );
}
