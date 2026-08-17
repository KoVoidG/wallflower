'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  Sparkles,
} from 'lucide-react';

interface ScenarioPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  revDelta: string;
  profitDelta: string;
  runwayDelta: string;
  scoreDelta: number;
  verdict: string;
  verdictTone: 'positive' | 'neutral' | 'caution';
  monthlyPoints: number[];
}

const PRESETS: ScenarioPreset[] = [
  {
    id: 'price-up',
    name: '+6% Price Optimization',
    badge: 'High Impact',
    description: 'Calibrated elasticity with 2.1% expected volume loss across core menu items.',
    revDelta: '+฿68,000 / mo',
    profitDelta: '+฿42,500 / mo',
    runwayDelta: '+1.2 months',
    scoreDelta: +9,
    verdict:
      'High Confidence. Demand elasticity indicates strong margin capture without triggering customer churn.',
    verdictTone: 'positive',
    monthlyPoints: [420, 435, 450, 462, 475, 490, 510, 525, 540, 555, 570, 595],
  },
  {
    id: 'hire-sales',
    name: 'Hire 2 Sales Staff',
    badge: 'Expansion',
    description: 'Adds ฿38,000/mo in payroll; requires 18% sales velocity increase to reach break-even.',
    revDelta: '+฿115,000 / mo',
    profitDelta: '+฿28,000 / mo',
    runwayDelta: '-0.8 months',
    scoreDelta: +4,
    verdict:
      'Feasible but cash-sensitive. 3.4 month break-even timeline before positive cash contribution.',
    verdictTone: 'neutral',
    monthlyPoints: [420, 410, 425, 450, 480, 515, 545, 580, 610, 640, 675, 710],
  },
  {
    id: 'bulk-discount',
    name: 'Bulk Order Discount (-12% COGS)',
    badge: 'Working Capital',
    description: 'Negotiates 12% lower cost of goods by locking ฿180,000 in upfront inventory.',
    revDelta: '฿0 / mo',
    profitDelta: '+฿35,200 / mo',
    runwayDelta: '-1.5 months upfront',
    scoreDelta: +6,
    verdict:
      'Moderate Risk. Gross margins surge from 44% to 56%, but cash reserves dip below safety threshold for 60 days.',
    verdictTone: 'caution',
    monthlyPoints: [420, 370, 395, 430, 465, 495, 525, 555, 580, 610, 635, 660],
  },
];

