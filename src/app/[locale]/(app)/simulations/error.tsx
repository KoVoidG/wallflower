'use client';

import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppPage } from '@/components/ui/layout';
import { Link } from '@/lib/i18n/navigation';

export default function SimulationsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AppPage>
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-danger-soft text-danger">
          <AlertCircle className="size-6" aria-hidden="true" />
        </div>

        <div className="space-y-1 max-w-md">
          <h2 className="text-lg font-bold text-text-primary">
            Failed to Compute Decision Simulation
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            An error occurred while running the scenario model. Your business baseline and stored simulations remain safe.
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button type="button" variant="primary" size="md" onClick={reset}>
            <RefreshCw className="size-3.5" />
            <span>Try Again</span>
          </Button>

          <Button asChild variant="outline" size="md">
            <Link href="/simulations">
              <ArrowLeft className="size-3.5" />
              <span>Back to Simulations</span>
            </Link>
          </Button>
        </div>
      </div>
    </AppPage>
  );
}
