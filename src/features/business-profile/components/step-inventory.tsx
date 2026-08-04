'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, X, Plus } from 'lucide-react';
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
    <div className="max-w-xl mx-auto py-4 px-4 space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="space-y-1 text-left">
        <h2 className="font-display text-xl font-bold text-text-primary tracking-tight">
          Tell us about your inventory
        </h2>
        <p className="text-xs text-text-secondary font-medium">
          This improves inventory-related simulations.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4 text-left">
        {/* Estimated Inventory Value */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-text-primary block">
            Estimated Inventory Value
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">
              ฿
            </span>
            <input
              type="number"
              min="0"
              value={valNum}
              onChange={(e) =>
                updateInv({
                  estimatedValue: createBusinessValue(parseFloat(e.target.value) || 0, 'actual', 'manual'),
                })
              }
              placeholder="350,000"
              className="w-full pl-8 pr-3.5 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary focus:outline-hidden focus:border-emerald-600 transition-colors font-mono font-medium"
            />
          </div>
        </div>

        {/* Main Product Categories (Tag Pills) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text-primary block">
            Main Product Categories
          </label>
          <div className="flex items-center gap-2 flex-wrap min-h-[38px] p-2 border border-border rounded-xl bg-surface">
            {inv.categories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
              >
                <span>{cat}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(cat)}
                  className="hover:text-red-500 transition-colors cursor-pointer"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}

            <div className="flex items-center gap-1 flex-1 min-w-[120px]">
              <input
                type="text"
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                placeholder="Add category..."
                className="w-full text-xs bg-transparent text-text-primary focus:outline-hidden px-1"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="p-1 text-text-muted hover:text-emerald-600 cursor-pointer"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Restock Frequency & Inventory Shortages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">
              Restock Frequency
            </label>
            <Select
              value={inv.restockFrequency}
              onChange={(val) => updateInv({ restockFrequency: val })}
              options={restockOptions}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">
              Inventory Shortages
            </label>
            <SegmentedControl
              options={SHORTAGE_OPTIONS}
              value={inv.shortages}
              onChange={(val) => updateInv({ shortages: val })}
              layoutId="segmented-inventory-shortages"
            />
          </div>
        </div>

        {/* Optional Section (Add Later) */}
        <div className="pt-2 space-y-3 border-t border-border/60">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
            Optional (You can add later)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-primary block">
                Average Inventory Turnover
              </label>
              <Select
                value={inv.turnover || '4–6 times per year'}
                onChange={(val) => updateInv({ turnover: val })}
                options={turnoverOptions}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-text-primary block">
                Dead Stock Estimate (%)
              </label>
              <Select
                value={inv.deadStockPct || '5% or less'}
                onChange={(val) => updateInv({ deadStockPct: val })}
                options={deadStockOptions}
              />
            </div>
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
          className="text-xs font-bold gap-1.5 cursor-pointer bg-emerald-600 text-white dark:text-on-primary hover:bg-emerald-700 shadow-2xs px-5"
        >
          <span>Continue</span>
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
