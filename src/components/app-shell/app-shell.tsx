// src/components/app-shell/app-shell.tsx
'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { ProductTour } from './product-tour';
import { AdvisorDrawerProvider } from '@/features/advisor/context/advisor-drawer-context';
import { FloatingAIAdvisor } from '@/features/advisor/components/floating-ai-advisor';

interface AppShellProps {
  children: ReactNode;
  title?: string;
  /** Optional right-side panel content */
  aside?: ReactNode;
  /** Title for the contextual drawer */
  asideTitle?: string;
}

export function AppShell({ children, title, aside, asideTitle }: AppShellProps) {
  return (
    <AdvisorDrawerProvider>
      <div className="relative min-h-screen bg-background">
        {/* Sidebar (Always collapsed to 76px until hovered) */}
        <Sidebar />

        {/* Main content wrapper */}
        <div className="flex min-h-screen flex-col ml-[76px] transition-all duration-200">
          {/* Topbar */}
          <Topbar title={title} />

          {/* Content area */}
          <div className="flex flex-1">
            <main
              className={cn(
                'flex-1 px-4 py-6 pb-6',
                'md:px-6 lg:px-8',
                'max-w-[1500px]'
              )}
            >
              {children}
            </main>

            {/* Contextual rail (desktop only, when aside content provided) */}
            {aside && (
              <aside
                className="hidden lg:flex w-[320px] shrink-0 flex-col border-l border-border bg-surface"
                aria-label={asideTitle || 'Contextual panel'}
              >
                {asideTitle && (
                  <div className="flex h-16 items-center border-b border-border px-4">
                    <h2 className="text-sm font-semibold text-text-primary truncate">
                      {asideTitle}
                    </h2>
                  </div>
                )}
                <div className="flex-1 overflow-y-auto p-4">{aside}</div>
              </aside>
            )}
          </div>
        </div>

        {/* Product Tour Guide Modal */}
        <ProductTour />

        {/* Global Floating AI Advisor Widget */}
        <FloatingAIAdvisor />
      </div>
    </AdvisorDrawerProvider>
  );
}
