'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface AdvisorDrawerContextType {
  isOpen: boolean;
  openAdvisor: (initialQuery?: string) => void;
  openDrawer: (initialQuery?: string) => void;
  closeAdvisor: () => void;
  toggleAdvisor: () => void;
  pendingQuery: string | null;
  clearPendingQuery: () => void;
}

const AdvisorDrawerContext = createContext<AdvisorDrawerContextType | undefined>(undefined);

export function AdvisorDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);

  const openAdvisor = useCallback((query?: string) => {
    if (query) {
      setPendingQuery(query);
    }
    setIsOpen(true);
  }, []);

  const closeAdvisor = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleAdvisor = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const clearPendingQuery = useCallback(() => {
    setPendingQuery(null);
  }, []);

  // Global Keyboard Shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        toggleAdvisor();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleAdvisor]);

  return (
    <AdvisorDrawerContext.Provider
      value={{
        isOpen,
        openAdvisor,
        openDrawer: openAdvisor,
        closeAdvisor,
        toggleAdvisor,
        pendingQuery,
        clearPendingQuery,
      }}
    >
      {children}
    </AdvisorDrawerContext.Provider>
  );
}

export function useAdvisorDrawer() {
  const context = useContext(AdvisorDrawerContext);
  if (!context) {
    throw new Error('useAdvisorDrawer must be used within an AdvisorDrawerProvider');
  }
  return context;
}
