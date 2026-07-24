'use client';

import { useState, useEffect } from 'react';
import {
  CheckSquare,
  ListFilter,
  Plus,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppPage, PageHeader } from '@/components/ui/layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { FadeIn } from '@/components/motion';
import {
  getActionsData,
  type ActionsPageData,
  type DetailedActionItem,
  type ActionStatus,
} from '@/features/actions/adapters/actions.adapter';

export default function ActionsPage() {
  const [data, setData] = useState<ActionsPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'actions' | 'decisions'>('actions');
  const [statusFilter, setStatusFilter] = useState<ActionStatus | 'All'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Action Form State
  const [newTitle, setNewTitle] = useState('');
  const [newImpact, setNewImpact] = useState('');
  const [newOwner, setNewOwner] = useState('General Manager');
  const [newDueDate, setNewDueDate] = useState('2025-02-28');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getActionsData();
      setData(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load action plan data.');
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
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load action plan data.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !data) return;

    const newAction: DetailedActionItem = {
      id: `act-${Date.now()}`,
      title: newTitle,
      description: 'Custom user-created execution action item.',
      relatedRiskOrDecision: 'Manual Action',
      expectedImpact: newImpact || 'Improves operational execution.',
      owner: newOwner,
      dueDate: newDueDate,
      priority: 'medium',
      status: 'Not started',
      notes: 'Added from Action Plan workspace.',
      source: 'manual',
      createdDate: new Date().toISOString().split('T')[0],
    };

    setData({ ...data, actions: [newAction, ...data.actions] });
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewImpact('');
  };

  if (loading) return <ActionsPageSkeleton />;
  if (error) return <ErrorState onRetry={loadData} title="Action Plan Error" description={error} />;
  if (!data) return <EmptyState icon={<CheckSquare />} title="No Action Data" description="Record a scenario simulation or risk mitigation to populate action items." />;

  const { actions, decisions } = data;
  const filteredActions = statusFilter === 'All' ? actions : actions.filter((a) => a.status === statusFilter);

  return (
    <AppPage>
      <FadeIn>
        <div className="space-y-6">
          {/* Page Header */}
          <PageHeader
            title={
              <div className="flex items-center gap-2.5">
                <CheckSquare className="size-6 text-brand shrink-0" aria-hidden="true" />
                <span>Action Plan & Decision Log</span>
              </div>
            }
            description="Track execution action items derived from risks, simulations, and advisor recommendations."
            badge={<Badge variant="healthy" dot>{actions.length} Action Items</Badge>}
            actions={
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand text-white hover:bg-brand-hover transition-colors shadow-2xs cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>Create Action</span>
                </button>
              </div>
            }
          />

          {/* Workspace Tab Switcher */}
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('actions')}
                className={cn(
                  'px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer',
                  activeTab === 'actions' ? 'bg-brand text-white shadow-2xs' : 'text-text-muted hover:text-text-primary bg-surface border border-border'
                )}
              >
                Action Plan Items ({actions.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('decisions')}
                className={cn(
                  'px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer',
                  activeTab === 'decisions' ? 'bg-brand text-white shadow-2xs' : 'text-text-muted hover:text-text-primary bg-surface border border-border'
                )}
              >
                Decision Log & Outcomes ({decisions.length})
              </button>
            </div>
          </div>

          {/* 1. Action Plan Tab Content */}
          {activeTab === 'actions' && (
            <div className="space-y-4">
              {/* Status Filters Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-border bg-surface text-xs">
                <div className="flex items-center gap-1.5">
                  <ListFilter className="size-3.5 text-text-muted" />
                  <span className="font-semibold text-text-muted">Filter Status:</span>
                  {(['All', 'Not started', 'In progress', 'Completed', 'Deferred'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={cn(
                        'px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer',
                        statusFilter === st ? 'bg-brand text-white' : 'text-text-muted hover:text-text-primary'
                      )}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Cards List */}
              <div className="space-y-3">
                {filteredActions.map((item) => (
                  <Card key={item.id} className="p-4 sm:p-5 space-y-3 border-border hover:border-brand/40 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={item.priority === 'high' ? 'danger' : item.priority === 'medium' ? 'warning' : 'default'}>
                          {item.priority.toUpperCase()} PRIORITY
                        </Badge>
                        <Badge variant={item.status === 'Completed' ? 'success' : item.status === 'In progress' ? 'healthy' : 'default'} dot>
                          {item.status}
                        </Badge>
                        <span className="text-[11px] text-text-muted capitalize">Source: {item.source}</span>
                      </div>
                      <span className="text-xs text-text-muted">Due: <strong>{item.dueDate}</strong></span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm sm:text-base font-bold text-text-primary leading-tight">{item.title}</h3>
                      <p className="text-xs text-text-secondary">{item.description}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 rounded-lg border border-border/60 bg-surface-subtle/50 text-xs">
                      <div>
                        <span className="text-text-muted block">Expected Impact</span>
                        <span className="font-semibold text-brand block">{item.expectedImpact}</span>
                      </div>
                      <div>
                        <span className="text-text-muted block">Owner</span>
                        <span className="font-semibold text-text-primary block">{item.owner}</span>
                      </div>
                      <div>
                        <span className="text-text-muted block">Related Vulnerability</span>
                        <span className="font-semibold text-text-primary block truncate">{item.relatedRiskOrDecision}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 2. Decision Log Tab Content (Expected vs Actual Tracking) */}
          {activeTab === 'decisions' && (
            <div className="space-y-4">
              {decisions.map((dec) => (
                <Card key={dec.id} className="p-5 md:p-6 space-y-4 border-brand/20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                    <div>
                      <Badge variant="healthy" dot>{dec.status}</Badge>
                      <h3 className="text-base font-bold text-text-primary mt-1">{dec.decisionTitle}</h3>
                      <span className="text-xs text-text-muted">Selected Scenario: <strong>{dec.selectedScenario}</strong></span>
                    </div>
                    <div className="text-xs text-text-muted sm:text-right">
                      <div>Decision Date: {dec.decisionDate}</div>
                      <div>Review Date: {dec.reviewDate}</div>
                    </div>
                  </div>

                  {/* Expected vs Downside Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl border border-brand/20 bg-brand-soft/10 space-y-1">
                      <span className="font-bold text-brand uppercase tracking-wider block">Expected Impact</span>
                      <p className="text-text-primary font-medium">{dec.expectedImpact}</p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-danger/20 bg-danger-soft/10 space-y-1">
                      <span className="font-bold text-danger uppercase tracking-wider block">Downside Risk Case</span>
                      <p className="text-text-primary font-medium">{dec.expectedDownside}</p>
                    </div>
                  </div>

                  {/* Expected vs Actual Section */}
                  <div className="p-4 rounded-xl border border-border bg-surface space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <span className="font-bold text-text-primary">Expected vs. Actual Outcome Verification</span>
                      <Badge variant={dec.actualOutcome ? 'success' : 'default'}>
                        {dec.actualOutcome ? 'Actual Recorded' : 'Pending Review'}
                      </Badge>
                    </div>

                    {dec.actualOutcome ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-text-muted block">Recorded Date</span>
                          <span className="font-bold text-text-primary block">{dec.actualOutcome.recordedDate}</span>
                        </div>
                        <div>
                          <span className="text-text-muted block">Revenue Variance</span>
                          <span className="font-bold text-emerald-600 block">{dec.actualOutcome.revenueVariance}</span>
                        </div>
                        <div>
                          <span className="text-text-muted block">Profit Variance</span>
                          <span className="font-bold text-emerald-600 block">{dec.actualOutcome.profitVariance}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg border border-dashed border-border bg-surface-subtle/40 flex items-center justify-between text-xs text-text-muted">
                        <div className="flex items-center gap-2">
                          <Info className="size-4 text-text-muted shrink-0" />
                          <span>Actual outcome has not been entered yet. Scheduled for review on <strong>{dec.reviewDate}</strong>.</span>
                        </div>
                        <button type="button" className="px-2.5 py-1 rounded border border-border bg-surface text-brand font-semibold text-[11px] hover:bg-surface-subtle cursor-pointer">
                          Record Actual Outcome
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Add Action Modal */}
          <Dialog open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New Action Item" size="md">
            <form onSubmit={handleAddAction} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-text-primary block">Action Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Follow up on customer payment delay"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-brand"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-text-primary block">Expected Financial / Operating Impact</label>
                <input
                  type="text"
                  value={newImpact}
                  onChange={(e) => setNewImpact(e.target.value)}
                  placeholder="e.g. Recovers ฿21,340 receivables"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-text-primary block">Owner</label>
                  <input
                    type="text"
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-brand"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-text-primary block">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border font-semibold text-text-primary hover:bg-surface-subtle"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-brand text-white font-semibold hover:bg-brand-hover shadow-xs"
                >
                  Save Action Item
                </button>
              </div>
            </form>
          </Dialog>
        </div>
      </FadeIn>
    </AppPage>
  );
}

function ActionsPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-1 gap-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}
