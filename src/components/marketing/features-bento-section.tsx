'use client';

import React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import {
  Database,
  Cpu,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  ArrowDown
} from 'lucide-react';
import { Noise } from '@/components/ui/noise';

function SpotlightCard({ children, className, spotlightColor = "rgba(99, 102, 241, 0.15)", initial, whileInView, viewport, transition }: any) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={initial}
      whileInView={whileInView}
      viewport={viewport}
      transition={transition}
      className={`relative overflow-hidden group ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${spotlightColor},
              transparent 80%
            )
          `,
        }}
      />
      {children}
    </motion.div>
  );
}

export function FeaturesBentoSection() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-[#0A0F24] text-left relative overflow-hidden">
      {/* Noise Texture */}
      <Noise />
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 space-y-16 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
          className="max-w-3xl space-y-4 mx-auto text-center flex flex-col items-center relative z-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-bold text-indigo-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
            <Zap className="size-3.5" />
            <span>BUILT FOR OPERATIONAL RIGOR</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
            We do not guess.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              We calculate.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-indigo-200/70 font-medium leading-relaxed max-w-2xl text-center">
            Most &quot;AI tools&quot; guess answers based on text. Wallflower separates calculation from conversation. Our deterministic engine runs the math; the AI only explains the results.
          </p>
        </motion.div>

        {/* Visual Flow Architecture */}
        <div className="relative w-full mx-auto pt-10">
          
          <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6 lg:gap-8 relative z-10">
            
            {/* Step 1: Data */}
            <SpotlightCard
              spotlightColor="rgba(59, 130, 246, 0.15)"
              initial={{ opacity: 0, x: -60, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: false, margin: '-100px' }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
              className="flex-1 flex flex-col bg-[#070A17]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-10 shadow-2xl hover:border-blue-500/30 transition-colors"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full z-0" />
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] border border-white/5 relative z-10">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-extrabold text-white mb-3 relative z-10">
                1. Connect Data
              </h3>
              <p className="text-sm text-indigo-200/70 leading-relaxed mb-6 relative z-10">
                Raw, factual inputs flowing securely from your POS, accounting software, and inventory systems. No manual data entry required.
              </p>
              <div className="mt-auto space-y-2 relative z-10">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-200/50 bg-white/5 py-2 px-3 rounded-lg border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Xero & Quickbooks
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-200/50 bg-white/5 py-2 px-3 rounded-lg border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Square & Shopify
                </div>
              </div>
            </SpotlightCard>

            {/* Arrow LG */}
            <div className="hidden lg:flex items-center justify-center w-12 text-indigo-200/30 shrink-0 relative">
              <motion.div
                initial={{ left: -10, opacity: 0 }}
                whileInView={{ left: 10, opacity: [0, 1, 0] }}
                viewport={{ margin: '-100px' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute"
              >
                <ArrowRight className="w-6 h-6 text-blue-400" />
              </motion.div>
            </div>
            
            {/* Arrow Mobile */}
            <div className="flex lg:hidden items-center justify-center h-8 text-indigo-200/30">
               <ArrowDown className="w-6 h-6 text-blue-400" />
            </div>

            {/* Step 2: Engine */}
            <SpotlightCard
              spotlightColor="rgba(99, 102, 241, 0.15)"
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, margin: '-100px' }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.8, delay: 0.15 }}
              className="flex-1 flex flex-col bg-[#070A17]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-10 shadow-2xl hover:border-indigo-500/30 transition-colors"
            >
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none z-0" />
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] border border-white/5 relative z-10">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl font-extrabold text-white mb-3 relative z-10">
                2. Deterministic Engine
              </h3>
              <p className="text-sm text-indigo-200/70 leading-relaxed mb-6 relative z-10">
                All revenue projections, elasticity curves, and break-even points are calculated with pure deterministic formulas.
              </p>
              
              <div className="mt-auto p-4 rounded-xl bg-[#0B1024] border border-white/10 font-mono text-[11px] text-indigo-200/70 hover:border-emerald-500/30 transition-colors group shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] relative z-10">
                <div className="flex items-center justify-between font-sans font-bold pb-2 mb-2 border-b border-white/5">
                  <span>Verified Financial Algebra</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="size-3.5" /> Standard Math
                  </span>
                </div>
                <p className="text-indigo-100 break-all text-xs">
                  <span className="text-indigo-400 font-bold">ΔProfit</span> = [Q × (1 + ε·ΔP)] × [P·(1 + ΔP) - COGS] - ΔFixed
                </p>
              </div>
            </SpotlightCard>

            {/* Arrow LG */}
            <div className="hidden lg:flex items-center justify-center w-12 text-indigo-200/30 shrink-0 relative">
              <motion.div
                initial={{ left: -10, opacity: 0 }}
                whileInView={{ left: 10, opacity: [0, 1, 0] }}
                viewport={{ margin: '-100px' }}
                transition={{ duration: 1.5, delay: 0.75, repeat: Infinity, ease: "linear" }}
                className="absolute"
              >
                <ArrowRight className="w-6 h-6 text-purple-400" />
              </motion.div>
            </div>
            
            {/* Arrow Mobile */}
            <div className="flex lg:hidden items-center justify-center h-8 text-indigo-200/30">
               <ArrowDown className="w-6 h-6 text-purple-400" />
            </div>

            {/* Step 3: Explanation */}
            <SpotlightCard
              spotlightColor="rgba(168, 85, 247, 0.15)"
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: false, margin: '-100px' }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.8, delay: 0.3 }}
              className="flex-1 flex flex-col bg-[#070A17]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-10 shadow-2xl hover:border-purple-500/30 transition-colors"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full z-0" />
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] border border-white/5 relative z-10">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-extrabold text-white mb-3 relative z-10">
                3. AI Output
              </h3>
              <p className="text-sm text-indigo-200/70 leading-relaxed mb-6 relative z-10">
                Our Capybot AI reads the verified mathematical outputs and generates plain-language executive summaries, highlighting the exact &apos;why&apos; behind the numbers.
              </p>
              <div className="mt-auto p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] relative z-10">
                <p className="text-xs font-medium text-indigo-100/90 italic border-l-2 border-purple-500 pl-3">
                  {`"Based on the engine's 4.2% margin compression calculation, delaying hiring will preserve 1.5 months of cash runway."`}
                </p>
              </div>
            </SpotlightCard>

          </div>
        </div>
      </div>
    </section>
  );
}
