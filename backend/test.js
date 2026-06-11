const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL);

async function check() {
    const owners = await sql`SELECT id, email, name FROM owners`;
    console.log('All Owners:', owners);
    process.exit(0);
}
check();
