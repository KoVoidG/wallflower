'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const QUESTIONS = [
  { id: 1, text: "Should I hire more staff?", pos: { x: -380, y: -180 } },
  { id: 2, text: "Can I afford to increase inventory?", pos: { x: 0, y: -220 } },
  { id: 3, text: "Can I afford another location?", pos: { x: 380, y: -160 } },
  { id: 4, text: "What happens if sales fall?", pos: { x: -380, y: 120 } },
  { id: 5, text: "Should I increase marketing spend?", pos: { x: 380, y: 160 } },
];

export function ProblemSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Using a static container for the intersection observer prevents "tweaking" (infinite loops)
  // By extending the top margin by 5000px, the section never exits the top of the viewport when scrolling down past it.
  const isInView = useInView(containerRef, { margin: "5000px 0px -35% 0px", once: false });

  return (
    <section className="py-24 sm:py-32 bg-[#F8F9FC] relative overflow-hidden min-h-[100vh] flex flex-col justify-center">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 mb-6 leading-[1.1]"
          >
            Running a business means<br/>
            making decisions <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 italic font-bold">without<br/>knowing the outcome.</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            className="w-12 h-0.5 bg-indigo-200 mx-auto my-8" 
          />
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            className="text-lg text-zinc-600 leading-relaxed font-medium max-w-2xl mx-auto"
          >
            Every day, you commit capital, sign leases, and hire teams based on intuition and static spreadsheets. The cost of guessing wrong is too high.
          </motion.p>
        </div>

        <div ref={containerRef} className="relative h-[500px] mt-16 w-full max-w-5xl mx-auto flex items-center justify-center">
          
          {/* Central Analysis Node (z-30 so pills hide behind it) */}
          <motion.div 
            initial={false}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center"
          >
            {/* Radar / Scanning Beating Animation */}
            <motion.div 
              animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              className="absolute w-[140px] h-[140px] rounded-full border-2 border-indigo-500"
            />
            <motion.div 
              animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
              transition={{ duration: 2, delay: 1, repeat: Infinity, ease: "easeOut" }}
              className="absolute w-[140px] h-[140px] rounded-full border border-indigo-400"
            />
            
            {/* Spinning Dashed Ring */}
            <div className="absolute w-[220px] h-[220px] rounded-full border border-dashed border-indigo-200 animate-[spin_20s_linear_infinite]" />
            
            {/* Solid glow background */}
            <div className="absolute w-[160px] h-[160px] rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-sm" />
            
            {/* Core Pill */}
            <div className="relative w-32 h-32 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center border border-indigo-50">
              <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-700 to-purple-600 tracking-widest uppercase">Analysis</span>
            </div>
          </motion.div>

          {/* Floating Questions */}
          {QUESTIONS.map((q, i) => {
            const dist = Math.sqrt(q.pos.x * q.pos.x + q.pos.y * q.pos.y);
            
            return (
              <motion.div
                key={q.id}
                className="absolute top-1/2 left-1/2 z-20"
                initial={false}
                animate={isInView ? { 
                  opacity: 1, 
                  x: q.pos.x, 
                  y: q.pos.y, 
                  scale: 1 
                } : { 
                  opacity: 0, 
                  x: 0, 
                  y: 0, 
                  scale: 0.2 
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 90, 
                  damping: 12, // Lower damping for a more noticeable, bouncy pop-out
                  delay: isInView ? 0.15 + (i * 0.15) : 0 // No delay when hiding
                }}
              >
                {/* Connecting Line originating from the pill back to the center */}
                <motion.div 
                  initial={false}
                  animate={isInView ? { width: dist - 60, opacity: 1 } : { width: 0, opacity: 0 }}
                  transition={{ delay: isInView ? 0.2 + (i * 0.1) : 0, duration: 0.4 }}
                  className="absolute top-0 left-0 h-px border-t border-dashed border-indigo-300 -z-30 origin-left"
                  style={{
                    rotate: `${Math.atan2(-q.pos.y, -q.pos.x)}rad`,
                  }}
                />
                
                {/* The Question Pill itself */}
                <div className="absolute top-0 left-0 bg-white rounded-full px-6 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-black/5 whitespace-nowrap transform -translate-x-1/2 -translate-y-1/2 z-20 hover:scale-105 transition-transform cursor-default">
                  <span className="text-sm font-bold text-zinc-700">{q.text}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
