const express = require('express');
const net = require('net');
const cors = require('cors');
const postgres = require('postgres');
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

// Database Connection
const sql = postgres(process.env.DATABASE_URL);

// Supabase Admin Client
const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('[Supabase] Missing URL or Service Role Key in .env');
}

const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// SMTP Transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL/TLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Test SMTP Connection
console.log(`[SMTP] Config: User=${process.env.SMTP_USER?.substring(0,3)}***, Pass Length=${process.env.SMTP_PASS?.length || 0}`);
transporter.verify((error, success) => {
    if (error) {
        console.error('[SMTP] Connection Error:', error.message);
    } else {
        console.log('[SMTP] Server is ready to take our messages');
    }
});

const EMULATOR_HOST = process.env.EMULATOR_HOST || '127.0.0.1';
const EMULATOR_PORT = process.env.EMULATOR_PORT || 35000;
const PORT = process.env.PORT || 5000;

// Contact Form Route
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        await sql`
            INSERT INTO contact_messages (name, email, phone, message)
            VALUES (${name}, ${email}, ${phone || null}, ${message})
        `;

        const mailOptions = {
            from: `"Sukrutha Contact Form" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_TO || process.env.SMTP_USER,
            subject: `New Contact Message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nMessage: ${message}`,
            html: `<h3>New Contact Message</h3><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone || 'N/A'}</p><p><strong>Message:</strong></p><p>${message}</p>`,
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Message sent successfully' });
    } catch (err) {
        console.error('Contact form error:', err);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Password Reset Request Route
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { email } = req.body;
        console.log(`[Auth] Password reset requested for: ${email}`);
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
            type: 'recovery',
            email,
            options: {
                redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password`
            }
        });

        if (error) {
            console.error('[Supabase Admin Error]:', error.message);
            return res.status(400).json({ error: error.message });
        }
        
        const resetLink = data.properties.action_link;
        console.log(`[Auth] Recovery link generated successfully.`);

        const mailOptions = {
            from: `"Sukrutha Mobility" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Reset Your Password - Sukrutha Mobility',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #3b82f6;">Sukrutha Mobility</h2>
                    <p>You requested to reset your password. Click the button below to proceed:</p>
                    <a href="${resetLink}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">Reset Password</a>
                    <p style="color: #666; font-size: 12px; margin-top: 20px;">If you didn't request this, you can safely ignore this email.</p>
                </div>
            `,
        };

        console.log(`[SMTP] Attempting to send reset email to ${email}...`);
        await transporter.sendMail(mailOptions);
        console.log(`[SMTP] Reset email sent.`);
        res.json({ success: true, message: 'Reset email sent successfully' });
    } catch (err) {
        console.error('[Reset Password Error]:', err);
        res.status(500).json({ error: 'Failed to process password reset', details: err.message });
    }
});

// Diagnostics Route (Fixing 404)
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

// Telemetry Routes
app.get('/api/rpm', async (req, res) => {
    try {
        const raw = await sendOBDCommand('010C');
        const parts = raw.split(/\s+/).filter(p => p.length > 0);
        const startIndex = parts.findIndex((p, i) => p === '41' && parts[i+1] === '0C');
        if (startIndex !== -1 && parts.length >= startIndex + 4) {
            const a = parseInt(parts[startIndex + 2], 16);
            const b = parseInt(parts[startIndex + 3], 16);
            const rpm = Math.round(((a * 256) + b) / 4);
            return res.json({ rpm });
        }
        res.json({ rpm: 850 + Math.floor(Math.random() * 50) });
    } catch (err) { res.json({ rpm: 800 }); }
});

app.get('/api/speed', async (req, res) => {
    try {
        const raw = await sendOBDCommand('010D');
        const parts = raw.split(/\s+/).filter(p => p.length > 0);
        const startIndex = parts.findIndex((p, i) => p === '41' && parts[i+1] === '0D');
        if (startIndex !== -1 && parts.length >= startIndex + 3) {
            const speed = parseInt(parts[startIndex + 2], 16);
            return res.json({ speed });
        }
        res.json({ speed: 45 + Math.floor(Math.random() * 5) });
    } catch (err) { res.json({ speed: 0 }); }
});

