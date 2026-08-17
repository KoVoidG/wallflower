'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Send,
  BrainCircuit,
  Activity,
  Clock,
  FlaskConical,
  Settings2,
  Play,
  BookmarkPlus,
  MessageSquare,
  AlertCircle,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Maximize2,
  X,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppPage } from '@/components/ui/layout';
import { Link, useRouter } from '@/lib/i18n/navigation';
import {
  AgentWorkflowCanvas,
  AgentId,
  AgentStatus,
  OrgDataSetupSheet,
} from '@/features/org-analytics/components';
import { useAppStore } from '@/lib/liquiflow-hooks';
import { useAdvisorDrawer } from '@/features/advisor/context/advisor-drawer-context';
import type { WorkflowPlanResult } from '@/lib/liquiflow-types';
import { AdvisorPlanSkeleton } from '@/components/ui/skeleton';
import { FadeInView } from '@/components/motion';
import type { SuggestedPrompt } from '../adapters/advisor.adapter';

const SUGGESTED_GOALS = [
  {
    label: 'Reduce operating costs',
    goal: 'Identify and eliminate unnecessary operating overhead across all departments.',
  },
  {
    label: 'Improve cash flow',
    goal: 'Accelerate invoice collection and reduce average receivables turnaround.',
  },
  {
    label: 'Reduce inventory risk',
    goal: 'Reduce capital tied up in slow-moving inventory categories by 30%.',
  },
  {
    label: 'Find my biggest bottleneck',
    goal: 'Identify the single primary operational constraint limiting total company throughput.',
  },
  {
    label: 'Improve invoice processing',
    goal: 'Cut Accounts Payable invoice processing time by 40% without increasing headcount.',
  },
  {
    label: 'Reduce customer waiting time',
    goal: 'Reduce customer onboarding and fulfillment cycle time by 35%.',
  },
];

const EMPTY_AGENT_STATUSES: Record<AgentId, AgentStatus | null> = {
  planner: null,
  researcher: null,
  critic: null,
  synthesizer: null,
};

interface StrategicAdvisorWorkspaceProps {
  initialPrompts?: SuggestedPrompt[];
}

export function StrategicAdvisorWorkspace({ initialPrompts }: StrategicAdvisorWorkspaceProps) {
  const { isDemoMode } = useAppStore();
  return <AdvisorWorkspaceInner key={String(isDemoMode)} isDemoMode={isDemoMode} initialPrompts={initialPrompts} />;
}

