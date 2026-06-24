const postgres = require('postgres');
require('dotenv').config({ path: 'backend/.env' });

const sql = postgres(process.env.DATABASE_URL);

async function checkSchema() {
    try {
        const columns = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'trips'
        `;
        console.log('Trips table columns:');
        console.table(columns);
    } catch (err) {
        console.error('Error checking schema:', err.message);
    } finally {
        process.exit();
    }
}

checkSchema();
