'use server';

import { db } from '@/db';
import { orders, orderItems, clients } from '@/db/schema';
import { eq, and, like, gte, lte, or, isNull } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { nanoid } from 'nanoid';
import type { SQL } from 'drizzle-orm';

export type OrderFilters = {
  status?: string;
  clientName?: string;
  dateFrom?: Date;
  dateTo?: Date;
};

export type OrderWithClientName = {
  id: number;
  trackingNumber: string;
  clientId: number | null;
  guestName: string;
  guestEmail: string;
  deliveryType: 'delivery' | 'pickup';
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'picked_up' | 'canceled';
  createdAt: Date;
  clientName: string | null;
};

export async function getOrders(filters?: OrderFilters): Promise<OrderWithClientName[]> {
  const conditions = [];

  if (filters?.status) {
    conditions.push(
      eq(
        orders.status,
        filters.status as
          | 'pending'
          | 'confirmed'
          | 'in_transit'
          | 'delivered'
          | 'picked_up'
          | 'canceled'
      )
    );
  }

  if (filters?.dateFrom) {
    conditions.push(gte(orders.createdAt, filters.dateFrom));
  }

  if (filters?.dateTo) {
    conditions.push(lte(orders.createdAt, filters.dateTo));
  }

  const query = db
    .select({
      id: orders.id,
      trackingNumber: orders.trackingNumber,
      clientId: orders.clientId,
      guestName: orders.guestName,
      guestEmail: orders.guestEmail,
      deliveryType: orders.deliveryType,
      status: orders.status,
      createdAt: orders.createdAt,
      clientName: clients.name,
    })
    .from(orders)
    .leftJoin(clients, eq(orders.clientId, clients.id));

  if (filters?.clientName) {
    const nameSearch = `%${filters.clientName}%`;
    conditions.push(or(like(clients.name, nameSearch), like(orders.guestName, nameSearch)) as SQL);
  }

  if (conditions.length > 0) {
    return query.where(and(...conditions)).orderBy((cols) => [cols.createdAt]);
  }

  return query.orderBy((cols) => [cols.createdAt]);
}

export async function getOrderById(id: number) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      items: true,
    },
  });

  if (order && order.clientId) {
    const client = await db.query.clients.findFirst({
      where: eq(clients.id, order.clientId),
    });
    return { ...order, client };
  }

  return order;
}

export async function getOrderByTracking(trackingNumber: string) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.trackingNumber, trackingNumber),
    with: {
      items: true,
    },
  });

  if (order && order.clientId) {
    const client = await db.query.clients.findFirst({
      where: eq(clients.id, order.clientId),
    });
    return { ...order, client };
  }

  return order;
}

export type CreateOrderInput = {
  clientId?: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  deliveryType: 'delivery' | 'pickup';
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryZip?: string;
  notes?: string;
  items: Array<{ name: string; quantity: number; description?: string; url?: string }>;
};

export async function createOrder(data: CreateOrderInput) {
  const trackingNumber = nanoid(12).toUpperCase();

  console.log('[createOrder] Starting order creation:', {
    guestName: data.guestName,
    itemsCount: data.items?.length,
  });

  // Insert order first
  const [order] = await db
    .insert(orders)
    .values({
      trackingNumber,
      clientId: data.clientId || null,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone || null,
      deliveryType: data.deliveryType,
      deliveryAddress: data.deliveryAddress || null,
      deliveryCity: data.deliveryCity || null,
      deliveryZip: data.deliveryZip || null,
      notes: data.notes || null,
      status: 'pending',
    })
    .returning();

  console.log('[createOrder] Order created:', order);

  // Insert items if any
  if (data.items?.length) {
    const validItems = data.items.filter((item) => item.name && item.name.trim() !== '');
    if (validItems.length > 0) {
      console.log('[createOrder] Inserting items:', validItems);
      await db.insert(orderItems).values(
        validItems.map((item) => ({
          orderId: order.id,
          name: item.name,
          quantity: item.quantity,
          description: item.description || null,
          url: item.url || null,
        }))
      );
      console.log('[createOrder] Items inserted successfully');
    }
  }

  revalidatePath('/admin/orders');
  console.log('[createOrder] Complete, returning order:', order);
  return order;
}

export async function updateOrderStatus(
  id: number,
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'picked_up' | 'canceled'
) {
  const updateData: Record<string, unknown> = {
    status,
    updatedAt: new Date(),
  };

  if (status === 'delivered') {
    updateData.deliveredAt = new Date();
  }

  await db.update(orders).set(updateData).where(eq(orders.id, id));
  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${id}`);
}

export async function deleteOrder(id: number) {
  // Soft delete - mark as canceled
  await db
    .update(orders)
    .set({ status: 'canceled' as const, updatedAt: new Date() })
    .where(eq(orders.id, id));
  revalidatePath('/admin/orders');
}

export async function getClientsForSelect() {
  return db
    .select({
      id: clients.id,
      name: clients.name,
      email: clients.email,
    })
    .from(clients)
    .where(isNull(clients.deletedAt))
    .orderBy((cols) => [cols.name]);
}
