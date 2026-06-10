const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL);

async function createContactTable() {
  console.log('Creating contact_messages table...');
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Table created successfully.');
  } catch (err) {
    console.error('Table creation failed:', err.message);
  } finally {
    process.exit();
  }
}

createContactTable();
