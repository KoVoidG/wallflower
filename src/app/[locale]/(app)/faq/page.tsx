'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, Search, ArrowLeft, ShieldCheck, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/i18n/navigation';
import { AppPage } from '@/components/ui/layout';
import { Card } from '@/components/ui/card';

interface FaqItem {
  question: string;
  answer: string;
  category: 'Math & Accuracy' | 'Simulations' | 'Data & Security' | 'General';
}

const FAQS: FaqItem[] = [
  {
    category: 'Math & Accuracy',
    question: 'How do I know the financial projections are accurate?',
    answer:
      'Unlike generic generative AI tools that hallucinate numbers, Wallflower runs on a 100% deterministic financial mathematical engine. Revenue, gross margin, operating expenses, cash burn, and runway formulas are computed with rigorous algebraic models using your actual historical numbers and elasticity curves. AI is only used to explain the results in plain language, not to do the math.',
  },
  {
    category: 'Simulations',
    question: 'What kind of business decisions can I simulate in Wallflower?',
    answer:
      'You can simulate price elasticity adjustments, employee headcount and payroll changes, supplier discount and bulk inventory terms, seasonal holiday promotions, new equipment purchases (CapEx), and new branch expansion. You can also build multi-variable custom scenarios combining multiple operational changes simultaneously.',
  },
  {
    category: 'Simulations',
    question: 'What is the Scenario Comparison Matrix?',
    answer:
      'The Comparison Matrix lets you evaluate 2 to 4 competing choices side-by-side (e.g. Baseline vs 5% Price Increase vs Hiring a Sales Rep). It compares Net Profit Delta, Revenue Delta, Cash Runway impact, Breakeven timeline, and Downside Risk buffer, ranking options by verified ROI.',
  },
  {
    category: 'Data & Security',
    question: 'How do I get my business data into Wallflower?',
    answer:
      'You can connect your point-of-sale (POS), accounting software, LiquiFlow sync, or simply upload a monthly Excel/CSV export. Wallflower normalizes your income and expense categories in under three minutes.',
  },
  {
    category: 'Data & Security',
    question: 'Is my business and financial data secure and private?',
    answer:
      'Yes. Your financial records are encrypted at rest with AES-256 and in transit with TLS 1.3. We do not use your private financial records or store data to train public foundation models.',
  },
  {
    category: 'General',
    question: 'Can I export reports to show my bank or business partners?',
    answer:
      'Yes. Pro and Business plans include 1-click exportable Executive Decision Reports in PDF and Excel formats. These reports include formal P&L projections, sensitivity bounds, and a mathematical verification badge designed for bank loan applications and investor reviews.',
  },
  {
    category: 'General',
    question: 'Do I need accounting or financial modeling experience to use Wallflower?',
    answer:
      'No. Wallflower was specifically engineered for busy retail SME owners, store managers, and founders. You simply adjust operational sliders and Capybot explains the financial trade-offs in plain language.',
  },
];

const CATEGORIES = ['All', 'Math & Accuracy', 'Simulations', 'Data & Security', 'General'] as const;

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredItems = FAQS.filter((item) => {
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
        {/* Top Back Navigation Link */}
        <Link
          href="/help-support"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline cursor-pointer self-start"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Help & Support</span>
        </Link>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand border border-brand-border shrink-0 shadow-2xs">
              <HelpCircle className="size-6" />
            </div>
            <div className="space-y-0.5">
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                Frequently Asked Questions
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary font-medium">
                Detailed answers regarding deterministic math models, simulations, and data security.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface text-xs font-bold text-text-secondary shadow-xs">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              <span>Verified Documentation</span>
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
                'placeholder:text-text-muted focus:outline-hidden focus:border-brand focus:ring-1 focus:ring-brand/30 shadow-2xs transition-colors'
              )}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat);
                    setOpenIndex(0);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap select-none ${
                    isSelected
                      ? 'bg-brand text-white shadow-2xs'
                      : 'border border-border bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordion List (Single Item Expanded at a Time) */}
        <div className="space-y-3">
          {filteredItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.question}
                className={cn(
                  'rounded-2xl border-2 border-border-strong bg-surface overflow-hidden shadow-2xs transition-all duration-200',
                  isOpen && 'border-brand/40 bg-brand-soft/20 shadow-sm ring-1 ring-brand/20'
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="flex w-full items-center justify-between gap-4 p-4.5 text-left font-bold text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs sm:text-sm font-bold text-text-primary">{item.question}</span>
                  <div
                    className={cn(
                      'size-7 rounded-lg flex items-center justify-center shrink-0 border transition-all',
                      isOpen
                        ? 'bg-brand text-white border-brand rotate-180'
                        : 'bg-surface-subtle border-border text-text-muted'
                    )}
                  >
                    <ChevronDown className="size-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border/60 bg-surface-subtle px-5 py-4 text-xs sm:text-sm text-text-secondary leading-relaxed font-medium">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <Card className="p-8 text-center text-text-muted text-xs font-semibold">
              No questions match your search filter.
            </Card>
          )}
        </div>

        {/* Contact Support Assistance Box */}
        <div className="p-5 rounded-2xl border border-border bg-surface-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-sm font-bold text-text-primary">
              Still have questions about your business modeling?
            </h3>
            <p className="text-xs text-text-secondary font-medium mt-0.5">
              Our financial modeling specialists are available to assist with custom scenario setup.
            </p>
          </div>
          <a
            href="mailto:support@wallflower.app"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold transition-colors shadow-xs shrink-0"
          >
            <Mail className="size-3.5" />
            <span>Contact Support</span>
          </a>
        </div>
      </div>
    </AppPage>
  );
}
