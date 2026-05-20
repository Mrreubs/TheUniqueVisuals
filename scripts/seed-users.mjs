/**
 * Seed script — creates 3 admin + 3 user test accounts.
 *
 * Usage:
 *   1. Go to Firebase Console → Project Settings → Service Accounts
 *   2. Click "Generate new private key" → save as serviceAccountKey.json
 *   3. Place serviceAccountKey.json in the project root (gitignored)
 *   4. Run: node scripts/seed-users.mjs
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const KEY_PATH = join(__dirname, '..', 'serviceAccountKey.json');

let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(KEY_PATH, 'utf-8'));
} catch {
  console.error('Missing serviceAccountKey.json. Follow steps in the file header.');
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const auth = admin.auth();
const db = admin.firestore();

const SEED_USERS = [
  { email: 'admin1@uniquevisuals.test', password: 'Admin@123', name: 'Test Admin One', role: 'admin' },
  { email: 'admin2@uniquevisuals.test', password: 'Admin@123', name: 'Test Admin Two', role: 'admin' },
  { email: 'admin3@uniquevisuals.test', password: 'Admin@123', name: 'Test Admin Three', role: 'admin' },
  { email: 'user1@uniquevisuals.test', password: 'User@123', name: 'Test User One', role: 'user' },
  { email: 'user2@uniquevisuals.test', password: 'User@123', name: 'Test User Two', role: 'user' },
  { email: 'user3@uniquevisuals.test', password: 'User@123', name: 'Test User Three', role: 'user' },
];

async function seed() {
  let created = 0;
  let skipped = 0;

  for (const u of SEED_USERS) {
    try {
      const existing = await auth.getUserByEmail(u.email);
      console.log(`  SKIP  ${u.email} — already exists`);
      skipped++;
      continue;
    } catch {
      // doesn't exist → create
    }

    const record = await auth.createUser({
      email: u.email,
      password: u.password,
      displayName: u.name,
    });

    await db.collection('users').doc(record.uid).set({
      uid: record.uid,
      email: u.email,
      displayName: u.name,
      role: u.role,
      createdAt: new Date().toISOString(),
    });

    console.log(`  OK    ${u.email} (${u.role})`);
    created++;
  }

  console.log(`\nDone. ${created} created, ${skipped} skipped.`);
  await admin.app().delete();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
