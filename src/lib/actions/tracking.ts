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
 * Get status display info for public tracking (Spanish)
 */
export async function getStatusDisplayInfo(
  status: string
): Promise<{ label: string; description: string; color: string }> {
  const statusInfo: Record<string, { label: string; description: string; color: string }> = {
    pending: {
      label: 'Orden Recibida',
      description: 'Tu orden ha sido recibida y está esperando ser procesada.',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
    confirmed: {
      label: 'Confirmado',
      description: 'Tu orden ha sido confirmada y se está preparando.',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    in_transit: {
      label: 'En Camino',
      description: 'Tu paquete está en camino a su destino.',
      color: 'bg-purple-100 text-purple-800 border-purple-300',
    },
    delivered: {
      label: 'Entregado',
      description: 'Tu paquete ha sido entregado exitosamente.',
      color: 'bg-green-100 text-green-800 border-green-300',
    },
    picked_up: {
      label: 'Recogido',
      description: 'Tu paquete ha sido recogido de nuestra ubicación.',
      color: 'bg-green-100 text-green-800 border-green-300',
    },
    canceled: {
      label: 'Cancelado',
      description: 'Esta orden ha sido cancelada.',
      color: 'bg-red-100 text-red-800 border-red-300',
    },
  };

  return (
    statusInfo[status] || {
      label: 'Desconocido',
      description: 'La información del estado no está disponible.',
      color: 'bg-gray-100 text-gray-800 border-gray-300',
    }
  );
}
