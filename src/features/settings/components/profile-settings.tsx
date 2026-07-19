'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { User } from 'lucide-react';
import { Surface } from '@/components/ui/surface';
import { H3, Body, Label, BodySmall } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  getProfile,
  updateProfile,
  type UserProfile,
} from '@/features/settings/adapters/settings.adapter';

export function ProfileSettings() {
  const t = useTranslations('settingsPage');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      const result = await getProfile();
      if (result.success && result.data) {
        setProfile(result.data);
        setDisplayName(result.data.displayName);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!displayName.trim()) return;
    setSaving(true);
    setError('');
    setSaveSuccess(false);

    try {
      const result = await updateProfile({ displayName: displayName.trim() });
      if (result.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError(t('errors.saveFailed'));
      }
    } catch {
      setError(t('errors.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <Surface border className="animate-pulse motion-reduce:animate-none space-y-4">
        <div className="h-7 w-48 rounded bg-surface-subtle" />
        <div className="h-10 w-full rounded bg-surface-subtle" />
        <div className="h-10 w-full rounded bg-surface-subtle" />
      </Surface>
    );
  }

  return (
    <Surface border className="space-y-6">
      <H3>
        <User className="inline size-5 mr-2 align-text-bottom" aria-hidden="true" />
        {t('profile.title')}
      </H3>

      {/* Error banner */}
      {error && (
        <div
          role="alert"
          className="rounded-[var(--radius-md)] border border-danger bg-danger-soft px-4 py-3 text-[14px] text-danger"
        >
          {error}
        </div>
      )}

      {/* Success banner */}
      {saveSuccess && (
        <div
          role="status"
          className="rounded-[var(--radius-md)] border border-success bg-success-soft px-4 py-3 text-[14px] text-success"
        >
          {t('profile.saved')}
        </div>
      )}

      {/* Avatar placeholder */}
      <div className="flex items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-brand-soft text-brand">
          <User className="size-8" aria-hidden="true" />
        </div>
        <div>
          <Body className="text-text-muted">{t('profile.avatarPlaceholder')}</Body>
        </div>
      </div>

      {/* Display name */}
      <div className="space-y-1.5">
        <label htmlFor="displayName" className="text-[13px]/[18px] font-[550] text-text-primary">
          {t('profile.displayName')}
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2.5 text-[15px] text-text-primary placeholder:text-text-muted transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      </div>

      {/* Email (read-only) */}
      <div className="space-y-1.5">
        <Label as="p">{t('profile.email')}</Label>
        <div className="flex items-center gap-2">
          <span className="text-[15px] text-text-secondary">{profile.email}</span>
          <Badge variant={profile.emailVerified ? 'success' : 'warning'}>
            {profile.emailVerified ? t('profile.verified') : t('profile.unverified')}
          </Badge>
        </div>
      </div>

      {/* Business info (read-only) */}
      <div className="space-y-3 rounded-[var(--radius-md)] border border-border bg-surface-subtle p-4">
        <Label as="p">{t('profile.businessInfo')}</Label>
        <div className="grid gap-2 text-[14px]">
          <div className="flex justify-between">
            <span className="text-text-muted">{t('profile.businessName')}</span>
            <span className="text-text-primary font-[500]">{profile.businessName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">{t('profile.industry')}</span>
            <span className="text-text-primary font-[500]">{profile.industry}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">{t('profile.location')}</span>
            <span className="text-text-primary font-[500]">{profile.location}</span>
          </div>
        </div>
        <BodySmall className="text-text-muted">{t('profile.editHint')}</BodySmall>
      </div>

      {/* Save button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving || displayName === profile.displayName}
        className={cn(
          'inline-flex items-center gap-2 rounded-[var(--radius-md)] px-5 py-2.5 text-[14px] font-[550] text-white transition-colors cursor-pointer',
          'bg-brand hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {saving ? t('profile.saving') : t('profile.save')}
      </button>
    </Surface>
  );
}
