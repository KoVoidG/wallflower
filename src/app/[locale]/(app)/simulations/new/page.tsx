'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FlaskConical,
  Users,
  DollarSign,
  Wrench,
  Store,
  Clock,
  Banknote,
  ChevronDown,
  Info,
  Play,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppPage } from '@/components/ui/layout';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { FinancialValue } from '@/components/ui/domain-values';
import { FadeIn, Expand } from '@/components/motion';
import { Link } from '@/lib/i18n/navigation';
import {
  runSimulation,
  type ScenarioType,
  type SimulationInput,
} from '@/features/simulations/adapters/simulations.adapter';

export type CustomImpactType =
  | 'recurring_revenue_increase'
  | 'recurring_revenue_decrease'
  | 'recurring_expense_increase'
  | 'recurring_expense_decrease'
  | 'one_time_outflow'
  | 'one_time_inflow'
  | 'payment_delay'
  | 'payment_acceleration';

export interface CustomImpactRow {
  id: string;
  type: CustomImpactType;
  amount: number;
  label: string;
}

const DECISION_TYPES: {
  type: ScenarioType;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { type: 'custom', title: 'Custom Decision', subtitle: 'User-defined levers', icon: FlaskConical },
  { type: 'hire_employees', title: 'Hire Employees', subtitle: 'Headcount & payroll', icon: Users },
  { type: 'change_price', title: 'Change Pricing', subtitle: 'Elasticity & margins', icon: DollarSign },
  { type: 'purchase_equipment', title: 'Purchase Equipment', subtitle: 'Capex & payback', icon: Wrench },
  { type: 'expand_location', title: 'Expand Location', subtitle: 'Branch rent & fitout', icon: Store },
  { type: 'payment_delay', title: 'Payment Delay', subtitle: 'Liquidity strain', icon: Clock },
  { type: 'financing', title: 'SME Debt Financing', subtitle: 'Bank loan principal', icon: Banknote },
];

const IMPACT_TYPE_OPTIONS: { value: CustomImpactType; label: string }[] = [
  { value: 'recurring_revenue_increase', label: 'Recurring Revenue Increase (+THB/mo)' },
  { value: 'recurring_revenue_decrease', label: 'Recurring Revenue Decrease (-THB/mo)' },
  { value: 'recurring_expense_increase', label: 'Recurring Expense Increase (+THB/mo)' },
  { value: 'recurring_expense_decrease', label: 'Recurring Expense Decrease (-THB/mo)' },
  { value: 'one_time_outflow', label: 'One-Time Cash Outflow (-THB)' },
  { value: 'one_time_inflow', label: 'One-Time Cash Inflow (+THB)' },
  { value: 'payment_delay', label: 'Customer Payment Delay (+Days)' },
  { value: 'payment_acceleration', label: 'Customer Payment Acceleration (-Days)' },
];

const PROCESSING_STAGES = [
  'Validating assumptions',
  'Building the projected cash timeline',
  'Comparing against the baseline',
  'Checking financial guardrails',
  'Preparing the decision result',
];

const MAX_CUSTOM_IMPACTS = 6;

