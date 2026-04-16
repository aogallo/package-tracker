import { pgTable, serial, text, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';
import { clients } from './clients';

export const deliveryTypeEnum = pgEnum('delivery_type', ['delivery', 'pickup']);
export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'confirmed',
  'in_transit',
  'delivered',
  'picked_up',
  'canceled',
]);

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  trackingNumber: text('tracking_number').notNull().unique(),
  clientId: integer('client_id').references(() => clients.id),
  guestName: text('guest_name').notNull(),
  guestEmail: text('guest_email').notNull(),
  guestPhone: text('guest_phone'),
  deliveryType: deliveryTypeEnum('delivery_type').notNull(),
  deliveryAddress: text('delivery_address'),
  deliveryCity: text('delivery_city'),
  deliveryZip: text('delivery_zip'),
  status: orderStatusEnum('status').default('pending').notNull(),
  pdfUrl: text('pdf_url'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deliveredAt: timestamp('delivered_at'),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type DeliveryType = 'delivery' | 'pickup';
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'in_transit'
  | 'delivered'
  | 'picked_up'
  | 'canceled';
