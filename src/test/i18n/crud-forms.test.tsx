import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { nestMessages } from '@/lib/i18n/nest-messages';
import esMessages from '../../../messages/es.json' with { type: 'json' };
import enMessages from '../../../messages/en.json' with { type: 'json' };
import { ReportFilters } from '@/components/report-filters';
import { StatusUpdateForm } from '@/components/status-update-form';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

const nestedEs = nestMessages(esMessages as Record<string, string>);
const nestedEn = nestMessages(enMessages as Record<string, string>);

function renderWithLocale(ui: React.ReactElement, locale: 'es' | 'en') {
  const messages = locale === 'en' ? nestedEn : nestedEs;
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe('ReportFilters locale rendering', () => {
  const mockClients = [
    { id: 1, name: 'Client A' },
    { id: 2, name: 'Client B' },
  ];

  it('renders filter labels in Spanish', () => {
    renderWithLocale(<ReportFilters clients={mockClients} onApply={vi.fn()} />, 'es');
    expect(screen.getByText('Desde')).toBeInTheDocument();
    expect(screen.getByText('Hasta')).toBeInTheDocument();
    expect(screen.getByText('Cliente')).toBeInTheDocument();
    expect(screen.getByText('Estado')).toBeInTheDocument();
    expect(screen.getByText('Aplicar Filtros')).toBeInTheDocument();
    expect(screen.getByText('Limpiar')).toBeInTheDocument();
  });

  it('renders filter labels in English', () => {
    renderWithLocale(<ReportFilters clients={mockClients} onApply={vi.fn()} />, 'en');
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('To')).toBeInTheDocument();
    expect(screen.getByText('Client')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Apply Filters')).toBeInTheDocument();
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });
});

describe('StatusUpdateForm locale rendering', () => {
  it('renders submit button in Spanish', () => {
    renderWithLocale(<StatusUpdateForm orderId={1} currentStatus="pending" />, 'es');
    expect(screen.getByText('Actualizar')).toBeInTheDocument();
  });

  it('renders submit button in English', () => {
    renderWithLocale(<StatusUpdateForm orderId={1} currentStatus="pending" />, 'en');
    expect(screen.getByText('Update')).toBeInTheDocument();
  });
});

describe('CRUD page message keys', () => {
  it('has admin.orders keys in both locales', () => {
    const esMsg = esMessages as Record<string, string>;
    const enMsg = enMessages as Record<string, string>;

    const keys = [
      'admin.orders.title',
      'admin.orders.createButton',
      'admin.orders.allOrders',
      'admin.orders.tableView',
      'admin.orders.noOrders',
      'admin.orders.detail.title',
      'admin.orders.detail.updateStatus',
      'admin.orders.detail.customerInfo',
      'admin.orders.detail.deliveryInfo',
      'admin.orders.detail.itemsTitle',
      'admin.orders.detail.noItems',
    ];

    for (const key of keys) {
      expect(typeof esMsg[key]).toBe('string');
      expect(esMsg[key].length).toBeGreaterThan(0);
      expect(typeof enMsg[key]).toBe('string');
      expect(enMsg[key].length).toBeGreaterThan(0);
    }
  });

  it('has admin.clients keys in both locales', () => {
    const esMsg = esMessages as Record<string, string>;
    const enMsg = enMessages as Record<string, string>;

    const keys = [
      'admin.clients.title',
      'admin.clients.addButton',
      'admin.clients.allClients',
      'admin.clients.tableName',
      'admin.clients.tableEmail',
      'admin.clients.tablePhone',
      'admin.clients.tableCreated',
      'admin.clients.tableActions',
      'admin.clients.noClients',
      'admin.clients.deleteButton',
      'admin.clients.form.editTitle',
      'admin.clients.form.newTitle',
      'admin.clients.form.nameLabel',
      'admin.clients.form.emailLabel',
      'admin.clients.form.phoneLabel',
      'admin.clients.form.addressLabel',
      'admin.clients.form.saving',
      'admin.clients.form.updateButton',
      'admin.clients.form.createButton',
      'admin.clients.form.cancelButton',
      'admin.clients.form.toastUpdated',
      'admin.clients.form.toastCreated',
      'admin.clients.form.toastError',
    ];

    for (const key of keys) {
      expect(typeof esMsg[key]).toBe('string');
      expect(esMsg[key].length).toBeGreaterThan(0);
      expect(typeof enMsg[key]).toBe('string');
      expect(enMsg[key].length).toBeGreaterThan(0);
    }
  });

  it('has admin.reports keys in both locales', () => {
    const esMsg = esMessages as Record<string, string>;
    const enMsg = enMessages as Record<string, string>;

    const keys = [
      'admin.reports.title',
      'admin.reports.subtitle',
      'admin.reports.exportCSV',
      'admin.reports.metricTotal',
      'admin.reports.metricPending',
      'admin.reports.metricConfirmed',
      'admin.reports.metricInTransit',
      'admin.reports.metricDelivered',
      'admin.reports.metricCanceled',
      'admin.reports.filteredOrders',
      'admin.reports.loading',
      'admin.reports.noOrders',
      'admin.reports.tryAdjustFilters',
      'admin.reports.filters.dateFrom',
      'admin.reports.filters.dateTo',
      'admin.reports.filters.client',
      'admin.reports.filters.allClients',
      'admin.reports.filters.status',
      'admin.reports.filters.allStatuses',
      'admin.reports.filters.applyButton',
      'admin.reports.filters.clearButton',
    ];

    for (const key of keys) {
      expect(typeof esMsg[key]).toBe('string');
      expect(esMsg[key].length).toBeGreaterThan(0);
      expect(typeof enMsg[key]).toBe('string');
      expect(enMsg[key].length).toBeGreaterThan(0);
    }
  });
});
