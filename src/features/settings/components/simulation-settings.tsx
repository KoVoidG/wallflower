'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Switch } from '@/components/ui/switch';
import { Check } from 'lucide-react';

export function SimulationSettings() {
  const [saved] = useState(false);

  const [demandTrend, setDemandTrend] = useState<'Declining' | 'Stable' | 'Growing'>('Stable');
  const [supplierTrend, setSupplierTrend] = useState<'Falling' | 'Stable' | 'Rising'>('Rising');

  const [inflationRate, setInflationRate] = useState('2.5');
  const [interestRate, setInterestRate] = useState('6.5');
  const [taxRate, setTaxRate] = useState('7');
  const [exchangeRate, setExchangeRate] = useState('35.50');

  const [seasonality, setSeasonality] = useState('Medium');
  const [competition, setCompetition] = useState('Medium');

  const [timeHorizon, setTimeHorizon] = useState('6 Months');
  const [confidenceThreshold, setConfidenceThreshold] = useState('70%');
  const [defaultCurrency, setDefaultCurrency] = useState('THB (฿)');

  const [useEstimatedValues, setUseEstimatedValues] = useState(true);
  const [warnMissingData, setWarnMissingData] = useState(true);
  const [allowPartialSimulations, setAllowPartialSimulations] = useState(true);

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <Check className="size-4 shrink-0" />
          <span>Simulation Settings updated successfully!</span>
        </div>
      )}

      {/* Global Assumptions */}
      <Card className="p-5 border-border-strong bg-surface space-y-5">
        <div className="border-b border-border/60 pb-3">
          <h3 className="font-display text-sm font-bold text-text-primary">Global Assumptions</h3>
          <p className="text-xs text-text-secondary font-medium">Configure global macroeconomic & sensitivity baseline parameters.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">Expected Demand Trend</label>
            <SegmentedControl
              options={['Declining', 'Stable', 'Growing'] as const}
              value={demandTrend}
              onChange={setDemandTrend}
              layoutId="segmented-sim-demand"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">Supplier Cost Trend</label>
            <SegmentedControl
              options={['Falling', 'Stable', 'Rising'] as const}
              value={supplierTrend}
              onChange={setSupplierTrend}
              layoutId="segmented-sim-supplier"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">Inflation Rate (Annual)</label>
            <div className="relative">
              <input
                type="text"
                value={inflationRate}
                onChange={(e) => setInflationRate(e.target.value)}
                className="w-full pl-3 pr-7 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary font-mono font-medium focus:outline-hidden focus:border-tertiary"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">%</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">Interest Rate (Annual)</label>
            <div className="relative">
              <input
                type="text"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full pl-3 pr-7 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary font-mono font-medium focus:outline-hidden focus:border-tertiary"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">%</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">Tax</label>
            <div className="relative">
              <input
                type="text"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-full pl-3 pr-7 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary font-mono font-medium focus:outline-hidden focus:border-tertiary"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">%</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">Exchange Rate (USD / THB)</label>
            <input
              type="text"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary font-mono font-medium focus:outline-hidden focus:border-tertiary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">Seasonality</label>
            <Select
              value={seasonality}
              onChange={setSeasonality}
              options={[
                { value: 'None', label: 'None' },
                { value: 'Low', label: 'Low' },
                { value: 'Medium', label: 'Medium' },
                { value: 'High', label: 'High' },
              ]}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">Market Competition</label>
            <Select
              value={competition}
              onChange={setCompetition}
              options={[
                { value: 'Low', label: 'Low' },
                { value: 'Medium', label: 'Medium' },
                { value: 'High', label: 'High' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Default Scenario Settings */}
      <Card className="p-5 border-border-strong bg-surface space-y-5">
        <div className="border-b border-border/60 pb-3 text-left">
          <h3 className="font-display text-sm font-bold text-text-primary">Default Scenario Settings</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">Default Time Horizon</label>
            <Select
              value={timeHorizon}
              onChange={setTimeHorizon}
              options={[
                { value: '3 Months', label: '3 Months' },
                { value: '6 Months', label: '6 Months' },
                { value: '12 Months', label: '12 Months' },
              ]}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">Default Confidence Threshold</label>
            <Select
              value={confidenceThreshold}
              onChange={setConfidenceThreshold}
              options={[
                { value: '60%', label: '60%' },
                { value: '70%', label: '70%' },
                { value: '80%', label: '80%' },
              ]}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">Default Currency</label>
            <Select
              value={defaultCurrency}
              onChange={setDefaultCurrency}
              options={[
                { value: 'THB (฿)', label: 'THB (฿)' },
                { value: 'USD ($)', label: 'USD ($)' },
                { value: 'EUR (€)', label: 'EUR (€)' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Confidence Settings */}
      <Card className="p-5 border-border-strong bg-surface space-y-4 text-left">
        <div className="border-b border-border/60 pb-3">
          <h3 className="font-display text-sm font-bold text-text-primary">Confidence Settings</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border bg-surface-subtle">
            <div>
              <h4 className="text-xs font-bold text-text-primary">Use Estimated Values</h4>
              <p className="text-[11px] text-text-secondary font-medium">Allow simulations using estimated or partial data.</p>
            </div>
            <Switch checked={useEstimatedValues} onCheckedChange={setUseEstimatedValues} ariaLabel="Toggle Use Estimated Values" />
          </div>

          <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border bg-surface-subtle">
            <div>
              <h4 className="text-xs font-bold text-text-primary">Warn About Missing Data</h4>
              <p className="text-[11px] text-text-secondary font-medium">Show warnings when important data is missing.</p>
            </div>
            <Switch checked={warnMissingData} onCheckedChange={setWarnMissingData} ariaLabel="Toggle Warn About Missing Data" />
          </div>

          <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border bg-surface-subtle">
            <div>
              <h4 className="text-xs font-bold text-text-primary">Allow Partial Simulations</h4>
              <p className="text-[11px] text-text-secondary font-medium">Run simulations even when some data is incomplete.</p>
            </div>
            <Switch checked={allowPartialSimulations} onCheckedChange={setAllowPartialSimulations} ariaLabel="Toggle Allow Partial Simulations" />
          </div>
        </div>
      </Card>
    </div>
  );
}
