// src/components/ui/layout.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { PageTitle, PageDescription, SectionTitle } from './typography';

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function AppPage({ children, className, ...props }: LayoutProps) {
  return (
    <div
      className={cn(
        'mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6 space-y-6',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface PageHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  badge,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border/60 pb-5',
        className,
      )}
      {...props}
    >
      <div className="space-y-1 max-w-3xl">
        <div className="flex items-center gap-2.5 flex-wrap">
          {typeof title === 'string' ? <PageTitle>{title}</PageTitle> : title}
          {badge}
        </div>
        {description &&
          (typeof description === 'string' ? (
            <PageDescription>{description}</PageDescription>
          ) : (
            description
          ))}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start sm:self-auto">
          {actions}
        </div>
      )}
    </div>
  );
}

export function PageHeaderActions({
  children,
  className,
  ...props
}: LayoutProps) {
  return (
    <div
      className={cn('flex flex-wrap items-center gap-2.5 shrink-0', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function PageContent({ children, className, ...props }: LayoutProps) {
  return (
    <div className={cn('space-y-6', className)} {...props}>
      {children}
    </div>
  );
}

export function Section({ children, className, ...props }: LayoutProps) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {children}
    </div>
  );
}

interface SectionHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  action,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn('flex items-center justify-between gap-4', className)}
      {...props}
    >
      <div>
        {typeof title === 'string' ? (
          <SectionTitle>{title}</SectionTitle>
        ) : (
          title
        )}
        {description &&
          (typeof description === 'string' ? (
            <p className="text-xs text-text-muted mt-0.5">{description}</p>
          ) : (
            description
          ))}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
