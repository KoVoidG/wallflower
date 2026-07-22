'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Building2, CheckCircle2, Edit3, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/lib/i18n/navigation';

export function BusinessProfileSettings() {
  const t = useTranslations('settingsPage.businessProfile');
  const [isEditing, setIsEditing] = useState(false);
  const [businessName, setBusinessName] = useState('Siam Craft Brewery Co., Ltd.');
  const [industry, setIndustry] = useState('Food & Beverage');
  const [location, setLocation] = useState('Bangkok, Thailand');
  const [teamSize, setTeamSize] = useState('12 employees');
  const [saveNotice, setSaveNotice] = useState(false);

  const handleSaveEdit = () => {
    setIsEditing(false);
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">{t('title')}</h2>
          <p className="text-sm text-text-secondary">
            Company information, team size, baseline status, and financial reporting setup.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsEditing((prev) => !prev)}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer self-start sm:self-center"
        >
          <Edit3 className="size-3.5 text-brand" />
          <span>{isEditing ? 'Cancel editing' : t('editAction')}</span>
        </button>
      </div>

      {saveNotice && (
        <div className="flex items-center gap-2 rounded-lg border border-success/40 bg-success-soft px-4 py-3 text-sm text-success font-medium">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{t('mockNotice')}</span>
        </div>
      )}

      {/* Baseline Status Overview Banner */}
      <div className="rounded-lg border border-border bg-surface p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-brand-soft text-brand">
              <Building2 className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary">{businessName}</h3>
              <p className="text-xs text-text-muted">{industry} • {location}</p>
            </div>
          </div>
          <Badge variant="success" dot>
            Verified Baseline
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div>
            <span className="block text-text-muted">{t('dataCompleteness')}</span>
            <span className="font-semibold text-text-primary">85% (4 of 6 snapshots)</span>
          </div>
          <div>
            <span className="block text-text-muted">{t('dataThrough')}</span>
            <span className="font-semibold text-text-primary">May 2026</span>
          </div>
          <div>
            <span className="block text-text-muted">{t('lastUpdated')}</span>
            <span className="font-semibold text-text-primary">2 days ago</span>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href="/business-health"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
          >
            <span>{t('reviewBaseline')}</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* Editable Business Details Form / Display */}
      <div className="rounded-lg border border-border bg-surface p-4 sm:p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-primary">{t('name')}</label>
            {isEditing ? (
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-brand"
              />
            ) : (
              <div className="rounded-md border border-border bg-surface-subtle px-3 py-2 text-sm text-text-primary font-medium">
                {businessName}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-primary">{t('industry')}</label>
            {isEditing ? (
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-brand"
              />
            ) : (
              <div className="rounded-md border border-border bg-surface-subtle px-3 py-2 text-sm text-text-primary font-medium">
                {industry}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-primary">{t('location')}</label>
            {isEditing ? (
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-brand"
              />
            ) : (
              <div className="rounded-md border border-border bg-surface-subtle px-3 py-2 text-sm text-text-primary font-medium">
                {location}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-primary">{t('teamSize')}</label>
            {isEditing ? (
              <input
                type="text"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-brand"
              />
            ) : (
              <div className="rounded-md border border-border bg-surface-subtle px-3 py-2 text-sm text-text-primary font-medium">
                {teamSize}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-primary">{t('currency')}</label>
            <div className="rounded-md border border-border bg-surface-subtle px-3 py-2 text-sm text-text-primary font-medium">
              THB (฿) - Thai Baht
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-primary">{t('fiscalYear')}</label>
            <div className="rounded-md border border-border bg-surface-subtle px-3 py-2 text-sm text-text-primary font-medium">
              January
            </div>
          </div>
        </div>

        {/* Business Goals Pills */}
        <div className="space-y-2 pt-2 border-t border-border/50">
          <label className="text-xs font-semibold text-text-primary">{t('goals')}</label>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
              Maintain Cash Runway &gt; 6 Mos
            </span>
            <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
              Expand Distribution Channels
            </span>
            <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
              Optimize Payroll Ratios
            </span>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-subtle transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
