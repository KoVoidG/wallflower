'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from '@/lib/i18n/navigation';
import { authClient } from '@/lib/auth/client';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(data: LoginFormData) {
    setServerError(null);
    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        setServerError(result.error.message || 'Sign in failed. Please try again.');
      }
    } catch (err: unknown) {
      console.error('[login] Unexpected error:', err);
      setServerError('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[20px]/[28px] font-[600] text-text-primary">
          Welcome back
        </h2>
        <p className="mt-1 text-[13px]/[20px] text-text-secondary">
          Sign in to continue reviewing your business health, risks, and decisions.
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
              autoComplete="current-password"
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
          {errors.password && (
            <p id="password-error" className="text-[12px]/[18px] text-danger">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Forgot password link */}
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-[13px]/[18px] font-[450] text-brand hover:text-brand-hover transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-brand px-4 py-2.5 text-[15px]/[24px] font-[550] text-white hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />}
          {isSubmitting ? 'Signing in…' : 'Sign in'}
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

      {/* Google sign-in */}
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
        Sign in with Google
      </button>

      {/* Register link */}
      <p className="text-center text-[13px]/[20px] text-text-secondary">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-[550] text-brand hover:text-brand-hover transition-colors"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
