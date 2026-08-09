// src/components/app-shell/topbar.tsx
'use client';

import { Globe, Sun, Moon, Bell } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from '@/lib/i18n/navigation';
import { AccountMenu } from './account-menu';
import { BotAvatar } from '@/components/ui/bot-avatar';
import { useAdvisorDrawer } from '@/features/advisor/context/advisor-drawer-context';
import { TopbarSearch } from './topbar-search';

interface TopbarProps {
  title?: string;
  onMobileMenuToggle?: () => void;
}

export function Topbar({ title }: TopbarProps) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const { toggleAdvisor } = useAdvisorDrawer();

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const handleLanguageToggle = () => {
    const nextLocale = locale === 'en' ? 'th' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header
      className={cn(
        'sticky top-3 z-30 flex h-14 items-center gap-3 md:gap-4 mx-4 md:mx-6 lg:mx-8 mb-2',
        'rounded-2xl border border-slate-200/80 dark:border-[#1E2638]',
        'bg-white/90 dark:bg-[#111622]/90 backdrop-blur-md px-3 md:px-5 shadow-xs',
        'transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'motion-reduce:transition-none',
      )}
    >
      {/* Topbar Searchbar on the left - Expansive Width */}
      <div className="flex items-center gap-3 flex-1 max-w-[580px] lg:max-w-[700px] xl:max-w-[800px]">
        <TopbarSearch />
        {title && (
          <span className="hidden 2xl:inline-block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] border-l border-slate-200 dark:border-[#1E2638] pl-3 truncate max-w-[180px] shrink-0">
            {title}
          </span>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* AI Advisor Floating Trigger Button */}
        <button
          type="button"
          onClick={toggleAdvisor}
          className={cn(
            'inline-flex items-center justify-center rounded-full p-0.5 hover:scale-110 active:scale-95 transition-all duration-150 cursor-pointer',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6366F1]',
          )}
          aria-label="Open AI Advisor"
          title="AI Advisor (Cmd+K / Ctrl+K)"
        >
          <BotAvatar size={36} animate={false} />
        </button>

        {/* Notification Bell */}
        <button
          type="button"
          className={cn(
            'relative inline-flex items-center justify-center rounded-xl p-2 text-xs font-semibold',
            'text-[#64748B] dark:text-[#94A3B8] hover:bg-slate-100 dark:hover:bg-[#1E2638] hover:text-[#0F172A] dark:hover:text-white',
            'transition-colors duration-150 cursor-pointer',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6366F1]',
          )}
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="size-4" aria-hidden="true" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[#6366F1]" />
        </button>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className={cn(
            'inline-flex items-center justify-center rounded-xl p-2 text-xs font-semibold',
            'text-[#64748B] dark:text-[#94A3B8] hover:bg-slate-100 dark:hover:bg-[#1E2638] hover:text-[#0F172A] dark:hover:text-white',
            'transition-colors duration-150',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6366F1]',
            'cursor-pointer',
          )}
          aria-label="Toggle light/dark theme"
          title={
            mounted
              ? resolvedTheme === 'dark'
                ? 'Switch to Light Mode'
                : 'Switch to Dark Mode'
              : undefined
          }
        >
          {mounted && resolvedTheme === 'dark' ? (
            <Sun className="size-4 text-[#A5B4FC]" aria-hidden="true" />
          ) : (
            <Moon className="size-4 text-[#64748B]" aria-hidden="true" />
          )}
        </button>

        {/* Language toggle */}
        <button
          type="button"
          onClick={handleLanguageToggle}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider',
            'text-[#64748B] dark:text-[#94A3B8] hover:bg-slate-100 dark:hover:bg-[#1E2638] hover:text-[#0F172A] dark:hover:text-white',
            'transition-colors duration-150',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6366F1]',
            'cursor-pointer',
          )}
          aria-label={t('changeLanguage')}
          title={t('changeLanguage')}
        >
          <Globe className="size-4" aria-hidden="true" />
          <span>{locale === 'en' ? 'TH' : 'EN'}</span>
        </button>

        {/* Mobile-only Account Menu Trigger */}
        <div className="block md:hidden ml-1">
          <AccountMenu collapsed align="right" />
        </div>
      </div>
    </header>
  );
}
