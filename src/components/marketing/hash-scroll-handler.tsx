'use client';

import { useEffect } from 'react';

/**
 * On mount, checks if the URL contains a hash fragment (e.g. /#why-us).
 * If so, scrolls to that element smoothly and then cleans the hash from the URL
 * using history.replaceState (no extra history entry, no page reload).
 */
export function HashScrollHandler() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.replace('#', '');
    if (!id) return;

    // Small delay to ensure DOM is fully rendered after navigation
    const timer = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Clean hash after scroll completes (~600ms for smooth scroll)
        setTimeout(() => {
          history.replaceState(null, '', window.location.pathname);
        }, 800);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
