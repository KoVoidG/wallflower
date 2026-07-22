'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useTranslations, useLocale } from 'next-intl';
import { Sun, Moon, Monitor, Globe, Check } from 'lucide-react';
import { useRouter, usePathname } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils';
import { Select } from '@/components/ui/select';

export function AppearanceLanguageSettings() {
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('settingsPage.appearance');
  const tCommon = useTranslations('settingsPage');

  const [mounted, setMounted] = useState(false);
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [currencyFormat, setCurrencyFormat] = useState('THB');
  const [density, setDensity] = useState('comfortable');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-text-primary">{t('title')}</h2>
        <p className="text-sm text-text-secondary">
          Configure interface theme, locale language, date formatting, and data density.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-success/40 bg-success-soft px-4 py-3 text-sm text-success font-medium">
          <Check className="size-4 shrink-0" />
          <span>{tCommon('saveBar.saved')}</span>
        </div>
      )}

      {/* Theme Selector */}
      <div className="rounded-lg border border-border bg-surface p-4 sm:p-6 space-y-4">
        <h3 className="text-base font-semibold text-text-primary border-b border-border/60 pb-3">
          {t('theme')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={cn(
              'flex flex-col items-center justify-center gap-2 rounded-lg border p-4 text-center cursor-pointer transition-colors',
              mounted && theme === 'light'
                ? 'border-brand bg-brand-soft/30 text-brand font-semibold'
                : 'border-border bg-surface hover:bg-surface-subtle text-text-secondary'
            )}
          >
            <Sun className="size-6 text-brand" />
            <span className="text-xs">{t('light')}</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={cn(
              'flex flex-col items-center justify-center gap-2 rounded-lg border p-4 text-center cursor-pointer transition-colors',
              mounted && theme === 'dark'
                ? 'border-brand bg-brand-soft/30 text-brand font-semibold'
                : 'border-border bg-surface hover:bg-surface-subtle text-text-secondary'
            )}
          >
            <Moon className="size-6 text-brand" />
            <span className="text-xs">{t('dark')}</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('system')}
            className={cn(
              'flex flex-col items-center justify-center gap-2 rounded-lg border p-4 text-center cursor-pointer transition-colors',
              mounted && theme === 'system'
                ? 'border-brand bg-brand-soft/30 text-brand font-semibold'
                : 'border-border bg-surface hover:bg-surface-subtle text-text-secondary'
            )}
          >
            <Monitor className="size-6 text-text-muted" />
            <span className="text-xs">{t('system')}</span>
          </button>
        </div>
      </div>

      {/* Language Selector */}
      <div className="rounded-lg border border-border bg-surface p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <Globe className="size-4 text-brand" />
          <h3 className="text-base font-semibold text-text-primary">{t('language')}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleLanguageChange('en')}
            className={cn(
              'flex items-center justify-between rounded-lg border p-4 text-left cursor-pointer transition-colors',
              locale === 'en'
                ? 'border-brand bg-brand-soft/30 text-brand font-semibold'
                : 'border-border bg-surface hover:bg-surface-subtle text-text-secondary'
            )}
          >
            <div>
              <span className="block text-sm font-semibold text-text-primary">English</span>
              <span className="text-xs text-text-muted">English (US)</span>
            </div>
            {locale === 'en' && <Check className="size-4 text-brand shrink-0" />}
          </button>

          <button
            type="button"
            onClick={() => handleLanguageChange('th')}
            className={cn(
              'flex items-center justify-between rounded-lg border p-4 text-left cursor-pointer transition-colors',
              locale === 'th'
                ? 'border-brand bg-brand-soft/30 text-brand font-semibold'
                : 'border-border bg-surface hover:bg-surface-subtle text-text-secondary'
            )}
          >
            <div>
              <span className="block text-sm font-semibold text-text-primary">ไทย (Thai)</span>
              <span className="text-xs text-text-muted">ภาษาไทย</span>
            </div>
            {locale === 'th' && <Check className="size-4 text-brand shrink-0" />}
          </button>
        </div>
      </div>

      {/* Formatting & Density Options */}
      <div className="rounded-lg border border-border bg-surface p-4 sm:p-6 space-y-4">
        <h3 className="text-base font-semibold text-text-primary border-b border-border/60 pb-3">
          Formats & Density
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Select
              label={t('dateFormat')}
              value={dateFormat}
              onChange={(val) => setDateFormat(val)}
              options={[
                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (e.g. 22/07/2026)' },
                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (e.g. 2026-07-22)' },
                { value: 'MMM DD, YYYY', label: 'MMM DD, YYYY (e.g. Jul 22, 2026)' },
              ]}
            />
          </div>

          <div>
            <Select
              label={t('currencyFormat')}
              value={currencyFormat}
              onChange={(val) => setCurrencyFormat(val)}
              options={[
                { value: 'THB', label: 'THB (฿) - Thai Baht' },
                { value: 'USD', label: 'USD ($) - US Dollar' },
              ]}
            />
          </div>

          <div>
            <Select
              label={t('density')}
              value={density}
              onChange={(val) => setDensity(val)}
              options={[
                { value: 'comfortable', label: t('densityOptions.comfortable') },
                { value: 'compact', label: t('densityOptions.compact') },
              ]}
            />
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover transition-colors cursor-pointer"
          >
            {tCommon('saveBar.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
