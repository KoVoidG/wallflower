'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { SegmentedControl } from '@/components/ui/segmented-control';
import type { OnboardingData } from '../schemas';

interface StepBusinessProfileProps {
  data: OnboardingData;
  onChange: (updated: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const SIZES = ['Micro', 'Small', 'Medium'] as const;
const STORE_TYPES = ['Physical', 'Online', 'Both'] as const;

export function StepBusinessProfile({
  data,
  onChange,
  onNext,
  onPrev,
}: StepBusinessProfileProps) {
  const business = data.business;

  const updateBusiness = (fields: Partial<typeof business>) => {
    onChange({
      business: {
        ...business,
        ...fields,
      },
    });
  };

  const categories = [
    { value: 'Grocery Store', label: 'Grocery Store' },
    { value: 'Convenience Store', label: 'Convenience Store' },
    { value: 'Clothing & Apparel', label: 'Clothing & Apparel' },
    { value: 'Electronics & Tech', label: 'Electronics & Tech' },
    { value: 'Pharmacy & Health', label: 'Pharmacy & Health' },
    { value: 'Bakery & Cafe', label: 'Bakery & Cafe' },
    { value: 'Beauty & Cosmetics', label: 'Beauty & Cosmetics' },
    { value: 'Restaurant & Dining', label: 'Restaurant & Dining' },
    { value: 'Pet Shop', label: 'Pet Shop' },
    { value: 'Hardware & Supplies', label: 'Hardware & Supplies' },
    { value: 'Other Retail', label: 'Other Retail' },
  ];

  const ageOptions = [
    { value: 'Less than 1 year', label: 'Less than 1 year' },
    { value: '1–3 years', label: '1–3 years' },
    { value: '3–5 years', label: '3–5 years' },
    { value: 'More than 5 years', label: 'More than 5 years' },
  ];

  const branchOptions = [
    { value: '1', label: '1 Branch' },
    { value: '2', label: '2 Branches' },
    { value: '3', label: '3 Branches' },
    { value: '4-5', label: '4–5 Branches' },
    { value: '6+', label: '6+ Branches' },
  ];

  const currencyOptions = [
    { value: 'THB (Baht)', label: 'THB (Baht)' },
    { value: 'USD ($)', label: 'USD ($)' },
    { value: 'EUR (€)', label: 'EUR (€)' },
    { value: 'SGD ($)', label: 'SGD ($)' },
  ];

  const languageOptions = [
    { value: 'English', label: 'English' },
    { value: 'Thai', label: 'Thai (ภาษาไทย)' },
  ];

  return (
    <div className="max-w-xl mx-auto py-4 px-4 space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="font-display text-xl font-bold text-text-primary tracking-tight">
          Tell us about your business
        </h2>
        <p className="text-xs text-text-secondary font-medium">
          This helps us understand your business context.
        </p>
      </div>

      {/* Form Fields Grid */}
      <div className="space-y-4 text-left">
        {/* Business Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-text-primary block">
            Business Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={business.name}
            onChange={(e) => updateBusiness({ name: e.target.value })}
            placeholder="e.g. Somchai Retail Store"
            className="w-full px-3.5 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary focus:outline-hidden focus:border-emerald-600 transition-colors"
          />
        </div>

        {/* Business Category */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-text-primary block">
            Business Category
          </label>
          <Select
            value={business.category || 'Grocery Store'}
            onChange={(val) => updateBusiness({ category: val })}
            options={categories}
          />
        </div>

        {/* Business Size & Business Age (2 cols) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">
              Business Size
            </label>
            <SegmentedControl
              options={SIZES}
              value={(business.size as typeof SIZES[number]) || 'Micro'}
              onChange={(val) => updateBusiness({ size: val })}
              layoutId="segmented-business-size"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">
              Business Age
            </label>
            <Select
              value={business.age || '1–3 years'}
              onChange={(val) => updateBusiness({ age: val })}
              options={ageOptions}
            />
          </div>
        </div>

        {/* Store Type & Number of Branches (2 cols) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">
              Store Type
            </label>
            <SegmentedControl
              options={STORE_TYPES}
              value={(business.storeType as typeof STORE_TYPES[number]) || 'Physical'}
              onChange={(val) => updateBusiness({ storeType: val })}
              layoutId="segmented-store-type"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">
              Number of Branches
            </label>
            <Select
              value={business.branches || '1'}
              onChange={(val) => updateBusiness({ branches: val })}
              options={branchOptions}
            />
          </div>
        </div>

        {/* Currency & Language (2 cols) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">
              Currency
            </label>
            <Select
              value={business.currency || 'THB (Baht)'}
              onChange={(val) => updateBusiness({ currency: val })}
              options={currencyOptions}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">
              Language
            </label>
            <Select
              value={business.language || 'English'}
              onChange={(val) => updateBusiness({ language: val })}
              options={languageOptions}
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
          className="text-xs font-bold gap-1.5 cursor-pointer bg-emerald-600 text-white dark:text-on-primary hover:bg-emerald-700 shadow-2xs px-5"
        >
          <span>Continue</span>
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
