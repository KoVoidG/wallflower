'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { useLocale } from 'next-intl';
import { usePathname, Link } from '@/lib/i18n/navigation';
import {
  Clock,
  Plus,
  X,
  Send,
  ArrowRight,
  Search,
  Trash2,
  ChevronRight,
  GripHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdvisorDrawer } from '../context/advisor-drawer-context';
import { Button } from '@/components/ui/button';
import { BotAvatar } from '@/components/ui/bot-avatar';

export interface AdvisorMessage {
  id: string;
  sender: 'user' | 'advisor';
  text?: string;
  timestamp: string;
  directAnswer?: string;
  usedSignals?: string[];
  evidence?: { label: string; value: string; note?: string }[];
  interpretation?: string;
  recommendedAction?: { title: string; description: string; href: string };
  followUpPrompts?: string[];
}

export interface ConversationHistoryItem {
  id: string;
  title: string;
  lastUpdated: string;
  timeframe: 'Today' | 'Yesterday' | 'Earlier';
  contextTag: string;
  messageCount: number;
  messages: AdvisorMessage[];
}

const INITIAL_HISTORY: ConversationHistoryItem[] = [
  {
    id: 'conv-1',
    title: 'Inventory Stockout & Turnover Audit',
    lastUpdated: '10 mins ago',
    timeframe: 'Today',
    contextTag: 'Inventory Overview',
    messageCount: 4,
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        text: 'Why is slow moving inventory value ฿120,000?',
        timestamp: '10:14 AM',
      },
      {
        id: 'msg-2',
        sender: 'advisor',
        timestamp: '10:15 AM',
        directAnswer:
          'Slow moving inventory stands at ฿120,000 (14.1% of total inventory value) primarily due to 5 bulk stock categories exceeding 75 days of coverage.',
        usedSignals: ['Slow Moving Value (฿120k)', 'Coverage (38 days)'],
        evidence: [
          {
            label: 'Instant Noodles Bulk',
            value: '125 days stock',
            note: '฿38,000',
          },
          {
            label: 'Chocolate Wafer Box',
            value: '98 days stock',
            note: '฿27,500',
          },
        ],
        interpretation:
          'Releasing capital from these slow items through targeted bundle promotions could free up approximately ฿45,000 in liquid working capital within 30 days.',
        recommendedAction: {
          title: 'Launch Slow-Stock Clearance Promotion',
          description:
            'Apply a 15% discount bundle on bulk items with >90 days coverage.',
          href: '/simulations/new?type=clearance',
        },
        followUpPrompts: [
          'Which slow-moving item should I bundle first?',
          'How does clearing slow stock impact cash runway?',
        ],
      },
    ],
  },
  {
    id: 'conv-2',
    title: 'Cash Runway Deficit Projections',
    lastUpdated: 'Yesterday',
    timeframe: 'Yesterday',
    contextTag: 'Financial Snapshot',
    messageCount: 6,
    messages: [
      {
        id: 'msg-3',
        sender: 'user',
        text: 'Why did cash runway drop to 2.1 months?',
        timestamp: 'Yesterday 3:45 PM',
      },
      {
        id: 'msg-4',
        sender: 'advisor',
        timestamp: 'Yesterday 3:45 PM',
        directAnswer:
          'Cash runway decreased to 2.1 months because net monthly operating deficit was ฿12,400 while ฿21,340 in receivables became 45+ days overdue.',
        usedSignals: ['Net Burn (-฿12,400)', 'Overdue Receivables (฿21,340)'],
        evidence: [
          {
            label: 'Usable Cash Buffer',
            value: '฿245,000',
            note: 'Verified snapshot',
          },
          {
            label: 'Monthly Deficit',
            value: '-฿12,400',
            note: 'Operating drag',
          },
        ],
        interpretation:
          'Collecting overdue invoices will immediately restore runway back to 3.2 months without additional debt.',
        recommendedAction: {
          title: 'Initiate Overdue Receivables Action Plan',
          description:
            'Contact top 3 delayed customer accounts to offer early settlement discounts.',
          href: '/simulations/new?type=payment_delay',
        },
        followUpPrompts: [
          'What happens if receivables are delayed another 30 days?',
          'Can the business afford another employee?',
        ],
      },
    ],
  },
  {
    id: 'conv-3',
    title: 'Q2 Hiring & Staff Payroll Capacity',
    lastUpdated: '3 days ago',
    timeframe: 'Earlier',
    contextTag: 'Operations',
    messageCount: 3,
    messages: [
      {
        id: 'msg-5',
        sender: 'user',
        text: 'Can we afford to hire 1 full-time store associate?',
        timestamp: 'Jan 28',
      },
      {
        id: 'msg-6',
        sender: 'advisor',
        timestamp: 'Jan 28',
        directAnswer:
          'Hiring 1 full-time associate at ฿25,000/mo increases monthly payroll by ฿28,750 (including benefits), shifting cash runway from 2.1 to 1.5 months under conservative revenue.',
        usedSignals: ['Base Salary (฿25,000)', 'Runway Shift (2.1 → 1.5 mo)'],
        evidence: [
          {
            label: 'Monthly Base Salary',
            value: '฿25,000',
            note: '1 new hire',
          },
          {
            label: 'Total Commitment',
            value: '฿28,750',
            note: 'Includes 15% benefits',
          },
        ],
        interpretation:
          'Consider a part-time trial (15 hrs/week at ฿12,000/mo) until revenue growth reaches the 8% target.',
        recommendedAction: {
          title: 'Test Headcount Simulation',
          description:
            'Run headcount scenario in Decision Planner to evaluate revenue ramp-up threshold.',
          href: '/simulations/new?type=hire_employees',
        },
      },
    ],
  },
];

