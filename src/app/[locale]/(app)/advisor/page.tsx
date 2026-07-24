'use client';

import { useState, useCallback, useRef } from 'react';
import {
  HelpCircle,
  Play,
  ShieldAlert,
  HeartPulse,
  CheckSquare,
  FileText,
  Send,
  ArrowRight,
  Sparkles,
  Bot,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { CardTitle, Caption } from '@/components/ui/typography';
import { AppPage, PageHeader } from '@/components/ui/layout';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FinancialValue, QualityBadge } from '@/components/ui/domain-values';
import { FadeIn, FadeInView } from '@/components/motion';
import { Link } from '@/lib/i18n/navigation';
import { PageContextualHint } from '@/components/app-shell/product-tour';

export interface ContextualAdvisorAnswer {
  question: string;
  summary: string;
  basis: {
    snapshot: string;
    healthMetric: string;
    relatedRisk: string;
    savedSimulation: string;
    quality: 'actual' | 'estimated' | 'sample';
  };
  actions: {
    type: 'metric' | 'risk' | 'simulation' | 'action_plan' | 'report';
    label: string;
    href: string;
  }[];
}

const MOCK_ANSWERS: Record<string, ContextualAdvisorAnswer> = {
  'Why did cash runway decrease?': {
    question: 'Why did cash runway decrease?',
    summary: 'Cash runway decreased from 2.5 to 2.1 months because monthly operating burn exceeded customer inflows by ฿12,400, while ฿21,340 in customer invoices became 45+ days overdue.',
    basis: {
      snapshot: 'Jan 2025 Financial Snapshot (฿152,400 revenue vs ฿164,800 expenses)',
      healthMetric: 'Liquidity & Runway Buffer (Score: 42/100 · Needs attention)',
      relatedRisk: 'CASH_DEFICIT_FEB (฿12,400 estimated exposure)',
      savedSimulation: '30-Day Customer Delay Impact',
      quality: 'actual',
    },
    actions: [
      { type: 'metric', label: 'Open Related Metric', href: '/business-health' },
      { type: 'risk', label: 'Open Related Risk', href: '/risks' },
      { type: 'simulation', label: 'Test Payment Delay Simulation', href: '/simulations/new?type=payment_delay' },
      { type: 'action_plan', label: 'Add Collection to Action Plan', href: '/actions' },
      { type: 'report', label: 'Generate Cash Report', href: '/reports' },
    ],
  },
  'Which expense changed the most?': {
    question: 'Which expense changed the most?',
    summary: 'Staff payroll increased by 12% to ฿85,000/month (consuming 55.7% of total revenue), representing the single largest expense change over the past 90 days.',
    basis: {
      snapshot: 'Jan 2025 Payroll Expense Breakdown (฿85,000 / 51.6% total burn)',
      healthMetric: 'Operating Efficiency & Cost Structure (Score: 58/100 · Stable)',
      relatedRisk: 'HIGH_PAYROLL_RATIO (฿85,000 recurring exposure)',
      savedSimulation: 'Hire 2 Service Staff',
      quality: 'actual',
    },
    actions: [
      { type: 'metric', label: 'Inspect Expense Breakdown', href: '/business-health' },
      { type: 'risk', label: 'Review Payroll Risk', href: '/risks' },
      { type: 'simulation', label: 'Simulate Headcount Optimization', href: '/simulations/new?type=hire_employees' },
      { type: 'action_plan', label: 'Add Payroll Review Action', href: '/actions' },
    ],
  },
  'Can the business afford another employee?': {
    question: 'Can the business afford another employee?',
    summary: 'Outright hiring at ฿25,000/month is manageable only if new sales ramp up within 3 months; under conservative conditions, cash runway contracts below 1.5 months.',
    basis: {
      snapshot: 'Jan 2025 Cash Reserve (฿245,000 usable cash floor)',
      healthMetric: 'Liquidity & Runway Buffer',
      relatedRisk: 'CASH_DEFICIT_FEB',
      savedSimulation: 'Hire 2 Service Staff (Proceed cautiously posture)',
      quality: 'estimated',
    },
    actions: [
      { type: 'simulation', label: 'Test Hiring Scenario', href: '/simulations/new?type=hire_employees' },
      { type: 'metric', label: 'Open Health Diagnostic', href: '/business-health' },
      { type: 'report', label: 'Generate Decision Memo', href: '/reports' },
    ],
  },
  'What happens if customer payment is delayed?': {
    question: 'What happens if customer payment is delayed?',
    summary: 'A 30-day payment delay on 40% of customer invoices reduces usable cash to ฿140,000 by Month 3, triggering a critical cash deficit on Feb 28.',
    basis: {
      snapshot: 'Jan 2025 Receivables Outstanding (฿53,340 total receivables)',
      healthMetric: 'Working Capital & Collections (Score: 48/100 · Watch)',
      relatedRisk: 'OVERDUE_RECEIVABLES_DRAG (฿21,340 overdue)',
      savedSimulation: 'Customer Payment Delay Simulation',
      quality: 'actual',
    },
    actions: [
      { type: 'risk', label: 'Inspect Overdue Invoices', href: '/risks' },
      { type: 'simulation', label: 'Test Payment Delay', href: '/simulations/new?type=payment_delay' },
      { type: 'action_plan', label: 'Add Invoice Collection Action', href: '/actions' },
    ],
  },
  'Which assumption creates the greatest risk?': {
    question: 'Which assumption creates the greatest risk?',
    summary: 'Sales conversion velocity is your most sensitive assumption, accounting for 65% of the total variance in cash runway forecasting.',
    basis: {
      snapshot: 'Jan 2025 Revenue Trajectory',
      healthMetric: 'Growth Readiness & Expansion Margin',
      relatedRisk: 'DECLINING_GROWTH',
      savedSimulation: 'Sensitivity Analysis Model (Rank 1 Importance)',
      quality: 'estimated',
    },
    actions: [
      { type: 'simulation', label: 'Review Sensitivity Chart', href: '/simulations/sim-hire-01' },
      { type: 'action_plan', label: 'Add Sales Tracking Action', href: '/actions' },
    ],
  },
  'What information is missing?': {
    question: 'What information is missing?',
    summary: 'Supplier payment terms and detailed utility breakdowns for Q4 2024 are currently estimated using sample values rather than verified receipts.',
    basis: {
      snapshot: 'Data Completeness Audit (88% completeness score)',
      healthMetric: 'Operating Efficiency',
      relatedRisk: 'INCOMPLETE_DATA',
      savedSimulation: 'N/A',
      quality: 'sample',
    },
    actions: [
      { type: 'metric', label: 'Update Data Snapshot', href: '/dashboard' },
      { type: 'action_plan', label: 'Add Data Upload Task', href: '/actions' },
    ],
  },
};

