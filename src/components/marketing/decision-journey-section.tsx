'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, AlertTriangle, Sliders, Columns3, FileCheck2,
  DollarSign, Users, Package, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STAGES = [
  {
    id: 'understand',
    stepNumber: '01',
    title: 'Understand the Business',
    icon: Activity,
    badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    headline: 'Know your exact business baseline before touching any variable.',
    detailedText: 'Wallflower connects your sales, inventory, and cost records to produce a real-time Business Health Score, net margin breakdown, and true cash runway. No more digging through fragmented spreadsheets.',
  },
  {
    id: 'diagnose',
    stepNumber: '02',
    title: 'Diagnose & Detect Risks',
    icon: AlertTriangle,
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    headline: 'Uncover margin compression and liquidity bottlenecks before they hurt.',
    detailedText: 'Our risk diagnosis engine continuously audits your working capital and inventory turnover. It flags deadstock build-up and upcoming cash cliffs 60–90 days ahead.',
  },
  {
    id: 'simulate',
    stepNumber: '03',
    title: 'Simulate Scenarios',
    icon: Sliders,
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    headline: 'Stress-test business choices without risking a single dollar.',
    detailedText: 'Adjust selling prices, hire floor staff, or launch a promo. Wallflower recalculates your gross margin, customer elasticity, break-even volume, and cash burn instantaneously.',
  },
  {
    id: 'compare',
    stepNumber: '04',
    title: 'Compare Outcomes',
    icon: Columns3,
    badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    headline: 'Weigh competing options side-by-side with clear risk buffers.',
    detailedText: 'Never execute a decision based on single-point hope. Compare Conservative, Expected, and Aggressive outcomes side-by-side. Inspect downside buffers and payback timelines.',
  },
  {
    id: 'decide',
    stepNumber: '05',
    title: 'Decide With Confidence',
    icon: FileCheck2,
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    headline: 'Actionable executive summaries and verified reports.',
    detailedText: 'Capybot synthesizes the mathematical results into plain-language business recommendations. Generate verified, bank-ready PDF Decision Reports in one click.',
  },
];

