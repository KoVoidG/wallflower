'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Expand } from '@/components/motion/expand';

export function FaqSection() {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({ 0: true });

  const toggleItem = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const faqs = [
    {
      question: 'What is Wallflower?',
      answer: 'Wallflower is a decision-intelligence engine designed for retail SMEs to simulate business decisions, detect financial risks, and analyze business health before spending real capital.',
    },
    {
      question: 'Who is Wallflower for?',
      answer: 'Wallflower is built specifically for retail SME owners, store managers, convenience stores, restaurants, pharmacies, and small retail chains looking for financial transparency.',
    },
    {
      question: 'How accurate are the simulations?',
      answer: 'Simulations use a 100% deterministic mathematical model based on standard SME financial accounting principles and your uploaded data baseline.',
    },
    {
      question: 'Does AI do the financial calculations?',
      answer: 'No. Deterministic math handles all calculations for total accuracy, while AI provides executive narrative summaries and strategic recommendations.',
    },
    {
      question: 'Can I use Wallflower without accounting software?',
      answer: 'Yes! You can upload simple monthly snapshots, CSV spreadsheets, or enter key business numbers manually in a few minutes.',
    },
  ];

  return (
    <section id="faq" className="py-20 border-b border-border/60 bg-background text-left">
      <div className="mx-auto w-full max-w-[1000px] px-5 sm:px-8 lg:px-12 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Frequently asked questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = !!openItems[index];

            return (
              <div
                key={faq.question}
                className={cn(
                  'rounded-2xl border-2 border-border-strong bg-surface overflow-hidden shadow-2xs transition-all duration-200',
                  isOpen && 'border-emerald-500/50 bg-emerald-500/5'
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="flex w-full items-center justify-between gap-4 p-4.5 text-left font-bold text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs sm:text-sm font-bold text-text-primary">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      'size-4 shrink-0 text-text-muted transition-transform duration-200',
                      isOpen && 'rotate-180 text-emerald-500'
                    )}
                  />
                </button>

                <Expand open={isOpen}>
                  <div className="border-t border-border/60 bg-surface-subtle px-5 py-4 text-xs sm:text-sm text-text-secondary leading-relaxed font-medium">
                    {faq.answer}
                  </div>
                </Expand>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
