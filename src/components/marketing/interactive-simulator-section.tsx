'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Percent,
  Users,
  Truck,
  DollarSign,
} from 'lucide-react';
import { Noise } from '@/components/ui/noise';

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
    <section id="simulator" className="py-28 sm:py-40 bg-[#0A0F24] text-left relative overflow-hidden">
      <Noise />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1200px] pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-purple-500/20 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 space-y-16 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-4xl space-y-6">
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
              Change the plan.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                See what happens.
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-indigo-200/70 font-medium leading-relaxed">
              Adjust realistic operating levers below and watch Wallflower instantaneously recalculate monthly profit, gross margin, and cash runway using deterministic models.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-indigo-200/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="size-4" />
            <span>Reset Sliders</span>
          </button>
        </div>

        {/* The Interactive Control Board (2-Column Grid) */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: 4 In-App Styled Sliders (6 cols) */}
          <div className="lg:col-span-6 p-8 sm:p-10 rounded-[2rem] border-2 border-white/10 bg-[#070A17]/80 backdrop-blur-2xl shadow-2xl space-y-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <span className="font-display text-lg font-bold text-white">
                Operational Levers
              </span>
              <span className="text-xs font-semibold text-indigo-200/50 uppercase tracking-widest">
                Adjust any variable
              </span>
            </div>

            {/* Slider 1: Price Change */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm gap-3">
                <span className="font-bold text-white flex items-center gap-2">
                  <Percent className="size-4 text-purple-400" />
                  <span>Selling Price Adjustment</span>
                </span>
                <span className="font-mono text-sm font-bold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 shrink-0 tabular-nums text-purple-300">
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
                className="custom-slider w-full h-3 rounded-lg cursor-pointer transition-all"
                style={{
                  background: `linear-gradient(to right, #6366F1 0%, #8B5CF6 ${pricePct}%, rgba(255,255,255,0.1) ${pricePct}%, rgba(255,255,255,0.1) 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-indigo-200/50 font-medium tabular-nums">
                <span>-10% Discount</span>
                <span>Baseline</span>
                <span>+20% Premium</span>
              </div>
            </div>

            {/* Slider 2: Additional Headcount */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm gap-3">
                <span className="font-bold text-white flex items-center gap-2">
                  <Users className="size-4 text-blue-400" />
                  <span>Add Floor / Sales Staff</span>
                </span>
                <span className="font-mono text-sm font-bold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 shrink-0 tabular-nums text-blue-300">
                  +{extraStaff} staff
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                step="1"
                value={extraStaff}
                onChange={(e) => setExtraStaff(Number(e.target.value))}
                className="custom-slider w-full h-3 rounded-lg cursor-pointer transition-all"
                style={{
                  background: `linear-gradient(to right, #3B82F6 0%, #60A5FA ${staffPct}%, rgba(255,255,255,0.1) ${staffPct}%, rgba(255,255,255,0.1) 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-indigo-200/50 font-medium tabular-nums">
                <span>0 (Current)</span>
                <span>+4 Staff</span>
              </div>
            </div>

            {/* Slider 3: Supplier COGS Discount */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm gap-3">
                <span className="font-bold text-white flex items-center gap-2">
                  <Truck className="size-4 text-emerald-400" />
                  <span>Supplier Negotiation</span>
                </span>
                <span className="font-mono text-sm font-bold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 shrink-0 tabular-nums text-emerald-300">
                  {supplierDiscount > 0 ? `-${supplierDiscount}% COGS` : '0%'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={supplierDiscount}
                onChange={(e) => setSupplierDiscount(Number(e.target.value))}
                className="custom-slider w-full h-3 rounded-lg cursor-pointer transition-all"
                style={{
                  background: `linear-gradient(to right, #10B981 0%, #34D399 ${supplierPct}%, rgba(255,255,255,0.1) ${supplierPct}%, rgba(255,255,255,0.1) 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-indigo-200/50 font-medium tabular-nums">
                <span>0% Standard</span>
                <span>-15% Tier 1</span>
              </div>
            </div>

            {/* Slider 4: Marketing Budget */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm gap-3">
                <span className="font-bold text-white flex items-center gap-2">
                  <DollarSign className="size-4 text-amber-400" />
                  <span>Marketing Spend</span>
                </span>
                <span className="font-mono text-sm font-bold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 shrink-0 tabular-nums text-amber-300">
                  ฿{(marketingBudget / 1000).toFixed(0)}k/mo
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60000"
                step="5000"
                value={marketingBudget}
                onChange={(e) => setMarketingBudget(Number(e.target.value))}
                className="custom-slider w-full h-3 rounded-lg cursor-pointer transition-all"
                style={{
                  background: `linear-gradient(to right, #F59E0B 0%, #FBBF24 ${marketingPct}%, rgba(255,255,255,0.1) ${marketingPct}%, rgba(255,255,255,0.1) 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-indigo-200/50 font-medium tabular-nums">
                <span>฿0</span>
                <span>฿60k Surge</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Calculated Simulation Output (6 cols) */}
          <div className="lg:col-span-6 flex flex-col h-full">
            <div className="p-8 sm:p-10 rounded-[2rem] border-2 border-white/10 bg-[#070A17]/80 backdrop-blur-2xl shadow-2xl space-y-8 text-left relative overflow-hidden flex-1 flex flex-col shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
              
              <div className="flex items-center justify-between pb-4 border-b border-white/5 relative z-10">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-5 text-purple-400" />
                  <span className="font-display text-lg font-bold text-white tracking-wider">
                    Simulated Output
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <ShieldCheck className="size-4" /> Deterministic Math
                </span>
              </div>

              {/* Large KPI Display */}
              <div className="grid grid-cols-2 gap-6 relative z-10 flex-1">
                {/* Dial 1: Net Profit */}
                <div className="p-6 rounded-3xl border border-white/5 bg-[#0B1024] flex flex-col justify-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-200/50 block mb-2">
                    Net Profit / mo
                  </span>
                  <div className="font-mono text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white truncate relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={simulatedNetProfit}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                      >
                        ฿{simulatedNetProfit.toLocaleString()}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <div className="mt-4">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={profitDelta}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          profitDelta >= 0
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        <TrendingUp className={`size-3.5 ${profitDelta < 0 && 'rotate-180'}`} />
                        <span>
                          {profitDelta >= 0 ? `+${profitDeltaPct}%` : `${profitDeltaPct}%`} vs Baseline
                        </span>
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="space-y-6 flex flex-col justify-between">
                  {/* Dial 2: Runway */}
                  <div className="p-5 rounded-2xl border border-white/5 bg-[#0B1024] flex-1 flex flex-col justify-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200/50 block mb-1">
                      Cash Runway
                    </span>
                    <div className="font-mono text-xl sm:text-2xl font-extrabold text-white truncate">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={simulatedRunway}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          {simulatedRunway}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Dial 3: Health Score */}
                  <div className="p-5 rounded-2xl border border-white/5 bg-[#0B1024] flex-1 flex flex-col justify-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200/50 block mb-1">
                      Health Score
                    </span>
                    <div className="font-mono text-xl sm:text-2xl font-extrabold text-indigo-400 truncate">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={healthScore}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          {healthScore} <span className="text-sm font-normal text-indigo-200/50">/100</span>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>

              {/* Capybot Dynamic Simulation Synthesis */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`${profitDelta}`}
                  initial={{ opacity: 0.5, backgroundColor: 'rgba(139, 92, 246, 0.05)' }}
                  animate={{ opacity: 1, backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
                  className="p-5 rounded-2xl border border-purple-500/20 space-y-2 relative z-10"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-purple-400" />
                    <span className="font-display text-sm font-bold text-white">
                      AI Explanation
                    </span>
                  </div>
                  <p className="text-sm text-indigo-100/90 font-medium leading-relaxed">
                    {profitDelta >= 0
                      ? `This scenario generates +฿${profitDelta.toLocaleString()}/mo in incremental net income. Gross margin shifts to ${simulatedGrossMargin}%.`
                      : `Warning: This configuration reduces monthly net income by -฿${Math.abs(
                          profitDelta
                        ).toLocaleString()}. Requires ${(
                          Math.abs(profitDelta) / 450
                        ).toFixed(0)} more transactions/mo to break even.`}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
