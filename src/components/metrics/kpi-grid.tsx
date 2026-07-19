import { cn } from '@/lib/utils';

interface KpiGridProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Responsive grid layout for KPI cards.
 * 1 column on mobile, 2 on tablet, 4 on desktop.
 */
export function KpiGrid({ children, className }: KpiGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4',
        className
      )}
    >
      {children}
    </div>
  );
}
