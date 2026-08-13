'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from '@/lib/i18n/navigation';
import { authClient } from '@/lib/auth/client';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

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

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-soft">
          <CheckCircle2 className="h-6 w-6 text-success" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-[20px]/[28px] font-[600] text-text-primary">
            Check your email
          </h2>
          <p className="mt-2 text-[13px]/[20px] text-text-secondary">
            If an account exists with that email, we&apos;ve sent a password
            reset link. Please check your inbox and spam folder.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-[13px]/[18px] font-[550] text-brand hover:text-brand-hover transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[20px]/[28px] font-[600] text-text-primary">
          Reset your password
        </h2>
        <p className="mt-1 text-[13px]/[20px] text-text-secondary">
          Enter your account email and we&apos;ll send instructions for restoring access.
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
        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-[13px]/[18px] font-[550] text-text-primary"
          >
            Email
          </label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
              aria-hidden="true"
            />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className="w-full rounded-[var(--radius-sm)] border border-border dark:border-border-strong bg-surface px-3 py-2 pl-9 text-[15px]/[24px] text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:border-brand transition-colors"
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p id="email-error" className="text-[12px]/[18px] text-danger">
              {errors.email.message}
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
          {isSubmitting ? 'Sending…' : 'Send reset link'}
        </button>
      </form>

      {/* Back to login */}
      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-[13px]/[18px] font-[550] text-brand hover:text-brand-hover transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
