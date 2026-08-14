// src/features/business-profile/components/step-business-profile.tsx
'use client';

import { ArrowLeft, ArrowRight, Building2 } from 'lucide-react';
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
    <div className="w-full max-w-4xl mx-auto flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
      {/* ── Fixed White Box Card (Zero Scroll Canvas) ──────────────────── */}
      <div className="w-full rounded-3xl border border-slate-200/90 dark:border-[#1E2638] bg-white dark:bg-[#111622] shadow-2xl shadow-slate-900/5 dark:shadow-black/60 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6">
        {/* Header */}
        <div className="space-y-1 text-center sm:text-left border-b border-slate-100 dark:border-[#1E2638] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
              <Building2 className="size-4" />
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                Tell us about your business
              </h2>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">
                This helps us understand your business context and calibrate benchmarks.
              </p>
            </div>
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="space-y-4 text-left">
          {/* Row 1: Business Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#0F172A] dark:text-white block">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={business.name}
                onChange={(e) => updateBusiness({ name: e.target.value })}
                placeholder="e.g. Somchai Retail Store"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 dark:border-[#1E2638] rounded-xl bg-white dark:bg-[#0B0F17] text-[#0F172A] dark:text-white font-medium focus:outline-hidden focus:border-slate-900 dark:focus:border-white focus:ring-1 focus:ring-slate-900/10 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#0F172A] dark:text-white block">
                Business Category
              </label>
              <Select
                value={business.category || 'Grocery Store'}
                onChange={(val) => updateBusiness({ category: val })}
                options={categories}
              />
            </div>
          </div>

          {/* Row 2: Business Size & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#0F172A] dark:text-white block">
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
              <label className="text-sm font-semibold text-[#0F172A] dark:text-white block">
                Business Age
              </label>
              <Select
                value={business.age || '1–3 years'}
                onChange={(val) => updateBusiness({ age: val })}
                options={ageOptions}
              />
            </div>
          </div>

          {/* Row 3: Store Type & Number of Branches */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#0F172A] dark:text-white block">
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
              <label className="text-sm font-semibold text-[#0F172A] dark:text-white block">
                Number of Branches
              </label>
              <Select
                value={business.branches || '1'}
                onChange={(val) => updateBusiness({ branches: val })}
                options={branchOptions}
              />
            </div>
          </div>

          {/* Row 4: Currency & Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#0F172A] dark:text-white block">
                Currency
              </label>
              <Select
                value={business.currency || 'THB (Baht)'}
                onChange={(val) => updateBusiness({ currency: val })}
                options={currencyOptions}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#0F172A] dark:text-white block">
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
