'use client';

import {
  LayoutDashboard,
  Building2,
  GitPullRequest,
  FileText,
  Settings,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Link, usePathname } from '@/lib/i18n/navigation';
import { AccountMenu } from './account-menu';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  key: string;
  label: string;
  href: string;
  tourId: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
}

const mainNavItems: readonly NavItem[] = [
  { key: 'dashboard', label: 'Overview', href: '/dashboard', tourId: 'sidebar-dashboard', icon: LayoutDashboard },
  { key: 'business', label: 'Business', href: '/business-health', tourId: 'sidebar-business', icon: Building2 },
  { key: 'planner', label: 'Decision Planner', href: '/simulations', tourId: 'sidebar-planner', icon: GitPullRequest },
  { key: 'reports', label: 'Reports', href: '/reports', tourId: 'sidebar-reports', icon: FileText },
  { key: 'settings', label: 'Settings', href: '/settings', tourId: 'sidebar-settings', icon: Settings },
] as const;

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations('nav');

  return (
    <aside
      className={cn(
        'sidebar-dark fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-surface text-text-primary',
        'transition-[width] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'motion-reduce:transition-none',
        collapsed ? 'w-[72px]' : 'w-[230px]'
      )}
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-4 shrink-0">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-tertiary text-on-primary font-bold text-sm">
          W
        </div>
        {!collapsed && (
          <span className="font-display text-lg font-bold text-text-primary truncate">
            Wallflower
          </span>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
        <ul className="flex flex-col gap-1" role="list">
          {mainNavItems.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}`));
            const Icon = item.icon;
            const label = item.label;

            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  data-tour={item.tourId}
                  className={cn(
                    'group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium',
                    'transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    'motion-reduce:transition-none',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary',
                    isActive
                      ? 'bg-brand-soft text-tertiary border-l-2 border-l-tertiary font-semibold'
                      : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                  title={collapsed ? label : undefined}
                >
                  <Icon
                    className={cn(
                      'size-5 shrink-0',
                      isActive ? 'text-tertiary' : 'text-text-secondary group-hover:text-text-primary'
                    )}
                    aria-hidden="true"
                  />
                  {!collapsed && <span className="truncate">{label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Account Control Row */}
      <div data-tour="sidebar-account-menu" className="px-3 py-2 border-t border-border/50 shrink-0">
        <AccountMenu collapsed={collapsed} align="top" />
      </div>

      {/* Collapse toggle */}
      <div className="border-t border-border px-3 py-3 shrink-0">
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium',
            'text-text-secondary hover:bg-surface-subtle hover:text-text-primary',
            'transition-colors duration-150',
            'motion-reduce:transition-none',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
            'cursor-pointer'
          )}
          aria-label={collapsed ? t('expand') : t('collapse')}
        >
          {collapsed ? (
            <PanelLeft className="size-5 shrink-0" aria-hidden="true" />
          ) : (
            <>
              <PanelLeftClose className="size-5 shrink-0" aria-hidden="true" />
              <span className="truncate">{t('collapse')}</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
