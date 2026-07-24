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
  const Component = as || 'h1';
  return (
    <Component
      className={cn(
        'text-[42px]/[46px] md:text-[50px]/[54px] lg:text-[56px]/[60px] font-[650] tracking-tight text-text-primary',
        className
      )}
    >
      {children}
    </Component>
  );
};

export const MarketingSectionTitle = ({ children, className, as }: TypographyProps) => {
  const Component = as || 'h2';
  return (
    <Component
      className={cn(
        'text-[30px]/[36px] md:text-[36px]/[42px] lg:text-[40px]/[46px] font-semibold tracking-tight text-text-primary',
        className
      )}
    >
      {children}
    </Component>
  );
};

export const MarketingLead = ({ children, className, as }: TypographyProps) => {
  const Component = as || 'p';
  return (
    <Component
      className={cn(
        'text-[17px]/[28px] md:text-[18px]/[30px] font-normal text-text-secondary',
        className
      )}
    >
      {children}
    </Component>
  );
};

// ── Application Scale ────────────────────────────────────────────────────────

export const PageTitle = ({ children, className, as }: TypographyProps) => {
  const Component = as || 'h1';
  return (
    <Component
      className={cn(
        'text-[24px]/[30px] md:text-[28px]/[34px] font-semibold tracking-tight text-text-primary',
        className
      )}
    >
      {children}
    </Component>
  );
};

export const PageDescription = ({ children, className, as }: TypographyProps) => {
  const Component = as || 'p';
  return (
    <Component
      className={cn('text-[15px]/[24px] font-normal text-text-secondary', className)}
    >
      {children}
    </Component>
  );
};

export const SectionTitle = ({ children, className, as }: TypographyProps) => {
  const Component = as || 'h2';
  return (
    <Component
      className={cn(
        'text-[19px]/[27px] md:text-[20px]/[28px] font-semibold text-text-primary',
        className
      )}
    >
      {children}
    </Component>
  );
};

export const CardTitle = ({ children, className, as }: TypographyProps) => {
  const Component = as || 'h3';
  return (
    <Component
      className={cn('text-[16px]/[22px] font-semibold text-text-primary', className)}
    >
      {children}
    </Component>
  );
};

export const BodyLarge = ({ children, className, as }: TypographyProps) => {
  const Component = as || 'p';
  return (
    <Component
      className={cn('text-[16px]/[26px] font-normal text-text-secondary', className)}
    >
      {children}
    </Component>
  );
};

export const Body = ({ children, className, as }: TypographyProps) => {
  const Component = as || 'p';
  return (
    <Component
      className={cn('text-[15px]/[24px] font-normal text-text-secondary', className)}
    >
      {children}
    </Component>
  );
};

export const BodySmall = ({ children, className, as }: TypographyProps) => {
  const Component = as || 'p';
  return (
    <Component
      className={cn('text-[13px]/[19px] font-normal text-text-secondary', className)}
    >
      {children}
    </Component>
  );
};

export const Label = ({ children, className, as }: TypographyProps) => {
  const Component = as || 'span';
  return (
    <Component
      className={cn('text-[13px]/[18px] font-medium text-text-primary', className)}
    >
      {children}
    </Component>
  );
};

export const Caption = ({ children, className, as }: TypographyProps) => {
  const Component = as || 'span';
  return (
    <Component
      className={cn('text-[12px]/[17px] font-normal text-text-muted', className)}
    >
      {children}
    </Component>
  );
};

export const MetricValue = ({ children, className, as }: TypographyProps) => {
  const Component = as || 'span';
  return (
    <Component
      className={cn(
        'text-[26px]/[32px] md:text-[28px]/[34px] font-[650] tracking-tight text-text-primary tabular-nums',
        className
      )}
    >
      {children}
    </Component>
  );
};

export const TableNumber = ({ children, className, as }: TypographyProps) => {
  const Component = as || 'span';
  return (
    <Component
      className={cn(
        'text-[14px]/[20px] font-medium text-text-primary tabular-nums',
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
