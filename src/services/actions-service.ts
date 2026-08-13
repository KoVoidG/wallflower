// src/services/actions-service.ts
import type { ActionItem } from '@/types/domain';

export class ActionsService {
  static async fetchActions(simulatedDelayMs = 0, triggerError = false): Promise<ActionItem[]> {
    if (simulatedDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, simulatedDelayMs));
    }

    if (triggerError) {
      throw new Error('Failed to load action plan items.');
    }

    return [
      {
        id: 'act-1',
        title: 'Follow up on ฿14,340 overdue invoice from Client A',
        category: 'Cash Collection',
        priority: 'high',
        status: 'todo',
        dueDate: '2025-02-05',
        impactSummary: 'Recovers 0.1 months of runway',
      },
      {
        id: 'act-2',
        title: 'Negotiate 5% rent increase deferral to Q3',
        category: 'Cost Control',
        priority: 'high',
        status: 'in_progress',
        dueDate: '2025-02-15',
        impactSummary: 'Saves ฿3,500/month',
      },
      {
        id: 'act-3',
        title: 'Review discretionary marketing campaign spend',
        category: 'Optimization',
        priority: 'medium',
        status: 'todo',
        dueDate: '2025-02-20',
        impactSummary: 'Potentially saves ฿5,000/month',
      },
    ];
  }
}
