'use client';

import { ShieldCheck, Cpu, Landmark, Clock } from 'lucide-react';

export function ProofStrip() {
  const stats = [
    {
      value: '฿148M+',
      label: 'Simulated Business Capital',
      subtext: 'Across 420+ retail & SME models',
      icon: Landmark,
    },
    {
      value: '100%',
      label: 'Deterministic Calculations',
      subtext: 'Pure mathematical integrity',
      icon: Cpu,
    },
    {
      value: '5.2x',
      label: 'Faster Decision Velocity',
      subtext: 'From intuition to verified models',
      icon: Clock,
    },
    {
      value: 'Zero',
      label: 'Spreadsheet Formulas to Break',
      subtext: 'Automated sensitivity & runway',
      icon: ShieldCheck,
    },
  ];

  const businessTypes = [
    'Specialty Coffee & Roasteries',
    'Boutique Fashion & Apparel',
    'Beauty & Cosmetics Brands',
    'Consumer Electronics Stores',
    'B2B Wholesale & Distribution',
    'Multi-Branch Retail Chains',
  ];

  return (
    <section className="border-b border-border/60 bg-surface-subtle/50 py-12 text-left">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 space-y-8">
        {/* Top: 4 Key Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="p-5 rounded-2xl border border-border/80 bg-surface shadow-xs space-y-1.5 transition-all hover:border-brand/30"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl sm:text-3xl font-extrabold text-text-primary">
                    {item.value}
                  </span>
                  <div className="p-2 rounded-lg bg-surface-subtle text-brand border border-border/50">
                    <Icon className="size-4" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-text-primary">{item.label}</p>
                  <p className="text-[11px] text-text-muted font-medium">{item.subtext}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom: Supported SME Verticals Ticker */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border/60">
          <div className="flex items-center gap-2 text-xs font-bold text-text-muted shrink-0">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="uppercase tracking-wider">Engineered for Thai & Regional Retail SMEs:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {businessTypes.map((type) => (
              <span
                key={type}
                className="px-3 py-1 rounded-lg border border-border bg-surface text-[11px] font-semibold text-text-secondary hover:text-text-primary transition-colors"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
