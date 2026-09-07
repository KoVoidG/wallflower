'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'How do I know the financial projections are accurate?',
    answer:
      'Unlike generic generative AI tools that hallucinate numbers, Wallflower runs on a 100% deterministic financial mathematical engine. Revenue, gross margin, operating expenses, cash burn, and runway formulas are computed with rigorous algebraic models using your actual historical numbers and elasticity curves. AI is only used to explain the results in plain language, not to do the math.',
  },
  {
    question: 'What kind of business decisions can I simulate in Wallflower?',
    answer:
      'You can simulate price elasticity adjustments, employee headcount and payroll changes, supplier discount and bulk inventory terms, seasonal holiday promotions, new equipment purchases (CapEx), and new branch expansion. You can also build multi-variable custom scenarios combining multiple operational changes simultaneously.',
  },
  {
    question: 'What is the Scenario Comparison Matrix?',
    answer:
      'The Comparison Matrix lets you evaluate 2 to 4 competing choices side-by-side (e.g. Baseline vs 5% Price Increase vs Hiring a Sales Rep). It compares Net Profit Delta, Revenue Delta, Cash Runway impact, Breakeven timeline, and Downside Risk buffer, ranking options by verified ROI.',
  },
  {
    question: 'How do I get my business data into Wallflower?',
    answer:
      'You can connect your point-of-sale (POS), accounting software, LiquiFlow sync, or simply upload a monthly Excel/CSV export. Wallflower normalizes your income and expense categories in under three minutes.',
  },
  {
    question: 'Is my business and financial data secure and private?',
    answer:
      'Yes. Your financial records are encrypted at rest with AES-256 and in transit with TLS 1.3. We do not use your private financial records or store data to train public foundation models.',
  },
  {
    question: 'Can I export reports to show my bank or business partners?',
    answer:
      'Yes. Pro and Business plans include 1-click exportable Executive Decision Reports in PDF and Excel formats. These reports include formal P&L projections, sensitivity bounds, and a mathematical verification badge designed for bank loan applications and investor reviews.',
  },
  {
    question: 'Do I need accounting or financial modeling experience to use Wallflower?',
    answer:
      'No. Wallflower was specifically engineered for busy retail SME owners, store managers, and founders. You simply adjust operational sliders and Capybot explains the financial trade-offs in plain language.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 sm:py-32 bg-[#FAFAFC] text-center">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 space-y-12">
        {/* Section Header (Centered) */}
        <div className="max-w-3xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700 mx-auto">
            <HelpCircle className="size-3.5" />
            <span>COMMONLY ASKED QUESTIONS</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight leading-[1.1]">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-zinc-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about Wallflower&apos;s deterministic math, simulations, security, and export capabilities.
          </p>
        </div>

        {/* FAQ Accordion List (Centered Max Width Container) */}
        <div className="max-w-3xl mx-auto space-y-3.5 text-left">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className={`rounded-2xl border transition-all ${
                  isOpen
                    ? 'border-indigo-300 bg-white shadow-md ring-1 ring-indigo-200'
                    : 'border-black/5 bg-white hover:border-black/10 shadow-sm hover:shadow-md'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left font-display text-base font-bold text-zinc-900 gap-4 cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <div
                    className={`size-7 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                      isOpen
                        ? 'bg-indigo-600 text-white border-indigo-600 rotate-180'
                        : 'bg-zinc-50 border-black/10 text-zinc-500'
                    }`}
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
                      <div className="px-5 pb-5 pt-1 text-sm text-zinc-600 font-medium leading-relaxed border-t border-black/5 mt-1">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
