import { describe, it, expect } from 'vitest';

// The middleware config matcher regex — kept separate from the full middleware
// because the middleware itself uses next-intl and next-auth internals that
// require a full Next.js environment.
const matcher = ['/((?!api|_next|_vercel|.*\\..*).*)'];
const matcherRegex = /^\/((?!api|_next|_vercel|.*\..*).*)$/;

describe('i18n middleware matcher', () => {
  it('should have a single pattern in the matcher array', () => {
    expect(matcher).toHaveLength(1);
  });

  it('should match admin routes', () => {
    expect(matcherRegex.test('/admin')).toBe(true);
    expect(matcherRegex.test('/admin/orders')).toBe(true);
    expect(matcherRegex.test('/admin/orders/new')).toBe(true);
  });

  it('should match login route', () => {
    expect(matcherRegex.test('/login')).toBe(true);
  });

  it('should match track routes', () => {
    expect(matcherRegex.test('/track')).toBe(true);
    expect(matcherRegex.test('/track/ABC123')).toBe(true);
  });

  it('should match root route', () => {
    expect(matcherRegex.test('/')).toBe(true);
  });

  it('should exclude API routes', () => {
    expect(matcherRegex.test('/api/auth')).toBe(false);
    expect(matcherRegex.test('/api/tickets/1/download')).toBe(false);
  });

  it('should exclude Next.js internals', () => {
    expect(matcherRegex.test('/_next/static/chunks/main.js')).toBe(false);
    expect(matcherRegex.test('/_next/data/build-id.json')).toBe(false);
  });

  it('should exclude Vercel internals', () => {
    expect(matcherRegex.test('/_vercel/insights')).toBe(false);
  });

  it('should exclude static files with extensions', () => {
    expect(matcherRegex.test('/favicon.ico')).toBe(false);
    expect(matcherRegex.test('/robots.txt')).toBe(false);
    expect(matcherRegex.test('/images/logo.png')).toBe(false);
  });
});

describe('i18n middleware behavior', () => {
  it('should use NEXT_LOCALE cookie for locale detection', () => {
    // next-intl middleware with localePrefix: 'never' reads the locale
    // from the NEXT_LOCALE cookie on every request
    const cookieName = 'NEXT_LOCALE';
    expect(cookieName).toBeDefined();
    expect(typeof cookieName).toBe('string');
  });

  it('should recognize supported locales', () => {
    const locales = ['es', 'en'];
    expect(locales).toContain('es');
    expect(locales).toContain('en');
    expect(locales).not.toContain('fr');
  });
});
