'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  User,
  Building2,
  Database,
  Sliders,
  Bell,
  Palette,
  ShieldCheck,
  Shield,
  Sparkles,
  Check,
  Save,
  Plug,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from '@/lib/i18n/navigation';
import { FadeIn } from '@/components/motion';
import { Select } from '@/components/ui/select';
import { AppPage } from '@/components/ui/layout';

import { ProfileAccountSettings } from './profile-account-settings';
import { BusinessProfileSettings } from './business-profile-settings';
import { BusinessDataSettings } from './business-data-settings';
import { SimulationSettings } from './simulation-settings';
import { NotificationSettings } from './notification-settings';
import { AppearanceLanguageSettings } from './appearance-language-settings';
import { DataPrivacySettings } from './data-privacy-settings';
import { SecuritySettings } from './security-settings';
import { PlanUsageSettings } from './plan-usage-settings';
import { OperationalIntegrationsView } from '@/features/integrations/components/operational-integrations-view';

export type SectionId =
  | 'profile'
  | 'business'
  | 'business-data'
  | 'integrations'
  | 'simulation'
  | 'notifications'
  | 'appearance'
  | 'privacy'
  | 'security'
  | 'plan';

interface SectionItem {
  id: SectionId;
  label: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SECTIONS: readonly SectionItem[] = [
  {
    id: 'profile',
    label: 'Profile & Account',
    title: 'Profile & Account',
    subtitle: 'Manage your personal information and account settings.',
    icon: User,
  },
  {
    id: 'business',
    label: 'Business Profile',
    title: 'Business Profile',
    subtitle: 'Manage your business identity and basic information.',
    icon: Building2,
  },
  {
    id: 'business-data',
    label: 'Business Data',
    title: 'Business Data',
    subtitle: 'Maintain your financial, operational and inventory data.',
    icon: Database,
  },
  {
    id: 'integrations',
    label: 'App Integrations',
    title: 'App Integrations',
    subtitle: 'Manage connected external apps and operational data sources.',
    icon: Plug,
  },
  {
    id: 'simulation',
    label: 'Simulation Settings',
    title: 'Simulation Settings',
    subtitle: 'Configure how simulations are calculated and displayed.',
    icon: Sliders,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    title: 'Notifications',
    subtitle: 'Choose how and when you want to be notified.',
    icon: Bell,
  },
  {
    id: 'appearance',
    label: 'Appearance & Language',
    title: 'Appearance & Language',
    subtitle: 'Customize how Wallflower looks and feels.',
    icon: Palette,
  },
  {
    id: 'privacy',
    label: 'Data & Privacy',
    title: 'Data & Privacy',
    subtitle: 'Manage your data and privacy preferences.',
    icon: ShieldCheck,
  },
  {
    id: 'security',
    label: 'Security',
    title: 'Security',
    subtitle: 'Secure your account and manage access.',
    icon: Shield,
  },
  {
    id: 'plan',
    label: 'Plan & Billing',
    title: 'Plan & Billing',
    subtitle: 'Manage your subscription and billing information.',
    icon: Sparkles,
  },
] as const;

function SettingsContent() {
  const tCommon = useTranslations('common');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const paramSection = (searchParams.get('section') as SectionId) || 'profile';
  const activeSectionObj = SECTIONS.find((s) => s.id === paramSection) || SECTIONS[0];
  const activeSection: SectionId = activeSectionObj.id;

  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  const handleSelectSection = (id: SectionId) => {
    router.replace(`${pathname}?section=${id}`);
  };

  const handleGlobalSave = () => {
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  return (
    <AppPage>
      <FadeIn>
        <div data-tour="settings-view" className="mx-auto max-w-[1240px] space-y-6">
          {/* Top Section Header with Title, Description, and Save Changes Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-[#1E2638] pb-4">
            <div className="space-y-0.5">
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white">
                {activeSectionObj.title}
              </h1>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">
                {activeSectionObj.subtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={handleGlobalSave}
              className="inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:opacity-95 shadow-md shadow-indigo-500/25 px-5 py-2.5 rounded-xl shrink-0 cursor-pointer self-start sm:self-auto transition-all"
            >
              <Save className="size-4" />
              <span>{tCommon('saveChanges')}</span>
            </button>
          </div>

          {saveSuccessNotice && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-in fade-in-50">
              <Check className="size-4 shrink-0" />
              <span>{tCommon('saved')}</span>
            </div>
          )}

          {/* Mobile Select */}
          <div className="block md:hidden">
            <Select
              id="mobileSectionSelect"
              value={activeSection}
              onChange={(val) => handleSelectSection(val as SectionId)}
              options={SECTIONS.map((section) => ({
                value: section.id,
                label: section.label,
              }))}
            />
          </div>

          {/* Main 2-Column Settings Layout (Left Nav + Right Content) */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Left Sub-Navigation Bar */}
            <nav
              aria-label="Settings sub-navigation"
              className="hidden md:block w-[230px] shrink-0 rounded-2xl border border-slate-200/80 dark:border-[#1E2638] bg-white dark:bg-[#111622] p-2 space-y-1 sticky top-20 shadow-xs"
            >
              <ul className="flex flex-col gap-0.5" role="list">
                {SECTIONS.map((section) => {
                  const isSelected = activeSection === section.id;
                  const Icon = section.icon;

                  return (
                    <li key={section.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectSection(section.id)}
                        className={cn(
                          'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-left transition-all cursor-pointer select-none',
                          isSelected
                            ? 'bg-purple-50 dark:bg-purple-950/50 text-[#6366F1] dark:text-[#A5B4FC] border-l-3 border-l-[#6366F1] font-extrabold shadow-2xs'
                            : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1E2638] hover:text-[#0F172A] dark:hover:text-white'
                        )}
                        aria-current={isSelected ? 'page' : undefined}
                      >
                        <Icon className={cn('size-4 shrink-0', isSelected ? 'text-[#6366F1] dark:text-[#A5B4FC]' : 'text-[#94A3B8]')} />
                        <span className="truncate">{section.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Right Settings Content */}
            <main className="flex-1 min-w-0 max-w-[950px] w-full">
              {activeSection === 'profile' && (
                <ProfileAccountSettings
                  onNavigateToSecurity={() => handleSelectSection('security')}
                />
              )}
              {activeSection === 'business' && <BusinessProfileSettings />}
              {activeSection === 'business-data' && <BusinessDataSettings />}
              {activeSection === 'integrations' && <OperationalIntegrationsView />}
              {activeSection === 'simulation' && <SimulationSettings />}
              {activeSection === 'notifications' && <NotificationSettings />}
              {activeSection === 'appearance' && <AppearanceLanguageSettings />}
              {activeSection === 'privacy' && <DataPrivacySettings />}
              {activeSection === 'security' && <SecuritySettings />}
              {activeSection === 'plan' && <PlanUsageSettings />}
            </main>
          </div>
        </div>
      </FadeIn>
    </AppPage>
  );
}

export function SettingsView() {
  return (
    <Suspense fallback={<div className="p-8 text-xs font-bold text-text-muted">Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
