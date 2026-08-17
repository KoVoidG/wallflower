import { Suspense } from 'react';
import { FadeIn } from '@/components/motion';
import { AutomationEngineView } from '@/features/automation/components';
import { getAutomationsData } from '@/features/automation/adapters/automation.adapter';
import { AutomationSkeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Automation Engine',
};

export default function AutomationPage() {
  return (
    <Suspense fallback={<AutomationSkeleton />}>
      <AutomationContent />
    </Suspense>
  );
}

async function AutomationContent() {
  const data = await getAutomationsData();

  return (
    <FadeIn>
      <AutomationEngineView initialData={data} />
    </FadeIn>
  );
}
