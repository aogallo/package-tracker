import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database at top level
const mockSelect = vi.fn();
const mockInsert = vi.fn();

vi.mock('@/db', () => ({
  db: {
    select: mockSelect,
    insert: mockInsert,
  },
}));

describe('Settings Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock: return empty array (no setting found)
    mockSelect.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    });
    mockInsert.mockReturnValue({
      values: vi.fn().mockReturnValue({
        onConflictDoUpdate: vi.fn().mockResolvedValue(undefined),
      }),
    });
  });

  describe('getSetting', () => {
    it('should return null when setting does not exist', async () => {
      const { getSetting } = await import('@/lib/actions/settings');
      const value = await getSetting('company_name');
      expect(value).toBeNull();
    });

    it('should return setting value when it exists', async () => {
      mockSelect.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ key: 'company_name', value: 'My Company' }]),
          }),
        }),
      });

      const { getSetting } = await import('@/lib/actions/settings');
      const value = await getSetting('company_name');
      expect(value).toBe('My Company');
    });
  });

  describe('getCompanyName', () => {
    it('should return default company name when no setting exists', async () => {
      const { getCompanyName } = await import('@/lib/actions/settings');
      const name = await getCompanyName();
      expect(name).toBe('Package Tracker');
    });

    it('should return stored company name when setting exists', async () => {
      mockSelect.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ key: 'company_name', value: 'Custom Name' }]),
          }),
        }),
      });

      const { getCompanyName } = await import('@/lib/actions/settings');
      const name = await getCompanyName();
      expect(name).toBe('Custom Name');
    });
  });

  describe('setSetting', () => {
    it('should insert or update setting', async () => {
      const { setSetting } = await import('@/lib/actions/settings');
      await expect(setSetting('company_name', 'New Company')).resolves.toBeUndefined();
    });
  });

  describe('getSettings', () => {
    it('should return settings object with default company name', async () => {
      const { getSettings } = await import('@/lib/actions/settings');
      const settings = await getSettings();
      expect(settings).toEqual({ companyName: 'Package Tracker' });
    });
  });

  describe('updateSettings', () => {
    it('should update settings and return success', async () => {
      const { updateSettings } = await import('@/lib/actions/settings');
      const result = await updateSettings({ companyName: 'Updated Company' });
      expect(result).toEqual({ success: true });
    });
  });
});
