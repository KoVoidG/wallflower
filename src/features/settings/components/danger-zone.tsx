'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Surface } from '@/components/ui/surface';
import { H3, Body, Label, BodySmall } from '@/components/ui/typography';
import { Dialog } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { deleteAccount } from '@/features/settings/adapters/settings.adapter';

type DeletionStep = 'idle' | 'warning' | 'confirm-name' | 'confirm-password' | 'deleting';

export function DangerZone() {
  const t = useTranslations('settingsPage');
  const [step, setStep] = useState<DeletionStep>('idle');
  const [businessNameInput, setBusinessNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  const expectedBusinessName = 'Wattana Coffee Co.';

  const handleStartDeletion = () => {
    setStep('warning');
    setError('');
  };

  const handleConfirmWarning = () => {
    setStep('confirm-name');
  };

  const handleConfirmName = () => {
    if (businessNameInput !== expectedBusinessName) {
      setError(t('danger.nameNoMatch'));
      return;
    }
    setError('');
    setStep('confirm-password');
  };

  const handleDelete = async () => {
    setStep('deleting');
    setError('');

    try {
      const result = await deleteAccount(businessNameInput, passwordInput);
      if (result.success) {
        // In a real app, redirect to a goodbye page
        window.location.href = '/';
      } else {
        if (result.error === 'reauthentication_failed') {
          setError(t('errors.sessionExpired'));
        } else {
          setError(t('errors.deleteFailed'));
        }
        setStep('confirm-password');
      }
    } catch {
      setError(t('errors.deleteFailed'));
      setStep('confirm-password');
    }
  };

  const handleCancel = () => {
    setStep('idle');
    setBusinessNameInput('');
    setPasswordInput('');
    setError('');
  };

  return (
    <Surface border className="space-y-4 border-danger/30">
      <H3 className="text-danger">
        <AlertTriangle className="inline size-5 mr-2 align-text-bottom" aria-hidden="true" />
        {t('danger.title')}
      </H3>
      <Body>{t('danger.description')}</Body>

      {/* Error banner */}
      {error && (
        <div
          role="alert"
          className="rounded-[var(--radius-md)] border border-danger bg-danger-soft px-4 py-3 text-[14px] text-danger"
        >
          {error}
        </div>
      )}

      {step === 'idle' && (
        <button
          type="button"
          onClick={handleStartDeletion}
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-danger px-4 py-2.5 text-[14px] font-[550] text-danger transition-colors hover:bg-danger-soft cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
        >
          <Trash2 className="size-4" aria-hidden="true" />
          {t('danger.deleteAccount')}
        </button>
      )}

      {/* Deletion confirmation dialog */}
      <Dialog
        open={step !== 'idle'}
        onClose={handleCancel}
        title={t('danger.warningTitle')}
        size="sm"
        dismissOnBackdrop={step !== 'deleting'}
      >
        {/* Step 1: Warning */}
        {step === 'warning' && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <AlertTriangle className="size-5 text-danger shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-2">
                <Body className="text-text-secondary">{t('danger.warningMessage')}</Body>
                <ul className="list-disc list-inside space-y-1 text-[14px] text-text-secondary">
                  <li>{t('danger.warningItem1')}</li>
                  <li>{t('danger.warningItem2')}</li>
                  <li>{t('danger.warningItem3')}</li>
                </ul>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleConfirmWarning}
                className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-danger px-4 py-2.5 text-[14px] font-[550] text-white transition-colors hover:bg-danger/90 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
              >
                {t('danger.iUnderstand')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-[var(--radius-md)] border border-border px-4 py-2.5 text-[14px] font-[550] text-text-secondary transition-colors hover:bg-surface-subtle cursor-pointer"
              >
                {t('danger.cancel')}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Type business name */}
        {step === 'confirm-name' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label as="p">{t('danger.typeBusinessName')}</Label>
              <BodySmall className="text-text-muted">
                {t('danger.typeHint', { name: expectedBusinessName })}
              </BodySmall>
              <input
                type="text"
                value={businessNameInput}
                onChange={(e) => setBusinessNameInput(e.target.value)}
                placeholder={expectedBusinessName}
                className="w-full rounded-[var(--radius-md)] border border-danger/50 bg-surface px-3 py-2.5 text-[15px] text-text-primary placeholder:text-text-muted transition-colors focus:border-danger focus:outline-none focus:ring-2 focus:ring-danger/20"
                aria-label={t('danger.typeBusinessName')}
              />
            </div>
            {error && (
              <div role="alert" className="text-[13px] text-danger">
                {error}
              </div>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleConfirmName}
                disabled={businessNameInput !== expectedBusinessName}
                className={cn(
                  'inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-danger px-4 py-2.5 text-[14px] font-[550] text-white transition-colors cursor-pointer',
                  'hover:bg-danger/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {t('danger.continue')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-[var(--radius-md)] border border-border px-4 py-2.5 text-[14px] font-[550] text-text-secondary transition-colors hover:bg-surface-subtle cursor-pointer"
              >
                {t('danger.cancel')}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Enter password */}
        {(step === 'confirm-password' || step === 'deleting') && (
          <form
            method="post"
            onSubmit={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label as="p">{t('danger.enterPassword')}</Label>
              <BodySmall className="text-text-muted">
                {t('danger.passwordHint')}
              </BodySmall>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded-[var(--radius-md)] border border-danger/50 bg-surface px-3 py-2.5 text-[15px] text-text-primary transition-colors focus:border-danger focus:outline-none focus:ring-2 focus:ring-danger/20"
                aria-label={t('danger.enterPassword')}
              />
            </div>
            {error && (
              <div role="alert" className="text-[13px] text-danger">
                {error}
              </div>
            )}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={step === 'deleting' || !passwordInput}
                className={cn(
                  'inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-danger px-4 py-2.5 text-[14px] font-[550] text-white transition-colors cursor-pointer',
                  'hover:bg-danger/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                <Trash2 className="size-4" aria-hidden="true" />
                {step === 'deleting'
                  ? t('danger.deleting')
                  : t('danger.deletePermanently')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={step === 'deleting'}
                className="rounded-[var(--radius-md)] border border-border px-4 py-2.5 text-[14px] font-[550] text-text-secondary transition-colors hover:bg-surface-subtle cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('danger.cancel')}
              </button>
            </div>
          </form>
        )}
      </Dialog>
    </Surface>
  );
}
