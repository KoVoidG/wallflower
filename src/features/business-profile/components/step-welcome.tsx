'use client';

import { ArrowRight, BarChart3, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StepWelcomeProps {
  onNext: () => void;
}

export function StepWelcome({ onNext }: StepWelcomeProps) {
  return (
    <div className="max-w-md mx-auto py-6 px-4 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Brand Logo Header */}
      <div className="flex items-center justify-center gap-2">
        <div className="size-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
          W
        </div>
        <span className="font-display text-xl font-bold tracking-tight text-text-primary">
          Wallflower
        </span>
      </div>

      {/* Hero Illustration */}
      <div className="relative mx-auto w-48 h-40 flex items-center justify-center bg-gradient-to-b from-emerald-500/10 to-transparent rounded-3xl p-4">
        <svg
          className="w-full h-full text-emerald-600"
          viewBox="0 0 200 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Store roof awning */}
          <path d="M30 65 L170 65 L160 40 L40 40 Z" fill="#059669" />
          <path
            d="M35 65 C40 75 50 75 55 65 C60 75 70 75 75 65 C80 75 90 75 95 65 C100 75 110 75 115 65 C120 75 130 75 135 65 C140 75 150 75 155 65 C160 75 165 75 165 65"
            stroke="#047857"
            strokeWidth="4"
            fill="#10B981"
          />
          {/* Store front base */}
          <rect
            x="42"
            y="65"
            width="116"
            height="65"
            fill="#ECFDF5"
            stroke="#059669"
            strokeWidth="3"
            rx="4"
          />
          {/* Window & door */}
          <rect
            x="52"
            y="78"
            width="40"
            height="35"
            rx="3"
            fill="#A7F3D0"
            stroke="#059669"
            strokeWidth="2"
          />
          <rect x="108" y="78" width="35" height="52" rx="3" fill="#047857" />
          {/* Person silhouette */}
          <circle cx="158" cy="95" r="10" fill="#10B981" />
          <path
            d="M148 125 C148 110 168 110 168 125"
            stroke="#10B981"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Trees */}
          <circle cx="25" cy="115" r="14" fill="#10B981" />
          <rect x="23" y="125" width="4" height="15" fill="#047857" />
        </svg>
      </div>

      {/* Main Title & Subtitle */}
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-bold text-text-primary tracking-tight">
          Welcome to Wallflower! 👋
        </h1>
        <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed font-medium">
          Your AI-powered business co-pilot for smarter financial decisions.
        </p>
      </div>

      {/* 3 Key Benefits */}
      <div className="space-y-2.5 text-left bg-surface/60 border border-border/70 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 shrink-0">
            <BarChart3 className="size-4" />
          </div>
          <span className="text-xs font-semibold text-text-primary">
            Simulate business decisions before you make them
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 shrink-0">
            <TrendingUp className="size-4" />
          </div>
          <span className="text-xs font-semibold text-text-primary">
            Understand financial impact with clarity
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 shrink-0">
            <Sparkles className="size-4" />
          </div>
          <span className="text-xs font-semibold text-text-primary">
            Get AI-powered insights and recommendations
          </span>
        </div>
      </div>

      {/* Prompt text */}
      <p className="text-[11px] text-text-muted font-medium">
        Let&apos;s build your business profile so we can generate accurate insights.
      </p>

      {/* CTA Button */}
      <div className="space-y-2">
        <Button
          type="button"
          onClick={onNext}
          className="w-full py-3 text-xs font-bold gap-2 bg-emerald-600 text-white hover:bg-emerald-700 shadow-md transition-all cursor-pointer rounded-xl"
        >
          <span>Get Started</span>
          <ArrowRight className="size-4" />
        </Button>
        <span className="block text-[10px] font-semibold text-text-muted">
          Takes about 3–8 minutes
        </span>
      </div>

      {/* Carousel dots pagination */}
      <div className="flex items-center justify-center gap-1.5 pt-2">
        <span className="size-2 rounded-full bg-emerald-600" />
        <span className="size-1.5 rounded-full bg-border" />
        <span className="size-1.5 rounded-full bg-border" />
        <span className="size-1.5 rounded-full bg-border" />
        <span className="size-1.5 rounded-full bg-border" />
      </div>
    </div>
  );
}
