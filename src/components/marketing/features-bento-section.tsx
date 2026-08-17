'use client';

import { motion } from 'motion/react';
import {
  Cpu,
  Sparkles,
  LineChart,
  Database,
  FileCheck2,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export function FeaturesBentoSection() {
  return (
    <section id="features" className="py-20 sm:py-28 border-b border-border/60 bg-background text-left">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 space-y-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl space-y-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-3.5 py-1 text-xs font-bold text-brand">
            <Zap className="size-3.5" />
            <span>BUILT FOR OPERATIONAL RIGOR</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight">
            Engineered like institutional fintech. Built for retail SMEs.
          </h2>
          <p className="text-base sm:text-lg text-text-secondary font-medium leading-relaxed">
            Every feature in Wallflower is designed to eliminate guesswork, protect your working capital, and give you unfair clarity.
          </p>
        </motion.div>

        {/* Bento Grid (Asymmetric Layout with Staggered Entrance & Hover Lift) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Deterministic Math Engine (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="md:col-span-7 p-7 sm:p-8 rounded-3xl border-2 border-border-strong bg-surface shadow-xl flex flex-col justify-between space-y-6 group hover:border-brand/40 transition-all duration-300"
          >
            <div className="space-y-3">
              <div className="size-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Cpu className="size-5" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-extrabold text-text-primary">
                100% Deterministic Financial Math
              </h3>
              <p className="text-sm text-text-secondary font-medium leading-relaxed max-w-[540px]">
                We never let AI hallucinate your financial calculations. All revenue projections, elasticity curves, working capital allocations, and break-even points are calculated with pure deterministic formulas.
              </p>
            </div>

            {/* Visual Formula Proof Box */}
            <div className="p-4 rounded-2xl bg-surface-subtle border border-border font-mono text-xs text-text-secondary space-y-2 group-hover:border-emerald-500/30 transition-colors">
              <div className="flex items-center justify-between text-[11px] text-text-muted font-sans font-bold border-b border-border/60 pb-2">
                <span>Verified Financial Algebra</span>
                <span className="text-emerald-500 flex items-center gap-1">
                  <ShieldCheck className="size-3.5" /> Deterministic Pass
                </span>
              </div>
              <p className="text-text-primary">
                <span className="text-brand font-bold">ΔProfit</span> = [Q × (1 + ε·ΔP)] × [P·(1 + ΔP) - COGS·(1 - δ)] - (FixedCost + ΔPayroll)
              </p>
              <div className="flex items-center gap-3 text-[10px] text-text-muted pt-1">
                <span>ε = Demand Elasticity</span>
                <span>δ = Supplier Discount</span>
                <span>ΔP = Price Vector</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Capybot Explainability (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="md:col-span-5 p-7 sm:p-8 rounded-3xl border-2 border-border-strong bg-surface shadow-xl flex flex-col justify-between space-y-6 group hover:border-brand/40 transition-all duration-300"
          >
            <div className="space-y-3">
              <div className="size-11 rounded-2xl bg-brand-soft text-brand border border-brand-border flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="size-5 text-ai" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-extrabold text-text-primary">
                Capybot Co-pilot
              </h3>
              <p className="text-sm text-text-secondary font-medium leading-relaxed">
                AI translates complex sensitivity matrices into plain, actionable executive English and Thai. Know the exact &apos;why&apos; behind every number.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-brand-soft/60 border border-brand/30 space-y-2 group-hover:border-brand/50 transition-colors">
              <div className="flex items-center justify-between text-[11px] font-bold text-brand">
                <span>Executive Synthesis</span>
                <span className="bg-brand/10 px-2 py-0.5 rounded text-[10px]">High Confidence</span>
              </div>
              <p className="text-xs text-text-primary font-medium leading-snug">
                &quot;Hiring 2 staff is sustainable because your peak weekend order throughput will increase by 28%, covering payroll within 45 days.&quot;
              </p>
            </div>
          </motion.div>

          {/* Card 3: Cash Runway Timeline (4 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.15 }}
            whileHover={{ y: -4 }}
            className="md:col-span-4 p-7 rounded-3xl border-2 border-border-strong bg-surface shadow-xl flex flex-col justify-between space-y-5 group hover:border-brand/40 transition-all duration-300"
          >
            <div className="space-y-3">
              <div className="size-11 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <LineChart className="size-5" />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-text-primary">
                Cash Runway Radar
              </h3>
              <p className="text-xs text-text-secondary font-medium leading-relaxed">
                Predict exactly how many months of cash buffer remain under various stress-tested scenarios.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-subtle border border-border space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-text-muted">Runway Safety Buffer</span>
                <span className="text-emerald-500">5.1 Months</span>
              </div>
              <div className="h-2 rounded-full bg-border overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '70%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>
          </motion.div>

          {/* Card 4: Seamless Data Ingestion (4 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="md:col-span-4 p-7 rounded-3xl border-2 border-border-strong bg-surface shadow-xl flex flex-col justify-between space-y-5 group hover:border-brand/40 transition-all duration-300"
          >
            <div className="space-y-3">
              <div className="size-11 rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Database className="size-5" />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-text-primary">
                POS &amp; LiquiFlow Sync
              </h3>
              <p className="text-xs text-text-secondary font-medium leading-relaxed">
                Connect your point-of-sale, accounting books, or simple Excel exports. Wallflower normalizes data in seconds.
              </p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-subtle border border-border text-xs font-bold text-text-secondary">
              <span>POS • Excel • LiquiFlow</span>
              <span className="text-emerald-500">Auto-Validated</span>
            </div>
          </motion.div>

          {/* Card 5: Bank-Ready Reports (4 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.25 }}
            whileHover={{ y: -4 }}
            className="md:col-span-4 p-7 rounded-3xl border-2 border-border-strong bg-surface shadow-xl flex flex-col justify-between space-y-5 group hover:border-brand/40 transition-all duration-300"
          >
            <div className="space-y-3">
              <div className="size-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileCheck2 className="size-5" />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-text-primary">
                Bank-Ready Reports
              </h3>
              <p className="text-xs text-text-secondary font-medium leading-relaxed">
                Export formal executive decision memos with sensitivity breakdowns for bank loans and partner approvals.
              </p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-subtle border border-border text-xs font-bold text-text-secondary">
              <span>PDF • Excel • Print</span>
              <span className="text-brand">Audit-Verified</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
