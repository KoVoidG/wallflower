// src/features/simulations/components/scenario-edit-view.tsx
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
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
  DollarSign,
  Briefcase,
  Layers,
  Zap,
} from 'lucide-react';
import { useRouter } from '@/lib/i18n/navigation';
import type { ScenarioItem } from './scenario-library-view';
import { FadeInView } from '@/components/motion';

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
      background: `linear-gradient(to right, #6366F1 0%, #8B5CF6 ${pct}%, var(--slider-track-empty) ${pct}%, var(--slider-track-empty) 100%)`,
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
    <div className="space-y-6">
      {/* ── Top Header Navigation Bar ────────────────────────────────────── */}
      <FadeInView offset={10}>
        <div className="space-y-3 pb-2 border-b border-slate-100 dark:border-[#1E2638]">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleBackToLibrary}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4F46E5] dark:text-[#A5B4FC] hover:underline cursor-pointer transition-all"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Library</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-white dark:bg-[#111622] text-xs font-semibold text-[#0F172A] dark:text-white hover:bg-slate-50 dark:hover:bg-[#1E2638] shadow-xs cursor-pointer transition-colors"
              >
                <Save className="size-3.5 text-[#64748B] dark:text-[#94A3B8]" />
                <span>Save Draft</span>
              </button>

              <button
                type="button"
                className="p-1.5 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-white dark:bg-[#111622] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1E2638] shadow-xs cursor-pointer transition-colors"
                title="More options"
              >
                <MoreHorizontal className="size-4" />
              </button>
            </div>
          </div>

          {/* Title, Badge & Meta info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                  Scenario Library
                </span>
                <span className="text-xs text-[#94A3B8]">&gt;</span>

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
                    className="font-display text-lg sm:text-xl font-bold text-[#0F172A] dark:text-white border-b border-[#6366F1] bg-transparent focus:outline-hidden px-1"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg sm:text-xl font-bold text-[#0F172A] dark:text-white">
                      {scenarioName}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setIsEditingTitle(true)}
                      className="p-1 text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white transition-colors cursor-pointer"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                  </div>
                )}

                {/* Purple "Simulated" or Sky "Draft" Badge */}
                <span
                  className={cn(
                    'px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border inline-flex items-center gap-1.5',
                    isSimulated
                      ? 'bg-purple-50 dark:bg-purple-950/50 text-[#6366F1] dark:text-[#A5B4FC] border-purple-200 dark:border-purple-800/60 shadow-2xs'
                      : 'bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800/60',
                  )}
                >
                  {isSimulated ? (
                    <span className="size-1.5 rounded-full bg-[#8B5CF6] shrink-0" />
                  ) : (
                    <Clock className="size-3 shrink-0" />
                  )}
                  <span>{isSimulated ? 'Simulated' : 'Draft'}</span>
                </span>
              </div>

              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 font-medium">
                Goal: <strong className="text-[#0F172A] dark:text-white">{goal}</strong> • Time
                Horizon:{' '}
                <strong className="text-[#0F172A] dark:text-white font-mono">{timeHorizon}</strong>
              </p>
            </div>
          </div>

          {/* Sub-tabs if scenario is Simulated */}
          {showSubTabs && (
            <div className="flex items-center gap-6 pt-2">
              <button
                type="button"
                onClick={onSwitchToResultsMode}
                className="pb-2 text-sm font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white transition-colors cursor-pointer"
              >
                Results Mode
              </button>

              <button
                type="button"
                className="pb-2 text-sm font-semibold text-[#4F46E5] dark:text-[#A5B4FC] relative cursor-pointer"
              >
                Edit Scenario
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full" />
              </button>
            </div>
          )}
        </div>
      </FadeInView>

      {/* ── Main Workspace 2-Column Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Variable Controls & Action (Lg 7 cols) */}
        <div className="lg:col-span-7 space-y-4 min-w-0">
          {/* 1. Financial Variables Accordion */}
          <FadeInView offset={12}>
            <Card className="p-5 space-y-4 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
              <button
                type="button"
                onClick={() => setIsFinancialOpen(!isFinancialOpen)}
                className="flex items-center justify-between w-full text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white border border-slate-200 dark:border-[#2A344A] flex items-center justify-center">
                    <DollarSign className="size-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-[#0F172A] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] transition-colors">
                      Financial Variables
                    </h3>
                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      Revenue, prices, vendor COGS, payroll, and marketing budget
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    'size-4 text-[#94A3B8] transition-transform',
                    isFinancialOpen && 'rotate-180',
                  )}
                />
              </button>

              <Expand open={isFinancialOpen}>
                <div className="space-y-3.5 pt-2 border-t border-slate-100 dark:border-[#1E2638]">
                  {/* Revenue Change (%) */}
                  <div className="p-3 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#0F172A] dark:text-white">
                          Revenue Change (%)
                        </span>
                        <span title="Expected change in total sales volume & revenue">
                          <Info className="size-3.5 text-[#94A3B8] shrink-0 cursor-help" />
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white dark:bg-[#111622] border border-slate-200 dark:border-[#2A344A] text-emerald-600 dark:text-emerald-400">
                        {revenueChange >= 0 ? `+${revenueChange}%` : `${revenueChange}%`}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="-20"
                        max="30"
                        step="0.5"
                        value={revenueChange}
                        onChange={(e) => setRevenueChange(Number(e.target.value))}
                        className="custom-slider flex-1 h-2 rounded-lg cursor-pointer"
                        style={getSliderTrackStyle(revenueChange, -20, 30)}
                      />
                    </div>
                  </div>

                  {/* Price Change (%) */}
                  <div className="p-3 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#0F172A] dark:text-white">
                          Price Change (%)
                        </span>
                        <span title="Change in average product selling price">
                          <Info className="size-3.5 text-[#94A3B8] shrink-0 cursor-help" />
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white dark:bg-[#111622] border border-slate-200 dark:border-[#2A344A] text-emerald-600 dark:text-emerald-400">
                        {priceChange >= 0 ? `+${priceChange}%` : `${priceChange}%`}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="-15"
                        max="25"
                        step="0.5"
                        value={priceChange}
                        onChange={(e) => setPriceChange(Number(e.target.value))}
                        className="custom-slider flex-1 h-2 rounded-lg cursor-pointer"
                        style={getSliderTrackStyle(priceChange, -15, 25)}
                      />
                    </div>
                  </div>

                  {/* Supplier Cost Change (%) */}
                  <div className="p-3 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#0F172A] dark:text-white">
                          Supplier Cost Change (%)
                        </span>
                        <span title="Change in wholesale vendor cost of goods">
                          <Info className="size-3.5 text-[#94A3B8] shrink-0 cursor-help" />
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white dark:bg-[#111622] border border-slate-200 dark:border-[#2A344A] text-amber-600 dark:text-amber-400">
                        {supplierCostChange >= 0 ? `+${supplierCostChange}%` : `${supplierCostChange}%`}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="-10"
                        max="20"
                        step="0.5"
                        value={supplierCostChange}
                        onChange={(e) =>
                          setSupplierCostChange(Number(e.target.value))
                        }
                        className="custom-slider flex-1 h-2 rounded-lg cursor-pointer"
                        style={getSliderTrackStyle(supplierCostChange, -10, 20)}
                      />
                    </div>
                  </div>

                  {/* Payroll Change (%) */}
                  <div className="p-3 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#0F172A] dark:text-white">
                          Payroll Change (%)
                        </span>
                        <span title="Change in total employee salaries & wages">
                          <Info className="size-3.5 text-[#94A3B8] shrink-0 cursor-help" />
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white dark:bg-[#111622] border border-slate-200 dark:border-[#2A344A] text-[#0F172A] dark:text-white">
                        {payrollChange >= 0 ? `+${payrollChange}%` : `${payrollChange}%`}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="-15"
                        max="30"
                        step="0.5"
                        value={payrollChange}
                        onChange={(e) => setPayrollChange(Number(e.target.value))}
                        className="custom-slider flex-1 h-2 rounded-lg cursor-pointer"
                        style={getSliderTrackStyle(payrollChange, -15, 30)}
                      />
                    </div>
                  </div>

                  {/* Marketing Spend Change (%) */}
                  <div className="p-3 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#0F172A] dark:text-white">
                          Marketing Spend Change (%)
                        </span>
                        <span title="Change in advertising budget">
                          <Info className="size-3.5 text-[#94A3B8] shrink-0 cursor-help" />
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white dark:bg-[#111622] border border-slate-200 dark:border-[#2A344A] text-emerald-600 dark:text-emerald-400">
                        {marketingSpendChange >= 0 ? `+${marketingSpendChange}%` : `${marketingSpendChange}%`}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="-20"
                        max="50"
                        step="1.0"
                        value={marketingSpendChange}
                        onChange={(e) =>
                          setMarketingSpendChange(Number(e.target.value))
                        }
                        className="custom-slider flex-1 h-2 rounded-lg cursor-pointer"
                        style={getSliderTrackStyle(marketingSpendChange, -20, 50)}
                      />
                    </div>
                  </div>

                  {/* Inventory Investment */}
                  <div className="p-3 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0F172A] dark:text-white">
                        Inventory Investment
                      </span>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white dark:bg-[#111622] border border-slate-200 dark:border-[#2A344A] text-[#0F172A] dark:text-white">
                        ฿ {inventoryInvestment.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="200000"
                        step="5000"
                        value={inventoryInvestment}
                        onChange={(e) =>
                          setInventoryInvestment(Number(e.target.value))
                        }
                        className="custom-slider flex-1 h-2 rounded-lg cursor-pointer"
                        style={getSliderTrackStyle(
                          inventoryInvestment,
                          0,
                          200000,
                        )}
                      />
                    </div>
                  </div>
                </div>
              </Expand>
            </Card>
          </FadeInView>

          {/* 2. Operational Variables Accordion */}
          <FadeInView offset={14}>
            <Card className="p-5 space-y-4 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
              <button
                type="button"
                onClick={() => setIsOpsOpen(!isOpsOpen)}
                className="flex items-center justify-between w-full text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white border border-slate-200 dark:border-[#2A344A] flex items-center justify-center">
                    <Briefcase className="size-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-[#0F172A] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] transition-colors">
                      Operational Variables
                    </h3>
                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      Staff shifts, operating days, and fulfillment throughput
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    'size-4 text-[#94A3B8] transition-transform',
                    isOpsOpen && 'rotate-180',
                  )}
                />
              </button>

              <Expand open={isOpsOpen}>
                <div className="pt-3 space-y-3.5 border-t border-slate-100 dark:border-[#1E2638]">
                  {/* Staff Working Hours */}
                  <div className="p-3 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0F172A] dark:text-white">
                        Staff Working Hours
                      </span>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white dark:bg-[#111622] border border-slate-200 dark:border-[#2A344A] text-[#0F172A] dark:text-white">
                        {staffWorkingHours} hrs / day
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="4"
                        max="12"
                        step="1"
                        value={staffWorkingHours}
                        onChange={(e) =>
                          setStaffWorkingHours(Number(e.target.value))
                        }
                        className="custom-slider flex-1 h-2 rounded-lg cursor-pointer"
                        style={getSliderTrackStyle(staffWorkingHours, 4, 12)}
                      />
                    </div>
                  </div>

                  {/* Operating Days */}
                  <div className="p-3 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] space-y-2 relative z-20">
                    <span className="text-xs font-bold text-[#0F172A] dark:text-white block">
                      Operating Schedule
                    </span>
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

                  {/* Fulfillment Capacity */}
                  <div className="p-3 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0F172A] dark:text-white">
                        Fulfillment Capacity (%)
                      </span>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white dark:bg-[#111622] border border-slate-200 dark:border-[#2A344A] text-emerald-600 dark:text-emerald-400">
                        +{fulfillmentCapacity}%
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="-20"
                        max="50"
                        step="5"
                        value={fulfillmentCapacity}
                        onChange={(e) =>
                          setFulfillmentCapacity(Number(e.target.value))
                        }
                        className="custom-slider flex-1 h-2 rounded-lg cursor-pointer"
                        style={getSliderTrackStyle(fulfillmentCapacity, -20, 50)}
                      />
                    </div>
                  </div>
                </div>
              </Expand>
            </Card>
          </FadeInView>

          {/* 3. Scenario Assumptions Accordion */}
          <FadeInView offset={16}>
            <Card className="p-5 space-y-4 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
              <button
                type="button"
                onClick={() => setIsAssumptionsOpen(!isAssumptionsOpen)}
                className="flex items-center justify-between w-full text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-7 rounded-lg bg-slate-100 dark:bg-[#1E2638] text-[#0F172A] dark:text-white border border-slate-200 dark:border-[#2A344A] flex items-center justify-center">
                    <Layers className="size-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-[#0F172A] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC] transition-colors">
                      Scenario Assumptions
                    </h3>
                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      Customer retention impact, competitor response, and rollout timing
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    'size-4 text-[#94A3B8] transition-transform',
                    isAssumptionsOpen && 'rotate-180',
                  )}
                />
              </button>

              <Expand open={isAssumptionsOpen}>
                <div className="pt-3 space-y-3.5 border-t border-slate-100 dark:border-[#1E2638]">
                  {/* Customer Retention Impact */}
                  <div className="p-3 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0F172A] dark:text-white">
                        Retention Impact (%)
                      </span>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white dark:bg-[#111622] border border-slate-200 dark:border-[#2A344A] text-[#0F172A] dark:text-white">
                        {customerRetentionImpact}%
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="-10"
                        max="15"
                        step="1"
                        value={customerRetentionImpact}
                        onChange={(e) =>
                          setCustomerRetentionImpact(Number(e.target.value))
                        }
                        className="custom-slider flex-1 h-2 rounded-lg cursor-pointer"
                        style={getSliderTrackStyle(
                          customerRetentionImpact,
                          -10,
                          15,
                        )}
                      />
                    </div>
                  </div>

                  {/* Competitor Response */}
                  <div className="p-3 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] space-y-2 relative z-20">
                    <span className="text-xs font-bold text-[#0F172A] dark:text-white block">
                      Competitor Price Response
                    </span>
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

                  {/* Implementation Lead Time */}
                  <div className="p-3 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0F172A] dark:text-white">
                        Lead Time (Weeks)
                      </span>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white dark:bg-[#111622] border border-slate-200 dark:border-[#2A344A] text-[#0F172A] dark:text-white">
                        {implementationLeadTime} Wks
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="1"
                        max="8"
                        step="1"
                        value={implementationLeadTime}
                        onChange={(e) =>
                          setImplementationLeadTime(Number(e.target.value))
                        }
                        className="custom-slider flex-1 h-2 rounded-lg cursor-pointer"
                        style={getSliderTrackStyle(implementationLeadTime, 1, 8)}
                      />
                    </div>
                  </div>
                </div>
              </Expand>
            </Card>
          </FadeInView>

          {/* Primary Action CTA: Run Simulation */}
          <FadeInView offset={18}>
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="w-full h-12 inline-flex items-center justify-center gap-2 text-sm font-bold rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-lg shadow-indigo-500/25 hover:opacity-95 hover:scale-[1.01] active:scale-98 transition-all cursor-pointer disabled:opacity-75"
              >
                {isSimulating ? (
                  <>
                    <div className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Calculating Deterministic Simulation...</span>
                  </>
                ) : (
                  <>
                    <Zap className="size-4" />
                    <span>Run Simulation</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] text-center font-medium">
                This execution will consume 1 simulation credit.
              </p>
            </div>
          </FadeInView>
        </div>

        {/* Right Column: Decision Impact Preview Panel (Lg 5 cols) */}
        <div className="lg:col-span-5 space-y-4 min-w-0 lg:sticky lg:top-20 self-start">
          <FadeInView offset={14}>
            <Card className="p-6 space-y-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-100 dark:border-[#1E2638] shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1E2638] pb-3.5">
                <h3 className="font-display text-sm font-bold text-[#0F172A] dark:text-white">
                  Decision Impact (Preview)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950/50 text-[#6366F1] dark:text-[#A5B4FC] border border-purple-200 dark:border-purple-800/60">
                  Real-time
                </span>
              </div>

              <div className="space-y-5">
                {/* Hero Graphic State */}
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#F8FAFC] dark:bg-[#0B0F17] border border-slate-200/80 dark:border-[#1E2638] space-y-3">
                  <div className="relative size-16 flex items-center justify-center">
                    <svg
                      className="w-16 h-12 overflow-visible"
                      viewBox="0 0 64 48"
                    >
                      <path
                        d="M4,40 L16,30 L28,34 L40,16 L52,22 L60,8"
                        fill="none"
                        stroke="#8B5CF6"
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
                        fill="#00D395"
                        opacity="0.6"
                      />
                      <rect
                        x="24"
                        y="36"
                        width="6"
                        height="8"
                        rx="2"
                        fill="#00D395"
                        opacity="0.8"
                      />
                      <rect
                        x="36"
                        y="20"
                        width="6"
                        height="24"
                        rx="2"
                        fill="#00D395"
                      />
                      <rect
                        x="48"
                        y="26"
                        width="6"
                        height="18"
                        rx="2"
                        fill="#00D395"
                        opacity="0.9"
                      />
                    </svg>
                    <Sparkles className="absolute -top-1 right-0 size-4 text-[#8B5CF6] animate-pulse" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-display text-sm font-bold text-[#0F172A] dark:text-white">
                      Simulation Ready
                    </h4>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-xs leading-relaxed">
                      Adjust your variables and assumptions, then run a simulation
                      to generate the full financial projection.
                    </p>
                  </div>
                </div>

                {/* Pending Changes Card */}
                <div className="p-4 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17] space-y-2.5">
                  <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">
                    Configured Variable Adjustments
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">
                    {revenueChange !== 0 && (
                      <li className="flex items-center gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>
                          Revenue{' '}
                          <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
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
                          <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
                            +{priceChange}%
                          </strong>
                        </span>
                      </li>
                    )}
                    {supplierCostChange !== 0 && (
                      <li className="flex items-center gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>
                          Supplier Cost{' '}
                          <strong className="text-amber-600 dark:text-amber-400 font-mono">
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
                          <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
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
                          <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
                            ฿{inventoryInvestment.toLocaleString()}
                          </strong>
                        </span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Bottom Credits Indicator */}
                <div className="pt-2 border-t border-slate-100 dark:border-[#1E2638] flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8]">
                  <span>Simulation Credits</span>
                  <span className="font-mono font-bold text-[#0F172A] dark:text-white">
                    4 / 10 remaining
                  </span>
                </div>
              </div>
            </Card>
          </FadeInView>
        </div>
      </div>
    </div>
  );
}
