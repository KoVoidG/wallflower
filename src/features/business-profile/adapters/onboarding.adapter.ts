import { onboardingService } from '../services/onboarding.service';
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
 */
export async function checkOnboardingStatus(): Promise<OnboardingStatus> {
  const completed = onboardingService.isOnboardingCompleted();
  return { completed };
}

/**
 * Submit onboarding data to create a business profile baseline.
 */
export async function submitOnboarding(data: OnboardingData): Promise<SubmitResult> {
  return onboardingService.completeOnboarding(data);
}
