'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Lock, Shield, Monitor } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Surface } from '@/components/ui/surface';
import { H3, Body, Label, BodySmall } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth/client';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Required'),
    newPassword: z.string().min(8, 'Must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export function SecuritySettings() {
  const t = useTranslations('settingsPage');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const result = await authClient.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (result.error) {
        setError(t('errors.passwordIncorrect'));
      } else {
        setSuccess(true);
        reset();
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch {
      setError(t('errors.passwordIncorrect'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Surface border className="space-y-6">
      <H3>
        <Shield className="inline size-5 mr-2 align-text-bottom" aria-hidden="true" />
        {t('security.title')}
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
      {success && (
        <div
          role="status"
          className="rounded-[var(--radius-md)] border border-success bg-success-soft px-4 py-3 text-[14px] text-success"
        >
          {t('security.passwordChanged')}
        </div>
      )}

      {/* Password change form */}
      <form method="post" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="currentPassword"
            className="text-[13px]/[18px] font-[550] text-text-primary"
          >
            {t('security.currentPassword')}
          </label>
          <input
            id="currentPassword"
            type="password"
            autoComplete="current-password"
            {...register('currentPassword')}
            className={cn(
              'w-full rounded-[var(--radius-md)] border bg-surface px-3 py-2.5 text-[15px] text-text-primary transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20',
              errors.currentPassword ? 'border-danger' : 'border-border'
            )}
          />
          {errors.currentPassword && (
            <BodySmall className="text-danger">{errors.currentPassword.message}</BodySmall>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="newPassword"
            className="text-[13px]/[18px] font-[550] text-text-primary"
          >
            {t('security.newPassword')}
          </label>
          <input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            {...register('newPassword')}
            className={cn(
              'w-full rounded-[var(--radius-md)] border bg-surface px-3 py-2.5 text-[15px] text-text-primary transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20',
              errors.newPassword ? 'border-danger' : 'border-border'
            )}
          />
          {errors.newPassword && (
            <BodySmall className="text-danger">{errors.newPassword.message}</BodySmall>
          )}
          <BodySmall className="text-text-muted">
            <Lock className="inline size-3 mr-1" aria-hidden="true" />
            {t('security.passwordRequirements')}
          </BodySmall>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="confirmPassword"
            className="text-[13px]/[18px] font-[550] text-text-primary"
          >
            {t('security.confirmPassword')}
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...register('confirmPassword')}
            className={cn(
              'w-full rounded-[var(--radius-md)] border bg-surface px-3 py-2.5 text-[15px] text-text-primary transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20',
              errors.confirmPassword ? 'border-danger' : 'border-border'
            )}
          />
          {errors.confirmPassword && (
            <BodySmall className="text-danger">{errors.confirmPassword.message}</BodySmall>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={cn(
            'inline-flex items-center gap-2 rounded-[var(--radius-md)] px-5 py-2.5 text-[14px] font-[550] text-white transition-colors cursor-pointer',
            'bg-brand hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {loading ? t('security.changing') : t('security.changePassword')}
        </button>
      </form>

      {/* Active sessions */}
      <div className="border-t border-border pt-6 space-y-3">
        <Label as="p">{t('security.activeSessions')}</Label>
        <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-surface-subtle p-3">
          <Monitor className="size-5 text-text-muted shrink-0" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <Body className="text-text-primary font-[500]">{t('security.currentDevice')}</Body>
            <BodySmall className="text-text-muted">{t('security.thisSession')}</BodySmall>
          </div>
          <Badge variant="success">{t('security.active')}</Badge>
        </div>
        <button
          type="button"
          className="text-[14px] font-[550] text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          {t('security.signOutOther')}
        </button>
      </div>
    </Surface>
  );
}
