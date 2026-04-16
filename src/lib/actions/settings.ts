'use server';

import { db } from '@/db';
import { settings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getSetting(key: string): Promise<string | null> {
  const result = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return result[0]?.value || null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await db
    .insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: new Date() } });
}

export async function getCompanyName(): Promise<string> {
  return (await getSetting('company_name')) || 'Package Tracker';
}

// Settings CRUD
export interface SettingsData {
  companyName: string;
}

export async function getSettings(): Promise<SettingsData> {
  const companyName = await getCompanyName();
  return { companyName };
}

export async function updateSettings(data: SettingsData): Promise<{ success: boolean }> {
  await setSetting('company_name', data.companyName.trim());
  return { success: true };
}
