// src/features/automation/adapters/automation.adapter.ts
import { INITIAL_AUTOMATIONS_DATA, type AutomationRule } from '../types/automation.types';

export interface AutomationOverviewData {
  rules: AutomationRule[];
  stats: {
    activeRulesCount: number;
    triggeredTodayCount: number;
    actionsExecutedCount: number;
    timeSavedHours: number;
  };
}

/**
 * Fetch automation rules and operational metrics.
 * Simulated backend data fetch with realistic network latency.
 */
export async function getAutomationsData(): Promise<AutomationOverviewData> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const rules = INITIAL_AUTOMATIONS_DATA;
  const activeRulesCount = rules.filter((r) => r.status === 'active').length;

  return {
    rules,
    stats: {
      activeRulesCount,
      triggeredTodayCount: 24,
      actionsExecutedCount: 89,
      timeSavedHours: 14.5,
    },
  };
}
