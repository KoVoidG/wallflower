'use client';

import {
  BarChart3,
  FileText,
  Sprout,
  Check,
  ArrowLeft,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export type SetupMethod = 'know_numbers' | 'need_guidance' | 'just_starting';

interface StepSetupMethodProps {
  selectedMethod: SetupMethod;
  onSelectMethod: (method: SetupMethod) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function StepSetupMethod({
  selectedMethod,
  onSelectMethod,
  onNext,
  onPrev,
}: StepSetupMethodProps) {
  const options = [
    {
      id: 'know_numbers' as SetupMethod,
      icon: BarChart3,
      title: 'I already know my business numbers',
      description: 'I have my financial records ready.',
      badge: '~5 min',
    },
    {
      id: 'need_guidance' as SetupMethod,
      icon: FileText,
      title: 'I have some records but need guidance',
      description:
        "I'll provide what I have and you'll guide me through the rest.",
      badge: '~6-8 min',
    },
    {
      id: 'just_starting' as SetupMethod,
      icon: Sprout,
      title: "I'm just starting or don't keep financial records",
      description: "I'll start with basic info and estimate the rest.",
      badge: '~3-4 min',
    },
  ];

  return (
    <div className="max-w-md mx-auto py-6 px-4 space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="space-y-1 text-left">
        <h2 className="font-display text-xl font-bold text-text-primary tracking-tight">
          How would you like to set up your business?
        </h2>
        <p className="text-xs text-text-secondary font-medium">
          We&apos;ll customize the experience based on your needs.
        </p>
      </div>

      {/* Cards List */}
      <div className="space-y-3">
        {options.map((opt) => {
          const isSelected = selectedMethod === opt.id;
          const Icon = opt.icon;

          return (
            <div
              key={opt.id}
              onClick={() => onSelectMethod(opt.id)}
              className={cn(
                'relative flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer select-none',
                isSelected
                  ? 'border-[#6366F1] bg-[#6366F1]/5 dark:bg-[#6366F1]/10 shadow-xs'
                  : 'border-border bg-surface hover:border-border-strong hover:bg-surface-hover',
              )}
            >
              <div
                className={cn(
                  'p-2.5 rounded-xl shrink-0 mt-0.5 transition-colors',
                  isSelected
                    ? 'bg-[#6366F1]/15 text-[#4F46E5] dark:text-[#A5B4FC] border border-[#6366F1]/25'
                    : 'bg-surface-subtle text-text-primary border border-border/60'
                )}
              >
                <Icon className="size-5" />
              </div>

              <div className="flex-1 min-w-0 pr-6 space-y-1">
                <h3 className="text-xs font-bold text-text-primary leading-tight">
                  {opt.title}
                </h3>
                <p className="text-[11px] text-text-secondary font-medium leading-normal">
                  {opt.description}
                </p>
                <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-surface-subtle text-text-muted border border-border/60">
                  {opt.badge}
                </span>
              </div>

              {isSelected && (
                <div className="absolute top-4 right-4 size-5 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white flex items-center justify-center shadow-xs">
                  <Check className="size-3.5 stroke-[3]" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Lock info */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-text-muted font-medium pt-1">
        <Lock className="size-3" />
        <span>You can always update your information later.</span>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-border/60">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          className="text-xs font-semibold gap-1.5 cursor-pointer px-4"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back</span>
        </Button>

        <Button
          type="button"
          onClick={onNext}
          className="text-xs font-bold gap-1.5 cursor-pointer bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:opacity-95 shadow-md shadow-indigo-500/25 px-5 border-0"
        >
          <span>Continue</span>
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
