// src/components/ui/badge.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'ai';
  icon?: React.ReactNode;
  dot?: boolean;
}

const variantClasses = {
  default: 'bg-brand-soft text-brand',
  brand: 'bg-brand-soft text-brand',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
  ai: 'bg-ai-soft text-ai',
} as const;

const dotColorClasses = {
  default: 'bg-brand',
  brand: 'bg-brand',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
  ai: 'bg-ai',
} as const;

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'default', icon, dot = false, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[13px]/[18px] font-[550]',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn('size-1.5 rounded-full shrink-0', dotColorClasses[variant])}
            aria-hidden="true"
          />
        )}
        {icon && (
          <span className="shrink-0 [&>svg]:size-3.5" aria-hidden="true">
            {icon}
          </span>
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
