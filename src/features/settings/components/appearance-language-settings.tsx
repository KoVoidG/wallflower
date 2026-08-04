'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useLocale } from 'next-intl';
import { Check } from 'lucide-react';
import { useRouter, usePathname } from '@/lib/i18n/navigation';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const ACCENT_COLORS = [
  { id: 'emerald', bg: 'bg-emerald-500', name: 'Wallflower Green' },
  { id: 'teal', bg: 'bg-teal-500', name: 'Teal' },
  { id: 'blue', bg: 'bg-blue-500', name: 'Blue' },
  { id: 'indigo', bg: 'bg-indigo-500', name: 'Indigo' },
  { id: 'purple', bg: 'bg-purple-500', name: 'Purple' },
  { id: 'pink', bg: 'bg-pink-500', name: 'Pink' },
  { id: 'red', bg: 'bg-rose-500', name: 'Rose' },
  { id: 'orange', bg: 'bg-amber-500', name: 'Amber' },
  { id: 'dark', bg: 'bg-zinc-800 dark:bg-zinc-200', name: 'Monochrome' },
];

export function AppearanceLanguageSettings() {
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [selectedAccent, setSelectedAccent] = useState('emerald');

  const [language, setLanguage] = useState(locale === 'th' ? 'Thai' : 'English');
  const [dateFormat, setDateFormat] = useState('04 Dec 2025');
  const [timeFormat, setTimeFormat] = useState('24-hour (13:00)');
  const [numberFormat, setNumberFormat] = useState('1,234.56');
  const [currencyDisplay, setCurrencyDisplay] = useState('฿1,234.56 (THB)');

  const [reduceMotion, setReduceMotion] = useState(false);
  const [compactLayout, setCompactLayout] = useState(false);
  const [largeText, setLargeText] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  const handleLanguageSelect = (val: string) => {
    setLanguage(val);
    const newLocale = val === 'Thai' ? 'th' : 'en';
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="space-y-6 text-left">
      {/* ── 1. Appearance Theme Cards ────────────────────────────────────── */}
      <Card className="p-5 border-border-strong bg-surface space-y-4">
        <div className="border-b border-border/60 pb-3">
          <h3 className="font-display text-sm font-bold text-text-primary">Appearance</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Light Mode Card */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer select-none relative space-y-2.5 ${
              mounted && theme === 'light'
                ? 'border-tertiary bg-tertiary/10 shadow-2xs'
                : 'border-border bg-surface hover:bg-surface-hover'
            }`}
          >
            {/* Visual Thumbnail */}
            <div className="h-16 rounded-xl bg-slate-100 border border-slate-200 p-2 space-y-1.5 overflow-hidden">
              <div className="flex items-center gap-1">
                <div className="size-2 rounded-full bg-slate-300" />
                <div className="w-10 h-1.5 rounded-full bg-slate-300" />
              </div>
              <div className="w-full h-8 rounded-lg bg-white border border-slate-200 p-1 space-y-1">
                <div className="w-12 h-1.5 rounded-full bg-emerald-500" />
                <div className="w-20 h-1 rounded-full bg-slate-200" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-text-primary">Light</h4>
                <p className="text-[10px] text-text-muted font-medium">Clear and bright</p>
              </div>
              {mounted && theme === 'light' && (
                <div className="flex size-5 items-center justify-center rounded-full bg-tertiary text-on-primary">
                  <Check className="size-3 stroke-[3]" />
                </div>
              )}
            </div>
          </button>

          {/* Dark Mode Card */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer select-none relative space-y-2.5 ${
              mounted && theme === 'dark'
                ? 'border-tertiary bg-tertiary/10 shadow-2xs'
                : 'border-border bg-surface hover:bg-surface-hover'
            }`}
          >
            {/* Visual Thumbnail */}
            <div className="h-16 rounded-xl bg-zinc-900 border border-zinc-700 p-2 space-y-1.5 overflow-hidden">
              <div className="flex items-center gap-1">
                <div className="size-2 rounded-full bg-zinc-700" />
                <div className="w-10 h-1.5 rounded-full bg-zinc-700" />
              </div>
              <div className="w-full h-8 rounded-lg bg-zinc-800 border border-zinc-700 p-1 space-y-1">
                <div className="w-12 h-1.5 rounded-full bg-emerald-500" />
                <div className="w-20 h-1 rounded-full bg-zinc-700" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-text-primary">Dark</h4>
                <p className="text-[10px] text-text-muted font-medium">Easy on the eyes</p>
              </div>
              {mounted && theme === 'dark' && (
                <div className="flex size-5 items-center justify-center rounded-full bg-tertiary text-on-primary">
                  <Check className="size-3 stroke-[3]" />
                </div>
              )}
            </div>
          </button>

          {/* System Theme Card */}
          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer select-none relative space-y-2.5 ${
              mounted && theme === 'system'
                ? 'border-tertiary bg-tertiary/10 shadow-2xs'
                : 'border-border bg-surface hover:bg-surface-hover'
            }`}
          >
            {/* Visual Thumbnail (Split) */}
            <div className="h-16 rounded-xl border border-border overflow-hidden flex">
              <div className="w-1/2 h-full bg-slate-100 p-1.5 space-y-1">
                <div className="w-8 h-1.5 rounded-full bg-slate-300" />
                <div className="w-full h-6 rounded-md bg-white border border-slate-200" />
              </div>
              <div className="w-1/2 h-full bg-zinc-900 p-1.5 space-y-1">
                <div className="w-8 h-1.5 rounded-full bg-zinc-700" />
                <div className="w-full h-6 rounded-md bg-zinc-800 border border-zinc-700" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-text-primary">System</h4>
                <p className="text-[10px] text-text-muted font-medium">Use system setting</p>
              </div>
              {mounted && theme === 'system' && (
                <div className="flex size-5 items-center justify-center rounded-full bg-tertiary text-on-primary">
                  <Check className="size-3 stroke-[3]" />
                </div>
              )}
            </div>
          </button>
        </div>
      </Card>

      {/* ── 2. Accent Color ──────────────────────────────────────────────── */}
      <Card className="p-5 border-border-strong bg-surface space-y-4">
        <div className="border-b border-border/60 pb-3">
          <h3 className="font-display text-sm font-bold text-text-primary">Accent Color</h3>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {ACCENT_COLORS.map((color) => {
            const isSelected = selectedAccent === color.id;
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => setSelectedAccent(color.id)}
                title={color.name}
                className={`size-7 rounded-full ${color.bg} transition-all cursor-pointer flex items-center justify-center ${
                  isSelected ? 'ring-3 ring-tertiary ring-offset-2 ring-offset-surface scale-110' : 'hover:scale-105'
                }`}
              >
                {isSelected && <Check className="size-3.5 text-white stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </Card>

      {/* ── 3. Localization & Accessibility 2-Column Grid ────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Formats & Localization */}
        <Card className="p-5 border-border-strong bg-surface space-y-4">
          <div className="border-b border-border/60 pb-3">
            <h3 className="font-display text-sm font-bold text-text-primary">Localization & Formats</h3>
          </div>

          <div className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-primary block">Language</label>
              <Select
                value={language}
                onChange={handleLanguageSelect}
                options={[
                  { value: 'English', label: 'English' },
                  { value: 'Thai', label: 'ไทย (Thai)' },
                ]}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-text-primary block">Date Format</label>
              <Select
                value={dateFormat}
                onChange={setDateFormat}
                options={[
                  { value: '04 Dec 2025', label: '04 Dec 2025' },
                  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                ]}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-text-primary block">Time Format</label>
              <Select
                value={timeFormat}
                onChange={setTimeFormat}
                options={[
                  { value: '24-hour (13:00)', label: '24-hour (13:00)' },
                  { value: '12-hour (1:00 PM)', label: '12-hour (1:00 PM)' },
                ]}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-text-primary block">Number Format</label>
              <Select
                value={numberFormat}
                onChange={setNumberFormat}
                options={[
                  { value: '1,234.56', label: '1,234.56' },
                  { value: '1.234,56', label: '1.234,56' },
                ]}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-text-primary block">Currency Display</label>
              <Select
                value={currencyDisplay}
                onChange={setCurrencyDisplay}
                options={[
                  { value: '฿1,234.56 (THB)', label: '฿1,234.56 (THB)' },
                  { value: '$1,234.56 (USD)', label: '$1,234.56 (USD)' },
                ]}
              />
            </div>
          </div>
        </Card>

        {/* Right Column: Accessibility Toggles */}
        <Card className="p-5 border-border-strong bg-surface space-y-4">
          <div className="border-b border-border/60 pb-3">
            <h3 className="font-display text-sm font-bold text-text-primary">Accessibility</h3>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border bg-surface-subtle">
              <div>
                <h4 className="text-xs font-bold text-text-primary">Reduce Motion</h4>
                <p className="text-[11px] text-text-secondary font-medium">Minimize animations throughout the app.</p>
              </div>
              <Switch checked={reduceMotion} onCheckedChange={setReduceMotion} ariaLabel="Toggle Reduce Motion" />
            </div>

            <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border bg-surface-subtle">
              <div>
                <h4 className="text-xs font-bold text-text-primary">Compact Layout</h4>
                <p className="text-[11px] text-text-secondary font-medium">Show more content in less space.</p>
              </div>
              <Switch checked={compactLayout} onCheckedChange={setCompactLayout} ariaLabel="Toggle Compact Layout" />
            </div>

            <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border bg-surface-subtle">
              <div>
                <h4 className="text-xs font-bold text-text-primary">Large Text</h4>
                <p className="text-[11px] text-text-secondary font-medium">Increase text size across the app.</p>
              </div>
              <Switch checked={largeText} onCheckedChange={setLargeText} ariaLabel="Toggle Large Text" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