function ProductCanvas({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="w-full h-full relative bg-[#070A17] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
      {/* Fake Window Header */}
      <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2 bg-[#0B1024]">
        <div className="w-3 h-3 rounded-full bg-rose-500/80" />
        <div className="w-3 h-3 rounded-full bg-amber-500/80" />
        <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        <div className="ml-4 text-xs font-medium text-indigo-200/50">Wallflower // Workflow</div>
      </div>

      <div className="flex-1 p-8 relative overflow-hidden">
        <AnimatePresence mode="wait">
          
          {/* Stage 1: Understand (Metrics Populate) */}
          {activeIndex === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="h-full flex flex-col justify-center gap-6">
              <div className="text-sm font-bold text-white mb-2 flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-400"/> Live Business Baseline</div>
              <div className="grid grid-cols-2 gap-6">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl border border-white/5 bg-[#0B1024]">
                  <div className="flex items-center gap-2 text-indigo-200/50 text-sm mb-2"><DollarSign className="size-4" /> Revenue (TTM)</div>
                  <div className="text-4xl font-display font-bold text-white">$1.24M</div>
                </motion.div>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="p-6 rounded-2xl border border-white/5 bg-[#0B1024]">
                  <div className="flex items-center gap-2 text-indigo-200/50 text-sm mb-2"><Activity className="size-4" /> Cash Runway</div>
                  <div className="text-4xl font-display font-bold text-white">12.4 <span className="text-xl text-indigo-200/50">mo</span></div>
                </motion.div>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="p-6 rounded-2xl border border-white/5 bg-[#0B1024]">
                  <div className="flex items-center gap-2 text-indigo-200/50 text-sm mb-2"><Package className="size-4" /> Inventory Value</div>
                  <div className="text-4xl font-display font-bold text-white">$145K</div>
                </motion.div>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="p-6 rounded-2xl border border-white/5 bg-[#0B1024]">
                  <div className="flex items-center gap-2 text-indigo-200/50 text-sm mb-2"><Users className="size-4" /> Labor Cost</div>
                  <div className="text-4xl font-display font-bold text-white">32%</div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Stage 2: Diagnose (Risk Appears) */}
          {activeIndex === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="h-full flex flex-col justify-center gap-8">
              <div className="p-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 flex flex-col items-start gap-4 shadow-[0_0_40px_-10px_rgba(244,63,94,0.3)]">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-rose-500 rounded-xl">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-rose-400">Margin Compression Risk</div>
                    <div className="text-rose-200/70 font-medium">Detected in operating metrics</div>
                  </div>
                </div>
                <div className="w-full bg-[#070A17] p-5 rounded-xl border border-rose-500/20 mt-2">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white font-bold">Labor Cost Ratio</span>
                    <span className="text-rose-400 font-bold font-mono">Rising</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden relative">
                      <motion.div 
                        initial={{ width: '32%' }} 
                        animate={{ width: '45%' }} 
                        transition={{ duration: 1, delay: 0.5 }} 
                        className="h-full bg-rose-500 rounded-full" 
                      />
                      <div className="absolute top-0 bottom-0 left-[35%] w-0.5 bg-white/50" />
                    </div>
                    <motion.span 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      transition={{ delay: 1.5 }} 
                      className="text-rose-400 font-bold"
                    >
                      Threshold crossed
                    </motion.span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stage 3: Simulate (Assumption changes) */}
          {activeIndex === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="h-full flex flex-col justify-center gap-6">
              <div className="text-sm font-bold text-white mb-2 flex items-center gap-2"><Sliders className="w-5 h-5 text-purple-400"/> Change Assumptions</div>
              
              <div className="p-8 rounded-2xl border border-white/5 bg-[#0B1024] space-y-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-white">Marketing Spend (Q3)</span>
                    <motion.div 
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="px-4 py-1.5 rounded-lg bg-purple-500 text-white font-mono font-bold text-xl shadow-lg shadow-purple-500/30"
                    >
                      +$15,000
                    </motion.div>
                  </div>
                  
                  {/* Slider animation */}
                  <div className="h-4 bg-white/5 rounded-full relative">
                    <motion.div 
                      className="absolute top-0 left-0 h-full bg-purple-500 rounded-full"
                      initial={{ width: '20%' }}
                      animate={{ width: '70%' }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                    <motion.div 
                      className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-4 border-purple-500"
                      initial={{ left: '20%' }}
                      animate={{ left: '70%' }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                      style={{ marginLeft: '-16px' }}
                    />
                  </div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="relative z-10 flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mt-8"
                >
                  <Activity className="size-5 text-emerald-400 animate-pulse" />
                  <div>
                    <div className="text-emerald-400 font-bold">Recalculating Elasticity & Conversions...</div>
                    <div className="text-emerald-200/60 text-sm">Engine adjusting 14 dependent variables.</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Stage 4: Compare (Outcomes Separate) */}
          {activeIndex === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="h-full flex flex-col justify-center gap-6">
              <div className="text-sm font-bold text-white mb-2 flex items-center gap-2"><Columns3 className="w-5 h-5 text-blue-400"/> Outcome Divergence</div>
              
              <div className="grid grid-cols-2 gap-6 h-64">
                {/* Scenario A */}
                <div className="relative p-6 rounded-2xl border border-white/5 bg-[#0B1024] flex flex-col">
                  <div className="text-indigo-200/50 font-bold uppercase tracking-widest text-xs mb-4">Baseline (No Change)</div>
                  
                  <div className="flex-1 flex items-end gap-2 px-2">
                    <motion.div initial={{ height: "0%" }} animate={{ height: "60%" }} className="w-full bg-indigo-500/30 rounded-t-lg" />
                    <motion.div initial={{ height: "0%" }} animate={{ height: "62%" }} className="w-full bg-indigo-500/50 rounded-t-lg" />
                    <motion.div initial={{ height: "0%" }} animate={{ height: "58%" }} className="w-full bg-indigo-500/80 rounded-t-lg" />
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="text-2xl font-bold text-white">$42K <span className="text-sm font-normal text-indigo-200/50">profit</span></div>
                  </div>
                </div>

                {/* Scenario B */}
                <div className="relative p-6 rounded-2xl border border-blue-500/30 bg-blue-500/10 flex flex-col shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)]">
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl uppercase">Selected</div>
                  <div className="text-blue-300 font-bold uppercase tracking-widest text-xs mb-4">+$15K Marketing</div>
                  
                  <div className="flex-1 flex items-end gap-2 px-2">
                    <motion.div initial={{ height: "0%" }} animate={{ height: "65%" }} transition={{ delay: 0.2 }} className="w-full bg-blue-400/50 rounded-t-lg" />
                    <motion.div initial={{ height: "0%" }} animate={{ height: "80%" }} transition={{ delay: 0.3 }} className="w-full bg-blue-400/80 rounded-t-lg" />
                    <motion.div initial={{ height: "0%" }} animate={{ height: "95%" }} transition={{ delay: 0.4 }} className="w-full bg-emerald-400 rounded-t-lg shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-blue-500/20">
                    <div className="text-2xl font-bold text-emerald-400">$68K <span className="text-sm font-normal text-blue-200/60">profit</span></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stage 5: Decide */}
          {activeIndex === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="h-full flex flex-col justify-center gap-6">
              <div className="p-8 rounded-3xl bg-indigo-600 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <FileCheck2 className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-display text-3xl font-bold text-white mb-4">The Decision is Clear</h3>
                  <p className="text-lg text-indigo-100 font-medium max-w-sm mx-auto leading-relaxed mb-8">
                    Allocating $15k to Q3 marketing will increase net profit by $26k, while maintaining a safe 11-month cash buffer.
                  </p>
                  <button className="px-8 py-4 bg-white text-indigo-950 rounded-full font-bold text-base flex items-center gap-2 hover:bg-zinc-100 transition-colors mx-auto shadow-xl">
                    Download Verified Plan <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

export function DecisionJourneySection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="journey" className="relative py-24 sm:py-32 bg-[#0A0F24] text-left">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="max-w-4xl space-y-6 mb-20">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            From business data to decisions.
          </h2>
          <p className="text-base sm:text-lg text-indigo-200/70 font-medium leading-relaxed max-w-3xl">
            Wallflower is not a passive dashboard. It is a deterministic decision operating system engineered to take you from initial health diagnosis to safe simulation, multi-option comparison, and verified execution.
          </p>
        </div>

        {/* Cinematic Scroll Layout: 40% Text / 60% Visual */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left: Scrollable Text Steps (col-span-5 -> 40%) */}
          <div className="flex flex-col relative z-10 w-full lg:col-span-5">
            {STAGES.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = index === activeIndex;

              return (
                <motion.div
                  key={stage.id}
                  className="min-h-[50vh] lg:min-h-[70vh] flex flex-col justify-center py-10"
                  onViewportEnter={() => setActiveIndex(index)}
                  viewport={{ margin: "-45% 0px -45% 0px" }}
                >
                  <div className={cn("transition-all duration-500", isActive ? "opacity-100 scale-100" : "opacity-30 scale-95")}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-extrabold border", stage.badgeColor)}>
                        <Icon className="size-3.5" />
                        <span>{stage.stepNumber}</span>
                      </div>
                      <span className="text-lg font-bold text-indigo-200/50 uppercase tracking-widest">{stage.title}</span>
                    </div>
                    <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                      {stage.headline}
                    </h3>
                    <p className="text-base sm:text-lg text-indigo-200/70 leading-relaxed">
                      {stage.detailedText}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right: Sticky Product Canvas (col-span-7 -> 60%) */}
          <div className="hidden lg:block sticky top-[15vh] h-[70vh] w-full lg:col-span-7">
            <ProductCanvas activeIndex={activeIndex} />
          </div>

        </div>
      </div>
    </section>
  );
}
