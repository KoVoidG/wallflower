'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FlaskConical,
  Users,
  DollarSign,
  Wrench,
  Store,
  Clock,
  Banknote,
  ArrowRight,
  ChevronDown,
  Info,
  Play,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppPage, PageHeader } from '@/components/ui/layout';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { Select } from '@/components/ui/select';
import { FinancialValue, QualityBadge } from '@/components/ui/domain-values';
import { FadeIn, Expand } from '@/components/motion';
import {
  runSimulation,
  type ScenarioType,
  type SimulationInput,
} from '@/features/simulations/adapters/simulations.adapter';

export default function NewSimulationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = (searchParams.get('type') as ScenarioType) || 'hire_employees';

  const [selectedType, setSelectedType] = useState<ScenarioType>(initialType);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Record<string, number | string>>({
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

  const handleInputChange = (key: string, val: number | string) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const input: SimulationInput = { scenarioType: selectedType, assumptions: formData };
      const res = await runSimulation(input);
      router.push(`/simulations/${res.id}`);
    } catch {
      setIsSimulating(false);
    }
  };

  return (
    <AppPage>
      <FadeIn>
        <div className="space-y-6">
          {/* Page Header */}
          <PageHeader
            title={
              <div className="flex items-center gap-2.5">
                <FlaskConical className="size-6 text-brand shrink-0" aria-hidden="true" />
                <span>Create Scenario Simulation</span>
              </div>
            }
            description="Model decisions, test affordability, evaluate break-even velocity, and establish guardrails."
            badge={<Badge variant="healthy" dot>Decision Simulator</Badge>}
          />

          {/* Current Baseline Summary Card */}
          <Card className="border-brand/20 bg-brand-soft/15 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="size-4 text-brand" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand">Current Business Baseline</span>
              </div>
              <Badge variant="healthy">Jan 2025 Snapshot</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-text-muted block">Monthly Revenue</span>
                <FinancialValue value={152400} className="text-sm font-bold text-text-primary" />
              </div>
              <div>
                <span className="text-text-muted block">Monthly Expenses</span>
                <FinancialValue value={164800} className="text-sm font-bold text-text-primary" />
              </div>
              <div>
                <span className="text-text-muted block">Usable Cash</span>
                <FinancialValue value={245000} className="text-sm font-bold text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <span className="text-text-muted block">Cash Runway</span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">2.1 months</span>
              </div>
            </div>
          </Card>

          {/* 1. Decision Selector Cards */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block">1. Select Decision Type</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {DECISION_TYPES.map((dt) => {
                const isSelected = dt.type === selectedType;
                const Icon = dt.icon;
                return (
                  <button
                    key={dt.type}
                    type="button"
                    onClick={() => setSelectedType(dt.type)}
                    className={cn(
                      'p-3.5 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer',
                      isSelected
                        ? 'border-brand bg-brand-soft/15 text-brand ring-1 ring-brand shadow-xs'
                        : 'border-border bg-surface hover:bg-surface-subtle/60 text-text-primary'
                    )}
                  >
                    <Icon className={cn('size-5', isSelected ? 'text-brand' : 'text-text-muted')} />
                    <div>
                      <span className="text-xs font-bold block leading-tight">{dt.title}</span>
                      <span className="text-[10px] text-text-muted block mt-0.5 line-clamp-1">{dt.subtitle}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Decision Assumptions Form */}
          <Card className="p-5 sm:p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <CardTitle>Decision Assumptions & Inputs</CardTitle>
                <CardDescription>Specify primary assumptions for this decision scenario.</CardDescription>
              </div>
              <QualityBadge quality="estimated" />
            </div>

            {/* Decision-Specific Form Fields */}
            {selectedType === 'hire_employees' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-primary block">Number of New Hires</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={formData.headcount}
                    onChange={(e) => handleInputChange('headcount', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs text-text-primary focus:outline-none focus:border-brand"
                  />
                  <span className="text-[11px] text-text-muted block">Estimate headcount to add</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-primary block">Monthly Base Salary per Person (THB)</label>
                  <input
                    type="number"
                    step={1000}
                    value={formData.salary}
                    onChange={(e) => handleInputChange('salary', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs text-text-primary focus:outline-none focus:border-brand"
                  />
                  <span className="text-[11px] text-text-muted block">Excludes social security and benefits</span>
                </div>
              </div>
            )}

            {selectedType === 'change_price' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-primary block">Current Baseline Price (THB)</label>
                  <input
                    type="number"
                    value={formData.currentPrice}
                    onChange={(e) => handleInputChange('currentPrice', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs text-text-primary focus:outline-none focus:border-brand"
                  />
                  <QualityBadge quality="actual" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-primary block">Proposed New Price (THB)</label>
                  <input
                    type="number"
                    value={formData.newPrice}
                    onChange={(e) => handleInputChange('newPrice', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs text-text-primary focus:outline-none focus:border-brand"
                  />
                  <span className="text-[11px] text-text-muted block">Proposed target customer price</span>
                </div>
              </div>
            )}

            {selectedType === 'purchase_equipment' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-primary block">Equipment Capital Expense (THB)</label>
                  <input
                    type="number"
                    step={5000}
                    value={formData.cost}
                    onChange={(e) => handleInputChange('cost', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs text-text-primary focus:outline-none focus:border-brand"
                  />
                </div>

                <div className="space-y-1.5">
                  <Select
                    label="Purchase Financing Method"
                    value={String(formData.financing)}
                    onChange={(val) => handleInputChange('financing', val)}
                    options={[
                      { value: 'cash', label: 'Outright Cash Purchase' },
                      { value: 'loan', label: 'SME Bank Loan' },
                      { value: 'lease', label: 'Equipment Lease' },
                    ]}
                  />
                </div>
              </div>
            )}

            {selectedType === 'expand_location' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-primary block">Fitout & Deposit (THB)</label>
                  <input
                    type="number"
                    value={formData.fitoutCost}
                    onChange={(e) => handleInputChange('fitoutCost', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs text-text-primary focus:outline-none focus:border-brand"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-primary block">Branch Monthly Rent (THB)</label>
                  <input
                    type="number"
                    value={formData.newMonthlyRent}
                    onChange={(e) => handleInputChange('newMonthlyRent', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs text-text-primary focus:outline-none focus:border-brand"
                  />
                </div>
              </div>
            )}

            {selectedType === 'payment_delay' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-primary block">Average Delay Period (Days)</label>
                  <input
                    type="number"
                    value={formData.delayDays}
                    onChange={(e) => handleInputChange('delayDays', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs text-text-primary focus:outline-none focus:border-brand"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-primary block">Affected Invoices (%)</label>
                  <input
                    type="range"
                    min={1}
                    max={100}
                    value={formData.affectedPercent}
                    onChange={(e) => handleInputChange('affectedPercent', Number(e.target.value))}
                    className="w-full accent-brand"
                  />
                  <span className="text-xs text-text-muted block text-right font-medium">{formData.affectedPercent}%</span>
                </div>
              </div>
            )}

            {selectedType === 'financing' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-primary block">Loan Principal (THB)</label>
                  <input
                    type="number"
                    value={formData.loanAmount}
                    onChange={(e) => handleInputChange('loanAmount', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs text-text-primary focus:outline-none focus:border-brand"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-primary block">Annual Interest Rate (%)</label>
                  <input
                    type="number"
                    step={0.5}
                    value={formData.interestRate}
                    onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs text-text-primary focus:outline-none focus:border-brand"
                  />
                </div>
              </div>
            )}

            {/* Optional Advanced Assumptions (Hidden by Default) */}
            <div className="pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-hover transition-colors cursor-pointer"
              >
                <span>{showAdvanced ? 'Hide Advanced Assumptions' : 'Show Optional Advanced Assumptions'}</span>
                <ChevronDown className={cn('size-3.5 transition-transform', showAdvanced && 'rotate-180')} />
              </button>

              <Expand open={showAdvanced}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-primary block">Ramp-up Velocity (Months)</label>
                    <input
                      type="number"
                      value={formData.rampUpMonths}
                      onChange={(e) => handleInputChange('rampUpMonths', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs text-text-primary focus:outline-none focus:border-brand"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-primary block">Demand Elasticity Coefficient</label>
                    <input
                      type="number"
                      step={0.1}
                      value={formData.elasticity}
                      onChange={(e) => handleInputChange('elasticity', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs text-text-primary focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>
              </Expand>
            </div>

            {/* Review Step Button */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setIsReviewOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand text-white hover:bg-brand-hover text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                <span>Review Assumptions & Run</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </Card>

          {/* Review Assumptions Modal */}
          <Dialog open={isReviewOpen} onClose={() => setIsReviewOpen(false)} title="Review Simulation Assumptions" size="md">
            <div className="space-y-4">
              <p className="text-xs text-text-secondary leading-relaxed">
                Please review your selected assumptions before running the deterministic decision simulation.
              </p>

              <div className="p-3.5 rounded-lg border border-border bg-surface-subtle space-y-2 text-xs">
                <div className="flex items-center justify-between font-semibold border-b border-border pb-2">
                  <span>Decision Type</span>
                  <span className="text-brand capitalize">{selectedType.replace('_', ' ')}</span>
                </div>
                {Object.entries(formData).slice(0, 4).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between text-text-muted">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="font-semibold text-text-primary">{String(val)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-brand-soft/20 border border-brand/20 text-xs text-brand">
                <Info className="size-4 shrink-0 mt-0.5" />
                <span>Simulation results are deterministic mock estimations based on your business baseline.</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-border hover:bg-surface-subtle cursor-pointer"
                >
                  Edit Assumptions
                </button>
                <button
                  type="button"
                  onClick={handleRunSimulation}
                  disabled={isSimulating}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-brand text-white hover:bg-brand-hover disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  <Play className="size-3.5" />
                  <span>{isSimulating ? 'Computing Scenario...' : 'Run Simulation'}</span>
                </button>
              </div>
            </div>
          </Dialog>
        </div>
      </FadeIn>
    </AppPage>
  );
}

const DECISION_TYPES: { type: ScenarioType; title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { type: 'hire_employees', title: 'Hire Employees', subtitle: 'Headcount & onboarding', icon: Users },
  { type: 'change_price', title: 'Change Pricing', subtitle: 'Elasticity & margins', icon: DollarSign },
  { type: 'purchase_equipment', title: 'Purchase Equipment', subtitle: 'Capex & depreciation', icon: Wrench },
  { type: 'expand_location', title: 'Expand Location', subtitle: 'Branch rent & fitout', icon: Store },
  { type: 'payment_delay', title: 'Payment Delay', subtitle: 'Liquidity strain', icon: Clock },
  { type: 'financing', title: 'SME Debt Financing', subtitle: 'Bank loan principal', icon: Banknote },
];
