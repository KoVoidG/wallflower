'use client';

import { motion } from 'framer-motion';
import { Calculator, Eye, Lock, FileCode2 } from 'lucide-react';

const PRINCIPLES = [
  {
    icon: Calculator,
    title: "Deterministic Financial Engine",
    desc: "We don't use AI to guess your cashflow. The core engine is built on standard double-entry accounting math and deterministic financial models. 1 + 1 always equals 2."
  },
  {
    icon: Eye,
    title: "100% Transparent Assumptions",
    desc: "Every variable in a scenario—from marketing decay curves to price elasticity—is visible and editable. Black box AI has no place in capital allocation."
  },
  {
    icon: Lock,
    title: "Private & Secure Architecture",
    desc: "Your financial data never trains public LLMs. We use secure, isolated infrastructure to ensure your business health and strategic decisions remain strictly confidential."
  },
  {
    icon: FileCode2,
    title: "Bank-Ready Export Trails",
    desc: "When you make a decision, Wallflower generates an audit trail of the assumptions and expected outcomes, ready to be exported for your CFO, board, or bank."
  }
];

export function TrustProofSection() {
  return (
    <section className="py-24 lg:py-32 bg-[#F5F3FF] text-zinc-950 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Trust Text content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 mb-6 leading-[1.1]">
                Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">operational rigor.</span>
              </h2>
              <p className="text-lg md:text-xl text-zinc-600 mb-12 leading-relaxed font-medium">
                Software shouldn&apos;t ask you to trust its magic. It should show you its math. Wallflower is designed as a secure, deterministic sandbox for serious business operators.
              </p>
            </motion.div>

            <div className="space-y-8">
              {PRINCIPLES.map((principle, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-white border border-indigo-100 shadow-sm flex items-center justify-center text-indigo-600">
                      <principle.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-zinc-900 mb-2">{principle.title}</h3>
                    <p className="text-zinc-600 font-medium leading-relaxed text-sm">{principle.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Visual Evidence / Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative lg:h-[600px] rounded-2xl border border-black/5 bg-white shadow-xl overflow-hidden"
          >
            {/* Minimalist UI mock showing math and assumptions */}
            <div className="absolute inset-0 p-6 flex flex-col">
              <div className="flex items-center justify-between pb-4 mb-6">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="text-xs text-zinc-400 font-mono font-bold">Engine: Deterministic Model v2.1</div>
              </div>

              <div className="flex-1 overflow-hidden font-mono text-sm">
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-zinc-50 border border-black/5">
                    <div className="text-zinc-400 font-bold mb-2">{'// Formula: Operating Cash Flow'}</div>
                    <div className="text-indigo-700 font-bold">NetIncome + NonCashExpenses - IncreaseInWorkingCapital</div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-zinc-50 border border-black/5">
                    <div className="text-zinc-400 font-bold mb-2">{'// Active Assumptions (Editable)'}</div>
                    <div className="flex justify-between text-zinc-600 font-medium pb-2 mb-2 border-b border-black/5">
                      <span>Customer Acquisition Cost (CAC)</span>
                      <span className="text-emerald-600 font-bold">$850.00</span>
                    </div>
                    <div className="flex justify-between text-zinc-600 font-medium pb-2 mb-2 border-b border-black/5">
                      <span>Churn Rate (Monthly)</span>
                      <span className="text-emerald-600 font-bold">2.4%</span>
                    </div>
                    <div className="flex justify-between text-zinc-600 font-medium">
                      <span>Price Elasticity Coefficient</span>
                      <span className="text-emerald-600 font-bold">-0.35</span>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-center h-32 border border-dashed border-indigo-200 rounded-xl bg-indigo-50/50 text-indigo-700 font-bold">
                    <div className="flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      <span>Mathematical Integrity Verified</span>
                    </div>
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