export function InteractiveHeroSandbox() {
  const [activePreset, setActivePreset] = useState<ScenarioPreset>(PRESETS[0]);

  // SVG Chart path calculation
  const points = activePreset.monthlyPoints;
  const minVal = 350;
  const maxVal = 750;
  const height = 180;
  const width = 560;
  const stepX = width / (points.length - 1);

  const coords = points.map((val, i) => {
    const x = i * stepX;
    const y = height - ((val - minVal) / (maxVal - minVal)) * (height - 30) - 15;
    return { x, y };
  });

  const pathD = coords.reduce(
    (acc, curr, i) => (i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`),
    ''
  );

  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl border-2 border-border-strong bg-surface/95 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 text-left transition-all duration-300">
      {/* Top Interactive Preset Selector Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-border/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
              LIVE DECISION WORKSPACE SANDBOX
            </span>
          </div>
          <h3 className="font-display text-lg sm:text-xl font-bold text-text-primary">
            Choose a business move to simulate:
          </h3>
        </div>

        {/* Preset Selector Buttons with smooth active tab glow */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-surface-subtle border border-border/80">
          {PRESETS.map((preset) => {
            const isActive = activePreset.id === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setActivePreset(preset)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer select-none ${
                  isActive
                    ? 'text-white shadow-xs'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="heroPresetActive"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#8B5CF6] shadow-sm shadow-purple-500/30"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{preset.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-start">
        {/* Left Column: Live SVG Trajectory Projection */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-brand" />
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                12-Month Net Cashflow Trajectory (฿ THB)
              </span>
            </div>
            <span className="text-[11px] font-semibold text-text-muted">
              Deterministic Baseline vs Scenario
            </span>
          </div>

          {/* SVG Animated Graph Container */}
          <div className="relative rounded-2xl border border-border/80 bg-surface-subtle/50 p-4 overflow-hidden">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-[180px] overflow-visible"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="45" x2={width} y2="45" stroke="currentColor" className="text-border/40" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2={width} y2="90" stroke="currentColor" className="text-border/40" strokeDasharray="4 4" />
              <line x1="0" y1="135" x2={width} y2="135" stroke="currentColor" className="text-border/40" strokeDasharray="4 4" />

              {/* Baseline Dotted Curve */}
              <path
                d={`M 0 115 L ${width / 3} 110 L ${(width * 2) / 3} 105 L ${width} 100`}
                fill="none"
                stroke="currentColor"
                className="text-text-muted/40"
                strokeWidth="2"
                strokeDasharray="6 6"
              />

              {/* Projected Area */}
              <path d={areaD} fill="url(#chartGradient)" className="transition-all duration-500 ease-out" />

              {/* Projected Line with SVG animation */}
              <path
                d={pathD}
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="transition-all duration-500 ease-out drop-shadow-md"
              />

              {/* Interactive Endpoint Marker */}
              {coords.length > 0 && (
                <circle
                  cx={coords[coords.length - 1].x}
                  cy={coords[coords.length - 1].y}
                  r="5"
                  className="fill-brand stroke-white dark:stroke-slate-900 transition-all duration-500"
                  strokeWidth="2.5"
                />
              )}
            </svg>

            {/* X-Axis Months */}
            <div className="flex justify-between text-[10px] font-mono text-text-muted pt-2 border-t border-border/40">
              <span>M1 (Today)</span>
              <span>M3</span>
              <span>M6</span>
              <span>M9</span>
              <span>M12</span>
            </div>
          </div>

          <p className="text-xs text-text-secondary font-medium">
            <span className="font-bold text-text-primary">Scenario Parameters: </span>
            {activePreset.description}
          </p>
        </div>

        {/* Right Column: Live Calculated Deltas & AI Verdict */}
        <div className="lg:col-span-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Net Profit Delta */}
            <motion.div
              key={`profit-${activePreset.id}`}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-2xl border border-border/80 bg-surface p-4 space-y-1 shadow-xs"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                Net Profit Delta
              </span>
              <div className="font-mono text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {activePreset.profitDelta}
              </div>
              <span className="text-[10px] text-text-secondary font-medium block">
                vs Baseline P&amp;L
              </span>
            </motion.div>

            {/* Revenue Delta */}
            <motion.div
              key={`rev-${activePreset.id}`}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-2xl border border-border/80 bg-surface p-4 space-y-1 shadow-xs"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                Revenue Delta
              </span>
              <div className="font-mono text-lg sm:text-xl font-extrabold text-brand">
                {activePreset.revDelta}
              </div>
              <span className="text-[10px] text-text-secondary font-medium block">
                Top-line growth
              </span>
            </motion.div>

            {/* Cash Runway Impact */}
            <motion.div
              key={`runway-${activePreset.id}`}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-2xl border border-border/80 bg-surface p-4 space-y-1 shadow-xs"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                Runway Impact
              </span>
              <div className="font-mono text-base sm:text-lg font-extrabold text-text-primary">
                {activePreset.runwayDelta}
              </div>
              <span className="text-[10px] text-text-secondary font-medium block">
                Liquidity buffer
              </span>
            </motion.div>

            {/* Health Score Delta */}
            <motion.div
              key={`score-${activePreset.id}`}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-2xl border border-border/80 bg-surface p-4 space-y-1 shadow-xs"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                Health Score
              </span>
              <div className="font-mono text-base sm:text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                +{activePreset.scoreDelta} pts
              </div>
              <span className="text-[10px] text-text-secondary font-medium block">
                Overall robustness
              </span>
            </motion.div>
          </div>

          {/* Capybot AI Executive Advisory Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePreset.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-brand/40 bg-brand-soft/30 p-4 space-y-2 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-brand text-white shadow-2xs">
                    <Sparkles className="size-3.5" />
                  </div>
                  <span className="font-display text-xs font-bold text-text-primary">
                    Capybot Decision Verdict
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    activePreset.verdictTone === 'positive'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : activePreset.verdictTone === 'caution'
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      : 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
                  }`}
                >
                  {activePreset.badge}
                </span>
              </div>

              <p className="text-xs text-text-secondary font-medium leading-relaxed">
                {activePreset.verdict}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
