// src/features/business-health/adapters/business-health.adapter.ts
import type { DataQualityMetadata, DataConfidence } from '@/types/domain';
import {
  getDiagnosticDimensions,
  type HealthDimensionDiagnostic,
  type HealthPostureStatus,
} from '../lib/thresholds';

export interface BusinessHealthAssessment {
  overallScore: number;
  posture: HealthPostureStatus;
  summaryExplanation: string;
  strongestDimension: { key: string; label: string; score: number };
  weakestDimension: { key: string; label: string; score: number };
  mostImportantChange: string;
  recommendedAction: string;
  confidence: DataConfidence;
  diagnosticDimensions: HealthDimensionDiagnostic[];
  strengths: string[];
  vulnerabilities: string[];
  completeness: DataQualityMetadata & {
    hasHistoryWarning: boolean;
  };
}

export interface BusinessHealthServiceOptions {
  simulatedDelayMs?: number;
  triggerError?: boolean;
  triggerEmpty?: boolean;
}

export class BusinessHealthAdapter {
  /**
   * Fetch complete business health diagnostic assessment.
   * Supports simulated loading delay, empty baseline, and error states.
   */
  static async getHealthAssessment(
    options: BusinessHealthServiceOptions = {}
  ): Promise<BusinessHealthAssessment | null> {
    const { simulatedDelayMs = 0, triggerError = false, triggerEmpty = false } = options;

    if (simulatedDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, simulatedDelayMs));
    }

    if (triggerError) {
      throw new Error('Unable to assess business health diagnostic. Please refresh or update financial snapshot.');
    }

    if (triggerEmpty) {
      return null;
    }

    const diagnosticDimensions = getDiagnosticDimensions();

    const overallScore = Math.round(
      diagnosticDimensions.reduce((sum, d) => sum + d.score, 0) / diagnosticDimensions.length
    );

    const sortedByScore = [...diagnosticDimensions].sort((a, b) => b.score - a.score);
    const strongest = sortedByScore[0];
    const weakest = sortedByScore[sortedByScore.length - 1];

    return {
      overallScore,
      posture: overallScore >= 75 ? 'Strong' : overallScore >= 55 ? 'Stable' : 'Needs attention',
      summaryExplanation:
        'Profitability is your strongest area at 78/100. Working Capital needs attention at 45/100, primarily because overdue receivables rose while supplier payments due within 30 days remained high.',
      strongestDimension: { key: strongest.id, label: strongest.title, score: strongest.score },
      weakestDimension: { key: weakest.id, label: weakest.title, score: weakest.score },
      mostImportantChange: 'Working-capital pressure increased as overdue receivables rose to 40% of total uncollected invoices.',
      recommendedAction:
        'Follow up on overdue client invoices and review payment delay simulations to protect cash runway.',
      confidence: 'high',
      diagnosticDimensions,
      strengths: [
        'Operating profit margin expanded 2.1 percentage points to 18.5%.',
        'Fixed debt service remains stable at 9.8% of monthly revenue.',
        'Digital marketing campaign ROI improved to 2.4x return.',
      ],
      vulnerabilities: [
        'Overdue receivables (฿21,340) create a working capital drag.',
        'Cash runway (2.1 months) is near the 1-month safety threshold.',
        'Payroll (55.7% of revenue) consumes more than half of monthly income.',
      ],
      completeness: {
        completenessScore: 90,
        periodCount: 6,
        lastUpdated: '2025-01-15',
        staleDays: 5,
        hasStaleWarning: false,
        hasHistoryWarning: false,
      },
    };
  }
}
