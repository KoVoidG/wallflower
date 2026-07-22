'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Shield, Key, Laptop, Check, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function SecuritySettings() {
  const t = useTranslations('settingsPage.security');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changing, setChanging] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!currentPassword) {
      setError(t('passwordIncorrect'));
      return;
    }
    if (newPassword.length < 8) {
      setError(t('passwordRequirements'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setChanging(true);
    setTimeout(() => {
      setChanging(false);
      setMessage(t('passwordChanged'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setMessage(''), 4000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-text-primary">{t('title')}</h2>
        <p className="text-sm text-text-secondary">
          Manage password security, active device sessions, and authentication methods.
        </p>
      </div>

      {message && (
        <div className="flex items-center gap-2 rounded-lg border border-success/40 bg-success-soft px-4 py-3 text-sm text-success font-medium">
          <Check className="size-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-danger/40 bg-danger-soft px-4 py-3 text-sm text-danger font-medium">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Password Change Form */}
      <form onSubmit={handleChangePassword} className="rounded-lg border border-border bg-surface p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <Key className="size-4 text-brand" />
          <h3 className="text-base font-semibold text-text-primary">Change Password</h3>
        </div>

        <div className="space-y-3 max-w-md">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">{t('currentPassword')}</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-brand"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">{t('newPassword')}</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-brand"
            />
            <span className="text-[11px] text-text-muted">{t('passwordRequirements')}</span>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">{t('confirmPassword')}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-brand"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={changing}
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-50 transition-colors cursor-pointer"
          >
            {changing ? t('changing') : t('changePassword')}
          </button>
        </div>
      </form>

      {/* Connected Auth Methods */}
      <div className="rounded-lg border border-border bg-surface p-4 sm:p-6 space-y-4">
        <h3 className="text-base font-semibold text-text-primary border-b border-border/60 pb-3">
          {t('connectedAuth')}
        </h3>

        <div className="space-y-3 text-xs sm:text-sm">
          <div className="flex items-center justify-between rounded-md border border-border/60 bg-surface-subtle p-3">
            <span className="font-medium text-text-primary">{t('credentials')}</span>
            <Badge variant="success" dot>{t('active')}</Badge>
          </div>

          <div className="flex items-center justify-between rounded-md border border-border/60 bg-surface-subtle p-3 opacity-70">
            <span className="font-medium text-text-muted">{t('googleAuth')}</span>
            <span className="text-xs text-text-muted">Not connected</span>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="rounded-lg border border-border bg-surface p-4 sm:p-6 space-y-4">
        <h3 className="text-base font-semibold text-text-primary border-b border-border/60 pb-3">
          {t('activeSessions')}
        </h3>

        <div className="rounded-md border border-border/60 bg-surface-subtle p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Laptop className="size-5 text-brand shrink-0" />
            <div>
              <span className="text-sm font-semibold text-text-primary block">
                Chrome on Windows 11
              </span>
              <span className="text-xs text-text-muted">
                {t('thisSession')} • Bangkok, TH • Active now
              </span>
            </div>
          </div>
          <Badge variant="info">{t('active')}</Badge>
        </div>
      </div>

      {/* 2FA Card */}
      <div className="rounded-lg border border-border bg-surface-subtle p-4 sm:p-6 space-y-2 opacity-80">
        <div className="flex items-center gap-2">
          <Shield className="size-5 text-text-muted" />
          <h3 className="text-sm font-semibold text-text-primary">{t('twoFactorTitle')}</h3>
        </div>
        <p className="text-xs text-text-muted">{t('twoFactorDesc')}</p>
      </div>
    </div>
  );
}
