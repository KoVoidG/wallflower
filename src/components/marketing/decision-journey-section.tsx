'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  AlertTriangle,
  Sliders,
  Columns3,
  FileCheck2,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Download,
  Users,
  Percent,
} from 'lucide-react';

interface Stage {
  id: string;
  stepNumber: string;
  title: string;
  shortDesc: string;
  icon: typeof Activity;
  badge: string;
  headline: string;
  detailedText: string;
  keyTakeaway: string;
}

const STAGES: Stage[] = [
  {
    id: 'understand',
    stepNumber: '01',
    title: 'Understand',
    shortDesc: 'Instant holistic view of operational health & cash runway',
    icon: Activity,
    badge: 'STAGE 1: BASELINE VISIBILITY',
    headline: 'Know your exact business baseline before touching any variable.',
    detailedText:
      'Wallflower connects your sales, inventory, and cost records to produce a real-time Business Health Score (0–100), net margin breakdown, and true cash runway. No more digging through multiple spreadsheets.',
    keyTakeaway: 'Current Health: 84/100 (Good) • Cash Runway: 5.1 Months • Revenue: ฿1,280,000/mo',
  },
  {
    id: 'diagnose',
    stepNumber: '02',
    title: 'Diagnose',
    shortDesc: 'Automated detection of hidden risks and margin leaks',
    icon: AlertTriangle,
    badge: 'STAGE 2: PROACTIVE DIAGNOSIS',
    headline: 'Uncover margin compression and liquidity bottlenecks before they hurt.',
    detailedText:
      'Our risk diagnosis engine continuously audits your working capital, supplier dependencies, and inventory turnover. It flags deadstock build-up, supplier cost creep, and upcoming cash cliffs 60–90 days ahead.',
    keyTakeaway: 'Detected 2 high-priority risks: Deadstock in Category B (-฿45k) & Cash Runway Warning at Month 4.',
  },
  {
    id: 'simulate',
    stepNumber: '03',
    title: 'Simulate',
    shortDesc: 'Test pricing, hiring, promotions & inventory in a safe sandbox',
    icon: Sliders,
    badge: 'STAGE 3: WHAT-IF PLAYGROUND',
    headline: 'Stress-test business choices without risking a single Baht.',
    detailedText:
      'Adjust selling prices, hire floor staff, test wholesale supplier discounts, or launch a holiday promo. Wallflower recalculates your gross margin, customer elasticity, break-even volume, and cash burn instantaneously.',
    keyTakeaway: 'Tested Scenario: +5% Price Optimization yields +฿163,000/mo profit (+18.3%) with negligible demand loss.',
  },
  {
    id: 'compare',
    stepNumber: '04',
    title: 'Compare',
    shortDesc: 'Side-by-side multi-scenario matrix with Best & Worst cases',
    icon: Columns3,
    badge: 'STAGE 4: SCENARIO MATRIX',
    headline: 'Weigh competing options side-by-side with clear risk buffers.',
    detailedText:
      'Never execute a decision based on single-point hope. Compare Conservative, Expected, and Aggressive outcomes side-by-side. Inspect downside buffers and payback timelines so you can pick the safest path to growth.',
    keyTakeaway: 'Pricing Adjustment ranked #1 for ROI (42% ROI, 0-day payback) vs Hiring (14% ROI, 4.2 mo payback).',
  },
  {
    id: 'decide',
    stepNumber: '05',
    title: 'Decide',
    shortDesc: 'Capybot plain-English memo & exportable bank-ready reports',
    icon: FileCheck2,
    badge: 'STAGE 5: CONFIDENT ACTION',
    headline: 'Actionable executive summaries and verified reports ready to share.',
    detailedText:
      'Capybot synthesizes the mathematical results into plain-language business recommendations. Generate verified, bank-ready PDF Decision Reports for partners, lenders, or team alignment in one click.',
    keyTakeaway: 'One-click executive decision memo generated with full assumption transparency and audit trail.',
  },
];

