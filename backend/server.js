const express = require('express');
const net = require('net');
const cors = require('cors');
const postgres = require('postgres');
require('dotenv').config();

const app = express();

// Database Connection (The "Normal Way")
const sql = postgres(process.env.DATABASE_URL);

app.use(cors());
app.use(express.json());

const EMULATOR_HOST = process.env.EMULATOR_HOST || '127.0.0.1';
const EMULATOR_PORT = process.env.EMULATOR_PORT || 35000;
const PORT = process.env.PORT || 5000;

// Background task to update revenue (Every 15 seconds)
setInterval(async () => {
    try {
        const owners = await sql`SELECT id, revenue FROM owners`;
        if (owners.length === 0) return;

        for (const owner of owners) {
            const change = Math.floor(Math.random() * 8000) - 3000;
            const newRevenue = Math.max(0, Number(owner.revenue) + change);
            
            await sql`UPDATE owners SET revenue = ${newRevenue} WHERE id = ${owner.id}`;
        }
        console.log(`[${new Date().toLocaleTimeString()}] Revenue cycle updated in Supabase.`);
    } catch (err) {
        console.error('Revenue update failed:', err.message);
    }
}, 15000);

// Helper to send command to ELM327
function sendOBDCommand(command) {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        let response = '';

        client.connect(EMULATOR_PORT, EMULATOR_HOST, () => {
            client.write(command + '\r');
        });

        client.on('data', (data) => {
            response += data.toString();
            if (response.includes('>')) {
                client.destroy();
                resolve(response.replace(/>/g, '').trim());
            }
        });

        client.on('error', (err) => {
            client.destroy();
            reject(err);
        });

        setTimeout(() => {
            client.destroy();
            reject(new Error('Timeout'));
        }, 2000);
    });
}

// Telemetry Routes
app.get('/api/rpm', async (req, res) => {
    try {
        const raw = await sendOBDCommand('010C');
        console.log(`[OBD] RPM Raw: ${raw}`);
        const parts = raw.split(/\s+/).filter(p => p.length > 0);
        const startIndex = parts.findIndex((p, i) => p === '41' && parts[i+1] === '0C');
        
        if (startIndex !== -1 && parts.length >= startIndex + 4) {
            const a = parseInt(parts[startIndex + 2], 16);
            const b = parseInt(parts[startIndex + 3], 16);
            const rpm = Math.round(((a * 256) + b) / 4);
            return res.json({ rpm });
        }
        res.json({ rpm: 850 + Math.floor(Math.random() * 50) });
    } catch (err) {
        res.json({ rpm: 800 });
    }
});

app.get('/api/speed', async (req, res) => {
    try {
        const raw = await sendOBDCommand('010D');
        console.log(`[OBD] Speed Raw: ${raw}`);
        const parts = raw.split(/\s+/).filter(p => p.length > 0);
        const startIndex = parts.findIndex((p, i) => p === '41' && parts[i+1] === '0D');

        if (startIndex !== -1 && parts.length >= startIndex + 3) {
            const speed = parseInt(parts[startIndex + 2], 16);
            return res.json({ speed });
        }
        res.json({ speed: 45 + Math.floor(Math.random() * 5) });
    } catch (err) {
        res.json({ speed: 0 });
    }
});

app.get('/api/fuel', async (req, res) => {
    try {
        const raw = await sendOBDCommand('012F');
        console.log(`[OBD] Fuel Raw: ${raw}`);
        const parts = raw.split(/\s+/).filter(p => p.length > 0);
        const startIndex = parts.findIndex((p, i) => p === '41' && parts[i+1] === '2F');

        if (startIndex !== -1 && parts.length >= startIndex + 3) {
            const fuel = Math.round((parseInt(parts[startIndex + 2], 16) * 100) / 255);
            return res.json({ fuel_level: fuel });
        }
        res.json({ fuel_level: 65 }); 
    } catch (err) {
        res.json({ fuel_level: 65 });
    }
});

