'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingDown, ArrowRight, Activity } from 'lucide-react';

export function RiskDetectionSection() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // 0: Normal state
    // 1: Metric changes
    // 2: Risk detected & Impact
    const timer1 = setTimeout(() => setStep(1), 2000);
    const timer2 = setTimeout(() => setStep(2), 4000);
    const timer3 = setTimeout(() => setStep(0), 10000); // loop

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [step]);

  return (
    <section className="py-24 lg:py-32 bg-[#F5F3FF] relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 mb-6">
                <AlertTriangle className="size-3.5" />
                <span>RISK RADAR</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 mb-6 leading-[1.1]">
                Find what could go wrong{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-500">
                  before it does.
                </span>
              </h2>
              <p className="text-lg md:text-xl text-zinc-600 leading-relaxed font-medium">
                Wallflower continuously monitors your integrated data against deterministic baselines. We alert you to margin compression, cash flow cliffs, and deadstock before they show up on your P&L.
              </p>
            </motion.div>
          </div>

          <div className="relative">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-200/50 via-transparent to-amber-200/50 blur-3xl rounded-full pointer-events-none" />
            
            {/* Animated Product Visualization */}
            <div className="w-full relative rounded-2xl border border-black/5 bg-white shadow-xl overflow-hidden flex flex-col h-[400px]">
              <div className="h-10 border-b border-black/5 bg-zinc-50 flex items-center px-4">
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="size-3.5" /> Live Cost Monitoring
                </div>
              </div>

              <div className="p-6 flex-1 relative flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-sm font-bold text-zinc-900">Supplier Cost Trend (Category B)</div>
                    <div className="text-xs text-zinc-500">Trailing 90 days vs Target Margin</div>
                  </div>
                </div>

                {/* Simulated Chart Area */}
                <div className="flex-1 relative border-b border-l border-zinc-100 flex items-end">
                  {/* Target line */}
                  <div className="absolute top-1/2 left-0 w-full border-t border-dashed border-zinc-300" />
                  <div className="absolute top-[45%] right-0 text-[10px] font-bold text-zinc-400">Target Threshold</div>

                  {/* Chart Line Animation */}
                  <div className="absolute inset-0 flex items-end justify-between px-2 pb-2">
                    <div className="w-1/5 h-[30%] bg-zinc-200 rounded-t-sm" />
                    <div className="w-1/5 h-[35%] bg-zinc-200 rounded-t-sm" />
                    <div className="w-1/5 h-[45%] bg-zinc-200 rounded-t-sm" />
                    <motion.div 
                      className="w-1/5 rounded-t-sm bg-rose-400"
                      initial={{ height: '48%' }}
                      animate={{ height: step >= 1 ? '65%' : '48%' }}
                      transition={{ duration: 0.5 }}
                    />
                    <motion.div 
                      className="w-1/5 rounded-t-sm shadow-[0_0_15px_rgba(244,63,94,0.5)] bg-rose-500"
                      initial={{ height: '49%' }}
                      animate={{ height: step >= 1 ? '85%' : '49%' }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    />
                  </div>
                </div>

                {/* Risk Alert Popup */}
                <AnimatePresence>
                  {step >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-6 left-6 right-6 bg-white border border-rose-100 rounded-xl p-4 shadow-2xl flex gap-3 items-start"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 rounded-l-xl" />
                      <div className="p-2 rounded-lg bg-rose-50 flex-shrink-0 text-rose-500">
                        <TrendingDown className="size-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-zinc-900 text-sm">Margin Compression Detected</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700 uppercase">Critical</span>
                        </div>
                        <p className="text-xs font-medium text-zinc-600 leading-relaxed mb-2">
                          Supplier costs for Category B increased by 4.2%. Current retail prices will result in a 2.1% net margin drop this quarter.
                        </p>
                        <button className="text-xs font-bold text-rose-600 flex items-center gap-1 hover:text-rose-700">
                          Simulate Price Adjustment <ArrowRight className="size-3" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
          
        </div>
      </div>
    </section>
  );
}