export function DecisionJourneySection() {
  const [activeStageId, setActiveStageId] = useState<string>(STAGES[0].id);
  const activeStage = STAGES.find((s) => s.id === activeStageId) || STAGES[0];

  return (
    <section id="journey" className="py-20 sm:py-28 border-b border-border/60 bg-background text-left">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand">
            <Sparkles className="size-3.5 text-ai" />
            <span>THE WALLFLOWER DECISION LIFECYCLE</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight leading-tight">
            From raw business data to confident decisions in{' '}
            <span className="text-brand">five clear stages</span>.
          </h2>
          <p className="text-base sm:text-lg text-text-secondary font-medium leading-relaxed">
            Wallflower isn&apos;t just another passive dashboard. It is a decision workflow designed to guide you from diagnosis to simulation, comparison, and verified execution.
          </p>
        </div>

        {/* 5-Step Horizontal Tab Navigator */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 border-b border-border/60 pb-6">
          {STAGES.map((stage) => {
            const isSelected = stage.id === activeStageId;
            const Icon = stage.icon;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStageId(stage.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative ${
                  isSelected
                    ? 'border-brand bg-brand-soft/80 shadow-md ring-1 ring-brand/30'
                    : 'border-border/70 bg-surface-subtle/50 hover:bg-surface-hover text-text-secondary hover:border-border-strong'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-mono text-xs font-extrabold ${
                      isSelected ? 'text-brand' : 'text-text-muted'
                    }`}
                  >
                    {stage.stepNumber}
                  </span>
                  <div
                    className={`size-7 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? 'bg-brand text-white shadow-xs'
                        : 'bg-surface text-text-muted border border-border/60'
                    }`}
                  >
                    <Icon className="size-3.5" />
                  </div>
                </div>

                <h3
                  className={`font-display text-sm font-bold truncate ${
                    isSelected ? 'text-text-primary' : 'text-text-secondary'
                  }`}
                >
                  {stage.title}
                </h3>
                <p className="text-[11px] text-text-muted font-medium line-clamp-2 mt-1 hidden sm:block">
                  {stage.shortDesc}
                </p>

                {isSelected && (
                  <motion.div
                    layoutId="activeJourneyTabIndicator"
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-8 h-1 bg-brand rounded-full hidden sm:block"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Stage Content Grid (Split 2-Column Showcase) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStage.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25 }}
            className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center"
          >
            {/* Left Column: Stage Editorial Explanation (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-brand-soft border border-brand-border text-brand">
                <span>{activeStage.badge}</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight leading-snug">
                {activeStage.headline}
              </h3>

              <p className="text-sm sm:text-base text-text-secondary font-medium leading-relaxed">
                {activeStage.detailedText}
              </p>

              {/* Highlight takeaway pill */}
              <div className="p-4 rounded-2xl bg-surface-subtle border border-border/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                  Stage Output & Insight
                </span>
                <p className="text-xs font-bold text-text-primary leading-relaxed">
                  {activeStage.keyTakeaway}
                </p>
              </div>

              {/* Next Step Jump button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = STAGES.findIndex((s) => s.id === activeStageId);
                    const nextIndex = (currentIndex + 1) % STAGES.length;
                    setActiveStageId(STAGES[nextIndex].id);
                  }}
                  className="inline-flex items-center gap-2 text-xs font-bold text-brand hover:text-brand-hover cursor-pointer"
                >
                  <span>
                    Explore Stage {STAGES[(STAGES.findIndex((s) => s.id === activeStageId) + 1) % STAGES.length].stepNumber}:{' '}
                    {STAGES[(STAGES.findIndex((s) => s.id === activeStageId) + 1) % STAGES.length].title}
                  </span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Authentic Recreated UI Showcase Card (7 cols) */}
            <div className="lg:col-span-7 w-full">
              {activeStage.id === 'understand' && <UnderstandStageMockup />}
              {activeStage.id === 'diagnose' && <DiagnoseStageMockup />}
              {activeStage.id === 'simulate' && <SimulateStageMockup />}
              {activeStage.id === 'compare' && <CompareStageMockup />}
              {activeStage.id === 'decide' && <DecideStageMockup />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// ── Stage 1 Recreated UI: Business Health & Financial Snapshot ───────────────
function UnderstandStageMockup() {
  return (
    <div className="p-6 rounded-3xl border-2 border-border-strong bg-surface shadow-2xl space-y-5 text-left">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-display text-xs font-bold text-text-primary uppercase tracking-wider">
            Overview • Business Health Snapshot
          </span>
        </div>
        <span className="text-[10px] font-bold text-text-muted">Live Verified Baseline</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl border border-border bg-surface-subtle space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
            Health Score
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-3xl font-extrabold text-emerald-500">84</span>
            <span className="text-xs font-bold text-text-muted">/100</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md inline-block">
            Good (Top 18% SME)
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-surface-subtle space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
            Monthly Revenue
          </span>
          <span className="font-metric text-xl font-extrabold text-text-primary block">
            ฿1,280,000
          </span>
          <span className="text-[10px] font-bold text-emerald-500">+12.5% vs last month</span>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-surface-subtle space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
            Cash Runway
          </span>
          <span className="font-metric text-xl font-extrabold text-text-primary block">
            5.1 Months
          </span>
          <span className="text-[10px] font-bold text-emerald-500">Safe Buffer (Above 3.0 min)</span>
        </div>
      </div>

      {/* Sub metrics breakdown */}
      <div className="p-4 rounded-2xl border border-border bg-surface-subtle space-y-3">
        <span className="text-xs font-bold text-text-primary block">
          Working Capital & Margin Breakdown
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
          <div className="p-2.5 rounded-xl bg-surface border border-border/60">
            <span className="text-[10px] text-text-muted block">Gross Margin</span>
            <span className="font-bold text-text-primary">32.4%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface border border-border/60">
            <span className="text-[10px] text-text-muted block">Net Margin</span>
            <span className="font-bold text-emerald-500">12.7%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface border border-border/60">
            <span className="text-[10px] text-text-muted block">Inv. Turnover</span>
            <span className="font-bold text-text-primary">4.2x / yr</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface border border-border/60">
            <span className="text-[10px] text-text-muted block">Monthly Burn</span>
            <span className="font-bold text-text-primary">฿264,000</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Stage 2 Recreated UI: Risk Detection Radar ───────────────────────────────
function DiagnoseStageMockup() {
  return (
    <div className="p-6 rounded-3xl border-2 border-border-strong bg-surface shadow-2xl space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-4 text-rose-500" />
          <span className="font-display text-xs font-bold text-text-primary uppercase tracking-wider">
            Risk Radar • Automated Diagnostics
          </span>
        </div>
        <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md">
          2 Warnings Detected
        </span>
      </div>

      <div className="space-y-3">
        {/* Risk 1: High Priority */}
        <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-rose-500" />
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                Cash Runway Cliff in Month 4
              </span>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded">
              High Severity
            </span>
          </div>
          <p className="text-xs text-text-secondary font-medium leading-relaxed">
            If supplier cost increases by 4.5% as announced without price adjustments, your runway will drop from 5.1 to 2.4 months.
          </p>
          <span className="text-[11px] font-bold text-brand hover:underline cursor-pointer inline-block">
            Simulate Price Pass-through →
          </span>
        </div>

        {/* Risk 2: Medium Priority */}
        <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-500" />
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                Dead Inventory Accumulation (Category B)
              </span>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded">
              Medium Severity
            </span>
          </div>
          <p className="text-xs text-text-secondary font-medium leading-relaxed">
            ฿45,000 worth of stock has remained stationary for &gt;75 days, locking up working capital buffer.
          </p>
          <span className="text-[11px] font-bold text-brand hover:underline cursor-pointer inline-block">
            Simulate Flash Clearance Promo →
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Stage 3 Recreated UI: Scenario Simulator Playground ──────────────────────
function SimulateStageMockup() {
  return (
    <div className="p-6 rounded-3xl border-2 border-border-strong bg-surface shadow-2xl space-y-5 text-left">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="size-4 text-brand" />
          <span className="font-display text-xs font-bold text-text-primary uppercase tracking-wider">
            Scenario Simulator • Custom Sandbox
          </span>
        </div>
        <span className="text-[10px] font-bold text-brand bg-brand-soft px-2 py-0.5 rounded-md">
          Deterministic Calculation
        </span>
      </div>

      <div className="space-y-4">
        {/* Variable 1 */}
        <div className="p-3.5 rounded-2xl border border-border bg-surface-subtle space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-text-secondary flex items-center gap-1.5">
              <Percent className="size-3.5 text-brand" /> Price Adjustment
            </span>
            <span className="text-brand font-mono">+5.0% Across Top SKUs</span>
          </div>
          <div className="h-2 rounded-full bg-border relative overflow-hidden">
            <div className="h-full bg-brand rounded-full w-[65%]" />
          </div>
        </div>

        {/* Variable 2 */}
        <div className="p-3.5 rounded-2xl border border-border bg-surface-subtle space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-text-secondary flex items-center gap-1.5">
              <Users className="size-3.5 text-indigo-400" /> Additional Headcount
            </span>
            <span className="text-text-primary font-mono">+1 Associate (฿18k/mo)</span>
          </div>
          <div className="h-2 rounded-full bg-border relative overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full w-[30%]" />
          </div>
        </div>
      </div>

      {/* Instant Result Box */}
      <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 space-y-2">
        <div className="flex justify-between items-baseline">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
            Projected Monthly Profit Delta
          </span>
          <span className="font-metric text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
            +฿145,000 / mo (+16.4%)
          </span>
        </div>
        <p className="text-[11px] text-text-secondary font-medium">
          Price increase easily absorbs the new payroll cost while expanding overall customer service capacity by 15%.
        </p>
      </div>
    </div>
  );
}

// ── Stage 4 Recreated UI: Scenario Comparison Matrix ────────────────────────
function CompareStageMockup() {
  return (
    <div className="p-6 rounded-3xl border-2 border-border-strong bg-surface shadow-2xl space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Columns3 className="size-4 text-brand" />
          <span className="font-display text-xs font-bold text-text-primary uppercase tracking-wider">
            Scenario Matrix • Side-by-Side Evaluation
          </span>
        </div>
        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
          3 Scenarios Ranked
        </span>
      </div>

      <div className="space-y-2.5">
        {/* Scenario A: Recommended */}
        <div className="p-4 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 space-y-2 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-extrabold text-text-primary">
                Option A: +5% Price Optimization
              </span>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
              ★ Rank #1 (Best ROI)
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs font-bold">
            <div>
              <span className="text-[10px] text-text-muted block">Profit Delta</span>
              <span className="text-emerald-600 dark:text-emerald-400">+฿163,000/mo</span>
            </div>
            <div>
              <span className="text-[10px] text-text-muted block">Runway Impact</span>
              <span className="text-emerald-600 dark:text-emerald-400">+0.9 Months</span>
            </div>
            <div>
              <span className="text-[10px] text-text-muted block">Downside Risk</span>
              <span className="text-emerald-600 dark:text-emerald-400">Low (0.3% Churn)</span>
            </div>
          </div>
        </div>

        {/* Scenario B: Feasible */}
        <div className="p-4 rounded-2xl border border-border bg-surface-subtle space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-brand" />
              <span className="text-xs font-bold text-text-primary">
                Option B: Hire 1 Sales Rep + Promo
              </span>
            </div>
            <span className="text-[10px] font-bold text-brand bg-brand-soft px-2 py-0.5 rounded">
              Rank #2 (Feasible)
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
            <div>
              <span className="text-[10px] text-text-muted block">Profit Delta</span>
              <span className="text-text-primary">+฿52,000/mo</span>
            </div>
            <div>
              <span className="text-[10px] text-text-muted block">Runway Impact</span>
              <span className="text-amber-500">-0.2 Months</span>
            </div>
            <div>
              <span className="text-[10px] text-text-muted block">Payback Period</span>
              <span className="text-text-primary">3.5 Months</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Stage 5 Recreated UI: Executive Report & AI Memo ─────────────────────────
function DecideStageMockup() {
  return (
    <div className="p-6 rounded-3xl border-2 border-border-strong bg-surface shadow-2xl space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <FileCheck2 className="size-4 text-brand" />
          <span className="font-display text-xs font-bold text-text-primary uppercase tracking-wider">
            Decision Report • Bank & Executive Ready
          </span>
        </div>
        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
          Cryptographically Verified Math
        </span>
      </div>

      <div className="p-4 rounded-2xl border border-brand/30 bg-brand-soft/60 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-brand">
          <Sparkles className="size-3.5 text-ai" />
          <span>Capybot Executive Recommendation Memo</span>
        </div>
        <p className="text-xs text-text-secondary font-medium leading-relaxed">
          &quot;Proceed with Option A (+5% price adjustment). The simulation confirms 100% margin recovery against recent supplier increases while keeping break-even customer volume 24% below current peak levels.&quot;
        </p>
      </div>

      <div className="p-4 rounded-2xl border border-border bg-surface-subtle flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="font-display text-xs font-bold text-text-primary block">
            Executive_Decision_Report_Q3_2026.pdf
          </span>
          <span className="text-[10px] text-text-muted">
            Includes P&L Projections, Sensitivity Matrix, & Audit Trail (4 pages)
          </span>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface border border-border-strong text-xs font-bold text-text-primary hover:bg-surface-hover transition-colors shadow-xs cursor-pointer"
        >
          <Download className="size-3.5 text-brand" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}
