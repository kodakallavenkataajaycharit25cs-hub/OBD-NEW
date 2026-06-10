const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL);

async function alterDB() {
  try {
    console.log("Connecting to Database...");
    await sql`ALTER TABLE pilots ADD COLUMN IF NOT EXISTS vehicle_number VARCHAR(50);`;
    await sql`ALTER TABLE pilots ADD COLUMN IF NOT EXISTS vehicle_model VARCHAR(100);`;
    console.log("Success: Added vehicle_number and vehicle_model to pilots table.");
  } catch (error) {
    console.error("Error altering DB:", error.message);
  } finally {
    process.exit(0);
  }
}

alterDB();
