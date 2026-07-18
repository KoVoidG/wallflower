import { NextRequest, NextResponse } from 'next/server';

// Optimistic route redirects for Wallflower (Next.js 16)
// Note: This is NOT the security boundary. Actual validation occurs in server guards.

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
  const pathname = request.nextUrl.pathname;
  
  // Read cookies for session indication
  const allCookies = request.cookies.getAll();
  const hasSession = allCookies.some((c) => c.name.includes('better-auth.session-token'));
  
  // Optimistically assume onboarded (security checks occur in guards)
  const hasBusiness = true;

  const redirectResult = getOptimisticRedirect(pathname, hasSession, hasBusiness);

  if (redirectResult) {
    const url = request.nextUrl.clone();
    url.pathname = redirectResult.destination;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
