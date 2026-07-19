'use client';

import {
  UserPlus,
  Tag,
  Megaphone,
  Wrench,
  Clock,
} from 'lucide-react';
import { H2, Body } from '@/components/ui/typography';
import { Surface } from '@/components/ui/surface';
import { FadeIn, StaggerChildren } from '@/components/motion';

const scenarios = [
  {
    icon: UserPlus,
    title: 'Hire a new employee',
    description:
      'See how additional salary costs impact cash flow, break-even timeline, and monthly burn rate.',
  },
  {
    icon: Tag,
    title: 'Adjust pricing',
    description:
      'Model the revenue and margin effect of raising or lowering prices across your product lines.',
  },
  {
    icon: Megaphone,
    title: 'Marketing investment',
    description:
      'Estimate the ROI timeline and cash impact of allocating budget to a marketing campaign.',
  },
  {
    icon: Wrench,
    title: 'Equipment purchase',
    description:
      'Compare buying vs leasing, understand depreciation effects, and plan around cash reserves.',
  },
  {
    icon: Clock,
    title: 'Payment delay',
    description:
      'Assess the working capital impact when a key customer delays payment by 30, 60, or 90 days.',
  },
];

export function ScenariosSection() {
  return (
    <section id="scenarios" className="py-20 md:py-28 bg-surface-subtle">
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <FadeIn>
          <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
            <H2>Scenarios you can simulate</H2>
            <Body className="mt-3">
              Every business decision carries risk. Wallflower lets you test
              the numbers before committing real resources.
            </Body>
          </div>
        </FadeIn>

        <StaggerChildren
          staggerDelay={0.08}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {scenarios.map((scenario) => (
            <StaggerChildren.Item key={scenario.title}>
              <Surface
                border
                className="p-5 h-full flex flex-col gap-3 hover:border-brand/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-center size-10 rounded-[var(--radius-md)] bg-brand-soft">
                  <scenario.icon className="size-5 text-brand" aria-hidden="true" />
                </div>
                <h3 className="text-[16px]/[24px] font-[600] text-text-primary">
                  {scenario.title}
                </h3>
                <Body>{scenario.description}</Body>
              </Surface>
            </StaggerChildren.Item>
          ))}

          {/* CTA card */}
          <StaggerChildren.Item>
            <a
              href="#cta"
              className="flex items-center justify-center h-full min-h-[160px] rounded-[var(--radius-md)] border-2 border-dashed border-border hover:border-brand/40 transition-colors p-5 cursor-pointer"
            >
              <span className="text-[15px]/[24px] font-[550] text-brand">
                Try a simulation →
              </span>
            </a>
          </StaggerChildren.Item>
        </StaggerChildren>
      </div>
    </section>
  );
}
