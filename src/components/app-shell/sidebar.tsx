'use client';

import {
  LayoutDashboard,
  HeartPulse,
  Banknote,
  ShieldAlert,
  FlaskConical,
  Bot,
  CheckSquare,
  FileText,
  Database,
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
  href: string;
  tourId: string;
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
      { key: 'dashboard', href: '/dashboard', tourId: 'sidebar-dashboard', icon: LayoutDashboard },
      { key: 'businessHealth', href: '/business-health', tourId: 'sidebar-business-health', icon: HeartPulse },
      { key: 'cashFlow', href: '/cash-flow', tourId: 'sidebar-cash-flow', icon: Banknote },
    ],
  },
  {
    titleKey: 'sectionAnalytics',
    items: [
      { key: 'risk', href: '/risks', tourId: 'sidebar-risks', icon: ShieldAlert },
      { key: 'simulation', href: '/simulations', tourId: 'sidebar-simulations', icon: FlaskConical },
      { key: 'advisor', href: '/advisor', tourId: 'sidebar-advisor', icon: Bot },
    ],
  },
  {
    titleKey: 'sectionExecution',
    items: [
      { key: 'actionPlan', href: '/actions', tourId: 'sidebar-actions', icon: CheckSquare },
      { key: 'reports', href: '/reports', tourId: 'sidebar-reports', icon: FileText },
    ],
  },
  {
    titleKey: 'sectionData',
    items: [
      { key: 'dataConnections', href: '/data-sources', tourId: 'sidebar-data-sources', icon: Database },
    ],
  },
] as const;

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations('nav');

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-surface',
        'transition-[width] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'motion-reduce:transition-none',
        collapsed ? 'w-[72px]' : 'w-[248px]'
      )}
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-4 shrink-0">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white font-bold text-sm">
          W
        </div>
        {!collapsed && (
          <span className="text-lg font-semibold text-text-primary truncate">
            Wallflower
          </span>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4" aria-label="Main navigation">
        {navSections.map((section, idx) => (
          <div key={section.titleKey} className={cn(idx > 0 && 'pt-2 border-t border-border/50')}>
            {!collapsed && (
              <h2 className="px-3 pb-1.5 text-[10px] font-bold tracking-wider text-text-muted uppercase">
                {t(section.titleKey)}
              </h2>
            )}
            <ul className="flex flex-col gap-0.5" role="list">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                const label = t(item.key);

                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      data-tour={item.tourId}
                      className={cn(
                        'group flex items-center gap-3 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium',
                        'transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]',
                        'motion-reduce:transition-none',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                        isActive
                          ? 'bg-brand-soft text-brand border-l-2 border-l-brand'
                          : 'text-text-secondary hover:bg-surface-subtle hover:text-text-primary'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                      title={collapsed ? label : undefined}
                    >
                      <Icon
                        className={cn(
                          'size-4 sm:size-5 shrink-0',
                          isActive ? 'text-brand' : 'text-text-muted group-hover:text-text-secondary'
                        )}
                        aria-hidden="true"
                      />
                      {!collapsed && <span className="truncate">{label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
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
