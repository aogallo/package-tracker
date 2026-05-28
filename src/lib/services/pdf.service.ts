'use server';

import { renderToBuffer } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { es, enUS, type Locale } from 'date-fns/locale';
import { TicketTemplate, type TicketTranslations } from '@/components/ticket-template';
import { generateQRCode } from './qrcode.service';
import { getOrderById } from '@/lib/actions/orders';
import { getCompanyName } from '@/lib/actions/settings';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const dateLocaleMap: Record<string, Locale> = {
  es,
  en: enUS,
};

function getDateLocale(locale: string): Locale {
  return dateLocaleMap[locale] || es;
}

/**
 * Load flat messages for the given locale and extract ticket.* keys,
 * resolving date interpolations.
 */
async function loadTicketTranslations(
  locale: string,
  orderDate: Date
): Promise<TicketTranslations> {
  const flatMessages: Record<string, string> = (await import(`../../../messages/${locale}.json`))
    .default;
  const dateLocale = getDateLocale(locale);

  return {
    companyTagline: flatMessages['ticket.companyTagline'],
    title: flatMessages['ticket.title'],
    trackingLabel: flatMessages['ticket.trackingLabel'],
    recipientLabel: flatMessages['ticket.recipientLabel'],
    deliveryTypeLabel: flatMessages['ticket.deliveryTypeLabel'],
    deliveryLabel: flatMessages['ticket.deliveryLabel'],
    sectionItems: flatMessages['ticket.sectionItems'],
    tableItem: flatMessages['ticket.tableItem'],
    tableQty: flatMessages['ticket.tableQty'],
    tableDescription: flatMessages['ticket.tableDescription'],
    tableUrl: flatMessages['ticket.tableUrl'],
    viewLink: flatMessages['ticket.viewLink'],
    noItems: flatMessages['ticket.noItems'],
    qrLabel: flatMessages['ticket.qrLabel'],
    generatedDate: flatMessages['ticket.generatedDate'].replace(
      '{date}',
      format(orderDate, 'dd MMM yyyy HH:mm', { locale: dateLocale })
    ),
    orderDate: flatMessages['ticket.orderDate'].replace(
      '{date}',
      format(orderDate, 'dd MMM yyyy', { locale: dateLocale })
    ),
  };
}

export type GenerateTicketResult = {
  success: boolean;
  pdfBuffer?: Buffer;
  error?: string;
};

export async function generateTicket(
  orderId: number,
  locale: string = 'es'
): Promise<GenerateTicketResult> {
  try {
    // Fetch the order with items
    const order = await getOrderById(orderId);

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    const orderDate = order.createdAt || new Date();

    // Generate tracking URL
    const trackingUrl = `${BASE_URL}/track/${order.trackingNumber}`;

    // Generate QR code
    let qrCodeDataUrl = '';
    try {
      qrCodeDataUrl = await generateQRCode(trackingUrl);
    } catch (qrError) {
      console.error('QR code generation failed:', qrError);
      // Continue without QR code - not critical
    }

    // Pre-compute locale-aware translations
    const translations = await loadTicketTranslations(locale, orderDate);

    // Render PDF
    const pdfBuffer = await renderToBuffer(
      TicketTemplate({
        trackingNumber: order.trackingNumber,
        guestName: order.guestName,
        guestEmail: order.guestEmail,
        deliveryType: order.deliveryType as 'delivery' | 'pickup',
        status: order.status,
        items: order.items || [],
        qrCodeDataUrl,
        deliveryAddress: order.deliveryAddress,
        deliveryCity: order.deliveryCity,
        companyName: await getCompanyName(),
        locale,
        translations,
      })
    );

    return { success: true, pdfBuffer };
  } catch (error) {
    console.error('PDF generation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate PDF',
    };
  }
}
