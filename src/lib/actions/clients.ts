'use server';

import { db } from '@/db';
import { clients } from '@/db/schema/clients';
import { eq, and, isNull } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getClients() {
  return db
    .select({
      id: clients.id,
      name: clients.name,
      email: clients.email,
      phone: clients.phone,
      address: clients.address,
      createdAt: clients.createdAt,
    })
    .from(clients)
    .where(isNull(clients.deletedAt))
    .orderBy((cols) => [cols.createdAt]);
}

export async function getClientById(id: number) {
  return db.query.clients.findFirst({
    where: and(eq(clients.id, id), isNull(clients.deletedAt)),
  });
}

export async function createClient(data: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}) {
  await db.insert(clients).values({
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    address: data.address || null,
  });
  revalidatePath('/admin/clients');
}

export async function updateClient(
  id: number,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  }
) {
  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (data.name !== undefined) updateData.name = data.name;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.phone !== undefined) updateData.phone = data.phone || null;
  if (data.address !== undefined) updateData.address = data.address || null;

  await db.update(clients).set(updateData).where(eq(clients.id, id));
  revalidatePath('/admin/clients');
}

export async function deleteClient(id: number) {
  // Soft delete
  await db.update(clients).set({ deletedAt: new Date() }).where(eq(clients.id, id));
  revalidatePath('/admin/clients');
}
