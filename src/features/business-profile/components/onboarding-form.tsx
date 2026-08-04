'use client';

import { useState, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { OnboardingData, defaultOnboardingData } from '../schemas';
import { useOnboardingAutosave } from '../hooks/use-onboarding-autosave';
import { onboardingService } from '../services/onboarding.service';

// Modular 1-File-Per-Step Components
import { OnboardingStepper } from './onboarding-stepper';
import { StepWelcome } from './step-welcome';
import { StepSetupMethod, SetupMethod } from './step-setup-method';
import { StepBusinessProfile } from './step-business-profile';
import { StepBusinessOperations } from './step-business-operations';
import { StepFinancialBaseline } from './step-financial-baseline';
import { StepInventory } from './step-inventory';
import { StepAssumptions } from './step-assumptions';
import { StepReview } from './step-review';

import { ProcessingState } from './processing-state';
import { CompletionState } from './completion-state';

interface OnboardingFormProps {
  initialData?: OnboardingData | null;
  onSubmitComplete?: (data: OnboardingData) => Promise<void>;
}

export function OnboardingForm({
  initialData,
  onSubmitComplete,
}: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxStepReached, setMaxStepReached] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
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
    // Basic Step Validation
    if (currentStep === 3 && !formData.business.name?.trim()) {
      setStepError('Please enter your Business Name before continuing.');
      return;
    }

    if (currentStep < 8) {
      goToStep(currentStep + 1);
    } else {
      // Step 8 Review -> Trigger Baseline Generation (Processing State)
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
    setIsProcessing(true);
  };

  const handleProcessingFinish = async () => {
    setIsProcessing(false);
    setIsCompleted(true);
    if (onSubmitComplete) {
      await onSubmitComplete(formData);
    } else {
      await onboardingService.completeOnboarding(formData);
    }
  };

  // 1. Render Staged Processing Animation (Data Quality Check & Baseline Generation)
  if (isProcessing) {
    return <ProcessingState onComplete={handleProcessingFinish} />;
  }

  // 2. Render Final Completion State
  if (isCompleted) {
    return (
      <CompletionState
        data={formData}
        onEditMissingData={() => {
          setIsCompleted(false);
          goToStep(3);
        }}
      />
    );
  }

  return (
    <div className="space-y-4 pb-12">
      {/* Top Stepper Bar for Steps 3 through 8 */}
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

      {/* Render Current Step Component (1 File per Step) */}
      {currentStep === 1 && (
        <StepWelcome onNext={() => goToStep(2)} />
      )}

      {currentStep === 2 && (
        <StepSetupMethod
          selectedMethod={formData.setupMethod || 'know_numbers'}
          onSelectMethod={handleSelectSetupMethod}
          onNext={() => goToStep(3)}
          onPrev={() => goToStep(1)}
        />
      )}

      {currentStep === 3 && (
        <StepBusinessProfile
          data={formData}
          onChange={updateFormData}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
      )}

      {currentStep === 4 && (
        <StepBusinessOperations
          data={formData}
          onChange={updateFormData}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
      )}

      {currentStep === 5 && (
        <StepFinancialBaseline
          data={formData}
          onChange={updateFormData}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
      )}

      {currentStep === 6 && (
        <StepInventory
          data={formData}
          onChange={updateFormData}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
      )}

      {currentStep === 7 && (
        <StepAssumptions
          data={formData}
          onChange={updateFormData}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
        />
      )}

      {currentStep === 8 && (
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
