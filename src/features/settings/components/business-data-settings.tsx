'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Plus, Trash2, Edit2, Check } from 'lucide-react';

type BusinessDataSubTab = 'financial' | 'inventory' | 'operations' | 'historical';

const SUB_TABS = ['Financial Snapshot', 'Inventory', 'Operations', 'Historical Records'] as const;

export function BusinessDataSettings() {
  const [activeSubTab, setActiveSubTab] = useState<BusinessDataSubTab>('financial');
  const [saved] = useState(false);

  // Financial State
  const [finData, setFinData] = useState({
    monthlyRevenue: '1,200,000',
    operatingExpenses: '820,000',
    payrollExpenses: '180,000',
    rent: '60,000',
    utilities: '15,000',
    marketingExpenses: '20,000',
    otherExpenses: '45,000',
    cashOnHand: '150,000',
    bankBalance: '200,000',
    outstandingLoans: '300,000',
    grossMargin: '28%',
    netMargin: '12%',
    notes: 'Revenue is higher during holidays and school opening season.',
  });

  // Inventory State
  const [invData, setInvData] = useState({
    inventoryValue: '450,000',
    productCategories: 'Beverages, Snacks, Household, Fresh Produce',
    inventoryTurnover: '4.2x / yr',
    restockFrequency: 'Weekly',
    deadStockValue: '25,000',
    supplierLeadTime: '3-5 Days',
    inventoryShortages: 'Sometimes',
  });

  // Historical Records State
  const [historyRecords] = useState([
    { month: 'Jul 2025', revenue: '฿1,250,000', expenses: '฿840,000', profit: '฿410,000', cash: '฿380,000' },
    { month: 'Jun 2025', revenue: '฿1,180,000', expenses: '฿810,000', profit: '฿370,000', cash: '฿350,000' },
    { month: 'May 2025', revenue: '฿1,210,000', expenses: '฿825,000', profit: '฿385,000', cash: '฿360,000' },
  ]);

  return (
    <div className="space-y-6">
      {/* Top Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3 overflow-x-auto">
        {(['financial', 'inventory', 'operations', 'historical'] as const).map((tabKey, idx) => {
          const tabLabel = SUB_TABS[idx];
          const isActive = activeSubTab === tabKey;
          return (
            <button
              key={tabKey}
              type="button"
              onClick={() => setActiveSubTab(tabKey)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer select-none whitespace-nowrap ${
                isActive
                  ? 'bg-tertiary/15 text-tertiary border border-tertiary/30 shadow-2xs'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
              }`}
            >
              {tabLabel}
            </button>
          );
        })}
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <Check className="size-4 shrink-0" />
          <span>Business Data updated successfully!</span>
        </div>
      )}

      {/* ── 1. Financial Snapshot Sub-Tab ───────────────────────────── */}
      {activeSubTab === 'financial' && (
        <Card className="p-5 border-border-strong bg-surface space-y-5">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h3 className="font-display text-sm font-bold text-text-primary">Monthly Financial Overview</h3>
              <p className="text-xs text-text-secondary font-medium">Keep your average baseline revenue, expenses, and liquidity up to date.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-primary block">Average Monthly Revenue</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted">฿</span>
                <input
                  type="text"
                  value={finData.monthlyRevenue}
                  onChange={(e) => setFinData((p) => ({ ...p, monthlyRevenue: e.target.value }))}
                  className="w-full pl-8 pr-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface text-text-primary font-mono font-medium focus:outline-hidden focus:border-tertiary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-primary block">Operating Expenses</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted">฿</span>
                <input
                  type="text"
                  value={finData.operatingExpenses}
                  onChange={(e) => setFinData((p) => ({ ...p, operatingExpenses: e.target.value }))}
                  className="w-full pl-8 pr-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface text-text-primary font-mono font-medium focus:outline-hidden focus:border-tertiary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-primary block">Payroll Expenses</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted">฿</span>
                <input
                  type="text"
                  value={finData.payrollExpenses}
                  onChange={(e) => setFinData((p) => ({ ...p, payrollExpenses: e.target.value }))}
                  className="w-full pl-8 pr-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface text-text-primary font-mono font-medium focus:outline-hidden focus:border-tertiary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-primary block">Rent</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted">฿</span>
                <input
                  type="text"
                  value={finData.rent}
                  onChange={(e) => setFinData((p) => ({ ...p, rent: e.target.value }))}
                  className="w-full pl-8 pr-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface text-text-primary font-mono font-medium focus:outline-hidden focus:border-tertiary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-primary block">Utilities</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted">฿</span>
                <input
                  type="text"
                  value={finData.utilities}
                  onChange={(e) => setFinData((p) => ({ ...p, utilities: e.target.value }))}
                  className="w-full pl-8 pr-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface text-text-primary font-mono font-medium focus:outline-hidden focus:border-tertiary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-primary block">Marketing Expenses</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted">฿</span>
                <input
                  type="text"
                  value={finData.marketingExpenses}
                  onChange={(e) => setFinData((p) => ({ ...p, marketingExpenses: e.target.value }))}
                  className="w-full pl-8 pr-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface text-text-primary font-mono font-medium focus:outline-hidden focus:border-tertiary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-primary block">Cash on Hand</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted">฿</span>
                <input
                  type="text"
                  value={finData.cashOnHand}
                  onChange={(e) => setFinData((p) => ({ ...p, cashOnHand: e.target.value }))}
                  className="w-full pl-8 pr-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface text-text-primary font-mono font-medium focus:outline-hidden focus:border-tertiary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-primary block">Bank Balance</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted">฿</span>
                <input
                  type="text"
                  value={finData.bankBalance}
                  onChange={(e) => setFinData((p) => ({ ...p, bankBalance: e.target.value }))}
                  className="w-full pl-8 pr-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface text-text-primary font-mono font-medium focus:outline-hidden focus:border-tertiary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-primary block">Outstanding Loans</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted">฿</span>
                <input
                  type="text"
                  value={finData.outstandingLoans}
                  onChange={(e) => setFinData((p) => ({ ...p, outstandingLoans: e.target.value }))}
                  className="w-full pl-8 pr-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface text-text-primary font-mono font-medium focus:outline-hidden focus:border-tertiary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-primary block">Gross Margin (Avg.)</label>
              <input
                type="text"
                value={finData.grossMargin}
                onChange={(e) => setFinData((p) => ({ ...p, grossMargin: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface text-text-primary font-mono font-medium focus:outline-hidden focus:border-tertiary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-primary block">Net Margin (Avg.)</label>
              <input
                type="text"
                value={finData.netMargin}
                onChange={(e) => setFinData((p) => ({ ...p, netMargin: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface text-text-primary font-mono font-medium focus:outline-hidden focus:border-tertiary"
              />
            </div>
          </div>

          <div className="space-y-1 text-left pt-2">
            <label className="text-sm font-semibold text-text-primary block">Notes (Optional)</label>
            <textarea
              rows={3}
              value={finData.notes}
              onChange={(e) => setFinData((p) => ({ ...p, notes: e.target.value }))}
              placeholder="Contextual notes about seasonality or one-off expenses..."
              className="w-full p-3.5 text-sm border border-border rounded-xl bg-surface text-text-primary focus:outline-hidden focus:border-tertiary"
            />
          </div>
        </Card>
      )}

      {/* ── 2. Inventory Sub-Tab ────────────────────────────────────────── */}
      {activeSubTab === 'inventory' && (
        <Card className="p-5 border-border-strong bg-surface space-y-5">
          <div className="border-b border-border/60 pb-3">
            <h3 className="font-display text-sm font-bold text-text-primary">Inventory & Valuation Data</h3>
            <p className="text-xs text-text-secondary font-medium">Manage baseline stock valuation, turnover, and shortage risks.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-primary block">Total Inventory Valuation</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted">฿</span>
                <input
                  type="text"
                  value={invData.inventoryValue}
                  onChange={(e) => setInvData((p) => ({ ...p, inventoryValue: e.target.value }))}
                  className="w-full pl-8 pr-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface text-text-primary font-mono font-medium focus:outline-hidden focus:border-tertiary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-primary block">Restock Frequency</label>
              <Select
                value={invData.restockFrequency}
                onChange={(val) => setInvData((p) => ({ ...p, restockFrequency: val }))}
                options={[
                  { value: 'Daily', label: 'Daily' },
                  { value: 'Weekly', label: 'Weekly' },
                  { value: 'Bi-Weekly', label: 'Bi-Weekly' },
                  { value: 'Monthly', label: 'Monthly' },
                ]}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-primary block">Inventory Shortages</label>
              <SegmentedControl
                options={['Never', 'Sometimes', 'Often'] as const}
                value={(invData.inventoryShortages as 'Never' | 'Sometimes' | 'Often') || 'Sometimes'}
                onChange={(val) => setInvData((p) => ({ ...p, inventoryShortages: val }))}
                layoutId="segmented-inv-shortage"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-primary block">Supplier Lead Time</label>
              <input
                type="text"
                value={invData.supplierLeadTime}
                onChange={(e) => setInvData((p) => ({ ...p, supplierLeadTime: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface text-text-primary font-medium focus:outline-hidden focus:border-tertiary"
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-sm font-semibold text-text-primary block">Product Categories</label>
            <input
              type="text"
              value={invData.productCategories}
              onChange={(e) => setInvData((p) => ({ ...p, productCategories: e.target.value }))}
              className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface text-text-primary font-medium focus:outline-hidden focus:border-tertiary"
            />
          </div>
        </Card>
      )}

      {/* ── 3. Operations Sub-Tab ───────────────────────────────────────── */}
      {activeSubTab === 'operations' && (
        <Card className="p-5 border-border-strong bg-surface space-y-5">
          <div className="border-b border-border/60 pb-3">
            <h3 className="font-display text-sm font-bold text-text-primary">Operating Metrics</h3>
            <p className="text-xs text-text-secondary font-medium">Daily transaction volume, headcount, and operating hours.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-primary block">Employees (Headcount)</label>
              <input
                type="number"
                defaultValue={5}
                className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface text-text-primary font-mono font-medium focus:outline-hidden focus:border-tertiary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-primary block">Avg. Customers per Day</label>
              <input
                type="number"
                defaultValue={140}
                className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface text-text-primary font-mono font-medium focus:outline-hidden focus:border-tertiary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-primary block">Avg. Transactions per Day</label>
              <input
                type="number"
                defaultValue={115}
                className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface text-text-primary font-mono font-medium focus:outline-hidden focus:border-tertiary"
              />
            </div>
          </div>
        </Card>
      )}

      {/* ── 4. Historical Records Sub-Tab ───────────────────────────── */}
      {activeSubTab === 'historical' && (
        <Card className="p-5 border-border-strong bg-surface space-y-5">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h3 className="font-display text-sm font-bold text-text-primary">Monthly Historical Records</h3>
              <p className="text-xs text-text-secondary font-medium">Past monthly financial records used to refine baseline trend predictions.</p>
            </div>
            <Button type="button" size="md" className="gap-1.5 text-sm font-semibold bg-tertiary text-on-primary hover:bg-tertiary-hover rounded-xl">
              <Plus className="size-4" />
              <span>Add Month</span>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-subtle text-text-muted border-b border-border/80 text-[11px] font-bold">
                <tr>
                  <th className="p-3">Month</th>
                  <th className="p-3">Revenue</th>
                  <th className="p-3">Expenses</th>
                  <th className="p-3">Net Profit</th>
                  <th className="p-3">Cash Balance</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono">
                {historyRecords.map((rec) => (
                  <tr key={rec.month} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="p-3 font-sans font-bold text-text-primary">{rec.month}</td>
                    <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">{rec.revenue}</td>
                    <td className="p-3 text-text-secondary">{rec.expenses}</td>
                    <td className="p-3 font-bold text-text-primary">{rec.profit}</td>
                    <td className="p-3 text-text-muted">{rec.cash}</td>
                    <td className="p-3 text-right font-sans">
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover">
                          <Edit2 className="size-4" />
                        </button>
                        <button type="button" className="p-1 rounded-md text-text-muted hover:text-danger hover:bg-danger-soft/30">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
