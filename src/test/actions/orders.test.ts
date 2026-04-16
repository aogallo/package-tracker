/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the database
vi.mock('@/db', () => ({
  db: {
    query: {
      orders: {
        findFirst: vi.fn(),
      },
      clients: {
        findFirst: vi.fn(),
      },
    },
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        leftJoin: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue([]),
        }),
        where: vi.fn().mockResolvedValue([]),
      }),
    }),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([]),
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    }),
  },
}));

// Mock revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

// Mock nanoid
vi.mock('nanoid', () => ({
  nanoid: vi.fn(() => 'TEST12345678'),
}));

describe('Order Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getOrders', () => {
    it('should return empty array when no orders exist', async () => {
      const { getOrders } = await import('@/lib/actions/orders');

      const orders = await getOrders();
      expect(orders).toEqual([]);
    });

    it('should return orders with client name when they exist', async () => {
      const { getOrders } = await import('@/lib/actions/orders');
      const { db } = await import('@/db');

      const mockOrders = [
        {
          id: 1,
          trackingNumber: 'TEST123',
          clientId: 1,
          guestName: 'Guest User',
          guestEmail: 'guest@example.com',
          deliveryType: 'pickup' as const,
          status: 'pending' as const,
          createdAt: new Date(),
          clientName: 'Test Client',
        },
      ];

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          leftJoin: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockResolvedValue(mockOrders),
          }),
        }),
      } as any);

      const orders = await getOrders();
      expect(orders).toEqual(mockOrders);
    });
  });

  describe('getOrderById', () => {
    it('should return order with items and client when found', async () => {
      const { getOrderById } = await import('@/lib/actions/orders');
      const { db } = await import('@/db');

      const mockOrder = {
        id: 1,
        trackingNumber: 'TEST123',
        clientId: 1,
        guestName: 'Test',
        guestEmail: 'test@example.com',
        guestPhone: null,
        deliveryType: 'pickup' as const,
        deliveryAddress: null,
        deliveryCity: null,
        deliveryZip: null,
        notes: null,
        status: 'pending' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        deliveredAt: null,
        items: [{ id: 1, orderId: 1, name: 'Item 1', quantity: 1 }],
      };

      const mockClient = {
        id: 1,
        name: 'Test Client',
        email: 'client@example.com',
        phone: null,
        address: null,
        city: null,
        zip: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      vi.mocked(db.query.orders.findFirst).mockResolvedValue(mockOrder as any);
      vi.mocked(db.query.clients.findFirst).mockResolvedValue(mockClient as any);

      const result = await getOrderById(1);
      expect(result).toHaveProperty('client');
      expect((result as any).client).toEqual(mockClient);
    });

    it('should return order without client when clientId is null', async () => {
      const { getOrderById } = await import('@/lib/actions/orders');
      const { db } = await import('@/db');

      const mockOrder = {
        id: 1,
        trackingNumber: 'TEST123',
        clientId: null,
        guestName: 'Test',
        guestEmail: 'test@example.com',
        items: [],
      };

      vi.mocked(db.query.orders.findFirst).mockResolvedValue(mockOrder as any);

      const result = await getOrderById(1);
      expect(result?.clientId).toBeNull();
      expect(result).not.toHaveProperty('client');
    });
  });

  describe('createOrder', () => {
    it('should create order with tracking number', async () => {
      const { createOrder } = await import('@/lib/actions/orders');
      const { db } = await import('@/db');

      const mockCreatedOrder = {
        id: 1,
        trackingNumber: 'TEST12345678',
        clientId: null,
        guestName: 'Test Guest',
        guestEmail: 'test@example.com',
        guestPhone: null,
        deliveryType: 'pickup' as const,
        deliveryAddress: null,
        deliveryCity: null,
        deliveryZip: null,
        notes: null,
        status: 'pending' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        deliveredAt: null,
      };

      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockCreatedOrder]),
        }),
      } as any);

      const result = await createOrder({
        guestName: 'Test Guest',
        guestEmail: 'test@example.com',
        deliveryType: 'pickup',
        items: [],
      });

      expect(result.trackingNumber).toBe('TEST12345678');
      expect(result.guestName).toBe('Test Guest');
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status', async () => {
      const { updateOrderStatus } = await import('@/lib/actions/orders');
      const { db } = await import('@/db');

      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(undefined),
        }),
      } as any);

      await expect(updateOrderStatus(1, 'delivered')).resolves.toBeUndefined();
      expect(db.update).toHaveBeenCalled();
    });
  });

  describe('deleteOrder', () => {
    it('should soft delete order by setting status to canceled', async () => {
      const { deleteOrder } = await import('@/lib/actions/orders');
      const { db } = await import('@/db');

      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(undefined),
        }),
      } as any);

      await deleteOrder(1);
      expect(db.update).toHaveBeenCalled();
    });
  });
});
