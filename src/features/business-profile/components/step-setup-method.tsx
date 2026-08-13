// src/features/business-profile/components/step-setup-method.tsx
'use client';

import {
  Clock,
  TrendingUp,
  HelpCircle,
  Sprout,
  CheckCircle2,
} from 'lucide-react';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';
import { BotAvatar } from '@/components/ui/bot-avatar';

export type SetupMethod = 'know_numbers' | 'need_guidance' | 'just_starting';

interface StepSetupMethodProps {
  selectedMethod?: SetupMethod;
  onSelectMethod: (method: SetupMethod) => void;
  onNext: () => void;
  onPrev?: () => void;
}

export function StepSetupMethod({
  onSelectMethod,
  onNext,
}: StepSetupMethodProps) {
  const locale = useLocale();
  const isThai = locale === 'th';

  const handleSelect = (methodId: SetupMethod) => {
    onSelectMethod(methodId);
    onNext();
  };

  const options = [
    {
      id: 'know_numbers' as SetupMethod,
      title: isThai
        ? 'ฉันรู้ตัวเลขธุรกิจของฉันอยู่แล้ว'
        : 'I already know my business numbers',
      description: isThai
        ? 'ฉันมีบันทึกและตัวเลขทางการเงินพร้อมแล้ว'
        : 'I have my financial records ready.',
      badge: '~5 min',
      icon: TrendingUp,
    },
    {
      id: 'need_guidance' as SetupMethod,
      title: isThai
        ? 'มีข้อมูลบางส่วนแต่ต้องการคำแนะนำ'
        : 'I have some records but need guidance',
      description: isThai
        ? 'ฉันจะกรอกเท่าที่มี และให้ระบบช่วยแนะนำส่วนที่เหลือ'
        : "I'll provide what I have and you'll guide me through the rest.",
      badge: '~6-8 min',
      icon: HelpCircle,
    },
    {
      id: 'just_starting' as SetupMethod,
      title: isThai
        ? 'เพิ่งเริ่มต้นหรือไม่เคยทำบัญชี'
        : "I'm just starting or don't keep financial records",
      description: isThai
        ? 'เริ่มจากข้อมูลพื้นฐาน แล้วประมาณการตัวเลขไปด้วยกัน'
        : "I'll start with basic info and estimate the rest.",
      badge: '~3-4 min',
      icon: Sprout,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
      {/* ── Fixed Dimensions White Card Container (Zero Scroll Canvas) ──── */}
      <div className="w-full rounded-3xl border border-slate-200/90 dark:border-[#1E2638] bg-white dark:bg-[#111622] shadow-2xl shadow-slate-900/5 dark:shadow-black/60 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 overflow-hidden">
        {/* ── Top Bar: Monochrome Logo & Clean Header ─────────────────── */}
        <div className="flex flex-col items-center justify-center border-b border-slate-100 dark:border-[#1E2638] pb-4 space-y-2">
          <Logo size="lg" showWordmark={true} />
        </div>

        {/* ── Mascot & Speech Bubble Section ──────────────────────────── */}
        <div className="flex items-center gap-4 sm:gap-5 px-1 sm:px-2">
          {/* CapyBot Avatar */}
          <div className="relative shrink-0">
            <BotAvatar size={56} animate={false} />
            <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white dark:border-[#111622] shadow-xs">
              <CheckCircle2 className="size-3 stroke-[3]" />
            </div>
          </div>

          {/* Speech Bubble */}
          <div className="relative flex-1 bg-slate-50 dark:bg-[#182032] border border-slate-200/90 dark:border-[#2A344A] rounded-2xl px-4 sm:px-5 py-3 shadow-xs">
            {/* Speech Bubble Pointer Arrow */}
            <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-r-8 border-r-slate-200/90 dark:border-r-[#2A344A]" />
            <div className="absolute top-1/2 -left-[7px] -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-7 border-r-slate-50 dark:border-r-[#182032]" />

            <h1 className="font-display text-sm sm:text-base font-bold text-[#0F172A] dark:text-white leading-tight">
              {isThai
                ? 'ยินดีต้อนรับ! คุณต้องการตั้งค่าธุรกิจอย่างไร?'
                : 'Welcome! How would you like to set up your business?'}
            </h1>
            <p className="text-[11px] sm:text-xs text-[#64748B] dark:text-[#94A3B8] font-medium mt-0.5">
              {isThai
                ? 'เราจะปรับแต่งขั้นตอนตามความต้องการของคุณ'
                : "We'll customize the experience based on your needs."}
            </p>
          </div>
        </div>

        {/* ── Interactive Choice Pill Cards (Black & White Minimalist) ──── */}
        <div className="space-y-3">
          {options.map((opt) => {
            const Icon = opt.icon;

            return (
              <div
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={cn(
                  'group relative flex items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-150 cursor-pointer select-none',
                  'border-slate-200/90 dark:border-[#1E2638] bg-white dark:bg-[#111622]',
                  'hover:border-[#6366F1] dark:hover:border-[#6366F1] hover:bg-purple-50/20 dark:hover:bg-purple-950/20 hover:scale-[1.01] active:scale-[0.99] hover:shadow-md',
                )}
              >
                {/* Left Side: Monochrome Icon + Text */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="size-11 rounded-xl flex items-center justify-center shrink-0 transition-colors border bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 group-hover:bg-[#6366F1]/10 group-hover:text-[#6366F1] dark:group-hover:text-[#A5B4FC] group-hover:border-[#6366F1]/30">
                    <Icon className="size-5" />
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-0.5 min-w-0">
                    <h2 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white group-hover:text-[#6366F1] dark:group-hover:text-[#A5B4FC] transition-colors leading-snug truncate">
                      {opt.title}
                    </h2>
                    <p className="text-[11px] sm:text-xs text-[#64748B] dark:text-[#94A3B8] font-medium leading-tight line-clamp-1">
                      {opt.description}
                    </p>
                  </div>
                </div>

                {/* Right Side: Monochrome Estimated Time Badge */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700">
                    <Clock className="size-3" />
                    <span>{opt.badge}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
