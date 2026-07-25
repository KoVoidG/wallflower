'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Play,
  ShieldAlert,
  HeartPulse,
  CheckSquare,
  Send,
  ArrowRight,
  Bot,
  Plus,
  ChevronDown,
  Info,
  Clock,
  RotateCcw,
  X,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { AppPage } from '@/components/ui/layout';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { FinancialValue } from '@/components/ui/domain-values';
import { FadeIn, Expand } from '@/components/motion';
import { Link } from '@/lib/i18n/navigation';

export type ActiveContextType =
  | 'entire_business'
  | 'cash_flow'
  | 'business_health'
  | 'active_risks'
  | 'simulations';

export interface EvidenceItem {
  label: string;
  value: string;
  note?: string;
  quality?: 'actual' | 'estimated' | 'sample';
}

export interface ContextualAction {
  label: string;
  href: string;
  type: 'metric' | 'risk' | 'simulation' | 'action_plan' | 'health' | 'report';
}

export interface AdvisorMessageItem {
  id: string;
  sender: 'user' | 'advisor';
  text?: string;
  context?: ActiveContextType;
  timestamp: string;
  // Structured Advisor Response Anatomy (Req 10 & 11)
  directAnswer?: string;
  usedSignals?: string[];
  evidence?: EvidenceItem[];
  interpretation?: string;
  recommendedAction?: { title: string; description: string; href: string };
  uncertainty?: string;
  reasoningMetrics?: string[];
  actions?: ContextualAction[];
  followUpPrompts?: string[];
  isError?: boolean;
  errorMessage?: string;
}

export interface ConversationHistoryItem {
  id: string;
  title: string;
  lastUpdated: string;
  context: ActiveContextType;
  messages: AdvisorMessageItem[];
}

const CONTEXT_OPTIONS = [
  { value: 'entire_business', label: 'Entire Business' },
  { value: 'cash_flow', label: 'Cash Flow Workspace' },
  { value: 'business_health', label: 'Business Health' },
  { value: 'active_risks', label: 'Active Risks' },
  { value: 'simulations', label: 'Simulation Workspace' },
];

const CONTEXT_PROMPTS_MAP: Record<
  ActiveContextType,
  { title: string; subtext: string }[]
> = {
  entire_business: [
    {
      title: 'Why did cash runway decrease?',
      subtext:
        'Inspect liquidity drag, monthly burn deficit & overdue receivables',
    },
    {
      title: 'Which risk should I handle first?',
      subtext: 'Prioritize active risks by financial exposure & urgency',
    },
    {
      title: 'What is causing my overdue receivables?',
      subtext: 'Review invoice aging breakdown & customer collection delays',
    },
    {
      title: 'Can the business afford another employee?',
      subtext: 'Evaluate payroll commitment against usable cash buffer',
    },
  ],
  cash_flow: [
    {
      title: 'Why did cash runway decrease?',
      subtext: 'Inspect monthly burn rate vs customer inflow balance',
    },
    {
      title: 'What is causing my overdue receivables?',
      subtext: 'Review 45+ day overdue invoice drag',
    },
    {
      title: 'How long will my cash buffer last?',
      subtext: 'Project runway under baseline operating burn',
    },
    {
      title: 'Should I simulate a payment acceleration?',
      subtext: 'Evaluate early payment discount trade-offs',
    },
  ],
  business_health: [
    {
      title: 'Which health dimension is weakest?',
      subtext: 'Inspect working capital and liquidity scores',
    },
    {
      title: 'Why is liquidity score 42/100?',
      subtext: 'Review operating cash flow vs debt obligations',
    },
    {
      title: 'How can I improve operating margin?',
      subtext: 'Identify fixed cost reductions',
    },
    {
      title: 'Is my payroll ratio within benchmark?',
      subtext: 'Compare staff expenses against revenue',
    },
  ],
  active_risks: [
    {
      title: 'Which risk should I handle first?',
      subtext: 'Prioritize CASH_DEFICIT_FEB by exposure',
    },
    {
      title: 'What is the financial impact of CASH_DEFICIT_FEB?',
      subtext: 'Inspect estimated ฿12,400 deficit',
    },
    {
      title: 'How can I mitigate overdue receivables drag?',
      subtext: 'Review invoice collection action steps',
    },
    {
      title: 'Are there any new risk warnings?',
      subtext: 'Check latest automated risk evaluation',
    },
  ],
  simulations: [
    {
      title: 'Can the business afford another employee?',
      subtext: 'Simulate ฿25,000/mo salary commitment',
    },
    {
      title: 'How would a 30-day payment delay affect runway?',
      subtext: 'Test customer delay liquidity impact',
    },
    {
      title: 'What happens if supplier price increases 10%?',
      subtext: 'Evaluate gross margin compression',
    },
    {
      title: 'Should I test SME debt financing?',
      subtext: 'Calculate loan principal payback horizon',
    },
  ],
};

