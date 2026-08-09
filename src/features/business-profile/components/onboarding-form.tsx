// src/features/business-profile/components/onboarding-form.tsx
'use client';

import { useState, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { useRouter } from '@/lib/i18n/navigation';
import { OnboardingData, defaultOnboardingData } from '../schemas';
import { useOnboardingAutosave } from '../hooks/use-onboarding-autosave';
import { onboardingService } from '../services/onboarding.service';

// Modular 1-File-Per-Step Components
import { OnboardingStepper } from './onboarding-stepper';
import { StepSetupMethod, SetupMethod } from './step-setup-method';
import { StepBusinessProfile } from './step-business-profile';
import { StepBusinessOperations } from './step-business-operations';
import { StepFinancialBaseline } from './step-financial-baseline';
import { StepInventory } from './step-inventory';
import { StepAssumptions } from './step-assumptions';
import { StepReview } from './step-review';

import { ProcessingState } from './processing-state';

interface OnboardingFormProps {
  initialData?: OnboardingData | null;
  onSubmitComplete?: (data: OnboardingData) => Promise<void>;
}

export function OnboardingForm({
  initialData,
  onSubmitComplete,
}: OnboardingFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxStepReached, setMaxStepReached] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stepError, setStepError] = useState<string | null>(null);

  const [formData, setFormData] = useState<OnboardingData>(
    () => initialData || onboardingService.getOnboardingData() || defaultOnboardingData
  );

  // Autosave draft locally
  useOnboardingAutosave(formData);

  const updateFormData = useCallback((updated: Partial<OnboardingData>) => {
    setStepError(null);
    setFormData((prev) => ({
      ...prev,
      ...updated,
    }));
  }, []);

  const goToStep = (stepId: number) => {
    setStepError(null);
    setCurrentStep(stepId);
    setMaxStepReached((prev) => Math.max(prev, stepId));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextStep = () => {
    // Basic Step Validation on Step 2 (Profile)
    if (currentStep === 2 && !formData.business.name?.trim()) {
      setStepError('Please enter your Business Name before continuing.');
      return;
    }

    if (currentStep < 7) {
      goToStep(currentStep + 1);
    } else {
      // Step 7 Review -> Trigger Baseline Generation (Processing State)
      handleGenerateBaseline();
    }
  };

  const handlePrevStep = () => {
    setStepError(null);
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const handleSelectSetupMethod = (method: SetupMethod) => {
    updateFormData({ setupMethod: method });
  };

  const handleGenerateBaseline = () => {
    // Pre-save baseline data immediately so no async lag happens at redirect time
    onboardingService.completeOnboarding(formData);
    setIsProcessing(true);
  };

  const handleProcessingFinish = useCallback(async () => {
    // Keep isProcessing active so it NEVER flashes the previous step while routing
    if (onSubmitComplete) {
      await onSubmitComplete(formData);
    }
    router.push('/dashboard');
  }, [formData, onSubmitComplete, router]);

  // 1. Render Staged Processing Animation (Data Quality Check, All Set Speech, & Auto-Redirect)
  if (isProcessing) {
    return (
      <ProcessingState
        businessName={formData.business.name || 'Your Business'}
        onComplete={handleProcessingFinish}
      />
    );
  }

  return (
    <div className="w-full space-y-3">
      {/* Top Stepper Bar for Steps 2 through 7 (hidden on Step 1 Welcome/Setup) */}
      <OnboardingStepper
        currentStep={currentStep}
        maxStepReached={maxStepReached}
        onStepClick={goToStep}
      />

      {/* Step Validation Error Message */}
      {stepError && (
        <div className="max-w-md mx-auto rounded-xl border border-red-500/40 bg-red-500/10 p-3 flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400 animate-in fade-in-50">
          <AlertCircle className="size-4 shrink-0" />
          <span>{stepError}</span>
        </div>
      )}

      {/* Render Current Step Component */}
      {currentStep === 1 && (
        <StepSetupMethod
          selectedMethod={formData.setupMethod || 'know_numbers'}
          onSelectMethod={handleSelectSetupMethod}
          onNext={() => goToStep(2)}
        />
      )}

      {currentStep === 2 && (
        <StepBusinessProfile
          data={formData}
          onChange={updateFormData}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
      )}

      {currentStep === 3 && (
        <StepBusinessOperations
          data={formData}
          onChange={updateFormData}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
      )}

      {currentStep === 4 && (
        <StepFinancialBaseline
          data={formData}
          onChange={updateFormData}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
      )}

      {currentStep === 5 && (
        <StepInventory
          data={formData}
          onChange={updateFormData}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
      )}

      {currentStep === 6 && (
        <StepAssumptions
          data={formData}
          onChange={updateFormData}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
      )}

      {currentStep === 7 && (
        <StepReview
          data={formData}
          onEditStep={goToStep}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
      )}
    </div>
  );
}
