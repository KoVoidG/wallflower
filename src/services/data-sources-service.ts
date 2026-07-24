// src/services/data-sources-service.ts
import type { DataSourceConnection } from '@/types/domain';

export class DataSourcesService {
  static async fetchDataSources(simulatedDelayMs = 0, triggerError = false): Promise<DataSourceConnection[]> {
    if (simulatedDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, simulatedDelayMs));
    }

    if (triggerError) {
      throw new Error('Failed to load connected data sources.');
    }

    return [
      {
        id: 'ds-1',
        name: 'Manual Monthly Financial Snapshot',
        type: 'manual',
        status: 'connected',
        lastSyncedAt: '2025-01-15',
        periodCount: 6,
        completenessScore: 85,
      },
      {
        id: 'ds-2',
        name: 'Financial Baseline Spreadsheet Import',
        type: 'spreadsheet',
        status: 'stale',
        lastSyncedAt: '2024-12-10',
        periodCount: 4,
        completenessScore: 70,
      },
      {
        id: 'ds-3',
        name: 'Sample SME Retail Benchmark Data',
        type: 'sample',
        status: 'connected',
        lastSyncedAt: '2025-01-01',
        periodCount: 12,
        completenessScore: 100,
      },
    ];
  }
}
