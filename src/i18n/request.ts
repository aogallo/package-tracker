import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

/**
 * Convert flat dot-separated message keys to nested structure
 * required by next-intl.
 *
 * Input:  { "landing.title": "Hello", "landing.subtitle": "World" }
 * Output: { landing: { title: "Hello", subtitle: "World" } }
 */
function nestMessages(flat: Record<string, string>): Record<string, unknown> {
  const nested: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split('.');
    let current = nested;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current)) {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }

    current[parts[parts.length - 1]] = value;
  }

  return nested;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate the locale is supported; fall back to default
  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    locale = routing.defaultLocale;
  }

  const flatMessages = (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages: nestMessages(flatMessages),
  };
});
