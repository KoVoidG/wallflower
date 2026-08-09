'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { OnboardingForm } from '@/features/business-profile/components/onboarding-form';
import { PrivacyNotice } from '@/features/business-profile/components/privacy-notice';
import { onboardingService } from '@/features/business-profile/services/onboarding.service';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { FadeIn } from '@/components/motion';
import type { OnboardingData } from '@/features/business-profile/schemas';
import { RefreshCw } from 'lucide-react';

function OnboardingLoadingSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8" aria-label="Loading onboarding" role="status">
      <Skeleton className="h-8 w-64" />
      <SkeletonText lines={2} />
      <div className="space-y-4 mt-8">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

type PageState =
  | { status: 'loading' }
  | { status: 'ready' }
  | { status: 'error'; message: string };

export default function OnboardingPage() {
  const t = useTranslations('onboarding');

  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [formData, setFormData] = useState<OnboardingData | null>(null);
  const [isAlreadyCompleted, setIsAlreadyCompleted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        // Prototype mode: Check if onboarding has baseline or draft data
        if (onboardingService.isOnboardingCompleted()) {
          setIsAlreadyCompleted(true);
        }

        const draft = onboardingService.loadDraft();
        if (draft && !cancelled) {
          setFormData(draft);
        }

        if (!cancelled) {
          setPageState({ status: 'ready' });
        }
      } catch {
        if (!cancelled) {
          setPageState({ status: 'ready' });
        }
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleResetBaseline = useCallback(() => {
    onboardingService.resetPrototypeData();
    setIsAlreadyCompleted(false);
    setFormData(null);
    window.location.reload();
  }, []);

  const handleSubmitComplete = useCallback(
    async (data: OnboardingData) => {
      await onboardingService.completeOnboarding(data);
    },
    []
  );

  return (
    <main className="min-h-screen bg-background py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {pageState.status === 'loading' && (
          <FadeIn>
            <OnboardingLoadingSkeleton />
          </FadeIn>
        )}

        {pageState.status === 'error' && (
          <FadeIn>
            <ErrorState
              title={t('error')}
              description={pageState.message}
              onRetry={() => setPageState({ status: 'ready' })}
            />
          </FadeIn>
        )}

        {pageState.status === 'ready' && (
          <FadeIn>
            <div className="flex flex-col gap-6">
              {/* Single Prototype Notice Banner with Purple Theme */}
              {isAlreadyCompleted && (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#6366F1]/30 bg-[#6366F1]/10 dark:bg-[#6366F1]/8 p-3.5 text-xs text-text-secondary">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#6366F1]/15 px-2.5 py-0.5 font-bold text-[#4F46E5] dark:text-[#A5B4FC] uppercase tracking-wider text-[10px]">
                      {t('prototypeMode')}
                    </span>
                    <span>
                      {t('prototypeNotice')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetBaseline}
                    className="inline-flex items-center gap-1 font-bold text-[#4F46E5] dark:text-[#A5B4FC] hover:underline shrink-0 cursor-pointer"
                  >
                    <RefreshCw className="size-3" />
                    <span>{t('resetStartFresh')}</span>
                  </button>
                </div>
              )}

              {/* Redesigned Onboarding Flow Component */}
              <OnboardingForm
                initialData={formData || onboardingService.getOnboardingData()}
                onSubmitComplete={handleSubmitComplete}
              />

              {/* Footer Privacy Notice */}
              <PrivacyNotice className="mt-6 border-t border-border/60 pt-4" />
            </div>
          </FadeIn>
        )}
      </div>
    </main>
  );
}
