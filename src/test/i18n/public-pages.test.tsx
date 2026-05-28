import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { nestMessages } from '@/lib/i18n/nest-messages';
import esMessages from '../../../messages/es.json' with { type: 'json' };
import enMessages from '../../../messages/en.json' with { type: 'json' };

// Mock server-only modules used by RSC pages (for server component tests)
vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(),
  getFormatter: vi.fn(),
  getLocale: vi.fn(() => 'es'),
}));

// Mock server actions
vi.mock('@/lib/actions/auth', () => ({
  loginAction: vi.fn(),
}));

// Mock tracking action
vi.mock('@/lib/actions/tracking', () => ({
  trackOrder: vi.fn(),
  getStatusDisplayInfo: vi.fn(),
}));

const nestedEs = nestMessages(esMessages as Record<string, string>);
const nestedEn = nestMessages(enMessages as Record<string, string>);

function renderWithLocale(ui: React.ReactElement, locale: 'es' | 'en') {
  const messages = locale === 'es' ? nestedEs : nestedEn;
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      {ui}
    </NextIntlClientProvider>
  );
}

function mockT(namespace: string, locale: 'es' | 'en') {
  const messages = locale === 'es' ? nestedEs : nestedEn;
  const ns = messages[namespace] as Record<string, unknown> | undefined;
  return (key: string, params?: Record<string, string | number>) => {
    const parts = key.split('.');
    let value: unknown = ns;
    for (const part of parts) {
      if (value && typeof value === 'object') {
        value = (value as Record<string, unknown>)[part];
      } else {
        return key;
      }
    }
    if (typeof value !== 'string') return key;
    if (params) {
      let result: string = value;
      for (const [k, v] of Object.entries(params)) {
        result = result.replace(`{${k}}`, String(v));
      }
      return result;
    }
    return value;
  };
}

