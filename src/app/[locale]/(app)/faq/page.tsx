'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { HelpCircle, ChevronDown, Search, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/navigation';
import { Expand } from '@/components/motion';
import { AppPage, PageHeader } from '@/components/ui/layout';

export default function FAQPage() {
  const t = useTranslations('faqPage');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({ 0: true });

  const toggleItem = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const rawItems = [
    {
      category: 'general',
      question: t('items.0.question'),
      answer: t('items.0.answer'),
    },
    {
      category: 'general',
      question: t('items.1.question'),
      answer: t('items.1.answer'),
    },
    {
      category: 'data',
      question: t('items.2.question'),
      answer: t('items.2.answer'),
    },
    {
      category: 'simulations',
      question: t('items.3.question'),
      answer: t('items.3.answer'),
    },
    {
      category: 'reports',
      question: t('items.4.question'),
      answer: t('items.4.answer'),
    },
  ];

  const filteredItems = rawItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppPage>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        {/* Navigation back link */}
        <Link
          href="/help-support"
          className="inline-flex items-center gap-1 text-xs font-medium text-text-muted hover:text-brand transition-colors self-start"
        >
          <ArrowLeft className="size-3.5" />
          <span>Help & Support</span>
        </Link>

        {/* Page Header */}
        <PageHeader
          title={
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <HelpCircle className="size-5" />
              </div>
              <span>{t('title')}</span>
            </div>
          }
          description={t('subtitle')}
        />

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('subtitle')}
            className={cn(
              'w-full rounded-lg border border-border bg-surface pl-10 pr-4 py-2.5 text-xs sm:text-sm text-text-primary',
              'placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'
            )}
          />
        </div>

        {/* FAQ Accordion List with Motion Expand animation */}
        <div className="space-y-3">
          {filteredItems.map((item, index) => {
            const isOpen = !!openItems[index];

            return (
              <div
                key={index}
                className="rounded-xl border border-border bg-surface overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left font-medium text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs sm:text-sm font-semibold">{item.question}</span>
                  <ChevronDown
                    className={cn(
                      'size-4 shrink-0 text-text-muted transition-transform duration-200',
                      isOpen && 'rotate-180 text-brand'
                    )}
                  />
                </button>

                <Expand open={isOpen}>
                  <div className="border-t border-border/50 bg-surface-subtle/50 px-4 py-3.5 text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {item.answer}
                  </div>
                </Expand>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="rounded-xl border border-border bg-surface p-8 text-center text-text-muted text-xs">
              No questions match your query.
            </div>
          )}
        </div>
      </div>
    </AppPage>
  );
}
