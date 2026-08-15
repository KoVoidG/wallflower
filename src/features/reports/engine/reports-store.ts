// src/features/reports/engine/reports-store.ts
'use client';

import { useState, useEffect } from 'react';
import type { ReportItem } from '../components/report-viewer';

const STORAGE_KEY = 'wallflower_reports_library';

export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rpt-1',
    title: 'Price Increase +5%',
    type: 'Executive Summary',
    date: 'Aug 5, 2025 • 10:24 AM',
    horizon: '6 Months Horizon',
    healthScore: 84,
    profit: '฿163,000',
    confidence: 91,
    confidenceBadge: 'High Confidence',
    iconColor: 'emerald',
  },
  {
    id: 'rpt-2',
    title: 'Hire 1 Sales Associate',
    type: 'Executive Summary',
    date: 'Jul 30, 2025 • 02:15 PM',
    horizon: '6 Months Horizon',
    healthScore: 82,
    profit: '฿142,000',
    confidence: 87,
    confidenceBadge: 'High Confidence',
    iconColor: 'blue',
  },
  {
    id: 'rpt-3',
    title: 'Holiday Promotion Campaign',
    type: 'Executive Summary',
    date: 'Jul 26, 2025 • 09:31 AM',
    horizon: '3 Months Horizon',
    healthScore: 78,
    profit: '฿98,000',
    confidence: 85,
    confidenceBadge: 'Medium Confidence',
    iconColor: 'rose',
  },
  {
    id: 'rpt-4',
    title: 'Expand Inventory',
    type: 'Executive Summary',
    date: 'Jul 20, 2025 • 10:11 AM',
    horizon: '6 Months Horizon',
    healthScore: 81,
    profit: '฿128,000',
    confidence: 82,
    confidenceBadge: 'High Confidence',
    iconColor: 'emerald',
  },
  {
    id: 'rpt-5',
    title: 'Pricing Strategy Comparison',
    type: 'Comparison Report',
    date: 'Jul 18, 2025 • 03:50 PM',
    horizon: '6 Months Horizon',
    healthScore: 83,
    profit: '฿154,000',
    confidence: 90,
    confidenceBadge: 'High Confidence',
    iconColor: 'blue',
  },
  {
    id: 'rpt-6',
    title: 'Q2 2025 Performance Review',
    type: 'Business Review',
    date: 'Jul 14, 2025 • 05:30 PM',
    horizon: '3 Months Horizon',
    healthScore: 80,
    profit: '฿135,000',
    confidence: 86,
    confidenceBadge: 'High Confidence',
    iconColor: 'rose',
  },
];

export function getReports(): ReportItem[] {
  if (typeof window === 'undefined') return INITIAL_REPORTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
      return INITIAL_REPORTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REPORTS;
  }
}

export function saveReport(
  item: Omit<ReportItem, 'id'> & { id?: string },
): ReportItem {
  const current = getReports();
  const id = item.id || `rpt-${Date.now()}`;
  const fullItem: ReportItem = { ...item, id };
  const updated = [fullItem, ...current.filter((r) => r.id !== id)];

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('reports_library_updated'));
    } catch (e) {
      console.warn('Failed to save report to localStorage:', e);
    }
  }

  return fullItem;
}

export function deleteReport(id: string): void {
  const current = getReports();
  const updated = current.filter((r) => r.id !== id);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('reports_library_updated'));
    } catch (e) {
      console.warn('Failed to delete report from localStorage:', e);
    }
  }
}

export function useReports() {
  const [reports, setReports] = useState<ReportItem[]>(() => getReports());

  useEffect(() => {
    const handleUpdate = () => {
      setReports(getReports());
    };

    window.addEventListener('reports_library_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('reports_library_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return { reports, saveReport, deleteReport };
}
