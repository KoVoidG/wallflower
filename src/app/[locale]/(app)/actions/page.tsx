'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Edit,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppPage, PageHeader } from '@/components/ui/layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Dialog } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { FadeIn } from '@/components/motion';
import {
  getActionsData,
  type ActionsPageData,
  type DetailedActionItem,
  type ActionExecutionStatus,
  type OutcomeStatus,
} from '@/features/actions/adapters/actions.adapter';

// Status Filter Options for Active Toolbar
const STATUS_FILTER_OPTIONS = [
  { value: 'All active', label: 'Status: All active' },
  { value: 'Planned', label: 'Planned' },
  { value: 'In progress', label: 'In progress' },
  { value: 'Blocked', label: 'Blocked' },
  { value: 'Execution complete', label: 'Execution complete' },
];

export default function ActionsPage() {
  const [data, setData] = useState<ActionsPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Navigation Tabs (Active Actions, Outcome Reviews, History)
  const [activeTab, setActiveTab] = useState<'active' | 'reviews' | 'history'>('active');

  // Toolbar States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All active');
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [selectedActionId, setSelectedActionId] = useState<string>('act-001');

  // Milestone Inline Add State
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');

  // Add Action Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [newOwner, setNewOwner] = useState('General Manager');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [newDueDate, setNewDueDate] = useState('2025-02-15');

  // Outcome Review Recording Modal
  const [reviewAction, setReviewAction] = useState<DetailedActionItem | null>(null);
  const [observedResult, setObservedResult] = useState('');
  const [finalOutcomeStatus, setFinalOutcomeStatus] = useState<OutcomeStatus>('Target met');
  const [reviewNotes, setReviewNotes] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getActionsData();
      setData(res);
      if (res.actions.length > 0) {
        setSelectedActionId(res.actions[0].id);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load action plan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getActionsData()
      .then((res) => {
        if (isMounted) {
          setData(res);
          if (res.actions.length > 0) {
            setSelectedActionId(res.actions[0].id);
          }
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load action plan.');
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleStep = (actionId: string, stepId: string) => {
    if (!data) return;
    const updatedActions = data.actions.map((act) => {
      if (act.id !== actionId) return act;
      const updatedSteps = act.steps?.map((st) => (st.id === stepId ? { ...st, completed: !st.completed } : st));
      return { ...act, steps: updatedSteps };
    });
    setData({ ...data, actions: updatedActions });
  };

  const handleAddMilestone = (actionId: string) => {
    if (!newMilestoneTitle.trim() || !data) return;
    const updatedActions = data.actions.map((act) => {
      if (act.id !== actionId) return act;
      const newStep = {
        id: `st-${Date.now()}`,
        title: newMilestoneTitle.trim(),
        completed: false,
        dueDate: act.dueDate,
      };
      return { ...act, steps: [...(act.steps || []), newStep] };
    });
    setData({ ...data, actions: updatedActions });
    setNewMilestoneTitle('');
    setIsAddingMilestone(false);
  };

  const handleUpdateStatus = (actionId: string, newStatus: ActionExecutionStatus) => {
    if (!data) return;
    const updatedActions = data.actions.map((act) => {
      if (act.id !== actionId) return act;
      // When moving to Execution complete, update outcome status to Review due
      const updatedOutcome =
        newStatus === 'Execution complete'
          ? { ...act.outcomeReview, expectedTarget: act.expectedImpact, status: 'Review due' as OutcomeStatus }
          : act.outcomeReview;
      return {
        ...act,
        executionStatus: newStatus,
        status: newStatus,
        outcomeReview: updatedOutcome,
      };
    });
    setData({ ...data, actions: updatedActions });
  };

  const handleCreateActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !newTitle.trim()) return;

    const newItem: DetailedActionItem = {
      id: `act-${Date.now()}`,
      title: newTitle.trim(),
      description: newObjective,
      objective: newObjective || newTitle,
      relatedRiskOrDecision: 'MANUAL_USER_ACTION',
      expectedImpact: 'User specified operational goal',
      owner: newOwner,
      dueDate: newDueDate,
      priority: newPriority,
      executionStatus: 'Planned',
      status: 'Planned',
      notes: '',
      source: 'manual',
      sourceItemTitle: 'User Created',
      createdDate: new Date().toISOString().split('T')[0],
      steps: [{ id: `st-init-${Date.now()}`, title: 'Initiate task requirements', completed: false, dueDate: newDueDate }],
      outcomeReview: {
        expectedTarget: 'User defined outcome',
        status: 'Not ready for review',
      },
    };

    setData({ ...data, actions: [newItem, ...data.actions] });
    setSelectedActionId(newItem.id);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewObjective('');
  };

  const handleSaveOutcomeReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !reviewAction) return;

    const updatedActions = data.actions.map((act) => {
      if (act.id !== reviewAction.id) return act;
      return {
        ...act,
        executionStatus: 'Execution complete' as ActionExecutionStatus,
        status: 'Completed' as const,
        outcomeReview: {
          ...act.outcomeReview,
          expectedTarget: act.expectedImpact,
          observedResult,
          status: finalOutcomeStatus,
          recordedDate: new Date().toISOString().split('T')[0],
          notes: reviewNotes,
        },
      };
    });

    setData({ ...data, actions: updatedActions });
    setReviewAction(null);
    setObservedResult('');
    setReviewNotes('');
  };

  if (loading) return <ActionsPageSkeleton />;
  if (error) return <ErrorState onRetry={loadData} title="Action Plan Error" description={error} />;
  if (!data) return <EmptyState icon={<CheckCircle2 />} title="No Actions Found" description="Create or import an action to populate your execution plan." />;

  const { actions } = data;

  // Active actions (excluding verified historical outcomes)
  const activeActionsList = actions.filter(
    (a) => a.outcomeReview?.status !== 'Target met' && a.outcomeReview?.status !== 'Partially met' && a.outcomeReview?.status !== 'Target not met',
  );

  // Outcome reviews list (execution complete, outcome pending verification)
  const outcomeReviewsList = actions.filter(
    (a) => a.executionStatus === 'Execution complete' || a.outcomeReview?.status === 'Review due' || a.outcomeReview?.status === 'Monitoring',
  );

  // History list (verified business outcomes)
  const historyList = actions.filter(
    (a) => a.outcomeReview?.status === 'Target met' || a.outcomeReview?.status === 'Partially met' || a.outcomeReview?.status === 'Target not met',
  );

  // Filtered active list for toolbar
  const filteredActiveQueue = activeActionsList.filter((a) => {
    if (statusFilter !== 'All active' && a.executionStatus !== statusFilter) return false;
    if (overdueOnly && new Date(a.dueDate) >= new Date()) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.owner.toLowerCase().includes(q) ||
        a.sourceItemTitle?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selectedAction =
    activeActionsList.find((a) => a.id === selectedActionId) ||
    filteredActiveQueue[0] ||
    activeActionsList[0];

  // Attention Counts
  const overdueCount = activeActionsList.filter((a) => new Date(a.dueDate) < new Date()).length;
  const blockedCount = activeActionsList.filter((a) => a.executionStatus === 'Blocked').length;
  const inProgressCount = activeActionsList.filter((a) => a.executionStatus === 'In progress').length;

  return (
    <AppPage>
      <FadeIn>
        <div className="space-y-6">
          {/* Header (Req 2) — Title, Description & Add Action CTA */}
          <PageHeader
            title={
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight">
                  Action Plan
                </h1>
              </div>
            }
            description="Turn Wallflower recommendations into owned work and verify the resulting business outcome."
            actions={
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsAddModalOpen(true)}
                className="shadow-2xs"
              >
                <Plus className="size-4" />
                <span>Add Action</span>
              </Button>
            }
          />

          {/* Compact Attention Summary Line (Req 2 — NO large rounded card) */}
          <div className="text-xs text-text-secondary flex items-center gap-3 pb-2 border-b border-border/80 flex-wrap">
            <span className="font-semibold text-danger">{overdueCount} overdue</span>
            <span className="text-border">•</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">{blockedCount} blocked</span>
            <span className="text-border">•</span>
            <span className="font-semibold text-brand">{inProgressCount} in progress</span>
            <span className="text-border">•</span>
            <span className="text-text-muted">{activeActionsList.length} total active actions</span>
          </div>

          {/* Primary View Navigation Tabs (Req 3 — Active Actions, Outcome Reviews, History) */}
          <div className="flex items-center gap-2 border-b border-border pb-3">
            {[
              { id: 'active', label: `Active Actions (${activeActionsList.length})` },
              { id: 'reviews', label: `Outcome Reviews (${outcomeReviewsList.length})` },
              { id: 'history', label: `History (${historyList.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as 'active' | 'reviews' | 'history')}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer',
                  activeTab === tab.id
                    ? 'bg-brand-soft text-brand border-brand/30 shadow-2xs'
                    : 'bg-surface text-text-secondary border-border hover:bg-surface-subtle hover:text-text-primary',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: ACTIVE ACTIONS WORKSPACE (Req 4, 5, 6, 7, 8, 9, 10, 11, 12, 13)    */}
          {/* ========================================================================= */}
          {activeTab === 'active' && (
            <div className="space-y-4">
              {/* Compact Filter Toolbar (Req 4 — Search, Status Select, Overdue Checkbox) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 flex-1 max-w-xs relative">
                  <Search className="size-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search actions…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-brand"
                  />
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="w-44">
                    <Select
                      label=""
                      value={statusFilter}
                      onChange={(val) => setStatusFilter(val)}
                      options={STATUS_FILTER_OPTIONS}
                    />
                  </div>

                  <label className="flex items-center gap-1.5 text-xs text-text-primary cursor-pointer select-none font-medium">
                    <input
                      type="checkbox"
                      checked={overdueOnly}
                      onChange={(e) => setOverdueOnly(e.target.checked)}
                      className="size-4 rounded accent-brand border-border cursor-pointer"
                    />
                    <span>Overdue only</span>
                  </label>
                </div>
              </div>

              {/* Master-Detail Queue Layout (Req 5 — 360px : minmax) */}
              <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-6 items-start">
                {/* Left Action Queue List (Req 6 & 7 — Compact selectable rows, MAX 1 badge per row) */}
                <div className="border border-border rounded-xl bg-surface overflow-hidden divide-y divide-border">
                  <div className="p-3 bg-surface-subtle border-b border-border flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                      Prioritised Queue ({filteredActiveQueue.length})
                    </span>
                    <span className="text-[11px] text-text-muted">Select row</span>
                  </div>

                  {filteredActiveQueue.length === 0 ? (
                    <div className="p-6 text-center text-xs text-text-muted">
                      No active actions match the selected filter.
                    </div>
                  ) : (
                    filteredActiveQueue.map((act) => {
                      const isSelected = act.id === selectedAction?.id;
                      const isOverdue = new Date(act.dueDate) < new Date();

                      return (
                        <div
                          key={act.id}
                          onClick={() => setSelectedActionId(act.id)}
                          className={cn(
                            'p-3 transition-colors cursor-pointer space-y-1 select-none',
                            isSelected
                              ? 'bg-brand-soft/15 border-l-4 border-l-brand'
                              : 'hover:bg-surface-subtle/50',
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-text-primary truncate">
                              {act.title}
                            </span>
                            {/* MAX ONE Execution Status Badge per row (Req 6 & 12) */}
                            <Badge
                              variant={
                                act.executionStatus === 'Blocked'
                                  ? 'danger'
                                  : act.executionStatus === 'In progress'
                                  ? 'brand'
                                  : act.executionStatus === 'Execution complete'
                                  ? 'success'
                                  : 'neutral'
                              }
                              className="text-[10px] py-0 shrink-0"
                            >
                              {act.executionStatus}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-text-muted">
                            <span>
                              <strong className="text-text-primary capitalize">{act.priority} priority</strong> • {act.owner}
                            </span>
                            <span className={cn(isOverdue && 'text-danger font-semibold')}>
                              {isOverdue ? 'Overdue: ' : 'Due: '}{act.dueDate}
                            </span>
                          </div>

                          <span className="text-[10px] text-text-muted block truncate italic">
                            {act.sourceItemTitle || 'User Created'}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Right Selected Action Detail Surface (Req 8, 9, 10, 11, 12, 13, 14, 15, 16) */}
                {selectedAction ? (
                  <div className="p-5 sm:p-6 rounded-xl border border-border bg-surface shadow-2xs space-y-5">
                    {/* Header (Req 9 — Title, ONE status badge, metadata, primary action) */}
                    <div className="border-b border-border pb-4 space-y-3">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
                              {selectedAction.title}
                            </h3>
                            {/* MAX ONE Execution Status Badge (Req 9 & 12) */}
                            <Badge
                              variant={
                                selectedAction.executionStatus === 'Blocked'
                                  ? 'danger'
                                  : selectedAction.executionStatus === 'In progress'
                                  ? 'brand'
                                  : selectedAction.executionStatus === 'Execution complete'
                                  ? 'success'
                                  : 'neutral'
                              }
                            >
                              {selectedAction.executionStatus}
                            </Badge>
                          </div>

                          {/* Metadata row (Req 9 — Locale date, owner, priority) */}
                          <div className="text-xs text-text-muted font-medium flex items-center gap-2 flex-wrap">
                            <span className="capitalize"><strong className="text-text-primary">{selectedAction.priority} priority</strong></span>
                            <span>•</span>
                            <span>Owner: <strong className="text-text-primary">{selectedAction.owner}</strong></span>
                            <span>•</span>
                            <span>Due: <strong className="text-text-primary">{selectedAction.dueDate}</strong></span>
                          </div>

                          {/* Source Linkage (Req 14 — Concise provenance) */}
                          {selectedAction.sourceItemTitle && (
                            <div className="text-xs text-brand font-semibold flex items-center gap-1 pt-0.5">
                              <ExternalLink className="size-3" />
                              <span>{selectedAction.sourceItemTitle}</span>
                            </div>
                          )}
                        </div>

                        {/* Workflow Action Button (Req 11) */}
                        {selectedAction.executionStatus === 'Planned' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleUpdateStatus(selectedAction.id, 'In progress')}
                          >
                            <span>Start Action</span>
                          </Button>
                        )}
                        {selectedAction.executionStatus === 'In progress' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleUpdateStatus(selectedAction.id, 'Execution complete')}
                          >
                            <span>Complete Execution</span>
                          </Button>
                        )}
                        {selectedAction.executionStatus === 'Blocked' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(selectedAction.id, 'In progress')}
                          >
                            <span>Resolve Blocker</span>
                          </Button>
                        )}
                        {selectedAction.executionStatus === 'Execution complete' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setReviewAction(selectedAction);
                              setObservedResult(selectedAction.expectedImpact);
                            }}
                          >
                            <Sparkles className="size-3.5" />
                            <span>Record Outcome</span>
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Dominant Section: Next Required Step (Req 10 & 11) */}
                    <div className="p-4 rounded-xl border border-brand/30 bg-brand-soft/10 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-brand uppercase tracking-wider text-[10px]">
                          Next Required Step
                        </span>
                        <span className="text-text-muted font-medium">Owner: {selectedAction.owner}</span>
                      </div>
                      <p className="text-sm font-semibold text-text-primary leading-snug">
                        {selectedAction.executionStatus === 'Planned' && 'Review required inputs & initiate milestone execution schedule.'}
                        {selectedAction.executionStatus === 'In progress' && 'Complete outstanding milestone tasks & verify operational progress.'}
                        {selectedAction.executionStatus === 'Blocked' && 'Resolve active blocker dependencies before marking task complete.'}
                        {selectedAction.executionStatus === 'Execution complete' && 'Execution is complete. Review and record measured business outcome.'}
                      </p>
                    </div>

                    {/* Active Blocker Surface (Req 8 & 13) */}
                    {selectedAction.blocker && selectedAction.executionStatus === 'Blocked' && (
                      <div className="p-4 rounded-xl border border-danger/30 bg-danger-soft/10 text-xs space-y-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-danger uppercase tracking-wider text-[10px]">
                          <AlertTriangle className="size-4" />
                          <span>Active Execution Blocker</span>
                        </div>
                        <p className="text-text-primary font-medium">{selectedAction.blocker.description}</p>
                        <span className="text-[11px] text-text-muted block">
                          Reported: {selectedAction.blocker.dateReported} • Affected Step: {selectedAction.blocker.affectedStep}
                        </span>
                      </div>
                    )}

                    {/* Action Objective (Req 14 — Normal readable text) */}
                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-text-primary uppercase tracking-wider text-[11px] block">
                        Action Objective
                      </span>
                      <p className="text-text-secondary leading-relaxed font-medium">
                        {selectedAction.objective}
                      </p>
                    </div>

                    {/* Milestones & Progress (Req 16 — Flat checklist with canonical checkbox) */}
                    <div className="space-y-3 pt-2 border-t border-border/60 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-text-primary uppercase tracking-wider text-[11px]">
                          Execution Milestones ({selectedAction.steps?.filter((s) => s.completed).length || 0} of {selectedAction.steps?.length || 0} complete)
                        </span>

                        {!isAddingMilestone && (
                          <button
                            type="button"
                            onClick={() => setIsAddingMilestone(true)}
                            className="text-brand hover:underline font-semibold text-[11px] cursor-pointer"
                          >
                            + Add Milestone
                          </button>
                        )}
                      </div>

                      {/* Milestones Flat Checklist */}
                      <div className="border border-border/80 rounded-xl divide-y divide-border/60 bg-surface overflow-hidden">
                        {selectedAction.steps?.map((step) => (
                          <div
                            key={step.id}
                            className="p-3 flex items-start justify-between gap-3 hover:bg-surface-subtle/30 transition-colors"
                          >
                            <label className="flex items-start gap-2.5 cursor-pointer min-w-0 select-none">
                              <input
                                type="checkbox"
                                checked={step.completed}
                                onChange={() => handleToggleStep(selectedAction.id, step.id)}
                                className="mt-0.5 size-4 rounded accent-brand border-border focus:ring-2 focus:ring-brand/40 cursor-pointer"
                              />
                              <div className="min-w-0">
                                <span className={cn('font-medium text-text-primary block', step.completed && 'line-through text-text-muted')}>
                                  {step.title}
                                </span>
                                {step.blocker && (
                                  <span className="text-[10px] text-danger font-semibold block mt-0.5">
                                    Blocker: {step.blocker}
                                  </span>
                                )}
                              </div>
                            </label>

                            <span className="text-[11px] text-text-muted shrink-0">
                              Due {step.dueDate || selectedAction.dueDate}
                            </span>
                          </div>
                        ))}

                        {isAddingMilestone && (
                          <div className="p-3 bg-surface-subtle/40 flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="New milestone title…"
                              value={newMilestoneTitle}
                              onChange={(e) => setNewMilestoneTitle(e.target.value)}
                              className="flex-1 px-3 py-1.5 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-brand text-xs"
                            />
                            <Button
                              type="button"
                              variant="primary"
                              size="sm"
                              onClick={() => handleAddMilestone(selectedAction.id)}
                            >
                              Save
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setIsAddingMilestone(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expected Business Outcome (Req 17 — Before execution completes) */}
                    <div className="p-4 rounded-xl border border-border bg-surface-subtle space-y-1 text-xs">
                      <span className="font-bold text-text-primary uppercase tracking-wider text-[10px]">
                        Expected Business Outcome
                      </span>
                      <p className="text-text-primary font-medium">{selectedAction.expectedImpact}</p>
                    </div>

                    {/* Management Actions (Req 11) */}
                    <div className="flex items-center justify-between pt-3 border-t border-border flex-wrap gap-2 text-xs">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(selectedAction.id, 'In progress')}
                      >
                        <Edit className="size-3.5" />
                        <span>Edit Details</span>
                      </Button>

                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          if (!data) return;
                          setData({
                            ...data,
                            actions: data.actions.filter((a) => a.id !== selectedAction.id),
                          });
                        }}
                      >
                        <Trash2 className="size-3.5" />
                        <span>Delete Action</span>
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: OUTCOME REVIEWS (Req 18 — Unverified Outcome Verification List)     */}
          {/* ========================================================================= */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-border bg-surface shadow-2xs space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-text-primary text-sm">Outcome Verification Queue</h3>
                    <p className="text-text-muted text-[11px]">
                      Actions with completed execution waiting for business outcome measurement and verification.
                    </p>
                  </div>
                  <Badge variant="warning">{outcomeReviewsList.length} Awaiting Verification</Badge>
                </div>

                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-left text-xs text-text-primary">
                    <thead className="bg-surface-subtle border-b border-border text-text-muted">
                      <tr>
                        <th className="p-3 font-semibold">Action Title</th>
                        <th className="p-3 font-semibold">Owner</th>
                        <th className="p-3 font-semibold">Expected Business Target</th>
                        <th className="p-3 font-semibold">Review Status</th>
                        <th className="p-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {outcomeReviewsList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-text-muted">
                            No executed actions currently require outcome verification.
                          </td>
                        </tr>
                      ) : (
                        outcomeReviewsList.map((act) => (
                          <tr key={act.id} className="hover:bg-surface-subtle/30 transition-colors">
                            <td className="p-3 font-bold text-text-primary max-w-xs truncate">
                              {act.title}
                            </td>
                            <td className="p-3 text-text-secondary">{act.owner}</td>
                            <td className="p-3 text-text-secondary max-w-xs">{act.expectedImpact}</td>
                            <td className="p-3">
                              <Badge variant="warning" className="text-[10px] py-0">
                                {act.outcomeReview?.status || 'Review due'}
                              </Badge>
                            </td>
                            <td className="p-3 text-right">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                  setReviewAction(act);
                                  setObservedResult(act.outcomeReview?.observedResult || act.expectedImpact);
                                }}
                              >
                                <span>Record Outcome</span>
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: HISTORY (Req 19 — Compact Verified Decision Records)               */}
          {/* ========================================================================= */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-border bg-surface shadow-2xs space-y-3 text-xs">
                <div>
                  <h3 className="font-bold text-text-primary text-sm">Verified Action Outcome History</h3>
                  <p className="text-text-muted text-[11px]">
                    Historical record of completed actions with measured business outcome results.
                  </p>
                </div>

                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-left text-xs text-text-primary">
                    <thead className="bg-surface-subtle border-b border-border text-text-muted">
                      <tr>
                        <th className="p-3 font-semibold">Action Title</th>
                        <th className="p-3 font-semibold">Source</th>
                        <th className="p-3 font-semibold">Completion Date</th>
                        <th className="p-3 font-semibold">Measured Outcome</th>
                        <th className="p-3 font-semibold">Result Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {historyList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-text-muted">
                            No verified outcome records currently stored in history.
                          </td>
                        </tr>
                      ) : (
                        historyList.map((act) => (
                          <tr key={act.id} className="hover:bg-surface-subtle/30 transition-colors">
                            <td className="p-3 font-bold text-text-primary max-w-xs">{act.title}</td>
                            <td className="p-3 text-text-muted text-[11px]">{act.sourceItemTitle || 'User Created'}</td>
                            <td className="p-3 text-text-secondary">{act.outcomeReview?.recordedDate || act.dueDate}</td>
                            <td className="p-3 text-text-secondary max-w-xs">{act.outcomeReview?.observedResult || act.expectedImpact}</td>
                            <td className="p-3">
                              <Badge
                                variant={
                                  act.outcomeReview?.status === 'Target met'
                                    ? 'success'
                                    : act.outcomeReview?.status === 'Partially met'
                                    ? 'warning'
                                    : 'danger'
                                }
                              >
                                {act.outcomeReview?.status}
                              </Badge>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </FadeIn>

      {/* Add Action Dialog (Req 21) */}
      <Dialog
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Action"
        size="md"
      >
        <form onSubmit={handleCreateActionSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-text-primary block">Action Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Request landlord rent deferral proposal"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-1.5 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-brand"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-text-primary block">Objective & Expected Result</label>
            <textarea
              rows={2}
              placeholder="Explain the business objective and expected outcome…"
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              className="w-full px-3 py-1.5 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-brand"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-text-primary block">Owner *</label>
              <input
                type="text"
                required
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
                className="w-full px-3 py-1.5 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-brand"
              />
            </div>

            <div className="space-y-1">
              <Select
                label="Priority *"
                value={newPriority}
                onChange={(val) => setNewPriority(val as 'high' | 'medium' | 'low')}
                options={[
                  { value: 'high', label: 'High Priority' },
                  { value: 'medium', label: 'Medium Priority' },
                  { value: 'low', label: 'Low Priority' },
                ]}
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-text-primary block">Due Date (ISO/Locale format)</label>
              <input
                type="text"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full px-3 py-1.5 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Create Action
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Record Business Outcome Modal (Req 18) */}
      <Dialog
        open={Boolean(reviewAction)}
        onClose={() => setReviewAction(null)}
        title="Record Business Outcome"
        size="md"
      >
        <form onSubmit={handleSaveOutcomeReview} className="space-y-4 text-xs">
          <div className="p-3 rounded-lg border border-border bg-surface-subtle space-y-1">
            <span className="font-bold text-text-primary block">{reviewAction?.title}</span>
            <p className="text-text-muted text-[11px]">Expected Target: {reviewAction?.expectedImpact}</p>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-text-primary block">Observed Business Result *</label>
            <textarea
              rows={2}
              required
              placeholder="e.g. Wait times reduced to 3.2 mins; payroll burn capped."
              value={observedResult}
              onChange={(e) => setObservedResult(e.target.value)}
              className="w-full px-3 py-1.5 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-brand"
            />
          </div>

          <div className="space-y-1">
            <Select
              label="Outcome Status *"
              value={finalOutcomeStatus}
              onChange={(val) => setFinalOutcomeStatus(val as OutcomeStatus)}
              options={[
                { value: 'Target met', label: 'Target met (Fully verified)' },
                { value: 'Partially met', label: 'Partially met' },
                { value: 'Target not met', label: 'Target not met' },
              ]}
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-text-primary block">Review Notes & Lessons</label>
            <input
              type="text"
              placeholder="Optional notes or follow-up recommendation…"
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              className="w-full px-3 py-1.5 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-brand"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={() => setReviewAction(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Verify Outcome & Archive
            </Button>
          </div>
        </form>
      </Dialog>
    </AppPage>
  );
}

function ActionsPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-12 w-full" />
      <div className="grid grid-cols-[360px_minmax(0,1fr)] gap-6">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}
