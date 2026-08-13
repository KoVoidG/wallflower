"use client";

import { useCountUp } from "@/lib/liquiflow-hooks";

export function HealthScoreRing({ score, isScanning }: { score: number; isScanning: boolean }) {
  const animatedScore = useCountUp(isScanning ? 0 : score, 1500, isScanning ? 0 : 500);

  const getColor = (s: number) => {
    if (s >= 80) return "#34d399";
    if (s >= 50) return "#fbbf24";
    return "#f87171";
  };
  const color = getColor(animatedScore);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-32 h-32 mx-auto">
      {/* Background circle */}
      <svg className="absolute w-full h-full -rotate-90">
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-border/60"
        />
        {/* Animated progress circle */}
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300 ease-out"
        />
      </svg>
      {/* Score text */}
      <div className="flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-text-primary transition-colors" style={{ color }}>
          {animatedScore}
        </span>
        <span className="text-[9px] uppercase tracking-wider text-text-muted font-medium">
          Health
        </span>
      </div>
      
      {/* Scanning ping effect */}
      {isScanning && (
        <div className="absolute inset-0 rounded-full border-2 border-brand/50 animate-ping" />
      )}
    </div>
  );
}
