'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export function NotificationSettings() {
  const [simCompleted, setSimCompleted] = useState(true);
  const [reportsGenerated, setReportsGenerated] = useState(true);
  const [aiRecommendations, setAiRecommendations] = useState(true);
  const [healthAlerts, setHealthAlerts] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [billingInvoices, setBillingInvoices] = useState(false);

  const [inApp, setInApp] = useState(true);
  const [reminderFreq, setReminderFreq] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Never'>('Weekly');

  return (
    <div className="space-y-6">
      {/* Card 1: Email Notifications */}
      <Card className="p-5 border-border-strong bg-surface space-y-4 text-left">
        <div className="border-b border-border/60 pb-3">
          <h3 className="font-display text-sm font-bold text-text-primary">Email Notifications</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border bg-surface-subtle">
            <div>
              <h4 className="text-xs font-bold text-text-primary">Simulation Completed</h4>
              <p className="text-[11px] text-text-secondary font-medium">Receive email when a simulation is finished.</p>
            </div>
            <Switch checked={simCompleted} onCheckedChange={setSimCompleted} ariaLabel="Toggle Simulation Completed Email" />
          </div>

          <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border bg-surface-subtle">
            <div>
              <h4 className="text-xs font-bold text-text-primary">Reports Generated</h4>
              <p className="text-[11px] text-text-secondary font-medium">Receive email when a new report is generated.</p>
            </div>
            <Switch checked={reportsGenerated} onCheckedChange={setReportsGenerated} ariaLabel="Toggle Reports Generated Email" />
          </div>

          <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border bg-surface-subtle">
            <div>
              <h4 className="text-xs font-bold text-text-primary">AI Recommendations</h4>
              <p className="text-[11px] text-text-secondary font-medium">Receive email for new AI insights and recommendations.</p>
            </div>
            <Switch checked={aiRecommendations} onCheckedChange={setAiRecommendations} ariaLabel="Toggle AI Recommendations Email" />
          </div>

          <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border bg-surface-subtle">
            <div>
              <h4 className="text-xs font-bold text-text-primary">Business Health Alerts</h4>
              <p className="text-[11px] text-text-secondary font-medium">Receive alerts when your Business Health changes.</p>
            </div>
            <Switch checked={healthAlerts} onCheckedChange={setHealthAlerts} ariaLabel="Toggle Business Health Alerts Email" />
          </div>

          <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border bg-surface-subtle">
            <div>
              <h4 className="text-xs font-bold text-text-primary">Security Alerts</h4>
              <p className="text-[11px] text-text-secondary font-medium">Receive email for important security events.</p>
            </div>
            <Switch checked={securityAlerts} onCheckedChange={setSecurityAlerts} ariaLabel="Toggle Security Alerts Email" />
          </div>

          <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border bg-surface-subtle">
            <div>
              <h4 className="text-xs font-bold text-text-primary">Billing & Invoices</h4>
              <p className="text-[11px] text-text-secondary font-medium">Receive emails for billing updates and invoices.</p>
            </div>
            <Switch checked={billingInvoices} onCheckedChange={setBillingInvoices} ariaLabel="Toggle Billing & Invoices Email" />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Card 2: In-App Notifications */}
        <Card className="p-5 border-border-strong bg-surface space-y-4 text-left">
          <div className="border-b border-border/60 pb-3">
            <h3 className="font-display text-sm font-bold text-text-primary">In-App Notifications</h3>
          </div>
          <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border bg-surface-subtle">
            <div>
              <h4 className="text-xs font-bold text-text-primary">In-App Notifications</h4>
              <p className="text-[11px] text-text-secondary font-medium">Show in-app notifications.</p>
            </div>
            <Switch checked={inApp} onCheckedChange={setInApp} ariaLabel="Toggle In-App Notifications" />
          </div>
        </Card>

        {/* Card 3: Reminder Frequency */}
        <Card className="p-5 border-border-strong bg-surface space-y-4 text-left">
          <div className="border-b border-border/60 pb-3">
            <h3 className="font-display text-sm font-bold text-text-primary">Reminder Frequency</h3>
            <p className="text-xs text-text-secondary font-medium">Choose how often you want summary reminders.</p>
          </div>
          <div className="space-y-2">
            {(['Daily', 'Weekly', 'Monthly', 'Never'] as const).map((freq) => (
              <label
                key={freq}
                className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                  reminderFreq === freq
                    ? 'border-tertiary bg-tertiary/10 font-bold text-tertiary'
                    : 'border-border bg-surface hover:bg-surface-hover text-text-primary'
                }`}
              >
                <input
                  type="radio"
                  name="reminderFreq"
                  checked={reminderFreq === freq}
                  onChange={() => setReminderFreq(freq)}
                  className="accent-emerald-600"
                />
                <span className="text-xs">{freq}</span>
              </label>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
