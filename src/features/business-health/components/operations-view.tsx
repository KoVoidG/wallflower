// src/features/business-health/components/operations-view.tsx
'use client';

import { motion } from 'motion/react';
import {
  Plus,
  Users,
  Store,
  Clock,
  Calendar,
  Truck,
  DollarSign,
  Edit,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FadeInView, CountUp } from '@/components/motion';

export function OperationsView() {
  return (
    <div className="space-y-6">
      {/* Header / Title Bar */}
      <FadeInView offset={12}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-[#0F172A] dark:text-white">
              Operations
            </h2>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
              Track your day-to-day operations and key business drivers.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs font-semibold shadow-md shadow-indigo-500/25 hover:opacity-95 hover:scale-105 active:scale-95 cursor-pointer transition-all self-start sm:self-auto"
          >
            <Plus className="size-3.5" />
            <span>Edit Operations Data</span>
          </button>
        </div>
      </FadeInView>

      {/* Row 1: 6 Metric Cards (No hover bounce, B&W icons) */}
      <FadeInView offset={14}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* 1. Employees */}
          <Card className="p-4 space-y-2 flex flex-col justify-between rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white flex items-center justify-center border border-slate-200 dark:border-[#2A344A]">
                <Users className="size-3.5" />
              </div>
              <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                Employees
              </span>
            </div>
            <div>
              <span className="font-mono text-2xl font-bold text-[#0F172A] dark:text-white block">
                <CountUp to={18} duration={0.5} />
              </span>
              <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] block">
                Full-time 14 • Part-time 4
              </span>
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              ▲ 1 vs last month
            </span>
          </Card>

          {/* 2. Store / Branches */}
          <Card className="p-4 space-y-2 flex flex-col justify-between rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white flex items-center justify-center border border-slate-200 dark:border-[#2A344A]">
                <Store className="size-3.5" />
              </div>
              <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                Store / Branches
              </span>
            </div>
            <div>
              <span className="font-mono text-2xl font-bold text-[#0F172A] dark:text-white block">
                2
              </span>
              <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] block">
                Main Branch + 1 Outlet
              </span>
            </div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              No change
            </span>
          </Card>

          {/* 3. Operating Hours */}
          <Card className="p-4 space-y-2 flex flex-col justify-between rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white flex items-center justify-center border border-slate-200 dark:border-[#2A344A]">
                <Clock className="size-3.5" />
              </div>
              <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                Operating Hours
              </span>
            </div>
            <div>
              <span className="font-mono text-2xl font-bold text-[#0F172A] dark:text-white block">
                11 hrs
              </span>
              <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] block">
                9:00 AM – 8:00 PM
              </span>
            </div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              Mon – Sun
            </span>
          </Card>

          {/* 4. Avg. Customers / Day */}
          <Card className="p-4 space-y-2 flex flex-col justify-between rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white flex items-center justify-center border border-slate-200 dark:border-[#2A344A]">
                <Users className="size-3.5" />
              </div>
              <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                Avg. Customers / Day
              </span>
            </div>
            <div>
              <span className="font-mono text-2xl font-bold text-[#0F172A] dark:text-white block">
                <CountUp to={420} duration={0.5} />
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-1">
                ▲ 5.0% vs last month
              </span>
            </div>
            <span className="text-xs text-transparent">Placeholder</span>
          </Card>

          {/* 5. Suppliers */}
          <Card className="p-4 space-y-2 flex flex-col justify-between rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white flex items-center justify-center border border-slate-200 dark:border-[#2A344A]">
                <Truck className="size-3.5" />
              </div>
              <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                Suppliers
              </span>
            </div>
            <div>
              <span className="font-mono text-2xl font-bold text-[#0F172A] dark:text-white block">
                12
              </span>
              <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] block">
                Active suppliers
              </span>
            </div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              No change
            </span>
          </Card>

          {/* 6. Order Frequency */}
          <Card className="p-4 space-y-2 flex flex-col justify-between rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white flex items-center justify-center border border-slate-200 dark:border-[#2A344A]">
                <Calendar className="size-3.5" />
              </div>
              <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                Order Frequency
              </span>
            </div>
            <div>
              <span className="font-mono text-2xl font-bold text-[#0F172A] dark:text-white block">
                2.1 / week
              </span>
              <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] block">
                Average restock frequency
              </span>
            </div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              No change
            </span>
          </Card>
        </div>
      </FadeInView>

      {/* Row 2: 3 Cards */}
      <FadeInView offset={16}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1. Operating Schedule (B&W Icon) */}
          <Card className="p-5 flex flex-col justify-between space-y-4 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white flex items-center justify-center border border-slate-200 dark:border-[#2A344A]">
                  <Clock className="size-3.5" />
                </div>
                <h3 className="font-display text-base font-bold text-[#0F172A] dark:text-white">
                  Operating Schedule
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 dark:border-[#1E2638] text-[#64748B] dark:text-[#94A3B8]">
                    <tr>
                      <th className="py-2 font-medium">Day</th>
                      <th className="py-2 font-medium">Open</th>
                      <th className="py-2 font-medium">Close</th>
                      <th className="py-2 font-medium">Total Hours</th>
                      <th className="py-2 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#1E2638] font-mono">
                    {[
                      { day: 'Monday', hours: '11 hrs' },
                      { day: 'Tuesday', hours: '11 hrs' },
                      { day: 'Wednesday', hours: '11 hrs' },
                      { day: 'Thursday', hours: '11 hrs' },
                      { day: 'Friday', hours: '11 hrs' },
                      { day: 'Saturday', hours: '11 hrs' },
                      { day: 'Sunday', hours: '12 hrs', close: '9:00 PM' },
                    ].map((item) => (
                      <tr key={item.day}>
                        <td className="py-2 font-sans font-medium text-[#0F172A] dark:text-white">
                          {item.day}
                        </td>
                        <td className="py-2 text-[#64748B] dark:text-[#94A3B8]">
                          9:00 AM
                        </td>
                        <td className="py-2 text-[#64748B] dark:text-[#94A3B8]">
                          {item.close || '8:00 PM'}
                        </td>
                        <td className="py-2 text-[#64748B] dark:text-[#94A3B8]">
                          {item.hours}
                        </td>
                        <td className="py-2 text-right">
                          <Badge
                            variant="success"
                            className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 font-bold"
                          >
                            Open
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              type="button"
              className="w-fit self-start px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#111622] text-xs font-semibold text-[#0F172A] dark:text-white hover:bg-[#6366F1]/10 dark:hover:bg-[#6366F1]/20 hover:border-[#6366F1]/40 transition-all cursor-pointer shadow-xs"
            >
              Edit Schedule
            </button>
          </Card>

          {/* 2. Monthly Fixed Operating Costs (B&W Icon) */}
          <Card className="p-5 flex flex-col justify-between space-y-4 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white flex items-center justify-center border border-slate-200 dark:border-[#2A344A]">
                  <DollarSign className="size-3.5" />
                </div>
                <h3 className="font-display text-base font-bold text-[#0F172A] dark:text-white">
                  Monthly Fixed Operating Costs
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    Rent (Main Branch)
                  </span>
                  <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                    ฿120,000
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    Rent (Outlet)
                  </span>
                  <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                    ฿35,000
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    Utilities
                  </span>
                  <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                    ฿18,000
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    Internet & Phone
                  </span>
                  <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                    ฿2,500
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    Insurance
                  </span>
                  <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                    ฿6,000
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    Maintenance
                  </span>
                  <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                    ฿5,500
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    Software / Subscriptions
                  </span>
                  <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                    ฿3,000
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    Other Fixed Costs
                  </span>
                  <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                    ฿9,000
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-[#1E2638] pt-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Total Fixed Costs
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  ฿199,000
                </span>
              </div>
            </div>

            <button
              type="button"
              className="w-fit self-start px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#111622] text-xs font-semibold text-[#0F172A] dark:text-white hover:bg-[#6366F1]/10 dark:hover:bg-[#6366F1]/20 hover:border-[#6366F1]/40 transition-all cursor-pointer shadow-xs"
            >
              Edit Costs
            </button>
          </Card>

          {/* 3. Supplier Overview (B&W Icon) */}
          <Card className="p-5 flex flex-col justify-between space-y-4 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white flex items-center justify-center border border-slate-200 dark:border-[#2A344A]">
                    <Truck className="size-3.5" />
                  </div>
                  <h3 className="font-display text-base font-bold text-[#0F172A] dark:text-white">
                    Supplier Overview
                  </h3>
                </div>
                <Link
                  href="/business-health?tab=inventory"
                  className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#4F46E5] dark:hover:text-[#A5B4FC] flex items-center gap-1 group cursor-pointer"
                >
                  <span>View all suppliers</span>
                  <ChevronRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 dark:border-[#1E2638] text-[#64748B] dark:text-[#94A3B8]">
                    <tr>
                      <th className="py-2 font-medium">Supplier</th>
                      <th className="py-2 font-medium">Category</th>
                      <th className="py-2 font-medium">Lead Time</th>
                      <th className="py-2 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#1E2638]">
                    {[
                      {
                        name: 'Thai Fresh Foods',
                        cat: 'Groceries',
                        lead: '2 days',
                      },
                      {
                        name: 'Global Packaging',
                        cat: 'Packaging',
                        lead: '3 days',
                      },
                      {
                        name: 'HomePro Supply',
                        cat: 'Household',
                        lead: '2 days',
                      },
                      {
                        name: 'Green Farm Co.',
                        cat: 'Produce',
                        lead: '1 day',
                      },
                      { name: 'Best Meat Co.', cat: 'Meat', lead: '2 days' },
                    ].map((supplier) => (
                      <tr key={supplier.name}>
                        <td className="py-2 font-medium text-[#0F172A] dark:text-white">
                          {supplier.name}
                        </td>
                        <td className="py-2 text-[#64748B] dark:text-[#94A3B8]">
                          {supplier.cat}
                        </td>
                        <td className="py-2 text-[#64748B] dark:text-[#94A3B8]">
                          {supplier.lead}
                        </td>
                        <td className="py-2 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                          • Active
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              type="button"
              className="w-fit self-start px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#111622] text-xs font-semibold text-[#0F172A] dark:text-white hover:bg-[#6366F1]/10 dark:hover:bg-[#6366F1]/20 hover:border-[#6366F1]/40 transition-all cursor-pointer shadow-xs"
            >
              Manage Suppliers
            </button>
          </Card>
        </div>
      </FadeInView>

      {/* Row 3: Staff Breakdown, Department Distribution, Notes */}
      <FadeInView offset={18}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1. Staff Breakdown (B&W Icon) */}
          <Card className="p-5 flex flex-col justify-between space-y-4 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white flex items-center justify-center border border-slate-200 dark:border-[#2A344A]">
                  <Users className="size-3.5" />
                </div>
                <h3 className="font-display text-base font-bold text-[#0F172A] dark:text-white">
                  Staff Breakdown
                </h3>
              </div>

              <div className="flex items-center gap-4 py-2">
                {/* SVG Donut Ring with Motion */}
                <div className="relative size-28 shrink-0 flex items-center justify-center">
                  <svg
                    className="size-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#00D395"
                      strokeWidth="10"
                      strokeDasharray="160 238.76"
                      initial={{ strokeDashoffset: 238.76 }}
                      whileInView={{ strokeDashoffset: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                      fill="transparent"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#3B82F6"
                      strokeWidth="10"
                      strokeDasharray="52.5 238.76"
                      initial={{ strokeDashoffset: 238.76 }}
                      whileInView={{ strokeDashoffset: -160 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{
                        duration: 1.0,
                        delay: 0.25,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      fill="transparent"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#8B5CF6"
                      strokeWidth="10"
                      strokeDasharray="26.2 238.76"
                      initial={{ strokeDashoffset: 238.76 }}
                      whileInView={{ strokeDashoffset: -212.5 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{
                        duration: 1.0,
                        delay: 0.45,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-mono text-xl font-bold text-[#0F172A] dark:text-white">
                      <CountUp to={18} duration={0.8} />
                    </span>
                    <span className="font-sans text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                      Employees
                    </span>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-2 text-xs flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-emerald-500" />
                      <span className="text-[#64748B] dark:text-[#94A3B8]">
                        Full-time
                      </span>
                    </div>
                    <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                      12 (67%)
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-blue-500" />
                      <span className="text-[#64748B] dark:text-[#94A3B8]">
                        Part-time
                      </span>
                    </div>
                    <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                      4 (22%)
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-purple-500" />
                      <span className="text-[#64748B] dark:text-[#94A3B8]">
                        Contract
                      </span>
                    </div>
                    <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                      2 (11%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="w-fit self-end px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#111622] text-xs font-semibold text-[#0F172A] dark:text-white hover:bg-[#6366F1]/10 dark:hover:bg-[#6366F1]/20 hover:border-[#6366F1]/40 inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
            >
              <span>Manage staff</span>
              <ChevronRight className="size-3.5" />
            </button>
          </Card>

          {/* 2. Department Distribution (B&W Icon) */}
          <Card className="p-5 flex flex-col justify-between space-y-4 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white flex items-center justify-center border border-slate-200 dark:border-[#2A344A]">
                  <Users className="size-3.5" />
                </div>
                <h3 className="font-display text-base font-bold text-[#0F172A] dark:text-white">
                  Department Distribution
                </h3>
              </div>

              <div className="space-y-3 pt-1">
                {[
                  { name: 'Sales', count: '8 (44%)', pct: '44%', color: 'bg-emerald-500' },
                  { name: 'Operations', count: '5 (28%)', pct: '28%', color: 'bg-teal-500' },
                  { name: 'Admin', count: '3 (17%)', pct: '17%', color: 'bg-blue-500' },
                  { name: 'Others', count: '2 (11%)', pct: '11%', color: 'bg-purple-500' },
                ].map((dept) => (
                  <div key={dept.name} className="flex items-center gap-3">
                    <span className="text-xs text-[#64748B] dark:text-[#94A3B8] w-20">
                      {dept.name}
                    </span>
                    <div className="flex-1 h-2.5 bg-[#F1F5F9] dark:bg-[#1E2638] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: '0%' }}
                        whileInView={{ width: dept.pct }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className={`h-full ${dept.color} rounded-full`}
                      />
                    </div>
                    <span className="font-mono text-xs font-medium text-[#0F172A] dark:text-white w-14 text-right">
                      {dept.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="w-fit self-end px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#111622] text-xs font-semibold text-[#0F172A] dark:text-white hover:bg-[#6366F1]/10 dark:hover:bg-[#6366F1]/20 hover:border-[#6366F1]/40 inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
            >
              <span>View org chart</span>
              <ChevronRight className="size-3.5" />
            </button>
          </Card>

          {/* 3. Notes (B&W Icon) */}
          <Card className="p-5 flex flex-col justify-between space-y-4 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white flex items-center justify-center border border-slate-200 dark:border-[#2A344A]">
                  <FileText className="size-3.5" />
                </div>
                <h3 className="font-display text-base font-bold text-[#0F172A] dark:text-white">
                  Notes
                </h3>
              </div>

              <div className="rounded-xl bg-[#F8FAFC] dark:bg-[#0B0F17] border border-slate-200/80 dark:border-[#1E2638] p-4 space-y-1 text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed min-h-[110px]">
                <p>We operate two stores in Bang Wa area.</p>
                <p>Weekends are our busiest days.</p>
                <p>Planning to extend closing time on holidays.</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                Last updated: May 18, 2024
              </span>
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#111622] text-xs font-semibold text-[#0F172A] dark:text-white hover:bg-[#6366F1]/10 dark:hover:bg-[#6366F1]/20 hover:border-[#6366F1]/40 inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
              >
                <span>Edit notes</span>
                <Edit className="size-3 text-[#64748B] dark:text-[#94A3B8]" />
              </button>
            </div>
          </Card>
        </div>
      </FadeInView>
    </div>
  );
}
