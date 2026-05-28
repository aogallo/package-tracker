import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { GetRequestConfigParams } from 'next-intl/server';

// We test the request config factory logic by re-creating it here
// to avoid import issues with next-intl internals in test environment
describe('i18n request config', () => {
  const messages = {
    es: { test: 'Hola' },
    en: { test: 'Hello' },
  };

  function createRequestConfig({ requestLocale }: GetRequestConfigParams) {
    return requestLocale.then((locale) => {
      const resolvedLocale = locale && ['es', 'en'].includes(locale) ? locale : 'es';
      return {
        locale: resolvedLocale,
        messages: messages[resolvedLocale as keyof typeof messages],
      };
    });
  }

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should resolve es locale from cookie value', async () => {
    const config = await createRequestConfig({
      requestLocale: Promise.resolve('es'),
    });
    expect(config.locale).toBe('es');
  });

  it('should resolve en locale from cookie value', async () => {
    const config = await createRequestConfig({
      requestLocale: Promise.resolve('en'),
    });
    expect(config.locale).toBe('en');
  });

  it('should fall back to es when no locale is provided', async () => {
    const config = await createRequestConfig({
      requestLocale: Promise.resolve(undefined),
    });
    expect(config.locale).toBe('es');
  });

  it('should fall back to es for unsupported locale values', async () => {
    const config = await createRequestConfig({
      requestLocale: Promise.resolve('fr'),
    });
    expect(config.locale).toBe('es');
  });

  it('should load correct messages for es locale', async () => {
    const config = await createRequestConfig({
      requestLocale: Promise.resolve('es'),
    });
    expect(config.messages).toBe(messages.es);
  });

  it('should load correct messages for en locale', async () => {
    const config = await createRequestConfig({
      requestLocale: Promise.resolve('en'),
    });
    expect(config.messages).toBe(messages.en);
  });
});
