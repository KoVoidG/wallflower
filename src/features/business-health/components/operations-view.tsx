'use client';

import { motion } from 'motion/react';
import { Plus, Users, Store, Clock, Calendar, Truck, DollarSign, Edit, ChevronRight, FileText } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FadeInView, CountUp } from '@/components/motion';

export function OperationsView() {
  return (
    <div className="space-y-6">
      {/* Header / Title Bar */}
      <FadeInView offset={12}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-text-primary">Operations</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Track your day-to-day operations and key business drivers.
            </p>
          </div>
          <Button variant="primary" size="sm" className="inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer">
            <Plus className="size-3.5" />
            <span>Edit Operations Data</span>
          </Button>
        </div>
      </FadeInView>

      {/* Row 1: 6 Metric Cards */}
      <FadeInView offset={14}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* 1. Employees */}
          <Card className="p-4 space-y-2 flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                <Users className="size-3.5" />
              </div>
              <span className="text-xs font-medium text-text-secondary">Employees</span>
            </div>
            <div>
              <span className="font-mono text-2xl font-bold text-text-primary block">
                <CountUp to={18} duration={0.5} />
              </span>
              <span className="text-[11px] text-text-secondary block">Full-time 14 • Part-time 4</span>
            </div>
            <span className="text-xs font-medium text-tertiary flex items-center gap-0.5">
              ▲ 1 vs last month
            </span>
          </Card>

          {/* 2. Store / Branches */}
          <Card className="p-4 space-y-2 flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded bg-tertiary/15 text-tertiary flex items-center justify-center">
                <Store className="size-3.5" />
              </div>
              <span className="text-xs font-medium text-text-secondary">Store / Branches</span>
            </div>
            <div>
              <span className="font-mono text-2xl font-bold text-text-primary block">2</span>
              <span className="text-[11px] text-text-secondary block">Main Branch + 1 Outlet</span>
            </div>
            <span className="text-xs font-medium text-text-secondary">No change</span>
          </Card>

          {/* 3. Operating Hours */}
          <Card className="p-4 space-y-2 flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded bg-info/15 text-info flex items-center justify-center">
                <Clock className="size-3.5" />
              </div>
              <span className="text-xs font-medium text-text-secondary">Operating Hours</span>
            </div>
            <div>
              <span className="font-mono text-2xl font-bold text-text-primary block">11 hrs</span>
              <span className="text-[11px] text-text-secondary block">9:00 AM – 8:00 PM</span>
            </div>
            <span className="text-xs font-medium text-text-secondary">Mon – Sun</span>
          </Card>

          {/* 4. Avg. Customers / Day */}
          <Card className="p-4 space-y-2 flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded bg-warning/15 text-warning flex items-center justify-center">
                <Users className="size-3.5" />
              </div>
              <span className="text-xs font-medium text-text-secondary">Avg. Customers / Day</span>
            </div>
            <div>
              <span className="font-mono text-2xl font-bold text-text-primary block">
                <CountUp to={420} duration={0.5} />
              </span>
              <span className="text-xs font-medium text-tertiary flex items-center gap-0.5 mt-1">
                ▲ 5.0% vs last month
              </span>
            </div>
            <span className="text-xs text-transparent">Placeholder</span>
          </Card>

          {/* 5. Suppliers */}
          <Card className="p-4 space-y-2 flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded bg-teal-500/15 text-teal-400 flex items-center justify-center">
                <Truck className="size-3.5" />
              </div>
              <span className="text-xs font-medium text-text-secondary">Suppliers</span>
            </div>
            <div>
              <span className="font-mono text-2xl font-bold text-text-primary block">12</span>
              <span className="text-[11px] text-text-secondary block">Active suppliers</span>
            </div>
            <span className="text-xs font-medium text-text-secondary">No change</span>
          </Card>

          {/* 6. Order Frequency */}
          <Card className="p-4 space-y-2 flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded bg-purple-500/15 text-purple-400 flex items-center justify-center">
                <Calendar className="size-3.5" />
              </div>
              <span className="text-xs font-medium text-text-secondary">Order Frequency</span>
            </div>
            <div>
              <span className="font-mono text-2xl font-bold text-text-primary block">2.1 / week</span>
              <span className="text-[11px] text-text-secondary block">Average restock frequency</span>
            </div>
            <span className="text-xs font-medium text-text-secondary">No change</span>
          </Card>
        </div>
      </FadeInView>

      {/* Row 2: 3 Cards */}
      <FadeInView offset={16}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1. Operating Schedule */}
          <Card className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded bg-surface-hover text-text-secondary flex items-center justify-center border border-border">
                  <Clock className="size-3.5" />
                </div>
                <h3 className="font-display text-base font-semibold text-text-primary">Operating Schedule</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border/60 text-text-secondary">
                    <tr>
                      <th className="py-2 font-medium">Day</th>
                      <th className="py-2 font-medium">Open</th>
                      <th className="py-2 font-medium">Close</th>
                      <th className="py-2 font-medium">Total Hours</th>
                      <th className="py-2 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    <tr>
                      <td className="py-2 font-sans font-medium text-text-primary">Monday</td>
                      <td className="py-2 text-text-secondary">9:00 AM</td>
                      <td className="py-2 text-text-secondary">8:00 PM</td>
                      <td className="py-2 text-text-secondary">11 hrs</td>
                      <td className="py-2 text-right"><Badge variant="success" className="text-[10px] px-1.5 py-0">Open</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2 font-sans font-medium text-text-primary">Tuesday</td>
                      <td className="py-2 text-text-secondary">9:00 AM</td>
                      <td className="py-2 text-text-secondary">8:00 PM</td>
                      <td className="py-2 text-text-secondary">11 hrs</td>
                      <td className="py-2 text-right"><Badge variant="success" className="text-[10px] px-1.5 py-0">Open</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2 font-sans font-medium text-text-primary">Wednesday</td>
                      <td className="py-2 text-text-secondary">9:00 AM</td>
                      <td className="py-2 text-text-secondary">8:00 PM</td>
                      <td className="py-2 text-text-secondary">11 hrs</td>
                      <td className="py-2 text-right"><Badge variant="success" className="text-[10px] px-1.5 py-0">Open</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2 font-sans font-medium text-text-primary">Thursday</td>
                      <td className="py-2 text-text-secondary">9:00 AM</td>
                      <td className="py-2 text-text-secondary">8:00 PM</td>
                      <td className="py-2 text-text-secondary">11 hrs</td>
                      <td className="py-2 text-right"><Badge variant="success" className="text-[10px] px-1.5 py-0">Open</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2 font-sans font-medium text-text-primary">Friday</td>
                      <td className="py-2 text-text-secondary">9:00 AM</td>
                      <td className="py-2 text-text-secondary">8:00 PM</td>
                      <td className="py-2 text-text-secondary">11 hrs</td>
                      <td className="py-2 text-right"><Badge variant="success" className="text-[10px] px-1.5 py-0">Open</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2 font-sans font-medium text-text-primary">Saturday</td>
                      <td className="py-2 text-text-secondary">9:00 AM</td>
                      <td className="py-2 text-text-secondary">8:00 PM</td>
                      <td className="py-2 text-text-secondary">11 hrs</td>
                      <td className="py-2 text-right"><Badge variant="success" className="text-[10px] px-1.5 py-0">Open</Badge></td>
                    </tr>
                    <tr>
                      <td className="py-2 font-sans font-medium text-text-primary">Sunday</td>
                      <td className="py-2 text-text-secondary">9:00 AM</td>
                      <td className="py-2 text-text-secondary">9:00 PM</td>
                      <td className="py-2 text-text-secondary">11 hrs</td>
                      <td className="py-2 text-right"><Badge variant="success" className="text-[10px] px-1.5 py-0">Open</Badge></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <Button variant="secondary" size="sm" className="w-fit self-start text-xs border-border bg-surface hover:bg-surface-hover cursor-pointer">
              Edit Schedule
            </Button>
          </Card>

          {/* 2. Monthly Fixed Operating Costs */}
          <Card className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded bg-surface-hover text-text-secondary flex items-center justify-center border border-border">
                  <DollarSign className="size-3.5" />
                </div>
                <h3 className="font-display text-base font-semibold text-text-primary">Monthly Fixed Operating Costs</h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Rent (Main Branch)</span>
                  <span className="font-mono font-medium text-text-primary">฿120,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Rent (Outlet)</span>
                  <span className="font-mono font-medium text-text-primary">฿35,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Utilities</span>
                  <span className="font-mono font-medium text-text-primary">฿18,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Internet & Phone</span>
                  <span className="font-mono font-medium text-text-primary">฿2,500</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Insurance</span>
                  <span className="font-mono font-medium text-text-primary">฿6,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Maintenance</span>
                  <span className="font-mono font-medium text-text-primary">฿5,500</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Software / Subscriptions</span>
                  <span className="font-mono font-medium text-text-primary">฿3,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Other Fixed Costs</span>
                  <span className="font-mono font-medium text-text-primary">฿9,000</span>
                </div>
              </div>

              <div className="border-t border-border/80 pt-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-tertiary">Total Fixed Costs</span>
                <span className="font-mono font-bold text-tertiary text-sm">฿199,000</span>
              </div>
            </div>

            <Button variant="secondary" size="sm" className="w-fit self-start text-xs border-border bg-surface hover:bg-surface-hover cursor-pointer">
              Edit Costs
            </Button>
          </Card>

          {/* 3. Supplier Overview */}
          <Card className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded bg-surface-hover text-text-secondary flex items-center justify-center border border-border">
                    <Truck className="size-3.5" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-text-primary">Supplier Overview</h3>
                </div>
                <Link href="/advisor" className="text-xs text-text-secondary hover:text-text-primary flex items-center gap-1">
                  <span>View all suppliers</span>
                  <ChevronRight className="size-3" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border/60 text-text-secondary">
                    <tr>
                      <th className="py-2 font-medium">Supplier</th>
                      <th className="py-2 font-medium">Category</th>
                      <th className="py-2 font-medium">Lead Time</th>
                      <th className="py-2 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr>
                      <td className="py-2 font-medium text-text-primary">Thai Fresh Foods</td>
                      <td className="py-2 text-text-secondary">Groceries</td>
                      <td className="py-2 text-text-secondary">2 days</td>
                      <td className="py-2 text-right text-tertiary font-medium">• Active</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-text-primary">Global Packaging</td>
                      <td className="py-2 text-text-secondary">Packaging</td>
                      <td className="py-2 text-text-secondary">3 days</td>
                      <td className="py-2 text-right text-tertiary font-medium">• Active</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-text-primary">HomePro Supply</td>
                      <td className="py-2 text-text-secondary">Household</td>
                      <td className="py-2 text-text-secondary">2 days</td>
                      <td className="py-2 text-right text-tertiary font-medium">• Active</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-text-primary">Green Farm Co.</td>
                      <td className="py-2 text-text-secondary">Produce</td>
                      <td className="py-2 text-text-secondary">1 day</td>
                      <td className="py-2 text-right text-tertiary font-medium">• Active</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-text-primary">Best Meat Co.</td>
                      <td className="py-2 text-text-secondary">Meat</td>
                      <td className="py-2 text-text-secondary">2 days</td>
                      <td className="py-2 text-right text-tertiary font-medium">• Active</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <Button variant="secondary" size="sm" className="w-fit self-start text-xs border-border bg-surface hover:bg-surface-hover cursor-pointer">
              Manage Suppliers
            </Button>
          </Card>
        </div>
      </FadeInView>

      {/* Row 3: Staff Breakdown, Department Distribution, Notes */}
      <FadeInView offset={18}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1. Staff Breakdown */}
          <Card className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded bg-tertiary/15 text-tertiary flex items-center justify-center">
                  <Users className="size-3.5" />
                </div>
                <h3 className="font-display text-base font-semibold text-text-primary">Staff Breakdown</h3>
              </div>

              <div className="flex items-center gap-4 py-2">
                {/* SVG Donut Ring with Motion */}
                <div className="relative size-28 shrink-0 flex items-center justify-center">
                  <svg className="size-full transform -rotate-90" viewBox="0 0 100 100">
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
                      stroke="#4FA8FF"
                      strokeWidth="10"
                      strokeDasharray="52.5 238.76"
                      initial={{ strokeDashoffset: 238.76 }}
                      whileInView={{ strokeDashoffset: -160 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 1.0, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      fill="transparent"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#A855F7"
                      strokeWidth="10"
                      strokeDasharray="26.2 238.76"
                      initial={{ strokeDashoffset: 238.76 }}
                      whileInView={{ strokeDashoffset: -212.5 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 1.0, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-mono text-xl font-bold text-text-primary">
                      <CountUp to={18} duration={0.8} />
                    </span>
                    <span className="font-sans text-[10px] text-text-secondary">Employees</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-2 text-xs flex-1">
                  <motion.div
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-tertiary" />
                      <span className="text-text-secondary">Full-time</span>
                    </div>
                    <span className="font-mono font-medium text-text-primary">12 (67%)</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-info" />
                      <span className="text-text-secondary">Part-time</span>
                    </div>
                    <span className="font-mono font-medium text-text-primary">4 (22%)</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-purple-500" />
                      <span className="text-text-secondary">Contract</span>
                    </div>
                    <span className="font-mono font-medium text-text-primary">2 (11%)</span>
                  </motion.div>
                </div>
              </div>
            </div>

            <Button variant="secondary" size="sm" className="w-fit self-end text-xs border-border bg-surface hover:bg-surface-hover inline-flex items-center gap-1.5 cursor-pointer">
              <span>Manage staff</span>
              <ChevronRight className="size-3" />
            </Button>
          </Card>

          {/* 2. Department Distribution */}
          <Card className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded bg-tertiary/15 text-tertiary flex items-center justify-center">
                  <Users className="size-3.5" />
                </div>
                <h3 className="font-display text-base font-semibold text-text-primary">Department Distribution</h3>
              </div>

              <div className="space-y-3 pt-1">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-xs text-text-secondary w-20">Sales</span>
                  <div className="flex-1 h-2.5 bg-surface-hover rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      whileInView={{ width: '44%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full bg-tertiary rounded-full"
                    />
                  </div>
                  <span className="font-mono text-xs font-medium text-text-primary w-14 text-right">8 (44%)</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-xs text-text-secondary w-20">Operations</span>
                  <div className="flex-1 h-2.5 bg-surface-hover rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      whileInView={{ width: '28%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full bg-teal-400 rounded-full"
                    />
                  </div>
                  <span className="font-mono text-xs font-medium text-text-primary w-14 text-right">5 (28%)</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-xs text-text-secondary w-20">Admin</span>
                  <div className="flex-1 h-2.5 bg-surface-hover rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      whileInView={{ width: '17%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full bg-info rounded-full"
                    />
                  </div>
                  <span className="font-mono text-xs font-medium text-text-primary w-14 text-right">3 (17%)</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-xs text-text-secondary w-20">Others</span>
                  <div className="flex-1 h-2.5 bg-surface-hover rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      whileInView={{ width: '11%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full bg-purple-500 rounded-full"
                    />
                  </div>
                  <span className="font-mono text-xs font-medium text-text-primary w-14 text-right">2 (11%)</span>
                </motion.div>
              </div>
            </div>

            <Button variant="secondary" size="sm" className="w-fit self-end text-xs border-border bg-surface hover:bg-surface-hover inline-flex items-center gap-1.5 cursor-pointer">
              <span>View org chart</span>
              <ChevronRight className="size-3" />
            </Button>
          </Card>

          {/* 3. Notes */}
          <Card className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded bg-surface-hover text-text-secondary flex items-center justify-center border border-border">
                  <FileText className="size-3.5" />
                </div>
                <h3 className="font-display text-base font-semibold text-text-primary">Notes</h3>
              </div>

              <div className="rounded-lg bg-surface-hover/80 border border-border/80 p-4 space-y-1 text-xs text-text-secondary leading-relaxed min-h-[110px]">
                <p>We operate two stores in Bang Wa area.</p>
                <p>Weekends are our busiest days.</p>
                <p>Planning to extend closing time on holidays.</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-text-secondary">Last updated: May 18, 2024</span>
              <Button variant="secondary" size="sm" className="text-xs border-border bg-surface hover:bg-surface-hover inline-flex items-center gap-1.5 cursor-pointer">
                <span>Edit notes</span>
                <Edit className="size-3 text-text-secondary" />
              </Button>
            </div>
          </Card>
        </div>
      </FadeInView>
    </div>
  );
}