app.get('/api/diagnostics', async (req, res) => {
    try {
        res.json({
            diagnostics: {
                dtc: [],
                mil_status: 'OFF',
                engine_load: '22%',
                coolant_temp: '88°C'
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/engine_temp', async (req, res) => {
    try {
        const raw = await sendOBDCommand('0105');
        console.log(`[OBD] Engine Temp Raw: ${raw}`);
        const parts = raw.split(/\s+/).filter(p => p.length > 0);
        const startIndex = parts.findIndex((p, i) => p === '41' && parts[i+1] === '05');

        if (startIndex !== -1 && parts.length >= startIndex + 3) {
            const temp = parseInt(parts[startIndex + 2], 16) - 40;
            return res.json({ temp });
        }
        res.json({ temp: 85 + Math.floor(Math.random() * 10) });
    } catch (err) {
        res.json({ temp: 90 });
    }
});

app.get('/api/o2_level', async (req, res) => {
    try {
        const raw = await sendOBDCommand('0114');
        console.log(`[OBD] O2 Level Raw: ${raw}`);
        const parts = raw.split(/\s+/).filter(p => p.length > 0);
        const startIndex = parts.findIndex((p, i) => p === '41' && parts[i+1] === '14');

        if (startIndex !== -1 && parts.length >= startIndex + 3) {
            const voltage = parseInt(parts[startIndex + 2], 16) / 200;
            return res.json({ o2_voltage: voltage.toFixed(2) });
        }
        res.json({ o2_voltage: (0.1 + Math.random() * 0.8).toFixed(2) }); 
    } catch (err) {
        res.json({ o2_voltage: "0.45" });
    }
});

// Database Routes (The "Normal Way" - Raw SQL)
app.get('/api/trips', async (req, res) => {
    try {
        const rows = await sql`SELECT * FROM trips ORDER BY start_time DESC`;
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/owners', async (req, res) => {
    try {
        const rows = await sql`SELECT * FROM owners ORDER BY revenue DESC`;
        // Map snake_case to camelCase for the frontend
        const formatted = rows.map(r => ({
            id: r.id,
            name: r.name,
            email: r.email,
            contact: r.contact,
            fleetSize: r.fleet_size,
            activeVehicles: r.active_vehicles,
            revenue: Number(r.revenue),
            score: Number(r.score),
            status: r.status
        }));
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/pilots', async (req, res) => {
    try {
        const rows = await sql`SELECT * FROM pilots`;
        const formatted = rows.map(r => ({
            id: r.id,
            name: r.name,
            email: r.email,
            contact: r.contact,
            owner_id: r.owner_id,
            trips: r.trips,
            hours: r.hours,
            safetyScore: Number(r.safety_score),
            status: r.status,
            availability: r.availability,
            rating: Number(r.rating)
        }));
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/devices', async (req, res) => {
    try {
        const rows = await sql`
            SELECT d.*, o.name as owner_name 
            FROM devices d
            LEFT JOIN owners o ON d.owner_id = o.id
        `;
        const formatted = rows.map(r => ({
            id: r.id,
            owner: r.owner_name || 'Unassigned',
            battery: r.battery,
            network: r.network,
            gps: r.gps,
            syncTime: r.sync_time,
            status: r.status,
            health: r.health,
            firmware: r.firmware
        }));
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/alerts', async (req, res) => {
    try {
        const rows = await sql`SELECT * FROM alerts ORDER BY created_at DESC`;
        const formatted = rows.map(r => ({
            id: r.id,
            type: r.type,
            vehicle: r.vehicle,
            description: r.description,
            severity: r.severity,
            time: r.created_at // Frontend expects 'time'
        }));
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/alerts', async (req, res) => {
    try {
        const { type, vehicle, description, severity } = req.body;
        await sql`
            INSERT INTO alerts (type, vehicle, description, severity)
            VALUES (${type}, ${vehicle}, ${description}, ${severity})
        `;
        res.json({ success: true, message: 'Alert created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CRUD for Owners (Clients)
app.post('/api/owners', async (req, res) => {
    try {
        const { id, name, email, contact, fleetSize, activeVehicles, revenue, score, status } = req.body;
        await sql`
            INSERT INTO owners (id, name, email, contact, fleet_size, active_vehicles, revenue, score, status)
            VALUES (${id}, ${name}, ${email || ''}, ${contact || ''}, ${fleetSize || 0}, ${activeVehicles || 0}, ${revenue || 0}, ${score || 10.0}, ${status || 'active'})
        `;
        res.json({ success: true, message: 'Owner created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/owners/:id', async (req, res) => {
    try {
        const { name, email, contact, fleetSize, activeVehicles, status } = req.body;
        await sql`
            UPDATE owners 
            SET name = COALESCE(${name}, name), 
                email = COALESCE(${email}, email), 
                contact = COALESCE(${contact}, contact),
                fleet_size = COALESCE(${fleetSize}, fleet_size), 
                active_vehicles = COALESCE(${activeVehicles}, active_vehicles), 
                status = COALESCE(${status}, status)
            WHERE id = ${req.params.id}
        `;
        res.json({ success: true, message: 'Owner updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/owners/:id', async (req, res) => {
    try {
        // Cascade manually if needed or just let DB handle if FK cascading is set. Let's explicitly delete related pilots first for safety.
        await sql`DELETE FROM pilots WHERE owner_id = ${req.params.id}`;
        await sql`DELETE FROM owners WHERE id = ${req.params.id}`;
        res.json({ success: true, message: 'Owner deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CRUD for Pilots (Drivers)
app.post('/api/pilots', async (req, res) => {
    try {
        const { id, name, email, contact, owner_id, trips, hours, safetyScore, status, availability, rating } = req.body;
        await sql`
            INSERT INTO pilots (id, name, email, contact, owner_id, trips, hours, safety_score, status, availability, rating)
            VALUES (${id}, ${name}, ${email || ''}, ${contact || ''}, ${owner_id || null}, ${trips || 0}, ${hours || 0}, ${safetyScore || 10.0}, ${status || 'active'}, ${availability || 'off-duty'}, ${rating || 5.0})
        `;
        res.json({ success: true, message: 'Pilot created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/pilots/:id', async (req, res) => {
    try {
        const { name, email, contact, owner_id, status, availability } = req.body;
        await sql`
            UPDATE pilots 
            SET name = COALESCE(${name}, name), 
                email = COALESCE(${email}, email), 
                contact = COALESCE(${contact}, contact),
                owner_id = COALESCE(${owner_id}, owner_id), 
                status = COALESCE(${status}, status),
                availability = COALESCE(${availability}, availability)
            WHERE id = ${req.params.id}
        `;
        res.json({ success: true, message: 'Pilot updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/pilots/:id', async (req, res) => {
    try {
        await sql`DELETE FROM pilots WHERE id = ${req.params.id}`;
        res.json({ success: true, message: 'Pilot deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Trip Logging Route
app.post('/api/trips', async (req, res) => {
    try {
        const { pilot_id, device_id, start_time, end_time, distance, fuel_used, status } = req.body;
        
        await sql`
            INSERT INTO trips (pilot_id, device_id, start_time, end_time, distance, fuel_used, status)
            VALUES (
                ${pilot_id}, 
                ${device_id || null}, 
                ${start_time ? new Date(start_time) : new Date()}, 
                ${end_time ? new Date(end_time) : null}, 
                ${distance || 0}, 
                ${fuel_used || 0}, 
                ${status || 'completed'}
            )
        `;
        res.json({ success: true, message: 'Trip recorded successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`OBD Bridge running on http://localhost:${PORT}`);
    console.log(`Connected to Supabase via Postgres.js (No Prisma).`);
});
