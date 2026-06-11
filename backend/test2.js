const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function check() {
    const owner_id = 'c81f3ea3-5e5e-4152-a120-55f89df40546';
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(owner_id);
    if (error) console.error('Error:', error);
    else console.log('User email:', data.user.email);
    process.exit(0);
}
check();
