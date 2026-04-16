'use server';

import { renderToBuffer } from '@react-pdf/renderer';
import { TicketTemplate } from '@/components/ticket-template';
import { generateQRCode } from './qrcode.service';
import { getOrderById } from '@/lib/actions/orders';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export type GenerateTicketResult = {
  success: boolean;
  pdfBuffer?: Buffer;
  error?: string;
};

export async function generateTicket(orderId: number): Promise<GenerateTicketResult> {
  try {
    // Fetch the order with items
    const order = await getOrderById(orderId);

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

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
        createdAt: order.createdAt || new Date(),
        deliveryAddress: order.deliveryAddress,
        deliveryCity: order.deliveryCity,
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
