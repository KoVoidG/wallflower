const fs = require('fs');
const file = '/Users/Shared/projects/AI/wallflower/src/features/dashboard/components/dashboard-view.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacements = [
  ['text-[#0F172A] dark:text-slate-200', 'text-text-primary'],
  ['bg-[#EDE9FE] dark:bg-purple-950/80', 'bg-brand-soft/20'],
  ['text-[#6D28D9] dark:text-purple-300', 'text-brand'],
  ['bg-[#8B5CF6] dark:bg-purple-400', 'bg-brand'],
  ['border-[#DDD6FE] dark:border-purple-700/60', 'border-brand/30'],
  ['bg-white dark:bg-[#111622]', 'bg-surface'],
  ['border-slate-100 dark:border-[#1E2638]', 'border-border/60'],
  ['text-[#0F172A] dark:text-white', 'text-text-primary'],
  ['text-[#4F46E5] dark:text-[#818CF8]', 'text-brand'],
  ['divide-slate-100 dark:divide-[#1E2638]', 'divide-border/60'],
  ['hover:bg-[#6366F1]/10 dark:hover:bg-[#6366F1]/20', 'hover:bg-brand-soft/10'],
  ['bg-slate-50 dark:bg-[#1E2638]', 'bg-surface-subtle'],
  ['text-[#64748B] dark:text-slate-300', 'text-text-secondary'],
  ['border-slate-200/80 dark:border-[#2A344A]', 'border-border/80'],
  ['group-hover:text-[#4F46E5] dark:group-hover:text-[#A5B4FC]', 'group-hover:text-brand'],
  ['text-[#64748B] dark:text-[#94A3B8]', 'text-text-muted'],
  ['border border-slate-200 text-slate-600 dark:text-slate-300 dark:border-[#2A344A] bg-slate-50 dark:bg-[#1E2638]', 'border border-border/80 text-text-secondary bg-surface-subtle'],
  ['border-[#DDD6FE]/60 dark:border-purple-900/40', 'border-brand/30'],
  ['bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]', 'bg-brand'],
  ['bg-gradient-to-r from-[#8B5CF6]/5 to-transparent dark:from-purple-900/20', 'bg-gradient-to-r from-brand-soft/20 to-transparent']
];

for (const [search, replace] of replacements) {
  content = content.split(search).join(replace);
}

fs.writeFileSync(file, content);
console.log('Replacements complete.');
