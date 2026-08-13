// src/components/ui/surface.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'subtle' | 'raised';
  border?: boolean;
}

const variantClasses = {
  default: 'bg-surface',
  subtle: 'bg-surface-subtle',
  raised: 'bg-surface-raised shadow-sm',
} as const;

export const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  ({ children, variant = 'default', border = false, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-[var(--radius-md)] p-4',
          variantClasses[variant],
          border && 'border border-border',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Surface.displayName = 'Surface';
