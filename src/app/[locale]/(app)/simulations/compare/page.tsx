'use client';

import { useState, useEffect } from 'react';
import {
  Layers,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { AppPage, PageHeader } from '@/components/ui/layout';
import { Card, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FinancialValue } from '@/components/ui/domain-values';
import { SimulationResultsSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { FadeIn, FadeInView } from '@/components/motion';
import {
  getSimulation,
  type DetailedSimulationResult,
} from '@/features/simulations/adapters/simulations.adapter';

export default function CompareSimulationsPage() {
  const [sim1, setSim1] = useState<DetailedSimulationResult | null>(null);
  const [sim2, setSim2] = useState<DetailedSimulationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [res1, res2] = await Promise.all([
        getSimulation('sim-hire-01'),
        getSimulation('sim-equip-02'),
      ]);
      setSim1(res1);
      setSim2(res2);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load scenario comparisons.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    Promise.all([getSimulation('sim-hire-01'), getSimulation('sim-equip-02')])
      .then(([res1, res2]) => {
        if (isMounted) {
          setSim1(res1);
          setSim2(res2);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load scenario comparisons.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <SimulationResultsSkeleton />;
  if (error) return <ErrorState onRetry={loadData} title="Comparison Error" description={error} />;
  if (!sim1 || !sim2) return <EmptyState icon={<Layers />} title="No Simulations Selected" description="Select at least two scenario simulations to compare." />;

  return (
    <AppPage>
      <FadeIn>
        <div className="space-y-6">
          {/* Page Header */}
          <PageHeader
            title={
              <div className="flex items-center gap-2.5">
                <Layers className="size-6 text-brand shrink-0" aria-hidden="true" />
                <span>Scenario Comparison Workspace</span>
              </div>
            }
            description="Side-by-side comparison of decision scenarios, financial trade-offs, break-even velocity, and risk impacts."
            badge={<Badge variant="healthy" dot>2 Scenarios Loaded</Badge>}
            actions={
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadData}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-surface hover:bg-surface-subtle transition-colors cursor-pointer"
                >
                  <RefreshCw className="size-3.5" />
                  <span>Refresh</span>
                </button>
                <Link
                  href="/simulations/new"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand text-white hover:bg-brand-hover transition-colors shadow-2xs"
                >
                  <Plus className="size-3.5" />
                  <span>Simulate New Option</span>
                </Link>
              </div>
            }
          />

          {/* Side-by-Side Comparison Header Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Option A */}
            <Card className="p-5 border-brand/30 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="healthy">OPTION A</Badge>
                <Badge variant="warning">{sim1.recommendation}</Badge>
              </div>
              <h3 className="text-base font-bold text-text-primary">{sim1.name}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{sim1.recommendationRationale}</p>
            </Card>

            {/* Option B */}
            <Card className="p-5 border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="success">OPTION B</Badge>
                <Badge variant="success">{sim2.recommendation}</Badge>
              </div>
              <h3 className="text-base font-bold text-text-primary">{sim2.name}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{sim2.recommendationRationale}</p>
            </Card>
          </div>

          {/* Comparison Matrix Table */}
          <FadeInView>
            <Card className="p-5 space-y-4">
              <CardTitle>Side-by-Side Financial & Risk Impact Comparison</CardTitle>

              <div className="overflow-x-auto rounded-xl border border-border bg-surface">
                <table className="w-full text-left text-xs text-text-primary">
                  <thead className="border-b border-border bg-surface-subtle text-text-muted">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Comparison Metric</th>
                      <th className="px-4 py-3 font-semibold text-brand">Option A: {sim1.name}</th>
                      <th className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">Option B: {sim2.name}</th>
                      <th className="px-4 py-3 font-semibold">Recommendation Advantage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="px-4 py-3 font-medium text-text-muted">Decision Type</td>
                      <td className="px-4 py-3 font-bold capitalize">{sim1.scenarioType.replace('_', ' ')}</td>
                      <td className="px-4 py-3 font-bold capitalize">{sim2.scenarioType.replace('_', ' ')}</td>
                      <td className="px-4 py-3 text-text-muted">Different strategic focus</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-text-muted">Expected Monthly Revenue</td>
                      <td className="px-4 py-3 font-bold tabular-nums"><FinancialValue value={sim1.scenarios[1].monthlyRevenue} /></td>
                      <td className="px-4 py-3 font-bold tabular-nums"><FinancialValue value={sim2.scenarios[1].monthlyRevenue} /></td>
                      <td className="px-4 py-3 text-emerald-600 font-semibold">Option B (+฿10,000/mo)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-text-muted">Expected Monthly Profit</td>
                      <td className="px-4 py-3 font-bold tabular-nums"><FinancialValue value={sim1.scenarios[1].monthlyProfit} /></td>
                      <td className="px-4 py-3 font-bold tabular-nums"><FinancialValue value={sim2.scenarios[1].monthlyProfit} /></td>
                      <td className="px-4 py-3 text-emerald-600 font-semibold">Option B (+฿15,000/mo)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-text-muted">Projected Cash Runway</td>
                      <td className="px-4 py-3 font-bold tabular-nums">{sim1.scenarios[1].cashRunwayMonths} months</td>
                      <td className="px-4 py-3 font-bold tabular-nums">{sim2.scenarios[1].cashRunwayMonths} months</td>
                      <td className="px-4 py-3 text-emerald-600 font-semibold">Option B (+2.2 months)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-text-muted">Break-Even Velocity</td>
                      <td className="px-4 py-3 font-bold tabular-nums">Month {sim1.scenarios[1].breakEvenPeriodMonths}</td>
                      <td className="px-4 py-3 font-bold tabular-nums">Month {sim2.scenarios[1].breakEvenPeriodMonths}</td>
                      <td className="px-4 py-3 text-brand font-semibold">Option B (2 months faster)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-text-muted">Breached Guardrails</td>
                      <td className="px-4 py-3 font-bold text-danger">1 Guardrail Breached</td>
                      <td className="px-4 py-3 font-bold text-emerald-600">0 Guardrails Breached</td>
                      <td className="px-4 py-3 text-emerald-600 font-semibold">Option B (Safer posture)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-text-muted">Data Confidence</td>
                      <td className="px-4 py-3 font-bold uppercase">{sim1.confidence}</td>
                      <td className="px-4 py-3 font-bold uppercase">{sim2.confidence}</td>
                      <td className="px-4 py-3 text-text-muted">Equivalent baseline inputs</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </FadeInView>

          {/* Action Row */}
          <FadeInView>
            <Card className="p-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold text-text-primary">Decision Choice Actions:</span>
              <div className="flex flex-wrap items-center gap-2">
                <Link href="/actions" className="px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-text-primary transition-colors">
                  Select Option B & Create Action Plan
                </Link>
                <Link href="/reports" className="px-3 py-1.5 rounded-lg bg-brand text-white hover:bg-brand-hover text-xs font-semibold transition-colors shadow-2xs">
                  Generate Comparison Report
                </Link>
              </div>
            </Card>
          </FadeInView>
        </div>
      </FadeIn>
    </AppPage>
  );
}
