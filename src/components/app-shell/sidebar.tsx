// src/components/app-shell/sidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  Building2,
  GitPullRequest,
  FileText,
  Cpu,
  FlaskConical,
  Database,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, usePathname } from '@/lib/i18n/navigation';
import { AccountMenu } from './account-menu';
import { Logo } from '@/components/ui/logo';
import { useAppStore } from '@/lib/liquiflow-hooks';

interface SidebarProps {
  className?: string;
}

interface NavItemConfig {
  key: string;
  href: string;
  tourId: string;
  label?: string;
  icon: React.ComponentType<{
    className?: string;
    strokeWidth?: number;
    'aria-hidden'?: boolean | 'true' | 'false';
  }>;
}

const mainNavItems: readonly NavItemConfig[] = [
  {
    key: 'dashboard',
    href: '/dashboard',
    tourId: 'sidebar-dashboard',
    icon: LayoutDashboard,
  },
  {
    key: 'businessHealth',
    href: '/business-health',
    tourId: 'sidebar-business',
    icon: Building2,
  },
  {
    key: 'data-sources',
    href: '/data-sources',
    tourId: 'sidebar-data-sources',
    icon: Database,
  },
  {
    key: 'simulation',
    href: '/simulations',
    tourId: 'sidebar-planner',
    icon: GitPullRequest,
  },
  {
    key: 'reports',
    href: '/reports',
    tourId: 'sidebar-reports',
    icon: FileText,
  },
  {
    key: 'automation',
    href: '/automation',
    tourId: 'sidebar-automation',
    icon: Cpu,
  },
  {
    key: 'playground',
    href: '/advisor/playground',
    tourId: 'sidebar-playground',
    icon: FlaskConical,
  },
] as const;

export function Sidebar({ className }: SidebarProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const { isDemoMode, syncWithWallflower } = useAppStore();

  useEffect(() => {
    // Attempt to automatically sync Wallflower Business/Financial data into Liquiflow on load
    if (isDemoMode) {
      syncWithWallflower();
    }
  }, [isDemoMode, syncWithWallflower]);

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[#D5DEEE] dark:border-[#1E2638] bg-[#DEE7F6] dark:bg-[#0B0E14] text-slate-800 dark:text-slate-100',
        'transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]',
        isHovered ? 'w-[230px] shadow-2xl' : 'w-[76px] shadow-xs',
        className,
      )}
    >
      {/* Brand Header with Big Logo */}
      <div className="flex h-16 items-center px-4 shrink-0 overflow-hidden">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Logo size={44} showWordmark={isHovered} />
        </Link>
      </div>

      {/* Navigation Groups */}
      <nav
        className="flex-1 overflow-y-auto px-2.5 py-4"
        aria-label={t('openMenu')}
      >
        <ul className="flex flex-col gap-1.5" role="list">
          {mainNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' &&
                pathname.startsWith(`${item.href}`));
            const Icon = item.icon;
            // Use explicit label for new items not in translations, fall back to t() for known keys
            let label: string;
            try {
              label = item.label ?? t(item.key as Parameters<typeof t>[0]);
            } catch {
              label = item.label ?? item.key;
            }

            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  data-tour={item.tourId}
                  className={cn(
                    'group flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-all duration-150',
                    isHovered
                      ? 'px-3'
                      : 'justify-center px-0 w-10 h-10 mx-auto',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                    isActive
                      ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-semibold shadow-md shadow-indigo-500/25'
                      : 'text-[#50617A] hover:text-[#4F46E5] hover:bg-[#6366F1]/12 dark:text-slate-400 dark:hover:text-[#C4B5FD] dark:hover:bg-[#6366F1]/18',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                  title={!isHovered ? label : undefined}
                >
                  <Icon
                    strokeWidth={2}
                    className={cn(
                      'size-4.5 shrink-0 transition-colors',
                      isActive
                        ? 'text-white'
                        : 'text-[#50617A] group-hover:text-[#4F46E5] dark:text-slate-400 dark:group-hover:text-[#C4B5FD]',
                    )}
                    aria-hidden="true"
                  />
                  {isHovered && (
                    <span className="truncate font-semibold">{label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Account Control Card at Bottom (No collapse button!) */}
      <div className="p-2.5 pb-4 shrink-0 border-t border-[#D5DEEE]/80 dark:border-[#1E2638]">
        <AccountMenu collapsed={!isHovered} align="top" />
      </div>
    </aside>
  );
}
