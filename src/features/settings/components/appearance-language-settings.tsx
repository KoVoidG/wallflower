// src/features/settings/components/appearance-language-settings.tsx
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useLocale } from 'next-intl';
import { Check } from 'lucide-react';
import { useRouter, usePathname } from '@/lib/i18n/navigation';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FadeInView } from '@/components/motion';

const ACCENT_COLORS = [
  { id: 'purple', bg: 'bg-[#8B5CF6]', name: 'Signature Purple' },
  { id: 'indigo', bg: 'bg-[#6366F1]', name: 'Indigo' },
  { id: 'emerald', bg: 'bg-emerald-500', name: 'Emerald' },
  { id: 'teal', bg: 'bg-teal-500', name: 'Teal' },
  { id: 'blue', bg: 'bg-blue-500', name: 'Blue' },
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
  const [selectedAccent, setSelectedAccent] = useState('purple');

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
      <FadeInView offset={10}>
        <Card className="p-6 rounded-2xl border-slate-100 dark:border-[#1E2638] bg-white dark:bg-[#111622] shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-[#1E2638] pb-3.5">
            <h3 className="font-display text-sm font-bold text-[#0F172A] dark:text-white">
              Appearance
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
              Choose your interface theme preference
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Light Mode Card */}
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer select-none relative space-y-3 ${
                mounted && theme === 'light'
                  ? 'border-[#6366F1] bg-purple-50/80 dark:bg-purple-950/40 shadow-xs ring-1 ring-[#6366F1]'
                  : 'border-slate-200/80 dark:border-[#1E2638] bg-white dark:bg-[#111622] hover:bg-slate-50 dark:hover:bg-[#1E2638]/50 shadow-2xs'
              }`}
            >
              {/* Visual Thumbnail */}
              <div className="h-16 rounded-xl bg-slate-100 border border-slate-200 p-2 space-y-1.5 overflow-hidden">
                <div className="flex items-center gap-1">
                  <div className="size-2 rounded-full bg-slate-300" />
                  <div className="w-10 h-1.5 rounded-full bg-slate-300" />
                </div>
                <div className="w-full h-8 rounded-lg bg-white border border-slate-200 p-1 space-y-1">
                  <div className="w-12 h-1.5 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]" />
                  <div className="w-20 h-1 rounded-full bg-slate-200" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">
                    Light
                  </h4>
                  <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-medium">
                    Clear and bright
                  </p>
                </div>
                {mounted && theme === 'light' && (
                  <div className="flex size-5 items-center justify-center rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-2xs">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                )}
              </div>
            </button>

            {/* Dark Mode Card */}
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer select-none relative space-y-3 ${
                mounted && theme === 'dark'
                  ? 'border-[#6366F1] bg-purple-50/80 dark:bg-purple-950/40 shadow-xs ring-1 ring-[#6366F1]'
                  : 'border-slate-200/80 dark:border-[#1E2638] bg-white dark:bg-[#111622] hover:bg-slate-50 dark:hover:bg-[#1E2638]/50 shadow-2xs'
              }`}
            >
              {/* Visual Thumbnail */}
              <div className="h-16 rounded-xl bg-zinc-900 border border-zinc-700 p-2 space-y-1.5 overflow-hidden">
                <div className="flex items-center gap-1">
                  <div className="size-2 rounded-full bg-zinc-700" />
                  <div className="w-10 h-1.5 rounded-full bg-zinc-700" />
                </div>
                <div className="w-full h-8 rounded-lg bg-zinc-800 border border-zinc-700 p-1 space-y-1">
                  <div className="w-12 h-1.5 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]" />
                  <div className="w-20 h-1 rounded-full bg-zinc-700" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">
                    Dark
                  </h4>
                  <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-medium">
                    Easy on the eyes
                  </p>
                </div>
                {mounted && theme === 'dark' && (
                  <div className="flex size-5 items-center justify-center rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-2xs">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                )}
              </div>
            </button>

            {/* System Theme Card */}
            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer select-none relative space-y-3 ${
                mounted && theme === 'system'
                  ? 'border-[#6366F1] bg-purple-50/80 dark:bg-purple-950/40 shadow-xs ring-1 ring-[#6366F1]'
                  : 'border-slate-200/80 dark:border-[#1E2638] bg-white dark:bg-[#111622] hover:bg-slate-50 dark:hover:bg-[#1E2638]/50 shadow-2xs'
              }`}
            >
              {/* Visual Thumbnail (Split) */}
              <div className="h-16 rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden flex">
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
                  <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">
                    System
                  </h4>
                  <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-medium">
                    Use system setting
                  </p>
                </div>
                {mounted && theme === 'system' && (
                  <div className="flex size-5 items-center justify-center rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-2xs">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                )}
              </div>
            </button>
          </div>
        </Card>
      </FadeInView>

      {/* ── 2. Accent Color ──────────────────────────────────────────────── */}
      <FadeInView offset={12}>
        <Card className="p-6 rounded-2xl border-slate-100 dark:border-[#1E2638] bg-white dark:bg-[#111622] shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-[#1E2638] pb-3.5">
            <h3 className="font-display text-sm font-bold text-[#0F172A] dark:text-white">
              Accent Color
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
              Select your primary brand accent tint
            </p>
          </div>

          <div className="flex items-center gap-3.5 flex-wrap">
            {ACCENT_COLORS.map((color) => {
              const isSelected = selectedAccent === color.id;
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedAccent(color.id)}
                  title={color.name}
                  className={`size-8 rounded-full ${color.bg} transition-all cursor-pointer flex items-center justify-center ${
                    isSelected
                      ? 'ring-3 ring-[#6366F1] ring-offset-2 ring-offset-white dark:ring-offset-[#111622] scale-110 shadow-sm'
                      : 'hover:scale-105 opacity-85 hover:opacity-100'
                  }`}
                >
                  {isSelected && (
                    <Check className="size-4 text-white stroke-[3]" />
                  )}
                </button>
              );
            })}
          </div>
        </Card>
      </FadeInView>

      {/* ── 3. Localization & Accessibility 2-Column Grid ────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Formats & Localization */}
        <FadeInView offset={14}>
          <Card className="p-6 rounded-2xl border-slate-100 dark:border-[#1E2638] bg-white dark:bg-[#111622] shadow-xs space-y-4">
            <div className="border-b border-slate-100 dark:border-[#1E2638] pb-3.5">
              <h3 className="font-display text-sm font-bold text-[#0F172A] dark:text-white">
                Localization & Formats
              </h3>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0F172A] dark:text-white block">
                  Language
                </label>
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
                <label className="text-xs font-bold text-[#0F172A] dark:text-white block">
                  Date Format
                </label>
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
                <label className="text-xs font-bold text-[#0F172A] dark:text-white block">
                  Time Format
                </label>
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
                <label className="text-xs font-bold text-[#0F172A] dark:text-white block">
                  Number Format
                </label>
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
                <label className="text-xs font-bold text-[#0F172A] dark:text-white block">
                  Currency Display
                </label>
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
        </FadeInView>

        {/* Right Column: Accessibility Toggles */}
        <FadeInView offset={14}>
          <Card className="p-6 rounded-2xl border-slate-100 dark:border-[#1E2638] bg-white dark:bg-[#111622] shadow-xs space-y-4">
            <div className="border-b border-slate-100 dark:border-[#1E2638] pb-3.5">
              <h3 className="font-display text-sm font-bold text-[#0F172A] dark:text-white">
                Accessibility
              </h3>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17]">
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">
                    Reduce Motion
                  </h4>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium">
                    Minimize animations throughout the app.
                  </p>
                </div>
                <Switch
                  checked={reduceMotion}
                  onCheckedChange={setReduceMotion}
                  ariaLabel="Toggle Reduce Motion"
                />
              </div>

              <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17]">
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">
                    Compact Layout
                  </h4>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium">
                    Show more content in less space.
                  </p>
                </div>
                <Switch
                  checked={compactLayout}
                  onCheckedChange={setCompactLayout}
                  ariaLabel="Toggle Compact Layout"
                />
              </div>

              <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17]">
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">
                    Large Text
                  </h4>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium">
                    Increase text size across the app.
                  </p>
                </div>
                <Switch
                  checked={largeText}
                  onCheckedChange={setLargeText}
                  ariaLabel="Toggle Large Text"
                />
              </div>
            </div>
          </Card>
        </FadeInView>
      </div>
    </div>
  );
}
