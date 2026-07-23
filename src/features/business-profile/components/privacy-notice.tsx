'use client';

import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrivacyNoticeProps {
  className?: string;
}

export function PrivacyNotice({ className }: PrivacyNoticeProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 text-xs text-text-muted',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Info className="size-3.5 text-brand shrink-0" />
        <span>
          Frontend Prototype: Data is saved locally in your browser. Do not enter sensitive passwords or personal identity numbers.
        </span>
      </div>
    </div>
  );
}
