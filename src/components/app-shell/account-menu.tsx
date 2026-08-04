'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Settings,
  LifeBuoy,
  LogOut,
  MoreVertical,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useRouter } from '@/lib/i18n/navigation';
import { Badge } from '@/components/ui/badge';

interface AccountMenuProps {
  collapsed?: boolean;
  align?: 'left' | 'right' | 'top';
  className?: string;
}

export function AccountMenu({
  collapsed = false,
  align = 'top',
  className,
}: AccountMenuProps) {
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

  const handleSignOut = () => {
    setOpen(false);
    router.push('/login');
  };

  return (
    <div
      ref={menuRef}
      className={cn('relative inline-block text-left w-full', className)}
    >
      {/* Trigger Button */}
      {collapsed ? (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            'flex size-10 w-full items-center justify-center rounded-xl border border-border bg-surface text-text-primary',
            'hover:border-tertiary/50 hover:bg-tertiary/10 transition-all shadow-2xs',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary cursor-pointer',
          )}
          title="Somchai Wattana • Free Plan"
          aria-expanded={open}
          aria-haspopup="true"
          aria-label="User account menu"
        >
          <div className="flex size-7 items-center justify-center rounded-full bg-tertiary text-on-primary text-xs font-bold">
            SW
          </div>
        </button>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            'group flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-surface px-3 py-2.5 text-left',
            'hover:border-tertiary/50 hover:bg-surface-hover transition-all shadow-2xs',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary cursor-pointer',
          )}
          aria-expanded={open}
          aria-haspopup="true"
          aria-label="User account menu"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-tertiary text-on-primary font-bold text-xs shadow-2xs">
              SW
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-text-primary truncate group-hover:text-tertiary transition-colors">
                Somchai Wattana
              </span>
              <span className="text-[10px] font-medium text-text-muted truncate">
                Free
              </span>
            </div>
          </div>
          <MoreVertical className="size-4 shrink-0 text-text-muted group-hover:text-tertiary transition-colors" />
        </button>
      )}

      {/* Upward Floating Popover Menu (Extends near parent position with generous space) */}
      {open && (
        <div
          className={cn(
            'absolute z-50 rounded-2xl border-2 border-border-strong bg-surface p-2.5 shadow-2xl dark:shadow-black/70',
            'animate-in fade-in-50 zoom-in-95 duration-100',
            align === 'top' &&
              'bottom-full mb-3 left-0 w-64 max-w-[calc(100vw-32px)]',
            align === 'right' && 'top-full mt-2 right-0 w-64',
            align === 'left' && 'top-full mt-2 left-0 w-64',
          )}
          role="menu"
          aria-orientation="vertical"
        >
          {/* User Info Header in Menu */}
          <div className="px-3 py-2.5 rounded-xl bg-surface-subtle border border-border/60 mb-2 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold text-text-primary truncate">
                Somchai Wattana
              </p>
              <Badge variant="info" className="text-[9px] px-2 py-0.5 font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                Free
              </Badge>
            </div>
            <p className="text-[11px] text-text-muted font-medium truncate">
              somchai@example.com
            </p>
          </div>

          <div className="space-y-1" role="none">
            {/* Plan & Usage */}
            <Link
              href="/settings?section=plan"
              onClick={handleNavClick}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-text-primary hover:bg-tertiary/10 hover:text-tertiary transition-colors"
              role="menuitem"
            >
              <Sparkles className="size-4 text-tertiary shrink-0" />
              <span>{tNav('planUsage')}</span>
            </Link>

            {/* Settings (Account section) */}
            <Link
              href="/settings?section=profile"
              onClick={handleNavClick}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-text-primary hover:bg-tertiary/10 hover:text-tertiary transition-colors"
              role="menuitem"
            >
              <Settings className="size-4 text-text-muted shrink-0" />
              <span>{tNav('settings')}</span>
            </Link>

            {/* Help & Support */}
            <Link
              href="/help-support"
              onClick={handleNavClick}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-text-primary hover:bg-tertiary/10 hover:text-tertiary transition-colors"
              role="menuitem"
            >
              <LifeBuoy className="size-4 text-text-muted shrink-0" />
              <span>{tNav('helpSupport')}</span>
            </Link>
          </div>

          <div className="border-t border-border/60 mt-1.5 pt-1.5" role="none">
            {/* Sign out */}
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-danger hover:bg-danger-soft/40 transition-colors cursor-pointer text-left"
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
