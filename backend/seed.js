const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL);

const initialData = {
  owners: [
    { id: 'O1', name: 'Alpha Logistics', fleet_size: 45, active_vehicles: 42, revenue: 1450000, score: 9.6, status: 'active', email: 'alpha@logistics.com' },
    { id: 'O2', name: 'Giga Mobility Corp', fleet_size: 32, active_vehicles: 28, revenue: 1080000, score: 8.9, status: 'active', email: 'giga@mobility.com' },
    { id: 'O3', name: 'Matrix Transit Systems', fleet_size: 24, active_vehicles: 20, revenue: 840000, score: 9.2, status: 'active', email: 'matrix@transit.com' },
    { id: 'O4', name: 'Cyber Delivery Node', fleet_size: 18, active_vehicles: 15, revenue: 520000, score: 7.8, status: 'suspended', email: 'cyber@delivery.com' },
    { id: 'O5', name: 'Hyperion Fleet Alliance', fleet_size: 52, active_vehicles: 49, revenue: 1980000, score: 9.8, status: 'active', email: 'hyperion@fleet.com' }
  ],
  pilots: [
    { id: 'P1', name: 'Suresh Singh', trips: 145, hours: 240, safety_score: 8.9, status: 'active', availability: 'on-duty', rating: 4.8 },
    { id: 'P2', name: 'Ramesh Sharma', trips: 120, hours: 198, safety_score: 9.2, status: 'active', availability: 'off-duty', rating: 4.9 },
    { id: 'P3', name: 'Karan Malhotra', trips: 95, hours: 164, safety_score: 7.4, status: 'active', availability: 'on-duty', rating: 4.2 },
    { id: 'P4', name: 'Vikram Aditya', trips: 210, hours: 380, safety_score: 9.5, status: 'active', availability: 'on-duty', rating: 4.7 },
    { id: 'P5', name: 'Rahul Varma', trips: 40, hours: 75, safety_score: 5.8, status: 'suspended', availability: 'off-duty', rating: 3.5 }
  ],
  devices: [
    { id: 'DEV-8890', owner_id: 'O5', battery: 92, network: 'Excellent', gps: 'Connected', status: 'active', health: 98, firmware: 'v4.2.1-stable' },
    { id: 'DEV-4421', owner_id: 'O1', battery: 84, network: 'Good', gps: 'Connected', status: 'active', health: 95, firmware: 'v4.2.1-stable' },
    { id: 'DEV-1092', owner_id: 'O2', battery: 12, network: 'Poor', gps: 'Intermittent', status: 'warning', health: 65, firmware: 'v4.1.9-outdated' },
    { id: 'DEV-7763', owner_id: 'O4', battery: 0, network: 'Offline', gps: 'Disconnected', status: 'offline', health: 0, firmware: 'v3.8.2-legacy' }
  ],
  alerts: [
    { type: 'SOS Alert', vehicle: 'MH-12-PQ-8890', description: 'Driver triggered SOS switch manually.', severity: 'CRITICAL' },
    { type: 'Battery Failure', vehicle: 'KA-03-MN-4421', description: 'GPS unit battery critically low (< 15%).', severity: 'WARNING' },
    { type: 'Unauthorized Access', vehicle: 'DL-01-AB-1092', description: 'OBD port disconnect event caught.', severity: 'CRITICAL' }
  ]
};

async function seed() {
  console.log('Starting Supabase seeding...');
  
  try {
    // 1. Clear existing data (optional, but good for a fresh start)
    console.log('Cleaning existing data...');
    await sql`TRUNCATE TABLE alerts, trips, devices, pilots, owners RESTART IDENTITY CASCADE`;

    // 2. Insert Owners
    console.log('Inserting owners...');
    await sql`INSERT INTO owners ${sql(initialData.owners)}`;

    // 3. Insert Pilots
    console.log('Inserting pilots...');
    await sql`INSERT INTO pilots ${sql(initialData.pilots)}`;

    // 4. Insert Devices
    console.log('Inserting devices...');
    await sql`INSERT INTO devices ${sql(initialData.devices)}`;

    // 5. Insert Alerts
    console.log('Inserting alerts...');
    await sql`INSERT INTO alerts ${sql(initialData.alerts)}`;

    console.log('Database seeded successfully in Supabase!');
  } catch (err) {
    console.error('Seeding failed:', err.message);
  } finally {
    process.exit();
  }
}

seed();
