// src/components/ui/empty-state.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-6',
        className
      )}
    >
      {icon && (
        <div className="mb-4 text-text-muted [&>svg]:size-12" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="text-[20px]/[28px] font-[600] text-text-primary mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-[15px]/[24px] font-normal text-text-muted max-w-sm mb-4">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
