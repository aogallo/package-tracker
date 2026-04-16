'use server';

import { db } from '@/db';
import { orders } from '@/db/schema';
import { count, eq } from 'drizzle-orm';

export interface OrderStats {
  total: number;
  pending: number;
  inTransit: number;
  delivered: number;
  canceled: number;
}

export async function getStats(): Promise<OrderStats> {
  // Get total count
  const totalResult = await db.select({ count: count() }).from(orders);
  const total = totalResult[0]?.count || 0;

  // Get counts by status
  const pendingResult = await db
    .select({ count: count() })
    .from(orders)
    .where(eq(orders.status, 'pending'));
  const pending = pendingResult[0]?.count || 0;

  const inTransitResult = await db
    .select({ count: count() })
    .from(orders)
    .where(eq(orders.status, 'in_transit'));
  const inTransit = inTransitResult[0]?.count || 0;

  const deliveredResult = await db
    .select({ count: count() })
    .from(orders)
    .where(eq(orders.status, 'delivered'));
  const delivered = deliveredResult[0]?.count || 0;

  const canceledResult = await db
    .select({ count: count() })
    .from(orders)
    .where(eq(orders.status, 'canceled'));
  const canceled = canceledResult[0]?.count || 0;

  return { total, pending, inTransit, delivered, canceled };
}
