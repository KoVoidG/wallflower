// src/features/business-profile/components/step-inventory.tsx
'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Package, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { SegmentedControl } from '@/components/ui/segmented-control';
import type { OnboardingData } from '../schemas';
import { createBusinessValue } from '../schemas';

const SHORTAGE_OPTIONS = ['Never', 'Sometimes', 'Often'] as const;

interface StepInventoryProps {
  data: OnboardingData;
  onChange: (updated: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function StepInventory({
  data,
  onChange,
  onNext,
  onPrev,
}: StepInventoryProps) {
  const inv = data.inventory || {
    estimatedValue: createBusinessValue(350000, 'actual', 'manual'),
    categories: ['Beverages', 'Snacks', 'Daily Essentials'],
    restockFrequency: 'Every 1-2 weeks',
    shortages: 'Sometimes' as const,
    turnover: '4–6 times per year',
    deadStockPct: '5% or less',
  };

  const [newCategoryInput, setNewCategoryInput] = useState('');

  const updateInv = (fields: Partial<typeof inv>) => {
    onChange({
      inventory: {
        ...inv,
        ...fields,
      },
    });
  };

  const handleAddCategory = () => {
    if (!newCategoryInput.trim()) return;
    if (!inv.categories.includes(newCategoryInput.trim())) {
      updateInv({ categories: [...inv.categories, newCategoryInput.trim()] });
    }
    setNewCategoryInput('');
  };

  const handleRemoveCategory = (catToRemove: string) => {
    updateInv({ categories: inv.categories.filter((c) => c !== catToRemove) });
  };

  const restockOptions = [
    { value: 'Daily', label: 'Daily' },
    { value: 'Every 1-2 weeks', label: 'Every 1–2 weeks' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Quarterly', label: 'Quarterly' },
  ];

  const turnoverOptions = [
    { value: '1–3 times per year', label: '1–3 times per year' },
    { value: '4–6 times per year', label: '4–6 times per year' },
    { value: '7–12 times per year', label: '7–12 times per year' },
    { value: '12+ times per year', label: '12+ times per year' },
  ];

  const deadStockOptions = [
    { value: '5% or less', label: '5% or less' },
    { value: '5–10%', label: '5–10%' },
    { value: '10–20%', label: '10–20%' },
    { value: '20%+', label: '20%+' },
  ];

  const valNum =
    inv.estimatedValue && typeof inv.estimatedValue === 'object' && 'value' in inv.estimatedValue
      ? String(inv.estimatedValue.value ?? '')
      : '350000';

  return (
    <div className="w-full max-w-4xl mx-auto flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
      {/* ── Fixed White Box Card (Zero Scroll Canvas) ──────────────────── */}
      <div className="w-full rounded-3xl border border-slate-200/90 dark:border-[#1E2638] bg-white dark:bg-[#111622] shadow-2xl shadow-slate-900/5 dark:shadow-black/60 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 overflow-hidden">
        {/* Header */}
        <div className="space-y-1 text-center sm:text-left border-b border-slate-100 dark:border-[#1E2638] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
              <Package className="size-4" />
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                Tell us about your inventory
              </h2>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">
                This calibrates holding costs, stockout risks, and supplier lead times.
              </p>
            </div>
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="space-y-4 text-left">
          {/* Row 1: Estimated Value & Restock Frequency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F172A] dark:text-white block">
                Estimated Inventory Value
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#64748B] dark:text-[#94A3B8]">
                  ฿
                </span>
                <input
                  type="number"
                  min="0"
                  value={valNum}
                  onChange={(e) =>
                    updateInv({
                      estimatedValue: createBusinessValue(
                        parseFloat(e.target.value) || 0,
                        'actual',
                        'manual'
                      ),
                    })
                  }
                  placeholder="350,000"
                  className="w-full pl-8 pr-3.5 py-2 text-xs border border-slate-200 dark:border-[#1E2638] rounded-xl bg-white dark:bg-[#0B0F17] text-[#0F172A] dark:text-white focus:outline-hidden focus:border-slate-900 dark:focus:border-white focus:ring-1 focus:ring-slate-900/10 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F172A] dark:text-white block">
                Restock Frequency
              </label>
              <Select
                value={inv.restockFrequency || 'Every 1-2 weeks'}
                onChange={(val) => updateInv({ restockFrequency: val })}
                options={restockOptions}
              />
            </div>
          </div>

          {/* Row 2: Stockout Frequency & Turnover */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F172A] dark:text-white block">
                Stockout / Shortages Frequency
              </label>
              <SegmentedControl
                options={SHORTAGE_OPTIONS}
                value={(inv.shortages as typeof SHORTAGE_OPTIONS[number]) || 'Sometimes'}
                onChange={(val) => updateInv({ shortages: val })}
                layoutId="segmented-shortages"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F172A] dark:text-white block">
                Inventory Turnover
              </label>
              <Select
                value={inv.turnover || '4–6 times per year'}
                onChange={(val) => updateInv({ turnover: val })}
                options={turnoverOptions}
              />
            </div>
          </div>

          {/* Row 3: Dead Stock & Category Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F172A] dark:text-white block">
                Dead Stock / Slow-Moving %
              </label>
              <Select
                value={inv.deadStockPct || '5% or less'}
                onChange={(val) => updateInv({ deadStockPct: val })}
                options={deadStockOptions}
              />
            </div>

            {/* Product Categories */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F172A] dark:text-white block">
                Product Categories
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                  placeholder="Add a category..."
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-200 dark:border-[#1E2638] rounded-xl bg-white dark:bg-[#0B0F17] text-[#0F172A] dark:text-white focus:outline-hidden focus:border-slate-900 dark:focus:border-white transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-2.5 py-1.5 rounded-xl bg-[#6366F1] hover:bg-[#5558DD] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {inv.categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                  >
                    <span>{cat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(cat)}
                      className="hover:text-red-500 cursor-pointer"
                    >
                      <X className="size-2.5" />
                    </button>
                  </span>
                ))}
              </div>
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
