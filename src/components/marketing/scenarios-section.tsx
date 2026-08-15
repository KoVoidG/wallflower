'use client';

import { useState } from 'react';
import {
  Activity,
  ShieldAlert,
  Sliders,
  PackageCheck,
  Sparkles,
  FileSpreadsheet,
  User,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { BotAvatar } from '@/components/ui/bot-avatar';

export function ScenariosSection() {
  const [priceChange, setPriceChange] = useState(5);

  // Dynamic values calculated from slider
  const profitBoost = 13 + Math.round((priceChange - 5) * 1.2);
  const projectedProfit = 150000 + Math.round(priceChange * 2600);
  const runwayBoost = (0.5 + priceChange * 0.08).toFixed(1);

  const features = [
    {
      icon: Activity,
      title: 'Business Health',
      desc: 'Understand your overall performance at a glance.',
      widget: (
        <div className="p-3.5 rounded-xl border border-border bg-surface-subtle flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Health Score</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-display text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">84</span>
              <span className="text-[10px] font-bold text-text-muted">/100</span>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">Good</span>
        </div>
      ),
    },
    {
      icon: ShieldAlert,
      title: 'Risk Detection',
      desc: 'Identify financial, operational, and inventory risks early.',
      widget: (
        <div className="p-3.5 rounded-xl border border-border bg-surface-subtle space-y-1">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-text-secondary">Cash Flow Risk</span>
            <span className="text-rose-500">High</span>
          </div>
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-text-secondary">Inventory Risk</span>
            <span className="text-amber-500">Medium</span>
          </div>
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-text-secondary">Profitability Risk</span>
            <span className="text-emerald-500">Low</span>
          </div>
        </div>
      ),
    },
    {
      icon: Sliders,
      title: 'Decision Planner',
      desc: 'Simulate scenarios and see the impact before you decide.',
      widget: (
        <div className="p-3.5 rounded-xl border border-border bg-surface-subtle space-y-2">
          <span className="text-[11px] font-bold text-text-secondary block">What if we increase prices by 5%?</span>
          <span className="inline-block px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-2xs">
            Simulate →
          </span>
        </div>
      ),
    },
    {
      icon: PackageCheck,
      title: 'Inventory Analysis',
      desc: 'Track inventory health, turnover, and potential stock issues.',
      widget: (
        <div className="p-3.5 rounded-xl border border-border bg-surface-subtle flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Turnover Rate</span>
            <span className="font-display text-xl font-extrabold text-text-primary block mt-0.5">4.2x</span>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">Good</span>
        </div>
      ),
    },
    {
      icon: Sparkles,
      title: 'Capybot',
      desc: 'Get Capybot-powered insights and strategic recommendations.',
      widget: (
        <div className="p-3.5 rounded-xl border border-border bg-surface-subtle flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider block">Capybot Recommendation</span>
            <span className="text-xs font-bold text-text-primary block mt-0.5">★ Recommended</span>
          </div>
          <span className="text-[10px] font-bold text-tertiary bg-tertiary/10 px-2 py-1 rounded-md">High Confidence</span>
        </div>
      ),
    },
    {
      icon: FileSpreadsheet,
      title: 'Decision Reports',
      desc: 'Export professional reports to share with your team or bank.',
      widget: (
        <div className="p-3.5 rounded-xl border border-border bg-surface-subtle flex items-center justify-between">
          <span className="text-xs font-bold text-text-primary">Executive Summary</span>
          <span className="text-[10px] font-bold text-tertiary">Report Preview</span>
        </div>
      ),
    },
  ];

  return (
    <section id="features" className="py-20 border-b border-border/60 bg-surface-subtle space-y-24 text-left">
      {/* 1. Features Grid Header & Cards */}
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 space-y-12 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Powerful features for smarter decisions
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary font-medium">
            Everything you need to analyze, simulate, and grow your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl border-2 border-border-strong bg-surface space-y-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-surface-subtle text-emerald-600 dark:text-emerald-400 border border-border/60 size-11 flex items-center justify-center">
                  <f.icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-text-primary">{f.title}</h3>
                  <p className="text-xs text-text-secondary font-medium leading-relaxed mt-1">{f.desc}</p>
                </div>
              </div>
              {f.widget}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Interactive Simulation Showcase */}
      <div id="decisions" className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 space-y-12 text-center">
        <div className="max-w-3xl mx-auto space-y-2">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            See the impact before you make a move
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary font-medium">
            Try a quick scenario simulation
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl border-2 border-border-strong bg-surface max-w-4xl mx-auto text-left shadow-xl space-y-6">
          <div className="p-4 rounded-xl border border-border bg-surface-subtle space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Scenario</span>
              <span className="font-display text-sm font-bold text-emerald-600 dark:text-emerald-400">
                Increase Prices: +{priceChange}%
              </span>
            </div>

            <input
              type="range"
              min="-10"
              max="20"
              value={priceChange}
              onChange={(e) => setPriceChange(Number(e.target.value))}
              className="w-full accent-brand cursor-pointer"
            />
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">
              Projected Monthly Impact
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-1">
                <span className="text-xs font-bold text-text-muted block">Projected Profit</span>
                <span className="font-display text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 block">
                  +{profitBoost}%
                </span>
                <span className="text-xs font-bold text-text-primary block">
                  ฿{projectedProfit.toLocaleString()}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-border bg-surface-subtle space-y-1">
                <span className="text-xs font-bold text-text-muted block">Business Health</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">84</span>
                  <span className="text-xs font-bold text-text-muted">/100</span>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">Good</span>
              </div>

              <div className="p-4 rounded-xl border border-border bg-surface-subtle space-y-1">
                <span className="text-xs font-bold text-text-muted block">Cash Runway</span>
                <span className="font-display text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 block">
                  +{runwayBoost} months
                </span>
                <span className="text-xs font-bold text-text-secondary block">Now 5.1 months</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Capybot Section */}
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 space-y-12 text-center">
        <div className="max-w-3xl mx-auto space-y-2">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Your Capybot for everyday decisions
          </h2>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl border-2 border-border-strong bg-surface max-w-4xl mx-auto text-left shadow-xl space-y-5">
          {/* User Question */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-subtle border border-border">
            <div className="size-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold">
              <User className="size-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">You</span>
              <p className="text-xs font-bold text-text-primary mt-0.5">Should I hire another employee?</p>
            </div>
          </div>

          {/* Capybot Response Box */}
          <div className="flex items-start gap-3.5 p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
            <BotAvatar size={34} animate={false} className="shrink-0" />
            <div className="space-y-3">
              <div>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 block">Capybot</span>
                <p className="text-xs text-text-secondary font-medium leading-relaxed mt-1">
                  Based on your current cash runway (5.1 months) and projected sales, hiring 1 employee is feasible. It could increase capacity by 12–15% but will increase monthly expenses by ~฿18,000. I recommend proceeding if you secure at least 10–15% more sales.
                </p>
              </div>

              {/* Tag Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                  <CheckCircle2 className="size-3" /> Feasible
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                  <CheckCircle2 className="size-3" /> Low Risk
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                  <TrendingUp className="size-3" /> Positive Impact
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-tertiary/20 text-tertiary text-[10px] font-bold">
                  Confidence: High
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
