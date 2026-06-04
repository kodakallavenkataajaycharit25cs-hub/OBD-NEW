const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL);

async function updateSchema() {
  console.log('Updating schema...');
  try {
    // Add email column to owners if it doesn't exist
    await sql`ALTER TABLE owners ADD COLUMN IF NOT EXISTS email TEXT`;
    // Add contact column to owners for phone numbers
    await sql`ALTER TABLE owners ADD COLUMN IF NOT EXISTS contact TEXT`;
    // Add email column to pilots if it doesn't exist
    await sql`ALTER TABLE pilots ADD COLUMN IF NOT EXISTS email TEXT`;
    // Add contact column to pilots
    await sql`ALTER TABLE pilots ADD COLUMN IF NOT EXISTS contact TEXT`;
    // Add owner_id to pilots
    await sql`ALTER TABLE pilots ADD COLUMN IF NOT EXISTS owner_id TEXT`;
    
    console.log('Schema updated successfully.');
  } catch (err) {
    console.error('Schema update failed:', err.message);
  } finally {
    process.exit();
  }
}

updateSchema();
