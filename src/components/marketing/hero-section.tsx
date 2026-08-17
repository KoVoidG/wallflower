'use client';

import { motion } from 'motion/react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { InteractiveHeroSandbox } from './interactive-hero-sandbox';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-border/60">
      {/* Dynamic Animated Ambient Glow Background */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[450px] bg-gradient-to-r from-brand/20 via-purple-500/15 to-indigo-500/20 blur-3xl pointer-events-none -z-10 rounded-full"
      />

      <motion.div
        animate={{
          x: [-20, 20, -20],
          y: [-10, 15, -10],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-40 right-10 w-[350px] h-[350px] bg-violet-600/10 dark:bg-violet-400/10 blur-3xl pointer-events-none -z-10 rounded-full"
      />

      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Top Pill Badge with Live Pulsing Dot */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand-soft/80 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-brand shadow-xs hover:border-brand/60 transition-colors"
          >
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex rounded-full size-2 bg-brand" />
            </span>
            <Sparkles className="size-3.5" />
            <span>DECISION INTELLIGENCE FOR RETAIL &amp; SMES</span>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="space-y-4 max-w-4xl"
          >
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-primary leading-[1.08]">
              Simulate every business move{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#8B5CF6]">
                before you commit
              </span>{' '}
              real capital.
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary font-medium max-w-2xl mx-auto leading-relaxed">
              Price changes, hiring, marketing spend, and inventory investments simulated through a 100% deterministic financial engine with zero AI hallucinations.
            </p>
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
          >
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#8B5CF6] text-white px-7 py-4 text-sm font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/35 hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer group"
            >
              <span>Start Free Simulation</span>
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-border-strong bg-surface/90 backdrop-blur-md px-6 py-4 text-sm font-bold text-text-primary hover:bg-surface-hover hover:border-brand/40 transition-all shadow-2xs cursor-pointer"
            >
              <span>See Demo</span>
            </Link>
          </motion.div>

          {/* Security & Integrity Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-text-muted pt-2"
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-emerald-500" />
              <span>100% Deterministic Math</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-1.5 rounded-full bg-border-strong" />
              <span>Zero AI Hallucinations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-1.5 rounded-full bg-border-strong" />
              <span>No Credit Card Required</span>
            </div>
          </motion.div>

          {/* Hero Interactive Workspace Sandbox Card */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
            className="w-full pt-4"
          >
            <InteractiveHeroSandbox />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
