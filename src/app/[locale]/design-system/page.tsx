'use client';

import { useState } from 'react';
import {
  Display,
  H1,
  H2,
  H3,
  BodyLarge,
  Body,
  BodySmall,
  Label,
  Caption,
  KpiValue,
  TableNumber,
} from '@/components/ui/typography';
import { Surface } from '@/components/ui/surface';
import { Badge } from '@/components/ui/badge';
import { MetricValue } from '@/components/ui/metric-value';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton, SkeletonText, SkeletonCard } from '@/components/ui/skeleton';
import { FadeIn, SlideUp, StaggerChildren, Expand, CountUp } from '@/components/motion';
import {
  Inbox,
  Zap,
  TrendingUp,
  AlertCircle,
  Sparkles,
  CheckCircle,
  Info,
} from 'lucide-react';

/* ---------- Color Palette Data ---------- */
const colorTokens = [
  { name: 'brand', variable: '--brand', classes: 'bg-brand' },
  { name: 'brand-hover', variable: '--brand-hover', classes: 'bg-brand-hover' },
  { name: 'brand-soft', variable: '--brand-soft', classes: 'bg-brand-soft' },
  { name: 'info', variable: '--info', classes: 'bg-info' },
  { name: 'info-soft', variable: '--info-soft', classes: 'bg-info-soft' },
  { name: 'success', variable: '--success', classes: 'bg-success' },
  { name: 'success-soft', variable: '--success-soft', classes: 'bg-success-soft' },
  { name: 'warning', variable: '--warning', classes: 'bg-warning' },
  { name: 'warning-soft', variable: '--warning-soft', classes: 'bg-warning-soft' },
  { name: 'danger', variable: '--danger', classes: 'bg-danger' },
  { name: 'danger-soft', variable: '--danger-soft', classes: 'bg-danger-soft' },
  { name: 'ai', variable: '--ai', classes: 'bg-ai' },
  { name: 'ai-soft', variable: '--ai-soft', classes: 'bg-ai-soft' },
];

const surfaceTokens = [
  { name: 'background', variable: '--background', classes: 'bg-background' },
  { name: 'surface', variable: '--surface', classes: 'bg-surface' },
  { name: 'surface-subtle', variable: '--surface-subtle', classes: 'bg-surface-subtle' },
  { name: 'surface-raised', variable: '--surface-raised', classes: 'bg-surface-raised' },
];

const textTokens = [
  { name: 'text-primary', variable: '--text-primary', classes: 'bg-text-primary' },
  { name: 'text-secondary', variable: '--text-secondary', classes: 'bg-text-secondary' },
  { name: 'text-muted', variable: '--text-muted', classes: 'bg-text-muted' },
];

const borderTokens = [
  { name: 'border', variable: '--border', classes: 'bg-border' },
  { name: 'border-strong', variable: '--border-strong', classes: 'bg-border-strong' },
];

/* ---------- Section Wrapper ---------- */
function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Surface variant="default" border className="space-y-4">
      <div>
        <H2>{title}</H2>
        <Body>{description}</Body>
      </div>
      {children}
    </Surface>
  );
}

/* ---------- Color Swatch ---------- */
function Swatch({ name, classes }: { name: string; classes: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`size-12 rounded-[var(--radius-md)] border border-border ${classes}`} />
      <Caption>{name}</Caption>
    </div>
  );
}

