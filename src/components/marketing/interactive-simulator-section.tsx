'use client';

import { useState } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Percent,
  Users,
  Truck,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';

export function InteractiveSimulatorSection() {
  // 4 Interactive Levers (Initial Baseline Defaults)
  const [priceChange, setPriceChange] = useState<number>(5); // +5%
  const [extraStaff, setExtraStaff] = useState<number>(0); // 0
  const [supplierDiscount, setSupplierDiscount] = useState<number>(0); // 0%
  const [marketingBudget, setMarketingBudget] = useState<number>(15000); // ฿15,000 baseline

  // Baseline Monthly Financial Numbers
  const baseRevenue = 1280000;
  const baseCogs = 716800; // 56% COGS
  const basePayroll = 220000;
  const baseRentUtilities = 95000;
  const baseMarketing = 15000;
  const baseCashReserves = 1020000;

  // Real-time calculations with deterministic formulas
  const priceMultiplier = 1 + priceChange / 100;
  const elasticityVolumeLoss = priceChange > 0 ? (priceChange / 100) * 0.35 : (priceChange / 100) * 0.2;
  const unitSalesVolume = Math.max(0.7, 1 - elasticityVolumeLoss);

  const staffBoost = extraStaff * 0.045; // Each staff member boosts throughput by 4.5%
  const marketingSurge = (marketingBudget - baseMarketing) / baseMarketing;
  const marketingBoost = marketingSurge > 0 ? marketingSurge * 0.08 : marketingSurge * 0.05;

  const totalVolumeMultiplier = unitSalesVolume * (1 + staffBoost + marketingBoost);

  // New Revenue
  const simulatedRevenue = Math.round(baseRevenue * priceMultiplier * totalVolumeMultiplier);

  // New COGS with supplier discount
  const effectiveCogsPct = 0.56 * (1 - supplierDiscount / 100);
  const simulatedCogs = Math.round(simulatedRevenue * effectiveCogsPct);
  const simulatedGrossMargin = Math.round(((simulatedRevenue - simulatedCogs) / simulatedRevenue) * 100);

  // New Payroll with additional staff
  const staffCostPerHead = 19000;
  const simulatedPayroll = basePayroll + extraStaff * staffCostPerHead;

  // Total Expenses & Net Profit
  const simulatedTotalExpenses = simulatedCogs + simulatedPayroll + baseRentUtilities + marketingBudget;
  const simulatedNetProfit = simulatedRevenue - simulatedTotalExpenses;
  const baseNetProfit = baseRevenue - (baseCogs + basePayroll + baseRentUtilities + baseMarketing);
  const profitDelta = simulatedNetProfit - baseNetProfit;
  const profitDeltaPct = (((simulatedNetProfit - baseNetProfit) / Math.abs(baseNetProfit)) * 100).toFixed(1);

  // Simulated Cash Runway
  const monthlyBurnOrSurplus = simulatedNetProfit;
  const simulatedRunway =
    monthlyBurnOrSurplus >= 0
      ? 'Healthy Buffer'
      : `${Math.max(1.2, baseCashReserves / Math.abs(monthlyBurnOrSurplus)).toFixed(1)} mos`;

  // Calculated Health Score (0–100)
  let healthScore = 84;
  if (profitDelta > 30000) healthScore += 5;
  if (profitDelta < -20000) healthScore -= 9;
  if (simulatedGrossMargin >= 45) healthScore += 3;
  if (simulatedGrossMargin < 38) healthScore -= 6;
  healthScore = Math.max(40, Math.min(98, healthScore));

  const handleReset = () => {
    setPriceChange(0);
    setExtraStaff(0);
    setSupplierDiscount(0);
    setMarketingBudget(15000);
  };

  // Slider Fill Percentages
  const pricePct = Math.max(0, Math.min(100, ((priceChange - (-10)) / (20 - (-10))) * 100));
  const staffPct = Math.max(0, Math.min(100, (extraStaff / 4) * 100));
  const supplierPct = Math.max(0, Math.min(100, (supplierDiscount / 15) * 100));
  const marketingPct = Math.max(0, Math.min(100, (marketingBudget / 60000) * 100));

  return (
    <section id="simulator" className="py-20 sm:py-28 border-b border-border/60 bg-background text-left">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand">
              <SlidersHorizontal className="size-3.5" />
              <span>INTERACTIVE DECISION ENGINE</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight">
              Test your next business move in real time.
            </h2>
            <p className="text-base sm:text-lg text-text-secondary font-medium leading-relaxed">
              Adjust realistic operating levers below and see how Wallflower recalculates monthly profit, gross margin, and cash runway simultaneously.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-surface text-xs font-bold text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors shadow-xs shrink-0 cursor-pointer"
          >
            <RotateCcw className="size-3.5 text-text-muted" />
            <span>Reset Sliders</span>
          </button>
        </div>

        {/* The Interactive Control Board (2-Column Grid) */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: 4 In-App Styled Sliders (6 cols) */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl border-2 border-border-strong bg-surface shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="font-display text-sm font-bold text-text-primary">
                Operational Levers
              </span>
              <span className="text-[11px] font-semibold text-text-muted">
                Adjust any variable
              </span>
            </div>

            {/* Slider 1: Price Change */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs gap-3">
                <span className="font-bold text-text-primary flex items-center gap-1.5">
                  <Percent className="size-3.5 text-brand" />
                  <span>Selling Price Adjustment</span>
                </span>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-[#111622] border border-slate-200 dark:border-[#2A344A] shrink-0 tabular-nums text-brand dark:text-[#A5B4FC]">
                  {priceChange >= 0 ? `+${priceChange}%` : `${priceChange}%`}
                </span>
              </div>
              <input
                type="range"
                min="-10"
                max="20"
                step="1"
                value={priceChange}
                onChange={(e) => setPriceChange(Number(e.target.value))}
                className="custom-slider w-full h-2 rounded-lg cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #6366F1 0%, #8B5CF6 ${pricePct}%, var(--slider-track-empty, #E2E8F0) ${pricePct}%, var(--slider-track-empty, #E2E8F0) 100%)`,
                }}
              />
              <div className="flex justify-between text-[10px] text-[#94A3B8] font-medium tabular-nums">
                <span>-10% Discount</span>
                <span>Baseline (0%)</span>
                <span>+20% Premium</span>
              </div>
            </div>

            {/* Slider 2: Additional Headcount */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs gap-3">
                <span className="font-bold text-text-primary flex items-center gap-1.5">
                  <Users className="size-3.5 text-indigo-400" />
                  <span>Add Floor / Sales Staff</span>
                </span>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-[#111622] border border-slate-200 dark:border-[#2A344A] shrink-0 tabular-nums text-indigo-600 dark:text-indigo-400">
                  +{extraStaff} staff (+฿{(extraStaff * 19000).toLocaleString()}/mo)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                step="1"
                value={extraStaff}
                onChange={(e) => setExtraStaff(Number(e.target.value))}
                className="custom-slider w-full h-2 rounded-lg cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #6366F1 0%, #8B5CF6 ${staffPct}%, var(--slider-track-empty, #E2E8F0) ${staffPct}%, var(--slider-track-empty, #E2E8F0) 100%)`,
                }}
              />
              <div className="flex justify-between text-[10px] text-[#94A3B8] font-medium tabular-nums">
                <span>0 (Current)</span>
                <span>+1 Associate</span>
                <span>+2 Staff</span>
                <span>+3 Staff</span>
                <span>+4 Staff</span>
              </div>
            </div>

            {/* Slider 3: Supplier COGS Discount */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs gap-3">
                <span className="font-bold text-text-primary flex items-center gap-1.5">
                  <Truck className="size-3.5 text-emerald-500" />
                  <span>Supplier Cost Negotiation</span>
                </span>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-[#111622] border border-slate-200 dark:border-[#2A344A] shrink-0 tabular-nums text-emerald-600 dark:text-emerald-400">
                  {supplierDiscount > 0 ? `-${supplierDiscount}% COGS Discount` : '0% Standard COGS'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={supplierDiscount}
                onChange={(e) => setSupplierDiscount(Number(e.target.value))}
                className="custom-slider w-full h-2 rounded-lg cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #6366F1 0%, #8B5CF6 ${supplierPct}%, var(--slider-track-empty, #E2E8F0) ${supplierPct}%, var(--slider-track-empty, #E2E8F0) 100%)`,
                }}
              />
              <div className="flex justify-between text-[10px] text-[#94A3B8] font-medium tabular-nums">
                <span>0% Standard</span>
                <span>-5% Volume</span>
                <span>-10% Bulk</span>
                <span>-15% Tier 1</span>
              </div>
            </div>

            {/* Slider 4: Marketing Budget */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs gap-3">
                <span className="font-bold text-text-primary flex items-center gap-1.5">
                  <DollarSign className="size-3.5 text-amber-500" />
                  <span>Monthly Marketing Spend</span>
                </span>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-[#111622] border border-slate-200 dark:border-[#2A344A] shrink-0 tabular-nums text-amber-600 dark:text-amber-400">
                  ฿{marketingBudget.toLocaleString()}/mo
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60000"
                step="5000"
                value={marketingBudget}
                onChange={(e) => setMarketingBudget(Number(e.target.value))}
                className="custom-slider w-full h-2 rounded-lg cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #6366F1 0%, #8B5CF6 ${marketingPct}%, var(--slider-track-empty, #E2E8F0) ${marketingPct}%, var(--slider-track-empty, #E2E8F0) 100%)`,
                }}
              />
              <div className="flex justify-between text-[10px] text-[#94A3B8] font-medium tabular-nums">
                <span>฿0</span>
                <span>฿15k (Baseline)</span>
                <span>฿35k Growth</span>
                <span>฿60k Surge</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Calculated Simulation Output (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Top Primary Outcome Banner */}
            <div className="p-6 sm:p-7 rounded-3xl border-2 border-border-strong bg-surface shadow-xl space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-ai" />
                  <span className="font-display text-xs font-bold text-text-primary uppercase tracking-wider">
                    Simulated Financial Impact
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-text-muted">
                  <ShieldCheck className="size-3.5 text-emerald-500" /> Verified Math
                </span>
              </div>

              {/* 3 Large KPI Dials */}
              <div className="grid grid-cols-3 gap-3">
                {/* Dial 1: Net Profit */}
                <div className="p-4 rounded-2xl border border-border bg-surface-subtle space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                    Net Profit
                  </span>
                  <div className="font-mono text-lg sm:text-xl font-extrabold text-text-primary truncate">
                    ฿{simulatedNetProfit.toLocaleString()}
                  </div>
                  <span
                    className={`text-[11px] font-bold flex items-center gap-1 ${
                      profitDelta >= 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    <TrendingUp className="size-3" />
                    <span>
                      {profitDelta >= 0 ? `+${profitDeltaPct}%` : `${profitDeltaPct}%`}
                    </span>
                  </span>
                </div>

                {/* Dial 2: Runway */}
                <div className="p-4 rounded-2xl border border-border bg-surface-subtle space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                    Runway
                  </span>
                  <div className="font-mono text-lg sm:text-xl font-extrabold text-text-primary truncate">
                    5.1 mos
                  </div>
                  <span className="text-[11px] font-semibold text-text-secondary">
                    {simulatedRunway}
                  </span>
                </div>

                {/* Dial 3: Health Score */}
                <div className="p-4 rounded-2xl border border-border bg-surface-subtle space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                    Health Score
                  </span>
                  <div className="font-mono text-lg sm:text-xl font-extrabold text-brand truncate">
                    {healthScore}
                    <span className="text-xs font-normal text-text-muted">/100</span>
                  </div>
                  <span className="text-[11px] font-semibold text-text-secondary">
                    {healthScore >= 80 ? 'Optimal' : healthScore >= 65 ? 'Moderate' : 'Risk Warning'}
                  </span>
                </div>
              </div>

              {/* Capybot Dynamic Simulation Synthesis */}
              <div className="p-4 rounded-2xl border border-brand/30 bg-brand-soft/40 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-3.5 text-brand" />
                  <span className="font-display text-xs font-bold text-text-primary">
                    Capybot Simulation Synthesis
                  </span>
                </div>
                <p className="text-xs text-text-secondary font-medium leading-relaxed">
                  {profitDelta >= 0
                    ? `This combination generates +฿${profitDelta.toLocaleString()}/mo in incremental net income. Gross margin shifts to ${simulatedGrossMargin}%.`
                    : `Warning: This configuration reduces monthly net income by -฿${Math.abs(
                        profitDelta
                      ).toLocaleString()}. Requires ${(
                        Math.abs(profitDelta) / 450
                      ).toFixed(0)} more transactions/mo to break even.`}
                </p>
              </div>

              {/* Bottom CTA Row */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-medium text-text-secondary">
                  Want to model custom SKUs or multi-branch data?
                </span>
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shadow-md shadow-purple-500/25 hover:opacity-95 transition-all cursor-pointer"
                >
                  <span>Open Full Simulator</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
