'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { OnboardingData } from '../schemas';

const STORAGE_KEY = 'wallflower-onboarding-draft';
const DEBOUNCE_MS = 3000;

interface AutosaveOptions {
  form: UseFormReturn<OnboardingData>;
}

interface SerializedDraft {
  data: OnboardingData;
  savedAt: string;
}

/**
 * Serializes form data for localStorage, converting Date objects to ISO strings.
 */
function serialize(data: OnboardingData): string {
  return JSON.stringify({
    data: {
      ...data,
      financial: {
        ...data.financial,
        month: data.financial.month instanceof Date
          ? data.financial.month.toISOString()
          : data.financial.month,
      },
    },
    savedAt: new Date().toISOString(),
  });
}

/**
 * Deserializes stored draft, converting ISO date strings back to Date objects.
 */
function deserialize(raw: string): SerializedDraft | null {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.data) return null;

    return {
      data: {
        ...parsed.data,
        financial: {
          ...parsed.data.financial,
          month: parsed.data.financial?.month
            ? new Date(parsed.data.financial.month)
            : new Date(),
        },
      },
      savedAt: parsed.savedAt,
    };
  } catch {
    return null;
  }
}

/**
 * Checks if localStorage is available (SSR-safe).
 */
function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__wallflower_storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Retrieves a saved draft from localStorage if one exists.
 */
export function getSavedDraft(): SerializedDraft | null {
  if (!isStorageAvailable()) return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  return deserialize(raw);
}

/**
 * Custom hook that persists onboarding form state to localStorage with debouncing.
 *
 * - On mount: does NOT auto-restore (caller should use `getSavedDraft()` and decide)
 * - On change: saves debounced every 3 seconds
 * - Provides `clearDraft()` to remove saved data after successful submit
 */
export function useOnboardingAutosave({ form }: AutosaveOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Watch all form values
  const values = form.watch();

  // Debounced save effect
  useEffect(() => {
    if (!isStorageAvailable()) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      try {
        const currentValues = form.getValues();
        window.localStorage.setItem(STORAGE_KEY, serialize(currentValues));
      } catch {
        // Storage full or unavailable — silently skip
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const clearDraft = useCallback(() => {
    if (!isStorageAvailable()) return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Silently ignore
    }
  }, []);

  const restoreDraft = useCallback(
    (draft: SerializedDraft) => {
      form.reset(draft.data);
    },
    [form]
  );

  return { clearDraft, restoreDraft };
}
