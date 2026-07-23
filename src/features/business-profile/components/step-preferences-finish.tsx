'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label, Caption, H2, H3, BodySmall } from '@/components/ui/typography';
import { OnboardingData, RISK_APPROACH_OPTIONS } from '../schemas';

interface StepPreferencesFinishProps {
  data: OnboardingData;
  onChange: (updated: Partial<OnboardingData>) => void;
  onFocusedFieldChange?: (fieldKey: string) => void;
}

const RUNWAY_SEGMENTS = [
  { value: 2, label: '2 Months' },
  { value: 3, label: '3 Months' },
  { value: 4, label: '4 Months' },
  { value: 6, label: '6 Months' },
  { value: 'custom', label: 'Custom' },
];

const HORIZON_SEGMENTS = [
  { value: 3, label: '3 Months' },
  { value: 6, label: '6 Months' },
  { value: 12, label: '12 Months' },
  { value: 24, label: '24 Months' },
];

export function StepPreferencesFinish({
  data,
  onChange,
  onFocusedFieldChange,
}: StepPreferencesFinishProps) {
  const prefs = data.preferences;

  const [isCustomRunway, setIsCustomRunway] = useState<boolean>(() => {
    return (
      prefs.minimumRunwayMonths !== undefined &&
      ![2, 3, 4, 6].includes(prefs.minimumRunwayMonths)
    );
  });

  const [customRunwayInput, setCustomRunwayInput] = useState<number>(
    () => prefs.minimumRunwayMonths || 5
  );

  const updatePref = (key: keyof OnboardingData['preferences'], val: unknown) => {
    onFocusedFieldChange?.('preferences');
    onChange({
      preferences: {
        ...prefs,
        [key]: val,
      },
    });
  };

  const handleRunwaySegmentClick = (val: number | 'custom') => {
    if (val === 'custom') {
      setIsCustomRunway(true);
      updatePref('minimumRunwayMonths', customRunwayInput);
    } else {
      setIsCustomRunway(false);
      updatePref('minimumRunwayMonths', val);
    }
  };

  const handleCustomRunwayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Math.max(1, parseInt(e.target.value, 10) || 1);
    setCustomRunwayInput(num);
    updatePref('minimumRunwayMonths', num);
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-brand-soft text-brand font-bold text-sm">
            4
          </div>
          <div>
            <H2 className="text-xl font-bold text-text-primary">Decision Preferences & Thresholds</H2>
            <BodySmall className="text-text-secondary">
              Set warning sensitivity, cash runway buffer targets, and decision horizons.
            </BodySmall>
          </div>
        </div>
      </div>

      {/* 1. Risk Approach Cards */}
      <div className="space-y-3">
        <div>
          <H3 className="text-sm font-bold text-text-primary">Recommendation Approach</H3>
          <Caption className="text-text-muted">Choose how aggressively Wallflower flags potential risks.</Caption>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {RISK_APPROACH_OPTIONS.map((opt) => {
            const isSelected = (prefs.riskApproach || 'balanced') === opt.value;

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updatePref('riskApproach', opt.value)}
                className={cn(
                  'flex flex-col justify-between gap-3 rounded-lg border p-4 text-left transition-all cursor-pointer select-none',
                  isSelected
                    ? 'border-brand bg-brand-soft/20 text-brand shadow-2xs font-semibold'
                    : 'border-border bg-surface text-text-primary hover:bg-surface-subtle'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-xs">{opt.label}</span>
                  <div
                    className={cn(
                      'flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                      isSelected ? 'border-brand bg-brand text-white' : 'border-border'
                    )}
                  >
                    {isSelected && <Check className="size-2.5 stroke-[3]" />}
                  </div>
                </div>
                <Caption className="text-[11px] text-text-muted leading-relaxed block">
                  {opt.desc}
                </Caption>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Target Runway Buffer (Segmented Control) */}
      <div className="space-y-3 pt-2 border-t border-border/60">
        <div>
          <H3 className="text-sm font-bold text-text-primary">Target Cash Runway Buffer</H3>
          <Caption className="text-text-muted">Minimum desired cash reserve coverage in operating months.</Caption>
        </div>

        <div className="inline-flex flex-wrap rounded-lg border border-border bg-surface-subtle/60 p-1 gap-1">
          {RUNWAY_SEGMENTS.map((seg) => {
            const isSelected =
              seg.value === 'custom' ? isCustomRunway : !isCustomRunway && prefs.minimumRunwayMonths === seg.value;

            return (
              <button
                key={String(seg.value)}
                type="button"
                onClick={() => handleRunwaySegmentClick(seg.value as number | 'custom')}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer select-none',
                  isSelected
                    ? 'bg-brand text-white shadow-2xs'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                {seg.label}
              </button>
            );
          })}
        </div>

        {isCustomRunway && (
          <div className="flex items-center gap-2 pt-1">
            <Label className="text-xs font-semibold shrink-0">Custom Runway Months:</Label>
            <input
              type="number"
              min="1"
              max="24"
              value={customRunwayInput}
              onChange={handleCustomRunwayChange}
              className="w-24 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-text-primary focus:border-brand focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* 3. Decision Horizon (Segmented Control) */}
      <div className="space-y-3 pt-2 border-t border-border/60">
        <div>
          <H3 className="text-sm font-bold text-text-primary">Planning & Simulation Horizon</H3>
          <Caption className="text-text-muted">Forward window for cash projection calculations.</Caption>
        </div>

        <div className="inline-flex flex-wrap rounded-lg border border-border bg-surface-subtle/60 p-1 gap-1">
          {HORIZON_SEGMENTS.map((seg) => {
            const isSelected = (prefs.forecastMonths || 6) === seg.value;

            return (
              <button
                key={seg.value}
                type="button"
                onClick={() => updatePref('forecastMonths', seg.value)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer select-none',
                  isSelected
                    ? 'bg-brand text-white shadow-2xs'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                {seg.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
