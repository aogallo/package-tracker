import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { orders, clients, orderItems } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all orders with client info, sorted by createdAt desc
    const ordersWithClients = await db
      .select({
        id: orders.id,
        trackingNumber: orders.trackingNumber,
        status: orders.status,
        deliveryType: orders.deliveryType,
        guestName: orders.guestName,
        guestEmail: orders.guestEmail,
        guestPhone: orders.guestPhone,
        deliveryAddress: orders.deliveryAddress,
        deliveryCity: orders.deliveryCity,
        deliveryZip: orders.deliveryZip,
        notes: orders.notes,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        clientId: orders.clientId,
        client: {
          id: clients.id,
          name: clients.name,
        },
      })
      .from(orders)
      .leftJoin(clients, eq(orders.clientId, clients.id))
      .orderBy(desc(orders.createdAt));

    // Fetch items for each order
    const ordersWithItems = await Promise.all(
      ordersWithClients.map(async (order) => {
        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
        return { ...order, items };
      })
    );

    return NextResponse.json({ orders: ordersWithItems });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
