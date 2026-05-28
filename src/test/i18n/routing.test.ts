import { describe, it, expect } from 'vitest';
import { routing } from '@/i18n/routing';

describe('i18n routing config', () => {
  it('should define both es and en locales', () => {
    expect(routing.locales).toEqual(['es', 'en']);
  });

  it('should have es as default locale', () => {
    expect(routing.defaultLocale).toBe('es');
  });

  it('should use localePrefix mode never for cookie-based routing', () => {
    expect(routing.localePrefix).toEqual({ mode: 'never' });
  });
});
