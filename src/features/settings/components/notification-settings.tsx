// src/features/settings/components/notification-settings.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { FadeInView } from '@/components/motion';

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
      <FadeInView offset={10}>
        <Card className="p-6 rounded-2xl border-slate-100 dark:border-[#1E2638] bg-white dark:bg-[#111622] shadow-xs space-y-4 text-left">
          <div className="border-b border-slate-100 dark:border-[#1E2638] pb-3.5">
            <h3 className="font-display text-sm font-bold text-[#0F172A] dark:text-white">
              Email Notifications
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
              Select which events trigger email notifications
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17]">
              <div>
                <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">
                  Simulation Completed
                </h4>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium">
                  Receive email when a simulation is finished.
                </p>
              </div>
              <Switch
                checked={simCompleted}
                onCheckedChange={setSimCompleted}
                ariaLabel="Toggle Simulation Completed Email"
              />
            </div>

            <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17]">
              <div>
                <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">
                  Reports Generated
                </h4>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium">
                  Receive email when a new report is generated.
                </p>
              </div>
              <Switch
                checked={reportsGenerated}
                onCheckedChange={setReportsGenerated}
                ariaLabel="Toggle Reports Generated Email"
              />
            </div>

            <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17]">
              <div>
                <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">
                  AI Recommendations
                </h4>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium">
                  Receive email for new AI insights and recommendations.
                </p>
              </div>
              <Switch
                checked={aiRecommendations}
                onCheckedChange={setAiRecommendations}
                ariaLabel="Toggle AI Recommendations Email"
              />
            </div>

            <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17]">
              <div>
                <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">
                  Business Health Alerts
                </h4>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium">
                  Receive alerts when your Business Health changes.
                </p>
              </div>
              <Switch
                checked={healthAlerts}
                onCheckedChange={setHealthAlerts}
                ariaLabel="Toggle Business Health Alerts Email"
              />
            </div>

            <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17]">
              <div>
                <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">
                  Security Alerts
                </h4>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium">
                  Receive email for important security events.
                </p>
              </div>
              <Switch
                checked={securityAlerts}
                onCheckedChange={setSecurityAlerts}
                ariaLabel="Toggle Security Alerts Email"
              />
            </div>

            <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17]">
              <div>
                <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">
                  Billing & Invoices
                </h4>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium">
                  Receive emails for billing updates and invoices.
                </p>
              </div>
              <Switch
                checked={billingInvoices}
                onCheckedChange={setBillingInvoices}
                ariaLabel="Toggle Billing & Invoices Email"
              />
            </div>
          </div>
        </Card>
      </FadeInView>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Card 2: In-App Notifications */}
        <FadeInView offset={12}>
          <Card className="p-6 rounded-2xl border-slate-100 dark:border-[#1E2638] bg-white dark:bg-[#111622] shadow-xs space-y-4 text-left h-full">
            <div className="border-b border-slate-100 dark:border-[#1E2638] pb-3.5">
              <h3 className="font-display text-sm font-bold text-[#0F172A] dark:text-white">
                In-App Notifications
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                Manage your real-time desktop popups
              </p>
            </div>
            <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0B0F17]">
              <div>
                <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">
                  In-App Banners
                </h4>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium">
                  Show real-time notifications in header.
                </p>
              </div>
              <Switch
                checked={inApp}
                onCheckedChange={setInApp}
                ariaLabel="Toggle In-App Notifications"
              />
            </div>
          </Card>
        </FadeInView>

        {/* Card 3: Reminder Frequency */}
        <FadeInView offset={12}>
          <Card className="p-6 rounded-2xl border-slate-100 dark:border-[#1E2638] bg-white dark:bg-[#111622] shadow-xs space-y-4 text-left h-full">
            <div className="border-b border-slate-100 dark:border-[#1E2638] pb-3.5">
              <h3 className="font-display text-sm font-bold text-[#0F172A] dark:text-white">
                Reminder Frequency
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                Choose how often you want summary reminders
              </p>
            </div>
            <div className="space-y-2.5">
              {(['Daily', 'Weekly', 'Monthly', 'Never'] as const).map((freq) => {
                const isSelected = reminderFreq === freq;

                return (
                  <label
                    key={freq}
                    onClick={() => setReminderFreq(freq)}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all',
                      isSelected
                        ? 'border-[#6366F1] bg-purple-50/80 dark:bg-purple-950/40 text-[#4F46E5] dark:text-[#A5B4FC] font-bold shadow-2xs'
                        : 'border-slate-200/80 dark:border-[#1E2638] bg-white dark:bg-[#111622] hover:bg-slate-50 dark:hover:bg-[#1E2638]/50 text-[#0F172A] dark:text-white',
                    )}
                  >
                    <div
                      className={cn(
                        'size-4 rounded-full border flex items-center justify-center shrink-0 transition-colors',
                        isSelected
                          ? 'border-[#6366F1] bg-[#6366F1]'
                          : 'border-slate-300 dark:border-[#2A344A] bg-white dark:bg-[#111622]',
                      )}
                    >
                      {isSelected && (
                        <div className="size-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-xs">{freq}</span>
                  </label>
                );
              })}
            </div>
          </Card>
        </FadeInView>
      </div>
    </div>
  );
}
