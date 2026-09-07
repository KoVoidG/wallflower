'use client';

import { motion } from 'framer-motion';
import { LayoutDashboard, CheckCircle2, XCircle } from 'lucide-react';

const COMPARISON = [
  {
    feature: "Data Horizon",
    traditional: "Backwards looking (historical reporting)",
    wallflower: "Forward looking (predictive & simulated)"
  },
  {
    feature: "Interactivity",
    traditional: "Read-only metrics and charts",
    wallflower: "Interactive levers to test decisions"
  },
  {
    feature: "Risk Detection",
    traditional: "Wait until the P&L drops next month",
    wallflower: "Early warning alerts based on live thresholds"
  },
  {
    feature: "Actionability",
    traditional: "Requires manual spreadsheet analysis",
    wallflower: "Unified decision recommendations"
  }
];

export function DifferentiationSection() {
  return (
    <section className="py-24 lg:py-32 bg-[#FAFAFC] relative overflow-hidden border-t border-black/5">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 mb-6 uppercase tracking-widest">
              <LayoutDashboard className="size-3.5" />
              <span>THE DIFFERENCE</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 mb-6 leading-[1.1]">
              Not another passive{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">dashboard.</span>
            </h2>
            <p className="text-lg md:text-xl text-zinc-600 leading-relaxed font-medium">
              You already know what happened last month. Wallflower is built to help you figure out what to do next.
            </p>
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl border border-black/5 bg-white shadow-xl overflow-hidden"
          >
            {/* Header Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 border-b border-black/5 bg-zinc-50">
              <div className="p-6 md:p-8 hidden md:block">
                {/* Empty corner */}
              </div>
              <div className="p-6 md:p-8 border-b md:border-b-0 md:border-l border-black/5 bg-zinc-100/50 flex flex-col justify-center">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Status Quo</span>
                <span className="font-display text-xl font-bold text-zinc-900">Traditional Dashboards</span>
              </div>
              <div className="p-6 md:p-8 md:border-l border-black/5 bg-indigo-600 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1 relative z-10">The New Standard</span>
                <span className="font-display text-xl font-bold text-white relative z-10">Wallflower</span>
              </div>
            </div>

            {/* Comparison Rows */}
            <div className="flex flex-col">
              {COMPARISON.map((row, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-3 border-b border-black/5 last:border-b-0 group hover:bg-zinc-50/50 transition-colors">
                  <div className="p-4 md:p-6 flex items-center">
                    <span className="font-bold text-zinc-900">{row.feature}</span>
                  </div>
                  <div className="p-4 md:p-6 md:border-l border-black/5 flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-zinc-300 shrink-0" />
                    <span className="text-sm font-medium text-zinc-500">{row.traditional}</span>
                  </div>
                  <div className="p-4 md:p-6 md:border-l border-black/5 flex items-center gap-3 bg-indigo-50/30 group-hover:bg-indigo-50/50 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                    <span className="text-sm font-bold text-indigo-950">{row.wallflower}</span>
                  </div>
                </div>
              ))}
            </div>
            
          </motion.div>
        </div>

      </div>
    </section>
  );
}
