'use client';

import { TrendingUp, Tag, ShoppingCart, UserCheck, Box, Calendar, MoreHorizontal, Percent, Wallet, Lightbulb, CheckSquare, AlertTriangle, MessageSquare } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FadeInView } from '@/components/motion';

export function UnitEconomicsView() {
  return (
    <div className="space-y-6">
      {/* Assumption Categories Section Title */}
      <FadeInView offset={12}>
        <h3 className="font-display text-base font-semibold text-text-primary">
          Assumption Categories
        </h3>
      </FadeInView>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── LEFT COLUMN (8 Cols) ─────────────────────────────────── */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Assumption Categories Grid */}
          <FadeInView offset={14}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. Growth & Demand */}
              <Card className="p-4 flex flex-col justify-between space-y-3 hover:border-tertiary/50 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md group cursor-pointer">
                <div className="space-y-2">
                  <div className="size-8 rounded-lg bg-surface-hover text-text-primary border border-border/80 shadow-2xs flex items-center justify-center">
                    <TrendingUp className="size-4" />
                  </div>
                  <h4 className="font-display text-sm font-semibold text-text-primary">Growth & Demand</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Assumptions about revenue growth, customer demand and market conditions.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs">
                  <div className="flex items-center gap-1.5 text-text-secondary font-medium">
                    <span className="size-1.5 rounded-full bg-tertiary" />
                    <span>2 updated</span>
                  </div>
                </div>
              </Card>

              {/* 2. Pricing */}
              <Card className="p-4 flex flex-col justify-between space-y-3 hover:border-tertiary/50 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md group cursor-pointer">
                <div className="space-y-2">
                  <div className="size-8 rounded-lg bg-surface-hover text-text-primary border border-border/80 shadow-2xs flex items-center justify-center">
                    <Tag className="size-4" />
                  </div>
                  <h4 className="font-display text-sm font-semibold text-text-primary">Pricing</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Assumptions about pricing strategy and expected price changes.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs">
                  <div className="flex items-center gap-1.5 text-text-secondary font-medium">
                    <span className="size-1.5 rounded-full bg-tertiary" />
                    <span>1 updated</span>
                  </div>
                </div>
              </Card>

              {/* 3. Costs & Expenses */}
              <Card className="p-4 flex flex-col justify-between space-y-3 hover:border-tertiary/50 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md group cursor-pointer">
                <div className="space-y-2">
                  <div className="size-8 rounded-lg bg-surface-hover text-text-primary border border-border/80 shadow-2xs flex items-center justify-center">
                    <ShoppingCart className="size-4" />
                  </div>
                  <h4 className="font-display text-sm font-semibold text-text-primary">Costs & Expenses</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Assumptions about cost increases and expense behavior.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs">
                  <div className="flex items-center gap-1.5 text-text-secondary font-medium">
                    <span className="size-1.5 rounded-full bg-tertiary" />
                    <span>3 updated</span>
                  </div>
                </div>
              </Card>

              {/* 4. Payroll & People */}
              <Card className="p-4 flex flex-col justify-between space-y-3 hover:border-tertiary/50 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md group cursor-pointer">
                <div className="space-y-2">
                  <div className="size-8 rounded-lg bg-surface-hover text-text-primary border border-border/80 shadow-2xs flex items-center justify-center">
                    <UserCheck className="size-4" />
                  </div>
                  <h4 className="font-display text-sm font-semibold text-text-primary">Payroll & People</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Assumptions about headcount, salary growth and hiring plans.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs">
                  <div className="flex items-center gap-1.5 text-text-secondary font-medium">
                    <span className="size-1.5 rounded-full bg-tertiary" />
                    <span>1 updated</span>
                  </div>
                </div>
              </Card>

              {/* 5. Inventory & Supply */}
              <Card className="p-4 flex flex-col justify-between space-y-3 hover:border-tertiary/50 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md group cursor-pointer">
                <div className="space-y-2">
                  <div className="size-8 rounded-lg bg-surface-hover text-text-primary border border-border/80 shadow-2xs flex items-center justify-center">
                    <Box className="size-4" />
                  </div>
                  <h4 className="font-display text-sm font-semibold text-text-primary">Inventory & Supply</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Assumptions about inventory investment and supplier conditions.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs">
                  <div className="flex items-center gap-1.5 text-text-secondary font-medium">
                    <span className="size-1.5 rounded-full bg-tertiary" />
                    <span>2 updated</span>
                  </div>
                </div>
              </Card>

              {/* 6. Seasonality */}
              <Card className="p-4 flex flex-col justify-between space-y-3 hover:border-tertiary/50 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md group cursor-pointer">
                <div className="space-y-2">
                  <div className="size-8 rounded-lg bg-surface-hover text-text-primary border border-border/80 shadow-2xs flex items-center justify-center">
                    <Calendar className="size-4" />
                  </div>
                  <h4 className="font-display text-sm font-semibold text-text-primary">Seasonality</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Assumptions about seasonal patterns and important periods.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs">
                  <div className="flex items-center gap-1.5 text-text-secondary font-medium">
                    <span className="size-1.5 rounded-full bg-tertiary" />
                    <span>1 updated</span>
                  </div>
                </div>
              </Card>
            </div>
          </FadeInView>

          {/* 2. Key Assumptions Summary Table Card */}
          <FadeInView offset={16}>
            <Card className="p-5 space-y-4">
              <h3 className="font-display text-base font-semibold text-text-primary">
                Key Assumptions Summary
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border/60 text-text-secondary">
                    <tr>
                      <th className="py-2.5 font-medium">Assumption</th>
                      <th className="py-2.5 font-medium text-center">Current Value</th>
                      <th className="py-2.5 font-medium text-center">Change vs Last Month</th>
                      <th className="py-2.5 font-medium text-center">Impact Area</th>
                      <th className="py-2.5 font-medium text-center">Confidence</th>
                      <th className="py-2.5 font-medium text-right">Last Updated</th>
                      <th className="py-2.5 font-medium text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr>
                      <td className="py-3 font-medium text-text-primary flex items-center gap-2">
                        <span className="size-6 rounded-md bg-surface-hover text-text-primary border border-border/80 shadow-2xs flex items-center justify-center shrink-0">
                          <TrendingUp className="size-3.5" />
                        </span>
                        <span>Revenue Growth (Annual)</span>
                      </td>
                      <td className="py-3 text-center font-mono font-semibold text-text-primary">8.0%</td>
                      <td className="py-3 text-center font-mono text-tertiary">↗ 1.0%</td>
                      <td className="py-3 text-center">
                        <span className="inline-flex size-6 items-center justify-center rounded-md bg-surface-hover text-text-primary border border-border/80 shadow-2xs">
                          <TrendingUp className="size-3.5" />
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <Badge variant="success" className="text-[10px] px-2 py-0.5">High</Badge>
                      </td>
                      <td className="py-3 text-right text-text-secondary">May 12, 2024</td>
                      <td className="py-3 text-right">
                        <button type="button" className="text-text-secondary hover:text-text-primary p-1 cursor-pointer">
                          <MoreHorizontal className="size-4" />
                        </button>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-3 font-medium text-text-primary flex items-center gap-2">
                        <span className="size-6 rounded-md bg-surface-hover text-text-primary border border-border/80 shadow-2xs flex items-center justify-center shrink-0">
                          <Tag className="size-3.5" />
                        </span>
                        <span>Average Price Change</span>
                      </td>
                      <td className="py-3 text-center font-mono font-semibold text-text-primary">2.0%</td>
                      <td className="py-3 text-center font-mono text-text-secondary">- 0.0%</td>
                      <td className="py-3 text-center">
                        <span className="inline-flex size-6 items-center justify-center rounded-md bg-surface-hover text-text-primary border border-border/80 shadow-2xs">
                          <Tag className="size-3.5" />
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <Badge variant="warning" className="text-[10px] px-2 py-0.5">Medium</Badge>
                      </td>
                      <td className="py-3 text-right text-text-secondary">May 10, 2024</td>
                      <td className="py-3 text-right">
                        <button type="button" className="text-text-secondary hover:text-text-primary p-1 cursor-pointer">
                          <MoreHorizontal className="size-4" />
                        </button>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-3 font-medium text-text-primary flex items-center gap-2">
                        <span className="size-6 rounded-md bg-surface-hover text-text-primary border border-border/80 shadow-2xs flex items-center justify-center shrink-0">
                          <ShoppingCart className="size-3.5" />
                        </span>
                        <span>Cost of Goods Sold Increase</span>
                      </td>
                      <td className="py-3 text-center font-mono font-semibold text-text-primary">5.0%</td>
                      <td className="py-3 text-center font-mono text-danger">↗ 1.5%</td>
                      <td className="py-3 text-center">
                        <span className="inline-flex size-6 items-center justify-center rounded-md bg-surface-hover text-text-primary border border-border/80 shadow-2xs">
                          <ShoppingCart className="size-3.5" />
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <Badge variant="warning" className="text-[10px] px-2 py-0.5">Medium</Badge>
                      </td>
                      <td className="py-3 text-right text-text-secondary">May 11, 2024</td>
                      <td className="py-3 text-right">
                        <button type="button" className="text-text-secondary hover:text-text-primary p-1 cursor-pointer">
                          <MoreHorizontal className="size-4" />
                        </button>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-3 font-medium text-text-primary flex items-center gap-2">
                        <span className="size-6 rounded-md bg-surface-hover text-text-primary border border-border/80 shadow-2xs flex items-center justify-center shrink-0">
                          <UserCheck className="size-3.5" />
                        </span>
                        <span>Payroll Growth</span>
                      </td>
                      <td className="py-3 text-center font-mono font-semibold text-text-primary">6.0%</td>
                      <td className="py-3 text-center font-mono text-text-secondary">- 0.0%</td>
                      <td className="py-3 text-center">
                        <span className="inline-flex size-6 items-center justify-center rounded-md bg-surface-hover text-text-primary border border-border/80 shadow-2xs">
                          <UserCheck className="size-3.5" />
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <Badge variant="success" className="text-[10px] px-2 py-0.5">High</Badge>
                      </td>
                      <td className="py-3 text-right text-text-secondary">May 8, 2024</td>
                      <td className="py-3 text-right">
                        <button type="button" className="text-text-secondary hover:text-text-primary p-1 cursor-pointer">
                          <MoreHorizontal className="size-4" />
                        </button>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-3 font-medium text-text-primary flex items-center gap-2">
                        <span className="size-6 rounded-md bg-surface-hover text-text-primary border border-border/80 shadow-2xs flex items-center justify-center shrink-0">
                          <Percent className="size-3.5" />
                        </span>
                        <span>Inflation Rate (Expected)</span>
                      </td>
                      <td className="py-3 text-center font-mono font-semibold text-text-primary">2.5%</td>
                      <td className="py-3 text-center font-mono text-danger">↗ 0.5%</td>
                      <td className="py-3 text-center">
                        <span className="inline-flex size-6 items-center justify-center rounded-md bg-surface-hover text-text-primary border border-border/80 shadow-2xs">
                          <Percent className="size-3.5" />
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <Badge variant="warning" className="text-[10px] px-2 py-0.5">Medium</Badge>
                      </td>
                      <td className="py-3 text-right text-text-secondary">May 6, 2024</td>
                      <td className="py-3 text-right">
                        <button type="button" className="text-text-secondary hover:text-text-primary p-1 cursor-pointer">
                          <MoreHorizontal className="size-4" />
                        </button>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-3 font-medium text-text-primary flex items-center gap-2">
                        <span className="size-6 rounded-md bg-surface-hover text-text-primary border border-border/80 shadow-2xs flex items-center justify-center shrink-0">
                          <Box className="size-3.5" />
                        </span>
                        <span>Supplier Cost Increase</span>
                      </td>
                      <td className="py-3 text-center font-mono font-semibold text-text-primary">3.0%</td>
                      <td className="py-3 text-center font-mono text-danger">↗ 0.5%</td>
                      <td className="py-3 text-center">
                        <span className="inline-flex size-6 items-center justify-center rounded-md bg-surface-hover text-text-primary border border-border/80 shadow-2xs">
                          <Box className="size-3.5" />
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <Badge variant="warning" className="text-[10px] px-2 py-0.5">Medium</Badge>
                      </td>
                      <td className="py-3 text-right text-text-secondary">May 9, 2024</td>
                      <td className="py-3 text-right">
                        <button type="button" className="text-text-secondary hover:text-text-primary p-1 cursor-pointer">
                          <MoreHorizontal className="size-4" />
                        </button>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-3 font-medium text-text-primary flex items-center gap-2">
                        <span className="size-6 rounded-md bg-surface-hover text-text-primary border border-border/80 shadow-2xs flex items-center justify-center shrink-0">
                          <Box className="size-3.5" />
                        </span>
                        <span>Inventory Investment Growth</span>
                      </td>
                      <td className="py-3 text-center font-mono font-semibold text-text-primary">5.0%</td>
                      <td className="py-3 text-center font-mono text-tertiary">↘ -1.0%</td>
                      <td className="py-3 text-center">
                        <span className="inline-flex size-6 items-center justify-center rounded-md bg-surface-hover text-text-primary border border-border/80 shadow-2xs">
                          <Box className="size-3.5" />
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <Badge variant="danger" className="text-[10px] px-2 py-0.5">Low</Badge>
                      </td>
                      <td className="py-3 text-right text-text-secondary">May 7, 2024</td>
                      <td className="py-3 text-right">
                        <button type="button" className="text-text-secondary hover:text-text-primary p-1 cursor-pointer">
                          <MoreHorizontal className="size-4" />
                        </button>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-3 font-medium text-text-primary flex items-center gap-2">
                        <span className="size-6 rounded-md bg-surface-hover text-text-primary border border-border/80 shadow-2xs flex items-center justify-center shrink-0">
                          <Wallet className="size-3.5" />
                        </span>
                        <span>Target Cash Runway</span>
                      </td>
                      <td className="py-3 text-center font-mono font-semibold text-text-primary">6.0 months</td>
                      <td className="py-3 text-center font-mono text-text-secondary">- 0.0 months</td>
                      <td className="py-3 text-center">
                        <span className="inline-flex size-6 items-center justify-center rounded-md bg-surface-hover text-text-primary border border-border/80 shadow-2xs">
                          <Wallet className="size-3.5" />
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <Badge variant="success" className="text-[10px] px-2 py-0.5">High</Badge>
                      </td>
                      <td className="py-3 text-right text-text-secondary">May 5, 2024</td>
                      <td className="py-3 text-right">
                        <button type="button" className="text-text-secondary hover:text-text-primary p-1 cursor-pointer">
                          <MoreHorizontal className="size-4" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </FadeInView>

          {/* 3. Bottom Sensitivity Analysis Banner */}
          <FadeInView offset={18}>
            <Card className="p-4 bg-surface-hover/60 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-tertiary/20 text-tertiary flex items-center justify-center shrink-0">
                  <Lightbulb className="size-4" />
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Your assumptions directly affect simulation results. Review them regularly to keep your forecasts accurate.
                </p>
              </div>

              <Button
                asChild
                variant="secondary"
                size="sm"
                className="shrink-0 text-xs border-tertiary/40 text-tertiary hover:bg-tertiary/10 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Link href="/simulations">
                  <TrendingUp className="size-3.5" />
                  <span>Run Sensitivity Analysis</span>
                </Link>
              </Button>
            </Card>
          </FadeInView>
        </div>

        {/* ── RIGHT COLUMN (4 Cols) ────────────────────────────────── */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. Assumptions Overview Card */}
          <FadeInView offset={14}>
            <Card className="p-5 space-y-4">
              <h3 className="font-display text-base font-semibold text-text-primary">
                Assumptions Overview
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-hover/80 border border-border">
                  <div className="size-9 rounded-full bg-tertiary/15 text-tertiary flex items-center justify-center shrink-0">
                    <CheckSquare className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">
                      <span className="font-mono text-base font-bold mr-1">12</span>
                      Total Assumptions
                    </p>
                    <p className="text-[11px] text-text-secondary">across 6 categories</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-hover/80 border border-border">
                  <div className="size-9 rounded-full bg-info/15 text-info flex items-center justify-center shrink-0">
                    <UserCheck className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">
                      <span className="font-mono text-base font-bold mr-1">9</span>
                      Assumptions Confirmed
                    </p>
                    <p className="text-[11px] text-text-secondary">high confidence</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-hover/80 border border-border">
                  <div className="size-9 rounded-full bg-warning/15 text-warning flex items-center justify-center shrink-0">
                    <AlertTriangle className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">
                      <span className="font-mono text-base font-bold mr-1">3</span>
                      Need Review
                    </p>
                    <p className="text-[11px] text-text-secondary">medium or low confidence</p>
                  </div>
                </div>
              </div>
            </Card>
          </FadeInView>

          {/* 2. Impact Summary (vs Last Month) Card */}
          <FadeInView offset={16}>
            <Card className="p-5 space-y-4">
              <h3 className="font-display text-base font-semibold text-text-primary">
                Impact Summary (vs Last Month)
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-border/40">
                  <span className="text-text-secondary">Revenue Impact</span>
                  <span className="font-mono font-bold text-tertiary">+2.1%</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-border/40">
                  <span className="text-text-secondary">Profit Impact</span>
                  <span className="font-mono font-bold text-danger">-1.3%</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-border/40">
                  <span className="text-text-secondary">Cash Runway Impact</span>
                  <span className="font-mono font-bold text-tertiary">+0.4 months</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-text-secondary">Risk Level Impact</span>
                  <span className="font-mono font-bold text-tertiary">Low</span>
                </div>
              </div>
            </Card>
          </FadeInView>

          {/* 3. Notes Card */}
          <FadeInView offset={18}>
            <Card className="p-5 space-y-3">
              <h3 className="font-display text-base font-semibold text-text-primary">
                Notes
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                These assumptions are based on current business conditions and market outlook. Update them when you see changes in your business environment.
              </p>
            </Card>
          </FadeInView>

          {/* 4. Need Help? Card */}
          <FadeInView offset={20}>
            <Card className="p-5 space-y-3 bg-surface-hover/40">
              <h3 className="font-display text-base font-semibold text-text-primary">
                Need Help?
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Ask AI Advisor to review your assumptions or explain any of them.
              </p>
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="w-full text-xs border-tertiary/40 text-tertiary hover:bg-tertiary/10 inline-flex items-center justify-center gap-1.5 cursor-pointer mt-1"
              >
                <Link href="/advisor">
                  <MessageSquare className="size-3.5" />
                  <span>Ask AI Advisor</span>
                </Link>
              </Button>
            </Card>
          </FadeInView>
        </div>
      </div>
    </div>
  );
}
