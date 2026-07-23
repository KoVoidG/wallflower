import {
  OnboardingData,
  createBusinessValue,
  defaultOnboardingData,
} from '../schemas';

const DRAFT_KEY = 'wallflower-onboarding-draft';
const COMPLETED_KEY = 'wallflower-onboarding-completed-data';
const STATUS_KEY = 'wallflower-onboarding-status';

function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export const onboardingService = {
  loadDraft(): OnboardingData | null {
    if (!isStorageAvailable()) return null;
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as OnboardingData;
    } catch (e) {
      console.warn('[onboardingService] Failed to load draft:', e);
      return null;
    }
  },

  saveDraft(data: OnboardingData): void {
    if (!isStorageAvailable()) return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('[onboardingService] Failed to save draft:', e);
    }
  },

  clearDraft(): void {
    if (!isStorageAvailable()) return;
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch (e) {
      console.warn('[onboardingService] Failed to clear draft:', e);
    }
  },

  async completeOnboarding(data: OnboardingData): Promise<{ success: boolean; error?: string }> {
    // Simulate minor network delay for backend-ready payload handling
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!isStorageAvailable()) {
      return { success: true };
    }

    try {
      window.localStorage.setItem(COMPLETED_KEY, JSON.stringify(data));
      window.localStorage.setItem(STATUS_KEY, 'true');
      this.clearDraft();

      if (process.env.NODE_ENV === 'development') {
        console.log('[onboardingService] Onboarding completed with payload:', data);
      }

      return { success: true };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Storage error';
      return { success: false, error: msg };
    }
  },

  isOnboardingCompleted(): boolean {
    if (!isStorageAvailable()) return false;
    return window.localStorage.getItem(STATUS_KEY) === 'true';
  },

  getOnboardingData(): OnboardingData | null {
    if (!isStorageAvailable()) return defaultOnboardingData;
    try {
      const raw = window.localStorage.getItem(COMPLETED_KEY);
      if (raw) return JSON.parse(raw) as OnboardingData;
      return this.loadDraft() || defaultOnboardingData;
    } catch {
      return defaultOnboardingData;
    }
  },

  resetPrototypeData(): void {
    if (!isStorageAvailable()) return;
    try {
      window.localStorage.removeItem(DRAFT_KEY);
      window.localStorage.removeItem(COMPLETED_KEY);
      window.localStorage.removeItem(STATUS_KEY);
      window.localStorage.removeItem('wallflower_tour_completed');
      window.localStorage.removeItem('wallflower_tour_skipped');
      window.localStorage.removeItem('wallflower_tour_active');
    } catch (e) {
      console.warn('[onboardingService] Failed to reset prototype data:', e);
    }
  },

  getSampleData(): OnboardingData {
    return {
      goals: {
        selectedGoals: ['Understand business health', 'Improve cash flow', 'Test pricing'],
        mainConcern: 'Rising ingredient costs and tight monthly runway buffer',
        targetOutcome: 'Maintain 4 months of runway while expanding B2B wholesale orders',
        targetTimeline: 'Short term (1–3 months)',
      },
      business: {
        name: 'Siam Artisan Roastery & Cafe',
        industry: 'food_beverage',
        location: 'Sukhumvit, Bangkok',
        userRole: 'Founder / Managing Director',
        revenueModel: 'hybrid',
        stage: 'growing',
        employeeCount: 8,
        operatingSince: '2021',
      },
      financials: {
        reportingPeriod: new Date().toISOString().substring(0, 7),
        revenueQuality: 'actual',
        isTypicalMonth: true,
        revenueTrend: 'growing',
        monthlyRevenue: createBusinessValue(285000, 'actual', 'sample'),
        typicalRevenue: createBusinessValue(270000, 'actual', 'sample'),
        monthlyExpenses: createBusinessValue(198000, 'actual', 'sample'),
        expenseBreakdown: {
          Payroll: createBusinessValue(75000, 'actual', 'sample'),
          Rent: createBusinessValue(45000, 'actual', 'sample'),
          Materials: createBusinessValue(52000, 'actual', 'sample'),
          Utilities: createBusinessValue(14000, 'actual', 'sample'),
          Marketing: createBusinessValue(12000, 'actual', 'sample'),
        },
        availableCash: createBusinessValue(420000, 'actual', 'sample'),
        reservedCash: createBusinessValue(100000, 'actual', 'sample'),
        receivables: createBusinessValue(65000, 'actual', 'sample'),
        overdueReceivables: createBusinessValue(18000, 'estimate', 'sample'),
        upcomingPayables: createBusinessValue(48000, 'actual', 'sample'),
        monthlyDebtRepayment: createBusinessValue(22000, 'actual', 'sample'),
        totalDebt: createBusinessValue(260000, 'actual', 'sample'),
      },
      gaps: {
        overdueReceivablesShare: 27,
        customerConcentration: true,
        unusualExpenses: false,
        largePaymentDue: false,
        recentChanges: 'Added 2 wholesale coffee accounts last month.',
      },
      preferences: {
        riskApproach: 'balanced',
        minimumRunwayMonths: 3,
        forecastMonths: 6,
      },
    };
  },
};
