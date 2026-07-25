// src/components/ui/button.tsx
import React from 'react';
import { Slot as SlotPrimitive } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-brand text-white dark:text-background border border-brand/40 hover:bg-brand-hover active:bg-brand-strong shadow-xs',
        secondary:
          'border border-border-strong bg-surface text-text-primary hover:border-brand/40 hover:bg-surface-subtle shadow-2xs',
        outline:
          'border border-border bg-transparent text-text-primary hover:border-border-strong hover:bg-surface-subtle',
        ghost:
          'bg-transparent text-text-primary hover:bg-surface-subtle border-transparent',
        danger:
          'bg-danger text-white hover:bg-danger/90 active:bg-danger border border-danger/40 shadow-xs',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-5 text-base',
        icon: 'size-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Component = (
      asChild ? SlotPrimitive.Slot : 'button'
    ) as React.ElementType;

    return (
      <Component
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="size-4 animate-spin shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </Component>
    );
  },
);

Button.displayName = 'Button';
