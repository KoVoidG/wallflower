'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Box, Info, ArrowUpRight, TrendingUp, Calendar, ArrowDownRight, Receipt, PackageX, ChevronRight, AlertTriangle, AlertOctagon, Clock, Star, MessageSquare } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FadeInView, CountUp } from '@/components/motion';

const inventoryTimeSeriesData = [
  { month: "Dec '23", value: 600000 },
  { month: "Jan '24", value: 680000 },
  { month: "Feb '24", value: 820000 },
  { month: "Mar '24", value: 640000 },
  { month: "Apr '24", value: 720000 },
  { month: "May '24", value: 850000 },
];

function InfoTooltip({ text }: { text: string }) {
  return (
    <div className="relative group/tooltip inline-block" title={text}>
      <Info className="size-3.5 text-text-secondary/60 hover:text-text-primary transition-colors cursor-pointer" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block z-40 w-52 p-2 rounded-lg bg-surface border border-border-strong shadow-xl text-[11px] font-sans text-text-secondary leading-snug pointer-events-none animate-in fade-in duration-150">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-surface" />
      </div>
    </div>
  );
}

export function InventoryView() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'30D' | '90D' | '6M' | '12M'>('6M');

  return (
    <div className="space-y-6">
      {/* Header / Subtitle for Inventory Overview */}
      <FadeInView offset={12}>
        <div>
          <h2 className="font-display text-xl font-bold text-text-primary">Inventory Overview</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Track your inventory performance and key metrics.
          </p>
        </div>
      </FadeInView>

      {/* Row 1: 5 Metric Cards */}
      <FadeInView offset={14}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* 1. Total Inventory Value */}
          <Card className="p-4 space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded bg-tertiary/15 text-tertiary flex items-center justify-center">
                  <Box className="size-3.5" />
                </div>
                <span className="text-xs font-medium text-text-secondary">Total Inventory Value</span>
              </div>
              <InfoTooltip text="Total financial valuation of all stock items currently on hand based on unit purchase cost." />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-2xl font-bold text-text-primary block">
                ฿<CountUp to={850000} duration={0.6} formatter={(v) => Math.round(v).toLocaleString()} />
              </span>
              <span className="text-xs font-medium text-tertiary flex items-center gap-0.5">
                <ArrowUpRight className="size-3" />
                <span>6.8% vs Apr 2024</span>
              </span>
            </div>
          </Card>

          {/* 2. Inventory Turnover */}
          <Card className="p-4 space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded bg-purple-500/15 text-purple-400 flex items-center justify-center">
                  <TrendingUp className="size-3.5" />
                </div>
                <span className="text-xs font-medium text-text-secondary">Inventory Turnover</span>
              </div>
              <InfoTooltip text="Measures how many times inventory is sold and replaced over a 12-month period. Higher turnover indicates efficient stock management." />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-2xl font-bold text-text-primary block">
                <CountUp to={3.1} decimals={1} duration={0.6} />x
              </span>
              <span className="text-xs font-medium text-danger flex items-center gap-0.5">
                <ArrowDownRight className="size-3" />
                <span>-0.4 vs Apr 2024</span>
              </span>
            </div>
          </Card>

          {/* 3. Average Stock Coverage */}
          <Card className="p-4 space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded bg-warning/15 text-warning flex items-center justify-center">
                  <Calendar className="size-3.5" />
                </div>
                <span className="text-xs font-medium text-text-secondary">Average Stock Coverage</span>
              </div>
              <InfoTooltip text="Estimated number of days current stock will sustain operations based on historical average daily sales velocity." />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-2xl font-bold text-text-primary block">38 days</span>
              <span className="text-xs font-medium text-danger flex items-center gap-0.5">
                <ArrowDownRight className="size-3" />
                <span>-5 days vs Apr 2024</span>
              </span>
            </div>
          </Card>

          {/* 4. Slow Moving Value */}
          <Card className="p-4 space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded bg-info/15 text-info flex items-center justify-center">
                  <Receipt className="size-3.5" />
                </div>
                <span className="text-xs font-medium text-text-secondary">Slow Moving Value</span>
              </div>
              <InfoTooltip text="Total monetary value of stock items that have experienced no sales velocity for over 60 days." />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-2xl font-bold text-text-primary block">
                ฿<CountUp to={120000} duration={0.6} formatter={(v) => Math.round(v).toLocaleString()} />
              </span>
              <span className="text-xs font-medium text-tertiary flex items-center gap-0.5">
                <ArrowUpRight className="size-3" />
                <span>4.2% vs Apr 2024</span>
              </span>
            </div>
          </Card>

          {/* 5. Stockout Rate */}
          <Card className="p-4 space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded bg-teal-500/15 text-teal-400 flex items-center justify-center">
                  <PackageX className="size-3.5" />
                </div>
                <span className="text-xs font-medium text-text-secondary">Stockout Rate</span>
              </div>
              <InfoTooltip text="Percentage of total product catalog SKUs that are currently out of stock and unable to fulfill customer orders." />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-2xl font-bold text-text-primary block">1.2%</span>
              <span className="text-xs font-medium text-tertiary flex items-center gap-0.5">
                <ArrowDownRight className="size-3" />
                <span>-0.6% vs Apr 2024</span>
              </span>
            </div>
          </Card>
        </div>
      </FadeInView>

      {/* Row 2: Area Chart + Inventory Composition Donut */}
      <FadeInView offset={16}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 1. Inventory Value Over Time (7 Columns) */}
          <Card className="lg:col-span-7 p-5 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <h3 className="font-display text-base font-semibold text-text-primary">
                  Inventory Value Over Time
                </h3>
                <InfoTooltip text="Historical trend of total inventory valuation over the selected timeframe." />
              </div>

              <div className="flex items-center gap-1 bg-surface-hover/80 border border-border p-0.5 rounded-lg text-xs font-medium">
                {(['30D', '90D', '6M', '12M'] as const).map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setSelectedTimeframe(tf)}
                    className={cn(
                      'px-2.5 py-1 rounded-md transition-colors cursor-pointer',
                      selectedTimeframe === tf
                        ? 'bg-surface text-tertiary border border-tertiary/40 font-semibold shadow-xs'
                        : 'text-text-secondary hover:text-text-primary'
                    )}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={inventoryTimeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="inventoryGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D395" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#00D395" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#6B7280"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${val / 1000}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E232E',
                      borderColor: '#2A3240',
                      borderRadius: '8px',
                      color: '#F3F4F6',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => [`฿${value.toLocaleString()}`, 'Value']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#00D395"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#inventoryGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* 2. Inventory Composition (5 Columns) */}
          <Card className="lg:col-span-5 p-5 flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-1.5">
              <h3 className="font-display text-base font-semibold text-text-primary">
                Inventory Composition
              </h3>
              <InfoTooltip text="Breakdown of stock items categorized by turnover velocity and lifecycle status." />
            </div>

            <div className="flex items-center gap-4 py-2">
              {/* Donut Ring */}
              <div className="relative size-32 shrink-0 flex items-center justify-center">
                <svg className="size-full transform -rotate-90" viewBox="0 0 100 100">
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#00D395"
                    strokeWidth="11"
                    strokeDasharray="119.38 238.76"
                    initial={{ strokeDashoffset: 238.76 }}
                    whileInView={{ strokeDashoffset: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    fill="transparent"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#4FA8FF"
                    strokeWidth="11"
                    strokeDasharray="71.63 238.76"
                    initial={{ strokeDashoffset: 238.76 }}
                    whileInView={{ strokeDashoffset: -119.38 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    fill="transparent"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#A855F7"
                    strokeWidth="11"
                    strokeDasharray="33.66 238.76"
                    initial={{ strokeDashoffset: 238.76 }}
                    whileInView={{ strokeDashoffset: -191.01 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    fill="transparent"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#F97316"
                    strokeWidth="11"
                    strokeDasharray="9.78 238.76"
                    initial={{ strokeDashoffset: 238.76 }}
                    whileInView={{ strokeDashoffset: -224.67 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    fill="transparent"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#EAB308"
                    strokeWidth="11"
                    strokeDasharray="4.3 238.76"
                    initial={{ strokeDashoffset: 238.76 }}
                    whileInView={{ strokeDashoffset: -234.45 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-mono text-base font-bold text-text-primary">฿850,000</span>
                  <span className="font-sans text-[10px] text-text-secondary">Total Value</span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-1.5 text-xs flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-tertiary" />
                    <span className="text-text-secondary">Fast Moving</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium text-text-primary">฿425,000</span>
                    <span className="font-mono text-text-secondary text-[11px] w-10 text-right">50.0%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-info" />
                    <span className="text-text-secondary">Medium Moving</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium text-text-primary">฿255,000</span>
                    <span className="font-mono text-text-secondary text-[11px] w-10 text-right">30.0%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-purple-500" />
                    <span className="text-text-secondary">Slow Moving</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium text-text-primary">฿120,000</span>
                    <span className="font-mono text-text-secondary text-[11px] w-10 text-right">14.1%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-orange-500" />
                    <span className="text-text-secondary">Obsolete / Dead Stock</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium text-text-primary">฿35,000</span>
                    <span className="font-mono text-text-secondary text-[11px] w-10 text-right">4.1%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-amber-500" />
                    <span className="text-text-secondary">In Transit / On Order</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium text-text-primary">฿15,000</span>
                    <span className="font-mono text-text-secondary text-[11px] w-10 text-right">1.8%</span>
                  </div>
                </div>

                <div className="border-t border-border/60 pt-1.5 flex items-center justify-between font-semibold">
                  <span className="text-text-primary">Total</span>
                  <span className="font-mono text-text-primary">100%</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </FadeInView>

      {/* Row 3: 3 Detailed Cards */}
      <FadeInView offset={18}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 1. Top Categories by Inventory Value (4 Cols) */}
          <Card className="lg:col-span-4 p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-1.5">
                <h3 className="font-display text-base font-semibold text-text-primary">
                  Top Categories by Inventory Value
                </h3>
                <InfoTooltip text="Product categories ranked by total monetary value held in warehouse stock." />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border/60 text-text-secondary">
                    <tr>
                      <th className="py-2 font-medium">Category</th>
                      <th className="py-2 font-medium text-right">Inventory Value</th>
                      <th className="py-2 font-medium text-right">% of Total</th>
                      <th className="py-2 font-medium text-right">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    <tr>
                      <td className="py-2.5 font-sans font-medium text-text-primary flex items-center gap-2">
                        <span className="size-5 rounded bg-tertiary/15 text-tertiary flex items-center justify-center shrink-0">
                          📦
                        </span>
                        <span>Beverage</span>
                      </td>
                      <td className="py-2.5 text-right text-text-primary">฿200,000</td>
                      <td className="py-2.5 text-right text-text-secondary">23.5%</td>
                      <td className="py-2.5 text-right text-tertiary">▲ 8.6%</td>
                    </tr>

                    <tr>
                      <td className="py-2.5 font-sans font-medium text-text-primary flex items-center gap-2">
                        <span className="size-5 rounded bg-tertiary/15 text-tertiary flex items-center justify-center shrink-0">
                          📦
                        </span>
                        <span>Snacks</span>
                      </td>
                      <td className="py-2.5 text-right text-text-primary">฿180,000</td>
                      <td className="py-2.5 text-right text-text-secondary">21.2%</td>
                      <td className="py-2.5 text-right text-tertiary">▲ 5.2%</td>
                    </tr>

                    <tr>
                      <td className="py-2.5 font-sans font-medium text-text-primary flex items-center gap-2">
                        <span className="size-5 rounded bg-tertiary/15 text-tertiary flex items-center justify-center shrink-0">
                          📦
                        </span>
                        <span>Household</span>
                      </td>
                      <td className="py-2.5 text-right text-text-primary">฿150,000</td>
                      <td className="py-2.5 text-right text-text-secondary">17.6%</td>
                      <td className="py-2.5 text-right text-danger">▼ -2.1%</td>
                    </tr>

                    <tr>
                      <td className="py-2.5 font-sans font-medium text-text-primary flex items-center gap-2">
                        <span className="size-5 rounded bg-tertiary/15 text-tertiary flex items-center justify-center shrink-0">
                          📦
                        </span>
                        <span>Personal Care</span>
                      </td>
                      <td className="py-2.5 text-right text-text-primary">฿120,000</td>
                      <td className="py-2.5 text-right text-text-secondary">14.1%</td>
                      <td className="py-2.5 text-right text-tertiary">▲ 1.3%</td>
                    </tr>

                    <tr>
                      <td className="py-2.5 font-sans font-medium text-text-primary flex items-center gap-2">
                        <span className="size-5 rounded bg-tertiary/15 text-tertiary flex items-center justify-center shrink-0">
                          📦
                        </span>
                        <span>Others</span>
                      </td>
                      <td className="py-2.5 text-right text-text-primary">฿200,000</td>
                      <td className="py-2.5 text-right text-text-secondary">23.5%</td>
                      <td className="py-2.5 text-right text-tertiary">▲ 7.4%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <Link href="/reports" className="pt-2 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center justify-between group cursor-pointer">
              <span>View all categories</span>
              <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Card>

          {/* 2. Top Slow Moving Items (5 Cols) */}
          <Card className="lg:col-span-5 p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-base font-semibold text-text-primary">
                    Top Slow Moving Items
                  </h3>
                  <InfoTooltip text="Individual product items with high days of stock coverage and minimal recent sales momentum." />
                </div>
                <Link href="/reports" className="text-xs text-info hover:underline">
                  View all
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border/60 text-text-secondary">
                    <tr>
                      <th className="py-2 font-medium">Item</th>
                      <th className="py-2 font-medium">Category</th>
                      <th className="py-2 font-medium text-center">Days of Stock</th>
                      <th className="py-2 font-medium text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr>
                      <td className="py-2.5 font-medium text-text-primary flex items-center gap-2">
                        <span className="size-6 rounded bg-surface-hover flex items-center justify-center text-sm shrink-0 border border-border">
                          🍜
                        </span>
                        <span className="truncate max-w-[130px]">Instant Noodles (Bulk)</span>
                      </td>
                      <td className="py-2.5 text-text-secondary">Snacks</td>
                      <td className="py-2.5 text-center text-danger font-mono font-semibold">125 days</td>
                      <td className="py-2.5 text-right font-mono text-text-primary">฿18,500</td>
                    </tr>

                    <tr>
                      <td className="py-2.5 font-medium text-text-primary flex items-center gap-2">
                        <span className="size-6 rounded bg-surface-hover flex items-center justify-center text-sm shrink-0 border border-border">
                          🍫
                        </span>
                        <span className="truncate max-w-[130px]">Chocolate Wafer Box</span>
                      </td>
                      <td className="py-2.5 text-text-secondary">Snacks</td>
                      <td className="py-2.5 text-center text-danger font-mono font-semibold">98 days</td>
                      <td className="py-2.5 text-right font-mono text-text-primary">฿12,300</td>
                    </tr>

                    <tr>
                      <td className="py-2.5 font-medium text-text-primary flex items-center gap-2">
                        <span className="size-6 rounded bg-surface-hover flex items-center justify-center text-sm shrink-0 border border-border">
                          🧴
                        </span>
                        <span className="truncate max-w-[130px]">Laundry Detergent 2kg</span>
                      </td>
                      <td className="py-2.5 text-text-secondary">Household</td>
                      <td className="py-2.5 text-center text-warning font-mono font-semibold">85 days</td>
                      <td className="py-2.5 text-right font-mono text-text-primary">฿10,800</td>
                    </tr>

                    <tr>
                      <td className="py-2.5 font-medium text-text-primary flex items-center gap-2">
                        <span className="size-6 rounded bg-surface-hover flex items-center justify-center text-sm shrink-0 border border-border">
                          🌽
                        </span>
                        <span className="truncate max-w-[130px]">Canned Corn 425g</span>
                      </td>
                      <td className="py-2.5 text-text-secondary">Grocery</td>
                      <td className="py-2.5 text-center text-warning font-mono font-semibold">78 days</td>
                      <td className="py-2.5 text-right font-mono text-text-primary">฿6,900</td>
                    </tr>

                    <tr>
                      <td className="py-2.5 font-medium text-text-primary flex items-center gap-2">
                        <span className="size-6 rounded bg-surface-hover flex items-center justify-center text-sm shrink-0 border border-border">
                          🧻
                        </span>
                        <span className="truncate max-w-[130px]">Tissue Box 150s</span>
                      </td>
                      <td className="py-2.5 text-text-secondary">Household</td>
                      <td className="py-2.5 text-center text-warning font-mono font-semibold">76 days</td>
                      <td className="py-2.5 text-right font-mono text-text-primary">฿5,600</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <Link href="/reports" className="pt-2 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center justify-between group cursor-pointer">
              <span>View all slow moving items</span>
              <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Card>

          {/* 3. Inventory Alerts (3 Cols) */}
          <Card className="lg:col-span-3 p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-base font-semibold text-text-primary">
                    Inventory Alerts
                  </h3>
                  <InfoTooltip text="Real-time notifications for items requiring stock replenishment, overstock promotion, or immediate restock." />
                </div>
                <Link href="/advisor" className="text-xs text-info hover:underline">
                  View all
                </Link>
              </div>

              <div className="space-y-3 pt-1">
                {/* Alert 1 */}
                <Link href="/advisor" className="flex items-center justify-between p-2.5 rounded-lg bg-warning/10 border border-warning/20 hover:bg-warning/20 transition-colors group cursor-pointer">
                  <div className="flex items-start gap-2.5">
                    <div className="size-6 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertTriangle className="size-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-text-primary leading-snug">
                        8 items are below minimum stock
                      </p>
                      <p className="text-[11px] text-text-secondary mt-0.5">Reorder recommended</p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-text-secondary group-hover:translate-x-0.5 transition-transform shrink-0" />
                </Link>

                {/* Alert 2 */}
                <Link href="/advisor" className="flex items-center justify-between p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition-colors group cursor-pointer">
                  <div className="flex items-start gap-2.5">
                    <div className="size-6 rounded bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertOctagon className="size-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-text-primary leading-snug">
                        5 items are overstocked
                      </p>
                      <p className="text-[11px] text-text-secondary mt-0.5">Consider promotion</p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-text-secondary group-hover:translate-x-0.5 transition-transform shrink-0" />
                </Link>

                {/* Alert 3 */}
                <Link href="/advisor" className="flex items-center justify-between p-2.5 rounded-lg bg-info/10 border border-info/20 hover:bg-info/20 transition-colors group cursor-pointer">
                  <div className="flex items-start gap-2.5">
                    <div className="size-6 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Info className="size-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-text-primary leading-snug">
                        2 items are out of stock
                      </p>
                      <p className="text-[11px] text-text-secondary mt-0.5">Restock immediately</p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-text-secondary group-hover:translate-x-0.5 transition-transform shrink-0" />
                </Link>

                {/* Alert 4 */}
                <Link href="/advisor" className="flex items-center justify-between p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors group cursor-pointer">
                  <div className="flex items-start gap-2.5">
                    <div className="size-6 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="size-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-text-primary leading-snug">
                        Stock coverage is below target
                      </p>
                      <p className="text-[11px] text-text-secondary mt-0.5">Current: 38 days (Target: 45 days)</p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-text-secondary group-hover:translate-x-0.5 transition-transform shrink-0" />
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </FadeInView>

      {/* Row 4: Inventory Insight Banner */}
      <FadeInView offset={20}>
        <Card className="p-4 bg-surface-hover/60 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-tertiary/20 text-tertiary flex items-center justify-center shrink-0">
              <Star className="size-4 fill-tertiary" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-text-primary">Inventory Insight</h4>
              <p className="text-xs text-text-secondary mt-0.5">
                Your inventory turnover decreased slightly this month. Consider reviewing slow-moving items and optimizing purchase quantities.
              </p>
            </div>
          </div>

          <Button
            asChild
            variant="secondary"
            size="sm"
            className="shrink-0 text-xs border-tertiary/40 text-tertiary hover:bg-tertiary/10 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Link href="/advisor">
              <MessageSquare className="size-3.5" />
              <span>Ask AI Advisor</span>
            </Link>
          </Button>
        </Card>
      </FadeInView>
    </div>
  );
}
