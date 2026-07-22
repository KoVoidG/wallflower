'use client';

import { useState, useEffect } from 'react';
import { Menu, Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslations, useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from '@/lib/i18n/navigation';
import { AccountMenu } from './account-menu';

interface TopbarProps {
  title?: string;
  onMobileMenuToggle: () => void;
}

export function Topbar({ title, onMobileMenuToggle }: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  const handleLanguageToggle = () => {
    const nextLocale = locale === 'en' ? 'th' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-surface/80 backdrop-blur-sm px-4 md:px-6 lg:px-8',
        'transition-[padding-left] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'motion-reduce:transition-none'
      )}
    >
      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={onMobileMenuToggle}
        className={cn(
          'inline-flex items-center justify-center rounded-lg p-2 md:hidden',
          'text-text-secondary hover:bg-surface-subtle hover:text-text-primary',
          'transition-colors duration-150',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
          'cursor-pointer'
        )}
        aria-label={t('openMenu')}
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      {/* Mobile logo */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="flex size-7 items-center justify-center rounded-md bg-brand text-white font-bold text-xs">
          W
        </div>
        <span className="text-sm font-semibold text-text-primary">Wallflower</span>
      </div>

      {/* Page title */}
      {title && (
        <h1 className="hidden md:block text-lg font-semibold text-text-primary truncate">
          {title}
        </h1>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1.5">
        {/* Theme toggle */}
        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={cn(
            'inline-flex items-center justify-center rounded-lg p-2',
            'text-text-secondary hover:bg-surface-subtle hover:text-text-primary',
            'transition-colors duration-150',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
            'cursor-pointer'
          )}
          aria-label={mounted ? (theme === 'dark' ? t('switchToLight') : t('switchToDark')) : t('switchTheme')}
          title={mounted ? (theme === 'dark' ? t('switchToLight') : t('switchToDark')) : t('switchTheme')}
        >
          <Sun className="size-5 hidden dark:block text-brand" aria-hidden="true" />
          <Moon className="size-5 block dark:hidden text-text-secondary" aria-hidden="true" />
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
            'cursor-pointer'
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
