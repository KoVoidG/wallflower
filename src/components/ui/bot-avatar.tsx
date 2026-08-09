// src/components/ui/bot-avatar.tsx
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
  size = 38,
  className,
  animate = true,
}: BotAvatarProps) {
  const prefersReduced = useReducedMotion();

  const floatVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -2.5, 0],
      transition: {
        duration: 2.8,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const auraPulseVariants = {
    initial: { opacity: 0.6, scale: 0.96 },
    animate: {
      opacity: [0.6, 0.85, 0.6],
      scale: [0.96, 1.03, 0.96],
      transition: {
        duration: 2.8,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      className={cn(
        'relative flex items-center justify-center select-none shrink-0',
        className,
      )}
      style={{ width: size, height: size }}
      variants={animate && !prefersReduced ? floatVariants : undefined}
      initial="initial"
      animate="animate"
    >
      {/* Radiant Vibrant Aura Halo - Signature Purple & Warm Amber */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#6366F1] via-[#A855F7] to-[#F59E0B] blur-[4px]"
        variants={animate && !prefersReduced ? auraPulseVariants : undefined}
        initial="initial"
        animate="animate"
      />

      {/* Snug Circular Pod Container */}
      <div className="relative size-full rounded-full bg-gradient-to-b from-white via-[#F8FAFC] to-[#EEF2FB] dark:from-[#1E1B4B] dark:via-[#13182A] dark:to-[#0B0E14] border-[1.5px] border-white/90 dark:border-indigo-500/40 shadow-md shadow-indigo-500/20 flex items-center justify-center p-0.5 overflow-hidden">
        {/* Iconic Smiling Capybara AI Mascot */}
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-full filter drop-shadow-xs"
        >
          <defs>
            {/* Capybara Body Warm Coat Gradient */}
            <linearGradient
              id="capyCoatGrad"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ECC2A0" />
              <stop offset="60%" stopColor="#DFAD86" />
              <stop offset="100%" stopColor="#CA946B" />
            </linearGradient>

            {/* Dark Brown Snout Muzzle Gradient */}
            <linearGradient
              id="capySnoutPatchGrad"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#9C6B46" />
              <stop offset="100%" stopColor="#784B2B" />
            </linearGradient>

            {/* Holographic Glowing Yuzu / Energy Node */}
            <linearGradient
              id="cyberYuzuGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="60%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
          </defs>

          {/* ── Capybara Ears ── */}
          {/* Left Ear */}
          <ellipse
            cx="22"
            cy="21"
            rx="8.5"
            ry="7.5"
            fill="#784B2B"
            stroke="#2B1810"
            strokeWidth="2.5"
          />
          <ellipse
            cx="22"
            cy="21"
            rx="4.5"
            ry="3.5"
            fill="#543118"
          />

          {/* Right Ear */}
          <ellipse
            cx="78"
            cy="21"
            rx="8.5"
            ry="7.5"
            fill="#784B2B"
            stroke="#2B1810"
            strokeWidth="2.5"
          />
          <ellipse
            cx="78"
            cy="21"
            rx="4.5"
            ry="3.5"
            fill="#543118"
          />

          {/* ── Floating Yuzu / Citrus on Head ── */}
          <line
            x1="50"
            y1="14"
            x2="50"
            y2="19"
            stroke="#8B5CF6"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="9"
            r="6"
            fill="url(#cyberYuzuGrad)"
            stroke="#6366F1"
            strokeWidth="1.2"
          />
          {/* Fresh Green Leaf */}
          <path
            d="M50 3.5 Q55 1.5 57 5 Q52 6 50 3.5 Z"
            fill="#22C55E"
          />
          <circle cx="48.5" cy="7.5" r="1.2" fill="#FFFFFF" opacity="0.8" />

          {/* ── Chubby Round Capybara Head ── */}
          <path
            d="M 23 26 C 33 19, 67 19, 77 26 C 89 36, 91 68, 80 84 C 69 95, 31 95, 20 84 C 9 68, 11 36, 23 26 Z"
            fill="url(#capyCoatGrad)"
            stroke="#2B1810"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />

          {/* ── The Iconic Dark Brown Snout / Muzzle Oval ── */}
          <ellipse
            cx="50"
            cy="58"
            rx="14"
            ry="18"
            fill="url(#capySnoutPatchGrad)"
            stroke="#2B1810"
            strokeWidth="2.2"
          />

          {/* ── Nostrils & Happy Cheerful Smile ── */}
          {/* Left Angled Nostril Slit */}
          <line
            x1="44.5"
            y1="49"
            x2="47"
            y2="52.5"
            stroke="#23120B"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          {/* Right Angled Nostril Slit */}
          <line
            x1="55.5"
            y1="49"
            x2="53"
            y2="52.5"
            stroke="#23120B"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          {/* Vertical Center Stem */}
          <line
            x1="50"
            y1="52"
            x2="50"
            y2="63.5"
            stroke="#23120B"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Sweet Cheerful Smile Curve */}
          <path
            d="M 43 64 Q 50 71 57 64"
            stroke="#23120B"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* ── Happy Smiling Eyes (^  ^) ── */}
          {/* Left Smiling Eye */}
          <path
            d="M 28 45.5 Q 34 40 40 45.5"
            stroke="#2B1810"
            strokeWidth="3.8"
            strokeLinecap="round"
          />

          {/* Right Smiling Eye */}
          <path
            d="M 60 45.5 Q 66 40 72 45.5"
            stroke="#2B1810"
            strokeWidth="3.8"
            strokeLinecap="round"
          />

          {/* ── Warm Peachy Rosy Blushes ── */}
          <ellipse cx="27" cy="54" rx="5.5" ry="3.8" fill="#F4976C" opacity="0.85" />
          <ellipse cx="73" cy="54" rx="5.5" ry="3.8" fill="#F4976C" opacity="0.85" />
        </svg>
      </div>
    </motion.div>
  );
}
