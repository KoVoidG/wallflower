'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Lightbulb, HelpCircle } from 'lucide-react';
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
    <div className="max-w-2xl mx-auto py-4 px-4 space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="space-y-1 text-left">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-text-primary tracking-tight">
            Let&apos;s capture your current financial baseline
          </h2>
        </div>
        <div className="text-xs text-text-secondary font-medium flex items-center gap-1.5 flex-wrap">
          <span>Enter your average monthly figures.</span>

          {/* Interactive Tooltip Component */}
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setShowTooltip((prev) => !prev)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="inline-flex items-center gap-1 text-[#4F46E5] dark:text-[#A5B4FC] font-bold cursor-pointer hover:underline focus:outline-hidden"
            >
              <HelpCircle className="size-3.5" />
              <span>Why we ask this?</span>
            </button>

            {showTooltip && (
              <div className="absolute left-0 sm:left-auto sm:-right-4 top-full mt-2 z-50 w-72 p-3.5 rounded-2xl border border-border bg-surface shadow-xl space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center gap-1.5 text-[#4F46E5] dark:text-[#A5B4FC] font-bold text-xs">
                  <Lightbulb className="size-4 shrink-0" />
                  <span>Why we need this data</span>
                </div>
                <p className="text-xs text-text-secondary font-normal leading-relaxed">
                  These numbers help us calculate your business health, cash runway, and risk exposure.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Fields Grid (2 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
        {/* Average Monthly Revenue */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-text-primary block">
            Average Monthly Revenue
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">
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
              className="w-full pl-8 pr-3.5 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary focus:outline-hidden focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/25 transition-colors font-mono font-medium"
            />
          </div>
        </div>

        {/* Operating Expenses */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-text-primary block">
            Operating Expenses
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">
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
              className="w-full pl-8 pr-3.5 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary focus:outline-hidden focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/25 transition-colors font-mono font-medium"
            />
          </div>
        </div>

        {/* Payroll Expenses */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-text-primary block">
            Payroll Expenses
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">
              ฿
            </span>
            <input
              type="number"
              min="0"
              value={getNum('payrollExpenses')}
              onChange={(e) =>
                updateFinValue('payrollExpenses', parseFloat(e.target.value) || 0)
              }
              placeholder="180,000"
              className="w-full pl-8 pr-3.5 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary focus:outline-hidden focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/25 transition-colors font-mono font-medium"
            />
          </div>
        </div>

        {/* Rent */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-text-primary block">
            Rent
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">
              ฿
            </span>
            <input
              type="number"
              min="0"
              value={getNum('rent')}
              onChange={(e) =>
                updateFinValue('rent', parseFloat(e.target.value) || 0)
              }
              placeholder="60,000"
              className="w-full pl-8 pr-3.5 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary focus:outline-hidden focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/25 transition-colors font-mono font-medium"
            />
          </div>
        </div>

        {/* Utilities */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-text-primary block">
            Utilities
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">
              ฿
            </span>
            <input
              type="number"
              min="0"
              value={getNum('utilities')}
              onChange={(e) =>
                updateFinValue('utilities', parseFloat(e.target.value) || 0)
              }
              placeholder="15,000"
              className="w-full pl-8 pr-3.5 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary focus:outline-hidden focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/25 transition-colors font-mono font-medium"
            />
          </div>
        </div>

        {/* Marketing Expenses */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-text-primary block">
            Marketing Expenses
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">
              ฿
            </span>
            <input
              type="number"
              min="0"
              value={getNum('marketing')}
              onChange={(e) =>
                updateFinValue('marketing', parseFloat(e.target.value) || 0)
              }
              placeholder="20,000"
              className="w-full pl-8 pr-3.5 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary focus:outline-hidden focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/25 transition-colors font-mono font-medium"
            />
          </div>
        </div>

        {/* Cash on Hand */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-text-primary block">
            Cash on Hand
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">
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
              className="w-full pl-8 pr-3.5 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary focus:outline-hidden focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/25 transition-colors font-mono font-medium"
            />
          </div>
        </div>

        {/* Bank Balance */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-text-primary block">
            Bank Balance
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">
              ฿
            </span>
            <input
              type="number"
              min="0"
              value={getNum('bankBalance')}
              onChange={(e) =>
                updateFinValue('bankBalance', parseFloat(e.target.value) || 0)
              }
              placeholder="200,000"
              className="w-full pl-8 pr-3.5 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary focus:outline-hidden focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/25 transition-colors font-mono font-medium"
            />
          </div>
        </div>

        {/* Outstanding Loans */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-bold text-text-primary block">
            Outstanding Loans
          </label>
          <div className="relative max-w-sm">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">
              ฿
            </span>
            <input
              type="number"
              min="0"
              value={getNum('outstandingLoans')}
              onChange={(e) =>
                updateFinValue(
                  'outstandingLoans',
                  parseFloat(e.target.value) || 0
                )
              }
              placeholder="300,000"
              className="w-full pl-8 pr-3.5 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary focus:outline-hidden focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/25 transition-colors font-mono font-medium"
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-border/60">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          className="text-xs font-semibold gap-1.5 cursor-pointer px-4"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back</span>
        </Button>

        <Button
          type="button"
          onClick={onNext}
          className="text-xs font-bold gap-1.5 cursor-pointer bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:opacity-95 shadow-md shadow-indigo-500/25 px-5 border-0"
        >
          <span>Continue</span>
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
