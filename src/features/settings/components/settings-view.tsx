'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from '@/lib/i18n/navigation';
import { FadeIn } from '@/components/motion';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
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

export type SectionId =
  | 'profile'
  | 'business'
  | 'business-data'
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
            <div className="space-y-0.5">
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                {activeSectionObj.title}
              </h1>
              <p className="text-xs text-text-secondary font-medium">
                {activeSectionObj.subtitle}
              </p>
            </div>

            <Button
              type="button"
              onClick={handleGlobalSave}
              className="gap-2 text-xs font-bold bg-tertiary text-on-primary hover:bg-tertiary-hover shadow-2xs px-5 py-2 rounded-xl shrink-0 cursor-pointer self-start sm:self-auto"
            >
              <Save className="size-3.5" />
              <span>Save Changes</span>
            </Button>
          </div>

          {saveSuccessNotice && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-in fade-in-50">
              <Check className="size-4 shrink-0" />
              <span>All changes saved successfully!</span>
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
            {/* Left Sub-Navigation Bar (9 Items) */}
            <nav
              aria-label="Settings sub-navigation"
              className="hidden md:block w-[230px] shrink-0 rounded-2xl border border-border bg-surface p-2 space-y-1 sticky top-20 shadow-2xs"
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
                            ? 'bg-tertiary/15 text-tertiary border-l-3 border-l-tertiary font-extrabold shadow-2xs'
                            : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                        )}
                        aria-current={isSelected ? 'page' : undefined}
                      >
                        <Icon className={cn('size-4 shrink-0', isSelected ? 'text-tertiary' : 'text-text-muted')} />
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
