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
  success: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  healthy: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  stable: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
  danger: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30',
  critical: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30',
  info: 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30',
  ai: 'bg-teal-500/15 text-teal-700 dark:text-teal-400 border-teal-500/30',
  neutral: 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30',
  actual: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  estimated: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
  imported: 'bg-teal-500/15 text-teal-700 dark:text-teal-400 border-teal-500/30',
  sample: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/30',
  missing: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30',
  coming_later: 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30',
};

const dotColorClasses: Record<BadgeVariant, string> = {
  default: 'bg-brand',
  brand: 'bg-brand',
  success: 'bg-emerald-500',
  healthy: 'bg-emerald-500',
  stable: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  critical: 'bg-rose-500',
  info: 'bg-sky-500',
  ai: 'bg-teal-500',
  neutral: 'bg-slate-500',
  actual: 'bg-emerald-500',
  estimated: 'bg-amber-500',
  imported: 'bg-teal-500',
  sample: 'bg-indigo-500',
  missing: 'bg-rose-500',
  coming_later: 'bg-slate-500',
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
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px]/[17px] font-medium border select-none',
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
