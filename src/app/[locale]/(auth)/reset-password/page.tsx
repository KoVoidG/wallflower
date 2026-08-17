'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { Link } from '@/lib/i18n/navigation';
import { authClient } from '@/lib/auth/client';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

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

  return (
    <div className="relative rounded-[32px] border border-purple-100/90 dark:border-purple-900/30 bg-gradient-to-b from-white via-white to-[#F3E8FF] dark:from-[#110E1B] dark:via-[#110E1B] dark:to-[#2E1065]/40 p-7 sm:p-9 shadow-2xl shadow-purple-950/10 dark:shadow-purple-950/40 overflow-hidden text-center animate-in fade-in duration-200">
      {/* Top Right Close Button */}
      <Link
        href="/login"
        className="absolute top-6 right-6 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors"
        aria-label="Back to login"
      >
        <X className="size-4" />
      </Link>

      {/* Top Brand Logo */}
      <div className="flex justify-center mb-6 pt-1">
        <Link href="/" className="inline-block transition-transform hover:scale-105">
          <Logo size="md" wordmarkClassName="text-2xl font-bold tracking-tight text-slate-900 dark:text-white" />
        </Link>
      </div>

      {isSuccess ? (
        <div className="space-y-4 text-center py-2">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2 className="size-7 text-emerald-500" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Password Updated
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
              Your password has been securely reset. You can now sign in with your new credentials.
            </p>
          </div>
          <div className="pt-3">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#8B5CF6] text-white py-3.5 text-sm font-bold shadow-md shadow-purple-500/25 hover:opacity-95 transition-all"
            >
              <span>Sign In to Workspace</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      ) : !token ? (
        <div className="space-y-4 text-center py-2">
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Invalid Reset Link
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
              This password reset link is invalid or has expired.
            </p>
          </div>
          <div className="pt-3">
            <Link
              href="/forgot-password"
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#8B5CF6] text-white py-3.5 text-sm font-bold shadow-md shadow-purple-500/25 hover:opacity-95 transition-all"
            >
              <span>Request New Link</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="space-y-1.5 mb-6">
            <h1 className="font-display text-2xl sm:text-[26px] font-bold text-slate-900 dark:text-white tracking-tight">
              Set new password
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">
              Enter a strong new password for your Wallflower account.
            </p>
          </div>

          {serverError && (
            <div
              role="alert"
              className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 mb-4 text-left"
            >
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 text-left" noValidate>
            {/* New password */}
            <div className="space-y-1">
              <div className="relative">
                <Lock className="size-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New Password"
                  className="w-full rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/60 pl-11 pr-11 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-brand focus:ring-1 focus:ring-brand/30 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-semibold text-rose-500 pl-2">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-1">
              <div className="relative">
                <Lock className="size-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  className="w-full rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/60 pl-11 pr-11 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-brand focus:ring-1 focus:ring-brand/30 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs font-semibold text-rose-500 pl-2">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#8B5CF6] text-white py-3.5 text-sm font-bold shadow-md shadow-purple-500/25 hover:opacity-95 transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50 mt-1 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save New Password</span>
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
