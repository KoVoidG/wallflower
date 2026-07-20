'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from '@/lib/i18n/navigation';
import { useTranslations } from 'next-intl';

import { OnboardingForm } from '@/features/business-profile/components/onboarding-form';
import { DraftBanner } from '@/features/business-profile/components/draft-banner';
import { PrivacyNotice } from '@/features/business-profile/components/privacy-notice';
import { getSavedDraft } from '@/features/business-profile/hooks/use-onboarding-autosave';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { FadeIn } from '@/components/motion';
import {
  checkOnboardingStatus,
  submitOnboarding,
} from '@/features/business-profile/adapters/onboarding.adapter';
import type { OnboardingData } from '@/features/business-profile/schemas';

// --- Loading Skeleton ---

function OnboardingLoadingSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading onboarding" role="status">
      <Skeleton className="h-8 w-64" />
      <SkeletonText lines={2} />
      <div className="space-y-4 mt-8">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-12 w-32 mt-6" />
    </div>
  );
}

// --- Page States ---

type PageState =
  | { status: 'loading' }
  | { status: 'ready' }
  | { status: 'submitting' }
  | { status: 'error'; message: string }
  | { status: 'success' };

// --- Onboarding Page ---

export default function OnboardingPage() {
  const router = useRouter();
  const t = useTranslations('onboarding');

  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [hasDraft, setHasDraft] = useState(false);
  const isSubmittingRef = useRef(false);

  // Check onboarding status on mount
  useEffect(() => {
    let cancelled = false;

    async function checkStatus() {
      try {
        const { completed } = await checkOnboardingStatus();
        if (cancelled) return;

        if (completed) {
          router.replace('/dashboard');
          return;
        }

        // Check for saved draft
        const draft = getSavedDraft();
        if (draft) {
          setHasDraft(true);
        }

        setPageState({ status: 'ready' });
      } catch {
        if (!cancelled) {
          setPageState({ status: 'error', message: t('error') });
        }
      }
    }

    checkStatus();
    return () => {
      cancelled = true;
    };
  }, [router, t]);

  // --- Draft handlers ---

  const handleContinueDraft = useCallback(() => {
    // The OnboardingForm + useOnboardingAutosave will handle restoring
    // We just dismiss the banner — form picks up draft on its own
    setHasDraft(false);
  }, []);

  const handleClearDraft = useCallback(() => {
    try {
      window.localStorage.removeItem('wallflower-onboarding-draft');
    } catch {
      // Silently ignore
    }
    setHasDraft(false);
  }, []);

  // --- Submit handler with duplicate submission guard ---

  const handleSubmit = useCallback(
    async (data: OnboardingData) => {
      // Duplicate submission guard
      if (isSubmittingRef.current) return;
      isSubmittingRef.current = true;

      setPageState({ status: 'submitting' });

      try {
        const result = await submitOnboarding(data);

        if (result.success) {
          // Clear draft from localStorage on success
          try {
            window.localStorage.removeItem('wallflower-onboarding-draft');
          } catch {
            // Silently ignore
          }
          setPageState({ status: 'success' });
          // Redirect to dashboard after brief success display
          setTimeout(() => {
            router.replace('/dashboard');
          }, 1500);
        } else {
          setPageState({
            status: 'error',
            message: result.error || t('error'),
          });
          isSubmittingRef.current = false;
        }
      } catch {
        setPageState({ status: 'error', message: t('error') });
        isSubmittingRef.current = false;
      }
    },
    [router, t]
  );

  // --- Retry handler ---

  const handleRetry = useCallback(() => {
    setPageState({ status: 'ready' });
  }, []);

  // --- Render ---

  return (
    <main className="min-h-screen bg-background py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Loading state */}
        {pageState.status === 'loading' && (
          <FadeIn>
            <OnboardingLoadingSkeleton />
          </FadeIn>
        )}

        {/* Server error state */}
        {pageState.status === 'error' && (
          <FadeIn>
            <ErrorState
              title={t('error')}
              description={pageState.message}
              onRetry={handleRetry}
            />
          </FadeIn>
        )}

        {/* Success state */}
        {pageState.status === 'success' && (
          <FadeIn>
            <div className="flex flex-col items-center justify-center py-16 text-center max-w-lg mx-auto">
              <div className="size-16 rounded-full bg-success-soft flex items-center justify-center mb-4">
                <svg
                  className="size-8 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-[20px]/[28px] font-[600] text-text-primary mb-2">
                Your business baseline is ready
              </h2>
              <p className="text-[15px]/[24px] text-text-secondary mb-6">
                Wallflower can now assess business health, identify initial risks, and run decision simulations using your current data.
              </p>
              <p className="text-[13px] text-text-muted mb-6">
                Redirecting to your dashboard...
              </p>
            </div>
          </FadeIn>
        )}

        {/* Submitting state */}
        {pageState.status === 'submitting' && (
          <FadeIn>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="size-8 border-2 border-brand border-t-transparent rounded-full animate-spin motion-reduce:animate-none mb-4" aria-hidden="true" />
              <p className="text-text-secondary text-[15px]">
                {t('duplicateGuard')}
              </p>
            </div>
          </FadeIn>
        )}

        {/* Ready state — form with context column */}
        {pageState.status === 'ready' && (
          <FadeIn>
            <div className="flex flex-col gap-6">
              {/* Draft banner */}
              {hasDraft && (
                <DraftBanner
                  onContinue={handleContinueDraft}
                  onClear={handleClearDraft}
                />
              )}

              {/* Two-column layout: form + context */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main form column */}
                <div className="lg:col-span-8">
                  <OnboardingForm onSubmit={handleSubmit} />
                </div>

                {/* Context column */}
                <aside className="hidden lg:block lg:col-span-4" aria-label="Onboarding context">
                  <div className="sticky top-8 rounded-[var(--radius-lg)] border border-border bg-surface-subtle/40 p-5 flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[12px]/[16px] font-[600] uppercase tracking-wide text-text-muted">
                        Why we ask
                      </span>
                      <p className="text-[14px]/[22px] text-text-secondary">
                        Wallflower uses your business profile and financial snapshot to calculate health scores, detect risks, and power decision simulations.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border/60 flex flex-col gap-2">
                      <span className="text-[12px]/[16px] font-[600] uppercase tracking-wide text-text-muted">
                        What you will receive
                      </span>
                      <ul className="flex flex-col gap-1.5 text-[13px]/[20px] text-text-secondary">
                        <li>• Business health assessment</li>
                        <li>• Risk detection and prioritization</li>
                        <li>• Decision simulation capability</li>
                        <li>• Evidence-based recommendations</li>
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-border/60 flex flex-col gap-2">
                      <span className="text-[12px]/[16px] font-[600] uppercase tracking-wide text-text-muted">
                        Setup time
                      </span>
                      <p className="text-[13px]/[20px] text-text-secondary">
                        Approximately 3–5 minutes. You can skip optional fields and add information later.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border/60 flex flex-col gap-2">
                      <span className="text-[12px]/[16px] font-[600] uppercase tracking-wide text-text-muted">
                        Data handling
                      </span>
                      <p className="text-[13px]/[20px] text-text-secondary">
                        This is a prototype. Data is stored locally and used only for demonstrating Wallflower&apos;s capabilities.
                      </p>
                    </div>
                  </div>
                </aside>
              </div>

              {/* Privacy notice footer */}
              <PrivacyNotice className="mt-4" />
            </div>
          </FadeIn>
        )}
      </div>
    </main>
  );
}
