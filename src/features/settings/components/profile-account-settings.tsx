'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Shield, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';

interface ProfileAccountSettingsProps {
  onNavigateToSecurity?: () => void;
  onStateChange?: () => void;
}

export function ProfileAccountSettings({ onNavigateToSecurity, onStateChange }: ProfileAccountSettingsProps) {
  const t = useTranslations('settingsPage.profileAccount');
  const tCommon = useTranslations('settingsPage');

  const [displayName, setDisplayName] = useState('Somchai Wattana');
  const [preferredName, setPreferredName] = useState('Somchai');
  const [role, setRole] = useState('owner');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-text-primary">{t('title')}</h2>
        <p className="text-sm text-text-secondary">
          Personal identity, display details, email address, and role.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-success/40 bg-success-soft px-4 py-3 text-sm text-success font-medium">
          <Check className="size-4 shrink-0" />
          <span>{tCommon('saveBar.saved')}</span>
        </div>
      )}

      {/* Avatar Section */}
      <div className="rounded-lg border border-border bg-surface p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand text-white font-bold text-xl">
            SW
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-text-primary">Profile Photo</h3>
            <p className="text-xs text-text-muted">{t('avatarNotice')}</p>
          </div>
        </div>
      </div>

      {/* Profile Details Form */}
      <div className="rounded-lg border border-border bg-surface p-4 sm:p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Display Name */}
          <div className="space-y-1.5">
            <label htmlFor="displayName" className="text-xs font-semibold text-text-primary">
              {t('displayName')}
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                onStateChange?.();
              }}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-2 focus-visible:outline-brand"
            />
          </div>

          {/* Preferred Name */}
          <div className="space-y-1.5">
            <label htmlFor="preferredName" className="text-xs font-semibold text-text-primary">
              {t('preferredName')}
            </label>
            <input
              id="preferredName"
              type="text"
              value={preferredName}
              onChange={(e) => {
                setPreferredName(e.target.value);
                onStateChange?.();
              }}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-2 focus-visible:outline-brand"
            />
          </div>
        </div>

        {/* Email Address & Verification */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-primary">
            {t('email')}
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-md border border-border bg-surface-subtle p-3">
            <span className="text-sm font-medium text-text-primary">somchai@example.com</span>
            <Badge variant="success" dot className="self-start sm:self-center">
              {t('verified')}
            </Badge>
          </div>
        </div>

        {/* User Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/50">
          <div>
            <Select
              id="roleSelect"
              label={t('role')}
              value={role}
              onChange={(val) => {
                setRole(val);
                onStateChange?.();
              }}
              options={[
                { value: 'owner', label: t('roles.owner') },
                { value: 'manager', label: t('roles.manager') },
                { value: 'finance', label: t('roles.finance') },
                { value: 'operations', label: t('roles.operations') },
              ]}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-primary">
              {t('created')}
            </label>
            <div className="rounded-md border border-border bg-surface-subtle px-3 py-2 text-sm text-text-secondary">
              October 2025
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover transition-colors cursor-pointer"
          >
            {tCommon('saveBar.save')}
          </button>
        </div>
      </div>

      {/* Account Shortcuts */}
      <div className="rounded-lg border border-border bg-surface p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Shield className="size-5 text-brand shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Security & Passwords</h3>
            <p className="text-xs text-text-muted">Manage authentication details in the Security section.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onNavigateToSecurity}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer"
        >
          {t('goToSecurity')}
        </button>
      </div>
    </div>
  );
}
