'use client';

import { useState } from 'react';
import { Target, Building2, Check, Sparkles, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select } from '@/components/ui/select';
import { Label, Caption, H2, H3, BodySmall } from '@/components/ui/typography';
import {
  OnboardingData,
  INDUSTRY_VALUES,
  INDUSTRY_LABELS,
  REVENUE_MODEL_VALUES,
  REVENUE_MODEL_LABELS,
  STAGE_VALUES,
  STAGE_LABELS,
  TARGET_TIMELINE_OPTIONS,
} from '../schemas';

interface StepGoalsBusinessProps {
  data: OnboardingData;
  onChange: (updated: Partial<OnboardingData>) => void;
  onFocusedFieldChange?: (fieldKey: string) => void;
}

// Grouped goals into 3 distinct categories with a max choice limit of 3
const GOAL_GROUPS = [
  {
    category: 'Understand',
    label: 'Understand Business Health',
    description: 'Assess position, analyze runway, and track baseline metrics',
    goals: [
      'Understand business health',
      'Analyze runway & cash buffer',
      'Monitor cash flow stability',
    ],
  },
  {
    category: 'Decide',
    label: 'Decide & Test Options',
    description: 'Evaluate hiring, test pricing changes, or plan purchases',
    goals: [
      'Evaluate hiring plan',
      'Test pricing & margins',
      'Plan a major purchase',
      'Prepare for expansion',
    ],
  },
  {
    category: 'Improve',
    label: 'Improve & Protect',
    description: 'Reduce vulnerability, improve profitability, and prepare for financing',
    goals: [
      'Improve cash flow',
      'Reduce business risk',
      'Prepare for financing',
      'Improve profitability',
    ],
  },
];

const PRESET_GOAL_SET = new Set(GOAL_GROUPS.flatMap((g) => g.goals));

