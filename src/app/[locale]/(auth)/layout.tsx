'use client';

import { ReactNode } from 'react';
import { Surface } from '@/components/ui/surface';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Branding */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-brand">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-[20px]/[28px] font-[650] text-text-primary">
            Wallflower
          </h1>
        </div>

        {/* Card */}
        <Surface variant="raised" border className="p-6 dark:border-border-strong">
          {children}
        </Surface>
      </div>
    </div>
  );
}
