'use client';

import {
  LayoutDashboard,
  HeartPulse,
  ShieldAlert,
  FlaskConical,
  Bot,
  FileText,
  Settings,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, usePathname } from '@/lib/i18n/navigation';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { key: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
  { key: 'businessHealth', href: '/business-health', icon: HeartPulse },
  { key: 'risk', href: '/risks', icon: ShieldAlert },
  { key: 'simulation', href: '/simulations', icon: FlaskConical },
  { key: 'advisor', href: '/advisor', icon: Bot },
  { key: 'reports', href: '/reports', icon: FileText },
  { key: 'settings', href: '/settings', icon: Settings },
] as const;

const navLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  businessHealth: 'Business Health',
  risk: 'Risk Center',
  simulation: 'Simulation',
  advisor: 'Advisor',
  reports: 'Reports',
  settings: 'Settings',
};

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

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
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white font-bold text-sm">
          W
        </div>
        {!collapsed && (
          <span className="text-lg font-semibold text-text-primary truncate">
            Wallflower
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
        <ul className="flex flex-col gap-1" role="list">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                    'transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    'motion-reduce:transition-none',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                    isActive
                      ? 'bg-brand-soft text-brand'
                      : 'text-text-secondary hover:bg-surface-subtle hover:text-text-primary'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                  title={collapsed ? navLabels[item.key] : undefined}
                >
                  <Icon
                    className={cn(
                      'size-5 shrink-0',
                      isActive ? 'text-brand' : 'text-text-muted group-hover:text-text-secondary'
                    )}
                    aria-hidden="true"
                  />
                  {!collapsed && <span className="truncate">{navLabels[item.key]}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border px-3 py-3">
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
            'text-text-secondary hover:bg-surface-subtle hover:text-text-primary',
            'transition-colors duration-150',
            'motion-reduce:transition-none',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
            'cursor-pointer'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeft className="size-5 shrink-0" aria-hidden="true" />
          ) : (
            <>
              <PanelLeftClose className="size-5 shrink-0" aria-hidden="true" />
              <span className="truncate">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