export function StepGoalsBusiness({
  data,
  onChange,
  onFocusedFieldChange,
}: StepGoalsBusinessProps) {
  const [customGoalInput, setCustomGoalInput] = useState('');

  const selectedGoals = data.goals.selectedGoals || [];
  const isMaxGoalsReached = selectedGoals.length >= 3;

  // Identify any custom goals currently selected by the user
  const selectedCustomGoals = selectedGoals.filter((g) => !PRESET_GOAL_SET.has(g));

  const toggleGoal = (goal: string) => {
    onFocusedFieldChange?.('goals');
    if (selectedGoals.includes(goal)) {
      onChange({
        goals: {
          ...data.goals,
          selectedGoals: selectedGoals.filter((g) => g !== goal),
        },
      });
    } else {
      if (selectedGoals.length < 3) {
        onChange({
          goals: {
            ...data.goals,
            selectedGoals: [...selectedGoals, goal],
          },
        });
      }
    }
  };

  const removeGoal = (goalToRemove: string) => {
    onFocusedFieldChange?.('goals');
    onChange({
      goals: {
        ...data.goals,
        selectedGoals: selectedGoals.filter((g) => g !== goalToRemove),
      },
    });
  };

  const addCustomGoal = () => {
    const trimmed = customGoalInput.trim();
    if (trimmed && selectedGoals.length < 3 && !selectedGoals.includes(trimmed)) {
      onFocusedFieldChange?.('goals');
      onChange({
        goals: {
          ...data.goals,
          selectedGoals: [...selectedGoals, trimmed],
        },
      });
      setCustomGoalInput('');
    }
  };

  const updateBusinessField = (key: keyof OnboardingData['business'], val: unknown) => {
    onFocusedFieldChange?.('business');
    onChange({
      business: {
        ...data.business,
        [key]: val,
      },
    });
  };

  const updateGoalField = (key: keyof OnboardingData['goals'], val: unknown) => {
    onFocusedFieldChange?.('goals');
    onChange({
      goals: {
        ...data.goals,
        [key]: val,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="border-b border-border/60 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-brand-soft text-brand font-bold text-sm">
              1
            </div>
            <div>
              <H2 className="text-xl font-bold text-text-primary">Goals & Business Profile</H2>
              <BodySmall className="text-text-secondary">
                Select your primary goals and provide basic context about your business.
              </BodySmall>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-surface-subtle border border-border px-3 py-1 text-xs">
            <Target className="size-3.5 text-brand" />
            <Label className="font-semibold text-text-primary">{selectedGoals.length}/3 Selected</Label>
          </div>
        </div>
      </div>

      {/* Goal Selection Categories */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <H3 className="text-base font-bold text-text-primary">What do you want to accomplish?</H3>
            <Caption className="text-text-muted">Choose up to 3 primary goals to tailor your analysis.</Caption>
          </div>
          {isMaxGoalsReached && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
              <AlertCircle className="size-3" />
              Maximum 3 goals selected
            </span>
          )}
        </div>

        {/* Grouped Preset Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GOAL_GROUPS.map((group) => (
            <div
              key={group.category}
              className="space-y-3 rounded-lg border border-border/70 bg-surface p-4"
            >
              <div className="border-b border-border/50 pb-2">
                <Caption className="text-[10px] font-bold uppercase tracking-wider text-brand block">
                  {group.category}
                </Caption>
                <H3 className="text-sm font-semibold text-text-primary">{group.label}</H3>
                <Caption className="text-[11px] text-text-muted">{group.description}</Caption>
              </div>

              <div className="space-y-2">
                {group.goals.map((goalText) => {
                  const isSelected = selectedGoals.includes(goalText);
                  const isDisabled = !isSelected && isMaxGoalsReached;

                  return (
                    <label
                      key={goalText}
                      className={cn(
                        'flex items-center justify-between gap-2 rounded-md border p-2.5 text-xs font-medium transition-all cursor-pointer select-none',
                        isSelected
                          ? 'border-brand bg-brand-soft/30 text-brand font-semibold shadow-2xs'
                          : 'border-border/60 bg-surface-subtle/40 text-text-primary hover:border-border hover:bg-surface-subtle',
                        isDisabled && 'opacity-50 cursor-not-allowed hover:bg-surface-subtle/40'
                      )}
                    >
                      <span className="leading-tight">{goalText}</span>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => toggleGoal(goalText)}
                        className="sr-only"
                      />
                      <div
                        className={cn(
                          'flex size-4 shrink-0 items-center justify-center rounded border transition-colors',
                          isSelected
                            ? 'border-brand bg-brand text-white'
                            : 'border-border bg-surface'
                        )}
                      >
                        {isSelected && <Check className="size-3 stroke-[3]" />}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Render Selected Custom Goals Chip Section (visible & removable) */}
        {selectedCustomGoals.length > 0 && (
          <div className="space-y-2 rounded-lg border border-brand/40 bg-brand-soft/15 p-3">
            <Label className="block text-xs font-bold text-brand">Custom Goals Selected ({selectedCustomGoals.length}):</Label>
            <div className="flex flex-wrap gap-2">
              {selectedCustomGoals.map((cg) => (
                <span
                  key={cg}
                  className="inline-flex items-center gap-1.5 rounded-md border border-brand bg-surface px-2.5 py-1 text-xs font-semibold text-brand shadow-2xs"
                >
                  <span>{cg}</span>
                  <button
                    type="button"
                    onClick={() => removeGoal(cg)}
                    className="p-0.5 rounded hover:bg-brand-soft hover:text-brand transition-colors cursor-pointer"
                    title="Remove custom goal"
                  >
                    <X className="size-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Custom Goal Input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
          <input
            type="text"
            value={customGoalInput}
            onChange={(e) => setCustomGoalInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomGoal();
              }
            }}
            placeholder="Add a custom goal..."
            disabled={isMaxGoalsReached}
            className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none disabled:opacity-50"
          />
          <button
            type="button"
            onClick={addCustomGoal}
            disabled={!customGoalInput.trim() || isMaxGoalsReached}
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-surface-subtle border border-border px-3.5 py-2 text-xs font-semibold text-text-primary hover:bg-brand-soft hover:text-brand transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="size-3.5 text-brand" />
            <span>Add Goal</span>
          </button>
        </div>

        {/* Goal Detail Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/50">
          <div className="space-y-1">
            <Label className="block text-xs font-semibold">Primary Business Concern (Optional)</Label>
            <input
              type="text"
              value={data.goals.mainConcern || ''}
              onChange={(e) => updateGoalField('mainConcern', e.target.value)}
              placeholder="e.g. Tight cash buffer, rising supplier costs"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <Select
              label="Target Planning Horizon"
              value={data.goals.targetTimeline || 'Short term (1–3 months)'}
              onChange={(val) => updateGoalField('targetTimeline', val)}
              options={TARGET_TIMELINE_OPTIONS.map((opt) => ({ value: opt, label: opt }))}
            />
          </div>
        </div>
      </div>

      {/* Business Details Form */}
      <div className="space-y-4 pt-4 border-t border-border/60">
        <div className="flex items-center gap-2">
          <Building2 className="size-4 text-brand" />
          <H3 className="text-base font-bold text-text-primary">Business Profile Details</H3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="block text-xs font-semibold">Business Name *</Label>
            <input
              type="text"
              required
              value={data.business.name}
              onChange={(e) => updateBusinessField('name', e.target.value)}
              placeholder="e.g. Craft Roast & Co."
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <Select
              label="Industry / Sector *"
              value={data.business.industry}
              onChange={(val) => updateBusinessField('industry', val)}
              options={INDUSTRY_VALUES.map((val) => ({
                value: val,
                label: INDUSTRY_LABELS[val] || val,
              }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="block text-xs font-semibold">Location / Operating Area</Label>
            <input
              type="text"
              value={data.business.location}
              onChange={(e) => updateBusinessField('location', e.target.value)}
              placeholder="e.g. Bangkok, Thailand"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <Select
              label="Primary Revenue Model"
              value={data.business.revenueModel || 'direct_sales'}
              onChange={(val) => updateBusinessField('revenueModel', val)}
              options={REVENUE_MODEL_VALUES.map((val) => ({
                value: val,
                label: REVENUE_MODEL_LABELS[val] || val,
              }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <Select
              label="Business Stage"
              value={data.business.stage || 'growing'}
              onChange={(val) => updateBusinessField('stage', val)}
              options={STAGE_VALUES.map((val) => ({
                value: val,
                label: STAGE_LABELS[val] || val,
              }))}
            />
          </div>

          <div className="space-y-1">
            <Label className="block text-xs font-semibold">Employee Count</Label>
            <input
              type="number"
              min="0"
              value={data.business.employeeCount ?? 5}
              onChange={(e) => updateBusinessField('employeeCount', Number(e.target.value))}
              placeholder="e.g. 5"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <Label className="block text-xs font-semibold">Operating Since (Year)</Label>
            <input
              type="text"
              value={data.business.operatingSince || '2022'}
              onChange={(e) => updateBusinessField('operatingSince', e.target.value)}
              placeholder="e.g. 2022"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
