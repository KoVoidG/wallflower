'use client';

import { motion } from 'framer-motion';
import { Activity, Banknote, TrendingUp, DollarSign } from 'lucide-react';

export function BusinessIntelligenceSection() {
  return (
    <section className="py-24 lg:py-32 bg-[#FAFAFC] relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1200px] pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/40 blur-[100px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-purple-200/40 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-3xl mb-20 text-center mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 mb-6 leading-[1.1]">
              Know where the business stands{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                before you move it.
              </span>
            </h2>
            <p className="text-lg md:text-xl text-zinc-600 leading-relaxed font-medium">
              We connect to your existing data to automatically calculate your
              true financial position. No manual entry, just deterministic math.
            </p>
          </motion.div>
        </div>

        {/* Large Product Visualization Panel */}
        <div className="w-full max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full relative rounded-[2rem] border border-black/5 bg-white shadow-2xl shadow-black/5 overflow-hidden flex flex-col shadow-[inset_0_1px_1px_rgba(255,255,255,1)]"
          >
            {/* Fake Window Header */}
            <div className="h-12 border-b border-black/5 bg-zinc-50 flex items-center px-4 gap-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-zinc-300" />
                <div className="w-3 h-3 rounded-full bg-zinc-300" />
                <div className="w-3 h-3 rounded-full bg-zinc-300" />
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest ml-4">
                <Activity className="size-4" /> Live Business Health
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-8 md:p-10 bg-white grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Col: Main KPI */}
              <div className="space-y-6">
                <div className="p-8 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col justify-center items-center text-center shadow-[inset_0_1px_1px_rgba(255,255,255,1)]">
                  <div className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">Wallflower Health Score</div>
                  <div className="text-7xl font-display font-extrabold text-indigo-950">84<span className="text-2xl text-indigo-300">/100</span></div>
                  <div className="mt-4 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase rounded-full">Stable Operations</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border border-black/5 bg-zinc-50 shadow-sm shadow-[inset_0_1px_1px_rgba(255,255,255,1)]">
                    <div className="flex items-center gap-2 text-zinc-500 mb-2">
                      <Banknote className="size-4" /> <span className="text-xs font-bold uppercase tracking-wider">Cash Runway</span>
                    </div>
                    <div className="text-2xl font-bold text-zinc-900">12.4 mo</div>
                    <div className="text-xs text-emerald-600 font-bold mt-1">+1.2 mo</div>
                  </div>
                  <div className="p-5 rounded-2xl border border-black/5 bg-zinc-50 shadow-sm shadow-[inset_0_1px_1px_rgba(255,255,255,1)]">
                    <div className="flex items-center gap-2 text-zinc-500 mb-2">
                      <Activity className="size-4" /> <span className="text-xs font-bold uppercase tracking-wider">Working Capital</span>
                    </div>
                    <div className="text-2xl font-bold text-zinc-900">$245k</div>
                    <div className="text-xs text-emerald-600 font-bold mt-1">Sufficient</div>
                  </div>
                </div>
              </div>

              {/* Right Col: Secondary KPIs & Chart */}
              <div className="space-y-6 flex flex-col">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border border-black/5 bg-zinc-50 shadow-sm shadow-[inset_0_1px_1px_rgba(255,255,255,1)]">
                    <div className="flex items-center gap-2 text-zinc-500 mb-2">
                      <TrendingUp className="size-4" /> <span className="text-xs font-bold uppercase tracking-wider">Net Margin</span>
                    </div>
                    <div className="text-2xl font-bold text-zinc-900">18.4%</div>
                    <div className="text-xs text-rose-500 font-bold mt-1">-1.2% (Cost rise)</div>
                  </div>
                  <div className="p-5 rounded-2xl border border-black/5 bg-zinc-50 shadow-sm shadow-[inset_0_1px_1px_rgba(255,255,255,1)]">
                    <div className="flex items-center gap-2 text-zinc-500 mb-2">
                      <DollarSign className="size-4" /> <span className="text-xs font-bold uppercase tracking-wider">Revenue (TTM)</span>
                    </div>
                    <div className="text-2xl font-bold text-zinc-900">$1.8M</div>
                    <div className="text-xs text-emerald-600 font-bold mt-1">+14% YoY</div>
                  </div>
                </div>
                
                {/* Large visual chart area */}
                <div className="flex-1 rounded-2xl border border-black/5 bg-white p-6 relative overflow-hidden shadow-sm flex flex-col justify-end min-h-[160px]">
                  <div className="absolute top-6 left-6 text-xs font-bold text-zinc-400 uppercase tracking-widest">Revenue vs COGS (Trailing 6 mo)</div>
                  
                  {/* CSS Chart Mockup */}
                  <div className="flex items-end justify-between h-32 gap-2 mt-8 z-10 relative">
                    <div className="w-full bg-indigo-100 rounded-t-md h-[40%]" />
                    <div className="w-full bg-indigo-100 rounded-t-md h-[50%]" />
                    <div className="w-full bg-indigo-100 rounded-t-md h-[45%]" />
                    <div className="w-full bg-indigo-200 rounded-t-md h-[70%]" />
                    <div className="w-full bg-indigo-300 rounded-t-md h-[60%]" />
                    <div className="w-full bg-indigo-500 rounded-t-md h-[90%]" />
                  </div>
                  
                  {/* Line overlay */}
                  <div className="absolute bottom-6 left-6 right-6 top-16 pointer-events-none">
                     <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                       <path d="M0,60 Q20,40 40,50 T80,30 T100,10" fill="none" stroke="#8B5CF6" strokeWidth="3" className="drop-shadow-sm" />
                     </svg>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
