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
  xs: 28,
  sm: 36,
  md: 44,
  lg: 56,
  xl: 68,
} as const;

export function Logo({
  size = 'md',
  showWordmark = true,
  wordmarkClassName,
  className,
  iconOnly = false,
  priority = true,
  ...props
}: LogoProps) {
  const pixelSize = typeof size === 'number' ? size : sizeMap[size] || 44;

  return (
    <div
      className={cn('inline-flex items-center gap-3 select-none shrink-0', className)}
      {...props}
    >
      {/* Direct PNG Logo without circular containers or borders */}
      <Image
        src="/wallflower-logo 1.png"
        alt="Wallflower Logo"
        width={pixelSize}
        height={pixelSize}
        className="shrink-0 object-contain"
        style={{ width: pixelSize, height: pixelSize }}
        priority={priority}
      />

      {/* Brand Wordmark Typography */}
      {showWordmark && !iconOnly && (
        <span
          className={cn(
            'font-display font-bold tracking-tight text-[#0F172A] dark:text-white leading-none text-xl sm:text-2xl',
            wordmarkClassName
          )}
        >
          Wallflower
        </span>
      )}
    </div>
  );
}
