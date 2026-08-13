'use client';

import { useState } from 'react';
import type { ScenarioItem } from './scenario-library-view';
import { ScenarioEditView } from './scenario-edit-view';
import { ScenarioResultsView } from './scenario-results-view';

interface ScenarioWorkspaceViewProps {
  scenario?: ScenarioItem | null;
  onBackToLibrary?: () => void;
  onCompareScenario?: (scenario: ScenarioItem) => void;
}

export function ScenarioWorkspaceView({
  scenario,
  onBackToLibrary,
  onCompareScenario,
}: ScenarioWorkspaceViewProps) {
  const isDraft = !scenario || scenario.status === 'Draft';
  const [activeViewMode, setActiveViewMode] = useState<'results' | 'edit'>(
    isDraft ? 'edit' : 'results'
  );

  const handleRunSimulationSuccess = () => {
    // When simulation is executed from edit mode, switch to results view
    setActiveViewMode('results');
  };

  // Draft scenarios CANNOT access Results Mode - enforce Edit Mode exclusively for Drafts
  if (isDraft || activeViewMode === 'edit') {
    return (
      <ScenarioEditView
        scenario={scenario}
        onBackToLibrary={onBackToLibrary}
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
