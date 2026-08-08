// src/components/ui/logo.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  showWordmark?: boolean;
  wordmarkClassName?: string;
  className?: string;
  iconOnly?: boolean;
  priority?: boolean;
}

const sizeMap = {
  xs: 20,
  sm: 26,
  md: 32,
  lg: 40,
  xl: 48,
} as const;

export function Logo({
  size = 'md',
  showWordmark = true,
  wordmarkClassName,
  className,
  iconOnly = false,
  priority = false,
  ...props
}: LogoProps) {
  const pixelSize = typeof size === 'number' ? size : sizeMap[size] || 32;

  return (
    <div
      className={cn('inline-flex items-center gap-2.5 select-none shrink-0', className)}
      {...props}
    >
      {/* Dynamic Fluid Floral Mark with Official Gradient */}
      <div
        className="relative flex items-center justify-center shrink-0 rounded-xl overflow-hidden shadow-2xs"
        style={{ width: pixelSize, height: pixelSize }}
      >
        <Image
          src="/logo.png"
          alt="Wallflower Logo"
          width={pixelSize}
          height={pixelSize}
          className="size-full object-contain filter drop-shadow-[0_2px_8px_rgba(76,35,252,0.25)]"
          priority={priority}
        />
      </div>

      {/* Brand Wordmark Typography */}
      {showWordmark && !iconOnly && (
        <span
          className={cn(
            'font-display font-extrabold tracking-tight text-text-primary leading-none',
            pixelSize <= 24 && 'text-sm',
            pixelSize > 24 && pixelSize <= 32 && 'text-lg sm:text-xl',
            pixelSize > 32 && pixelSize <= 40 && 'text-xl sm:text-2xl',
            pixelSize > 40 && 'text-2xl sm:text-3xl',
            wordmarkClassName
          )}
        >
          Wallflower
        </span>
      )}
    </div>
  );
}