export default function AdvisorPage() {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAsk = useCallback((q: string) => {
    if (!q.trim()) return;
    setSelectedQuestion(q);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 400);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleAsk(inputValue);
      setInputValue('');
    }
  };

  const currentAnswer = selectedQuestion ? MOCK_ANSWERS[selectedQuestion] || MOCK_ANSWERS['Why did cash runway decrease?'] : null;

  return (
    <AppPage>
      <FadeIn>
        <div className="space-y-6">
          {/* Page Header */}
          <PageHeader
            title={
              <div className="flex items-center gap-2.5">
                <Bot className="size-6 text-ai shrink-0" aria-hidden="true" />
                <span>Contextual AI Advisor</span>
              </div>
            }
            description="Executive decision guidance grounded in your financial snapshot, business health, active risks, and saved simulations."
            badge={<Badge variant="ai" dot>Mock Decision AI</Badge>}
          />

          <PageContextualHint
            hintKey="advisor"
            title="Contextual Decision Guidance"
            message="Ask any strategic question or select a suggested prompt to inspect provenance basis and recommended actions."
          />

          {/* Prototype AI Disclaimer Banner */}
          <div className="p-3.5 rounded-xl border border-ai/20 bg-ai-soft/10 flex items-start gap-2.5 text-xs text-ai">
            <Sparkles className="size-4 shrink-0 mt-0.5" />
            <div>
              <strong>Deterministic Prototype Engine:</strong> Advisor responses are mock contextual explanations generated directly from your structured business baseline and rule engine. No unverified AI hallucinations or real API calls.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 cols: Question Prompts & Answer Flow */}
            <div className="lg:col-span-8 space-y-6">
              {/* Contextual Question Prompts */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block">Contextual Questions</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CONTEXTUAL_PROMPTS.map((prompt) => (
                    <button
                      key={prompt.title}
                      type="button"
                      onClick={() => handleAsk(prompt.title)}
                      className={cn(
                        'p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer text-xs',
                        selectedQuestion === prompt.title
                          ? 'border-ai bg-ai-soft/20 text-ai font-semibold shadow-2xs'
                          : 'border-border bg-surface hover:bg-surface-subtle text-text-primary'
                      )}
                    >
                      <HelpCircle className="size-4 text-ai shrink-0 mt-0.5" />
                      <span>{prompt.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <Card className="p-6 space-y-3 border-ai/20">
                  <div className="flex items-center gap-2 text-ai font-semibold text-xs">
                    <div className="size-2 rounded-full bg-ai animate-pulse" />
                    <span>Analyzing business baseline, risks, and simulations...</span>
                  </div>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </Card>
              )}

              {/* Answer Card with Provenance & Actions */}
              {!loading && currentAnswer && (
                <FadeInView className="space-y-6">
                  {/* Direct Answer */}
                  <Card className="p-5 md:p-6 space-y-4 border-ai/30 bg-surface shadow-xs">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="ai" dot>Direct Answer</Badge>
                        <QualityBadge quality={currentAnswer.basis.quality} />
                      </div>
                      <span className="text-xs text-text-muted">Jan 2025 Context</span>
                    </div>

                    <p className="text-sm sm:text-base font-medium text-text-primary leading-relaxed">
                      {currentAnswer.summary}
                    </p>

                    {/* Data Provenance Basis Box */}
                    <div className="p-4 rounded-xl border border-border bg-surface-subtle space-y-2 text-xs">
                      <span className="font-bold text-text-muted uppercase tracking-wider block">Proven Data Basis & Sources</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-text-secondary">
                        <div>Snapshot: <strong className="text-text-primary">{currentAnswer.basis.snapshot}</strong></div>
                        <div>Health Metric: <strong className="text-text-primary">{currentAnswer.basis.healthMetric}</strong></div>
                        <div>Related Risk: <strong className="text-text-primary">{currentAnswer.basis.relatedRisk}</strong></div>
                        <div>Saved Simulation: <strong className="text-text-primary">{currentAnswer.basis.savedSimulation}</strong></div>
                      </div>
                    </div>

                    {/* Embedded Action Buttons */}
                    <div className="space-y-2 pt-2 border-t border-border">
                      <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block">Recommended Actions</span>
                      <div className="flex flex-wrap gap-2">
                        {currentAnswer.actions.map((act) => (
                          <Link
                            key={act.label}
                            href={act.href}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-text-primary transition-colors cursor-pointer shadow-2xs"
                          >
                            {act.type === 'metric' && <HeartPulse className="size-3.5 text-brand" />}
                            {act.type === 'risk' && <ShieldAlert className="size-3.5 text-danger" />}
                            {act.type === 'simulation' && <Play className="size-3.5 text-brand" />}
                            {act.type === 'action_plan' && <CheckSquare className="size-3.5 text-emerald-600" />}
                            {act.type === 'report' && <FileText className="size-3.5 text-text-muted" />}
                            <span>{act.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </Card>
                </FadeInView>
              )}

              {/* Input Composer */}
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex items-center gap-2 p-2 rounded-xl border border-border bg-surface shadow-xs">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask Advisor about cash flow, runway, risks, or hiring plans..."
                    className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-transparent text-text-primary focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-lg bg-ai text-white hover:bg-ai/90 transition-colors cursor-pointer"
                  >
                    <Send className="size-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right 4 cols: Business Context Sidebar */}
            <aside className="lg:col-span-4 space-y-4">
              <Card className="p-5 space-y-4 sticky top-20">
                <div className="border-b border-border pb-3">
                  <CardTitle>Active Business Context</CardTitle>
                  <Caption className="text-text-muted">Data grounded in Jan 2025 snapshot</Caption>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Monthly Revenue</span>
                    <FinancialValue value={152400} className="font-bold text-text-primary" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Monthly Expenses</span>
                    <FinancialValue value={164800} className="font-bold text-text-primary" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Usable Cash</span>
                    <FinancialValue value={245000} className="font-bold text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Cash Runway</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">2.1 months</span>
                  </div>
                  <div className="flex justify-between border-t border-border/50 pt-2">
                    <span className="text-text-muted">Active Critical Risks</span>
                    <span className="font-bold text-danger">2 Critical</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/business-health" className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-hover">
                    <span>View full health diagnostic</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </Card>
            </aside>
          </div>
        </div>
      </FadeIn>
    </AppPage>
  );
}

const CONTEXTUAL_PROMPTS = [
  { title: 'Why did cash runway decrease?' },
  { title: 'Which expense changed the most?' },
  { title: 'Can the business afford another employee?' },
  { title: 'What happens if customer payment is delayed?' },
  { title: 'Which assumption creates the greatest risk?' },
  { title: 'What information is missing?' },
];
