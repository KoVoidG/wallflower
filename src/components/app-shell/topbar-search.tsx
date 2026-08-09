// src/components/app-shell/topbar-search.tsx
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from '@/lib/i18n/navigation';
import {
  Search,
  LayoutDashboard,
  HeartPulse,
  Sliders,
  FileSpreadsheet,
  Database,
  Settings,
  Sparkles,
  TrendingUp,
  Package,
  Layers,
  ArrowRight,
  Shield,
  Bell,
  Palette,
  DollarSign,
  Briefcase,
  Activity,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAdvisorDrawer } from '@/features/advisor/context/advisor-drawer-context';

interface SearchResultItem {
  id: string;
  title: string;
  category: 'Pages' | 'Simulations' | 'Reports' | 'Metrics' | 'Settings' | 'AI Assistant';
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const SEARCH_DATABASE: SearchResultItem[] = [
  // ── AI Advisor Quick Trigger ────────────────────────────────────────
  {
    id: 'action_ai_advisor',
    title: 'Ask AI Advisor (CapyBot)',
    category: 'AI Assistant',
    description:
      'Open AI advisor drawer for strategic guidance, forecasting & diagnostics',
    href: '#advisor',
    icon: Sparkles,
    badge: 'AI',
  },
  // ── Pages ──────────────────────────────────────────────────────────
  {
    id: 'page_dashboard',
    title: 'Dashboard Overview',
    category: 'Pages',
    description:
      'Real-time financial performance, cash runway, and health score',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'page_health',
    title: 'Business Health',
    category: 'Pages',
    description:
      'Financial snapshot, cash runway, unit economics & assumptions',
    href: '/business-health',
    icon: HeartPulse,
  },
  {
    id: 'page_inventory',
    title: 'Inventory Composition',
    category: 'Pages',
    description: 'Stock valuation, turnover velocity, fast/slow moving SKUs',
    href: '/business-health?tab=inventory',
    icon: Package,
    badge: 'Inventory',
  },
  {
    id: 'page_operations',
    title: 'Operations & Working Capital',
    category: 'Pages',
    description:
      'Working capital runway, fulfillment metrics, operating margin',
    href: '/business-health?tab=operations',
    icon: Activity,
    badge: 'Operations',
  },
  {
    id: 'page_simulations',
    title: 'Decision Planner & Simulations',
    category: 'Pages',
    description:
      'Predictive intelligence, sandbox simulations, scenario models',
    href: '/simulations',
    icon: Sliders,
  },
  {
    id: 'page_scenario_workspace',
    title: 'Scenario Workspace',
    category: 'Pages',
    description:
      'Adjust financial variables, pricing, and run live simulations',
    href: '/simulations?tab=workspace',
    icon: Sliders,
    badge: 'Simulation',
  },
  {
    id: 'page_compare_simulations',
    title: 'Compare Simulations',
    category: 'Pages',
    description: 'Side-by-side scenario matrix with AI recommended decisions',
    href: '/simulations?tab=compare',
    icon: Sparkles,
    badge: 'Compare',
  },
  {
    id: 'page_global_assumptions',
    title: 'Global Assumptions',
    category: 'Pages',
    description: 'Macroeconomic inflation, interest rates, and tax parameters',
    href: '/simulations?tab=assumptions',
    icon: Layers,
    badge: 'Assumptions',
  },
  {
    id: 'page_reports',
    title: 'Reports Library',
    category: 'Pages',
    description: 'Monthly executive summaries, export PDF/Excel, risk audits',
    href: '/reports',
    icon: FileSpreadsheet,
  },
  {
    id: 'page_datasources',
    title: 'Data Sources & Integrations',
    category: 'Pages',
    description:
      'Connect POS systems, bank accounts, accounting software & ERP',
    href: '/data-sources',
    icon: Database,
  },
  {
    id: 'page_settings',
    title: 'Settings & Preferences',
    category: 'Pages',
    description:
      'Manage profile, business data, security, themes & subscription',
    href: '/settings',
    icon: Settings,
  },

  // ── Simulations ────────────────────────────────────────────────────
  {
    id: 'sim_price_increase',
    title: 'Price Increase +5%',
    category: 'Simulations',
    description: 'Forecasted ROI: 28.7% • Health Score: 84 (+8) • Low Risk',
    href: '/simulations?tab=compare',
    icon: TrendingUp,
    badge: 'Recommended',
  },
  {
    id: 'sim_current_baseline',
    title: 'Current Baseline Scenario',
    category: 'Simulations',
    description: 'Status quo baseline: ฿1.2M Revenue • 4.2 mo Runway',
    href: '/simulations?tab=library',
    icon: Activity,
    badge: 'Simulated',
  },
  {
    id: 'sim_holiday_promo',
    title: 'Holiday Promotion Strategy',
    category: 'Simulations',
    description: 'Marketing campaign: +9.2% Revenue • ฿158k Net Profit',
    href: '/simulations?tab=library',
    icon: Sparkles,
    badge: 'Simulated',
  },
  {
    id: 'sim_hire_sales',
    title: 'Hire 1 Sales Associate',
    category: 'Simulations',
    description: 'Capacity expansion: +฿40k revenue • ฿132k profit',
    href: '/simulations?tab=library',
    icon: Briefcase,
    badge: 'Simulated',
  },

  // ── Reports ────────────────────────────────────────────────────────
  {
    id: 'rep_monthly_executive',
    title: 'Executive Monthly Summary (July 2025)',
    category: 'Reports',
    description:
      'Full P&L breakdown, top performing revenue lines, cash balance',
    href: '/reports',
    icon: FileText,
  },
  {
    id: 'rep_cash_runway',
    title: 'Cash Runway & Burn Stress Test',
    category: 'Reports',
    description: 'Worst-case cash flow stress test and sensitivity forecast',
    href: '/reports',
    icon: FileSpreadsheet,
  },
  {
    id: 'rep_inventory_health',
    title: 'Dead Stock & Inventory Health Audit',
    category: 'Reports',
    description: 'Slow-moving SKUs, holding cost analysis, reorder schedules',
    href: '/reports',
    icon: Package,
  },

  // ── Metrics ────────────────────────────────────────────────────────
  {
    id: 'metric_revenue',
    title: 'Total Revenue: ฿1,200,000',
    category: 'Metrics',
    description: '+8.5% YoY growth • ฿40,000 daily average',
    href: '/dashboard',
    icon: DollarSign,
  },
  {
    id: 'metric_net_profit',
    title: 'Net Profit: ฿120,000 (10.0% Margin)',
    category: 'Metrics',
    description: '+12.4% MoM profit growth',
    href: '/business-health',
    icon: TrendingUp,
  },
  {
    id: 'metric_cash_runway',
    title: 'Cash Runway: 4.2 Months',
    category: 'Metrics',
    description: 'Safe liquidity range • Next critical threshold: 3.0 mo',
    href: '/business-health',
    icon: HeartPulse,
  },

  // ── Settings ───────────────────────────────────────────────────────
  {
    id: 'set_appearance',
    title: 'Appearance & Themes',
    category: 'Settings',
    description: 'Switch between Light / Dark mode, change accent color',
    href: '/settings?section=appearance',
    icon: Palette,
  },
  {
    id: 'set_notifications',
    title: 'Notification Settings',
    category: 'Settings',
    description: 'Manage email alerts, in-app banners, reminder frequency',
    href: '/settings?section=notifications',
    icon: Bell,
  },
  {
    id: 'set_plan',
    title: 'Plan & Billing Subscription',
    category: 'Settings',
    description: 'Check simulation credits, manage plan tier, upgrade',
    href: '/settings?section=plan',
    icon: Sparkles,
  },
  {
    id: 'set_security',
    title: 'Account Security & Access',
    category: 'Settings',
    description: 'Two-factor authentication, active sessions, passwords',
    href: '/settings?section=security',
    icon: Shield,
  },
];

export function TopbarSearch() {
  const locale = useLocale();
  const isThai = locale === 'th';
  const router = useRouter();
  const { openDrawer } = useAdvisorDrawer();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtered results based on search input
  const filteredResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      // Show default top picks when empty
      return SEARCH_DATABASE.slice(0, 6);
    }

