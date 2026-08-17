'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/logo';
import { BrokenCapybot } from '@/components/ui/broken-capybot';

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();

  const isThai = pathname?.startsWith('/th');
  const homeUrl = isThai ? '/th' : '/en';

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-text-primary flex flex-col justify-between relative overflow-hidden select-none px-4 py-6 sm:px-8">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 blur-[100px] pointer-events-none -z-10 rounded-full" />

      {/* Top Header with Logo */}
      <header className="w-full max-w-[1200px] mx-auto flex items-center justify-between">
        <Link href={homeUrl} className="inline-flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Logo size="md" />
        </Link>

        <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Wallflower 404
        </span>
      </header>

      {/* Center 404 Hero Display */}
      <main className="my-auto max-w-2xl mx-auto w-full text-center space-y-6 sm:space-y-8 py-8">
        {/* Giant 4 [Capybot] 4 Display */}
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <span className="font-display font-black text-8xl sm:text-[140px] lg:text-[180px] leading-none text-slate-300 dark:text-[#1E2638] tracking-tighter drop-shadow-sm">
            4
          </span>

          {/* Broken Capybot Acting As The '0' */}
          <div className="flex items-center justify-center -my-4">
            <BrokenCapybot size={150} className="sm:scale-125 lg:scale-135" />
          </div>

          <span className="font-display font-black text-8xl sm:text-[140px] lg:text-[180px] leading-none text-slate-300 dark:text-[#1E2638] tracking-tighter drop-shadow-sm">
            4
          </span>
        </div>

        {/* Text Details matching user reference */}
        <div className="space-y-2.5 max-w-md mx-auto">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            uh-oh! Nothing here...
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Our Capybot ran the numbers across all operational scenarios, but this page seems to have broken down or doesn&apos;t exist.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-center pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#8B5CF6] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/25 hover:opacity-95 active:scale-[0.99] transition-all text-center cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <span>Go Back</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-[1200px] mx-auto text-center text-xs text-slate-400 dark:text-slate-600 py-2">
        <span>Wallflower Decision Intelligence</span>
      </footer>
    </div>
  );
}
