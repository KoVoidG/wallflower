import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Caption } from '@/components/ui/typography';

interface PrivacyNoticeProps {
  className?: string;
}

/**
 * Persistent privacy notice footer for the onboarding form.
 * Always visible, not dismissible. Communicates data security to build trust.
 */
export function PrivacyNotice({ className }: PrivacyNoticeProps) {
  return (
    <footer
      className={cn(
        'flex items-start gap-2.5 px-4 py-3 rounded-[var(--radius-md)]',
        'bg-surface-subtle border border-border/50',
        className
      )}
      aria-label="Privacy notice"
    >
      <Shield className="size-4 text-text-muted shrink-0 mt-0.5" aria-hidden="true" />
      <Caption className="text-text-muted">
        Your data is stored securely and never shared without your consent.
        We use industry-standard encryption to protect your information.{' '}
        <a
          href="#privacy"
          className={cn(
            'underline underline-offset-2',
            'hover:text-text-secondary transition-colors'
          )}
        >
          Read our Privacy Policy
        </a>
      </Caption>
    </footer>
  );
}
