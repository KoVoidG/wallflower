'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { AppPage } from '@/components/ui/layout';
import { Link } from '@/lib/i18n/navigation';
import {
  Plus,
  Play,
  Layers,
  Users,
  DollarSign,
  Wrench,
  Store,
  Clock,
  Banknote,
  ArrowRight,
  CheckSquare,
  Square,
  Sparkles,
  AlertTriangle,
  FlaskConical,
  Grid,
} from 'lucide-react';
import type { SavedSimulation } from '@/features/simulations/adapters/simulations.adapter';

interface SimulationHistoryViewProps {
  initialHistory: SavedSimulation[];
}

interface TemplateItem {
  type: string;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  area: string;
}

const PRIMARY_TEMPLATES: TemplateItem[] = [
  { type: 'payment_delay', label: 'Customer Payment Delay', desc: 'Simulate liquidity strain from 30-90 day invoice collection delays.', icon: Clock, area: 'Cash Flow' },
  { type: 'hire_employees', label: 'Hire New Employees', desc: 'Model salary overhead, benefits, and sales onboarding ramp-up duration.', icon: Users, area: 'Payroll' },
  { type: 'change_price', label: 'Change Product Pricing', desc: 'Evaluate price elasticity, demand volume shift, and operating margins.', icon: DollarSign, area: 'Pricing' },
];

const MORE_TEMPLATES: TemplateItem[] = [
  { type: 'purchase_equipment', label: 'Purchase Equipment', desc: 'Analyze outright cash Capex vs SME bank loan payback period.', icon: Wrench, area: 'Capex' },
  { type: 'expand_location', label: 'Expand Store Location', desc: 'Model new store fitout, lease security deposit, and branch revenue.', icon: Store, area: 'Branch Expansion' },
  { type: 'financing', label: 'SME Debt Financing', desc: 'Evaluate loan principal infusion, interest rate, and monthly debt service.', icon: Banknote, area: 'Debt' },
];

function TemplateCard({ item, onSelect }: { item: TemplateItem; onSelect?: () => void }) {
  const Icon = item.icon;
  return (
    <Link
      href={`/simulations/new?type=${item.type}`}
      onClick={onSelect}
      className="flex h-full min-h-[150px] flex-col p-4 rounded-xl border border-border/80 bg-surface hover:bg-surface-subtle/60 hover:border-brand/40 transition-colors shadow-2xs group block"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-brand-soft/20 text-brand shrink-0">
            <Icon className="size-4" />
          </div>
          <span className="text-xs font-bold text-text-primary group-hover:text-brand transition-colors truncate">
            {item.label}
          </span>
        </div>
        <Badge variant="neutral" className="text-[10px] shrink-0">
          {item.area}
        </Badge>
      </div>

      <p className="mt-2.5 text-[11px] text-text-muted leading-relaxed flex-1 line-clamp-3">
        {item.desc}
      </p>

      <div className="mt-4 pt-2.5 border-t border-border/40 flex items-center justify-end text-[11px] text-brand font-semibold">
        <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          Configure Scenario <ArrowRight className="size-3" />
        </span>
      </div>
    </Link>
  );
}

