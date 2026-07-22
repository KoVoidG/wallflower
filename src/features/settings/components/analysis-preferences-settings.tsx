'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Sliders, Info, ShieldAlert, FlaskConical, Check } from 'lucide-react';
import { Select } from '@/components/ui/select';

interface AnalysisPreferencesSettingsProps {
  onStateChange?: () => void;
}

export function AnalysisPreferencesSettings({ onStateChange }: AnalysisPreferencesSettingsProps) {
  const t = useTranslations('settingsPage.analysis');
  const tCommon = useTranslations('settingsPage');

  const [minRunway, setMinRunway] = useState(3);
  const [warningRunway, setWarningRunway] = useState(4);
  const [targetMargin, setTargetMargin] = useState(35);
  const [receivableDays, setReceivableDays] = useState(30);
  const [maxDebtRatio, setMaxDebtRatio] = useState(2.5);

  const [forecastPeriod, setForecastPeriod] = useState(12);
  const [openingPosture, setOpeningPosture] = useState('cautious');
  const [autoBestWorst, setAutoBestWorst] = useState(true);
  const [showSensitivity, setShowSensitivity] = useState(true);

  const [riskSensitivity, setRiskSensitivity] = useState('balanced');
  const [surfaceLowConfidence, setSurfaceLowConfidence] = useState(true);
  const [includeOperational, setIncludeOperational] = useState(true);
  const [includeGrowth, setIncludeGrowth] = useState(true);
  const [defaultSort, setDefaultSort] = useState('severity');

  const [saved, setSaved] = useState(false);

  const handleChange = () => {
    onStateChange?.();
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-text-primary">{t('title')}</h2>
        <p className="text-sm text-text-secondary">
          Customize warning thresholds, simulation defaults, and risk engine sensitivity.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-success/40 bg-success-soft px-4 py-3 text-sm text-success font-medium">
          <Check className="size-4 shrink-0" />
          <span>{tCommon('saveBar.saved')}</span>
        </div>
      )}

      {/* Note Notice */}
      <div className="flex items-start gap-3 rounded-lg border border-border bg-surface-subtle p-3.5 text-xs text-text-secondary">
        <Info className="size-4 text-brand shrink-0 mt-0.5" />
        <p>{t('thresholdsNote')}</p>
      </div>

      {/* Group 1: Financial Thresholds */}
      <div className="rounded-lg border border-border bg-surface p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <Sliders className="size-4 text-brand" />
          <h3 className="text-base font-semibold text-text-primary">{t('thresholdsTitle')}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-primary">
              {t('minRunway')} ({minRunway} mo)
            </label>
            <input
              type="range"
              min={1}
              max={12}
              value={minRunway}
              onChange={(e) => {
                setMinRunway(Number(e.target.value));
                handleChange();
              }}
              className="w-full accent-brand cursor-pointer"
            />
            <p className="text-[11px] text-text-muted">{t('minRunwayDesc')}</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-primary">
              Cash-runway warning threshold ({warningRunway} mo)
            </label>
            <input
              type="range"
              min={2}
              max={12}
              value={warningRunway}
              onChange={(e) => {
                setWarningRunway(Number(e.target.value));
                handleChange();
              }}
              className="w-full accent-brand cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-primary">{t('targetMargin')}</label>
            <input
              type="number"
              value={targetMargin}
              onChange={(e) => {
                setTargetMargin(Number(e.target.value));
                handleChange();
              }}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-brand"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-primary">{t('receivableDays')}</label>
            <input
              type="number"
              value={receivableDays}
              onChange={(e) => {
                setReceivableDays(Number(e.target.value));
                handleChange();
              }}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-brand"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-primary">{t('maxDebtRatio')}</label>
            <input
              type="number"
              step="0.1"
              value={maxDebtRatio}
              onChange={(e) => {
                setMaxDebtRatio(Number(e.target.value));
                handleChange();
              }}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-brand"
            />
          </div>
        </div>
      </div>

      {/* Group 2: Simulation Defaults */}
      <div className="rounded-lg border border-border bg-surface p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <FlaskConical className="size-4 text-brand" />
          <h3 className="text-base font-semibold text-text-primary">{t('simDefaultsTitle')}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Select
              label={t('forecastPeriod')}
              value={String(forecastPeriod)}
              onChange={(val) => {
                setForecastPeriod(Number(val));
                handleChange();
              }}
              options={[
                { value: '3', label: '3 months' },
                { value: '6', label: '6 months' },
                { value: '12', label: '12 months' },
                { value: '24', label: '24 months' },
              ]}
            />
          </div>

          <div>
            <Select
              label={t('openingScenario')}
              value={openingPosture}
              onChange={(val) => {
                setOpeningPosture(val);
                handleChange();
              }}
              options={[
                { value: 'cautious', label: 'Cautious' },
                { value: 'neutral', label: 'Neutral' },
                { value: 'bullish', label: 'Bullish' },
              ]}
            />
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-text-primary">
            <input
              type="checkbox"
              checked={autoBestWorst}
              onChange={(e) => {
                setAutoBestWorst(e.target.checked);
                handleChange();
              }}
              className="rounded accent-brand size-4 cursor-pointer"
            />
            <span>{t('autoIncludeBestWorst')}</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-text-primary">
            <input
              type="checkbox"
              checked={showSensitivity}
              onChange={(e) => {
                setShowSensitivity(e.target.checked);
                handleChange();
              }}
              className="rounded accent-brand size-4 cursor-pointer"
            />
            <span>{t('showSensitivity')}</span>
          </label>
        </div>
      </div>

      {/* Group 3: Risk Preferences */}
      <div className="rounded-lg border border-border bg-surface p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <ShieldAlert className="size-4 text-brand" />
          <h3 className="text-base font-semibold text-text-primary">{t('riskPreferencesTitle')}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Select
              label={t('riskSensitivity')}
              value={riskSensitivity}
              onChange={(val) => {
                setRiskSensitivity(val);
                handleChange();
              }}
              options={[
                { value: 'conservative', label: t('sensitivityOptions.conservative') },
                { value: 'balanced', label: t('sensitivityOptions.balanced') },
                { value: 'flexible', label: t('sensitivityOptions.flexible') },
              ]}
            />
          </div>

          <div>
            <Select
              label={t('defaultSort')}
              value={defaultSort}
              onChange={(val) => {
                setDefaultSort(val);
                handleChange();
              }}
              options={[
                { value: 'severity', label: t('sortOptions.severity') },
                { value: 'impact', label: t('sortOptions.impact') },
                { value: 'newest', label: t('sortOptions.newest') },
              ]}
            />
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-text-primary">
            <input
              type="checkbox"
              checked={surfaceLowConfidence}
              onChange={(e) => {
                setSurfaceLowConfidence(e.target.checked);
                handleChange();
              }}
              className="rounded accent-brand size-4 cursor-pointer"
            />
            <span>{t('surfaceLowConfidence')}</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-text-primary">
            <input
              type="checkbox"
              checked={includeOperational}
              onChange={(e) => {
                setIncludeOperational(e.target.checked);
                handleChange();
              }}
              className="rounded accent-brand size-4 cursor-pointer"
            />
            <span>{t('includeOperational')}</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-text-primary">
            <input
              type="checkbox"
              checked={includeGrowth}
              onChange={(e) => {
                setIncludeGrowth(e.target.checked);
                handleChange();
              }}
              className="rounded accent-brand size-4 cursor-pointer"
            />
            <span>{t('includeGrowth')}</span>
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover transition-colors cursor-pointer"
          >
            {tCommon('saveBar.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
