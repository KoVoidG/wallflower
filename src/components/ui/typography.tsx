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
  return React.createElement(
    as || 'h1',
    {
      className: cn(
        'font-display text-[3.25rem]/[1.1] font-bold tracking-tight text-text-primary',
        className
      ),
    },
    children
  );
};

export const MarketingSectionTitle = ({ children, className, as }: TypographyProps) => {
  return React.createElement(
    as || 'h2',
    {
      className: cn(
        'font-display text-[2rem]/[1.2] font-semibold tracking-tight text-text-primary',
        className
      ),
    },
    children
  );
};

export const MarketingLead = ({ children, className, as }: TypographyProps) => {
  return React.createElement(
    as || 'p',
    {
      className: cn(
        'font-sans text-[0.95rem]/[1.6] font-normal text-text-secondary',
        className
      ),
    },
    children
  );
};

// ── Application Scale ────────────────────────────────────────────────────────

export const PageTitle = ({ children, className, as }: TypographyProps) => {
  return React.createElement(
    as || 'h1',
    {
      className: cn(
        'font-display text-[2rem]/[1.2] font-semibold tracking-tight text-text-primary',
        className
      ),
    },
    children
  );
};

export const PageDescription = ({ children, className, as }: TypographyProps) => {
  return React.createElement(
    as || 'p',
    {
      className: cn('font-sans text-[0.95rem]/[1.6] font-normal text-text-secondary', className),
    },
    children
  );
};

export const SectionTitle = ({ children, className, as }: TypographyProps) => {
  return React.createElement(
    as || 'h2',
    {
      className: cn(
        'font-display text-[1.4rem]/[1.3] font-semibold text-text-primary',
        className
      ),
    },
    children
  );
};

export const CardTitle = ({ children, className, as }: TypographyProps) => {
  return React.createElement(
    as || 'h3',
    {
      className: cn('font-display text-[1.1rem]/[1.4] font-semibold text-text-primary', className),
    },
    children
  );
};

export const BodyLarge = ({ children, className, as }: TypographyProps) => {
  return React.createElement(
    as || 'p',
    {
      className: cn('font-sans text-[1.05rem]/[1.6] font-normal text-text-secondary', className),
    },
    children
  );
};

export const Body = ({ children, className, as }: TypographyProps) => {
  return React.createElement(
    as || 'p',
    {
      className: cn('font-sans text-[0.95rem]/[1.6] font-normal text-text-secondary', className),
    },
    children
  );
};

export const BodySmall = ({ children, className, as }: TypographyProps) => {
  return React.createElement(
    as || 'p',
    {
      className: cn('font-sans text-[0.85rem]/[1.5] font-normal text-text-secondary', className),
    },
    children
  );
};

export const Label = ({ children, className, as }: TypographyProps) => {
  return React.createElement(
    as || 'span',
    {
      className: cn('font-mono text-[0.72rem] tracking-[0.05em] uppercase font-medium text-text-secondary', className),
    },
    children
  );
};

export const Caption = ({ children, className, as }: TypographyProps) => {
  return React.createElement(
    as || 'span',
    {
      className: cn('font-sans text-[0.8rem]/[1.4] font-normal text-text-secondary', className),
    },
    children
  );
};

export const MetricValue = ({ children, className, as }: TypographyProps) => {
  return React.createElement(
    as || 'span',
    {
      className: cn(
        'font-mono text-[1.5rem]/[1.2] md:text-[1.75rem]/[1.2] font-semibold text-text-primary tabular-nums',
        className
      ),
    },
    children
  );
};

export const TableNumber = ({ children, className, as }: TypographyProps) => {
  return React.createElement(
    as || 'span',
    {
      className: cn(
        'font-mono text-[0.9rem]/[1.4] font-medium text-text-primary tabular-nums',
        className
      ),
    },
    children
  );
};

// ── Backward Compatibility Aliases ───────────────────────────────────────────

export const Display = MarketingDisplay;
export const H1 = PageTitle;
export const H2 = SectionTitle;
export const H3 = CardTitle;
export const KpiValue = MetricValue;