const STAGED_LOADING_TEXTS = [
  'Reviewing selected business context...',
  'Checking relevant metrics and risks...',
  'Preparing grounded recommendation...',
];

const PRESET_ANSWERS: Record<
  string,
  Omit<AdvisorMessageItem, 'id' | 'sender' | 'timestamp'>
> = {
  'Why did cash runway decrease?': {
    directAnswer:
      'Your current cash runway is 2.1 months because monthly operating burn exceeded customer revenue by ฿12,400, while ฿21,340 in customer receivables became 45+ days overdue.',
    usedSignals: [
      'Cash runway (2.1 mo)',
      'Net monthly burn (-฿12,400)',
      'Overdue receivables (฿21,340)',
    ],
    evidence: [
      {
        label: 'Cash Runway',
        value: '2.1 months',
        note: 'Jan 2025 baseline',
        quality: 'actual',
      },
      {
        label: 'Net Monthly Burn',
        value: '-฿12,400/mo',
        note: 'Operating deficit',
        quality: 'actual',
      },
      {
        label: 'Overdue Receivables',
        value: '฿21,340',
        note: '3 invoices > 30 days',
        quality: 'actual',
      },
    ],
    interpretation:
      'With usable cash reserves at ฿245,000, continuing the current burn rate without collecting overdue receivables will cause a critical liquidity buffer pressure in Month 3 (Feb 28).',
    recommendedAction: {
      title: 'Initiate Collection & Test Payment Acceleration',
      description:
        'Contact customers with overdue invoices within 7 days. Offer a 2% early payment discount for immediate settlement.',
      href: '/simulations/new?type=payment_delay',
    },
    uncertainty:
      'Supplier payment terms for Q4 2024 remain estimated from snapshot averages.',
    reasoningMetrics: [
      'Metrics considered: Usable Cash Buffer (฿245,000), Monthly Net Burn (-฿12,400), DSO (45 days)',
      'Active rule applied: CASH_DEFICIT_FEB (Critical urgency rule)',
      'Assumptions: Monthly revenue stays stable at ฿152,400 without unannounced price changes',
    ],
    actions: [
      { label: 'Inspect Overdue Invoices', href: '/risks', type: 'risk' },
      {
        label: 'Test Payment Delay',
        href: '/simulations/new?type=payment_delay',
        type: 'simulation',
      },
      { label: 'Add to Action Plan', href: '/actions', type: 'action_plan' },
    ],
    followUpPrompts: [
      'How would a 30-day payment delay affect runway?',
      'Which invoice should I prioritise first?',
      'Should I simulate a price increase?',
    ],
  },
  'Which risk should I handle first?': {
    directAnswer:
      'Prioritize CASH_DEFICIT_FEB (Critical urgency). It carries an estimated exposure of ฿12,400 and threatens your minimum cash reserve within 60 days.',
    usedSignals: [
      'Top active risk (CASH_DEFICIT_FEB)',
      'Usable cash buffer (฿245,000)',
    ],
    evidence: [
      {
        label: 'Top Urgency Risk',
        value: 'CASH_DEFICIT_FEB',
        note: 'Critical rating',
        quality: 'actual',
      },
      {
        label: 'Estimated Exposure',
        value: '฿12,400',
        note: 'Estimated Feb 28 deficit',
        quality: 'actual',
      },
      {
        label: 'Usable Buffer',
        value: '฿245,000',
        note: 'Jan 2025 baseline',
        quality: 'actual',
      },
    ],
    interpretation:
      'Resolving liquidity pressure before payroll due dates prevents emergency borrowing costs and supplier supply-chain disruption.',
    recommendedAction: {
      title: 'Inspect Risk Evidence & Run Mitigation Scenario',
      description:
        'Review the underlying receivables evidence in Risk Center, then launch a decision simulation to test cash recovery options.',
      href: '/risks',
    },
    uncertainty:
      'Customer payment response rate is modeled on past 90-day averages.',
    reasoningMetrics: [
      'Metrics considered: Risk urgency ranking, estimated cash deficit date, reserve floor',
      'Active rule applied: Rule R-001 (Cash Deficit Horizon < 60 days)',
    ],
    actions: [
      { label: 'Open Risk Center', href: '/risks', type: 'risk' },
      {
        label: 'Build Decision Simulation',
        href: '/simulations/new',
        type: 'simulation',
      },
      { label: 'Add to Action Plan', href: '/actions', type: 'action_plan' },
    ],
    followUpPrompts: [
      'What is causing my overdue receivables?',
      'How fast can I recover ฿12,400 in cash?',
    ],
  },
  'What is causing my overdue receivables?': {
    directAnswer:
      'Overdue receivables total ฿21,340 across 3 key customer accounts that are past 30 days, creating a working capital drag equal to 40% of your total receivables.',
    usedSignals: [
      'Overdue receivables (฿21,340)',
      'Total receivables (฿53,340)',
    ],
    evidence: [
      {
        label: 'Overdue Total',
        value: '฿21,340',
        note: '3 invoices past 30 days',
        quality: 'actual',
      },
      {
        label: 'Total Receivables',
        value: '฿53,340',
        note: 'Jan 2025 snapshot',
        quality: 'actual',
      },
      {
        label: 'Collection Lag',
        value: '45 days',
        note: 'DSO average',
        quality: 'actual',
      },
    ],
    interpretation:
      'Customer payment terms were extended without formal credit checks. Collecting these 3 invoices would restore your cash runway back to 3.2 months immediately.',
    recommendedAction: {
      title: 'Add Automated Reminders & Credit Checks',
      description:
        'Add invoice collection milestones to your Action Plan and enforce 15-day payment terms for new accounts.',
      href: '/actions',
    },
    reasoningMetrics: [
      'Metrics considered: Accounts Receivable Aging, Days Sales Outstanding (DSO), Working Capital Ratio',
    ],
    actions: [
      { label: 'Review Overdue Invoices', href: '/risks', type: 'risk' },
      { label: 'Add Collection Task', href: '/actions', type: 'action_plan' },
    ],
    followUpPrompts: [
      'Why did cash runway decrease?',
      'Should I simulate a longer payment delay?',
    ],
  },
  'Can the business afford another employee?': {
    directAnswer:
      'Outright hiring at ฿25,000/month is manageable only if new revenue ramps up within 3 months; under conservative conditions, runway drops from 2.1 to 1.5 months.',
    usedSignals: ['Cash runway (2.1 mo)', 'Usable cash buffer (฿245,000)'],
    evidence: [
      {
        label: 'Monthly Base Salary',
        value: '฿25,000/mo',
        note: '1 new hire',
        quality: 'actual',
      },
      {
        label: 'Total Monthly Commitment',
        value: '฿28,750/mo',
        note: 'Includes 15% benefits',
        quality: 'estimated',
      },
      {
        label: 'Projected Runway Shift',
        value: '2.1 → 1.5 months',
        note: 'Conservative case',
        quality: 'estimated',
      },
    ],
    interpretation:
      'Fixed monthly payroll increases immediately from Day 1, while revenue ramp-up takes an estimated 90 days.',
    recommendedAction: {
      title: 'Run Headcount Optimization Simulation',
      description:
        'Test headcount, salary, and ramp-up assumptions against your Jan 2025 baseline before making a hiring offer.',
      href: '/simulations/new?type=hire_employees',
    },
    reasoningMetrics: [
      'Metrics considered: Fixed Cost Ratio, Usable Cash Floor, Runway Sensitivity',
    ],
    actions: [
      {
        label: 'Test Hiring Scenario',
        href: '/simulations/new?type=hire_employees',
        type: 'simulation',
      },
      {
        label: 'View Health Diagnostic',
        href: '/business-health',
        type: 'health',
      },
    ],
    followUpPrompts: [
      'What happens if customer payment is delayed?',
      'Which expense changed the most?',
    ],
  },
};

