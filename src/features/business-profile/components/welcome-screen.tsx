'use client';

import { ArrowRight, Clock, Sparkles, AlertCircle } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  onExploreSample: () => void;
}

export function WelcomeScreen({ onStart, onExploreSample }: WelcomeScreenProps) {
  return (
    <div className="mx-auto max-w-2xl py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2 border-b border-border/60 pb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
          <Sparkles className="size-3.5" />
          Wallflower Decision Intelligence
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
          Build Your Business Baseline
        </h1>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Wallflower uses your monthly operational numbers to compute runway, detect risks, and evaluate business scenarios before spending real capital.
        </p>
      </div>

      {/* Feature Bullet Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg border border-border/80 bg-surface p-3.5 space-y-1">
          <h4 className="text-xs font-bold text-text-primary">1. Goals & Profile</h4>
          <p className="text-[11px] text-text-muted">Target objectives & sector context</p>
        </div>
        <div className="rounded-lg border border-border/80 bg-surface p-3.5 space-y-1">
          <h4 className="text-xs font-bold text-text-primary">2. Financial Data</h4>
          <p className="text-[11px] text-text-muted">Revenue, expenses, cash & debt</p>
        </div>
        <div className="rounded-lg border border-border/80 bg-surface p-3.5 space-y-1">
          <h4 className="text-xs font-bold text-text-primary">3. Decision Rules</h4>
          <p className="text-[11px] text-text-muted">Risk tolerance & forecast horizon</p>
        </div>
      </div>

      {/* Local Browser Storage Notice */}
      <div className="rounded-lg border border-border/80 bg-surface-subtle/60 p-4 flex items-start gap-3">
        <AlertCircle className="size-4 text-brand shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-xs">
          <span className="font-bold text-text-primary block">Browser Local Prototype Storage</span>
          <p className="text-text-secondary leading-relaxed">
            This frontend prototype saves data locally in your browser. It does not connect to external servers or send real financial data over the network. Please do not enter sensitive passwords or personal identification numbers.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onStart}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover transition-colors shadow-xs cursor-pointer"
        >
          <span>Start Baseline Setup</span>
          <ArrowRight className="size-4" />
        </button>

        <button
          type="button"
          onClick={onExploreSample}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer"
        >
          <Sparkles className="size-4 text-brand" />
          <span>Explore with Sample Data</span>
        </button>

        <div className="flex items-center gap-1 text-xs text-text-muted sm:ml-auto">
          <Clock className="size-3.5" />
          <span>~3–5 mins</span>
        </div>
      </div>
    </div>
  );
}
