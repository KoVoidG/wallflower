'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useRouter } from '@/lib/i18n/navigation';
import { authClient } from '@/lib/auth/client';
import { Eye, EyeOff, Loader2, Lock, Mail, X } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'somchai@example.com',
      password: '',
    },
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
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      console.error('[login] Unexpected error:', err);
      router.push('/dashboard');
    }
  }

  return (
    <div className="relative rounded-[32px] border border-purple-100/90 dark:border-purple-900/30 bg-gradient-to-b from-white via-white to-[#F3E8FF] dark:from-[#110E1B] dark:via-[#110E1B] dark:to-[#2E1065]/40 p-7 sm:p-9 shadow-2xl shadow-purple-950/10 dark:shadow-purple-950/40 overflow-hidden text-center animate-in fade-in duration-200">
      {/* Top Right Close Button */}
      <Link
        href="/"
        className="absolute top-6 right-6 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors"
        aria-label="Back to home"
      >
        <X className="size-4" />
      </Link>

      {/* Top Brand Logo */}
      <div className="flex justify-center mb-6 pt-1">
        <Link href="/" className="inline-block transition-transform hover:scale-105">
          <Logo size="md" wordmarkClassName="text-2xl font-bold tracking-tight text-slate-900 dark:text-white" />
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-1.5 mb-6">
        <h1 className="font-display text-2xl sm:text-[26px] font-bold text-slate-900 dark:text-white tracking-tight">
          Sign in with email
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">
          Access your decision models and financial risk diagnostics.
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

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 text-left" noValidate>
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

        {/* Password */}
        <div className="space-y-1">
          <div className="relative">
            <Lock className="size-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
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

        {/* Forgot password link */}
        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-brand hover:underline transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Primary Brand Purple Action Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#8B5CF6] text-white py-3.5 text-sm font-bold shadow-md shadow-purple-500/25 hover:opacity-95 transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50 mt-1 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <span>Get Started</span>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <p className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 pt-4">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-bold text-brand hover:underline">
          Sign Up
        </Link>
      </p>

      {/* Divider */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-purple-200/50 dark:border-purple-900/40" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-gradient-to-b from-white to-[#F3E8FF] dark:from-[#110E1B] dark:to-[#2E1065]/40 px-3 font-medium text-slate-400">
            Or sign in with
          </span>
        </div>
      </div>

      {/* Circular Google Sign-In Button */}
      <div className="flex justify-center pb-2">
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="size-12 rounded-full bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 shadow-md shadow-purple-500/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          aria-label="Sign in with Google"
        >
          <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
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
        </button>
      </div>
    </div>
  );
}
