import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { nestMessages } from '@/lib/i18n/nest-messages';
import esMessages from '../../../messages/es.json' with { type: 'json' };
import enMessages from '../../../messages/en.json' with { type: 'json' };

// Mock settings actions to avoid Neon DB connection requirement
vi.mock('@/lib/actions/settings', () => ({
  updateSettings: vi.fn().mockResolvedValue({ success: true }),
}));

import SettingsForm from '@/app/admin/settings/settings-form';

const nestedEs = nestMessages(esMessages as Record<string, string>);
const nestedEn = nestMessages(enMessages as Record<string, string>);

// Helper to render with locale
function renderWithLocale(ui: React.ReactElement, locale: 'es' | 'en') {
  const messages = locale === 'en' ? nestedEn : nestedEs;
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe('Admin Settings Form locale rendering', () => {
  it('renders save button in Spanish with es locale', () => {
    renderWithLocale(<SettingsForm initialCompanyName="Test Corp" />, 'es');
    expect(screen.getByRole('button', { name: 'Guardar Configuración' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Mi Empresa de Paquetes')).toBeInTheDocument();
  });

  it('renders save button in English with en locale', () => {
    renderWithLocale(<SettingsForm initialCompanyName="Test Corp" />, 'en');
    expect(screen.getByRole('button', { name: 'Save Settings' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('My Package Company')).toBeInTheDocument();
  });
});

describe('Admin message keys', () => {
  it('has admin.layout keys in both locales', () => {
    const esLayout = esMessages as Record<string, string>;
    const enLayout = enMessages as Record<string, string>;

    const layoutKeys = [
      'admin.layout.panelName',
      'admin.layout.navHome',
      'admin.layout.navClients',
      'admin.layout.navOrders',
      'admin.layout.navReports',
      'admin.layout.navSettings',
      'admin.layout.logout',
    ];

    for (const key of layoutKeys) {
      expect(typeof esLayout[key]).toBe('string');
      expect(esLayout[key].length).toBeGreaterThan(0);
      expect(typeof enLayout[key]).toBe('string');
      expect(enLayout[key].length).toBeGreaterThan(0);
    }
  });

  it('has admin.dashboard keys in both locales', () => {
    const esMsg = esMessages as Record<string, string>;
    const enMsg = enMessages as Record<string, string>;

    const dashboardKeys = [
      'admin.dashboard.title',
      'admin.dashboard.subtitle',
      'admin.dashboard.statTotal',
      'admin.dashboard.statPending',
      'admin.dashboard.statInTransit',
      'admin.dashboard.statDelivered',
      'admin.dashboard.statCanceled',
      'admin.dashboard.statTotalDesc',
      'admin.dashboard.statPendingDesc',
      'admin.dashboard.statInTransitDesc',
      'admin.dashboard.statDeliveredDesc',
      'admin.dashboard.statCanceledDesc',
      'admin.dashboard.recentOrders',
      'admin.dashboard.recentOrdersDesc',
      'admin.dashboard.viewAll',
      'admin.dashboard.noOrders',
      'admin.dashboard.createFirst',
      'admin.dashboard.clientLabel',
      'admin.dashboard.noDate',
    ];

    for (const key of dashboardKeys) {
      expect(typeof esMsg[key]).toBe('string');
      expect(esMsg[key].length).toBeGreaterThan(0);
      expect(typeof enMsg[key]).toBe('string');
      expect(enMsg[key].length).toBeGreaterThan(0);
    }
  });

  it('has admin.settings keys in both locales', () => {
    const esMsg = esMessages as Record<string, string>;
    const enMsg = enMessages as Record<string, string>;

    const settingsKeys = [
      'admin.settings.title',
      'admin.settings.subtitle',
      'admin.settings.companyInfo',
      'admin.settings.companyName',
      'admin.settings.companyNamePlaceholder',
      'admin.settings.companyNameHint',
      'admin.settings.saving',
      'admin.settings.saveButton',
      'admin.settings.toastSaved',
      'admin.settings.toastError',
    ];

    for (const key of settingsKeys) {
      expect(typeof esMsg[key]).toBe('string');
      expect(esMsg[key].length).toBeGreaterThan(0);
      expect(typeof enMsg[key]).toBe('string');
      expect(enMsg[key].length).toBeGreaterThan(0);
    }
  });

  it('has locale-specific values for admin.layout keys', () => {
    const esMsg = esMessages as Record<string, string>;
    const enMsg = enMessages as Record<string, string>;

    expect(esMsg['admin.layout.navOrders']).toBe('Órdenes');
    expect(enMsg['admin.layout.navOrders']).toBe('Orders');

    expect(esMsg['admin.layout.logout']).toBe('Cerrar Sesión');
    expect(enMsg['admin.layout.logout']).toBe('Log Out');

    expect(esMsg['admin.layout.panelName']).toBe('Panel Admin');
    expect(enMsg['admin.layout.panelName']).toBe('Admin Panel');
  });

  it('has locale-specific values for admin.dashboard keys', () => {
    const esMsg = esMessages as Record<string, string>;
    const enMsg = enMessages as Record<string, string>;

    expect(esMsg['admin.dashboard.title']).toBe('Panel de Administración');
    expect(enMsg['admin.dashboard.title']).toBe('Admin Dashboard');

    expect(esMsg['admin.dashboard.viewAll']).toBe('Ver Todas');
    expect(enMsg['admin.dashboard.viewAll']).toBe('View All');
  });

  it('has locale-specific values for admin.settings keys', () => {
    const esMsg = esMessages as Record<string, string>;
    const enMsg = enMessages as Record<string, string>;

    expect(esMsg['admin.settings.title']).toBe('Configuración');
    expect(enMsg['admin.settings.title']).toBe('Settings');

    expect(esMsg['admin.settings.saveButton']).toBe('Guardar Configuración');
    expect(enMsg['admin.settings.saveButton']).toBe('Save Settings');

    expect(esMsg['admin.settings.toastSaved']).toBe('Configuración guardada');
    expect(enMsg['admin.settings.toastSaved']).toBe('Settings saved');
  });
});
