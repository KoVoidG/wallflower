'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { Link } from '@/lib/i18n/navigation';
import { authClient } from '@/lib/auth/client';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  async function onSubmit(data: ResetPasswordFormData) {
    setServerError(null);

    if (!token) {
      setServerError('Invalid or missing reset token. Please request a new reset link.');
      return;
    }

    try {
      const { error } = await authClient.resetPassword({
        newPassword: data.password,
        token,
      });

      if (error) {
        setServerError(
          error.message || 'Failed to reset password. Please try again.'
        );
      } else {
        setIsSuccess(true);
      }
    } catch (err: unknown) {
      console.error('[reset-password] Unexpected error:', err);
      setServerError('Something went wrong. Please try again.');
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-soft">
          <CheckCircle2 className="h-6 w-6 text-success" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-[20px]/[28px] font-[600] text-text-primary">
            Password reset successful
          </h2>
          <p className="mt-2 text-[13px]/[20px] text-text-secondary">
            Your password has been updated. You can now sign in with your new
            password.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-brand px-4 py-2.5 text-[15px]/[24px] font-[550] text-white hover:bg-brand-hover transition-colors"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="space-y-6 text-center">
        <div>
          <h2 className="text-[20px]/[28px] font-[600] text-text-primary">
            Invalid reset link
          </h2>
          <p className="mt-2 text-[13px]/[20px] text-text-secondary">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-brand px-4 py-2.5 text-[15px]/[24px] font-[550] text-white hover:bg-brand-hover transition-colors"
        >
          Request new link
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-[20px]/[28px] font-[600] text-text-primary">
          Reset your password
        </h2>
        <p className="mt-1 text-[13px]/[20px] text-text-secondary">
          Enter a new password for your account
        </p>
      </div>

      {serverError && (
        <div
          role="alert"
          className="rounded-[var(--radius-sm)] bg-danger-soft px-3 py-2 text-[13px]/[20px] text-danger"
        >
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} method="post" className="space-y-4" noValidate>
        {/* New password */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-[13px]/[18px] font-[550] text-text-primary"
          >
            New password
          </label>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
              aria-hidden="true"
            />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              className="w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 pl-9 pr-10 text-[15px]/[24px] text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:border-brand transition-colors"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="text-[12px]/[18px] text-danger">
              {errors.password.message}
            </p>
          )}
          <p className="text-[12px]/[18px] text-text-muted">
            Minimum 8 characters
          </p>
        </div>

        {/* Confirm password */}
        <div className="space-y-1.5">
          <label
            htmlFor="confirmPassword"
            className="block text-[13px]/[18px] font-[550] text-text-primary"
          >
            Confirm password
          </label>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
              aria-hidden="true"
            />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={
                errors.confirmPassword ? 'confirm-password-error' : undefined
              }
              className="w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 pl-9 pr-10 text-[15px]/[24px] text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:border-brand transition-colors"
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary cursor-pointer"
              aria-label={
                showConfirmPassword ? 'Hide password' : 'Show password'
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p
              id="confirm-password-error"
              className="text-[12px]/[18px] text-danger"
            >
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-brand px-4 py-2.5 text-[15px]/[24px] font-[550] text-white hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />}
          {isSubmitting ? 'Resetting…' : 'Reset password'}
        </button>
      </form>
    </div>
  );
}
