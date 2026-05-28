import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { nestMessages } from '@/lib/i18n/nest-messages';

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