export default function AdvisorPage() {
  const [activeContext, setActiveContext] =
    useState<ActiveContextType>('entire_business');
  const [messages, setMessages] = useState<AdvisorMessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStageIndex, setLoadingStageIndex] = useState(0);
  const [showExplainableId, setShowExplainableId] = useState<string | null>(
    null,
  );
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [showMobileContext, setShowMobileContext] = useState(false);
  const [showDataBasisDetails, setShowDataBasisDetails] = useState(false);
  const [showRelatedLinksDetails, setShowRelatedLinksDetails] = useState(false);

  // History Store
  const [historyList, setHistoryList] = useState<ConversationHistoryItem[]>([
    {
      id: 'conv-1',
      title: 'Cash Runway & Receivables Audit',
      lastUpdated: 'Jan 24, 2025',
      context: 'cash_flow',
      messages: [],
    },
    {
      id: 'conv-2',
      title: 'Hiring Decision & Payroll Capacity',
      lastUpdated: 'Jan 22, 2025',
      context: 'simulations',
      messages: [],
    },
  ]);

  const messageEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll when messages update
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Loading Stage Timer (Req 7)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingStageIndex((prev) => {
          if (prev < STAGED_LOADING_TEXTS.length - 1) return prev + 1;
          return prev;
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleSendMessage = useCallback(
    (questionText: string) => {
      const text = questionText.trim();
      if (!text || isGenerating) return;

      const userMsgId = `user-${Date.now()}`;
      const userMsg: AdvisorMessageItem = {
        id: userMsgId,
        sender: 'user',
        text,
        context: activeContext,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputText('');
      setLoadingStageIndex(0);
      setIsGenerating(true);

      setTimeout(() => {
        setIsGenerating(false);
        const advisorMsgId = `adv-${Date.now()}`;
        const preset = PRESET_ANSWERS[text];

        if (preset) {
          setMessages((prev) => [
            ...prev,
            {
              id: advisorMsgId,
              sender: 'advisor',
              timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
              ...preset,
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: advisorMsgId,
              sender: 'advisor',
              timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
              directAnswer: `Regarding "${text}": Your current cash runway is 2.1 months with a net monthly operating deficit of ฿12,400 and ฿53,340 in accounts receivable.`,
              usedSignals: [
                'Cash runway (2.1 mo)',
                'Usable cash buffer (฿245,000)',
              ],
              evidence: [
                {
                  label: 'Usable Cash',
                  value: '฿245,000',
                  note: 'Jan 2025 baseline',
                  quality: 'actual',
                },
                {
                  label: 'Monthly Revenue',
                  value: '฿152,400',
                  note: 'Verified snapshot',
                  quality: 'actual',
                },
                {
                  label: 'Monthly Expenses',
                  value: '฿164,800',
                  note: 'Verified snapshot',
                  quality: 'actual',
                },
              ],
              interpretation:
                'Wallflower has grounded this response in your Jan 2025 financial snapshot. To test specific decisions, launch a simulation or review active risk alerts.',
              recommendedAction: {
                title: 'Test Decision Impact in Simulation Workspace',
                description:
                  'Configure custom revenue, expense, or one-time capital levers to evaluate runway impact.',
                href: '/simulations/new',
              },
              reasoningMetrics: [
                'Metrics evaluated: Cash runway (2.1 mo), Monthly burn rate (-฿12,400), Usable cash buffer (฿245,000)',
                'Grounded data source: January 2025 Verified Accounting Audit',
              ],
              actions: [
                {
                  label: 'Build Decision Simulation',
                  href: '/simulations/new',
                  type: 'simulation',
                },
                { label: 'Inspect Active Risks', href: '/risks', type: 'risk' },
              ],
              followUpPrompts: [
                'Why did cash runway decrease?',
                'Which risk should I handle first?',
                'Can the business afford another employee?',
              ],
            },
          ]);
        }
      }, 450);
    },
    [activeContext, isGenerating],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  const handleNewConversation = () => {
    if (messages.length > 0) {
      const firstUserText =
        messages.find((m) => m.sender === 'user')?.text || 'Business Query';
      setHistoryList((prev) => [
        {
          id: `conv-${Date.now()}`,
          title: firstUserText.slice(0, 32),
          lastUpdated: 'Just now',
          context: activeContext,
          messages: [...messages],
        },
        ...prev,
      ]);
    }
    setMessages([]);
    setInputText('');
  };

  const currentPrompts =
    CONTEXT_PROMPTS_MAP[activeContext] || CONTEXT_PROMPTS_MAP.entire_business;

  return (
    <AppPage>
      <FadeIn>
        <div className="space-y-6">
          {/* Header (Req 1 & 15) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <Bot className="size-6 text-ai shrink-0" aria-hidden="true" />
                <h1 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight">
                  AI Advisor
                </h1>
              </div>
              <p className="text-xs text-text-secondary">
                Ask questions about your business performance, risks, and
                possible decisions.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {/* Mobile Business Context Button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs lg:hidden"
                onClick={() => setShowMobileContext(!showMobileContext)}
              >
                <Info className="size-3.5" />
                <span>Business Context</span>
              </Button>

              {/* Conversation History Drawer Button (Req 15) */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
              >
                <Clock className="size-3.5" />
                <span>History ({historyList.length})</span>
              </Button>

              {/* New Conversation Action Button */}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="text-xs"
                onClick={handleNewConversation}
              >
                <Plus className="size-3.5" />
                <span>New Conversation</span>
              </Button>
            </div>
          </div>

          {/* Conversation History Drawer Expander (Req 15 & 16) */}
          <Expand open={showHistoryDrawer}>
            <div className="p-4 rounded-xl border border-border bg-surface-subtle/60 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="font-bold text-text-primary uppercase tracking-wider text-[11px]">
                  Recent Business Conversations
                </span>
                <button
                  type="button"
                  onClick={() => setShowHistoryDrawer(false)}
                  className="text-text-muted hover:text-text-primary p-1 cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {historyList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (item.messages.length > 0) setMessages(item.messages);
                      setShowHistoryDrawer(false);
                    }}
                    className="p-3 rounded-lg border border-border bg-surface hover:bg-surface-subtle transition-colors cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between font-semibold text-text-primary text-xs">
                      <span className="truncate">{item.title}</span>
                      <Badge variant="neutral" className="text-[9px] uppercase">
                        {item.context.replace('_', ' ')}
                      </Badge>
                    </div>
                    <span className="text-[10px] text-text-muted block">
                      Last active: {item.lastUpdated}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Expand>

          {/* Desktop Layout Contract: Conversation (minmax(0,1fr)) + Sticky Context Panel (320px–340px) (Req 1, 2, 4) */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
            {/* Main Conversation Column (min-w-0 - Req 2 & 4) */}
            <div className="min-w-0 space-y-4">
              {/* Messages & Empty State Container */}
              <div className="space-y-4">
                {/* 1. Empty Conversation State Inside Same Workspace Frame (Req 4 & 17) */}
                {messages.length === 0 && (
                  <div className="p-6 sm:p-8 rounded-2xl border border-border bg-surface shadow-2xs space-y-6">
                    <div className="space-y-2 max-w-lg text-left">
                      <div className="p-2.5 rounded-full bg-ai-soft/20 text-ai inline-flex">
                        <Bot className="size-6" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
                        Ask Wallflower about your business
                      </h2>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Inquire about cash flow deficits, runway projections,
                        overdue receivables, or test potential decisions.
                      </p>
                    </div>

                    {/* Contextual Suggested Question Cards (Max 4 - Req 17) */}
                    <div className="space-y-2.5 pt-2 text-left">
                      <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                        Suggested Business Questions
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {currentPrompts.map((q) => (
                          <button
                            key={q.title}
                            type="button"
                            onClick={() => handleSendMessage(q.title)}
                            className="p-3.5 rounded-xl border border-border bg-surface-subtle/40 hover:bg-surface hover:border-ai/40 text-left transition-all cursor-pointer space-y-1 shadow-2xs group flex flex-col justify-between"
                          >
                            <div className="flex items-center justify-between text-xs font-semibold text-text-primary group-hover:text-ai">
                              <span>{q.title}</span>
                              <ArrowRight className="size-3.5 text-text-muted group-hover:text-ai transition-transform group-hover:translate-x-0.5" />
                            </div>
                            <p className="text-[11px] text-text-muted leading-tight">
                              {q.subtext}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Conversation Transcript (Req 8, 9, 10, 11, 12, 13) */}
                {messages.length > 0 && (
                  <div className="space-y-6">
                    {messages.map((msg) => {
                      if (msg.sender === 'user') {
                        return (
                          /* User Message Bubble (Req 9) */
                          <div key={msg.id} className="flex justify-end">
                            <div className="max-w-xl p-3.5 rounded-xl border border-border/80 bg-surface-subtle text-xs text-text-primary space-y-1 shadow-2xs">
                              <div className="flex items-center justify-between gap-4 text-[10px] text-text-muted border-b border-border/40 pb-1">
                                <span className="font-semibold text-text-primary">
                                  You
                                </span>
                                <span>{msg.timestamp}</span>
                              </div>
                              <p className="font-medium leading-relaxed pt-0.5">
                                {msg.text}
                              </p>
                            </div>
                          </div>
                        );
                      }

                      /* Advisor Response Surface (Req 9, 10, 11, 12, 13) */
                      return (
                        <Card
                          key={msg.id}
                          className="p-5 sm:p-6 space-y-4 border-ai/30 bg-surface shadow-xs min-w-0"
                        >
                          {/* Header */}
                          <div className="flex items-center justify-between border-b border-border/60 pb-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="ai" dot>
                                Wallflower Advisor
                              </Badge>
                              <span className="text-xs text-text-muted font-medium">
                                Jan 2025 Context
                              </span>
                            </div>
                            <span className="text-[11px] text-text-muted">
                              {msg.timestamp}
                            </span>
                          </div>

                          {/* 1. Direct Answer (Req 10) */}
                          {msg.directAnswer && (
                            <p className="text-xs sm:text-sm font-semibold text-text-primary leading-relaxed max-w-2xl">
                              {msg.directAnswer}
                            </p>
                          )}

                          {/* Signal Connection Line (Req 11) */}
                          {msg.usedSignals && msg.usedSignals.length > 0 && (
                            <div className="text-[11px] text-text-muted flex items-center gap-1.5 flex-wrap pt-0.5">
                              <span className="font-medium text-text-primary">
                                Used in this answer:
                              </span>
                              {msg.usedSignals.map((sig, idx) => (
                                <span
                                  key={idx}
                                  className="bg-surface-subtle px-2 py-0.5 rounded-md border border-border/60 font-medium text-text-primary text-[10px]"
                                >
                                  {sig}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* 2. Compact Evidence Section (Max 3 - Req 10) */}
                          {msg.evidence && msg.evidence.length > 0 && (
                            <div className="space-y-2">
                              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                                Grounded Evidence
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                                {msg.evidence.slice(0, 3).map((ev, i) => (
                                  <div
                                    key={i}
                                    className="p-2.5 rounded-lg border border-border/80 bg-surface-subtle/50 space-y-0.5"
                                  >
                                    <span className="text-text-muted text-[11px] block">
                                      {ev.label}
                                    </span>
                                    <span className="font-bold text-text-primary block">
                                      {ev.value}
                                    </span>
                                    {ev.note && (
                                      <span className="text-text-muted text-[10px] block">
                                        {ev.note}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 3. Business Effect / Why It Matters (Req 10) */}
                          {msg.interpretation && (
                            <div className="p-3.5 rounded-xl border border-brand/20 bg-brand-soft/10 text-xs text-text-primary space-y-1 max-w-2xl">
                              <span className="font-bold text-brand uppercase tracking-wider text-[10px] block">
                                Business Effect & Interpretation
                              </span>
                              <p className="leading-relaxed">
                                {msg.interpretation}
                              </p>
                            </div>
                          )}

                          {/* 4. Highlighted Recommended Next Step (Req 10) */}
                          {msg.recommendedAction && (
                            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs text-text-primary space-y-1.5 max-w-2xl">
                              <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[10px] block">
                                Recommended Next Step
                              </span>
                              <h4 className="font-bold text-text-primary">
                                {msg.recommendedAction.title}
                              </h4>
                              <p className="text-text-secondary leading-relaxed">
                                {msg.recommendedAction.description}
                              </p>
                            </div>
                          )}

                          {/* 5. Data Limitation / Uncertainty (Req 10) */}
                          {msg.uncertainty && (
                            <div className="p-3 rounded-lg bg-surface-subtle text-[11px] text-text-muted flex items-start gap-2 border border-border/60 max-w-2xl">
                              <Info className="size-3.5 text-text-muted shrink-0 mt-0.5" />
                              <span>Data Limitation: {msg.uncertainty}</span>
                            </div>
                          )}

                          {/* 6. Product Actions Group (1 primary + max 2 secondary - Req 13) */}
                          {msg.actions && msg.actions.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-border/60">
                              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                                Recommended Action
                              </span>
                              <div className="flex flex-wrap items-center gap-2">
                                {msg.actions.slice(0, 3).map((act, i) => (
                                  <Button
                                    key={i}
                                    asChild
                                    variant={i === 0 ? 'primary' : 'outline'}
                                    size="sm"
                                    className="text-xs"
                                  >
                                    <Link href={act.href}>
                                      {act.type === 'risk' && (
                                        <ShieldAlert className="size-3.5" />
                                      )}
                                      {act.type === 'simulation' && (
                                        <Play className="size-3.5" />
                                      )}
                                      {act.type === 'action_plan' && (
                                        <CheckSquare className="size-3.5" />
                                      )}
                                      {act.type === 'metric' && (
                                        <HeartPulse className="size-3.5" />
                                      )}
                                      <span>{act.label}</span>
                                    </Link>
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 7. Explainability Reasoning Expander (Req 10) */}
                          {msg.reasoningMetrics && (
                            <div className="pt-2 border-t border-border/40">
                              <button
                                type="button"
                                onClick={() =>
                                  setShowExplainableId(
                                    showExplainableId === msg.id
                                      ? null
                                      : msg.id,
                                  )
                                }
                                className="text-[11px] font-semibold text-ai hover:text-ai/80 cursor-pointer flex items-center gap-1"
                              >
                                <span>
                                  {showExplainableId === msg.id
                                    ? 'Hide Reasoning provenance'
                                    : 'Why Wallflower reached this answer'}
                                </span>
                                <ChevronDown
                                  className={cn(
                                    'size-3 transition-transform',
                                    showExplainableId === msg.id &&
                                      'rotate-180',
                                  )}
                                />
                              </button>

                              <Expand open={showExplainableId === msg.id}>
                                <div className="pt-2 text-[11px] text-text-muted space-y-1 bg-surface-subtle p-3 rounded-lg border border-border/60 mt-2 max-w-2xl">
                                  {msg.reasoningMetrics.map((rm, idx) => (
                                    <p key={idx}>• {rm}</p>
                                  ))}
                                </div>
                              </Expand>
                            </div>
                          )}

                          {/* 8. Follow-up Suggestions Chips (Max 3 - Req 13) */}
                          {msg.followUpPrompts &&
                            msg.followUpPrompts.length > 0 && (
                              <div className="pt-2 border-t border-border/40 space-y-1.5">
                                <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block">
                                  Continue the conversation
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {msg.followUpPrompts
                                    .slice(0, 3)
                                    .map((fp, i) => (
                                      <button
                                        key={i}
                                        type="button"
                                        onClick={() => handleSendMessage(fp)}
                                        className="px-3 py-1 rounded-full border border-ai/30 bg-ai-soft/10 hover:bg-ai-soft/20 text-xs text-ai font-medium transition-colors cursor-pointer flex items-center gap-1"
                                      >
                                        <span>{fp}</span>
                                        <ArrowRight className="size-3" />
                                      </button>
                                    ))}
                                </div>
                              </div>
                            )}
                        </Card>
                      );
                    })}

                    {/* Message-Shaped Generation Placeholder Surface (Req 7 & 8) */}
                    {isGenerating && (
                      <Card
                        aria-live="polite"
                        className="p-5 space-y-3 border-ai/30 bg-surface shadow-2xs min-w-0"
                      >
                        <div className="flex items-center justify-between border-b border-border/60 pb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="ai" dot>
                              Wallflower Advisor
                            </Badge>
                            <span className="text-xs text-text-muted">
                              Processing...
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs font-semibold text-ai py-1">
                          <Loader2 className="size-4 animate-spin shrink-0" />
                          <span>{STAGED_LOADING_TEXTS[loadingStageIndex]}</span>
                        </div>
                      </Card>
                    )}

                    <div ref={messageEndRef} />
                  </div>
                )}
              </div>

              {/* 3. Sticky Conversation Composer & Single Canonical Select Component (Req 3, 4, 14) */}
              <div className="sticky bottom-4 z-20 bg-surface/95 backdrop-blur-xs p-3.5 rounded-xl border border-border/80 shadow-md space-y-3">
                {/* Single Canonical Select Component (Req 3 & 14) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/50">
                  <div className="w-full sm:w-64">
                    <Select
                      label="Active Context"
                      value={activeContext}
                      onChange={(val) =>
                        setActiveContext(val as ActiveContextType)
                      }
                      options={CONTEXT_OPTIONS}
                    />
                  </div>
                  {messages.length > 0 && (
                    <button
                      type="button"
                      onClick={handleNewConversation}
                      className="text-text-muted hover:text-text-primary text-[11px] flex items-center gap-1 cursor-pointer self-end sm:self-auto"
                    >
                      <RotateCcw className="size-3" />
                      <span>Reset Chat</span>
                    </button>
                  )}
                </div>

                {/* Textarea Composer (Req 14) */}
                <div className="flex items-end gap-2">
                  <textarea
                    ref={textareaRef}
                    rows={2}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isGenerating}
                    placeholder="Ask about your cash flow, risks, performance, or a decision you are considering…"
                    className="flex-1 p-2.5 text-xs text-text-primary bg-surface border border-border rounded-lg focus:outline-hidden focus:border-brand resize-none placeholder:text-text-muted"
                  />
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    disabled={!inputText.trim() || isGenerating}
                    onClick={() => handleSendMessage(inputText)}
                    className="h-10 text-xs shrink-0"
                  >
                    {isGenerating ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Send className="size-4" />
                    )}
                    <span className="hidden sm:inline">Send</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Sticky Business Context Panel with Correct Viewport Offset & Max Height (Req 1, 2, 12, 18) */}
            <aside
              className={cn(
                'shrink-0 lg:w-[320px] xl:w-[340px]',
                showMobileContext ? 'block' : 'hidden lg:block',

                // Keep the panel below the fixed application header
                'lg:sticky lg:top-20 lg:self-start',
              )}
            >
              <Card
                className={cn(
                  'border-border p-4 shadow-2xs sm:p-5',

                  // Fit the card inside the visible viewport
                  'lg:max-h-[calc(100dvh-6rem)]',

                  // Scroll only the card content when necessary
                  'lg:overflow-y-auto lg:overscroll-contain lg:pr-4',

                  // Keep the scrollbar area stable
                  'lg:[scrollbar-gutter:stable]',
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-3">
                  <div className="min-w-0">
                    <CardTitle className="text-sm">Business Context</CardTitle>

                    <CardDescription className="mt-0.5 text-[11px]">
                      January 2025 snapshot
                    </CardDescription>
                  </div>

                  <Badge variant="neutral" className="shrink-0 text-[10px]">
                    Actual
                  </Badge>
                </div>

                {/* Business signals */}
                <div className="mt-3 space-y-2">
                  {/* Cash Runway */}
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-surface-subtle/50 p-2.5">
                    <div className="min-w-0">
                      <span className="block text-[11px] text-text-muted">
                        Cash Runway
                      </span>

                      <span className="block text-xs font-bold text-text-primary">
                        2.1 months
                      </span>
                    </div>

                    <Badge
                      variant="warning"
                      className="shrink-0 whitespace-nowrap text-[9px]"
                    >
                      Needs attention
                    </Badge>
                  </div>

                  {/* Usable Cash Buffer */}
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-surface-subtle/50 p-2.5">
                    <div className="min-w-0">
                      <span className="block text-[11px] text-text-muted">
                        Usable Cash Buffer
                      </span>

                      <FinancialValue
                        value={245000}
                        className="block text-xs font-bold text-brand"
                      />
                    </div>

                    <Badge
                      variant="success"
                      className="shrink-0 whitespace-nowrap text-[9px]"
                    >
                      Safe Reserve
                    </Badge>
                  </div>

                  {/* Net Monthly Burn */}
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-surface-subtle/50 p-2.5">
                    <div className="min-w-0">
                      <span className="block text-[11px] text-text-muted">
                        Net Monthly Burn
                      </span>

                      <span className="block text-xs font-bold text-danger">
                        -฿12,400/mo
                      </span>
                    </div>

                    <Badge
                      variant="danger"
                      className="shrink-0 whitespace-nowrap text-[9px]"
                    >
                      Deficit
                    </Badge>
                  </div>

                  {/* Overdue Receivables */}
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-surface-subtle/50 p-2.5">
                    <div className="min-w-0">
                      <span className="block text-[11px] text-text-muted">
                        Overdue Receivables
                      </span>

                      <FinancialValue
                        value={21340}
                        className="block text-xs font-bold text-danger"
                      />
                    </div>

                    <Badge
                      variant="critical"
                      className="shrink-0 whitespace-nowrap text-[9px]"
                    >
                      3 Invoices
                    </Badge>
                  </div>

                  {/* Top Active Risk */}
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-surface-subtle/50 p-2.5">
                    <div className="min-w-0">
                      <span className="block text-[11px] text-text-muted">
                        Top Active Risk
                      </span>

                      <span className="block truncate text-xs font-bold text-text-primary">
                        February Cash Deficit
                      </span>
                    </div>

                    <Badge
                      variant="critical"
                      className="shrink-0 whitespace-nowrap text-[9px]"
                    >
                      Critical
                    </Badge>
                  </div>
                </div>

                {/* Data Basis */}
                <div className="mt-3 rounded-lg border border-border/60 bg-surface-subtle p-3 text-[11px] text-text-muted">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-text-primary">
                      Data Basis
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setShowDataBasisDetails((current) => !current)
                      }
                      aria-expanded={showDataBasisDetails}
                      className="
            shrink-0 cursor-pointer text-[10px] font-medium text-brand
            hover:underline
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-brand/50
          "
                    >
                      {showDataBasisDetails ? 'Hide' : 'Details'}
                    </button>
                  </div>

                  <div className="mt-2 space-y-1">
                    <p>• January 2025 verified snapshot</p>
                    <p>• 88% source completeness score</p>
                  </div>

                  <Expand open={showDataBasisDetails}>
                    <div className="mt-2 space-y-1 border-t border-border/40 pt-2">
                      <p>• 1 estimated supplier-payment input</p>
                      <p>• Active cash-risk threshold applied</p>
                    </div>
                  </Expand>
                </div>

                {/* Related Feature Links */}
                <div className="mt-3 border-t border-border/60 pt-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-semibold text-text-primary">
                      Related Feature Links
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setShowRelatedLinksDetails((current) => !current)
                      }
                      aria-expanded={showRelatedLinksDetails}
                      className="
            shrink-0 cursor-pointer text-[10px] font-medium text-brand
            hover:underline
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-brand/50
          "
                    >
                      {showRelatedLinksDetails ? 'Collapse' : 'Expand'}
                    </button>
                  </div>

                  <Expand open={showRelatedLinksDetails}>
                    <nav
                      className="mt-2 flex flex-col gap-1"
                      aria-label="Related Wallflower features"
                    >
                      <Link
                        href="/business-health"
                        className="
              flex items-center justify-between gap-3 rounded-md px-2 py-1.5
              text-[11px] text-brand
              hover:bg-surface-subtle
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-brand/50
            "
                      >
                        <span>Business Health Diagnostic</span>
                        <ArrowRight
                          className="size-3 shrink-0"
                          aria-hidden="true"
                        />
                      </Link>

                      <Link
                        href="/risks"
                        className="
              flex items-center justify-between gap-3 rounded-md px-2 py-1.5
              text-[11px] text-brand
              hover:bg-surface-subtle
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-brand/50
            "
                      >
                        <span>Risk Center Alerts</span>
                        <ArrowRight
                          className="size-3 shrink-0"
                          aria-hidden="true"
                        />
                      </Link>

                      <Link
                        href="/simulations"
                        className="
              flex items-center justify-between gap-3 rounded-md px-2 py-1.5
              text-[11px] text-brand
              hover:bg-surface-subtle
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-brand/50
            "
                      >
                        <span>Simulation Workspace</span>
                        <ArrowRight
                          className="size-3 shrink-0"
                          aria-hidden="true"
                        />
                      </Link>
                    </nav>
                  </Expand>
                </div>
              </Card>
            </aside>
          </div>
        </div>
      </FadeIn>
    </AppPage>
  );
}
