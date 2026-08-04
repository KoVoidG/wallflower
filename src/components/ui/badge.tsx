// src/components/ui/badge.tsx
import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'default'
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'ai'
  | 'healthy'
  | 'stable'
  | 'critical'
  | 'neutral'
  | 'actual'
  | 'estimated'
  | 'imported'
  | 'sample'
  | 'missing'
  | 'coming_later';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  dot?: boolean;
  'font-medium'?: boolean;
  'font-semibold'?: boolean;
  fontMedium?: boolean;
  fontSemibold?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-brand-soft text-brand border-brand/20',
  brand: 'bg-brand-soft text-brand border-brand/20',
  success: 'bg-success-soft text-success border-success/20',
  healthy: 'bg-success-soft text-success border-success/20',
  stable: 'bg-success-soft text-success border-success/20',
  warning: 'bg-warning-soft text-warning border-warning/20',
  danger: 'bg-danger-soft text-danger border-danger/20',
  critical: 'bg-danger-soft text-danger border-danger/20',
  info: 'bg-info-soft text-info border-info/20',
  ai: 'bg-ai-soft text-ai border-ai/20',
  neutral: 'bg-surface-subtle text-text-secondary border-border',
  actual: 'bg-success-soft text-success border-success/20',
  estimated: 'bg-warning-soft text-warning border-warning/20',
  imported: 'bg-ai-soft text-ai border-ai/20',
  sample: 'bg-info-soft text-info border-info/20',
  missing: 'bg-danger-soft text-danger border-danger/20',
  coming_later: 'bg-surface-subtle text-text-muted border-border',
};

const dotColorClasses: Record<BadgeVariant, string> = {
  default: 'bg-brand',
  brand: 'bg-brand',
  success: 'bg-success',
  healthy: 'bg-success',
  stable: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  critical: 'bg-danger',
  info: 'bg-info',
  ai: 'bg-ai',
  neutral: 'bg-text-muted',
  actual: 'bg-success',
  estimated: 'bg-warning',
  imported: 'bg-ai',
  sample: 'bg-info',
  missing: 'bg-danger',
  coming_later: 'bg-text-muted',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'default', icon, dot = false, className, ...props }, ref) => {
    // Strip non-standard font boolean attributes if accidentally passed
    const { 'font-medium': _fm1, 'font-semibold': _fs1, fontMedium: _fm2, fontSemibold: _fs2, ...restProps } =
      props as Record<string, unknown>;
    void _fm1;
    void _fs1;
    void _fm2;
    void _fs2;

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] font-mono text-[0.72rem] tracking-[0.05em] uppercase font-medium border select-none',
          variantClasses[variant] || variantClasses.default,
          className
        )}
        {...restProps}
      >
        {dot && (
          <span
            className={cn('size-1.5 rounded-full shrink-0', dotColorClasses[variant] || 'bg-brand')}
            aria-hidden="true"
          />
        )}
        {icon && (
          <span className="shrink-0 [&>svg]:size-3" aria-hidden="true">
            {icon}
          </span>
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