/* ---------- Main Page ---------- */
export default function DesignSystemPage() {
  const [expandOpen, setExpandOpen] = useState(false);
  const [motionKey, setMotionKey] = useState(0);

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <div className="space-y-2">
        <H1>Design System</H1>
        <BodyLarge>
          Local showcase of Wallflower UI primitives, design tokens, and motion components.
        </BodyLarge>
      </div>

      {/* ─── Color Palette ─── */}
      <Section title="Color Palette" description="Brand, semantic, and surface color tokens.">
        <div className="space-y-4">
          <div>
            <Label>Brand &amp; Semantic</Label>
            <div className="flex flex-wrap gap-3 mt-2">
              {colorTokens.map((t) => (
                <Swatch key={t.name} name={t.name} classes={t.classes} />
              ))}
            </div>
          </div>
          <div>
            <Label>Surfaces</Label>
            <div className="flex flex-wrap gap-3 mt-2">
              {surfaceTokens.map((t) => (
                <Swatch key={t.name} name={t.name} classes={t.classes} />
              ))}
            </div>
          </div>
          <div>
            <Label>Text</Label>
            <div className="flex flex-wrap gap-3 mt-2">
              {textTokens.map((t) => (
                <Swatch key={t.name} name={t.name} classes={t.classes} />
              ))}
            </div>
          </div>
          <div>
            <Label>Borders</Label>
            <div className="flex flex-wrap gap-3 mt-2">
              {borderTokens.map((t) => (
                <Swatch key={t.name} name={t.name} classes={t.classes} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Typography ─── */}
      <Section title="Typography" description="All type scale components from Display to Caption.">
        <div className="space-y-3">
          <Display>Display</Display>
          <H1>Heading 1</H1>
          <H2>Heading 2</H2>
          <H3>Heading 3</H3>
          <BodyLarge>Body Large — used for lead text and introductions.</BodyLarge>
          <Body>Body — default paragraph text for content.</Body>
          <BodySmall>Body Small — secondary information and metadata.</BodySmall>
          <div className="flex flex-wrap gap-4 items-baseline">
            <Label>Label</Label>
            <Caption>Caption</Caption>
            <KpiValue>฿1,234,567</KpiValue>
            <TableNumber>12,345.67</TableNumber>
          </div>
        </div>
      </Section>

      {/* ─── Surfaces ─── */}
      <Section title="Surfaces" description="Container variants for grouping content.">
        <div className="grid gap-4 sm:grid-cols-3">
          <Surface variant="default" border className="p-4">
            <Label>Default + Border</Label>
            <BodySmall>Standard surface with border.</BodySmall>
          </Surface>
          <Surface variant="subtle" className="p-4">
            <Label>Subtle</Label>
            <BodySmall>Recessed background.</BodySmall>
          </Surface>
          <Surface variant="raised" className="p-4">
            <Label>Raised</Label>
            <BodySmall>Elevated with shadow.</BodySmall>
          </Surface>
        </div>
      </Section>

      {/* ─── Badges ─── */}
      <Section title="Badges" description="Status indicators with dot and icon support.">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="brand">Brand</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="ai">AI</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="success" dot>With Dot</Badge>
            <Badge variant="danger" dot>Critical</Badge>
            <Badge variant="ai" icon={<Sparkles />}>AI Insight</Badge>
            <Badge variant="info" icon={<Info />}>Information</Badge>
          </div>
        </div>
      </Section>

      {/* ─── Metric Values ─── */}
      <Section title="Metric Values" description="KPI display with labels, units, currency formatting, and change indicators.">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <MetricValue value={245} label="Active Users" change={12.5} changeLabel="vs last month" />
          <MetricValue value={1850000} label="Monthly Revenue" currency change={8.2} changeLabel="vs last month" />
          <MetricValue value="3.2" label="Avg Response Time" unit="ms" change={-15} changeLabel="improved" />
          <MetricValue value={42} label="Open Tasks" change={0} changeLabel="no change" />
        </div>
      </Section>

      {/* ─── States ─── */}
      <Section title="States" description="Empty and error state patterns for zero-data and failure scenarios.">
        <div className="grid gap-4 md:grid-cols-2">
          <Surface variant="subtle" className="rounded-[var(--radius-md)]">
            <EmptyState
              icon={<Inbox />}
              title="No scenarios yet"
              description="Create your first business scenario to start planning."
              action={
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-brand px-4 py-2 text-[14px] font-[550] text-white transition-colors hover:bg-brand-hover cursor-pointer"
                >
                  <Zap className="size-4" />
                  Create Scenario
                </button>
              }
            />
          </Surface>
          <Surface variant="subtle" className="rounded-[var(--radius-md)]">
            <ErrorState
              title="Failed to load data"
              description="We couldn't fetch your business metrics. Check your connection and try again."
              onRetry={() => alert('Retry clicked')}
            />
          </Surface>
        </div>
      </Section>

      {/* ─── Skeletons ─── */}
      <Section title="Skeletons" description="Loading placeholders that mimic content layout.">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-3">
            <Label>Skeleton</Label>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-10 w-1/2" />
          </div>
          <div className="space-y-3">
            <Label>SkeletonText</Label>
            <SkeletonText lines={4} />
          </div>
          <div className="space-y-3">
            <Label>SkeletonCard</Label>
            <SkeletonCard />
          </div>
        </div>
      </Section>

      {/* ─── Motion ─── */}
      <Section title="Motion" description="Animation primitives with reduced-motion support. Click to replay.">
        <div className="space-y-6">
          <button
            type="button"
            onClick={() => setMotionKey((k) => k + 1)}
            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-brand px-4 py-2 text-[14px] font-[550] text-white transition-colors hover:bg-brand-hover cursor-pointer"
          >
            Replay Animations
          </button>

          <div key={motionKey} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* FadeIn */}
            <Surface variant="subtle" className="p-4 space-y-2">
              <Label>FadeIn</Label>
              <FadeIn>
                <div className="flex items-center gap-2 text-brand">
                  <CheckCircle className="size-5" />
                  <Body className="!text-brand">Faded in content</Body>
                </div>
              </FadeIn>
            </Surface>

            {/* SlideUp */}
            <Surface variant="subtle" className="p-4 space-y-2">
              <Label>SlideUp</Label>
              <SlideUp>
                <div className="flex items-center gap-2 text-info">
                  <TrendingUp className="size-5" />
                  <Body className="!text-info">Slid up content</Body>
                </div>
              </SlideUp>
            </Surface>

            {/* StaggerChildren */}
            <Surface variant="subtle" className="p-4 space-y-2">
              <Label>StaggerChildren</Label>
              <StaggerChildren className="space-y-1">
                <StaggerChildren.Item>
                  <Badge variant="brand">Item 1</Badge>
                </StaggerChildren.Item>
                <StaggerChildren.Item>
                  <Badge variant="success">Item 2</Badge>
                </StaggerChildren.Item>
                <StaggerChildren.Item>
                  <Badge variant="info">Item 3</Badge>
                </StaggerChildren.Item>
                <StaggerChildren.Item>
                  <Badge variant="ai">Item 4</Badge>
                </StaggerChildren.Item>
              </StaggerChildren>
            </Surface>

            {/* CountUp */}
            <Surface variant="subtle" className="p-4 space-y-2">
              <Label>CountUp</Label>
              <div className="flex items-baseline gap-2">
                <KpiValue>
                  <CountUp to={1850000} formatter={(v) => `฿${Math.round(v).toLocaleString()}`} />
                </KpiValue>
              </div>
            </Surface>

            {/* Expand */}
            <Surface variant="subtle" className="p-4 space-y-2 md:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-3">
                <Label>Expand</Label>
                <button
                  type="button"
                  onClick={() => setExpandOpen((o) => !o)}
                  className="text-[13px] font-[550] text-brand hover:text-brand-hover transition-colors cursor-pointer"
                >
                  {expandOpen ? 'Collapse' : 'Expand'}
                </button>
              </div>
              <Expand open={expandOpen}>
                <Surface variant="raised" border className="p-3 mt-2">
                  <Body>
                    This content is animated with height: 0 → auto. Use for expandable
                    sections like risk details or accordion panels.
                  </Body>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="success" dot>Healthy</Badge>
                    <Badge variant="warning" icon={<AlertCircle />}>Needs Attention</Badge>
                  </div>
                </Surface>
              </Expand>
            </Surface>
          </div>
        </div>
      </Section>
    </div>
  );
}
