'use client';

import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { BRAND_ICONS } from '@/features/integrations/components/brand-icons';

interface IntegrationCardData {
  id: string;
  name: string;
  category: string;
  description: string;
  badge: string;
  iconBg: string;
}

const ROW_ONE: IntegrationCardData[] = [
  {
    id: 'linear',
    name: 'Linear',
    category: 'Issue Tracker',
    description: 'Sync cycle velocity & roadmap bottleneck costs in real time.',
    badge: '2-Way Sync',
    iconBg: 'bg-[#5E6AD2]/10 text-[#5E6AD2] border-[#5E6AD2]/30',
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'Docs & Knowledge',
    description: 'Import operational schemas, structured tables & team SOPs.',
    badge: 'Live Pull',
    iconBg: 'bg-black/10 dark:bg-white/10 text-slate-900 dark:text-white border-black/20 dark:border-white/20',
  },
  {
    id: 'jira',
    name: 'Jira Software',
    category: 'Project Tracker',
    description: 'Track sprint velocity & cross-team dependencies automatically.',
    badge: '2-Way Sync',
    iconBg: 'bg-[#0052CC]/10 text-[#0052CC] dark:text-[#2684FF] border-[#0052CC]/30',
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'Engineering & CI',
    description: 'Monitor PR cycle times & developer throughput against burn rate.',
    badge: 'Webhook',
    iconBg: 'bg-slate-900/10 dark:bg-slate-100/10 text-slate-900 dark:text-slate-100 border-slate-900/20 dark:border-slate-100/20',
  },
  {
    id: 'asana',
    name: 'Asana',
    category: 'Work Management',
    description: 'Map team task timelines directly to cashflow runway milestones.',
    badge: 'Live Pull',
    iconBg: 'bg-[#F06A6A]/10 text-[#F06A6A] border-[#F06A6A]/30',
  },
  {
    id: 'trello',
    name: 'Trello',
    category: 'Kanban Boards',
    description: 'Track inventory ordering & supplier procurement pipeline stages.',
    badge: '2-Way Sync',
    iconBg: 'bg-[#0079BF]/10 text-[#0079BF] border-[#0079BF]/30',
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    category: 'DevOps & Releases',
    description: 'Correlate release cadences with operational customer conversion.',
    badge: 'Webhook',
    iconBg: 'bg-[#FC6D26]/10 text-[#FC6D26] border-[#FC6D26]/30',
  },
];

const ROW_TWO: IntegrationCardData[] = [
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'Enterprise CRM',
    description: 'Ingest pipeline stage probability & deal closing velocity.',
    badge: 'Bi-Directional',
    iconBg: 'bg-[#00A1E0]/10 text-[#00A1E0] border-[#00A1E0]/30',
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    category: 'Inbound Growth',
    description: 'Sync customer acquisition cost (CAC), LTV, & retention trends.',
    badge: 'Live Sync',
    iconBg: 'bg-[#FF7A59]/10 text-[#FF7A59] border-[#FF7A59]/30',
  },
  {
    id: 'zendesk',
    name: 'Zendesk',
    category: 'Customer Support',
    description: 'Analyze ticket turnaround time impact on customer churn risk.',
    badge: 'Live Sync',
    iconBg: 'bg-[#03363D]/10 dark:bg-[#17B897]/10 text-[#03363D] dark:text-[#17B897] border-[#03363D]/30 dark:border-[#17B897]/30',
  },
  {
    id: 'monday',
    name: 'Monday.com',
    category: 'Work OS',
    description: 'Synchronize departmental capacity, deadlines, and headcount.',
    badge: '2-Way Sync',
    iconBg: 'bg-[#FF3D57]/10 text-[#FF3D57] border-[#FF3D57]/30',
  },
  {
    id: 'intercom',
    name: 'Intercom',
    category: 'Customer Messaging',
    description: 'Measure onboarding time & VIP user customer lifetime values.',
    badge: 'Live Sync',
    iconBg: 'bg-[#1F8CEB]/10 text-[#1F8CEB] border-[#1F8CEB]/30',
  },
  {
    id: 'zapier',
    name: 'Zapier',
    category: 'Automation Hub',
    description: 'Connect to 5,000+ custom business triggers and webhook hooks.',
    badge: 'Instant Trigger',
    iconBg: 'bg-[#FF4A00]/10 text-[#FF4A00] border-[#FF4A00]/30',
  },
  {
    id: 'make',
    name: 'Make',
    category: 'Workflow Automation',
    description: 'Run multi-step financial scenario webhooks on autopilot.',
    badge: 'Instant Trigger',
    iconBg: 'bg-[#6D28D9]/10 text-[#6D28D9] border-[#6D28D9]/30',
  },
];

function IntegrationCard({ item }: { item: IntegrationCardData }) {
  const Icon = BRAND_ICONS[item.id];

  return (
    <div className="w-[300px] sm:w-[340px] shrink-0 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#111622] hover:border-brand/40 dark:hover:border-brand/50 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 group flex flex-col justify-between select-none">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`size-10 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105 ${item.iconBg}`}
            >
              {Icon ? <Icon className="size-5" /> : null}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand transition-colors">
                {item.name}
              </h4>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {item.category}
              </span>
            </div>
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#1A2234] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#2A344A]">
            {item.badge}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
          {item.description}
        </p>
      </div>

      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-[#1A2234] flex items-center justify-between text-[11px]">
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
          <CheckCircle2 className="size-3.5" />
          Verified Connector
        </span>
        <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px]">
          AES-256 Auth
        </span>
      </div>
    </div>
  );
}

export function IntegrationsMarqueeSection() {
  return (
    <section className="py-20 border-b border-slate-200/80 dark:border-[#1E2638] bg-slate-50/50 dark:bg-[#0C0F17]/60 overflow-hidden relative text-left">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#6366F1]/10 via-[#8B5CF6]/10 to-transparent blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 text-center space-y-4 mb-12">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold tracking-wider uppercase shadow-xs">
          <Sparkles className="size-3.5 text-brand" />
          Integrations & Ecosystem
        </div>

        <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Connect Seamlessly with Your{' '}
          <span className="bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#8B5CF6] bg-clip-text text-transparent">
            Operational Stack
          </span>
        </h2>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Wallflower synchronizes in real time with your project managers, CRMs, Git repos, and automation platforms — converting everyday activity into quantified financial trajectory models.
        </p>
      </div>

      {/* Marquee Container with Left and Right Gradient Mask Fades */}
      <div className="relative w-full space-y-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        {/* Row 1: Sliding Left to Right */}
        <div className="animate-marquee-right flex gap-4">
          {ROW_ONE.concat(ROW_ONE).map((item, idx) => (
            <IntegrationCard key={`r1-${item.id}-${idx}`} item={item} />
          ))}
        </div>

        {/* Row 2: Sliding Right to Left */}
        <div className="animate-marquee-left flex gap-4">
          {ROW_TWO.concat(ROW_TWO).map((item, idx) => (
            <IntegrationCard key={`r2-${item.id}-${idx}`} item={item} />
          ))}
        </div>
      </div>

      {/* Bottom CTA bar */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 text-center mt-10">
        <div className="inline-flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-[#111622] border border-slate-200 dark:border-[#1E2638] px-5 py-2.5 rounded-2xl shadow-2xs">
          <span>Need a custom webhook or ERP integration?</span>
          <Link
            href="/onboarding"
            className="font-bold text-brand hover:text-brand-hover inline-flex items-center gap-1 transition-colors"
          >
            Explore API & Webhooks
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
