// src/features/dashboard/adapters/dashboard.adapter.ts

export type HealthStatus = 'healthy' | 'warning' | 'critical';

export interface BusinessPulseData {
  status: HealthStatus;
  summary: string;
  dataAsOf: string;
  nextAction?: string;
}

export interface KpiData {
  label: string;
  value: string;
  unit?: string;
  /** Raw numeric value for CountUp animation */
  numericValue?: number;
  change?: number;
  changePeriod?: string;
  status?: 'healthy' | 'warning' | 'danger';
  tooltip?: string;
  trend?: number[];
}

export interface TrendDataPoint {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  cashFlow: number;
}

export type InsightCategory = 'risk' | 'opportunity' | 'action';

export interface InsightData {
  id: string;
  category: InsightCategory;
  title: string;
  description: string;
  href?: string;
}

export interface HealthMetric {
  label: string;
  value: string | number;
  unit?: string;
  status: 'healthy' | 'warning' | 'danger';
  description: string;
}

export interface HealthScoreItem {
  score: number;
  status: HealthStatus;
  metrics: HealthMetric[];
}

export interface HealthDetailsData {
  financial: HealthScoreItem;
  operational: HealthScoreItem;
  growth: HealthScoreItem;
  strengths: string[];
  weaknesses: string[];
  completeness: {
    score: number;
    periodCount: number;
    lastUpdated: string;
    staleDays: number;
    hasStaleWarning: boolean;
    hasHistoryWarning: boolean;
  };
}

export interface DashboardData {
  pulse: BusinessPulseData;
  kpis: KpiData[];
  trends: TrendDataPoint[];
  insights: InsightData[];
  health: HealthDetailsData;
}

/**
 * Fetch dashboard data for the current user's business.
 * Mock implementation — returns realistic Thai SME data for GreenCafe.
 * Will be replaced with real server action calls later.
 */
