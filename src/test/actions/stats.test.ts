/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/db', () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ count: 0 }]),
      }),
    }),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([]),
        onConflictDoUpdate: vi.fn().mockResolvedValue(undefined),
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    }),
  },
}));

describe('Stats Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getStats', () => {
    it('should return zero counts when no orders exist', async () => {
      const { getStats } = await import('@/lib/actions/stats');
      const { db } = await import('@/db');

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ count: 0 }]),
        }),
      } as any);

      const stats = await getStats();
      expect(stats.total).toBe(0);
      expect(stats.pending).toBe(0);
      expect(stats.inTransit).toBe(0);
      expect(stats.delivered).toBe(0);
      expect(stats.canceled).toBe(0);
    });

    it('should return correct stats structure', async () => {
      const { getStats } = await import('@/lib/actions/stats');
      const { db } = await import('@/db');

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ count: 0 }]),
        }),
      } as any);

      const stats = await getStats();
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('pending');
      expect(stats).toHaveProperty('inTransit');
      expect(stats).toHaveProperty('delivered');
      expect(stats).toHaveProperty('canceled');
    });

    it('should handle the stats structure correctly', async () => {
      const { getStats } = await import('@/lib/actions/stats');
      const { db } = await import('@/db');

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ count: 0 }]),
        }),
      } as any);

      const stats = await getStats();
      expect(stats).toEqual({
        total: 0,
        pending: 0,
        inTransit: 0,
        delivered: 0,
        canceled: 0,
      });
    });
  });
});
