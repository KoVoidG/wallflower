import type { OnboardingData } from '../schemas';

export interface OnboardingStatus {
  completed: boolean;
}

export interface SubmitResult {
  success: boolean;
  error?: string;
}

/**
 * Check whether the current user has already completed onboarding.
 * Mock implementation — returns { completed: false } for now.
 * Will be replaced with a real server action call later.
 */
export async function checkOnboardingStatus(): Promise<OnboardingStatus> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { completed: false };
}

/**
 * Submit onboarding data to create a business profile.
 * Mock implementation — returns success for now.
 * Will be replaced with a real server action call later.
 */
export async function submitOnboarding(data: OnboardingData): Promise<SubmitResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Log the data in development for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('[onboarding.adapter] submitOnboarding called with:', data);
  }

  return { success: true };
}
