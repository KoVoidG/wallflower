'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  User,
  Building2,
  Sliders,
  Bell,
  Palette,
  ShieldCheck,
  Shield,
  Sparkles,
  Settings as SettingsIcon,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from '@/lib/i18n/navigation';
import { FadeIn } from '@/components/motion';
import { Select } from '@/components/ui/select';
import { AppPage, PageHeader } from '@/components/ui/layout';
import {
  ProfileAccountSettings,
  BusinessProfileSettings,
  AnalysisPreferencesSettings,
  NotificationSettings,
  AppearanceLanguageSettings,
  DataPrivacySettings,
  SecuritySettings,
  PlanUsageSettings,
} from '@/features/settings/components';

type SectionId =
  | 'profile'
  | 'business'
  | 'analysis'
  | 'notifications'
  | 'appearance'
  | 'privacy'
  | 'security'
  | 'plan';

interface SectionItem {
  id: SectionId;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SECTIONS: readonly SectionItem[] = [
  { id: 'profile', labelKey: 'profile', icon: User },
  { id: 'business', labelKey: 'business', icon: Building2 },
  { id: 'analysis', labelKey: 'analysis', icon: Sliders },
  { id: 'notifications', labelKey: 'notifications', icon: Bell },
  { id: 'appearance', labelKey: 'appearance', icon: Palette },
  { id: 'privacy', labelKey: 'privacy', icon: ShieldCheck },
  { id: 'security', labelKey: 'security', icon: Shield },
  { id: 'plan', labelKey: 'plan', icon: Sparkles },
] as const;

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('settingsPage');

  const paramSection = (searchParams.get('section') as SectionId) || 'profile';
  const activeSection: SectionId = SECTIONS.some((s) => s.id === paramSection)
    ? paramSection
    : 'profile';

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  const handleSelectSection = (id: SectionId) => {
    setHasUnsavedChanges(false);
    router.replace(`${pathname}?section=${id}`);
  };

  const handleSaveGlobal = () => {
    setHasUnsavedChanges(false);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handleDiscardGlobal = () => {
    setHasUnsavedChanges(false);
  };

  return (
    <AppPage>
      <FadeIn>
        <div data-tour="settings-view" className="mx-auto max-w-[1200px] space-y-6">
          {/* Page Header */}
          <PageHeader
            title={
              <div className="flex items-center gap-2.5">
                <SettingsIcon className="size-5 text-brand shrink-0" aria-hidden="true" />
                <span>{t('pageTitle')}</span>
              </div>
            }
            description={t('subtitle')}
          />

          {/* Global Save Notice Banner */}
          {saveSuccessNotice && (
            <div className="flex items-center gap-2 rounded-lg border border-success/40 bg-success-soft px-4 py-3 text-xs sm:text-sm text-success font-medium">
              <Check className="size-4 shrink-0" />
              <span>{t('saveBar.saved')}</span>
            </div>
          )}

          {/* Mobile Section Selector (< md) */}
          <div className="block md:hidden">
            <Select
              id="mobileSectionSelect"
              value={activeSection}
              onChange={(val) => handleSelectSection(val as SectionId)}
              options={SECTIONS.map((section) => ({
                value: section.id,
                label: t(`sections.${section.labelKey}`),
              }))}
            />
          </div>

          {/* Desktop Two-Column Layout Workspace (>= md) */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Left Internal Settings Navigation List */}
            <nav
              aria-label="Settings navigation"
              className="hidden md:block w-[240px] shrink-0 rounded-xl border border-border bg-surface p-2 space-y-1 sticky top-20"
            >
              <ul className="flex flex-col gap-0.5" role="list">
                {SECTIONS.map((section) => {
                  const isSelected = activeSection === section.id;
                  const Icon = section.icon;
                  const label = t(`sections.${section.labelKey}`);

                  return (
                    <li key={section.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectSection(section.id)}
                        className={cn(
                          'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium text-left transition-colors cursor-pointer',
                          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                          isSelected
                            ? 'bg-brand-soft text-brand font-semibold border-l-2 border-l-brand'
                            : 'text-text-secondary hover:bg-surface-subtle hover:text-text-primary'
                        )}
                        aria-current={isSelected ? 'page' : undefined}
                      >
                        <Icon className={cn('size-4 shrink-0', isSelected ? 'text-brand' : 'text-text-muted')} />
                        <span className="truncate">{label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Right Main Settings Content Area */}
            <main className="flex-1 min-w-0 max-w-[840px] w-full">
              {activeSection === 'profile' && (
                <ProfileAccountSettings
                  onNavigateToSecurity={() => handleSelectSection('security')}
                  onStateChange={() => setHasUnsavedChanges(true)}
                />
              )}
              {activeSection === 'business' && <BusinessProfileSettings />}
              {activeSection === 'analysis' && (
                <AnalysisPreferencesSettings onStateChange={() => setHasUnsavedChanges(true)} />
              )}
              {activeSection === 'notifications' && <NotificationSettings />}
              {activeSection === 'appearance' && <AppearanceLanguageSettings />}
              {activeSection === 'privacy' && <DataPrivacySettings />}
              {activeSection === 'security' && <SecuritySettings />}
              {activeSection === 'plan' && <PlanUsageSettings />}
            </main>
          </div>

          {/* Persistent Save Bar when Unsaved Changes exist */}
          {hasUnsavedChanges && (
            <div className="fixed bottom-4 inset-x-4 max-w-xl mx-auto z-40 rounded-xl border border-border bg-surface p-3 sm:p-4 shadow-xl flex items-center justify-between gap-4 animate-in slide-in-from-bottom-5">
              <span className="text-xs sm:text-sm font-medium text-text-primary">
                {t('saveBar.unsavedChanges')}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDiscardGlobal}
                  className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-surface-subtle transition-colors cursor-pointer"
                >
                  {t('saveBar.discard')}
                </button>
                <button
                  type="button"
                  onClick={handleSaveGlobal}
                  className="rounded-lg bg-brand px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-hover transition-colors cursor-pointer shadow-xs"
                >
                  {t('saveBar.save')}
                </button>
              </div>
            </div>
          )}
        </div>
      </FadeIn>
    </AppPage>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-text-muted text-xs">Loading Settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
