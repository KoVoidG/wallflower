'use client';

import { Banknote, Users, Brain, Zap, BarChart3 } from 'lucide-react';
import { H2, Body, BodyLarge } from '@/components/ui/typography';
import { FadeIn, StaggerChildren } from '@/components/motion';

const challenges = [
  {
    icon: Banknote,
    challenge: 'Cash flow pressure',
    solution:
      'Real-time cash runway tracking with early warnings when reserves run thin.',
  },
  {
    icon: Users,
    challenge: 'Limited staff, no CFO',
    solution:
      'Wallflower does the financial analysis so you can focus on running your business.',
  },
  {
    icon: Brain,
    challenge: 'Decision fatigue',
    solution:
      'Side-by-side scenario comparison takes the guesswork out of major decisions.',
  },
  {
    icon: Zap,
    challenge: 'Traditional vs digital',
    solution:
      'Simple interface that works like a conversation, not a spreadsheet.',
  },
  {
    icon: BarChart3,
    challenge: 'Unclear business health',
    solution:
      'Diagnostics and KPIs that show your business standing at a glance.',
  },
];

export function ThaiSmeSection() {
  return (
    <section className="py-20 md:py-28 bg-surface-subtle">
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <FadeIn>
          <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
            <H2>Built for Thai small businesses</H2>
            <BodyLarge className="mt-3">
              We understand the challenges Thai SMEs face every day.
              Wallflower is designed to address them directly.
            </BodyLarge>
          </div>
        </FadeIn>

        <StaggerChildren
          staggerDelay={0.08}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {challenges.map((item) => (
            <StaggerChildren.Item key={item.challenge}>
              <div className="flex flex-col gap-3 p-5">
                <div className="flex items-center justify-center size-10 rounded-[var(--radius-md)] bg-brand-soft">
                  <item.icon className="size-5 text-brand" aria-hidden="true" />
                </div>
                <h3 className="text-[16px]/[24px] font-[600] text-text-primary">
                  {item.challenge}
                </h3>
                <Body>{item.solution}</Body>
              </div>
            </StaggerChildren.Item>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
