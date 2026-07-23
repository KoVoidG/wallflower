'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Settings, LifeBuoy, LogOut, MoreVertical, Sparkles, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useRouter } from '@/lib/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { replayProductTour } from '@/components/app-shell/product-tour';

interface AccountMenuProps {
  collapsed?: boolean;
  align?: 'left' | 'right' | 'top';
  className?: string;
}

export function AccountMenu({ collapsed = false, align = 'top', className }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tNav = useTranslations('nav');
  const router = useRouter();

  // Handle keyboard focus restoration & click outside
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const handleNavClick = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleReplayTourClick = () => {
    setOpen(false);
    replayProductTour();
  };

  const handleSignOut = () => {
    setOpen(false);
    router.push('/login');
  };

  return (
    <div ref={menuRef} className={cn('relative inline-block text-left w-full', className)}>
      {/* Trigger Button */}
      {collapsed ? (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            'flex size-10 w-full items-center justify-center rounded-lg border border-border bg-surface-subtle text-text-primary',
            'hover:bg-brand-soft hover:text-brand transition-colors',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand cursor-pointer'
          )}
          title="Somchai Wattana • Basic plan"
          aria-expanded={open}
          aria-haspopup="true"
          aria-label="User account menu"
        >
          <div className="flex size-7 items-center justify-center rounded-full bg-brand text-white text-xs font-bold">
            SW
          </div>
        </button>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            'group flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2 text-left',
            'hover:border-border-strong hover:bg-surface-subtle transition-colors',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand cursor-pointer'
          )}
          aria-expanded={open}
          aria-haspopup="true"
          aria-label="User account menu"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-white font-bold text-xs">
              SW
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-text-primary truncate">
                Somchai Wattana
              </span>
              <span className="text-[10px] text-text-muted truncate">
                Basic plan
              </span>
            </div>
          </div>
          <MoreVertical className="size-4 shrink-0 text-text-muted group-hover:text-text-primary" />
        </button>
      )}

      {/* Upward / Popover Menu */}
      {open && (
        <div
          className={cn(
            'absolute z-50 rounded-lg border border-border bg-surface p-1.5 shadow-xl dark:shadow-black/60',
            'animate-in fade-in-50 zoom-in-95 duration-100',
            align === 'top' && 'bottom-full mb-2 left-0 right-0 w-full min-w-[200px]',
            align === 'right' && 'top-full mt-2 right-0 w-56',
            align === 'left' && 'top-full mt-2 left-0 w-56'
          )}
          role="menu"
          aria-orientation="vertical"
        >
          {/* User Info Header in Menu */}
          <div className="px-3 py-2 border-b border-border/60 mb-1 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-text-primary truncate">
                Somchai Wattana
              </p>
              <Badge variant="info" className="text-[9px] px-1.5 py-0">
                Basic plan
              </Badge>
            </div>
            <p className="text-[11px] text-text-muted truncate">
              somchai@example.com
            </p>
          </div>

          <div className="space-y-0.5" role="none">
            {/* Plan & Usage */}
            <Link
              href="/settings?section=plan"
              onClick={handleNavClick}
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium text-text-primary hover:bg-surface-subtle transition-colors"
              role="menuitem"
            >
              <Sparkles className="size-4 text-brand shrink-0" />
              <span>{tNav('planUsage')}</span>
            </Link>

            {/* Settings (Account section) */}
            <Link
              href="/settings?section=profile"
              onClick={handleNavClick}
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium text-text-primary hover:bg-surface-subtle transition-colors"
              role="menuitem"
            >
              <Settings className="size-4 text-text-muted shrink-0" />
              <span>{tNav('settings')}</span>
            </Link>

            {/* Help & Support */}
            <Link
              href="/help-support"
              onClick={handleNavClick}
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium text-text-primary hover:bg-surface-subtle transition-colors"
              role="menuitem"
            >
              <LifeBuoy className="size-4 text-text-muted shrink-0" />
              <span>{tNav('helpSupport')}</span>
            </Link>

            
          </div>

          <div className="border-t border-border/60 mt-1 pt-1" role="none">
            {/* Sign out */}
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium text-danger hover:bg-danger-soft/40 transition-colors cursor-pointer text-left"
              role="menuitem"
            >
              <LogOut className="size-4 text-danger shrink-0" />
              <span>{tNav('signOut')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
