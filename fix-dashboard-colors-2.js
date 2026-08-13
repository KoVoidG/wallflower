const fs = require('fs');
const file = '/Users/Shared/projects/AI/wallflower/src/features/dashboard/components/dashboard-view.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacements = [
  ['hover:bg-slate-100 dark:hover:bg-[#1E2638]', 'hover:bg-surface-hover'],
  ['text-text-muted hover:text-[#0F172A] dark:hover:text-white', 'text-text-muted hover:text-text-primary'],
  ['text-[#6366F1]', 'text-brand'],
  ['border border-transparent hover:border-[#6366F1]/30 hover:bg-brand-soft/10 dark:hover:border-[#6366F1]/40', 'border border-transparent hover:border-brand/30 hover:bg-brand-soft/10'],
  ['text-[#64748B]', 'text-text-muted'],
  ['text-[#94A3B8]', 'text-text-muted'],
  ['text-[#8B5CF6]', 'text-brand'],
  ['bg-[#ECFDF5] border border-[#A7F3D0] dark:bg-emerald-950/40 dark:border-emerald-800/50', 'bg-success/10 border border-success/30'],
  ['text-[#065F46] dark:text-emerald-300', 'text-success'],
  ['bg-slate-100 dark:bg-[#1E2638]', 'bg-surface-subtle'],
  ['border-slate-200 dark:border-[#2A344A]', 'border-border/60'],
  ['bg-[#F1F5F9] dark:bg-[#0B0F17]', 'bg-surface-subtle'],
  ['border-slate-200/80 dark:border-[#1E2638]', 'border-border/60'],
  ['bg-white dark:bg-[#1E2638]', 'bg-surface'],
  ['bg-gradient-to-r from-[#F5F3FF] via-[#EDE9FE] to-[#F3E8FF] dark:from-[#181438] dark:via-[#1B1742] dark:to-[#111622]', 'bg-gradient-to-r from-brand-soft/10 via-brand-soft/20 to-brand-soft/10'],
  ['border-[#DDD6FE] dark:border-purple-900/50', 'border-brand/30'],
  ['text-[#4F46E5] dark:text-purple-300', 'text-brand'],
  ['text-[#8B5CF6] dark:text-purple-400', 'text-brand'],
  ['text-[#8B5CF6]/70 dark:text-purple-400/70', 'text-brand/70'],
  ['hover:text-[#8B5CF6] dark:hover:text-purple-300', 'hover:text-brand'],
  ['bg-white/80 dark:bg-black/40', 'bg-surface-subtle/80'],
  ['border-purple-100/80 dark:border-purple-900/40', 'border-brand/20'],
  ['text-[#1E1B4B] dark:text-purple-100/90', 'text-text-primary'],
  ['border border-slate-200 text-slate-600 dark:text-slate-300 dark:border-[#2A344A]', 'border border-border/80 text-text-secondary'],
  ['hover:text-[#0F172A] dark:hover:text-white', 'hover:text-text-primary'],
  ['"#00D395"', '"var(--success)"'],
  ['"#F43F5E"', '"var(--danger)"'],
  ['"#3B82F6"', '"var(--brand)"'],
  ['"#111622"', '"var(--surface)"'],
  ['"#263042"', '"var(--border)"'],
  ['"#FFFFFF"', '"var(--text-primary)"'],
  ['"#E2E8F0"', '"var(--border)"'],
  ['dark:stroke-[#1E2638]', ''],
  ['"#94A3B8"', '"var(--text-muted)"']
];

for (const [search, replace] of replacements) {
  content = content.split(search).join(replace);
}

fs.writeFileSync(file, content);
console.log('Replacements complete.');
