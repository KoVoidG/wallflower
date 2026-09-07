'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play, Activity, AlertTriangle, ShieldCheck, Cpu, LayoutDashboard, TrendingUp, Sparkles } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { useEffect, useState } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 24,
      stiffness: 110,
    },
  },
};

export function HeroSection() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Sequence: 0: Base -> 1: Adjust Variable -> 2: Recalculating -> 3: Outcome
    const timer1 = setTimeout(() => setStep(1), 2000);
    const timer2 = setTimeout(() => setStep(2), 3500);
    const timer3 = setTimeout(() => setStep(3), 5000);
    const timer4 = setTimeout(() => setStep(0), 10000); // Loop back

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [step]);

  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[#FAFAFC] text-zinc-950">

      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center space-y-6 lg:space-y-8"
        >
          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-950 leading-[1.05] max-w-4xl mx-auto"
          >
            Simulate every business move{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500">
              before you commit
            </span>{' '}
            real capital.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-zinc-600 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Wallflower is the decision-intelligence platform that helps you understand your current business health, model what-if scenarios, compare outcomes, and make informed decisions with mathematical certainty.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 pt-2"
          >
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-base shadow-xl shadow-indigo-600/20 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer group"
            >
              <span>Start Free</span>
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-black/10 bg-white text-zinc-950 hover:bg-zinc-50 font-bold text-base active:scale-[0.98] transition-all cursor-pointer shadow-sm"
            >
              <Play className="size-4 fill-current opacity-70" />
              <span>Watch Demo</span>
            </Link>
          </motion.div>

          {/* Capability Proof Strip */}
          <motion.div
            variants={itemVariants}
            className="pt-10 w-full max-w-4xl mx-auto"
          >
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-xs font-bold tracking-wider text-zinc-500 uppercase">
              <div className="flex items-center gap-2">
                <Cpu className="size-4 text-indigo-500" />
                <span>Deterministic Business Models</span>
              </div>
              <span className="text-zinc-300 hidden md:block">•</span>
              <div className="flex items-center gap-2">
                <LayoutDashboard className="size-4 text-purple-500" />
                <span>Scenario Modeling</span>
              </div>
              <span className="text-zinc-300 hidden md:block">•</span>
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 text-amber-500" />
                <span>Risk Detection</span>
              </div>
              <span className="text-zinc-300 hidden md:block">•</span>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-500" />
                <span>Decision Intelligence</span>
              </div>
            </div>
          </motion.div>


        </motion.div>
      </div>
    </section>
  );
}
