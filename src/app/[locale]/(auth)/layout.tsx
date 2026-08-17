'use client';

import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#0B0F19] text-text-primary px-4 py-8 relative selection:bg-brand/20">
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-blue-500/10 blur-3xl pointer-events-none -z-10 rounded-full" />

      {/* Main Card Container */}
      <div className="w-full max-w-[460px] z-10">{children}</div>
    </div>
  );
}