export default function NewSimulationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = (searchParams.get('type') as ScenarioType) || 'custom';

  const [selectedType, setSelectedType] = useState<ScenarioType>(initialType);
  const [forecastHorizon, setForecastHorizon] = useState<'6m' | '12m' | '24m'>('12m');
  const [showBaselineDetails, setShowBaselineDetails] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [processingStageIndex, setProcessingStageIndex] = useState(0);
  const [simulationError, setSimulationError] = useState<string | null>(null);
  const [removedNotification, setRemovedNotification] = useState<string | null>(null);

  // Controlled Custom Impact List & Accordion Expand State (Req 2 & 3)
  const [customImpacts, setCustomImpacts] = useState<CustomImpactRow[]>([
    { id: 'imp-1', type: 'recurring_revenue_increase', amount: 20000, label: 'New Revenue Target' },
    { id: 'imp-2', type: 'recurring_expense_increase', amount: 10000, label: 'Operational Overhead' },
    { id: 'imp-3', type: 'one_time_outflow', amount: 0, label: 'Setup Investment' },
  ]);
  const [expandedImpactId, setExpandedImpactId] = useState<string | null>('imp-1');

  // General Form State
  const [formData, setFormData] = useState<Record<string, number | string>>({
    scenarioName: 'Custom Business Change',
    headcount: 2,
    salary: 25000,
    benefits: 15,
    startMonth: 1,
    rampUpMonths: 3,
    currentPrice: 150,
    newPrice: 175,
    elasticity: 1.2,
    cost: 200000,
    usefulLife: 5,
    maintenance: 12000,
    financing: 'cash',
    fitoutCost: 250000,
    newMonthlyRent: 35000,
    newStaffCount: 2,
    expectedMonthlyRevenue: 120000,
    delayDays: 30,
    affectedPercent: 40,
    currentReceivables: 53340,
    loanAmount: 300000,
    interestRate: 7.5,
    tenureMonths: 24,
  });

  const handleScenarioChange = (type: ScenarioType) => {
    setSelectedType(type);
    setSimulationError(null);
  };

  const handleInputChange = (key: string, val: number | string) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  // Custom Impact Row Handlers
  const handleAddImpact = () => {
    if (customImpacts.length >= MAX_CUSTOM_IMPACTS) return;
    const newId = `imp-${Date.now()}`;
    setCustomImpacts((prev) => [
      ...prev,
      { id: newId, type: 'recurring_expense_increase', amount: 5000, label: 'Additional Overhead' },
    ]);
    setExpandedImpactId(newId);
  };

  const handleUpdateImpact = (id: string, key: keyof CustomImpactRow, val: string | number) => {
    setCustomImpacts((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [key]: val } : row))
    );
  };

  const handleRemoveImpact = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = customImpacts.find((r) => r.id === id);
    if (!target) return;
    setCustomImpacts((prev) => prev.filter((row) => row.id !== id));
    if (expandedImpactId === id) {
      setExpandedImpactId(customImpacts.find((r) => r.id !== id)?.id || null);
    }
    if (target.amount > 0) {
      setRemovedNotification(`Removed "${target.label || 'Financial Impact'}".`);
      setTimeout(() => setRemovedNotification(null), 3000);
    }
  };

  // Live Summary Calculations (Req 5)
  const getCustomSummary = () => {
    let oneTimeOutflow = 0;
    let oneTimeInflow = 0;
    let revIncrease = 0;
    let revDecrease = 0;
    let expIncrease = 0;
    let expDecrease = 0;

    customImpacts.forEach((row) => {
      const amt = Number(row.amount) || 0;
      if (row.type === 'one_time_outflow') oneTimeOutflow += amt;
      if (row.type === 'one_time_inflow') oneTimeInflow += amt;
      if (row.type === 'recurring_revenue_increase') revIncrease += amt;
      if (row.type === 'recurring_revenue_decrease') revDecrease += amt;
      if (row.type === 'recurring_expense_increase') expIncrease += amt;
      if (row.type === 'recurring_expense_decrease') expDecrease += amt;
    });

    const netOneTime = oneTimeInflow - oneTimeOutflow;
    const netRevenue = revIncrease - revDecrease;
    const netExpense = expIncrease - expDecrease;
    const netMonthly = netRevenue - netExpense;

    return { netOneTime, netRevenue, netExpense, netMonthly };
  };

  const summary = getCustomSummary();

  // Input Validation
  const getValidationError = (): string | null => {
    if (selectedType === 'custom') {
      if (customImpacts.length === 0) return 'Add at least one financial impact to simulate.';
    }
    if (selectedType === 'hire_employees') {
      if (Number(formData.headcount) < 1) return 'Headcount must be at least 1 person.';
      if (Number(formData.salary) < 1000) return 'Base salary must be specified in THB.';
    }
    if (selectedType === 'change_price') {
      if (Number(formData.newPrice) <= 0) return 'Proposed target price must be greater than 0.';
    }
    if (selectedType === 'purchase_equipment') {
      if (Number(formData.cost) < 1000) return 'Equipment cost must be at least ฿1,000.';
    }
    if (selectedType === 'payment_delay') {
      if (Number(formData.delayDays) < 1) return 'Delay period must be at least 1 day.';
    }
    if (selectedType === 'financing') {
      if (Number(formData.loanAmount) < 10000) return 'Loan principal must be at least ฿10,000.';
    }
    return null;
  };

  const validationError = getValidationError();
  const isFormValid = !validationError;

  // Processing stage timer (Req 7)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimulating) {
      interval = setInterval(() => {
        setProcessingStageIndex((prev) => {
          if (prev < PROCESSING_STAGES.length - 1) return prev + 1;
          return prev;
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleRunSimulation = async () => {
    if (!isFormValid || isSimulating) return;
    setSimulationError(null);
    setProcessingStageIndex(0);
    setIsSimulating(true);

    try {
      const assumptionsPayload = { ...formData };
      if (selectedType === 'custom') {
        assumptionsPayload.monthlyRevenueDelta = summary.netRevenue;
        assumptionsPayload.monthlyExpenseDelta = summary.netExpense;
        assumptionsPayload.oneTimeCashImpact = Math.abs(summary.netOneTime);
      }

      const input: SimulationInput = { scenarioType: selectedType, assumptions: assumptionsPayload };
      const res = await runSimulation(input);
      router.push(`/simulations/${res.id}`);
    } catch (err: unknown) {
      setIsSimulating(false);
      setSimulationError(err instanceof Error ? err.message : 'Simulation could not be completed.');
    }
  };

  // Format interpretation helper
  const getFormattedValueString = (type: CustomImpactType, amt: number) => {
    switch (type) {
      case 'recurring_revenue_increase':
        return `+฿${amt.toLocaleString()}/mo`;
      case 'recurring_revenue_decrease':
        return `-฿${amt.toLocaleString()}/mo`;
      case 'recurring_expense_increase':
        return `+฿${amt.toLocaleString()}/mo`;
      case 'recurring_expense_decrease':
        return `-฿${amt.toLocaleString()}/mo`;
      case 'one_time_outflow':
        return `-฿${amt.toLocaleString()}`;
      case 'one_time_inflow':
        return `+฿${amt.toLocaleString()}`;
      case 'payment_delay':
        return `+${amt} days`;
      case 'payment_acceleration':
        return `-${amt} days`;
    }
  };

  const getImpactTitle = (type: CustomImpactType) => {
    const opt = IMPACT_TYPE_OPTIONS.find((o) => o.value === type);
    return opt ? opt.label.split(' (')[0] : type;
  };

  // Draft Preview Data
  const getDraftPreviewData = () => {
    if (selectedType === 'custom') {
      const netMonthly = summary.netMonthly;
      const netOneTime = summary.netOneTime;
      return {
        primaryImpactLabel: 'Net Monthly Cash Flow Change',
        primaryImpactValue: netMonthly,
        isPositiveImpact: netMonthly >= 0,
        metrics: [
          { label: 'Recurring Revenue Change', baseline: '฿152,400/mo', projected: `฿${(152400 + summary.netRevenue).toLocaleString()}/mo`, change: `${summary.netRevenue >= 0 ? '+' : ''}฿${summary.netRevenue.toLocaleString()}` },
          { label: 'Recurring Expense Change', baseline: '฿164,800/mo', projected: `฿${(164800 + summary.netExpense).toLocaleString()}/mo`, change: `${summary.netExpense >= 0 ? '+' : ''}฿${summary.netExpense.toLocaleString()}` },
          { label: 'One-Time Cash Impact', baseline: '฿0', projected: `${netOneTime >= 0 ? '+' : ''}฿${netOneTime.toLocaleString()}`, change: `${netOneTime.toLocaleString()}` },
        ],
        runwayText: netMonthly >= 0 ? '+0.5 months (2.1 → 2.6 mo)' : '-0.4 months (2.1 → 1.7 mo)',
        lowestCash: Math.max(120000, 245000 + netOneTime + netMonthly * 6),
        bufferStatus: netMonthly >= 0 ? 'SAFE' : 'PRESSURE',
        topContributors: customImpacts.slice(0, 3).map((r) => `${r.label || 'Impact'}: ${getFormattedValueString(r.type, r.amount)}`),
        opportunityText: summary.netRevenue > 0 ? `Adds ฿${summary.netRevenue.toLocaleString()}/mo in new recurring sales capacity.` : 'Custom decision levers configured.',
        downsideText: summary.netExpense > 0 ? `Increases recurring monthly operating expenses by ฿${summary.netExpense.toLocaleString()}/mo.` : 'No additional monthly expense overhead.',
        draftNote: 'Draft estimate: Summarizes all configured custom financial impacts.',
      };
    }

    const headcount = Number(formData.headcount) || 2;
    const salary = Number(formData.salary) || 25000;
    const monthlyPayroll = headcount * salary * 1.15;
    return {
      primaryImpactLabel: 'Monthly Net Commitment',
      primaryImpactValue: monthlyPayroll,
      isPositiveImpact: false,
      metrics: [
        { label: 'Monthly Revenue', baseline: '฿152,400', projected: '฿172,000', change: '+฿19,600/mo' },
        { label: 'Monthly Expenses', baseline: '฿164,800', projected: `฿${Math.round(164800 + monthlyPayroll).toLocaleString()}`, change: `+฿${Math.round(monthlyPayroll).toLocaleString()}/mo` },
      ],
      runwayText: '-0.6 months (2.1 → 1.5 mo)',
      lowestCash: 110000,
      bufferStatus: 'PRESSURE',
      topContributors: [`Base Salary: ฿${salary.toLocaleString()}/mo per person`, `Benefits Overhead: 15%`],
      opportunityText: `Expands service staff by ${headcount} hire(s), increasing revenue capacity after ramp-up.`,
      downsideText: `Increases fixed monthly payroll commitment by ฿${Math.round(monthlyPayroll).toLocaleString()}/mo immediately.`,
      draftNote: 'Draft estimate: Evaluates baseline vs scenario outcomes.',
    };
  };

  const preview = getDraftPreviewData();

  return (
    <AppPage>
      <FadeIn>
        <div className="space-y-6 relative">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Link
                  href="/simulations"
                  className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-brand transition-colors p-1 rounded-md hover:bg-surface-subtle"
                >
                  <ArrowLeft className="size-4" />
                  <span>Back to Simulations</span>
                </Link>
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight">
                Build Scenario
              </h1>
              <p className="text-xs text-text-secondary">
                Configure a business decision and estimate its financial impact before committing.
              </p>
            </div>
          </div>

          {/* Compact Baseline Disclosure */}
          <div className="p-3.5 rounded-xl border border-brand/20 bg-brand-soft/10 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-brand uppercase tracking-wider text-[11px]">
                  Baseline Used:
                </span>
                <span className="text-text-primary font-medium">
                  January 2025 verified snapshot
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowBaselineDetails(!showBaselineDetails)}
                className="text-[11px] font-semibold text-brand hover:text-brand-hover cursor-pointer flex items-center gap-1"
              >
                <span>{showBaselineDetails ? 'Hide Snapshot' : 'View Snapshot'}</span>
                <ChevronDown className={cn('size-3 transition-transform', showBaselineDetails && 'rotate-180')} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-brand/10">
              <div>
                <span className="text-text-muted text-[11px] block">Monthly Revenue</span>
                <FinancialValue value={152400} className="text-xs font-bold text-text-primary" />
              </div>
              <div>
                <span className="text-text-muted text-[11px] block">Monthly Expenses</span>
                <FinancialValue value={164800} className="text-xs font-bold text-text-primary" />
              </div>
              <div>
                <span className="text-text-muted text-[11px] block">Usable Cash Buffer</span>
                <FinancialValue value={245000} className="text-xs font-bold text-brand" />
              </div>
              <div>
                <span className="text-text-muted text-[11px] block">Current Runway</span>
                <span className="text-xs font-bold text-warning">2.1 months</span>
              </div>
            </div>

            <Expand open={showBaselineDetails}>
              <div className="pt-2.5 border-t border-brand/10 text-[11px] text-text-muted space-y-1">
                <p>• Baseline Snapshot Source: Internal Accounting Audit (Jan 2025)</p>
                <p>• Receivables Outstanding: ฿53,340 | Payables Due: ฿65,800</p>
                <p>• Baseline Net Burn Rate: -฿12,400/month</p>
              </div>
            </Expand>
          </div>

          {/* Scenario-Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-primary uppercase tracking-wider block">
              Select Decision Scenario Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {DECISION_TYPES.map((dt) => {
                const isSelected = dt.type === selectedType;
                const Icon = dt.icon;
                return (
                  <button
                    key={dt.type}
                    type="button"
                    disabled={isSimulating}
                    onClick={() => handleScenarioChange(dt.type)}
                    className={cn(
                      'p-2.5 rounded-lg border text-left flex flex-col justify-between gap-1.5 transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-brand/40',
                      isSelected
                        ? 'border-brand bg-brand-soft/20 text-brand font-bold shadow-2xs'
                        : 'border-border bg-surface hover:bg-surface-subtle text-text-primary',
                      isSimulating && 'opacity-60 cursor-not-allowed'
                    )}
                  >
                    <Icon className={cn('size-4', isSelected ? 'text-brand' : 'text-text-muted')} />
                    <span className="text-xs leading-tight block truncate">{dt.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2-Panel Split Workspace (Custom split: ~50% / ~50% on desktop - Req 1) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Left Configuration Column */}
            <div className={cn('space-y-4 min-w-0', selectedType === 'custom' ? 'xl:col-span-6' : 'xl:col-span-5')}>
              <Card className="p-5 space-y-5 shadow-2xs border-border">
                <div className="border-b border-border/60 pb-3">
                  <CardTitle className="text-sm sm:text-base">Scenario Assumptions</CardTitle>
                  <CardDescription className="text-xs">Specify decision parameters for calculation.</CardDescription>
                </div>

                {/* Forecast Horizon */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-primary block">Forecast Horizon Period</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['6m', '12m', '24m'] as const).map((h) => (
                      <button
                        key={h}
                        type="button"
                        disabled={isSimulating}
                        onClick={() => setForecastHorizon(h)}
                        className={cn(
                          'py-1.5 px-3 rounded-lg border text-xs font-medium cursor-pointer transition-colors text-center',
                          forecastHorizon === h ? 'border-brand bg-brand-soft/20 text-brand font-bold' : 'border-border bg-surface-subtle text-text-muted'
                        )}
                      >
                        {h === '6m' ? '6 Months' : h === '12m' ? '12 Months' : '24 Months'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Decision Builder with Accordion Rows & Toolbar (Req 2, 3, 4, 5) */}
                {selectedType === 'custom' ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-text-primary block">Scenario Name</label>
                      <input
                        type="text"
                        disabled={isSimulating}
                        value={String(formData.scenarioName)}
                        onChange={(e) => handleInputChange('scenarioName', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs text-text-primary focus:outline-hidden focus:border-brand"
                      />
                    </div>

                    {/* Single Compact Summary Total Line (Req 5) */}
                    <div className="p-2.5 rounded-lg border border-border/70 bg-surface-subtle/60 text-xs font-medium text-text-secondary flex items-center justify-between">
                      <span className="text-[11px]">Current Total:</span>
                      <span className="font-semibold text-text-primary text-[11px] truncate">
                        {summary.netRevenue >= 0 ? '+' : ''}฿{summary.netRevenue.toLocaleString()} rev · {summary.netExpense >= 0 ? '+' : ''}฿{summary.netExpense.toLocaleString()} exp · <strong className={summary.netMonthly >= 0 ? 'text-emerald-600' : 'text-danger'}>{summary.netMonthly >= 0 ? '+' : ''}฿{summary.netMonthly.toLocaleString()}/mo net</strong>
                      </span>
                    </div>

                    {/* Financial Impact Toolbar (Req 4) */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                            Financial Impacts
                          </span>
                          <span className="text-[11px] text-text-muted font-medium">
                            ({customImpacts.length} of {MAX_CUSTOM_IMPACTS} configured)
                          </span>
                        </div>

                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          disabled={isSimulating || customImpacts.length >= MAX_CUSTOM_IMPACTS}
                          className="text-xs shrink-0"
                          onClick={handleAddImpact}
                        >
                          <Plus className="size-3.5" />
                          <span>Add impact</span>
                        </Button>
                      </div>

                      {customImpacts.length >= MAX_CUSTOM_IMPACTS && (
                        <span className="text-[11px] text-text-muted block italic">
                          Maximum of {MAX_CUSTOM_IMPACTS} impacts configured.
                        </span>
                      )}

                      {removedNotification && (
                        <div className="p-2 rounded-md bg-surface-subtle border border-border text-[11px] text-text-muted flex items-center gap-1.5">
                          <CheckCircle2 className="size-3.5 text-brand" />
                          <span>{removedNotification}</span>
                        </div>
                      )}

                      {/* Compact Expandable Impact Rows List (Req 2 & 3) */}
                      <div className="space-y-2">
                        {customImpacts.map((row, idx) => {
                          const isExpanded = expandedImpactId === row.id;
                          const formattedValue = getFormattedValueString(row.type, row.amount);
                          const typeTitle = getImpactTitle(row.type);

                          return (
                            <div
                              key={row.id}
                              className={cn(
                                'rounded-lg border transition-all text-xs overflow-hidden',
                                isExpanded ? 'border-brand/40 bg-surface shadow-2xs' : 'border-border/80 bg-surface-subtle/40 hover:bg-surface-subtle'
                              )}
                            >
                              {/* Collapsed Impact Row Header */}
                              <div
                                onClick={() => setExpandedImpactId(isExpanded ? null : row.id)}
                                className="p-3 flex items-center justify-between gap-2 cursor-pointer select-none"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <ChevronRight className={cn('size-3.5 text-text-muted transition-transform shrink-0', isExpanded && 'rotate-90')} />
                                  <span className="font-bold text-text-primary text-[11px] truncate">
                                    #{idx + 1} {row.label || typeTitle}
                                  </span>
                                  <span className="text-text-muted text-[11px] hidden sm:inline truncate">
                                    · {typeTitle}
                                  </span>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                  <span className={cn('font-extrabold text-xs tabular-nums', formattedValue.startsWith('+') ? 'text-emerald-600' : formattedValue.startsWith('-') ? 'text-danger' : 'text-brand')}>
                                    {formattedValue}
                                  </span>
                                  <button
                                    type="button"
                                    disabled={isSimulating}
                                    onClick={(e) => handleRemoveImpact(row.id, e)}
                                    className="text-text-muted hover:text-danger p-1 rounded-md transition-colors cursor-pointer"
                                    aria-label="Remove impact"
                                  >
                                    <Trash2 className="size-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Expanded Impact Editor */}
                              <Expand open={isExpanded}>
                                <div className="p-3 border-t border-border/60 bg-surface-subtle/20 space-y-3 pt-3">
                                  <Select
                                    label="Impact Type"
                                    value={row.type}
                                    onChange={(val) => handleUpdateImpact(row.id, 'type', val as CustomImpactType)}
                                    options={IMPACT_TYPE_OPTIONS}
                                  />

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-[11px] font-semibold text-text-primary block mb-1">
                                        Amount / Value
                                      </label>
                                      <input
                                        type="number"
                                        step={1000}
                                        disabled={isSimulating}
                                        value={row.amount}
                                        onChange={(e) => handleUpdateImpact(row.id, 'amount', Number(e.target.value))}
                                        className="w-full px-2.5 py-1.5 border border-border rounded-md bg-surface text-xs text-text-primary focus:outline-hidden focus:border-brand"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[11px] font-semibold text-text-primary block mb-1">
                                        Impact Name / Note <span className="text-text-muted font-normal">(optional)</span>
                                      </label>
                                      <input
                                        type="text"
                                        disabled={isSimulating}
                                        value={row.label}
                                        onChange={(e) => handleUpdateImpact(row.id, 'label', e.target.value)}
                                        placeholder="e.g. Delivery Commission"
                                        className="w-full px-2.5 py-1.5 border border-border rounded-md bg-surface text-xs text-text-primary focus:outline-hidden focus:border-brand"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </Expand>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Preset Scenarios */
                  <div className="space-y-4">
                    {selectedType === 'hire_employees' && (
                      <>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-text-primary block">Number of New Hires</label>
                          <input
                            type="number"
                            min={1}
                            max={20}
                            disabled={isSimulating}
                            value={formData.headcount}
                            onChange={(e) => handleInputChange('headcount', Number(e.target.value))}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs text-text-primary"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-text-primary block">Monthly Base Salary per Person (THB)</label>
                          <input
                            type="number"
                            step={1000}
                            disabled={isSimulating}
                            value={formData.salary}
                            onChange={(e) => handleInputChange('salary', Number(e.target.value))}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs text-text-primary"
                          />
                        </div>
                      </>
                    )}

                    {selectedType === 'change_price' && (
                      <>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-text-primary block">Current Price (THB)</label>
                          <input
                            type="number"
                            disabled={isSimulating}
                            value={formData.currentPrice}
                            onChange={(e) => handleInputChange('currentPrice', Number(e.target.value))}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs text-text-primary"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-text-primary block">Proposed Target Price (THB)</label>
                          <input
                            type="number"
                            disabled={isSimulating}
                            value={formData.newPrice}
                            onChange={(e) => handleInputChange('newPrice', Number(e.target.value))}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs text-text-primary"
                          />
                        </div>
                      </>
                    )}

                    {selectedType === 'purchase_equipment' && (
                      <>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-text-primary block">Equipment Capital Cost (THB)</label>
                          <input
                            type="number"
                            step={5000}
                            disabled={isSimulating}
                            value={formData.cost}
                            onChange={(e) => handleInputChange('cost', Number(e.target.value))}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs text-text-primary"
                          />
                        </div>
                        <Select
                          label="Financing Method"
                          value={String(formData.financing)}
                          onChange={(val) => handleInputChange('financing', val)}
                          options={[
                            { value: 'cash', label: 'Outright Cash Purchase' },
                            { value: 'loan', label: 'SME Bank Loan' },
                            { value: 'lease', label: 'Equipment Lease' },
                          ]}
                        />
                      </>
                    )}

                    {selectedType === 'payment_delay' && (
                      <>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-text-primary block">Average Delay Period (Days)</label>
                          <input
                            type="number"
                            disabled={isSimulating}
                            value={formData.delayDays}
                            onChange={(e) => handleInputChange('delayDays', Number(e.target.value))}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs text-text-primary"
                          />
                        </div>
                      </>
                    )}

                    {selectedType === 'expand_location' && (
                      <>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-text-primary block">Fitout & Deposit (THB)</label>
                          <input
                            type="number"
                            disabled={isSimulating}
                            value={formData.fitoutCost}
                            onChange={(e) => handleInputChange('fitoutCost', Number(e.target.value))}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs text-text-primary"
                          />
                        </div>
                      </>
                    )}

                    {selectedType === 'financing' && (
                      <>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-text-primary block">Loan Principal Amount (THB)</label>
                          <input
                            type="number"
                            disabled={isSimulating}
                            value={formData.loanAmount}
                            onChange={(e) => handleInputChange('loanAmount', Number(e.target.value))}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs text-text-primary"
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Validation Error Banner */}
                {validationError && (
                  <div className="p-3 rounded-lg border border-danger/30 bg-danger-soft/20 text-xs text-danger flex items-center gap-2">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}
              </Card>
            </div>

            {/* Right Draft Impact Preview Column (50% split for Custom, Sticky on Desktop - Req 1) */}
            <div className={cn('space-y-4 min-w-0', selectedType === 'custom' ? 'xl:col-span-6 xl:sticky xl:top-6 self-start' : 'xl:col-span-7')}>
              <Card className="p-5 border-border bg-surface shadow-2xs space-y-5 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="border-b border-border/60 pb-3 space-y-1">
                    <div className="flex items-center gap-2">
                      <FlaskConical className="size-4 text-brand shrink-0" />
                      <CardTitle className="text-base">Draft Impact Preview</CardTitle>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Updates from the current assumptions. The completed simulation will validate guardrails and generate the full decision result.
                    </p>
                  </div>

                  {/* Primary Outcome */}
                  <div className="p-4 rounded-xl border border-border/80 bg-surface-subtle/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                        Primary Scenario Outcome
                      </span>
                      <span className="text-xs font-medium text-text-primary block">
                        {preview.primaryImpactLabel}
                      </span>
                    </div>
                    <FinancialValue
                      value={preview.primaryImpactValue}
                      className={cn(
                        'text-lg font-extrabold block',
                        preview.isPositiveImpact ? 'text-emerald-600' : 'text-danger'
                      )}
                    />
                  </div>

                  {/* Baseline Comparison Table */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                      Baseline vs Projected Comparison
                    </span>
                    <div className="border border-border/80 rounded-lg overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-surface-subtle text-text-muted border-b border-border/80 text-[11px]">
                          <tr>
                            <th className="p-2.5 font-semibold">Financial Metric</th>
                            <th className="p-2.5 font-semibold">Baseline</th>
                            <th className="p-2.5 font-semibold">Projected</th>
                            <th className="p-2.5 font-semibold text-right">Shift</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {preview.metrics.map((m) => (
                            <tr key={m.label} className="hover:bg-surface-subtle/40">
                              <td className="p-2.5 font-medium text-text-primary">{m.label}</td>
                              <td className="p-2.5 text-text-muted">{m.baseline}</td>
                              <td className="p-2.5 font-semibold text-text-primary">{m.projected}</td>
                              <td className="p-2.5 font-bold text-right text-brand">{m.change}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Impact Composition List */}
                  {preview.topContributors && preview.topContributors.length > 0 && (
                    <div className="p-3 rounded-lg border border-border/80 bg-surface-subtle/40 space-y-1 text-xs">
                      <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                        Impact Composition
                      </span>
                      <ul className="space-y-1 text-text-primary">
                        {preview.topContributors.map((c, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-[11px]">
                            <span className="size-1.5 rounded-full bg-brand shrink-0" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Opportunity & Downside */}
                  <div className="p-3.5 rounded-lg border border-border/80 bg-surface space-y-2 text-xs">
                    <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                      Opportunity & Risk Trade-offs
                    </span>
                    <div className="space-y-1.5 text-text-primary">
                      <div className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold mt-0.5">•</span>
                        <span>{preview.opportunityText}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-danger font-bold mt-0.5">•</span>
                        <span>{preview.downsideText}</span>
                      </div>
                    </div>
                  </div>

                  {/* Draft Note */}
                  <div className="p-3 rounded-lg border border-brand/20 bg-brand-soft/10 text-xs text-text-secondary leading-relaxed flex items-start gap-2">
                    <Info className="size-4 text-brand shrink-0 mt-0.5" />
                    <span>{preview.draftNote}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 rounded-xl border border-border/80 bg-surface shadow-2xs flex items-center justify-between gap-3">
            <Button asChild variant="ghost" size="md" className="text-xs" disabled={isSimulating}>
              <Link href="/simulations">
                <span>Cancel</span>
              </Link>
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              className="text-xs font-semibold"
              onClick={handleRunSimulation}
              disabled={!isFormValid || isSimulating}
            >
              {isSimulating ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Computing Simulation...</span>
                </>
              ) : (
                <>
                  <Play className="size-3.5" />
                  <span>Run Simulation</span>
                </>
              )}
            </Button>
          </div>

          {/* Honest Simulation-Processing Panel Overlay (Req 7, 8, 9) */}
          {isSimulating && (
            <div
              aria-live="polite"
              className="absolute inset-0 z-50 bg-background/70 backdrop-blur-2xs flex flex-col items-center justify-center p-6 text-center rounded-xl border border-brand/30"
            >
              <div className="w-full max-w-md bg-surface p-6 rounded-xl border border-brand/30 shadow-lg space-y-4 text-center">
                <div className="p-3 rounded-full bg-brand-soft/20 text-brand inline-flex">
                  <Loader2 className="size-7 animate-spin" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-text-primary">
                    Processing Decision Model
                  </h3>
                  <p className="text-xs text-text-muted">
                    Scenario: <span className="font-semibold text-text-primary capitalize">{selectedType.replace('_', ' ')}</span> ({customImpacts.length} impacts · {forecastHorizon})
                  </p>
                </div>

                {/* All 5 Processing Stages Visible Simultaneously (Req 7) */}
                <div className="space-y-2 text-left pt-2 border-t border-border/60 text-xs">
                  {PROCESSING_STAGES.map((stageText, idx) => {
                    const isDone = idx < processingStageIndex;
                    const isActive = idx === processingStageIndex;
                    return (
                      <div
                        key={stageText}
                        className={cn(
                          'flex items-center gap-2.5 p-2 rounded-lg transition-colors',
                          isActive && 'bg-brand-soft/15 text-brand font-semibold',
                          isDone && 'text-emerald-600 font-medium',
                          !isDone && !isActive && 'text-text-muted'
                        )}
                      >
                        {isDone ? (
                          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                        ) : isActive ? (
                          <Loader2 className="size-4 text-brand animate-spin shrink-0" />
                        ) : (
                          <div className="size-4 rounded-full border border-text-muted/40 shrink-0 flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </div>
                        )}
                        <span className="truncate">{stageText}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Processing Failure Recovery Card */}
          {simulationError && (
            <div className="p-4 rounded-xl border border-danger/30 bg-danger-soft/20 space-y-3 text-xs text-danger">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="size-4" />
                <span>Simulation Could Not Be Completed</span>
              </div>
              <p className="text-text-primary">{simulationError}</p>
              <div className="flex items-center gap-2 pt-1">
                <Button type="button" variant="primary" size="sm" onClick={handleRunSimulation}>
                  <RefreshCw className="size-3.5" />
                  <span>Try Again</span>
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setSimulationError(null)}>
                  <span>Edit Assumptions</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </FadeIn>
    </AppPage>
  );
}
