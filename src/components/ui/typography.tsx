// src/components/ui/typography.tsx
import React from 'react';
import { cn } from '@/lib/utils';

type TypographyProps = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
};

export const Display = ({ children, className, as }: TypographyProps) => {
  const Component = as || 'h1';
  return (
    <Component
      className={cn(
        'text-[38px]/[42px] md:text-[44px]/[48px] lg:text-[64px]/[68px] font-[650] text-text-primary',
        className
      )}
    >
      {children}
    </Component>
  );
};

export const H1 = ({ children, className, as }: TypographyProps) => {
  const Component = as || 'h1';
  return (
    <Component
      className={cn('text-[36px]/[44px] font-[650] text-text-primary', className)}
    >
      {children}
    </Component>
  );
};

export const H2 = ({ children, className, as }: TypographyProps) => {
  const Component = as || 'h2';
  return (
    <Component
      className={cn('text-[28px]/[36px] font-[650] text-text-primary', className)}
    >
      {children}
    </Component>
  );
};

export const H3 = ({ children, className, as }: TypographyProps) => {
  const Component = as || 'h3';
  return (
    <Component
      className={cn('text-[20px]/[28px] font-[600] text-text-primary', className)}
    >
      {children}
    </Component>
  );
};

export const BodyLarge = ({ children, className, as }: TypographyProps) => {
  const Component = as || 'p';
  return (
    <Component
      className={cn('text-[18px]/[30px] font-normal text-text-secondary', className)}
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
      className={cn('text-[13px]/[20px] font-normal text-text-secondary', className)}
    >
      {children}
    </Component>
  );
};

export const Label = ({ children, className, as }: TypographyProps) => {
  const Component = as || 'span';
  return (
    <Component
      className={cn('text-[13px]/[18px] font-[550] text-text-primary', className)}
    >
      {children}
    </Component>
  );
};

export const Caption = ({ children, className, as }: TypographyProps) => {
  const Component = as || 'span';
  return (
    <Component
      className={cn('text-[12px]/[18px] font-[450] text-text-muted', className)}
    >
      {children}
    </Component>
  );
};

export const KpiValue = ({ children, className, as }: TypographyProps) => {
  const Component = as || 'span';
  return (
    <Component
      className={cn(
        'text-[34px]/[40px] font-[650] text-text-primary tabular-nums',
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
        'text-[14px]/[20px] font-[550] text-text-primary tabular-nums',
        className
      )}
    >
      {children}
    </Component>
  );
};
