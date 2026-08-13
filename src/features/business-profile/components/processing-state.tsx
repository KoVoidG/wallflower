// src/features/business-profile/components/processing-state.tsx
'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { FadeIn } from '@/components/motion';
import { BotAvatar } from '@/components/ui/bot-avatar';
import { Logo } from '@/components/ui/logo';

interface ProcessingStateProps {
  businessName?: string;
  onComplete: () => void;
}

const STAGES = [
  'Business Profile & Operations Context Analysis',
  'Financial Baseline & Expense Margin Audit',
  'Inventory Turnover & Shortage Sensitivity Check',
  'Deterministic Cash Runway & Risk Calibration',
  'Generating AI Executive Summary & Priorities',
];

const STAGES_TH = [
  'วิเคราะห์บริบทข้อมูลธุรกิจและการดำเนินงาน',
  'ตรวจสอบฐานข้อมูลการเงินและอัตรากำไร',
  'ประเมินอัตราหมุนเวียนสินค้าคงคลังและความเสี่ยงสินค้าขาด',
  'คำนวณระยะเวลาเงินสดหมุนเวียนและระดับความเสี่ยง',
  'จัดเตรียมบทสรุปผู้บริหารและข้อเสนอแนะเชิงกลยุทธ์',
];

export function ProcessingState({
  businessName = 'Your Business',
  onComplete,
}: ProcessingStateProps) {
  const locale = useLocale();
  const isThai = locale === 'th';
  const stagesList = isThai ? STAGES_TH : STAGES;

  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [progressPct, setProgressPct] = useState(0);
  const [isAllSet, setIsAllSet] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // 3-Second Total Processing Animation
  useEffect(() => {
    const TOTAL_DURATION_MS = 3000;
    const INTERVAL_MS = 60;
    const stageInterval = TOTAL_DURATION_MS / stagesList.length;

    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(
        100,
        Math.round((elapsed / TOTAL_DURATION_MS) * 100),
      );
      setProgressPct(pct);

      const stageIdx = Math.min(
        stagesList.length - 1,
        Math.floor(elapsed / stageInterval),
      );
      setCurrentStageIdx(stageIdx);

      if (elapsed >= TOTAL_DURATION_MS) {
        clearInterval(timer);
        setProgressPct(100);
        setCurrentStageIdx(stagesList.length - 1);
        setIsAllSet(true);
      }
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, [stagesList.length]);

  // Countdown timer inside CapyBot speech bubble, then trigger instant redirect
  useEffect(() => {
    if (!isAllSet) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (countdown === 0) {
      onComplete();
    }
  }, [isAllSet, countdown, onComplete]);

  return (
    <FadeIn>
      <div className="w-full max-w-4xl mx-auto flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
        {/* ── Fixed White Box Card (Zero Scroll Canvas) ──────────────────── */}
        <div className="w-full rounded-3xl border border-slate-200/90 dark:border-[#1E2638] bg-white dark:bg-[#111622] shadow-2xl shadow-slate-900/5 dark:shadow-black/60 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 overflow-hidden min-h-[460px]">
          {/* Top Logo */}
          <div className="flex items-center justify-center border-b border-slate-100 dark:border-[#1E2638] pb-4">
            <Logo size="md" showWordmark={true} />
          </div>

          {!isAllSet ? (
            /* ── Phase 1: Clean Aligned Processing Progress (3s Duration) ───── */
            <div className="space-y-5 max-w-md mx-auto w-full text-left my-auto">
              {/* Progress Bar Header */}
              <div className="w-full space-y-2">
                <div className="flex justify-between items-center text-xs font-bold px-0.5">
                  <span className="text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider text-[11px] font-bold">
                    {isThai ? 'กำลังประมวลผลข้อมูล' : 'PROCESSING DATA'}
                  </span>
                  <span className="font-mono text-[#6366F1] dark:text-[#A5B4FC] font-extrabold text-xs">
                    {progressPct}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-[#182032] border border-slate-200 dark:border-[#2A344A] rounded-full overflow-hidden p-0.5 shadow-2xs">
                  <div
                    className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full transition-all duration-75 ease-linear"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Stages Checklist */}
              <div className="w-full space-y-2 text-left rounded-2xl border border-slate-200 dark:border-[#1E2638] bg-slate-50/70 dark:bg-[#182032]/60 p-3.5 text-xs shadow-2xs">
                {stagesList.map((stage, idx) => {
                  const isDone =
                    idx < currentStageIdx ||
                    (idx === currentStageIdx && progressPct === 100);
                  const isCurrent =
                    idx === currentStageIdx && progressPct < 100;

                  return (
                    <div
                      key={stage}
                      className={cn(
                        'flex items-center gap-2.5 p-2 rounded-xl transition-all duration-150',
                        isDone
                          ? 'text-[#4F46E5] dark:text-[#A5B4FC] font-semibold bg-[#6366F1]/5'
                          : isCurrent
                            ? 'text-[#4F46E5] dark:text-[#A5B4FC] font-bold bg-white dark:bg-[#0B0F17] border border-[#6366F1]/20 shadow-2xs'
                            : 'text-[#64748B] opacity-50',
                      )}
                    >
                      {isDone ? (
                        <CheckCircle2 className="size-4 shrink-0 text-[#6366F1] stroke-[2.5]" />
                      ) : isCurrent ? (
                        <Loader2 className="size-4 shrink-0 animate-spin text-[#6366F1]" />
                      ) : (
                        <div className="size-3.5 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                      )}
                      <span className="truncate text-xs">{stage}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ── Phase 2: All Set! CapyBot Speaking with Countdown Inside Bubble ─ */
            <div className="max-w-lg mx-auto w-full text-center animate-in fade-in zoom-in-95 duration-300 my-auto py-4">
              {/* Mascot & Speech Bubble */}
              <div className="flex items-center gap-4 sm:gap-5 px-1 sm:px-2">
                {/* CapyBot Avatar with green check badge */}
                <div className="relative shrink-0">
                  <BotAvatar size={68} animate={true} />
                  <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white dark:border-[#111622] shadow-sm">
                    <CheckCircle2 className="size-3.5 stroke-[3]" />
                  </div>
                </div>

                {/* Comic Speech Bubble with countdown spoken by CapyBot */}
                <div className="relative flex-1 bg-slate-50 dark:bg-[#182032] border border-slate-200/90 dark:border-[#2A344A] rounded-2xl px-5 py-4 shadow-sm text-left">
                  {/* Speech Bubble Pointer Arrow */}
                  <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-r-8 border-r-slate-200/90 dark:border-r-[#2A344A]" />
                  <div className="absolute top-1/2 -left-[7px] -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-7 border-r-slate-50 dark:border-r-[#182032]" />

                  <h1 className="font-display text-base sm:text-lg font-bold text-[#0F172A] dark:text-white leading-tight">
                    {isThai
                      ? `พร้อมแล้วครับ ${businessName}! 🎉`
                      : `All Set, ${businessName}! 🎉`}
                  </h1>

                  <div className="space-y-1.5 mt-1.5">
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium leading-relaxed">
                      {isThai
                        ? 'โมเดลการเงินและระบบวิเคราะห์ความเสี่ยงของคุณพร้อมใช้งานแล้ว'
                        : 'Your financial baseline and predictive risk models are calibrated.'}
                    </p>

                    <div className="pt-0.5 flex items-center gap-2 text-xs font-semibold text-[#0F172A] dark:text-white">
                      <span>
                        {isThai
                          ? 'กำลังนำท่านเข้าสู่แดชบอร์ดในอีก'
                          : 'Redirecting to your dashboard in'}
                      </span>
                      <span className="font-mono font-black text-sm sm:text-base text-[#6366F1] dark:text-[#A5B4FC] px-2 py-0.5 rounded-lg inline-flex items-center justify-center min-w-[32px] shadow-2xs">
                        {countdown}s
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Trust Note */}
          <div className="text-center pt-2 border-t border-slate-100 dark:border-[#1E2638]">
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium">
              🔒 Strict deterministic verification — zero hallucinated financial
              values.
            </p>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
