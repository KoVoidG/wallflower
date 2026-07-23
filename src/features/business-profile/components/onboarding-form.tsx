'use client';

import { useState, useCallback } from 'react';
import { useRouter } from '@/lib/i18n/navigation';
import {
  ArrowRight,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OnboardingData, defaultOnboardingData } from '../schemas';
import { useOnboardingAutosave } from '../hooks/use-onboarding-autosave';
import { onboardingService } from '../services/onboarding.service';

// Onboarding Steps Components
import { WelcomeScreen } from './welcome-screen';
import { StepGoalsBusiness } from './step-goals-business';
import { StepAddFinancials } from './step-add-financials';
import { StepReviewGaps } from './step-review-gaps';
import { StepPreferencesFinish } from './step-preferences-finish';
import { ProcessingState } from './processing-state';
import { CompletionState } from './completion-state';
import { ContextPanel } from './context-panel';

interface OnboardingFormProps {
  initialData?: OnboardingData | null;
  onSubmitComplete?: (data: OnboardingData) => Promise<void>;
}

const STAGES = [
  { id: 1, name: 'Goals & Business' },
  { id: 2, name: 'Financial Data' },
  { id: 3, name: 'Review' },
  { id: 4, name: 'Preferences' },
];

export function OnboardingForm({
  initialData,
  onSubmitComplete,
}: OnboardingFormProps) {
  const router = useRouter();

  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxStepReached, setMaxStepReached] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [focusedFieldKey, setFocusedFieldKey] = useState<string | undefined>();
  const [showSaveToast, setShowSaveToast] = useState<boolean>(false);
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

  const handleFocusedFieldChange = useCallback((fieldKey: string) => {
    setFocusedFieldKey(fieldKey);
  }, []);

  const validateCurrentStep = (): boolean => {
    if (currentStep === 1) {
      if (!formData.business.name.trim()) {
        setStepError('Please enter your Business Name before continuing.');
        return false;
      }
      if (!formData.goals.selectedGoals || formData.goals.selectedGoals.length === 0) {
        setStepError('Please select at least 1 goal before continuing.');
        return false;
      }
    }
    setStepError(null);
    return true;
  };

  const handleNextStep = async () => {
    if (!validateCurrentStep()) return;

    if (currentStep < 4) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setMaxStepReached((prev) => Math.max(prev, nextStep));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Submit and trigger staged processing sequence
      setIsProcessing(true);
    }
  };

  const handlePrevStep = () => {
    setStepError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowWelcome(true);
    }
  };

  const handleStageTabClick = (stageId: number) => {
    setStepError(null);
    if (stageId <= maxStepReached) {
      setCurrentStep(stageId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveAndContinueLater = () => {
    onboardingService.saveDraft(formData);
    setShowSaveToast(true);
    setTimeout(() => {
      setShowSaveToast(false);
      router.push('/dashboard');
    }, 1200);
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

  const handleLoadSampleData = () => {
    const sample = onboardingService.getSampleData();
    setFormData(sample);
    onboardingService.saveDraft(sample);
    setShowWelcome(false);
    setCurrentStep(2);
    setMaxStepReached((prev) => Math.max(prev, 2));
  };

  // 1. Render Welcome Screen
  if (showWelcome && !isProcessing && !isCompleted) {
    return (
      <WelcomeScreen
        onStart={() => setShowWelcome(false)}
        onExploreSample={handleLoadSampleData}
      />
    );
  }

  // 2. Render Staged Processing Animation
  if (isProcessing) {
    return <ProcessingState onComplete={handleProcessingFinish} />;
  }

  // 3. Render Final Completion State
  if (isCompleted) {
    return (
      <CompletionState
        data={formData}
        onEditMissingData={() => {
          setIsCompleted(false);
          setCurrentStep(2);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Toast Feedback for Save */}
      {showSaveToast && (
        <div className="fixed top-6 right-6 z-50 rounded-lg border border-brand/40 bg-surface p-3.5 shadow-xl flex items-center gap-2.5 animate-in fade-in-50 slide-in-from-top-4">
          <CheckCircle2 className="size-4 text-brand shrink-0" />
          <span className="text-xs font-medium text-text-primary">
            Draft saved locally. Returning to dashboard...
          </span>
        </div>
      )}

      {/* Sticky Progress Header with Named Stages */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/80 pb-3 pt-2">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand">
              Step {currentStep} of 4 — {STAGES.find((s) => s.id === currentStep)?.name}
            </span>
            <span className="text-xs font-semibold text-text-muted">
              {Math.round((currentStep / 4) * 100)}% Complete
            </span>
          </div>

          {/* Stage Tabs Bar */}
          <div className="grid grid-cols-4 gap-1.5 rounded-lg border border-border bg-surface p-1">
            {STAGES.map((stg) => {
              const isActive = currentStep === stg.id;
              const isPast = maxStepReached > stg.id && currentStep !== stg.id;
              const isAccessible = stg.id <= maxStepReached;

              return (
                <button
                  key={stg.id}
                  type="button"
                  onClick={() => handleStageTabClick(stg.id)}
                  disabled={!isAccessible}
                  className={cn(
                    'flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-semibold transition-all select-none',
                    isActive
                      ? 'bg-brand text-white shadow-2xs'
                      : isPast || isAccessible
                      ? 'text-brand bg-brand-soft/30 hover:bg-brand-soft/60 cursor-pointer'
                      : 'text-text-muted cursor-not-allowed'
                  )}
                >
                  <span className="tabular-nums font-bold">{stg.id}.</span>
                  <span className="hidden sm:inline truncate">{stg.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Validation Error Message */}
      {stepError && (
        <div className="rounded-md border border-danger/40 bg-danger-soft/20 p-3 flex items-center gap-2 text-xs font-semibold text-danger animate-in fade-in-50">
          <AlertCircle className="size-4 shrink-0" />
          <span>{stepError}</span>
        </div>
      )}

      {/* Main Content Layout with Contextual Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Step Form Content */}
        <div className="lg:col-span-8 space-y-6">
          {currentStep === 1 && (
            <StepGoalsBusiness
              data={formData}
              onChange={updateFormData}
              onFocusedFieldChange={handleFocusedFieldChange}
            />
          )}

          {currentStep === 2 && (
            <StepAddFinancials
              data={formData}
              onChange={updateFormData}
              onFocusedFieldChange={handleFocusedFieldChange}
              onLoadSampleData={handleLoadSampleData}
            />
          )}

          {currentStep === 3 && (
            <StepReviewGaps
              data={formData}
              onChange={updateFormData}
              onEditStep={(stp: number) => {
                setCurrentStep(stp);
                setMaxStepReached((prev) => Math.max(prev, stp));
              }}
            />
          )}

          {currentStep === 4 && (
            <StepPreferencesFinish
              data={formData}
              onChange={updateFormData}
              onFocusedFieldChange={handleFocusedFieldChange}
            />
          )}

          {/* Mobile Guidance Panel (Displayed below fields on mobile) */}
          <div className="block lg:hidden pt-2">
            <ContextPanel
              currentStep={currentStep}
              focusedFieldKey={focusedFieldKey}
            />
          </div>
        </div>

        {/* Desktop Sticky Contextual Guidance Panel */}
        <div className="hidden lg:block lg:col-span-4 sticky top-24">
          <ContextPanel
            currentStep={currentStep}
            focusedFieldKey={focusedFieldKey}
          />
        </div>
      </div>

      {/* Sticky Bottom Action Control Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/95 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrevStep}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <span>Back</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-text-muted">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span>Draft saved locally</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveAndContinueLater}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-subtle transition-colors cursor-pointer"
            >
              <Save className="size-3.5 text-text-muted" />
              <span className="hidden sm:inline">Save & Continue Later</span>
              <span className="inline sm:hidden">Save</span>
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-5 py-2 text-xs font-semibold text-white hover:bg-brand-hover transition-colors shadow-2xs cursor-pointer"
            >
              <span>{currentStep === 4 ? 'Create business baseline' : 'Continue'}</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
