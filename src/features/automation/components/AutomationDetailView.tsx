// src/features/automation/components/AutomationDetailView.tsx
'use client';

import { AutomationBuilder } from './AutomationBuilder';
import type { AutomationRule } from '../types/automation.types';

export interface AutomationDetailViewProps {
  automation: AutomationRule;
  onBack: () => void;
  onToggleStatus: (id: string) => void;
  onDelete?: (id: string) => void;
  onSave?: (rule: AutomationRule) => void;
}

export function AutomationDetailView({
  automation,
  onBack,
  onToggleStatus,
  onDelete,
  onSave = () => {},
}: AutomationDetailViewProps) {
  return (
    <AutomationBuilder
      mode="edit"
      automation={automation}
      onBack={onBack}
      onSave={onSave}
      onDelete={onDelete}
      onToggleStatus={onToggleStatus}
    />
  );
}
