// src/features/simulations/components/scenario-workspace-view.tsx
'use client';

import { useState } from 'react';
import type { ScenarioItem } from './scenario-library-view';
import { ScenarioWorkspace } from './workspace/scenario-workspace';
import { ScenarioResultsView } from './scenario-results-view';

interface ScenarioWorkspaceViewProps {
  scenario?: ScenarioItem | null;
  templateId?: string;
  onBackToLibrary?: () => void;
  onCompareScenario?: (scenario: ScenarioItem) => void;
}

/**
 * Maps old scenario library IDs to template config IDs.
 * When a user opens a scenario from the library, we use its
 * strategy tag or name to determine which template to render.
 */
function resolveTemplateId(scenario?: ScenarioItem | null, templateId?: string): string {
  if (templateId) return templateId;
  if (!scenario) return 'price_increase';
  if (scenario.templateId) return scenario.templateId;

  const name = scenario.name.toLowerCase();
  if (name.includes('price')) return 'price_increase';
  if (name.includes('hire') || name.includes('sales associate') || name.includes('staff')) return 'hire_employee';
  if (name.includes('supplier') || name.includes('cost')) return 'cost_reduction';
  if (name.includes('holiday') || name.includes('promotion') || name.includes('loyalty')) return 'holiday_promo';
  if (name.includes('equipment')) return 'equipment_purchase';
  if (name.includes('inventory')) return 'inventory_expansion';
  if (name.includes('branch') || name.includes('location')) return 'new_branch';
  if (name.includes('custom') || name.includes('blank')) return 'blank_scenario';
  return 'price_increase';
}

export function ScenarioWorkspaceView({
  scenario,
  templateId: externalTemplateId,
  onBackToLibrary,
  onCompareScenario,
}: ScenarioWorkspaceViewProps) {
  const isDraft = !scenario || scenario.status === 'Draft';
  const [activeViewMode, setActiveViewMode] = useState<'results' | 'edit'>(
    isDraft ? 'edit' : 'results',
  );

  const resolvedTemplateId = resolveTemplateId(scenario, externalTemplateId);

  const handleRunSimulationSuccess = () => {
    setActiveViewMode('results');
  };

  // Draft scenarios CANNOT access Results Mode
  if (isDraft || activeViewMode === 'edit') {
    return (
      <ScenarioWorkspace
        templateId={resolvedTemplateId}
        scenarioName={scenario?.name}
        isSimulated={scenario?.status === 'Simulated'}
        onBackToLibrary={() => onBackToLibrary?.()}
        onRunSimulationSuccess={handleRunSimulationSuccess}
        onSwitchToResultsMode={() => !isDraft && setActiveViewMode('results')}
        showSubTabs={!isDraft}
      />
    );
  }

  return (
    <ScenarioResultsView
      scenario={scenario}
      onBackToLibrary={onBackToLibrary}
      onSwitchToEditMode={() => setActiveViewMode('edit')}
      onCompareScenario={onCompareScenario}
    />
  );
}
