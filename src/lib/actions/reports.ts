'use server';

import { db } from '@/db';
import { orders, clients } from '@/db/schema';
import { eq, and, gte, lte, sql, isNull } from 'drizzle-orm';

export type ReportFilters = {
  dateFrom?: Date;
  dateTo?: Date;
  clientId?: number;
  status?: string;
};

export type ReportMetrics = {
  total: number;
  pending: number;
  confirmed: number;
  in_transit: number;
  delivered: number;
  picked_up: number;
  canceled: number;
};

export type ReportOrder = {
  id: number;
  trackingNumber: string;
  clientName: string | null;
  guestName: string;
  deliveryType: string;
  status: string;
  itemsCount: number;
  createdAt: Date | null;
  updatedAt: Date | null;
};

/**
 * Get report metrics (summary counts)
 */
export async function getReportMetrics(filters?: ReportFilters): Promise<ReportMetrics> {
  const conditions = buildConditions(filters);

  // Get counts by status
  const allOrders = await db
    .select({
      status: orders.status,
    })
    .from(orders)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  const counts: ReportMetrics = {
    total: allOrders.length,
    pending: 0,
    confirmed: 0,
    in_transit: 0,
    delivered: 0,
    picked_up: 0,
    canceled: 0,
  };

  for (const order of allOrders) {
    switch (order.status) {
      case 'pending':
        counts.pending++;
        break;
      case 'confirmed':
        counts.confirmed++;
        break;
      case 'in_transit':
        counts.in_transit++;
        break;
      case 'delivered':
        counts.delivered++;
        break;
      case 'picked_up':
        counts.picked_up++;
        break;
      case 'canceled':
        counts.canceled++;
        break;
    }
  }

  return counts;
}

/**
 * Get filtered orders for report
 */
export async function getReportOrders(filters?: ReportFilters): Promise<ReportOrder[]> {
  const conditions = buildConditions(filters);

  const result = await db
    .select({
      id: orders.id,
      trackingNumber: orders.trackingNumber,
      clientName: clients.name,
      guestName: orders.guestName,
      deliveryType: orders.deliveryType,
      status: orders.status,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
    })
    .from(orders)
    .leftJoin(clients, eq(orders.clientId, clients.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy((cols) => [cols.createdAt]);

  // Get items count for each order
  const ordersWithItems = await Promise.all(
    result.map(async (order) => {
      // Count items for this order using raw query
      const countResult = await db.execute(
        sql`SELECT COUNT(*) as count FROM order_items WHERE order_id = ${order.id}`
      );
      const resultArray = countResult as unknown as Array<{ count: number }>;
      const itemsCount = Number(resultArray[0]?.count || 0);

      return {
        ...order,
        itemsCount,
      };
    })
  );

  return ordersWithItems;
}

/**
 * Generate CSV string for export
 */
export async function exportCSV(filters?: ReportFilters): Promise<string> {
  const ordersData = await getReportOrders(filters);

  // CSV header
  const headers = [
    'Tracking Number',
    'Client Name',
    'Status',
    'Delivery Type',
    'Items Count',
    'Created At',
    'Updated At',
  ];

  // CSV rows
  const rows = ordersData.map((order) => [
    order.trackingNumber,
    order.clientName || order.guestName,
    order.status,
    order.deliveryType,
    order.itemsCount.toString(),
    order.createdAt ? new Date(order.createdAt).toISOString() : '',
    order.updatedAt ? new Date(order.updatedAt).toISOString() : '',
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((cell) => {
          // Escape cells that contain commas or quotes
          const cellStr = String(cell);
          if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        })
        .join(',')
    ),
  ].join('\n');

  return csvContent;
}

/**
 * Get all clients for filter dropdown
 */
export async function getClientsForReport() {
  return db
    .select({
      id: clients.id,
      name: clients.name,
    })
    .from(clients)
    .where(isNull(clients.deletedAt))
    .orderBy((cols) => [cols.name]);
}

/**
 * Build Drizzle conditions from filters
 */
function buildConditions(filters?: ReportFilters) {
  const conditions: ReturnType<typeof eq>[] = [];

  if (filters?.dateFrom) {
    conditions.push(gte(orders.createdAt, filters.dateFrom));
  }

  if (filters?.dateTo) {
    conditions.push(lte(orders.createdAt, filters.dateTo));
  }

  if (filters?.clientId) {
    conditions.push(eq(orders.clientId, filters.clientId));
  }

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

  return conditions;
}