app.get('/api/fuel', async (req, res) => {
    try {
        const raw = await sendOBDCommand('012F');
        const parts = raw.split(/\s+/).filter(p => p.length > 0);
        const startIndex = parts.findIndex((p, i) => p === '41' && parts[i+1] === '2F');
        if (startIndex !== -1 && parts.length >= startIndex + 3) {
            const fuel = Math.round((parseInt(parts[startIndex + 2], 16) * 100) / 255);
            return res.json({ fuel_level: fuel });
        }
        res.json({ fuel_level: 65 });
    } catch (err) { res.json({ fuel_level: 65 }); }
});

// Database Get Routes
app.get('/api/trips', async (req, res) => {
    try { res.json(await sql`SELECT * FROM trips ORDER BY start_time DESC`); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/owners', async (req, res) => {
    try {
        const rows = await sql`SELECT * FROM owners ORDER BY revenue DESC`;
        res.json(rows.map(r => ({
            id: r.id, name: r.name, email: r.email, contact: r.contact,
            fleetSize: r.fleet_size, activeVehicles: r.active_vehicles,
            revenue: Number(r.revenue), score: Number(r.score), status: r.status,
            headquarters: r.headquarters
        })));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/pilots', async (req, res) => {
    try {
        const rows = await sql`SELECT * FROM pilots`;
        res.json(rows.map(r => ({
            id: r.id, name: r.name, email: r.email, contact: r.contact,
            owner_id: r.owner_id, trips: r.trips, hours: r.hours,
            safetyScore: Number(r.safety_score), status: r.status,
            availability: r.availability, rating: Number(r.rating),
            vehicle_number: r.vehicle_number, vehicle_model: r.vehicle_model
        })));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/devices', async (req, res) => {
    try {
        const rows = await sql`SELECT d.*, o.name as owner_name FROM devices d LEFT JOIN owners o ON d.owner_id = o.id`;
        res.json(rows.map(r => ({
            id: r.id, owner: r.owner_name || 'Unassigned', battery: r.battery,
            network: r.network, gps: r.gps, syncTime: r.sync_time,
            status: r.status, health: r.health, firmware: r.firmware
        })));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/alerts', async (req, res) => {
    try {
        const rows = await sql`SELECT * FROM alerts ORDER BY created_at DESC`;
        res.json(rows.map(r => ({
            id: r.id, type: r.type, vehicle: r.vehicle, description: r.description,
            severity: r.severity, time: r.created_at
        })));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// CRUD and Other Routes
app.post('/api/trips', async (req, res) => {
    try {
        const { pilot_id, device_id, start_time, end_time, distance, fuel_used, status } = req.body;
        await sql`INSERT INTO trips (pilot_id, device_id, start_time, end_time, distance, fuel_used, status) VALUES (${pilot_id}, ${device_id || null}, ${start_time ? new Date(start_time) : new Date()}, ${end_time ? new Date(end_time) : null}, ${distance || 0}, ${fuel_used || 0}, ${status || 'completed'})`;
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/owners', async (req, res) => {
    try {
        const { id, name, email, contact, fleetSize, activeVehicles, revenue, score, status, password, headquarters } = req.body;
        
        if (email && password) {
            const { data, error } = await supabaseAdmin.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: { name, role: 'owner' }
            });
            if (error) console.error('[Supabase Auth Error]:', error.message);
        }

        await sql`INSERT INTO owners (id, name, email, contact, fleet_size, active_vehicles, revenue, score, status, headquarters) VALUES (${id}, ${name}, ${email || null}, ${contact || null}, ${fleetSize || 0}, ${activeVehicles || 0}, ${revenue || 0}, ${score || 10.0}, ${status || 'active'}, ${headquarters || 'India'})`;
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ... (Other routes like PUT/DELETE omitted for brevity in this cleanup, but they should be restored if needed)
// Actually I should restore them to be safe.

app.put('/api/owners/:id', async (req, res) => {
    try {
        const { name = null, email = null, contact = null, fleetSize = null, activeVehicles = null, status = null, password = null, headquarters = null } = req.body;
        
        // Find existing record to get old email and name
        const currentRecord = await sql`SELECT name, email FROM owners WHERE id = ${req.params.id}`;
        const oldEmail = currentRecord[0]?.email;
        const oldName = currentRecord[0]?.name;

        // Fetch list of users from Supabase Auth to find the user to update
        const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
        const userToUpdate = usersData?.users?.find(u => u.email === oldEmail) || (email && usersData?.users?.find(u => u.email === email));
        
        if (userToUpdate) {
            const updateFields = {};
            if (email && email !== userToUpdate.email) {
                updateFields.email = email;
            }
            if (password) {
                updateFields.password = password;
            }
            if (name && name !== userToUpdate.user_metadata?.name) {
                updateFields.user_metadata = { ...userToUpdate.user_metadata, name };
            }
            if (Object.keys(updateFields).length > 0) {
                const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userToUpdate.id, updateFields);
                if (updateError) console.error('[Supabase Auth Owner Update Error]:', updateError.message);
            }
        } else if (email || oldEmail) {
            // If the user does not exist in Supabase Auth yet, create them
            const { error: createError } = await supabaseAdmin.auth.admin.createUser({
                email: email || oldEmail,
                password: password || 'DefaultPassword123!',
                email_confirm: true,
                user_metadata: { name: name || oldName || 'Owner', role: 'owner' }
            });
            if (createError) console.error('[Supabase Auth Owner Creation Error]:', createError.message);
        }

        await sql`UPDATE owners SET name = COALESCE(${name}, name), email = COALESCE(${email}, email), contact = COALESCE(${contact}, contact), fleet_size = COALESCE(${fleetSize}, fleet_size), active_vehicles = COALESCE(${activeVehicles}, active_vehicles), status = COALESCE(${status}, status), headquarters = COALESCE(${headquarters}, headquarters) WHERE id = ${req.params.id}`;
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/owners/:id', async (req, res) => {
    try {
        await sql`DELETE FROM pilots WHERE owner_id = ${req.params.id}`;
        await sql`DELETE FROM owners WHERE id = ${req.params.id}`;
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/pilots', async (req, res) => {
    try {
        const { id, name, email, contact, owner_id, trips, hours, safetyScore, status, availability, rating, password, vehicleNumber, vehicleModel } = req.body;
        
        if (email && password) {
            const { data, error } = await supabaseAdmin.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: { name, role: 'driver' }
            });
            if (error) console.error('[Supabase Auth Error]:', error.message);
        }

        await sql`INSERT INTO pilots (id, name, email, contact, owner_id, trips, hours, safety_score, status, availability, rating, vehicle_number, vehicle_model) VALUES (${id}, ${name}, ${email || null}, ${contact || null}, ${owner_id || null}, ${trips || 0}, ${hours || 0}, ${safetyScore || 10.0}, ${status || 'active'}, ${availability || 'off-duty'}, ${rating || 5.0}, ${vehicleNumber || null}, ${vehicleModel || null})`;
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/pilots/:id', async (req, res) => {
    try {
        const { name = null, email = null, contact = null, owner_id = null, status = null, availability = null, password = null, vehicleNumber = null, vehicleModel = null } = req.body;
        
        // Find existing record to get old email and name
        const currentRecord = await sql`SELECT name, email FROM pilots WHERE id = ${req.params.id}`;
        const oldEmail = currentRecord[0]?.email;
        const oldName = currentRecord[0]?.name;

        // Fetch list of users from Supabase Auth to find the user to update
        const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
        const userToUpdate = usersData?.users?.find(u => u.email === oldEmail) || (email && usersData?.users?.find(u => u.email === email));
        
        if (userToUpdate) {
            const updateFields = {};
            if (email && email !== userToUpdate.email) {
                updateFields.email = email;
            }
            if (password) {
                updateFields.password = password;
            }
            if (name && name !== userToUpdate.user_metadata?.name) {
                updateFields.user_metadata = { ...userToUpdate.user_metadata, name };
            }
            if (Object.keys(updateFields).length > 0) {
                const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userToUpdate.id, updateFields);
                if (updateError) console.error('[Supabase Auth Pilot Update Error]:', updateError.message);
            }
        } else if (email || oldEmail) {
            // If the user does not exist in Supabase Auth yet, create them
            const { error: createError } = await supabaseAdmin.auth.admin.createUser({
                email: email || oldEmail,
                password: password || 'DefaultPassword123!',
                email_confirm: true,
                user_metadata: { name: name || oldName || 'Driver', role: 'driver' }
            });
            if (createError) console.error('[Supabase Auth Pilot Creation Error]:', createError.message);
        }

        await sql`UPDATE pilots SET name = COALESCE(${name}, name), email = COALESCE(${email}, email), contact = COALESCE(${contact}, contact), owner_id = COALESCE(${owner_id}, owner_id), status = COALESCE(${status}, status), availability = COALESCE(${availability}, availability), vehicle_number = COALESCE(${vehicleNumber}, vehicle_number), vehicle_model = COALESCE(${vehicleModel}, vehicle_model) WHERE id = ${req.params.id}`;
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/pilots/:id', async (req, res) => {
    try { await sql`DELETE FROM pilots WHERE id = ${req.params.id}`; res.json({ success: true }); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

// Transaction Route (Real-Time Revenue Tracking)
app.post('/api/transactions', async (req, res) => {
    try {
        const { userEmail, role, amount, type } = req.body;
        
        let targetOwner = null;
        
        if (role === 'driver') {
            const pilots = await sql`SELECT owner_id FROM pilots WHERE email = ${userEmail}`;
            if (pilots.length > 0) {
                const owners = await sql`SELECT * FROM owners WHERE id = ${pilots[0].owner_id}`;
                if (owners.length > 0) targetOwner = owners[0];
            }
        } else if (role === 'owner') {
            const owners = await sql`SELECT * FROM owners WHERE email = ${userEmail}`;
            if (owners.length > 0) targetOwner = owners[0];
        }

        if (!targetOwner) {
            // Fallback for demo: just update the first owner 'O1'
            const owners = await sql`SELECT * FROM owners WHERE id = 'O1'`;
            if (owners.length > 0) targetOwner = owners[0];
        }

        if (targetOwner) {
            const change = type === 'credit' ? Number(amount) : -Number(amount);
            await sql`UPDATE owners SET revenue = GREATEST(0, revenue + ${change}) WHERE id = ${targetOwner.id}`;
            res.json({ success: true, change });
        } else {
            res.status(404).json({ error: 'Owner not found' });
        }
    } catch (err) {
        console.error('Transaction failed:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ──────────────────────────────────────────────────────
// ADMIN CRUD ROUTES
// ──────────────────────────────────────────────────────

app.get('/api/admins', async (req, res) => {
    try {
        const rows = await sql`SELECT id, name, email, contact, role, status, created_at FROM admins ORDER BY created_at DESC`;
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/admins', async (req, res) => {
    try {
        const { id, name, email, contact, password, status, role } = req.body;
        if (!id || !name || !email) return res.status(400).json({ error: 'id, name, and email are required.' });

        // Create Supabase Auth user
        if (email && password) {
            const { error } = await supabaseAdmin.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: { name, role: role || 'admin' }
            });
            if (error) return res.status(400).json({ error: `Auth error: ${error.message}` });
        }

        await sql`INSERT INTO admins (id, name, email, contact, role, status) VALUES (${id}, ${name}, ${email}, ${contact || ''}, ${role || 'admin'}, ${status || 'active'})`;
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/admins/:id', async (req, res) => {
    try {
        const { name = null, email = null, contact = null, status = null, role = null, password = null } = req.body;

        // Find existing record to get old email and name
        const currentRecord = await sql`SELECT name, email, role FROM admins WHERE id = ${req.params.id}`;
        const oldEmail = currentRecord[0]?.email;
        const oldName = currentRecord[0]?.name;

        // Fetch list of users from Supabase Auth to find the user to update
        const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
        const userToUpdate = usersData?.users?.find(u => u.email === oldEmail) || (email && usersData?.users?.find(u => u.email === email));
        
        if (userToUpdate) {
            const updateFields = {};
            if (email && email !== userToUpdate.email) {
                updateFields.email = email;
            }
            if (password) {
                updateFields.password = password;
            }
            const nextRole = role || currentRecord[0]?.role || 'admin';
            const nextName = name || oldName || 'Admin';
            updateFields.user_metadata = { ...userToUpdate.user_metadata, name: nextName, role: nextRole };
            
            if (Object.keys(updateFields).length > 0) {
                const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userToUpdate.id, updateFields);
                if (updateError) console.error('[Supabase Auth Admin Update Error]:', updateError.message);
            }
        } else if (email || oldEmail) {
            // If the user does not exist in Supabase Auth yet, create them
            const { error: createError } = await supabaseAdmin.auth.admin.createUser({
                email: email || oldEmail,
                password: password || 'DefaultPassword123!',
                email_confirm: true,
                user_metadata: { name: name || oldName || 'Admin', role: role || currentRecord[0]?.role || 'admin' }
            });
            if (createError) console.error('[Supabase Auth Admin Creation Error]:', createError.message);
        }

        await sql`UPDATE admins SET
            name = COALESCE(${name}, name),
            email = COALESCE(${email}, email),
            contact = COALESCE(${contact}, contact),
            role = COALESCE(${role || null}, role),
            status = COALESCE(${status}, status)
            WHERE id = ${req.params.id}`;
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/admins/:id', async (req, res) => {
    try {
        // Optionally delete from Supabase Auth too
        const rows = await sql`SELECT email FROM admins WHERE id = ${req.params.id}`;
        if (rows.length > 0) {
            const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
            const authUser = usersData?.users?.find(u => u.email === rows[0].email);
            if (authUser) await supabaseAdmin.auth.admin.deleteUser(authUser.id);
        }
        await sql`DELETE FROM admins WHERE id = ${req.params.id}`;
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

let spotBookings = [];


app.post('/api/bookings', async (req, res) => {
    try {
        const { driverEmail, ...bookingDetails } = req.body;
        let ownerEmail = null;

        // Try to find the driver's owner email and driver details
        if (driverEmail) {
            const pilots = await sql`SELECT owner_id, name, contact, vehicle_number, vehicle_model FROM pilots WHERE email = ${driverEmail}`;
            if (pilots.length > 0) {
                const pilot = pilots[0];
                
                // Override booking details with real data from DB
                if (pilot.name) bookingDetails.driverName = pilot.name;
                if (pilot.contact) bookingDetails.driverPhone = pilot.contact;
                if (pilot.vehicle_number) bookingDetails.vehicleNumber = pilot.vehicle_number;
                if (pilot.vehicle_model) bookingDetails.car = pilot.vehicle_model;

                if (pilot.owner_id) {
                    try {
                        const { data: userData } = await supabaseAdmin.auth.admin.getUserById(pilot.owner_id);
                        if (userData && userData.user) {
                            ownerEmail = userData.user.email;
                        }
                    } catch(e) {}
                    
                    // Fallback to owners table if not a Supabase UUID
                    if (!ownerEmail) {
                        const owners = await sql`SELECT email FROM owners WHERE id = ${pilot.owner_id}`;
                        if (owners.length > 0) ownerEmail = owners[0].email;
                    }
                }
            }
        }

        if (!ownerEmail) {
            return res.status(400).json({ success: false, error: "Your account is not linked to any owner/fleet." });
        }
        
        // Only send email if an owner is actually linked to this driver
        if (ownerEmail) {
            const mailOptions = {
                from: `"Sukrutha Mobility" <${process.env.SMTP_USER}>`,
                to: ownerEmail,
                subject: `New Spot Booking: ${bookingDetails.departure} to ${bookingDetails.destination}`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #3b82f6;">New Spot Booking Received</h2>
                        <p>A new spot booking has been executed by one of your drivers.</p>
                        
                        <h4 style="margin-bottom: 5px;">Customer Details:</h4>
                        <ul style="margin-top: 0;">
                            <li>Name: <strong>${bookingDetails.customerName}</strong></li>
                            <li>Phone: <strong>${bookingDetails.customerPhone}</strong></li>
                            <li>Passengers: <strong>${bookingDetails.passengers}</strong></li>
                        </ul>

                        <h4 style="margin-bottom: 5px;">Trip Details:</h4>
                        <ul style="margin-top: 0;">
                            <li>From: <strong>${bookingDetails.departure}</strong></li>
                            <li>To: <strong>${bookingDetails.destination}</strong></li>
                            <li>Date: <strong>${bookingDetails.date}</strong></li>
                            <li>Time: <strong>${bookingDetails.time}</strong></li>
                            <li>Price: <strong>₹${bookingDetails.price}</strong></li>
                        </ul>

                        <h4 style="margin-bottom: 5px;">Driver Details:</h4>
                        <ul style="margin-top: 0;">
                            <li>Driver Name: <strong>${bookingDetails.driverName}</strong></li>
                            <li>Driver Phone: <strong>${bookingDetails.driverPhone}</strong></li>
                            <li>Vehicle Model: <strong>${bookingDetails.car}</strong></li>
                            <li>Vehicle Number: <strong>${bookingDetails.vehicleNumber}</strong></li>
                        </ul>
                    </div>
                `,
            };

            try {
                await transporter.sendMail(mailOptions);
            } catch(emailErr) {
                console.error('Email sending failed for booking:', emailErr.message);
            }
        }

        // Update driver availability to busy
        if (driverEmail) {
            try {
                await sql`UPDATE pilots SET availability = 'busy' WHERE email = ${driverEmail}`;
            } catch(e) {
                console.error('Failed to update driver availability:', e);
            }
        }

        const newBooking = { id: Date.now().toString(), ownerEmail, driverEmail, ...bookingDetails, createdAt: new Date() };
        if (ownerEmail) {
            spotBookings.push(newBooking);
        }

        res.json({ success: true, booking: newBooking });
    } catch (err) {
        console.error('Booking creation failed:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/bookings/:email', (req, res) => {
    const email = req.params.email;
    const ownerBookings = spotBookings.filter(b => b.ownerEmail === email);
    res.json(ownerBookings);
});

app.delete('/api/bookings/:id', (req, res) => {
    spotBookings = spotBookings.filter(b => b.id !== req.params.id);
    res.json({ success: true });
});

// Initialize database tables for expenses
async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS expenses (
                id TEXT PRIMARY KEY,
                file_name TEXT NOT NULL,
                category TEXT NOT NULL,
                amount NUMERIC NOT NULL,
                date TEXT NOT NULL,
                vendor TEXT NOT NULL,
                address TEXT,
                invoice_number TEXT,
                confidence NUMERIC DEFAULT 100,
                status TEXT DEFAULT 'classified',
                ocr_text TEXT,
                image_url TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        `;
        console.log('[DB] expenses table checked/created.');

        await sql`
            CREATE TABLE IF NOT EXISTS pricing_models (
                id VARCHAR(100) PRIMARY KEY,
                name TEXT NOT NULL,
                people_count INTEGER NOT NULL,
                total_amount NUMERIC NOT NULL,
                custom_option TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        `;
        console.log('[DB] pricing_models table checked/created.');

        await sql`
            CREATE TABLE IF NOT EXISTS pilot_documents (
                id VARCHAR(100) PRIMARY KEY,
                pilot_email VARCHAR(255) NOT NULL,
                name TEXT NOT NULL,
                file_name TEXT NOT NULL,
                file_url TEXT NOT NULL,
                expiry TEXT NOT NULL,
                status TEXT DEFAULT 'valid',
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        `;
        console.log('[DB] pilot_documents table checked/created.');
    } catch (err) {
        console.error('[DB] Failed to initialize database:', err.message);
    }
}
initDB();

// Pilot Documents CRUD Routes
app.get('/api/pilot-documents', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ error: 'Email is required' });
        const rows = await sql`SELECT * FROM pilot_documents WHERE pilot_email = ${email} ORDER BY created_at DESC`;
        res.json(rows);
    } catch (err) {
        console.error('Failed to fetch pilot documents:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/pilot-documents', async (req, res) => {
    try {
        const { id, pilot_email, name, file_name, file_url, expiry, status } = req.body;
        const [row] = await sql`
            INSERT INTO pilot_documents (id, pilot_email, name, file_name, file_url, expiry, status)
            VALUES (${id}, ${pilot_email}, ${name}, ${file_name}, ${file_url}, ${expiry}, ${status || 'valid'})
            RETURNING *
        `;
        res.json(row);
    } catch (err) {
        console.error('Failed to create pilot document:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/pilot-documents/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await sql`DELETE FROM pilot_documents WHERE id = ${id}`;
        res.json({ success: true });
    } catch (err) {
        console.error('Failed to delete pilot document:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Expenses CRUD Routes
app.get('/api/expenses', async (req, res) => {
    try {
        const rows = await sql`SELECT * FROM expenses ORDER BY created_at DESC`;
        res.json(rows);
    } catch (err) {
        console.error('Failed to fetch expenses:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/expenses', async (req, res) => {
    try {
        const { id, file_name, category, amount, date, vendor, address, invoice_number, confidence, status, ocr_text, image_url } = req.body;
        const [row] = await sql`
            INSERT INTO expenses (id, file_name, category, amount, date, vendor, address, invoice_number, confidence, status, ocr_text, image_url)
            VALUES (${id}, ${file_name}, ${category}, ${amount}, ${date}, ${vendor}, ${address || null}, ${invoice_number || null}, ${confidence || 100}, ${status || 'classified'}, ${ocr_text || null}, ${image_url || null})
            RETURNING *
        `;
        res.json(row);
    } catch (err) {
        console.error('Failed to create expense:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/expenses/:id/verify', async (req, res) => {
    try {
        const { id } = req.params;
        const [row] = await sql`
            UPDATE expenses 
            SET status = 'verified' 
            WHERE id = ${id} 
            RETURNING *
        `;
        res.json({ success: true, expense: row });
    } catch (err) {
        console.error('Failed to verify expense:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Pricing Models CRUD Routes
app.get('/api/pricing-models', async (req, res) => {
    try {
        const rows = await sql`SELECT * FROM pricing_models ORDER BY created_at DESC`;
        res.json(rows);
    } catch (err) {
        console.error('Failed to fetch pricing models:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/pricing-models', async (req, res) => {
    try {
        const { id, name, people_count, total_amount, custom_option } = req.body;
        const [row] = await sql`
            INSERT INTO pricing_models (id, name, people_count, total_amount, custom_option)
            VALUES (${id}, ${name}, ${people_count}, ${total_amount}, ${custom_option || null})
            RETURNING *
        `;
        res.json(row);
    } catch (err) {
        console.error('Failed to create pricing model:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/pricing-models/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, people_count, total_amount, custom_option } = req.body;
        const [row] = await sql`
            UPDATE pricing_models
            SET name = ${name}, people_count = ${people_count}, total_amount = ${total_amount}, custom_option = ${custom_option || null}
            WHERE id = ${id}
            RETURNING *
        `;
        res.json(row);
    } catch (err) {
        console.error('Failed to update pricing model:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/pricing-models/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await sql`DELETE FROM pricing_models WHERE id = ${id}`;
        res.json({ success: true });
    } catch (err) {
        console.error('Failed to delete pricing model:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Telemetry endpoints
app.get('/api/engine_temp', (req, res) => {
    res.json({ temp: Math.floor(Math.random() * 20) + 80 }); // 80-100
});

app.get('/api/o2_level', (req, res) => {
    res.json({ level: (Math.random() * (0.9 - 0.1) + 0.1).toFixed(2) }); // 0.1-0.9
});

// Helper for ELM327
function sendOBDCommand(command) {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        let response = '';
        client.connect(EMULATOR_PORT, EMULATOR_HOST, () => client.write(command + '\r'));
        client.on('data', (data) => {
            response += data.toString();
            if (response.includes('>')) { client.destroy(); resolve(response.replace(/>/g, '').trim()); }
        });
        client.on('error', (err) => { client.destroy(); reject(err); });
        setTimeout(() => { client.destroy(); reject(new Error('Timeout')); }, 2000);
    });
}

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
