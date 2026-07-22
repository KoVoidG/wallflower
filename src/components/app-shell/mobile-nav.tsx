'use client';

import {
  LayoutDashboard,
  HeartPulse,
  ShieldAlert,
  FlaskConical,
  Bot,
  X,
  FileText,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Link, usePathname } from '@/lib/i18n/navigation';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  key: string;
  href: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
}

interface NavSection {
  titleKey: string;
  items: readonly NavItem[];
}

const navSections: readonly NavSection[] = [
  {
    titleKey: 'sectionMain',
    items: [
      { key: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
      { key: 'businessHealth', href: '/business-health', icon: HeartPulse },
    ],
  },
  {
    titleKey: 'sectionAnalytics',
    items: [
      { key: 'risk', href: '/risks', icon: ShieldAlert },
      { key: 'simulation', href: '/simulations', icon: FlaskConical },
      { key: 'advisor', href: '/advisor', icon: Bot },
      { key: 'reports', href: '/reports', icon: FileText },
    ],
  },
] as const;

/** Bottom navigation bar for mobile (always visible on mobile) */
export function MobileBottomNav() {
  const pathname = usePathname();
  const t = useTranslations('nav');

  // Key bottom bar items
  const bottomItems = [
    { key: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
    { key: 'businessHealth', href: '/business-health', icon: HeartPulse },
    { key: 'risk', href: '/risks', icon: ShieldAlert },
    { key: 'simulation', href: '/simulations', icon: FlaskConical },
    { key: 'advisor', href: '/advisor', icon: Bot },
  ] as const;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface md:hidden"
      aria-label="Mobile navigation"
    >
      <ul className="flex items-center justify-around py-2" role="list">
        {bottomItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <li key={item.key}>
              <Link
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5',
                  'transition-colors duration-150',
                  'motion-reduce:transition-none',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                  isActive ? 'text-brand' : 'text-text-muted'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="size-5" aria-hidden="true" />
                <span className="text-[10px] font-medium leading-tight">{t(item.key)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Full-screen mobile navigation drawer (opened via hamburger) */
export function MobileNavDrawer({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const t = useTranslations('nav');

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/50 md:hidden',
          'transition-opacity duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
          'motion-reduce:transition-none',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col w-[280px] bg-surface border-r border-border md:hidden',
          'transition-transform duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
          'motion-reduce:transition-none',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-brand text-white font-bold text-sm">
              W
            </div>
            <span className="text-lg font-semibold text-text-primary">Wallflower</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'inline-flex items-center justify-center rounded-lg p-2',
              'text-text-secondary hover:bg-surface-subtle hover:text-text-primary',
              'transition-colors duration-150',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
              'cursor-pointer'
            )}
            aria-label="Close navigation menu"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5" aria-label="Main navigation">
          {navSections.map((section, idx) => (
            <div key={section.titleKey} className={cn(idx > 0 && 'pt-1 border-t border-border/50')}>
              <h2 className="px-3 pb-2 text-[10px] font-bold tracking-wider text-text-muted uppercase">
                {t(section.titleKey)}
              </h2>
              <ul className="flex flex-col gap-1" role="list">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;

                  return (
                    <li key={item.key}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                          'transition-colors duration-150',
                          'motion-reduce:transition-none',
                          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                          isActive
                            ? 'bg-brand-soft text-brand'
                            : 'text-text-secondary hover:bg-surface-subtle hover:text-text-primary'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Icon
                          className={cn(
                            'size-5 shrink-0',
                            isActive ? 'text-brand' : 'text-text-muted group-hover:text-text-secondary'
                          )}
                          aria-hidden="true"
                        />
                        <span>{t(item.key)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