describe('Public page locale rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('landing page (client component → useTranslations)', () => {
    it('should render English text with en locale', async () => {
      const Home = (await import('@/app/page')).default;
      renderWithLocale(<Home />, 'en');

      expect(screen.getByText('Track My Package')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your tracking number')).toBeInTheDocument();
      expect(screen.getByText('Admin Access')).toBeInTheDocument();
    });

    it('should render Spanish text with es locale', async () => {
      const Home = (await import('@/app/page')).default;
      renderWithLocale(<Home />, 'es');

      expect(screen.getByText('Package Tracker')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Ingresa tu número de seguimiento')).toBeInTheDocument();
      expect(screen.getByText('Acceso Administrador')).toBeInTheDocument();
    });

    it('should render feature cards in English', async () => {
      const Home = (await import('@/app/page')).default;
      renderWithLocale(<Home />, 'en');

      expect(screen.getByText('In Transit')).toBeInTheDocument();
      expect(screen.getByText('Confirmed')).toBeInTheDocument();
      expect(screen.getByText('Delivered')).toBeInTheDocument();
    });

    it('should render feature cards in Spanish', async () => {
      const Home = (await import('@/app/page')).default;
      renderWithLocale(<Home />, 'es');

      expect(screen.getByText('En Camino')).toBeInTheDocument();
      expect(screen.getByText('Confirmado')).toBeInTheDocument();
      expect(screen.getByText('Entregado')).toBeInTheDocument();
    });

    it('should render footer with current year', async () => {
      const Home = (await import('@/app/page')).default;
      const currentYear = new Date().getFullYear();
      renderWithLocale(<Home />, 'en');

      expect(
        screen.getByText(`© ${currentYear} Package Tracker. All rights reserved.`)
      ).toBeInTheDocument();
    });

    it('should render search button with translated text', async () => {
      const Home = (await import('@/app/page')).default;
      renderWithLocale(<Home />, 'en');

      expect(screen.getByRole('button', { name: /Track/i })).toBeInTheDocument();
    });
  });

  describe('track page (client component → useTranslations)', () => {
    it('should render English text with en locale', async () => {
      const TrackPage = (await import('@/app/track/page')).default;
      renderWithLocale(<TrackPage />, 'en');

      expect(screen.getByText('Track My Package')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your tracking number')).toBeInTheDocument();
    });

    it('should render Spanish text with es locale', async () => {
      const TrackPage = (await import('@/app/track/page')).default;
      renderWithLocale(<TrackPage />, 'es');

      expect(screen.getByText('Rastrear mi paquete')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Ingresa tu número de seguimiento')).toBeInTheDocument();
    });

    it('should render help text in English', async () => {
      const TrackPage = (await import('@/app/track/page')).default;
      renderWithLocale(<TrackPage />, 'en');

      expect(
        screen.getByText("Contact the sender if you don't have a tracking number")
      ).toBeInTheDocument();
    });

    it('should render help text in Spanish', async () => {
      const TrackPage = (await import('@/app/track/page')).default;
      renderWithLocale(<TrackPage />, 'es');

      expect(
        screen.getByText('Contacta al remitente si no tienes un número de seguimiento')
      ).toBeInTheDocument();
    });
  });

  describe('login page (client component → useTranslations)', () => {
    it('should render English text with en locale', async () => {
      const LoginPage = (await import('@/app/login/page')).default;
      renderWithLocale(<LoginPage />, 'en');

      // "Sign In" appears both in the card title and the submit button
      const signInElements = screen.getAllByText('Sign In');
      expect(signInElements.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByPlaceholderText('admin@tracker.com')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('should render Spanish text with es locale', async () => {
      const LoginPage = (await import('@/app/login/page')).default;
      renderWithLocale(<LoginPage />, 'es');

      const iniciarElements = screen.getAllByText('Iniciar Sesión');
      expect(iniciarElements.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByPlaceholderText('admin@tracker.com')).toBeInTheDocument();
      expect(screen.getByLabelText('Correo Electrónico')).toBeInTheDocument();
      expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    });

    it('should render sign-in button in English', async () => {
      const LoginPage = (await import('@/app/login/page')).default;
      renderWithLocale(<LoginPage />, 'en');

      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    });
  });

  describe('not-found page (client component → useTranslations)', () => {
    it('should render English help text with en locale', async () => {
      const NotFound = (await import('@/app/track/[trackingNumber]/not-found')).default;
      renderWithLocale(<NotFound />, 'en');

      expect(screen.getByText("Here's what you can do:")).toBeInTheDocument();
      expect(screen.getByText('Back to Tracking')).toBeInTheDocument();
    });

    it('should render Spanish help text with es locale', async () => {
      const NotFound = (await import('@/app/track/[trackingNumber]/not-found')).default;
      renderWithLocale(<NotFound />, 'es');

      expect(screen.getByText('Esto es lo que puedes hacer:')).toBeInTheDocument();
      expect(screen.getByText('Volver al Rastreo')).toBeInTheDocument();
    });

    it('should render all four help bullet points in English', async () => {
      const NotFound = (await import('@/app/track/[trackingNumber]/not-found')).default;
      renderWithLocale(<NotFound />, 'en');

      expect(screen.getByText(/check that the tracking number/i)).toBeInTheDocument();
      expect(screen.getByText(/12 characters long/i)).toBeInTheDocument();
      expect(screen.getByText(/copying and pasting/i)).toBeInTheDocument();
      expect(screen.getByText(/contact the sender/i)).toBeInTheDocument();
    });

    it('should render all four help bullet points in Spanish', async () => {
      const NotFound = (await import('@/app/track/[trackingNumber]/not-found')).default;
      renderWithLocale(<NotFound />, 'es');

      expect(
        screen.getByText(/número de seguimiento esté escrito correctamente/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/12 caracteres/i)).toBeInTheDocument();
      expect(screen.getByText(/copiar y pegar/i)).toBeInTheDocument();
      expect(screen.getByText(/contacta al remitente/i)).toBeInTheDocument();
    });
  });
});
