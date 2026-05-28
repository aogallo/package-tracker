import createIntlMiddleware from 'next-intl/middleware';
import { auth } from '@/lib/auth';
import { routing } from '@/i18n/routing';
import { NextResponse } from 'next/server';

const intlMiddleware = createIntlMiddleware(routing);

export default auth((req) => {
  // 1. Run intl middleware first to detect locale from cookie
  // With localePrefix: 'never', this sets locale headers without URL rewrites
  const intlResponse = intlMiddleware(req);

  // 2. Apply auth route protection
  const isLoggedIn = !!req.auth;
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = req.nextUrl.pathname === '/login';
  const isApiRoute = req.nextUrl.pathname.startsWith('/api');

  // Allow API routes without auth (webhooks, etc.)
  if (isApiRoute) {
    return intlResponse;
  }

  // Redirect unauthenticated users to login
  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Redirect logged-in users away from login
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return intlResponse;
});

export const config = {
  // Run on all routes except API internals, Next.js internals, and static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
