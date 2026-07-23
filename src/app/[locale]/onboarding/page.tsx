'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { OnboardingForm } from '@/features/business-profile/components/onboarding-form';
import { DraftBanner } from '@/features/business-profile/components/draft-banner';
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
  const [draftData, setDraftData] = useState<OnboardingData | null>(null);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [isAlreadyCompleted, setIsAlreadyCompleted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        // Prototype mode: Allow accessing onboarding page anytime for testing & iteration
        if (onboardingService.isOnboardingCompleted()) {
          setIsAlreadyCompleted(true);
        }

        const draft = onboardingService.loadDraft();
        if (draft && !cancelled) {
          setDraftData(draft);
          setShowDraftBanner(true);
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

  const handleContinueDraft = useCallback(() => {
    setShowDraftBanner(false);
  }, []);

  const handleClearDraft = useCallback(() => {
    onboardingService.clearDraft();
    setDraftData(null);
    setShowDraftBanner(false);
  }, []);

  const handleResetBaseline = useCallback(() => {
    onboardingService.resetPrototypeData();
    setIsAlreadyCompleted(false);
    setDraftData(null);
    setShowDraftBanner(false);
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
              {/* Prototype Re-access Notice Banner */}
              {isAlreadyCompleted && (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-brand/40 bg-brand-soft/20 p-3.5 text-xs text-text-secondary">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-brand-soft px-2 py-0.5 font-bold text-brand uppercase tracking-wider text-[10px]">
                      Development Prototype Mode
                    </span>
                    <span>
                      You have already set up a business baseline. You can re-run onboarding or edit fields anytime.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetBaseline}
                    className="inline-flex items-center gap-1 font-semibold text-brand hover:underline shrink-0 cursor-pointer"
                  >
                    <RefreshCw className="size-3" />
                    <span>Reset & Start Fresh</span>
                  </button>
                </div>
              )}

              {/* Draft Banner */}
              {showDraftBanner && draftData && (
                <DraftBanner
                  onContinue={handleContinueDraft}
                  onClear={handleClearDraft}
                />
              )}

              {/* Redesigned Onboarding Flow Component */}
              <OnboardingForm
                initialData={draftData || onboardingService.getOnboardingData()}
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