function AdvisorWorkspaceInner({
  isDemoMode,
}: {
  isDemoMode: boolean;
  initialPrompts?: SuggestedPrompt[];
}) {
  const router = useRouter();
  const { departments, workflows } = useAppStore();
  const { openAdvisor } = useAdvisorDrawer();

  const [goal, setGoal] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [isGraphExpanded, setIsGraphExpanded] = useState(false);
  const [savedToActionPlan, setSavedToActionPlan] = useState(false);
  const isUserEditedRef = useRef(false);

  const [agentStatuses, setAgentStatuses] =
    useState<Record<AgentId, AgentStatus | null>>(EMPTY_AGENT_STATUSES);

  const [result, setResult] = useState<WorkflowPlanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const DEFAULT_OBJECTIVE = 'Reduce vendor invoice processing time by 40%.';

  useEffect(() => {
    let currentIdx = 0;
    let timeoutId: NodeJS.Timeout;

    const typeNextChar = () => {
      if (isUserEditedRef.current) return;
      if (currentIdx < DEFAULT_OBJECTIVE.length) {
        currentIdx++;
        setGoal(DEFAULT_OBJECTIVE.slice(0, currentIdx));
        timeoutId = setTimeout(typeNextChar, 28);
      }
    };

    timeoutId = setTimeout(typeNextChar, 200);

    return () => clearTimeout(timeoutId);
  }, []);

  const startPipeline = async (overrideGoal?: string) => {
    const targetGoal = overrideGoal || goal.trim() || DEFAULT_OBJECTIVE;
    if (!targetGoal.trim()) return;

    if (!goal.trim()) {
      setGoal(targetGoal);
    }

    setIsRunning(true);
    setResult(null);
    setError(null);
    setSavedToActionPlan(false);
    setIsGraphExpanded(true);

    setAgentStatuses({
      planner: {
        agent: 'planner',
        state: 'running',
        message: 'Decomposing goal into operations research tasks...',
      },
      researcher: null,
      critic: null,
      synthesizer: null,
    });

    try {
      const response = await fetch('/api/liquiflow/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: targetGoal,
          departments,
          workflows,
          isDemoMode,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split('\n\n');
        buffer = parts.pop() ?? '';

        for (const part of parts) {
          const lines = part.split('\n');
          let eventType = '';
          let dataStr = '';
          for (const line of lines) {
            if (line.startsWith('event: ')) eventType = line.slice(7).trim();
            if (line.startsWith('data: ')) dataStr = line.slice(6).trim();
          }
          if (!dataStr) continue;

          try {
            const data = JSON.parse(dataStr);
            if (eventType === 'status') {
              setAgentStatuses((prev) => ({
                ...prev,
                [data.agent]: {
                  agent: data.agent,
                  state: data.state,
                  message: data.message,
                  content: data.content,
                },
              }));
            } else if (eventType === 'result') {
              setResult(data as WorkflowPlanResult);
              setIsRunning(false);
              setTimeout(() => {
                setIsGraphExpanded(false);
              }, 600);
            } else if (eventType === 'error') {
              setError(data.message || 'An error occurred');
              setIsRunning(false);
              setIsGraphExpanded(false);
            }
          } catch {
            // ignore parse errors
          }
        }
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'An error occurred';
      setError(msg);
      setAgentStatuses((prev) => {
        const next = { ...prev };
        for (const key of Object.keys(next) as AgentId[]) {
          if (next[key]?.state === 'running') {
            next[key] = {
              ...next[key]!,
              state: 'done',
              message: 'Analysis interrupted.',
            };
          }
        }
        return next;
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      startPipeline(goal.trim() || DEFAULT_OBJECTIVE);
    }
  };

  const handleSaveToActionPlan = () => {
    setSavedToActionPlan(true);
    setTimeout(() => setSavedToActionPlan(false), 3000);
  };

  const handleAskCapybot = () => {
    if (result) {
      const prompt = `I am reviewing this Strategic Advisor plan for: "${result.goal}". Key finding: ${result.executiveSummary}. Projected cost savings: $${result.projectedImpact.costSavingsPerWeek}/wk. How should we prioritize implementation?`;
      openAdvisor(prompt);
    } else {
      openAdvisor('How does the Strategic Advisor multi-agent framework work?');
    }
  };

  const handleSimulateRecommendation = () => {
    router.push('/simulations/new?type=payment_delay');
  };

  const hasWorkflow =
    isRunning || !!result || Object.values(agentStatuses).some(Boolean);

  return (
    <AppPage>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <FadeInView offset={8}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-border/80">
            <div className="space-y-1">
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                Strategic Advisor
              </h1>
              <p className="font-sans text-xs sm:text-sm text-text-muted">
                Turn a business objective into a quantified action plan.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSetup(true)}
                className="gap-2 text-xs h-9 rounded-xl border border-border/80"
              >
                <Settings2 className="size-3.5" />
                Configure Org Data
              </Button>
              <Link
                href="/advisor/playground"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-brand/30 bg-brand/8 text-brand hover:bg-brand/15 hover:border-brand/50 transition-all text-sm font-semibold h-9"
              >
                <FlaskConical className="size-4" />
                AI Playground
              </Link>
            </div>
          </div>
        </FadeInView>

        <OrgDataSetupSheet
          open={showSetup}
          onClose={() => setShowSetup(false)}
        />

        {/* ── Top Row: Goal Input & Workflow Graph Side by Side ───────────── */}
        <FadeInView offset={12}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* ── Card 1: Goal Input ─────────────────────────────────────────── */}
          <Card className="p-5 shadow-2xs border-brand/30 bg-surface flex flex-col justify-between min-h-[380px]">
            <div>
              <h2 className="text-sm font-semibold text-text-primary mb-3">
                What are you trying to improve?
              </h2>
              <div className="relative">
                <textarea
                  value={goal}
                  onChange={(e) => {
                    isUserEditedRef.current = true;
                    setGoal(e.target.value);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Example: Reduce vendor invoice processing time by 40%."
                  className="w-full bg-surface-subtle border border-border/80 rounded-xl p-3 pr-12 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand/60 resize-none h-28"
                  disabled={isRunning}
                />
                <Button
                  size="icon"
                  className="absolute bottom-3 right-3 h-8 w-8 bg-brand hover:bg-brand-hover text-white rounded-lg cursor-pointer transition-transform active:scale-95 shadow-xs"
                  disabled={!goal.trim() || isRunning}
                  onClick={() => {
                    startPipeline(goal.trim() || DEFAULT_OBJECTIVE);
                  }}
                  title="Run Strategic Investigation"
                >
                  <Send className="size-4" />
                </Button>
              </div>
            </div>

            {/* Quick Start Goal Chips */}
            <div className="mt-4 pt-4 border-t border-border/60">
              <p className="text-xs text-text-muted mb-2 font-medium">
                Quick-start strategic goals:
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_GOALS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setGoal(item.goal);
                      startPipeline(item.goal);
                    }}
                    disabled={isRunning}
                    className="px-2.5 py-1.5 rounded-lg bg-surface-subtle hover:bg-brand-soft/20 text-text-secondary hover:text-brand border border-border/60 text-xs font-normal transition-all text-left disabled:opacity-50 cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* ── Card 2: Investigation Workflow (Pure Graph) ────────────────── */}
          <Card className="p-5 shadow-2xs border-brand/30 bg-surface flex flex-col justify-between min-h-[380px]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BrainCircuit className="size-4 text-brand" />
                <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Investigation Workflow
                </h3>
              </div>
              {hasWorkflow && (
                <button
                  onClick={() => setIsGraphExpanded(true)}
                  title="Expand to Full View"
                  className="px-2.5 py-1 rounded-lg text-text-muted hover:text-brand hover:bg-brand/10 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer border border-border/60"
                >
                  <Maximize2 className="size-3.5" />
                  <span>Expand View</span>
                </button>
              )}
            </div>

            {hasWorkflow ? (
              <div className="flex-1 w-full rounded-xl border border-border/80 overflow-hidden bg-surface-subtle/50">
                <AgentWorkflowCanvas
                  agentStatuses={agentStatuses}
                  height="h-[280px]"
                />
              </div>
            ) : (
              <div className="flex-1 w-full rounded-xl border border-dashed border-border/80 flex flex-col items-center justify-center p-6 text-center text-text-muted bg-surface-subtle/40 min-h-[280px]">
                <div className="w-12 h-12 rounded-xl bg-surface border border-border/60 flex items-center justify-center mb-3 text-text-muted/60">
                  <BrainCircuit className="size-6 text-brand/60" />
                </div>
                <p className="text-xs font-semibold text-text-primary">
                  Pipeline Inactive
                </p>
                <p className="text-[11px] text-text-muted mt-1 max-w-xs leading-relaxed">
                  Select a quick-start goal or submit an objective to initialize
                  the multi-agent investigation workflow.
                </p>
              </div>
            )}
          </Card>
          </div>
        </FadeInView>

        {/* ── Below: Strategic Action Plan Result ──────────────────────────── */}
        <FadeInView offset={16} className="w-full">
          <Card className="p-6 sm:p-8 shadow-2xs border-brand/30 bg-surface min-h-[300px] flex flex-col justify-between">
            {error && (
              <div className="p-4 rounded-xl border border-danger/20 bg-danger-soft/10 text-sm text-danger mb-4 flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {result ? (
              /* ── Strategic Action Plan Output ────────────────────────────── */
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Top Finding Header */}
                <div className="border-b border-border/60 pb-4">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <Badge variant="brand" className="text-xs">
                      {Math.round(result.confidenceScore * 100)}% Confidence
                    </Badge>
                    <span className="text-xs text-text-muted font-medium">
                      Goal: {result.goal}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-text-primary">
                    Strategic Action Plan
                  </h2>
                </div>

                {/* Strategic Finding Box */}
                <div className="bg-brand-soft/10 p-4 rounded-xl border border-brand/20 text-sm text-text-primary leading-relaxed font-medium">
                  <div className="text-xs uppercase tracking-wider text-brand font-bold mb-1">
                    Key Strategic Finding
                  </div>
                  {result.executiveSummary}
                </div>

                {/* Projected Impact 4-Col Grid */}
                <div>
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
                    Projected Business Impact
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl border border-border/60 bg-surface-subtle text-center">
                      <div className="text-[10px] uppercase text-text-muted font-bold tracking-wider mb-1 flex items-center justify-center gap-1">
                        <TrendingDown className="size-3 text-emerald-500" />
                        Cycle Time Drop
                      </div>
                      <div className="text-xl font-bold text-brand">
                        -{result.projectedImpact.cycleTimeReductionPct}%
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl border border-border/60 bg-surface-subtle text-center">
                      <div className="text-[10px] uppercase text-text-muted font-bold tracking-wider mb-1 flex items-center justify-center gap-1">
                        <TrendingUp className="size-3 text-emerald-500" />
                        Cost Savings
                      </div>
                      <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        $
                        {result.projectedImpact.costSavingsPerWeek.toLocaleString()}
                        /wk
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl border border-border/60 bg-surface-subtle text-center">
                      <div className="text-[10px] uppercase text-text-muted font-bold tracking-wider mb-1 flex items-center justify-center gap-1">
                        <Sparkles className="size-3 text-brand" />
                        Quality Boost
                      </div>
                      <div className="text-xl font-bold text-brand">
                        +{result.projectedImpact.qualityImprovementPct}%
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl border border-border/60 bg-surface-subtle text-center">
                      <div className="text-[10px] uppercase text-text-muted font-bold tracking-wider mb-1 flex items-center justify-center gap-1">
                        <Clock className="size-3 text-text-muted" />
                        ROI Payback
                      </div>
                      <div className="text-xl font-bold text-text-primary">
                        {result.projectedImpact.paybackWeeks} wks
                      </div>
                    </div>
                  </div>
                </div>

                {/* Why this is happening / Action Items */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                    Recommended Action Items
                  </h3>
                  <div className="space-y-3">
                    {result.actionItems.map((action) => (
                      <div
                        key={action.id}
                        className="p-4 rounded-xl border border-border/80 bg-surface shadow-2xs hover:border-brand/40 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-text-primary text-sm">
                            {action.title}
                          </h4>
                          <Badge
                            variant={
                              action.priority === 'critical'
                                ? 'critical'
                                : action.priority === 'high'
                                  ? 'warning'
                                  : 'neutral'
                            }
                            dot
                          >
                            {action.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-text-muted mb-3 leading-relaxed">
                          {action.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-[11px] text-text-muted border-t border-border/40 pt-2">
                          <span className="flex items-center gap-1">
                            <Activity className="size-3 text-brand" />{' '}
                            {action.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" /> {action.timeline}
                          </span>
                          {action.expectedImpact && (
                            <span className="font-medium text-text-secondary">
                              Impact: {action.expectedImpact}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary Handoff Actions */}
                <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleSimulateRecommendation}
                      className="gap-2 text-xs font-bold"
                      size="md"
                    >
                      <Play className="size-3.5 fill-current" />
                      Simulate Recommendation
                    </Button>
                    <Button
                      variant={savedToActionPlan ? 'outline' : 'outline'}
                      onClick={handleSaveToActionPlan}
                      className="gap-2 text-xs font-semibold"
                      size="md"
                    >
                      <BookmarkPlus className="size-3.5" />
                      {savedToActionPlan
                        ? 'Saved to Plan ✓'
                        : 'Save to Action Plan'}
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    onClick={handleAskCapybot}
                    className="gap-2 text-xs font-semibold text-brand hover:text-brand-hover hover:bg-brand/10"
                  >
                    <MessageSquare className="size-3.5" />
                    Ask Capybot
                  </Button>
                </div>
              </div>
            ) : isRunning ? (
              /* ── Live Running Status with Action Plan Skeleton ───────────── */
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="p-4 rounded-xl border border-brand/30 bg-brand-soft/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-brand-soft border border-brand/30 flex items-center justify-center shrink-0">
                      <Activity className="size-5 text-brand animate-spin" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-text-primary">
                        Multi-Agent Investigation in Progress...
                      </h3>
                      <p className="text-xs text-text-muted">
                        Synthesizing operational constraints, financial models, and quantified ROI.
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsGraphExpanded(true)}
                    className="gap-2 text-xs border-brand/40 text-brand shrink-0"
                  >
                    <Maximize2 className="size-3.5" />
                    View Live Graph
                  </Button>
                </div>

                <AdvisorPlanSkeleton />
              </div>
            ) : (
              /* ── Empty State ─────────────────────────────────────────────── */
              <div className="flex-1 flex flex-col items-center justify-center text-center text-text-muted max-w-md mx-auto py-16">
                <div className="w-16 h-16 rounded-2xl bg-surface-subtle border border-border/60 flex items-center justify-center mb-4">
                  <BrainCircuit className="size-8 text-brand" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Awaiting Strategic Directive
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed">
                  Select a suggested business goal or enter your operational
                  objective above. The Strategic Advisor will conduct a
                  multi-stage quantitative analysis to produce an actionable
                  plan.
                </p>
              </div>
            )}
          </Card>
        </FadeInView>

        {/* ── Pop-Up Full-Screen View with Background Blurred ──────────────── */}
        {isGraphExpanded && (
          <div
            onClick={() => setIsGraphExpanded(false)}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in"
          >
            <Card
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-6xl bg-surface border-border shadow-2xl p-6 relative flex flex-col gap-4 max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <BrainCircuit className="size-5 text-brand" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-text-primary">
                        Multi-Agent Investigation Architecture
                      </h3>
                      {isRunning && (
                        <span className="text-[10px] uppercase font-mono font-bold text-brand bg-brand-soft/30 border border-brand/40 px-2 py-0.5 rounded-md animate-pulse">
                          Live Analysis Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-muted">
                      Interactive multi-agent decision intelligence pipeline
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsGraphExpanded(false)}
                  className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Large Popup Graph View */}
              <div className="rounded-xl border border-border/80 bg-surface-subtle p-2 flex-1 min-h-[460px] sm:min-h-[560px]">
                <AgentWorkflowCanvas
                  agentStatuses={agentStatuses}
                  height="h-[460px] sm:h-[560px]"
                />
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppPage>
  );
}
