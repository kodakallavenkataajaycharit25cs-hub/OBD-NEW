const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL);

async function checkAuth() {
  try {
    const result = await sql`SELECT count(*) FROM auth.users`;
    console.log('User count:', result[0].count);
  } catch (err) {
    console.error('Error accessing auth.users:', err.message);
  } finally {
    process.exit();
  }
}

checkAuth();
