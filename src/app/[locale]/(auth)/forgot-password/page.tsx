'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from '@/lib/i18n/navigation';
import { authClient } from '@/lib/auth/client';
import { Mail, ArrowLeft, Loader2, CheckCircle2, X } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    setServerError(null);
    try {
      const result = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: '/reset-password',
      });

      if (result.error) {
        setServerError(
          result.error.message || 'Failed to send reset link. Please try again.'
        );
      } else {
        setIsSuccess(true);
      }
    } catch (err: unknown) {
      console.error('[forgot-password] Unexpected error:', err);
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
              Check Your Email
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
              If an account exists with that email, we&apos;ve sent reset instructions to restore access.
            </p>
          </div>
          <div className="pt-3">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#8B5CF6] text-white py-3.5 text-sm font-bold shadow-md shadow-purple-500/25 hover:opacity-95 transition-all"
            >
              <ArrowLeft className="size-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="space-y-1.5 mb-6">
            <h1 className="font-display text-2xl sm:text-[26px] font-bold text-slate-900 dark:text-white tracking-tight">
              Reset your password
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">
              Enter your email address to receive password reset instructions.
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left" noValidate>
            {/* Email */}
            <div className="space-y-1">
              <div className="relative">
                <Mail className="size-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/60 pl-11 pr-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-brand focus:ring-1 focus:ring-brand/30 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-xs font-semibold text-rose-500 pl-2">{errors.email.message}</p>
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
                  <span>Sending Link...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </form>

          {/* Back to login */}
          <div className="text-center pt-5">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
