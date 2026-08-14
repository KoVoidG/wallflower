'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import {
  Box,
  ArrowUpRight,
  TrendingUp,
  Calendar,
  ArrowDownRight,
  Receipt,
  PackageX,
  ChevronRight,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/navigation';
import { Card } from '@/components/ui/card';
import { InfoTooltip } from '@/components/ui/tooltip';
import { FadeInView, CountUp } from '@/components/motion';
import { useAdvisorDrawer } from '@/features/advisor/context/advisor-drawer-context';

const inventoryTimeSeriesData = [
  { month: "Dec '23", value: 600000 },
  { month: "Jan '24", value: 680000 },
  { month: "Feb '24", value: 820000 },
  { month: "Mar '24", value: 640000 },
  { month: "Apr '24", value: 720000 },
  { month: "May '24", value: 850000 },
];

export function InventoryView() {
  const t = useTranslations('businessHealth.inventory');
  const tHealth = useTranslations('businessHealth');
  const { openDrawer } = useAdvisorDrawer();
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    '30D' | '90D' | '6M' | '12M'
  >('6M');

  return (
    <div className="space-y-6">
      {/* Header / Subtitle for Inventory Overview */}
      <FadeInView offset={12}>
        <div>
          <h2 className="font-display text-xl font-bold text-[#0F172A] dark:text-white">
            {tHealth('tabs.inventory')}
          </h2>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            {t('subtitle')}
          </p>
        </div>
      </FadeInView>

      {/* Row 1: 5 Metric Cards (No hover bounce, B&W icons) */}
      <FadeInView offset={14}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* 1. Total Inventory Value */}
          <Card className="p-5 space-y-3 flex flex-col justify-between rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white flex items-center justify-center border border-slate-200 dark:border-[#2A344A]">
                  <Box className="size-3.5" />
                </div>
                <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                  Total Value
                </span>
              </div>
              <InfoTooltip content="Total financial valuation of all stock items currently on hand based on unit purchase cost." />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-2xl font-bold text-[#0F172A] dark:text-white block">
                ฿
                <CountUp
                  to={850000}
                  duration={0.6}
                  formatter={(v) => Math.round(v).toLocaleString()}
                />
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="size-3.5" />
                <span>6.8% vs Apr 2024</span>
              </span>
            </div>
          </Card>

          {/* 2. Inventory Turnover (Down = Red) */}
          <Card className="p-5 space-y-3 flex flex-col justify-between rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white flex items-center justify-center border border-slate-200 dark:border-[#2A344A]">
                  <TrendingUp className="size-3.5" />
                </div>
                <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                  Turnover Rate
                </span>
              </div>
              <InfoTooltip content="Measures how many times inventory is sold and replaced over a 12-month period." />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-2xl font-bold text-[#0F172A] dark:text-white block">
                <CountUp to={3.1} decimals={1} duration={0.6} />x
              </span>
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-0.5">
                <ArrowDownRight className="size-3.5" />
                <span>-0.4 vs Apr 2024</span>
              </span>
            </div>
          </Card>

          {/* 3. Average Stock Coverage (Down = Red) */}
          <Card className="p-5 space-y-3 flex flex-col justify-between rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white flex items-center justify-center border border-slate-200 dark:border-[#2A344A]">
                  <Calendar className="size-3.5" />
                </div>
                <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                  Stock Coverage
                </span>
              </div>
              <InfoTooltip content="Estimated number of days current stock will sustain operations based on sales velocity." />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-2xl font-bold text-[#0F172A] dark:text-white block">
                38 days
              </span>
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-0.5">
                <ArrowDownRight className="size-3.5" />
                <span>-5 days vs Apr 2024</span>
              </span>
            </div>
          </Card>

          {/* 4. Slow Moving Value (Warning Amber) */}
          <Card className="p-5 space-y-3 flex flex-col justify-between rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white flex items-center justify-center border border-slate-200 dark:border-[#2A344A]">
                  <Receipt className="size-3.5" />
                </div>
                <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                  Slow Moving
                </span>
              </div>
              <InfoTooltip content="Total monetary value of stock items that have experienced minimal sales for over 60 days." />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-2xl font-bold text-[#0F172A] dark:text-white block">
                ฿
                <CountUp
                  to={120000}
                  duration={0.6}
                  formatter={(v) => Math.round(v).toLocaleString()}
                />
              </span>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                <ArrowUpRight className="size-3.5" />
                <span>+4.2% vs Apr 2024</span>
              </span>
            </div>
          </Card>

          {/* 5. Stockout Rate (Down = Green Improvement) */}
          <Card className="p-5 space-y-3 flex flex-col justify-between rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white flex items-center justify-center border border-slate-200 dark:border-[#2A344A]">
                  <PackageX className="size-3.5" />
                </div>
                <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                  Stockout Rate
                </span>
              </div>
              <InfoTooltip content="Percentage of total product catalog SKUs that are currently out of stock." />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-2xl font-bold text-[#0F172A] dark:text-white block">
                1.2%
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <ArrowDownRight className="size-3.5" />
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
          <Card className="lg:col-span-7 p-6 flex flex-col justify-between space-y-4 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-1.5">
                <h3 className="font-display text-base font-bold text-[#0F172A] dark:text-white">
                  Inventory Value Over Time
                </h3>
                <InfoTooltip content="Historical trend of total inventory valuation over the selected timeframe." />
              </div>

              <div className="flex items-center gap-1 bg-[#F1F5F9] dark:bg-[#0B0F17] border border-slate-200/80 dark:border-[#1E2638] p-1 rounded-xl text-xs font-medium">
                {(['30D', '90D', '6M', '12M'] as const).map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setSelectedTimeframe(tf)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg transition-all cursor-pointer font-mono font-bold',
                      selectedTimeframe === tf
                        ? 'bg-white dark:bg-[#1E2638] text-[#0F172A] dark:text-white shadow-xs'
                        : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
                    )}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={inventoryTimeSeriesData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="inventoryGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#00D395"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="95%"
                        stopColor="#00D395"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${val / 1000}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111622',
                      borderColor: '#263042',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontFamily: 'JetBrains Mono',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    }}
                    formatter={(value: number) => [
                      `฿${value.toLocaleString()}`,
                      'Value',
                    ]}
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
          <Card className="lg:col-span-5 p-6 flex flex-col justify-between space-y-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <h3 className="font-display text-base font-bold text-[#0F172A] dark:text-white">
                  Inventory Composition
                </h3>
                <InfoTooltip content="Breakdown of stock items categorized by turnover velocity and lifecycle status." />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-[#1E2638] text-[#64748B] dark:text-[#94A3B8] border border-slate-200 dark:border-[#2A344A]">
                5 Categories
              </span>
            </div>

            {/* Segmented Distribution Bar */}
            <div className="space-y-1.5">
              <div className="h-2.5 w-full rounded-full flex overflow-hidden gap-0.5 bg-[#F1F5F9] dark:bg-[#1E2638] p-0.5">
                <div style={{ width: '50.0%' }} className="h-full bg-emerald-500 rounded-l-full" title="Fast Moving: 50%" />
                <div style={{ width: '30.0%' }} className="h-full bg-blue-500" title="Medium Moving: 30%" />
                <div style={{ width: '14.1%' }} className="h-full bg-purple-500" title="Slow Moving: 14.1%" />
                <div style={{ width: '4.1%' }} className="h-full bg-rose-500" title="Dead Stock: 4.1%" />
                <div style={{ width: '1.8%' }} className="h-full bg-amber-500 rounded-r-full" title="In Transit: 1.8%" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-1">
              {/* Donut Ring (5 Cols) */}
              <div className="sm:col-span-5 flex items-center justify-center">
                <div className="relative size-36 shrink-0 flex items-center justify-center">
                  <svg
                    className="size-full transform -rotate-90"
                    viewBox="0 0 120 120"
                  >
                    {/* Track Background */}
                    <circle
                      cx="60"
                      cy="60"
                      r="44"
                      stroke="#E2E8F0"
                      className="dark:stroke-[#1E2638]"
                      strokeWidth="11"
                      fill="transparent"
                    />
                    {/* 1. Fast Moving (50.0%) */}
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="44"
                      stroke="#00D395"
                      strokeWidth="11"
                      strokeDasharray="138.23 276.46"
                      initial={{ strokeDashoffset: 276.46 }}
                      whileInView={{ strokeDashoffset: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                      fill="transparent"
                    />
                    {/* 2. Medium Moving (30.0%) */}
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="44"
                      stroke="#3B82F6"
                      strokeWidth="11"
                      strokeDasharray="82.94 276.46"
                      initial={{ strokeDashoffset: 276.46 }}
                      whileInView={{ strokeDashoffset: -138.23 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.9,
                        delay: 0.15,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      fill="transparent"
                    />
                    {/* 3. Slow Moving (14.1%) */}
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="44"
                      stroke="#8B5CF6"
                      strokeWidth="11"
                      strokeDasharray="38.98 276.46"
                      initial={{ strokeDashoffset: 276.46 }}
                      whileInView={{ strokeDashoffset: -221.17 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.9,
                        delay: 0.3,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      fill="transparent"
                    />
                    {/* 4. Dead Stock (4.1%) */}
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="44"
                      stroke="#F43F5E"
                      strokeWidth="11"
                      strokeDasharray="11.33 276.46"
                      initial={{ strokeDashoffset: 276.46 }}
                      whileInView={{ strokeDashoffset: -260.15 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.9,
                        delay: 0.45,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      fill="transparent"
                    />
                    {/* 5. In Transit (1.8%) */}
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="44"
                      stroke="#F59E0B"
                      strokeWidth="11"
                      strokeDasharray="4.98 276.46"
                      initial={{ strokeDashoffset: 276.46 }}
                      whileInView={{ strokeDashoffset: -271.48 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.9,
                        delay: 0.55,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-mono text-sm sm:text-base font-bold text-[#0F172A] dark:text-white leading-tight">
                      ฿850,000
                    </span>
                    <span className="font-sans text-[10px] font-semibold text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                      Total Value
                    </span>
                  </div>
                </div>
              </div>

              {/* Breakdown Rows (7 Cols) */}
              <div className="sm:col-span-7 space-y-2.5 text-xs">
                {[
                  {
                    name: 'Fast Moving',
                    val: '฿425,000',
                    pct: '50.0%',
                    color: 'bg-emerald-500',
                  },
                  {
                    name: 'Medium Moving',
                    val: '฿255,000',
                    pct: '30.0%',
                    color: 'bg-blue-500',
                  },
                  {
                    name: 'Slow Moving',
                    val: '฿120,000',
                    pct: '14.1%',
                    color: 'bg-purple-500',
                  },
                  {
                    name: 'Dead Stock',
                    val: '฿35,000',
                    pct: '4.1%',
                    color: 'bg-rose-500',
                  },
                  {
                    name: 'In Transit',
                    val: '฿15,000',
                    pct: '1.8%',
                    color: 'bg-amber-500',
                  },
                ].map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`size-2 rounded-full ${item.color} shrink-0`} />
                        <span className="text-[#64748B] dark:text-[#94A3B8] font-medium">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="font-semibold text-[#0F172A] dark:text-white">
                          {item.val}
                        </span>
                        <span className="text-[#64748B] dark:text-[#94A3B8] text-[11px] w-10 text-right">
                          {item.pct}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </FadeInView>

      {/* Row 3: 3 Detailed Cards */}
      <FadeInView offset={18}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 1. Top Categories by Inventory Value (4 Cols) */}
          <Card className="lg:col-span-4 p-6 flex flex-col justify-between space-y-4 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-1.5">
                <h3 className="font-display text-base font-bold text-[#0F172A] dark:text-white">
                  Top Categories
                </h3>
                <InfoTooltip content="Product categories ranked by total monetary value held in stock." />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 dark:border-[#1E2638] text-[#64748B] dark:text-[#94A3B8]">
                    <tr>
                      <th className="py-2 font-medium">Category</th>
                      <th className="py-2 font-medium text-right">Value</th>
                      <th className="py-2 font-medium text-right">Share</th>
                      <th className="py-2 font-medium text-right">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#1E2638] font-mono">
                    {[
                      {
                        cat: 'Beverage',
                        val: '฿200,000',
                        share: '23.5%',
                        trend: '▲ 8.6%',
                        isUp: true,
                      },
                      {
                        cat: 'Snacks',
                        val: '฿180,000',
                        share: '21.2%',
                        trend: '▲ 5.2%',
                        isUp: true,
                      },
                      {
                        cat: 'Household',
                        val: '฿150,000',
                        share: '17.6%',
                        trend: '▼ -2.1%',
                        isUp: false,
                      },
                      {
                        cat: 'Personal Care',
                        val: '฿120,000',
                        share: '14.1%',
                        trend: '▲ 1.3%',
                        isUp: true,
                      },
                      {
                        cat: 'Others',
                        val: '฿200,000',
                        share: '23.5%',
                        trend: '▲ 7.4%',
                        isUp: true,
                      },
                    ].map((row) => (
                      <tr key={row.cat}>
                        <td className="py-2.5 font-sans font-medium text-[#0F172A] dark:text-white flex items-center gap-2">
                          <span>📦</span>
                          <span>{row.cat}</span>
                        </td>
                        <td className="py-2.5 text-right text-[#0F172A] dark:text-white">
                          {row.val}
                        </td>
                        <td className="py-2.5 text-right text-[#64748B] dark:text-[#94A3B8]">
                          {row.share}
                        </td>
                        <td
                          className={`py-2.5 text-right font-semibold ${
                            row.isUp
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {row.trend}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Link
              href="/reports"
              className="pt-2 text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#4F46E5] dark:hover:text-[#A5B4FC] transition-colors flex items-center justify-between group cursor-pointer"
            >
              <span>View all categories</span>
              <ChevronRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Card>

          {/* 2. Top Slow Moving Items (5 Cols) */}
          <Card className="lg:col-span-5 p-6 flex flex-col justify-between space-y-4 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-base font-bold text-[#0F172A] dark:text-white">
                    Top Slow Moving Items
                  </h3>
                  <InfoTooltip content="Individual product items with high days of stock coverage and minimal sales velocity." />
                </div>
                <Link
                  href="/reports"
                  className="text-xs font-semibold text-[#4F46E5] dark:text-[#818CF8] hover:underline"
                >
                  View all
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 dark:border-[#1E2638] text-[#64748B] dark:text-[#94A3B8]">
                    <tr>
                      <th className="py-2 font-medium">Item</th>
                      <th className="py-2 font-medium">Category</th>
                      <th className="py-2 font-medium text-center">Days</th>
                      <th className="py-2 font-medium text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#1E2638]">
                    {[
                      {
                        emoji: '🍜',
                        name: 'Instant Noodles (Bulk)',
                        cat: 'Snacks',
                        days: '125 days',
                        val: '฿18,500',
                        isSevere: true,
                      },
                      {
                        emoji: '🍫',
                        name: 'Chocolate Wafer Box',
                        cat: 'Snacks',
                        days: '98 days',
                        val: '฿12,300',
                        isSevere: true,
                      },
                      {
                        emoji: '🧴',
                        name: 'Laundry Detergent 2kg',
                        cat: 'Household',
                        days: '85 days',
                        val: '฿10,800',
                        isSevere: false,
                      },
                      {
                        emoji: '🌽',
                        name: 'Canned Corn 425g',
                        cat: 'Grocery',
                        days: '78 days',
                        val: '฿6,900',
                        isSevere: false,
                      },
                      {
                        emoji: '🧻',
                        name: 'Tissue Box 150s',
                        cat: 'Household',
                        days: '76 days',
                        val: '฿5,600',
                        isSevere: false,
                      },
                    ].map((item) => (
                      <tr key={item.name}>
                        <td className="py-2.5 font-medium text-[#0F172A] dark:text-white flex items-center gap-2">
                          <span className="size-6 rounded-md bg-[#F1F5F9] dark:bg-[#1E2638] flex items-center justify-center text-xs shrink-0">
                            {item.emoji}
                          </span>
                          <span className="truncate max-w-[130px]">
                            {item.name}
                          </span>
                        </td>
                        <td className="py-2.5 text-[#64748B] dark:text-[#94A3B8]">
                          {item.cat}
                        </td>
                        <td
                          className={`py-2.5 text-center font-mono font-semibold ${
                            item.isSevere
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {item.days}
                        </td>
                        <td className="py-2.5 text-right font-mono text-[#0F172A] dark:text-white font-medium">
                          {item.val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Link
              href="/reports"
              className="pt-2 text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#4F46E5] dark:hover:text-[#A5B4FC] transition-colors flex items-center justify-between group cursor-pointer"
            >
              <span>View all slow moving items</span>
              <ChevronRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Card>

          {/* 3. Inventory Alerts (3 Cols) - Warning & Alert icons remain colored */}
          <Card className="lg:col-span-3 p-6 flex flex-col justify-between space-y-4 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-base font-bold text-[#0F172A] dark:text-white">
                    Inventory Alerts
                  </h3>
                  <InfoTooltip content="Real-time notifications for items requiring replenishment or restock." />
                </div>
                <Link
                  href="/simulations?tab=workspace"
                  className="text-xs font-semibold text-[#4F46E5] dark:text-[#818CF8] hover:underline"
                >
                  View all
                </Link>
              </div>

              <div className="space-y-2.5 pt-1">
                {/* Alert 1 (Warning Amber) */}
                <Link
                  href="/simulations?tab=workspace"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 hover:bg-amber-100/70 dark:hover:bg-amber-950/60 transition-all group cursor-pointer"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="size-6 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertTriangle className="size-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#0F172A] dark:text-white leading-snug">
                        8 items below minimum stock
                      </p>
                      <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                        Reorder recommended
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-[#94A3B8] group-hover:translate-x-1 transition-transform shrink-0" />
                </Link>

                {/* Alert 2 (Warning Amber) */}
                <Link
                  href="/simulations?tab=workspace"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 hover:bg-amber-100/70 dark:hover:bg-amber-950/60 transition-all group cursor-pointer"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="size-6 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertOctagon className="size-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#0F172A] dark:text-white leading-snug">
                        5 items are overstocked
                      </p>
                      <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                        Consider promotion
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-[#94A3B8] group-hover:translate-x-1 transition-transform shrink-0" />
                </Link>

                {/* Alert 3 (Red Alert - Out of Stock) */}
                <Link
                  href="/simulations?tab=workspace"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 hover:bg-rose-100/70 dark:hover:bg-rose-950/60 transition-all group cursor-pointer"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="size-6 rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                      <PackageX className="size-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#0F172A] dark:text-white leading-snug">
                        2 items are out of stock
                      </p>
                      <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                        Restock immediately
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-[#94A3B8] group-hover:translate-x-1 transition-transform shrink-0" />
                </Link>

                {/* Alert 4 (Warning Amber) */}
                <Link
                  href="/simulations?tab=workspace"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 hover:bg-amber-100/70 dark:hover:bg-amber-950/60 transition-all group cursor-pointer"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="size-6 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="size-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#0F172A] dark:text-white leading-snug">
                        Stock coverage below target
                      </p>
                      <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                        38 days (Target: 45 days)
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-[#94A3B8] group-hover:translate-x-1 transition-transform shrink-0" />
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </FadeInView>

      {/* Row 4: Inventory Insight Banner */}
      <FadeInView offset={20}>
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#F5F3FF] via-[#EDE9FE] to-[#F3E8FF] dark:from-[#181438] dark:via-[#1B1742] dark:to-[#111622] border border-[#DDD6FE] dark:border-purple-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-xl bg-[#EDE9FE] dark:bg-purple-950 text-[#8B5CF6] dark:text-purple-300 border border-[#DDD6FE] dark:border-purple-800 flex items-center justify-center shrink-0 shadow-2xs">
              <Sparkles className="size-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#4F46E5] dark:text-purple-300">
                Inventory Insight
              </h4>
              <p className="text-xs text-[#1E1B4B] dark:text-slate-200 mt-0.5">
                Your inventory turnover decreased slightly this month. Consider
                reviewing slow-moving items and optimizing purchase quantities.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              openDrawer(
                'How should I optimize my inventory turnover and reduce slow-moving holding costs?',
              )
            }
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-semibold text-xs shadow-md shadow-indigo-500/25 hover:opacity-95 hover:scale-105 active:scale-95 cursor-pointer transition-all shrink-0"
          >
            <MessageSquare className="size-3.5" />
            <span>Ask AI Advisor</span>
          </button>
        </div>
      </FadeInView>
    </div>
  );
}
