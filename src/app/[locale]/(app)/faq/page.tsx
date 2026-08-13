'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { HelpCircle, ChevronDown, Search, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/navigation';
import { Expand } from '@/components/motion';
import { AppPage } from '@/components/ui/layout';
import { Card } from '@/components/ui/card';

export default function FAQPage() {
  const t = useTranslations('faqPage');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({ 0: true });

  const toggleItem = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const rawItems = [
    {
      category: 'General',
      question: t('items.0.question'),
      answer: t('items.0.answer'),
    },
    {
      category: 'General',
      question: t('items.1.question'),
      answer: t('items.1.answer'),
    },
    {
      category: 'Data & Financials',
      question: t('items.2.question'),
      answer: t('items.2.answer'),
    },
    {
      category: 'Simulations',
      question: t('items.3.question'),
      answer: t('items.3.answer'),
    },
    {
      category: 'Reports',
      question: t('items.4.question'),
      answer: t('items.4.answer'),
    },
  ];

  const categories = ['All', 'General', 'Data & Financials', 'Simulations', 'Reports'];

  const filteredItems = rawItems.filter((item) => {
    if (activeCategory !== 'All' && item.category !== activeCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <AppPage>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto text-left animate-in fade-in duration-200">
        {/* Top Back Navigation Link (Decision Planner Style) */}
        <Link
          href="/help-support"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-tertiary hover:underline cursor-pointer self-start"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Help & Support</span>
        </Link>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-tertiary/15 text-tertiary border border-tertiary/30 shrink-0 shadow-2xs">
              <HelpCircle className="size-6" />
            </div>
            <div className="space-y-0.5">
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                {t('title')}
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary font-medium">
                {t('subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions or keywords..."
              className={cn(
                'w-full rounded-2xl border border-border bg-surface pl-10 pr-4 py-2.5 text-xs sm:text-sm text-text-primary font-medium',
                'placeholder:text-text-muted focus:outline-hidden focus:border-tertiary shadow-2xs transition-colors'
              )}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap select-none ${
                    isSelected
                      ? 'bg-tertiary text-on-primary shadow-2xs'
                      : 'border border-border bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredItems.map((item, index) => {
            const isOpen = !!openItems[index];

            return (
              <div
                key={index}
                className={cn(
                  'rounded-2xl border-2 border-border-strong bg-surface overflow-hidden shadow-2xs transition-all duration-200',
                  isOpen && 'border-tertiary/50 bg-tertiary/5'
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="flex w-full items-center justify-between gap-4 p-4.5 text-left font-bold text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs sm:text-sm font-bold text-text-primary">{item.question}</span>
                  <ChevronDown
                    className={cn(
                      'size-4 shrink-0 text-text-muted transition-transform duration-200',
                      isOpen && 'rotate-180 text-tertiary'
                    )}
                  />
                </button>

                <Expand open={isOpen}>
                  <div className="border-t border-border/60 bg-surface-subtle px-5 py-4 text-xs sm:text-sm text-text-secondary leading-relaxed font-medium">
                    {item.answer}
                  </div>
                </Expand>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <Card className="p-8 text-center text-text-muted text-xs font-semibold">
              No questions match your search filter.
            </Card>
          )}
        </div>
      </div>
    </AppPage>
  );
}