    return SEARCH_DATABASE.filter((item) => {
      return (
        item.title.toLowerCase().includes(trimmed) ||
        item.description.toLowerCase().includes(trimmed) ||
        item.category.toLowerCase().includes(trimmed) ||
        (item.badge && item.badge.toLowerCase().includes(trimmed))
      );
    });
  }, [query]);

  // Handle outside click to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global Keyboard Shortcut: '/' or 'Ctrl+/' to focus searchbar (Ctrl+K is reserved for AI Advisor)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isInput =
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA';

      if (!isInput && e.key === '/') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = (item: SearchResultItem) => {
    setIsOpen(false);
    setQuery('');
    if (item.href === '#advisor' || item.id === 'action_ai_advisor') {
      openDrawer();
      return;
    }
    router.push(item.href);
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredResults.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredResults.length - 1,
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input Bar */}
      <div
        className={cn(
          'flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all duration-150 w-full',
          'bg-[#F8FAFC] dark:bg-[#0B0F17]',
          isOpen
            ? 'border-[#6366F1] ring-2 ring-[#6366F1]/20 shadow-xs'
            : 'border-slate-200/80 dark:border-[#1E2638] hover:border-slate-300 dark:hover:border-[#2A344A]',
        )}
      >
        <Search className="size-4 text-[#64748B] dark:text-[#94A3B8] shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(0);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDownInput}
          placeholder={
            isThai
              ? 'ค้นหาหน้า, จำลองสถานการณ์, รายงาน, ตัวชี้วัด...'
              : 'Search pages, simulations, reports, metrics...'
          }
          className="w-full bg-transparent text-xs font-medium text-[#0F172A] dark:text-white placeholder:text-[#94A3B8] dark:placeholder:text-[#64748B] focus:outline-hidden"
        />

        <button
          type="button"
          onClick={() => {
            setQuery('');
            inputRef.current?.focus();
          }}
          className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-[#1E2638] text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white cursor-pointer"
        ></button>
      </div>

      {/* Dropdown Floating Results Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 top-full mt-2 z-50 w-full min-w-[320px] sm:min-w-[480px] max-w-[760px] rounded-2xl border border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#111622] shadow-2xl overflow-hidden p-2 text-left"
          >
            {/* Header category label */}
            <div className="px-3 py-1.5 flex items-center justify-between text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8] border-b border-slate-100 dark:border-[#1E2638] mb-1">
              <span>
                {query.trim() ? 'Search Results' : 'Quick Navigation'}
              </span>
              <span className="font-mono text-[10px]">
                {filteredResults.length} items
              </span>
            </div>

            {filteredResults.length > 0 ? (
              <div className="max-h-[360px] overflow-y-auto space-y-1 pr-1">
                {filteredResults.map((item, idx) => {
                  const isHighlighted = idx === selectedIndex;
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        'flex items-center justify-between p-2.5 rounded-xl cursor-pointer select-none transition-all duration-100',
                        isHighlighted
                          ? 'bg-purple-50 dark:bg-purple-950/50 text-[#6366F1] dark:text-[#A5B4FC] shadow-2xs'
                          : 'hover:bg-slate-50 dark:hover:bg-[#1E2638]/50 text-[#0F172A] dark:text-white',
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={cn(
                            'size-8 rounded-xl flex items-center justify-center shrink-0 border transition-colors',
                            isHighlighted
                              ? 'bg-white dark:bg-[#111622] border-[#6366F1]/30 text-[#6366F1] dark:text-[#A5B4FC]'
                              : 'bg-slate-100 dark:bg-[#1E2638] border-slate-200 dark:border-[#2A344A] text-[#64748B] dark:text-[#94A3B8]',
                          )}
                        >
                          <Icon className="size-4" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold truncate text-[#0F172A] dark:text-white">
                              {item.title}
                            </p>
                            {item.badge && (
                              <span className="inline-flex items-center px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-purple-100 dark:bg-purple-950 text-[#6366F1] dark:text-[#A5B4FC] border border-purple-200 dark:border-purple-800/60">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <ArrowRight
                        className={cn(
                          'size-3.5 shrink-0 transition-transform ml-2',
                          isHighlighted
                            ? 'opacity-100 translate-x-0.5 text-[#6366F1] dark:text-[#A5B4FC]'
                            : 'opacity-0',
                        )}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center space-y-1">
                <Search className="size-6 text-[#94A3B8] mx-auto mb-2 opacity-60" />
                <p className="text-xs font-bold text-[#0F172A] dark:text-white">
                  No matching results for &ldquo;{query}&rdquo;
                </p>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                  Try searching for dashboard, pricing, inventory, reports, or
                  settings.
                </p>
              </div>
            )}

            {/* Footer tip */}
            <div className="pt-2 mt-1 border-t border-slate-100 dark:border-[#1E2638] flex items-center justify-between px-3 text-[10px] text-[#94A3B8]">
              <span>Click or press Enter to navigate</span>
              <span className="font-mono">ESC to close</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
