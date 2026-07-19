import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/lib/i18n/routing';

export const config = {
  matcher: [
    // Match all pathnames except:
    // - /api (API routes)
    // - /_next (Next.js internals)
    // - /_vercel (Vercel internals)
    // - /favicon.ico, /robots.txt, /sitemap.xml
    // - static files with extensions (.svg, .png, .jpg, .css, .js, etc.)
    '/((?!api|_next|_vercel|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\..*).*)',
  ],
};

// next-intl middleware handles locale detection and routing
const intlMiddleware = createMiddleware(routing);

export interface ProxyRedirect {
  destination: string;
  permanent: boolean;
}

export function getOptimisticRedirect(
  pathname: string,
  hasSession: boolean,
  hasBusiness: boolean
): ProxyRedirect | null {
  // Check routes categorization
  const isAuthRoute =
    pathname.includes('/login') ||
    pathname.includes('/register') ||
    pathname.includes('/forgot-password');

  // Marketing / static landing routes
  const isMarketingRoute =
    pathname === '/' ||
    pathname.includes('/features') ||
    pathname.includes('/about');

  // Dynamic app-specific routes
  const isAppRoute = !isAuthRoute && !isMarketingRoute;

  // 1. Not authenticated trying to access app routes -> redirect to login
  if (!hasSession && isAppRoute) {
    return {
      destination: '/login',
      permanent: false,
    };
  }

  // 2. Authenticated but has no business profile -> redirect to onboarding
  if (hasSession && isAppRoute && !hasBusiness && !pathname.includes('/onboarding')) {
    return {
      destination: '/onboarding',
      permanent: false,
    };
  }

  // 3. Authenticated and onboarded trying to access auth/onboarding routes -> redirect to dashboard
  if (hasSession && (isAuthRoute || pathname.includes('/onboarding'))) {
    return {
      destination: '/dashboard',
      permanent: false,
    };
  }

  return null;
}

export default function proxy(request: NextRequest) {
  // Run next-intl middleware first to handle locale routing
  const intlResponse = intlMiddleware(request);

  const pathname = request.nextUrl.pathname;

  // Dev bypass: treat as authenticated+onboarded, skip all redirects
  const devBypass =
    process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true' &&
    process.env.NODE_ENV === 'development';

  if (devBypass) {
    return intlResponse;
  }

  // Read cookies for session indication
  const allCookies = request.cookies.getAll();
  const hasSession = allCookies.some((c) => c.name.includes('better-auth.session-token'));

  // Optimistically assume onboarded (security checks occur in guards)
  const hasBusiness = true;

  // Strip locale prefix for route matching
  const localePattern = /^\/(en|th)(\/|$)/;
  const pathnameWithoutLocale = pathname.replace(localePattern, '/');

  const redirectResult = getOptimisticRedirect(pathnameWithoutLocale, hasSession, hasBusiness);

  if (redirectResult) {
    const url = request.nextUrl.clone();
    url.pathname = redirectResult.destination;
    return NextResponse.redirect(url);
  }

  return intlResponse;
}
