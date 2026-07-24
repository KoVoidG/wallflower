'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Surface } from '@/components/ui/surface';
import { EmptyState } from '@/components/ui/empty-state';
import { AppPage, PageHeader } from '@/components/ui/layout';
import { CardTitle } from '@/components/ui/typography';
import { Link } from '@/lib/i18n/navigation';
import { Plus, Play, TrendingUp, TrendingDown, Shield } from 'lucide-react';
import type { SavedSimulation, PostureType } from '@/features/simulations/adapters/simulations.adapter';
import { PageContextualHint } from '@/components/app-shell/product-tour';

interface SimulationHistoryViewProps {
  initialHistory: SavedSimulation[];
}

const scenarioLabels: Record<string, string> = {
  hire_employees: 'Hire Employees',
  change_price: 'Change Price',
  marketing_investment: 'Marketing',
  purchase_equipment: 'Equipment',
  payment_delay: 'Payment Delay',
};

const postureConfig: Record<PostureType, { label: string; variant: 'success' | 'warning' | 'default'; icon: React.ReactNode }> = {
  bullish: { label: 'Bullish', variant: 'success', icon: <TrendingUp className="size-3.5" /> },
  cautious: { label: 'Cautious', variant: 'warning', icon: <TrendingDown className="size-3.5" /> },
  neutral: { label: 'Neutral', variant: 'default', icon: <Shield className="size-3.5" /> },
};

export function SimulationHistoryView({ initialHistory }: SimulationHistoryViewProps) {
  if (initialHistory.length === 0) {
    return (
      <AppPage>
        <div className="flex flex-col gap-5">
          <PageHeader
            title="Simulations"
            description="Run scenarios to evaluate potential outcomes for strategic decisions."
            actions={
              <Link
                href="/simulations/new"
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
                  'bg-brand text-white font-semibold text-xs',
                  'hover:bg-brand-hover transition-colors shadow-xs'
                )}
              >
                <Plus className="size-4" aria-hidden="true" />
                <span>New Simulation</span>
              </Link>
            }
          />
          <EmptyState
            icon={<Play />}
            title="No simulations yet"
            description="Run your first scenario simulation to explore potential outcomes for business decisions."
            action={
              <Link
                href="/simulations/new"
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
                  'bg-brand text-white font-semibold text-xs',
                  'hover:bg-brand-hover transition-colors shadow-xs'
                )}
              >
                <Plus className="size-4" aria-hidden="true" />
                <span>New Simulation</span>
              </Link>
            }
          />
        </div>
      </AppPage>
    );
  }

  return (
    <AppPage>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Simulations"
          description="Review saved scenario simulations and test forward-looking business decisions."
          actions={
            <Link
              href="/simulations/new"
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
                'bg-brand text-white font-semibold text-xs',
                'hover:bg-brand-hover transition-colors shadow-xs'
              )}
            >
              <Plus className="size-4" aria-hidden="true" />
              <span>New Simulation</span>
            </Link>
          }
        />

        <PageContextualHint
          hintKey="simulations"
          title="Decision Simulation Guide"
          message="Click 'New Simulation' to test what-if business decisions like hiring, price changes, or equipment purchases before spending capital."
        />

        {/* History grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {initialHistory.map((sim) => {
            const postureConf = postureConfig[sim.posture];
            const createdDate = new Date(sim.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <Link
                key={sim.id}
                href={`/simulations/${sim.id}`}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded-xl"
              >
                <Surface
                  border
                  className="p-4 h-full rounded-xl flex flex-col gap-3 hover:border-brand/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="brand">
                      {scenarioLabels[sim.scenarioType] ?? sim.scenarioType}
                    </Badge>
                    <Badge variant={postureConf.variant} icon={postureConf.icon}>
                      {postureConf.label}
                    </Badge>
                  </div>

                  <div className="flex flex-col gap-1 flex-1">
                    <CardTitle className="line-clamp-1">{sim.name}</CardTitle>
                    <span className="text-xs text-text-muted">
                      {createdDate}
                    </span>
                  </div>
                </Surface>
              </Link>
            );
          })}
        </div>
      </div>
    </AppPage>
  );
}
