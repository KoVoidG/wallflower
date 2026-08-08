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
import { Logo } from '@/components/ui/logo';

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
        'sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/80 bg-surface/85 backdrop-blur-md px-4 md:px-6 lg:px-8',
        'transition-[padding-left] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'motion-reduce:transition-none',
      )}
    >
      {/* Mobile logo */}
      <div className="flex items-center gap-2 md:hidden">
        <Logo size="xs" />
      </div>

      {/* Page title */}
      {title && (
        <h1 className="hidden md:block font-display text-lg font-semibold text-text-primary truncate">
          {title}
        </h1>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* AI Advisor Floating Trigger Button */}
        <button
          type="button"
          onClick={toggleAdvisor}
          className={cn(
            'inline-flex items-center justify-center rounded-full p-0.5 hover:scale-105 transition-transform duration-150 cursor-pointer',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary',
          )}
          aria-label="Open AI Advisor"
          title="AI Advisor (Cmd+K / Ctrl+K)"
        >
          <BotAvatar size={42} animate={false} />
        </button>

        {/* Notification Bell */}
        <button
          type="button"
          className={cn(
            'relative inline-flex items-center justify-center rounded-lg p-2 text-xs font-semibold',
            'text-text-secondary hover:bg-surface-subtle hover:text-text-primary',
            'transition-colors duration-150 cursor-pointer',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
          )}
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="size-4 text-text-secondary" aria-hidden="true" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-brand" />
        </button>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className={cn(
            'inline-flex items-center justify-center rounded-lg p-2 text-xs font-semibold',
            'text-text-secondary hover:bg-surface-subtle hover:text-text-primary',
            'transition-colors duration-150',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
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
            <Sun className="size-4 text-brand" aria-hidden="true" />
          ) : (
            <Moon className="size-4 text-text-secondary" aria-hidden="true" />
          )}
        </button>

        {/* Language toggle */}
        <button
          type="button"
          onClick={handleLanguageToggle}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider',
            'text-text-secondary hover:bg-surface-subtle hover:text-text-primary',
            'transition-colors duration-150',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
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
