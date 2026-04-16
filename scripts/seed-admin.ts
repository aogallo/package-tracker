/**
 * Seed script to create the first admin user
 *
 * Usage: npx tsx scripts/seed-admin.ts
 *
 * IMPORTANT: Delete or secure this file after running it!
 */

import { db } from '@/db';
import { admins } from '@/db/schema/admins';
import bcrypt from 'bcryptjs';

async function seedAdmin() {
  const email = 'admin@tracker.com';
  const password = 'admin123';
  const name = 'Admin';

  console.log('Creating admin user...');

  // Check if admin already exists
  const existingAdmin = await db.query.admins.findFirst({
    where: (admins, { eq }) => eq(admins.email, email),
  });

  if (existingAdmin) {
    console.log('Admin with this email already exists!');
    return;
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Insert admin
  await db.insert(admins).values({
    email,
    passwordHash,
    name,
  });

  console.log(`✅ Admin created successfully!`);
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
  console.log('');
  console.log('⚠️  IMPORTANT: Change this password after first login!');
  console.log('⚠️  Delete this file after running!');
}

seedAdmin()
  .catch(console.error)
  .finally(() => process.exit(0));
