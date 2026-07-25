'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from '@/lib/i18n/navigation';
import { authClient } from '@/lib/auth/client';
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Terms of Service and acknowledge the Privacy Policy to create an account.',
  }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', acceptTerms: false },
  });

  async function onSubmit(data: RegisterFormData) {
    setServerError(null);
    try {
      const result = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        setServerError(result.error.message || 'Registration failed. Please try again.');
      }
    } catch (err: unknown) {
      console.error('[register] Unexpected error:', err);
      setServerError('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[20px]/[28px] font-[600] text-text-primary">
          Create your Wallflower account
        </h2>
        <p className="mt-1 text-[13px]/[20px] text-text-secondary">
          Create an account, then build the business baseline Wallflower uses for diagnostics and decision simulations.
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
        {/* Full name */}
        <div className="space-y-1.5">
          <label
            htmlFor="name"
            className="block text-[13px]/[18px] font-[550] text-text-primary"
          >
            Full name
          </label>
          <div className="relative">
            <User
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
              aria-hidden="true"
            />
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              className="w-full rounded-[var(--radius-sm)] border border-border dark:border-border-strong bg-surface px-3 py-2 pl-9 text-[15px]/[24px] text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:border-brand transition-colors"
              {...register('name')}
            />
          </div>
          {errors.name && (
            <p id="name-error" className="text-[12px]/[18px] text-danger">
              {errors.name.message}
            </p>
          )}
        </div>

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

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-[13px]/[18px] font-[550] text-text-primary"
            >
              Password
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
                className="w-full rounded-[var(--radius-sm)] border border-border dark:border-border-strong bg-surface px-3 py-2 pl-9 pr-10 text-[15px]/[24px] text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:border-brand transition-colors"
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

            {/* Password Strength Indicator */}
            <div className="space-y-1 pt-1">
              <div className="h-1.5 w-full bg-surface-subtle rounded-full overflow-hidden flex gap-1">
                <div className="h-full bg-brand/40 flex-1 transition-colors" />
                <div className="h-full bg-brand/60 flex-1 transition-colors" />
                <div className="h-full bg-brand flex-1 transition-colors" />
              </div>
              <p className="text-[11px] text-text-muted flex justify-between">
                <span>Minimum 8 characters</span>
                <span className="font-semibold text-brand">Secure Password Format</span>
              </p>
            </div>

            {errors.password && (
              <p id="password-error" className="text-[12px]/[18px] text-danger">
                {errors.password.message}
              </p>
            )}
          </div>

        {/* Required Registration Consent Checkbox */}
        <div className="space-y-1.5 pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              id="acceptTerms"
              type="checkbox"
              aria-invalid={!!errors.acceptTerms}
              aria-describedby={errors.acceptTerms ? 'acceptTerms-error' : undefined}
              className="mt-1 rounded accent-brand size-4 cursor-pointer shrink-0"
              {...register('acceptTerms')}
            />
            <span className="text-[13px]/[20px] text-text-secondary">
              I agree to the{' '}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand underline hover:text-brand-hover transition-colors"
              >
                Terms of Service
              </a>{' '}
              and acknowledge that I have read the{' '}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand underline hover:text-brand-hover transition-colors"
              >
                Privacy Policy
              </a>
              .
            </span>
          </label>
          {errors.acceptTerms && (
            <p id="acceptTerms-error" className="text-[12px]/[18px] text-danger">
              {errors.acceptTerms.message}
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
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-[12px]/[18px]">
          <span className="bg-surface-raised px-2 text-text-muted">or</span>
        </div>
      </div>

      {/* Google sign-up */}
      <button
        type="button"
        onClick={() => authClient.signIn.social({ provider: 'google' })}
        className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-border dark:border-border-strong bg-surface px-4 py-2.5 text-[15px]/[24px] font-[500] text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Sign up with Google
      </button>

      {/* Login link */}
      <p className="text-center text-[13px]/[20px] text-text-secondary">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-[550] text-brand hover:text-brand-hover transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
