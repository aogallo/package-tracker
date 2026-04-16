import { NextResponse } from 'next/server';
import { db } from '@/db';
import { orders } from '@/db/schema';
import { count, eq } from 'drizzle-orm';

export async function GET() {
  try {
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

    return NextResponse.json({
      total,
      pending,
      inTransit,
      delivered,
      canceled,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
