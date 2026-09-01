'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function VisitorTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Avoid double tracking the same path in rapid succession
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    // Don't track admin panel visits as public leads
    if (pathname.startsWith('/admin')) return;

    const trackVisit = async () => {
      try {
        const userAgent = navigator.userAgent;
        let device = 'desktop';
        if (/Mobile|Android|iP(hone|od)/i.test(userAgent)) {
          device = 'mobile';
        } else if (/iPad|Tablet/i.test(userAgent)) {
          device = 'tablet';
        }

        let browser = 'Chrome';
        if (/Firefox/i.test(userAgent)) browser = 'Firefox';
        else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) browser = 'Safari';
        else if (/Edg/i.test(userAgent)) browser = 'Edge';

        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pageVisited: pathname,
            device,
            browser,
          }),
        });
      } catch {
        // Silently ignore tracking errors to avoid affecting UX
      }
    };

    // Delay tracking slightly to prioritize critical page rendering
    const timer = setTimeout(trackVisit, 600);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
