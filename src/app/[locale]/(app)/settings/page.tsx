'use client';

import { useTranslations } from 'next-intl';
import { Settings } from 'lucide-react';
import { FadeIn } from '@/components/motion';
import { H2 } from '@/components/ui/typography';
import {
  AppearanceSettings,
  ProfileSettings,
  SecuritySettings,
  DangerZone,
} from '@/features/settings/components';

export default function SettingsPage() {
  const t = useTranslations('settingsPage');

  return (
    <FadeIn>
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 md:px-6">
        <div className="flex items-center gap-3">
          <Settings className="size-7 text-text-muted" aria-hidden="true" />
          <H2>{t('pageTitle')}</H2>
        </div>

        {/* Appearance & Language */}
        <section id="appearance" aria-labelledby="appearance-heading">
          <span id="appearance-heading" className="sr-only">
            {t('appearance.title')}
          </span>
          <AppearanceSettings />
        </section>

        {/* Profile & Business */}
        <section id="profile" aria-labelledby="profile-heading">
          <span id="profile-heading" className="sr-only">
            {t('profile.title')}
          </span>
          <ProfileSettings />
        </section>

        {/* Security */}
        <section id="security" aria-labelledby="security-heading">
          <span id="security-heading" className="sr-only">
            {t('security.title')}
          </span>
          <SecuritySettings />
        </section>

        {/* Danger Zone */}
        <section id="danger-zone" aria-labelledby="danger-heading">
          <span id="danger-heading" className="sr-only">
            {t('danger.title')}
          </span>
          <DangerZone />
        </section>
      </div>
    </FadeIn>
  );
}
