// src/features/business-profile/components/step-financial-baseline.tsx
'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, DollarSign, Lightbulb, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { OnboardingData } from '../schemas';
import { createBusinessValue } from '../schemas';

interface StepFinancialBaselineProps {
  data: OnboardingData;
  onChange: (updated: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function StepFinancialBaseline({
  data,
  onChange,
  onNext,
  onPrev,
}: StepFinancialBaselineProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const fin = data.financials;

  const updateFinValue = (key: keyof typeof fin, numVal: number) => {
    onChange({
      financials: {
        ...fin,
        [key]: createBusinessValue(numVal, 'actual', 'manual'),
      },
    });
  };

  const getNum = (valKey: keyof typeof fin): string => {
    const valObj = fin[valKey];
    if (!valObj || typeof valObj !== 'object' || !('value' in valObj))
      return '';
    return valObj.value !== null && valObj.value !== undefined
      ? String(valObj.value)
      : '';
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
      {/* ── Fixed White Box Card (Zero Scroll Canvas) ──────────────────── */}
      <div className="w-full rounded-3xl border border-slate-200/90 dark:border-[#1E2638] bg-white dark:bg-[#111622] shadow-2xl shadow-slate-900/5 dark:shadow-black/60 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 overflow-hidden">
        {/* Header */}
        <div className="space-y-1 text-center sm:text-left border-b border-slate-100 dark:border-[#1E2638] pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
                <DollarSign className="size-4" />
              </div>
              <div>
                <h2 className="font-display text-lg sm:text-xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                  Financial Baseline Calibration
                </h2>
                <div className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium flex items-center gap-1.5 flex-wrap">
                  <span>Enter your average monthly figures.</span>
                  {/* Tooltip trigger */}
                  <button
                    type="button"
                    onClick={() => setShowTooltip((prev) => !prev)}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="inline-flex items-center gap-1 text-slate-900 dark:text-white font-bold cursor-pointer hover:underline"
                  >
                    <HelpCircle className="size-3" />
                    <span>Why we ask this?</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {showTooltip && (
            <div className="mt-2 p-3 rounded-xl border border-slate-200 dark:border-[#2A344A] bg-slate-50 dark:bg-[#182032] flex items-center gap-2 text-xs text-[#64748B] dark:text-[#94A3B8] animate-in fade-in-50">
              <Lightbulb className="size-4 text-amber-500 shrink-0" />
              <span>These figures calibrate your health score, cash runway stress test, and simulations.</span>
            </div>
          )}
        </div>

        {/* Form Fields Grid (2 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {/* Average Monthly Revenue */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0F172A] dark:text-white block">
              Average Monthly Revenue
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#64748B] dark:text-[#94A3B8]">
                ฿
              </span>
              <input
                type="number"
                min="0"
                value={getNum('monthlyRevenue')}
                onChange={(e) =>
                  updateFinValue('monthlyRevenue', parseFloat(e.target.value) || 0)
                }
                placeholder="1,200,000"
                className="w-full pl-8 pr-3.5 py-2 text-xs border border-slate-200 dark:border-[#1E2638] rounded-xl bg-white dark:bg-[#0B0F17] text-[#0F172A] dark:text-white focus:outline-hidden focus:border-slate-900 dark:focus:border-white focus:ring-1 focus:ring-slate-900/10 transition-colors"
              />
            </div>
          </div>

          {/* Average Operating Expenses (OPEX) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0F172A] dark:text-white block">
              Monthly Operating Expenses (OPEX)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#64748B] dark:text-[#94A3B8]">
                ฿
              </span>
              <input
                type="number"
                min="0"
                value={getNum('operatingExpenses')}
                onChange={(e) =>
                  updateFinValue('operatingExpenses', parseFloat(e.target.value) || 0)
                }
                placeholder="820,000"
                className="w-full pl-8 pr-3.5 py-2 text-xs border border-slate-200 dark:border-[#1E2638] rounded-xl bg-white dark:bg-[#0B0F17] text-[#0F172A] dark:text-white focus:outline-hidden focus:border-slate-900 dark:focus:border-white focus:ring-1 focus:ring-slate-900/10 transition-colors"
              />
            </div>
          </div>

          {/* Payroll Expenses */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0F172A] dark:text-white block">
              Monthly Payroll Expenses
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#64748B] dark:text-[#94A3B8]">
                ฿
              </span>
              <input
                type="number"
                min="0"
                value={getNum('payrollExpenses')}
                onChange={(e) =>
                  updateFinValue('payrollExpenses', parseFloat(e.target.value) || 0)
                }
                placeholder="250,000"
                className="w-full pl-8 pr-3.5 py-2 text-xs border border-slate-200 dark:border-[#1E2638] rounded-xl bg-white dark:bg-[#0B0F17] text-[#0F172A] dark:text-white focus:outline-hidden focus:border-slate-900 dark:focus:border-white focus:ring-1 focus:ring-slate-900/10 transition-colors"
              />
            </div>
          </div>

          {/* Total Liquid Cash on Hand */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0F172A] dark:text-white block">
              Total Cash on Hand
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#64748B] dark:text-[#94A3B8]">
                ฿
              </span>
              <input
                type="number"
                min="0"
                value={getNum('cashOnHand')}
                onChange={(e) =>
                  updateFinValue('cashOnHand', parseFloat(e.target.value) || 0)
                }
                placeholder="150,000"
                className="w-full pl-8 pr-3.5 py-2 text-xs border border-slate-200 dark:border-[#1E2638] rounded-xl bg-white dark:bg-[#0B0F17] text-[#0F172A] dark:text-white focus:outline-hidden focus:border-slate-900 dark:focus:border-white focus:ring-1 focus:ring-slate-900/10 transition-colors"
              />
            </div>
          </div>

          {/* Total Outstanding Debt */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0F172A] dark:text-white block">
              Total Outstanding Debt
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#64748B] dark:text-[#94A3B8]">
                ฿
              </span>
              <input
                type="number"
                min="0"
                value={getNum('totalDebt')}
                onChange={(e) =>
                  updateFinValue('totalDebt', parseFloat(e.target.value) || 0)
                }
                placeholder="0"
                className="w-full pl-8 pr-3.5 py-2 text-xs border border-slate-200 dark:border-[#1E2638] rounded-xl bg-white dark:bg-[#0B0F17] text-[#0F172A] dark:text-white focus:outline-hidden focus:border-slate-900 dark:focus:border-white focus:ring-1 focus:ring-slate-900/10 transition-colors"
              />
            </div>
          </div>

          {/* Monthly Loan / Debt Payment */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0F172A] dark:text-white block">
              Monthly Debt Payment
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#64748B] dark:text-[#94A3B8]">
                ฿
              </span>
              <input
                type="number"
                min="0"
                value={getNum('monthlyDebtRepayment')}
                onChange={(e) =>
                  updateFinValue('monthlyDebtRepayment', parseFloat(e.target.value) || 0)
                }
                placeholder="0"
                className="w-full pl-8 pr-3.5 py-2 text-xs border border-slate-200 dark:border-[#1E2638] rounded-xl bg-white dark:bg-[#0B0F17] text-[#0F172A] dark:text-white focus:outline-hidden focus:border-slate-900 dark:focus:border-white focus:ring-1 focus:ring-slate-900/10 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Bottom Navigation Inside Card */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-[#1E2638]">
          <Button
            type="button"
            variant="outline"
            onClick={onPrev}
            className="text-xs font-semibold gap-1.5 cursor-pointer px-4 border-slate-200 dark:border-[#1E2638]"
          >
            <ArrowLeft className="size-3.5" />
            <span>Go back</span>
          </Button>

          <Button
            type="button"
            onClick={onNext}
            className="text-xs font-bold gap-1.5 cursor-pointer bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:opacity-95 shadow-md shadow-indigo-500/25 px-6 py-2 rounded-xl transition-all border-0"
          >
            <span>Continue</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
