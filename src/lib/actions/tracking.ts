'use server';

import { db } from '@/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';

export type PublicOrderInfo = {
  trackingNumber: string;
  status: string;
  deliveryType: string;
  items: Array<{
    name: string;
    quantity: number;
    description: string | null;
    url: string | null;
  }>;
  createdAt: Date | null;
  updatedAt: Date | null;
  deliveredAt: Date | null;
};

/**
 * Public action to track an order by tracking number
 * Returns only non-sensitive information
 */
export async function trackOrder(trackingNumber: string): Promise<PublicOrderInfo | null> {
  const order = await db.query.orders.findFirst({
    where: eq(orders.trackingNumber, trackingNumber),
    with: {
      items: true,
    },
  });

  if (!order) {
    return null;
  }

  // Return only public-safe information
  return {
    trackingNumber: order.trackingNumber,
    status: order.status,
    deliveryType: order.deliveryType,
    items: order.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      description: item.description,
      url: item.url,
    })),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    deliveredAt: order.deliveredAt,
  };
}

/**
 * Get status display info for public tracking (locale-aware)
 */
export async function getStatusDisplayInfo(
  status: string,
  locale: string = 'es'
): Promise<{ label: string; description: string; color: string }> {
  const isEn = locale === 'en';

  const statusInfo: Record<
    string,
    { es: string; en: string; esDesc: string; enDesc: string; color: string }
  > = {
    pending: {
      es: 'Orden Recibida',
      en: 'Order Received',
      esDesc: 'Tu orden ha sido recibida y está esperando ser procesada.',
      enDesc: 'Your order has been received and is awaiting processing.',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
    confirmed: {
      es: 'Confirmado',
      en: 'Confirmed',
      esDesc: 'Tu orden ha sido confirmada y se está preparando.',
      enDesc: 'Your order has been confirmed and is being prepared.',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    in_transit: {
      es: 'En Camino',
      en: 'In Transit',
      esDesc: 'Tu paquete está en camino a su destino.',
      enDesc: 'Your package is on its way to its destination.',
      color: 'bg-purple-100 text-purple-800 border-purple-300',
    },
    delivered: {
      es: 'Entregado',
      en: 'Delivered',
      esDesc: 'Tu paquete ha sido entregado exitosamente.',
      enDesc: 'Your package has been successfully delivered.',
      color: 'bg-green-100 text-green-800 border-green-300',
    },
    picked_up: {
      es: 'Recogido',
      en: 'Picked Up',
      esDesc: 'Tu paquete ha sido recogido de nuestra ubicación.',
      enDesc: 'Your package has been picked up from our location.',
      color: 'bg-green-100 text-green-800 border-green-300',
    },
    canceled: {
      es: 'Cancelado',
      en: 'Canceled',
      esDesc: 'Esta orden ha sido cancelada.',
      enDesc: 'This order has been canceled.',
      color: 'bg-red-100 text-red-800 border-red-300',
    },
  };

  const info = statusInfo[status];
  if (!info) {
    return {
      label: isEn ? 'Unknown' : 'Desconocido',
      description: isEn
        ? 'Status information is not available.'
        : 'La información del estado no está disponible.',
      color: 'bg-gray-100 text-gray-800 border-gray-300',
    };
  }

  return {
    label: isEn ? info.en : info.es,
    description: isEn ? info.enDesc : info.esDesc,
    color: info.color,
  };
}
