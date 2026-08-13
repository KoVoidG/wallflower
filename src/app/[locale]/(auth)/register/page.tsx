'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useRouter } from '@/lib/i18n/navigation';
import { authClient } from '@/lib/auth/client';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const registerSchema = z
  .object({
    name: z.string().min(1, 'Full name is required'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    businessName: z.string().min(1, 'Business name is required'),
    termsAgreed: z.boolean().refine((val) => val === true, 'You must agree to the Terms of Service'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const t = useTranslations('auth.register');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: 'Somchai Pattana',
      email: 'somchai@example.com',
      password: '',
      confirmPassword: '',
      businessName: 'Somchai Retail Store',
      termsAgreed: true,
    },
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
        setServerError(result.error.message || 'Sign up failed. Please try again.');
      } else {
        router.push('/onboarding');
      }
    } catch (err: unknown) {
      console.error('[register] Unexpected error:', err);
      // Fallback for prototype navigation
      router.push('/onboarding');
    }
  }

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      {/* Form Header */}
      <div className="space-y-1">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          {t('title')}
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary font-medium">
          {t('subtitle')}
        </p>
      </div>

      {serverError && (
        <div
          role="alert"
          className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-semibold text-rose-600 dark:text-rose-400"
        >
          {serverError}
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
        {/* Full Name */}
        <div className="space-y-1">
          <label htmlFor="name" className="block text-sm font-semibold text-text-primary">
            {t('fullNameLabel')}
          </label>
          <input
            id="name"
            type="text"
            placeholder="Somchai Pattana"
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-hidden focus:border-tertiary transition-colors shadow-2xs font-medium"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-xs font-semibold text-rose-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-semibold text-text-primary">
            {t('emailLabel')}
          </label>
          <input
            id="email"
            type="email"
            placeholder="somchai@example.com"
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-hidden focus:border-tertiary transition-colors shadow-2xs font-medium"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs font-semibold text-rose-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password & Confirm Password Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-semibold text-text-primary">
              {t('passwordLabel')}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 pr-9 text-sm text-text-primary placeholder:text-text-muted focus:outline-hidden focus:border-tertiary transition-colors shadow-2xs font-medium"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer p-1"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs font-semibold text-rose-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-text-primary">
              {t('confirmPasswordLabel')}
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-hidden focus:border-tertiary transition-colors shadow-2xs font-medium"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-xs font-semibold text-rose-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* Business Name */}
        <div className="space-y-1">
          <label htmlFor="businessName" className="block text-sm font-semibold text-text-primary">
            Business name
          </label>
          <input
            id="businessName"
            type="text"
            placeholder="Somchai Retail Store"
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-hidden focus:border-tertiary transition-colors shadow-2xs font-medium"
            {...register('businessName')}
          />
          {errors.businessName && (
            <p className="text-xs font-semibold text-rose-500">
              {errors.businessName.message}
            </p>
          )}
        </div>

        {/* Terms Agreement */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-text-secondary font-medium">
            <input
              type="checkbox"
              className="mt-0.5 rounded-md border-border text-emerald-600 focus:ring-emerald-500 accent-emerald-600 size-4 shrink-0"
              {...register('termsAgreed')}
            />
            <span>
              {t('agreeTerms')}
            </span>
          </label>
          {errors.termsAgreed && (
            <p className="text-xs font-semibold text-rose-500 mt-1">
              {errors.termsAgreed.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>{t('signUp')}...</span>
            </>
          ) : (
            <span>{t('signUp')}</span>
          )}
        </button>
      </form>

      {/* Or Divider */}
      <div className="relative my-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/60" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-3 font-bold text-text-muted">or</span>
        </div>
      </div>

      {/* Google Sign-In */}
      <button
        type="button"
        onClick={() => router.push('/onboarding')}
        className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-border-strong bg-surface py-2.5 text-xs sm:text-sm font-bold text-text-primary hover:bg-surface-hover transition-colors shadow-2xs cursor-pointer"
      >
        <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
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
        <span>Continue with Google</span>
      </button>

      {/* Bottom Login Link */}
      <p className="text-center text-xs font-semibold text-text-secondary pt-1">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-tertiary hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
