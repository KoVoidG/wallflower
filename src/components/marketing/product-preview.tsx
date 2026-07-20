'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { Surface } from '@/components/ui/surface';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, Activity } from 'lucide-react';
import { useReducedMotion } from '@/components/motion';

/**
 * Stylized mock dashboard card composition that responds to pointer position.
 * Built with actual design system components (Surface, Badge) to showcase what the product looks like.
 */
export function ProductPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const prefersReduced = useReducedMotion();

  const rotateX = useTransform(mouseY, [-200, 200], [3, -3]);
  const rotateY = useTransform(mouseX, [-200, 200], [-3, 3]);

  function handleMouseMove(e: React.MouseEvent) {
    if (prefersReduced) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const cardContent = (
    <div className="flex flex-col gap-3 p-1">
      {/* Revenue KPI */}
      <Surface border className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px]/[18px] font-[550] text-text-muted">Monthly Revenue</span>
          <Badge variant="success" dot>Healthy</Badge>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[28px]/[34px] font-[650] text-text-primary tabular-nums">฿1,250,000</span>
        </div>
        <div className="flex items-center gap-1 mt-1.5 text-success">
          <TrendingUp className="size-3.5" aria-hidden="true" />
          <span className="text-[13px]/[20px] font-[550]">+12%</span>
          <span className="text-[13px]/[20px] text-text-muted ml-1">vs last month</span>
        </div>
      </Surface>

      {/* Risk detection */}
      <Surface border className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px]/[18px] font-[550] text-text-muted">Risk Detection</span>
          <Badge variant="warning" dot>2 Warnings</Badge>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-warning shrink-0" aria-hidden="true" />
            <span className="text-[13px]/[20px] text-text-secondary">Cash runway below 60 days</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="size-4 text-danger shrink-0" aria-hidden="true" />
            <span className="text-[13px]/[20px] text-text-secondary">Expense growth outpacing revenue</span>
          </div>
        </div>
      </Surface>

      {/* Simulation hint */}
      <Surface border className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="size-4 text-brand" aria-hidden="true" />
          <span className="text-[13px]/[18px] font-[550] text-text-muted">Decision Simulation</span>
        </div>
        <p className="text-[13px]/[20px] text-text-primary font-[500] mb-2">
          What if you hire 2 employees?
        </p>
        <div className="flex flex-col gap-1.5 text-[12px]/[18px]">
          <div className="flex justify-between">
            <span className="text-text-muted">Runway</span>
            <span className="tabular-nums text-text-primary">8.2 → <span className="text-warning font-[550]">5.1 months</span></span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Monthly profit</span>
            <span className="tabular-nums text-text-primary">฿35,000 → <span className="text-danger font-[550]">-฿12,400</span></span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Recommendation</span>
            <Badge variant="warning">Proceed cautiously</Badge>
          </div>
        </div>
      </Surface>
    </div>
  );

  if (prefersReduced) {
    return (
      <div
        ref={containerRef}
        className="relative bg-surface border border-border rounded-[var(--radius-lg)] p-4 shadow-lg"
      >
        {cardContent}
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 800 }}
      className="relative bg-surface border border-border rounded-[var(--radius-lg)] p-4 shadow-lg"
    >
      {cardContent}
    </motion.div>
  );
}