export function SimulationHistoryView({ initialHistory }: SimulationHistoryViewProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBrowseTemplatesOpen, setIsBrowseTemplatesOpen] = useState(false);

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <AppPage>
      <div className="space-y-6">
        {/* 1. Header (Clean header without duplicate New Simulation button - Req 1) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight">
              Simulations
            </h1>
            <p className="text-xs text-text-secondary">
              Test the financial impact of a business decision before committing capital.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {selectedIds.length >= 2 && (
              <Button asChild variant="secondary" size="md" className="text-xs">
                <Link href="/simulations/compare">
                  <Layers className="size-3.5" />
                  <span>Compare Scenarios ({selectedIds.length})</span>
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* 2. Primary Custom-Decision Entry Point (Req 1 & 3) */}
        <Card className="p-5 border-brand/30 bg-brand-soft/10 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FlaskConical className="size-4 text-brand shrink-0" />
                <h2 className="text-sm sm:text-base font-bold text-text-primary">
                  Test Your Own Custom Decision
                </h2>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed max-w-2xl">
                Describe a planned change and configure its financial impact using custom revenue, expense, and cash flow levers.
              </p>
            </div>

            <Button asChild variant="primary" size="md" className="text-xs shrink-0">
              <Link href="/simulations/new?type=custom">
                <Plus className="size-3.5" />
                <span>Build Custom Scenario</span>
              </Link>
            </Button>
          </div>
        </Card>

        {/* 3. Common Template Shortcuts (Equal-Height Baseline Aligned Cards - Req 4 & 5) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-text-primary uppercase tracking-wider">
              Common Decision Templates
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs h-7 text-brand hover:text-brand-hover cursor-pointer"
              onClick={() => setIsBrowseTemplatesOpen(true)}
            >
              <Grid className="size-3.5" />
              <span>Browse all templates</span>
            </Button>
          </div>

          <div className="grid auto-rows-fr gap-3 grid-cols-1 md:grid-cols-3">
            {PRIMARY_TEMPLATES.map((item) => (
              <TemplateCard key={item.type} item={item} />
            ))}
          </div>
        </div>

        {/* 4. Recent Simulation Models Table */}
        {initialHistory.length === 0 ? (
          <EmptyState
            icon={<Play />}
            title="No simulations yet"
            description="Run your first scenario simulation to explore potential outcomes for business decisions."
            action={
              <Button asChild variant="primary" size="md">
                <Link href="/simulations/new?type=custom">
                  <Plus className="size-4" />
                  <span>Build Custom Scenario</span>
                </Link>
              </Button>
            }
          />
        ) : (
          <Card className="p-4 space-y-3 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3 px-1">
              <div>
                <CardTitle>Recent Simulation Models</CardTitle>
                <span className="text-[11px] text-text-muted block">
                  Select 2 or 3 completed simulations to compare trade-offs side by side
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {selectedIds.length > 0 && (
                  <span className="text-text-muted text-[11px] font-medium">
                    {selectedIds.length} selected
                  </span>
                )}
                <Button asChild variant="outline" size="sm" className="text-xs" disabled={selectedIds.length < 2}>
                  <Link href="/simulations/compare">
                    <Layers className="size-3.5" />
                    <span>Compare Scenarios</span>
                  </Link>
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-text-primary">
                <thead className="border-b border-border bg-surface-subtle/50 text-text-muted text-[11px]">
                  <tr>
                    <th className="px-3 py-2.5 font-semibold w-10 text-center">Compare</th>
                    <th className="px-3 py-2.5 font-semibold">Scenario Name</th>
                    <th className="px-3 py-2.5 font-semibold">Decision Type</th>
                    <th className="px-3 py-2.5 font-semibold">Created Date</th>
                    <th className="px-3 py-2.5 font-semibold">Status</th>
                    <th className="px-3 py-2.5 font-semibold">Recommendation Posture</th>
                    <th className="px-3 py-2.5 font-semibold text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {initialHistory.map((sim) => {
                    const isChecked = selectedIds.includes(sim.id);
                    const createdDate = new Date(sim.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });

                    const recVariant =
                      sim.recommendation === 'Appears affordable'
                        ? ('success' as const)
                        : sim.recommendation === 'Proceed cautiously'
                          ? ('warning' as const)
                          : ('danger' as const);

                    return (
                      <tr
                        key={sim.id}
                        className={cn(
                          'hover:bg-surface-subtle/60 transition-colors cursor-pointer group',
                          isChecked && 'bg-brand-soft/10'
                        )}
                      >
                        <td className="px-3 py-3 text-center" onClick={(e) => toggleSelect(sim.id, e)}>
                          <button
                            type="button"
                            className="text-brand hover:text-brand-hover cursor-pointer inline-flex items-center justify-center"
                            aria-label={`Select ${sim.name} for comparison`}
                          >
                            {isChecked ? (
                              <CheckSquare className="size-4 text-brand" />
                            ) : (
                              <Square className="size-4 text-text-muted" />
                            )}
                          </button>
                        </td>

                        <td className="px-3 py-3 font-semibold">
                          <Link href={`/simulations/${sim.id}`} className="hover:text-brand transition-colors block">
                            {sim.name}
                          </Link>
                        </td>

                        <td className="px-3 py-3 text-text-muted capitalize">
                          {sim.scenarioType.replace('_', ' ')}
                        </td>

                        <td className="px-3 py-3 text-text-muted">{createdDate}</td>

                        <td className="px-3 py-3">
                          <Badge variant="healthy" className="text-[10px]">
                            Completed
                          </Badge>
                        </td>

                        <td className="px-3 py-3">
                          <Badge variant={recVariant} className="text-[10px]" dot>
                            {sim.recommendation}
                          </Badge>
                        </td>

                        <td className="px-3 py-3 text-right">
                          <Link href={`/simulations/${sim.id}`} className="text-text-muted group-hover:text-brand inline-flex items-center gap-1 transition-colors">
                            <ArrowRight className="size-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* 5. Contextual Risk Recommendations */}
        <div className="p-4 rounded-xl border border-brand/20 bg-brand-soft/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-brand uppercase tracking-wider">
            <Sparkles className="size-3.5" />
            <span>Recommended Simulation Derived From Baseline Vulnerabilities</span>
          </div>
          <div className="p-3 rounded-lg border border-border/80 bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-text-primary">30-Day Customer Payment Delay</span>
                <Badge variant="warning" className="text-[9px]">Triggered by Receivables Drag Risk</Badge>
              </div>
              <p className="text-[11px] text-text-muted">
                Your ฿21,300 overdue receivables drag indicates cash flow vulnerability if collections slow down.
              </p>
            </div>
            <Button asChild variant="secondary" size="sm" className="text-xs shrink-0">
              <Link href="/simulations/new?type=payment_delay">
                <span>Configure Scenario</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Disclaimer Footer */}
        <div className="flex items-start gap-2.5 p-4 rounded-xl bg-surface-subtle border border-border/60 text-xs text-text-muted">
          <AlertTriangle className="size-4 mt-0.5 shrink-0 text-warning" aria-hidden="true" />
          <p className="leading-relaxed">
            Simulations provide deterministic mock estimations based on user assumptions and business baseline data. They do not constitute guaranteed financial outcomes or certified investment advice.
          </p>
        </div>

        {/* All Templates Modal Dialog (Reusing Shared TemplateCard - Req 4 & 7) */}
        <Dialog open={isBrowseTemplatesOpen} onClose={() => setIsBrowseTemplatesOpen(false)} title="All Scenario Decision Templates" size="md">
          <div className="space-y-3 pt-1">
            <p className="text-xs text-text-secondary leading-relaxed">
              Select any pre-configured template shortcut to initialize assumptions in the builder:
            </p>
            <div className="grid auto-rows-fr gap-3 grid-cols-1 md:grid-cols-2 pt-1">
              {[...PRIMARY_TEMPLATES, ...MORE_TEMPLATES].map((item) => (
                <TemplateCard key={item.type} item={item} onSelect={() => setIsBrowseTemplatesOpen(false)} />
              ))}
            </div>
          </div>
        </Dialog>
      </div>
    </AppPage>
  );
}
