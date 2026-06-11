const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL);

async function migrate() {
  console.log('[Migration] Creating admins table...');
  try {
    // Create the table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS admins (
        id        TEXT PRIMARY KEY,
        name      TEXT NOT NULL,
        email     TEXT NOT NULL UNIQUE,
        contact   TEXT DEFAULT '',
        role      TEXT DEFAULT 'admin',
        password  TEXT DEFAULT '',
        status    TEXT DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    console.log('[Migration] ✓ admins table ready.');

    // Check if table is empty and seed a default super-admin
    const existing = await sql`SELECT id FROM admins LIMIT 1`;
    if (existing.length === 0) {
      console.log('[Migration] Seeding default super-admin...');
      await sql`
        INSERT INTO admins (id, name, email, contact, role, status)
        VALUES ('A01', 'Super Admin', 'superadmin@sukrutha.com', '', 'super_admin', 'active')
        ON CONFLICT (id) DO NOTHING
      `;
      console.log('[Migration] ✓ Default super-admin seeded.');
    } else {
      console.log('[Migration] Table already has data, skipping seed.');
    }

    console.log('[Migration] All done!');
  } catch (err) {
    console.error('[Migration] Failed:', err.message);
  } finally {
    await sql.end();
    process.exit(0);
  }
}

migrate();