export async function getDashboardData(): Promise<DashboardData> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  return {
    pulse: {
      status: 'healthy',
      summary: 'Your business is performing well. Revenue is trending up and cash reserves are stable.',
      dataAsOf: '2025-01-15',
      nextAction: 'Review upcoming rent payment due Jan 20',
    },
    kpis: [
      {
        label: 'Monthly Revenue',
        value: '฿152,400',
        numericValue: 152400,
        change: 8.2,
        changePeriod: 'vs last month',
        status: 'healthy',
        tooltip: 'Total revenue for the current month',
        trend: [128000, 135000, 141000, 138000, 145000, 152400],
      },
      {
        label: 'Cash Runway',
        value: '4.2',
        numericValue: 4.2,
        unit: 'months',
        change: 0.3,
        changePeriod: 'vs last month',
        status: 'healthy',
        tooltip: 'How long your cash reserves can cover expenses',
        trend: [3.8, 3.9, 4.0, 3.9, 4.1, 4.2],
      },
      {
        label: 'Profit Margin',
        value: '18.5',
        numericValue: 18.5,
        unit: '%',
        change: 2.1,
        changePeriod: 'vs last month',
        status: 'healthy',
        tooltip: 'Net profit as a percentage of revenue',
        trend: [14.2, 15.1, 16.0, 15.8, 16.4, 18.5],
      },
      {
        label: 'Monthly Burn',
        value: '฿124,200',
        numericValue: 124200,
        change: -3.4,
        changePeriod: 'vs last month',
        status: 'healthy',
        tooltip: 'Total monthly operating expenses',
        trend: [132000, 130000, 128500, 129000, 128600, 124200],
      },
    ],
    trends: [
      { month: 'Aug', revenue: 128000, expenses: 132000, profit: -4000, cashFlow: 185000 },
      { month: 'Sep', revenue: 135000, expenses: 130000, profit: 5000, cashFlow: 190000 },
      { month: 'Oct', revenue: 141000, expenses: 128500, profit: 12500, cashFlow: 195000 },
      { month: 'Nov', revenue: 138000, expenses: 129000, profit: 9000, cashFlow: 192000 },
      { month: 'Dec', revenue: 145000, expenses: 128600, profit: 16400, cashFlow: 198000 },
      { month: 'Jan', revenue: 152400, expenses: 124200, profit: 28200, cashFlow: 210000 },
    ],
    insights: [
      {
        id: 'insight-1',
        category: 'risk',
        title: 'Rent increase upcoming',
        description: 'Your landlord notified a 5% rent increase starting March. This will reduce monthly profit by ~฿3,500.',
        href: '/simulations',
      },
      {
        id: 'insight-2',
        category: 'opportunity',
        title: 'Weekend revenue potential',
        description: 'Saturday sales are 40% higher than weekdays. Consider extending weekend hours or adding a brunch menu.',
        href: '/simulations',
      },
      {
        id: 'insight-3',
        category: 'action',
        title: 'Update expense records',
        description: 'You have 3 unrecorded transactions from last week. Keeping records current improves forecast accuracy.',
      },
    ],
    health: {
      financial: {
        score: 78,
        status: 'healthy',
        metrics: [
          {
            label: 'Cash Runway',
            value: '4.2',
            unit: 'months',
            status: 'healthy',
            description: 'How long your cash reserves will last if you do not earn any more money and keep spending at your current rate.',
          },
          {
            label: 'Profit Margin',
            value: '18.5',
            unit: '%',
            status: 'healthy',
            description: 'The percentage of sales revenue that is actual profit after paying all business costs.',
          },
          {
            label: 'Debt-to-Revenue',
            value: '65.6',
            unit: '%',
            status: 'healthy',
            description: 'Compares how much you owe to how much you earn in sales. A lower percentage is safer.',
          },
          {
            label: 'Burn Rate',
            value: '฿124,200',
            unit: '/mo',
            status: 'healthy',
            description: 'The speed at which your business spends cash to run operations each month.',
          },
        ],
      },
      operational: {
        score: 85,
        status: 'healthy',
        metrics: [
          {
            label: 'Working Capital Ratio',
            value: '1.5',
            status: 'healthy',
            description: 'Your cash cushion to pay bills due in the next year. A ratio above 1.0 means you can cover upcoming payments.',
          },
          {
            label: 'Expense-to-Revenue',
            value: '81.5',
            unit: '%',
            status: 'healthy',
            description: 'How much you spend on operations for every ฿100 earned. Keeping this low leaves more room for profit.',
          },
          {
            label: 'Receivables Turnover',
            value: '10.2x',
            status: 'healthy',
            description: 'How quickly your customers pay what they owe you. A higher number means money flows back into your business faster.',
          },
          {
            label: 'Payables Period',
            value: '30',
            unit: 'days',
            status: 'healthy',
            description: 'The average number of days you take to pay your suppliers and vendors.',
          },
        ],
      },
      growth: {
        score: 62,
        status: 'warning',
        metrics: [
          {
            label: 'LTV to CAC Ratio',
            value: '2.1x',
            status: 'warning',
            description: 'Compares value of a customer over time with the cost to get them. A value of 3x or higher is ideal.',
          },
          {
            label: 'Revenue Growth Rate',
            value: '8.2',
            unit: '%',
            status: 'healthy',
            description: 'The percentage speed at which your sales are expanding month over month.',
          },
          {
            label: 'Cash Buffer',
            value: '2.0x',
            unit: 'burn',
            status: 'warning',
            description: 'The emergency cash fund you keep in the bank, measured in months of regular expenses.',
          },
        ],
      },
      strengths: [
        'Stable monthly operating burn rate.',
        'Steady growth in profit margins month-over-month.',
        'Excellent receivables collection speed (customers pay on time).',
      ],
      weaknesses: [
        'Relatively low LTV/CAC ratio indicating customer acquisition costs are high.',
        'Limited cash buffer for sudden economic or operational changes.',
      ],
      completeness: {
        score: 90,
        periodCount: 6,
        lastUpdated: '2025-01-15',
        staleDays: 5,
        hasStaleWarning: false,
        hasHistoryWarning: false,
      },
    },
  };
}

