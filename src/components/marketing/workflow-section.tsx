'use client';

import {
  HelpCircle,
  FileSpreadsheet,
  Clock,
  AlertTriangle,
  ArrowRight,
  Database,
  Activity,
  Sliders,
  Sparkles,
  FileText,
} from 'lucide-react';

export function WorkflowSection() {
  const problemCards = [
    {
      icon: HelpCircle,
      title: 'Guesswork',
      desc: 'Relying on intuition can be expensive.',
    },
    {
      icon: FileSpreadsheet,
      title: 'Manual Spreadsheets',
      desc: 'Time-consuming and prone to errors.',
    },
    {
      icon: Clock,
      title: 'Delayed Decisions',
      desc: 'Miss opportunities while analyzing data.',
    },
    {
      icon: AlertTriangle,
      title: 'Unexpected Issues',
      desc: 'Cash flow problems appear out of nowhere.',
    },
  ];

  const steps = [
    {
      num: 1,
      icon: Database,
      title: 'Business Data',
      desc: 'You provide your financial and operational data.',
    },
    {
      num: 2,
      icon: Activity,
      title: 'Business Health',
      desc: 'We analyze your business and detect risks & opportunities.',
    },
    {
      num: 3,
      icon: Sliders,
      title: 'Decision Planner',
      desc: 'Simulate different scenarios and potential outcomes.',
    },
    {
      num: 4,
      icon: Sparkles,
      title: 'AI Insights',
      desc: 'AI explains the results and recommends the best actions.',
    },
    {
      num: 5,
      icon: FileText,
      title: 'Decision Report',
      desc: 'Get a professional report you can share and act on.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 border-b border-border/60 bg-background space-y-24">
      {/* Part 1: Problem Section */}
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 space-y-10 text-center">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Running a business shouldn&apos;t rely on guesswork.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {problemCards.map((card) => (
            <div
              key={card.title}
              className="p-6 rounded-2xl border-2 border-border-strong bg-surface space-y-3 shadow-2xs hover:shadow-md transition-all"
            >
              <div className="size-10 rounded-xl bg-surface-subtle text-text-muted border border-border/60 flex items-center justify-center">
                <card.icon className="size-5" />
              </div>
              <h3 className="font-display text-base font-bold text-text-primary">{card.title}</h3>
              <p className="text-xs text-text-secondary font-medium leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Highlight Banner */}
        <div className="p-4 sm:p-5 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 max-w-3xl mx-auto shadow-2xs">
          <p className="font-display text-sm sm:text-base font-bold">
            Wallflower helps you predict outcomes before making decisions.
          </p>
        </div>
      </div>

      {/* Part 2: How Wallflower Works (5 Steps) */}
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 space-y-12 text-center">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            How Wallflower Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center items-start">
          {steps.map((s, idx) => (
            <div key={s.title} className="flex flex-col items-center space-y-3 relative group">
              {/* Step Number Circle */}
              <div className="size-12 rounded-full border-2 border-tertiary bg-surface text-tertiary font-display text-base font-extrabold flex items-center justify-center shadow-2xs group-hover:bg-tertiary group-hover:text-on-primary transition-all">
                {s.num}
              </div>

              <h3 className="font-display text-sm font-bold text-text-primary flex items-center gap-1.5">
                <span>{s.title}</span>
                {idx < steps.length - 1 && (
                  <ArrowRight className="size-3.5 text-text-muted hidden lg:inline-block ml-1" />
                )}
              </h3>

              <p className="text-xs text-text-secondary font-medium leading-relaxed max-w-[200px]">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
