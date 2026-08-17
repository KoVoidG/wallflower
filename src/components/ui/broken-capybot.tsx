// src/components/ui/broken-capybot.tsx
'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/components/motion';

export interface BrokenCapybotProps {
  size?: number | string;
  className?: string;
}

export function BrokenCapybot({ size = 180, className }: BrokenCapybotProps) {
  const prefersReduced = useReducedMotion();

  const wobbleVariants = {
    animate: {
      rotate: [-3, 3, -3],
      y: [0, -4, 0],
      transition: {
        duration: 3.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const sparkVariants = {
    animate: {
      opacity: [0.2, 1, 0.2],
      scale: [0.8, 1.2, 0.8],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      className={cn('relative flex items-center justify-center select-none shrink-0', className)}
      style={typeof size === 'number' ? { width: size, height: size } : undefined}
      variants={!prefersReduced ? wobbleVariants : undefined}
      animate="animate"
    >
      <svg
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          {/* Capybara Body Warm Coat Gradient */}
          <linearGradient id="capyBrokenCoat" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ECC2A0" />
            <stop offset="60%" stopColor="#DFAD86" />
            <stop offset="100%" stopColor="#CA946B" />
          </linearGradient>

          {/* Dark Brown Snout Muzzle Gradient */}
          <linearGradient id="capyBrokenSnout" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9C6B46" />
            <stop offset="100%" stopColor="#784B2B" />
          </linearGradient>

          {/* Yuzu Citrus Gradient */}
          <linearGradient id="capyBrokenYuzu" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>

          {/* Floor Shadow Gradient */}
          <radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Floor Shadow & Debris ── */}
        <ellipse cx="70" cy="128" rx="46" ry="7" fill="url(#floorShadow)" />

        {/* Scattered Loose Screw 1 */}
        <circle cx="28" cy="124" r="2.5" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
        <line x1="26.5" y1="124" x2="29.5" y2="124" stroke="#334155" strokeWidth="0.8" />

        {/* Scattered Mini Gear */}
        <g transform="translate(108, 120)">
          <circle cx="5" cy="5" r="4.5" fill="#CBD5E1" stroke="#64748B" strokeWidth="1" />
          <circle cx="5" cy="5" r="1.5" fill="#94A3B8" />
          <rect x="4" y="-1" width="2" height="2" fill="#64748B" />
          <rect x="4" y="9" width="2" height="2" fill="#64748B" />
          <rect x="-1" y="4" width="2" height="2" fill="#64748B" />
          <rect x="9" y="4" width="2" height="2" fill="#64748B" />
        </g>

        {/* Small Repair Wrench on the ground */}
        <g transform="translate(24, 114) rotate(-25)">
          <rect x="0" y="4" width="14" height="3" rx="1.5" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
          <circle cx="0" cy="5.5" r="3.5" fill="#CBD5E1" stroke="#64748B" strokeWidth="1" />
          <path d="M-1 3.5 L-3 5.5 L-1 7.5" stroke="#475569" strokeWidth="1" fill="none" />
        </g>

        {/* ── Capybot Body Pod (Digit 0 Shaped) ── */}
        {/* Left Ear */}
        <ellipse
          cx="42"
          cy="38"
          rx="9"
          ry="8"
          fill="#784B2B"
          stroke="#2B1810"
          strokeWidth="2.5"
        />
        <ellipse cx="42" cy="38" rx="4.5" ry="3.5" fill="#543118" />

        {/* Right Ear (Slightly tilted down) */}
        <g transform="rotate(10 98 38)">
          <ellipse
            cx="98"
            cy="38"
            rx="9"
            ry="8"
            fill="#784B2B"
            stroke="#2B1810"
            strokeWidth="2.5"
          />
          <ellipse cx="98" cy="38" rx="4.5" ry="3.5" fill="#543118" />
        </g>

        {/* Main Chubby Round Head / Body (Oval Zero Shape) */}
        <path
          d="M 43 42 C 53 35, 87 35, 97 42 C 109 52, 111 84, 100 100 C 89 111, 51 111, 40 100 C 29 84, 31 52, 43 42 Z"
          fill="url(#capyBrokenCoat)"
          stroke="#2B1810"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Cute Plaster / Band-Aid on Forehead */}
        <g transform="translate(74, 46) rotate(22)">
          <rect x="0" y="0" width="13" height="6" rx="2" fill="#FCD34D" stroke="#D97706" strokeWidth="1" />
          <circle cx="4.5" cy="3" r="0.6" fill="#B45309" />
          <circle cx="6.5" cy="3" r="0.6" fill="#B45309" />
          <circle cx="8.5" cy="3" r="0.6" fill="#B45309" />
        </g>

        {/* ── Tilted Floating Yuzu Antenna with Broken Spark ── */}
        <g transform="translate(6, 4)">
          {/* Bent Wire Antenna */}
          <path
            d="M 64 36 Q 60 26 55 23"
            stroke="#8B5CF6"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Tilted Yuzu Fruit */}
          <circle
            cx="52"
            cy="19"
            r="6.5"
            fill="url(#capyBrokenYuzu)"
            stroke="#6366F1"
            strokeWidth="1.4"
          />
          {/* Leaf */}
          <path d="M52 13 Q57 11 59 14.5 Q54 15.5 52 13 Z" fill="#22C55E" />
          <circle cx="50.5" cy="17.5" r="1.2" fill="#FFFFFF" opacity="0.8" />

          {/* Electric Spark from broken antenna */}
          <motion.g
            variants={!prefersReduced ? sparkVariants : undefined}
            animate="animate"
            transform="translate(41, 10)"
          >
            <path
              d="M4 0 L2 4 L5 4 L1 9 L3 5 L0 5 Z"
              fill="#F59E0B"
              stroke="#EA580C"
              strokeWidth="0.6"
            />
          </motion.g>
        </g>

        {/* ── Iconic Snout Patch ── */}
        <ellipse
          cx="70"
          cy="76"
          rx="15"
          ry="19"
          fill="url(#capyBrokenSnout)"
          stroke="#2B1810"
          strokeWidth="2.4"
        />

        {/* Nostrils */}
        <line x1="64.5" y1="67" x2="67" y2="70.5" stroke="#23120B" strokeWidth="2.8" strokeLinecap="round" />
        <line x1="75.5" y1="67" x2="73" y2="70.5" stroke="#23120B" strokeWidth="2.8" strokeLinecap="round" />
        <line x1="70" y1="70" x2="70" y2="81.5" stroke="#23120B" strokeWidth="3" strokeLinecap="round" />

        {/* Wavy Dazed Mouth ~ */}
        <path
          d="M 62 82 Q 66 85 70 82 Q 74 79 78 82"
          stroke="#23120B"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* ── Dizzy Eyes (Left: Crossed X, Right: Dazed Spiral/Eye) ── */}
        {/* Left Crossed 'X' Eye */}
        <g>
          <line x1="47" y1="58" x2="57" y2="68" stroke="#2B1810" strokeWidth="3.8" strokeLinecap="round" />
          <line x1="57" y1="58" x2="47" y2="68" stroke="#2B1810" strokeWidth="3.8" strokeLinecap="round" />
        </g>

        {/* Right Spiral / Dizzy Eye (o) */}
        <g transform="translate(80, 58)">
          <circle cx="5" cy="5" r="4.5" stroke="#2B1810" strokeWidth="3" fill="#FFFFFF" />
          <circle cx="5" cy="5" r="1.8" fill="#2B1810" />
        </g>

        {/* Dizzy Swirl Symbol near Head */}
        <motion.path
          d="M 104 46 Q 109 42 112 47 Q 110 52 105 50"
          stroke="#8B5CF6"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          variants={!prefersReduced ? sparkVariants : undefined}
          animate="animate"
        />

        {/* Rosy Dazed Blushes */}
        <ellipse cx="46" cy="74" rx="5.5" ry="3.8" fill="#F4976C" opacity="0.85" />
        <ellipse cx="94" cy="74" rx="5.5" ry="3.8" fill="#F4976C" opacity="0.85" />
      </svg>
    </motion.div>
  );
}