const PRESET_QUICK_QUESTIONS: Record<string, string[]> = {
  business: [
    'Why is slow moving inventory value ฿120,000?',
    'Which product category generates highest margin?',
    'What is our current stockout risk level?',
    'How to optimize staff turnover & labor cost ratio?',
  ],
  simulations: [
    'How does a 10% price increase affect profit margin?',
    'Can the business afford another employee right now?',
    'What happens if supplier costs increase by 5%?',
  ],
  default: [
    'Why did cash runway decrease this month?',
    'Which risk should I handle first?',
    'What is causing my overdue receivables drag?',
    'How can I improve working capital score?',
  ],
};

const PRESET_QUICK_QUESTIONS_TH: Record<string, string[]> = {
  business: [
    'ทำไมมูลค่าสินค้าคงคลังเคลื่อนไหวช้าถึงอยู่ที่ ฿120,000?',
    'หมวดหมู่สินค้าใดสร้างอัตรากำไรสูงสุด?',
    'ความเสี่ยงสินค้าขาดสต็อกของเราอยู่ในระดับใด?',
    'จะปรับปรุงอัตราต้นทุนแรงงานและพนักงานอย่างไร?',
  ],
  simulations: [
    'การปรับขึ้นราคา 10% จะส่งผลต่ออัตรากำไรอย่างไร?',
    'ธุรกิจสามารถจ้างพนักงานเพิ่มได้หรือไม่ในตอนนี้?',
    'จะเกิดอะไรขึ้นหากต้นทุนซัพพลายเออร์เพิ่มขึ้น 5%?',
  ],
  default: [
    'ทำไมเงินสดสำรองถึงลดลงในเดือนนี้?',
    'ความเสี่ยงใดที่ควรจัดการเป็นอันดับแรก?',
    'อะไรคือสาเหตุของลูกหนี้การค้าที่เกินกำหนด?',
    'จะปรับปรุงคะแนนเงินทุนหมุนเวียนได้อย่างไร?',
  ],
};

