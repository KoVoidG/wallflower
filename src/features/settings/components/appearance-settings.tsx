'use client';

import { useTheme } from 'next-themes';
import { useRouter, usePathname } from '@/lib/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useSyncExternalStore } from 'react';
import { Sun, Moon, Monitor, Globe } from 'lucide-react';
import { Surface } from '@/components/ui/surface';
import { H3, Body, BodySmall, Label } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import {
  updatePreferences,
  type UserPreferences,
} from '@/features/settings/adapters/settings.adapter';

const themeOptions = [
  { value: 'system', icon: Monitor, labelKey: 'system' as const },
  { value: 'light', icon: Sun, labelKey: 'light' as const },
  { value: 'dark', icon: Moon, labelKey: 'dark' as const },
] as const;

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'th', label: 'ไทย' },
] as const;

export function AppearanceSettings() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('settingsPage');

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [dateFormat, setDateFormat] = useState<UserPreferences['dateFormat']>('DD/MM/YYYY');
  const [currencyDisplay, setCurrencyDisplay] =
    useState<UserPreferences['currencyDisplay']>('symbol');

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as 'en' | 'th' });
  };

  const handleDateFormatChange = async (format: UserPreferences['dateFormat']) => {
    setDateFormat(format);
    await updatePreferences({ dateFormat: format });
  };

  const handleCurrencyChange = async (display: UserPreferences['currencyDisplay']) => {
    setCurrencyDisplay(display);
    await updatePreferences({ currencyDisplay: display });
  };

  return (
    <Surface border className="space-y-6">
      <H3>{t('appearance.title')}</H3>

      {/* Theme selector */}
      <div className="space-y-2">
        <Label as="p">{t('appearance.theme')}</Label>
        <div className="flex gap-2">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = mounted && theme === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setTheme(option.value)}
                className={cn(
                  'flex items-center gap-2 rounded-[var(--radius-md)] border px-4 py-2.5 text-[14px] font-[550] transition-colors cursor-pointer',
                  isActive
                    ? 'border-brand bg-brand-soft text-brand'
                    : 'border-border dark:border-border-strong bg-surface text-text-secondary hover:border-border-strong hover:bg-surface-subtle'
                )}
                aria-pressed={isActive}
              >
                <Icon className="size-4" aria-hidden="true" />
                {t(`appearance.${option.labelKey}`)}
              </button>
            );
          })}
        </div>
        <BodySmall>
          {mounted && resolvedTheme === 'dark'
            ? t('appearance.currentlyDark')
            : t('appearance.currentlyLight')}
        </BodySmall>
      </div>

      {/* Language selector */}
      <div className="space-y-2">
        <Label as="p">
          <Globe className="inline size-4 mr-1.5 align-text-bottom" aria-hidden="true" />
          {t('appearance.language')}
        </Label>
        <div className="flex gap-2">
          {languageOptions.map((option) => {
            const isActive = locale === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleLanguageChange(option.value)}
                className={cn(
                  'rounded-[var(--radius-md)] border px-4 py-2.5 text-[14px] font-[550] transition-colors cursor-pointer',
                  isActive
                    ? 'border-brand bg-brand-soft text-brand'
                    : 'border-border dark:border-border-strong bg-surface text-text-secondary hover:border-border-strong hover:bg-surface-subtle'
                )}
                aria-pressed={isActive}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date format preference */}
      <div className="space-y-2">
        <Label as="p">{t('appearance.dateFormat')}</Label>
        <div className="flex gap-2">
          {(['DD/MM/YYYY', 'YYYY-MM-DD'] as const).map((format) => (
            <button
              key={format}
              type="button"
              onClick={() => handleDateFormatChange(format)}
              className={cn(
                'rounded-[var(--radius-md)] border px-4 py-2.5 text-[14px] font-[550] transition-colors cursor-pointer font-mono',
                dateFormat === format
                  ? 'border-brand bg-brand-soft text-brand'
                  : 'border-border dark:border-border-strong bg-surface text-text-secondary hover:border-border-strong hover:bg-surface-subtle'
              )}
              aria-pressed={dateFormat === format}
            >
              {format}
            </button>
          ))}
        </div>
      </div>

      {/* Currency display preference */}
      <div className="space-y-2">
        <Label as="p">{t('appearance.currency')}</Label>
        <div className="flex gap-2">
          {([
            { value: 'symbol' as const, display: '฿ (Symbol)' },
            { value: 'text' as const, display: 'THB (Text)' },
          ]).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleCurrencyChange(option.value)}
              className={cn(
                'rounded-[var(--radius-md)] border px-4 py-2.5 text-[14px] font-[550] transition-colors cursor-pointer',
                currencyDisplay === option.value
                  ? 'border-brand bg-brand-soft text-brand'
                  : 'border-border dark:border-border-strong bg-surface text-text-secondary hover:border-border-strong hover:bg-surface-subtle'
              )}
              aria-pressed={currencyDisplay === option.value}
            >
              {option.display}
            </button>
          ))}
        </div>
      </div>

      {/* Reduced motion info */}
      <div className="space-y-1">
        <Label as="p">{t('appearance.reducedMotion')}</Label>
        <Body>{t('appearance.reducedMotionDescription')}</Body>
      </div>
    </Surface>
  );
}
