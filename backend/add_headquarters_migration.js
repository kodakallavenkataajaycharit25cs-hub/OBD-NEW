const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL);

async function migrate() {
  console.log('[Migration] Adding headquarters to owners table...');
  try {
    await sql`ALTER TABLE owners ADD COLUMN IF NOT EXISTS headquarters TEXT DEFAULT 'India'`;
    console.log('[Migration] ✓ headquarters column added.');
  } catch (err) {
    console.error('[Migration] Failed:', err.message);
  } finally {
    await sql.end();
    process.exit(0);
  }
}

migrate();
