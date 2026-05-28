import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  // Auth.js v5 sets req.auth to {} even without session.
  // Check for actual user object to determine auth state.
  const isLoggedIn = !!req.auth && 'user' in (req.auth as object);
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = req.nextUrl.pathname === '/login';
  const isApiRoute = req.nextUrl.pathname.startsWith('/api');

  // Allow API routes without auth (webhooks, etc.)
  if (isApiRoute) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login
  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Redirect logged-in users away from login
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
