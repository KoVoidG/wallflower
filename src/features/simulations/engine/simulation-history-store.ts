// src/features/simulations/engine/simulation-history-store.ts
'use client';

import { useState, useEffect } from 'react';
import type { SimulationResult, BottleneckResult } from '@/lib/liquiflow-types';

export interface SavedSimulationRun {
  id: string;
  type: 'what_if' | 'bottleneck';
  name: string;
  templateId?: string;
  strategyTag: string;
  goal: string;
  status: 'Simulated' | 'Draft';
  healthScore?: number;
  lastSimulated: string;
  timestamp: number;
  riskLevel?: 'Low' | 'Medium' | 'High';
  confidence?: number;
  whatIfResult?: SimulationResult;
  bottleneckResult?: BottleneckResult;
  inputValues?: Record<string, number | string>;
}

const STORAGE_KEY = 'wallflower_simulation_history';

const INITIAL_HISTORY: SavedSimulationRun[] = [
  {
    id: 'scen-1',
    type: 'what_if',
    name: 'Price Increase +5%',
    templateId: 'price_increase',
    strategyTag: 'Pricing Strategy',
    goal: 'Increase profit margin by 3%',
    status: 'Simulated',
    healthScore: 84,
    lastSimulated: 'Today, 09:42 AM',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    riskLevel: 'Low',
    confidence: 91,
  },
  {
    id: 'scen-2',
    type: 'what_if',
    name: 'Hire 1 Sales Associate',
    templateId: 'hire_employee',
    strategyTag: 'People Security',
    goal: 'Expand customer capacity',
    status: 'Simulated',
    healthScore: 82,
    lastSimulated: 'Today, 10:15 AM',
    timestamp: Date.now() - 1000 * 60 * 45,
    riskLevel: 'Low',
    confidence: 87,
  },
  {
    id: 'scen-3',
    type: 'bottleneck',
    name: 'Org Bottleneck & Constraints Scan',
    strategyTag: 'Operations Research',
    goal: 'Identify department throughput constraints',
    status: 'Simulated',
    healthScore: 78,
    lastSimulated: 'Today, 11:30 AM',
    timestamp: Date.now() - 1000 * 60 * 30,
    riskLevel: 'Medium',
    confidence: 94,
  },
  {
    id: 'scen-4',
    type: 'what_if',
    name: 'Reduce Supplier Cost',
    templateId: 'cost_reduction',
    strategyTag: 'Cost Efficiency',
    goal: 'Lower operating expense by 4%',
    status: 'Simulated',
    healthScore: 83,
    lastSimulated: 'Yesterday',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    riskLevel: 'Low',
    confidence: 89,
  },
];

export function getSimulationHistory(): SavedSimulationRun[] {
  if (typeof window === 'undefined') return INITIAL_HISTORY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_HISTORY));
      return INITIAL_HISTORY;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_HISTORY;
  }
}

export function saveSimulationRun(
  item: Omit<SavedSimulationRun, 'id' | 'timestamp' | 'lastSimulated'> & {
    id?: string;
    timestamp?: number;
    lastSimulated?: string;
  },
): SavedSimulationRun {
  const current = getSimulationHistory();
  const id = item.id || `sim-${Date.now()}`;
  const timestamp = item.timestamp || Date.now();
  const lastSimulated = item.lastSimulated || 'Just now';

  const newRun: SavedSimulationRun = {
    ...item,
    id,
    timestamp,
    lastSimulated,
  };

  // Prepend to history so newest appears first (like conversation history)
  const updated = [newRun, ...current.filter((x) => x.id !== id)];

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('simulation_history_updated'));
    } catch (e) {
      console.warn('Failed to save simulation history to localStorage:', e);
    }
  }

  return newRun;
}

export function deleteSimulationRun(id: string): void {
  const current = getSimulationHistory();
  const updated = current.filter((x) => x.id !== id);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('simulation_history_updated'));
    } catch (e) {
      console.warn('Failed to delete simulation history from localStorage:', e);
    }
  }
}

export function useSimulationHistory() {
  const [history, setHistory] = useState<SavedSimulationRun[]>(() =>
    getSimulationHistory(),
  );

  useEffect(() => {
    const handleUpdate = () => {
      setHistory(getSimulationHistory());
    };

    window.addEventListener('simulation_history_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('simulation_history_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return { history, saveRun: saveSimulationRun, deleteRun: deleteSimulationRun };
}
