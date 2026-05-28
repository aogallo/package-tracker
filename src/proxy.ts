import { auth } from '@/lib/auth';
import { routing } from '@/i18n/routing';
import { NextResponse } from 'next/server';

export default auth((req) => {
  // 1. Locale detection — read from cookie, set header for next-intl
  let locale = req.cookies.get('NEXT_LOCALE')?.value;
  if (!locale || !routing.locales.includes(locale as 'es' | 'en')) {
    locale = routing.defaultLocale;
  }

  const response = NextResponse.next();
  response.headers.set('x-next-intl-locale', locale);

  // Set cookie on first visit (no redirect needed)
  if (!req.cookies.has('NEXT_LOCALE')) {
    response.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    });
  }

  // 2. Auth route protection
  const isLoggedIn = !!req.auth && 'user' in (req.auth as object);
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = req.nextUrl.pathname === '/login';
  const isApiRoute = req.nextUrl.pathname.startsWith('/api');

  // Allow API routes without auth
  if (isApiRoute) {
    return response;
  }

  // Redirect unauthenticated users to login
  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Redirect logged-in users away from login
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return response;
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
