'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Check, Upload } from 'lucide-react';

interface ProfileAccountSettingsProps {
  onNavigateToSecurity?: () => void;
}

export function ProfileAccountSettings({ onNavigateToSecurity }: ProfileAccountSettingsProps) {
  const [displayName, setDisplayName] = useState('Somchai Wattana');
  const [preferredName, setPreferredName] = useState('Somchai');
  const [email] = useState('somchai@example.com');
  const [phone, setPhone] = useState('+66 81 234 5678');
  const [role, setRole] = useState('Owner / Founder');
  const [timeZone, setTimeZone] = useState('(GMT+07:00) Bangkok');

  return (
    <div className="space-y-6">
      {/* Card 1: Profile Information */}
      <Card className="p-5 border-border-strong bg-surface space-y-5 text-left">
        <div className="border-b border-border/60 pb-3">
          <h3 className="font-display text-sm font-bold text-text-primary">Profile Information</h3>
        </div>

        {/* Profile Photo */}
        <div className="flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-tertiary text-on-primary font-bold text-lg shadow-2xs">
            SW
          </div>
          <div className="space-y-1">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors cursor-pointer"
            >
              <Upload className="size-3.5 text-tertiary" />
              <span>Change Photo</span>
            </button>
            <p className="text-[10px] text-text-muted font-medium">JPG, PNG up to 2MB</p>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary font-medium focus:outline-hidden focus:border-tertiary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">Preferred Name</label>
            <input
              type="text"
              value={preferredName}
              onChange={(e) => setPreferredName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary font-medium focus:outline-hidden focus:border-tertiary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">Email Address</label>
            <div className="relative flex items-center">
              <input
                type="email"
                value={email}
                readOnly
                className="w-full pl-3 pr-20 py-2 text-xs border border-border rounded-xl bg-surface-subtle text-text-primary font-medium focus:outline-hidden"
              />
              <span className="absolute right-2 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                <Check className="size-3" />
                Verified
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-surface text-text-primary font-medium focus:outline-hidden focus:border-tertiary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">Role</label>
            <Select
              value={role}
              onChange={setRole}
              options={[
                { value: 'Owner / Founder', label: 'Owner / Founder' },
                { value: 'General Manager', label: 'General Manager' },
                { value: 'Finance Lead', label: 'Finance Lead' },
              ]}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-primary block">Time Zone</label>
            <Select
              value={timeZone}
              onChange={setTimeZone}
              options={[
                { value: '(GMT+07:00) Bangkok', label: '(GMT+07:00) Bangkok' },
                { value: '(GMT+00:00) London', label: '(GMT+00:00) London' },
                { value: '(GMT-05:00) New York', label: '(GMT-05:00) New York' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Card 2: Login & Security */}
      <Card className="p-5 border-border-strong bg-surface space-y-4 text-left">
        <div className="border-b border-border/60 pb-3">
          <h3 className="font-display text-sm font-bold text-text-primary">Login & Security</h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-xl border border-border bg-surface-subtle">
          <div className="space-y-0.5">
            <label className="text-xs font-bold text-text-primary block">Password</label>
            <div className="flex items-center gap-2 font-mono text-sm text-text-muted">
              <span>••••••••••••</span>
              <span className="text-[10px] font-sans text-text-muted font-medium">Last changed: 20 Oct 2025</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onNavigateToSecurity}
            className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors cursor-pointer self-start sm:self-auto"
          >
            Change Password
          </button>
        </div>
      </Card>
    </div>
  );
}