export function FloatingAIAdvisor() {
  const locale = useLocale();
  const isThai = locale === 'th';
  const pathname = usePathname();
  const { isOpen, closeAdvisor, pendingQuery, clearPendingQuery } =
    useAdvisorDrawer();

  // Widget States
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [historyList, setHistoryList] =
    useState<ConversationHistoryItem[]>(INITIAL_HISTORY);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);

  // Active Chat State
  const [messages, setMessages] = useState<AdvisorMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Window Size, Position & Framer Motion Drag Controls
  const dragControls = useDragControls();
  const [winPos, setWinPos] = useState<{ top: number; left: number }>(() => {
    if (typeof window !== 'undefined') {
      const h = window.innerHeight;
      const w = window.innerWidth;
      return {
        top: Math.max(16, h - 624),
        left: Math.max(16, w - 504),
      };
    }
    return { top: 120, left: 900 };
  });
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    width: 480,
    height: 600,
  });
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef<{
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startTop: number;
    startLeft: number;
    direction: string;
  } | null>(null);

  // Reset window size & position to original bottom-right corner whenever reopened
  const prevIsOpenRef = useRef(isOpen);
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      const handle = requestAnimationFrame(() => {
        if (typeof window !== 'undefined') {
          const h = window.innerHeight;
          const w = window.innerWidth;
          setWinPos({
            top: Math.max(16, h - 624),
            left: Math.max(16, w - 504),
          });
        }
        setWindowSize({ width: 480, height: 600 });
      });
      return () => cancelAnimationFrame(handle);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen]);

  const handlePointerDownHeader = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, input, a, textarea')) return;
    dragControls.start(e);
  };

  // Handle Edge & Corner Resizing
  const handleResizeStart = (
    e: React.PointerEvent<HTMLDivElement>,
    direction: string,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: windowSize.width,
      startHeight: windowSize.height,
      startTop: winPos.top,
      startLeft: winPos.left,
      direction,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleResizeMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isResizing || !resizeStartRef.current) return;
    const {
      startX,
      startY,
      startWidth,
      startHeight,
      startTop,
      startLeft,
      direction,
    } = resizeStartRef.current;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    const minW = 360;
    const minH = 400;
    const maxW = typeof window !== 'undefined' ? window.innerWidth - 40 : 1000;
    const maxH = typeof window !== 'undefined' ? window.innerHeight - 40 : 800;

    let newWidth = startWidth;
    let newHeight = startHeight;
    let newLeft = startLeft;
    let newTop = startTop;

    if (direction.includes('r')) {
      newWidth = Math.max(minW, Math.min(maxW, startWidth + deltaX));
    }
    if (direction.includes('l')) {
      newWidth = Math.max(minW, Math.min(maxW, startWidth - deltaX));
      newLeft = startLeft + (startWidth - newWidth);
    }
    if (direction.includes('b')) {
      newHeight = Math.max(minH, Math.min(maxH, startHeight + deltaY));
    }
    if (direction.includes('t')) {
      newHeight = Math.max(minH, Math.min(maxH, startHeight - deltaY));
      newTop = startTop + (startHeight - newHeight);
    }

    setWindowSize({ width: newWidth, height: newHeight });
    setWinPos({ top: newTop, left: newLeft });
  };

  const handleResizeEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isResizing) {
      setIsResizing(false);
      resizeStartRef.current = null;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // capture released
      }
    }
  };

  // Determine current context badge from URL pathname
  const getCurrentContextTag = useCallback(() => {
    if (pathname.includes('business-health') || pathname.includes('business'))
      return 'Business Health';
    if (pathname.includes('simulations') || pathname.includes('planner'))
      return 'Decision Planner';
    if (pathname.includes('reports')) return 'Reports Workspace';
    if (pathname.includes('settings')) return 'Settings';
    return 'Entire Business';
  }, [pathname]);

  // Send message logic
  const handleSendMessage = useCallback(
    (textToSend?: string) => {
      const query = (textToSend || inputText).trim();
      if (!query || isGenerating) return;

      const userMsg: AdvisorMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: query,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputText('');
      setIsGenerating(true);

      setTimeout(() => {
        setIsGenerating(false);
        const advMsg: AdvisorMessage = isThai
          ? {
              id: `adv-${Date.now()}`,
              sender: 'advisor',
              timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
              directAnswer: `ผลการวิเคราะห์ในบริบท ${getCurrentContextTag()}: สำหรับคำถาม "${query}" ปัจจุบันธุรกิจมีเงินสำรองสภาพคล่อง ฿245,000 และมีอัตราการเผาเงินสดสุทธิ ฿12,400 ต่อเดือน`,
              usedSignals: [
                'เงินสดที่ใช้ได้ (฿245,000)',
                'ระยะเวลาเงินสด (2.1 เดือน)',
                'ระยะเวลาเก็บหนี้ DSO (45 วัน)',
              ],
              evidence: [
                {
                  label: 'เงินสดสำรองปัจจุบัน',
                  value: '฿245,000',
                  note: 'ยืนยันข้อมูลแล้ว',
                },
                {
                  label: 'อัตรากำไรจากการดำเนินงาน',
                  value: '+14.2%',
                  note: 'เฉลี่ยย้อนหลัง 3 เดือน',
                },
              ],
              interpretation:
                'ข้อมูลบ่งชี้ว่ารายได้ดำเนินงานยังอยู่ในเกณฑ์ที่มั่นคง การเร่งติดตามลูกหนี้การค้าที่เกินกำหนดหรือทดลองจำลองสถานการณ์จะช่วยรักษาเงินสำรองให้อยู่ในเป้าหมาย 6 เดือนได้อย่างปลอดภัย',
              recommendedAction: {
                title: 'ทดสอบจำลองสถานการณ์ในเครื่องมือวางแผนการตัดสินใจ',
                description:
                  'จำลองการเติบโตของรายได้และตัวปรับลดค่าใช้จ่ายเพื่อดูผลกระทบต่อกระแสเงินสด',
                href: '/simulations/new',
              },
              followUpPrompts: [
                'ทำไมเงินสดสำรองถึงลดลงในเดือนนี้?',
                'ความเสี่ยงใดที่ควรจัดการเป็นอันดับแรก?',
              ],
            }
          : {
              id: `adv-${Date.now()}`,
              sender: 'advisor',
              timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
              directAnswer: `Analysis grounded in ${getCurrentContextTag()}: Regarding "${query}", your current cash buffer is ฿245,000 with a monthly net operating burn of ฿12,400.`,
              usedSignals: [
                'Usable Cash (฿245,000)',
                'Runway (2.1 mo)',
                'DSO (45 days)',
              ],
              evidence: [
                {
                  label: 'Current Buffer',
                  value: '฿245,000',
                  note: 'May 2024 Verified',
                },
                {
                  label: 'Operating Margin',
                  value: '+14.2%',
                  note: 'Trailing 3-month avg',
                },
              ],
              interpretation:
                'Grounded data shows stable operational revenue. Reviewing overdue receivables or running a sensitivity simulation will help maintain your 6-month target runway.',
              recommendedAction: {
                title: 'Run Scenario Simulation in Decision Planner',
                description:
                  'Simulate revenue growth and expense levers to evaluate runway impact.',
                href: '/simulations/new',
              },
              followUpPrompts: [
                'Why did cash runway decrease this month?',
                'Which risk should I handle first?',
              ],
            };
        setMessages((prev) => [...prev, advMsg]);
      }, 600);
    },
    [inputText, isGenerating, getCurrentContextTag, isThai],
  );

  // Handle incoming pending query when opened via global trigger
  useEffect(() => {
    if (isOpen && pendingQuery) {
      const q = pendingQuery;
      clearPendingQuery();
      const timer = setTimeout(() => {
        handleSendMessage(q);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, pendingQuery, clearPendingQuery, handleSendMessage]);

  // Auto-scroll chat
  useEffect(() => {
    if (isOpen) {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isGenerating, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    if (messages.length > 0) {
      const firstUserText =
        messages.find((m) => m.sender === 'user')?.text || 'Business Audit';
      const newConv: ConversationHistoryItem = {
        id: `conv-${Date.now()}`,
        title: firstUserText.slice(0, 32),
        lastUpdated: 'Just now',
        timeframe: 'Today',
        contextTag: getCurrentContextTag(),
        messageCount: messages.length,
        messages: [...messages],
      };
      setHistoryList((prev) => [newConv, ...prev]);
    }
    setMessages([]);
    setActiveConvId(null);
    setShowHistoryDrawer(false);
  };

  const loadConversation = (conv: ConversationHistoryItem) => {
    setMessages(conv.messages);
    setActiveConvId(conv.id);
    setShowHistoryDrawer(false);
  };

  const deleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHistoryList((prev) => prev.filter((item) => item.id !== id));
    if (activeConvId === id) {
      setMessages([]);
      setActiveConvId(null);
    }
  };

  // Filter history items by search query
  const filteredHistory = historyList.filter(
    (item) =>
      item.title.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.contextTag.toLowerCase().includes(historySearch.toLowerCase()),
  );

  const currentContextKey = pathname.includes('business')
    ? 'business'
    : pathname.includes('simulations')
      ? 'simulations'
      : 'default';
  const questionsBank = isThai ? PRESET_QUICK_QUESTIONS_TH : PRESET_QUICK_QUESTIONS;
  const quickQuestions =
    questionsBank[currentContextKey] || questionsBank.default;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="floating-ai-advisor-window"
          drag
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          initial={{ x: 450, y: 0, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          exit={{ x: 450, y: 0, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          style={{
            top: `${winPos.top}px`,
            left: `${winPos.left}px`,
            width: `${windowSize.width}px`,
            height: `${windowSize.height}px`,
          }}
          className="fixed z-50 flex flex-col rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden touch-none max-h-[90vh]"
        >
          {/* Edge & Corner Resize Handles */}
          <>
            {/* Edges */}
            <div
              onPointerDown={(e) => handleResizeStart(e, 't')}
              onPointerMove={handleResizeMove}
              onPointerUp={handleResizeEnd}
              className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize z-40 hover:bg-tertiary/20 transition-colors"
              title="Drag top edge to resize height"
            />
            <div
              onPointerDown={(e) => handleResizeStart(e, 'b')}
              onPointerMove={handleResizeMove}
              onPointerUp={handleResizeEnd}
              className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize z-40 hover:bg-tertiary/20 transition-colors"
              title="Drag bottom edge to resize height"
            />
            <div
              onPointerDown={(e) => handleResizeStart(e, 'l')}
              onPointerMove={handleResizeMove}
              onPointerUp={handleResizeEnd}
              className="absolute top-0 bottom-0 left-0 w-2 cursor-ew-resize z-40 hover:bg-tertiary/20 transition-colors"
              title="Drag left edge to resize width"
            />
            <div
              onPointerDown={(e) => handleResizeStart(e, 'r')}
              onPointerMove={handleResizeMove}
              onPointerUp={handleResizeEnd}
              className="absolute top-0 bottom-0 right-0 w-2 cursor-ew-resize z-40 hover:bg-tertiary/20 transition-colors"
              title="Drag right edge to resize width"
            />

            {/* Corners */}
            <div
              onPointerDown={(e) => handleResizeStart(e, 'tl')}
              onPointerMove={handleResizeMove}
              onPointerUp={handleResizeEnd}
              className="absolute top-0 left-0 size-3.5 cursor-nwse-resize z-50 hover:bg-tertiary/40 rounded-tl transition-colors"
              title="Drag corner to resize window"
            />
            <div
              onPointerDown={(e) => handleResizeStart(e, 'tr')}
              onPointerMove={handleResizeMove}
              onPointerUp={handleResizeEnd}
              className="absolute top-0 right-0 size-3.5 cursor-nesw-resize z-50 hover:bg-tertiary/40 rounded-tr transition-colors"
              title="Drag corner to resize window"
            />
            <div
              onPointerDown={(e) => handleResizeStart(e, 'bl')}
              onPointerMove={handleResizeMove}
              onPointerUp={handleResizeEnd}
              className="absolute bottom-0 left-0 size-3.5 cursor-nesw-resize z-50 hover:bg-tertiary/40 rounded-bl transition-colors"
              title="Drag corner to resize window"
            />
            <div
              onPointerDown={(e) => handleResizeStart(e, 'br')}
              onPointerMove={handleResizeMove}
              onPointerUp={handleResizeEnd}
              className="absolute bottom-0 right-0 size-3.5 cursor-nwse-resize z-50 hover:bg-tertiary/40 rounded-br transition-colors"
              title="Drag corner to resize window"
            />
          </>

          {/* ── TOP HEADER BAR (DRAG HANDLE) ─────────────────────────────────── */}
          <div
            onPointerDown={handlePointerDownHeader}
            className="flex items-center justify-between px-4 py-2.5 border-b border-border/80 bg-surface-subtle/80 backdrop-blur-md shrink-0 select-none cursor-grab active:cursor-grabbing hover:bg-surface-hover"
            title="Drag header to move window"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <GripHorizontal className="size-4 text-text-secondary/60 shrink-0" />

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-bold text-text-primary truncate">
                    Capybot
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full border border-tertiary/20 shrink-0">
                    <span className="size-1.5 rounded-full bg-tertiary animate-pulse" />
                    <span>{getCurrentContextTag()}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Header Action Controls */}
            <div className="flex items-center gap-1 shrink-0">
              {/* History Drawer Toggle Button */}
              <button
                type="button"
                onClick={() => setShowHistoryDrawer((prev) => !prev)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer',
                  showHistoryDrawer
                    ? 'bg-tertiary/15 text-tertiary border border-tertiary/30'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
                )}
                title={isThai ? 'ประวัติการสนทนา' : 'Toggle Conversation History Drawer'}
              >
                <Clock className="size-3.5" />
                <span className="hidden sm:inline">{isThai ? 'ประวัติ' : 'History'}</span>
              </button>

              {/* New Chat Button */}
              <button
                type="button"
                onClick={handleNewChat}
                className="p-1.5 rounded-md text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors cursor-pointer"
                title={isThai ? 'เริ่มการสนทนาใหม่' : 'Start New Conversation'}
              >
                <Plus className="size-4" />
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={closeAdvisor}
                className="p-1.5 rounded-md text-text-secondary hover:bg-danger/15 hover:text-danger transition-colors cursor-pointer"
                title={isThai ? 'ปิด Capybot' : 'Close Capybot'}
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* ── MAIN BODY CONTAINER (Flex Row for Drawer + Chat) ───────────── */}
          <div className="relative flex-1 flex overflow-hidden">
            {/* ── SLIDE-OUT HISTORY DRAWER ─────────────────────────────────── */}
            <div
              className={cn(
                'absolute inset-y-0 left-0 z-20 w-full sm:w-[280px] bg-surface border-r border-border flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-xl',
                showHistoryDrawer ? 'translate-x-0' : '-translate-x-full',
              )}
            >
              {/* Drawer Header */}
              <div className="p-3 border-b border-border/80 flex items-center justify-between bg-surface-subtle/50 shrink-0">
                <span className="font-display text-xs font-bold text-text-primary uppercase tracking-wider">
                  {isThai ? 'ประวัติการสนทนา' : 'Conversation History'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowHistoryDrawer(false)}
                  className="text-text-secondary hover:text-text-primary p-1 cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              {/* History Search Input */}
              <div className="p-3 border-b border-border/60 shrink-0">
                <div className="relative">
                  <Search className="size-3.5 text-text-secondary absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder={isThai ? 'ค้นหาประวัติ...' : 'Search history...'}
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    className="w-full bg-surface-hover text-xs text-text-primary pl-8 pr-3 py-1.5 rounded-md border border-border focus:outline-none focus:border-tertiary"
                  />
                </div>
              </div>

              {/* History List Items */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {filteredHistory.length === 0 ? (
                  <div className="p-4 text-center text-xs text-text-secondary">
                    {isThai ? 'ไม่พบประวัติการสนทนา' : 'No matching conversations'}
                  </div>
                ) : (
                  filteredHistory.map((item) => {
                    const isActive = activeConvId === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => loadConversation(item)}
                        className={cn(
                          'p-2.5 rounded-lg border transition-all cursor-pointer group flex flex-col space-y-1',
                          isActive
                            ? 'bg-tertiary/10 border-tertiary/40 text-tertiary'
                            : 'bg-surface border-border/60 hover:bg-surface-hover hover:border-border text-text-primary',
                        )}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="truncate pr-2">{item.title}</span>
                          <button
                            type="button"
                            onClick={(e) => deleteConversation(e, item.id)}
                            className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-danger p-0.5 transition-opacity"
                            title="Delete thread"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-text-secondary">
                          <span className="px-1.5 py-0.5 rounded bg-surface-subtle text-text-secondary font-mono">
                            {item.contextTag}
                          </span>
                          <span>{item.lastUpdated}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* ── MAIN CHAT STREAM CONTAINER ───────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 bg-surface overflow-hidden">
              {/* Scrollable Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="space-y-4 pt-2">
                    {/* Empty State Banner */}
                    <div className="p-4 rounded-xl border border-tertiary/20 bg-tertiary/5 space-y-3">
                      <div className="flex items-center gap-3 text-tertiary">
                        <BotAvatar size={48} />
                        <span className="font-display text-sm font-bold text-text-primary">
                          Ask Wallflower Capybot
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Ask any question about your cash flow, inventory
                        coverage, margins, or risk exposure. Responses are
                        grounded in live snapshot data.
                      </p>
                    </div>

                    {/* Quick Prompts */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider block">
                        Suggested Questions for {getCurrentContextTag()}
                      </span>
                      <div className="space-y-2">
                        {quickQuestions.map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => handleSendMessage(q)}
                            className="w-full text-left p-2.5 rounded-lg border border-border/80 bg-surface-subtle/60 hover:bg-surface-hover hover:border-tertiary/40 text-xs text-text-primary transition-all flex items-center justify-between group cursor-pointer"
                          >
                            <span className="truncate pr-2 font-medium">
                              {q}
                            </span>
                            <ChevronRight className="size-3.5 text-text-secondary group-hover:text-tertiary group-hover:translate-x-0.5 transition-all shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => {
                    if (msg.sender === 'user') {
                      return (
                        <div key={msg.id} className="flex justify-end">
                          <div className="max-w-[85%] p-3 rounded-xl bg-tertiary/15 border border-tertiary/30 text-xs text-text-primary space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-tertiary font-semibold border-b border-tertiary/20 pb-1">
                              <span>You</span>
                              <span>{msg.timestamp}</span>
                            </div>
                            <p className="font-medium pt-0.5 leading-relaxed">
                              {msg.text}
                            </p>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg.id}
                        className="p-4 rounded-xl border border-border bg-surface-subtle/50 space-y-3 text-xs"
                      >
                        {/* Advisor Header */}
                        <div className="flex items-center justify-between border-b border-border/60 pb-2">
                          <div className="flex items-center gap-1.5">
                            <BotAvatar size={18} animate={false} />
                            <span className="font-semibold text-text-primary">
                              Wallflower AI
                            </span>
                            <span className="text-[10px] text-text-secondary">
                              • Grounded Data
                            </span>
                          </div>
                          <span className="text-[10px] text-text-secondary">
                            {msg.timestamp}
                          </span>
                        </div>

                        {/* Direct Answer */}
                        {msg.directAnswer && (
                          <p className="font-semibold text-text-primary leading-relaxed text-xs sm:text-sm">
                            {msg.directAnswer}
                          </p>
                        )}

                        {/* Used Signals */}
                        {msg.usedSignals && msg.usedSignals.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                            <span className="text-text-secondary">
                              Signals:
                            </span>
                            {msg.usedSignals.map((sig) => (
                              <span
                                key={sig}
                                className="px-1.5 py-0.5 rounded bg-surface border border-border font-mono text-tertiary"
                              >
                                {sig}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Evidence List */}
                        {msg.evidence && msg.evidence.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            {msg.evidence.map((ev) => (
                              <div
                                key={ev.label}
                                className="p-2 rounded bg-surface border border-border/60 space-y-0.5"
                              >
                                <span className="text-[10px] text-text-secondary block">
                                  {ev.label}
                                </span>
                                <span className="font-mono font-bold text-text-primary text-xs">
                                  {ev.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Interpretation */}
                        {msg.interpretation && (
                          <p className="text-text-secondary text-xs leading-relaxed italic border-l-2 border-tertiary/60 pl-2.5 py-0.5">
                            {msg.interpretation}
                          </p>
                        )}

                        {/* Recommended Action Button */}
                        {msg.recommendedAction && (
                          <div className="pt-2">
                            <Button
                              asChild
                              variant="secondary"
                              size="sm"
                              className="w-full text-xs border-tertiary/40 text-tertiary hover:bg-tertiary/10 inline-flex items-center justify-between cursor-pointer"
                            >
                              <Link href={msg.recommendedAction.href}>
                                <span className="truncate">
                                  {msg.recommendedAction.title}
                                </span>
                                <ArrowRight className="size-3.5 shrink-0 ml-1" />
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                {/* Generating Indicator */}
                {isGenerating && (
                  <div className="p-3 rounded-xl border border-border bg-surface-subtle flex items-center gap-2 text-xs text-text-secondary">
                    <span className="size-2 rounded-full bg-tertiary animate-ping" />
                    <span>
                      {isThai
                        ? 'กำลังวิเคราะห์สัญญาณข้อมูลและจัดเตรียมคำแนะนำ...'
                        : 'Analyzing data signals & preparing grounded recommendation...'}
                    </span>
                  </div>
                )}
                <div ref={messageEndRef} />
              </div>

              {/* ── CHAT INPUT FOOTER ─────────────────────────────────────────── */}
              <div className="p-3 border-t border-border/80 bg-surface-subtle/80 shrink-0">
                <div className="relative flex items-center">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      isThai
                        ? `ถาม Capybot เกี่ยวกับ ${getCurrentContextTag()}...`
                        : `Ask Capybot about ${getCurrentContextTag()}...`
                    }
                    className="w-full bg-surface text-sm text-text-primary pr-10 pl-3.5 py-2.5 rounded-xl border border-border focus:outline-hidden focus:border-tertiary resize-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendMessage()}
                    disabled={!inputText.trim() || isGenerating}
                    className="absolute right-2 p-1.5 rounded-lg bg-tertiary text-on-primary disabled:opacity-40 hover:bg-tertiary-hover transition-colors cursor-pointer"
                    title="Send message"
                  >
                    <Send className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
