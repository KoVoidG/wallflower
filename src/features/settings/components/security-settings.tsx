'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Check, Laptop, Smartphone, Monitor } from 'lucide-react';

export function SecuritySettings() {
  const [recoveryEmail, setRecoveryEmail] = useState('recovery@example.com');
  const [editingEmail, setEditingEmail] = useState(false);

  return (
    <div className="space-y-6 text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Password */}
        <Card className="p-5 border-border-strong bg-surface space-y-4">
          <div className="border-b border-border/60 pb-3">
            <h3 className="font-display text-sm font-bold text-text-primary">Password</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between font-mono text-xs text-text-muted">
              <span>••••••••••••</span>
              <span className="font-sans text-[10px] text-text-muted font-medium">Last changed: 20 Oct 2025</span>
            </div>
            <button
              type="button"
              className="px-3.5 py-2 text-sm font-semibold rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors cursor-pointer"
            >
              Change Password
            </button>
          </div>
        </Card>

        {/* Card 2: Two-Factor Authentication */}
        <Card className="p-5 border-border-strong bg-surface space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h3 className="font-display text-sm font-bold text-text-primary">Two-Factor Authentication</h3>
              <p className="text-[11px] text-text-secondary font-medium">Add an extra layer of security.</p>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
              <Check className="size-3" />
              Enabled
            </span>
          </div>
          <button
            type="button"
            className="px-3.5 py-2 text-sm font-semibold rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors cursor-pointer"
          >
            Manage 2FA
          </button>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 3: Recovery Email */}
        <Card className="p-5 border-border-strong bg-surface space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h3 className="font-display text-sm font-bold text-text-primary">Recovery Email</h3>
              <p className="text-[11px] text-text-secondary font-medium">Add a recovery email to regain access.</p>
            </div>
            <button
              type="button"
              onClick={() => setEditingEmail((p) => !p)}
              className="text-xs font-bold text-tertiary hover:underline cursor-pointer"
            >
              {editingEmail ? 'Save' : 'Edit'}
            </button>
          </div>
          <input
            type="email"
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
            disabled={!editingEmail}
            className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-surface font-medium disabled:bg-surface-subtle disabled:text-text-muted focus:outline-hidden focus:border-tertiary"
          />
        </Card>

        {/* Card 4: Security Log */}
        <Card className="p-5 border-border-strong bg-surface space-y-4">
          <div className="border-b border-border/60 pb-3">
            <h3 className="font-display text-sm font-bold text-text-primary">Security Log</h3>
            <p className="text-[11px] text-text-secondary font-medium">Review important security events.</p>
          </div>
          <button
            type="button"
            className="px-3.5 py-2 text-sm font-semibold rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors cursor-pointer"
          >
            View Security Log
          </button>
        </Card>
      </div>

      {/* Card 5: Login Sessions */}
      <Card className="p-5 border-border-strong bg-surface space-y-4">
        <div className="border-b border-border/60 pb-3">
          <h3 className="font-display text-sm font-bold text-text-primary">Login Sessions</h3>
          <p className="text-xs text-text-secondary font-medium">You are currently logged in on these devices.</p>
        </div>

        <div className="space-y-3">
          {/* Device 1 */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface-subtle">
            <div className="flex items-center gap-3">
              <Laptop className="size-5 text-tertiary shrink-0" />
              <div className="text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-text-primary">Windows • Chrome</span>
                  <span className="px-2 py-0.5 rounded-md bg-tertiary/15 text-tertiary text-[10px] font-bold border border-tertiary/30">
                    Current
                  </span>
                </div>
                <span className="text-[11px] text-text-muted font-medium">Bangkok, Thailand • This device</span>
              </div>
            </div>
          </div>

          {/* Device 2 */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface-subtle">
            <div className="flex items-center gap-3">
              <Smartphone className="size-5 text-text-muted shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-text-primary block">iPhone 15 • Safari</span>
                <span className="text-[11px] text-text-muted font-medium">Bangkok, Thailand • 2 hours ago</span>
              </div>
            </div>
          </div>

          {/* Device 3 */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface-subtle">
            <div className="flex items-center gap-3">
              <Monitor className="size-5 text-text-muted shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-text-primary block">MacBook Air • Chrome</span>
                <span className="text-[11px] text-text-muted font-medium">Chiang Mai, Thailand • 3 days ago</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-border/40 text-center">
          <button type="button" className="text-xs font-bold text-tertiary hover:underline cursor-pointer">
            View All Sessions
          </button>
        </div>
      </Card>

      {/* Card 6: Danger Zone */}
      <Card className="p-5 border-rose-500/40 bg-rose-500/5 dark:bg-rose-950/10 space-y-4">
        <div className="border-b border-rose-500/20 pb-3">
          <h3 className="font-display text-sm font-bold text-danger">Danger Zone</h3>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-rose-500/20 bg-surface">
            <div>
              <h4 className="font-bold text-text-primary">Sign Out All Devices</h4>
              <p className="text-[11px] text-text-secondary font-medium">Sign out from all devices except this one.</p>
            </div>
            <button
              type="button"
              className="px-3.5 py-2 text-sm font-semibold rounded-xl border border-rose-500/40 text-danger hover:bg-danger-soft/40 transition-colors cursor-pointer self-start sm:self-auto"
            >
              Sign Out All
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-rose-500/20 bg-surface">
            <div>
              <h4 className="font-bold text-text-primary">Delete Account</h4>
              <p className="text-[11px] text-text-secondary font-medium">Permanently delete your account and all data.</p>
            </div>
            <button
              type="button"
              className="px-3.5 py-2 text-sm font-semibold rounded-xl bg-danger text-white hover:bg-danger-hover transition-colors cursor-pointer shadow-2xs self-start sm:self-auto"
            >
              Delete Account
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
