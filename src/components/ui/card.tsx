// src/components/ui/card.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { CardTitle as CardTitleTypography, MetricValue, Caption } from './typography';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'subtle' | 'interactive' | 'outline' | 'warning' | 'critical' | 'glass';
  className?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-[14px] border border-border bg-surface p-6 shadow-2xs transition-all duration-200',
          variant === 'subtle' && 'bg-surface-hover border-border/80',
          variant === 'glass' && 'bg-surface/90 backdrop-blur-md border-border/80 shadow-sm',
          variant === 'interactive' && 'hover:border-tertiary/60 hover:-translate-y-1 hover:shadow-md cursor-pointer select-none active:scale-[0.995]',
          variant === 'outline' && 'bg-transparent border-border',
          variant === 'warning' && 'border-warning/40 bg-warning-soft/20',
          variant === 'critical' && 'border-danger/40 bg-danger-soft/20',
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
    <div className={cn('flex flex-col space-y-1 border-b border-border/60 pb-3 mb-4', className)} {...props}>
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
    <p className={cn('font-sans text-xs text-text-secondary', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-4', className)} {...props}>{children}</div>;
}

export function CardFooter({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-between border-t border-border/60 pt-4 mt-4', className)}
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
          {icon && <span className="text-tertiary shrink-0">{icon}</span>}
          <Caption className="text-xs font-normal text-text-secondary">{title}</Caption>
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
            <Caption className="text-text-secondary block">{subtext}</Caption>
          ) : (
            subtext
          )
        )}
      </div>
    </Card>
  );
}
