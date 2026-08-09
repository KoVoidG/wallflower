// src/components/ui/badge.tsx
import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'default'
  | 'brand'
  | 'simulated'
  | 'recommended'
  | 'purple'
  | 'selected'
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
  | 'coming_later'
  | 'up'
  | 'down';

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
  default: 'bg-brand-soft text-brand-text border-brand-border',
  brand: 'bg-brand-soft text-brand-text border-brand-border',
  simulated: 'bg-badge-simulated-bg text-badge-simulated-text border-badge-simulated-border',
  recommended: 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white border-transparent shadow-xs',
  purple: 'bg-purple-soft text-purple-text border-purple-border',
  selected: 'bg-selection-bg text-selection-text border-selection-border',
  success: 'bg-status-up-soft text-status-up border-status-up-border',
  healthy: 'bg-status-up-soft text-status-up border-status-up-border',
  stable: 'bg-status-up-soft text-status-up border-status-up-border',
  up: 'bg-status-up-soft text-status-up border-status-up-border',
  warning: 'bg-status-warning-soft text-status-warning border-status-warning-border',
  danger: 'bg-status-down-soft text-status-down border-status-down-border',
  critical: 'bg-status-down-soft text-status-down border-status-down-border',
  down: 'bg-status-down-soft text-status-down border-status-down-border',
  info: 'bg-info-soft text-info border-info/20',
  ai: 'bg-ai-soft text-ai-text border-ai-border',
  neutral: 'bg-surface-subtle text-text-secondary border-border',
  actual: 'bg-status-up-soft text-status-up border-status-up-border',
  estimated: 'bg-status-warning-soft text-status-warning border-status-warning-border',
  imported: 'bg-ai-soft text-ai-text border-ai-border',
  sample: 'bg-info-soft text-info border-info/20',
  missing: 'bg-status-down-soft text-status-down border-status-down-border',
  coming_later: 'bg-surface-subtle text-text-muted border-border',
};

const dotColorClasses: Record<BadgeVariant, string> = {
  default: 'bg-brand',
  brand: 'bg-brand',
  simulated: 'bg-[#8B5CF6]',
  recommended: 'bg-white',
  purple: 'bg-purple-accent',
  selected: 'bg-brand',
  success: 'bg-status-up',
  healthy: 'bg-status-up',
  stable: 'bg-status-up',
  up: 'bg-status-up',
  warning: 'bg-status-warning',
  danger: 'bg-status-down',
  critical: 'bg-status-down',
  down: 'bg-status-down',
  info: 'bg-info',
  ai: 'bg-ai',
  neutral: 'bg-text-muted',
  actual: 'bg-status-up',
  estimated: 'bg-status-warning',
  imported: 'bg-ai',
  sample: 'bg-info',
  missing: 'bg-status-down',
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
