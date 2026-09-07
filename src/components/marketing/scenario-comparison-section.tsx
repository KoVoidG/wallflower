'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Columns3, CheckCircle2, TrendingUp, TrendingDown, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';

export function ScenarioComparisonSection() {
  const [step, setStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    
    // 0: Cards appear
    // 1: AI scan starts
    // 2: Memo appears
    const timer1 = setTimeout(() => setStep(1), 1500);
    const timer2 = setTimeout(() => setStep(2), 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isInView]);

  return (
    <section className="py-24 lg:py-32 bg-[#FAFAFC] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full max-w-[1000px] pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10" ref={containerRef}>
        <div className="max-w-3xl mb-16 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 mb-6">
              <Columns3 className="size-3.5" />
              <span>SCENARIO COMPARISON</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 mb-6 leading-[1.1]">
              Compare the outcomes{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                before you choose.
              </span>
            </h2>
            <p className="text-lg md:text-xl text-zinc-600 leading-relaxed font-medium">
              Compare Conservative, Expected, and Aggressive outcomes side-by-side. Wallflower synthesizes the math into a plain-English executive summary ready for stakeholders.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-7xl mx-auto">
          {/* Comparison Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 relative"
          >
            {/* Conservative */}
            <div className={`p-6 rounded-2xl border border-black/5 bg-white flex flex-col h-full transition-all duration-500 ${step >= 1 ? 'opacity-50 grayscale' : 'shadow-sm'}`}>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Conservative</div>
              <div className="flex-1">
                <div className="text-3xl font-display font-bold text-zinc-900 mb-2">+$4,200</div>
                <div className="text-xs font-semibold text-zinc-500 mb-6">Net Income / mo</div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-black/5">
                    <span className="text-xs text-zinc-500">Payback</span>
                    <span className="text-xs font-bold text-zinc-700">0 months</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-black/5">
                    <span className="text-xs text-zinc-500">Risk Profile</span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><TrendingDown className="size-3"/> Low</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expected (The selected one) */}
            <div className={`p-6 rounded-2xl border-2 flex flex-col h-full relative transform sm:-translate-y-4 transition-all duration-500 ${step >= 1 ? 'border-purple-500 bg-purple-50 shadow-xl shadow-purple-500/20' : 'border-indigo-500 bg-indigo-50/50 shadow-xl'}`}>
              {/* AI Scan Line */}
              <AnimatePresence>
                {step === 1 && (
                  <motion.div 
                    initial={{ top: 0, opacity: 0 }}
                    animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1.5, ease: "linear" }}
                    className="absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent to-purple-500/30 border-b-2 border-purple-500 pointer-events-none z-20 rounded-b-2xl"
                  />
                )}
              </AnimatePresence>

              <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm transition-colors duration-500 ${step >= 1 ? 'bg-purple-600' : 'bg-indigo-600'}`}>
                Optimal
              </div>
              <div className={`text-[10px] font-bold uppercase tracking-widest mb-4 mt-2 transition-colors duration-500 ${step >= 1 ? 'text-purple-500' : 'text-indigo-400'}`}>Expected</div>
              <div className="flex-1 relative z-10">
                <div className={`text-4xl font-display font-bold mb-2 transition-colors duration-500 ${step >= 1 ? 'text-purple-950' : 'text-indigo-950'}`}>+$14,500</div>
                <div className={`text-xs font-semibold mb-6 transition-colors duration-500 ${step >= 1 ? 'text-purple-700/60' : 'text-indigo-700/60'}`}>Net Income / mo</div>
                
                <div className="space-y-3">
                  <div className={`flex justify-between items-center pb-2 border-b transition-colors duration-500 ${step >= 1 ? 'border-purple-200/50' : 'border-indigo-200/50'}`}>
                    <span className={`text-xs transition-colors duration-500 ${step >= 1 ? 'text-purple-900/60' : 'text-indigo-900/60'}`}>Payback</span>
                    <span className={`text-xs font-bold transition-colors duration-500 ${step >= 1 ? 'text-purple-900' : 'text-indigo-900'}`}>1.2 months</span>
                  </div>
                  <div className={`flex justify-between items-center pb-2 border-b transition-colors duration-500 ${step >= 1 ? 'border-purple-200/50' : 'border-indigo-200/50'}`}>
                    <span className={`text-xs transition-colors duration-500 ${step >= 1 ? 'text-purple-900/60' : 'text-indigo-900/60'}`}>Risk Profile</span>
                    <span className={`text-xs font-bold flex items-center gap-1 transition-colors duration-500 ${step >= 1 ? 'text-purple-700' : 'text-indigo-700'}`}><CheckCircle2 className="size-3"/> Balanced</span>
                  </div>
                </div>
              </div>
              
              {/* Connecting Line to Memo */}
              <AnimatePresence>
                {step >= 2 && (
                  <motion.div 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: '100px' }}
                    className="hidden lg:block absolute top-1/2 -right-[100px] h-0.5 bg-gradient-to-r from-purple-500 to-emerald-500 z-0"
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Aggressive */}
            <div className={`p-6 rounded-2xl border border-black/5 bg-white flex flex-col h-full transition-all duration-500 ${step >= 1 ? 'opacity-50 grayscale' : 'shadow-sm'}`}>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Aggressive</div>
              <div className="flex-1">
                <div className="text-3xl font-display font-bold text-zinc-900 mb-2">+$29,800</div>
                <div className="text-xs font-semibold text-zinc-500 mb-6">Net Income / mo</div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-black/5">
                    <span className="text-xs text-zinc-500">Payback</span>
                    <span className="text-xs font-bold text-zinc-700">6.4 months</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-black/5">
                    <span className="text-xs text-zinc-500">Risk Profile</span>
                    <span className="text-xs font-bold text-rose-600 flex items-center gap-1"><TrendingUp className="size-3"/> High</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Decision Memo */}
          <div className="lg:col-span-4 relative z-10 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {step >= 2 ? (
                <motion.div
                  key="memo"
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="rounded-[2rem] border border-black/5 bg-white shadow-2xl p-8 flex flex-col justify-center relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -z-10" />
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="text-sm font-bold text-emerald-700 uppercase tracking-widest">Capybot Synthesis</div>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-zinc-900 mb-4">Executive Summary Ready</h3>
                  <p className="text-base text-zinc-600 leading-relaxed mb-8 font-medium">
                    &quot;Executing the <strong>Expected</strong> scenario yields the highest risk-adjusted return. The 1.2 month payback period leaves cash runway untouched, maintaining a healthy 4.5 month buffer while increasing net margin by 2.1%.&quot;
                  </p>
                  <Link
                    href="/register"
                    className="mt-auto w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-950 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  >
                    <span>Generate Decision PDF</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-[2rem] border border-dashed border-zinc-200 bg-zinc-50/50 p-8 flex flex-col items-center justify-center text-center h-[400px] opacity-50"
                >
                   <Sparkles className="size-8 text-zinc-300 mb-4" />
                   <div className="text-sm font-bold text-zinc-400">Waiting for AI synthesis...</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
