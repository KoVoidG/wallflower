'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
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
    <div className="max-w-xl mx-auto py-4 px-4 space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="font-display text-xl font-bold text-text-primary tracking-tight">
          How does your business operate?
        </h2>
        <p className="text-xs text-text-secondary font-medium">
          Help us understand your day-to-day operations.
        </p>
      </div>

      {/* Form Fields Grid */}
      <div className="space-y-4 text-left">
        {/* Employees & Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">
              Number of Employees
            </label>
            <input
              type="number"
              min="0"
              value={ops.employees}
              onChange={(e) => updateOps({ employees: parseInt(e.target.value) || 0 })}
              className="w-full px-3.5 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary focus:outline-hidden focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/25 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">
              Opening Hours
            </label>
            <Select
              value={ops.openingHours}
              onChange={(val) => updateOps({ openingHours: val })}
              options={hoursOptions}
            />
          </div>
        </div>

        {/* Operating Days & Transactions Per Day */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">
              Operating Days per Week
            </label>
            <Select
              value={ops.operatingDays}
              onChange={(val) => updateOps({ operatingDays: val })}
              options={daysOptions}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">
              Average Transactions per Day
            </label>
            <input
              type="number"
              min="0"
              value={ops.transactionsPerDay}
              onChange={(e) => updateOps({ transactionsPerDay: parseInt(e.target.value) || 0 })}
              className="w-full px-3.5 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary focus:outline-hidden focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/25 transition-colors"
            />
          </div>
        </div>

        {/* Customers Per Day & Number of Suppliers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">
              Average Customers per Day
            </label>
            <input
              type="number"
              min="0"
              value={ops.customersPerDay}
              onChange={(e) => updateOps({ customersPerDay: parseInt(e.target.value) || 0 })}
              className="w-full px-3.5 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary focus:outline-hidden focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/25 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">
              Number of Suppliers
            </label>
            <input
              type="number"
              min="0"
              value={ops.suppliersCount}
              onChange={(e) => updateOps({ suppliersCount: parseInt(e.target.value) || 0 })}
              className="w-full px-3.5 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary focus:outline-hidden focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/25 transition-colors"
            />
          </div>
        </div>

        {/* Business Notes (Optional) */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-text-primary block">
            Business Notes <span className="text-text-muted font-normal">(Optional)</span>
          </label>
          <textarea
            rows={3}
            value={ops.businessNotes || ''}
            onChange={(e) => updateOps({ businessNotes: e.target.value })}
            placeholder="e.g. Business highlights, special services, target customers..."
            className="w-full px-3.5 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary focus:outline-hidden focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/25 transition-colors resize-none"
          />
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
