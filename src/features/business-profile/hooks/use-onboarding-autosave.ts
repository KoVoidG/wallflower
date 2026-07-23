'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { onboardingService } from '../services/onboarding.service';
import type { OnboardingData } from '../schemas';

const DEBOUNCE_MS = 2000;

interface AutosaveOptions {
  form?: UseFormReturn<OnboardingData>;
  data?: OnboardingData;
}

export function getSavedDraft(): OnboardingData | null {
  return onboardingService.loadDraft();
}

export function useOnboardingAutosave(optionsOrData: AutosaveOptions | OnboardingData) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dataToSave =
    typeof optionsOrData === 'object' && 'preferences' in optionsOrData
      ? (optionsOrData as OnboardingData)
      : (optionsOrData as AutosaveOptions).data || (optionsOrData as AutosaveOptions).form?.getValues();

  useEffect(() => {
    if (!dataToSave) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onboardingService.saveDraft(dataToSave);
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [dataToSave]);

  const clearDraft = useCallback(() => {
    onboardingService.clearDraft();
  }, []);

  const restoreDraft = useCallback(
    (draft: OnboardingData) => {
      if (typeof optionsOrData === 'object' && 'form' in optionsOrData && optionsOrData.form) {
        optionsOrData.form.reset(draft);
      }
    },
    [optionsOrData]
  );

  return { clearDraft, restoreDraft };
}
