// src/components/ui/date-picker.tsx
'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

const MONTH_NAMES_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MONTH_NAMES_TH = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

const WEEKDAY_NAMES_EN = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const WEEKDAY_NAMES_TH = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];

export interface DatePickerProps {
  value?: string | Date; // ISO string 'YYYY-MM-DD' or Date object
  onChange?: (date: Date, formattedDate: string) => void;
  customTrigger?: (currentDate: Date, isOpen: boolean) => React.ReactNode;
  align?: 'start' | 'end' | 'center';
  minYear?: number;
  maxYear?: number;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  customTrigger,
  align = 'end',
  minYear = 2020,
  maxYear = 2030,
  className,
}: DatePickerProps) {
  const locale = useLocale();
  const isThai = locale === 'th';

  const monthNames = isThai ? MONTH_NAMES_TH : MONTH_NAMES_EN;
  const weekdayNames = isThai ? WEEKDAY_NAMES_TH : WEEKDAY_NAMES_EN;

  // Helper to parse date safely
  const parseDate = (val?: string | Date): Date => {
    if (!val) return new Date();
    if (typeof val === 'string') {
      const parsed = new Date(val);
      return isNaN(parsed.getTime()) ? new Date() : parsed;
    }
    return val;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    parseDate(value),
  );
  const [tempDate, setTempDate] = useState<Date>(() => parseDate(value));

  // View navigation state (month & year being viewed)
  const [viewYear, setViewYear] = useState<number>(() =>
    parseDate(value).getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState<number>(() =>
    parseDate(value).getMonth(),
  );

  // Dropdown overlay states
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const monthListRef = useRef<HTMLDivElement>(null);
  const yearListRef = useRef<HTMLDivElement>(null);

  // Derived display date based on controlled prop or local state
  const displayDate = useMemo(() => {
    return value ? parseDate(value) : selectedDate;
  }, [value, selectedDate]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setIsMonthDropdownOpen(false);
        setIsYearDropdownOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Month navigation
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
    setIsMonthDropdownOpen(false);
    setIsYearDropdownOpen(false);
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
    setIsMonthDropdownOpen(false);
    setIsYearDropdownOpen(false);
  };

  // Calendar days grid computation (Monday-start)
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    const lastDayOfMonth = new Date(viewYear, viewMonth + 1, 0);

    // Monday-based index: 0 = Mon, ..., 6 = Sun
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const daysInMonth = lastDayOfMonth.getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const days: Array<{
      dayNumber: number;
      isCurrentMonth: boolean;
      date: Date;
    }> = [];

    // Previous month trailing days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(viewYear, viewMonth - 1, daysInPrevMonth - i);
      days.push({
        dayNumber: daysInPrevMonth - i,
        isCurrentMonth: false,
        date: prevDate,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const curDate = new Date(viewYear, viewMonth, i);
      days.push({
        dayNumber: i,
        isCurrentMonth: true,
        date: curDate,
      });
    }

    // Next month leading days (fill up to 35 or 42 grid cells)
    const totalCells = days.length <= 35 ? 35 : 42;
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(viewYear, viewMonth + 1, i);
      days.push({
        dayNumber: i,
        isCurrentMonth: false,
        date: nextDate,
      });
    }

    return days;
  }, [viewYear, viewMonth]);

  // Year range list
  const yearsList = useMemo(() => {
    const years: number[] = [];
    for (let y = minYear; y <= maxYear; y++) {
      years.push(y);
    }
    return years;
  }, [minYear, maxYear]);

  // Check if two dates represent the same day
  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Format date helper (e.g., 'May 20, 2024' or '20 พ.ค. 2024')
  const formatDisplayDate = (d: Date) => {
    return d.toLocaleDateString(isThai ? 'th-TH' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatIsoDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Handle Commit & Cancel
  const handleSelectConfirm = () => {
    setSelectedDate(tempDate);
    setIsOpen(false);
    setIsMonthDropdownOpen(false);
    setIsYearDropdownOpen(false);
    if (onChange) {
      onChange(tempDate, formatIsoDate(tempDate));
    }
  };

  const handleCancel = () => {
    const current = value ? parseDate(value) : selectedDate;
    setTempDate(current);
    setViewYear(current.getFullYear());
    setViewMonth(current.getMonth());
    setIsOpen(false);
    setIsMonthDropdownOpen(false);
    setIsYearDropdownOpen(false);
  };

  const toggleOpen = () => {
    if (!isOpen) {
      const current = value ? parseDate(value) : selectedDate;
      setTempDate(current);
      setViewYear(current.getFullYear());
      setViewMonth(current.getMonth());
      setIsMonthDropdownOpen(false);
      setIsYearDropdownOpen(false);
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      {/* ── Trigger Component ───────────────────────────────────────── */}
      {customTrigger ? (
        <div onClick={toggleOpen}>{customTrigger(displayDate, isOpen)}</div>
      ) : (
        <button
          type="button"
          onClick={toggleOpen}
          className={cn(
            'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-all duration-150 cursor-pointer select-none text-xs font-semibold',
            'border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#111622] text-[#0F172A] dark:text-white shadow-2xs hover:bg-slate-50 dark:hover:bg-[#182032]',
            isOpen && 'border-[#6366F1] ring-2 ring-[#6366F1]/20',
          )}
        >
          <CalendarIcon className="size-3.5 text-[#6366F1] dark:text-[#A5B4FC]" />
          <span>{formatDisplayDate(displayDate)}</span>
          <ChevronDown className="size-3 text-[#64748B] dark:text-[#94A3B8]" />
        </button>
      )}

      {/* ── Floating Popover Calendar ────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'absolute top-full mt-2 z-50 w-[310px] sm:w-[324px] rounded-3xl p-5',
              'bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-[#1E2638]',
              'shadow-2xl shadow-indigo-500/10 dark:shadow-black/60 text-left select-none',
              align === 'end'
                ? 'right-0'
                : align === 'center'
                  ? 'left-1/2 -translate-x-1/2'
                  : 'left-0',
            )}
          >
            {/* ── Top Header Bar (Month + Year + Nav Arrows) ─────────────── */}
            <div className="flex items-center justify-between gap-1 pb-3 mb-2 border-b border-slate-100 dark:border-[#1E2638]">
              <div className="flex items-center gap-2">
                {/* Month Dropdown Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMonthDropdownOpen((prev) => !prev);
                    setIsYearDropdownOpen(false);
                  }}
                  className={cn(
                    'inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider px-2 py-1 rounded-lg transition-colors cursor-pointer',
                    isMonthDropdownOpen
                      ? 'bg-purple-50 dark:bg-purple-950/70 text-[#6366F1] dark:text-[#A5B4FC]'
                      : 'text-[#6366F1] dark:text-[#A5B4FC] hover:bg-slate-100 dark:hover:bg-[#1E2638]',
                  )}
                >
                  <span>{monthNames[viewMonth]}</span>
                  {isMonthDropdownOpen ? (
                    <ChevronUp className="size-3.5" />
                  ) : (
                    <ChevronDown className="size-3.5" />
                  )}
                </button>

                {/* Year Dropdown Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsYearDropdownOpen((prev) => !prev);
                    setIsMonthDropdownOpen(false);
                  }}
                  className={cn(
                    'inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer',
                    isYearDropdownOpen
                      ? 'bg-purple-50 dark:bg-purple-950/70 text-[#6366F1] dark:text-[#A5B4FC]'
                      : 'text-[#0F172A] dark:text-white hover:bg-slate-100 dark:hover:bg-[#1E2638]',
                  )}
                >
                  <span>{viewYear}</span>
                  {isYearDropdownOpen ? (
                    <ChevronUp className="size-3.5" />
                  ) : (
                    <ChevronDown className="size-3.5" />
                  )}
                </button>
              </div>

              {/* Prev / Next Month Buttons */}
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1E2638] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white transition-colors cursor-pointer"
                  title={isThai ? 'เดือนก่อนหน้า' : 'Previous Month'}
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1E2638] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white transition-colors cursor-pointer"
                  title={isThai ? 'เดือนถัดไป' : 'Next Month'}
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            {/* ── Relative Body Container (Hosts Days Grid and Dropdown Overlays) ── */}
            <div className="relative min-h-[224px]">
              {/* Weekday Names Header */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {weekdayNames.map((w) => (
                  <span
                    key={w}
                    className="text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8]"
                  >
                    {w}
                  </span>
                ))}
              </div>

              {/* Day Numbers Grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {calendarDays.map((item, idx) => {
                  const isSelected = isSameDay(item.date, tempDate);

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setTempDate(item.date);
                        if (!item.isCurrentMonth) {
                          setViewYear(item.date.getFullYear());
                          setViewMonth(item.date.getMonth());
                        }
                      }}
                      className={cn(
                        'size-8 mx-auto flex items-center justify-center rounded-full text-xs font-semibold transition-all cursor-pointer',
                        isSelected
                          ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-bold shadow-md shadow-indigo-500/25 scale-105'
                          : item.isCurrentMonth
                            ? 'text-[#0F172A] dark:text-white hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-[#6366F1] dark:hover:text-[#A5B4FC]'
                            : 'text-[#CBD5E1] dark:text-[#334155] hover:text-[#64748B] dark:hover:text-[#94A3B8]',
                      )}
                    >
                      {item.dayNumber}
                    </button>
                  );
                })}
              </div>

              {/* ── Overlay 1: Month Selection Dropdown Menu ───────────── */}
              <AnimatePresence>
                {isMonthDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute inset-x-0 top-0 z-20 w-44 rounded-2xl border border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#111622] shadow-2xl p-2.5"
                  >
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider px-2 block mb-1.5">
                      {isThai ? 'เลือกเดือน' : 'MONTH'}
                    </span>
                    <div
                      ref={monthListRef}
                      className="max-h-[190px] overflow-y-auto space-y-0.5 pr-1"
                    >
                      {monthNames.map((m, idx) => {
                        const isSelectedMonth = viewMonth === idx;
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => {
                              setViewMonth(idx);
                              setIsMonthDropdownOpen(false);
                            }}
                            className={cn(
                              'w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between',
                              isSelectedMonth
                                ? 'bg-purple-50 dark:bg-purple-950/60 text-[#6366F1] dark:text-[#A5B4FC] font-bold'
                                : 'text-[#0F172A] dark:text-white hover:bg-slate-50 dark:hover:bg-[#1E2638]',
                            )}
                          >
                            <span>{m}</span>
                            {isSelectedMonth && (
                              <span className="size-1.5 rounded-full bg-[#6366F1] dark:bg-[#A5B4FC]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Overlay 2: Year Selection Dropdown Menu ────────────── */}
              <AnimatePresence>
                {isYearDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute left-24 top-0 z-20 w-36 rounded-2xl border border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#111622] shadow-2xl p-2.5"
                  >
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider px-2 block mb-1.5">
                      {isThai ? 'เลือกปี' : 'YEAR'}
                    </span>
                    <div
                      ref={yearListRef}
                      className="max-h-[190px] overflow-y-auto space-y-0.5 pr-1"
                    >
                      {yearsList.map((y) => {
                        const isSelectedYear = viewYear === y;
                        return (
                          <button
                            key={y}
                            type="button"
                            onClick={() => {
                              setViewYear(y);
                              setIsYearDropdownOpen(false);
                            }}
                            className={cn(
                              'w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between',
                              isSelectedYear
                                ? 'bg-purple-50 dark:bg-purple-950/60 text-[#6366F1] dark:text-[#A5B4FC] font-bold'
                                : 'text-[#0F172A] dark:text-white hover:bg-slate-50 dark:hover:bg-[#1E2638]',
                            )}
                          >
                            <span>{y}</span>
                            {isSelectedYear && (
                              <span className="size-1.5 rounded-full bg-[#6366F1] dark:bg-[#A5B4FC]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Bottom Action Footer (Cancel & Select) ────────────────── */}
            <div className="flex items-center justify-end gap-2.5 pt-3.5 mt-2 border-t border-slate-100 dark:border-[#1E2638]">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-[#2A344A] bg-white dark:bg-[#111622] text-[#0F172A] dark:text-white hover:bg-slate-100 dark:hover:bg-[#1E2638] text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                {isThai ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSelectConfirm}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs font-bold hover:opacity-95 active:scale-95 shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
              >
                {isThai ? 'เลือก' : 'Select'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
