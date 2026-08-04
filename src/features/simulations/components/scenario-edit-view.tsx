'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Expand } from '@/components/motion/expand';
import {
  Pencil,
  Info,
  ChevronDown,
  Save,
  MoreHorizontal,
  Clock,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { useRouter } from '@/lib/i18n/navigation';
import type { ScenarioItem } from './scenario-library-view';

interface ScenarioEditViewProps {
  scenario?: ScenarioItem | null;
  onBackToLibrary?: () => void;
  onRunSimulationSuccess?: () => void;
  onSwitchToResultsMode?: () => void;
  showSubTabs?: boolean;
}

export function ScenarioEditView({
  scenario,
  onBackToLibrary,
  onRunSimulationSuccess,
  onSwitchToResultsMode,
  showSubTabs = false,
}: ScenarioEditViewProps) {
  const [scenarioName, setScenarioName] = useState<string>(
    scenario?.name || 'Price Increase +5%',
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const goal = scenario?.goal || 'Increase profit margin';
  const timeHorizon = '6 Months';
  const isSimulated = scenario?.status === 'Simulated';

  // 1. Financial Variables State
  const [isFinancialOpen, setIsFinancialOpen] = useState(true);
  const [revenueChange, setRevenueChange] = useState<number>(5.0);
  const [priceChange, setPriceChange] = useState<number>(5.0);
  const [supplierCostChange, setSupplierCostChange] = useState<number>(2.0);
  const [payrollChange, setPayrollChange] = useState<number>(0.0);
  const [marketingSpendChange, setMarketingSpendChange] = useState<number>(3.0);
  const [inventoryInvestment, setInventoryInvestment] = useState<number>(50000);

  // 2. Operational Variables State
  const [isOpsOpen, setIsOpsOpen] = useState(false);
  const [staffWorkingHours, setStaffWorkingHours] = useState<number>(8);
  const [operatingDays, setOperatingDays] = useState<string>('6 Days / Week');
  const [fulfillmentCapacity, setFulfillmentCapacity] = useState<number>(10);

  // 3. Scenario Assumptions State
  const [isAssumptionsOpen, setIsAssumptionsOpen] = useState(false);
  const [customerRetentionImpact, setCustomerRetentionImpact] =
    useState<number>(0);
  const [competitorResponse, setCompetitorResponse] =
    useState<string>('No Reaction');
  const [implementationLeadTime, setImplementationLeadTime] =
    useState<number>(2);

  // Simulation loading state
  const [isSimulating, setIsSimulating] = useState(false);

  const getSliderTrackStyle = (val: number, min: number, max: number) => {
    const pct = Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
    return {
      background: `linear-gradient(to right, var(--brand) 0%, var(--brand) ${pct}%, var(--border-strong) ${pct}%, var(--border-strong) 100%)`,
    };
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      onRunSimulationSuccess?.();
    }, 900);
  };

  const router = useRouter();

  const handleBackToLibrary = () => {
    if (onBackToLibrary) {
      onBackToLibrary();
    } else {
      router.push('/simulations?tab=library');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ── Top Header Navigation Bar ────────────────────────────────────── */}
      <div className="space-y-3 border-b border-border/60 pb-4">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBackToLibrary}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-tertiary hover:underline cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Library</span>
          </button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs font-semibold gap-1.5 cursor-pointer border-border-strong"
            >
              <Save className="size-3.5 text-text-secondary" />
              <span>Save Draft</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs font-semibold cursor-pointer border-border-strong px-2"
              title="More options"
            >
              <MoreHorizontal className="size-3.5 text-text-secondary" />
            </Button>
          </div>
        </div>

        {/* Title, Badge & Meta info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-semibold text-text-muted">
                Scenario Library
              </span>
              <span className="text-xs text-text-muted">&gt;</span>

              {isEditingTitle ? (
                <input
                  type="text"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && setIsEditingTitle(false)
                  }
                  autoFocus
                  className="font-display text-lg font-bold text-text-primary border-b border-tertiary bg-transparent focus:outline-hidden px-1"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-lg font-bold text-text-primary">
                    {scenarioName}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsEditingTitle(true)}
                    className="p-1 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                </div>
              )}

              {/* Status Badge */}
              <span
                className={cn(
                  'px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wide inline-flex items-center gap-1',
                  isSimulated
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    : 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
                )}
              >
                {!isSimulated && <Clock className="size-3" />}
                <span>{isSimulated ? 'Simulated' : 'Draft'}</span>
              </span>
            </div>

            <p className="text-xs text-text-secondary mt-1 font-medium">
              Goal: <strong className="text-text-primary">{goal}</strong> • Time
              Horizon:{' '}
              <strong className="text-text-primary">{timeHorizon}</strong>
            </p>
          </div>
        </div>

        {/* Sub-tabs if scenario is Simulated */}
        {showSubTabs && (
          <div className="flex items-center gap-6 pt-2">
            <button
              type="button"
              onClick={onSwitchToResultsMode}
              className="pb-2 text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            >
              Results Mode
            </button>

            <button
              type="button"
              className="pb-2 text-sm font-semibold text-tertiary relative cursor-pointer"
            >
              Edit Scenario
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-tertiary rounded-full" />
            </button>
          </div>
        )}
      </div>

      {/* ── Main Workspace 2-Column Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Variable Controls & Action (Lg 7 cols) */}
        <div className="lg:col-span-7 space-y-4 min-w-0">
          {/* 1. Financial Variables Accordion (Expandable, Default Open) */}
          <Card className="p-5 space-y-4 border-border-strong bg-surface">
            <button
              type="button"
              onClick={() => setIsFinancialOpen(!isFinancialOpen)}
              className="flex items-center justify-between w-full text-left cursor-pointer"
            >
              <h3 className="font-display text-sm font-bold text-text-primary">
                Financial Variables
              </h3>
              <ChevronDown
                className={cn(
                  'size-4 text-text-muted transition-transform',
                  isFinancialOpen && 'rotate-180',
                )}
              />
            </button>

            <Expand open={isFinancialOpen}>
              <div className="space-y-4 pt-1">
                {/* Revenue Change (%) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-border/60 bg-surface-subtle/30">
                  <div className="flex items-center gap-2 min-w-0 sm:w-2/5">
                    <span className="text-xs font-bold text-text-primary truncate">
                      Revenue Change (%)
                    </span>
                    <span title="Expected change in total sales volume & revenue">
                      <Info className="size-3.5 text-text-muted shrink-0 cursor-help" />
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="range"
                      min="-20"
                      max="30"
                      step="0.5"
                      value={revenueChange}
                      onChange={(e) => setRevenueChange(Number(e.target.value))}
                      className="custom-slider flex-1"
                      style={getSliderTrackStyle(revenueChange, -20, 30)}
                    />
                    <div className="w-20 px-2.5 py-1.5 rounded-lg border border-border bg-surface text-center font-mono text-xs font-bold text-text-primary">
                      +{revenueChange}%
                    </div>
                  </div>
                </div>

                {/* Price Change (%) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-border/60 bg-surface-subtle/30">
                  <div className="flex items-center gap-2 min-w-0 sm:w-2/5">
                    <span className="text-xs font-bold text-text-primary truncate">
                      Price Change (%)
                    </span>
                    <span title="Change in average product selling price">
                      <Info className="size-3.5 text-text-muted shrink-0 cursor-help" />
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="range"
                      min="-15"
                      max="25"
                      step="0.5"
                      value={priceChange}
                      onChange={(e) => setPriceChange(Number(e.target.value))}
                      className="custom-slider flex-1"
                      style={getSliderTrackStyle(priceChange, -15, 25)}
                    />
                    <div className="w-20 px-2.5 py-1.5 rounded-lg border border-border bg-surface text-center font-mono text-xs font-bold text-text-primary">
                      +{priceChange}%
                    </div>
                  </div>
                </div>

                {/* Supplier Cost Change (%) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-border/60 bg-surface-subtle/30">
                  <div className="flex items-center gap-2 min-w-0 sm:w-2/5">
                    <span className="text-xs font-bold text-text-primary truncate">
                      Supplier Cost Change (%)
                    </span>
                    <span title="Change in wholesale vendor cost of goods">
                      <Info className="size-3.5 text-text-muted shrink-0 cursor-help" />
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="range"
                      min="-10"
                      max="20"
                      step="0.5"
                      value={supplierCostChange}
                      onChange={(e) =>
                        setSupplierCostChange(Number(e.target.value))
                      }
                      className="custom-slider flex-1"
                      style={getSliderTrackStyle(supplierCostChange, -10, 20)}
                    />
                    <div className="w-20 px-2.5 py-1.5 rounded-lg border border-border bg-surface text-center font-mono text-xs font-bold text-text-primary">
                      +{supplierCostChange}%
                    </div>
                  </div>
                </div>

                {/* Payroll Change (%) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-border/60 bg-surface-subtle/30">
                  <div className="flex items-center gap-2 min-w-0 sm:w-2/5">
                    <span className="text-xs font-bold text-text-primary truncate">
                      Payroll Change (%)
                    </span>
                    <span title="Change in total employee salaries & wages">
                      <Info className="size-3.5 text-text-muted shrink-0 cursor-help" />
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="range"
                      min="-15"
                      max="30"
                      step="0.5"
                      value={payrollChange}
                      onChange={(e) => setPayrollChange(Number(e.target.value))}
                      className="custom-slider flex-1"
                      style={getSliderTrackStyle(payrollChange, -15, 30)}
                    />
                    <div className="w-20 px-2.5 py-1.5 rounded-lg border border-border bg-surface text-center font-mono text-xs font-bold text-text-primary">
                      {payrollChange}%
                    </div>
                  </div>
                </div>

                {/* Marketing Spend Change (%) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-border/60 bg-surface-subtle/30">
                  <div className="flex items-center gap-2 min-w-0 sm:w-2/5">
                    <span className="text-xs font-bold text-text-primary truncate">
                      Marketing Spend Change (%)
                    </span>
                    <span title="Change in advertising budget">
                      <Info className="size-3.5 text-text-muted shrink-0 cursor-help" />
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="range"
                      min="-20"
                      max="50"
                      step="1.0"
                      value={marketingSpendChange}
                      onChange={(e) =>
                        setMarketingSpendChange(Number(e.target.value))
                      }
                      className="custom-slider flex-1"
                      style={getSliderTrackStyle(marketingSpendChange, -20, 50)}
                    />
                    <div className="w-20 px-2.5 py-1.5 rounded-lg border border-border bg-surface text-center font-mono text-xs font-bold text-text-primary">
                      +{marketingSpendChange}%
                    </div>
                  </div>
                </div>

                {/* Inventory Investment */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-border/60 bg-surface-subtle/30">
                  <div className="flex items-center gap-2 min-w-0 sm:w-2/5">
                    <span className="text-xs font-bold text-text-primary truncate">
                      Inventory Investment
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="5000"
                      value={inventoryInvestment}
                      onChange={(e) =>
                        setInventoryInvestment(Number(e.target.value))
                      }
                      className="custom-slider flex-1"
                      style={getSliderTrackStyle(
                        inventoryInvestment,
                        0,
                        200000,
                      )}
                    />
                    <div className="w-24 px-2.5 py-1.5 rounded-lg border border-border bg-surface text-center font-mono text-xs font-bold text-text-primary">
                      ฿ {inventoryInvestment.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </Expand>
          </Card>

          {/* 2. Operational Variables Accordion */}
          <Card className="p-4 border-border-strong bg-surface">
            <button
              type="button"
              onClick={() => setIsOpsOpen(!isOpsOpen)}
              className="flex items-center justify-between w-full text-left cursor-pointer"
            >
              <h3 className="font-display text-sm font-bold text-text-primary">
                Operational Variables
              </h3>
              <ChevronDown
                className={cn(
                  'size-4 text-text-muted transition-transform',
                  isOpsOpen && 'rotate-180',
                )}
              />
            </button>

            <Expand open={isOpsOpen}>
              <div className="pt-4 space-y-3.5 border-t border-border/60 mt-3 text-xs">
                {/* Staff Working Hours */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-border/60 bg-surface-subtle/30">
                  <div className="flex items-center gap-2 min-w-0 sm:w-2/5">
                    <span className="text-xs font-bold text-text-primary truncate">
                      Staff Working Hours
                    </span>
                    <span title="Average staff shift length">
                      <Info className="size-3.5 text-text-muted shrink-0 cursor-help" />
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="range"
                      min="4"
                      max="12"
                      step="1"
                      value={staffWorkingHours}
                      onChange={(e) =>
                        setStaffWorkingHours(Number(e.target.value))
                      }
                      className="custom-slider flex-1"
                      style={getSliderTrackStyle(staffWorkingHours, 4, 12)}
                    />
                    <div className="w-24 px-2.5 py-1 rounded-lg border border-border bg-surface text-center font-mono text-xs font-bold text-text-primary">
                      {staffWorkingHours} hrs / day
                    </div>
                  </div>
                </div>

                {/* Operating Days */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-border/60 bg-surface-subtle/30">
                  <span className="text-xs font-bold text-text-primary min-w-0 sm:w-2/5 truncate">
                    Operating Schedule
                  </span>
                  <div className="flex-1">
                    <Select
                      value={operatingDays}
                      onChange={setOperatingDays}
                      options={[
                        { value: '5 Days / Week', label: '5 Days / Week' },
                        {
                          value: '6 Days / Week',
                          label: '6 Days / Week (Default)',
                        },
                        { value: '7 Days / Week', label: '7 Days / Week' },
                      ]}
                    />
                  </div>
                </div>

                {/* Fulfillment Capacity */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-border/60 bg-surface-subtle/30">
                  <div className="flex items-center gap-2 min-w-0 sm:w-2/5">
                    <span className="text-xs font-bold text-text-primary truncate">
                      Fulfillment Capacity (%)
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="range"
                      min="-20"
                      max="50"
                      step="5"
                      value={fulfillmentCapacity}
                      onChange={(e) =>
                        setFulfillmentCapacity(Number(e.target.value))
                      }
                      className="custom-slider flex-1"
                      style={getSliderTrackStyle(fulfillmentCapacity, -20, 50)}
                    />
                    <div className="w-20 px-2.5 py-1 rounded-lg border border-border bg-surface text-center font-mono text-xs font-bold text-text-primary">
                      +{fulfillmentCapacity}%
                    </div>
                  </div>
                </div>
              </div>
            </Expand>
          </Card>

          {/* 3. Scenario Assumptions Accordion */}
          <Card className="p-4 border-border-strong bg-surface">
            <button
              type="button"
              onClick={() => setIsAssumptionsOpen(!isAssumptionsOpen)}
              className="flex items-center justify-between w-full text-left cursor-pointer"
            >
              <h3 className="font-display text-sm font-bold text-text-primary">
                Scenario Assumptions
              </h3>
              <ChevronDown
                className={cn(
                  'size-4 text-text-muted transition-transform',
                  isAssumptionsOpen && 'rotate-180',
                )}
              />
            </button>

            <Expand open={isAssumptionsOpen}>
              <div className="pt-4 space-y-3.5 border-t border-border/60 mt-3 text-xs">
                {/* Customer Retention Impact */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-border/60 bg-surface-subtle/30">
                  <span className="text-xs font-bold text-text-primary min-w-0 sm:w-2/5 truncate">
                    Retention Impact (%)
                  </span>
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="range"
                      min="-10"
                      max="15"
                      step="1"
                      value={customerRetentionImpact}
                      onChange={(e) =>
                        setCustomerRetentionImpact(Number(e.target.value))
                      }
                      className="custom-slider flex-1"
                      style={getSliderTrackStyle(
                        customerRetentionImpact,
                        -10,
                        15,
                      )}
                    />
                    <div className="w-20 px-2.5 py-1 rounded-lg border border-border bg-surface text-center font-mono text-xs font-bold text-text-primary">
                      {customerRetentionImpact}%
                    </div>
                  </div>
                </div>

                {/* Competitor Response */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-border/60 bg-surface-subtle/30">
                  <span className="text-xs font-bold text-text-primary min-w-0 sm:w-2/5 truncate">
                    Competitor Price Response
                  </span>
                  <div className="flex-1">
                    <Select
                      value={competitorResponse}
                      onChange={setCompetitorResponse}
                      options={[
                        { value: 'No Reaction', label: 'No Reaction' },
                        { value: 'Price Match', label: 'Price Match (-3%)' },
                        {
                          value: 'Aggressive Discount',
                          label: 'Aggressive Discount (-8%)',
                        },
                      ]}
                    />
                  </div>
                </div>

                {/* Implementation Lead Time */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-border/60 bg-surface-subtle/30">
                  <span className="text-xs font-bold text-text-primary min-w-0 sm:w-2/5 truncate">
                    Lead Time (Weeks)
                  </span>
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="range"
                      min="1"
                      max="8"
                      step="1"
                      value={implementationLeadTime}
                      onChange={(e) =>
                        setImplementationLeadTime(Number(e.target.value))
                      }
                      className="custom-slider flex-1"
                      style={getSliderTrackStyle(implementationLeadTime, 1, 8)}
                    />
                    <div className="w-24 px-2.5 py-1 rounded-lg border border-border bg-surface text-center font-mono text-xs font-bold text-text-primary">
                      {implementationLeadTime} Wks
                    </div>
                  </div>
                </div>
              </div>
            </Expand>
          </Card>

          {/* Primary Action CTA: Run Simulation */}
          <div className="space-y-2 pt-2">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full h-12 text-sm font-bold gap-2 cursor-pointer bg-tertiary text-on-primary hover:bg-tertiary-hover shadow-md rounded-xl"
            >
              {isSimulating ? (
                <>
                  <div className="size-4 rounded-full border-2 border-on-primary border-t-transparent animate-spin" />
                  <span>Calculating Deterministic Simulation...</span>
                </>
              ) : (
                <span>Run Simulation</span>
              )}
            </Button>
            <p className="text-[11px] text-text-muted text-center">
              This will consume 1 simulation credit.
            </p>
          </div>
        </div>

        {/* Right Column: Decision Impact Preview Panel (Lg 5 cols) */}
        <div className="lg:col-span-5 space-y-4 min-w-0 lg:sticky lg:top-20 self-start">
          <Card className="p-5 space-y-5 border-border-strong bg-surface">
            <h3 className="font-display text-sm font-bold text-text-primary border-b border-border/60 pb-3">
              Decision Impact (Preview)
            </h3>

            <div className="space-y-5">
              {/* Hero Graphic State */}
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-surface-subtle/50 border border-border/60 space-y-3">
                <div className="relative size-16 flex items-center justify-center">
                  <svg
                    className="w-16 h-12 overflow-visible"
                    viewBox="0 0 64 48"
                  >
                    <path
                      d="M4,40 L16,30 L28,34 L40,16 L52,22 L60,8"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="12"
                      y="32"
                      width="6"
                      height="12"
                      rx="2"
                      fill="#00A36C"
                      opacity="0.6"
                    />
                    <rect
                      x="24"
                      y="36"
                      width="6"
                      height="8"
                      rx="2"
                      fill="#00A36C"
                      opacity="0.8"
                    />
                    <rect
                      x="36"
                      y="20"
                      width="6"
                      height="24"
                      rx="2"
                      fill="#00A36C"
                    />
                    <rect
                      x="48"
                      y="26"
                      width="6"
                      height="18"
                      rx="2"
                      fill="#00A36C"
                      opacity="0.9"
                    />
                  </svg>
                  <Sparkles className="absolute -top-1 right-0 size-4 text-emerald-500 animate-pulse" />
                </div>

                <div className="space-y-1">
                  <h4 className="font-display text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    Simulation Ready
                  </h4>
                  <p className="text-xs text-text-secondary max-w-xs leading-relaxed">
                    Adjust your variables and assumptions, then run a simulation
                    to see the potential impact.
                  </p>
                </div>
              </div>

              {/* Pending Changes Card */}
              <div className="p-4 rounded-xl border border-border/60 bg-surface-subtle/40 space-y-2.5">
                <h4 className="text-xs font-bold text-text-primary">
                  Pending Changes
                </h4>
                <ul className="space-y-1.5 text-xs text-text-secondary font-medium">
                  {revenueChange !== 0 && (
                    <li className="flex items-center gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>
                        Revenue{' '}
                        <strong className="text-emerald-600 dark:text-emerald-400">
                          +{revenueChange}%
                        </strong>
                      </span>
                    </li>
                  )}
                  {priceChange !== 0 && (
                    <li className="flex items-center gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>
                        Price{' '}
                        <strong className="text-emerald-600 dark:text-emerald-400">
                          +{priceChange}%
                        </strong>
                      </span>
                    </li>
                  )}
                  {supplierCostChange !== 0 && (
                    <li className="flex items-center gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>
                        Supplier Cost{' '}
                        <strong className="text-emerald-600 dark:text-emerald-400">
                          +{supplierCostChange}%
                        </strong>
                      </span>
                    </li>
                  )}
                  {marketingSpendChange !== 0 && (
                    <li className="flex items-center gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>
                        Marketing Spend{' '}
                        <strong className="text-emerald-600 dark:text-emerald-400">
                          +{marketingSpendChange}%
                        </strong>
                      </span>
                    </li>
                  )}
                  {inventoryInvestment > 0 && (
                    <li className="flex items-center gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>
                        Inventory Investment{' '}
                        <strong className="text-emerald-600 dark:text-emerald-400">
                          ฿{inventoryInvestment.toLocaleString()}
                        </strong>
                      </span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Bottom Credits Indicator */}
              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-text-muted">
                <span>Simulation Credits</span>
                <span className="font-mono font-bold text-text-primary">
                  4 / 10 remaining
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
