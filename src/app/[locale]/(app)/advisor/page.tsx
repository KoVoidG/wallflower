'use client';

import { useEffect } from 'react';
import { useRouter } from '@/lib/i18n/navigation';

export default function AdvisorPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return null;
}
