// src/features/business-profile/components/step-business-operations.tsx
'use client';

import { ArrowLeft, ArrowRight, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import type { OnboardingData } from '../schemas';

interface StepBusinessOperationsProps {
  data: OnboardingData;
  onChange: (updated: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function StepBusinessOperations({
  data,
  onChange,
  onNext,
  onPrev,
}: StepBusinessOperationsProps) {
  const ops = data.operations || {
    employees: 6,
    openingHours: '8:00 AM - 8:00 PM',
    operatingDays: '6 days',
    transactionsPerDay: 120,
    customersPerDay: 80,
    suppliersCount: 5,
    businessNotes: '',
  };

  const updateOps = (fields: Partial<typeof ops>) => {
    onChange({
      operations: {
        ...ops,
        ...fields,
      },
    });
  };

  const hoursOptions = [
    { value: '8:00 AM - 8:00 PM', label: '8:00 AM - 8:00 PM' },
    { value: '7:00 AM - 9:00 PM', label: '7:00 AM - 9:00 PM' },
    { value: '9:00 AM - 6:00 PM', label: '9:00 AM - 6:00 PM' },
    { value: '10:00 AM - 10:00 PM', label: '10:00 AM - 10:00 PM' },
    { value: '24 Hours (24/7)', label: '24 Hours (24/7)' },
  ];

  const daysOptions = [
    { value: '5 days', label: '5 days / week' },
    { value: '6 days', label: '6 days / week' },
    { value: '7 days', label: '7 days / week' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
      {/* ── Fixed White Box Card (Zero Scroll Canvas) ──────────────────── */}
      <div className="w-full rounded-3xl border border-slate-200/90 dark:border-[#1E2638] bg-white dark:bg-[#111622] shadow-2xl shadow-slate-900/5 dark:shadow-black/60 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6">
        {/* Header */}
        <div className="space-y-1 text-center sm:text-left border-b border-slate-100 dark:border-[#1E2638] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
              <Activity className="size-4" />
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                How does your business operate?
              </h2>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">
                Help us understand your day-to-day operational capacity.
              </p>
            </div>
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="space-y-4 text-left">
          {/* Row 1: Employees & Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#0F172A] dark:text-white block">
                Number of Employees
              </label>
              <input
                type="number"
                min="0"
                value={ops.employees}
                onChange={(e) => updateOps({ employees: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 dark:border-[#1E2638] rounded-xl bg-white dark:bg-[#0B0F17] text-[#0F172A] dark:text-white font-medium focus:outline-hidden focus:border-slate-900 dark:focus:border-white focus:ring-1 focus:ring-slate-900/10 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#0F172A] dark:text-white block">
                Opening Hours
              </label>
              <Select
                value={ops.openingHours}
                onChange={(val) => updateOps({ openingHours: val })}
                options={hoursOptions}
              />
            </div>
          </div>

          {/* Row 2: Operating Days & Transactions Per Day */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#0F172A] dark:text-white block">
                Operating Days per Week
              </label>
              <Select
                value={ops.operatingDays}
                onChange={(val) => updateOps({ operatingDays: val })}
                options={daysOptions}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#0F172A] dark:text-white block">
                Average Transactions per Day
              </label>
              <input
                type="number"
                min="0"
                value={ops.transactionsPerDay}
                onChange={(e) =>
                  updateOps({ transactionsPerDay: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 dark:border-[#1E2638] rounded-xl bg-white dark:bg-[#0B0F17] text-[#0F172A] dark:text-white font-medium focus:outline-hidden focus:border-slate-900 dark:focus:border-white focus:ring-1 focus:ring-slate-900/10 transition-colors"
              />
            </div>
          </div>

          {/* Row 3: Customers Per Day & Key Suppliers Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#0F172A] dark:text-white block">
                Average Daily Customers
              </label>
              <input
                type="number"
                min="0"
                value={ops.customersPerDay}
                onChange={(e) =>
                  updateOps({ customersPerDay: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 dark:border-[#1E2638] rounded-xl bg-white dark:bg-[#0B0F17] text-[#0F172A] dark:text-white font-medium focus:outline-hidden focus:border-slate-900 dark:focus:border-white focus:ring-1 focus:ring-slate-900/10 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#0F172A] dark:text-white block">
                Number of Key Suppliers
              </label>
              <input
                type="number"
                min="0"
                value={ops.suppliersCount}
                onChange={(e) =>
                  updateOps({ suppliersCount: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 dark:border-[#1E2638] rounded-xl bg-white dark:bg-[#0B0F17] text-[#0F172A] dark:text-white font-medium focus:outline-hidden focus:border-slate-900 dark:focus:border-white focus:ring-1 focus:ring-slate-900/10 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Bottom Navigation Inside Card */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-[#1E2638]">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onPrev}
            className="text-sm font-semibold gap-1.5 cursor-pointer px-4 border-slate-200 dark:border-[#1E2638] rounded-xl"
          >
            <ArrowLeft className="size-4" />
            <span>Go back</span>
          </Button>

          <Button
            type="button"
            size="md"
            onClick={onNext}
            className="text-sm font-semibold gap-1.5 cursor-pointer bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:opacity-95 shadow-md shadow-indigo-500/25 px-6 py-2.5 rounded-xl transition-all border-0"
          >
            <span>Continue</span>
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
