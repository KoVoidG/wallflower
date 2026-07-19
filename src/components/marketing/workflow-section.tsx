'use client';

import { Stethoscope, FlaskConical, Rocket, ArrowRight } from 'lucide-react';
import { H2, Body } from '@/components/ui/typography';
import { Surface } from '@/components/ui/surface';
import { FadeIn, StaggerChildren } from '@/components/motion';

const steps = [
  {
    number: '01',
    icon: Stethoscope,
    title: 'Diagnose',
    description:
      'Wallflower calculates your business health from real numbers — revenue trends, expense ratios, cash runway, and working capital.',
  },
  {
    number: '02',
    icon: FlaskConical,
    title: 'Simulate',
    description:
      'Test decisions before committing. Run what-if scenarios for hiring, pricing, marketing spend, or equipment purchases.',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Act',
    description:
      'Compare outcomes side-by-side, understand the risks, and move forward with evidence backing your decision.',
  },
];

export function WorkflowSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-28">
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <FadeIn>
          <div className="text-center mb-12 md:mb-16">
            <H2>Three steps to a better decision</H2>
          </div>
        </FadeIn>

        <StaggerChildren
          staggerDelay={0.1}
          className="grid md:grid-cols-3 gap-6 md:gap-4 relative"
        >
          {steps.map((step, i) => (
            <StaggerChildren.Item key={step.number} className="relative">
              <Surface border className="p-6 h-full flex flex-col gap-4 text-center">
                <div className="mx-auto flex items-center justify-center size-12 rounded-full bg-brand-soft">
                  <step.icon className="size-5 text-brand" aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[12px]/[18px] font-[650] text-brand uppercase tracking-wider">
                    Step {step.number}
                  </span>
                  <h3 className="text-[20px]/[28px] font-[600] text-text-primary">
                    {step.title}
                  </h3>
                  <Body>{step.description}</Body>
                </div>
              </Surface>

              {/* Connecting arrow (desktop only, not on last item) */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-5 -translate-y-1/2 z-10 text-border">
                  <ArrowRight className="size-6" aria-hidden="true" />
                </div>
              )}
            </StaggerChildren.Item>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
