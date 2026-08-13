'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, CreditCard } from 'lucide-react';
import { PlanModal } from '@/features/billing/components/plan-modal';

export function PlanUsageSettings() {
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [taxId, setTaxId] = useState('1234567890123');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Current Plan */}
        <Card className="p-5 border-border-strong bg-surface space-y-4 text-left">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-tertiary/15 text-tertiary border border-tertiary/30 flex items-center justify-center font-bold">
                <Sparkles className="size-4" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-text-primary">Free Plan</h3>
                <p className="text-[11px] text-text-secondary font-medium">For growing businesses.</p>
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() => setPlanModalOpen(true)}
              className="text-xs font-bold bg-tertiary text-on-primary hover:bg-tertiary-hover"
            >
              Change Plan
            </Button>
          </div>

          <div className="space-y-2 text-xs font-semibold text-text-primary">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Check className="size-4 shrink-0" />
              <span>Unlimited Simulations</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Check className="size-4 shrink-0" />
              <span>Unlimited Reports</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Check className="size-4 shrink-0" />
              <span>Up to 5 Businesses</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Check className="size-4 shrink-0" />
              <span>AI Advisor</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Check className="size-4 shrink-0" />
              <span>Priority Support</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border/40 text-[11px] text-text-muted font-medium">
            Renews on: <span className="font-bold text-text-primary">15 Nov 2025</span>
          </div>
        </Card>

        {/* Card 2: Usage This Month */}
        <Card className="p-5 border-border-strong bg-surface space-y-4 text-left">
          <div className="border-b border-border/60 pb-3">
            <h3 className="font-display text-sm font-bold text-text-primary">Usage This Month</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between font-medium">
                <span className="text-text-secondary">Simulations</span>
                <span className="font-bold text-text-primary">42 / Unlimited</span>
              </div>
              <div className="h-2 w-full rounded-full bg-surface-subtle overflow-hidden">
                <div className="h-full bg-tertiary rounded-full w-[45%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-medium">
                <span className="text-text-secondary">Reports</span>
                <span className="font-bold text-text-primary">18 / Unlimited</span>
              </div>
              <div className="h-2 w-full rounded-full bg-surface-subtle overflow-hidden">
                <div className="h-full bg-tertiary rounded-full w-[30%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-medium">
                <span className="text-text-secondary">Storage</span>
                <span className="font-bold text-text-primary">1.2 GB / 10 GB</span>
              </div>
              <div className="h-2 w-full rounded-full bg-surface-subtle overflow-hidden">
                <div className="h-full bg-tertiary rounded-full w-[12%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-medium">
                <span className="text-text-secondary">Businesses</span>
                <span className="font-bold text-text-primary">2 / 5</span>
              </div>
              <div className="h-2 w-full rounded-full bg-surface-subtle overflow-hidden">
                <div className="h-full bg-tertiary rounded-full w-[40%]" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 3: Payment Method */}
        <Card className="p-5 border-border-strong bg-surface space-y-3 text-left">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-display text-sm font-bold text-text-primary">Payment Method</h3>
            <button type="button" className="text-xs font-bold text-tertiary hover:underline">
              Edit
            </button>
          </div>
          <div className="flex items-center gap-2.5">
            <CreditCard className="size-5 text-tertiary shrink-0" />
            <div className="text-xs font-medium">
              <p className="font-bold text-text-primary">Visa •••• 4242</p>
              <p className="text-[10px] text-text-muted">Expires 08/27</p>
            </div>
          </div>
        </Card>

        {/* Card 4: Billing History */}
        <Card className="p-5 border-border-strong bg-surface space-y-3 text-left">
          <div className="border-b border-border/60 pb-3">
            <h3 className="font-display text-sm font-bold text-text-primary">Billing History</h3>
            <p className="text-[11px] text-text-secondary font-medium">View and download invoices.</p>
          </div>
          <button type="button" className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors">
            View Invoices
          </button>
        </Card>

        {/* Card 5: Tax Information */}
        <Card className="p-5 border-border-strong bg-surface space-y-3 text-left">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-display text-sm font-bold text-text-primary">Tax Information</h3>
            <button type="button" className="text-xs font-bold text-tertiary hover:underline">
              Edit
            </button>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-muted uppercase block">VAT / Tax ID</label>
            <input
              type="text"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-border rounded-xl bg-surface font-mono font-medium"
            />
          </div>
        </Card>
      </div>

      {/* Card 6: Actions */}
      <Card className="p-4 border-border-strong bg-surface flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold">
        <button type="button" className="text-tertiary hover:underline cursor-pointer">
          Update Payment Method
        </button>
        <button type="button" className="text-danger hover:underline cursor-pointer">
          Cancel Subscription
        </button>
      </Card>

      <PlanModal open={planModalOpen} onClose={() => setPlanModalOpen(false)} />
    </div>
  );
}
