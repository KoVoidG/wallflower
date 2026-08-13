// src/features/simulations/components/workspace/input-controls.tsx
// Shared input controls for the simulation workspace.
// Each control renders: label, description, value, unit, min/max.
'use client';

import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import type { InputConfig } from '../../engine/scenario-configs';
import { Select } from '@/components/ui/select';

// ─── Percent Slider ────────────────────────────────────────────────────────

interface PercentSliderProps {
  config: InputConfig;
  value: number;
  onChange: (value: number) => void;
  contextNote?: string;
}

export function PercentSliderInput({
  config,
  value,
  onChange,
  contextNote,
}: PercentSliderProps) {
  const min = config.min ?? -20;
  const max = config.max ?? 20;
  const step = config.step ?? 0.5;
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const getValueColor = () => {
    if (value > 0) return 'text-emerald-600 dark:text-emerald-400';
    if (value < 0) return 'text-red-500 dark:text-red-400';
    return 'text-[#0F172A] dark:text-white';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5 flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-[#0F172A] dark:text-white">
              {config.label}
            </span>
            {config.description && (
              <span title={config.description}>
                <Info className="size-4 text-[#94A3B8] shrink-0 cursor-help" />
              </span>
            )}
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            {config.description}
          </p>
        </div>
        <span
          className={cn(
            'font-mono text-sm font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-[#111622] border border-slate-200 dark:border-[#2A344A] shrink-0 tabular-nums',
            getValueColor(),
          )}
        >
          {value > 0 ? `+${value}%` : `${value}%`}
        </span>
      </div>

      <div className="space-y-1.5">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="custom-slider w-full h-2 rounded-lg cursor-pointer"
          style={{
            background: `linear-gradient(to right, #6366F1 0%, #8B5CF6 ${pct}%, var(--slider-track-empty, #E2E8F0) ${pct}%, var(--slider-track-empty, #E2E8F0) 100%)`,
          }}
        />
        <div className="flex justify-between text-[10px] text-[#94A3B8] font-medium tabular-nums">
          <span>{min}%</span>
          {min < 0 && max > 0 && <span>0%</span>}
          <span>{max > 0 ? `+${max}%` : `${max}%`}</span>
        </div>
      </div>

      {contextNote && (
        <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] italic">
          {contextNote}
        </p>
      )}
    </div>
  );
}

// ─── Currency Input ────────────────────────────────────────────────────────

interface CurrencyInputProps {
  config: InputConfig;
  value: number;
  onChange: (value: number) => void;
}

export function CurrencyInput({ config, value, onChange }: CurrencyInputProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-semibold text-[#0F172A] dark:text-white">
          {config.label}
        </span>
        {config.description && (
          <span title={config.description}>
            <Info className="size-4 text-[#94A3B8] shrink-0 cursor-help" />
          </span>
        )}
      </div>
      <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
        {config.description}
      </p>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#64748B] dark:text-[#94A3B8]">
          ฿
        </span>
        <input
          type="number"
          min={config.min}
          max={config.max}
          step={config.step ?? 1000}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            'w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-[#2A344A] text-sm font-mono font-semibold',
            'bg-white dark:bg-[#111622] text-[#0F172A] dark:text-white',
            'focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/30',
            'transition-colors',
          )}
        />
      </div>
    </div>
  );
}

// ─── Count Stepper ─────────────────────────────────────────────────────────

interface CountStepperProps {
  config: InputConfig;
  value: number;
  onChange: (value: number) => void;
}

export function CountStepper({ config, value, onChange }: CountStepperProps) {
  const min = config.min ?? 0;
  const max = config.max ?? 100;
  const step = config.step ?? 1;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-semibold text-[#0F172A] dark:text-white">
          {config.label}
        </span>
        {config.description && (
          <span title={config.description}>
            <Info className="size-4 text-[#94A3B8] shrink-0 cursor-help" />
          </span>
        )}
      </div>
      <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
        {config.description}
      </p>
      <div className="inline-flex items-center rounded-xl border border-slate-200 dark:border-[#2A344A] bg-white dark:bg-[#111622] overflow-hidden">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - step))}
          disabled={value <= min}
          className="px-3.5 py-2.5 text-sm font-bold text-[#64748B] dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1E2638] disabled:opacity-30 cursor-pointer transition-colors border-r border-slate-200 dark:border-[#2A344A]"
        >
          −
        </button>
        <span className="px-5 py-2.5 text-sm font-mono font-bold text-[#0F172A] dark:text-white tabular-nums min-w-[60px] text-center">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + step))}
          disabled={value >= max}
          className="px-3.5 py-2.5 text-sm font-bold text-[#64748B] dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1E2638] disabled:opacity-30 cursor-pointer transition-colors border-l border-slate-200 dark:border-[#2A344A]"
        >
          +
        </button>
      </div>
    </div>
  );
}

// ─── Duration Select ───────────────────────────────────────────────────────

interface DurationSelectProps {
  config: InputConfig;
  value: string;
  onChange: (value: string) => void;
}

export function DurationSelect({
  config,
  value,
  onChange,
}: DurationSelectProps) {
  const options = config.options ?? [];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-semibold text-[#0F172A] dark:text-white">
          {config.label}
        </span>
        {config.description && (
          <span title={config.description}>
            <Info className="size-4 text-[#94A3B8] shrink-0 cursor-help" />
          </span>
        )}
      </div>
      <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
        {config.description}
      </p>
      <Select options={options} value={value} onChange={onChange} />
    </div>
  );
}

// ─── Select Input ──────────────────────────────────────────────────────────

interface SelectInputProps {
  config: InputConfig;
  value: string;
  onChange: (value: string) => void;
}

export function SelectInput({ config, value, onChange }: SelectInputProps) {
  const options = config.options ?? [];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-semibold text-[#0F172A] dark:text-white">
          {config.label}
        </span>
        {config.description && (
          <span title={config.description}>
            <Info className="size-4 text-[#94A3B8] shrink-0 cursor-help" />
          </span>
        )}
      </div>
      <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
        {config.description}
      </p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-[#2A344A] text-sm font-medium',
          'bg-white dark:bg-[#111622] text-[#0F172A] dark:text-white',
          'focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/30',
          'cursor-pointer appearance-none',
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Dynamic Input Renderer ────────────────────────────────────────────────

interface DynamicInputProps {
  config: InputConfig;
  value: number | string;
  onChange: (value: number | string) => void;
  contextNote?: string;
}

export function DynamicInput({
  config,
  value,
  onChange,
  contextNote,
}: DynamicInputProps) {
  switch (config.type) {
    case 'percent':
      return (
        <PercentSliderInput
          config={config}
          value={Number(value)}
          onChange={(v) => onChange(v)}
          contextNote={contextNote}
        />
      );
    case 'currency':
      return (
        <CurrencyInput
          config={config}
          value={Number(value)}
          onChange={(v) => onChange(v)}
        />
      );
    case 'count':
      return (
        <CountStepper
          config={config}
          value={Number(value)}
          onChange={(v) => onChange(v)}
        />
      );
    case 'duration':
      return (
        <DurationSelect
          config={config}
          value={String(value)}
          onChange={(v) => onChange(v)}
        />
      );
    case 'select':
      return (
        <SelectInput
          config={config}
          value={String(value)}
          onChange={(v) => onChange(v)}
        />
      );
    default:
      return (
        <CurrencyInput
          config={config}
          value={Number(value)}
          onChange={(v) => onChange(v)}
        />
      );
  }
}
