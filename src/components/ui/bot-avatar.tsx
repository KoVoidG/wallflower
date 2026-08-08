'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/components/motion';

export interface BotAvatarProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export function BotAvatar({
  size = 40,
  className,
  animate = true,
}: BotAvatarProps) {
  const prefersReduced = useReducedMotion();

  const containerVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -3, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const paddingClass = size <= 28 ? 'p-0.5' : size <= 40 ? 'p-1' : 'p-2';

  return (
    <motion.div
      className={cn(
        'relative flex items-center justify-center select-none shrink-0',
        className,
      )}
      style={{ width: size, height: size }}
      variants={animate && !prefersReduced ? containerVariants : undefined}
      initial="initial"
      animate="animate"
    >
      {/* Outer Glow */}
      <div className="absolute inset-0 rounded-full bg-tertiary/25 blur-sm" />

      {/* Concentric Circle Container */}
      <div
        className={cn(
          'relative size-full rounded-full bg-surface-hover border border-tertiary/60 flex items-center justify-center shadow-md overflow-hidden',
          paddingClass,
        )}
      >
        {/* SVG Robot Illustration */}
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-full"
        >
          {/* Side Ears / Antenna Pegs */}
          <rect x="6" y="40" width="10" height="18" rx="4" fill="#8B5CF6" />
          <rect x="84" y="40" width="10" height="18" rx="4" fill="#8B5CF6" />

          {/* Top Antenna Bulb */}
          <circle cx="50" cy="10" r="5" fill="#A78BFA" />
          <line
            x1="50"
            y1="15"
            x2="50"
            y2="22"
            stroke="#A78BFA"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Robot Head Body */}
          <rect
            x="12"
            y="20"
            width="76"
            height="64"
            rx="20"
            fill="#131823"
            stroke="#6366F1"
            strokeWidth="3.5"
          />

          {/* Visor Screen */}
          <rect
            x="20"
            y="30"
            width="60"
            height="38"
            rx="12"
            fill="#0B0E14"
            stroke="#263042"
            strokeWidth="3"
          />

          {/* Glowing Big Eyes */}
          <circle cx="37" cy="48" r="7" fill="#A78BFA" />
          <circle cx="36" cy="46.5" r="2.5" fill="#FFFFFF" />

          <circle cx="63" cy="48" r="7" fill="#A78BFA" />
          <circle cx="62" cy="46.5" r="2.5" fill="#FFFFFF" />

          {/* Friendly Smile Curve */}
          <path
            d="M43 59 Q50 64 57 59"
            stroke="#8B5CF6"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </motion.div>
  );
}
