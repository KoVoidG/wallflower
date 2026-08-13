'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Store } from 'lucide-react';

export function BusinessProfileSettings() {
  const [businessName, setBusinessName] = useState('Somchai Retail Store');
  const [category, setCategory] = useState('Grocery Store');
  const [size, setSize] = useState<'Micro' | 'Small' | 'Medium'>('Micro');
  const [age, setAge] = useState('1-3 years');
  const [storeType, setStoreType] = useState<'Physical' | 'Online' | 'Both'>('Physical');
  const [branches, setBranches] = useState('1');
  const [description, setDescription] = useState(
    'Neighborhood grocery store offering daily essentials, snacks, beverages, and household items.'
  );

  const [opDays, setOpDays] = useState('6 days');
  const [opHours, setOpHours] = useState('8:00 AM - 8:00 PM');
  const [employees, setEmployees] = useState('5');
  const [customers, setCustomers] = useState('140');
  const [transactions, setTransactions] = useState('115');
  const [suppliers, setSuppliers] = useState('5');

  return (
    <div className="space-y-6">
      {/* Card 1: Business Information */}
      <Card className="p-5 border-border-strong bg-surface space-y-5 text-left">
        <div className="border-b border-border/60 pb-3">
          <h3 className="font-display text-sm font-bold text-text-primary">Business Information</h3>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-primary block">Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary font-medium focus:outline-hidden focus:border-tertiary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-primary block">Business Category</label>
                <Select
                  value={category}
                  onChange={setCategory}
                  options={[
                    { value: 'Grocery Store', label: 'Grocery Store' },
                    { value: 'Retail & Boutique', label: 'Retail & Boutique' },
                    { value: 'Restaurant & Cafe', label: 'Restaurant & Cafe' },
                    { value: 'Services', label: 'Services' },
                  ]}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-primary block">Business Size</label>
                <SegmentedControl
                  options={['Micro', 'Small', 'Medium'] as const}
                  value={size}
                  onChange={setSize}
                  layoutId="segmented-biz-size"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-primary block">Business Age</label>
                <Select
                  value={age}
                  onChange={setAge}
                  options={[
                    { value: '< 1 year', label: '< 1 year' },
                    { value: '1-3 years', label: '1-3 years' },
                    { value: '3-5 years', label: '3-5 years' },
                    { value: '5+ years', label: '5+ years' },
                  ]}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-primary block">Store Type</label>
                <SegmentedControl
                  options={['Physical', 'Online', 'Both'] as const}
                  value={storeType}
                  onChange={setStoreType}
                  layoutId="segmented-biz-store"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-primary block">Number of Branches</label>
                <input
                  type="number"
                  value={branches}
                  onChange={(e) => setBranches(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary font-mono font-medium focus:outline-hidden focus:border-tertiary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-text-primary block">Business Description (Optional)</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 text-xs border border-border rounded-xl bg-surface text-text-primary focus:outline-hidden focus:border-tertiary"
              />
            </div>
          </div>

          {/* Business Logo Box */}
          <div className="w-full lg:w-48 shrink-0 flex flex-col items-center justify-center p-4 border border-border rounded-2xl bg-surface-subtle text-center space-y-3">
            <div className="size-20 rounded-2xl bg-tertiary/15 text-tertiary flex items-center justify-center border border-tertiary/30 shadow-2xs">
              <Store className="size-10" />
            </div>
            <div className="space-y-1">
              <button
                type="button"
                className="px-3 py-1.5 text-xs font-bold rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors cursor-pointer"
              >
                Change Logo
              </button>
              <p className="text-[10px] text-text-muted font-medium">PNG, JPG up to 2MB</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Card 2: Operating Information */}
      <Card className="p-5 border-border-strong bg-surface space-y-5 text-left">
        <div className="border-b border-border/60 pb-3">
          <h3 className="font-display text-sm font-bold text-text-primary">Operating Information</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">Operating Days per Week</label>
            <Select
              value={opDays}
              onChange={setOpDays}
              options={[
                { value: '5 days', label: '5 days' },
                { value: '6 days', label: '6 days' },
                { value: '7 days', label: '7 days' },
              ]}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">Operating Hours</label>
            <Select
              value={opHours}
              onChange={setOpHours}
              options={[
                { value: '8:00 AM - 5:00 PM', label: '8:00 AM - 5:00 PM' },
                { value: '8:00 AM - 8:00 PM', label: '8:00 AM - 8:00 PM' },
                { value: '24 Hours', label: '24 Hours' },
              ]}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">Employees</label>
            <input
              type="number"
              value={employees}
              onChange={(e) => setEmployees(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary font-mono font-medium focus:outline-hidden focus:border-tertiary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">Average Customers per Day</label>
            <input
              type="number"
              value={customers}
              onChange={(e) => setCustomers(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary font-mono font-medium focus:outline-hidden focus:border-tertiary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">Average Transactions per Day</label>
            <input
              type="number"
              value={transactions}
              onChange={(e) => setTransactions(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary font-mono font-medium focus:outline-hidden focus:border-tertiary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">Number of Suppliers</label>
            <input
              type="number"
              value={suppliers}
              onChange={(e) => setSuppliers(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary font-mono font-medium focus:outline-hidden focus:border-tertiary"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
