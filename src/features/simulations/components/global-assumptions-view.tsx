'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import {
  Info,
  RotateCw,
  CheckCircle2,
  Save,
} from 'lucide-react';

const DEFAULT_GLOBAL_ASSUMPTIONS = {
  // Economic Assumptions
  inflationRate: '3.0',
  interestRate: '4.25',
  gdpGrowth: '2.5',
  exchangeRate: '35.0',

  // Business Assumptions
  demandTrend: 'Stable (0%)',
  supplierCostGrowth: '5.0',
  seasonalityPattern: 'Normal',
  taxRate: '7.0',

  // Financial Assumptions
  targetCashRunway: '3',
  minProfitMargin: '10.0',
  inventoryBuffer: '15',
  paymentTerms: '30',
};

export function GlobalAssumptionsView() {
  const [formState, setFormState] = useState(DEFAULT_GLOBAL_ASSUMPTIONS);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);

  const handleChange = (field: keyof typeof DEFAULT_GLOBAL_ASSUMPTIONS, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetToDefault = () => {
    setFormState(DEFAULT_GLOBAL_ASSUMPTIONS);
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    }, 400);
  };

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
    }, 1000);
  };

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto">
      {/* Alert Callout Banner */}
      <div className="p-3.5 rounded-2xl border border-purple-200 dark:border-purple-800/60 bg-purple-50 dark:bg-purple-950/50 text-xs text-[#0F172A] dark:text-white flex items-center gap-3 shadow-2xs">
        <Info className="size-4 text-[#6366F1] dark:text-[#A5B4FC] shrink-0" />
        <p className="leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
          Changing assumptions may affect the results of existing simulations. You may need to re-run simulations to see updated impacts.
        </p>
      </div>

      {/* ── Section A: Economic Assumptions ─────────────────────────────── */}
      <Card className="p-5 space-y-4 border-border-strong bg-surface">
        <h3 className="font-display text-sm font-bold text-text-primary">
          Economic Assumptions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Inflation Rate (%) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary block">
              Inflation Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={formState.inflationRate}
              onChange={(e) => handleChange('inflationRate', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-xl bg-surface text-xs font-mono font-medium text-text-primary focus:outline-hidden focus:border-tertiary"
            />
          </div>

          {/* Interest Rate (%) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary block">
              Interest Rate (%)
            </label>
            <input
              type="number"
              step="0.05"
              value={formState.interestRate}
              onChange={(e) => handleChange('interestRate', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-xl bg-surface text-xs font-mono font-medium text-text-primary focus:outline-hidden focus:border-tertiary"
            />
          </div>

          {/* GDP Growth (%) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary block">
              GDP Growth (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={formState.gdpGrowth}
              onChange={(e) => handleChange('gdpGrowth', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-xl bg-surface text-xs font-mono font-medium text-text-primary focus:outline-hidden focus:border-tertiary"
            />
          </div>

          {/* Exchange Rate (THB/USD) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary block">
              Exchange Rate (THB/USD)
            </label>
            <input
              type="number"
              step="0.5"
              value={formState.exchangeRate}
              onChange={(e) => handleChange('exchangeRate', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-xl bg-surface text-xs font-mono font-medium text-text-primary focus:outline-hidden focus:border-tertiary"
            />
          </div>
        </div>
      </Card>

      {/* ── Section B: Business Assumptions ─────────────────────────────── */}
      <Card className="p-5 space-y-4 border-border-strong bg-surface">
        <h3 className="font-display text-sm font-bold text-text-primary">
          Business Assumptions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Expected Demand Trend */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary block">
              Expected Demand Trend
            </label>
            <Select
              value={formState.demandTrend}
              onChange={(val) => handleChange('demandTrend', val)}
              options={[
                { value: 'Stable (0%)', label: 'Stable (0%)' },
                { value: 'Growing (+5%)', label: 'Growing (+5%)' },
                { value: 'High Growth (+10%)', label: 'High Growth (+10%)' },
                { value: 'Declining (-5%)', label: 'Declining (-5%)' },
              ]}
            />
          </div>

          {/* Supplier Cost Growth (%) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary block">
              Supplier Cost Growth (%)
            </label>
            <input
              type="number"
              step="0.5"
              value={formState.supplierCostGrowth}
              onChange={(e) => handleChange('supplierCostGrowth', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-xl bg-surface text-xs font-mono font-medium text-text-primary focus:outline-hidden focus:border-tertiary"
            />
          </div>

          {/* Seasonality Pattern */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary block">
              Seasonality Pattern
            </label>
            <Select
              value={formState.seasonalityPattern}
              onChange={(val) => handleChange('seasonalityPattern', val)}
              options={[
                { value: 'Normal', label: 'Normal' },
                { value: 'High Q4 Peak', label: 'High Q4 Peak' },
                { value: 'Summer Peak', label: 'Summer Peak' },
                { value: 'Flat', label: 'Flat' },
              ]}
            />
          </div>

          {/* Tax Rate (%) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary block">
              Tax Rate (%)
            </label>
            <input
              type="number"
              step="0.5"
              value={formState.taxRate}
              onChange={(e) => handleChange('taxRate', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-xl bg-surface text-xs font-mono font-medium text-text-primary focus:outline-hidden focus:border-tertiary"
            />
          </div>
        </div>
      </Card>

      {/* ── Section C: Financial Assumptions ────────────────────────────── */}
      <Card className="p-5 space-y-4 border-border-strong bg-surface">
        <h3 className="font-display text-sm font-bold text-text-primary">
          Financial Assumptions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Target Cash Runway (Months) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary block">
              Target Cash Runway (Months)
            </label>
            <input
              type="number"
              step="1"
              value={formState.targetCashRunway}
              onChange={(e) => handleChange('targetCashRunway', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-xl bg-surface text-xs font-mono font-medium text-text-primary focus:outline-hidden focus:border-tertiary"
            />
          </div>

          {/* Minimum Profit Margin (%) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary block">
              Minimum Profit Margin (%)
            </label>
            <input
              type="number"
              step="0.5"
              value={formState.minProfitMargin}
              onChange={(e) => handleChange('minProfitMargin', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-xl bg-surface text-xs font-mono font-medium text-text-primary focus:outline-hidden focus:border-tertiary"
            />
          </div>

          {/* Inventory Buffer (Days) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary block">
              Inventory Buffer (Days)
            </label>
            <input
              type="number"
              step="1"
              value={formState.inventoryBuffer}
              onChange={(e) => handleChange('inventoryBuffer', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-xl bg-surface text-xs font-mono font-medium text-text-primary focus:outline-hidden focus:border-tertiary"
            />
          </div>

          {/* Payment Terms (Days) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary block">
              Payment Terms (Days)
            </label>
            <input
              type="number"
              step="1"
              value={formState.paymentTerms}
              onChange={(e) => handleChange('paymentTerms', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-xl bg-surface text-xs font-mono font-medium text-text-primary focus:outline-hidden focus:border-tertiary"
            />
          </div>
        </div>
      </Card>

      {/* ── Bottom Actions Bar ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="text-xs font-bold gap-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:opacity-95 cursor-pointer shadow-md shadow-indigo-500/25 px-5 flex-1 sm:flex-none rounded-xl"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="size-4" />
                <span>Saved Changes</span>
              </>
            ) : (
              <>
                <Save className="size-4" />
                <span>Save Changes</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleResetToDefault}
            className="text-xs font-semibold text-text-secondary hover:text-text-primary cursor-pointer px-4 flex-1 sm:flex-none border-border-strong"
          >
            Reset to Default
          </Button>
        </div>

        {/* Right Action Button */}
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={handleRecalculate}
          disabled={isRecalculating}
          className="text-xs font-semibold gap-2 text-text-secondary hover:text-text-primary cursor-pointer px-4 w-full sm:w-auto border-border-strong"
        >
          <RotateCw className={cn('size-3.5 text-text-secondary', isRecalculating && 'animate-spin text-tertiary')} />
          <span>Recalculate Existing Simulations</span>
        </Button>
      </div>
    </div>
  );
}
