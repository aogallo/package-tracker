'use client';

import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const locales = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
] as const;

function setLocaleCookie(newLocale: string) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- document is not available on server
  if (typeof document === 'undefined') return;
  const cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
  // Use cookie setter via primitive assignment
  document.cookie = cookie;
  window.location.reload();
}

export function LocaleSwitcher() {
  const locale = useLocale();

  return (
    <div className="flex items-center gap-1">
      <Globe className="h-4 w-4 text-muted-foreground" />
      {locales.map((l) => (
        <Button
          key={l.code}
          variant={locale === l.code ? 'default' : 'ghost'}
          size="sm"
          className="h-7 min-w-8 px-2 text-xs font-semibold"
          onClick={() => setLocaleCookie(l.code)}
          disabled={locale === l.code}
        >
          {l.label}
        </Button>
      ))}
    </div>
  );
}

/** Minimal variant for tight spaces (footer, mobile) */
export function LocaleSwitcherMinimal() {
  const locale = useLocale();

  const nextLocale = locale === 'es' ? 'en' : 'es';

  return (
    <button
      onClick={() => setLocaleCookie(nextLocale)}
      className="text-xs text-gray-500 hover:text-gray-700 underline underline-offset-2"
    >
      {nextLocale === 'en' ? 'English' : 'Español'}
    </button>
  );
}
