// src/components/ui/typography.tsx
import React from 'react';
import { cn } from '@/lib/utils';

export type TypographyProps = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
};

// ── Marketing Scale ──────────────────────────────────────────────────────────

export const MarketingDisplay = ({ children, className, as }: TypographyProps) => {
  const Component = (as || 'h1') as any;
  return (
    <Component
      className={cn(
        'font-display text-[3.25rem]/[1.1] font-bold tracking-tight text-text-primary',
        className
      )}
    >
      {children}
    </Component>
  );
};

export const MarketingSectionTitle = ({ children, className, as }: TypographyProps) => {
  const Component = (as || 'h2') as any;
  return (
    <Component
      className={cn(
        'font-display text-[2rem]/[1.2] font-semibold tracking-tight text-text-primary',
        className
      )}
    >
      {children}
    </Component>
  );
};

export const MarketingLead = ({ children, className, as }: TypographyProps) => {
  const Component = (as || 'p') as any;
  return (
    <Component
      className={cn(
        'font-sans text-[0.95rem]/[1.6] font-normal text-text-secondary',
        className
      )}
    >
      {children}
    </Component>
  );
};

// ── Application Scale ────────────────────────────────────────────────────────

export const PageTitle = ({ children, className, as }: TypographyProps) => {
  const Component = (as || 'h1') as any;
  return (
    <Component
      className={cn(
        'font-display text-[2rem]/[1.2] font-semibold tracking-tight text-text-primary',
        className
      )}
    >
      {children}
    </Component>
  );
};

export const PageDescription = ({ children, className, as }: TypographyProps) => {
  const Component = (as || 'p') as any;
  return (
    <Component
      className={cn('font-sans text-[0.95rem]/[1.6] font-normal text-text-secondary', className)}
    >
      {children}
    </Component>
  );
};

export const SectionTitle = ({ children, className, as }: TypographyProps) => {
  const Component = (as || 'h2') as any;
  return (
    <Component
      className={cn(
        'font-display text-[1.4rem]/[1.3] font-semibold text-text-primary',
        className
      )}
    >
      {children}
    </Component>
  );
};

export const CardTitle = ({ children, className, as }: TypographyProps) => {
  const Component = (as || 'h3') as any;
  return (
    <Component
      className={cn('font-display text-[1.1rem]/[1.4] font-semibold text-text-primary', className)}
    >
      {children}
    </Component>
  );
};

export const BodyLarge = ({ children, className, as }: TypographyProps) => {
  const Component = (as || 'p') as any;
  return (
    <Component
      className={cn('font-sans text-[1.05rem]/[1.6] font-normal text-text-secondary', className)}
    >
      {children}
    </Component>
  );
};

export const Body = ({ children, className, as }: TypographyProps) => {
  const Component = (as || 'p') as any;
  return (
    <Component
      className={cn('font-sans text-[0.95rem]/[1.6] font-normal text-text-secondary', className)}
    >
      {children}
    </Component>
  );
};

export const BodySmall = ({ children, className, as }: TypographyProps) => {
  const Component = (as || 'p') as any;
  return (
    <Component
      className={cn('font-sans text-[0.85rem]/[1.5] font-normal text-text-secondary', className)}
    >
      {children}
    </Component>
  );
};

export const Label = ({ children, className, as }: TypographyProps) => {
  const Component = (as || 'span') as any;
  return (
    <Component
      className={cn('font-mono text-[0.72rem] tracking-[0.05em] uppercase font-medium text-text-secondary', className)}
    >
      {children}
    </Component>
  );
};

export const Caption = ({ children, className, as }: TypographyProps) => {
  const Component = (as || 'span') as any;
  return (
    <Component
      className={cn('font-sans text-[0.8rem]/[1.4] font-normal text-text-secondary', className)}
    >
      {children}
    </Component>
  );
};

export const MetricValue = ({ children, className, as }: TypographyProps) => {
  const Component = (as || 'span') as any;
  return (
    <Component
      className={cn(
        'font-mono text-[1.5rem]/[1.2] md:text-[1.75rem]/[1.2] font-semibold text-text-primary tabular-nums',
        className
      )}
    >
      {children}
    </Component>
  );
};

export const TableNumber = ({ children, className, as }: TypographyProps) => {
  const Component = (as || 'span') as any;
  return (
    <Component
      className={cn(
        'font-mono text-[0.9rem]/[1.4] font-medium text-text-primary tabular-nums',
        className
      )}
    >
      {children}
    </Component>
  );
};

// ── Backward Compatibility Aliases ───────────────────────────────────────────

export const Display = MarketingDisplay;
export const H1 = PageTitle;
export const H2 = SectionTitle;
export const H3 = CardTitle;
export const KpiValue = MetricValue;
